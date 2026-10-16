// Detail v2, English — batch 012. Translation of tools/content/detail/012.js (text only; claims live in the Chinese file).
module.exports = {
  "rel-hard-ser-012": {
    "spot": "The coefficient $\\frac{n^n}{n!}$ has both $n^n$ and a factorial — divide consecutive terms and the factorial leaves just one $n+1$, with $\\left(1+\\frac{1}{n}\\right)^n$ left over. That shape is made for the Ratio Test.",
    "why": "The Root Test would need an estimate of $(n!)^{1/n}$, which means Stirling; the ratio cancels the factorial and lands right on the definition of $e$.",
    "steps": [
      "Let $a_n=\\frac{n^n}{n!}$. Consecutive ratio: $\\frac{a_{n+1}}{a_n}=\\frac{(n+1)^{n+1}}{(n+1)!}\\cdot\\frac{n!}{n^n}=\\frac{(n+1)^n}{n^n}$.",
      "That is exactly $\\left(1+\\frac{1}{n}\\right)^n$, whose limit is $e$.",
      "Ratio Test: $R=\\lim\\frac{a_n}{a_{n+1}}=\\frac{1}{e}$."
    ],
    "trap": "Taking $\\lim\\frac{a_{n+1}}{a_n}=e$ as the radius and answering $e$. The limit of the ratio is $\\frac{1}{R}$ — you have to take the reciprocal.",
    "check": "$\\left(1+\\frac{1}{n}\\right)^n$ climbs up toward $e$ from below: at $n=1000$ it is already $2.7169$, so the ratio really does sit near $e$."
  },
  "uni-der-010": {
    "spot": "Slope of the tangent to a polar curve — write it parametrically as $x=r\\cos\\theta$, $y=r\\sin\\theta$; the slope is $\\frac{dy/d\\theta}{dx/d\\theta}$.",
    "why": "$\\frac{dr}{d\\theta}$ is not the tangent slope, just the rate of change of the radius; the slope always has to go back to the Cartesian $x,y$.",
    "steps": [
      "Parametric form: $x=(1+\\cos\\theta)\\cos\\theta$, $y=(1+\\cos\\theta)\\sin\\theta$; at $\\theta=\\frac{\\pi}{2}$ the point is $(0,1)$.",
      "$\\frac{dy}{d\\theta}=r'\\sin\\theta+r\\cos\\theta$ with $r'=-\\sin\\theta$; at $\\frac{\\pi}{2}$: $-1\\cdot 1+1\\cdot 0=-1$.",
      "$\\frac{dx}{d\\theta}=r'\\cos\\theta-r\\sin\\theta$; at $\\frac{\\pi}{2}$: $-1\\cdot 0-1\\cdot 1=-1$.",
      "Slope $=\\frac{-1}{-1}=1$."
    ],
    "trap": "Using $\\frac{dr}{d\\theta}=-\\sin\\frac{\\pi}{2}=-1$ as the slope; or forgetting the Product Rule and differentiating only a piece like $\\frac{d}{d\\theta}(\\sin\\theta)$.",
    "check": "Step forward a tiny bit to $\\theta=\\frac{\\pi}{2}+0.001$: the point moves from $(0,1)$ to roughly $(-0.001,0.999)$. Both coordinates decrease together, so the slope is positive, about $1$."
  },
  "uni-int-004": {
    "spot": "$\\arctan x$ times an easy-to-integrate $\\frac{1}{x^2}$ — integration by parts differentiates the $\\arctan$ away into a rational function, then partial fractions finish it.",
    "why": "$\\arctan x$ is hard to integrate but its derivative is $\\frac{1}{1+x^2}$; make it $u$ and the whole problem drops to a rational integral.",
    "steps": [
      "Take $u=\\arctan x$, $dv=\\frac{dx}{x^2}$, so $v=-\\frac{1}{x}$.",
      "By parts: $\\int\\frac{\\arctan x}{x^2}dx=-\\frac{\\arctan x}{x}+\\int\\frac{1}{x(1+x^2)}dx$.",
      "Partial fractions: $\\frac{1}{x(1+x^2)}=\\frac{1}{x}-\\frac{x}{1+x^2}$.",
      "Integrate term by term: $\\ln|x|-\\frac{1}{2}\\ln(1+x^2)$.",
      "Put together: $-\\frac{\\arctan x}{x}+\\ln|x|-\\frac{1}{2}\\ln(1+x^2)+C$."
    ],
    "trap": "Writing the partial fractions as $\\frac{1}{x}-\\frac{1}{1+x^2}$ and getting $\\ln|x|-\\arctan x$; combining the right side gives $\\frac{1+x^2-x}{x(1+x^2)}$, which doesn't match.",
    "check": "Differentiating the answer must give back the integrand."
  },
  "uni-int-007": {
    "spot": "An even power of $\\sec$ — save one $\\sec^2x$ for $d(\\tan x)$ and convert the rest to $\\tan$ with $\\sec^2x=1+\\tan^2x$.",
    "why": "With $u=\\tan x$ it becomes the polynomial $1+u^2$, done in one line; power-reduction formulas would take several detours.",
    "steps": [
      "Split: $\\sec^4x=\\sec^2x\\cdot\\sec^2x=(1+\\tan^2x)\\sec^2x$.",
      "Let $u=\\tan x$, $du=\\sec^2x\\,dx$.",
      "$\\int(1+u^2)\\,du=u+\\frac{u^3}{3}$.",
      "Substitute back: $\\tan x+\\frac{\\tan^3x}{3}+C$."
    ],
    "trap": "Treating $\\sec^4x$ as $(\\sec^2x)^2$ and \"raising the power by one\" to get something like $\\frac{\\tan^2x}{2}$, forgetting that the derivative of $\\tan$ is $\\sec^2$.",
    "check": "Differentiate back: $\\sec^2x+\\tan^2x\\sec^2x=\\sec^2x(1+\\tan^2x)=\\sec^4x$."
  },
  "uni-lim-007": {
    "spot": "In the numerator $\\sin 2x-2\\sin x$ the linear terms $2x-2x$ cancel exactly, and the denominator is $x^3$ — to see the cubic term, expand the Taylor series to $x^3$.",
    "why": "L'Hôpital's Rule needs three derivatives of two terms each; a Taylor expansion shows the $x^3$ coefficient in one line. You can also factor with $\\sin 2x=2\\sin x\\cos x$.",
    "steps": [
      "$\\sin 2x=2x-\\frac{(2x)^3}{6}+\\cdots=2x-\\frac{4}{3}x^3+\\cdots$.",
      "$2\\sin x=2x-\\frac{1}{3}x^3+\\cdots$.",
      "Subtract: $-\\frac{4}{3}x^3+\\frac{1}{3}x^3=-x^3$; dividing by $x^3$ gives $-1$."
    ],
    "trap": "Expanding only to the linear term, seeing $2x-2x=0$, and declaring the limit $0$; with $x^3$ in the denominator you must expand to the cubic term.",
    "check": "Factoring agrees: $\\sin 2x-2\\sin x=2\\sin x(\\cos x-1)\\approx 2x\\cdot\\left(-\\frac{x^2}{2}\\right)=-x^3$."
  },
  "uni-lim-010": {
    "spot": "$\\arctan x$ and $\\arcsin x$ both have linear term $x$, which cancels in the difference, and the denominator is $x^3$ — you are comparing their cubic coefficients.",
    "why": "Three rounds of L'Hôpital's Rule on inverse trig functions get messy; know both Maclaurin series and one subtraction finishes it.",
    "steps": [
      "$\\arctan x=x-\\frac{x^3}{3}+\\cdots$.",
      "$\\arcsin x=x+\\frac{x^3}{6}+\\cdots$.",
      "Subtract: $-\\frac{1}{3}-\\frac{1}{6}=-\\frac{1}{2}$."
    ],
    "trap": "Remembering the cubic coefficient of $\\arcsin x$ as $-\\frac{1}{6}$ (mixing it up with $\\sin x$), which gives $-\\frac{1}{3}+\\frac{1}{6}=-\\frac{1}{6}$. The inverse function's coefficient has the opposite sign of the original's.",
    "check": "For $|x|<1$ we have $\\arctan x<x<\\arcsin x$ (when $x>0$), so the numerator is negative and a negative limit makes sense; plugging in $x=0.01$ gives a ratio of about $-0.5$."
  },
  "vc-div-003": {
    "spot": "Flux through a closed surface (the six faces of a cube) — Divergence Theorem: switch to the volume integral of the divergence over the cube, and you never touch the six faces.",
    "why": "Doing it directly takes six surface integrals; the divergence $x+y+z$ integrates over the unit cube in one go.",
    "steps": [
      "Divergence: $\\nabla\\cdot\\mathbf{F}=\\frac{\\partial(xy)}{\\partial x}+\\frac{\\partial(yz)}{\\partial y}+\\frac{\\partial(zx)}{\\partial z}=y+z+x$.",
      "Divergence Theorem: flux $=\\iiint_{[0,1]^3}(x+y+z)\\,dV$. The three terms are symmetric, and each equals $\\int_0^1 x\\,dx=\\frac{1}{2}$ (the other two directions each integrate to $1$).",
      "Total $3\\cdot\\frac{1}{2}=\\frac{3}{2}$."
    ],
    "trap": "Writing the divergence as $\\frac{\\partial(xy)}{\\partial y}+\\cdots=x+y+z$ happens to give the same answer here, but it differentiates in the wrong directions; with something like $\\langle x^2y,\\dots\\rangle$ it would fail. The $i$-th component is differentiated with respect to the $i$-th variable.",
    "check": "Compute one pair of faces directly: on the face $x=1$, $\\mathbf{F}\\cdot\\mathbf{n}=y$, which integrates to $\\frac{1}{2}$; on the face $x=0$, $\\mathbf{F}\\cdot(-\\mathbf{i})=0$. Each of the three pairs contributes $\\frac{1}{2}$, total $\\frac{3}{2}$."
  },
  "vc-div-004": {
    "spot": "Flux out of the cube $[0,1]^3$ — a closed surface, so use the Divergence Theorem; the divergence $2x+2y+2z$ is linear, so its average over the cube is obvious.",
    "why": "Going face by face means six surface integrals; the Divergence Theorem needs one volume integral, and by symmetry only one of the three terms.",
    "steps": [
      "Divergence: $\\nabla\\cdot\\mathbf{F}=2x+2y+2z$.",
      "Each term: $\\iiint 2x\\,dV=\\int_0^1 2x\\,dx\\cdot 1\\cdot 1=1$.",
      "By symmetry, flux $=3\\cdot 1=3$."
    ],
    "trap": "Assuming the components of $\\mathbf{F}$ are all nonnegative, computing only the faces $x=1,y=1,z=1$, and then getting the area or normal vector wrong; in fact on the three faces like $x=0$ we have $\\mathbf{F}\\cdot\\mathbf{n}=0$, and the three far faces give $1$ each, so the answer is still $3$.",
    "check": "Directly: on the face $x=1$, $\\mathbf{F}\\cdot\\mathbf{i}=1$ with area $1$; on the face $x=0$, $x^2=0$. Each of the three pairs gives $1$, total $3$."
  },
  "world-018": {
    "spot": "$\\ln x$ times an easy-to-integrate $\\frac{1}{(1+x)^2}$ — integration by parts differentiates away the $\\ln x$; the key is choosing the antiderivative $\\frac{x}{1+x}$ (not $-\\frac{1}{1+x}$) so the boundary term at $x=0$ vanishes.",
    "why": "With $v=-\\frac{1}{1+x}$ the boundary term $-\\frac{\\ln x}{1+x}$ blows up at $0$; adding the constant $1$ to get $v=\\frac{x}{1+x}$ gives $v(0)=0$, which tames the $\\ln x$.",
    "steps": [
      "Take $u=\\ln x$ and $v=\\frac{x}{1+x}=1-\\frac{1}{1+x}$; indeed $v'=\\frac{1}{(1+x)^2}$.",
      "Boundary term $\\left[\\frac{x\\ln x}{1+x}\\right]_0^1$: at $x=1$, $\\ln 1=0$; as $x\\to 0^+$, $x\\ln x\\to 0$.",
      "What's left is $-\\int_0^1\\frac{1}{x}\\cdot\\frac{x}{1+x}dx=-\\int_0^1\\frac{dx}{1+x}$.",
      "$=-\\ln 2$."
    ],
    "trap": "Taking the textbook $v=-\\frac{1}{1+x}$: the boundary term becomes $+\\infty$ at $0$, the remaining integral $\\int\\frac{dx}{x(1+x)}$ also diverges, and you get stuck at $\\infty-\\infty$.",
    "check": "On $(0,1)$, $\\ln x<0$, so the integrand is negative throughout and the answer should be negative; $-\\ln 2\\approx -0.693$."
  },
  "world-036": {
    "spot": "$\\sec x=\\frac{1}{\\cos x}$ is even and you want the $x^6$ coefficient — set $\\sec x=1+a_2x^2+a_4x^4+a_6x^6+\\cdots$, require its product with the series for $\\cos x$ to equal $1$, and match coefficients one at a time.",
    "why": "Differentiating $\\sec x$ six times is very messy; matching coefficients in $\\cos x\\cdot\\sec x=1$ means solving just one linear equation per step.",
    "steps": [
      "$\\cos x=1-\\frac{x^2}{2}+\\frac{x^4}{24}-\\frac{x^6}{720}+\\cdots$.",
      "$x^2$: $a_2-\\frac{1}{2}=0$, so $a_2=\\frac{1}{2}$.",
      "$x^4$: $a_4-\\frac{a_2}{2}+\\frac{1}{24}=0$, so $a_4=\\frac{1}{4}-\\frac{1}{24}=\\frac{5}{24}$.",
      "$x^6$: $a_6-\\frac{a_4}{2}+\\frac{a_2}{24}-\\frac{1}{720}=0$, so $a_6=\\frac{5}{48}-\\frac{1}{48}+\\frac{1}{720}=\\frac{61}{720}$."
    ],
    "trap": "Assuming the coefficients of $\\frac{1}{\\cos x}$ are just those of $\\cos x$ inverted or with flipped sign, and writing $\\frac{1}{720}$; this misses the cross terms $-\\frac{a_4}{2}$ and $\\frac{a_2}{24}$.",
    "check": "Numerically: at $x=0.3$, $\\sec x-1-\\frac{x^2}{2}-\\frac{5x^4}{24}$ divided by $x^6$ should be close to $\\frac{61}{720}\\approx 0.0847$ (plus a little from the $x^8$ term)."
  },
  "world-041": {
    "spot": "Denominator $\\ln x$, numerator of the form $x^a-x^b$: $\\frac{x-1}{\\ln x}=\\int_0^1x^t\\,dt$ — write it as an integral over a parameter and swap the order of integration.",
    "why": "$\\frac{x-1}{\\ln x}$ has no elementary antiderivative; as a double integral, integrating in $x$ first gives $\\frac{1}{t+1}$, and $\\ln 2$ follows immediately.",
    "steps": [
      "$\\int_0^1x^t\\,dt=\\left[\\frac{x^t}{\\ln x}\\right]_0^1=\\frac{x-1}{\\ln x}$.",
      "Swap the order: $\\int_0^1\\!\\int_0^1x^t\\,dx\\,dt$, with inner integral $\\int_0^1x^t\\,dx=\\frac{1}{t+1}$.",
      "$\\int_0^1\\frac{dt}{t+1}=\\ln 2$."
    ],
    "trap": "Seeing that the denominator $\\ln x$ is $0$ at $x=1$ and concluding the improper integral diverges; in fact $\\frac{x-1}{\\ln x}\\to 1$, so the integrand is bounded on $[0,1]$.",
    "check": "The integrand is $0$ at $0$, $1$ at $1$, and increasing, so the integral lies between $0$ and $1$; $\\ln 2\\approx 0.693$."
  },
  "world-048": {
    "spot": "$\\frac{(2n-1)!!}{(2n)!!}$ is the binomial coefficient of $(1-x^2)^{-1/2}$, and the trailing $\\frac{1}{2n+1}$ comes from integrating $x^{2n}$ — this is the series for $\\arcsin x$ at $x=1$.",
    "why": "With double factorials, the Ratio Test or Comparison Test can only tell you it converges; recognizing the $\\arcsin$ series gives the value directly.",
    "steps": [
      "Binomial series: $(1-x^2)^{-1/2}=\\sum_{n\\ge 0}\\frac{(2n-1)!!}{(2n)!!}x^{2n}$; for example, the coefficient of $x^2$ is $\\frac{1}{2}$.",
      "Integrate term by term from $0$ to $x$: $\\arcsin x=\\sum\\frac{(2n-1)!!}{(2n)!!}\\cdot\\frac{x^{2n+1}}{2n+1}$.",
      "The given series is the value at $x=1$; all coefficients are positive, so we may let $x\\to 1^-$ (Abel's theorem), giving $\\int_0^1\\frac{dx}{\\sqrt{1-x^2}}=\\arcsin 1$.",
      "So the sum is $\\frac{\\pi}{2}$."
    ],
    "trap": "Thinking that since $x=1$ is on the boundary of the radius of convergence the series must diverge; in fact the terms are about $\\frac{1}{\\sqrt{\\pi n}}\\cdot\\frac{1}{2n}$, of order $n^{-3/2}$, so it converges.",
    "check": "The first four terms $1+\\frac{1}{6}+\\frac{3}{40}+\\frac{5}{112}\\approx 1.286$ are less than $\\frac{\\pi}{2}\\approx 1.571$; the tail slowly makes up the rest."
  },
  "world-059": {
    "spot": "The denominator $1+x^3$ is a sum of cubes, factoring as $(1+x)(x^2-x+1)$ — partial fractions, then split the quadratic piece into \"numerator is the derivative of the denominator\" plus \"complete the square for $\\arctan$\".",
    "why": "The standard route for rational functions; the quadratic factor has no real roots, so it always ends in $\\ln$ plus $\\arctan$.",
    "steps": [
      "Partial fractions: $\\frac{1}{1+x^3}=\\frac{1/3}{1+x}+\\frac{-\\frac{1}{3}x+\\frac{2}{3}}{x^2-x+1}$.",
      "First piece: $\\frac{1}{3}\\int_0^1\\frac{dx}{1+x}=\\frac{1}{3}\\ln 2$.",
      "Split the numerator as $-\\frac{1}{6}(2x-1)+\\frac{1}{2}$; the first part integrates to $-\\frac{1}{6}\\ln(x^2-x+1)$, which is $\\ln 1=0$ at both $0$ and $1$.",
      "For the second part complete the square, $x^2-x+1=\\left(x-\\frac{1}{2}\\right)^2+\\frac{3}{4}$: $\\frac{1}{2}\\cdot\\frac{2}{\\sqrt3}\\left[\\arctan\\frac{2x-1}{\\sqrt3}\\right]_0^1=\\frac{1}{\\sqrt3}\\left(\\frac{\\pi}{6}+\\frac{\\pi}{6}\\right)=\\frac{\\pi}{3\\sqrt3}$.",
      "Total $\\frac{\\ln 2}{3}+\\frac{\\pi}{3\\sqrt3}$."
    ],
    "trap": "Writing the quadratic piece as just a multiple of $\\ln(x^2-x+1)$ and dropping the $\\arctan$ part — the numerator is not a multiple of the denominator's derivative, so something is always left over.",
    "check": "On $[0,1]$ the integrand falls from $1$ to $\\frac{1}{2}$, so the integral should be between $0.5$ and $1$; the answer is about $0.836$."
  },
  "world-061": {
    "spot": "$\\frac{\\ln(1-x)}{x}$: expand $\\ln(1-x)$ as a power series; after dividing by $x$ every term is easy to integrate, and the result is $\\sum\\frac{1}{n^2}$.",
    "why": "This integral has no elementary antiderivative (it's the dilogarithm); term-by-term integration connects straight to the Basel problem.",
    "steps": [
      "$\\ln(1-x)=-\\sum_{n\\ge 1}\\frac{x^n}{n}$, so $\\frac{\\ln(1-x)}{x}=-\\sum\\frac{x^{n-1}}{n}$.",
      "Integrate term by term: $\\int_0^1\\frac{x^{n-1}}{n}dx=\\frac{1}{n^2}$.",
      "So the integral $=-\\sum\\frac{1}{n^2}=-\\frac{\\pi^2}{6}$.",
      "Answer: $-\\frac{\\pi^2}{6}$."
    ],
    "trap": "Seeing $\\ln(1-x)\\to-\\infty$ as $x\\to 1$ and calling it divergent; a logarithmic singularity is integrable, and the integral is finite.",
    "check": "On $(0,1)$, $\\ln(1-x)<0$, so the answer is negative; moreover $\\ln(1-x)\\le -x$, so the integral is $\\le-1$."
  },
  "world-064": {
    "spot": "Denominator $\\ln x$, numerator $x^3-1$: $\\frac{x^3-1}{\\ln x}=\\int_0^3x^t\\,dt$ — a parameter integral, then swap the order.",
    "why": "The integrand has no elementary antiderivative; as a double integral, integrating in $x$ first gives $\\frac{1}{t+1}$ and it's done in one line.",
    "steps": [
      "$\\int_0^3x^t\\,dt=\\frac{x^3-1}{\\ln x}$.",
      "Swap the order; the inner integral is $\\int_0^1x^t\\,dx=\\frac{1}{t+1}$.",
      "$\\int_0^3\\frac{dt}{t+1}=\\ln 4$."
    ],
    "trap": "Taking the parameter interval as $[1,3]$ (as if the numerator were $x^3-x$) and getting $\\ln 2$. The constant in the numerator is $1=x^0$, so the lower limit is $0$.",
    "check": "The integrand tends to $3$ as $x\\to 1$ and is $0$ at $0$, so the integral should be between $0$ and $3$; $\\ln 4\\approx 1.386$."
  },
  "world-068": {
    "spot": "The variable is in both the base and the exponent — first write $e^{x\\ln(1+x)}$; the exponent starts at $x^2$, so $e^u$ only needs to be expanded to $\\frac{u^2}{2}$.",
    "why": "Differentiating $(1+x)^x$ four times is a logarithmic-differentiation nightmare; nesting series in exponential form only requires tracking two layers.",
    "steps": [
      "$(1+x)^x=e^{u}$ with $u=x\\ln(1+x)=x^2-\\frac{x^3}{2}+\\frac{x^4}{3}-\\cdots$.",
      "$e^u=1+u+\\frac{u^2}{2}+\\cdots$; $u^2=x^4+\\cdots$, and $u^3$ starts at $x^6$, so it doesn't affect $x^4$.",
      "Coefficient of $x^4$: $\\frac{1}{3}$ from $u$ and $\\frac{1}{2}$ from $\\frac{u^2}{2}$, total $\\frac{5}{6}$.",
      "For reference: $(1+x)^x=1+x^2-\\frac{x^3}{2}+\\frac{5}{6}x^4+\\cdots$."
    ],
    "trap": "Using only $e^u\\approx 1+u$ and answering $\\frac{1}{3}$; this misses the $\\frac{1}{2}x^4$ contributed by $\\frac{u^2}{2}$.",
    "check": "Numerically: at $x=0.01$, $\\frac{(1+x)^x-1-x^2+x^3/2}{x^4}$ is close to $0.83$."
  },
  "world-077": {
    "spot": "$\\arctan x$ paired with $\\frac{1}{1+x}$: integration by parts swaps them into $\\frac{\\ln(1+x)}{1+x^2}$ — the classic integral solved by setting $x=\\tan\\theta$ and using the symmetry $\\theta\\to\\frac{\\pi}{4}-\\theta$.",
    "why": "Substituting $\\tan$ into the original doesn't make it nicer; only after integrating by parts does $\\ln(1+\\tan\\theta)$ appear, and it satisfies the identity $(1+\\tan\\theta)(1+\\tan(\\frac{\\pi}{4}-\\theta))=2$.",
    "steps": [
      "By parts: $\\int_0^1\\frac{\\arctan x}{1+x}dx=\\left[\\arctan x\\ln(1+x)\\right]_0^1-\\int_0^1\\frac{\\ln(1+x)}{1+x^2}dx=\\frac{\\pi}{4}\\ln 2-J$.",
      "Let $x=\\tan\\theta$: $J=\\int_0^{\\pi/4}\\ln(1+\\tan\\theta)\\,d\\theta$.",
      "Key identity: $1+\\tan\\left(\\frac{\\pi}{4}-\\theta\\right)=\\frac{2}{1+\\tan\\theta}$.",
      "So $\\theta\\to\\frac{\\pi}{4}-\\theta$ gives $J=\\frac{\\pi}{4}\\ln 2-J$, hence $J=\\frac{\\pi}{8}\\ln 2$.",
      "The original integral $=\\frac{\\pi}{4}\\ln 2-\\frac{\\pi}{8}\\ln 2=\\frac{\\pi\\ln 2}{8}$."
    ],
    "trap": "Computing the boundary term as $0$ (forgetting $\\arctan 1\\ln 2=\\frac{\\pi}{4}\\ln 2$) and getting $-\\frac{\\pi\\ln 2}{8}$ — the integrand is positive everywhere, so the answer can't be negative.",
    "check": "The original integral and $J$ turn out to be equal, both $\\frac{\\pi\\ln 2}{8}\\approx 0.272$."
  },
  "world-082": {
    "spot": "The whole $\\arcsin x$ is squared on $[0,1]$ — let $x=\\sin\\theta$ to get $\\int_0^{\\pi/2}\\theta^2\\cos\\theta\\,d\\theta$, polynomial times trig, integrate by parts twice.",
    "why": "Integrating by parts directly means dealing with $\\frac{x\\arcsin x}{\\sqrt{1-x^2}}$; switching to $\\theta$ first turns it into the most standard tabular method.",
    "steps": [
      "Let $x=\\sin\\theta$, $dx=\\cos\\theta\\,d\\theta$: the integral $=\\int_0^{\\pi/2}\\theta^2\\cos\\theta\\,d\\theta$.",
      "Tabular method: antiderivative $\\theta^2\\sin\\theta+2\\theta\\cos\\theta-2\\sin\\theta$.",
      "Plug in the limits: $\\theta=\\frac{\\pi}{2}$ gives $\\frac{\\pi^2}{4}-2$, $\\theta=0$ gives $0$.",
      "Answer: $\\frac{\\pi^2}{4}-2$."
    ],
    "trap": "Getting the sign wrong in the second integration by parts and writing $\\frac{\\pi^2}{4}+2$; the integrand is at most $\\frac{\\pi^2}{4}\\approx 2.47$, so the integral can't exceed that.",
    "check": "On $[0,1]$, $x^2\\le(\\arcsin x)^2\\le\\frac{\\pi^2}{4}$, so the answer is between $\\frac{1}{3}$ and $\\frac{\\pi^2}{4}$; $\\frac{\\pi^2}{4}-2\\approx 0.467$."
  },
  "burst-boss-int-008": {
    "spot": "A rational function on $\\int_0^\\infty$ with denominator $1+x^4$ — use $x\\to\\frac{1}{x}$ to show $\\frac{x^2}{1+x^4}$ and $\\frac{1}{1+x^4}$ have equal integrals, then average them into $\\frac{1+1/x^2}{(x-1/x)^2+2}$.",
    "why": "Forcing partial fractions with $1+x^4=(x^2+\\sqrt2x+1)(x^2-\\sqrt2x+1)$ is long and error-prone; the reciprocal substitution plus $u=x-\\frac{1}{x}$ turns it into $\\arctan$ in one step.",
    "steps": [
      "$x\\to\\frac{1}{x}$: $\\int_0^\\infty\\frac{x^2}{1+x^4}dx=\\int_0^\\infty\\frac{dx}{1+x^4}$, so $I=\\frac{1}{2}\\int_0^\\infty\\frac{1+x^2}{1+x^4}dx$.",
      "Divide top and bottom by $x^2$: $\\frac{1+x^2}{1+x^4}=\\frac{1+1/x^2}{x^2+1/x^2}$, and $x^2+\\frac{1}{x^2}=\\left(x-\\frac{1}{x}\\right)^2+2$.",
      "Let $u=x-\\frac{1}{x}$, $du=\\left(1+\\frac{1}{x^2}\\right)dx$; $x:0\\to\\infty$ corresponds to $u:-\\infty\\to\\infty$: $\\int_{-\\infty}^\\infty\\frac{du}{u^2+2}=\\frac{\\pi}{\\sqrt2}$.",
      "$I=\\frac{1}{2}\\cdot\\frac{\\pi}{\\sqrt2}=\\frac{\\pi}{2\\sqrt2}$."
    ],
    "trap": "Taking the range of $u=x-\\frac{1}{x}$ as only $0\\to\\infty$, which loses half and gives $\\frac{\\pi}{4\\sqrt2}$. As $x\\to 0^+$, $u\\to-\\infty$.",
    "check": "Compare with the formula $\\int_0^\\infty\\frac{x^{s-1}}{1+x^n}dx=\\frac{\\pi}{n\\sin(\\pi s/n)}$: with $n=4$, $s=3$ it gives $\\frac{\\pi}{4\\sin(3\\pi/4)}=\\frac{\\pi}{2\\sqrt2}$."
  },
  "burst-boss-int-011": {
    "spot": "$\\int_0^1(\\ln x)^n\\,dx$ — letting $x=e^{-t}$ turns it into the Gamma function $\\int_0^\\infty t^ne^{-t}dt$ (the signs cancel when $n$ is even), so the answer is $n!$.",
    "why": "Integrating by parts four times works too, but switching to the Gamma function shows $4!=24$ at a glance.",
    "steps": [
      "Let $x=e^{-t}$, so $\\ln x=-t$ and $dx=-e^{-t}dt$: $\\int_0^1(\\ln x)^4dx=\\int_0^\\infty t^4e^{-t}dt$.",
      "Reduction by parts: $\\int_0^\\infty t^ne^{-t}dt=n\\int_0^\\infty t^{n-1}e^{-t}dt$.",
      "Keep going down to $\\int_0^\\infty e^{-t}dt=1$: $4\\cdot 3\\cdot 2\\cdot 1=24$."
    ],
    "trap": "Thinking $(\\ln x)^4$ blows up near $0$ so the integral diverges; any power of the logarithm is milder than $x^{-1}$, so it's integrable. Another mistake is flipping the sign in the substitution — harmless for even powers, wrong for odd ones.",
    "check": "Compare with an odd power: $\\int_0^1(\\ln x)^3dx=-6$, whose sign matches $(-t)^3$."
  },
  "burst-boss-int-017": {
    "spot": "$\\sin$ and $\\cos$ to the same power — $\\sin x\\cos x=\\frac{\\sin 2x}{2}$, so the whole thing becomes $\\frac{\\sin^82x}{256}$; then use Wallis' formula.",
    "why": "Using the Beta function directly on two eighth powers means computing $\\Gamma(\\frac{9}{2})^2$; combining with the double-angle formula first leaves a single familiar $\\int\\sin^8$.",
    "steps": [
      "Double angle: $\\sin^8x\\cos^8x=\\left(\\frac{\\sin 2x}{2}\\right)^8=\\frac{\\sin^82x}{256}$.",
      "Let $u=2x$: $\\int_0^{\\pi/2}\\sin^82x\\,dx=\\frac{1}{2}\\int_0^\\pi\\sin^8u\\,du=\\int_0^{\\pi/2}\\sin^8u\\,du$ (by symmetry).",
      "Wallis: $\\int_0^{\\pi/2}\\sin^8u\\,du=\\frac{7\\cdot 5\\cdot 3\\cdot 1}{8\\cdot 6\\cdot 4\\cdot 2}\\cdot\\frac{\\pi}{2}=\\frac{35\\pi}{256}$.",
      "Divide by $256$: $\\frac{35\\pi}{65536}$."
    ],
    "trap": "When substituting $u=2x$, changing the upper limit to $\\pi$ but forgetting the $\\frac{1}{2}$, or including the $\\frac{1}{2}$ but integrating only to $\\frac{\\pi}{2}$ — either way the answer is off by a factor of two.",
    "check": "$\\sin^8x\\cos^8x\\le\\frac{1}{256}$, so the integral is at most $\\frac{\\pi}{512}\\approx 0.0061$; the answer is about $0.00168$."
  },
  "burst-int-002": {
    "spot": "$x^2$ times $e^{-x}\\sin x$ integrated to $\\infty$ — we know $\\int_0^\\infty e^{-tx}\\sin x\\,dx=\\frac{1}{1+t^2}$, and differentiating twice in $t$ brings down $x^2$.",
    "why": "Integration by parts would take four or five rounds with two cycles; differentiating under the parameter only means differentiating a rational function twice.",
    "steps": [
      "Base formula: $F(t)=\\int_0^\\infty e^{-tx}\\sin x\\,dx=\\frac{1}{1+t^2}$ (for $t>0$).",
      "$\\frac{\\partial^2}{\\partial t^2}e^{-tx}=x^2e^{-tx}$, so $\\int_0^\\infty x^2e^{-tx}\\sin x\\,dx=F''(t)$.",
      "$F''(t)=\\frac{6t^2-2}{(1+t^2)^3}$.",
      "Plug in $t=1$: $\\frac{6-2}{8}=\\frac{1}{2}$."
    ],
    "trap": "Remembering that one $t$-derivative brings down $x$ with a minus sign, then forgetting that after two derivatives $(-x)^2$ is already positive, and answering $-\\frac{1}{2}$.",
    "check": "The integrand is positive on $(0,\\pi)$ and afterwards squashed by $e^{-x}$, so the answer should be positive and not large."
  },
  "burst-int-003": {
    "spot": "$x^2e^{-2x}\\cos x$ integrated to $\\infty$ — start from $\\int_0^\\infty e^{-tx}\\cos x\\,dx=\\frac{t}{t^2+1}$, differentiate twice in $t$ to bring down $x^2$, then set $t=2$.",
    "why": "The tabular method plus cyclic integration by parts is long; differentiating under the parameter only means differentiating a rational function twice.",
    "steps": [
      "Base formula: $G(t)=\\int_0^\\infty e^{-tx}\\cos x\\,dx=\\frac{t}{t^2+1}$.",
      "Differentiate twice: $\\int_0^\\infty x^2e^{-tx}\\cos x\\,dx=G''(t)=\\frac{2t^3-6t}{(t^2+1)^3}$.",
      "Plug in $t=2$: $\\frac{16-12}{125}=\\frac{4}{125}$."
    ],
    "trap": "Plugging in $t=1$ (forgetting the exponential is $e^{-2x}$) and getting $G''(1)=-\\frac{1}{2}$.",
    "check": "Rough bound: without the $\\cos x$, $\\int_0^\\infty x^2e^{-2x}dx=\\frac{2}{8}=\\frac{1}{4}$; multiplying by the oscillating $\\cos x$ can only make it smaller."
  },
  "burst-int-029": {
    "spot": "$\\sqrt x$ in the numerator — let $x=u^2$ to kill the root, giving $2\\int_0^\\infty\\frac{u^2}{1+u^4}du$, exactly the type the reciprocal substitution solves.",
    "why": "Once the root is gone it's the familiar $\\frac{u^2}{1+u^4}$; handling $x^{1/2}$ directly would need the Beta function.",
    "steps": [
      "Let $x=u^2$, $dx=2u\\,du$: $\\int_0^\\infty\\frac{\\sqrt x}{1+x^2}dx=\\int_0^\\infty\\frac{2u^2}{1+u^4}du$.",
      "$u\\to\\frac{1}{u}$ shows $\\frac{u^2}{1+u^4}$ and $\\frac{1}{1+u^4}$ have equal integrals; averaging gives $\\frac{1}{2}\\int\\frac{1+1/u^2}{(u-1/u)^2+2}du$.",
      "Let $w=u-\\frac{1}{u}$, which runs over the whole real line: $\\int_0^\\infty\\frac{u^2}{1+u^4}du=\\frac{1}{2}\\cdot\\frac{\\pi}{\\sqrt2}=\\frac{\\pi}{2\\sqrt2}$.",
      "Multiply by $2$: $\\frac{\\pi}{\\sqrt2}$."
    ],
    "trap": "Forgetting the $2$ in $dx=2u\\,du$ and answering $\\frac{\\pi}{2\\sqrt2}$.",
    "check": "Compare with the formula $\\int_0^\\infty\\frac{x^{s-1}}{1+x^2}dx=\\frac{\\pi}{2\\sin(\\pi s/2)}$: with $s=\\frac{3}{2}$ it gives $\\frac{\\pi}{2\\sin(3\\pi/4)}=\\frac{\\pi}{\\sqrt2}$."
  },
  "cx-hi-008": {
    "spot": "The same function $e^{-tx}$ at $t=1$ and $t=2$, subtracted and divided by $x$: Frullani type. $\\frac{e^{-x}-e^{-2x}}{x}=\\int_1^2e^{-tx}\\,dt$, and swapping the order makes it easy.",
    "why": "Integrated separately, both terms diverge at $0$; as a parameter integral the inner integral is $\\frac{1}{t}$, giving $\\ln 2$ directly.",
    "steps": [
      "$\\int_1^2e^{-tx}dt=\\frac{e^{-x}-e^{-2x}}{x}$.",
      "Swap the order; the inner integral is $\\int_0^\\infty e^{-tx}dx=\\frac{1}{t}$.",
      "$\\int_1^2\\frac{dt}{t}=\\ln 2$."
    ],
    "trap": "Remembering the formula backwards and answering $\\ln\\frac{1}{2}<0$. Since $e^{-x}>e^{-2x}$, the integrand is always positive, so the answer must be positive.",
    "check": "Near $0$ the integrand tends to $1$ (since $e^{-x}-e^{-2x}\\approx x$), then decays exponentially, so an area below $1$ makes sense."
  },
  "db-rr-008": {
    "spot": "Fixed area $xy=100$, asking for the rate of the other side — differentiate implicitly with respect to time: $x'y+xy'=0$.",
    "why": "Solving $y=\\frac{100}{x}$ first and then differentiating also works, but implicit differentiation gets $y'=-\\frac{yx'}{x}$ in one line.",
    "steps": [
      "When the length is $x=20$, the width is $y=\\frac{100}{20}=5$.",
      "Differentiate $xy=100$ in $t$: $x'y+xy'=0$, so $y'=-\\frac{y\\,x'}{x}$.",
      "Plug in $x'=2$: $y'=-\\frac{5\\cdot 2}{20}=-\\frac{1}{2}$."
    ],
    "trap": "Assuming the width shrinks by as much as the length grows and answering $-2$; what stays fixed is the product, not the sum.",
    "check": "One second later the length is about $22$ and the width $\\frac{100}{22}\\approx 4.545$, a drop of about $0.45$ — consistent with an instantaneous rate of $-0.5$ per second (the rate keeps shrinking)."
  },
  "gx-041": {
    "spot": "Area enclosed by a polar curve — $A=\\frac{1}{2}\\int r^2\\,d\\theta$; the cardioid makes one full loop as $\\theta$ goes from $0$ to $2\\pi$.",
    "why": "In Cartesian form it's a quartic curve you can't integrate; the polar area formula plus power-reducing $\\cos^2$ finishes it.",
    "steps": [
      "$r^2=(1+\\cos\\theta)^2=1+2\\cos\\theta+\\cos^2\\theta=\\frac{3}{2}+2\\cos\\theta+\\frac{\\cos 2\\theta}{2}$.",
      "Over a full turn, $\\cos\\theta$ and $\\cos 2\\theta$ both integrate to $0$, leaving $\\frac{3}{2}\\cdot 2\\pi=3\\pi$.",
      "Multiply by $\\frac{1}{2}$: $A=\\frac{3\\pi}{2}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ in the formula and answering $3\\pi$; or taking the average of $\\cos^2\\theta$ to be $1$ and answering $2\\pi$.",
    "check": "The farthest point of the cardioid is $2$ from the origin, so the shape fits inside the circle of radius $2$ but is bigger than the circle of radius $1$: $\\pi<\\frac{3\\pi}{2}<4\\pi$."
  },
  "gx-042": {
    "spot": "One petal — use two adjacent angles where $r=0$ as the limits: $\\cos 2\\theta=0$ at $\\theta=\\pm\\frac{\\pi}{4}$, and one petal lies in between.",
    "why": "Polar area formula $\\frac{1}{2}\\int r^2d\\theta$; getting the range right matters most — taking $0$ to $2\\pi$ gives four petals.",
    "steps": [
      "$r=\\cos 2\\theta$ vanishes at $\\theta=\\pm\\frac{\\pi}{4}$, and at $\\theta=0$, $r=1$ is the tip of the petal.",
      "Power reduction: $\\cos^22\\theta=\\frac{1+\\cos 4\\theta}{2}$, which integrates to $\\frac{\\pi}{4}$ over $[-\\frac{\\pi}{4},\\frac{\\pi}{4}]$.",
      "Multiply by $\\frac{1}{2}$: one petal has area $\\frac{\\pi}{8}$."
    ],
    "trap": "Knowing it's a four-leaf rose, dividing the total area $\\frac{\\pi}{2}$ from $0$ to $2\\pi$ by four but using the wrong formula; or taking the range $0$ to $\\frac{\\pi}{4}$, which gives only half a petal, $\\frac{\\pi}{16}$.",
    "check": "All four petals together: $\\frac{1}{2}\\int_0^{2\\pi}\\cos^22\\theta\\,d\\theta=\\frac{\\pi}{2}=4\\cdot\\frac{\\pi}{8}$."
  },
  "gx-060": {
    "spot": "$y=\\ln x$ is nonnegative on $[1,e]$, so the area is just $\\int_1^e\\ln x\\,dx$; the antiderivative of $\\ln x$ comes from integration by parts: $x\\ln x-x$.",
    "why": "View $\\ln x$ as $1\\cdot\\ln x$ so that $\\ln x$ gets differentiated away; you could also integrate in $y$: $\\int_0^1(e-e^y)dy$.",
    "steps": [
      "$\\ln x\\ge 0$ on $[1,e]$, so area $=\\int_1^e\\ln x\\,dx$.",
      "By parts: $\\int\\ln x\\,dx=x\\ln x-x$.",
      "Plug in the limits: $(e-e)-(0-1)=1$."
    ],
    "trap": "Writing the antiderivative as $\\frac{1}{x}$ (differentiating instead of integrating), which gives $\\frac{1}{e}-1<0$.",
    "check": "Integrate in $y$ instead: the region is $0\\le y\\le 1$, $e^y\\le x\\le e$, with area $\\int_0^1(e-e^y)dy=e-(e-1)=1$."
  },
  "hc-rad-008": {
    "spot": "Denominator $1+x^6$, integrated to $\\infty$ — $1+x^6=(1+x^2)(x^4-x^2+1)$; after splitting, handle the $\\frac{1}{x^4-x^2+1}$ piece with the reciprocal substitution and $u=x-\\frac{1}{x}$.",
    "why": "You could also apply $\\int_0^\\infty\\frac{dx}{1+x^n}=\\frac{\\pi}{n\\sin(\\pi/n)}$ directly; without the formula, one factorization plus the reciprocal substitution keeps everything elementary.",
    "steps": [
      "Partial fractions: $\\frac{1}{1+x^6}=\\frac{1}{3}\\left(\\frac{1}{1+x^2}+\\frac{2-x^2}{x^4-x^2+1}\\right)$.",
      "$x\\to\\frac{1}{x}$: $\\int_0^\\infty\\frac{x^2}{x^4-x^2+1}dx=\\int_0^\\infty\\frac{dx}{x^4-x^2+1}$, so the second piece $=\\int_0^\\infty\\frac{dx}{x^4-x^2+1}=\\frac{1}{2}\\int_0^\\infty\\frac{1+x^2}{x^4-x^2+1}dx$.",
      "Divide top and bottom by $x^2$: the denominator becomes $=\\left(x-\\frac{1}{x}\\right)^2+1$; with $u=x-\\frac{1}{x}$ running over the whole real line, $\\frac{1}{2}\\int_{-\\infty}^\\infty\\frac{du}{u^2+1}=\\frac{\\pi}{2}$.",
      "First piece: $\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$. Total $\\frac{1}{3}\\left(\\frac{\\pi}{2}+\\frac{\\pi}{2}\\right)=\\frac{\\pi}{3}$."
    ],
    "trap": "Thinking every $\\int_0^\\infty\\frac{dx}{1+x^n}$ equals $\\frac{\\pi}{2}$ (true only for $n=2$); as $n$ grows the curve looks more like a box of width $1$, and the value tends to $1$.",
    "check": "Formula: $\\frac{\\pi}{6\\sin(\\pi/6)}=\\frac{\\pi}{3}\\approx 1.047$, slightly more than $1$, consistent with tending to $1$ for large $n$."
  },
  "int-066": {
    "spot": "The same $e^{-tx}$ at $t=1$ and $t=4$, subtracted and divided by $x$: Frullani type. Write it as $\\int_1^4e^{-tx}dt$ and swap the order.",
    "why": "Integrated separately, both terms diverge at $0$; as a parameter integral it becomes $\\int_1^4\\frac{dt}{t}$, done in one line.",
    "steps": [
      "$\\int_1^4e^{-tx}dt=\\frac{e^{-x}-e^{-4x}}{x}$.",
      "Inner integral: $\\int_0^\\infty e^{-tx}dx=\\frac{1}{t}$.",
      "$\\int_1^4\\frac{dt}{t}=\\ln 4$."
    ],
    "trap": "Swapping $a,b$ in the formula $\\ln\\frac{b}{a}$ and answering $-\\ln 4$; since $e^{-x}>e^{-4x}$, the integrand is positive, so the answer must be positive.",
    "check": "Near $0$ the integrand tends to $4-1=3$."
  },
  "int-072": {
    "spot": "A product of two sines divided by $x$: product-to-sum turns it into $\\frac{\\cos 4x-\\cos 8x}{2x}$, a Frullani type.",
    "why": "A lone $\\int\\frac{\\cos ax}{x}$ diverges at $0$, so the two terms must stay together; the Frullani formula gives $\\ln\\frac{8}{4}$ directly.",
    "steps": [
      "Product-to-sum: $\\sin 2x\\sin 6x=\\frac{\\cos 4x-\\cos 8x}{2}$.",
      "Frullani: $\\int_\\varepsilon^\\infty\\frac{\\cos 4x-\\cos 8x}{x}dx=\\int_{4\\varepsilon}^{8\\varepsilon}\\frac{\\cos u}{u}du\\to\\ln\\frac{8}{4}=\\ln 2$.",
      "Multiply back by $\\frac{1}{2}$: $\\frac{\\ln 2}{2}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ from product-to-sum and answering $\\ln 2$; or using the original frequencies in $\\ln\\frac{6}{2}$ and getting $\\ln 3$.",
    "check": "Near $0$ the integrand is $\\approx 12x$, and the positive part dominates, so the answer is positive."
  },
  "int-074": {
    "spot": "$\\arctan(ax)$ at two scales, subtracted and divided by $x$: Frullani type with $f(0)=0$, $f(\\infty)=\\frac{\\pi}{2}$.",
    "why": "Write it as $\\int_2^5\\frac{dt}{1+t^2x^2}$ and swap the order; the inner integral is $\\frac{\\pi}{2t}$. Cleaner than integration by parts.",
    "steps": [
      "$\\frac{\\partial}{\\partial t}\\arctan(tx)=\\frac{x}{1+t^2x^2}$, so $\\frac{\\arctan 5x-\\arctan 2x}{x}=\\int_2^5\\frac{dt}{1+t^2x^2}$.",
      "Swap the order; the inner integral is $\\int_0^\\infty\\frac{dx}{1+t^2x^2}=\\frac{\\pi}{2t}$.",
      "$\\int_2^5\\frac{\\pi}{2t}dt=\\frac{\\pi}{2}\\ln\\frac{5}{2}$."
    ],
    "trap": "When applying Frullani, taking $f(0)-f(\\infty)$ to be $1$, dropping the $\\frac{\\pi}{2}$, and answering $\\ln\\frac{5}{2}$.",
    "check": "Near $0$ the integrand tends to $5-2=3$, and it is always positive."
  },
  "rel-boss-002": {
    "spot": "$e^{-tx}$ at $t=2$ and $t=5$, subtracted and divided by $x$: Frullani type, written as $\\int_2^5e^{-tx}dt$.",
    "why": "Separately, both terms diverge at $0$; after swapping the order only $\\int_2^5\\frac{dt}{t}$ is left.",
    "steps": [
      "$\\int_2^5e^{-tx}dt=\\frac{e^{-2x}-e^{-5x}}{x}$.",
      "Inner integral: $\\int_0^\\infty e^{-tx}dx=\\frac{1}{t}$.",
      "$\\int_2^5\\frac{dt}{t}=\\ln\\frac{5}{2}$."
    ],
    "trap": "Answering $\\ln\\frac{2}{5}$ (formula backwards) or $\\ln 3$ (thinking it's the difference). The integrand is always positive, so the answer must be positive; only the ratio $\\frac{5}{2}$ matters.",
    "check": "At $0$ the integrand tends to $5-2=3$, and it is always positive."
  },
  "rel-boss-008": {
    "spot": "The residue of $\\frac{\\sin z}{z^5}$ is the $z^4$ coefficient in the expansion of $\\sin z$ — but $\\sin z$ is odd, with only odd powers, so the $z^4$ coefficient is $0$.",
    "why": "The formula for a fifth-order pole needs four derivatives and a limit; parity gives the answer in a second.",
    "steps": [
      "The $\\frac{1}{z}$ term of $\\frac{\\sin z}{z^5}$ comes from the $z^4$ term of $\\sin z$.",
      "$\\sin z$ is odd and has only odd powers: $\\sin z=z-\\frac{z^3}{6}+\\frac{z^5}{120}-\\cdots$; after the cubic, the next term is already $z^5$.",
      "Equivalently: the $z^4$ coefficient is $\\frac{\\sin^{(4)}(0)}{4!}$, and $\\sin^{(4)}=\\sin$, which is $0$ at $0$.",
      "Residue $=0$."
    ],
    "trap": "Seeing $\\frac{z^5}{120}$ and taking $\\frac{1}{120}$ as the residue — that's the residue of $\\frac{\\sin z}{z^6}$; after dividing by $z^5$, $\\frac{z^5}{120}$ becomes the constant term.",
    "check": "$\\frac{\\sin z}{z^5}$ is even, and the Laurent series of an even function has no odd powers, so naturally no $z^{-1}$ term."
  },
  "rel-hard-cpx-003": {
    "spot": "Denominator $z^4$, numerator $e^z$ minus its first two terms — the residue is the $z^3$ coefficient of $e^z$, $\\frac{1}{3!}$.",
    "why": "It looks like a fourth-order pole, but the numerator starts at $z^2$, so it's really second order; whatever the order, reading the series coefficient is fastest.",
    "steps": [
      "$e^z-1-z=\\frac{z^2}{2}+\\frac{z^3}{6}+\\frac{z^4}{24}+\\cdots$.",
      "Divide by $z^4$: $\\frac{1}{2z^2}+\\frac{1}{6z}+\\frac{1}{24}+\\cdots$; the coefficient of $\\frac{1}{z}$ is $\\frac{1}{6}$.",
      "Residue $=\\frac{1}{6}$."
    ],
    "trap": "Treating it as a fourth-order pole and taking the $z^4$ coefficient $\\frac{1}{24}$, or taking the $z^2$ coefficient $\\frac{1}{2}$. The $\\frac{1}{z}$ term corresponds to $z^{4-1}=z^3$ in the numerator.",
    "check": "Second-order pole formula: the limit of $\\frac{d}{dz}\\left[z^2f(z)\\right]=\\frac{d}{dz}\\frac{e^z-1-z}{z^2}$ as $z\\to 0$ should be $\\frac{1}{6}$."
  },
  "rel-hard-cpx-004": {
    "spot": "The $\\frac{1}{z}$ term of $\\frac{\\ln(1+z)}{z^3}$ comes from the $z^2$ term of $\\ln(1+z)$ — read off the coefficient $-\\frac{1}{2}$.",
    "why": "$\\ln(1+z)$ starts at $z$, so the pole is really second order; reading the coefficient beats the formula.",
    "steps": [
      "$\\ln(1+z)=z-\\frac{z^2}{2}+\\frac{z^3}{3}-\\cdots$.",
      "Divide by $z^3$: $\\frac{1}{z^2}-\\frac{1}{2z}+\\frac{1}{3}-\\cdots$; the coefficient of $\\frac{1}{z}$ is $-\\frac{1}{2}$.",
      "Residue $=-\\frac{1}{2}$."
    ],
    "trap": "Taking the $z^3$ coefficient $\\frac{1}{3}$ (thinking a third-order pole means look at the cubic term); with $z^3$ in the denominator you need the $z^2$ term of the numerator.",
    "check": "Second-order pole formula: $\\lim_{z\\to 0}\\frac{d}{dz}\\frac{\\ln(1+z)}{z}=-\\frac{1}{2}$."
  },
  "rel-hard-cpx-009": {
    "spot": "The $\\frac{1}{z}$ term of $\\frac{e^{2z}-1}{z^3}$ comes from the $z^2$ term of $e^{2z}$, $\\frac{(2z)^2}{2}=2z^2$.",
    "why": "Reading the series coefficient takes one step; the second-order pole formula means differentiating a quotient, which is more work.",
    "steps": [
      "$e^{2z}-1=2z+\\frac{(2z)^2}{2!}+\\frac{(2z)^3}{3!}+\\cdots=2z+2z^2+\\frac{4}{3}z^3+\\cdots$.",
      "Divide by $z^3$: $\\frac{2}{z^2}+\\frac{2}{z}+\\frac{4}{3}+\\cdots$; the coefficient of $\\frac{1}{z}$ is $2$.",
      "Residue $=2$."
    ],
    "trap": "Forgetting the $2^2$ in $(2z)^2$ and writing $\\frac{1}{2}$.",
    "check": "Second-order pole formula: $\\lim_{z\\to 0}\\frac{d}{dz}\\frac{e^{2z}-1}{z}=2$."
  },
  "rel-hard-int-008": {
    "spot": "$e^{-tx}$ at $t=3$ and $t=11$, subtracted and divided by $x$: Frullani type, written as $\\int_3^{11}e^{-tx}dt$.",
    "why": "Integrated separately, both terms diverge; after swapping the order only $\\int_3^{11}\\frac{dt}{t}$ is left.",
    "steps": [
      "$\\int_3^{11}e^{-tx}dt=\\frac{e^{-3x}-e^{-11x}}{x}$.",
      "Inner integral: $\\int_0^\\infty e^{-tx}dx=\\frac{1}{t}$.",
      "$\\int_3^{11}\\frac{dt}{t}=\\ln\\frac{11}{3}$."
    ],
    "trap": "Answering $\\ln\\frac{3}{11}$ (formula backwards). The slower-decaying $e^{-3x}$ is larger, so the integrand is always positive and the answer must be positive.",
    "check": "At $0$ the integrand tends to $11-3=8$ and is always positive; $\\ln\\frac{11}{3}\\approx 1.30$."
  },
  "world-023": {
    "spot": "$\\frac{1}{n^2(n+1)^2}=\\left(\\frac{1}{n}-\\frac{1}{n+1}\\right)^2$ — squaring out gives two sums of the $\\frac{1}{n^2}$ type plus a cross term that telescopes.",
    "why": "Direct partial fractions means solving for four coefficients; seen as the square of a difference, all three pieces are known sums (two Basel sums and one telescoping sum).",
    "steps": [
      "$\\frac{1}{n(n+1)}=\\frac{1}{n}-\\frac{1}{n+1}$; squaring: $\\frac{1}{n^2(n+1)^2}=\\frac{1}{n^2}+\\frac{1}{(n+1)^2}-\\frac{2}{n(n+1)}$.",
      "$\\sum_{n\\ge 1}\\frac{1}{n^2}=\\frac{\\pi^2}{6}$, $\\sum_{n\\ge 1}\\frac{1}{(n+1)^2}=\\frac{\\pi^2}{6}-1$.",
      "Telescoping: $\\sum\\frac{1}{n(n+1)}=1$.",
      "Total: $\\frac{\\pi^2}{6}+\\frac{\\pi^2}{6}-1-2=\\frac{\\pi^2}{3}-3$."
    ],
    "trap": "Also writing the second sum as $\\frac{\\pi^2}{6}$, missing that $n+1$ starts at $2$ so one $1$ is missing, and getting $\\frac{\\pi^2}{3}-2$.",
    "check": "The first term alone is $\\frac{1}{4}$ and the rest are small: the answer is about $0.2899$, a bit more than $\\frac{1}{4}$."
  },
  "world-029": {
    "spot": "$\\int_0^\\infty\\ln x\\cdot(\\cdots)$ — $x\\to\\frac{1}{x}$ flips the sign of $\\ln x$; averaging the two forms produces $\\frac{1-x^2}{(1+x^2)^2}=\\left(\\frac{x}{1+x^2}\\right)'$, which is ready for integration by parts.",
    "why": "Differentiating under a parameter would first need $\\int\\frac{x^s}{(1+x^2)^2}$; the reciprocal substitution plus integration by parts stays fully elementary.",
    "steps": [
      "$x\\to\\frac{1}{x}$: $I=\\int_0^\\infty\\frac{-\\ln x\\cdot x^2}{(1+x^2)^2}dx$; averaging with the original gives $I=\\frac{1}{2}\\int_0^\\infty\\ln x\\cdot\\frac{1-x^2}{(1+x^2)^2}dx$.",
      "$\\frac{1-x^2}{(1+x^2)^2}$ is exactly the derivative of $\\frac{x}{1+x^2}$.",
      "By parts: the boundary term $\\frac{x\\ln x}{1+x^2}$ is $0$ at both $0^+$ and $\\infty$.",
      "What's left is $-\\frac{1}{2}\\int_0^\\infty\\frac{1}{x}\\cdot\\frac{x}{1+x^2}dx=-\\frac{1}{2}\\cdot\\frac{\\pi}{2}=-\\frac{\\pi}{4}$."
    ],
    "trap": "Remembering $\\int_0^\\infty\\frac{\\ln x}{1+x^2}dx=0$ and assuming the squared version is also $0$; squaring breaks the $x\\to\\frac{1}{x}$ symmetry, and the negative values on $(0,1)$ win.",
    "check": "The weight $\\frac{1}{(1+x^2)^2}$ is large on $(0,1)$ and small on $(1,\\infty)$, while $\\ln x$ is negative on $(0,1)$ — so a negative answer makes sense."
  },
  "world-033": {
    "spot": "Near $0$ the numerator $\\cos x-\\cos 3x$ behaves like $4x^2$, just enough to tame the $x^2$ in the denominator — one integration by parts lowers $\\frac{1}{x^2}$ to $\\frac{1}{x}$, giving two Dirichlet integrals $\\int_0^\\infty\\frac{\\sin ax}{x}dx=\\frac{\\pi}{2}$.",
    "why": "There's no ready formula for integrals with $\\frac{1}{x^2}$; lowering the power once lands on the very familiar $\\frac{\\pi}{2}$.",
    "steps": [
      "Take $u=\\cos x-\\cos 3x$, $dv=\\frac{dx}{x^2}$, $v=-\\frac{1}{x}$. Boundary term $-\\frac{\\cos x-\\cos 3x}{x}$: near $0$ it is $\\approx-4x\\to 0$, and it also tends to $0$ at $\\infty$.",
      "What's left is $\\int_0^\\infty\\frac{u'}{x}dx$ with $u'=-\\sin x+3\\sin 3x$.",
      "Dirichlet: $\\int_0^\\infty\\frac{\\sin ax}{x}dx=\\frac{\\pi}{2}$ (for $a>0$), independent of $a$.",
      "So $I=-\\frac{\\pi}{2}+3\\cdot\\frac{\\pi}{2}=\\pi$."
    ],
    "trap": "Computing $\\int_0^\\infty\\frac{\\sin 3x}{x}dx$ as $\\frac{3\\pi}{2}$ (thinking it scales with $a$) and getting $-\\frac{\\pi}{2}+\\frac{9\\pi}{2}=4\\pi$. The integral of $\\frac{\\sin ax}{x}$ doesn't depend on $a$; the factor $3$ comes from $u'$.",
    "check": "General formula $\\int_0^\\infty\\frac{\\cos ax-\\cos bx}{x^2}dx=\\frac{\\pi(b-a)}{2}$: $a=1$, $b=3$ gives $\\pi$."
  },
  "world-038": {
    "spot": "$\\frac{\\sin^3x}{x^3}$: the numerator behaves like $x^3$ near $0$, so two rounds of integration by parts lower $\\frac{1}{x^3}$ to $\\frac{1}{x}$; first rewrite $\\sin^3x$ as $\\frac{3\\sin x-\\sin 3x}{4}$, so the second derivative is again a combination of sines.",
    "why": "After lowering the power everything is $\\int\\frac{\\sin ax}{x}=\\frac{\\pi}{2}$; without integrating by parts there's no formula for $\\frac{1}{x^3}$.",
    "steps": [
      "Triple angle: $\\sin^3x=\\frac{3\\sin x-\\sin 3x}{4}$.",
      "Let $f=\\sin^3x$. Both $f(x)/x^2$ and $f'(x)/x$ tend to $0$ at $0$ and at $\\infty$, so integrating by parts twice gives $\\int_0^\\infty\\frac{f}{x^3}dx=\\frac{1}{2}\\int_0^\\infty\\frac{f''}{x}dx$.",
      "$f''=\\frac{-3\\sin x+9\\sin 3x}{4}$.",
      "Each $\\int_0^\\infty\\frac{\\sin ax}{x}dx=\\frac{\\pi}{2}$: $\\frac{1}{2}\\cdot\\frac{-3+9}{4}\\cdot\\frac{\\pi}{2}=\\frac{3\\pi}{8}$.",
      "Answer: $\\frac{3\\pi}{8}$."
    ],
    "trap": "Thinking $\\int\\frac{\\sin^3x}{x^3}$ is $\\frac{\\pi}{2}$ like $\\int\\frac{\\sin x}{x}$; or dropping the $\\frac{1}{2}$ when integrating by parts ($\\frac{1}{x^3}$ integrated twice gives $\\frac{1}{2x}$) and answering $\\frac{3\\pi}{4}$.",
    "check": "$\\left|\\frac{\\sin^3x}{x^3}\\right|$ is small outside $[0,\\pi]$; the answer $\\approx 1.178$ is less than $\\int_0^\\infty\\frac{\\sin^2x}{x^2}=\\frac{\\pi}{2}$, consistent with higher powers being narrower."
  },
  "world-043": {
    "spot": "$\\ln x$ times $\\frac{1}{1+x^6}$ integrated to $\\infty$ — $\\ln x=\\frac{\\partial}{\\partial s}x^s\\big|_{s=0}$, and $\\int_0^\\infty\\frac{x^s}{1+x^6}dx=\\frac{\\pi}{6\\sin\\frac{\\pi(s+1)}{6}}$ has a closed form, so differentiate once in $s$.",
    "why": "There's no handy antiderivative involving $\\ln x$; treating it as \"differentiate with respect to the exponent\" lets you get it from the known Beta-type formula.",
    "steps": [
      "Differentiating in the exponent brings down $\\ln x$: $\\frac{\\partial}{\\partial s}x^s=x^s\\ln x$.",
      "Formula: $I(s)=\\int_0^\\infty\\frac{x^s}{1+x^6}dx=\\frac{\\pi}{6\\sin\\frac{\\pi(s+1)}{6}}$ (for $-1<s<5$); at $s=0$ it is $\\frac{\\pi}{3}$.",
      "$I'(s)=-\\frac{\\pi^2}{36}\\cdot\\frac{\\cos\\frac{\\pi(s+1)}{6}}{\\sin^2\\frac{\\pi(s+1)}{6}}$; at $s=0$: $-\\frac{\\pi^2}{36}\\cdot\\frac{\\sqrt3/2}{1/4}=-\\frac{\\pi^2\\sqrt3}{18}$.",
      "$-\\frac{\\pi^2\\sqrt3}{18}=-\\frac{\\pi^2}{6\\sqrt3}$."
    ],
    "trap": "Thinking that, like $\\int_0^\\infty\\frac{\\ln x}{1+x^2}dx=0$, the $x\\to\\frac{1}{x}$ symmetry gives $0$; that symmetry only works for $1+x^2$ — with $1+x^6$ an extra $x^4$ appears.",
    "check": "On $(0,1)$, $\\ln x<0$ while the weight $\\frac{1}{1+x^6}\\approx 1$; on $(1,\\infty)$ the weight decays fast, so the answer should be negative."
  },
  "world-044": {
    "spot": "$x\\cot x$: $\\cot x$ is exactly the derivative of $\\ln\\sin x$ — integration by parts differentiates away the $x$, leaving the classic $\\int_0^{\\pi/2}\\ln\\sin x\\,dx=-\\frac{\\pi}{2}\\ln 2$.",
    "why": "$x\\cot x$ has no elementary antiderivative; after integrating by parts, a memorable definite integral takes over.",
    "steps": [
      "$u=x$, $dv=\\cot x\\,dx$, $v=\\ln\\sin x$: $\\int_0^{\\pi/2}x\\cot x\\,dx=\\left[x\\ln\\sin x\\right]_0^{\\pi/2}-\\int_0^{\\pi/2}\\ln\\sin x\\,dx$.",
      "Boundary term: $\\frac{\\pi}{2}\\ln 1=0$, and as $x\\to 0^+$, $x\\ln\\sin x\\approx x\\ln x\\to 0$.",
      "$J=\\int_0^{\\pi/2}\\ln\\sin x\\,dx$: using $\\sin x=2\\sin\\frac{x}{2}\\cos\\frac{x}{2}$ and the symmetry $\\int\\ln\\sin=\\int\\ln\\cos$, we get $J=\\frac{\\pi}{2}\\ln 2+2J$, so $J=-\\frac{\\pi}{2}\\ln 2$.",
      "So the integral $=0-J=\\frac{\\pi\\ln 2}{2}$."
    ],
    "trap": "Seeing $\\cot x$ blow up at $0$ and calling it divergent; $x\\cot x\\to 1$, so the integrand is bounded.",
    "check": "$x\\cot x$ decreases from $1$ to $0$ on $[0,\\frac{\\pi}{2}]$, so the integral should be between $0$ and $\\frac{\\pi}{2}$; the answer is about $1.089$."
  },
  "world-047": {
    "spot": "$\\frac{\\sin^4x}{x^4}$: the numerator behaves like $x^4$ near $0$, so three rounds of integration by parts lower $\\frac{1}{x^4}$ to $\\frac{1}{x}$; the third derivative is a combination of $\\sin 2x$ and $\\sin 4x$, all of which become Dirichlet integrals.",
    "why": "After lowering the power three times every term is $\\frac{\\pi}{2}$; attacking $\\frac{1}{x^4}$ head-on, there's no formula to use.",
    "steps": [
      "Power reduction: $\\sin^4x=\\frac{3-4\\cos 2x+\\cos 4x}{8}$.",
      "Let $f=\\sin^4x$; near $0$, $f,f',f''$ are of order $x^4,4x^3,12x^2$, so all boundary terms vanish. Integrating by parts three times: $\\int_0^\\infty\\frac{f}{x^4}dx=\\frac{1}{6}\\int_0^\\infty\\frac{f'''}{x}dx$.",
      "$f'=4\\sin^3x\\cos x$, $f'''=-4\\sin 2x+8\\sin 4x$.",
      "Each $\\int_0^\\infty\\frac{\\sin ax}{x}dx=\\frac{\\pi}{2}$: $\\frac{1}{6}(-4+8)\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{3}$.",
      "Answer: $\\frac{\\pi}{3}$."
    ],
    "trap": "Writing the coefficient from integrating by parts as just $\\frac{1}{3}$ (missing the accumulated product in $\\frac{1}{x^4}\\to\\frac{1}{3x^3}\\to\\frac{1}{6x^2}\\to\\frac{1}{6x}$) and answering $\\frac{2\\pi}{3}$; or treating $\\int\\frac{\\sin 4x}{x}$ as $4\\cdot\\frac{\\pi}{2}$.",
    "check": "Higher powers give narrower peaks: $\\int\\frac{\\sin^2x}{x^2}=\\frac{\\pi}{2}$, $\\int\\frac{\\sin^3x}{x^3}=\\frac{3\\pi}{8}$, and here $\\frac{\\pi}{3}$ — decreasing in order."
  },
  "world-058": {
    "spot": "$e^{-x^2}$ paired with $\\cos x$ — replace the $1$ by a parameter $t$: $I(t)=\\int_0^\\infty e^{-x^2}\\cos tx\\,dx$. Differentiating in $t$ and integrating by parts gives $I'=-\\frac{t}{2}I$, a first-order differential equation.",
    "why": "The Gaussian has no elementary antiderivative; Feynman's trick turns it into a separable differential equation with known starting value $I(0)=\\frac{\\sqrt\\pi}{2}$.",
    "steps": [
      "Starting value: $I(0)=\\int_0^\\infty e^{-x^2}dx=\\frac{\\sqrt\\pi}{2}$.",
      "$I'(t)=-\\int_0^\\infty xe^{-x^2}\\sin tx\\,dx$; integrating by parts ($xe^{-x^2}$ integrates to $-\\frac{1}{2}e^{-x^2}$) gives $I'(t)=-\\frac{t}{2}I(t)$.",
      "Solve $I'=-\\frac{t}{2}I$: $I(t)=\\frac{\\sqrt\\pi}{2}e^{-t^2/4}$.",
      "Plug in $t=1$: $\\frac{\\sqrt\\pi}{2}e^{-1/4}$."
    ],
    "trap": "Writing the exponent as $e^{-t^2/2}$ or $e^{-t^2}$ (borrowing the normal-distribution formula) and answering $\\frac{\\sqrt\\pi}{2}e^{-1/2}$.",
    "check": "$\\cos x\\le 1$, so the answer must be less than $\\frac{\\sqrt\\pi}{2}\\approx 0.886$; the discount factor $e^{-1/4}$ brings it to $0.690$."
  },
  "world-089": {
    "spot": "$x-\\sin x$ behaves like $\\frac{x^3}{6}$ near $0$, exactly matching $\\frac{1}{x^3}$ — integrate by parts twice; $f''=\\sin x$, giving $\\frac{1}{2}\\int_0^\\infty\\frac{\\sin x}{x}dx$.",
    "why": "The second derivative of $f=x-\\sin x$ is just $\\sin x$, so two rounds of integration by parts land directly on the Dirichlet integral.",
    "steps": [
      "Let $f=x-\\sin x$: $f(x)\\approx\\frac{x^3}{6}$, so $\\frac{f}{x^2}$ and $\\frac{f'}{x}$ both tend to $0$ at $0$; they also tend to $0$ at $\\infty$.",
      "Integrate by parts twice: $\\int_0^\\infty\\frac{f}{x^3}dx=\\frac{1}{2}\\int_0^\\infty\\frac{f''}{x}dx$, and $f''=\\sin x$.",
      "$\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{4}$."
    ],
    "trap": "Splitting into $\\int\\frac{1}{x^2}-\\int\\frac{\\sin x}{x^3}$: both diverge at $0$, leaving $\\infty-\\infty$.",
    "check": "The integrand is $\\frac{1}{6}$ near $0$, then decays like $\\frac{1}{x^2}$, and is always positive; $\\frac{\\pi}{4}\\approx 0.785$ is reasonable."
  },
  "burst-boss-anti-003": {
    "spot": "The polynomial $x^3$ times $\\sin 2x$ — that's three rounds of integration by parts, so use the tabular method: differentiate $x^3$ down to $0$ in the top row, keep integrating $\\sin 2x$ in the bottom row, multiply along the diagonals with alternating signs.",
    "why": "The polynomial dies after three derivatives while the trig function keeps its shape no matter how often you integrate; the table squeezes three rounds of parts into one chart and makes sign errors less likely.",
    "steps": [
      "Top row (differentiate): $x^3,\\ 3x^2,\\ 6x,\\ 6,\\ 0$.",
      "Bottom row (integrate): $-\\frac{\\cos 2x}{2},\\ -\\frac{\\sin 2x}{4},\\ \\frac{\\cos 2x}{8},\\ \\frac{\\sin 2x}{16}$.",
      "Multiply along the diagonals with signs $+,-,+,-$: $-\\frac{x^3\\cos 2x}{2}+\\frac{3x^2\\sin 2x}{4}+\\frac{3x\\cos 2x}{4}-\\frac{3\\sin 2x}{8}$.",
      "Add $C$ and that's the answer."
    ],
    "trap": "Forgetting to divide by $2$ at each integration in the bottom row (integrating $\\sin 2x$ as if it were $\\sin x$), so the coefficients all come out wrong as $1,3,6,6$.",
    "check": "Differentiating back must give the integrand."
  },
  "burst-boss-der-005": {
    "spot": "$e^x\\cos 2x$ is the real part of $e^{(1+2i)x}$ — differentiating $n$ times multiplies by $(1+2i)^n$, so the value at $0$ is $\\mathrm{Re}(1+2i)^{16}$; get the sixteenth power by squaring four times.",
    "why": "The Leibniz formula would mean adding seventeen terms; the complex exponential turns sixteen derivatives into a single power of a number.",
    "steps": [
      "Each derivative multiplies the amplitude by $\\sqrt5$ and adds the phase $\\varphi=\\arctan 2$: $\\frac{d}{dx}e^x\\cos 2x=\\sqrt5e^x\\cos(2x+\\varphi)$.",
      "$(1+2i)^2=-3+4i$, so the second derivative at $0$ is $-3$.",
      "Square again: $(-3+4i)^2=-7-24i$, $(-7-24i)^2=-527+336i$.",
      "Last one: $\\mathrm{Re}(-527+336i)^2=527^2-336^2=164833$."
    ],
    "trap": "Looking only at the amplitude and answering $5^8=390625$; or thinking the derivatives of $\\cos 2x$ cycle every four and answering $2^{16}$, missing the cross terms with $e^x$.",
    "check": "The size can't exceed the amplitude: $|164833|\\le 5^8=390625$."
  },
  "burst-der-008": {
    "spot": "Differentiating $e^x\\cos x$ twice gives $-2e^x\\sin x$, four times gives $-4e^x\\cos x$ — a four-step cycle with a factor of $-4$, so twelve derivatives give $(-4)^3$.",
    "why": "The Leibniz formula would mean adding thirteen terms; spotting the cycle $f^{(4)}=-4f$ lets you jump straight to the twelfth.",
    "steps": [
      "$f=e^x\\cos x$: $f''=-2e^x\\sin x$.",
      "Two more derivatives: $(-2e^x\\sin x)''=-4e^x\\cos x$, i.e. $f^{(4)}=-4f$.",
      "So $f^{(12)}=(-4)^3f$, and its value at $0$ is $=-64\\cdot 1=-64$."
    ],
    "trap": "Thinking the four-step cycle returns to the original function and answering $f(0)=1$; this misses the factor $-4$ in each round.",
    "check": "Complex view: $\\mathrm{Re}(1+i)^{12}=(\\sqrt2)^{12}\\cos 3\\pi=-64$."
  },
  "burst-der-010": {
    "spot": "$e^{2x}\\sin x$ is the imaginary part of $e^{(2+i)x}$ — the ninth derivative at $0$ is $\\mathrm{Im}(2+i)^9$; get $(2+i)^8$ by repeated squaring, then multiply once more.",
    "why": "The Leibniz formula would mean ten terms with powers $2^k$; the complex power takes only four multiplications.",
    "steps": [
      "Each derivative multiplies the amplitude by $\\sqrt5$ and adds the phase $\\arctan\\frac{1}{2}$: $\\frac{d}{dx}e^{2x}\\sin x=\\sqrt5e^{2x}\\sin\\left(x+\\arctan\\frac{1}{2}\\right)$.",
      "$(2+i)^2=3+4i$, so the second derivative at $0$ is the imaginary part, $4$.",
      "$(3+4i)^2=-7+24i$, $(-7+24i)^2=-527-336i$.",
      "The imaginary part of $(-527-336i)(2+i)$ is $=-527-672=-1199$."
    ],
    "trap": "Taking the real part ($-718$), mixing up which of $\\sin$ and $\\cos$ goes where; $\\sin x$ corresponds to the imaginary part.",
    "check": "The size can't exceed the amplitude $5^{9/2}\\approx 1397.5$."
  },
  "burst-int-037": {
    "spot": "The polynomial $x^2$ times $\\sin 3x$ — two rounds of integration by parts; use the tabular method: differentiate $x^2$ down to $0$, keep integrating $\\sin 3x$, multiply along the diagonals with alternating signs.",
    "why": "$x^2$ is gone after two derivatives, so the table takes three lines; remember to divide by $3$ at each integration.",
    "steps": [
      "Top row: $x^2,\\ 2x,\\ 2,\\ 0$; bottom row: $-\\frac{\\cos 3x}{3},\\ -\\frac{\\sin 3x}{9},\\ \\frac{\\cos 3x}{27}$.",
      "Multiply along the diagonals with signs $+,-,+$: $-\\frac{x^2\\cos 3x}{3}+\\frac{2x\\sin 3x}{9}+\\frac{2\\cos 3x}{27}$.",
      "Add $C$ and that's the answer."
    ],
    "trap": "Flipping the sign of the last term to $-\\frac{2\\cos 3x}{27}$; the third entry in the table is $+$ times $\\frac{\\cos 3x}{27}$.",
    "check": "Differentiating back must give the integrand."
  },
  "burst-rec-005": {
    "spot": "A ratio of integrals $\\int_0^{\\pi/2}\\sin^mx\\,dx$ — split as $\\sin^{m-1}x\\cdot\\sin x$ and integrate by parts once; $\\cos^2=1-\\sin^2$ brings back the same integral, giving the reduction formula.",
    "why": "You don't need $A_n$ itself; one integration by parts gives the recursion $mA=(m-1)A'$.",
    "steps": [
      "By parts on $\\int\\sin^mx\\,dx$ with $u=\\sin^{m-1}x$, $dv=\\sin x\\,dx$; the boundary term $-\\sin^{m-1}x\\cos x$ is $0$ at both $0$ and $\\frac{\\pi}{2}$. For example with $m=6$, $(-\\sin^5x\\cos x)'=\\sin^6x-5\\sin^4x\\cos^2x$, which are exactly the two pieces after integrating by parts.",
      "What's left is $(m-1)\\int\\sin^{m-2}x\\cos^2x=(m-1)\\int\\sin^{m-2}x-(m-1)\\int\\sin^mx$; rearranging: $\\int_0^{\\pi/2}\\sin^m=\\frac{m-1}{m}\\int_0^{\\pi/2}\\sin^{m-2}$.",
      "With $m=2n$: $\\frac{A_n}{A_{n-1}}=\\frac{2n-1}{2n}$."
    ],
    "trap": "Writing the ratio upside down as $\\frac{2n}{2n-1}$; higher powers give smaller integrals, so the ratio must be less than $1$.",
    "check": "$n=1$: $A_1=\\frac{\\pi}{4}$, $A_0=\\frac{\\pi}{2}$, ratio $\\frac{1}{2}$."
  },
  "gap-int-triple-005": {
    "spot": "The region is the cylinder $x^2+y^2\\le 4$, $0\\le z\\le 3$ — cylindrical coordinates, $dV=r\\,dz\\,dr\\,d\\theta$, and the three integrals separate completely.",
    "why": "Cartesian coordinates would mean limits like $\\sqrt{4-x^2}$; in cylindrical coordinates all limits are constants. It's really just base area times height.",
    "steps": [
      "$V=\\int_0^{2\\pi}\\!\\int_0^2\\!\\int_0^3 r\\,dz\\,dr\\,d\\theta$, with the three layers independent.",
      "$\\int_0^3dz=3$, $\\int_0^2r\\,dr=2$, $\\int_0^{2\\pi}d\\theta=2\\pi$.",
      "Multiply: $2\\pi\\cdot 2\\cdot 3=12\\pi$."
    ],
    "trap": "Dropping the Jacobian factor $r$: here $\\int_0^2dr=2$ happens to equal $\\int_0^2r\\,dr=2$, so the answer comes out right by luck; change the radius to $3$ and it shows — you'd get $18\\pi$ instead of $27\\pi$.",
    "check": "Base area $\\pi\\cdot 2^2=4\\pi$ times height $3$ gives $12\\pi$."
  },
  "hc-der-007": {
    "spot": "A high-order derivative of $\\frac{\\sin x}{x}$ at $0$ — write it as $\\int_0^1\\cos(xt)\\,dt$; differentiating ten times in $x$ just brings down $t^{10}$, and the tenth derivative of $\\cos$ at $0$ is $-1$.",
    "why": "Ten derivatives of a quotient by hand is hopeless; you could also read the coefficient from the series $\\sum\\frac{(-1)^kx^{2k}}{(2k+1)!}$, but the integral representation turns the factorials straight into $\\frac{1}{11}$.",
    "steps": [
      "$\\int_0^1\\cos(xt)\\,dt=\\frac{\\sin x}{x}$.",
      "Differentiate ten times in $x$: $\\frac{d^{10}}{dx^{10}}\\cos(xt)=t^{10}\\cos^{(10)}(xt)$, and $\\cos^{(10)}=-\\cos$, so at $x=0$ this is $-t^{10}$.",
      "Sanity-check with the second derivative first: $\\frac{d^2}{dx^2}\\frac{\\sin x}{x}\\big|_0=-\\int_0^1t^2dt=-\\frac{1}{3}$.",
      "Tenth derivative: $-\\int_0^1t^{10}dt=-\\frac{1}{11}$."
    ],
    "trap": "Reading the $x^{10}$ coefficient $-\\frac{1}{11!}$ off the series and taking that as the answer, forgetting to multiply by $10!$; multiplied back it is $-\\frac{10!}{11!}=-\\frac{1}{11}$.",
    "check": "Series check: the coefficient $-\\frac{1}{11!}$ times $10!$ gives $-\\frac{1}{11}$."
  },
  "int-069": {
    "spot": "The difference of $\\cos x$ and $\\cos 4x$ divided by $x$: Frullani type $\\int_0^\\infty\\frac{f(ax)-f(bx)}{x}dx$ with $f=\\cos$, $f(0)=1$.",
    "why": "A lone $\\int\\frac{\\cos ax}{x}$ diverges at $0$; keep the two terms together, and after truncation only a short stretch near $0$ remains, giving $\\ln\\frac{4}{1}$.",
    "steps": [
      "Truncate: $\\int_\\varepsilon^\\infty\\frac{\\cos x-\\cos 4x}{x}dx=\\int_\\varepsilon^{4\\varepsilon}\\frac{\\cos u}{u}du$ (change variables in each term separately, then subtract).",
      "As $\\varepsilon\\to 0$, $\\cos u\\approx 1$, so the integral $\\to\\ln\\frac{4\\varepsilon}{\\varepsilon}=\\ln 4$.",
      "Answer: $\\ln 4$."
    ],
    "trap": "Thinking $\\int_0^\\infty\\frac{\\cos ax}{x}dx$ doesn't depend on $a$ (like $\\frac{\\sin ax}{x}$) and answering $0$ for the difference; in fact each one diverges, and their difference is the finite $\\ln 4$.",
    "check": "Near $0$ the integrand is $\\approx\\frac{15x}{2}$, positive, so the answer is positive."
  },
  "int-075": {
    "spot": "$\\frac{1}{x}$ times $f(2x)-f(5x)$ with $f(x)=\\frac{1}{1+x}$: Frullani type; and after combining fractions it's a rational function, so partial fractions can confirm it directly.",
    "why": "Frullani gives $(f(0)-f(\\infty))\\ln\\frac{5}{2}$; direct partial fractions has only two terms, so the two routes check each other.",
    "steps": [
      "Combine: $\\frac{1}{x}\\left(\\frac{1}{1+2x}-\\frac{1}{1+5x}\\right)=\\frac{3}{(1+2x)(1+5x)}$.",
      "Partial fractions: $\\frac{3}{(1+2x)(1+5x)}=\\frac{5}{1+5x}-\\frac{2}{1+2x}$, with antiderivative $\\ln\\frac{1+5x}{1+2x}$.",
      "Plug in the limits: as $x\\to\\infty$, $\\ln\\frac{1+5x}{1+2x}\\to\\ln\\frac{5}{2}$; at $x=0$ it is $\\ln 1=0$.",
      "Answer $\\ln\\frac{5}{2}$, matching the Frullani formula $(1-0)\\ln\\frac{5}{2}$."
    ],
    "trap": "Splitting into $\\int\\frac{dx}{x(1+2x)}-\\int\\frac{dx}{x(1+5x)}$: both diverge at $0$.",
    "check": "At $0$ the integrand tends to $3$, and it is always positive."
  },
  "int-076": {
    "spot": "$\\frac{1}{x}$ times $f(x)-f(6x)$ with $f(x)=\\frac{1}{1+x}$: Frullani type with $f(0)=1$, $f(\\infty)=0$, so the answer is $\\ln 6$; after combining fractions you can also use partial fractions directly.",
    "why": "Frullani gives the answer in one line; partial fractions has only two terms and can serve as confirmation.",
    "steps": [
      "Combine: $\\frac{1}{x}\\left(\\frac{1}{1+x}-\\frac{1}{1+6x}\\right)=\\frac{5}{(1+x)(1+6x)}$.",
      "Partial fractions: $\\frac{6}{1+6x}-\\frac{1}{1+x}$, with antiderivative $\\ln\\frac{1+6x}{1+x}$.",
      "As $x\\to\\infty$ it $\\to\\ln 6$, and at $x=0$ it is $0$: answer $\\ln 6$."
    ],
    "trap": "Applying Frullani as $\\ln\\frac{1}{6}$ (with $a,b$ swapped); since $\\frac{1}{1+x}>\\frac{1}{1+6x}$, the integrand is always positive, so the answer must be positive.",
    "check": "At $0$ the integrand tends to $6-1=5$, and it is always positive."
  },
  "rel-boss-003": {
    "spot": "The difference of $\\cos 2x$ and $\\cos 7x$ divided by $x$: Frullani type with $f=\\cos$, $f(0)=1$, answer $\\ln\\frac{7}{2}$.",
    "why": "Separately, both terms diverge at $0$; after truncation only $\\int_{2\\varepsilon}^{7\\varepsilon}\\frac{\\cos u}{u}du\\to\\ln\\frac{7}{2}$ remains.",
    "steps": [
      "Truncate: $\\int_\\varepsilon^\\infty\\frac{\\cos 2x-\\cos 7x}{x}dx=\\int_{2\\varepsilon}^{7\\varepsilon}\\frac{\\cos u}{u}du$.",
      "As $\\varepsilon\\to 0$: $\\cos u\\approx 1$, giving $\\ln\\frac{7}{2}$.",
      "Answer: $\\ln\\frac{7}{2}$."
    ],
    "trap": "Answering $\\ln 5$ (thinking the difference of frequencies matters) or $0$ (thinking $\\int\\frac{\\cos ax}{x}$ doesn't depend on $a$). Only the ratio $\\frac{7}{2}$ matters.",
    "check": "Near $0$ the integrand is $\\approx\\frac{45x}{2}$, and the positive part dominates, so the answer is positive."
  }
};
