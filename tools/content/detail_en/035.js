// Detail v2, English — batch 035. Translation of tools/content/detail/035.js (text only; claims live in the Chinese file).
module.exports = {
  "lx-sq-003": {
    "spot": "The numerator is a floor $\\lfloor 7n\\rfloor$: it differs from $7n$ by at most $1$, and dividing by $n$ crushes that gap to $0$.",
    "why": "The floor function can't be differentiated or expanded, so squeezing with $7n-1<\\lfloor 7n\\rfloor\\le 7n$ is the safest route; and when $n$ is an integer, $\\lfloor 7n\\rfloor$ simply equals $7n$.",
    "steps": [
      "For any real $s$, $s-1<\\lfloor s\\rfloor\\le s$; taking $s=7n$ gives $7n-1<\\lfloor 7n\\rfloor\\le 7n$.",
      "Divide by $n>0$: $7-\\frac{1}{n}<\\frac{\\lfloor 7n\\rfloor}{n}\\le 7$.",
      "The left side $7-\\frac{1}{n}\\to 7$, and the right side is always $7$.",
      "Squeeze Theorem: the limit is $7$."
    ],
    "trap": "Thinking the floor \"eats\" part of it and answering something smaller than $7$; it loses at most $1$ each time, and after dividing by $n$ the effect goes to $0$.",
    "check": "When $n$ is an integer, $7n$ is already an integer, so every term $\\frac{\\lfloor 7n\\rfloor}{n}$ is exactly $7$."
  },
  "lx-sq-004": {
    "spot": "Outside, $x\\to 0^+$; inside, $\\lfloor\\frac{3}{x}\\rfloor$ shoots to infinity: something going to $0$ times something going to infinity, but the floor differs from $\\frac{3}{x}$ by less than $1$ — squeeze with $\\frac{3}{x}$.",
    "why": "The floor function jumps, so L'Hôpital's Rule is out; $s-1<\\lfloor s\\rfloor\\le s$ replaces it with continuous bounds, and multiplying by $x$ squeezes it out.",
    "steps": [
      "Take $s=\\frac{3}{x}$: $\\frac{3}{x}-1<\\left\\lfloor\\frac{3}{x}\\right\\rfloor\\le\\frac{3}{x}$.",
      "Multiply by $x>0$ (inequalities keep direction): $3-x<x\\left\\lfloor\\frac{3}{x}\\right\\rfloor\\le 3$.",
      "The left side $3-x\\to 3$, and the right side is always $3$.",
      "Squeeze: the limit is $3$."
    ],
    "trap": "Reading it as \"$0\\cdot\\infty$ is just $0$\". The rate at which $x$ shrinks exactly cancels the rate at which $\\frac{3}{x}$ grows, so the product settles near $3$.",
    "check": "Plug in $x=0.07$: $\\frac{3}{0.07}\\approx 42.86$, floor gives $42$, product $2.94$, already very close to $3$."
  },
  "td-lim-002": {
    "spot": "The product $\\prod\\left(1+\\frac{k}{n^2}\\right)$ tends to $\\sqrt e$, and the problem multiplies by $n$ to ask \"how far off\" — take logs to turn the product into a sum, and expand up to the $\\frac{1}{n}$ order.",
    "why": "The product has no closed form; after taking logs, use $\\ln(1+u)\\approx u-\\frac{u^2}{2}$ plus the formulas for $\\sum k$ and $\\sum k^2$ to get the $\\frac{1}{n}$ coefficient exactly.",
    "steps": [
      "$\\ln P_n=\\sum_{k=1}^n\\ln\\left(1+\\frac{k}{n^2}\\right)$, and $\\ln(1+u)=u-\\frac{u^2}{2}+O(u^3)$.",
      "First-order terms: $\\sum\\frac{k}{n^2}=\\frac{n(n+1)}{2n^2}=\\frac{1}{2}+\\frac{1}{2n}$.",
      "Second-order terms: $\\frac{1}{2}\\sum\\frac{k^2}{n^4}=\\frac{n(n+1)(2n+1)}{12n^4}$; times $n$ this tends to $\\frac{1}{6}$, so it is $\\frac{1}{6n}+O\\left(\\frac{1}{n^2}\\right)$.",
      "All third- and higher-order terms together are $O\\left(\\frac{1}{n^2}\\right)$ ($\\sum\\frac{k^3}{n^6}$ times $n^2$ stays bounded), so they vanish after multiplying by $n$.",
      "Altogether $\\ln P_n=\\frac{1}{2}+\\frac{1}{2n}-\\frac{1}{6n}+O\\left(\\frac{1}{n^2}\\right)=\\frac{1}{2}+\\frac{1}{3n}+\\cdots$.",
      "$P_n-\\sqrt e=\\sqrt e\\left(e^{1/(3n)+\\cdots}-1\\right)\\approx\\frac{\\sqrt e}{3n}$; times $n$ gives $\\frac{\\sqrt e}{3}$."
    ],
    "trap": "Keeping only the first-order part $\\ln P_n\\approx\\frac{1}{2}+\\frac{1}{2n}$ and getting $\\frac{\\sqrt e}{2}$; the second-order terms $-\\frac{u^2}{2}$ also add up to order $\\frac{1}{n}$ and can't be dropped.",
    "check": "Actual computation at $n=4$: $4\\left(\\frac{17}{16}\\cdot\\frac{18}{16}\\cdot\\frac{19}{16}\\cdot\\frac{20}{16}-\\sqrt e\\right)\\approx 0.502$, climbing toward $\\frac{\\sqrt e}{3}\\approx 0.550$."
  },
  "td-ser-003": {
    "spot": "$\\frac{(2n-1)!!}{(2n)!!}$ is exactly the coefficient in the expansion of $\\frac{1}{\\sqrt{1-x}}$; dividing by $n$ means dividing that series by $x$ and integrating from $0$ to $1$.",
    "why": "Once you recognize the coefficients, \"divide by $n$\" corresponds to \"$\\int_0^1\\frac{\\cdot}{x}dx$\", and the whole sum becomes one definite integral — far cleaner than estimating partial sums (which converge very slowly).",
    "steps": [
      "Binomial expansion: $\\frac{1}{\\sqrt{1-x}}=1+\\sum_{n\\ge1}c_nx^n$, $c_n=\\frac{(2n-1)!!}{(2n)!!}$; e.g. $c_1=\\frac{1}{2}$, $c_2=\\frac{3}{8}$.",
      "Since $\\int_0^1x^{n-1}dx=\\frac{1}{n}$, subtract $1$ from the series, divide by $x$ and integrate from $0$ to $1$: $\\sum\\frac{c_n}{n}=\\int_0^1\\frac{1}{x}\\left(\\frac{1}{\\sqrt{1-x}}-1\\right)dx$.",
      "Substitute $x=1-u^2$ ($dx=-2u\\,du$): the integrand becomes $\\frac{1-u}{u(1-u^2)}\\cdot 2u=\\frac{2}{1+u}$, with $u$ from $0$ to $1$.",
      "$\\int_0^1\\frac{2}{1+u}du=2\\ln 2$."
    ],
    "trap": "Treating $c_n$ like a geometric coefficient such as $\\frac{1}{2^n}$; in fact $c_n\\approx\\frac{1}{\\sqrt{\\pi n}}$ decays slowly, and adding the first ten terms by brute force gives only about $1.04$, still far from the answer.",
    "check": "The first two terms $\\frac{1}{2}+\\frac{3}{16}\\approx 0.69$; every term is positive, so the answer $2\\ln 2\\approx 1.386$ must be bigger."
  },
  "vc-flux-002": {
    "spot": "It asks for the flux out of a \"closed curve\", and the divergence $3x^2+3y^2$ is just $3r^2$ in polar coordinates — use the divergence theorem to compute a double integral over the disk instead.",
    "why": "Going directly around the boundary means integrating $\\cos^4t+\\sin^4t$; the divergence theorem turns it into $\\int r^3dr$, one line.",
    "steps": [
      "Divergence: $\\frac{\\partial}{\\partial x}x^3+\\frac{\\partial}{\\partial y}y^3=3x^2+3y^2=3r^2$.",
      "Divergence theorem: flux $=\\iint_D 3r^2\\,dA=\\int_0^{2\\pi}\\!\\int_0^1 3r^2\\cdot r\\,dr\\,d\\theta$.",
      "Multiply by the angle $2\\pi$: $\\frac{3}{4}\\cdot 2\\pi=\\frac{3\\pi}{2}$."
    ],
    "trap": "Leaving the $r$ out of the polar area element and computing $\\int_0^1 3r^2dr\\cdot 2\\pi=2\\pi$.",
    "check": "Directly around the circle: outward normal $\\langle\\cos t,\\sin t\\rangle$, $\\mathbf F\\cdot\\mathbf n=\\cos^4t+\\sin^4t$, and integrating once around also gives $\\frac{3\\pi}{2}$."
  },
  "cx-hs-006": {
    "spot": "$H_n$ is the running sum of $1,\\frac{1}{2},\\frac{1}{3},\\dots$: the generating function of running sums = the original series times $\\frac{1}{1-x}$, so $\\sum H_nx^n=\\frac{-\\ln(1-x)}{1-x}$; then plug in $x=\\frac{1}{2}$.",
    "why": "Summing directly runs into the fact that $H_n$ has no closed form; the generating function packages the whole sum in one line, and you just plug in.",
    "steps": [
      "$-\\ln(1-x)=\\sum_{k\\ge1}\\frac{x^k}{k}$.",
      "Multiply by $\\frac{1}{1-x}=\\sum x^m$: the coefficient of $x^n$ is $\\sum_{k=1}^n\\frac{1}{k}=H_n$, e.g. $H_1=1$, $H_2=\\frac{3}{2}$.",
      "So $\\sum H_nx^n=\\frac{-\\ln(1-x)}{1-x}$ (for $|x|<1$). Plug in $x=\\frac{1}{2}$: $\\frac{\\ln 2}{1/2}=2\\ln 2$."
    ],
    "trap": "Replacing $H_n$ with $\\ln n$ and computing $\\sum\\frac{\\ln n}{2^n}$: that is only an approximation and can't give the exact value.",
    "check": "The first five terms $\\frac{1}{2}+\\frac{3/2}{4}+\\frac{11/6}{8}+\\frac{25/12}{16}+\\frac{137/60}{32}\\approx 1.306$, still a bit short of $2\\ln 2\\approx 1.386$."
  },
  "dm-app-001": {
    "spot": "The integrand $|x-y|$ is symmetric under swapping $x,y$, and the absolute value changes sign along the diagonal $y=x$ — compute only the triangle where $y<x$ and multiply by $2$.",
    "why": "You can't integrate an absolute value directly; cutting along the diagonal gives two equal pieces, so compute one, where $|x-y|=x-y$.",
    "steps": [
      "Symmetry: $\\iint|x-y|=2\\int_0^1\\!\\int_0^x(x-y)\\,dy\\,dx$.",
      "Inner: $\\int_0^x(x-y)\\,dy=x^2-\\frac{x^2}{2}=\\frac{x^2}{2}$.",
      "Outer: $2\\int_0^1\\frac{x^2}{2}dx=\\frac{1}{3}$."
    ],
    "trap": "Dropping the absolute value and computing $\\iint(x-y)$; positive and negative parts cancel and you get $0$.",
    "check": "With $x=\\frac{1}{2}$ fixed, the average distance of $y$ from it is $\\int_0^1|\\frac{1}{2}-y|dy=\\frac{1}{4}$; for $x$ near the edges the average distance is larger, so an overall $\\frac{1}{3}$ bigger than $\\frac{1}{4}$ makes sense."
  },
  "dx-calc-006": {
    "spot": "Second derivative of a parametric curve: first get $\\frac{dy}{dx}=\\frac{y'(t)}{x'(t)}$, then differentiate that with respect to $t$ and \"divide by $x'(t)$ once more\".",
    "why": "$\\frac{d^2y}{dx^2}$ is not $\\frac{y''(t)}{x''(t)}$; the right way is to differentiate $\\frac{dy}{dx}$ with respect to $t$ and divide by $\\frac{dx}{dt}$ (Chain Rule).",
    "steps": [
      "$x'(t)=1-\\cos t$, $y'(t)=\\sin t$, so $\\frac{dy}{dx}=\\frac{\\sin t}{1-\\cos t}$.",
      "Differentiate with respect to $t$: $\\frac{d}{dt}\\frac{\\sin t}{1-\\cos t}=\\frac{\\cos t-\\cos^2t-\\sin^2t}{(1-\\cos t)^2}=-\\frac{1}{1-\\cos t}$.",
      "Divide by $x'(t)=1-\\cos t$ again: $\\frac{d^2y}{dx^2}=-\\frac{1}{(1-\\cos t)^2}$.",
      "Plug in $t=\\frac{\\pi}{2}$: $\\cos\\frac{\\pi}{2}=0$, giving $-1$."
    ],
    "trap": "Computing $\\frac{y''(t)}{x''(t)}=\\frac{\\cos t}{\\sin t}$, which gives $0$ at $\\frac{\\pi}{2}$. You can't get the second derivative by differentiating numerator and denominator separately.",
    "check": "The cycloid is an arch bulging upward, concave down everywhere, so the second derivative should be negative."
  },
  "dx-calc-008": {
    "spot": "The outer function is $\\operatorname{arcsinh}u$ with inner $u=e^x$: remember $(\\operatorname{arcsinh}u)'=\\frac{1}{\\sqrt{1+u^2}}$, then multiply by the inner derivative.",
    "why": "One application of the Chain Rule; writing $\\operatorname{arcsinh}$ as $\\ln\\left(u+\\sqrt{u^2+1}\\right)$ and differentiating also works, but it's longer.",
    "steps": [
      "$\\operatorname{arcsinh}u=\\ln\\left(u+\\sqrt{u^2+1}\\right)$, whose derivative is $\\frac{1}{\\sqrt{1+u^2}}$.",
      "Inner $u=e^x$, $u'=e^x$, and $u^2=e^{2x}$.",
      "Multiply: $\\frac{e^x}{\\sqrt{1+e^{2x}}}$."
    ],
    "trap": "Mixing it up with the $\\arcsin$ formula and writing $\\frac{e^x}{\\sqrt{1-e^{2x}}}$ — the hyperbolic version has a plus sign under the root.",
    "check": "At $x=0$: the derivative is $\\frac{1}{\\sqrt 2}\\approx 0.707$."
  },
  "dx-rr-004": {
    "spot": "Observer, launch point and balloon form a right triangle with fixed horizontal side $150$: the elevation angle depends only on the height, $\\tan\\theta=\\frac{h}{150}$; differentiate both sides with respect to time.",
    "why": "$\\tan$ links $\\theta$ and $h$ most directly (the fixed side is the adjacent side); $\\sin$ or $\\cos$ would drag in the changing hypotenuse.",
    "steps": [
      "$\\tan\\theta=\\frac{h}{150}$; differentiate with respect to $t$: $\\sec^2\\theta\\cdot\\frac{d\\theta}{dt}=\\frac{1}{150}\\frac{dh}{dt}$.",
      "At $h=150$, $\\tan\\theta=1$, $\\theta=\\frac{\\pi}{4}$, $\\sec^2\\theta=2$.",
      "$\\frac{d\\theta}{dt}=\\frac{6/150}{2}=0.02$ rad/s.",
      "Direct check: $h=6t$, so $h=150$ at $t=25$; take the derivative of $\\theta=\\arctan\\frac{6t}{150}$ there."
    ],
    "trap": "Forgetting $\\sec^2\\theta$ and answering $\\frac{6}{150}=0.04$.",
    "check": "The higher the balloon, the more slowly the elevation angle changes; at $h=150$ it is smaller than the $0.04$ near the start, as expected."
  },
  "fd-serx-602": {
    "spot": "The denominator is a product of two linear factors differing by $1$: first split into $\\frac{1}{3n+1}-\\frac{1}{3n+2}$, then write each term as $\\int_0^1 t^{3n}(1-t)\\,dt$ — the geometric series can be summed inside the integral.",
    "why": "After splitting, the sum does not telescope (the spacing is $3$), so the only way is to use \"$\\frac{1}{m}=\\int_0^1t^{m-1}dt$\" to turn the sum into an integral.",
    "steps": [
      "Partial fractions: $\\frac{1}{(3n+1)(3n+2)}=\\frac{1}{3n+1}-\\frac{1}{3n+2}$.",
      "$\\frac{1}{3n+1}-\\frac{1}{3n+2}=\\int_0^1\\left(t^{3n}-t^{3n+1}\\right)dt$.",
      "Sum over $n$ with the geometric series $\\sum t^{3n}=\\frac{1}{1-t^3}$: the integrand is $\\frac{1-t}{1-t^3}=\\frac{1}{1+t+t^2}$.",
      "Complete the square $1+t+t^2=\\left(t+\\frac{1}{2}\\right)^2+\\frac{3}{4}$; antiderivative $\\frac{2}{\\sqrt 3}\\arctan\\frac{2t+1}{\\sqrt 3}$.",
      "Evaluate at the limits: $\\frac{2}{\\sqrt 3}\\left(\\frac{\\pi}{3}-\\frac{\\pi}{6}\\right)=\\frac{\\pi}{3\\sqrt 3}$."
    ],
    "trap": "Assuming the split telescopes and answering $1$ (only the first term $\\frac{1}{1}$ left); but $\\frac{1}{3n+2}$ doesn't match the next term's $\\frac{1}{3n+4}$ at all.",
    "check": "Summing the series directly gives the same value, about $0.6046$."
  },
  "exam-int-001": {
    "spot": "The numerator $x$ is exactly half the derivative of the $1+x^2$ in the denominator: let $u=1+x^2$.",
    "why": "When \"the derivative of the inside is sitting outside\", substitute; no partial fractions needed.",
    "steps": [
      "$u=1+x^2$, $du=2x\\,dx$, so $x\\,dx=\\frac{du}{2}$.",
      "The integral becomes $\\frac{1}{2}\\int u^{-2}du=-\\frac{1}{2u}+C$.",
      "Back to $x$: $-\\frac{1}{2(1+x^2)}+C$."
    ],
    "trap": "Integrating $u^{-2}$ as $\\frac{u^{-1}}{1}$ and losing the minus sign, or forgetting the $\\frac{1}{2}$ from $du=2x\\,dx$ and getting $-\\frac{1}{1+x^2}$.",
    "check": "Differentiate back: $\\frac{d}{dx}\\left(-\\frac{1}{2}(1+x^2)^{-1}\\right)=\\frac{x}{(1+x^2)^2}$, which is $\\frac{1}{4}$ at $x=1$."
  },
  "lec-01-q1b": {
    "spot": "Plugging in $x=1$ makes both numerator and denominator $0$, and both are of the form \"$x^n-1$\" — they share the factor $x-1$; just cancel it.",
    "why": "For a polynomial $\\frac{0}{0}$, factoring is fastest; L'Hôpital's Rule works too, but cancelling shows the answer in one step.",
    "steps": [
      "Plug in $x=1$: numerator $0$, denominator $0$.",
      "$x^3-1=(x-1)(x^2+x+1)$, $x^2-1=(x-1)(x+1)$.",
      "Cancel $x-1$: $\\frac{x^2+x+1}{x+1}$; plugging in $x=1$ gives $\\frac{3}{2}$.",
      "So the limit is $\\frac{3}{2}$."
    ],
    "trap": "Factoring $x^3-1$ as $(x-1)(x^2+1)$ and getting $\\frac{2}{2}=1$; the correct factor is $x^2+x+1$.",
    "check": "L'Hôpital's Rule: $\\frac{3x^2}{2x}$ at $x=1$ is also $\\frac{3}{2}$."
  },
  "lec-02-q1b": {
    "spot": "The problem says \"from the definition\": write the difference quotient $\\frac{g(a+h)-g(a)}{h}$, combine the two fractions, and the numerator produces a $-h$ that cancels the $h$ in the denominator.",
    "why": "Plugging in $h=0$ directly gives $\\frac{0}{0}$; after combining fractions $h$ cancels and you can plug in.",
    "steps": [
      "Difference quotient: $\\frac{1}{h}\\left(\\frac{1}{a+h}-\\frac{1}{a}\\right)$.",
      "Common denominator: $\\frac{1}{a+h}-\\frac{1}{a}=\\frac{a-(a+h)}{a(a+h)}=\\frac{-h}{a(a+h)}$.",
      "Cancel $h$: difference quotient $=-\\frac{1}{a(a+h)}$.",
      "Let $h\\to 0$: $g'(a)=-\\frac{1}{a^2}$."
    ],
    "trap": "Writing the numerator as $(a+h)-a=h$ when combining, losing the minus sign and getting $+\\frac{1}{a^2}$. $\\frac{1}{x}$ is decreasing, so the derivative must be negative.",
    "check": "Agrees with the power rule $(x^{-1})'=-x^{-2}$."
  },
  "lec-05-q4a": {
    "spot": "$8.06$ is very close to $8$, and $\\sqrt[3]{8}=2$ is an integer: take the tangent line at $x=8$ and plug in $x=8.06$.",
    "why": "Linear approximation needs only two numbers, $f(8)$ and $f'(8)$, both tidy fractions.",
    "steps": [
      "$f(8)=2$.",
      "$f'(x)=\\frac{1}{3}x^{-2/3}$, $f'(8)=\\frac{1}{3}\\cdot\\frac{1}{4}=\\frac{1}{12}$.",
      "$L(x)=2+\\frac{1}{12}(x-8)$; plug in $8.06$: $2+\\frac{0.06}{12}=2.005$."
    ],
    "trap": "Computing $8^{-2/3}$ as $\\frac{1}{2}$ (taking the cube root but not squaring), giving $f'(8)=\\frac{1}{6}$ and an estimate of $2.01$.",
    "check": "$\\sqrt[3]{x}$ is concave down, so the tangent line lies above it, and $2.005$ is a tiny bit larger than the true value."
  },
  "lec-06-q1a": {
    "spot": "$n=4$ on an interval of length $2$: each strip has width $\\Delta x=\\frac{1}{2}$, and the right endpoints are $\\frac{1}{2},1,\\frac{3}{2},2$.",
    "why": "A Riemann sum is just \"height × width\" added up; four terms, compute directly.",
    "steps": [
      "$\\Delta x=\\frac{2-0}{4}=\\frac{1}{2}$, right endpoints $x_i=\\frac{i}{2}$.",
      "Function values: $\\frac{1}{4},\\ 1,\\ \\frac{9}{4},\\ 4$, total $\\frac{15}{2}$.",
      "Times the width: $R_4=\\frac{15}{2}\\cdot\\frac{1}{2}=\\frac{15}{4}$."
    ],
    "trap": "Forgetting to multiply by $\\Delta x$ and answering $\\frac{15}{2}$; or using the left endpoints $0,\\frac{1}{2},1,\\frac{3}{2}$ and getting $\\frac{7}{4}$.",
    "check": "$x^2$ is increasing on $[0,2]$, so the right-endpoint sum overestimates: $\\frac{15}{4}=3.75$ is bigger than the true value $\\frac{8}{3}$."
  },
  "lec-06-q3a": {
    "spot": "Under the root is $x^2+1$, and outside there is exactly $x$ (half its derivative): let $u=x^2+1$.",
    "why": "The inner derivative is sitting outside, so after substituting only a power integral of $\\sqrt u$ is left.",
    "steps": [
      "$u=x^2+1$, $du=2x\\,dx$, $x\\,dx=\\frac{du}{2}$.",
      "$\\frac{1}{2}\\int u^{1/2}du=\\frac{1}{2}\\cdot\\frac{2}{3}u^{3/2}=\\frac{1}{3}u^{3/2}$.",
      "Substitute back: $\\frac{1}{3}(x^2+1)^{3/2}+C$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ and answering $\\frac{2}{3}(x^2+1)^{3/2}$; differentiating back gives twice the integrand.",
    "check": "Definite-integral check: $\\int_0^1x\\sqrt{x^2+1}\\,dx=\\frac{2\\sqrt 2-1}{3}$."
  },
  "lec-09-q2a": {
    "spot": "Rotating about the $x$-axis with one side of the region on the $x$-axis: disk method, the radius is $y=2x-x^2$, and the range is between its two roots, $0$ to $2$.",
    "why": "The cross-sections are solid disks (no hole), so $V=\\pi\\int y^2dx$; just expand the polynomial and integrate.",
    "steps": [
      "Intersections: $2x-x^2=0\\Rightarrow x=0,2$.",
      "$V=\\pi\\int_0^2(2x-x^2)^2dx$; expand $(2x-x^2)^2=4x^2-4x^3+x^4$.",
      "Integrate term by term: $\\frac{32}{3}-16+\\frac{32}{5}=\\frac{16}{15}$.",
      "Times $\\pi$: $V=\\frac{16\\pi}{15}$."
    ],
    "trap": "Using $\\pi\\int y\\,dx$ (no square) or $2\\pi\\int y\\,dx$, giving $\\frac{4\\pi}{3}$ or $\\frac{8\\pi}{3}$.",
    "check": "The volume should be less than that of the enclosing cylinder (radius $1$, length $2$), $2\\pi$."
  },
  "lec-09-q3a": {
    "spot": "The derivative of $y=\\frac{2}{3}x^{3/2}$ is $\\sqrt x$, and after squaring $1+(y')^2=1+x$ — the root contains a linear expression, so the arc length integral is immediate.",
    "why": "This arc length problem is designed to be integrable; just apply $\\int\\sqrt{1+(y')^2}dx$.",
    "steps": [
      "$y'=\\frac{2}{3}\\cdot\\frac{3}{2}x^{1/2}=\\sqrt x$.",
      "$1+(y')^2=1+x$, arc length $=\\int_0^3\\sqrt{1+x}\\,dx$.",
      "Antiderivative $\\frac{2}{3}(1+x)^{3/2}$: $\\frac{2}{3}(8-1)=\\frac{14}{3}$."
    ],
    "trap": "At the upper limit, computing $(1+3)^{3/2}$ as $4$ instead of $8$.",
    "check": "The arc length is at least the straight-line distance between the endpoints, $\\sqrt{9+12}=\\sqrt{21}\\approx 4.58$; $\\frac{14}{3}\\approx 4.67$ is slightly larger, as expected."
  },
  "lec-09-q4a": {
    "spot": "Mean Value Theorem for integrals: first compute the average value $\\frac{1}{3}\\int_0^3x^2dx$, then solve $c^2=$ average value and keep the root in $[0,3]$.",
    "why": "Two steps: the average is a number, then solve one quadratic equation.",
    "steps": [
      "Average value: $\\frac{1}{3-0}\\int_0^3x^2dx=\\frac{1}{3}\\cdot 9=3$.",
      "$c^2=3$, $c=\\pm\\sqrt 3$; only $\\sqrt 3\\approx 1.73$ is in $[0,3]$.",
      "So $c=\\sqrt 3$."
    ],
    "trap": "Taking the average to be $\\int_0^3x^2dx=9$ (forgetting to divide by the interval length), getting $c=3$, which lands right on the endpoint.",
    "check": "$x^2$ is concave up, so its average exceeds the midpoint value $f(1.5)=2.25$, which puts $c$ to the right of the midpoint."
  },
  "lec-10-m4": {
    "spot": "Area enclosed by a polar curve is $\\frac{1}{2}\\int r^2d\\theta$; one trip around the cardioid is $\\theta$ from $0$ to $2\\pi$.",
    "why": "After expanding $(1+\\cos\\theta)^2$, $\\cos\\theta$ integrates to $0$ over a full turn and $\\cos^2\\theta$ to $\\pi$, so it's immediate.",
    "steps": [
      "$A=\\frac{1}{2}\\int_0^{2\\pi}(1+\\cos\\theta)^2d\\theta$; expand to $1+2\\cos\\theta+\\cos^2\\theta$.",
      "Over one turn: $\\int 1=2\\pi$, $\\int 2\\cos\\theta=0$, $\\int\\cos^2\\theta=\\pi$.",
      "$A=\\frac{1}{2}(2\\pi+\\pi)=\\frac{3\\pi}{2}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ and answering $3\\pi$; or integrating $\\cos^2$ to $0$ and getting $\\pi$.",
    "check": "The cardioid covers most of the circle of radius $1$ and lies inside the circle of radius $2$: $\\pi<\\frac{3\\pi}{2}<4\\pi$."
  },
  "lec-12-q1b": {
    "spot": "The repeating block $12$ is two digits long: $0.\\overline{12}=\\frac{12}{100}+\\frac{12}{100^2}+\\cdots$, a geometric series with ratio $\\frac{1}{100}$.",
    "why": "The geometric sum $\\frac{a}{1-r}$ gives it in one step and shows why the denominator is $99$ better than the \"multiply by $100$ and subtract\" trick.",
    "steps": [
      "First term $a=\\frac{12}{100}$, ratio $r=\\frac{1}{100}$.",
      "Sum $=\\frac{12/100}{1-1/100}=\\frac{12}{99}$.",
      "Reduce: $\\frac{12}{99}=\\frac{4}{33}$."
    ],
    "trap": "Taking the ratio to be $\\frac{1}{10}$ (as if one digit repeats) and getting $\\frac{12}{90}$; the block is two digits, so each round multiplies by $\\frac{1}{100}$.",
    "check": "Long division: $4\\div 33=0.121212\\ldots$, and the repeating block is indeed $12$."
  },
  "lec-15-q1a": {
    "spot": "Expanding $\\sqrt x$ at $a=4$: $\\sqrt 4=2$ is an integer, and $f'(4)$, $f''(4)$ are clean fractions; just apply $T_2=f(a)+f'(a)(x-a)+\\frac{f''(a)}{2}(x-a)^2$.",
    "why": "A quadratic polynomial needs just three numbers; the easiest thing to get wrong is the $2$ in $\\frac{f''(a)}{2!}$.",
    "steps": [
      "$f(4)=2$.",
      "$f'(x)=\\frac{1}{2\\sqrt x}$, $f'(4)=\\frac{1}{4}$.",
      "$f''(x)=-\\frac{1}{4}x^{-3/2}$, $f''(4)=-\\frac{1}{32}$; divided by $2!$ that is $-\\frac{1}{64}$.",
      "$T_2(x)=2+\\frac{x-4}{4}-\\frac{(x-4)^2}{64}$."
    ],
    "trap": "Not dividing by $2!$ and writing the quadratic term as $-\\frac{(x-4)^2}{32}$.",
    "check": "Near $x=4$, $T_2$ and $\\sqrt x$ differ at the cubic level: at $x=4.1$ the gap is under $10^{-5}$, and since the cubic term is positive, $T_2$ is slightly below the true value."
  },
  "lec-15-q1b": {
    "spot": "$4.1$ is right next to the center $4$, with $x-4=0.1$: plug $0.1$ into $T_2$.",
    "why": "$T_2$ is already written, so plugging in is just arithmetic; the error is about the size of the cubic term, very small.",
    "steps": [
      "$T_2(x)=2+\\frac{x-4}{4}-\\frac{(x-4)^2}{64}$.",
      "Linear term: $\\frac{0.1}{4}=0.025$; quadratic term: $\\frac{0.01}{64}=0.00015625$.",
      "$T_2(4.1)=2+0.025-0.00015625=2.02484375$."
    ],
    "trap": "Using $\\frac{0.01}{32}$ for the quadratic term (forgetting to divide by $2$), getting $2.0246875$.",
    "check": "The true value is $\\sqrt{4.1}\\approx 2.0248457$; the cubic term is positive, so $T_2$ is slightly below the true value."
  },
  "refine-derivatives-006": {
    "spot": "$y$ can't easily be solved for (there's a $3xy$ cross term): use implicit differentiation, treating $y$ as a function of $x$, and the Product Rule on $3xy$.",
    "why": "Implicit differentiation gives $y'=-\\frac{F_x}{F_y}$ directly; solving the quadratic first and then differentiating is long, and you have to pick the right branch.",
    "steps": [
      "Differentiate both sides with respect to $x$: $2x+3y+3xy'+2yy'=0$.",
      "Solve: $y'=-\\frac{2x+3y}{3x+2y}$.",
      "At $(1,2)$: $y'=-\\frac{8}{7}$."
    ],
    "trap": "Differentiating $3xy$ as $3y'$ or $3y$, missing the other half of the Product Rule.",
    "check": "Solving for the branch through $(1,2)$, $y=\\frac{-3x+\\sqrt{5x^2+44}}{2}$, its derivative at $x=1$ is also $-\\frac{8}{7}$."
  },
  "tmpl-int-usub-poly-002": {
    "spot": "Inside the parentheses is $x^2+4$, and outside there is exactly $x$: let $u=x^2+4$; no need to expand the fourth power.",
    "why": "Expanding $(x^2+4)^4$ gives five terms to multiply by $x$; after substitution it's just a power integral of $u^4$.",
    "steps": [
      "$u=x^2+4$, $du=2x\\,dx$.",
      "$\\int x(x^2+4)^4dx=\\frac{1}{2}\\int u^4du=\\frac{u^5}{10}+C$.",
      "Substitute back: $\\frac{(x^2+4)^5}{10}+C$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ and writing $\\frac{(x^2+4)^5}{5}$.",
    "check": "Check with the definite integral $\\int_0^1$: $\\frac{5^5-4^5}{10}=210.1$."
  },
  "tmpl-int-usub-poly-003": {
    "spot": "The $x$ outside is exactly half the derivative of $x^2+2$: let $u=x^2+2$ and keep the fifth power intact.",
    "why": "After substitution it's $u^5$, much faster than expanding to the sixth power.",
    "steps": [
      "$u=x^2+2$, $x\\,dx=\\frac{du}{2}$.",
      "$\\frac{1}{2}\\int u^5du=\\frac{u^6}{12}+C$.",
      "Substitute back: $\\frac{(x^2+2)^6}{12}+C$."
    ],
    "trap": "Raising the power by one but forgetting to divide by it: writing $\\frac{(x^2+2)^6}{2}$.",
    "check": "Check with the definite integral $\\int_0^1$: $\\frac{3^6-2^6}{12}=\\frac{665}{12}$."
  },
  "tmpl-int-usub-poly-004": {
    "spot": "$x(x^2+5)^2$: the $x$ outside pairs with the derivative $2x$ of the inner $x^2+5$ — substitute $u=x^2+5$.",
    "why": "With such a low degree, expanding works too, but substitution is one step and gives the answer in the standard form.",
    "steps": [
      "$u=x^2+5$, $du=2x\\,dx$.",
      "$\\frac{1}{2}\\int u^2du=\\frac{u^3}{6}+C$.",
      "Substitute back: $\\frac{(x^2+5)^3}{6}+C$."
    ],
    "trap": "Writing $\\frac{(x^2+5)^3}{3}$, missing the $\\frac{1}{2}$ from $du=2x\\,dx$.",
    "check": "Check by expanding: $x(x^2+5)^2=x^5+10x^3+25x$, which integrates over $[0,1]$ to $\\frac{1}{6}+\\frac{5}{2}+\\frac{25}{2}=\\frac{91}{6}$."
  },
  "tmpl-int-usub-poly-005": {
    "spot": "$(x^2+3)^6$ multiplied by $x$: the classic $u=x^2+3$ substitution; no need to expand the sixth power.",
    "why": "After substitution it's $\\frac{1}{2}\\int u^6du$; expanding gives seven terms.",
    "steps": [
      "$u=x^2+3$, $x\\,dx=\\frac{du}{2}$.",
      "$\\frac{1}{2}\\int u^6du=\\frac{u^7}{14}+C$.",
      "Substitute back: $\\frac{(x^2+3)^7}{14}+C$."
    ],
    "trap": "Getting the power wrong by leaving it at $(x^2+3)^6$ instead of adding one, or putting $7$ in the denominator and missing the $2$.",
    "check": "Check with the definite integral $\\int_0^1$: $\\frac{4^7-3^7}{14}=\\frac{14197}{14}$."
  },
  "der-050": {
    "spot": "$x^2+y^2$ is the squared distance to the origin, and the constraint is a line: the answer is the square of the distance from the origin to the line $x+2y=5$.",
    "why": "The constraint is linear, so substituting to get a one-variable quadratic is most direct; Lagrange multipliers work too, but add an extra unknown.",
    "steps": [
      "From the constraint $x=5-2y$, the objective becomes $g(y)=(5-2y)^2+y^2$.",
      "$g'(y)=-4(5-2y)+2y=10y-20=0\\Rightarrow y=2$, $x=1$.",
      "$g''=10>0$, so it's a minimum; $g(2)=1+4=5$."
    ],
    "trap": "Answering with the distance $\\sqrt 5$; the problem asks for $x^2+y^2$, the squared distance.",
    "check": "Point-to-line distance formula: $\\frac{|0+0-5|}{\\sqrt{1+4}}=\\sqrt 5$, and its square is $5$."
  },
  "der-063": {
    "spot": "Wronskian: the first row is the functions, the second row their first derivatives, the third row their second derivatives; differentiating $1,x,x^2$ makes the matrix upper triangular.",
    "why": "The determinant of an upper triangular matrix is the product of the diagonal; no expansion needed.",
    "steps": [
      "Matrix $\\begin{pmatrix}1&x&x^2\\\\0&1&2x\\\\0&0&2\\end{pmatrix}$: the second row is $0,1,2x$.",
      "The third row is $0,0,2$.",
      "Upper triangular, so the determinant $=1\\cdot 1\\cdot 2=2$."
    ],
    "trap": "Writing the third row as $0,1,2x$ (repeating the first derivatives), getting determinant $0$ and wrongly concluding the three are linearly dependent.",
    "check": "$1,x,x^2$ are linearly independent, so the Wronskian should not be $0$."
  },
  "exam-der-004": {
    "spot": "It has the shape $\\frac{1+x}{1-x}=\\frac{\\tan\\frac{\\pi}{4}+\\tan u}{1-\\tan\\frac{\\pi}{4}\\tan u}$: this function is $\\arctan x+\\frac{\\pi}{4}$ (up to a constant), so the derivative must be $\\frac{1}{1+x^2}$.",
    "why": "Recognize the tangent addition formula and there's nothing to compute; grinding through the Chain Rule also works, and simplifies to the same thing.",
    "steps": [
      "Inner derivative: $\\left(\\frac{1+x}{1-x}\\right)'=\\frac{(1-x)+(1+x)}{(1-x)^2}=\\frac{2}{(1-x)^2}$.",
      "Outer: $1+\\left(\\frac{1+x}{1-x}\\right)^2=\\frac{(1-x)^2+(1+x)^2}{(1-x)^2}=\\frac{2(1+x^2)}{(1-x)^2}$.",
      "Divide: $\\frac{2}{(1-x)^2}\\cdot\\frac{(1-x)^2}{2(1+x^2)}=\\frac{1}{1+x^2}$."
    ],
    "trap": "Getting the inner derivative's numerator as something like $(1-x)-(1+x)=-2x$, flipping a sign in the Quotient Rule and ending up with an extra minus sign.",
    "check": "For $x<1$, $\\arctan\\frac{1+x}{1-x}=\\arctan x+\\frac{\\pi}{4}$; e.g. at $x=0$ both sides are $\\frac{\\pi}{4}$."
  },
  "int-049": {
    "spot": "The denominator $\\sqrt{4-x^2}$ is \"$a^2-x^2$\": trigonometric substitution $x=2\\sin\\theta$; the root becomes $2\\cos\\theta$, which cancels exactly with $dx$.",
    "why": "After substitution the integrand is just $4\\sin^2\\theta$, and the blow-up at the upper limit $x=2$ disappears too.",
    "steps": [
      "$x=2\\sin\\theta$, $dx=2\\cos\\theta\\,d\\theta$, $\\sqrt{4-x^2}=2\\cos\\theta$; $x:0\\to 2$ corresponds to $\\theta:0\\to\\frac{\\pi}{2}$.",
      "Integrand: $\\frac{4\\sin^2\\theta}{2\\cos\\theta}\\cdot 2\\cos\\theta=4\\sin^2\\theta$.",
      "$4\\int_0^{\\pi/2}\\sin^2\\theta\\,d\\theta=4\\cdot\\frac{\\pi}{4}=\\pi$."
    ],
    "trap": "Seeing the denominator become $0$ at the upper limit and assuming divergence; the singularity is of type $\\frac{1}{\\sqrt{2-x}}$, which is integrable.",
    "check": "$\\int_0^2\\frac{x^2}{\\sqrt{4-x^2}}dx$ is less than $\\int_0^2\\frac{4}{\\sqrt{4-x^2}}dx=2\\pi$, so $\\pi$ is reasonable."
  },
  "int-063": {
    "spot": "Interval $[0,\\frac{\\pi}{2}]$ and denominator $2+\\sin x+\\cos x$ symmetric under $\\sin\\leftrightarrow\\cos$: $x\\to\\frac{\\pi}{2}-x$ gives an equal integral with \"numerator replaced by $1+\\cos x$\", and adding the two makes the numerator equal the denominator.",
    "why": "The universal substitution $t=\\tan\\frac{x}{2}$ produces an ugly rational function; the symmetry trick finishes in two lines.",
    "steps": [
      "Let $x\\to\\frac{\\pi}{2}-x$: $\\sin$ and $\\cos$ swap and the denominator is unchanged, so $I=\\int_0^{\\pi/2}\\frac{1+\\cos x}{2+\\sin x+\\cos x}dx$.",
      "Add the two: the numerator $(1+\\sin x)+(1+\\cos x)$ is exactly the denominator, so $2I=\\int_0^{\\pi/2}1\\,dx=\\frac{\\pi}{2}$.",
      "So $I=\\frac{\\pi}{4}$."
    ],
    "trap": "Thinking the numerator is \"half\" the denominator and treating the integrand as $\\frac{1}{2}$; it isn't constant — only the sum of the two swapped versions equals $1$.",
    "check": "The integrand is $\\frac{1}{3}$ at $0$ and $\\frac{2}{3}$ at $\\frac{\\pi}{2}$, averaging about $\\frac{1}{2}$; times the interval length $\\frac{\\pi}{2}$ gives $\\frac{\\pi}{4}$."
  },
  "lec-02-q2d": {
    "spot": "A root around $1+\\cos^2x$, and $\\cos^2x$ is the square of $\\cos x$: three layers of Chain Rule (root → square → cosine).",
    "why": "Multiplying derivatives layer by layer from the outside in is the way to avoid missing one.",
    "steps": [
      "Outer: $\\left(\\sqrt u\\right)'=\\frac{1}{2\\sqrt u}$, $u=1+\\cos^2x$.",
      "Middle and inner: $(\\cos^2x)'=2\\cos x\\cdot(-\\sin x)$.",
      "Multiply: $y'=\\frac{-2\\sin x\\cos x}{2\\sqrt{1+\\cos^2x}}=-\\frac{\\sin x\\cos x}{\\sqrt{1+\\cos^2x}}$."
    ],
    "trap": "Writing the derivative of $\\cos x$ as $+\\sin x$, so the whole answer is off by a sign.",
    "check": "At $x=0$, $\\cos^2x$ is at its max, so the function has a local max and the derivative is $0$."
  },
  "lec-02-q3c": {
    "spot": "$x^2$ times $\\sin\\frac{1}{x}$: Product Rule, and $\\sin\\frac{1}{x}$ itself needs the Chain Rule (the inner $\\frac{1}{x}$ has derivative $-\\frac{1}{x^2}$).",
    "why": "For $x\\ne 0$ it's an ordinary differentiable function, so Product Rule plus Chain Rule does it; the $-\\frac{1}{x^2}$ cancels neatly with $x^2$.",
    "steps": [
      "Product Rule: $(x^2)'\\sin\\frac{1}{x}+x^2\\left(\\sin\\frac{1}{x}\\right)'$; the first half is $2x\\sin\\frac{1}{x}$.",
      "Chain Rule: $\\left(\\sin\\frac{1}{x}\\right)'=\\cos\\frac{1}{x}\\cdot\\left(-\\frac{1}{x^2}\\right)$.",
      "Second half: $x^2\\cdot\\left(-\\frac{\\cos(1/x)}{x^2}\\right)=-\\cos\\frac{1}{x}$. Altogether $f'(x)=2x\\sin\\frac{1}{x}-\\cos\\frac{1}{x}$."
    ],
    "trap": "Missing the inner derivative and writing $2x\\sin\\frac{1}{x}+x^2\\cos\\frac{1}{x}$.",
    "check": "As $x\\to 0$, $2x\\sin\\frac{1}{x}\\to 0$ but $\\cos\\frac{1}{x}$ keeps oscillating: at $x=\\frac{1}{2\\pi\\cdot 10}$ the derivative is $-1$."
  },
  "lec-03-q4b": {
    "spot": "Ladder length $5$ fixed, the rate of the foot's distance $x$ from the wall known, asking about the angle: adjacent side $x$, hypotenuse $5$, linked by $\\cos\\theta=\\frac{x}{5}$.",
    "why": "$\\cos$ involves only the known $x$ and the fixed $5$; $\\tan$ would drag in the height, one more quantity to differentiate.",
    "steps": [
      "$\\cos\\theta=\\frac{x}{5}$; differentiate with respect to $t$: $-\\sin\\theta\\,\\frac{d\\theta}{dt}=\\frac{1}{5}\\frac{dx}{dt}$.",
      "At $x=3$ the height is $\\sqrt{25-9}=4$, so $\\sin\\theta=\\frac{4}{5}$.",
      "$\\frac{d\\theta}{dt}=-\\frac{1/5}{4/5}\\cdot 1=-\\frac{1}{4}$.",
      "Direct check: $x=3+t$; take the derivative of $\\theta=\\arccos\\frac{3+t}{5}$ at $t=0$."
    ],
    "trap": "Forgetting the minus sign from differentiating $\\cos$ and answering $+\\frac{1}{4}$; the ladder is sliding out, so the angle must be decreasing.",
    "check": "As the foot slides out, the ladder gets flatter and $\\theta$ decreases, so the rate is negative."
  },
  "lec-07-q1c": {
    "spot": "$\\arctan x$ on its own, with no ready-made antiderivative: integration by parts with $u=\\arctan x$, $dv=dx$, differentiating it into a rational function.",
    "why": "Inverse trig functions differentiate into algebraic expressions; after integration by parts what's left is $\\int\\frac{x}{1+x^2}dx$, one substitution.",
    "steps": [
      "$\\int\\arctan x\\,dx=x\\arctan x-\\int\\frac{x}{1+x^2}dx$.",
      "$\\int\\frac{x}{1+x^2}dx=\\frac{1}{2}\\ln(1+x^2)$.",
      "Evaluate from $0$ to $1$: $1\\cdot\\frac{\\pi}{4}-\\frac{1}{2}\\ln 2$.",
      "So the integral $=\\frac{\\pi}{4}-\\frac{\\ln 2}{2}\\approx 0.439$."
    ],
    "trap": "Writing $\\int\\frac{x}{1+x^2}dx$ as $\\ln(1+x^2)$ without the $\\frac{1}{2}$, getting $\\frac{\\pi}{4}-\\ln 2$.",
    "check": "On $[0,1]$, $\\arctan x$ rises from $0$ to $\\frac{\\pi}{4}$ and is concave down, so the integral lies between $\\frac{\\pi}{8}$ and $\\frac{\\pi}{4}$."
  },
  "lec-07-q1d": {
    "spot": "$x$ times $\\ln x$: in integration by parts let $\\ln x$ be the one you differentiate (the LIATE rule); $\\ln x$ becomes $\\frac{1}{x}$, which cancels against $x^2$.",
    "why": "Integrating $\\ln x$ instead would be messier; differentiate it, and all that's left is $\\int\\frac{x}{2}dx$.",
    "steps": [
      "$u=\\ln x$, $dv=x\\,dx$: $\\int x\\ln x\\,dx=\\frac{x^2}{2}\\ln x-\\int\\frac{x}{2}dx$.",
      "Antiderivative $\\frac{x^2}{2}\\ln x-\\frac{x^2}{4}$.",
      "At $e$: $\\frac{e^2}{2}-\\frac{e^2}{4}=\\frac{e^2}{4}$; at $1$: $-\\frac{1}{4}$.",
      "Subtract: $\\frac{e^2+1}{4}$."
    ],
    "trap": "Assuming the whole thing is $0$ at the lower limit $1$; $\\ln 1=0$ kills only the first term, the $-\\frac{1}{4}$ remains, and subtracting it gives $+\\frac{1}{4}$.",
    "check": "On $[1,e]$, $x\\ln x$ rises from $0$ to $e$, so the integral should be between $0$ and $e(e-1)\\approx 4.67$; $\\frac{e^2+1}{4}\\approx 2.10$."
  },
  "lec-07-q4c": {
    "spot": "$(1+x^2)^{3/2}$: a root power of \"$1+x^2$\" — substitute $x=\\tan\\theta$, since $1+\\tan^2\\theta=\\sec^2\\theta$.",
    "why": "After substituting, $\\frac{\\sec^2\\theta}{\\sec^3\\theta}=\\cos\\theta$, about the simplest integral there is.",
    "steps": [
      "$x=\\tan\\theta$, $dx=\\sec^2\\theta\\,d\\theta$, $(1+x^2)^{3/2}=\\sec^3\\theta$; $x:0\\to1$ corresponds to $\\theta:0\\to\\frac{\\pi}{4}$.",
      "The integrand becomes $\\frac{\\sec^2\\theta}{\\sec^3\\theta}=\\cos\\theta$.",
      "$\\int_0^{\\pi/4}\\cos\\theta\\,d\\theta=\\sin\\frac{\\pi}{4}=\\frac{\\sqrt 2}{2}$.",
      "Computing the original integral directly gives the same."
    ],
    "trap": "Changing the variable but not the limits, computing $\\int_0^1\\cos\\theta\\,d\\theta=\\sin 1$.",
    "check": "The antiderivative $\\frac{x}{\\sqrt{1+x^2}}$ equals $\\frac{1}{\\sqrt 2}$ at $1$."
  },
  "lec-08-q4a": {
    "spot": "There's a $\\sqrt x$ in the denominator and the problem specifies $u=\\sqrt x$: $x=u^2$, $dx=2u\\,du$, giving the rational function $\\frac{2u}{1+u}$.",
    "why": "The substitution removes the root; $\\frac{2u}{1+u}=2-\\frac{2}{1+u}$ by long division, and then it integrates in one step.",
    "steps": [
      "$u=\\sqrt x$, $dx=2u\\,du$, and the integral becomes $\\int\\frac{2u}{1+u}du$.",
      "Long division: $\\frac{2u}{1+u}=2-\\frac{2}{1+u}$.",
      "Integrate: $2u-2\\ln(1+u)+C$.",
      "Substitute back: $2\\sqrt x-2\\ln(1+\\sqrt x)+C$."
    ],
    "trap": "Substituting in the integrand but not in $dx$, computing $\\int\\frac{du}{1+u}=\\ln(1+\\sqrt x)$.",
    "check": "Definite-integral check: $\\int_0^1\\frac{dx}{1+\\sqrt x}=2-2\\ln 2$."
  },
  "lec-09-q3b": {
    "spot": "$y'=x-\\frac{1}{4x}$; squaring gives a middle cross term of $-\\frac{1}{2}$, and adding $1$ turns it into $+\\frac{1}{2}$, exactly completing $\\left(x+\\frac{1}{4x}\\right)^2$ — the root comes right off.",
    "why": "This \"$a-b$ with $2ab=\\frac{1}{2}$\" design is meant to make $1+(y')^2$ a perfect square; once you see it, only a polynomial plus $\\frac{1}{x}$ is left to integrate.",
    "steps": [
      "$y'=x-\\frac{1}{4x}$.",
      "$1+(y')^2=x^2+\\frac{1}{2}+\\frac{1}{16x^2}=\\left(x+\\frac{1}{4x}\\right)^2$.",
      "Arc length $=\\int_1^e\\left(x+\\frac{1}{4x}\\right)dx=\\frac{e^2-1}{2}+\\frac{1}{4}$.",
      "Simplify: $\\frac{e^2}{2}-\\frac{1}{4}$."
    ],
    "trap": "Thinking $1+(y')^2=\\left(x-\\frac{1}{4x}\\right)^2$ (middle sign unchanged) and integrating to $\\frac{e^2-1}{2}-\\frac{1}{4}$.",
    "check": "The integrand $x+\\frac{1}{4x}$ is bigger than $x$, so the arc length must exceed $\\int_1^ex\\,dx=\\frac{e^2-1}{2}\\approx 3.19$; the answer is about $3.44$."
  },
  "lec-14-q2c": {
    "spot": "The derivative of $\\arctan x$, $\\frac{1}{1+x^2}$, is a geometric series with ratio $-x^2$: integrate term by term, and $x^7$ comes from the $-x^6$ term.",
    "why": "Differentiating seven times to get $f^{(7)}(0)$ is exhausting; integrating the geometric series shows all coefficients $\\frac{(-1)^k}{2k+1}$ in one line.",
    "steps": [
      "$\\frac{1}{1+t^2}=1-t^2+t^4-t^6+\\frac{t^8}{1+t^2}$ (geometric series plus exact remainder).",
      "Integrate from $0$ to $x$: $\\arctan x=x-\\frac{x^3}{3}+\\frac{x^5}{5}-\\frac{x^7}{7}+\\int_0^x\\frac{t^8}{1+t^2}dt$, with remainder of order $x^9$.",
      "The $x^7$ term comes from $\\int_0^x(-t^6)dt=-\\frac{x^7}{7}$, so the coefficient is $-\\frac{1}{7}$."
    ],
    "trap": "Copying the pattern of $\\sin x$ and writing $-\\frac{1}{7!}$; in the $\\arctan$ series the denominators are the odd numbers themselves, not factorials.",
    "check": "The coefficients run $1,-\\frac{1}{3},\\frac{1}{5},-\\frac{1}{7}$: alternating signs, odd denominators."
  },
  "lec-15-q2c": {
    "spot": "The numerator is $\\cos x$ minus the first two terms of its Taylor expansion, $1-\\frac{x^2}{2}$, over $x^4$: the $x^4$ term of the expansion is the answer.",
    "why": "L'Hôpital's Rule would take four differentiations; the expansion reads off the coefficient of $\\frac{x^4}{4!}$ in one line.",
    "steps": [
      "Plug in $x=0$: numerator $1-1+0=0$, a $\\frac{0}{0}$ form.",
      "$\\cos x=1-\\frac{x^2}{2}+\\frac{x^4}{24}-\\frac{x^6}{720}+\\cdots$.",
      "Numerator $=\\frac{x^4}{24}-\\frac{x^6}{720}+\\cdots$; divided by $x^4$ it tends to $\\frac{1}{24}$."
    ],
    "trap": "Remembering it as $\\frac{x^4}{4}$ or $\\frac{x^4}{12}$; the coefficient of $x^4$ is $\\frac{1}{4!}=\\frac{1}{24}$.",
    "check": "Plug in $x=0.1$: the ratio is about $0.041653$, a bit below $\\frac{1}{24}\\approx 0.041667$ (the next term is negative)."
  },
  "lec-15-q4a": {
    "spot": "$(1+x)^{-1/2}$ is a binomial series with exponent $k=-\\frac{1}{2}$: the coefficient of $x^3$ is $\\binom{-1/2}{3}=\\frac{k(k-1)(k-2)}{3!}$.",
    "why": "Plugging into the generalized binomial coefficient formula saves a step over differentiating three times and dividing by $3!$ (the two are really the same).",
    "steps": [
      "$\\binom{k}{3}=\\frac{k(k-1)(k-2)}{6}$, $k=-\\frac{1}{2}$.",
      "Divide by $6$: $-\\frac{15}{8}\\cdot\\frac{1}{6}=-\\frac{5}{16}$.",
      "Compare with differentiation: $f'(x)=-\\frac{1}{2}(1+x)^{-3/2}$; two more derivatives give $f'''(x)=-\\frac{15}{8}(1+x)^{-7/2}$, so $f'''(0)=-\\frac{15}{8}$.",
      "Coefficient $\\frac{f'''(0)}{3!}=-\\frac{5}{16}$."
    ],
    "trap": "Forgetting to divide by $3!$ and answering $-\\frac{15}{8}$; or computing $(k-1)(k-2)$ as the positive $\\frac{1}{2}\\cdot\\frac{3}{2}$ and losing a minus sign.",
    "check": "Plug in $x=0.1$: $1-\\frac{x}{2}+\\frac{3x^2}{8}-\\frac{5x^3}{16}$ differs from $\\frac{1}{\\sqrt{1.1}}$ by less than $10^{-4}$."
  },
  "refine-derivatives-011": {
    "spot": "Second derivative of an implicit function: implicit differentiation first gives $y'=-\\frac{x^2}{y^2}$; differentiate that quotient once more, and substitute back for the $y'$ that appears.",
    "why": "Solving $y=(9-x^3)^{1/3}$ and differentiating twice also works, but the implicit expressions are smaller and the numbers at $(1,2)$ come out clean.",
    "steps": [
      "$3x^2+3y^2y'=0\\Rightarrow y'=-\\frac{x^2}{y^2}$; at $(1,2)$: $y'=-\\frac{1}{4}$.",
      "Quotient Rule: $y''=-\\frac{2xy^2-x^2\\cdot 2yy'}{y^4}$.",
      "Substitute: $-\\frac{8+1}{16}=-\\frac{9}{16}$.",
      "Computing the second derivative directly from the explicit $y=(9-x^3)^{1/3}$ gives the same value."
    ],
    "trap": "Treating $y$ as a constant when differentiating $-\\frac{x^2}{y^2}$, getting only $-\\frac{2x}{y^2}=-\\frac{1}{2}$.",
    "check": "The curve $x^3+y^3=9$ is concave down in the first quadrant, so $y''<0$."
  },
  "refine-derivatives-014": {
    "spot": "$x^y$ is a power function in $x$ and an exponential in $y$: compute the three second partials separately and plug in $(e,1)$, where $\\ln e=1$ keeps the numbers clean.",
    "why": "The Hessian determinant $f_{xx}f_{yy}-f_{xy}^2$ needs only three numbers; the key is that $f_{xy}$ needs the Product Rule.",
    "steps": [
      "$f_x=yx^{y-1}$, $f_{xx}=y(y-1)x^{y-2}$; this is $0$ at $y=1$.",
      "$f_y=x^y\\ln x$, $f_{yy}=x^y(\\ln x)^2$; this is $e$ at $(e,1)$.",
      "$f_{xy}=\\frac{\\partial}{\\partial y}\\left(yx^{y-1}\\right)=x^{y-1}+yx^{y-1}\\ln x$; at $(e,1)$ this is $1+1=2$.",
      "Determinant: $0\\cdot e-2^2=-4$."
    ],
    "trap": "In $f_{xy}$, differentiating only $x^{y-1}$ and missing the leading $y$, getting $f_{xy}=1$ and determinant $-1$.",
    "check": "The determinant is negative, so near $(e,1)$ the surface is saddle-shaped, consistent with $f_{xx}=0$ and $f_{xy}\\ne 0$."
  },
  "refine-derivatives-016": {
    "spot": "$u=e^x\\cos y$, $v=e^x\\sin y$ is polar coordinates with $r=e^x$, $\\theta=y$: the Jacobian should be $r\\cdot\\frac{dr}{dx}=e^{2x}$.",
    "why": "Write out the $2\\times 2$ matrix of partial derivatives; after cross-multiplying, $\\cos^2+\\sin^2=1$.",
    "steps": [
      "$u_x=e^x\\cos y$, $u_y=-e^x\\sin y$.",
      "$v_x=e^x\\sin y$, $v_y=e^x\\cos y$.",
      "$u_xv_y-u_yv_x=e^{2x}\\cos^2y+e^{2x}\\sin^2y=e^{2x}$."
    ],
    "trap": "Getting the sign of the cross term wrong and ending up with $e^{2x}(\\cos^2y-\\sin^2y)=e^{2x}\\cos 2y$.",
    "check": "The determinant doesn't depend on $y$ and is always positive: the map is locally invertible, and at $x=0$ the determinant is $1$."
  },
  "refine-derivatives-020": {
    "spot": "$f=(x^2+y^2)^{3/2}=r^3$, and at the point $(3,4)$, $r=5$ is an integer: write all the partials in terms of $r$ and plugging in is clean.",
    "why": "Differentiating with $r_x=\\frac{x}{r}$ gives $f_x=3xr$ in one line, and the second order is easy too; after simplifying, the determinant turns out to be $18r^2$.",
    "steps": [
      "$f_x=3x\\sqrt{x^2+y^2}$, $f_{xx}=3r+\\frac{3x^2}{r}$; at $(3,4)$: $15+\\frac{27}{5}=\\frac{102}{5}$.",
      "By symmetry $f_{yy}=3r+\\frac{3y^2}{r}=15+\\frac{48}{5}=\\frac{123}{5}$.",
      "$f_{xy}=\\frac{3xy}{r}=\\frac{36}{5}$.",
      "Determinant $\\frac{102\\cdot 123-36^2}{25}=\\frac{11250}{25}=450$."
    ],
    "trap": "Writing $f_{xx}$ as just $3r$, missing the $\\frac{3x^2}{r}$ from differentiating $r$ itself, so the determinant comes out as $225-\\frac{1296}{25}$.",
    "check": "In general the determinant $=18(x^2+y^2)$, which at $(3,4)$ is $18\\cdot 25=450$."
  },
  "cl-der-012": {
    "spot": "The normal vector to the surface $F(x,y,z)=6$ is the gradient $\\nabla F=\\langle 2x,4y,6z\\rangle$: write the parametric line through $(1,1,1)$ and set $z=0$.",
    "why": "The gradient gives the normal direction in one step; no need to find the tangent plane first.",
    "steps": [
      "$\\nabla F(1,1,1)=\\langle 2,4,6\\rangle$; we can take the direction $\\langle 1,2,3\\rangle$.",
      "Normal line $(1+s,\\ 1+2s,\\ 1+3s)$. $z=0$ when $s=-\\frac{1}{3}$.",
      "$x=1-\\frac{1}{3}=\\frac{2}{3}$."
    ],
    "trap": "Using the point's coordinates $\\langle 1,1,1\\rangle$ as the normal vector; the line $(1+s,1+s,1+s)$ hits $z=0$ at $s=-1$, giving $x=0$.",
    "check": "The intersection $\\left(\\frac{2}{3},\\frac{1}{3},0\\right)$ minus $(1,1,1)$ is $\\left(-\\frac{1}{3},-\\frac{2}{3},-1\\right)$, parallel to $\\langle 1,2,3\\rangle$."
  },
  "cl-der-027": {
    "spot": "A high-order derivative at $0$ = Taylor coefficient times factorial: $x^2e^{2x}=\\sum\\frac{2^k}{k!}x^{k+2}$, and $x^{10}$ corresponds to $k=8$.",
    "why": "The Leibniz formula works too, but reading the coefficient off the series takes one line: $f^{(10)}(0)=10!\\cdot\\frac{2^8}{8!}=10\\cdot 9\\cdot 2^8$.",
    "steps": [
      "$e^{2x}=\\sum_k\\frac{(2x)^k}{k!}$; after multiplying by $x^2$, the coefficient of $x^{10}$ is $\\frac{2^8}{8!}$.",
      "$f^{(10)}(0)=10!\\times\\frac{2^8}{8!}=10\\cdot 9\\cdot 256$.",
      "So $f^{(10)}(0)=23040$."
    ],
    "trap": "Stopping at $\\frac{2^8}{8!}$ and calling it the answer, or multiplying by $8!$ instead of $10!$ and getting $256$.",
    "check": "Leibniz: only the term with $(x^2)''=2$ is nonzero at $0$, giving $\\binom{10}{2}\\cdot 2\\cdot 2^8=45\\cdot 512$."
  },
  "cl-der-028": {
    "spot": "$x^2\\sin x=x^3-\\frac{x^5}{3!}+\\frac{x^7}{5!}-\\frac{x^9}{7!}+\\cdots$: the coefficient of $x^9$ times $9!$ is $f^{(9)}(0)$.",
    "why": "Reading the coefficient off the series is much faster than differentiating nine times; $\\frac{9!}{7!}=72$.",
    "steps": [
      "The $x^7$ coefficient of $\\sin x$ is $-\\frac{1}{7!}$; multiplying by $x^2$ makes it the coefficient of $x^9$.",
      "$f^{(9)}(0)=9!\\cdot\\left(-\\frac{1}{7!}\\right)=-9\\cdot 8$.",
      "So $f^{(9)}(0)=-72$."
    ],
    "trap": "Using the $x^9$ coefficient of $\\sin x$, $\\frac{1}{9!}$, and getting $1$; after multiplying by $x^2$ you have to step back two terms.",
    "check": "Leibniz: $\\binom{9}{2}\\cdot 2\\cdot\\sin^{(7)}(0)=36\\cdot 2\\cdot(-1)=-72$."
  },
  "cl-int-026": {
    "spot": "Recursion for $\\tan^n x$: split off one $\\tan^2x=\\sec^2x-1$; the $\\tan^{n-2}x\\sec^2x$ part integrates directly — giving $I_n+I_{n-2}=\\frac{1}{n-1}$.",
    "why": "The recursion steps $I_6$ all the way down to $I_0=\\frac{\\pi}{4}$, without ever touching an antiderivative of $\\tan^6$.",
    "steps": [
      "$I_n+I_{n-2}=\\int_0^{\\pi/4}\\tan^{n-2}x\\sec^2x\\,dx=\\frac{\\tan^{n-1}x}{n-1}\\Big|_0^{\\pi/4}=\\frac{1}{n-1}$.",
      "$I_0=\\frac{\\pi}{4}$, $I_2=1-\\frac{\\pi}{4}$.",
      "$I_4=\\frac{1}{3}-I_2=\\frac{\\pi}{4}-\\frac{2}{3}$.",
      "$I_6=\\frac{1}{5}-I_4=\\frac{13}{15}-\\frac{\\pi}{4}$."
    ],
    "trap": "Writing the recursion as $I_n=\\frac{1}{n-1}+I_{n-2}$ (wrong sign), which makes $I_6$ bigger than $1$; but $0\\le\\tan x\\le 1$, so $I_6$ should be small.",
    "check": "$0\\le\\tan^6x\\le\\tan^4x$, so $0<I_6<I_4\\approx 0.119$; the answer is about $0.081$."
  },
  "cl-int-033": {
    "spot": "Polar arc length is $\\int\\sqrt{r^2+(r')^2}\\,d\\theta$; with $r=\\theta^2$, the root contains $\\theta^4+4\\theta^2=\\theta^2(\\theta^2+4)$, and after pulling out $\\theta$ a substitution finishes it.",
    "why": "$\\theta\\sqrt{\\theta^2+4}$ is the \"inner derivative sitting outside\" pattern; $u=\\theta^2+4$ in one step.",
    "steps": [
      "$r'=2\\theta$, $r^2+(r')^2=\\theta^4+4\\theta^2$.",
      "For $\\theta\\ge0$ the root $=\\theta\\sqrt{\\theta^2+4}$, with antiderivative $\\frac{1}{3}(\\theta^2+4)^{3/2}$.",
      "Evaluate at $\\sqrt 5$ and $0$: $\\frac{27-8}{3}=\\frac{19}{3}$."
    ],
    "trap": "Using the Cartesian-style $\\int\\sqrt{1+(r')^2}d\\theta$ and missing the $r^2$.",
    "check": "The lower limit gives $\\frac{(0+4)^{3/2}}{3}=\\frac{8}{3}$, not $0$: if you forget to subtract the $\\frac{8}{3}$ you get $9$."
  },
  "cl-int-037": {
    "spot": "The coefficients $x^2,\\ x,\\ 1$ line up with the order of the derivatives: an Euler–Cauchy equation; try $y=x^m$ to get the characteristic equation.",
    "why": "Substituting $x^m$ turns the differential equation into a quadratic, and its two real roots give the general solution directly.",
    "steps": [
      "Substitute $y=x^m$: $m(m-1)-2m+2=m^2-3m+2=(m-1)(m-2)=0$, $m=1,2$.",
      "General solution $y=Ax+Bx^2$; $y(1)=A+B=1$, $y'(1)=A+2B=3$, giving $B=2$, $A=-1$.",
      "$y=2x^2-x$ satisfies the equation: $y''=\\frac{2xy'-2y}{x^2}$.",
      "$y(2)=8-2=6$."
    ],
    "trap": "Writing the characteristic equation as $m^2-2m+2$ (forgetting the $-m$ inside $m(m-1)$), which gives complex roots.",
    "check": "Initial conditions: $y(1)=1$ and $y'(1)=3$ both hold."
  },
  "cl-int-038": {
    "spot": "$x^2y''+xy'+4y=0$ is an Euler–Cauchy equation whose characteristic equation $m^2+4=0$ has purely imaginary roots $\\pm 2i$ — the solutions are $\\cos(2\\ln x)$, $\\sin(2\\ln x)$.",
    "why": "Substituting $x=e^s$ turns it into the constant-coefficient $y''+4y=0$; asking for $y(e)$ corresponds exactly to $s=1$.",
    "steps": [
      "Substitute $y=x^m$: $m(m-1)+m+4=m^2+4=0$, $m=\\pm 2i$.",
      "General solution $y=A\\cos(2\\ln x)+B\\sin(2\\ln x)$; $y(1)=A=1$, $y'(1)=2B=0$.",
      "$y=\\cos(2\\ln x)$ satisfies $y''=\\frac{-xy'-4y}{x^2}$.",
      "$y(e)=\\cos(2\\ln e)=\\cos 2$."
    ],
    "trap": "Writing the solution as $\\cos 2x$ (forgetting that the natural variable of an Euler equation is $\\ln x$), getting $y(e)=\\cos 2e$.",
    "check": "$\\cos 2\\approx -0.416$: $2$ radians is more than $\\frac{\\pi}{2}$, so the cosine is negative."
  },
  "der-058": {
    "spot": "$\\ln(x^2+y^2)$ is harmonic, so $f_{xx}=-f_{yy}$; at $(1,0)$ the cross term is also $0$, so the determinant must be $-f_{xx}^2$.",
    "why": "All three second partials are short; computing them and plugging in is fastest.",
    "steps": [
      "$f_x=\\frac{2x}{x^2+y^2}$, $f_{xx}=\\frac{2(y^2-x^2)}{(x^2+y^2)^2}$; at $(1,0)$ this is $-2$.",
      "By symmetry $f_{yy}=\\frac{2(x^2-y^2)}{(x^2+y^2)^2}$, which is $2$ at $(1,0)$.",
      "$f_{xy}=-\\frac{4xy}{(x^2+y^2)^2}$, which is $0$ at $y=0$.",
      "Determinant: $(-2)(2)-0^2=-4$."
    ],
    "trap": "Missing the squared denominator when applying the Quotient Rule to $f_{xx}$, getting something like $\\frac{2}{x^2+y^2}$ and a positive determinant.",
    "check": "For a harmonic function $f_{xx}+f_{yy}=0$, so the determinant $=-f_{xx}^2-f_{xy}^2\\le 0$."
  },
  "der-067": {
    "spot": "$F$ is a function of $u,v$, and $u,v$ are functions of $x,y$: Chain Rule $F_x=F_uu_x+F_vv_x$; or just substitute back to get $F=2x^2+2y^2$.",
    "why": "Both take one line; the Chain Rule is what this problem practices, and substituting back is the check.",
    "steps": [
      "$F_u=2u$, $F_v=2v$; $u_x=1$, $v_x=1$.",
      "$F_x=2u+2v=2(x+y)+2(x-y)=4x$.",
      "Direct check: $\\frac{\\partial}{\\partial x}\\left[(x+y)^2+(x-y)^2\\right]=4x$."
    ],
    "trap": "Thinking $v_x=-1$ (using the derivative of $x-y$ with respect to $y$), getting $F_x=4y$.",
    "check": "In $F=2x^2+2y^2$ the only part not involving $y$ is $2x^2$, and differentiating in $x$ gives $4x$."
  },
  "der-073": {
    "spot": "Two changes of variables $(x,y)\\to(u,v)\\to(p,q)$: multiply the Jacobians, $\\frac{\\partial(p,q)}{\\partial(u,v)}\\cdot\\frac{\\partial(u,v)}{\\partial(x,y)}$.",
    "why": "Writing $p,q$ directly in terms of $x,y$ and taking four partial derivatives is messy; split in two, each is a simple $2\\times 2$ determinant.",
    "steps": [
      "$\\frac{\\partial(u,v)}{\\partial(x,y)}=\\begin{vmatrix}2&1\\\\1&3\\end{vmatrix}=5$.",
      "$\\frac{\\partial(p,q)}{\\partial(u,v)}=\\begin{vmatrix}2u&-2v\\\\2v&2u\\end{vmatrix}=4u^2+4v^2$.",
      "Multiply: $5\\cdot 4(u^2+v^2)=20\\left((2x+y)^2+(x+3y)^2\\right)$.",
      "Direct check: writing $p,q$ in terms of $x,y$ and computing the determinant of partials gives the same result."
    ],
    "trap": "Stopping at $\\frac{\\partial(p,q)}{\\partial(u,v)}=4(u^2+v^2)$ and forgetting to multiply by the inner $5$.",
    "check": "At $x=y=0$, $u=v=0$, the map degenerates at the origin, and the determinant is $0$."
  },
  "int-064": {
    "spot": "Interval $[0,\\pi]$, integrand $x$ times a function of only $\\sin x$ and $\\cos^2x$: use $x\\to\\pi-x$, which lets you replace $x$ by $\\frac{\\pi}{2}$.",
    "why": "$x\\sin x/(1+\\cos^2x)$ has no elementary antiderivative; the symmetry trick removes the $x$, leaving $\\frac{\\sin x}{1+\\cos^2x}$, one $\\arctan$ substitution.",
    "steps": [
      "$x\\to\\pi-x$: $\\sin$ and $\\cos^2$ are unchanged, so $I=\\int_0^\\pi\\frac{(\\pi-x)\\sin x}{1+\\cos^2x}dx$.",
      "Add the two: $2I=\\pi\\int_0^\\pi\\frac{\\sin x}{1+\\cos^2x}dx$.",
      "Let $u=\\cos x$: $\\int_0^\\pi\\frac{\\sin x}{1+\\cos^2x}dx=\\int_{-1}^1\\frac{du}{1+u^2}=\\frac{\\pi}{2}$.",
      "$2I=\\pi\\cdot\\frac{\\pi}{2}$, so $I=\\frac{\\pi^2}{4}$."
    ],
    "trap": "After substituting $u=\\cos x$ the limits run from $1$ to $-1$; forgetting that the minus sign flips them back gives $-\\frac{\\pi}{2}$ and finally $I=-\\frac{\\pi^2}{4}$; the integrand is nonnegative, so the answer can't be negative.",
    "check": "$\\frac{\\pi^2}{4}\\approx 2.47$: the integrand is nonnegative with max about $1.8$, integrated over an interval of length $\\pi$, so the result is less than $1.8\\pi$."
  }
};
