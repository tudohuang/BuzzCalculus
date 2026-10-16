// Detail v2, English — batch 010. Translation of tools/content/detail/010.js (text only; claims live in the Chinese file).
module.exports = {
  "hd-001": {
    "spot": "$\\frac{1}{1-x}$ is the geometric series $\\sum x^n$, so every coefficient is $1$; and the question asks for a high-order derivative at $x=0$ — read it straight off the Taylor coefficient: $f^{(n)}(0)=n!\\,a_n$.",
    "why": "Differentiating seven times means tracking the coefficients of $(1-x)^{-k}$ all the way; reading the coefficient from the power series takes one line, and it also reveals the pattern $f^{(n)}(x)=\\frac{n!}{(1-x)^{n+1}}$.",
    "steps": [
      "Geometric series: $\\frac{1}{1-x}=1+x+x^2+x^3+\\cdots$ (for $|x|<1$), so the coefficient of $x^7$ is $a_7=1$.",
      "Taylor coefficients and derivatives: $a_n=\\frac{f^{(n)}(0)}{n!}$, so $f^{(n)}(0)=n!\\,a_n$. Check with $n=2$: $f''(0)=2!\\cdot 1=2$.",
      "You can also see the pattern: each derivative adds a factor and raises the power in the denominator by one, $f'=\\frac{1}{(1-x)^2}$, $f''=\\frac{2}{(1-x)^3}$, and in general $\\frac{n!}{(1-x)^{n+1}}$.",
      "So $f^{(7)}(0)=7!\\cdot 1=7\\cdot 6\\cdot 5\\cdot 4\\cdot 3\\cdot 2\\cdot 1=5040$."
    ],
    "trap": "Giving the coefficient $a_7=1$ as the answer. The coefficient is the derivative divided by $7!$; multiply back by $7!$ to get the derivative.",
    "check": "Check the pattern on a smaller case: $f'''(0)=3!=6$."
  },
  "hd-009": {
    "spot": "The whole $\\arcsin x$ is squared — outer function $u^2$, inner function $\\arcsin x$. A standard Chain Rule; the only thing to remember is $(\\arcsin x)'=\\frac{1}{\\sqrt{1-x^2}}$.",
    "why": "Differentiate the outside to get $2u$, multiply by the inner derivative, done in one step; no need to rewrite it first.",
    "steps": [
      "Let $u=\\arcsin x$; the derivative of the outer $u^2$ is $2u$.",
      "Inner: $\\frac{d}{dx}\\arcsin x=\\frac{1}{\\sqrt{1-x^2}}$ (checked at $x=0.5$).",
      "Multiply: $\\frac{d}{dx}(\\arcsin x)^2=2\\arcsin x\\cdot\\frac{1}{\\sqrt{1-x^2}}=\\frac{2\\arcsin x}{\\sqrt{1-x^2}}$."
    ],
    "trap": "Differentiating only the outside and writing $2\\arcsin x$, forgetting the inner factor $\\frac{1}{\\sqrt{1-x^2}}$; or misreading the function as $\\arcsin(x^2)$ and getting $\\frac{2x}{\\sqrt{1-x^4}}$.",
    "check": "$(\\arcsin x)^2\\ge 0$ has its minimum at $x=0$, so the derivative at $0$ should be $0$: plugging into the answer gives exactly $0$."
  },
  "int-036": {
    "spot": "The inner upper limit $1-y$ moves with $y$ — the region is the triangle $x,y\\ge 0$, $x+y\\le 1$. Follow the given order: integrate in $x$ first, treating $y$ as a constant.",
    "why": "The order is already set up and the inner integrand is a polynomial in $x$, so integrating directly is fastest; switching the order works too, but there is no need.",
    "steps": [
      "Inner ($y$ fixed): $\\int_0^{1-y}x\\,dx=\\frac{(1-y)^2}{2}$.",
      "Outer: $\\frac{1}{2}\\int_0^1(1-y)^2\\,dy=\\frac{1}{2}\\cdot\\frac{1}{3}=\\frac{1}{6}$.",
      "So the double integral $=\\frac{1}{6}$."
    ],
    "trap": "Plugging in $1$ instead of the upper limit $1-y$ after the inner integral, which gives $\\frac{1}{2}$ — that is the integral over the square, not the triangle.",
    "check": "Geometry: the triangle's area $\\frac{1}{2}$ times the centroid's $x$-coordinate $\\frac{1}{3}$ is exactly $\\frac{1}{6}$."
  },
  "int-039": {
    "spot": "The integrand $\\frac{1}{1+x^2}$ is exactly the derivative of $\\arctan x$ — $1+x^2$ in the denominator with a constant numerator means arctangent.",
    "why": "Use the antiderivative directly and you are done in one step; no trigonometric substitution needed.",
    "steps": [
      "$\\frac{d}{dx}\\arctan x=\\frac{1}{1+x^2}$.",
      "Evaluate at the limits: $\\arctan 1-\\arctan 0=\\frac{\\pi}{4}-0$.",
      "So the integral $=\\frac{\\pi}{4}$."
    ],
    "trap": "Confusing it with $\\int\\frac{x}{1+x^2}\\,dx=\\frac{1}{2}\\ln(1+x^2)$ and getting $\\frac{\\ln 2}{2}$. With no $x$ in the numerator, it is not a logarithm.",
    "check": "On $[0,1]$ the integrand lies between $\\frac{1}{2}$ and $1$, so the integral must be in $(\\frac{1}{2},1)$; $\\frac{\\pi}{4}\\approx 0.785$ fits."
  },
  "mob-beta-001": {
    "spot": "$B(1,1)$: both parameters are $1$, so both powers in the definition $\\int_0^1 t^{a-1}(1-t)^{b-1}\\,dt$ become $0$ and the integrand is the constant $1$.",
    "why": "With small integer parameters, going back to the defining integral is fastest; the $\\Gamma$ formula is just $\\frac{0!\\,0!}{1!}$.",
    "steps": [
      "Definition: $B(a,b)=\\int_0^1 t^{a-1}(1-t)^{b-1}\\,dt$; when $a=b=1$ both powers are $0$.",
      "So $B(1,1)=\\int_0^1 1\\,dt=1$.",
      "Compare with the formula $B(a,b)=\\frac{\\Gamma(a)\\Gamma(b)}{\\Gamma(a+b)}=\\frac{0!\\cdot 0!}{1!}=1$; the answer is $1$."
    ],
    "trap": "Writing the powers as $t^a(1-t)^b$ (forgetting to subtract one) gives $\\int_0^1 t(1-t)\\,dt=\\frac{1}{6}$.",
    "check": "$B(a,b)$ is symmetric and gets smaller as the parameters grow; $B(1,1)=1$ is the largest value in the whole integer table."
  },
  "mob-beta-002": {
    "spot": "$B(2,1)$: $a-1=1$, $b-1=0$, so the integrand is just $t$ — with small integer parameters, go back to the defining integral.",
    "why": "Integrating $\\int_0^1 t\\,dt$ directly is faster than looking up the $\\Gamma$ formula, and you cannot misremember $\\Gamma(n)=(n-1)!$.",
    "steps": [
      "Plug into the definition: $B(2,1)=\\int_0^1 t^{1}(1-t)^{0}\\,dt=\\int_0^1 t\\,dt$.",
      "$\\int_0^1 t\\,dt=\\frac{1}{2}$.",
      "Compare with the formula: $\\frac{\\Gamma(2)\\Gamma(1)}{\\Gamma(3)}=\\frac{1!\\cdot 0!}{2!}=\\frac{1}{2}$."
    ],
    "trap": "Treating $\\Gamma(n)$ as $n!$: $\\frac{2!\\cdot 1!}{3!}=\\frac{1}{3}$. The correct rule is $\\Gamma(n)=(n-1)!$.",
    "check": "In general $B(a,1)=\\int_0^1 t^{a-1}dt=\\frac{1}{a}$, and $a=2$ gives $\\frac{1}{2}$."
  },
  "mob-beta-003": {
    "spot": "$B(2,2)$: both powers are $1$, so the integrand is $t(1-t)$, a downward parabola — expand and integrate.",
    "why": "With small integer parameters, integrating the polynomial is the safest; the $\\Gamma$ formula $\\frac{1!\\,1!}{3!}$ is for checking.",
    "steps": [
      "Plug into the definition: $B(2,2)=\\int_0^1 t(1-t)\\,dt=\\int_0^1(t-t^2)\\,dt$.",
      "$\\frac{1}{2}-\\frac{1}{3}=\\frac{1}{6}$.",
      "Compare with the formula: $\\frac{\\Gamma(2)\\Gamma(2)}{\\Gamma(4)}=\\frac{1!\\cdot 1!}{3!}=\\frac{1}{6}$."
    ],
    "trap": "Not subtracting one from the powers and integrating $\\int_0^1 t^2(1-t)^2\\,dt=\\frac{1}{30}$ (that is $B(3,3)$).",
    "check": "$t(1-t)$ has maximum $\\frac{1}{4}$ on $[0,1]$, so the integral must be less than $\\frac{1}{4}$; $\\frac{1}{6}$ fits."
  },
  "mob-beta-004": {
    "spot": "$B(3,2)$: the powers give $t^2(1-t)^1$, which expands to just two terms — integrate directly for integer parameters, or use $\\frac{(a-1)!(b-1)!}{(a+b-1)!}$.",
    "why": "Expanding to $t^2-t^3$ integrates in one line; with the formula, watch the shift in $\\Gamma(n)=(n-1)!$.",
    "steps": [
      "Plug into the definition: $B(3,2)=\\int_0^1 t^2(1-t)\\,dt=\\int_0^1(t^2-t^3)\\,dt$.",
      "$\\frac{1}{3}-\\frac{1}{4}=\\frac{1}{12}$.",
      "Compare with the formula: $\\frac{\\Gamma(3)\\Gamma(2)}{\\Gamma(5)}=\\frac{2!\\cdot 1!}{4!}=\\frac{2}{24}=\\frac{1}{12}$."
    ],
    "trap": "Using $\\Gamma(n)=n!$: $\\frac{3!\\cdot 2!}{5!}=\\frac{1}{10}$. The error is the shift: $\\Gamma(3)=2!$, not $3!$.",
    "check": "Symmetry: $B(3,2)=B(2,3)=\\int_0^1 t(1-t)^2\\,dt$, which gives the same value."
  },
  "mob-beta-005": {
    "spot": "$B(\\frac{1}{2},\\frac{1}{2})=\\int_0^1\\frac{dt}{\\sqrt{t(1-t)}}$: the root contains $t(1-t)$, and substituting $t=\\sin^2\\theta$ removes it entirely.",
    "why": "Half-integer parameters leave no polynomial to expand; $t=\\sin^2\\theta$ makes $\\sqrt{t}\\sqrt{1-t}=\\sin\\theta\\cos\\theta$, which cancels exactly against $dt$.",
    "steps": [
      "Plug into the definition: $B(\\frac{1}{2},\\frac{1}{2})=\\int_0^1 t^{-1/2}(1-t)^{-1/2}\\,dt$; both endpoints are integrable singularities.",
      "Let $t=\\sin^2\\theta$: $dt=2\\sin\\theta\\cos\\theta\\,d\\theta$ and $\\sqrt{t(1-t)}=\\sin\\theta\\cos\\theta$, so the integrand becomes the constant $2$.",
      "$\\int_0^{\\pi/2}2\\,d\\theta=\\pi$.",
      "Compare with $\\frac{\\Gamma(\\frac{1}{2})^2}{\\Gamma(1)}=(\\sqrt{\\pi})^2=\\pi$; the answer is $\\pi$."
    ],
    "trap": "Seeing the integrand blow up at both ends and declaring divergence. The singularity of $t^{-1/2}$ is integrable (the power is greater than $-1$), so the integral is finite.",
    "check": "An antiderivative of $\\int_0^1\\frac{dt}{\\sqrt{t(1-t)}}$ is $2\\arcsin\\sqrt{t}$, and from $0$ to $1$ that gives $2\\cdot\\frac{\\pi}{2}=\\pi$."
  },
  "mob-beta-006": {
    "spot": "$B(\\frac{1}{2},1)$: $b=1$ makes $(1-t)^0=1$ disappear, leaving just $\\int_0^1 t^{-1/2}\\,dt$ — a power function.",
    "why": "When one parameter is $1$, $B(a,1)=\\frac{1}{a}$; just integrate the power, faster than computing $\\Gamma(\\frac{3}{2})$.",
    "steps": [
      "Plug into the definition: $B(\\frac{1}{2},1)=\\int_0^1 t^{-1/2}\\,dt$.",
      "Antiderivative $2\\sqrt{t}$; from $0$ to $1$ this gives $2$ (the singularity at $t=0$ is integrable).",
      "Compare with $\\frac{\\Gamma(\\frac{1}{2})\\Gamma(1)}{\\Gamma(\\frac{3}{2})}=\\frac{\\sqrt{\\pi}}{\\frac{1}{2}\\sqrt{\\pi}}=2$; the answer is $2$."
    ],
    "trap": "Misremembering $\\Gamma(\\frac{3}{2})$ as $\\sqrt{\\pi}$ (forgetting the factor $\\frac{1}{2}$) gives $1$.",
    "check": "General formula $B(a,1)=\\frac{1}{a}$: $a=\\frac{1}{2}$ gives $2$."
  },
  "mob-beta-007": {
    "spot": "$B(\\frac{3}{2},\\frac{1}{2})=\\int_0^1\\sqrt{\\frac{t}{1-t}}\\,dt$: half-integer parameters with $t$ and $1-t$ under a root — substitute $t=\\sin^2\\theta$ to turn it into a Wallis-type integral.",
    "why": "After the substitution the integrand is $2\\sin^2\\theta$, cleaner than wrestling with the root; or use $\\Gamma(\\frac{3}{2})=\\frac{1}{2}\\sqrt{\\pi}$ in the formula directly.",
    "steps": [
      "Plug into the definition: $\\int_0^1 t^{1/2}(1-t)^{-1/2}\\,dt$.",
      "Let $t=\\sin^2\\theta$: $\\sqrt{\\frac{t}{1-t}}=\\tan\\theta$ and $dt=2\\sin\\theta\\cos\\theta\\,d\\theta$; their product is $2\\sin^2\\theta\\,d\\theta$.",
      "$\\int_0^{\\pi/2}2\\sin^2\\theta\\,d\\theta=2\\cdot\\frac{\\pi}{4}=\\frac{\\pi}{2}$.",
      "Compare with $\\frac{\\Gamma(\\frac{3}{2})\\Gamma(\\frac{1}{2})}{\\Gamma(2)}=\\frac{\\frac{1}{2}\\sqrt{\\pi}\\cdot\\sqrt{\\pi}}{1}=\\frac{\\pi}{2}$."
    ],
    "trap": "Taking $\\Gamma(2)$ to be $2$ (thinking $\\Gamma(n)=n!$) gives $\\frac{\\pi}{4}$. Actually $\\Gamma(2)=1!=1$.",
    "check": "Symmetry: $B(\\frac{3}{2},\\frac{1}{2})+B(\\frac{1}{2},\\frac{3}{2})=B(\\frac{1}{2},\\frac{1}{2})=\\pi$, and the two are equal, so each is $\\frac{\\pi}{2}$."
  },
  "mob-beta-009": {
    "spot": "$B(3,3)$: integrand $t^2(1-t)^2$, equal integer parameters — expand and integrate, or use $\\frac{2!\\,2!}{5!}$.",
    "why": "The formula gives it in one line; expanding $t^2-2t^3+t^4$ is only three terms, so the two can check each other.",
    "steps": [
      "Plug into the definition: $B(3,3)=\\int_0^1 t^2(1-t)^2\\,dt=\\int_0^1(t^2-2t^3+t^4)\\,dt$.",
      "$\\frac{1}{3}-\\frac{2}{4}+\\frac{1}{5}=\\frac{10-15+6}{30}=\\frac{1}{30}$.",
      "Compare with the formula: $\\frac{\\Gamma(3)\\Gamma(3)}{\\Gamma(6)}=\\frac{2!\\cdot 2!}{5!}=\\frac{4}{120}=\\frac{1}{30}$."
    ],
    "trap": "Using $\\Gamma(n)=n!$: $\\frac{3!\\cdot 3!}{6!}=\\frac{1}{20}$.",
    "check": "The integrand is largest at $t=\\frac{1}{2}$, where it equals $\\frac{1}{16}$; the integral must be less than $\\frac{1}{16}$, and $\\frac{1}{30}$ fits."
  },
  "mob-nabla-002": {
    "spot": "Only the $z$-component of the curl is asked, and the field's third component is $0$ with no $z$-dependence — just compute the 2D expression $\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}$.",
    "why": "No need to expand the full 3x3 determinant; the $z$-component is exactly the planar formula.",
    "steps": [
      "$P=y$, $Q=-x$; $(\\nabla\\times\\mathbf F)_z=\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}$.",
      "$\\frac{\\partial Q}{\\partial x}=-1$, $\\frac{\\partial P}{\\partial y}=1$.",
      "Subtract: $-1-1=-2$."
    ],
    "trap": "Reversing the order to $\\frac{\\partial P}{\\partial y}-\\frac{\\partial Q}{\\partial x}$ and getting $2$. Mnemonic: the $z$-component is \"$x$-derivative of $Q$ minus $y$-derivative of $P$\".",
    "check": "This field rotates clockwise; its circulation once counterclockwise around the unit circle is $-2\\pi$, which equals the curl $-2$ times the area $\\pi$ (Green's Theorem)."
  },
  "mob-nabla-009": {
    "spot": "Zero curl is the fingerprint of a gradient field: the curl of any $\\nabla\\varphi$ is a difference of mixed partials, which is automatically zero.",
    "why": "Conversely, on a simply connected region zero curl guarantees path-independent line integrals and the existence of a potential — so \"usually\" signals a conservative field, with an exception to watch for when the region has a hole.",
    "steps": [
      "If $\\mathbf F=\\nabla\\varphi$, the curl components are differences like $\\varphi_{yx}-\\varphi_{xy}$, which are $0$ because mixed partials are equal. Check with $\\varphi=x^2y$.",
      "Conversely: for $\\mathbf F=\\langle y,x\\rangle$, $\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}=1-1=0$, and indeed there is a potential $\\varphi=xy$.",
      "Exception: $\\mathbf F=\\frac{\\langle -y,x\\rangle}{x^2+y^2}$ has a hole at the origin; its curl is also $0$, yet it is not conservative — that is why the question says \"usually\".",
      "Answer: zero curl usually means $\\mathbf F$ is conservative (enter conservative)."
    ],
    "trap": "Thinking zero curl always means conservative. The field with a hole above has line integral $2\\pi\\ne 0$ once around the unit circle, so the simply connected condition cannot be dropped.",
    "check": "Line integral of the field with a hole around the unit circle: after parametrizing, the integrand is identically $1$, so one loop gives $2\\pi$, not $0$."
  },
  "mob-wallis-003": {
    "spot": "$\\int_0^{\\pi/2}\\sin^4 x\\,dx$: from $0$ to $\\frac{\\pi}{2}$, an even power of a single $\\sin$ — the standard Wallis form; even powers end with a factor of $\\frac{\\pi}{2}$.",
    "why": "The reduction formula $I_n=\\frac{n-1}{n}I_{n-2}$ gets to the bottom in two steps; expanding $\\sin^4$ with double-angle formulas also works but takes two rounds.",
    "steps": [
      "Reduce: $I_4=\\frac{3}{4}I_2$.",
      "$I_2=\\frac{1}{2}I_0=\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{4}$.",
      "$I_4=\\frac{3}{4}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{3\\pi}{16}$."
    ],
    "trap": "Using the odd-power version (ending with a factor of $1$ instead of $\\frac{\\pi}{2}$) gives $\\frac{3}{8}$. Even powers always carry a $\\pi$.",
    "check": "$0\\le\\sin^4 x\\le\\sin^2 x$, so $I_4<I_2=\\frac{\\pi}{4}$; $\\frac{3\\pi}{16}\\approx 0.589$ fits."
  },
  "mob-wallis-004": {
    "spot": "$\\sin^5 x$ is an odd power: split off one $\\sin x$ to go with $dx$, and the rest is $\\sin^4 x=(1-\\cos^2 x)^2$ — substitute $u=\\cos x$ to get a polynomial.",
    "why": "For odd powers, substitution turns it directly into a polynomial, which is harder to get wrong than memorized Wallis coefficients; the two routes check each other.",
    "steps": [
      "Wallis, odd version: $I_5=\\frac{4}{5}\\cdot\\frac{2}{3}\\cdot 1$.",
      "Check by substitution: let $u=\\cos x$, so $\\sin x\\,dx=-du$, and $x:0\\to\\frac{\\pi}{2}$ corresponds to $u:1\\to 0$; the integral becomes $\\int_0^1(1-u^2)^2\\,du$.",
      "$\\int_0^1(1-2u^2+u^4)\\,du=1-\\frac{2}{3}+\\frac{1}{5}=\\frac{8}{15}$.",
      "So the integral $=\\frac{8}{15}$."
    ],
    "trap": "Multiplying by $\\frac{\\pi}{2}$ for an odd power too, giving $\\frac{4\\pi}{15}$. Odd powers give a rational number.",
    "check": "$\\sin^5 x\\le\\sin^3 x$, so the answer must be less than $\\frac{2}{3}$; $\\frac{8}{15}\\approx 0.533$."
  },
  "mob-wallis-010": {
    "spot": "$\\sin x\\cos x$: one is the derivative of the other — let $u=\\sin x$, $du=\\cos x\\,dx$, and it becomes $\\int u\\,du$.",
    "why": "The substitution finishes it in one step; the double-angle form $\\frac{1}{2}\\sin 2x$ works too, but the extra coefficient is easy to drop.",
    "steps": [
      "Let $u=\\sin x$: $du=\\cos x\\,dx$, and $x:0\\to\\frac{\\pi}{2}$ corresponds to $u:0\\to 1$.",
      "$\\int_0^1 u\\,du=\\frac{1}{2}$.",
      "So the integral $=\\frac{1}{2}$."
    ],
    "trap": "Dropping the $\\frac{1}{2}$ when rewriting as $\\sin 2x$: $\\int_0^{\\pi/2}\\sin 2x\\,dx=1$, which doubles the answer.",
    "check": "Double-angle route: $\\frac{1}{2}\\int_0^{\\pi/2}\\sin 2x\\,dx=\\frac{1}{2}\\cdot 1$, which agrees."
  },
  "ode-val-002": {
    "spot": "$y'=-2xy$: the right side is \"a function of $x$ times $y$\" — separable, $\\frac{dy}{y}=-2x\\,dx$.",
    "why": "After separating, both sides integrate directly, one step shorter than treating it as a first-order linear equation with an integrating factor.",
    "steps": [
      "Separate: $\\frac{dy}{y}=-2x\\,dx$, and integrate both sides from the start to $x=1$: $\\ln y(1)-\\ln y(0)=\\int_0^1(-2x)\\,dx=-1$.",
      "General solution $y=Ce^{-x^2}$; $y(0)=1$ gives $C=1$. Check that it satisfies the equation: $(e^{-x^2})'=-2x\\,e^{-x^2}$.",
      "$y(1)=e^{-1}=\\frac{1}{e}$."
    ],
    "trap": "Missing the $y$ on the right and integrating $y'=-2x$ directly, getting $y=1-x^2$ and $y(1)=0$. If $y$ appears on the right, separate first.",
    "check": "For $x>0$, $y'=-2xy<0$, so $y$ decreases from $1$; $y(1)$ must lie between $0$ and $1$."
  },
  "putnam-001": {
    "spot": "The argument of $\\arctan$ is $\\frac{1}{n^2+n+1}$, and $n^2+n+1=1+n(n+1)$ — exactly the difference formula $\\arctan a-\\arctan b=\\arctan\\frac{a-b}{1+ab}$ with $a=n+1$, $b=n$, so it telescopes.",
    "why": "No comparison test will give the value of the series; once you recognize the difference form, the partial sum keeps only the first and last terms.",
    "steps": [
      "Difference formula: $\\arctan(n+1)-\\arctan n=\\arctan\\frac{1}{1+n(n+1)}=\\arctan\\frac{1}{n^2+n+1}$.",
      "The partial sum telescopes: $S_N=\\arctan(N+1)-\\arctan 1$.",
      "As $N\\to\\infty$: $\\arctan(N+1)\\to\\frac{\\pi}{2}$, so the sum $=\\frac{\\pi}{2}-\\frac{\\pi}{4}=\\frac{\\pi}{4}$.",
      "Answer: $\\frac{\\pi}{4}$."
    ],
    "trap": "After telescoping, keeping only the tail $\\frac{\\pi}{2}$ and forgetting to subtract the first term $\\arctan 1=\\frac{\\pi}{4}$, answering $\\frac{\\pi}{2}$.",
    "check": "The first three terms $\\arctan\\frac{1}{3}+\\arctan\\frac{1}{7}+\\arctan\\frac{1}{13}\\approx 0.540$ are already about two thirds of the total, and the later terms keep shrinking, so converging to $\\frac{\\pi}{4}\\approx 0.785$ is reasonable."
  },
  "putnam-004": {
    "spot": "The interval $[-1,1]$ is symmetric, and $\\frac{1}{1+e^x}$ plus its mirror image $\\frac{1}{1+e^{-x}}$ is exactly $1$ — the signal to \"add back the $x\\to -x$ copy\".",
    "why": "$\\frac{1}{(1+e^x)(1+x^2)}$ has no elementary antiderivative; after the symmetric addition only $\\frac{1}{1+x^2}$ is left, which integrates in one line.",
    "steps": [
      "Key identity: $\\frac{1}{1+e^x}+\\frac{1}{1+e^{-x}}=\\frac{1}{1+e^x}+\\frac{e^x}{e^x+1}=1$.",
      "Let $x=-t$: $I=\\int_{-1}^{1}\\frac{dt}{(1+e^{-t})(1+t^2)}=\\int_{-1}^{1}\\frac{e^x\\,dx}{(1+e^x)(1+x^2)}$ (the interval is symmetric and $1+x^2$ is even).",
      "Add the two forms: $2I=\\int_{-1}^{1}\\frac{dx}{1+x^2}=2\\arctan 1=\\frac{\\pi}{2}$.",
      "So $I=\\frac{\\pi}{4}$."
    ],
    "trap": "Assuming the integrand is even, writing it as $2\\int_0^1$ and grinding; $\\frac{1}{1+e^x}$ is not even, so this gets stuck or goes wrong.",
    "check": "After adding, $2I$ is $\\frac{\\pi}{2}$ and $I$ is exactly half — as if $\\frac{1}{1+e^x}$ were replaced by its average $\\frac{1}{2}$."
  },
  "rel-adv-014": {
    "spot": "The square $[0,1]^2$ with a polynomial integrand like $(x+y)^2$ — expand into three terms; each is \"a function of $x$ times a function of $y$\", so integrate separately and multiply.",
    "why": "After expanding, each term separates, which is less writing than integrating in $y$ to get $\\frac{(x+1)^3-x^3}{3}$ and then integrating again.",
    "steps": [
      "Expand: $(x+y)^2=x^2+2xy+y^2$.",
      "Term by term: $\\iint x^2=\\frac{1}{3}$, $\\iint 2xy=2\\cdot\\frac{1}{2}\\cdot\\frac{1}{2}=\\frac{1}{2}$, $\\iint y^2=\\frac{1}{3}$.",
      "Add: $\\frac{1}{3}+\\frac{1}{2}+\\frac{1}{3}=\\frac{7}{6}$.",
      "So the double integral $=\\frac{7}{6}$."
    ],
    "trap": "Dropping the cross term $2xy$ when expanding (treating $(x+y)^2$ as $x^2+y^2$) gives $\\frac{2}{3}$.",
    "check": "Integrating in $y$ first: $\\frac{(x+1)^3-x^3}{3}$, then in $x$ gives $\\frac{1}{3}\\cdot\\frac{2^4-2}{4}=\\frac{7}{6}$, which agrees."
  },
  "rel-adv-015": {
    "spot": "The general term is \"something to the $n$-th power\", $\\left(\\frac{n}{3n+1}\\right)^n$ — Root Test; taking the $n$-th root strips the exponent.",
    "why": "The Ratio Test would mean dividing $\\left(\\frac{n+1}{3n+4}\\right)^{n+1}$ by the original term, which is messy; the root leaves just $\\frac{n}{3n+1}$ in one step.",
    "steps": [
      "$\\sqrt[n]{a_n}=\\frac{n}{3n+1}\\to\\frac{1}{3}$.",
      "$\\frac{1}{3}<1$, so the Root Test says it converges. You can also compare directly: $\\frac{n}{3n+1}<\\frac{1}{3}$, so $a_n<\\left(\\frac{1}{3}\\right)^n$.",
      "So the series converges (with sum less than $\\frac{1}{2}$). Answer: converges."
    ],
    "trap": "Seeing the base $\\frac{n}{3n+1}$ tend to $\\frac{1}{3}$ and reaching for the \"terms don't go to zero\" test — in fact $a_n\\to 0$, and that test can only show divergence, never convergence.",
    "check": "The first term is $\\frac{1}{4}$, the second $\\left(\\frac{2}{7}\\right)^2\\approx 0.082$ — the terms fall as fast as $\\left(\\frac{1}{3}\\right)^n$."
  },
  "rel-boss-004": {
    "spot": "The shape $\\int_0^\\infty x^{s}e^{-x}\\,dx$ is $\\Gamma(s+1)$; here $s=\\frac{5}{2}$ is a half-integer — recurse down to $\\Gamma(\\frac{1}{2})=\\sqrt{\\pi}$.",
    "why": "Each integration by parts lowers the power by $1$ and pulls out a coefficient, which is exactly $\\Gamma(s+1)=s\\,\\Gamma(s)$; there is no elementary antiderivative to integrate directly.",
    "steps": [
      "Integration by parts ($u=x^{5/2}$, $dv=e^{-x}dx$, boundary term $0$): $\\int_0^\\infty x^{5/2}e^{-x}dx=\\frac{5}{2}\\int_0^\\infty x^{3/2}e^{-x}dx$.",
      "Twice more: $\\int x^{3/2}e^{-x}=\\frac{3}{2}\\int x^{1/2}e^{-x}$, $\\int x^{1/2}e^{-x}=\\frac{1}{2}\\int x^{-1/2}e^{-x}$.",
      "Base case: let $x=u^2$; $\\int_0^\\infty x^{-1/2}e^{-x}dx=2\\int_0^\\infty e^{-u^2}du=\\sqrt{\\pi}$.",
      "Multiply: $\\frac{5}{2}\\cdot\\frac{3}{2}\\cdot\\frac{1}{2}\\sqrt{\\pi}=\\frac{15\\sqrt{\\pi}}{8}$."
    ],
    "trap": "Treating it as $\\Gamma(\\frac{5}{2})$ (forgetting the exponent shifts by one) gives $\\frac{3\\sqrt{\\pi}}{4}$. $x^{s}$ corresponds to $\\Gamma(s+1)$.",
    "check": "$\\Gamma(3)=2\\le\\Gamma(\\frac{7}{2})\\le\\Gamma(4)=6$, and $\\frac{15\\sqrt{\\pi}}{8}\\approx 3.32$ sits in between."
  },
  "rel-boss-011": {
    "spot": "The region is the simplex $x+y+z\\le 1$ and the integrand is the monomial $xyz$ — integrate layer by layer from the inside out; each layer gives a Beta-type integral with $(1-\\cdots)^k$. Or apply the Dirichlet formula $\\frac{1!\\,1!\\,1!}{6!}$ directly.",
    "why": "Layer-by-layer integration is a polynomial at every step, so it is safe; the Dirichlet formula is fastest and serves as a check.",
    "steps": [
      "Innermost in $z$ (from $0$ to $1-x-y$): $xy\\cdot\\frac{(1-x-y)^2}{2}$.",
      "In $y$ (from $0$ to $1-x$): $\\int_0^{1-x}y(1-x-y)^2dy=\\frac{(1-x)^4}{12}$, so this layer gives $\\frac{x(1-x)^4}{24}$.",
      "In $x$: $\\frac{1}{24}\\int_0^1 x(1-x)^4dx=\\frac{1}{24}\\cdot\\frac{1}{30}=\\frac{1}{720}$.",
      "Compare with Dirichlet: $\\frac{1!\\cdot 1!\\cdot 1!}{(1+1+1+3)!}=\\frac{1}{720}$."
    ],
    "trap": "Writing every inner upper limit as $1$ (integrating over the unit cube) gives $\\frac{1}{8}$. On a simplex the upper limits shrink with the outer variables.",
    "check": "Size: the simplex has volume $\\frac{1}{6}$ and $xyz$ is at most $\\frac{1}{27}$ inside it, so the answer must be well below $\\frac{1}{162}$; $\\frac{1}{720}$ fits."
  },
  "rel-boss-019": {
    "spot": "$\\ln(n+1)-\\ln n=\\ln\\left(1+\\frac{1}{n}\\right)\\to 0$, multiplied by $n\\to\\infty$ — an $\\infty\\cdot 0$ form; combine the logs and let $t=\\frac{1}{n}$ to get $\\frac{\\ln(1+t)}{t}$.",
    "why": "With $t\\to 0$ it is the most basic limit $\\frac{\\ln(1+t)}{t}\\to 1$, no L'Hôpital's Rule needed.",
    "steps": [
      "Combine: $n(\\ln(n+1)-\\ln n)=n\\ln\\left(1+\\frac{1}{n}\\right)$.",
      "Let $t=\\frac{1}{n}\\to 0^+$: the expression becomes $\\frac{\\ln(1+t)}{t}\\to 1$.",
      "So the limit $=1$."
    ],
    "trap": "Seeing $\\ln(n+1)-\\ln n\\to 0$ and saying the whole thing goes to $0$. The factor $n$ in front amplifies it; an $\\infty\\cdot 0$ form must be rearranged before you can tell.",
    "check": "Equivalently $\\ln\\left(1+\\frac{1}{n}\\right)^n\\to\\ln e=1$; at $n=100$ it is already $0.995$."
  },
  "rel-hard-der-003": {
    "spot": "$\\ln(x^2+y^2)$ is harmonic ($f_{xx}+f_{yy}=0$), so the Hessian's two diagonal entries are negatives of each other and the determinant must be $\\le 0$ — you only need $f_{xx}$ and $f_{xy}$.",
    "why": "Compute the first partials and differentiate again; the Quotient Rule evaluates cleanly at $(1,0)$. Knowing it is harmonic saves one computation and predicts the sign.",
    "steps": [
      "First order: $f_x=\\frac{2x}{x^2+y^2}$, $f_y=\\frac{2y}{x^2+y^2}$.",
      "$f_{xx}=\\frac{2(y^2-x^2)}{(x^2+y^2)^2}$, which equals $-2$ at $(1,0)$.",
      "$f_{yy}=\\frac{2(x^2-y^2)}{(x^2+y^2)^2}$, which equals $2$ at $(1,0)$ (exactly $-f_{xx}$); $f_{xy}=\\frac{-4xy}{(x^2+y^2)^2}$, which is $0$ at $(1,0)$.",
      "$\\det H=f_{xx}f_{yy}-f_{xy}^2=(-2)(2)-0=-4$."
    ],
    "trap": "When differentiating $f_x=\\frac{2x}{x^2+y^2}$ in $x$, differentiating only the numerator to get $f_{xx}=\\frac{2}{x^2+y^2}=2$, then pairing it with $f_{yy}=2$ to get $4$. The denominator has $x$ too; use the Quotient Rule.",
    "check": "Harmonic: $f_{xx}+f_{yy}=0$ everywhere, so $\\det H=-f_{xx}^2-f_{xy}^2\\le 0$; a negative answer makes sense."
  },
  "rel-hard-der-008": {
    "spot": "Divergence means \"each component differentiated in its own variable\", then added: for $\\langle xy,yz,zx\\rangle$, the first component in $x$, the second in $y$, the third in $z$.",
    "why": "Divergence is a scalar: three partial derivatives, one line each, then plug in the point.",
    "steps": [
      "$\\frac{\\partial}{\\partial x}(xy)=y$, $\\frac{\\partial}{\\partial y}(yz)=z$, $\\frac{\\partial}{\\partial z}(zx)=x$.",
      "So $\\nabla\\cdot\\mathbf F=x+y+z$.",
      "Plug in $(1,2,3)$: $1+2+3=6$."
    ],
    "trap": "Writing the divergence as the vector $\\langle y,z,x\\rangle=\\langle 2,3,1\\rangle$ without adding, or confusing it with the curl. Divergence is a number.",
    "check": "The three components of this field are cyclically symmetric, so the divergence $x+y+z$ should be too — and it is."
  },
  "rel-hard-int-005": {
    "spot": "$\\int_0^{\\pi/2}\\sin^8 x\\,dx$: an even power of a single $\\sin$ on $[0,\\frac{\\pi}{2}]$ — Wallis formula, with coefficients $\\frac{7}{8}\\cdot\\frac{5}{6}\\cdot\\frac{3}{4}\\cdot\\frac{1}{2}$ times $\\frac{\\pi}{2}$.",
    "why": "Expanding the eighth power with double-angle formulas takes three rounds; the reduction formula $I_n=\\frac{n-1}{n}I_{n-2}$ reaches the bottom in four steps.",
    "steps": [
      "Reduce: $I_8=\\frac{7}{8}I_6$, $I_6=\\frac{5}{6}I_4$.",
      "$I_4=\\frac{3}{4}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{3\\pi}{16}$.",
      "$I_8=\\frac{7}{8}\\cdot\\frac{5}{6}\\cdot\\frac{3\\pi}{16}=\\frac{105\\pi}{768}=\\frac{35\\pi}{256}$.",
      "So the integral $=\\frac{35\\pi}{256}$."
    ],
    "trap": "Writing the coefficients upside down like $\\frac{8}{7}$, or forgetting the final $\\frac{\\pi}{2}$ (giving $\\frac{35}{128}$).",
    "check": "$\\frac{35\\pi}{256}\\approx 0.429$, smaller than $I_4\\approx 0.589$ (higher powers give smaller values), which makes sense."
  },
  "rel-hard-lim-006": {
    "spot": "Numerator and denominator are both homogeneous of degree four ($x^2y^2$ over $(x^2+y^2)^2$); along a line $y=mx$ the $x$ cancels completely, leaving a number that depends on $m$ — usually a sign the limit does not exist.",
    "why": "To show a limit does not exist, two paths with different values are enough; for homogeneous expressions, the family of lines is the easiest choice.",
    "steps": [
      "Along $y=0$ (the $x$-axis): the function is identically $0$, so the limit is $0$.",
      "Along $y=x$: $\\frac{x^4}{(2x^2)^2}=\\frac{1}{4}$, so the limit is $\\frac{1}{4}$.",
      "In general along $y=mx$: the value is $\\frac{m^2}{(1+m^2)^2}$, which changes with the slope (e.g. $m=2$ gives $\\frac{4}{25}$).",
      "Two paths give $0$ and $\\frac{1}{4}$, which differ, so the limit does not exist."
    ],
    "trap": "Trying only the two coordinate axes (both give $0$) and concluding the limit is $0$. Agreement on the axes does not mean agreement on all paths; a diagonal line gives it away.",
    "check": "Polar coordinates: the function $=\\cos^2\\theta\\sin^2\\theta=\\frac{\\sin^2 2\\theta}{4}$, with no $r$ at all — it depends only on direction, so it cannot settle to a single value near the origin."
  },
  "rel-hard-ser-010": {
    "spot": "General term $\\frac{n^n}{n!}$: the numerator is $n$ copies of $n$, the denominator is $n,n-1,\\dots,1$, and factor by factor the numerator is never smaller — the terms do not even go to $0$.",
    "why": "The $n$-th term test settles it in one sentence; the Ratio Test works too (ratio $\\to e>1$) and serves as a cross-check.",
    "steps": [
      "Compare factor by factor: $\\frac{n^n}{n!}=\\frac{n}{n}\\cdot\\frac{n}{n-1}\\cdots\\frac{n}{1}\\ge 1$. For example $n=4$: $\\frac{256}{24}>1$.",
      "So $a_n\\not\\to 0$, and the series diverges by the $n$-th term test.",
      "Ratio Test cross-check: $\\frac{a_{n+1}}{a_n}=\\left(1+\\frac{1}{n}\\right)^n\\to e>1$, so the terms actually grow exponentially.",
      "Answer: diverges."
    ],
    "trap": "Seeing a factorial in the denominator and assuming \"factorials grow fastest\", so it converges. $n^n$ grows faster than $n!$; the ratio tends to $e$.",
    "check": "The first few terms $1,2,4.5,10.67$ keep growing — they do not even approach $0$."
  },
  "tb-rev-002": {
    "spot": "The curve $y=\\frac{1}{x}$ rotated about the $x$-axis on $[1,3]$ — disk method; each cross-section is a circle of radius $\\frac{1}{x}$ with area $\\frac{\\pi}{x^2}$.",
    "why": "The axis of rotation runs along the integration variable, so the disk method writes itself; shells would require solving for $x$ as a function of $y$, which is more work.",
    "steps": [
      "Cross-sectional area $\\pi y^2=\\frac{\\pi}{x^2}$, so $V=\\pi\\int_1^3 x^{-2}\\,dx$.",
      "Antiderivative $-\\frac{1}{x}$: $\\left[-\\frac{1}{x}\\right]_1^3=-\\frac{1}{3}+1=\\frac{2}{3}$.",
      "$V=\\frac{2\\pi}{3}$."
    ],
    "trap": "Forgetting to square in the cross-sectional area, writing $\\pi\\int_1^3\\frac{1}{x}\\,dx=\\pi\\ln 3$. A disk has area $\\pi r^2$.",
    "check": "The enclosing cylinder (radius $1$, length $2$) has volume $2\\pi$, and the answer must be smaller; $\\frac{2\\pi}{3}$ fits."
  },
  "uni-der-002": {
    "spot": "Both the base $\\sin x$ and the exponent $x$ contain the variable — a variable-power function; neither the Power Rule nor the exponential rule applies, so take a logarithm first.",
    "why": "Once written as $e^{x\\ln\\sin x}$, it is an ordinary Chain Rule plus Product Rule.",
    "steps": [
      "Rewrite: $(\\sin x)^x=e^{x\\ln\\sin x}$.",
      "Differentiate the exponent (Product Rule): $(x\\ln\\sin x)'=\\ln\\sin x+x\\cdot\\frac{\\cos x}{\\sin x}=\\ln\\sin x+x\\cot x$.",
      "Multiply back by the original function: $\\frac{d}{dx}(\\sin x)^x=(\\sin x)^x(\\ln\\sin x+x\\cot x)$."
    ],
    "trap": "Treating it as a power function and writing $x(\\sin x)^{x-1}\\cos x$ — that only captures the \"base varies\" half and misses $(\\sin x)^x\\ln\\sin x$.",
    "check": "At $x=\\frac{\\pi}{2}$: $\\sin x=1$, $\\cot x=0$, $\\ln 1=0$, so the derivative should be $0$."
  },
  "uni-der-003": {
    "spot": "Third derivative of $e^{2x}\\sin x$ at $0$ — both factors have very regular higher derivatives, so use the Leibniz formula $\\sum\\binom{3}{k}(e^{2x})^{(3-k)}(\\sin x)^{(k)}$ and plug in $x=0$ directly.",
    "why": "Differentiating the product three times by brute force gets longer and messier; in the Leibniz formula at $x=0$ half the terms ($\\sin 0$, $-\\sin 0$) are zero.",
    "steps": [
      "At $0$: $(e^{2x})^{(j)}=2^j$; the derivatives of $\\sin x$ of order $0,1,2,3$ are $0,1,0,-1$.",
      "Leibniz: $\\binom{3}{1}\\cdot 2^2\\cdot 1+\\binom{3}{3}\\cdot 2^0\\cdot(-1)=12-1$ (the $k=0,2$ terms are $0$).",
      "You can also view it as the imaginary part of $e^{(2+i)x}$: $(2+i)^3=2+11i$, imaginary part $11$. Computing real and imaginary parts separately: $\\mathrm{Im}=3\\cdot 2^2-1$.",
      "So the third derivative at $0$ is $11$."
    ],
    "trap": "Forgetting the binomial coefficient $\\binom{3}{1}=3$, getting $4-1=3$.",
    "check": "The second derivative is $3e^{2x}\\sin x+4e^{2x}\\cos x$; differentiating once more and evaluating at $0$ gives $3+8=11$."
  },
  "uni-der-005": {
    "spot": "$\\ln\\left(x+\\sqrt{1+x^2}\\right)$ is the inverse hyperbolic sine $\\sinh^{-1}x$, whose derivative is the clean $\\frac{1}{\\sqrt{1+x^2}}$ — once you recognize it, the second derivative is just one more power-function derivative.",
    "why": "Differentiating the $\\ln(\\cdots)$ directly also simplifies to $\\frac{1}{\\sqrt{1+x^2}}$, but knowing the result in advance saves a lot of common-denominator work.",
    "steps": [
      "First: $\\frac{1+\\frac{x}{\\sqrt{1+x^2}}}{x+\\sqrt{1+x^2}}=\\frac{1}{\\sqrt{1+x^2}}$.",
      "Second: $\\left((1+x^2)^{-1/2}\\right)'=-\\frac{1}{2}(1+x^2)^{-3/2}\\cdot 2x=-\\frac{x}{(1+x^2)^{3/2}}$.",
      "So the answer is $-\\frac{x}{(1+x^2)^{3/2}}$."
    ],
    "trap": "In the first derivative, differentiating only the outside and writing $\\frac{1}{x+\\sqrt{1+x^2}}$, forgetting to multiply by the inner derivative $1+\\frac{x}{\\sqrt{1+x^2}}$ — everything after that is wrong.",
    "check": "$\\sinh^{-1}x$ is odd, so its second derivative must also be odd: values at $x$ and $-x$ differ by a sign."
  },
  "uni-der-014": {
    "spot": "The direction $(\\frac{3}{5},\\frac{4}{5})$ is already a unit vector — the directional derivative is just the gradient dotted with it, no normalizing needed.",
    "why": "$e^{xy}$ is differentiable, so $\\nabla f\\cdot\\mathbf u$ is much faster than taking the limit from the definition.",
    "steps": [
      "$\\nabla f=\\langle ye^{xy},\\ xe^{xy}\\rangle$.",
      "At $(0,2)$: $\\nabla f=\\langle 2,0\\rangle$.",
      "Dot product: $2\\cdot\\frac{3}{5}+0\\cdot\\frac{4}{5}=\\frac{6}{5}$."
    ],
    "trap": "Swapping the gradient components ($\\langle xe^{xy},ye^{xy}\\rangle$), which at $(0,2)$ gives $\\langle 0,2\\rangle$ and a dot product of $\\frac{8}{5}$.",
    "check": "Walk along the line directly: $g(t)=f\\left(\\frac{3t}{5},\\,2+\\frac{4t}{5}\\right)$; $g'(0)$ is the directional derivative."
  },
  "uni-der-015": {
    "spot": "Divergence = first component in $x$, second in $y$, third in $z$, partial derivatives added; here each component is \"its own variable times the exponential of another variable\", and the exponential is a constant in the partial derivative.",
    "why": "One line of partial derivative per term, the exponential factor stays put, no Chain Rule at all.",
    "steps": [
      "$\\frac{\\partial}{\\partial x}(xe^y)=e^y$ ($e^y$ is constant with respect to $x$).",
      "$\\frac{\\partial}{\\partial y}(ye^z)=e^z$, $\\frac{\\partial}{\\partial z}(ze^x)=e^x$.",
      "Add: $\\nabla\\cdot\\mathbf F=e^x+e^y+e^z$."
    ],
    "trap": "Differentiating $xe^y$ in $y$ (wrong variable) and ending up with something like $xe^y+ye^z+ze^x$. Divergence is \"the $i$-th component in the $i$-th variable\".",
    "check": "The three components cycle $x\\to y\\to z\\to x$, and the answer $e^x+e^y+e^z$ is cyclically symmetric too — consistent."
  },
  "uni-int-003": {
    "spot": "$\\ln x$ times a power function $x^{-2}$ — integration by parts, with $\\ln x$ as $u$ (its derivative is $\\frac{1}{x}$, so the log disappears).",
    "why": "Integrating $\\ln x$ instead would be messier; in the LIATE order, logarithms come first for $u$.",
    "steps": [
      "Let $u=\\ln x$, $dv=x^{-2}dx$: $du=\\frac{dx}{x}$, $v=-\\frac{1}{x}$.",
      "$\\int\\frac{\\ln x}{x^2}dx=-\\frac{\\ln x}{x}+\\int\\frac{1}{x^2}dx=-\\frac{\\ln x}{x}-\\frac{1}{x}+C$.",
      "Simplify: $-\\frac{\\ln x+1}{x}+C$."
    ],
    "trap": "Mishandling the minus sign of $v=-\\frac{1}{x}$ inside $-\\int v\\,du$, getting $-\\frac{\\ln x}{x}+\\frac{1}{x}$; differentiating back gives an extra $-\\frac{2}{x^2}$.",
    "check": "Differentiate back: $\\left(-\\frac{\\ln x+1}{x}\\right)'=\\frac{\\ln x}{x^2}$, which equals $\\frac{1}{e^2}$ at $x=e$."
  },
  "uni-int-010": {
    "spot": "$e^x$ times $\\cos x$: neither gets simpler when differentiated, so integrating by parts twice loops back to the original integral — solve it like an equation.",
    "why": "After two rounds of parts the original integral $I$ appears on both sides; move it over and solve. Using complex $e^{(1+i)x}$ works too, but the real method is safest on an exam.",
    "steps": [
      "First round ($u=e^x$, $dv=\\cos x\\,dx$): $I=e^x\\sin x-\\int e^x\\sin x\\,dx$.",
      "Second round ($u=e^x$, $dv=\\sin x\\,dx$): $\\int e^x\\sin x\\,dx=-e^x\\cos x+I$.",
      "Substitute back: $I=e^x\\sin x+e^x\\cos x-I$, so $2I=e^x(\\sin x+\\cos x)$.",
      "$I=\\frac{e^x(\\sin x+\\cos x)}{2}+C$."
    ],
    "trap": "Swapping the roles of $u$ and $dv$ in the second round (making $\\sin x$ the $u$), which loops back to $I=I$ and solves nothing. Keep $e^x$ in the same role both times.",
    "check": "Definite integral check: $\\int_0^{\\pi/2}e^x\\cos x\\,dx=\\frac{e^{\\pi/2}-1}{2}$."
  },
  "uni-int-012": {
    "spot": "A polynomial $x$ times $\\arctan x$ — integration by parts with $\\arctan x$ as $u$ (it differentiates to a rational function); and for $v$ take $\\frac{x^2+1}{2}$ instead of $\\frac{x^2}{2}$, so it cancels exactly with $\\frac{1}{1+x^2}$.",
    "why": "Inverse trig functions are hard to integrate and easy to differentiate; adding the constant $\\frac{1}{2}$ to $v$ is legal and saves a polynomial division.",
    "steps": [
      "$u=\\arctan x$, $dv=x\\,dx$; take $v=\\frac{x^2+1}{2}$ (its derivative is still $x$).",
      "$\\int v\\,du=\\int\\frac{x^2+1}{2}\\cdot\\frac{1}{1+x^2}dx=\\int\\frac{1}{2}dx=\\frac{x}{2}$.",
      "So $\\int x\\arctan x\\,dx=\\frac{(x^2+1)\\arctan x}{2}-\\frac{x}{2}+C$."
    ],
    "trap": "$v=\\frac{x^2}{2}$ also works, but then $\\frac{x^2}{1+x^2}$ must be split as $1-\\frac{1}{1+x^2}$; skipping the split and integrating it as $\\frac{1}{2}x$ loses the $\\frac{1}{2}\\arctan x$ term.",
    "check": "Definite integral check: $\\int_0^1 x\\arctan x\\,dx=\\frac{\\pi}{4}-\\frac{1}{2}$."
  },
  "uni-ser-004": {
    "spot": "$\\sin(x^2)$: substitute $u=x^2$ into the series for $\\sin u$; $\\sin u$ has only odd powers $u^{2k+1}$, which become $x^{4k+2}$ — that is, $x^2,x^6,x^{10},\\dots$, and $8$ is not among them.",
    "why": "Substituting into the series shows at a glance which powers appear; no coefficients to compute, and certainly no need to differentiate eight times.",
    "steps": [
      "$\\sin u=u-\\frac{u^3}{6}+\\frac{u^5}{120}-\\cdots$; substitute $u=x^2$: $\\sin(x^2)=x^2-\\frac{x^6}{6}+\\frac{x^{10}}{120}-\\cdots$.",
      "The powers that appear are $4k+2$: $2,6,10,\\dots$; $8=4k+2$ has no integer solution.",
      "So after removing $x^2-\\frac{x^6}{6}$, what remains divided by $x^8$ still tends to $0$ — the coefficient of $x^8$ is $0$."
    ],
    "trap": "Copying the coefficients of $\\sin x$ over and thinking $x^8$ corresponds to something like $\\frac{1}{8!}$. The substitution rearranges the powers entirely; check again which powers exist.",
    "check": "$\\sin(x^2)$ is even, so it has only even powers; and among even powers only $4k+2$ appear, so the coefficients of $x^4$ and $x^8$ are both $0$."
  },
  "uni-ser-006": {
    "spot": "$x^2$ times $\\ln(1+x)$: multiplying by $x^2$ just shifts every power up by two, so the coefficient of $x^5$ is the coefficient of $x^3$ in $\\ln(1+x)$.",
    "why": "No need to multiply out the whole series; just find the matching term.",
    "steps": [
      "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$.",
      "Multiply by $x^2$: $x^2\\ln(1+x)=x^3-\\frac{x^4}{2}+\\frac{x^5}{3}-\\cdots$; the $x^5$ comes from $x^2\\cdot\\frac{x^3}{3}$.",
      "So the coefficient of $x^5$ is $\\frac{1}{3}$."
    ],
    "trap": "Looking up the $x^5$ coefficient $\\frac{1}{5}$ of $\\ln(1+x)$ and forgetting that multiplying by $x^2$ shifts the powers.",
    "check": "Sign: the coefficients of $\\ln(1+x)$ alternate with odd powers positive, so the $x^3$ term is positive and the answer should be positive."
  },
  "uni-ser-014": {
    "spot": "The coefficient $\\frac{3^n}{n^2}$ contains $3^n$ — take the $n$-th root: $3^n$ becomes $3$, and $n^2$ becomes $n^{2/n}\\to 1$; the center $1$ does not affect the radius.",
    "why": "The Root Test is the most direct for $c^n$-type coefficients; the Ratio Test works too, with $\\frac{(n+1)^2}{n^2}\\to 1$ just as easy.",
    "steps": [
      "$\\sqrt[n]{\\frac{3^n}{n^2}}=\\frac{3}{n^{2/n}}$, and $n^{1/n}\\to 1$.",
      "$R=\\frac{1}{\\lim\\sqrt[n]{|a_n|}}=\\frac{1}{3}$.",
      "Ratio Test cross-check: $\\frac{a_n}{a_{n+1}}=\\frac{(n+1)^2}{3n^2}\\to\\frac{1}{3}$, so the radius of convergence is $\\frac{1}{3}$."
    ],
    "trap": "Taking the limit $3$ as the radius. The Root Test gives $\\frac{1}{R}$; take the reciprocal for the radius.",
    "check": "Centered at $1$, the interval of convergence is $\\left(\\frac{2}{3},\\frac{4}{3}\\right)$ (endpoints checked separately); the radius does not depend on the center."
  },
  "uni-ser-016": {
    "spot": "$\\sin x\\cos x$ is half a double-angle formula: $\\frac{1}{2}\\sin 2x$ — turns a product of two series into a single series with $2x$ substituted.",
    "why": "Multiplying the two series directly means collecting four or five groups of cross terms; after the double angle you read off a single term.",
    "steps": [
      "$\\sin x\\cos x=\\frac{1}{2}\\sin 2x$.",
      "The $u^7$ coefficient of $\\sin u$ is $-\\frac{1}{7!}$; substituting $u=2x$, the $x^7$ term is $-\\frac{2^7}{7!}x^7$.",
      "Multiply by $\\frac{1}{2}$: $-\\frac{2^6}{5040}=-\\frac{64}{5040}=-\\frac{4}{315}$.",
      "So the coefficient of $x^7$ is $-\\frac{4}{315}$ (the earlier terms are $x-\\frac{2}{3}x^3+\\frac{2}{15}x^5$)."
    ],
    "trap": "Forgetting the $2^7$ when substituting $u=2x$, or forgetting the outer $\\frac{1}{2}$, giving $-\\frac{1}{5040}$ or $-\\frac{8}{315}$.",
    "check": "Check a lower term: the $x^3$ coefficient is $\\frac{1}{2}\\cdot\\left(-\\frac{8}{6}\\right)=-\\frac{2}{3}$."
  },
  "uni-ser-018": {
    "spot": "$(1+x)^{10}$ is a binomial expansion, so the coefficient of $x^6$ is $\\binom{10}{6}$; by symmetry $\\binom{10}{6}=\\binom{10}{4}$, which needs only four factors.",
    "why": "No expanding — the Binomial Theorem gives the coefficient directly; computing the smaller side is faster.",
    "steps": [
      "Binomial Theorem: the coefficient of $x^6$ $=\\binom{10}{6}=\\frac{10\\cdot 9\\cdot 8\\cdot 7\\cdot 6\\cdot 5}{6!}$.",
      "By symmetry, $\\binom{10}{4}=\\frac{10\\cdot 9\\cdot 8\\cdot 7}{4\\cdot 3\\cdot 2\\cdot 1}=\\frac{5040}{24}$.",
      "$=210$."
    ],
    "trap": "Computing only the numerator $10\\cdot 9\\cdot 8\\cdot 7\\cdot 6\\cdot 5=151200$ and forgetting to divide by $6!$, or using the permutation count $P(10,4)=5040$ as the combination count.",
    "check": "All coefficients add up to $2^{10}=1024$, and $210$ is among the largest (the middle term is $\\binom{10}{5}=252$), so the size is reasonable."
  },
  "world-005": {
    "spot": "$\\cos^5 x$ is an odd power on $[0,\\frac{\\pi}{2}]$ — split off one $\\cos x$ to go with $dx$ and let $u=\\sin x$ to get a polynomial; the odd Wallis coefficients are $\\frac{4}{5}\\cdot\\frac{2}{3}$.",
    "why": "For odd powers the substitution gives a rational answer and is less prone to dropped coefficients than reduction; the two methods check each other.",
    "steps": [
      "Let $u=\\sin x$: $\\cos x\\,dx=du$, $\\cos^4x=(1-u^2)^2$, and $x:0\\to\\frac{\\pi}{2}$ corresponds to $u:0\\to 1$.",
      "$\\int_0^1(1-2u^2+u^4)\\,du=1-\\frac{2}{3}+\\frac{1}{5}=\\frac{8}{15}$.",
      "Wallis check: $\\frac{4}{5}\\cdot\\frac{2}{3}=\\frac{8}{15}$.",
      "So the integral $=\\frac{8}{15}$."
    ],
    "trap": "Multiplying by $\\frac{\\pi}{2}$ for an odd power too, giving $\\frac{4\\pi}{15}$.",
    "check": "On $[0,\\frac{\\pi}{2}]$, $\\cos^5$ and $\\sin^5$ are mirror images, so their integrals are equal."
  },
  "world-011": {
    "spot": "The base $\\frac{2^x+8^x}{2}\\to 1$ and the exponent $\\frac{1}{x}\\to\\infty$ — a $1^\\infty$ form; take logs to get $\\frac{0}{0}$.",
    "why": "After taking logs it is $\\frac{\\ln(\\text{average})}{x}$, which is really a derivative at $x=0$; the result is the geometric mean of the two bases.",
    "steps": [
      "Take logs: $L=\\lim\\frac{1}{x}\\ln\\frac{2^x+8^x}{2}$; plugging in $0$ gives $\\frac{0}{0}$.",
      "First-order approximation $a^x\\approx 1+x\\ln a$: $\\frac{2^x+8^x}{2}\\approx 1+x\\cdot\\frac{\\ln 2+\\ln 8}{2}$, so $L=\\frac{\\ln 2+\\ln 8}{2}$.",
      "$\\frac{\\ln 2+\\ln 8}{2}=\\frac{\\ln 16}{2}=\\ln 4$.",
      "The original limit $=e^{\\ln 4}=4$."
    ],
    "trap": "Thinking the base tends to $1$ so the answer is $1$; or guessing the arithmetic mean $5$. A $1^\\infty$ form always needs logs, and the result is the geometric mean $\\sqrt{2\\cdot 8}$.",
    "check": "Geometric mean: $\\sqrt{2\\cdot 8}=4$."
  },
  "world-030": {
    "spot": "The base $\\cos x\\to 1$ and the exponent $\\frac{1}{\\sin^2x}\\to\\infty$ — a $1^\\infty$ form; after taking logs, $\\ln\\cos x\\approx -\\frac{x^2}{2}$ and $\\sin^2x\\approx x^2$.",
    "why": "Both approximations are quadratic, so just divide; L'Hôpital's Rule would mean differentiating a quotient twice, which is roundabout.",
    "steps": [
      "Take logs: $\\ln(\\text{expression})=\\frac{\\ln\\cos x}{\\sin^2x}$; plugging in $0$ gives $\\frac{0}{0}$.",
      "$\\cos x\\approx 1-\\frac{x^2}{2}$, so $\\ln\\cos x\\approx -\\frac{x^2}{2}$.",
      "$\\sin^2x\\approx x^2$; dividing gives $-\\frac{1}{2}$.",
      "The original limit $=e^{-1/2}$."
    ],
    "trap": "Answering $1$ because the base tends to $1$. $1^\\infty$ is an indeterminate form; it depends on whether the base approaches $1$ faster than the exponent grows.",
    "check": "$e^{-1/2}\\approx 0.607$: $\\cos x<1$ raised to a very high power, so a result below $1$ makes sense."
  },
  "world-035": {
    "spot": "$\\frac{(2n)!}{n!\\,n^n}=\\prod_{k=1}^{n}\\frac{n+k}{n}=\\prod_{k=1}^{n}\\left(1+\\frac{k}{n}\\right)$; take the $n$-th root and the log — it becomes $\\frac{1}{n}\\sum\\ln\\left(1+\\frac{k}{n}\\right)$, a Riemann sum.",
    "why": "No Stirling needed: split into a product and take logs, and it is a Riemann sum for $\\int_0^1\\ln(1+x)\\,dx$ — completely elementary.",
    "steps": [
      "Rewrite: $\\frac{(2n)!}{n!}=(n+1)(n+2)\\cdots(2n)$, and dividing by $n^n$ gives $\\prod_{k=1}^n\\left(1+\\frac{k}{n}\\right)$. Check with $n=3$.",
      "Take logs: $\\ln a_n^{1/n}=\\frac{1}{n}\\sum_{k=1}^n\\ln\\left(1+\\frac{k}{n}\\right)\\to\\int_0^1\\ln(1+x)\\,dx$.",
      "The integral is $2\\ln 2-1$ (antiderivative $(1+x)\\ln(1+x)-x$).",
      "The original limit $=e^{2\\ln 2-1}=\\frac{4}{e}$."
    ],
    "trap": "Writing $\\frac{1}{n}\\sum\\ln\\left(1+\\frac{k}{n}\\right)$ as $\\int_0^1\\ln x\\,dx=-1$ and getting $\\frac{1}{e}$ — dropping the \"$1+$\" in $1+\\frac{k}{n}$.",
    "check": "$\\int_1^2\\ln x\\,dx=2\\ln 2-1$, the same number from another angle; $\\frac{4}{e}\\approx 1.47$."
  },
  "world-067": {
    "spot": "$\\frac{(3n)!}{n!\\,(2n)!}=\\prod_{k=1}^{n}\\frac{2n+k}{k}$, and each factor is $\\frac{2+k/n}{k/n}$ — after the $n$-th root and the log, it is a Riemann sum for $\\int_0^1\\ln\\frac{2+x}{x}\\,dx$.",
    "why": "Compared with Stirling, the Riemann sum only needs you to integrate $\\ln$, and every step can be checked; the result $\\frac{27}{4}=\\frac{3^3}{2^2}$ also shows its structure at a glance.",
    "steps": [
      "Rewrite: $\\frac{(3n)!}{(2n)!}=(2n+1)\\cdots(3n)$; dividing by $n!=1\\cdot 2\\cdots n$ gives $\\prod_{k=1}^n\\frac{2n+k}{k}$. Check with $n=2$: $\\frac{6!}{2!\\,4!}=15=\\frac{5}{1}\\cdot\\frac{6}{2}$.",
      "Take logs and divide by $n$: $\\frac{1}{n}\\sum_{k=1}^n\\ln\\frac{2+k/n}{k/n}\\to\\int_0^1\\ln\\frac{2+x}{x}\\,dx$ (the log singularity at $x=0$ is integrable).",
      "$\\int_0^1\\ln(2+x)\\,dx=3\\ln 3-2\\ln 2-1$ and $\\int_0^1\\ln x\\,dx=-1$; subtracting gives $3\\ln 3-2\\ln 2$.",
      "The original limit $=e^{3\\ln 3-2\\ln 2}=\\frac{27}{4}$."
    ],
    "trap": "Writing only the numerator half of the Riemann sum, $\\int_0^1\\ln(2+x)\\,dx$, and missing the $-\\int_0^1\\ln x\\,dx=+1$ from the denominator $k$, which gives $\\frac{27}{4e}$.",
    "check": "$\\binom{3n}{n}$ never exceeds $(1+1)^{3n}=8^n$, so the limit must be less than $8$; $\\frac{27}{4}=6.75$ fits."
  },
  "ap-cen-002": {
    "spot": "The upper half-disk is symmetric about the $y$-axis, so $\\bar x=0$; for $\\bar y$ use the vertical-strip formula: each strip has height $f(x)$ and centroid at $\\frac{f(x)}{2}$, so $\\bar y=\\frac{1}{A}\\int\\frac{1}{2}f(x)^2\\,dx$.",
    "why": "$\\frac{1}{2}f^2=\\frac{1-x^2}{2}$ is a polynomial and easy to integrate; polar coordinates work too, but vertical strips never touch a square root.",
    "steps": [
      "Area $A=\\frac{\\pi}{2}$ (half the unit disk).",
      "Moment $M_x=\\int_{-1}^{1}\\frac{1}{2}(1-x^2)\\,dx=\\frac{1}{2}\\left(2-\\frac{2}{3}\\right)=\\frac{2}{3}$.",
      "$\\bar y=\\frac{M_x}{A}=\\frac{2/3}{\\pi/2}=\\frac{4}{3\\pi}$."
    ],
    "trap": "Writing the moment as $\\int f(x)\\,dx$ instead of $\\int\\frac{1}{2}f(x)^2\\,dx$ (a strip's centroid is at half its height) leads to answers like $\\bar y=1$ that lie outside the disk.",
    "check": "Pappus's Theorem: rotating the half-disk once about the $x$-axis gives the unit ball, so $2\\pi\\bar y\\cdot A=\\frac{4\\pi}{3}$."
  },
  "app-010": {
    "spot": "A cone inscribed in a sphere: put the apex at the top of the sphere and the base on a horizontal cross-section circle — the only freedom left is \"how far the base is from the center\", so write the volume as a one-variable function and maximize.",
    "why": "Using the distance $a$ from the base to the center as the variable, the height $1+a$ and squared base radius $1-a^2$ are both polynomials — one less layer of square roots than using an angle or the radius.",
    "steps": [
      "Base a distance $a$ below the center ($0\\le a<1$): height $h=1+a$, $r^2=1-a^2$, $V(a)=\\frac{\\pi}{3}(1-a^2)(1+a)$.",
      "Differentiate: $\\frac{d}{da}\\left[(1-a^2)(1+a)\\right]=(1+a)(1-3a)$, critical point $a=\\frac{1}{3}$.",
      "Positive on the left, negative on the right, so it is a maximum.",
      "$h=\\frac{4}{3}$, $r^2=\\frac{8}{9}$: $V=\\frac{\\pi}{3}\\cdot\\frac{8}{9}\\cdot\\frac{4}{3}=\\frac{32\\pi}{81}$."
    ],
    "trap": "Putting the base through the center ($a=0$), getting $\\frac{\\pi}{3}$, and stopping. That is just one case; moving the base down a little increases the height, and the volume grows further.",
    "check": "The maximum must exceed the $\\frac{\\pi}{3}$ at $a=0$ and be less than one third of the sphere's volume $\\frac{4\\pi}{3}$: $\\frac{32\\pi}{81}\\approx 0.395\\pi$."
  },
  "burst-boss-anti-002": {
    "spot": "A polynomial $x^4$ times $e^{-2x}$: that is four rounds of integration by parts — use the tabular method, or simply guess the answer has the form $-e^{-2x}P(x)$ with $P$ a degree-four polynomial.",
    "why": "Doing parts one round at a time takes four rounds and the signs get messy; setting up $-e^{-2x}P$, differentiating and matching coefficients solves for $P$ with a one-line equation.",
    "steps": [
      "Let the antiderivative be $F=-e^{-2x}P(x)$ and differentiate: $F'=e^{-2x}\\left(2P-P'\\right)$. For this to equal $x^4e^{-2x}$ we need $2P-P'=x^4$.",
      "Rearrange to $P=\\frac{x^4+P'}{2}$ and fill in from the top degree down: $P=\\frac{x^4}{2}+\\frac{4x^3}{4}+\\frac{12x^2}{8}+\\frac{24x}{16}+\\frac{24}{32}$ (each term is a derivative of $x^4$ divided by $2^{k+1}$).",
      "So $P=\\frac{x^4}{2}+x^3+\\frac{3x^2}{2}+\\frac{3x}{2}+\\frac{3}{4}$; check that $2P-P'=x^4$.",
      "Answer: $-e^{-2x}\\left(\\frac{x^4}{2}+x^3+\\frac{3x^2}{2}+\\frac{3x}{2}+\\frac{3}{4}\\right)+C$."
    ],
    "trap": "In the tabular method each integration of $e^{-2x}$ divides by another $-2$; a common mistake is dividing by $2$ and ignoring the sign, which scrambles the alternating signs. In the correct answer all coefficients have the same sign.",
    "check": "Definite integral check: $\\int_0^\\infty x^4e^{-2x}dx=\\frac{4!}{2^5}=\\frac{3}{4}$, which is exactly $F(\\infty)-F(0)=0-(-\\frac{3}{4})$."
  },
  "burst-boss-lim-001": {
    "spot": "The numerator is $\\tan x$ minus $x+\\frac{x^3}{3}$ (the first two terms of its expansion), over $x^5$ — this is asking for the $x^5$ coefficient of $\\tan x$.",
    "why": "L'Hôpital's Rule would take five derivatives, and the higher derivatives of $\\tan$ are ugly; remembering $\\tan x=x+\\frac{x^3}{3}+\\frac{2x^5}{15}+\\cdots$ finishes it in one line.",
    "steps": [
      "Plugging in $0$ gives $\\frac{0}{0}$; first confirm the first two terms: $\\frac{\\tan x-x}{x^3}\\to\\frac{1}{3}$.",
      "$\\tan x=x+\\frac{x^3}{3}+\\frac{2x^5}{15}+\\cdots$ (you can get this by matching coefficients in $\\tan x\\cdot\\cos x=\\sin x$: the $x^5$ term gives $\\frac{1}{120}=c-\\frac{1}{3}\\cdot\\frac{1}{2}+\\frac{1}{24}$, so $c=\\frac{2}{15}$).",
      "Remove the first two terms and divide by $x^5$: what is left is $\\frac{2}{15}+O(x^2)\\to\\frac{2}{15}$."
    ],
    "trap": "Misremembering the $x^5$ coefficient of $\\tan x$ as $\\frac{1}{15}$ or $\\frac{1}{120}$ (mixing it up with $\\sin$). If unsure, rederive it by matching coefficients in $\\tan x\\cos x=\\sin x$.",
    "check": "At $x=0.1$: the ratio is about $0.1339$, a bit more than $\\frac{2}{15}\\approx 0.1333$ (the next term $\\frac{17}{315}x^2$ is positive)."
  },
  "burst-boss-lim-002": {
    "spot": "The numerator is $\\sin x$ minus $x-\\frac{x^3}{6}$ (the first two terms of the expansion), over $x^5$ — this is the $x^5$ coefficient of $\\sin x$, $\\frac{1}{5!}$.",
    "why": "L'Hôpital's Rule would take five derivatives in a row; the expansion reads off the answer in one line.",
    "steps": [
      "Plugging in $0$ gives $\\frac{0}{0}$.",
      "$\\sin x=x-\\frac{x^3}{6}+\\frac{x^5}{120}-\\frac{x^7}{5040}+\\cdots$.",
      "Remove the first two terms and divide by $x^5$: $\\frac{1}{120}-\\frac{x^2}{5040}+\\cdots\\to\\frac{1}{120}$."
    ],
    "trap": "Misremembering the coefficient as $\\frac{1}{5}$ or $\\frac{1}{20}$; the $x^5$ coefficient is $\\frac{1}{5!}=\\frac{1}{120}$.",
    "check": "At $x=0.1$: the ratio is slightly less than $\\frac{1}{120}$ (the next term $-\\frac{x^2}{5040}$ is negative)."
  },
  "burst-boss-lim-005": {
    "spot": "$\\cos(\\sin x)$ and $\\cos x$ differ only in having $\\sin x$ versus $x$ inside, and $\\sin x$ differs from $x$ by $\\frac{x^3}{6}$ — expand both to $x^4$; the difference comes only from the correction term in $\\sin^2x$.",
    "why": "L'Hôpital's Rule on a composite function four times gets very messy; in the expansion the $1$ and $-\\frac{x^2}{2}$ cancel immediately, and you only track the $x^4$ term.",
    "steps": [
      "$\\sin^2x=x^2-\\frac{x^4}{3}+\\cdots$.",
      "$\\cos(\\sin x)=1-\\frac{\\sin^2x}{2}+\\frac{\\sin^4x}{24}-\\cdots=1-\\frac{x^2}{2}+\\frac{x^4}{6}+\\frac{x^4}{24}+\\cdots$.",
      "$\\cos x=1-\\frac{x^2}{2}+\\frac{x^4}{24}-\\cdots$; subtracting leaves only $\\frac{x^4}{6}$.",
      "Divide by $x^4$: the limit $=\\frac{1}{6}$."
    ],
    "trap": "Expanding $\\sin^2x$ only to $x^2$ and concluding that $\\cos(\\sin x)$ and $\\cos x$ agree through $x^4$, answering $0$. The difference hides exactly in the $-\\frac{x^4}{3}$ term.",
    "check": "Sum-to-product: $\\cos A-\\cos B=-2\\sin\\frac{A+B}{2}\\sin\\frac{A-B}{2}\\approx -2\\cdot x\\cdot\\left(-\\frac{x^3}{12}\\right)=\\frac{x^4}{6}$, which agrees."
  },
  "burst-boss2-lim-001": {
    "spot": "$\\frac{\\sin x}{x}\\to 1$ and the exponent $\\frac{1}{x^2}\\to\\infty$ — a $1^\\infty$ form; take logs, and $\\frac{\\sin x}{x}=1-\\frac{x^2}{6}+\\cdots$ is of exactly the same order as $x^2$.",
    "why": "After taking logs, $\\ln(1+u)\\approx u$ shows $-\\frac{1}{6}$ in one line; L'Hôpital's Rule would mean differentiating $\\ln\\frac{\\sin x}{x}$ twice, which is messy.",
    "steps": [
      "$\\frac{\\sin x}{x}=1-\\frac{x^2}{6}+\\frac{x^4}{120}-\\cdots$.",
      "Take logs: $\\ln\\frac{\\sin x}{x}\\approx -\\frac{x^2}{6}$; dividing by $x^2$ gives $-\\frac{1}{6}$.",
      "The original limit $=e^{-1/6}$."
    ],
    "trap": "Saying the answer is $1$ because the base tends to $1$. For $1^\\infty$ compare \"how far from $1$\" with \"how big the exponent is\": here both are of order $x^2$, so the result is a power of $e$.",
    "check": "At $x=0.1$: $\\left(\\frac{\\sin 0.1}{0.1}\\right)^{100}\\approx 0.8464$, almost identical to $e^{-1/6}\\approx 0.8465$."
  },
  "burst-der-001": {
    "spot": "Each derivative of $e^{2x}$ multiplies by another $2$ and leaves the function unchanged — the $n$-th derivative is $2^ne^{2x}$, which at $0$ is just $2^n$.",
    "why": "Once you see the pattern there is no need to actually differentiate twenty times; all that remains is computing $2^{20}$.",
    "steps": [
      "$\\frac{d}{dx}e^{2x}=2e^{2x}$, $\\frac{d^2}{dx^2}e^{2x}=4e^{2x}$.",
      "In general: $\\frac{d^{20}}{dx^{20}}e^{2x}=2^{20}e^{2x}$; plugging in $x=0$ gives $2^{20}$.",
      "$2^{20}=(2^{10})^2=1024^2=1048576$."
    ],
    "trap": "Expecting a coefficient like $20!$ from the derivatives (confusing it with $x^{20}$), or computing $2\\cdot 20=40$. Differentiating an exponential just multiplies by the same constant again and again.",
    "check": "From the power series: the $x^{20}$ coefficient of $e^{2x}$ is $\\frac{2^{20}}{20!}$, and multiplying back by $20!$ gives exactly $2^{20}$."
  },
  "burst-int-015": {
    "spot": "$\\cos^{11}x$ on $[0,\\frac{\\pi}{2}]$, an odd power — the odd Wallis version: $\\frac{10}{11}\\cdot\\frac{8}{9}\\cdot\\frac{6}{7}\\cdot\\frac{4}{5}\\cdot\\frac{2}{3}$, with no $\\pi$.",
    "why": "For the eleventh power, substitution means expanding $(1-u^2)^5$ into six terms; the reduction formula is just five fractions multiplied together.",
    "steps": [
      "Reduce: $I_n=\\frac{n-1}{n}I_{n-2}$, e.g. $I_{11}=\\frac{10}{11}I_9$.",
      "Go all the way down to $I_1=1$: $I_{11}=\\frac{10}{11}\\cdot\\frac{8}{9}\\cdot\\frac{6}{7}\\cdot\\frac{4}{5}\\cdot\\frac{2}{3}\\cdot 1$.",
      "Numerator $10\\cdot 8\\cdot 6\\cdot 4\\cdot 2=3840$, denominator $11\\cdot 9\\cdot 7\\cdot 5\\cdot 3=10395$; reducing gives $\\frac{256}{693}$.",
      "So the integral $=\\frac{256}{693}$."
    ],
    "trap": "Treating it as an even power and multiplying by $\\frac{\\pi}{2}$ at the end, or flipping the fractions to the $\\frac{11}{10}$ kind (the result would exceed $1$, obviously wrong).",
    "check": "$\\cos^{11}x\\le 1$ and is small on most of the interval; the answer $\\approx 0.369$ must lie between $0$ and $I_9$."
  },
  "burst-int-016": {
    "spot": "$\\int_0^{\\pi/2}\\sin^m x\\cos^n x\\,dx$ with both powers even — Beta form: $=\\frac{1}{2}B\\left(\\frac{m+1}{2},\\frac{n+1}{2}\\right)=\\frac{1}{2}B\\left(\\frac{7}{2},\\frac{5}{2}\\right)$.",
    "why": "Simplifying with double-angle formulas takes several rounds; the Beta formula turns it into a product of half-integer $\\Gamma$ values, done in one line.",
    "steps": [
      "Let $t=\\sin^2x$: $\\sin^6x\\cos^4x\\,dx=\\frac{1}{2}t^{5/2}(1-t)^{3/2}\\,dt$, so the integral $=\\frac{1}{2}B\\left(\\frac{7}{2},\\frac{5}{2}\\right)$.",
      "$\\Gamma\\left(\\frac{7}{2}\\right)=\\frac{5}{2}\\cdot\\frac{3}{2}\\cdot\\frac{1}{2}\\sqrt{\\pi}=\\frac{15\\sqrt{\\pi}}{8}$, $\\Gamma\\left(\\frac{5}{2}\\right)=\\frac{3}{2}\\cdot\\frac{1}{2}\\sqrt{\\pi}=\\frac{3\\sqrt{\\pi}}{4}$, $\\Gamma(6)=5!=120$.",
      "$\\frac{1}{2}\\cdot\\frac{\\frac{15}{8}\\cdot\\frac{3}{4}\\pi}{120}=\\frac{45\\pi}{7680}=\\frac{3\\pi}{512}$.",
      "So the integral $=\\frac{3\\pi}{512}$."
    ],
    "trap": "Writing the Beta parameters directly as $B(6,4)$ or $B(3,2)$; the correct ones are $\\frac{m+1}{2}$ and $\\frac{n+1}{2}$, with a $\\frac{1}{2}$ in front.",
    "check": "Wallis formula for two even powers: $\\frac{(5\\cdot 3\\cdot 1)(3\\cdot 1)}{10\\cdot 8\\cdot 6\\cdot 4\\cdot 2}\\cdot\\frac{\\pi}{2}$, the same value."
  },
  "burst-int-017": {
    "spot": "$\\sin^4x\\cos^4x$ has equal powers — combine into $(\\sin x\\cos x)^4=\\frac{\\sin^42x}{16}$, a Wallis integral of a single $\\sin$.",
    "why": "With equal powers the double-angle formula is the least work; the Beta formula $\\frac{1}{2}B(\\frac{5}{2},\\frac{5}{2})$ also works and serves as a check.",
    "steps": [
      "$\\sin x\\cos x=\\frac{1}{2}\\sin 2x$, so $\\sin^4x\\cos^4x=\\frac{\\sin^42x}{16}$.",
      "Let $u=2x$: $\\int_0^{\\pi/2}\\sin^42x\\,dx=\\frac{1}{2}\\int_0^{\\pi}\\sin^4u\\,du=\\int_0^{\\pi/2}\\sin^4u\\,du$ (by symmetry).",
      "Wallis: $\\int_0^{\\pi/2}\\sin^4u\\,du=\\frac{3}{4}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{3\\pi}{16}$.",
      "Divide by $16$: $\\frac{3\\pi}{256}$."
    ],
    "trap": "Forgetting that the double angle brings $\\left(\\frac{1}{2}\\right)^4=\\frac{1}{16}$ and writing only $\\frac{1}{2}$; or, when substituting $u=2x$, forgetting $dx=\\frac{du}{2}$ and that the upper limit becomes $\\pi$.",
    "check": "Beta check: $\\frac{1}{2}\\cdot\\frac{\\Gamma(\\frac{5}{2})^2}{\\Gamma(5)}=\\frac{1}{2}\\cdot\\frac{(\\frac{3}{4})^2\\pi}{24}=\\frac{3\\pi}{256}$."
  }
};
