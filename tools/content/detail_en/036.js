// Detail v2, English — batch 036. Translation of tools/content/detail/036.js (text only; claims live in the Chinese file).
module.exports = {
  "refine-derivatives-021": {
    "spot": "You need the second derivative of the inverse at $2$, but $g$ itself can't be written down — first find what $f$ sends to $2$ ($f(1)=2$), then differentiate the inverse-derivative formula twice.",
    "why": "Inverting a cubic needs Cardano's formula, far too messy; differentiating $g'=\\frac{1}{f'(g)}$ once more only needs the first and second derivatives of $f$ at $x=1$.",
    "steps": [
      "$f(1)=1+1=2$, so $g(2)=1$.",
      "$f'(x)=3x^2+1$, $f''(x)=6x$; at $x=1$: $f'(1)=4$, $f''(1)=6$.",
      "$g'(y)=\\frac{1}{f'(g(y))}$; differentiate once more in $y$ (Chain Rule): $g''(y)=-\\frac{f''(g)\\,g'}{f'(g)^2}=-\\frac{f''(g)}{f'(g)^3}$.",
      "Plug in: $g''(2)=-\\frac{6}{4^3}=-\\frac{6}{64}=-\\frac{3}{32}$."
    ],
    "trap": "Thinking $g''=\\frac{1}{f''}$ and getting $\\frac{1}{6}$; or plugging $x=2$ straight into $f'$ and $f''$ (you should plug in $g(2)=1$).",
    "check": "$f$ is convex ($f''>0$ for $x>0$), so its inverse should be concave: $g''(2)<0$, the sign is right."
  },
  "refine-derivatives-026": {
    "spot": "$u$ and $v$ both have denominator $x^2+y^2$ — this is the inversion $(x,y)\\mapsto\\frac{(x,y)}{x^2+y^2}$, and the four partial derivatives come out very symmetric.",
    "why": "Computing the four partials with the Quotient Rule and then a $2\\times 2$ determinant is the safest route; by symmetry $u_y$ and $v_x$ are equal, so you only compute one.",
    "steps": [
      "Let $\\rho=x^2+y^2$. $u_x=\\frac{\\rho-2x^2}{\\rho^2}=\\frac{y^2-x^2}{\\rho^2}$.",
      "$u_y=-\\frac{2xy}{\\rho^2}$, and likewise $v_x=-\\frac{2xy}{\\rho^2}$.",
      "$v_y=\\frac{x^2-y^2}{\\rho^2}$.",
      "$J=u_xv_y-u_yv_x=\\frac{-(x^2-y^2)^2-4x^2y^2}{\\rho^4}=-\\frac{(x^2+y^2)^2}{\\rho^4}$.",
      "Cancel to get $J=-\\frac{1}{(x^2+y^2)^2}$."
    ],
    "trap": "In the $u_y v_x$ term the two minus signs multiply to a plus, which is then subtracted; drop a sign and you get something like $\\frac{(x^2-y^2)^2-4x^2y^2}{\\rho^4}$ that doesn't simplify.",
    "check": "Inversion flips orientation (like a reflection), so the Jacobian should be negative; at $(1,0)$, $J=-1$."
  },
  "ser-035": {
    "spot": "The coefficient is $\\frac{1}{n!}$: factorials grow faster than any $c^n$, so with the Ratio Test the ratio drops to $0$.",
    "why": "Factorials call for the Ratio Test: $\\frac{n!}{(n+1)!}=\\frac{1}{n+1}$ cancels cleanly; the Root Test runs into $\\sqrt[n]{n!}$, which is harder.",
    "steps": [
      "Ratio: $\\left|\\frac{a_{n+1}}{a_n}\\right|=\\frac{|x|^{n+1}/(n+1)!}{|x|^n/n!}=\\frac{|x|}{n+1}$.",
      "Whatever $x$ is, $\\frac{|x|}{n+1}\\to 0<1$.",
      "So the series converges for every real $x$; the radius of convergence is infinite."
    ],
    "trap": "Seeing $\\frac{|x|}{n+1}$ and solving $|x|<n+1$, as if the radius depended on $n$; take the limit $n\\to\\infty$ first, then compare with $1$.",
    "check": "This is exactly the Taylor series of $e^x$, and $e^x$ is defined on the whole real line, so an infinite radius makes sense."
  },
  "cl-der-044": {
    "spot": "The displacements are $h=0.1$ and $k=-0.1$, exact opposites — the first-order term $\\frac{1}{2}(h+k)$ cancels completely, leaving only the second-order terms.",
    "why": "The second-degree Taylor polynomial needs only the value, the two first partials and the three second partials at the point; computing the true value of $f$ is not what's asked.",
    "steps": [
      "At $\\left(\\frac{\\pi}{4},\\frac{\\pi}{4}\\right)$: $f=\\frac{1}{2}$, $f_x=\\cos x\\sin y=\\frac{1}{2}$, $f_y=\\sin x\\cos y=\\frac{1}{2}$.",
      "Second order: $f_{xx}=f_{yy}=-\\sin x\\sin y=-\\frac{1}{2}$, $f_{xy}=\\cos x\\cos y=\\frac{1}{2}$.",
      "First-order term: $f_xh+f_yk=\\frac{1}{2}(0.1-0.1)=0$.",
      "Second-order term: $\\frac{1}{2}\\left(f_{xx}h^2+2f_{xy}hk+f_{yy}k^2\\right)=\\frac{1}{2}(-0.005-0.01-0.005)=-0.01$.",
      "$T_2=\\frac{1}{2}+0-0.01=0.49$."
    ],
    "trap": "Forgetting the factor $2$ on the mixed term (writing $f_{xy}hk$): the second-order term becomes $-0.0075$ and you get $0.4925$.",
    "check": "Along this line $f=\\sin(\\frac{\\pi}{4}+t)\\sin(\\frac{\\pi}{4}-t)=\\frac{1}{2}\\cos 2t\\approx\\frac{1}{2}-t^2$, and $t=0.1$ gives $0.49$; the true value $0.49003$ differs only by a fourth-order term."
  },
  "cl-der-050": {
    "spot": "A high-order derivative at $x=0$, and $f$ is $x^2$ times a known series — expand $\\ln(1+x)$, multiply by $x^2$, read off the coefficient of $x^5$ and multiply by $5!$.",
    "why": "Differentiating five times with the Leibniz rule produces a pile of terms; with the series, $f^{(5)}(0)=5!\\cdot[x^5]$ in one step.",
    "steps": [
      "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$.",
      "Multiply by $x^2$: $f(x)=x^3-\\frac{x^4}{2}+\\frac{x^5}{3}-\\cdots$, so the coefficient of $x^5$ is $\\frac{1}{3}$.",
      "Taylor coefficient $=\\frac{f^{(5)}(0)}{5!}$, so $f^{(5)}(0)=120\\cdot\\frac{1}{3}=40$."
    ],
    "trap": "Reading off the $x^5$ coefficient of $\\ln(1+x)$ itself, $\\frac{1}{5}$ (forgetting that multiplying by $x^2$ shifts the powers up by two), and getting $24$.",
    "check": "Leibniz: only $(x^2)''=2$ paired with the third derivative of $\\ln(1+x)$, $\\frac{2}{(1+x)^3}$, survives: $\\binom{5}{2}\\cdot 2\\cdot 2=40$."
  },
  "cl-int-040": {
    "spot": "$\\frac{\\sin x}{x}$ times the exponential decay $e^{-\\sqrt3 x}$: replace $\\sqrt3$ by a parameter $a$, and differentiating in $a$ eats the $x$ in the denominator.",
    "why": "$\\frac{\\sin x}{x}$ has no elementary antiderivative, so you can't integrate directly; one derivative (Feynman's trick) turns it into $\\int e^{-ax}\\sin x\\,dx$, which has a formula.",
    "steps": [
      "Let $F(a)=\\int_0^\\infty e^{-ax}\\frac{\\sin x}{x}dx$; we want $F(\\sqrt3)$.",
      "Differentiate in $a$: $F'(a)=-\\int_0^\\infty e^{-ax}\\sin x\\,dx=-\\frac{1}{1+a^2}$ (e.g. for $a=2$ the integral is $\\frac{1}{5}$).",
      "As $a\\to\\infty$, $F(a)\\to 0$, so $F(a)=\\int_a^\\infty\\frac{ds}{1+s^2}=\\frac{\\pi}{2}-\\arctan a$.",
      "$F(\\sqrt3)=\\frac{\\pi}{2}-\\frac{\\pi}{3}=\\frac{\\pi}{6}$."
    ],
    "trap": "Starting from $F(0)=\\frac{\\pi}{2}$ but forgetting the constant must be fixed at the $a\\to\\infty$ end, or misremembering $\\arctan\\sqrt3$ as $\\frac{\\pi}{6}$ and getting $\\frac{\\pi}{3}$.",
    "check": "At $a=0$ you get back the Dirichlet integral $\\frac{\\pi}{2}$; adding decay makes the value smaller, and $\\frac{\\pi}{6}<\\frac{\\pi}{2}$ is consistent."
  },
  "cl-int-041": {
    "spot": "The integral of $\\ln(a^2\\cos^2x+b^2\\sin^2x)$ over $[0,\\frac{\\pi}{2}]$ is a classic: treat $4$ as $a^2$ and differentiate in $a$, and the integrand becomes a rational trig expression.",
    "why": "With a trig expression inside the log, integration by parts goes in circles; after differentiating in the parameter $a$, the substitution $\\tan x$ gives a standard rational integral.",
    "steps": [
      "Let $F(a)=\\int_0^{\\pi/2}\\ln(a^2\\cos^2x+\\sin^2x)dx$; $F(1)=\\int\\ln 1=0$, and we want $F(2)$.",
      "$F'(a)=\\int_0^{\\pi/2}\\frac{2a\\cos^2x}{a^2\\cos^2x+\\sin^2x}dx$; with $u=\\tan x$ this becomes $\\int_0^\\infty\\frac{2a\\,du}{(a^2+u^2)(1+u^2)}=\\frac{\\pi}{a+1}$ (for $a=2$ it is $\\frac{\\pi}{3}$).",
      "Integrate back: $F(a)=\\pi\\ln(a+1)+C$; $F(1)=0$ gives $C=-\\pi\\ln 2$, so $F(a)=\\pi\\ln\\frac{a+1}{2}$.",
      "$F(2)=\\pi\\ln\\frac{3}{2}$."
    ],
    "trap": "Splitting the integrand into $\\ln 4+\\ln\\cos^2x+\\cdots$ — the log contains a sum, not a product, so it can't be split.",
    "check": "The integrand lies between $\\ln 1=0$ and $\\ln 4$, so the integral should be between $0$ and $\\frac{\\pi}{2}\\ln 4\\approx 2.18$; $\\pi\\ln 1.5\\approx 1.27$."
  },
  "cl-int-048": {
    "spot": "Denominator $x$, numerator $1-\\cos 2x$, a decaying $e^{-x}$ in front: replace $2$ by a parameter $b$, and one derivative in $b$ removes the $x$ in the denominator.",
    "why": "$\\frac{1-\\cos bx}{x}$ has no elementary antiderivative; after differentiating in $b$ you're left with $\\int e^{-x}\\sin bx\\,dx$, a table-level integral.",
    "steps": [
      "Let $I(b)=\\int_0^\\infty e^{-x}\\frac{1-\\cos bx}{x}dx$; $I(0)=0$, and we want $I(2)$.",
      "$I'(b)=\\int_0^\\infty e^{-x}\\sin bx\\,dx=\\frac{b}{1+b^2}$ (e.g. $b=2$ gives $\\frac{2}{5}$).",
      "Integrate back: $I(b)=\\frac{1}{2}\\ln(1+b^2)$, and since $I(0)=0$ no constant is needed.",
      "$I(2)=\\frac{1}{2}\\ln 5$."
    ],
    "trap": "Forgetting the inner derivative $x$ of $\\cos bx$ when differentiating in $b$, thinking the integrand becomes $e^{-x}\\frac{\\sin bx}{x}$ — back to something you can't integrate.",
    "check": "$1-\\cos 2x\\le 2x^2$, so the integral is less than $\\int_0^\\infty 2xe^{-x}dx=2$; $\\frac{1}{2}\\ln 5\\approx 0.80$."
  },
  "refine-derivatives-033": {
    "spot": "Third derivative of a composition: the problem gives the first through third derivatives of both $g$ and $f$, which is telling you to apply the formula for $(f\\circ g)'''$ (Faa di Bruno).",
    "why": "There are no concrete functions, so a formula is the only way; deriving it yourself by differentiating three times takes just three lines and makes it harder to miss the coefficient $3$ than memorizing.",
    "steps": [
      "$h'=f'(g)\\,g'$.",
      "$h''=f''(g)\\,g'^2+f'(g)\\,g''$.",
      "Differentiate again: $h'''=f'''(g)\\,g'^3+2f''(g)\\,g'g''+f''(g)\\,g'g''+f'(g)\\,g'''=f'''(g)g'^3+3f''(g)g'g''+f'(g)g'''$.",
      "Check with concrete polynomials: $g-2=3s-\\frac{s^2}{2}+\\frac{2s^3}{3}$, $f(2+w)-f(2)=5w-w^2+\\frac{w^3}{6}$ (with $s=x-1$); after composing, the $s^3$ coefficient is $\\frac{65}{6}$.",
      "$h'''(1)=27+18+20=65$."
    ],
    "trap": "Writing the middle term $f''(g)g'g''$ only once (missing the factor $2$ that comes from differentiating the first term of $h''$), giving $27+6+20=53$.",
    "check": "The $s^3$ coefficient $\\frac{65}{6}$ times $3!$ is exactly $65$."
  },
  "refine-derivatives-038": {
    "spot": "Differentiating $\\frac{t^a-1}{\\ln t}$ in $a$ kills the $\\ln t$ — a textbook Feynman integral; and the problem only wants $I''$, so differentiate twice and compute.",
    "why": "$\\frac{t^a-1}{\\ln t}$ has no elementary antiderivative in $t$; after differentiating in $a$, $\\int t^a dt$ is the simplest power integral there is.",
    "steps": [
      "$\\frac{\\partial}{\\partial a}\\frac{t^a-1}{\\ln t}=t^a$, so $I'(a)=\\int_0^1t^a\\,dt=\\frac{1}{a+1}$.",
      "$I(0)=0$, so integrating back gives $I(a)=\\ln(1+a)$ (e.g. $I(1)=\\ln 2$).",
      "$I''(a)=-\\frac{1}{(a+1)^2}$; it also equals $\\int_0^1t^a\\ln t\\,dt$.",
      "$I''(1)=-\\frac{1}{4}$."
    ],
    "trap": "Thinking $I'(a)=\\int t^a\\ln t\\,dt$ (an extra factor $\\ln t$) — that's the $a$-derivative of $t^a$, not of $\\frac{t^a-1}{\\ln t}$.",
    "check": "$I$ is the concave function $\\ln(1+a)$, so $I''<0$; and $t\\ln t$ is negative on all of $(0,1)$, so the integral should be negative too."
  },
  "refine-derivatives-040": {
    "spot": "Newton's iteration for $x^2+1$ is $x\\mapsto\\frac{1}{2}\\left(x-\\frac{1}{x}\\right)$, which is exactly the double-angle formula for $\\cot$; and $2+\\sqrt3=\\cot 15^\\circ$.",
    "why": "Iterating eight times by hand is slow and piles up rounding error (this iteration is chaotic); viewed as angle doubling, you only need $2^8\\cdot 15^\\circ$ modulo $180^\\circ$.",
    "steps": [
      "Newton's method: $x_{n+1}=x_n-\\frac{x_n^2+1}{2x_n}=\\frac{1}{2}\\left(x_n-\\frac{1}{x_n}\\right)$.",
      "Double-angle formula: $\\cot 2\\theta=\\frac{\\cot^2\\theta-1}{2\\cot\\theta}=\\frac{1}{2}\\left(\\cot\\theta-\\frac{1}{\\cot\\theta}\\right)$; so if $x_n=\\cot\\theta$ then $x_{n+1}=\\cot 2\\theta$.",
      "$x_0=2+\\sqrt3=\\cot\\frac{\\pi}{12}$, so $x_n=\\cot\\frac{2^n\\pi}{12}$.",
      "$x_8=\\cot\\frac{256\\pi}{12}$, and $\\frac{256}{12}=21+\\frac{1}{3}$; $\\cot$ has period $\\pi$, so $x_8=\\cot\\frac{\\pi}{3}$.",
      "$x_8=\\cot\\frac{\\pi}{3}=\\frac{\\sqrt3}{3}$."
    ],
    "trap": "Assuming that with no real root the iteration blows up to infinity; in fact it jumps around the real line but stays finite at every step, landing on $\\frac{\\sqrt3}{3}$ after eight steps.",
    "check": "First two steps by hand: $x_1=\\cot\\frac{\\pi}{6}=\\sqrt3$, $x_2=\\frac{1}{2}(\\sqrt3-\\frac{1}{\\sqrt3})=\\frac{1}{\\sqrt3}$ — already back at $\\cot\\frac{\\pi}{3}$; after that $\\frac{\\pi}{3}\\to\\frac{2\\pi}{3}\\to\\frac{\\pi}{3}$ cycles every two steps, so every even step gives this value."
  },
  "refine-derivatives-042": {
    "spot": "The folium of Descartes $x^3+y^3=6xy$; you can't solve for $y$ — use implicit differentiation twice: find $y'$ at $(3,3)$ first, then plug it into the twice-differentiated equation.",
    "why": "Plugging in the numerical value of $y'$ before solving for $y''$ is much simpler than finding a general formula for $y''$ (fractions inside fractions).",
    "steps": [
      "First confirm the point is on the curve: $27+27=54=6\\cdot 9$.",
      "Differentiate once: $3x^2+3y^2y'=6y+6xy'$, so $y'=\\frac{2y-x^2}{y^2-2x}$; at $(3,3)$: $y'=\\frac{6-9}{9-6}=-1$.",
      "Differentiate again (differentiate both sides of $x^2+y^2y'=2y+2xy'$ in $x$): $2x+2yy'^2+y^2y''=2y'+2y'+2xy''$.",
      "Plug in $x=y=3$ and $y'=-1$: $6+6+9y''=-4+6y''$, so $3y''=-16$.",
      "$\\frac{d^2y}{dx^2}=-\\frac{16}{3}$."
    ],
    "trap": "On the second differentiation, turning $y^2y'$ into just $y^2y''$ and missing the $2yy'\\cdot y'$ term, which gives $3y''=-10$.",
    "check": "The parametrization $x=\\frac{6s}{1+s^3}$, $y=\\frac{6s^2}{1+s^3}$ passes through $(3,3)$ at $s=1$, and $\\frac{dy/ds}{dx/ds}$ at $s=1$ is $-1$, matching step two."
  },
  "cl-int-050": {
    "spot": "Numerator $\\arctan x$ with an $x$ in the denominator: change it to $\\arctan(ax)$, and differentiating in $a$ gives $\\frac{x}{1+a^2x^2}$, which cancels the $x$ in the denominator.",
    "why": "Substituting $x=\\sin\\theta$ directly gives $\\int\\frac{\\arctan(\\sin\\theta)}{\\sin\\theta}d\\theta$, still not integrable; after differentiating in the parameter you get the standard $\\int\\frac{dx}{(1+a^2x^2)\\sqrt{1-x^2}}$.",
    "steps": [
      "Let $I(a)=\\int_0^1\\frac{\\arctan(ax)}{x\\sqrt{1-x^2}}dx$; $I(0)=0$, and we want $I(1)$.",
      "$I'(a)=\\int_0^1\\frac{dx}{(1+a^2x^2)\\sqrt{1-x^2}}$; substitute $x=\\sin\\theta$ and then use a $\\tan\\theta$ substitution to get $\\frac{\\pi}{2\\sqrt{1+a^2}}$ (for $a=2$ it is $\\frac{\\pi}{2\\sqrt5}$).",
      "Integrate back: $I(1)=\\int_0^1\\frac{\\pi}{2\\sqrt{1+u^2}}du=\\frac{\\pi}{2}\\ln\\left(u+\\sqrt{1+u^2}\\right)\\Big|_0^1$.",
      "$=\\frac{\\pi}{2}\\ln(1+\\sqrt2)$."
    ],
    "trap": "Thinking $\\frac{d}{da}\\arctan(ax)=\\frac{1}{1+a^2x^2}$ and missing the inner $x$, so the $x$ in the denominator never cancels.",
    "check": "On $[0,1]$, $\\frac{\\arctan x}{x}$ lies between $\\frac{\\pi}{4}$ and $1$, and $\\int_0^1\\frac{dx}{\\sqrt{1-x^2}}=\\frac{\\pi}{2}$, so the answer is between $\\frac{\\pi^2}{8}\\approx 1.23$ and $\\frac{\\pi}{2}\\approx 1.57$; $1.384$ falls inside."
  },
  "refine-derivatives-047": {
    "spot": "The fifth derivative of the inverse at $0$ — that's the same as a Taylor coefficient of $g$ at $0$. $f$ is odd with $f(0)=0$, so $g$ is odd too, and you only need the coefficients of $y$, $y^3$, $y^5$; substitute $x=\\frac{y-x^3}{3}$ back into itself repeatedly.",
    "why": "Pushing the inverse-derivative formula to fifth order explodes; undetermined coefficients plus repeated substitution only needs polynomial multiplication at each step.",
    "steps": [
      "Rewrite $y=x^3+3x$ as $x=\\frac{y}{3}-\\frac{x^3}{3}$; let $g(y)=a_1y+a_3y^3+a_5y^5+\\cdots$, with leading coefficient $a_1=\\frac{1}{3}$ ($g'(0)=\\frac{1}{f'(0)}$).",
      "$x^3=a_1^3y^3+3a_1^2a_3y^5+\\cdots$; comparing $y^3$: $a_3=-\\frac{a_1^3}{3}=-\\frac{1}{81}$.",
      "Comparing $y^5$: $a_5=-\\frac{3a_1^2a_3}{3}=-\\frac{1}{9}\\cdot\\left(-\\frac{1}{81}\\right)=\\frac{1}{729}$.",
      "Check with the closed form $g(y)=2\\sinh\\left(\\frac{1}{3}\\operatorname{arsinh}\\frac{y}{2}\\right)$: its $y^5$ coefficient is exactly $\\frac{1}{729}$.",
      "$g^{(5)}(0)=5!\\cdot a_5=\\frac{120}{729}=\\frac{40}{243}$."
    ],
    "trap": "When comparing $y^5$, forgetting the cross term $3a_1^2a_3y^5$ in the expansion of $x^3$ and concluding $a_5=0$.",
    "check": "Where the closed form comes from: let $x=2\\sinh s$; then $x^3+3x=2\\sinh 3s$, and substituting back confirms it really is the inverse."
  },
  "refine-derivatives-053": {
    "spot": "Inside the log is $a^2\\cos^2x+\\sin^2x$ and the problem wants the derivative in $a$ — pass the derivative straight inside the integral, and the integrand becomes a rational trig expression.",
    "why": "Finding $F(a)$ first and then differentiating costs an extra integration; the Leibniz rule gives $F'(a)$ directly, and one $\\tan x$ substitution finishes it.",
    "steps": [
      "$F'(a)=\\int_0^{\\pi/2}\\frac{2a\\cos^2x}{a^2\\cos^2x+\\sin^2x}dx$; at $a=2$ this is $\\int_0^{\\pi/2}\\frac{4\\cos^2x}{4\\cos^2x+\\sin^2x}dx$.",
      "Divide top and bottom by $\\cos^2x$ and let $u=\\tan x$ ($dx=\\frac{du}{1+u^2}$): $\\int_0^\\infty\\frac{4\\,du}{(4+u^2)(1+u^2)}$.",
      "Partial fractions: $\\frac{4}{(4+u^2)(1+u^2)}=\\frac{4}{3}\\left(\\frac{1}{1+u^2}-\\frac{1}{4+u^2}\\right)$.",
      "Integrate: $\\frac{4}{3}\\left(\\frac{\\pi}{2}-\\frac{\\pi}{4}\\right)=\\frac{\\pi}{3}$."
    ],
    "trap": "Evaluating $\\int_0^\\infty\\frac{du}{4+u^2}$ as $\\frac{\\pi}{2}$ (forgetting the $\\frac{1}{2}$ in $\\frac{1}{2}\\arctan\\frac{u}{2}$), which gives $0$.",
    "check": "The general result $F(a)=\\pi\\ln\\frac{a+1}{2}$ differentiates to $\\frac{\\pi}{a+1}$, which at $a=2$ is exactly $\\frac{\\pi}{3}$."
  },
  "refine-derivatives-057": {
    "spot": "$\\frac{x+y}{1-xy}$ is the addition formula for $\\tan$: $f(x)+f(y)=f\\left(\\frac{x+y}{1-xy}\\right)$ looks just like $\\arctan x+\\arctan y$.",
    "why": "Guessing $\\arctan$ still needs proof; differentiating in $y$ and setting $y=0$ gives a formula for $f'$ directly and pins down the function in one go.",
    "steps": [
      "Set $x=y=0$: $2f(0)=f(0)$, so $f(0)=0$.",
      "Differentiate both sides in $y$ and set $y=0$: $f'(0)=f'(x)\\cdot\\frac{\\partial}{\\partial y}\\frac{x+y}{1-xy}\\Big|_{y=0}=f'(x)(1+x^2)$.",
      "So $f'(x)=\\frac{2}{1+x^2}$, and with $f(0)=0$ we get $f(x)=2\\arctan x$.",
      "$f(\\sqrt3)=2\\cdot\\frac{\\pi}{3}=\\frac{2\\pi}{3}$."
    ],
    "trap": "Assuming $f=\\arctan$ and answering $\\frac{\\pi}{3}$, forgetting that $f'(0)=2$ multiplies the whole function by $2$.",
    "check": "Check the functional equation: with $x=0.3$, $y=0.5$, $2\\arctan 0.3+2\\arctan 0.5$ equals $2\\arctan\\frac{0.8}{0.85}$."
  },
  "refine-derivatives-058": {
    "spot": "All three functions are the same factor $\\varphi=e^x\\ln x$ times $1$, $x$, $x^2$ — and the Wronskian satisfies $W(\\varphi y_1,\\varphi y_2,\\varphi y_3)=\\varphi^3W(y_1,y_2,y_3)$.",
    "why": "Differentiating all three functions twice and expanding a $3\\times 3$ determinant is very long; after pulling out the common factor only $W(1,x,x^2)$ is left, an upper-triangular determinant.",
    "steps": [
      "Each row of the Wronskian matrix is $(\\varphi y_i)^{(k)}$; expanding with the Leibniz rule, the parts involving $\\varphi'$ and $\\varphi''$ are multiples of earlier rows, so row operations remove them and leave $\\varphi^3W(y_1,y_2,y_3)$.",
      "$W(1,x,x^2)=\\det\\begin{pmatrix}1&x&x^2\\\\0&1&2x\\\\0&0&2\\end{pmatrix}=1\\cdot 1\\cdot 2=2$.",
      "So $W=2\\varphi^3=2e^{3x}(\\ln x)^3$.",
      "Expanding the determinant numerically with the derivatives of the three original functions gives the same result."
    ],
    "trap": "Pulling out only one $\\varphi$ (writing $\\varphi W(1,x,x^2)$); each of the three rows carries a $\\varphi$, so you pull out $\\varphi^3$.",
    "check": "At $x=1$, $\\ln x=0$, so all three functions are $0$ there; the first row of the determinant is zero and $W(1)=0$."
  },
  "app-006": {
    "spot": "$4.1$ is very close to the perfect square $4$: use the tangent line at $a=4$, $L(x)=\\sqrt4+\\frac{1}{2\\sqrt4}(x-4)$.",
    "why": "Pick a base point where the root is easy and that is closest to $4.1$, so the tangent-line error is smallest; choosing $a=1$ or $9$ would be far off.",
    "steps": [
      "$f(x)=\\sqrt x$, $f(4)=2$.",
      "$f'(x)=\\frac{1}{2\\sqrt x}$, $f'(4)=\\frac{1}{4}$.",
      "$L(4.1)=2+\\frac{1}{4}\\cdot 0.1=2.025=\\frac{81}{40}$."
    ],
    "trap": "Using $4.1$ as $\\Delta x$ instead of $0.1$, or computing $f'(4)$ as $\\frac{1}{2}$ and getting $2.05$.",
    "check": "The true value $\\sqrt{4.1}\\approx 2.0248$ is slightly less than $2.025$ — $\\sqrt x$ is concave, so the tangent line lies above the curve."
  },
  "cl-der-002": {
    "spot": "It asks for the differential $dy$, not the actual change $\\Delta y$: just use $dy=f'(x)\\,dx$.",
    "why": "By definition $dy$ is the change along the tangent line, so it's just derivative times displacement — no need to compute $2.1^3$.",
    "steps": [
      "$f'(x)=3x^2$, $f'(2)=12$.",
      "$dy=f'(2)\\,dx=12\\times 0.1$.",
      "$dy=1.2$."
    ],
    "trap": "Computing the actual change $\\Delta y=2.1^3-8=1.261$; the problem asks for the differential $dy$.",
    "check": "$\\Delta y=1.261$ and $dy=1.2$ differ by $0.061$, roughly $3x\\,(dx)^2=0.06$ — a second-order small quantity."
  },
  "cl-int-002": {
    "spot": "Euler's method means \"at each step, walk a straight segment with the slope at the current point\": $y_{n+1}=y_n+h\\,f(x_n,y_n)$, here with $f=x+y$.",
    "why": "The problem specifies two steps of Euler's method, so just apply the formula twice; solving for the exact solution $2e^x-x-1$ gives the true value, not the approximation asked for.",
    "steps": [
      "Step one: $x_0=0$, $y_0=1$, slope $0+1=1$, $y_1=1+0.1\\cdot 1=1.1$.",
      "Step two: $x_1=0.1$, $y_1=1.1$, slope $0.1+1.1=1.2$.",
      "$y_2=1.1+0.1\\cdot 1.2=1.22$."
    ],
    "trap": "In step two using only $y_1$ ($1.1$) for the slope and forgetting to add $x_1=0.1$, which gives $1.21$.",
    "check": "The exact solution $y=2e^x-x-1$ is about $1.2428$ at $0.2$; the solution is convex, so Euler's polygon stays below it, and $1.22$ being low makes sense."
  },
  "cl-lim-001": {
    "spot": "For small $u$, $\\sqrt{1+u}-1$ is about $\\frac{u}{2}$, and here $u=x^2$ — so the order is the order of $u$.",
    "why": "$\\sqrt{1+u}\\approx 1+\\frac{u}{2}$ shows the leading term in one step; rationalizing also works: $\\frac{x^2}{\\sqrt{1+x^2}+1}$, with the denominator tending to $2$.",
    "steps": [
      "Rationalize: $\\sqrt{1+x^2}-1=\\frac{x^2}{\\sqrt{1+x^2}+1}$.",
      "The denominator $\\to 2$, so $\\frac{\\sqrt{1+x^2}-1}{x^2}\\to\\frac{1}{2}$, and $c=\\frac{1}{2}\\ne 0$.",
      "So $k=2$."
    ],
    "trap": "Reading it as $\\sqrt{1+x}-1\\sim\\frac{x}{2}$ and answering $k=1$; the thing under the root is $x^2$.",
    "check": "Plug in $x=0.01$: $\\sqrt{1.0001}-1\\approx 0.00005=\\frac{1}{2}(0.01)^2$."
  },
  "cl-ser-025": {
    "spot": "This is the Limit Comparison Test step: $a_n$ has a degree-one numerator and degree-three denominator, the same order as $\\frac{1}{n^2}$, and the ratio is the ratio of leading coefficients.",
    "why": "After rewriting as $\\frac{(2n+1)n^2}{n^3+n}$ it's a rational limit at infinity — just look at the highest-degree terms.",
    "steps": [
      "$\\frac{a_n}{b_n}=\\frac{2n+1}{n^3+n}\\cdot n^2=\\frac{2n^3+n^2}{n^3+n}$.",
      "Divide top and bottom by $n^3$: $\\frac{2+\\frac{1}{n}}{1+\\frac{1}{n^2}}$.",
      "As $n\\to\\infty$: the limit is $2$."
    ],
    "trap": "Writing $\\frac{a_n}{b_n}$ as $\\frac{a_n}{n^2}$ (dividing by $b_n$ means multiplying by $n^2$), which gives $0$.",
    "check": "Plug in $n=100$: $\\frac{201\\cdot 10^4}{10^6+100}\\approx 2.0098$, close to $2$."
  },
  "cl-ser-035": {
    "spot": "Coefficient $\\frac{n^2}{7^n}$: $n^2$ is a polynomial whose $n$-th root tends to $1$, so the radius is determined entirely by $7^n$.",
    "why": "With the Ratio Test, $\\frac{(n+1)^2}{n^2}\\to 1$ is immediate; polynomial factors don't affect the radius of convergence.",
    "steps": [
      "Ratio: $\\left|\\frac{a_{n+1}}{a_n}\\right|=\\frac{(n+1)^2}{n^2}\\cdot\\frac{|x|}{7}$.",
      "As $n\\to\\infty$, $\\frac{(n+1)^2}{n^2}\\to 1$, so the ratio tends to $\\frac{|x|}{7}$.",
      "We need $\\frac{|x|}{7}<1$, so the radius of convergence is $R=7$."
    ],
    "trap": "Answering $\\frac{1}{7}$: the ratio limit is $\\frac{1}{7}$, and the radius is its reciprocal.",
    "check": "At $x=3.5$ (inside the radius) the terms $\\frac{n^2}{2^n}$ tend to $0$; at $x=7$ the terms are $n^2$, which don't tend to $0$ at all."
  },
  "cx-app-006": {
    "spot": "Fixed sum, maximize the product: call one number $x$, the other is $20-x$, and it becomes maximizing a one-variable quadratic.",
    "why": "The quadratic $x(20-x)$ opens downward, so its vertex is the maximum; you can also use AM-GM directly: $xy\\le\\left(\\frac{x+y}{2}\\right)^2$.",
    "steps": [
      "$P(x)=x(20-x)=20x-x^2$, $0<x<20$.",
      "$P'(x)=20-2x=0\\Rightarrow x=10$; $P''=-2<0$, so it's a maximum.",
      "Maximum product $P(10)=10\\cdot 10=100$."
    ],
    "trap": "Answering $x=10$ (where the maximum occurs) instead of the product $100$.",
    "check": "Try nearby values: $9\\times 11=99$, $8\\times 12=96$, both less than $100$."
  },
  "cx-int-003": {
    "spot": "The antiderivative of $e^x$ is itself, so apply the Fundamental Theorem of Calculus with the limits directly.",
    "why": "This is one of the most basic antiderivatives; no substitution needed.",
    "steps": [
      "$\\int e^x\\,dx=e^x+C$.",
      "Plug in the limits: $e^1-e^0$.",
      "$=e-1$."
    ],
    "trap": "Forgetting that the lower limit gives $e^0=1$, not $0$, and answering $e$.",
    "check": "On $[0,1]$, $e^x$ is between $1$ and $e$, so the integral should be between $1$ and $e$; $e-1\\approx 1.718$."
  },
  "der-027": {
    "spot": "A square root inside a log: use log rules to turn $\\ln\\sqrt{1+x^2}$ into $\\frac{1}{2}\\ln(1+x^2)$, and the root disappears.",
    "why": "Simplify first and you need the Chain Rule only once; differentiating directly takes two layers of Chain Rule through the root, and it's easy to lose the $\\frac{1}{2}$.",
    "steps": [
      "$\\ln\\sqrt{1+x^2}=\\frac{1}{2}\\ln(1+x^2)$.",
      "Chain Rule: $\\frac{d}{dx}\\ln(1+x^2)=\\frac{2x}{1+x^2}$.",
      "Multiply by $\\frac{1}{2}$: $\\frac{x}{1+x^2}$."
    ],
    "trap": "Using the log rule but forgetting to multiply by $\\frac{1}{2}$ at the end, answering $\\frac{2x}{1+x^2}$.",
    "check": "At $x=0$ the function is at its minimum ($\\ln 1=0$), so the derivative should be $0$."
  },
  "fd-der-001": {
    "spot": "Differentiate the polynomial term by term: Power Rule for $x^4$, and the derivative of $2x$ is the constant $2$.",
    "why": "The derivative of a sum is the sum of the derivatives; apply $\\frac{d}{dx}x^n=nx^{n-1}$ to each term.",
    "steps": [
      "$\\frac{d}{dx}x^4=4x^3$.",
      "$\\frac{d}{dx}2x=2$.",
      "Add: $4x^3+2$."
    ],
    "trap": "Writing the derivative of $2x$ as $2x$ or $0$.",
    "check": "At $x=1$ the derivative is $4+2=6$."
  },
  "fd-int-011": {
    "spot": "The integrand is the square of $(1-x)$: let $u=1-x$ and it becomes $\\int u^2\\,du$ — no need to expand.",
    "why": "One substitution and you're done; expanding to $1-2x+x^2$ and integrating term by term also works, just with more steps.",
    "steps": [
      "Let $u=1-x$, $du=-dx$; $x:0\\to 1$ corresponds to $u:1\\to 0$.",
      "$\\int_0^1(1-x)^2dx=\\int_0^1u^2\\,du$ (the minus sign flips the limits back).",
      "$=\\frac{1}{3}$."
    ],
    "trap": "Forgetting the minus sign in $du=-dx$ without flipping the limits, which gives $-\\frac{1}{3}$.",
    "check": "$(1-x)^2$ and $x^2$ are mirror images on $[0,1]$, so the area is the same, $\\frac{1}{3}$."
  },
  "fd-ser-010": {
    "spot": "Adding $1$ through $10$: an arithmetic series — use Gauss's end-pairing, $\\frac{n(n+1)}{2}$.",
    "why": "Pairing ends gives $1+10=2+9=\\cdots=11$, with $5$ pairs — faster than adding one by one and harder to get wrong.",
    "steps": [
      "Formula: $\\sum_{k=1}^{n}k=\\frac{n(n+1)}{2}$.",
      "$n=10$: $\\frac{10\\cdot 11}{2}$.",
      "The sum is $55$."
    ],
    "trap": "Writing the formula as $\\frac{n(n-1)}{2}$ and getting $45$.",
    "check": "End-pairing: $5$ pairs of $11$ each, $5\\times 11=55$."
  },
  "fd-ser-015": {
    "spot": "$\\frac{2^n}{3^n}=\\left(\\frac{2}{3}\\right)^n$: a geometric series with ratio $\\frac{2}{3}$.",
    "why": "For a geometric series only the ratio matters: $|r|<1$ means it converges — you can even compute the sum — no other test needed.",
    "steps": [
      "$\\frac{2^n}{3^n}=\\left(\\frac{2}{3}\\right)^n$, ratio $r=\\frac{2}{3}$.",
      "$|r|=\\frac{2}{3}<1$, so the geometric series converges, with sum $\\frac{r}{1-r}=2$.",
      "So this series converges."
    ],
    "trap": "Seeing that numerator and denominator both go to infinity and assuming divergence; the ratio $\\left(\\frac{2}{3}\\right)^n$ actually goes to $0$ quickly.",
    "check": "The first three terms $\\frac{2}{3}+\\frac{4}{9}+\\frac{8}{27}\\approx 1.41$ are already climbing toward $2$."
  },
  "lec-01-m3": {
    "spot": "A rational function as $x\\to\\infty$, numerator and denominator both quadratic: the answer is the ratio of leading coefficients, $\\frac{3}{2}$.",
    "why": "Divide top and bottom by $x^2$ and all lower-order terms go to $0$; no L'Hôpital's Rule needed.",
    "steps": [
      "Divide top and bottom by $x^2$: $\\frac{3+\\frac{1}{x^2}}{2-\\frac{1}{x}}$.",
      "$\\frac{1}{x^2}\\to 0$, $\\frac{1}{x}\\to 0$.",
      "The limit is $=\\frac{3}{2}$."
    ],
    "trap": "Looking only at the constant terms, $\\frac{1}{0}$, or only at the numerator's top degree and thinking it goes to infinity; with equal degrees, take the coefficient ratio.",
    "check": "Plug in $x=1000$: $\\frac{3000001}{1999000}\\approx 1.5008$."
  },
  "lec-01-m5": {
    "spot": "Use the Intermediate Value Theorem to locate a root: find two easy points where $f(x)=x^3+x-1$ has opposite signs — try $0$ and $1$ first.",
    "why": "$f$ is a polynomial, continuous everywhere, so opposite signs at the endpoints guarantee a root in between; plugging in integers is easiest.",
    "steps": [
      "$f(x)=x^3+x-1$ is a polynomial, continuous on $[0,1]$.",
      "$f(0)=-1<0$.",
      "$f(1)=1+1-1=1>0$.",
      "The endpoint values have opposite signs, so by the Intermediate Value Theorem the equation has a root in $(0,1)$."
    ],
    "trap": "Computing $f(0)$ and $f(1)$ without checking continuity; the Intermediate Value Theorem requires continuity (fine here, since it's a polynomial).",
    "check": "The root is about $0.682$: $f(0.68)<0<f(0.69)$, indeed inside $(0,1)$."
  },
  "lec-02-m1": {
    "spot": "Derivative of a polynomial at a point: differentiate term by term first, then plug in $x=1$.",
    "why": "The Power Rule does it in one step; no need to go back to the limit definition.",
    "steps": [
      "$f'(x)=3x^2-2$.",
      "Plug in $x=1$: $3-2$.",
      "$f'(1)=1$."
    ],
    "trap": "Plugging in before differentiating: $f(1)=-1$ is a constant, and its derivative is $0$. Differentiate first, then plug in.",
    "check": "The secant slope $\\frac{f(1.001)-f(0.999)}{0.002}\\approx 1$."
  },
  "lec-03-m2": {
    "spot": "Inside the $\\ln$ is $x^2+1$: Chain Rule — the outer $\\ln u$ gives $\\frac{1}{u}$, the inner gives $2x$.",
    "why": "The outer function is standard and the inner is a polynomial, so the Chain Rule finishes it in one step.",
    "steps": [
      "Let $u=x^2+1$; $\\frac{d}{du}\\ln u=\\frac{1}{u}$.",
      "Inner: $\\frac{du}{dx}=2x$.",
      "Multiply: $\\frac{2x}{x^2+1}$."
    ],
    "trap": "Forgetting the inner derivative and writing $\\frac{1}{x^2+1}$.",
    "check": "At $x=1$ the derivative is $=1$; the secant $\\frac{\\ln 2.0201-\\ln 1.9801}{0.02}\\approx 1$."
  },
  "lec-03-m5": {
    "spot": "Constant base $2$ with exponent $x$: an exponential function, not a power function — write it as $e^{x\\ln 2}$ and differentiate.",
    "why": "Rewriting $2^x$ as $e^{x\\ln 2}$ lets you use the Chain Rule for $e^u$; the Power Rule only applies to a variable raised to a constant power.",
    "steps": [
      "$2^x=e^{x\\ln 2}$.",
      "Chain Rule: $\\frac{d}{dx}e^{x\\ln 2}=e^{x\\ln 2}\\cdot\\ln 2$.",
      "So $\\frac{d}{dx}2^x=2^x\\ln 2$."
    ],
    "trap": "Treating it as a power function and using the Power Rule, writing $x\\cdot 2^{x-1}$.",
    "check": "At $x=0$ the slope is $\\ln 2\\approx 0.693$, matching the secant slope $\\frac{2^{0.001}-2^{-0.001}}{0.002}$."
  },
  "lec-04-m1": {
    "spot": "Critical points are where $f'(x)=0$ (or doesn't exist); $f$ is a polynomial, so its derivative exists everywhere and you just solve $f'=0$.",
    "why": "The derivative of a polynomial is a polynomial and always exists, so all that's left is solving an equation.",
    "steps": [
      "$f'(x)=3x^2-3=3(x-1)(x+1)$.",
      "$f'(x)=0\\Rightarrow x=1$ or $x=-1$.",
      "The critical points are $x=-1$ and $x=1$, the set $\\{-1,1\\}$."
    ],
    "trap": "Solving $f(x)=0$ (getting $0,\\pm\\sqrt3$) — those are zeros, not critical points.",
    "check": "$f(-1)=2$ is a local max and $f(1)=-2$ is a local min; both are turning points where the derivative changes sign."
  },
  "lec-04-m4": {
    "spot": "Mean Value Theorem: set $f'(c)$ equal to the secant slope $\\frac{f(2)-f(0)}{2-0}$ and solve for $c$.",
    "why": "The derivative of $x^2$ is $2x$, so once you have the secant slope it's one linear equation; and for a parabola $c$ is always the midpoint of the interval.",
    "steps": [
      "Secant slope: $\\frac{f(2)-f(0)}{2}=\\frac{4-0}{2}=2$.",
      "$f'(c)=2c=2$.",
      "So $c=1$."
    ],
    "trap": "Giving the secant slope $2$ as the answer; the problem wants the location of the point $c$.",
    "check": "$c=1$ is exactly the midpoint of $[0,2]$ — for a quadratic, the Mean Value Theorem point is always the midpoint."
  },
  "lec-05-q2a": {
    "spot": "Cut a square of side $x$ from each corner: each side of the base loses two $x$'s and becomes $12-2x$, and the folded-up height is $x$.",
    "why": "Volume = base area x height; express the base and height in terms of $x$ first so you have something to differentiate when maximizing later.",
    "steps": [
      "The base is a square of side $12-2x$, with area $(12-2x)^2$.",
      "Height $=x$ (the part folded up).",
      "$V(x)=x(12-2x)^2$, with domain $0<x<6$."
    ],
    "trap": "Writing the base side as $12-x$ (subtracting only one corner), which gives $x(12-x)^2$.",
    "check": "At $x=2$ the box is $8\\times 8\\times 2$, with volume $128$."
  },
  "lec-09-m2": {
    "spot": "Rotating about the $x$-axis with the region touching the $x$-axis: disk method, each slice has radius $y=\\sqrt x$ and area $\\pi(\\sqrt x)^2=\\pi x$.",
    "why": "Squaring in the disk method removes the root, leaving $\\pi\\int x\\,dx$; the shell method would instead need an integral in $y$.",
    "steps": [
      "Volume $V=\\pi\\int_0^1(\\sqrt x)^2dx$.",
      "$=\\pi\\int_0^1x\\,dx=\\pi\\cdot\\frac{1}{2}$.",
      "$V=\\frac{\\pi}{2}$."
    ],
    "trap": "Forgetting the factor $\\pi$, or not squaring (computing $\\pi\\int\\sqrt x\\,dx=\\frac{2\\pi}{3}$).",
    "check": "This solid fits inside a cylinder of radius $1$ and height $1$ (volume $\\pi$), so the answer must be less than $\\pi$."
  },
  "lec-11-m1": {
    "spot": "The sequence is a quotient of two quadratics: the ratio of leading coefficients is $\\frac{2}{1}$.",
    "why": "Divide top and bottom by $n^2$; $\\frac{1}{n}$ and $\\frac{1}{n^2}$ both go to $0$, leaving the coefficient ratio.",
    "steps": [
      "Divide top and bottom by $n^2$: $\\frac{2+\\frac{1}{n^2}}{1-\\frac{3}{n}}$.",
      "$\\frac{1}{n^2}\\to 0$, $\\frac{3}{n}\\to 0$.",
      "The limit is $=2$."
    ],
    "trap": "Thinking the $-3n$ in the denominator makes the limit smaller; as $n\\to\\infty$ the linear term is negligible next to the quadratic one.",
    "check": "Plug in $n=1000$: $\\frac{2000001}{997000}\\approx 2.006$."
  },
  "lec-12-m1": {
    "spot": "Starts at $n=0$ with terms $\\left(\\frac{2}{3}\\right)^n$: a geometric series with first term $1$ and ratio $\\frac{2}{3}$.",
    "why": "Geometric series have the closed formula $\\frac{a}{1-r}$; no need to take a limit of partial sums.",
    "steps": [
      "First term $a=\\left(\\frac{2}{3}\\right)^0=1$, ratio $r=\\frac{2}{3}$, and $|r|<1$ so it converges.",
      "Sum $=\\frac{a}{1-r}=\\frac{1}{1-\\frac{2}{3}}=3$.",
      "So the series sums to $3$."
    ],
    "trap": "Taking the first term as $\\frac{2}{3}$ (as if it started at $n=1$), which gives $2$.",
    "check": "The partial sum $1+\\frac{2}{3}+\\frac{4}{9}+\\frac{8}{27}\\approx 2.41$ is still climbing toward $3$."
  },
  "lec-13-q1b": {
    "spot": "An alternating series, but in absolute value it's $\\sum\\frac{1}{n^2}$ — a $p$-series with $p=2>1$, which converges on its own.",
    "why": "Check absolute convergence first: if the series of absolute values converges, it's absolutely convergent, and you don't need the Alternating Series Test.",
    "steps": [
      "Take absolute values: $\\left|\\frac{(-1)^n}{n^2}\\right|=\\frac{1}{n^2}$.",
      "$\\sum\\frac{1}{n^2}$ is the $p$-series with $p=2$, which converges (to $\\frac{\\pi^2}{6}$).",
      "The series of absolute values converges, so the original series converges absolutely."
    ],
    "trap": "Seeing $(-1)^n$, using the Alternating Series Test, getting \"converges\", and answering \"conditionally convergent\"; conditional convergence requires the absolute series to diverge.",
    "check": "The original series sums to $-\\frac{\\pi^2}{12}$, and the absolute series sum $\\frac{\\pi^2}{6}$ is finite."
  },
  "lec-14-m1": {
    "spot": "$\\frac{x^n}{3^n}=\\left(\\frac{x}{3}\\right)^n$: a geometric series with ratio $\\frac{x}{3}$.",
    "why": "A geometric series converges exactly when $|$ratio$|<1$, so you read off the radius directly, no Ratio Test needed.",
    "steps": [
      "$\\sum\\left(\\frac{x}{3}\\right)^n$ is a geometric series with ratio $r=\\frac{x}{3}$.",
      "Converges $\\iff\\left|\\frac{x}{3}\\right|<1\\iff|x|<3$.",
      "Radius of convergence $R=3$."
    ],
    "trap": "Answering $\\frac{1}{3}$: that's the limit of the coefficient ratio; the radius is its reciprocal.",
    "check": "At $x=3$ every term is $1$ and the series diverges; the radius sits exactly at $3$."
  },
  "lec-14-m3": {
    "spot": "The coefficient is $\\frac{1}{n!}$: factorials outgrow any exponential, and the ratio $\\frac{|x|}{n+1}$ tends to $0$ for every $x$.",
    "why": "Factorials call for the Ratio Test: $\\frac{n!}{(n+1)!}=\\frac{1}{n+1}$ cancels right away; the Root Test runs into $\\sqrt[n]{n!}$, which is a hassle.",
    "steps": [
      "Ratio: $\\left|\\frac{x^{n+1}/(n+1)!}{x^n/n!}\\right|=\\frac{|x|}{n+1}$.",
      "For any fixed $x$ (say $x=100$), $\\frac{|x|}{n+1}\\to 0<1$.",
      "So it converges for every $x$, and the radius of convergence is $\\infty$."
    ],
    "trap": "Seeing $|x|$ in the ratio and writing $|x|<n+1$, as if the radius depended on $n$; let $n\\to\\infty$ first.",
    "check": "This series is $e^x$; at $x=1$ it sums to $e$."
  },
  "lim-008": {
    "spot": "$\\sqrt{x^2+1}-x$ is of the form $\\infty-\\infty$, and it's multiplied by $x$: rationalize first (multiply by the conjugate) to turn the difference into a fraction.",
    "why": "After rationalizing the numerator becomes the constant $1$, and what's left is a ratio of leading coefficients; plugging in infinity directly gets stuck at $\\infty\\cdot 0$.",
    "steps": [
      "Multiply by the conjugate: $\\sqrt{x^2+1}-x=\\frac{1}{\\sqrt{x^2+1}+x}$.",
      "So the expression $=\\frac{x}{\\sqrt{x^2+1}+x}$; divide top and bottom by $x$: $\\frac{1}{\\sqrt{1+\\frac{1}{x^2}}+1}$.",
      "As $x\\to\\infty$: $\\frac{1}{1+1}=\\frac{1}{2}$."
    ],
    "trap": "Thinking $\\sqrt{x^2+1}\\approx x$ so the difference is $0$, and answering $0$; the difference does go to $0$, but multiplied by $x$ it settles at $\\frac{1}{2}$.",
    "check": "Expanding $\\sqrt{x^2+1}=x\\sqrt{1+\\frac{1}{x^2}}\\approx x+\\frac{1}{2x}$, the difference is about $\\frac{1}{2x}$, and times $x$ that gives $\\frac{1}{2}$."
  },
  "refine-derivatives-001": {
    "spot": "A product of two polynomials: Product Rule $(uv)'=u'v+uv'$, then plug in $x=1$.",
    "why": "With the Product Rule every term is a small number when you plug in; expanding to a cubic and differentiating also works, but takes an extra step.",
    "steps": [
      "$u=x^2+1$, $v=3x-2$; $u'=2x$, $v'=3$.",
      "$f'(1)=u'(1)v(1)+u(1)v'(1)=2\\cdot 1+2\\cdot 3$.",
      "$f'(1)=8$."
    ],
    "trap": "Treating the derivative as a product too: $u'v'=2x\\cdot 3=6$.",
    "check": "Expanding, $f=3x^3-2x^2+3x-2$, and $f'(1)=9-4+3=8$."
  },
  "refine-limits-001": {
    "spot": "$\\frac{\\sin(\\text{something})}{\\text{the same thing}}\\to 1$: the numerator is $\\sin 6x$, so make the denominator $6x$.",
    "why": "Build the standard limit $\\frac{\\sin u}{u}\\to 1$ and read off the leftover constant — no L'Hôpital's Rule needed.",
    "steps": [
      "Rewrite: $\\frac{\\sin 6x}{4x}=\\frac{6}{4}\\cdot\\frac{\\sin 6x}{6x}$.",
      "$\\frac{\\sin 6x}{6x}\\to 1$.",
      "The limit is $=\\frac{6}{4}=\\frac{3}{2}$."
    ],
    "trap": "Thinking $\\frac{\\sin 6x}{4x}\\to\\frac{1}{4}$ (just cancelling the $\\sin$), or flipping the ratio to $\\frac{4}{6}$.",
    "check": "Plug in $x=0.001$: $\\frac{\\sin 0.006}{0.004}\\approx 1.49999$."
  },
  "refine-limits-002": {
    "spot": "$\\sin$ in the denominator with $\\frac{x}{3}$ inside: write the numerator as a multiple of $\\frac{x}{3}$ and use $\\frac{u}{\\sin u}\\to 1$.",
    "why": "The limit of $\\frac{u}{\\sin u}$ is also $1$; you just need to pull out the coefficient.",
    "steps": [
      "Rewrite: $\\frac{2x}{\\sin\\frac{x}{3}}=6\\cdot\\frac{x/3}{\\sin(x/3)}$.",
      "$\\frac{x/3}{\\sin(x/3)}\\to 1$.",
      "The limit is $=6$."
    ],
    "trap": "Substituting $\\sin\\frac{x}{3}\\approx\\frac{x}{3}$ and then inverting the fraction by mistake, getting $\\frac{2}{3}$.",
    "check": "Plug in $x=0.01$: $\\frac{0.02}{\\sin 0.00333}\\approx 6.00001$."
  },
  "refine-limits-003": {
    "spot": "$x-16=(\\sqrt x-4)(\\sqrt x+4)$: the denominator is a difference of squares built from the numerator — factor and cancel.",
    "why": "Plugging in $x=16$ gives $\\frac{0}{0}$; factoring the denominator as a difference of squares is fastest, one step shorter than multiplying by the conjugate.",
    "steps": [
      "Plug in $x=16$: numerator and denominator are both $0$.",
      "$x-16=(\\sqrt x-4)(\\sqrt x+4)$; cancel to get $\\frac{1}{\\sqrt x+4}$.",
      "Plug in $x=16$: $\\frac{1}{4+4}=\\frac{1}{8}$."
    ],
    "trap": "After cancelling, evaluating the denominator as $\\sqrt{16}-4$ or $4\\cdot 4$, getting $\\frac{1}{16}$.",
    "check": "This is really the derivative of $\\sqrt x$ at $16$: $\\frac{1}{2\\sqrt{16}}=\\frac{1}{8}$."
  },
  "refine-limits-004": {
    "spot": "$\\sqrt{x+25}-5$ over $x$ gives $\\frac{0}{0}$ at $0$: a root minus a constant — multiply by the conjugate $\\sqrt{x+25}+5$.",
    "why": "After multiplying by the conjugate the numerator becomes $x$ and cancels with the denominator; this is also exactly the derivative definition of $\\sqrt t$ at $t=25$.",
    "steps": [
      "Multiply by the conjugate: $\\frac{(x+25)-25}{x(\\sqrt{x+25}+5)}=\\frac{1}{\\sqrt{x+25}+5}$.",
      "Plug in $x=0$: $\\frac{1}{5+5}$.",
      "The limit is $=\\frac{1}{10}$."
    ],
    "trap": "After multiplying by the conjugate, writing the numerator as $x+25-5$ (forgetting $5^2=25$), so nothing cancels.",
    "check": "The derivative of $\\sqrt t$ at $t=25$ is $\\frac{1}{2\\cdot 5}=\\frac{1}{10}$, consistent."
  },
  "refine-limits-005": {
    "spot": "Absolute value $|x-4|$ with a left-hand limit $x\\to 4^-$: on the left $x-4<0$, so drop the absolute value and add a minus sign.",
    "why": "For limits involving absolute values you must look at the side; once the sign is fixed, numerator and denominator cancel to a constant.",
    "steps": [
      "For $x<4$, $x-4<0$, so $|x-4|=-(x-4)$.",
      "$\\frac{x-4}{|x-4|}=\\frac{x-4}{-(x-4)}=-1$ (true for all $x<4$).",
      "The left-hand limit is $=-1$."
    ],
    "trap": "Forgetting it's a left-hand limit, treating $|x-4|$ as $x-4$, and answering $1$ (that's the right-hand limit).",
    "check": "From the right, $x\\to 4^+$ gives $+1$; the two sides differ, so the two-sided limit doesn't exist — but the problem only asks about the left."
  },
  "refine-limits-007": {
    "spot": "The sequence is a quotient of two quadratics: the answer is the ratio of leading coefficients, $\\frac{5}{2}$.",
    "why": "Divide top and bottom by $n^2$; everything else goes to $0$, and you see it in one step.",
    "steps": [
      "Divide top and bottom by $n^2$: $\\frac{5-\\frac{1}{n}}{2+\\frac{3}{n^2}}$.",
      "$\\frac{1}{n}\\to 0$, $\\frac{3}{n^2}\\to 0$.",
      "The limit is $=\\frac{5}{2}$."
    ],
    "trap": "Getting distracted by $-n$ and $+3$ and computing the ratio of constant terms, $\\frac{0}{3}$; as $n\\to\\infty$ only the top degree matters.",
    "check": "Plug in $n=1000$: $\\frac{4999000}{2000003}\\approx 2.4995$."
  },
  "refine-limits-009": {
    "spot": "However much the numerator $\\sin(x^2)$ oscillates, it stays between $-1$ and $1$, while the denominator $x\\to\\infty$: bounded over infinite — Squeeze Theorem.",
    "why": "$\\sin(x^2)$ has no limit itself, so you can't split it off; bounding with $|\\sin|\\le 1$ is cleanest, and L'Hôpital's Rule doesn't apply here (the numerator doesn't go to infinity).",
    "steps": [
      "$-1\\le\\sin(x^2)\\le 1$, so $-\\frac{1}{x}\\le\\frac{\\sin(x^2)}{x}\\le\\frac{1}{x}$ (for $x>0$).",
      "Both bounds $\\pm\\frac{1}{x}\\to 0$.",
      "By the Squeeze Theorem: the limit is $=0$."
    ],
    "trap": "Thinking that since $\\sin(x^2)$ oscillates the limit doesn't exist; the denominator crushes the oscillation down to $0$.",
    "check": "At $x=1000$, $|\\frac{\\sin(x^2)}{x}|\\le 0.001$."
  },
  "refine-limits-010": {
    "spot": "$f$ is a line with slope $3$: $|f(x)-7|=3|x-2|$, so the error is exactly $3$ times the offset in $x$, and $\\delta=\\frac{\\varepsilon}{3}$.",
    "why": "A linear function needs no estimating: rewrite $|f(x)-L|$ as a multiple of $|x-2|$ and you can solve for the largest $\\delta$ directly.",
    "steps": [
      "$|f(x)-7|=|3x+1-7|=|3x-6|=3|x-2|$.",
      "We need $3|x-2|<0.03$, i.e. $|x-2|<0.01$.",
      "So the largest $\\delta$ is $0.01$; any larger (say $0.011$) and some $x$ makes the error exceed $0.03$."
    ],
    "trap": "Ignoring the slope and taking $\\delta=\\varepsilon=0.03$; then $x=2.02$ makes the error $0.06$.",
    "check": "Near the edge, $x=2.0099$: $|f(x)-7|=0.0297<0.03$, safe."
  },
  "refine-series-016": {
    "spot": "An alternating series, but the absolute value $\\frac{n}{n^3+1}$ is about $\\frac{1}{n^2}$ — check absolute convergence first by comparing with the $p$-series $p=2$.",
    "why": "Once the absolute series converges, the series is absolutely convergent and you don't need the Alternating Series Test; the Limit Comparison Test is fastest for rational expressions like this.",
    "steps": [
      "Take absolute values: $|a_n|=\\frac{n}{n^3+1}$.",
      "Compare with $\\frac{1}{n^2}$: $\\frac{n/(n^3+1)}{1/n^2}=\\frac{n^3}{n^3+1}\\to 1$, finite and nonzero.",
      "$\\sum\\frac{1}{n^2}$ converges, so $\\sum\\frac{n}{n^3+1}$ converges.",
      "The absolute series converges, so the original series converges absolutely."
    ],
    "trap": "Seeing $(-1)^n$, using the Alternating Series Test to get \"converges\", and answering conditionally convergent; check the absolute series first.",
    "check": "Actually $\\frac{n}{n^3+1}<\\frac{1}{n^2}$ holds for every $n\\ge 1$, so the direct Comparison Test works too."
  },
  "ser-002": {
    "spot": "This is the harmonic series $\\sum\\frac{1}{n}$, the $p$-series with $p=1$ — the classic example of divergence.",
    "why": "The terms do go to $0$, but too slowly; the Integral Test, $\\int_1^\\infty\\frac{dx}{x}=\\infty$, settles it in one line.",
    "steps": [
      "The terms $\\frac{1}{n}\\to 0$, but that's only a necessary condition; it doesn't guarantee convergence.",
      "Integral Test: $\\int_1^N\\frac{dx}{x}=\\ln N$, which has no upper bound as $N$ grows.",
      "The partial sums are at least $\\ln(N+1)$, growing to infinity along with $\\ln$, so the series diverges."
    ],
    "trap": "Believing \"terms go to $0$ means it converges\"; the harmonic series is precisely the counterexample.",
    "check": "Group the terms: $\\frac{1}{3}+\\frac{1}{4}>\\frac{1}{2}$, $\\frac{1}{5}+\\cdots+\\frac{1}{8}>\\frac{1}{2}$; each group exceeds $\\frac{1}{2}$, and infinitely many groups add up to infinity."
  },
  "ser-020": {
    "spot": "$\\frac{\\ln n}{n}$ is bigger than the harmonic $\\frac{1}{n}$ ($\\ln n>1$ for $n\\ge 3$) — direct comparison: bigger than something divergent means divergent.",
    "why": "Comparing with $\\frac{1}{n}$ takes one line; the Integral Test with $\\int\\frac{\\ln x}{x}dx=\\frac{(\\ln x)^2}{2}$ also works but needs an antiderivative.",
    "steps": [
      "For $n\\ge 3$, $\\ln n>1$, so $\\frac{\\ln n}{n}>\\frac{1}{n}$.",
      "$\\sum\\frac{1}{n}$ is the harmonic series, which diverges (partial sums about $\\ln N$).",
      "Comparison Test: the series is bigger than a divergent one, so it diverges."
    ],
    "trap": "Thinking $\\frac{\\ln n}{n}\\to 0$ means convergence; terms going to $0$ isn't enough, and these shrink even more slowly than the harmonic series.",
    "check": "Integral Test: $\\int_2^N\\frac{\\ln x}{x}dx=\\frac{(\\ln N)^2-(\\ln 2)^2}{2}$, which keeps growing."
  },
  "tmpl-der-exp-001": {
    "spot": "The exponent of $e$ is $2x$: Chain Rule — the outer $e^u$ stays the same, the inner $2x$ contributes a $2$.",
    "why": "The derivative of $e^{kx}$ is $ke^{kx}$: one application of the Chain Rule.",
    "steps": [
      "Let $u=2x$; $\\frac{d}{du}e^u=e^u$.",
      "Inner: $\\frac{du}{dx}=2$.",
      "$\\frac{d}{dx}e^{2x}=2e^{2x}$."
    ],
    "trap": "Bringing the exponent down as a coefficient and subtracting one: writing $2x\\,e^{2x-1}$, a misuse of the Power Rule.",
    "check": "At $x=0$ the slope is $2$: $\\frac{e^{0.002}-e^{-0.002}}{0.002}\\approx 2$."
  },
  "tmpl-der-exp-002": {
    "spot": "The exponent of $e$ is $3x$: Chain Rule — the inner $3x$ contributes a $3$.",
    "why": "The derivative of $e^{kx}$ is $ke^{kx}$: one application of the Chain Rule.",
    "steps": [
      "Let $u=3x$; $\\frac{d}{du}e^u=e^u$.",
      "Inner: $\\frac{du}{dx}=3$.",
      "$\\frac{d}{dx}e^{3x}=3e^{3x}$."
    ],
    "trap": "Forgetting to multiply by the inner derivative and answering $e^{3x}$.",
    "check": "At $x=0$ the slope is $3$."
  },
  "tmpl-der-exp-003": {
    "spot": "The exponent of $e$ is $5x$: Chain Rule — the inner $5x$ contributes a $5$.",
    "why": "The derivative of $e^{kx}$ is $ke^{kx}$: one application of the Chain Rule.",
    "steps": [
      "Let $u=5x$; $\\frac{d}{du}e^u=e^u$.",
      "Inner: $\\frac{du}{dx}=5$.",
      "$\\frac{d}{dx}e^{5x}=5e^{5x}$."
    ],
    "trap": "Forgetting to multiply by the inner derivative and answering $e^{5x}$; or writing $5xe^{5x}$ with an extra factor $x$.",
    "check": "At $x=0$ the slope is $5$."
  }
};
