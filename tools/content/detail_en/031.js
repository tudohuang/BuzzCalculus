// Detail v2, English — batch 031. Translation of tools/content/detail/031.js (text only; claims live in the Chinese file).
module.exports = {
  "burst-int-028": {
    "spot": "The denominator $1+x^2$ barely changes under $x\\mapsto\\frac{1}{x}$, while $\\ln x$ flips sign — and the range is exactly $0$ to $\\infty$. That is the signature of the reciprocal substitution.",
    "why": "The integrand has no elementary antiderivative, but the reciprocal substitution folds the $(1,\\infty)$ piece back onto $(0,1)$ with exactly a minus sign, so the two pieces cancel.",
    "steps": [
      "On the $[1,\\infty)$ piece let $x=\\frac{1}{t}$, $dx=-\\frac{dt}{t^2}$: $\\frac{\\ln(1/t)}{1+1/t^2}\\cdot\\frac{1}{t^2}=-\\frac{\\ln t}{1+t^2}$.",
      "The limits $x:1\\to\\infty$ become $t:1\\to 0$; flipping them absorbs the minus sign, giving $\\int_1^\\infty\\frac{\\ln x}{1+x^2}dx=\\int_0^1\\frac{-\\ln t}{1+t^2}dt$.",
      "The $(0,1)$ piece converges on its own ($\\ln x$ is integrable near $0$), about $-0.916$; the $(1,\\infty)$ piece is exactly its negative.",
      "Add the two pieces: $\\int_0^\\infty=\\int_0^1\\frac{\\ln x}{1+x^2}dx+\\int_0^1\\frac{-\\ln x}{1+x^2}dx=0$."
    ],
    "trap": "Thinking $\\ln x$ keeps growing toward $\\infty$, so the integral is positive or divergent; in fact $\\frac{\\ln x}{x^2}$ decays fast enough, and the negative area on $(0,1)$ is exactly as large.",
    "check": "It is clearest written as $\\frac{x\\ln x}{1+x^2}\\cdot\\frac{dx}{x}$: $\\frac{dx}{x}$ is unchanged under the reciprocal substitution, while $\\frac{x\\ln x}{1+x^2}$ takes opposite values at $x$ and $\\frac1x$, e.g. at $x=2$ and $x=\\frac12$."
  },
  "cl-lim-026": {
    "spot": "The cube root and the square root are both \"$x$ plus a small correction\"; after subtracting, $x$ cancels and the remaining constant is set by the coefficients of $x^2$ and $x$ — just expand each root up to its constant term.",
    "why": "Rationalizing a cube root minus a square root is very hard; writing each as $x\\left(1+\\cdots\\right)^{1/n}$ and using a first-order approximation reveals the constant term at a glance.",
    "steps": [
      "$\\sqrt[3]{x^3+ax^2+1}=x\\left(1+\\frac{a}{x}+\\frac{1}{x^3}\\right)^{1/3}=x+\\frac{a}{3}+O\\left(\\frac{1}{x}\\right)$; check with $a=6$: the difference tends to $2$.",
      "$\\sqrt{x^2+3x}=x\\left(1+\\frac{3}{x}\\right)^{1/2}=x+\\frac{3}{2}+O\\left(\\frac{1}{x}\\right)$.",
      "Subtract and $x$ cancels: limit $=\\frac{a}{3}-\\frac{3}{2}$. Set it equal to $1$: $\\frac{a}{3}=\\frac{5}{2}$.",
      "So $a=\\frac{15}{2}$; substituting back, the original limit is indeed $1$."
    ],
    "trap": "Taking the cube root's correction as $\\frac{a}{2}$ too (using the square-root formula), getting $\\frac{a}{2}-\\frac{3}{2}=1$ and $a=5$.",
    "check": "Plug in $x=1000$: $\\sqrt[3]{10^9+7.5\\times10^6+1}-\\sqrt{10^6+3000}$ is about $1.0004$, right next to $1$."
  },
  "db-opt-007": {
    "spot": "The slant height is fixed at $=3$, so radius and height are tied by $r^2+h^2=9$; in the volume $\\frac{\\pi}{3}r^2h$ the $r^2$ can be replaced wholesale by $9-h^2$, giving a cubic in $h$ alone.",
    "why": "Using $h$ as the variable avoids square roots ($r^2$ substitutes directly) and the derivative is a polynomial; using $r$ brings in $\\sqrt{9-r^2}$.",
    "steps": [
      "$V(h)=\\frac{\\pi}{3}(9-h^2)h=\\frac{\\pi}{3}(9h-h^3)$, $0<h<3$.",
      "$V'(h)=\\frac{\\pi}{3}(9-3h^2)$.",
      "Set $V'=0$: $h^2=3$, $h=\\sqrt 3$; $V''(\\sqrt3)=-2\\sqrt3\\,\\pi<0$, so it is a maximum.",
      "Then $r^2=9-3=6$ and $V=\\frac{\\pi}{3}\\cdot 6\\cdot\\sqrt3=2\\sqrt3\\,\\pi\\approx 10.88$."
    ],
    "trap": "Assuming $r=h$ (\"symmetric is best\") and taking $r=h=\\frac{3}{\\sqrt2}$, which gives $V=\\frac{9\\pi}{2\\sqrt2}\\approx 9.99$, smaller than the true maximum.",
    "check": "At the endpoints $h\\to0$ and $h\\to3$ the volume is $0$, and $h=\\sqrt3$ in between beats the nearby $h=1.5$ and $h=2$."
  },
  "db-rr-009": {
    "spot": "You want the rate of change in $t$ of the distance $D=\\sqrt{x^2+y^2}$, and $y=x^3$ leaves $D$ depending on $x$ alone — write it as $D(x)$ first, then use the Chain Rule to multiply by $\\frac{dx}{dt}$.",
    "why": "Substituting for $y$ first leaves a single variable, one layer less than implicitly differentiating $x$ and $y$ separately and recombining.",
    "steps": [
      "$D(x)=\\sqrt{x^2+x^6}$.",
      "$\\frac{dD}{dx}=\\frac{2x+6x^5}{2\\sqrt{x^2+x^6}}=\\frac{x+3x^5}{\\sqrt{x^2+x^6}}$.",
      "At $x=1$: $\\frac{dD}{dx}=\\frac{4}{\\sqrt2}=2\\sqrt2$.",
      "Chain Rule: $\\frac{dD}{dt}=\\frac{dD}{dx}\\cdot\\frac{dx}{dt}=2\\sqrt2\\cdot 2=4\\sqrt2\\approx 5.66$."
    ],
    "trap": "Forgetting to multiply by $\\frac{dx}{dt}=2$ and answering $2\\sqrt2$; or missing the chain through $y=x^3$ and treating $y$ as a constant.",
    "check": "Difference check: for $x$ to go from $1$ to $1.001$ takes $0.0005$ s, and the distance changes by about $0.00283$, a rate of about $5.66$."
  },
  "dd-log-007": {
    "spot": "Both the base and the exponent contain $x$ ($(\\ln x)^x$), so neither the power rule nor the exponential rule applies directly — the signature of logarithmic differentiation.",
    "why": "Taking $\\ln$ brings the exponent down into the product $x\\ln(\\ln x)$, then use the Product Rule; rewriting it as $e^{x\\ln\\ln x}$ amounts to the same thing.",
    "steps": [
      "Let $y=(\\ln x)^x$ (for $x>1$) and take logs: $\\ln y=x\\ln(\\ln x)$.",
      "Product Rule on the right: $\\left(x\\ln\\ln x\\right)'=\\ln(\\ln x)+x\\cdot\\frac{1}{\\ln x}\\cdot\\frac{1}{x}=\\ln(\\ln x)+\\frac{1}{\\ln x}$.",
      "The left side is $\\frac{y'}{y}$, so $y'=(\\ln x)^x\\left(\\ln(\\ln x)+\\frac{1}{\\ln x}\\right)$."
    ],
    "trap": "Treating it as a power function and getting $x(\\ln x)^{x-1}\\cdot\\frac{1}{x}=(\\ln x)^{x-1}$, missing the term $(\\ln x)^x\\ln\\ln x$ from the changing exponent.",
    "check": "At $x=e$: $\\ln x=1$, so $y'=1\\cdot(0+1)=1$."
  },
  "dm-seq-007": {
    "spot": "$\\frac{k}{n^2}=\\frac{1}{n}\\cdot\\frac{k}{n}$, and $\\sin\\frac{k}{n}$ depends only on $\\frac{k}{n}$ too — the whole sum is a Riemann sum for $x\\sin x$ on $[0,1]$.",
    "why": "A sum of $n$ terms each of size about $\\frac{1}{n}$ can only be handled by turning the Riemann sum into an integral; integration by parts then finishes it in one step.",
    "steps": [
      "Rewrite: $\\frac{1}{n^2}\\sum k\\sin\\frac{k}{n}=\\sum_{k=1}^n\\frac{1}{n}\\cdot\\frac{k}{n}\\sin\\frac{k}{n}\\to\\int_0^1x\\sin x\\,dx$.",
      "Integration by parts: $u=x$, $dv=\\sin x\\,dx$, antiderivative $-x\\cos x+\\sin x$.",
      "Plug in the limits: at $1$ it is $\\sin1-\\cos1$, at $0$ it is $0$.",
      "Limit $=\\sin1-\\cos1\\approx 0.301$."
    ],
    "trap": "Treating $\\frac{k}{n^2}$ as $\\frac{1}{n}$, losing a factor of $x$, and computing $\\int_0^1\\sin x\\,dx=1-\\cos1\\approx 0.46$.",
    "check": "On $[0,1]$, $0\\le x\\sin x\\le x^2$, so the answer must lie between $0$ and $\\frac{1}{3}$."
  },
  "burst-boss-der-006": {
    "spot": "The $18$th derivative at $0$ — differentiating directly explodes, but $f^{(18)}(0)=18!\\times$ (the Taylor coefficient of $x^{18}$), and in $x^4e^{3x}$ the $x^{18}$ coefficient comes only from the $x^{14}$ term of $e^{3x}$.",
    "why": "Faster than the Leibniz formula: with Leibniz too only the term where $x^4$ is differentiated four times survives, but reading off the coefficient doesn't even need the binomial coefficient.",
    "steps": [
      "$e^{3x}=\\sum\\frac{3^m x^m}{m!}$; after multiplying by $x^4$, $x^{18}$ needs $m=14$: coefficient $\\frac{3^{14}}{14!}$.",
      "$f^{(18)}(0)=18!\\cdot\\frac{3^{14}}{14!}=18\\cdot17\\cdot16\\cdot15\\cdot3^{14}$.",
      "(From the Leibniz viewpoint: $\\binom{18}{4}\\cdot 4!\\cdot 3^{14}$, the same number.)",
      "$73440\\times4782969=351261243360$."
    ],
    "trap": "Forgetting to multiply by $18!$, or multiplying by only part of $\\frac{18!}{14!}$ (e.g. by $\\binom{18}{4}$ and missing the $4!$), which is off by a factor of $24$.",
    "check": "Same formula on a small case: $\\frac{d^2}{dx^2}\\left(xe^{3x}\\right)\\big|_0=\\frac{2!}{1!}\\cdot 3=6$."
  },
  "burst-boss-int-003": {
    "spot": "$\\ln x$ times $x^{1/2}$ — $\\ln x\\cdot x^s$ is exactly the derivative of $x^s$ in $s$, and $\\int_0^\\infty\\frac{x^s}{1+x^2}dx$ has the ready-made formula $\\frac{\\pi}{2\\cos(\\pi s/2)}$.",
    "why": "Finding an antiderivative directly is impossible; view it as the derivative of the parametric integral $J(s)$ at $s=\\frac12$, which only requires differentiating an elementary function.",
    "steps": [
      "Let $J(s)=\\int_0^\\infty\\frac{x^s}{1+x^2}dx=\\frac{\\pi}{2\\cos(\\pi s/2)}$ (for $-1<s<1$); at $s=0$ this is $\\frac{\\pi}{2}$.",
      "Differentiate in $s$, using $\\frac{\\partial}{\\partial s}x^s=x^s\\ln x$ under the integral sign: the integral we want is $=J'\\left(\\frac12\\right)$.",
      "Plug in $s=\\frac12$: $\\frac{\\pi^2}{4}\\cdot\\frac{\\sqrt2/2}{1/2}=\\frac{\\pi^2\\sqrt2}{4}=\\frac{\\pi^2}{2\\sqrt2}$.",
      "Direct numerical check: fold $(1,\\infty)$ back onto $(0,1)$ via $x\\mapsto\\frac1x$; the original integral is $=\\int_0^1\\ln x\\left(\\sqrt x-\\frac{1}{\\sqrt x}\\right)\\frac{dx}{1+x^2}\\approx 3.489$."
    ],
    "trap": "Seeing the earlier result $\\int_0^\\infty\\frac{\\ln x}{1+x^2}dx=0$ and assuming this one cancels by symmetry too; with the extra $\\sqrt x$ the two pieces no longer match, and the answer is positive.",
    "check": "The integrand is positive for $x>1$ and negative for $x<1$, but $\\sqrt x$ amplifies the $x>1$ part, so the result should be positive."
  },
  "burst-boss-param-005": {
    "spot": "$\\frac{x^n}{1+x^2}$ from $0$ to $\\infty$: substituting $x=\\tan\\theta$ swallows the denominator and gives $\\int_0^{\\pi/2}\\tan^n\\theta\\,d\\theta$ — the standard form of the Beta function.",
    "why": "$\\int_0^{\\pi/2}\\sin^{p}\\theta\\cos^{q}\\theta\\,d\\theta$ is a Beta function, and the reflection formula $\\Gamma(s)\\Gamma(1-s)=\\frac{\\pi}{\\sin\\pi s}$ turns it into a trig function, with no complex analysis needed.",
    "steps": [
      "$x=\\tan\\theta$, $dx=\\sec^2\\theta\\,d\\theta$, $1+x^2=\\sec^2\\theta$: $J_n=\\int_0^{\\pi/2}\\tan^n\\theta\\,d\\theta$. Check with $n=\\frac12$ that both sides agree.",
      "$\\int_0^{\\pi/2}\\sin^n\\theta\\cos^{-n}\\theta\\,d\\theta=\\frac12 B\\left(\\frac{n+1}{2},\\frac{1-n}{2}\\right)$, and the two parameters add up to exactly $1$.",
      "$B(s,1-s)=\\Gamma(s)\\Gamma(1-s)=\\frac{\\pi}{\\sin\\pi s}$; with $s=\\frac{n+1}{2}$: $J_n=\\frac{\\pi}{2\\sin\\left(\\pi\\frac{n+1}{2}\\right)}$.",
      "Check numerically with $n=\\frac12$ and $n=-\\frac12$: $J_{1/2}=J_{-1/2}=\\frac{\\pi}{\\sqrt2}\\approx 2.221$ ($x\\mapsto\\frac1x$ swaps $J_n$ and $J_{-n}$ anyway)."
    ],
    "trap": "Writing the reflection formula as $\\frac{\\pi}{\\cos\\pi s}$, or forgetting the $\\frac12$ in front of the Beta function, which gives $\\pi$ instead of $\\frac{\\pi}{2}$ at $n=0$.",
    "check": "At $n=0$ it is $\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$, and the formula gives $\\frac{\\pi}{2\\sin(\\pi/2)}=\\frac{\\pi}{2}$; as $n\\to\\pm1$, $\\sin\\to 0$ and the integral diverges, which also matches."
  },
  "burst-boss2-der-003": {
    "spot": "The $17$th derivative at $0$: $f^{(17)}(0)=17!\\times$ (the $x^{17}$ coefficient), and in $x^5e^{2x}$ the $x^{17}$ comes only from the $x^{12}$ term of $e^{2x}$.",
    "why": "Reading off the Taylor coefficient takes one line; differentiating seventeen times or expanding Leibniz wastes time.",
    "steps": [
      "The $x^{12}$ coefficient of $e^{2x}$ is $\\frac{2^{12}}{12!}$; after multiplying by $x^5$ it is the coefficient of $x^{17}$.",
      "$f^{(17)}(0)=17!\\cdot\\frac{2^{12}}{12!}=17\\cdot16\\cdot15\\cdot14\\cdot13\\cdot2^{12}$.",
      "$742560\\times4096=3041525760$."
    ],
    "trap": "Writing $\\frac{17!}{12!}$ as $\\binom{17}{5}$ and missing the factor $5!=120$.",
    "check": "Same formula on a small case: $\\frac{d^2}{dx^2}\\left(xe^{2x}\\right)\\big|_0=\\frac{2!}{1!}\\cdot2=4$."
  },
  "burst-boss2-der-004": {
    "spot": "The $18$th derivative of $x^6\\cos 2x$ at $0$: the $x^{18}$ coefficient comes from the $x^{12}$ term of $\\cos2x$; just multiply by $18!$.",
    "why": "The expansion of $\\cos$ has only even powers with alternating signs; reading off the $x^{12}$ term saves a pile of work compared with the Leibniz formula.",
    "steps": [
      "$\\cos u=\\sum\\frac{(-1)^m u^{2m}}{(2m)!}$ with $u=2x$, $2m=12$: coefficient $\\frac{(-1)^6 2^{12}}{12!}=+\\frac{4096}{12!}$.",
      "$f^{(18)}(0)=18!\\cdot\\frac{4096}{12!}=18\\cdot17\\cdot16\\cdot15\\cdot14\\cdot13\\cdot4096$.",
      "$13366080\\times4096=54747463680$, positive."
    ],
    "trap": "Getting the sign wrong: $x^{12}$ corresponds to $m=6$, and $(-1)^6=+1$; mixing it up with the order $18$ adds a spurious minus sign.",
    "check": "Same formula on a small case: the $x^2$ coefficient of $x^2\\cos2x$ is $1$, so the second derivative at $0$ is $1\\cdot2!=2$."
  },
  "burst-boss2-der-005": {
    "spot": "The $19$th derivative of $x^4\\sin3x$ at $0$: the $x^{19}$ coefficient comes from the $x^{15}$ term of $\\sin3x$; multiply by $19!$.",
    "why": "$\\sin$ has only odd powers, $15=2\\cdot7+1$, so the sign $(-1)^7$ is read off at a glance; differentiating nineteen times is out of the question.",
    "steps": [
      "$\\sin u=\\sum\\frac{(-1)^m u^{2m+1}}{(2m+1)!}$; when $2m+1=15$, $m=7$: coefficient $-\\frac{3^{15}}{15!}$.",
      "$f^{(19)}(0)=19!\\cdot\\left(-\\frac{3^{15}}{15!}\\right)=-19\\cdot18\\cdot17\\cdot16\\cdot3^{15}$.",
      "$-93024\\times14348907=-1334792724768$."
    ],
    "trap": "Assuming a positive sign because it's $\\sin$; $x^{15}$ is $m=7$, $(-1)^7=-1$, so the answer is negative.",
    "check": "Same formula on a small case: the $x^2$ coefficient of $x\\sin3x$ is $3$, so the second derivative at $0$ is $3\\cdot2!=6$."
  },
  "burst-boss2-lim-010": {
    "spot": "$(1+\\frac{x}{n})^n\\to e^x$, and the bracket is \"the error in approximating $e^x$\" times $n$ — you want the leading $\\frac1n$ term of the error, so expand $n\\ln(1+\\frac xn)$ to the second term.",
    "why": "Expanding $n\\ln\\left(1+\\frac{x}{n}\\right)=x-\\frac{x^2}{2n}+\\cdots$ gives the pointwise $\\frac1n$ correction $-\\frac{x^2}{2}e^x$, then integrate; cleaner than finding the integral's closed form first and expanding that.",
    "steps": [
      "$\\left(1+\\frac xn\\right)^n=e^{n\\ln(1+x/n)}=e^{x-\\frac{x^2}{2n}+\\cdots}=e^x\\left(1-\\frac{x^2}{2n}+\\cdots\\right)$; check with $x=0.7$: $n\\left((1+\\frac{0.7}{n})^n-e^{0.7}\\right)\\to-\\frac{0.49}{2}e^{0.7}$.",
      "So $n\\left(\\int_0^1(1+\\frac xn)^n dx-(e-1)\\right)\\to-\\frac12\\int_0^1x^2e^x\\,dx$.",
      "$\\int_0^1x^2e^xdx$ by parts twice: antiderivative $(x^2-2x+2)e^x$, value $e-2$.",
      "Limit $=-\\frac{e-2}{2}=\\frac{2-e}{2}\\approx-0.359$.",
      "Cross-check with the closed form: $\\int_0^1(1+\\frac xn)^n dx=\\frac{n}{n+1}\\left[(1+\\frac1n)^{n+1}-1\\right]$; substituting and taking the limit gives the same value."
    ],
    "trap": "Seeing only $(1+\\frac xn)^n\\to e^x$, saying the bracket tends to $0$ and the whole limit is $0$; after multiplying by $n$, the size of the error is exactly what's being asked.",
    "check": "$(1+\\frac xn)^n<e^x$ always holds, so the bracket is negative and the answer is negative — consistent."
  },
  "burst-boss3-int-003": {
    "spot": "$\\ln(x(1-x))=\\ln x+\\ln(1-x)$; after squaring, only two standard integrals remain: $\\int_0^1\\ln^2x\\,dx$ and $\\int_0^1\\ln x\\ln(1-x)\\,dx$.",
    "why": "After splitting, $\\ln^2(1-x)$ turns back into $\\ln^2x$ under $x\\mapsto1-x$, and the cross term is the known constant $2-\\frac{\\pi^2}{6}$; no need to hunt for an antiderivative.",
    "steps": [
      "$\\left(\\ln x+\\ln(1-x)\\right)^2=\\ln^2x+\\ln^2(1-x)+2\\ln x\\ln(1-x)$, and the first two terms have the same integral.",
      "$\\int_0^1\\ln^2x\\,dx=2$ (antiderivative $x\\ln^2x-2x\\ln x+2x$).",
      "Cross term: $\\ln(1-x)=-\\sum\\frac{x^k}{k}$ and $\\int_0^1x^k\\ln x\\,dx=-\\frac{1}{(k+1)^2}$, so $\\int_0^1\\ln x\\ln(1-x)dx=\\sum\\frac{1}{k(k+1)^2}=2-\\frac{\\pi^2}{6}$.",
      "Together: $2+2+2\\left(2-\\frac{\\pi^2}{6}\\right)=8-\\frac{\\pi^2}{3}\\approx 4.710$."
    ],
    "trap": "Forgetting the factor $2$ on the cross term and getting $6-\\frac{\\pi^2}{6}$; or mistaking $\\sum\\frac{1}{k(k+1)^2}$ for $\\frac{\\pi^2}{6}-1$.",
    "check": "The integrand is smallest at $x=\\frac12$, with value $\\ln^2 4\\approx 1.92$, so the integral must exceed $1.92$."
  },
  "burst-boss3-int-004": {
    "spot": "$\\ln\\frac{x}{1-x}=\\ln x-\\ln(1-x)$, which differs from the $\\ln(x(1-x))$ problem only in the sign of the cross term — recombine the same integrals $\\int\\ln^2x$ and $\\int\\ln x\\ln(1-x)$.",
    "why": "After squaring, everything is a known constant; finding an antiderivative directly runs into the dilogarithm.",
    "steps": [
      "$\\left(\\ln x-\\ln(1-x)\\right)^2=\\ln^2x+\\ln^2(1-x)-2\\ln x\\ln(1-x)$.",
      "$\\int_0^1\\ln^2x\\,dx=\\int_0^1\\ln^2(1-x)\\,dx=2$.",
      "$\\int_0^1\\ln x\\ln(1-x)\\,dx=\\sum_{k\\ge1}\\frac{1}{k(k+1)^2}=2-\\frac{\\pi^2}{6}$.",
      "Together: $4-2\\left(2-\\frac{\\pi^2}{6}\\right)=\\frac{\\pi^2}{3}\\approx 3.290$."
    ],
    "trap": "Copying the sign from the previous problem and using $+2\\ln x\\ln(1-x)$, which gives $8-\\frac{\\pi^2}{3}$.",
    "check": "Another route: let $x=\\frac{1}{1+e^{-t}}$; the integral becomes $\\int_{-\\infty}^{\\infty}\\frac{t^2e^{t}}{(1+e^{t})^2}dt=2\\int_0^\\infty\\frac{t^2e^{-t}}{(1+e^{-t})^2}dt$, with the same numerical value."
  },
  "burst-der-005": {
    "spot": "The $11$th derivative at $0$: the $x^{11}$ coefficient comes from the $x^9$ term of $\\sin2x$; multiply by $11!$.",
    "why": "Reading off the Taylor coefficient solves it in one line; with the Leibniz formula only the term where $x^2$ is differentiated twice survives, but you have to compute an extra binomial coefficient.",
    "steps": [
      "The $u^9$ term of $\\sin u$: $m=4$, $\\frac{(-1)^4u^9}{9!}$; with $u=2x$ the coefficient is $\\frac{2^9}{9!}=\\frac{512}{9!}$.",
      "$f^{(11)}(0)=11!\\cdot\\frac{512}{9!}=11\\cdot10\\cdot512$.",
      "$110\\times512=56320$."
    ],
    "trap": "Writing only $\\binom{11}{2}\\cdot 2^9$ and missing the $2!$ from differentiating $x^2$ twice, which gives $28160$ — exactly half.",
    "check": "Same formula on a small case: the $x^3$ coefficient of $x^2\\sin2x$ is $2$, so the third derivative at $0$ is $2\\cdot3!=12$; the second derivative at $0$ is $0$ (there is no $x^2$ term)."
  },
  "dm-ser-002": {
    "spot": "The problem already gives the generating function, and the desired sum is exactly minus its value at $x=-1$ — all you need is $\\operatorname{Li}_2(-1)$ and $\\ln^2 2$.",
    "why": "The alternating $\\frac{H_n}{n}$ converges very slowly, so adding terms directly is impractical; plugging into the generating function leaves just two known constants.",
    "steps": [
      "$\\operatorname{Li}_2(-1)=\\sum\\frac{(-1)^n}{n^2}=-\\left(1-\\frac14+\\frac19-\\cdots\\right)=-\\frac{\\pi^2}{12}$.",
      "$\\frac12\\ln^2(1-(-1))=\\frac12\\ln^22\\approx 0.240$.",
      "So $\\sum\\frac{H_n}{n}(-1)^n=-\\frac{\\pi^2}{12}+\\frac12\\ln^22$.",
      "The problem wants $(-1)^{n+1}$, which flips the whole sign: $\\frac{\\pi^2}{12}-\\frac{\\ln^22}{2}\\approx 0.582$."
    ],
    "trap": "Forgetting that $(-1)^{n+1}$ and the generating function's $(-1)^n$ differ by a minus sign, and answering $\\frac{\\ln^22}{2}-\\frac{\\pi^2}{12}$ (negative — but the first term is $+1$, so the sum can't be negative).",
    "check": "Integrating $\\sum H_nx^n=-\\frac{\\ln(1-x)}{1-x}$ term by term, the sum is $=\\int_{-1}^{0}\\frac{-\\ln(1-x)}{x(1-x)}dx$; also, the partial sums $0.340$ and $0.797$ bracket $0.582$."
  },
  "lec-19-q3a": {
    "spot": "The integrand involves only $z$, and the tetrahedron's cross-section at height $z$ is the right triangle $x+y\\le1-z$ with area $\\frac{(1-z)^2}{2}$ — slicing finishes it in a single integral.",
    "why": "Since the integrand depends only on $z$, collapsing the $x,y$ part into a cross-sectional area saves two layers compared with writing out the triple integral.",
    "steps": [
      "Cross-section at height $z$: $x,y\\ge0$, $x+y\\le1-z$, area $\\frac{(1-z)^2}{2}$; check with $1-z=0.6$.",
      "$\\iiint_E z\\,dV=\\int_0^1 z\\cdot\\frac{(1-z)^2}{2}\\,dz$.",
      "Expand $z(1-z)^2=z-2z^2+z^3$; the integral is $\\frac12-\\frac23+\\frac14=\\frac{1}{12}$.",
      "Multiply by $\\frac12$: $\\frac{1}{24}$."
    ],
    "trap": "Writing the cross-sectional area as $(1-z)^2$, forgetting the triangle's division by $2$, and getting $\\frac{1}{12}$.",
    "check": "The tetrahedron has volume $\\frac16$ and centroid height $\\frac14$, so $\\iiint z\\,dV=\\frac16\\cdot\\frac14=\\frac{1}{24}$."
  },
  "lec-19-q3b": {
    "spot": "The paraboloid $z=x^2+y^2=r^2$ is symmetric about the $z$-axis and meets $z=4$ in the circle $r=2$ — in cylindrical coordinates the height is just $4-r^2$.",
    "why": "Cartesian coordinates force you to deal with the disk's square-root boundary; cylindrical coordinates turn the boundary into the rectangle $0\\le r\\le2$, $0\\le\\theta\\le2\\pi$.",
    "steps": [
      "Intersection: $r^2=4$, $r=2$. The region is $0\\le r\\le2$, $r^2\\le z\\le4$.",
      "$V=\\int_0^{2\\pi}\\int_0^2(4-r^2)\\,r\\,dr\\,d\\theta$ (don't forget the Jacobian $r$).",
      "Inner integral $\\int_0^2(4r-r^3)dr=8-4=4$; times $2\\pi$ gives $8\\pi\\approx25.13$."
    ],
    "trap": "Dropping the $r$ in $dA=r\\,dr\\,d\\theta$ and computing $2\\pi\\int_0^2(4-r^2)dr=\\frac{32\\pi}{3}$.",
    "check": "The enclosing cylinder has volume $\\pi\\cdot2^2\\cdot4=16\\pi$, and the paraboloid \"bowl\" takes exactly half, leaving $8\\pi$."
  },
  "lec-19-q3c": {
    "spot": "The integrand is $x^2+y^2+z^2=\\rho^2$ and the region is a ball — in spherical coordinates both involve only $\\rho$, and the angular part simply gives $4\\pi$.",
    "why": "The spherical volume element $\\rho^2\\sin\\varphi$ separates from the integrand, so the triple integral becomes a product of three single integrals.",
    "steps": [
      "$\\iiint_B\\rho^2\\cdot\\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$.",
      "Angular part: $\\int_0^{2\\pi}d\\theta\\int_0^\\pi\\sin\\varphi\\,d\\varphi=2\\pi\\cdot2=4\\pi$.",
      "Radial part: $\\int_0^a\\rho^4d\\rho=\\frac{a^5}{5}$.",
      "Multiply: $\\frac{4\\pi a^5}{5}$."
    ],
    "trap": "Forgetting the $\\rho^2$ in the volume element, integrating only $\\rho^2$, and getting $\\frac{4\\pi a^3}{3}$ (the volume of the ball).",
    "check": "Dimension check: the integrand is a length squared and volume is a length cubed, so the answer should be a multiple of $a^5$."
  },
  "lec-19-q4c": {
    "spot": "The square's sides are $x+y=0,2$ and $x-y=0,2$, and the integrand is $x^2-y^2=(x+y)(x-y)$ — substituting $u=x+y$, $v=x-y$ simplifies the region and the integrand at once.",
    "why": "In Cartesian coordinates the square must be cut into two pieces with piecewise-linear limits; after the change of variables it becomes $[0,2]\\times[0,2]$ with integrand $uv$.",
    "steps": [
      "$u=x+y$, $v=x-y$: the four vertices become $(0,0)$, $(2,0)$, $(2,2)$, $(0,2)$, and the region is $0\\le u,v\\le2$.",
      "Jacobian: $\\frac{\\partial(u,v)}{\\partial(x,y)}=\\begin{vmatrix}1&1\\\\1&-1\\end{vmatrix}=-2$, so $dA=\\frac12\\,du\\,dv$.",
      "$\\iint_R(x^2-y^2)dA=\\frac12\\int_0^2\\int_0^2uv\\,du\\,dv=\\frac12\\cdot2\\cdot2=2$.",
      "Cartesian cross-check: integrating in $y$ gives $\\int_{-h}^{h}(x^2-y^2)dy=2x^2h-\\frac{2h^3}{3}$, with $h=x$ on the left half and $h=2-x$ on the right half; the total is also $2$."
    ],
    "trap": "Using the Jacobian as $|-2|=2$ instead of $\\frac12$ (confusing $\\frac{\\partial(u,v)}{\\partial(x,y)}$ with its reciprocal) and getting $8$.",
    "check": "The square has area $2$, and the Jacobian $\\frac12$ times the $uv$-plane area $4$ is also $2$ — consistent."
  },
  "refine-derivatives-059": {
    "spot": "$u=x^4-6x^2y^2+y^4$ and $v=4x^3y-4xy^3$ are exactly the real and imaginary parts of $(x+iy)^4$ — they satisfy the Cauchy–Riemann equations, so the Jacobian is $=u_x^2+v_x^2=|4z^3|^2$.",
    "why": "Once you recognize $(x+iy)^4$ the answer is $16|z|^6$; multiplying out four partial derivatives and subtracting gets long.",
    "steps": [
      "$u_x=4x^3-12xy^2$, $u_y=-12x^2y+4y^3$.",
      "$v_x=12x^2y-4y^3$, $v_y=4x^3-12xy^2$; note $u_x=v_y$ and $u_y=-v_x$.",
      "$J=u_xv_y-u_yv_x=u_x^2+v_x^2=(4x^3-12xy^2)^2+(12x^2y-4y^3)^2$.",
      "That is $|4(x+iy)^3|^2=16(x^2+y^2)^3$."
    ],
    "trap": "Writing the Jacobian as $u_xv_y+u_yv_x$ (the determinant missing its minus sign), which gives $u_x^2-v_x^2$, an expression that is not always positive.",
    "check": "At $(1,0)$: $u_x=v_y=4$, $u_y=v_x=0$, so $J=16$; the formula gives $16(1+0)^3=16$."
  },
  "cl-der-001": {
    "spot": "$8.12$ is very close to the perfect cube $8$, with $\\sqrt[3]{8}=2$ — do a linear approximation at $a=8$ with increment $0.12$.",
    "why": "Linear approximation needs only $f(8)$ and $f'(8)$, both easy; taking the cube root directly means trial and error.",
    "steps": [
      "$f(x)=x^{1/3}$, $f'(x)=\\frac13x^{-2/3}$, $f'(8)=\\frac13\\cdot\\frac14=\\frac{1}{12}$.",
      "$L(x)=f(8)+f'(8)(x-8)=2+\\frac{x-8}{12}$.",
      "$L(8.12)=2+\\frac{0.12}{12}=2.01$."
    ],
    "trap": "When computing $f'(8)$ as $\\frac13\\cdot8^{-2/3}$, taking $8^{-2/3}$ as $\\frac12$ and getting $2+\\frac{0.12}{6}=2.02$.",
    "check": "The true value is $\\sqrt[3]{8.12}\\approx2.00995$; the cube root is concave, so the tangent line lies above and the estimate is slightly high — correct."
  },
  "cl-int-001": {
    "spot": "The force varies with position, $F(x)=3x^2+2$, so work is not \"force times distance\" but $\\int_0^2F(x)\\,dx$.",
    "why": "Since the force isn't constant, you must add up $F\\,dx$ over each small piece; the polynomial integrates directly with the power rule.",
    "steps": [
      "$W=\\int_0^2(3x^2+2)\\,dx$.",
      "Antiderivative $x^3+2x$.",
      "$W=(8+4)-0=12$ joules."
    ],
    "trap": "Multiplying the force at the endpoint by the distance: $F(2)\\cdot2=14\\cdot2=28$; the force is changing, so this is only an upper bound.",
    "check": "The force lies in $[2,14]$, so the work must be between $2\\cdot2=4$ and $14\\cdot2=28$."
  },
  "cl-lim-010": {
    "spot": "All four factors are $0$ as $x\\to0$, and each has a standard equivalent infinitesimal: $\\arcsin2x\\sim2x$, $e^{3x}-1\\sim3x$, $\\ln(1+x)\\sim x$, $\\tan4x\\sim4x$.",
    "why": "For a $\\frac00$ form built from products and quotients, just substitute equivalent infinitesimals; L'Hôpital's Rule would mean differentiating a product of four factors — messy.",
    "steps": [
      "$\\arcsin2x\\sim2x$, $e^{3x}-1\\sim3x$.",
      "$\\ln(1+x)\\sim x$, $\\tan4x\\sim4x$.",
      "Substitute: $\\frac{2x\\cdot3x}{x\\cdot4x}=\\frac{6}{4}=\\frac32$."
    ],
    "trap": "Treating $\\arcsin2x$ as something like the reciprocal $\\frac{1}{\\sin2x}$, or forgetting the coefficients and writing just $x$, which gives $\\frac{1\\cdot3}{1\\cdot4}=\\frac34$.",
    "check": "Plug in $x=0.001$: the ratio is about $1.502$, right next to $1.5$."
  },
  "cx-der-002": {
    "spot": "This is just the derivative of $\\sin x$ at $0$ — $(\\sin x)'=\\cos x$, evaluated at $0$.",
    "why": "Use the formula directly; going back to the definition, it is just $\\lim\\frac{\\sin h}{h}=1$.",
    "steps": [
      "Definition: $\\left.\\frac{d}{dx}\\sin x\\right|_0=\\lim_{h\\to0}\\frac{\\sin h-\\sin0}{h}=\\lim\\frac{\\sin h}{h}=1$.",
      "In general $(\\sin x)'=\\cos x$.",
      "$\\cos0=1$."
    ],
    "trap": "Confusing the derivative with the function value and answering $\\sin0=0$.",
    "check": "The tangent line to $\\sin x$ at the origin is $y=x$, with slope $1$; $\\sin(0.01)\\approx0.01$ agrees."
  },
  "cx-int-001": {
    "spot": "$3x^2$ is exactly the derivative of $x^3$ — the antiderivative is obvious at a glance.",
    "why": "The power rule gives the antiderivative directly; then use the Fundamental Theorem of Calculus to plug in the limits.",
    "steps": [
      "Antiderivative: $(x^3)'=3x^2$.",
      "$\\int_0^2 3x^2dx=2^3-0^3$.",
      "$=8$."
    ],
    "trap": "Writing the antiderivative as $3x^3$, forgetting to divide by $3$, and getting $24$.",
    "check": "The function is increasing, so the integral lies between $0\\cdot2=0$ and $12\\cdot2=24$."
  },
  "fd-der-007": {
    "spot": "Differentiate a polynomial and evaluate: apply the power rule to $x^2+3x$ term by term.",
    "why": "Differentiating a polynomial term by term is fastest.",
    "steps": [
      "$\\frac{d}{dx}(x^2+3x)=2x+3$.",
      "At $x=1$, $f(1)=4$, but what we want is the slope of the tangent line there, not the function value.",
      "Plug in $x=1$: $f'(1)=2+3=5$."
    ],
    "trap": "Plugging in first and differentiating after: $f(1)=4$ is a constant, whose derivative is $0$.",
    "check": "Difference quotient: $\\frac{f(1.001)-f(1)}{0.001}\\approx5.001$."
  },
  "fd-int-012": {
    "spot": "Definite integral of a linear polynomial: antiderivative $x^2+3x$, then plug in the limits.",
    "why": "The power rule gives the antiderivative in one step; this one can also be seen as the area of a trapezoid.",
    "steps": [
      "Antiderivative: $(x^2+3x)'=2x+3$.",
      "Plug in the limits: $(4+6)-(1+3)=10-4=6$.",
      "So the integral is $=6$."
    ],
    "trap": "Plugging in only the upper limit and forgetting to subtract the lower one, getting $10$.",
    "check": "Trapezoid: width $1$, side heights $5$ and $7$, area $\\frac{5+7}{2}\\cdot1=6$."
  },
  "fd-int-014": {
    "spot": "$5x^4$ is exactly the derivative of $x^5$.",
    "why": "The antiderivative is obvious; plug in $0$ and $1$ and you're done.",
    "steps": [
      "$(x^5)'=5x^4$.",
      "$\\int_0^15x^4dx=1^5-0^5$.",
      "$=1$."
    ],
    "trap": "Writing the antiderivative as $5x^5$ or $\\frac{5x^5}{4}$ and getting $5$ or $\\frac54$.",
    "check": "On $[0,1]$ the function lies between $0$ and $5$ and is small most of the time, so an integral of $1$ is reasonable."
  },
  "fd-int-018": {
    "spot": "The antiderivative of $e^x$ is itself and the antiderivative of $1$ is $x$ — integrate term by term.",
    "why": "Both terms have basic antiderivatives, so splitting them is fastest.",
    "steps": [
      "Antiderivative: $(e^x-x)'=e^x-1$.",
      "Plug in the limits: $(e-1)-(1-0)=e-2$.",
      "So the integral is $=e-2\\approx0.718$."
    ],
    "trap": "Taking $e^0$ as $0$ when plugging in the lower limit $0$, and getting $e-1$.",
    "check": "$e^x-1\\ge x$, so the integral is at least $\\int_0^1x\\,dx=\\frac12$; and it can't exceed $e-1$."
  },
  "fd-ser-002": {
    "spot": "A geometric series with ratio $r=\\frac15$ and first term $1$ (starting at $n=0$); it converges since $|r|<1$.",
    "why": "A geometric series has the closed form $\\frac{a}{1-r}$; no need to add term by term.",
    "steps": [
      "First term at $n=0$: $\\left(\\frac15\\right)^0=1$; ratio $\\frac15$.",
      "$|r|<1$, so the sum is $=\\frac{1}{1-\\frac15}=\\frac54$.",
      "So the series is $=\\frac54$."
    ],
    "trap": "Taking the first term as $\\frac15$ (thinking it starts at $n=1$) and getting $\\frac{1/5}{1-1/5}=\\frac14$.",
    "check": "The first three terms $1+0.2+0.04=1.24$ are already very close to $1.25$."
  },
  "lec-06-q4c": {
    "spot": "It asks for \"average velocity\": displacement divided by time, i.e. the average value of $v$, $\\frac{1}{5}\\int_0^5v(t)\\,dt$.",
    "why": "Average velocity is about displacement (which has a sign), so integrate $v$ directly without worrying where it changes sign; that is only needed for average speed.",
    "steps": [
      "Displacement $=\\int_0^5(t^2-2t-3)\\,dt$; antiderivative $\\frac{t^3}{3}-t^2-3t$.",
      "Plug in the upper limit: $\\frac{125}{3}-25-15=\\frac53$.",
      "Divide by the time $5$: $\\frac{5/3}{5}=\\frac13$ m/s."
    ],
    "trap": "Averaging the endpoint velocities, $\\frac{v(0)+v(5)}{2}=\\frac{-3+12}{2}=4.5$; velocity isn't linear, so this is wrong.",
    "check": "$v$ is negative before $t=3$ and positive after, so the positive and negative parts mostly cancel; a small but positive average is reasonable."
  },
  "lec-11-q2a": {
    "spot": "The numerator $\\cos n$ is bounded (oscillating between $-1$ and $1$) and the denominator $n\\to\\infty$ — bounded over infinity, so use the Squeeze Theorem.",
    "why": "$\\cos n$ itself has no limit, so you can't split it into a quotient of two limits; the Squeeze Theorem only needs it to be bounded.",
    "steps": [
      "$-1\\le\\cos n\\le1$, so $-\\frac1n\\le\\frac{\\cos n}{n}\\le\\frac1n$.",
      "Both sides tend to $0$.",
      "By the Squeeze Theorem, the limit is $=0$."
    ],
    "trap": "Saying \"$\\cos n$ has no limit, so the whole thing doesn't exist\"; a bounded quantity times something tending to $0$ still has limit $0$.",
    "check": "At $n=1000$, $\\left|\\frac{\\cos n}{n}\\right|\\le0.001$."
  },
  "lec-14-q4a": {
    "spot": "The coefficient has $n!$ in the denominator — the ratio $\\left|\\frac{a_{n+1}x^{n+1}}{a_nx^n}\\right|=\\frac{|x|}{n+1}$, and the factorial makes the Ratio Test pass for every $x$.",
    "why": "For a power series with factorials the Ratio Test is cleanest: dividing $(n+1)!$ by $n!$ leaves just $n+1$.",
    "steps": [
      "Ratio: $\\frac{|x|^{n+1}/(n+1)!}{|x|^n/n!}=\\frac{|x|}{n+1}$. Look at $x=10$: the ratio shrinks as $n$ grows.",
      "However large $x$ is, $\\frac{|x|}{n+1}\\to0<1$.",
      "So it converges for every real $x$: the radius of convergence is $R=\\infty$, and the domain is the whole real line $(-\\infty,\\infty)$."
    ],
    "trap": "Seeing $x^n$ and applying \"converges for $|x|<1$\", answering $(-1,1)$; that is the geometric series case, but here the $n!$ in the denominator grows faster than any $|x|^n$.",
    "check": "This series is in fact the Maclaurin series of $e^x$, and $e^x$ is defined at every real number, consistent with an interval of convergence of all reals."
  },
  "lec-15-m1": {
    "spot": "The coefficient of $x^3$ in a Maclaurin series is $\\frac{f'''(0)}{3!}$; the derivatives of $\\sin x$ cycle every four, and $f'''=-\\cos x$.",
    "why": "Memorizing $\\sin x=x-\\frac{x^3}{6}+\\cdots$ is fastest; if you forget, derive it from $\\frac{f'''(0)}{3!}$.",
    "steps": [
      "$(\\sin x)''=-\\sin x$, so $(\\sin x)'''=-\\cos x$.",
      "$f'''(0)=-\\cos0=-1$.",
      "Coefficient $=\\frac{f'''(0)}{3!}=-\\frac16$."
    ],
    "trap": "Forgetting to divide by $3!$ and answering $-1$, or dropping the minus sign and answering $\\frac16$.",
    "check": "$\\frac{\\sin x-x}{x^3}\\to-\\frac16$, exactly the coefficient of $x^3$."
  },
  "refine-integrals-001": {
    "spot": "$g$ is an integral function \"from a constant to $x$\" — by the Fundamental Theorem of Calculus, Part 1, $g'(x)$ is just the integrand evaluated at $x$.",
    "why": "No need to compute the integral first and then differentiate; the Fundamental Theorem gives $g'(x)=x^2+3$ directly.",
    "steps": [
      "Fundamental Theorem: $g'(x)=x^2+3$ (the lower limit $1$ is a constant and doesn't affect the derivative).",
      "(Check: $g(x)=\\frac{x^3}{3}+3x-\\frac{10}{3}$, which is exactly that integral.)",
      "$g'(2)=4+3=7$."
    ],
    "trap": "Giving $g(2)=\\int_1^2(t^2+3)dt=\\frac{16}{3}$ as the answer, confusing the function value with the derivative.",
    "check": "Difference quotient: $\\frac{g(2.001)-g(2)}{0.001}=\\frac{1}{0.001}\\int_2^{2.001}(t^2+3)dt\\approx7.002$."
  },
  "refine-integrals-012": {
    "spot": "The graph of $2-|x-1|$ is an upside-down V with vertex at $(1,2)$ and slopes $\\pm1$, hitting the $x$-axis exactly at $x=-1$ and $x=3$ — the interval of integration is exactly one triangle.",
    "why": "Absolute value functions call for piecewise integration, but since the graph is a triangle, the area formula does it in one step.",
    "steps": [
      "At the vertex $x=1$ the value is $2$; at the endpoints $x=-1$ and $x=3$ the value is $0$.",
      "The function is $\\ge0$ on the whole interval, so the integral is the triangle's area: base $4$, height $2$.",
      "Area $=\\frac12\\cdot4\\cdot2=4$."
    ],
    "trap": "Treating $|x-1|$ as $x-1$ and integrating directly, getting $\\int_{-1}^3(3-x)dx=8$.",
    "check": "Piecewise check: left half $\\int_{-1}^1(1+x)dx=2$, right half $\\int_1^3(3-x)dx=2$."
  },
  "refine-integrals-021": {
    "spot": "The region enclosed by a parabola and the $x$-axis has the two roots as its left and right boundaries — factor $x^2-2x-3=(x-3)(x+1)$; the upper limit is the larger root.",
    "why": "The limits of integration for an enclosed region come from the intersection points, so just solve $y=0$ first.",
    "steps": [
      "Factor: $x^2-2x-3=(x-3)(x+1)$.",
      "The roots are $x=-1$ and $x=3$.",
      "So the interval is $[-1,3]$ and the upper limit is $b=3$ (area $\\int_{-1}^3-(x^2-2x-3)dx=\\frac{32}{3}$)."
    ],
    "trap": "Taking the vertex $x=1$ as the upper limit, or using the absolute value of the $y$-intercept $-3$.",
    "check": "The two roots are symmetric about the vertex $x=1$: $1\\pm2$, so the upper limit $3$ is right."
  },
  "refine-limits-006": {
    "spot": "$\\lfloor x\\rfloor$ jumps at the integer $2$ — approaching from the left, $x$ hasn't reached $2$ yet, so $\\lfloor x\\rfloor=1$.",
    "why": "The floor function is discontinuous at integers, so for a one-sided limit first fix the integer part on that side; after that it's an ordinary linear function.",
    "steps": [
      "For $1\\le x<2$: $\\lfloor x\\rfloor=1$, so $x+\\lfloor x\\rfloor=x+1$.",
      "As $x\\to2^-$: $x+1\\to3$.",
      "So the limit is $=3$."
    ],
    "trap": "Plugging in $x=2$ directly with $\\lfloor2\\rfloor=2$ and getting $4$; that is the right-hand limit (and the function value), not the left-hand limit.",
    "check": "At $x=1.999$ the value is $1.999+1=2.999$, right next to $3$."
  },
  "refine-limits-008": {
    "spot": "A $1^\\infty$ form with base $\\to1$ and exponent $\\to\\infty$, and it looks exactly like $\\left(1+\\frac1x\\right)^x$ raised to the fourth power.",
    "why": "For a $1^\\infty$ form, take logs or build the definition of $e$ directly; here rewriting as $\\left[\\left(1+\\frac1x\\right)^x\\right]^4$ is fastest.",
    "steps": [
      "$\\left(1+\\frac1x\\right)^{4x}=\\left[\\left(1+\\frac1x\\right)^x\\right]^4$, and the inner part tends to $e$.",
      "Check with logs: $4x\\ln\\left(1+\\frac1x\\right)\\to4$.",
      "Limit $=e^4\\approx54.6$."
    ],
    "trap": "Seeing the base $\\to1$ and saying $1^\\infty=1$; $1^\\infty$ is an indeterminate form.",
    "check": "At $x=1000$, $(1.001)^{4000}\\approx54.5$, slightly less than $e^4\\approx54.6$."
  },
  "rel-basic-007": {
    "spot": "Differentiate the power function $x^3$, then plug in $x=2$.",
    "why": "The power rule $(x^n)'=nx^{n-1}$ does it in one step.",
    "steps": [
      "$(x^3)'=3x^2$.",
      "Plug in $x=2$: $3\\cdot4=12$.",
      "So the derivative's value is $=12$."
    ],
    "trap": "Writing $3x^3$ or forgetting to lower the power, getting $24$; or plugging in first to get $8$ and then differentiating to get $0$.",
    "check": "Difference quotient: $\\frac{2.001^3-8}{0.001}\\approx12.006$."
  },
  "rel-basic-016": {
    "spot": "The numerator is the constant $1$ and the denominator is the linear $1+x$ — the antiderivative is $\\ln|1+x|$.",
    "why": "The antiderivative of $\\frac{1}{u}$ is $\\ln|u|$, and $u=1+x$ has derivative $1$, so no coefficient adjustment is needed.",
    "steps": [
      "$(\\ln(1+x))'=\\frac{1}{1+x}$.",
      "Plug in the limits: $\\ln2-\\ln1=\\ln2$.",
      "So the integral is $=\\ln2\\approx0.693$."
    ],
    "trap": "Using the power rule to integrate $(1+x)^{-1}$ as $\\frac{(1+x)^0}{0}$; $n=-1$ is exactly the exception to the power rule.",
    "check": "On $[0,1]$ the integrand decreases from $1$ to $\\frac12$, so the integral lies between $\\frac12$ and $1$."
  },
  "rel-basic-018": {
    "spot": "$3x$ from $0$ to $2$ is just the area of a right triangle; you can also use the antiderivative $\\frac32x^2$.",
    "why": "For the definite integral of a linear function, either the triangle area or the power rule takes one step.",
    "steps": [
      "Antiderivative: $\\left(\\frac32x^2\\right)'=3x$.",
      "Plug in the limits: $\\frac32\\cdot4-0=6$.",
      "So the integral is $=6$."
    ],
    "trap": "Writing the antiderivative as $3x^2$, forgetting to divide by $2$, and getting $12$.",
    "check": "Triangle: base $2$, height $3\\cdot2=6$, area $\\frac12\\cdot2\\cdot6=6$."
  },
  "tb-tan-005": {
    "spot": "The tangent slope is the derivative's value at $x=0$; differentiate $e^{2x}$ with the Chain Rule, where the inner $2x$ drops out a factor of $2$.",
    "why": "The Chain Rule $(e^{u})'=e^{u}u'$ does it in one line; no need to go back to the difference-quotient definition and compute a limit.",
    "steps": [
      "$(e^{2x})'=2e^{2x}$.",
      "Plug in $x=0$: $2e^0=2$.",
      "So the slope is $=2$."
    ],
    "trap": "Forgetting the Chain Rule, thinking the derivative of $e^{2x}$ is itself, and getting slope $1$.",
    "check": "Difference quotient: $\\frac{e^{0.002}-1}{0.001}\\approx2.002$."
  },
  "ap-eco-001": {
    "spot": "Marginal cost is the derivative of the cost function, $C'(x)$, evaluated at $x=100$.",
    "why": "A marginal quantity is a derivative; differentiate the polynomial term by term.",
    "steps": [
      "$C'(x)=5+0.02x$.",
      "Plug in $x=100$: $5+2=7$.",
      "So the marginal cost is $=7$."
    ],
    "trap": "Taking the average cost $\\frac{C(100)}{100}=\\frac{1600}{100}=16$ as the marginal cost.",
    "check": "The cost of producing the $101$st unit is $C(101)-C(100)=7.01$, very close to $7$."
  },
  "ap-gro-001": {
    "spot": "\"Doubles every 2 hours\" — the count is $100\\cdot2^{t/2}$, and 8 hours is 4 doubling periods.",
    "why": "With a known doubling time, write the base-$2$ exponential model directly; faster than finding the continuous rate $k=\\frac{\\ln2}{2}$ and computing $e^{kt}$.",
    "steps": [
      "Model $N(t)=100\\cdot2^{t/2}$, which satisfies $N'=\\frac{\\ln2}{2}N$ (exponential growth).",
      "At $t=8$: $2^{8/2}=2^4=16$.",
      "$N(8)=100\\cdot16=1600$ individuals."
    ],
    "trap": "Treating \"8 hours\" as 8 doublings and getting $100\\cdot2^8=25600$.",
    "check": "Step by step: $100\\to200\\to400\\to800\\to1600$, four doublings."
  },
  "ap-gro-002": {
    "spot": "Half-life 10 days, and 30 days = 3 half-lives, so $\\left(\\frac12\\right)^3$ remains.",
    "why": "With a known half-life use a base-$\\frac12$ model and skip computing the decay constant.",
    "steps": [
      "Model $m(t)=80\\left(\\frac12\\right)^{t/10}$, which satisfies $m'=-\\frac{\\ln2}{10}m$.",
      "At $t=30$: $\\left(\\frac12\\right)^{3}=\\frac18$.",
      "$m(30)=80\\cdot\\frac18=10$ g."
    ],
    "trap": "Thinking it loses 40 g every 10 days (linear decrease), which makes the amount after 30 days negative or $0$.",
    "check": "Step by step: $80\\to40\\to20\\to10$."
  },
  "ap-kin-002": {
    "spot": "Given position $s(t)$, asked for acceleration — acceleration is $s''(t)$, so differentiate twice.",
    "why": "$v=s'$ and $a=v'=s''$; just differentiate the polynomial term by term twice.",
    "steps": [
      "$v(t)=s'(t)=3t^2-12t+9$.",
      "$a(t)=v'(t)=6t-12$.",
      "$a(3)=18-12=6$."
    ],
    "trap": "Differentiating only once and answering $v(3)=27-36+9=0$.",
    "check": "At $t=3$ the velocity is $0$ while the acceleration is $6>0$: the particle stops at that instant and starts speeding up in the positive direction — reasonable."
  },
  "ch-trap-001": {
    "spot": "Under the root is $1+\\tan^2(\\cdot)=\\sec^2(\\cdot)$ — simplify to $|\\sec(\\sin x)|$ first; since $|\\sin x|\\le1<\\frac\\pi2$, $\\cos(\\sin x)>0$ and the absolute value can be dropped.",
    "why": "Simplifying with the identity before differentiating saves a lot compared with a four-layer chain through the root, the square, $\\tan$ and $\\sin$.",
    "steps": [
      "$\\sqrt{1+\\tan^2(\\sin x)}=|\\sec(\\sin x)|=\\frac{1}{\\cos(\\sin x)}$ (because $\\cos(\\sin x)>0$).",
      "Differentiate: $(\\sec u)'=\\sec u\\tan u\\cdot u'$, with $u=\\sin x$, $u'=\\cos x$.",
      "Tidy up: $\\frac{\\cos x\\,\\sin(\\sin x)}{\\cos^2(\\sin x)}$."
    ],
    "trap": "After reducing to $\\sec(\\sin x)$, forgetting the inner derivative $\\cos x$ of $\\sin x$ and getting $\\sec(\\sin x)\\tan(\\sin x)$.",
    "check": "At $x=0$, $\\sin(\\sin0)=0$, so the derivative is $0$; the original function $\\sec(\\sin x)$ has its minimum value $1$ at $x=0$, which agrees."
  },
  "ch-trap-003": {
    "spot": "$\\sin(\\arcsin u)=u$ holds identically on the domain $|u|\\le1$ — simplify to $x^3$ first, no Chain Rule needed.",
    "why": "After the inverse functions cancel, only $x^3$ remains; forcing the Chain Rule gives $\\cos(\\arcsin x^3)\\cdot\\frac{3x^2}{\\sqrt{1-x^6}}$, which you then have to simplify back.",
    "steps": [
      "$\\sin(\\arcsin(x^3))=x^3$ (for $|x|\\le1$).",
      "Differentiate: $(x^3)'=3x^2$.",
      "Check with the Chain Rule: $\\cos(\\arcsin x^3)=\\sqrt{1-x^6}$ cancels with the denominator, giving $3x^2$ again."
    ],
    "trap": "Stopping halfway through the Chain Rule at $\\frac{3x^2\\cos(\\arcsin x^3)}{\\sqrt{1-x^6}}$ without noticing it equals $3x^2$.",
    "check": "At $x=0.5$, $3x^2=0.75$, and the difference quotient is also $0.75$."
  },
  "ch-trap-004": {
    "spot": "$e^{\\ln(\\cdot)}$ cancels itself — $e^{\\ln(\\sin^2x)}=\\sin^2x$ (where $\\sin x\\ne0$).",
    "why": "Simplify to $\\sin^2x$ first and then differentiate; only one layer of Chain Rule remains.",
    "steps": [
      "$e^{\\ln(\\sin^2x)}=\\sin^2x$.",
      "$(\\sin^2x)'=2\\sin x\\cos x$.",
      "So the derivative is $=2\\sin x\\cos x$ (i.e. $\\sin2x$)."
    ],
    "trap": "Thinking the derivative of $e^{(\\cdot)}$ is itself and answering $e^{\\ln(\\sin^2x)}=\\sin^2x$, missing the inner derivative.",
    "check": "At $x=\\frac\\pi4$, $\\sin^2x$ is increasing, and the derivative is $2\\cdot\\frac{\\sqrt2}{2}\\cdot\\frac{\\sqrt2}{2}=1$."
  },
  "ch-trap-005": {
    "spot": "$\\frac{\\sin x}{\\cos x}=\\tan x$, and on each interval $\\left(-\\frac\\pi2+k\\pi,\\frac\\pi2+k\\pi\\right)$, $\\arctan(\\tan x)$ is just $x-k\\pi$ — the slope is always $1$.",
    "why": "Recognize $\\tan x$ first and let the inverse function cancel; forcing the Chain Rule also works, but you have to compute $\\frac{\\sec^2x}{1+\\tan^2x}$ before it reduces to $1$.",
    "steps": [
      "$\\arctan\\left(\\frac{\\sin x}{\\cos x}\\right)=\\arctan(\\tan x)$.",
      "Chain Rule: $\\frac{1}{1+\\tan^2x}\\cdot\\sec^2x=\\frac{\\sec^2x}{\\sec^2x}=1$.",
      "So the derivative is $=1$ (where $\\cos x\\ne0$)."
    ],
    "trap": "Thinking $\\arctan(\\tan x)=x$ holds for all $x$; it is a sawtooth, but every piece has slope $1$, so the derivative is still $1$.",
    "check": "To the right of $\\frac\\pi2$ (say $x=2$) the function value is $2-\\pi$, not $2$, but the slope is still $1$."
  },
  "ch-trap-006": {
    "spot": "$\\cosh^2u-\\sinh^2u=1$ holds identically — the bracket is just the constant $1$.",
    "why": "Use the identity to reduce it to a constant and the derivative is immediately $0$; differentiating by brute force gives $6\\cosh\\sinh-6\\sinh\\cosh$, which then cancels.",
    "steps": [
      "Hyperbolic identity: $\\cosh^2(3x)-\\sinh^2(3x)=1$.",
      "Brute force agrees: $2\\cosh(3x)\\cdot3\\sinh(3x)-2\\sinh(3x)\\cdot3\\cosh(3x)=0$.",
      "The derivative of a constant is $0$."
    ],
    "trap": "Missing the identity and, while differentiating by brute force, borrowing the trig minus sign to write $(\\cosh u)'$ as $-\\sinh u$; the two terms no longer cancel, giving $-12\\sinh(3x)\\cosh(3x)$.",
    "check": "At $x=0$, $\\cosh0=1$ and $\\sinh0=0$, so the bracket is $1$; at $x=1$ it is $1$ too."
  },
  "ch-trap-008": {
    "spot": "$\\arctan\\frac1x+\\arctan x$ are complementary angles (their sum is $\\frac\\pi2$ for $x>0$) — the whole thing is piecewise constant.",
    "why": "Recognize it as a constant and the derivative is $0$; differentiating directly also just gives $-\\frac{1}{1+x^2}+\\frac{1}{1+x^2}$.",
    "steps": [
      "For $x>0$: $\\arctan\\frac1x+\\arctan x=\\frac\\pi2$.",
      "Differentiate directly: $\\frac{1}{1+1/x^2}\\cdot\\left(-\\frac{1}{x^2}\\right)=-\\frac{1}{1+x^2}$, which cancels exactly with $\\frac{1}{1+x^2}$.",
      "So the derivative is $=0$ (for $x\\ne0$)."
    ],
    "trap": "Forgetting the inner derivative $-\\frac{1}{x^2}$ of $\\frac1x$ and getting $\\frac{1}{1+1/x^2}+\\frac{1}{1+x^2}=1$.",
    "check": "For $x<0$ the sum is $-\\frac\\pi2$, also a constant: at $x=-2$ the slope is still $0$."
  },
  "ch-trap-009": {
    "spot": "$e^{2\\ln x}=\\left(e^{\\ln x}\\right)^2=x^2$ — the whole fraction is just $\\frac{x^2}{x}=x$ (for $x>0$).",
    "why": "Simplify before differentiating and skip the Quotient Rule and Chain Rule.",
    "steps": [
      "$e^{2\\ln x}=x^2$.",
      "$\\frac{x^2}{x}=x$.",
      "$(x)'=1$."
    ],
    "trap": "Forcing the Quotient Rule and writing the derivative of $e^{2\\ln x}$ as $e^{2\\ln x}$ (missing the factor $\\frac2x$), which gives $\\frac{x\\cdot x^2-x^2}{x^2}=x-1$.",
    "check": "At $x=3$ the expression is $=\\frac{9}{3}=3$, and at $x=3.001$ it is $3.001$: slope $1$."
  },
  "cl-der-010": {
    "spot": "The center of curvature lies on the normal line at distance $\\frac1\\kappa$; at the origin the tangent is horizontal ($y'=0$), so the center is straight above, at $Y=y+\\frac{1+y'^2}{y''}$.",
    "why": "Plug straight into the center-of-curvature formula $Y=y+\\frac{1+y'^2}{y''}$; at the vertex $y'=0$, so it reduces to $\\frac{1}{y''}$.",
    "steps": [
      "$y'=2x$, $y'(0)=0$; $y''=2$.",
      "Curvature $\\kappa=\\frac{|y''|}{(1+y'^2)^{3/2}}=2$, radius $\\frac12$.",
      "$Y=y+\\frac{1+y'^2}{y''}=0+\\frac{1}{2}=\\frac12$."
    ],
    "trap": "Taking the curvature $2$ as the radius and answering $Y=2$.",
    "check": "The lower half of the osculating circle $x^2+\\left(y-\\frac12\\right)^2=\\frac14$ is $y=\\frac12-\\sqrt{\\frac14-x^2}=x^2+x^4+\\cdots$, which matches $x^2$ through the quadratic term."
  },
  "cl-lim-011": {
    "spot": "$\\ln(1+x)+\\ln(1-x)=\\ln(1-x^2)$ — after combining the logs it is of the form $\\ln(1+u)$, with $u=-x^2$ matching the denominator $x^2$ perfectly.",
    "why": "Combining into a single $\\ln(1-x^2)\\sim-x^2$ gives the answer in one step; L'Hôpital's Rule needs two rounds.",
    "steps": [
      "Combine: $\\ln(1+x)+\\ln(1-x)=\\ln(1-x^2)$.",
      "$\\ln(1+u)\\sim u$ with $u=-x^2$: $\\ln(1-x^2)\\sim-x^2$.",
      "So the limit is $=\\frac{-x^2}{x^2}=-1$."
    ],
    "trap": "Using $\\ln(1\\pm x)\\sim\\pm x$ separately, seeing the first-order terms sum to $0$, and calling the limit $0$; once the first-order terms cancel you must look at the second-order terms.",
    "check": "Plug in $x=0.01$: $\\frac{\\ln(0.9999)}{0.0001}\\approx-1.00005$."
  },
  "cl-lim-020": {
    "spot": "The denominator $x-1\\to0$ while the limit is finite — so the numerator must also be $0$ at $x=1$, which gives the first equation.",
    "why": "\"Denominator tends to $0$ and the limit exists\" forces the numerator to be $0$; then factoring (or a derivative) gives the second equation.",
    "steps": [
      "Numerator is $0$ at $x=1$: $1+a+b=0$.",
      "Then the numerator is $=(x-1)(x+1+a)$, and the limit is $=2+a=3$, so $a=1$.",
      "$b=-1-a=-2$; substituting back, the limit is indeed $3$."
    ],
    "trap": "Guessing the answer from the single equation $1+a+b=0$, or taking the limit value $3$ as the numerator's value at $1$ ($1+a+b=3$).",
    "check": "$x^2+x-2=(x-1)(x+2)$; after canceling, $x+2\\to3$."
  },
  "cl-lim-027": {
    "spot": "$|x^2-4|=|x+2|\\cdot|x-2|$, and dividing by $x-2$ leaves $\\pm(x+2)$ — the sign depends on which side of $2$ the $x$ is on.",
    "why": "An absolute value divided by one of its own factors is a sign function, so compute the one-sided limits on the left and right separately.",
    "steps": [
      "As $x\\to2^+$: $x-2>0$, so $f(x)=x+2\\to4$.",
      "As $x\\to2^-$: $x-2<0$, so $f(x)=-(x+2)\\to-4$.",
      "Jump $=4-(-4)=8$."
    ],
    "trap": "Treating $|x^2-4|$ as $x^2-4$ and canceling, getting $x+2\\to4$, assuming both sides agree and the jump is $0$.",
    "check": "Plug in $x=2.01$ and $x=1.99$: $4.01$ and $-3.99$, a difference of about $8$."
  }
};
