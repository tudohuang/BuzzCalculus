// Detail v2, English — batch 050. Translation of tools/content/detail/050.js (text only; claims live in the Chinese file).
module.exports = {
  "cl-der-037": {
    "spot": "Tangent line to the helix at $t=\\frac{\\pi}{2}$: the point is $\\mathbf r(\\frac{\\pi}{2})=(0,1,\\frac{\\pi}{2})$ and the direction is $\\mathbf r'(\\frac{\\pi}{2})$. Its intersection with $z=0$ means setting the $z$-component of the parametric tangent line to $0$.",
    "why": "A line in space is just \"one point + one direction\" written parametrically; plug in the plane's condition, solve for the parameter, done.",
    "steps": [
      "Point of tangency: $\\mathbf r(\\frac{\\pi}{2})=(\\cos\\frac{\\pi}{2},\\sin\\frac{\\pi}{2},\\frac{\\pi}{2})=(0,1,\\frac{\\pi}{2})$.",
      "Direction: $\\mathbf r'(t)=(-\\sin t,\\cos t,1)$, which at $t=\\frac{\\pi}{2}$ is $(-1,0,1)$.",
      "Tangent line: $(x,y,z)=(0,1,\\frac{\\pi}{2})+s(-1,0,1)=(-s,\\,1,\\,\\frac{\\pi}{2}+s)$.",
      "Set $z=\\frac{\\pi}{2}+s=0$ to get $s=-\\frac{\\pi}{2}$, so the intersection has $x=-s=\\frac{\\pi}{2}$."
    ],
    "trap": "Using $\\mathbf r(\\frac{\\pi}{2})$ itself as the direction vector (position mistaken for direction), or writing the derivative of $\\sin t$ as $-\\cos t$. With the wrong direction the intersection is completely off.",
    "check": "The intersection is $(\\frac{\\pi}{2},1,0)$: from the point of tangency you drop $\\frac{\\pi}{2}$ in height and $x$ moves back by exactly $\\frac{\\pi}{2}$, matching the ratios of the direction $(-1,0,1)$."
  },
  "cl-der-038": {
    "spot": "In $(1.02)^{3.01}$ the base is near $1$ and the exponent near $3$: treat it as $f(x,y)=x^y$ near $(1,3)$ and estimate with the total differential $df=f_x\\,dx+f_y\\,dy$.",
    "why": "Two quantities change a little at the same time, so a one-variable linear approximation is not enough; the total differential just adds each partial derivative times its own increment.",
    "steps": [
      "Base point $f(1,3)=1^3=1$, increments $dx=0.02$, $dy=0.01$.",
      "$f_x=yx^{y-1}$, which at $(1,3)$ is $3$.",
      "$f_y=x^y\\ln x$, which at $(1,3)$ is $1\\cdot\\ln 1=0$ — when the base is $1$, moving the exponent changes nothing.",
      "$f\\approx 1+3(0.02)+0\\cdot(0.01)=1.06$."
    ],
    "trap": "Writing $f_y$ with a power-rule shape like $yx^{y-1}$ (when the exponent is the variable you need $x^y\\ln x$) adds an extra $0.03$ and gives $1.09$.",
    "check": "The actual value $e^{3.01\\ln 1.02}\\approx 1.0614$ is slightly larger than $1.06$ (the second-order term is positive), so the approximation is reasonable."
  },
  "cl-int-024": {
    "spot": "The denominator is $x+\\sqrt{x^2+x+1}$, with a quadratic under the root whose leading coefficient is positive: the Euler substitution $\\sqrt{x^2+x+1}=t-x$ cancels the $x^2$ and the whole denominator becomes just $t$.",
    "why": "Rationalizing the denominator gives $\\frac{\\sqrt{x^2+x+1}-x}{x+1}$, which still has a root; the Euler substitution turns it straight into a rational function that partial fractions can finish.",
    "steps": [
      "Let $\\sqrt{x^2+x+1}=t-x$. Squaring gives $x^2+x+1=t^2-2tx+x^2$, so $x=\\frac{t^2-1}{2t+1}$, and the denominator $x+\\sqrt{x^2+x+1}=t$.",
      "$dx=\\frac{d}{dt}\\frac{t^2-1}{2t+1}\\,dt=\\frac{2t^2+2t+2}{(2t+1)^2}\\,dt$; $x=0\\to t=1$ and $x=1\\to t=1+\\sqrt3$.",
      "The integral becomes $\\int_1^{1+\\sqrt3}\\frac{2t^2+2t+2}{t(2t+1)^2}\\,dt$. Partial fractions: $\\frac{2}{t}-\\frac{3}{2t+1}-\\frac{3}{(2t+1)^2}$.",
      "Antiderivative $2\\ln t-\\frac{3}{2}\\ln(2t+1)+\\frac{3}{2(2t+1)}$.",
      "Plug in the limits: $2\\ln(1+\\sqrt3)-\\frac32\\ln\\frac{3+2\\sqrt3}{3}+\\frac{3}{2(3+2\\sqrt3)}-\\frac12$."
    ],
    "trap": "Forgetting to convert $dx$ too (writing just $\\int\\frac{dt}{t}$) gives only $\\ln(1+\\sqrt3)\\approx 1.005$, far larger than the correct value.",
    "check": "On $[0,1]$ the integrand drops from $1$ to $\\frac{1}{1+\\sqrt3}\\approx 0.366$, so the integral must lie between the two; the answer is about $0.580$."
  },
  "cl-int-025": {
    "spot": "The denominator has $(1+x^2)^{3/2}$ and the limits $1$, $\\sqrt3$ are exactly $\\tan\\frac{\\pi}{4}$, $\\tan\\frac{\\pi}{3}$: it is clearly asking for $x=\\tan\\theta$.",
    "why": "$1+\\tan^2\\theta=\\sec^2\\theta$ removes the $\\frac32$ power in one go, and the leftover $\\frac{\\cos^3\\theta}{\\sin^2\\theta}$ splits into two terms you can integrate directly.",
    "steps": [
      "Let $x=\\tan\\theta$, $dx=\\sec^2\\theta\\,d\\theta$, $(1+x^2)^{3/2}=\\sec^3\\theta$, and the limits become $\\theta:\\frac{\\pi}{4}\\to\\frac{\\pi}{3}$.",
      "Integrand $\\frac{\\sec^2\\theta}{\\tan^2\\theta\\sec^3\\theta}=\\frac{\\cos^3\\theta}{\\sin^2\\theta}=\\frac{\\cos\\theta}{\\sin^2\\theta}-\\cos\\theta$.",
      "Antiderivative $-\\frac{1}{\\sin\\theta}-\\sin\\theta$.",
      "Evaluate: $\\left(-\\frac{2}{\\sqrt3}-\\frac{\\sqrt3}{2}\\right)-\\left(-\\sqrt2-\\frac{\\sqrt2}{2}\\right)=\\frac{3\\sqrt2}{2}-\\frac{7\\sqrt3}{6}$."
    ],
    "trap": "Not changing the limits after substituting and plugging $1$, $\\sqrt3$ in for $\\theta$ gives a number with no relation to the answer.",
    "check": "On $[1,\\sqrt3]$ the integrand drops from $\\frac{1}{2\\sqrt2}\\approx 0.354$ to $\\frac{1}{24}$ over an interval of length $0.732$; the answer is about $0.1007$, within a reasonable range."
  },
  "cl-int-027": {
    "spot": "$J_n=\\int_0^1\\frac{dx}{(1+x^2)^n}$ and the problem says to use a recursion: integration by parts links $J_n$ to $J_{n+1}$, and from $J_1=\\frac{\\pi}{4}$ you climb two levels to $J_3$.",
    "why": "Going straight to $x=\\tan\\theta$ gives $\\int\\cos^4\\theta$, which works but needs power reduction twice; applying one recursion formula repeatedly is the safest.",
    "steps": [
      "Integrate $J_n$ by parts ($u=(1+x^2)^{-n}$, $dv=dx$) and split $\\frac{x^2}{(1+x^2)^{n+1}}$ into $\\frac{1}{(1+x^2)^n}-\\frac{1}{(1+x^2)^{n+1}}$; rearranging gives $J_{n+1}=\\frac{2n-1}{2n}J_n+\\frac{1}{2n\\cdot 2^n}$.",
      "Start: $J_1=\\int_0^1\\frac{dx}{1+x^2}=\\frac{\\pi}{4}$.",
      "$n=1$: $J_2=\\frac12J_1+\\frac{1}{4}=\\frac{\\pi}{8}+\\frac14$.",
      "$n=2$: $J_3=\\frac34J_2+\\frac{1}{16}=\\frac{3\\pi}{32}+\\frac{3}{16}+\\frac{1}{16}=\\frac14+\\frac{3\\pi}{32}$."
    ],
    "trap": "Dropping the boundary term $\\frac{x}{2n(1+x^2)^n}\\Big|_0^1=\\frac{1}{2n\\cdot2^n}$ and writing just $J_{n+1}=\\frac{2n-1}{2n}J_n$ gives $J_3=\\frac{3\\pi}{32}\\approx 0.295$.",
    "check": "On $[0,1]$ the integrand drops from $1$ to $\\frac18$, so $J_3$ lies between them and is smaller than $J_2\\approx 0.643$; the answer is about $0.545$."
  },
  "cl-int-028": {
    "spot": "The denominator is the square of the irreducible quadratic $x^2+x+1$: complete the square to $(x+\\frac12)^2+\\frac34$ and you have the standard form $\\int\\frac{du}{(u^2+a^2)^2}$.",
    "why": "The quadratic has no real roots, so partial fractions cannot split it; after completing the square, the formula for $\\int\\frac{du}{(u^2+a^2)^2}$ (or $u=a\\tan\\theta$) is the most direct route.",
    "steps": [
      "$x^2+x+1=u^2+a^2$ with $u=x+\\frac12$, $a^2=\\frac34$; $x:0\\to1$ corresponds to $u:\\frac12\\to\\frac32$.",
      "Formula: $\\int\\frac{du}{(u^2+a^2)^2}=\\frac{u}{2a^2(u^2+a^2)}+\\frac{1}{2a^3}\\arctan\\frac{u}{a}$.",
      "The first term equals $\\frac13$ at both $u=\\frac32$ and $u=\\frac12$, so it contributes $0$.",
      "Second term: $\\frac{1}{2a^3}=\\frac{4}{3\\sqrt3}$, and $\\arctan\\sqrt3-\\arctan\\frac{1}{\\sqrt3}=\\frac{\\pi}{3}-\\frac{\\pi}{6}=\\frac{\\pi}{6}$.",
      "Together: $\\frac{4}{3\\sqrt3}\\cdot\\frac{\\pi}{6}=\\frac{2\\pi}{9\\sqrt3}$."
    ],
    "trap": "Treating $\\int\\frac{du}{(u^2+a^2)^2}$ as the square of $\\frac{1}{a}\\arctan\\frac{u}{a}$, or just using the first-power formula, gets every coefficient wrong.",
    "check": "The integrand drops from $1$ to $\\frac19$ with an average of roughly $0.4$; the answer is $\\frac{2\\pi}{9\\sqrt3}\\approx 0.403$."
  },
  "cl-int-029": {
    "spot": "Denominator $(x+1)(x^2+1)^2$: one linear factor plus a repeated irreducible quadratic, a standard partial fractions problem. Split into $\\frac{A}{x+1}+\\frac{Bx+C}{x^2+1}+\\frac{Dx+E}{(x^2+1)^2}$.",
    "why": "Splitting is the only way; each piece is then a $\\ln$, an $\\arctan$, or the known $\\int\\frac{dx}{(1+x^2)^2}$, and the limits $0,1$ turn $\\arctan$ into $\\frac{\\pi}{4}$.",
    "steps": [
      "$A$: cover up $x+1$ and set $x=-1$ to get $\\frac{1}{4}$; matching the remaining coefficients gives $\\frac{1}{(x+1)(x^2+1)^2}=\\frac{1}{4(x+1)}+\\frac{1-x}{4(x^2+1)}+\\frac{1-x}{2(x^2+1)^2}$.",
      "First piece: $\\int_0^1\\frac{dx}{4(x+1)}=\\frac{\\ln2}{4}$.",
      "Second piece: $\\frac14\\left(\\arctan x-\\frac12\\ln(1+x^2)\\right)\\Big|_0^1=\\frac{\\pi}{16}-\\frac{\\ln2}{8}$.",
      "Third piece: $\\int_0^1\\frac{dx}{(1+x^2)^2}=\\frac{\\pi}{8}+\\frac14$ and $\\int_0^1\\frac{x\\,dx}{(1+x^2)^2}=\\frac14$; subtract and multiply by $\\frac12$ to get $\\frac{\\pi}{16}$.",
      "Sum: $\\frac{\\ln2}{4}-\\frac{\\ln2}{8}+\\frac{\\pi}{16}+\\frac{\\pi}{16}=\\frac{\\ln2+\\pi}{8}$."
    ],
    "trap": "Writing the partial fractions as just $\\frac{A}{x+1}+\\frac{Bx+C}{(x^2+1)^2}$, missing the $\\frac{Bx+C}{x^2+1}$ layer, makes the coefficients unsolvable or wrong.",
    "check": "The integrand drops from $1$ to $\\frac18$, and the answer $\\frac{\\ln2+\\pi}{8}\\approx 0.479$ sits in between."
  },
  "cl-int-031": {
    "spot": "Pumping work: in a cone with its vertex pointing down, the radius of the water layer at height $y$ is proportional to $y$ ($r=\\frac{2}{3}y$), and each layer is lifted to the outlet at $y=4$, a distance of $4-y$.",
    "why": "Each layer has a different weight and lift distance, so \"total weight × one distance\" does not work; slice into thin layers, take weight × distance, and integrate.",
    "steps": [
      "Put the origin at the vertex with up positive; the top of the tank is at $y=3$ and the outlet at $y=4$. At height $y$ the radius is $r=\\frac{2}{3}y$, so a slice has volume $\\pi\\cdot\\frac{4}{9}y^2\\,dy$.",
      "This slice is lifted $4-y$, so its work is $dW=9800\\cdot\\frac{4\\pi}{9}y^2(4-y)\\,dy$.",
      "$\\int_0^3 y^2(4-y)\\,dy=\\frac{4\\cdot27}{3}-\\frac{81}{4}=\\frac{63}{4}$.",
      "$W=9800\\cdot\\frac{4\\pi}{9}\\cdot\\frac{63}{4}=9800\\cdot7\\pi=68600\\pi$ joules."
    ],
    "trap": "Writing the radius as $\\frac{2}{3}(3-y)$ (as if the vertex pointed up), or lifting only to the top of the tank, $3-y$, forgetting the extra $1$ m, makes the answer far off.",
    "check": "The cone holds $\\frac13\\pi\\cdot4\\cdot3=4\\pi$ cubic meters of water with centroid $\\frac34\\cdot3=2.25$ m above the vertex, to be lifted $1.75$ m: $9800\\cdot4\\pi\\cdot1.75=68600\\pi$, consistent."
  },
  "cl-int-034": {
    "spot": "$M=2xy+1$, $N=x^2+2y$, and $M_y=2x=N_x$: an exact equation, so go straight for a potential function $F(x,y)=C$.",
    "why": "When the equation is exact you need neither separation of variables nor an integrating factor; integrate $F$ in $x$, then add the part depending only on $y$.",
    "steps": [
      "Check exactness: $\\frac{\\partial}{\\partial y}(2xy+1)=2x$ and $\\frac{\\partial}{\\partial x}(x^2+2y)=2x$.",
      "$F=\\int(2xy+1)\\,dx=x^2y+x+g(y)$, and $F_y=x^2+g'(y)=x^2+2y$, so $g=y^2$: $F=x^2y+x+y^2$.",
      "$y(0)=1$: $C=0+0+1=1$.",
      "At $x=\\frac12$: $\\frac{y}{4}+\\frac12+y^2=1$, i.e. $4y^2+y-2=0$. Take the positive root $y=\\frac{-1+\\sqrt{33}}{8}$ (the solution curve continues from $y=1$)."
    ],
    "trap": "Taking the negative root $\\frac{-1-\\sqrt{33}}{8}$; the solution curve starts at $y(0)=1>0$ and does not jump to negative values on $x\\in[0,\\frac12]$.",
    "check": "Plug back in: $y\\approx0.593$, $\\frac14y+\\frac12+y^2\\approx 1.000$."
  },
  "cl-int-035": {
    "spot": "$M_y-N_x=(3x+2y)-(2x+y)=x+y$, and dividing by $N=x(x+y)$ leaves exactly $\\frac{1}{x}$, a function of $x$ only: integrating factor $\\mu=e^{\\int\\frac{dx}{x}}=x$.",
    "why": "If $\\frac{M_y-N_x}{N}$ involves only $x$, a $\\mu(x)$ is guaranteed; multiplying by it makes the equation exact, then find the potential function.",
    "steps": [
      "$\\frac{M_y-N_x}{N}=\\frac{x+y}{x(x+y)}=\\frac1x$, so $\\mu=x$.",
      "Multiply by $x$: $(3x^2y+xy^2)\\,dx+(x^3+x^2y)\\,dy=0$. Both cross partials are $3x^2+2xy$, so it is exact.",
      "Potential function $F=x^3y+\\frac12x^2y^2$ ($F_x=3x^2y+xy^2$, $F_y=x^3+x^2y$).",
      "$y(1)=1$: $C=1+\\frac12=\\frac32$.",
      "At $x=2$: $8y+2y^2=\\frac32$, i.e. $4y^2+16y-3=0$, with positive root $y=\\frac{-16+\\sqrt{304}}{8}=\\frac{\\sqrt{19}-4}{2}$."
    ],
    "trap": "Using $\\frac{N_x-M_y}{M}$ to look for a $\\mu(y)$, which does not come out as a single-variable function; or getting the integrating factor as $\\frac1x$ (sign flipped), after which the equation is still not exact.",
    "check": "Plug back in: $y\\approx 0.179$, and $x^3y+\\frac12x^2y^2$ at $x=2$ equals $\\frac32$."
  },
  "cl-int-036": {
    "spot": "$y'+\\frac{2}{x}y=xy^2$: a linear part plus an extra $y^2$, so it is a Bernoulli equation; set $v=y^{1-2}=\\frac1y$ to make it linear.",
    "why": "A Bernoulli equation cannot be separated directly; after switching to $v=\\frac1y$, solving the first-order linear equation with an integrating factor is the safest.",
    "steps": [
      "$v=\\frac1y$, $v'=-\\frac{y'}{y^2}$; divide the equation by $-y^2$: $v'-\\frac{2}{x}v=-x$.",
      "Integrating factor $x^{-2}$: $\\left(\\frac{v}{x^2}\\right)'=-\\frac1x$, so $\\frac{v}{x^2}=-\\ln x+C$; $v(1)=1$ gives $C=1$, so $v=x^2(1-\\ln x)$.",
      "Back to $y$: $y=\\frac{1}{x^2(1-\\ln x)}$, and it satisfies the original equation.",
      "At $x=\\sqrt e$: $\\ln x=\\frac12$, $v=e\\cdot\\frac12$, $y=\\frac{2}{e}$."
    ],
    "trap": "Forgetting the minus sign from dividing by $-y^2$ when switching to $v$ gives $v'+\\frac2xv=x$, whose solution $v=\\frac{x^2}{4}+\\frac{3}{4x^2}$ leads to a wrong value like $\\frac{4e}{e^2+3}$.",
    "check": "$y(1)=1$ checks out; $y$ blows up as $x\\to e$ (since $1-\\ln x\\to0$), and $\\sqrt e<e$ is still inside the domain."
  },
  "exam-ser-008": {
    "spot": "The denominators are only odd factorials $1!,3!,5!,\\dots$: keep only the odd-power terms of $e^x$, which is $\\sinh x=\\frac{e^x-e^{-x}}{2}$ at $x=1$.",
    "why": "Recognizing the Taylor series of a known function is much faster than adding terms; keeping only odd powers means subtracting $e^{-x}$ from $e^x$ and dividing by $2$.",
    "steps": [
      "$e^x=\\sum\\frac{x^n}{n!}$, $e^{-x}=\\sum\\frac{(-x)^n}{n!}$; subtracting cancels the even-power terms and doubles the odd ones.",
      "So $\\sinh x=\\sum_{n\\ge0}\\frac{x^{2n+1}}{(2n+1)!}$.",
      "Set $x=1$: $\\sum\\frac{1}{(2n+1)!}=\\sinh1=\\frac{e-e^{-1}}{2}$."
    ],
    "trap": "Writing the sum over odd factorials as $\\cosh1=\\frac{e+e^{-1}}{2}$ (that one is the even factorials).",
    "check": "The first four terms give $1+\\frac16+\\frac1{120}+\\frac1{5040}\\approx 1.17520$ and the rest are tiny; $\\sinh 1\\approx 1.175201$."
  },
  "refine-derivatives-023": {
    "spot": "$e^y+xy=e$ cannot be solved for $y$: use implicit differentiation twice, and differentiate the once-differentiated equation directly instead of first solving for $y'$ as a fraction.",
    "why": "Applying the Quotient Rule to $y'=-\\frac{y}{e^y+x}$ gets messy; differentiating \"$e^yy'+y+xy'=0$\" once more and plugging in the point leaves a single linear equation.",
    "steps": [
      "Check the point: $e^1+0=e$, so $(0,1)$ is on the curve.",
      "Differentiate once: $e^yy'+y+xy'=0$. At $(0,1)$: $e\\,y'+1=0$, so $y'=-\\frac1e$.",
      "Differentiate again: $e^y(y')^2+e^yy''+y'+y'+xy''=0$, i.e. $(e^y+x)y''=-e^y(y')^2-2y'$.",
      "Substitute: $e\\,y''=-e\\cdot\\frac{1}{e^2}+\\frac2e=\\frac1e$, so $y''=\\frac{1}{e^2}$."
    ],
    "trap": "Missing the Chain Rule term from $e^y$, namely $e^y(y')^2$, in the second differentiation gives $y''=\\frac{2}{e^2}$.",
    "check": "Numerical check: solving $e^y=e-xy$ near $x=\\pm0.01$, the second difference is about $0.135$, matching $e^{-2}\\approx0.1353$."
  },
  "refine-derivatives-024": {
    "spot": "$z=z(x,y)$ is defined implicitly and you want $\\frac{\\partial^2z}{\\partial x^2}$: treat $y$ as a constant, differentiate implicitly in $x$ twice, and differentiate the first result directly.",
    "why": "Differentiating the formula $z_x=-\\frac{F_x}{F_z}$ again in $x$ needs the Quotient Rule plus the Chain Rule and terms get lost easily; differentiating the equation twice and then plugging in the point is cleanest.",
    "steps": [
      "The point is on the surface: $1+2+1+1=5$.",
      "Differentiate in $x$: $2x+2zz_x+yz+xyz_x=0$. At $(1,1,1)$: $2+2z_x+1+z_x=0$, so $z_x=-1$.",
      "Differentiate in $x$ again: $2+2z_x^2+2zz_{xx}+2yz_x+xyz_{xx}=0$. Substituting: $2+2+2z_{xx}-2+z_{xx}=0$, so $z_{xx}=-\\frac23$.",
      "Verify: fix $y=1$; the equation becomes $z^2+xz+x^2-3=0$. Take the branch through $(1,1)$, $z=\\frac{-x+\\sqrt{12-3x^2}}{2}$, and differentiate it twice directly."
    ],
    "trap": "In the second differentiation, turning $xyz_x$ into only $xyz_{xx}$ and missing $yz_x$; or turning $2zz_x$ into only $2zz_{xx}$ and missing $2z_x^2$.",
    "check": "The explicit $z(x)$ also has first derivative $-1$ at $x=1$, consistent with implicit differentiation."
  },
  "refine-derivatives-025": {
    "spot": "The functional equation $f(x+y)=f(x)+f(y)+xy(x+y)$ together with $f'(0)=1$: use the definition $f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}$ and let the equation reduce the difference to just $f(h)$.",
    "why": "Guessing the form of $f$ can miss solutions; deriving a formula for $f'(x)$ from the definition and integrating forces the answer out.",
    "steps": [
      "Set $x=y=0$: $f(0)=2f(0)$, so $f(0)=0$.",
      "$f(x+h)-f(x)=f(h)+xh(x+h)$; divide by $h$ and take the limit: $f'(x)=f'(0)+x^2=1+x^2$.",
      "Integrate and use $f(0)=0$: $f(x)=x+\\frac{x^3}{3}$.",
      "Verify the equation: $f(x+y)-f(x)-f(y)=\\frac{(x+y)^3-x^3-y^3}{3}=xy(x+y)$.",
      "$f(3)=3+9=12$."
    ],
    "trap": "Assuming an additive functional equation always has solution $f(x)=cx$ gives $f(3)=3$, forgetting that the extra $xy(x+y)$ contributes $\\frac{x^3}{3}$.",
    "check": "$f'(0)=1+0=1$ satisfies the condition."
  },
  "refine-derivatives-027": {
    "spot": "A polynomial $x^2$ times $e^x$, differentiated five times: in the Leibniz rule, $x^2$ differentiated three or more times is $0$, so only three terms remain.",
    "why": "Differentiating five times by hand needs the Product Rule every time; the Leibniz formula does it in one line: $e^x\\left(x^2+\\binom51\\cdot2x+\\binom52\\cdot2\\right)$.",
    "steps": [
      "$(x^2e^x)^{(5)}=\\sum_k\\binom5k(x^2)^{(k)}(e^x)^{(5-k)}$, and only $k=0,1,2$ are nonzero.",
      "$=e^x\\left(x^2+5\\cdot2x+10\\cdot2\\right)=e^x(x^2+10x+20)$. (In general it is $e^x(x^2+2nx+n(n-1))$.)",
      "Set $x=1$: $e(1+10+20)=31e$."
    ],
    "trap": "Forgetting the binomial coefficients in the Leibniz rule and writing $e^x(x^2+2x+2)$ gives $5e$.",
    "check": "The pattern $e^x(x^2+2nx+n(n-1))$ at $n=2$ gives $x^2+4x+2$, matching two direct differentiations."
  },
  "refine-derivatives-028": {
    "spot": "The characteristic equation of $y''-2y'+y$ is $(r-1)^2=0$, so $r=1$ is a double root, and the right side is exactly $e^x$: both $e^x$ and $xe^x$ are homogeneous solutions, so try $Ax^2e^x$.",
    "why": "Plugging in $Ae^x$ or $Axe^x$ makes the left side $0$; double resonance means multiplying by $x^2$.",
    "steps": [
      "Characteristic roots: $r^2-2r+1=(r-1)^2$, so $e^x$ and $xe^x$ are homogeneous solutions.",
      "Let $y_p=Ax^2e^x$; then $y_p'=A(x^2+2x)e^x$ and $y_p''=A(x^2+4x+2)e^x$.",
      "Substitute: $A e^x\\left[(x^2+4x+2)-2(x^2+2x)+x^2\\right]=2Ae^x=e^x$, so $A=\\frac12$.",
      "Particular solution $y_p=\\frac12x^2e^x$."
    ],
    "trap": "Computing $y_p''$ as $A(x^2+2x+2)e^x$ leaves $-2x+2$ in the bracket instead of a constant, and you will think the trial form was wrong.",
    "check": "After simplifying, every power of $x$ cancels and only the constant $2A$ remains, exactly the signature of double resonance."
  },
  "refine-derivatives-030": {
    "spot": "$x^3-3x+2=(x-1)^2(x+2)$, so $x=1$ is a double root: at a multiple root Newton's method converges only linearly, with error ratio tending to $1-\\frac1m=\\frac12$.",
    "why": "Write out the Newton iteration $N(x)=x-\\frac{f(x)}{f'(x)}$ and compute the limit of $\\frac{N(x)-1}{x-1}$ as $x\\to1$; the effect of the double root shows up directly.",
    "steps": [
      "Factor: $x^3-3x+2=(x-1)^2(x+2)$.",
      "$\\frac{f}{f'}=\\frac{(x-1)^2(x+2)}{(x-1)(3x+3)}=\\frac{(x-1)(x+2)}{3(x+1)}$.",
      "$N(x)-1=(x-1)\\left(1-\\frac{x+2}{3(x+1)}\\right)$, so $\\frac{N(x)-1}{x-1}=1-\\frac{x+2}{3(x+1)}$.",
      "$x\\to1$: $1-\\frac{3}{6}=\\frac12$."
    ],
    "trap": "Remembering \"Newton's method converges quadratically\" and expecting the ratio to tend to $0$; that only holds at a simple root. At a double root $f'(1)=0$ and convergence drops to linear.",
    "check": "One step from $x_0=1.1$: $N(1.1)-1\\approx 0.0516$, ratio about $0.516$, close to $\\frac12$."
  },
  "refine-integrals-005": {
    "spot": "The integrand $(x-t)\\cos t$ also contains $x$: pull $x$ out of the integral first, $g(x)=x\\int_0^x\\cos t\\,dt-\\int_0^xt\\cos t\\,dt$, then use the Fundamental Theorem of Calculus.",
    "why": "Applying the Fundamental Theorem directly to $\\int_0^x(x-t)\\cos t\\,dt$ misses the contribution of the $x$ inside the integrand; after splitting, every piece is in standard form.",
    "steps": [
      "Split: $g(x)=x\\int_0^x\\cos t\\,dt-\\int_0^xt\\cos t\\,dt$.",
      "Product Rule plus the Fundamental Theorem: $g'(x)=\\int_0^x\\cos t\\,dt+x\\cos x-x\\cos x=\\sin x$.",
      "$g''(x)=\\cos x$; in fact $g(x)=1-\\cos x$.",
      "$g''(\\frac{\\pi}{3})=\\cos\\frac{\\pi}{3}=\\frac12$."
    ],
    "trap": "Writing $g'(x)=(x-x)\\cos x=0$ directly (applying the Fundamental Theorem to an integrand that contains $x$) gives $g''=0$.",
    "check": "$g(x)=1-\\cos x$ satisfies $g(0)=0$ and $g'(0)=0$, exactly what you get by integrating $g''=\\cos x$ twice starting from zero."
  },
  "refine-integrals-009": {
    "spot": "The velocity graph is piecewise linear, and the displacement $s(6)-s(0)=\\int_0^6v\\,dt$ is the signed area under it: three trapezoids, with area below the axis counted as negative.",
    "why": "No need to write each segment's equation and integrate; trapezoid areas (average velocity × time) are fastest.",
    "steps": [
      "Segment one $(0,2)\\to(2,-2)$: average velocity $0$, signed area $0$.",
      "Segment two $(2,-2)\\to(4,-2)$: constant velocity $-2$, area $-4$.",
      "Segment three $(4,-2)\\to(6,1)$: average $\\frac{-2+1}{2}=-\\frac12$, times $2$ gives $-1$.",
      "$s(6)=s(0)+0-4-1=3-5=-2$."
    ],
    "trap": "Adding area below the axis as positive (computing total distance) gives $s(6)=3+$ distance, the wrong direction.",
    "check": "Total distance is a different thing: segment one has $1$ each above and below the axis, segment two $4$, segment three $\\frac{4}{3}+\\frac13$, which together exceed $|-5|$."
  },
  "refine-integrals-014": {
    "spot": "You need to integrate the inverse function $f^{-1}$, and the inverse of $f(x)=x^3+x$ cannot be written down; but the limits $0,2$ are exactly $f(0)$, $f(1)$: use the inverse-function area formula or substitute $y=f(x)$.",
    "why": "The inverse has no explicit form, but switching back to the variable $x$ turns it into a polynomial integral; or use $\\int_{f(a)}^{f(b)}f^{-1}=bf(b)-af(a)-\\int_a^bf$.",
    "steps": [
      "$f(0)=0$ and $f(1)=2$, so $y:0\\to2$ corresponds to $x:0\\to1$.",
      "Formula: $\\int_0^2f^{-1}(y)\\,dy=1\\cdot f(1)-0\\cdot f(0)-\\int_0^1(x^3+x)\\,dx$.",
      "$=2-\\frac34=\\frac54$.",
      "Another route: substitute $y=f(x)$, $\\int_0^1x\\,f'(x)\\,dx=\\int_0^1(3x^3+x)\\,dx=\\frac34+\\frac12$, again $\\frac54$."
    ],
    "trap": "Thinking $f^{-1}(y)=\\frac{1}{y^3+y}$ (mistaking the inverse for the reciprocal), whose integral diverges at $0$.",
    "check": "On $[0,2]$, $f^{-1}$ rises from $0$ to $1$, so the area must be less than the rectangle $2$; it is concave ($f$ is convex), so it is more than the triangle $1$, and $\\frac54$ is reasonable."
  },
  "refine-integrals-019": {
    "spot": "The region is the sector of the disk $x^2+y^2\\le4$ where $0\\le x\\le y$ ($\\frac{\\pi}{4}\\le\\theta\\le\\frac{\\pi}{2}$), and the integrand is $x^2+y^2=r^2$: polar coordinates.",
    "why": "In rectangular coordinates the limits split into two pieces with square roots; in polar coordinates every bound is constant and the integrand gets simpler.",
    "steps": [
      "$0\\le x\\le y$ means the ray lies between $y=x$ ($\\theta=\\frac{\\pi}{4}$) and the positive $y$-axis ($\\theta=\\frac{\\pi}{2}$); $0\\le r\\le2$.",
      "$\\iint(x^2+y^2)\\,dA=\\int_{\\pi/4}^{\\pi/2}\\int_0^2r^2\\cdot r\\,dr\\,d\\theta$.",
      "$=\\frac{\\pi}{4}\\cdot4=\\pi$."
    ],
    "trap": "Forgetting the $r$ in the area element (writing $r^2\\,dr\\,d\\theta$) gives $\\frac{\\pi}{4}\\cdot\\frac83=\\frac{2\\pi}{3}$.",
    "check": "Over the whole disk, $\\iint r^2\\,dA=2\\pi\\cdot4=8\\pi$; this piece is $\\frac18$ of the disk, so $\\frac{8\\pi}{8}=\\pi$."
  },
  "refine-integrals-027": {
    "spot": "The inner integral of $\\sqrt{1+x^3}$ in $x$ has no elementary antiderivative, but with an extra $x^2$ in front it could be substituted: reverse the order of integration so that integrating in $y$ first produces $x^2$.",
    "why": "In the original order you are stuck at $\\int\\sqrt{1+x^3}\\,dx$; after switching, the inner $\\int_0^{x^2}dy=x^2$ is exactly $\\frac13$ of the derivative of $1+x^3$.",
    "steps": [
      "Region: $0\\le y\\le1$, $\\sqrt y\\le x\\le1$, equivalent to $0\\le x\\le1$, $0\\le y\\le x^2$.",
      "Switch the order: $\\int_0^1\\int_0^{x^2}\\sqrt{1+x^3}\\,dy\\,dx=\\int_0^1x^2\\sqrt{1+x^3}\\,dx$.",
      "Let $u=1+x^3$, $du=3x^2dx$: $\\frac13\\int_1^2\\sqrt u\\,du=\\frac29u^{3/2}\\Big|_1^2$.",
      "$=\\frac29(2\\sqrt2-1)$."
    ],
    "trap": "Writing the $y$ range as $0\\le y\\le\\sqrt x$ when switching (solving $x=\\sqrt y$ backwards incorrectly), so the inner integral never produces $x^2$.",
    "check": "The region has area $\\int_0^1x^2\\,dx=\\frac13$ and the integrand lies between $1$ and $\\sqrt2$: the answer, about $0.406$, is between $\\frac13$ and $\\frac{\\sqrt2}{3}$."
  },
  "refine-integrals-035": {
    "spot": "Upright cylinder: every water layer has cross-section $\\pi\\cdot1^2$, and only the lift distance changes with height. With the tank bottom at $0$ and the outlet at $y=4$, the layer at height $y$ is lifted $4-y$.",
    "why": "Slice into horizontal layers, take weight × distance, and integrate; the cylinder's cross-section is constant, so the integrand is just a linear polynomial.",
    "steps": [
      "Slice weight $9800\\cdot\\pi\\cdot1^2\\,dy$, lift distance $4-y$.",
      "$\\int_0^3(4-y)\\,dy=12-\\frac92=\\frac{15}{2}$.",
      "$W=9800\\pi\\cdot\\frac{15}{2}=73500\\pi$ joules."
    ],
    "trap": "Lifting only to the top of the tank ($3-y$), forgetting the extra $1$ m, gives $9800\\pi\\cdot\\frac92=44100\\pi$.",
    "check": "Total water weight is $9800\\cdot3\\pi$, the centroid is at $1.5$ m and must be lifted $2.5$ m: $9800\\cdot3\\pi\\cdot2.5=73500\\pi$."
  },
  "refine-series-002": {
    "spot": "$\\cos\\frac{2n\\pi}{3}$ cycles with period $3$ through $-\\frac12,-\\frac12,1$: this is $\\mathrm{Re}\\sum\\frac{\\omega^n}{n}$ with $\\omega=e^{2\\pi i/3}$, so use the series for $-\\ln(1-z)$.",
    "why": "For a series with periodic coefficients times $\\frac1n$, the fastest route is to see it as the real part of a log series; rewrite it as the power series $\\sum\\cos\\frac{2n\\pi}{3}\\frac{x^n}{n}=-\\frac12\\ln(1+x+x^2)$ and let $x\\to1$.",
    "steps": [
      "$\\sum\\frac{(\\omega x)^n}{n}=-\\ln(1-\\omega x)$; take the real part: $-\\ln|1-\\omega x|=-\\frac12\\ln(1+x+x^2)$. (Since $|1-\\omega x|^2=1+x+x^2$.)",
      "The original series converges at $x=1$ (each group of three terms is $O(\\frac{1}{n^2})$), so Abel's theorem lets $x\\to1^-$.",
      "$x=1$: $-\\frac12\\ln3$."
    ],
    "trap": "Treating every $\\cos$ coefficient as $-\\frac12$ and ignoring the $+1$ every third term, or claiming it diverges like the harmonic series.",
    "check": "The first three terms give $-\\frac12-\\frac14+\\frac13\\approx-0.417$; the answer $-\\frac{\\ln3}{2}\\approx-0.549$, with each later group adding a bit more negative, so the direction is right."
  },
  "refine-series-021": {
    "spot": "The product $\\cos\\frac{\\theta}{2}\\cos\\frac{\\theta}{4}\\cdots$ (with $\\theta=\\frac{\\pi}{3}$): the angle keeps halving, so the double-angle identity $\\sin2a=2\\sin a\\cos a$ telescopes the product.",
    "why": "Taking logs turns it into a series with no closed form; multiplying by $\\sin\\frac{\\theta}{2^N}$ lets the double-angle formula merge it level by level until only $\\sin\\theta$ is left.",
    "steps": [
      "$\\prod_{n=1}^N\\cos\\frac{\\theta}{2^n}=\\frac{\\sin\\theta}{2^N\\sin\\frac{\\theta}{2^N}}$ (each $\\cos$ paired with $2\\sin$ merges into the $\\sin$ one level up). Check with $N=3$:",
      "$N\\to\\infty$: $2^N\\sin\\frac{\\theta}{2^N}\\to\\theta$, so the product $\\to\\frac{\\sin\\theta}{\\theta}$.",
      "$\\theta=\\frac{\\pi}{3}$: $\\frac{\\sqrt3/2}{\\pi/3}=\\frac{3\\sqrt3}{2\\pi}$."
    ],
    "trap": "Taking the first factor to be $\\cos\\frac{\\pi}{3}$ ($n$ starting at $0$) multiplies in an extra $\\frac12$; the product starts at $n=1$, so the first factor is $\\cos\\frac{\\pi}{6}$.",
    "check": "Every factor is less than $1$ and quickly approaches $1$; the first is $\\cos\\frac{\\pi}{6}\\approx0.866$, and the answer $\\approx0.827$ is only slightly smaller."
  },
  "refine-series-039": {
    "spot": "The constant-coefficient linear recurrence $a_{n+2}=5a_{n+1}-6a_n$ has characteristic equation $r^2-5r+6=0$ with roots $2,3$: $a_n$ is a combination of two geometric sequences, and dividing by $7^n$ gives two geometric series.",
    "why": "Solving $a_n=3^n-2^n$ first is faster than forcing a generating function, and the ratios $\\frac37,\\frac27$ are both below $1$, so convergence is immediate.",
    "steps": [
      "$a_n=A\\cdot3^n+B\\cdot2^n$; $a_0=0$, $a_1=1$ give $A=1$, $B=-1$: $a_n=3^n-2^n$.",
      "$\\sum_{n\\ge0}\\left(\\frac37\\right)^n=\\frac{7}{4}$ and $\\sum_{n\\ge0}\\left(\\frac27\\right)^n=\\frac75$.",
      "Subtract: $\\frac74-\\frac75=\\frac{7}{20}$."
    ],
    "trap": "Using the initial conditions wrong (for example $a_n=3^n+2^n$), or forgetting the $n=0$ term and using $\\frac{r}{1-r}$, both give a wrong answer.",
    "check": "The first few terms $0+\\frac17+\\frac{5}{49}+\\frac{19}{343}\\approx0.300$, and the rest shrink, so $0.35$ is reasonable."
  },
  "refine-series-044": {
    "spot": "$\\sum_{k=1}^n\\ln k=\\ln n!$, minus $(n+\\frac12)\\ln n-n$: this is exactly the constant left after taking logs of Stirling's formula $n!\\sim\\sqrt{2\\pi n}\\,n^ne^{-n}$.",
    "why": "First show the difference sequence is decreasing and has a limit, then pin down the constant $\\sqrt{2\\pi}$ with the Wallis product; this is the standard way to find Stirling's constant.",
    "steps": [
      "Let $d_n=\\ln n!-(n+\\frac12)\\ln n+n$, so $d_1=1$; $d_n-d_{n+1}=(n+\\frac12)\\ln(1+\\frac1n)-1$, about $\\frac{1}{12n^2}$, positive and summable, so $d_n$ decreases to a limit.",
      "Let $d_n\\to C$, i.e. $n!\\approx e^Cn^{n+1/2}e^{-n}$. Plug into Wallis $\\frac{\\pi}{2}=\\prod\\frac{4n^2}{4n^2-1}$ (equivalent to $\\frac{2^{4n}(n!)^4}{((2n)!)^2(2n+1)}\\to\\frac{\\pi}{2}$).",
      "The left side is about $\\frac{e^{2C}n}{2(2n+1)}\\to\\frac{e^{2C}}{4}$, so $\\frac{e^{2C}}{4}=\\frac{\\pi}{2}$ and $e^C=\\sqrt{2\\pi}$.",
      "The limit is $C=\\frac12\\ln(2\\pi)$."
    ],
    "trap": "Writing only $\\ln n!\\approx n\\ln n-n$ and dropping the $\\frac12\\ln n$ makes you think the difference diverges or tends to $0$.",
    "check": "$n=10$: $\\ln(3628800)-10.5\\ln10+10\\approx0.9273$, about $\\frac{1}{120}$ more than $\\frac12\\ln(2\\pi)\\approx0.9189$, which is exactly the next term $\\frac{1}{12n}$."
  },
  "refine-series-049": {
    "spot": "$\\sum_{k=1}^nk^k$ is overwhelmingly dominated by its last term $n^n$: the second-to-last term $(n-1)^{n-1}$ is already only $\\frac{1}{en}$ of $n^n$, and all the earlier ones together cannot catch up.",
    "why": "For a sum that grows this fast, you only need to show that \"everything except the last term\" divided by $n^n$ tends to $0$; bounding by largest term × number of terms is enough.",
    "steps": [
      "Last term: $\\frac{n^n}{n^n}=1$.",
      "Second-to-last term: $\\frac{(n-1)^{n-1}}{n^n}=\\frac{1}{n}\\left(1-\\frac1n\\right)^{n-1}$; the bracket tends to $e^{-1}$, so the term is about $\\frac{1}{en}\\to0$.",
      "Each of the first $n-2$ terms is $\\le(n-2)^{n-2}$, so together they are $\\le(n-2)^{n-1}$; divided by $n^n$ this is $\\frac1n\\left(1-\\frac2n\\right)^{n-1}\\approx\\frac{1}{e^2n}\\to0$.",
      "Altogether: $\\frac{1}{n^n}\\sum k^k=1+O\\left(\\frac1n\\right)\\to1$."
    ],
    "trap": "Using the Stolz theorem or an integral comparison and treating the sum as an area like $\\int x^x$, getting $\\infty$ or $0$; the limit of a sum like this is decided by its last term.",
    "check": "$n=5$: $\\frac{1+4+27+256+3125}{3125}=\\frac{3413}{3125}\\approx1.092$; the extra $0.09$ is the same order as $\\frac{1}{en}\\approx0.074$."
  },
  "refine-series-055": {
    "spot": "$\\frac{1}{(n+1)(n+2)}=\\frac{1}{n+1}-\\frac{1}{n+2}$ is a difference, multiplied by $H_n$: use summation by parts (Abel summation) to move the difference onto $H_n$, where $H_n-H_{n-1}=\\frac1n$.",
    "why": "Expanding $H_n$ into a double sum also works, but summation by parts turns the harmonic number into $\\frac1n$ in one step, leaving a telescoping series.",
    "steps": [
      "Let $b_n=\\frac{1}{n+1}$; the term is $H_n(b_n-b_{n+1})$.",
      "Summation by parts: $\\sum_{n=1}^NH_n(b_n-b_{n+1})=H_1b_1+\\sum_{n=2}^N(H_n-H_{n-1})b_n-H_Nb_{N+1}$, and $H_Nb_{N+1}\\approx\\frac{\\ln N}{N}\\to0$.",
      "$H_1b_1=\\frac12$, and $\\sum_{n\\ge2}\\frac1n\\cdot\\frac{1}{n+1}=\\frac12$ (telescoping).",
      "Total $\\frac12+\\frac12=1$."
    ],
    "trap": "Dropping the boundary term $H_1b_1=\\frac12$ in summation by parts and computing only $\\sum_{n\\ge2}\\frac{1}{n(n+1)}$ gives $\\frac12$.",
    "check": "The first three terms $\\frac16+\\frac{3/2}{12}+\\frac{11/6}{20}\\approx0.383$; the terms decay like $\\frac{\\ln n}{n^2}$, so the tail is long and a total of $1$ makes sense."
  },
  "refine-series-065": {
    "spot": "$f_n\\to0$ pointwise, but $nx(1-x^2)^n$ has a factor $n$ in front and its peak keeps growing: the limit and the integral cannot be swapped, so compute $\\int_0^1f_n$ directly and then take the limit.",
    "why": "$x(1-x^2)^n$ is exactly a multiple of the derivative of $(1-x^2)^{n+1}$, so the integral has a closed form; computing it and then taking the limit is the cleanest.",
    "steps": [
      "Let $u=1-x^2$: $\\int_0^1nx(1-x^2)^n\\,dx=\\frac n2\\int_0^1u^n\\,du=\\frac{n}{2(n+1)}$.",
      "Compare: the pointwise limit is $0$ and $\\int_0^10\\,dx=0$ — the convergence is not uniform. The peak of $f_n$ at $x=\\frac{1}{\\sqrt{2n+1}}$ is about $\\sqrt{\\frac{n}{2e}}$, already over $3$ at $n=50$.",
      "$n\\to\\infty$: $\\frac{n}{2(n+1)}\\to\\frac12$."
    ],
    "trap": "Seeing pointwise convergence to $0$, moving the limit inside the integral and answering $0$. Without uniform convergence (or a dominating function) you cannot swap them.",
    "check": "$n=9$: $\\frac{9}{20}=0.45$, already close to $\\frac12$ and approaching from below."
  },
  "refine-series-075": {
    "spot": "The coefficient $\\frac{(n+1)(n+2)}{2}$ is exactly the coefficient in the expansion of $(1-x)^{-3}$, and the alternating sign is $x\\to-x$: $\\sum(-1)^n\\frac{(n+1)(n+2)}{2}x^n=\\frac{1}{(1+x)^3}$, and the Abel sum is the limit as $x\\to1^-$.",
    "why": "The Abel sum is by definition the limit of the power series as $x\\to1^-$; recognize the closed form of the power series and you are done in one step.",
    "steps": [
      "$\\frac{1}{(1-x)^3}=\\sum\\frac{(n+1)(n+2)}{2}x^n$ (differentiate $\\frac{1}{1-x}$ twice and divide by $2$).",
      "Replace $x\\to-x$: $\\sum(-1)^n\\frac{(n+1)(n+2)}{2}x^n=\\frac{1}{(1+x)^3}$, valid for $|x|<1$.",
      "Abel sum: $\\lim_{x\\to1^-}\\frac{1}{(1+x)^3}=\\frac18$."
    ],
    "trap": "Trying Cesaro averaging (averages of partial sums), which does not converge for this series; or remembering the coefficients of $(1-x)^{-3}$ as $n^2$.",
    "check": "Line it up with the familiar $1-1+1-\\cdots=\\frac12$ and $1-2+3-\\cdots=\\frac14$: denominators $2,4,8$, exactly $(1+x)^{-1},(1+x)^{-2},(1+x)^{-3}$ at $x=1$."
  },
  "refine-series-079": {
    "spot": "The exponent has an extra $(-1)^n$, so even and odd terms jump back and forth: for even $n$, $a_n=2^{-n+1}$; for odd $n$, $a_n=2^{-n-1}$. Compute the ratio separately for the two cases.",
    "why": "The ratio sequence oscillates between two values, so its limit does not exist; the limsup is the larger of the two subsequence limits.",
    "steps": [
      "$n$ odd: $a_n=2^{-n-1}$, $a_{n+1}=2^{-(n+1)+1}=2^{-n}$, ratio $2$.",
      "$n$ even: $a_n=2^{-n+1}$, $a_{n+1}=2^{-n-2}$, ratio $\\frac18$.",
      "The ratio alternates between $\\frac18$ and $2$, so the limsup is $2$ (liminf $\\frac18$). The Ratio Test needs $\\limsup<1$, so it fails here; only the Root Test, with $\\sqrt[n]{a_n}\\to\\frac12$, shows convergence."
    ],
    "trap": "Computing only the even-index ratio, getting $\\frac18$, and concluding the Ratio Test applies; or taking the limsup to be the average of the two.",
    "check": "Check again at $n=5$ and $6$: the ratios are still $2$ and $\\frac18$, the alternation persists."
  },
  "cl-der-039": {
    "spot": "The angle between the radius vector and the tangent of a polar curve, with $\\tan\\psi=\\frac{r}{dr/d\\theta}$ given; for $r^2=\\cos2\\theta$, implicit differentiation $2rr'=-2\\sin2\\theta$ is fastest.",
    "why": "Differentiating $r^2$ implicitly avoids the square root; $\\frac{r}{r'}=-\\frac{r^2}{\\sin2\\theta}=-\\cot2\\theta$, then plug in the angle.",
    "steps": [
      "$2rr'=-2\\sin2\\theta$, so $r'=-\\frac{\\sin2\\theta}{r}$.",
      "$\\tan\\psi=\\frac{r}{r'}=-\\frac{r^2}{\\sin2\\theta}=-\\cot2\\theta$.",
      "$\\theta=\\frac{\\pi}{6}$: $\\tan\\psi=-\\cot\\frac{\\pi}{3}=-\\frac{1}{\\sqrt3}$.",
      "In $(0,\\pi)$ the angle with $\\tan\\psi=-\\frac{1}{\\sqrt3}$ is $\\psi=\\frac{5\\pi}{6}$."
    ],
    "trap": "Seeing $\\tan\\psi=-\\frac{1}{\\sqrt3}$ and answering $-\\frac{\\pi}{6}$ (the principal value of arctan), ignoring the requirement $0<\\psi<\\pi$.",
    "check": "In general $\\tan\\psi=-\\cot2\\theta=\\tan\\left(\\frac{\\pi}{2}+2\\theta\\right)$, so $\\psi=\\frac{\\pi}{2}+2\\theta=\\frac{\\pi}{2}+\\frac{\\pi}{3}=\\frac{5\\pi}{6}$."
  },
  "cl-der-040": {
    "spot": "$(2,0)$ is an endpoint of the ellipse's major axis, so the center of curvature lies on the major axis, toward the inside of the ellipse: $X=2-R$, where $R$ is the radius of curvature.",
    "why": "In the parametric curvature formula at $t=0$ we have $x'=0$ and $y''=0$, so almost every term vanishes and $R$ takes one line.",
    "steps": [
      "$x'=-2\\sin t$, $y'=\\cos t$, $x''=-2\\cos t$, $y''=-\\sin t$; at $t=0$: $x'=0$, $y'=1$, $x''=-2$, $y''=0$.",
      "$\\kappa=\\frac{|x'y''-y'x''|}{(x'^2+y'^2)^{3/2}}=\\frac{|0-(1)(-2)|}{1}=2$, so $R=\\frac12$.",
      "At $(2,0)$ the curve bends to the left, so the center of curvature is on the inside at $(2-\\frac12,0)$."
    ],
    "trap": "Remembering the radius of curvature as something other than $\\frac{b^2}{a}$ (for example $\\frac{a^2}{b}=4$), or placing the center outside, giving $X=\\frac52$.",
    "check": "The radius of curvature at an end of the major axis is $\\frac{b^2}{a}=\\frac12$, matching the formula; $X=\\frac32$ is inside the ellipse."
  },
  "cl-der-041": {
    "spot": "The envelope of a family of parabolas (parameter: launch angle): fix the horizontal distance $x=6$ and ask for the highest point any trajectory can reach there — maximize over $\\tan\\alpha$.",
    "why": "Write the height as a quadratic in $T=\\tan\\alpha$; completing the square or setting the derivative to zero gives the envelope (the safety parabola) without solving a system.",
    "steps": [
      "Trajectory $y=x\\tan\\alpha-\\frac{gx^2}{2v^2\\cos^2\\alpha}=xT-\\frac{x^2}{20}(1+T^2)$, where $T=\\tan\\alpha$ and $\\frac{g}{2v^2}=\\frac{10}{200}=\\frac{1}{20}$.",
      "$x=6$: $y(T)=6T-1.8(1+T^2)$; setting $y'(T)=6-3.6T=0$ gives $T=\\frac53$.",
      "Highest point $y=6\\cdot\\frac53-1.8\\left(1+\\frac{25}{9}\\right)=10-6.8=3.2$.",
      "General form: the envelope is $y=\\frac{v^2}{2g}-\\frac{gx^2}{2v^2}=5-\\frac{x^2}{20}$, and at $x=6$ it is $5-1.8=3.2$."
    ],
    "trap": "Thinking the envelope is just the $45^\\circ$ trajectory and plugging in $T=1$ to get $6-3.6=2.4$; the envelope corresponds to a different launch angle at each $x$.",
    "check": "The envelope peaks at $5$ m (the height of a vertical throw, $\\frac{v^2}{2g}$) and lands at $x=10$ (the maximum range $\\frac{v^2}{g}$); both endpoints are right."
  },
  "cl-der-043": {
    "spot": "Rearrange the inequality $\\cos x\\le1-kx^2$ to $k\\le\\frac{1-\\cos x}{x^2}$: the largest $k$ is the minimum of the right side on $(0,\\frac{\\pi}{2}]$.",
    "why": "Isolating the parameter turns the problem into finding a function's minimum, much simpler than analyzing the sign of $1-kx^2-\\cos x$ for each $k$.",
    "steps": [
      "Let $g(x)=\\frac{1-\\cos x}{x^2}$, so $g'(x)=\\frac{x\\sin x-2(1-\\cos x)}{x^3}$.",
      "Numerator $h=x\\sin x-2+2\\cos x$: $h(0)=0$ and $h'=x\\cos x-\\sin x=\\cos x(x-\\tan x)<0$, so $h<0$ and $g$ is decreasing.",
      "The minimum is at the right endpoint: $g(\\frac{\\pi}{2})=\\frac{1-0}{\\pi^2/4}=\\frac{4}{\\pi^2}$."
    ],
    "trap": "Looking at the limit $\\frac12$ as $x\\to0$ and answering $k=\\frac12$; that is the maximum of $g$, and with it, at $x=\\frac{\\pi}{2}$ you get $1-\\frac{\\pi^2}{8}<0=\\cos\\frac{\\pi}{2}$, so the inequality fails.",
    "check": "With $k=\\frac{4}{\\pi^2}\\approx0.405$, equality holds exactly at $x=\\frac{\\pi}{2}$, and in the middle at $x=1$ we have $1-0.405>\\cos1\\approx0.540$."
  },
  "cl-der-045": {
    "spot": "$(1+x)^y=e^{y\\ln(1+x)}$: the lowest-order part of the exponent $y\\ln(1+x)=xy-\\frac{x^2y}{2}+\\cdots$ is the quadratic term $xy$, so up to second order only $1+xy$ is left.",
    "why": "Writing it as $e^{\\text{small}}$ and expanding is faster than computing the three partials $f_{xx},f_{xy},f_{yy}$; it also shows right away that the $x^2$ and $y^2$ coefficients are $0$.",
    "steps": [
      "$f_x=y(1+x)^{y-1}$, which at $x=0$ is just $y$ (e.g. $y=0.37$).",
      "So $f_{xy}(0,0)=\\frac{\\partial}{\\partial y}y=1$; the coefficient of the $xy$ term is $\\frac{2f_{xy}}{2!}=f_{xy}=1$.",
      "Also $f(x,0)=1$ and $f(0,y)=1$, so $f_{xx}=f_{yy}=0$; the second-order Taylor polynomial is $1+xy$. Check along $y=x$: $(1+x)^x\\approx1+x^2$."
    ],
    "trap": "Thinking the $xy$ coefficient is $\\frac12f_{xy}$ (confusing it with the $\\frac12f_{xx}$ of the $x^2$ term) and answering $\\frac12$.",
    "check": "Plug in $x=y=0.1$: $1.1^{0.1}\\approx1.00958$, within $0.001$ of $1+0.01$."
  },
  "cl-der-047": {
    "spot": "The gradient of $F=xyz-1$ at $(1,1,1)$ is $(1,1,1)$, and the tangent plane $x+y+z=3$ has all three intercepts equal to $3$: tetrahedron volume $\\frac16abc$.",
    "why": "Using the gradient as the normal vector is the fastest way to the tangent plane, and once it is in intercept form the volume formula applies directly.",
    "steps": [
      "$\\nabla F=(yz,xz,xy)=(1,1,1)$.",
      "Tangent plane $(x-1)+(y-1)+(z-1)=0$, i.e. $x+y+z=3$, with intercepts $3,3,3$.",
      "Volume $\\frac16\\cdot3\\cdot3\\cdot3=\\frac92$."
    ],
    "trap": "Using $\\frac13abc$ for the tetrahedron volume (treating it as a pyramid on the full rectangle as base) gives $9$.",
    "check": "In general, the tangent plane to $xyz=1$ at any point cuts off a tetrahedron of volume $\\frac92$; this problem just uses the most symmetric point."
  },
  "cl-der-048": {
    "spot": "Second derivative of the curve $e^y+xy=e$ at $(0,1)$: use implicit differentiation twice, the second time differentiating \"$e^yy'+y+xy'=0$\" directly, without solving for $y'$ first.",
    "why": "Applying the Quotient Rule to the fraction $y'=-\\frac{y}{e^y+x}$ is messy; the once-differentiated equation is linear in the derivative, so differentiating again and plugging in the point gives a linear equation.",
    "steps": [
      "The point is on the curve: $e+0=e$.",
      "Once: $e^yy'+y+xy'=0$; at $(0,1)$: $ey'=-1$, so $y'=-\\frac1e$.",
      "Twice: $e^y(y')^2+e^yy''+2y'+xy''=0$; substitute: $e\\cdot\\frac{1}{e^2}+ey''-\\frac2e=0$.",
      "$ey''=\\frac1e$, so $y''=e^{-2}$."
    ],
    "trap": "Differentiating $xy$ the second time as only $xy''$, missing the two $y'$ (it should be $2y'+xy''$), gives $y''=-e^{-2}$, with the wrong sign.",
    "check": "$y'<0$ and $y''>0$: at $(0,1)$ the curve heads down to the right and is concave up; $y''=e^{-2}\\approx0.135$ is a small positive number."
  },
  "cl-der-049": {
    "spot": "$\\sin x$ stays between $\\pm1$, while $\\frac{x}{10}$ leaves that range for $|x|>10$: roots can only be in $[-10,10]$, so count how many sine arches the line crosses; the two sides are symmetric.",
    "why": "The equation has no closed-form solution, so you can only count intersections; use odd symmetry to look at $x>0$ only, and check endpoint signs on each half-period.",
    "steps": [
      "$h(x)=\\sin x-\\frac{x}{10}$ is odd, $x=0$ is a root, and there are as many positive roots as negative ones; for $x>10$, $|\\sin x|\\le1<\\frac{x}{10}$, so no roots.",
      "$(0,\\pi)$: $h$ is positive for small $x$ and negative at $3$, so one root.",
      "$(\\pi,2\\pi)$: $\\sin x<0<\\frac{x}{10}$, no roots. $(2\\pi,3\\pi)$: $h(2\\pi)<0$, $h(\\frac{5\\pi}{2})=1-\\frac{\\pi}{4}>0$, $h(3\\pi)<0$, so two roots.",
      "$(3\\pi,10]$: $\\sin x<0$, no roots. That makes $3$ positive roots, for a total of $1+2\\cdot3=7$."
    ],
    "trap": "Counting only the positive roots and answering $3$, or forgetting $x=0$ and answering $6$.",
    "check": "Rough estimate: on $[0,10]$ the line spans about $1.6$ full periods; each positive arch is crossed at most twice, and the first arch counts only once because it starts at the origin, so $3$ positive roots is reasonable."
  },
  "cl-int-039": {
    "spot": "The $\\frac12$ in $\\int_0^\\pi\\ln(1+a\\cos x)\\,dx$ is a parameter you can vary: differentiate in $a$ and the $\\ln$ disappears, leaving $\\int\\frac{\\cos x}{1+a\\cos x}dx$, which has a closed form.",
    "why": "$\\ln(1+\\frac12\\cos x)$ has no elementary antiderivative; Feynman's trick (differentiating with respect to a parameter) turns it into a rational trigonometric integral, then you integrate back.",
    "steps": [
      "Let $I(a)=\\int_0^\\pi\\ln(1+a\\cos x)\\,dx$, so $I(0)=0$. Prerequisite: $\\int_0^\\pi\\frac{dx}{1+a\\cos x}=\\frac{\\pi}{\\sqrt{1-a^2}}$.",
      "$I'(a)=\\int_0^\\pi\\frac{\\cos x}{1+a\\cos x}dx=\\frac1a\\left(\\pi-\\frac{\\pi}{\\sqrt{1-a^2}}\\right)$.",
      "Integrate back: $I(a)=\\pi\\ln\\frac{1+\\sqrt{1-a^2}}{2}$ (it is $0$ at $a=0$ and the derivative matches).",
      "$a=\\frac12$: $\\pi\\ln\\frac{1+\\frac{\\sqrt3}{2}}{2}=\\pi\\ln\\frac{2+\\sqrt3}{4}$."
    ],
    "trap": "Thinking $\\cos x$ cancels symmetrically on $[0,\\pi]$ so the integral is $0$; $\\ln$ is concave, so the positive and negative halves do not cancel, and the result is negative.",
    "check": "$\\ln(1+u)\\le u$ and $\\int_0^\\pi\\frac12\\cos x\\,dx=0$, so the answer must be below $0$; $\\pi\\ln\\frac{2+\\sqrt3}{4}\\approx-0.218$."
  },
  "cl-int-042": {
    "spot": "$x^2y''-3xy'+4y=0$: in every term the power of $x$ matches the order of the derivative, so it is a Cauchy-Euler equation; try $y=x^r$.",
    "why": "The coefficients are not constant, so the characteristic equation method does not apply directly; substituting $x^r$ (or letting $x=e^s$) turns it into a constant-coefficient problem.",
    "steps": [
      "Substitute $y=x^r$: $r(r-1)-3r+4=r^2-4r+4=(r-2)^2=0$, a double root $r=2$.",
      "With a double root the general solution is $y=x^2(A+B\\ln x)$.",
      "$y(1)=A=1$; $y'=2x(A+B\\ln x)+Bx$, so $y'(1)=2A+B=0$ and $B=-2$: $y=x^2(1-2\\ln x)$.",
      "$y(e)=e^2(1-2)=-e^2$."
    ],
    "trap": "Writing the second solution for the double root as $x\\cdot x^2$ (copying the constant-coefficient $xe^{rx}$); for a Cauchy-Euler equation you multiply by $\\ln x$.",
    "check": "Plugging the solution $x^2(1-2\\ln x)$ back into the equation leaves zero residual."
  },
  "cl-int-043": {
    "spot": "$\\frac{dv}{dt}=9.8-0.098v^2=0.098(100-v^2)$: separable, with a difference of squares on the right and terminal velocity $10$, so the solution has the shape $10\\tanh(kt)$.",
    "why": "After separating, $\\int\\frac{dv}{100-v^2}$ is partial fractions or $\\tanh^{-1}$; recognizing the $\\tanh$ form directly saves tidying up logarithms.",
    "steps": [
      "Separate: $\\frac{dv}{100-v^2}=0.098\\,dt$; the left side integrates to $\\frac{1}{10}\\tanh^{-1}\\frac{v}{10}$, so $\\tanh^{-1}\\frac{v}{10}=0.98t$ (using $v(0)=0$).",
      "$v(t)=10\\tanh(0.98t)$; check that it satisfies the equation.",
      "$v(1)=10\\tanh(0.98)\\approx7.53$ m/s."
    ],
    "trap": "Ignoring drag and using $v=9.8t$ to get $9.8$, or getting the partial fractions coefficient $\\frac{1}{20}$ wrong so the exponent becomes $0.098t$ or $1.96t$.",
    "check": "$v(1)$ must be below both the drag-free $9.8$ and the terminal velocity $10$; $\\approx7.53$ is reasonable."
  },
  "cl-int-045": {
    "spot": "A polar curve rotated about the polar axis: $S=2\\pi\\int y\\,ds$ with $y=r\\sin\\theta$ and $ds=\\sqrt{r^2+r'^2}\\,d\\theta$. The lemniscate has a lucky identity $r^2+r'^2=\\frac{1}{r^2}$, so $y\\,ds$ becomes $\\sin\\theta\\,d\\theta$.",
    "why": "Simplify $r^2+r'^2$ before integrating and the integrand is just $\\sin\\theta$; also, integrate only the upper half $0\\le\\theta\\le\\frac{\\pi}{4}$, since rotating the lower half gives the same surface.",
    "steps": [
      "$rr'=-\\sin2\\theta$, so $r^2+r'^2=\\cos2\\theta+\\frac{\\sin^22\\theta}{\\cos2\\theta}=\\frac{1}{\\cos2\\theta}=\\frac{1}{r^2}$.",
      "$ds=\\frac{d\\theta}{r}$, so $y\\,ds=r\\sin\\theta\\cdot\\frac{d\\theta}{r}=\\sin\\theta\\,d\\theta$.",
      "Rotating the upper half $\\theta\\in[0,\\frac{\\pi}{4}]$ once gives the whole surface: $S=2\\pi\\int_0^{\\pi/4}\\sin\\theta\\,d\\theta=2\\pi\\left(1-\\frac{\\sqrt2}{2}\\right)=\\pi(2-\\sqrt2)$."
    ],
    "trap": "Integrating $2\\pi\\int r\\sin\\theta\\,ds$ over the whole stated range $-\\frac{\\pi}{4}\\le\\theta\\le\\frac{\\pi}{4}$, where positive and negative cancel to $0$; or taking absolute values over the whole range and doubling the area to $2\\pi(2-\\sqrt2)$.",
    "check": "The surface sits inside the sphere of radius $1$, so its area should be much less than half of the sphere's $4\\pi$; $\\pi(2-\\sqrt2)\\approx1.84$."
  },
  "cl-int-046": {
    "spot": "The denominator is a power of $x+\\sqrt{x^2+1}$: that is exactly $e^u$ when $x=\\sinh u$, so a hyperbolic substitution turns everything into exponentials.",
    "why": "$x=\\sinh u$ gives $\\sqrt{x^2+1}=\\cosh u$ and $x+\\sqrt{x^2+1}=e^u$, so the integrand becomes $e^{-3u}\\cosh u$ and two exponential integrals finish it.",
    "steps": [
      "Let $x=\\sinh u$, $dx=\\cosh u\\,du$, $x+\\sqrt{x^2+1}=\\sinh u+\\cosh u=e^u$; $x:0\\to\\infty$ corresponds to $u:0\\to\\infty$.",
      "The integral becomes $\\int_0^\\infty e^{-3u}\\cosh u\\,du=\\frac12\\int_0^\\infty\\left(e^{-2u}+e^{-4u}\\right)du$.",
      "$=\\frac12\\left(\\frac12+\\frac14\\right)=\\frac38$."
    ],
    "trap": "Forgetting $dx=\\cosh u\\,du$ in the substitution and integrating only $\\int e^{-3u}du=\\frac13$.",
    "check": "Numerically integrating the original integral also gives $0.375$."
  },
  "cl-int-047": {
    "spot": "$I_n=\\int_0^1\\frac{x^n}{1+x}dx$: two neighbors add up to $\\frac{x^n+x^{n+1}}{1+x}=x^n$, so $I_n+I_{n+1}=\\frac{1}{n+1}$; then use that $I_n$ is decreasing and apply the Squeeze Theorem.",
    "why": "$I_n$ has no nice closed form, but the recursion plus monotonicity traps $nI_n$ between two quantities that both tend to $\\frac12$.",
    "steps": [
      "$I_n+I_{n+1}=\\int_0^1x^n\\,dx=\\frac{1}{n+1}$.",
      "$x^n$ decreases in $n$, so $I_{n+1}<I_n<I_{n-1}$; hence $\\frac{1}{n+1}=I_n+I_{n+1}<2I_n<I_{n-1}+I_n=\\frac1n$.",
      "Multiply by $\\frac n2$: $\\frac{n}{2(n+1)}<nI_n<\\frac12$; the left side $\\to\\frac12$, so by the Squeeze Theorem the limit is $\\frac12$."
    ],
    "trap": "Seeing $x^n\\to0$, saying $I_n\\to0$ and therefore $nI_n\\to0$; $I_n$ is of the same order as $\\frac{1}{2n}$, so it does not vanish after multiplying by $n$.",
    "check": "Intuition: the mass of $x^n$ concentrates near $x=1$, where $\\frac{1}{1+x}\\approx\\frac12$, so $I_n\\approx\\frac12\\cdot\\frac{1}{n+1}$."
  },
  "cl-int-049": {
    "spot": "The denominator involves only $x^2$: let $u=x^2$ and do partial fractions on $\\frac{1}{(u+1)^2(u+4)}$; each piece is a known value like $\\int_0^\\infty\\frac{dx}{x^2+a^2}$ or $\\int_0^\\infty\\frac{dx}{(x^2+1)^2}$.",
    "why": "The integrand is a rational function of $x^2$, so splitting in $u$ needs half as many unknowns as splitting in $x$; on the infinite interval every $\\arctan$ becomes a multiple of $\\frac{\\pi}{2}$.",
    "steps": [
      "$\\frac{1}{(u+1)^2(u+4)}=-\\frac{1}{9(u+1)}+\\frac{1}{3(u+1)^2}+\\frac{1}{9(u+4)}$.",
      "Known: $\\int_0^\\infty\\frac{dx}{x^2+1}=\\frac{\\pi}{2}$, $\\int_0^\\infty\\frac{dx}{(x^2+1)^2}=\\frac{\\pi}{4}$, $\\int_0^\\infty\\frac{dx}{x^2+4}=\\frac{\\pi}{4}$.",
      "Together: $-\\frac{\\pi}{18}+\\frac{\\pi}{12}+\\frac{\\pi}{36}=\\frac{-2+3+1}{36}\\pi=\\frac{\\pi}{18}$."
    ],
    "trap": "Writing $\\int_0^\\infty\\frac{dx}{x^2+4}$ as $\\frac{\\pi}{2}$ (forgetting the $\\frac12$ in $\\frac1a\\arctan\\frac xa$).",
    "check": "The integrand is at most $\\frac{1}{4(x^2+1)}$, so the integral is at most $\\frac{\\pi}{8}$; $\\frac{\\pi}{18}\\approx0.175$ is below that."
  },
  "refine-derivatives-031": {
    "spot": "Third derivative of an inverse function: $g(2)=1$ (since $f(1)=2$), so use the formula $g'''=\\frac{3(f'')^2-f'f'''}{(f')^5}$ with everything evaluated at $x=1$.",
    "why": "The inverse cannot be written down; differentiating $g'=\\frac{1}{f'(g)}$ repeatedly with the Chain Rule gives a formula in derivatives of $f$ only, so you just plug in numbers.",
    "steps": [
      "$f(1)=2$, so $g(2)=1$; $f'(1)=5+1=6$, $f''(1)=20$, $f'''(1)=60$.",
      "$g'=\\frac{1}{f'}$, $g''=-\\frac{f''}{(f')^3}$, $g'''=\\frac{3(f'')^2-f'f'''}{(f')^5}$ (each differentiation in $y$ brings in another factor $\\frac{1}{f'}$).",
      "Substitute: $\\frac{3\\cdot400-6\\cdot60}{6^5}=\\frac{840}{7776}=\\frac{35}{324}$."
    ],
    "trap": "Taking $g'''(2)$ to be $\\frac{1}{f'''(1)}=\\frac{1}{60}$, or evaluating the derivatives of $f$ at $x=2$ (they should be at $g(2)=1$).",
    "check": "Test the formula from the previous step with $f=e^x$, $g=\\ln y$: $g'''=\\frac{2}{y^3}$, and the formula gives $\\frac{3e^{2x}-e^{2x}}{e^{5x}}=2e^{-3x}$, consistent."
  },
  "refine-derivatives-032": {
    "spot": "$G=F^{-1}$ and $F(0)=0$, so $G(0)=0$; for $G'''(0)$, evaluate $F',F'',F'''$ at $x=0$ and use the third-derivative formula for inverse functions.",
    "why": "$F$ itself has no elementary formula, but its derivative is $e^{t^2}$, which is easy to differentiate; the inverse-function formula needs nothing else.",
    "steps": [
      "$F'=e^{x^2}$, $F''=2xe^{x^2}$, $F'''=(2+4x^2)e^{x^2}$; at $0$: $1,0,2$.",
      "$G'''=\\frac{3(F'')^2-F'F'''}{(F')^5}$.",
      "$G'''(0)=\\frac{0-2}{1}=-2$."
    ],
    "trap": "Thinking $F''(0)=0$ makes all of $G'''$ equal $0$ too; the formula also has the $-F'F'''$ term.",
    "check": "Series check: $F(x)=x+\\frac{x^3}{3}+\\cdots$, so the inverse is $G(y)=y-\\frac{y^3}{3}+\\cdots$ and $G'''(0)=3!\\cdot(-\\frac13)=-2$."
  },
  "refine-derivatives-034": {
    "spot": "Differentiating $e^{\\sin x}$ three times: each derivative brings out $\\cos x$ times the original, so write everything as \"trig polynomial $\\times e^{\\sin x}$\" and push through.",
    "why": "The outer $e^u$ is its own derivative, so you only need to track the polynomial in front; using $(e^{u})'''=e^u(u'''+3u'u''+u'^3)$ directly also works.",
    "steps": [
      "$y'=\\cos x\\,e^{\\sin x}$, $y''=(\\cos^2x-\\sin x)e^{\\sin x}$.",
      "$y'''=\\left(-2\\sin x\\cos x-\\cos x+\\cos x(\\cos^2x-\\sin x)\\right)e^{\\sin x}=\\cos x(\\cos^2x-3\\sin x-1)e^{\\sin x}$.",
      "$x=\\frac{\\pi}{6}$: $\\frac{\\sqrt3}{2}\\left(\\frac34-\\frac32-1\\right)e^{1/2}=-\\frac{7\\sqrt3}{8}e^{1/2}$."
    ],
    "trap": "Missing the derivative $-2\\sin x\\cos x$ of $\\cos^2x$ in the third differentiation turns the bracket into $\\cos^2x-\\sin x-1$ and gives $-\\frac{3\\sqrt3}{8}e^{1/2}$.",
    "check": "Using the formula $u'''+3u'u''+u'^3$ (with $u=\\sin x$): $-\\cos x-3\\cos x\\sin x+\\cos^3x$, the same as the simplified form above."
  },
  "refine-derivatives-036": {
    "spot": "$\\frac{1}{2^nn!}\\frac{d^n}{dx^n}(x^2-1)^n$ is Rodrigues' formula with $n=4$ and $2^4\\cdot4!=384$: $P$ is the Legendre polynomial $P_4$.",
    "why": "Expand $(x^2-1)^4$ into five terms first, then differentiating four times is term by term; recognizing $P_4=\\frac{35x^4-30x^2+3}{8}$ is even faster.",
    "steps": [
      "$(x^2-1)^4=x^8-4x^6+6x^4-4x^2+1$.",
      "Differentiate twice: $56x^6-120x^4+72x^2-8$.",
      "Twice more: $1680x^4-1440x^2+144$; divide by $384$: $\\frac{35x^4-30x^2+3}{8}$.",
      "$P(\\frac12)=\\frac{1}{8}\\left(\\frac{35}{16}-\\frac{30}{4}+3\\right)=\\frac18\\cdot\\left(-\\frac{37}{16}\\right)=-\\frac{37}{128}$."
    ],
    "trap": "Misreading the constant $384$ (thinking you must multiply or divide by $4!$ again), or getting a sign wrong when expanding $(x^2-1)^4$, giving a sign-flipped value like $\\frac{37}{128}$.",
    "check": "Legendre polynomials satisfy $P_4(1)=1$."
  },
  "refine-derivatives-039": {
    "spot": "You cannot solve for $x$, but $a$ can be written in terms of $x$: $a=\\frac{1-x^5}{x}=\\frac1x-x^4$. Treat $x(a)$ as the inverse of $a(x)$ and use $x''=-\\frac{a''}{(a')^3}$.",
    "why": "Implicit differentiation twice also works, but writing it the other way round as $a(x)$ is explicit, and two ordinary derivatives plus the inverse-function formula make it harder to drop a term.",
    "steps": [
      "$a(x)=\\frac1x-x^4$, and $a(1)=0$ corresponds to $x(0)=1$.",
      "$a'(x)=-\\frac{1}{x^2}-4x^3$, $a'(1)=-5$; $a''(x)=\\frac{2}{x^3}-12x^2$, $a''(1)=-10$.",
      "Inverse function: $x'(0)=\\frac{1}{a'(1)}=-\\frac15$, $x''(0)=-\\frac{a''(1)}{a'(1)^3}=-\\frac{-10}{-125}=-\\frac{2}{25}$.",
      "Compare with implicit differentiation: $5x^4x'+x+ax'=0$, differentiated again, is $20x^3x'^2+5x^4x''+2x'+ax''=0$; substituting gives $\\frac45+5x''-\\frac25=0$, again $x''=-\\frac{2}{25}$."
    ],
    "trap": "In the second implicit differentiation, writing $(ax')'$ as only $ax''$ and missing an $x'$; with just one $x'$ left you get $x''=-\\frac{3}{25}$.",
    "check": "At $a=0.01$ the real root is about $0.9979960$, and the second-order approximation $1-\\frac{0.01}{5}-\\frac{1}{25}(0.01)^2=0.997996$ agrees to six places."
  },
  "refine-derivatives-041": {
    "spot": "In $x^y+y^x=2$ both terms are \"variable to a variable power\", and the point $(1,1)$ is symmetric: use the partial derivatives of $F(x,y)=x^y+y^x$ with $y''=-\\frac{F_{xx}+2F_{xy}y'+F_{yy}y'^2}{F_y}$.",
    "why": "At $(1,1)$ we have $\\ln1=0$, so many terms vanish immediately; the partial-derivative formula is cleaner than implicitly differentiating the whole equation twice.",
    "steps": [
      "$F_x=yx^{y-1}+y^x\\ln y$ and $F_y=x^y\\ln x+xy^{x-1}$ are both $1$ at $(1,1)$, so $y'=-1$.",
      "$F_{xx}$: along $y=1$, $F(x,1)=x+1$, so $F_{xx}=0$; likewise $F(1,y)=1+y$, so $F_{yy}=0$.",
      "$F_{xy}$: $F_x(1,y)=y+y\\ln y$; differentiating in $y$ gives $2+\\ln y$, which is $2$ at $y=1$.",
      "$y''=-\\frac{0+2\\cdot2\\cdot(-1)+0}{1}=4$."
    ],
    "trap": "Thinking a symmetric curve is a straight line ($y=2-x$) at the symmetric point and answering $y''=0$; the mixed term $F_{xy}=2$ makes the curve bend.",
    "check": "Numerically solving the curve: at $x=1.01$, $y\\approx0.990196$; at $x=0.99$, $y\\approx1.010204$; second difference $\\frac{0.990196+1.010204-2}{0.0001}\\approx4.0$."
  },
  "refine-derivatives-043": {
    "spot": "Dividing $f(xy)=xf(y)+yf(x)$ by $xy$ gives $\\frac{f(xy)}{xy}=\\frac{f(x)}{x}+\\frac{f(y)}{y}$: $\\frac{f(x)}{x}$ turns multiplication into addition, so it is a logarithm.",
    "why": "Differentiating in $y$ at $y=1$ gives a first-order linear differential equation, which the known $f'(1)$ and $f(1)=0$ solve for $f$ directly.",
    "steps": [
      "$x=y=1$: $f(1)=2f(1)$, so $f(1)=0$.",
      "Differentiate in $y$ and set $y=1$: $xf'(x)=xf'(1)+f(x)$, i.e. $f'-\\frac fx=1$, which is $\\left(\\frac fx\\right)'=\\frac1x$.",
      "Integrate and use $f(1)=0$: $\\frac{f}{x}=\\ln x$, so $f(x)=x\\ln x$. Check the functional equation:",
      "$f(2)=2\\ln2$."
    ],
    "trap": "Assuming $f$ is linear, $cx$, and plugging back in to get $cxy=2cxy$, which forces $c=0$, then getting stuck or answering $0$.",
    "check": "$f'(x)=\\ln x+1$, and $f'(1)=1$ satisfies the condition."
  },
  "refine-derivatives-044": {
    "spot": "$2xy+2yz$ is a quadratic form restricted to the unit sphere: its maximum is the largest eigenvalue of the matrix $\\begin{pmatrix}0&1&0\\\\1&0&1\\\\0&1&0\\end{pmatrix}$.",
    "why": "The equations from Lagrange multipliers are exactly the eigenvalue problem; finding the characteristic polynomial directly is fastest.",
    "steps": [
      "Lagrange: $\\nabla(2xy+2yz)=2\\lambda(x,y,z)$, i.e. $y=\\lambda x$, $x+z=\\lambda y$, $y=\\lambda z$, and then the function value is $=\\lambda(x^2+y^2+z^2)=\\lambda$.",
      "Characteristic polynomial $-\\lambda^3+2\\lambda=0$, so $\\lambda=0,\\pm\\sqrt2$; the largest is $\\sqrt2$.",
      "It is attained at $(x,y,z)=(\\frac12,\\frac{1}{\\sqrt2},\\frac12)$: $(\\frac12)^2+\\frac12+(\\frac12)^2=1$ and $2\\cdot\\frac12\\cdot\\frac{1}{\\sqrt2}\\cdot2=\\sqrt2$."
    ],
    "trap": "Assuming the maximum is at the symmetric point $x=y=z=\\frac{1}{\\sqrt3}$ gives $\\frac43\\approx1.333$, which is smaller than $\\sqrt2\\approx1.414$.",
    "check": "Cauchy-Schwarz: $2y(x+z)\\le2|y|\\sqrt2\\sqrt{x^2+z^2}\\le\\sqrt2(y^2+x^2+z^2)=\\sqrt2$, the same upper bound."
  },
  "refine-integrals-015": {
    "spot": "$e^{x^2}$ and $\\sqrt{\\ln y}$ are inverse functions and the limits match up: for $x:0\\to2$, $e^{x^2}:1\\to e^4$. The two integrals together make one rectangle's area.",
    "why": "Neither integral has an elementary antiderivative, but \"area under the function + area under the inverse equals $bf(b)-af(a)$\" settles it in one step.",
    "steps": [
      "$y=e^{x^2}\\iff x=\\sqrt{\\ln y}$ (for $x\\ge0$), with $f(0)=1$ and $f(2)=e^4$.",
      "Substitute $y=e^{x^2}$: $\\int_1^{e^4}\\sqrt{\\ln y}\\,dy=\\int_0^2x\\cdot2xe^{x^2}dx$, then integrate by parts: $=\\Big[xe^{x^2}\\Big]_0^2-\\int_0^2e^{x^2}dx$.",
      "So the sum of the two integrals is $=2e^4-0\\cdot1=2e^4$."
    ],
    "trap": "Using the wrong endpoint in the $bf(b)$ formula (for example getting $e^4\\cdot2$ right but then also subtracting $1\\cdot1$) gives $2e^4-1$; here $a=0$, so $af(a)=0$.",
    "check": "Picture: the curve cuts the rectangle $[0,2]\\times[0,e^4]$ into two pieces, one for each integral, minus the empty bottom-left rectangle $[0,0]\\times[0,1]$ (area $0$)."
  },
  "refine-integrals-029": {
    "spot": "The inner $\\int e^{\\cos x}dx$ cannot be done, and the outer limit $\\arcsin y$ hints that the region is $0\\le y\\le\\sin x$: after reversing the order the inner integral produces $\\sin x$, which is the derivative of $\\cos x$ (up to sign).",
    "why": "In the original order you are stuck on an antiderivative of $e^{\\cos x}$; switching so $y$ is integrated first produces $\\sin x$, which fits the substitution $u=\\cos x$ perfectly.",
    "steps": [
      "Region: $0\\le y\\le1$, $\\arcsin y\\le x\\le\\frac{\\pi}{2}$, equivalent to $0\\le x\\le\\frac{\\pi}{2}$, $0\\le y\\le\\sin x$.",
      "Switch the order: $\\int_0^{\\pi/2}\\int_0^{\\sin x}e^{\\cos x}\\,dy\\,dx=\\int_0^{\\pi/2}\\sin x\\,e^{\\cos x}\\,dx$.",
      "$=\\Big[-e^{\\cos x}\\Big]_0^{\\pi/2}=-1+e=e-1$."
    ],
    "trap": "Writing the upper limit for $y$ as $\\cos x$ when switching, so the inner result is $\\cos x\\,e^{\\cos x}$, which still cannot be integrated.",
    "check": "The region has area $\\int_0^{\\pi/2}\\sin x\\,dx=1$ and $e^{\\cos x}$ lies between $1$ and $e$, so the answer must be between $1$ and $e$; $e-1\\approx1.718$."
  },
  "refine-series-003": {
    "spot": "$\\frac{(-1)^n\\sin n}{n}$ is $\\mathrm{Im}\\frac{(-e^{i})^n}{n}$: the imaginary part of the log series $\\ln(1+z)$, or apply the Fourier series $\\sum\\frac{(-1)^{n+1}\\sin n\\theta}{n}=\\frac{\\theta}{2}$ (for $|\\theta|<\\pi$) at $\\theta=1$.",
    "why": "Adding up a conditionally convergent trigonometric series converges very slowly; view it as the power series $\\sum\\frac{(-1)^n\\sin n}{n}x^n=-\\arctan\\frac{x\\sin1}{1+x\\cos1}$, let $x\\to1$, and the answer drops out in one line.",
    "steps": [
      "$\\sum_{n\\ge1}\\frac{(-xe^{i})^n}{n}=-\\ln(1+xe^{i})$; take the imaginary part: $\\sum\\frac{(-1)^n\\sin n}{n}x^n=-\\arg(1+xe^{i})=-\\arctan\\frac{x\\sin1}{1+x\\cos1}$.",
      "The original series converges (Dirichlet's test), so Abel's theorem lets $x\\to1^-$: $-\\arctan\\frac{\\sin1}{1+\\cos1}$.",
      "Half-angle formula: $\\frac{\\sin1}{1+\\cos1}=\\tan\\frac12$, so the sum is $-\\frac12$."
    ],
    "trap": "Plugging $\\theta=1$ straight into $\\sum\\frac{\\sin n\\theta}{n}=\\frac{\\pi-\\theta}{2}$ and forgetting the $(-1)^n$ gives $\\frac{\\pi-1}{2}$; the alternating sign amounts to replacing $\\theta$ with $\\theta+\\pi$.",
    "check": "Use $\\sum\\frac{\\sin n\\theta}{n}=\\frac{\\pi-\\theta}{2}$ at $\\theta=1+\\pi$ (since $(-1)^n\\sin n=\\sin n(1+\\pi)$): $\\frac{\\pi-1-\\pi}{2}=-\\frac12$."
  },
  "refine-series-010": {
    "spot": "$(\\ln n)^{\\ln\\ln n}=e^{(\\ln\\ln n)^2}$ while $\\frac1n=e^{-\\ln n}$: compare the exponents $(\\ln\\ln n)^2$ and $\\ln n$ — with $u=\\ln n$, that is comparing $(\\ln u)^2$ with $u$.",
    "why": "The Ratio and Root Tests both fail for terms that are \"slower than any polynomial\" like this; rewriting as $e^{\\cdots}$ and comparing exponents settles it against the harmonic series.",
    "steps": [
      "Rewrite: $\\frac{1}{(\\ln n)^{\\ln\\ln n}}=e^{-(\\ln\\ln n)^2}$.",
      "$\\frac{(\\ln u)^2}{u}$ has maximum $\\frac{4}{e^2}<1$ at $u=e^2$, so $(\\ln u)^2<u$ for all $u>0$.",
      "Take $u=\\ln n$: $(\\ln\\ln n)^2<\\ln n$, so $e^{-(\\ln\\ln n)^2}>e^{-\\ln n}=\\frac1n$.",
      "Every term is larger than the corresponding term of the harmonic series, and $\\sum\\frac1n$ diverges, so the original series diverges."
    ],
    "trap": "Seeing that the exponent $\\ln\\ln n\\to\\infty$ in the denominator, assuming it beats every $n^p$, and concluding convergence; in fact $(\\ln n)^{\\ln\\ln n}$ is much smaller than $n$, because the exponent grows too slowly.",
    "check": "$n=10^6$: $(\\ln n)^{\\ln\\ln n}\\approx e^{6.9}\\approx10^3$, far less than $n=10^6$, so the term is much larger than $\\frac1n$."
  }
};
