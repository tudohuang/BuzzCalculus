// Detail v2, English — batch 043. Translation of tools/content/detail/043.js (text only; claims live in the Chinese file).
module.exports = {
  "lec-15-q4c": {
    "spot": "The problem already gives you the expansion: $K-\\frac12mv^2$ is just the extra term $\\frac38\\frac{mv^4}{c^2}$. Dividing, $m$ cancels and only $\\left(\\frac{v}{c}\\right)^2$ is left, with $\\frac{v}{c}=0.1$.",
    "why": "A relative difference is a ratio, so simplify to an expression in $\\frac{v}{c}$ alone before plugging in numbers — much cleaner than carrying values of $m$ and $c$ through.",
    "steps": [
      "Let $u=\\frac{v}{c}$. The extra term divided by the classical kinetic energy: $\\dfrac{\\frac38 mv^4/c^2}{\\frac12mv^2}=\\frac34\\cdot\\frac{v^2}{c^2}=\\frac34u^2$ (check the algebra with $m=c=1$).",
      "Where the expansion comes from: $(1-u^2)^{-1/2}=1+\\frac12u^2+\\frac38u^4+\\frac{5}{16}u^6+\\cdots$; subtract $1$ and multiply by $mc^2$ to get the problem's two terms.",
      "Plug in $u=0.1$: $\\frac34\\times0.01=0.0075$, i.e. the relativistic correction is about $0.75\\%$."
    ],
    "trap": "Plugging $\\frac{v}{c}=0.1$ straight into $\\frac34\\cdot\\frac{v}{c}$ (forgetting the square) and getting $0.075$ — ten times too big.",
    "check": "Using the exact $K$: the relative difference is about $0.00756$, slightly more than $0.0075$, and the gap is exactly the next term $\\frac58u^4$."
  },
  "lec-16-m2": {
    "spot": "The area of the parallelogram spanned by two 3D vectors is the length of the cross product $\\mathbf a\\times\\mathbf b$; with $\\mathbf a=(1,2,0)$, $\\mathbf b=(0,1,3)$, just expand the determinant.",
    "why": "The cross product's length $|\\mathbf a||\\mathbf b|\\sin\\theta$ is exactly base times height, so there's no need to find the angle first.",
    "steps": [
      "First component: $a_2b_3-a_3b_2=2\\cdot3-0\\cdot1=6$.",
      "Second component: $a_3b_1-a_1b_3=0\\cdot0-1\\cdot3=-3$; third component: $a_1b_2-a_2b_1=1\\cdot1-2\\cdot0=1$.",
      "$\\mathbf a\\times\\mathbf b=(6,-3,1)$, length $\\sqrt{36+9+1}=\\sqrt{46}$."
    ],
    "trap": "Mixing it up with a triangle's area and multiplying by $\\frac12$ to get $\\frac{\\sqrt{46}}{2}$; for a parallelogram you don't divide by $2$.",
    "check": "Using $|\\mathbf a|^2|\\mathbf b|^2-(\\mathbf a\\cdot\\mathbf b)^2=5\\cdot10-2^2=46$, the square root is again $\\sqrt{46}$."
  },
  "lec-16-m3": {
    "spot": "The three points lie exactly on the three coordinate axes: $x$-intercept $1$, $y$-intercept $2$, $z$-intercept $3$, so write the intercept form $\\frac{x}{1}+\\frac{y}{2}+\\frac{z}{3}=1$ directly.",
    "why": "The intercept form takes one line; a cross product of two vectors for the normal also works, but costs an extra 3-by-3 determinant.",
    "steps": [
      "Intercept form: $\\frac{x}{1}+\\frac{y}{2}+\\frac{z}{3}=1$.",
      "Multiply both sides by $6$ (the least common multiple of the denominators): $6x+3y+2z=6$.",
      "Check the three points: $(1,0,0)$ gives $6$, $(0,2,0)$ gives $6$, $(0,0,3)$ gives $6$, so the plane is $6x+3y+2z=6$."
    ],
    "trap": "Using the intercepts as coefficients and writing $x+2y+3z=1$; plugging in $(0,2,0)$ gives $4\\ne1$, so one check exposes it.",
    "check": "The normal $(6,3,2)$ must be perpendicular to the in-plane vector $(-1,2,0)$ (from the first point to the second)."
  },
  "lec-16-m4": {
    "spot": "Numerator $xy$ and denominator $x^2+y^2$ are both homogeneous of degree two: along a line $y=mx$, the $x^2$ cancels completely, leaving a number that depends only on $m$ — different directions give different values.",
    "why": "To show a limit doesn't exist, you only need two paths giving different values; for a homogeneous expression, substituting along lines shows it immediately.",
    "steps": [
      "Along $y=mx$: $\\frac{x\\cdot mx}{x^2+m^2x^2}=\\frac{m}{1+m^2}$, independent of $x$.",
      "$m=0$ (along the $x$-axis) gives $0$; $m=1$ (along $y=x$) gives $\\frac12$.",
      "The two paths approach $(0,0)$ with different values, so the limit does not exist."
    ],
    "trap": "Checking only along the $x$-axis and the $y$-axis, getting $0$ both times, and declaring the limit $0$; one or two paths can't speak for every direction.",
    "check": "In polar coordinates: $\\frac{xy}{x^2+y^2}=\\sin\\theta\\cos\\theta=\\frac12\\sin2\\theta$, with no $r$ at all — it varies only with direction."
  },
  "lec-16-m5": {
    "spot": "$f=x^2y^3$ is a monomial: $f_{xy}$ means differentiate in $x$ first (treating $y^3$ as a constant), then in $y$ (treating $x$ as a constant).",
    "why": "Each partial derivative of a monomial changes just one exponent, so two steps finish it; reversing the order gives the same result (Clairaut's theorem), which you can use as a check.",
    "steps": [
      "First in $x$: $f_x=2xy^3$.",
      "Then in $y$: $f_{xy}=\\frac{\\partial}{\\partial y}(2xy^3)=6xy^2$.",
      "So $f_{xy}=6xy^2$."
    ],
    "trap": "Differentiating in $y$ both times and getting $f_{yy}=6x^2y$; $f_{xy}$ means once in $x$ and once in $y$.",
    "check": "Reverse the order, $y$ first: $f_y=3x^2y^2$, then in $x$ gives $6xy^2$ — the same."
  },
  "lec-16-q1b": {
    "spot": "The line's direction $(2,-1,2)$ is exactly the normal of the plane $2x-y+2z=5$; to find the intersection, substitute the parametric equations into the plane to get a linear equation in $t$.",
    "why": "Substituting the parametrization turns a 3D problem into one linear equation in one unknown — faster than solving a system.",
    "steps": [
      "Substitute: $2(1+2t)-(2-t)+2(3+2t)=9t+6$.",
      "Set it equal to $5$: $9t+6=5$.",
      "So $t=\\frac{5-6}{9}=-\\frac19$."
    ],
    "trap": "Getting the sign of the $6$ wrong when moving it across and solving $t=\\frac19$; that point gives $7$ in the plane equation, not $5$.",
    "check": "$|t|$ times the normal's length $3$ should equal the distance from the point to the plane, $\\frac{|2-2+6-5|}{3}=\\frac13$."
  },
  "lec-16-q1c": {
    "spot": "The plane must contain the whole line $L$ and a point $Q$ off $L$: the direction $(1,1,2)$ of $L$ and the vector from a point $(1,0,-1)$ on $L$ to $Q$ both lie in the plane, so their cross product is the normal.",
    "why": "With two non-parallel vectors in the plane, the cross product gives the normal directly; then write the equation through a point.",
    "steps": [
      "Take $A=(1,0,-1)$ on $L$; $\\overrightarrow{AQ}=(0,2,4)$.",
      "Normal $(1,1,2)\\times(0,2,4)=(1\\cdot4-2\\cdot2,\\ 2\\cdot0-1\\cdot4,\\ 1\\cdot2-1\\cdot0)=(0,-4,2)$, which reduces to $(0,2,-1)$.",
      "Through $A$: $2(y-0)-(z+1)=0$, i.e. $2y-z=1$.",
      "Check: $Q$ gives $2\\cdot2-3=1$; any point $(1+s,s,-1+2s)$ on $L$ gives $2s-(-1+2s)=1$, so the whole line lies on it. The plane is $2y-z=1$."
    ],
    "trap": "Crossing $Q$'s position vector $(1,2,3)$ directly with the direction $(1,1,2)$, getting the normal $(-1,-1,1)$ and the plane $-x-y+z=0$; but $A=(1,0,-1)$ gives $-2$ there, so the line isn't even on it. A position vector is not a vector in the plane — subtract two points.",
    "check": "The normal $(0,2,-1)$ is perpendicular to the line's direction $(1,1,2)$ and also to $\\overrightarrow{AQ}=(0,2,4)$."
  },
  "lec-16-q1d": {
    "spot": "The angle between two planes is the angle between their normals: $\\mathbf n_1=(2,-1,2)$, $\\mathbf n_2=(0,2,-1)$ (the second plane has no $x$, so its first component is $0$); for the acute angle, take the absolute value of the dot product.",
    "why": "A plane's orientation is completely determined by its normal, so one dot-product formula does it.",
    "steps": [
      "Dot product $\\mathbf n_1\\cdot\\mathbf n_2=2\\cdot0+(-1)\\cdot2+2\\cdot(-1)=-4$.",
      "Lengths $|\\mathbf n_1|=\\sqrt{4+1+4}=3$, $|\\mathbf n_2|=\\sqrt{0+4+1}=\\sqrt5$.",
      "Acute angle, with absolute value: $\\cos\\theta=\\frac{|-4|}{3\\sqrt5}=\\frac{4\\sqrt5}{15}$."
    ],
    "trap": "Writing the normal of $2y-z=1$ as $(2,-1,0)$ (shifting the coefficients forward), so the dot product becomes $5$ and you get $\\frac{\\sqrt5}{3}$; the missing term is $x$, so the normal is $(0,2,-1)$. Another common mistake is skipping the absolute value and answering a negative number.",
    "check": "$\\frac{4\\sqrt5}{15}\\approx0.596$ lies between $0$ and $1$, an angle of about $53^\\circ$ — indeed acute."
  },
  "lec-16-q2a": {
    "spot": "The numerator $x^2y$ is cubic and the denominator $x^2+y^2$ is quadratic: one degree higher, so in polar coordinates an extra $r$ appears and pushes everything to $0$.",
    "why": "Plugging in along paths can only prove a limit does not exist; to prove the limit equals $0$, use polar coordinates or the Squeeze Theorem to control all directions at once.",
    "steps": [
      "Let $x=r\\cos\\theta$, $y=r\\sin\\theta$: $\\frac{x^2y}{x^2+y^2}=\\frac{r^3\\cos^2\\theta\\sin\\theta}{r^2}=r\\cos^2\\theta\\sin\\theta$.",
      "$|\\cos^2\\theta\\sin\\theta|\\le1$, so $\\left|\\frac{x^2y}{x^2+y^2}\\right|\\le r$ — bounded by $r$ in every direction.",
      "As $r\\to0$ the bound tends to $0$, so by the Squeeze Theorem the limit is $0$."
    ],
    "trap": "Concluding from the values along $y=mx$ all being $0$; all straight-line paths agreeing doesn't guarantee the limit exists (here it happens to be $0$, but the reason has to come from squeezing).",
    "check": "Even along the parabola $y=x^2$ it tends to $0$: $\\frac{x^4}{x^2+x^4}=\\frac{x^2}{1+x^2}\\to0$."
  },
  "lec-16-q2c": {
    "spot": "$f$ is defined piecewise at the origin, so the formula can't be used at $(0,0)$; \"by definition\" means look at $\\frac{f(h,0)-f(0,0)}{h}$, and on the $x$-axis $f(h,0)=0$.",
    "why": "The partial derivative at the origin only uses values on the $x$-axis, so the definition finishes it in one line; plugging $(0,0)$ into the general-point formula gives $\\frac00$, which is meaningless.",
    "steps": [
      "On the $x$-axis ($y=0$, $x\\ne0$): $f(x,0)=\\frac{x\\cdot0}{x^2}=0$.",
      "Definition: $f_x(0,0)=\\lim_{h\\to0}\\frac{f(h,0)-f(0,0)}{h}=\\lim_{h\\to0}\\frac{0-0}{h}$.",
      "The numerator is always $0$, so $f_x(0,0)=0$."
    ],
    "trap": "Computing $f_x=\\frac{y^3-x^2y}{(x^2+y^2)^2}$ at a general point, plugging in $(0,0)$, getting $\\frac00$ and saying it doesn't exist; or thinking that since $f$ is discontinuous at the origin, the partial derivative can't exist.",
    "check": "Partial derivatives existing doesn't imply continuity: along $y=x$, $f\\equiv\\frac12$, so $f$ is discontinuous at the origin, yet $f_x(0,0)$ is still $0$."
  },
  "lec-16-q3b": {
    "spot": "$g=\\sqrt{9-x^2-y^2}$ depends only on $r^2=x^2+y^2$: the domain is $r\\le3$, and as $r$ goes from $0$ to $3$, the quantity under the root drops from $9$ to $0$.",
    "why": "Collapsing two variables into one $r$, the range is just the range of a continuous decreasing function on $[0,3]$ — look at the two endpoints.",
    "steps": [
      "The radicand must be $\\ge0$: $x^2+y^2\\le9$, i.e. $0\\le r\\le3$, where $g=\\sqrt{9-r^2}$.",
      "$\\sqrt{9-r^2}$ is decreasing in $r$.",
      "Endpoints: $r=0$ (the origin) gives $3$, $r=3$ (the circle) gives $0$.",
      "A continuous function maps $[0,3]$ onto every value between its endpoint values, so the range is $[0,3]$."
    ],
    "trap": "Answering with the range $[0,9]$ of the radicand $9-x^2-y^2$ and forgetting the square root; or writing $[-3,3]$, even though a square root is never negative.",
    "check": "Geometrically, $z=g(x,y)$ is the upper hemisphere of radius $3$, with heights from $0$ to $3$."
  },
  "lec-16-q4b": {
    "spot": "$f=x^3y+e^{xy^2}$: the first term is a monomial, the second a composite exponential; after differentiating in $x$, $y^2e^{xy^2}$ is a product of two functions of $y$, so differentiating in $y$ needs the Product Rule.",
    "why": "Differentiating in $x$ first is easier ($e^{xy^2}$ only brings out $y^2$ in $x$), then in $y$; the reverse order also works, but the first step carries an extra factor $2xy$.",
    "steps": [
      "In $x$: $f_x=3x^2y+y^2e^{xy^2}$.",
      "First term in $y$: $\\frac{\\partial}{\\partial y}(3x^2y)=3x^2$.",
      "Second term by the Product Rule: $\\frac{\\partial}{\\partial y}\\left(y^2e^{xy^2}\\right)=2ye^{xy^2}+y^2\\cdot2xy\\,e^{xy^2}$.",
      "Together: $f_{xy}=3x^2+2ye^{xy^2}+2xy^3e^{xy^2}$."
    ],
    "trap": "Differentiating $y^2e^{xy^2}$ by touching only the $y^2$ or only the exponential, dropping the other Product Rule term — missing $2xy^3e^{xy^2}$ or $2ye^{xy^2}$.",
    "check": "Reverse the order: $f_y=x^3+2xye^{xy^2}$, then differentiate in $x$ — same result (Clairaut's theorem)."
  },
  "lec-17-m1": {
    "spot": "$(3.03,3.96)$ is very close to $(3,4)$, and $(3,4)$ is a $3$-$4$-$5$ right triangle, so $f(3,4)=5$ and the partial derivatives $\\frac35$, $\\frac45$ are all nice numbers.",
    "why": "Linear approximation needs only one function value and two partial derivatives — no need to take the square root of $3.03^2+3.96^2$.",
    "steps": [
      "$f(3,4)=\\sqrt{9+16}=5$.",
      "$f_x=\\frac{x}{\\sqrt{x^2+y^2}}$, $f_y=\\frac{y}{\\sqrt{x^2+y^2}}$; at $(3,4)$ they are $\\frac35$, $\\frac45$.",
      "$\\Delta x=0.03$, $\\Delta y=-0.04$: $L=5+\\frac35(0.03)+\\frac45(-0.04)=5+0.018-0.032=4.986$."
    ],
    "trap": "Taking $\\Delta y$ as $+0.04$ ($3.96$ is less than $4$) and getting $5+0.018+0.032=5.050$.",
    "check": "The true value $\\sqrt{3.03^2+3.96^2}\\approx4.9863$ is larger than the approximation by less than $0.001$."
  },
  "lec-17-m2": {
    "spot": "\"Maximum directional derivative\" = the length of the gradient: the gradient $(2x,2y)$ of $f=x^2+y^2$ is $(2,4)$ at $(1,2)$.",
    "why": "$D_{\\mathbf u}f=|\\nabla f|\\cos\\theta$ is largest at $\\theta=0$, where it equals $|\\nabla f|$ — no need to maximize over all directions.",
    "steps": [
      "$\\nabla f=(2x,2y)$, which is $(2,4)$ at $(1,2)$.",
      "$D_{\\mathbf u}f=\\nabla f\\cdot\\mathbf u=|\\nabla f|\\cos\\theta\\le|\\nabla f|$.",
      "Maximum value $|(2,4)|=\\sqrt{20}=2\\sqrt5$."
    ],
    "trap": "Adding the two gradient components to get $6$, or answering $|\\nabla f|^2=20$.",
    "check": "Along $\\mathbf u=\\frac{(1,2)}{\\sqrt5}$: $\\frac{2+8}{\\sqrt5}=2\\sqrt5$; along $(1,0)$ it is only $2$, smaller."
  },
  "lec-17-m3": {
    "spot": "$x^3+y^3=6xy$ can't be solved for $y$: write it as $F(x,y)=x^3+y^3-6xy=0$ and use $\\frac{dy}{dx}=-\\frac{F_x}{F_y}$.",
    "why": "The implicit function formula handles the $y$ on both sides at once, so you don't have to remember to attach $y'$ to every term and then rearrange.",
    "steps": [
      "$F_x=3x^2-6y$.",
      "$F_y=3y^2-6x$ (differentiating $6xy$ in $y$ gives $6x$).",
      "$\\frac{dy}{dx}=-\\frac{3x^2-6y}{3y^2-6x}=\\frac{2y-x^2}{y^2-2x}$."
    ],
    "trap": "Forgetting that $6xy$ must also be differentiated in $y$, writing $F_y$ as $3y^2$, and getting a wrong expression like $-\\frac{x^2}{y^2}$.",
    "check": "$(3,3)$ is on the curve ($27+27=54=6\\cdot9$), and the curve is symmetric about $y=x$, so the slope there should be $-1$."
  },
  "lec-17-m4": {
    "spot": "All four options are about $D_{\\mathbf u}f(P)=\\nabla f\\cdot\\mathbf u=|\\nabla f|\\cos\\theta$: whenever $\\theta>90^\\circ$, $\\cos\\theta<0$ and the directional derivative is negative.",
    "why": "Writing the directional derivative as gradient length times the cosine of the angle settles all four statements at a glance — no need for an example for each.",
    "steps": [
      "$D_{\\mathbf u}f=|\\nabla f|\\cos\\theta$. Example: $f=x+2y$, $\\nabla f=(1,2)$.",
      "Along $\\mathbf u=-\\frac{(1,2)}{\\sqrt5}$: $D_{\\mathbf u}f=-\\sqrt5<0$. This is exactly \"steepest descent along $-\\nabla f$\".",
      "Along the perpendicular direction $\\frac{(2,-1)}{\\sqrt5}$: $D_{\\mathbf u}f=0$, i.e. the gradient is perpendicular to the level curve.",
      "So the false statement is \"for every unit vector $\\mathbf u$, $D_{\\mathbf u}f(P)\\ge0$\"."
    ],
    "trap": "Misreading \"the gradient direction is the steepest ascent\" as \"every direction is ascending\"; in fact half of the directions (those making an angle greater than $90^\\circ$ with the gradient) are descending.",
    "check": "Over all directions, the directional derivative ranges over $[-|\\nabla f|,\\,|\\nabla f|]$, with endpoints that are negatives of each other."
  },
  "lec-17-m5": {
    "spot": "$z$ depends on $r$ indirectly through $x$ and $y$: Chain Rule $z_r=f_xx_r+f_yy_r$, where differentiating $x=r\\cos\\theta$ in $r$ gives $\\cos\\theta$ and differentiating $y=r\\sin\\theta$ in $r$ gives $\\sin\\theta$.",
    "why": "In the tree diagram, each of the two paths contributes one product of partial derivatives — you don't need the specific formula for $f$.",
    "steps": [
      "$x_r=\\cos\\theta$, $y_r=\\sin\\theta$ (treating $\\theta$ as a constant).",
      "Chain Rule: $z_r=f_x\\cos\\theta+f_y\\sin\\theta$.",
      "Verify with $f=x^2y$: plugging $f_x=2xy$, $f_y=x^2$ into the formula matches differentiating directly in $r$. So $\\frac{\\partial z}{\\partial r}=f_x\\cos\\theta+f_y\\sin\\theta$."
    ],
    "trap": "Taking the result for $\\theta$, $-f_xr\\sin\\theta+f_yr\\cos\\theta$, as the one for $r$; the difference is which variable $x$ and $y$ are differentiated with respect to.",
    "check": "The $r$ direction is the outward unit vector $(\\cos\\theta,\\sin\\theta)$, so $z_r$ is just the directional derivative $\\nabla f\\cdot(\\cos\\theta,\\sin\\theta)$ in that direction."
  },
  "lec-17-q1a": {
    "spot": "The surface is in the form $z=f(x,y)$: the tangent plane is $z=f(1,1)+f_x(1,1)(x-1)+f_y(1,1)(y-1)$, needing only two partial derivatives.",
    "why": "For an explicit surface, apply the linearization formula directly — one step fewer than rewriting as $F(x,y,z)=0$ and taking a gradient.",
    "steps": [
      "$f_x=2x+y$, which is $3$ at $(1,1)$.",
      "$f_y=x+4y$, which is $5$ at $(1,1)$.",
      "$z=4+3(x-1)+5(y-1)=3x+5y-4$.",
      "Rearrange: the tangent plane is $3x+5y-z=4$."
    ],
    "trap": "Flipping the sign of $z$ when rearranging and writing $3x+5y+z=12$; it does hold at $(1,1,4)$, but the normal $(3,5,1)$ has its $z$-component in the wrong direction.",
    "check": "Surface minus tangent plane leaves the purely quadratic $(x-1)^2+(x-1)(y-1)+2(y-1)^2$, so near $(1,1)$ they differ only by second-order small quantities."
  },
  "lec-17-q1b": {
    "spot": "You want to estimate $f(1.1,0.95)$, and $(1.1,0.95)$ is right next to the known point $(1,1)$; the tangent plane $z=4+3(x-1)+5(y-1)$ is already in hand.",
    "why": "Linear approximation just needs the two small increments plugged in — the first-order estimate the problem asks for.",
    "steps": [
      "Partial derivatives: $f_x(1,1)=3$, $f_y(1,1)=5$.",
      "Increments $\\Delta x=0.1$, $\\Delta y=-0.05$.",
      "$L=4+3(0.1)+5(-0.05)=4+0.3-0.25=4.05$."
    ],
    "trap": "Taking $\\Delta y$ as $+0.05$ and getting $4+0.3+0.25=4.55$.",
    "check": "The true value $f(1.1,0.95)=4.06$; the gap of $0.01$ is exactly the quadratic part $(0.1)^2+(0.1)(-0.05)+2(0.05)^2$."
  },
  "lec-17-q1c": {
    "spot": "\"Maximum error\" calls for the total differential: $dV=V_r\\,dr+V_h\\,dh$, with both errors taken with the same sign (absolute values added) for the worst case.",
    "why": "The total differential linearizes the effect of small errors — faster than computing $\\pi(3.01)^2(10.02)-90\\pi$ directly, and it shows each quantity's contribution.",
    "steps": [
      "$V_r=2\\pi rh$, $V_h=\\pi r^2$ (checked with $x=r$, $y=h$).",
      "At $r=3$, $h=10$: $V_r=60\\pi$, $V_h=9\\pi$.",
      "$|dV|\\le60\\pi(0.01)+9\\pi(0.02)=0.6\\pi+0.18\\pi=0.78\\pi$."
    ],
    "trap": "Assuming the larger error in $h$ matters more, or letting the two errors cancel (subtracting gives $0.42\\pi$); the maximum error adds both terms with the same sign.",
    "check": "Directly compute the volume change with both measurements too large: $\\pi(3.01)^2(10.02)-90\\pi\\approx0.782\\pi$, differing from $0.78\\pi$ only by second-order terms."
  },
  "lec-17-q2a": {
    "spot": "$z$ depends on $s$ through $x=st$ and $y=s+t$: Chain Rule $z_s=z_xx_s+z_yy_s$, with $x_s=t$ and $y_s=1$; $s=1,t=2$ corresponds to $x=2,y=3$.",
    "why": "The Chain Rule only needs numbers at one point — less work than expanding $z$ as a polynomial in $s,t$ and then differentiating.",
    "steps": [
      "$z_x=2xy$, $z_y=x^2+3y^2$.",
      "$s=1,t=2$: $x=2$, $y=3$; $x_s=t=2$, $y_s=1$.",
      "$z_x=2\\cdot2\\cdot3=12$, $z_y=4+27=31$.",
      "$z_s=12\\cdot2+31\\cdot1=55$."
    ],
    "trap": "Forgetting $x_s=t$ and treating the partial of $x=st$ in $s$ as $1$, getting $12+31=43$.",
    "check": "Substituting directly into $z=(st)^2(s+t)+(s+t)^3$ and differentiating in $s$ also gives $55$ at $(1,2)$ (with $u$ in place of $s$)."
  },
  "lec-17-q2b": {
    "spot": "$z$ is defined implicitly by $F(x,y,z)=x^2+y^2+z^2+xyz-4=0$: $z_x=-\\frac{F_x}{F_z}$, evaluated at $(1,1,1)$.",
    "why": "The implicit function formula avoids solving for $z$ (here that means a quadratic); just divide two partial derivatives.",
    "steps": [
      "$F_x=2x+yz$, which is $3$ at $(1,1,1)$.",
      "$F_z=2z+xy$, which is $3$ at $(1,1,1)$.",
      "$z_x=-\\frac{3}{3}=-1$."
    ],
    "trap": "Dropping the minus sign in the formula and answering $1$. Way to remember it: $F$ stays fixed, so whatever $x$ adds, $z$ has to take back.",
    "check": "Fix $y=1$ and push $x$ to $1.01$; solving the quadratic gives $z\\approx0.98997$, a difference quotient of about $-1.003$."
  },
  "lec-17-q3a": {
    "spot": "Each term of $T=100-x^2-2y^2$ involves only one variable: $T_x=-2x$, $T_y=-4y$; plug in $(2,1)$.",
    "why": "The gradient is just the two partial derivatives arranged as a vector — differentiate each once.",
    "steps": [
      "$T_x=-2x$, which is $-4$ at $(2,1)$.",
      "$T_y=-4y$, which is $-4$ at $(2,1)$.",
      "So $\\nabla T(2,1)=(-4,-4)$."
    ],
    "trap": "Forgetting the coefficient $2$ in $2y^2$, computing $T_y$ as $-2y$ and getting $(-4,-2)$; or dropping the minus signs and getting $(4,4)$.",
    "check": "The gradient must be perpendicular to the isotherm $x^2+2y^2=6$ through $(2,1)$; the isotherm's slope is $-\\frac{x}{2y}=-1$, direction $(1,-1)$, whose dot product with $(-4,-4)$ is $0$."
  },
  "lec-17-q3c": {
    "spot": "\"The rate of increase in the direction of fastest increase\" is the gradient's length: $\\nabla T(2,1)=(-4,-4)$.",
    "why": "The directional derivative $|\\nabla T|\\cos\\theta$ is largest in the gradient direction, where its value is $|\\nabla T|$ — no need to set up a direction and optimize.",
    "steps": [
      "$\\nabla T=(-2x,-4y)$, which is $(-4,-4)$ at $(2,1)$.",
      "Maximum rate of increase $|\\nabla T|=\\sqrt{16+16}=4\\sqrt2$.",
      "Moving $s$ units along the unit direction $\\frac{(-1,-1)}{\\sqrt2}$: the rate of change of $T(2-\\frac{s}{\\sqrt2},1-\\frac{s}{\\sqrt2})$ at $s=0$ is exactly $4\\sqrt2$."
    ],
    "trap": "Answering with the gradient vector $(-4,-4)$ itself, or adding the components to get $8$; the question asks for a number — the gradient's length.",
    "check": "The direction $(-1,-1)$ points toward the origin, which is the hottest spot ($T=100$) — makes sense."
  },
  "lec-17-q4a": {
    "spot": "The surface is the level surface $F(x,y,z)=x^2+2y^2+3z^2=6$: the gradient $\\nabla F=(2x,4y,6z)$ is the normal, which is $(2,4,6)$ at $(1,1,1)$.",
    "why": "The gradient is perpendicular to a level surface, giving the normal in one step — no need to solve for $z$ as a function of $x,y$.",
    "steps": [
      "$\\nabla F(1,1,1)=(2,4,6)\\parallel(1,2,3)$.",
      "Tangent plane $(x-1)+2(y-1)+3(z-1)=0$.",
      "Simplify: $x+2y+3z=6$."
    ],
    "trap": "Getting the normal $(2,4,6)$ right but copying the surface's constant $6$, writing $2x+4y+6z=6$; plugging in $(1,1,1)$ gives $12\\ne6$ — the point of tangency isn't even on it.",
    "check": "The point of tangency $(1,1,1)$ is on the ellipsoid: $1+2+3=6$."
  },
  "lec-17-q4c": {
    "spot": "The tangent plane is parallel to $x+y+z=0$ ⇔ the normal $\\nabla F=(2x,4y,6z)$ is parallel to $(1,1,1)$: set $(2x,4y,6z)=\\lambda(1,1,1)$, express all three coordinates in terms of $\\lambda$, and substitute into the ellipsoid.",
    "why": "The parallel condition reduces three unknowns to one parameter $\\lambda$, and substituting into the surface equation solves it in one go.",
    "steps": [
      "$x=\\frac{\\lambda}{2}$, $y=\\frac{\\lambda}{4}$, $z=\\frac{\\lambda}{6}$.",
      "Substitute into $x^2+2y^2+3z^2=6$: $\\lambda^2\\left(\\frac14+\\frac{2}{16}+\\frac{3}{36}\\right)=\\frac{11}{24}\\lambda^2=6$.",
      "$\\lambda^2=\\frac{144}{11}$; for $x>0$ take $\\lambda=\\frac{12}{\\sqrt{11}}$.",
      "$x=\\frac{\\lambda}{2}=\\frac{6}{\\sqrt{11}}$."
    ],
    "trap": "Using the normal's proportions as the point's proportions, setting $x=y=z$ and getting $(1,1,1)$; but the normal there is $(2,4,6)$, not parallel to $(1,1,1)$.",
    "check": "The point $\\frac{(6,3,2)}{\\sqrt{11}}$ is on the ellipsoid: $\\frac{36+18+12}{11}=6$; the normal $\\frac{(12,12,12)}{\\sqrt{11}}$ is indeed parallel to $(1,1,1)$."
  },
  "lec-18-m1": {
    "spot": "In $f=x^2+y^2-2x+4y$ the $x$ and $y$ parts are completely separate and both quadratic: each partial derivative gives one linear equation.",
    "why": "A critical point is where the gradient is zero, so solve the two linear equations directly; completing the square also shows the vertex at a glance.",
    "steps": [
      "$f_x=2x-2=0\\Rightarrow x=1$.",
      "$f_y=2y+4=0\\Rightarrow y=-2$.",
      "The critical point is $(1,-2)$."
    ],
    "trap": "Flipping the sign when solving $2y+4=0$ and getting $(1,2)$ or $(-1,2)$.",
    "check": "Completing the square: $f=(x-1)^2+(y+2)^2-5$, whose vertex is exactly $(1,-2)$ — and it's a minimum."
  },
  "lec-18-m3": {
    "spot": "All second partial derivatives of $x^4\\pm y^4$ are all $0$ at the origin, so the discriminant $D=0$ gives no conclusion; you have to go back to the sign of the function itself near the origin.",
    "why": "When the second derivative test fails, comparing $f(x,y)$ with $f(0,0)$ directly is the most reliable approach.",
    "steps": [
      "$f_{xx}=12x^2$ is $0$ at the origin, and likewise every other second partial is $0$, so $D=0$.",
      "$f=x^4+y^4\\ge0=f(0,0)$: the origin is a local minimum.",
      "$g$ is $x^4>0$ along the $x$-axis and $-y^4<0$ along the $y$-axis: the origin is a saddle point.",
      "So the answer: $f$ has a local minimum and $g$ a saddle point — showing that the test can't decide when $D=0$."
    ],
    "trap": "Reading $D=0$ as \"not a critical point\" or \"must be a saddle\"; both first partials are $0$ at the origin, so it is a critical point — the test just gives no answer.",
    "check": "The origin really is a critical point of both: $4x^3$ and $\\mp4y^3$ are both $0$ there."
  },
  "lec-18-m4": {
    "spot": "The constraint $x+y=10$ is linear, so solve $y=10-x$ directly and $xy$ becomes the downward-opening one-variable parabola $x(10-x)$.",
    "why": "Substituting a linear constraint turns it into a one-variable extremum — one step fewer than setting up Lagrange multipliers; both methods give $x=y=5$.",
    "steps": [
      "Substitute: $f=x(10-x)$.",
      "Differentiate: $10-2x=0\\Rightarrow x=5$, $y=5$.",
      "Maximum $5\\cdot5=25$."
    ],
    "trap": "Forgetting the constraint and thinking bigger $x$ and $y$ are better, or plugging in $x=y=10$ to get $100$; at that point $x+y=20$, which violates the constraint.",
    "check": "Nearby points give less: at $x=4.9$, $4.9\\times5.1=24.99<25$."
  },
  "lec-18-m5": {
    "spot": "What guarantees absolute extrema is the Extreme Value Theorem: $f$ continuous and $D$ closed and bounded. Of the four options, only the closed disk $x^2+y^2\\le1$ is both bounded and closed.",
    "why": "Eliminating options against the two conditions of the Extreme Value Theorem is faster than hunting counterexamples for each region; the counterexamples just explain why the others fail.",
    "steps": [
      "The whole plane is unbounded: $f=x$ can be arbitrarily large, so there's no maximum.",
      "The open disk isn't closed: $f=x$ is always $<1$ inside, but gets arbitrarily close to $1$, so the maximum isn't attained.",
      "The first quadrant is unbounded: again $f=x$ has no maximum.",
      "The closed disk is bounded and closed, so a continuous function must attain its extrema (e.g. $f=x$ attains its maximum $1$ at $(1,0)$). So the answer: $D$ is the closed disk $x^2+y^2\\le1$."
    ],
    "trap": "Thinking bounded is enough and choosing the open disk; the open disk lacks its boundary, so a function can keep approaching a boundary value without attaining it.",
    "check": "On the closed disk, $f=x$ attains its maximum $1$ and minimum $-1$, both on the boundary."
  },
  "lec-18-q1a": {
    "spot": "$f_x=3x^2-3y$ and $f_y=3y^2-3x$ are a symmetric pair: the first gives $y=x^2$, and substituting into the second gives $x^4=x$.",
    "why": "Solve one equation for $y$ and substitute into the other, turning the system into a one-variable equation; guessing points easily misses solutions or adds fake ones.",
    "steps": [
      "$f_x=3x^2-3y$, $f_y=3y^2-3x$.",
      "$f_x=0\\Rightarrow y=x^2$; substitute into $f_y=0$: $x^4-x=0$.",
      "$x^4-x=x(x-1)(x^2+x+1)$, and $x^2+x+1>0$, so the only real roots are $x=0$, $x=1$.",
      "With $y=x^2$: the critical points are $(0,0)$ and $(1,1)$."
    ],
    "trap": "Noticing the symmetry of $y=x^2$ and $x=y^2$ and guessing $(-1,-1)$; but $f_x(-1,-1)=3+3=6\\ne0$.",
    "check": "The origin works too: $f_x(0,0)=f_y(0,0)=0$."
  },
  "lec-18-q1b": {
    "spot": "The critical points are known to be $(0,0)$ and $(1,1)$; the second derivatives $f_{xx}=6x$, $f_{yy}=6y$, $f_{xy}=-3$ are simple, so compute the discriminant $D=f_{xx}f_{yy}-f_{xy}^2$ once at each point.",
    "why": "The test gives one number per point, and its sign separates minima from saddle points directly.",
    "steps": [
      "$f_{xx}=6x$, $f_{yy}=6y$, $f_{xy}=-3$.",
      "$(0,0)$: $D=0\\cdot0-9=-9<0$ — saddle point.",
      "$(1,1)$: $D=36-9=27>0$ and $f_{xx}=6>0$ — local minimum.",
      "Minimum value $f(1,1)=1+1-3=-1$."
    ],
    "trap": "Taking the value $0$ at $(0,0)$ as the minimum value; at the origin $D<0$, so it's a saddle point, not an extremum.",
    "check": "Points near $(1,1)$ all give larger values: $f(1.1,1)\\approx-0.969$, $f(1,0.9)\\approx-0.971$."
  },
  "lec-18-q1c": {
    "spot": "$f$ contains $x^3$: along the $x$-axis $f(x,0)=x^3$, which decreases without bound in the negative direction, so there can't be an absolute minimum.",
    "why": "To refute \"absolute minimum\" you only need one point below $-1$; an odd-degree term that is unbounded in some direction is the most direct counterexample.",
    "steps": [
      "Along the $x$-axis: $f(x,0)=x^3$.",
      "For example, $f(-2,0)=-8<-1$.",
      "The more negative $x$ gets, the smaller $f$ gets — no lower bound. So $-1$ is only a local minimum, and the answer is: no."
    ],
    "trap": "Thinking the only local minimum must be the absolute minimum; for one variable on an interval that holds, but with two variables there's no such guarantee — here $f$ has no lower bound at all.",
    "check": "The value $-1$ at $(1,1)$ is smallest only nearby."
  },
  "lec-18-q2c": {
    "spot": "Absolute extrema on a closed rectangle: the candidates are interior critical points plus the extrema along each of the four edges. Restricted to each edge, $f=x^2-2xy+2y$ becomes a one-variable linear or quadratic expression.",
    "why": "On a closed bounded region the extrema are guaranteed to exist, and comparing all candidate values is the most reliable approach; looking only at interior critical points misses the boundary.",
    "steps": [
      "Interior: $f_x=2x-2y=0$, $f_y=-2x+2=0$, giving $(1,1)$ with $f=1$.",
      "Bottom edge $y=0$: $f=x^2$, maximum $9$ (at $x=3$). Right edge $x=3$: $f=9-4y$, maximum $9$ (at $y=0$).",
      "Top edge $y=2$: $f=(x-2)^2$, maximum $4$ (at $x=0$). Left edge $x=0$: $f=2y$, maximum $4$.",
      "Among the candidate values $1,9,4$ the largest is $9$, at the corner $(3,0)$."
    ],
    "trap": "Finding only the interior critical point, $f(1,1)=1$, and calling it the answer; it is actually neither the max nor the min — the maximum is at a corner of the boundary.",
    "check": "The minimum is $0$, attained at $(0,0)$ and $(2,2)$ — much less than $9$, no contradiction."
  },
  "lec-18-q3a": {
    "spot": "The objective $x^2+2y^2$ and the constraint $x^2+y^2=1$ both have only squared terms: the Lagrange equations $2x=2\\lambda x$, $4y=2\\lambda y$ force $x=0$ or $y=0$.",
    "why": "The Lagrange conditions shrink the candidates to four points on the axes; you can also verify by substituting $x^2=1-y^2$.",
    "steps": [
      "$\\nabla f=\\lambda\\nabla g$: $2x=2\\lambda x$, $4y=2\\lambda y$.",
      "$x(1-\\lambda)=0$, $y(2-\\lambda)=0$: with $\\lambda=1$, $y=0$, giving $(\\pm1,0)$; with $\\lambda=2$, $x=0$, giving $(0,\\pm1)$.",
      "Compare: $f(\\pm1,0)=1$, $f(0,\\pm1)=2$; the maximum is $2$."
    ],
    "trap": "Stopping after the $\\lambda=1$ case and answering $1$; that's the minimum.",
    "check": "Parametrize $x=\\cos t$, $y=\\sin t$: $f=1+\\sin^2t$, with range $[1,2]$."
  },
  "lec-18-q3b": {
    "spot": "This time it's the closed disk, not the circle: compare interior critical points with the boundary. And $x^2+2y^2\\ge0$, with equality $0$ at the origin.",
    "why": "A sum of squares obviously has lower bound $0$; doing Lagrange multipliers on the boundary alone misses the interior point at the origin.",
    "steps": [
      "Interior critical points: $f_x=2x=0$, $f_y=4y=0$ — only $(0,0)$, with $f=0$.",
      "On the boundary $x^2+y^2=1$, $f=1+\\sin^2t\\ge1$.",
      "The minimum is $\\min(0,1)=0$, attained at the origin."
    ],
    "trap": "Reusing the previous problem's Lagrange approach on the circle only and answering a minimum of $1$; the closed disk includes its interior, and the origin's $0$ is smaller.",
    "check": "A sum of squares can't be negative, so $0$ is certainly a lower bound."
  },
  "lec-18-q3c": {
    "spot": "Minimize the squared distance $x^2+y^2+z^2$ subject to the plane $x+2y+2z=9$: the Lagrange condition gives $(x,y,z)=t(1,2,2)$ — the closest point lies on the line from the origin along the normal.",
    "why": "Minimizing the squared distance avoids square roots, and the gradient equation immediately puts the closest point on the normal line; substitute into the plane and solve for one number.",
    "steps": [
      "$\\nabla(x^2+y^2+z^2)=\\lambda(1,2,2)$: $2x=\\lambda$, $2y=2\\lambda$, $2z=2\\lambda$, so $(x,y,z)=t(1,2,2)$.",
      "Substitute into the plane: $t+4t+4t=9$, $t=1$, closest point $(1,2,2)$.",
      "Distance $\\sqrt{1+4+4}=3$."
    ],
    "trap": "Stopping at the minimum squared distance $9$ and forgetting the square root.",
    "check": "Point-to-plane distance formula: $\\frac{|0+0+0-9|}{\\sqrt{1+4+4}}=3$."
  },
  "lec-18-q4a": {
    "spot": "Open-top box: surface area $S=xy+2xz+2yz$ (one bottom, four sides, no top), and the constraint $xyz=32$ lets you eliminate $z=\\frac{32}{xy}$.",
    "why": "Eliminating $z$ leaves an unconstrained two-variable problem whose two partial-derivative equations are symmetric, quickly giving $x=y$.",
    "steps": [
      "Substitute $z=\\frac{32}{xy}$: $S=xy+\\frac{64}{y}+\\frac{64}{x}$.",
      "$S_x=y-\\frac{64}{x^2}=0$, $S_y=x-\\frac{64}{y^2}=0$.",
      "By symmetry $x=y$, $x^3=64$, $x=y=4$, $z=2$.",
      "$S=16+16+16=48$."
    ],
    "trap": "Treating the box as closed, $S=2(xy+xz+yz)$, which gives a cube of side $\\sqrt[3]{32}$ and surface area about $60.5$.",
    "check": "Try another size, $5\\times4\\times1.6$ (volume also $32$): surface area $48.8$, more than $48$."
  },
  "lec-19-m2": {
    "spot": "The region lies between the line $y=x$ and the parabola $y=x^2$ (for $0\\le x\\le1$): to integrate in $x$ first, rewrite both boundaries in terms of $x$ — $x=y$ and $x=\\sqrt y$.",
    "why": "Always sketch the region before changing the order; mechanically swapping the limits is almost always wrong.",
    "steps": [
      "For $0<x<1$, $x^2<x$, so the region is $x^2\\le y\\le x$, with area $\\int_0^1(x-x^2)\\,dx=\\frac16$.",
      "Fix $y\\in[0,1]$: the left boundary is the line $x=y$, the right boundary is the parabola $x=\\sqrt y$ ($y\\le\\sqrt y$).",
      "Verify with $f=xy$ that both orders agree.",
      "So the answer is $\\int_0^1\\int_y^{\\sqrt y}f\\,dx\\,dy$."
    ],
    "trap": "Copying the $y$-limits over as $x$-limits and writing $\\int_0^1\\int_{y^2}^{y}f\\,dx\\,dy$; that's a different region (its area is also positive, but the shape is completely different).",
    "check": "At $y=\\frac14$, $x$ runs from $\\frac14$ to $\\frac12$: the point $(0.3,0.25)$ indeed satisfies $x^2\\le y\\le x$."
  },
  "lec-19-m3": {
    "spot": "A small polar patch: radial width $dr$, arc length $r\\,d\\theta$, so its area is approximately the rectangle $r\\,dr\\,d\\theta$ — that is, the $\\text{Jacobian}$ of the change of variables equals $r$.",
    "why": "Computing the determinant $\\frac{\\partial(x,y)}{\\partial(r,\\theta)}$ once pins down the extra factor, without relying on memory.",
    "steps": [
      "The four partials of $x=r\\cos\\theta$, $y=r\\sin\\theta$: $\\cos\\theta$, $-r\\sin\\theta$, $\\sin\\theta$, $r\\cos\\theta$.",
      "Determinant $\\cos\\theta\\cdot r\\cos\\theta-(-r\\sin\\theta)\\sin\\theta=r$.",
      "So $dA=r\\,dr\\,d\\theta$."
    ],
    "trap": "Dropping the $r$ and writing $dA=dr\\,d\\theta$; then the unit disk's area comes out as $\\int_0^{2\\pi}\\int_0^1dr\\,d\\theta=2\\pi$, not $\\pi$.",
    "check": "Using $r\\,dr\\,d\\theta$, the area of the disk of radius $1$ comes out as $\\pi$ — correct."
  },
  "lec-19-q1b": {
    "spot": "$e^{y^2}$ has no elementary antiderivative, so integrating in $y$ first is a dead end; the region $0\\le x\\le y\\le1$ is a triangle, and integrating in $x$ first produces an extra factor $y$, giving exactly $ye^{y^2}$.",
    "why": "Changing the order gives the integrand an extra $y$, and $ye^{y^2}$ integrates with the substitution $u=y^2$.",
    "steps": [
      "Region: $0\\le x\\le1$, $x\\le y\\le1$, the same as $0\\le y\\le1$, $0\\le x\\le y$.",
      "Inner integral in $x$: $\\int_0^ye^{y^2}\\,dx=ye^{y^2}$.",
      "$\\int ye^{y^2}\\,dy=\\frac12e^{y^2}$.",
      "$I=\\frac12(e-1)$."
    ],
    "trap": "Writing the $x$-range as $y\\le x\\le1$ when changing the order (picking the wrong half of the square), so the integrand becomes $(1-y)e^{y^2}$, which still can't be integrated.",
    "check": "$e^{y^2}$ lies in $[1,e]$ and the triangle has area $\\frac12$, so $I$ is between $\\frac12$ and $\\frac e2$; $\\frac{e-1}{2}\\approx0.859$."
  },
  "lec-19-q1c": {
    "spot": "$\\frac{\\sin y}{y}$ has no elementary antiderivative, but after changing the order on the region $0\\le x\\le y\\le\\pi$, the inner integral in $x$ produces a $y$ that cancels the denominator exactly.",
    "why": "Changing the order lets $y$ cancel the denominator, leaving $\\int\\sin y\\,dy$ — done in one step.",
    "steps": [
      "Rewrite the region: $0\\le y\\le\\pi$, $0\\le x\\le y$.",
      "Inner integral: $\\int_0^y\\frac{\\sin y}{y}\\,dx=\\sin y$.",
      "$J=\\int_0^\\pi\\sin y\\,dy=2$."
    ],
    "trap": "Insisting on doing $\\int_x^\\pi\\frac{\\sin y}{y}\\,dy$ first; you get stuck writing it as the sine integral function and can't get an exact value.",
    "check": "Numerically integrating the original also gives $2$."
  },
  "lec-19-q2c": {
    "spot": "The sphere and the cylinder are both rotationally symmetric about the $z$-axis: the remaining solid lies in $1\\le r\\le2$, with height $2\\sqrt{4-r^2}$ at each radius, so add it up layer by layer in cylindrical coordinates (or cylindrical shells).",
    "why": "For a rotationally symmetric region use cylindrical coordinates: $\\theta$ integrates straight to $2\\pi$, leaving one integral in $r$.",
    "steps": [
      "$V=\\int_0^{2\\pi}\\int_1^2 2\\sqrt{4-r^2}\\,r\\,dr\\,d\\theta$.",
      "Antiderivative: $\\int2r\\sqrt{4-r^2}\\,dr=-\\frac23(4-r^2)^{3/2}$.",
      "From $1$ to $2$: $0-\\left(-\\frac23\\cdot3^{3/2}\\right)=2\\sqrt3$.",
      "$V=2\\pi\\cdot2\\sqrt3=4\\sqrt3\\,\\pi$."
    ],
    "trap": "Thinking only a cylinder of height $4$ is removed and using $\\frac{32\\pi}{3}-4\\pi$; inside the sphere the cylinder only has height $2\\sqrt3$, and two spherical caps above and below are also removed, so that's wrong.",
    "check": "The removed part $\\frac{32\\pi}{3}-4\\sqrt3\\pi\\approx11.7$ is slightly more than the middle cylinder $\\pi\\cdot1^2\\cdot2\\sqrt3\\approx10.9$ (the two caps make up the difference)."
  },
  "lec-19-q4b": {
    "spot": "The problem already gives the inverse: $x=\\frac{u+v}{2}$, $y=\\frac{u-v}{2}$, so the $\\text{Jacobian}$ is just the $2\\times2$ determinant of these four constant partial derivatives.",
    "why": "For a linear transformation all four partials are constants, so compute the determinant directly; you could also compute the reverse direction's $-2$ and take the reciprocal.",
    "steps": [
      "$x_u=\\frac12$, $x_v=\\frac12$.",
      "$y_u=\\frac12$, $y_v=-\\frac12$.",
      "$\\frac{\\partial(x,y)}{\\partial(u,v)}=\\frac12\\cdot\\left(-\\frac12\\right)-\\frac12\\cdot\\frac12=-\\frac12$."
    ],
    "trap": "Computing the reverse direction $\\frac{\\partial(u,v)}{\\partial(x,y)}=-2$; or, since the area element uses the absolute value, writing $\\frac12$ — the question asks for the determinant itself.",
    "check": "The reverse direction $\\frac{\\partial(u,v)}{\\partial(x,y)}=1\\cdot(-1)-1\\cdot1=-2$; the two are reciprocals."
  },
  "lec-20-m1": {
    "spot": "A plane vector field $(P,Q)$ is conservative on the whole plane ⇔ $P_y=Q_x$; check these two partials for each option — for $(y,x)$ both are $1$.",
    "why": "Checking equal cross partials takes just two derivatives per option — faster than hunting for a potential function or computing circulation.",
    "steps": [
      "$(y,x)$: $P_y=1$, $Q_x=1$, equal; potential $f=xy$.",
      "$(-y,x)$: $P_y=-1$, $Q_x=1$, not equal. $(y,-x)$: $P_y=1$, $Q_x=-1$, not equal.",
      "$(x^2y,x)$: $P_y=x^2$, $Q_x=1$, not equal. So the conservative field is $(y,x)$."
    ],
    "trap": "Picking $(-y,x)$ because it looks symmetric; it's the rotation field around the origin, and one loop around the unit circle does work $2\\pi\\ne0$ — not conservative.",
    "check": "The circulation of $(-y,x)$ around the unit circle is $2\\pi$; that of $(y,x)$ is $0$."
  },
  "lec-20-m2": {
    "spot": "Divergence is the sum of three \"each component in its own variable\" partials: $\\partial_x(x^2)+\\partial_y(yz)+\\partial_z(z)$.",
    "why": "Each component is differentiated only in its matching coordinate, and the three results are added — unlike the cross partials in curl.",
    "steps": [
      "$\\partial_x(x^2)=2x$.",
      "$\\partial_y(yz)=z$, $\\partial_z(z)=1$.",
      "$\\nabla\\cdot\\mathbf F=2x+z+1$."
    ],
    "trap": "Differentiating $yz$ in $z$ to get $y$ (the wrong variable), giving $2x+y+1$.",
    "check": "At $(1,0,1)$: $2+1+1=4$."
  },
  "lec-20-m3": {
    "spot": "$\\mathbf F=(-y,x,0)$ has no $z$-component and doesn't depend on $z$: only the third component of the curl, $Q_x-P_y$, survives.",
    "why": "The first two components involve partials in $z$ or of $R$, which are all $0$, so only one difference needs computing.",
    "steps": [
      "First and second components: $R_y-Q_z=0-0$, $P_z-R_x=0-0$.",
      "Third component: $Q_x-P_y=1-(-1)=2$.",
      "So $\\nabla\\times\\mathbf F=(0,0,2)$."
    ],
    "trap": "Computing $Q_x-P_y$ as $Q_x+P_y=1+(-1)=0$ and getting $(0,0,0)$.",
    "check": "The circulation around a circle of radius $r$ is $2\\pi r^2$, equal to the curl $2$ times the disk's area $\\pi r^2$."
  },
  "lec-20-m4": {
    "spot": "Green's Theorem $\\oint P\\,dx+Q\\,dy=\\iint(Q_x-P_y)\\,dA$: an area formula needs $Q_x-P_y=1$. $\\oint y\\,dx$ has $P=y$, $Q=0$, giving $-1$.",
    "why": "Each option needs just one number, $Q_x-P_y$; only those equal to $1$ give the area.",
    "steps": [
      "$\\oint x\\,dy$: $Q_x-P_y=1-0=1$ — the area.",
      "$\\oint y\\,dx$: $Q_x-P_y=0-1=-1$ — minus the area.",
      "Check on the unit circle: $\\oint y\\,dx=-\\pi$, $\\oint x\\,dy=\\pi$; $-\\oint y\\,dx$ and $\\frac12\\oint(x\\,dy-y\\,dx)$ are both $\\pi$ as well.",
      "So the one that does not equal the area is $\\oint y\\,dx$."
    ],
    "trap": "Thinking $\\oint x\\,dy$ and $\\oint y\\,dx$ are symmetric and both give the area; they differ by a minus sign.",
    "check": "On the counterclockwise unit circle, $\\oint y\\,dx=-\\pi$ — exactly minus the area."
  },
  "lec-20-m5": {
    "spot": "$\\mathbf F=\\nabla f$ is a gradient field: the Fundamental Theorem for Line Integrals says $\\int_C\\nabla f\\cdot d\\mathbf r=f(\\text{end point})-f(\\text{start point})$, and a closed curve starts and ends at the same point.",
    "why": "A line integral of a gradient field depends only on the endpoints — no need to parametrize the curve.",
    "steps": [
      "$\\int_C\\nabla f\\cdot d\\mathbf r=f(B)-f(A)$. For example, with $f=x^2y$, $\\nabla f=(2xy,x^2)$.",
      "For a closed curve $B=A$, so the difference is $0$. For example, once around the unit circle the integral also comes out to $0$.",
      "So $\\oint_C\\mathbf F\\cdot d\\mathbf r=0$."
    ],
    "trap": "Bringing in the length of the closed curve or the area it encloses; for a gradient field, no matter how long the curve or how big the region, the result is $0$.",
    "check": "Another gradient field, $\\nabla(x+y^2)=(1,2y)$, also gives $0$ around the unit circle."
  },
  "lec-20-q1c": {
    "spot": "For $\\mathbf F=(y,-x)$, $Q_x-P_y=-2\\ne0$, so it is not conservative and the work depends on the path; you must actually parametrize the segment: $\\mathbf r(t)=(1-t,t)$, $0\\le t\\le1$.",
    "why": "A non-conservative field doesn't allow the potential-function shortcut; after parametrizing the segment, the integrand is constant and it integrates in one line.",
    "steps": [
      "$\\mathbf r(t)=(1-t,t)$, $\\mathbf r'(t)=(-1,1)$.",
      "$\\mathbf F(\\mathbf r(t))=(t,-(1-t))$; the dot product is $t\\cdot(-1)+(-(1-t))\\cdot1=-1$.",
      "$W=\\int_0^1(-1)\\,dt=-1$."
    ],
    "trap": "Parametrizing in the wrong direction (from $B$ to $A$) and getting $+1$; or assuming work depends only on the endpoints and forcing a potential function.",
    "check": "Going along the quarter circle $(\\cos t,\\sin t)$ instead, the work is $-\\frac\\pi2$, different from the segment — confirming the field is not conservative."
  },
  "lec-20-q2b": {
    "spot": "For a conservative field, find $f$ with $\\nabla f=(2xy,\\,x^2+2yz,\\,y^2)$: integrate the first component in $x$, then use the second and third components to fill in the parts that depend only on $y,z$.",
    "why": "Partially integrating one component at a time and matching avoids missing or double-counting terms; simply adding the three integrals double-counts.",
    "steps": [
      "Integrate $2xy$ in $x$: $f=x^2y+g(y,z)$.",
      "Match in $y$: $x^2+g_y=x^2+2yz$, so $g=y^2z+h(z)$.",
      "Match in $z$: $y^2+h'(z)=y^2$, so $h$ is constant; $f(0,0,0)=0$ gives $h=0$.",
      "So $f=x^2y+y^2z$."
    ],
    "trap": "Integrating each component separately and adding the results, getting $x^2y+(x^2y+y^2z)+y^2z=2x^2y+2y^2z$ — everything counted twice.",
    "check": "Take the gradient of the answer: all three components match."
  },
  "lec-20-q3a": {
    "spot": "A closed counterclockwise triangle, needing three line integrals: use Green's Theorem to switch to the region integral $\\iint(Q_x-P_y)\\,dA$, where $Q_x-P_y=2x-x=x$ is simple.",
    "why": "Parametrizing three edges means three computations; Green's Theorem merges all three edges into one double integral.",
    "steps": [
      "$P=xy$, $Q=x^2$: $Q_x-P_y=2x-x=x$.",
      "Region: $0\\le x\\le1$, $0\\le y\\le x$.",
      "$\\iint x\\,dA=\\int_0^1x\\cdot x\\,dx=\\frac13$."
    ],
    "trap": "Writing $Q_x-P_y$ as $P_y-Q_x=-x$ (order reversed) and getting $-\\frac13$.",
    "check": "Computing the three edges directly: the bottom gives $0$, the right side $\\int_0^1dt=1$, and the hypotenuse from $(1,1)$ back to the origin $\\int_0^1-2(1-t)^2dt=-\\frac23$, for a total of $\\frac13$."
  },
  "lec-20-q4a": {
    "spot": "The divergence of $\\mathbf F=(x,y,z)$ is the constant $3$: the Divergence Theorem turns the flux into $3\\times$ the volume of the ball.",
    "why": "With constant divergence the volume integral reduces to the volume formula — faster than parametrizing the sphere and computing directly.",
    "steps": [
      "$\\nabla\\cdot\\mathbf F=1+1+1=3$.",
      "Flux $=\\iiint3\\,dV=3\\cdot\\frac43\\pi a^3$.",
      "$=4\\pi a^3$."
    ],
    "trap": "Computing the divergence as $x+y+z$, or forgetting to multiply by the volume and writing just $3$; some also mistakenly multiply the surface area $4\\pi a^2$ by $3$.",
    "check": "Directly: on the sphere $\\mathbf F\\cdot\\mathbf n=a$ ($\\mathbf F$ is the radius vector), and multiplying by the surface area $4\\pi a^2$ also gives $4\\pi a^3$."
  },
  "lec-20-q4b": {
    "spot": "Stokes' Theorem: the flux of the curl through the upper hemisphere = the circulation around its boundary, the equator circle $x^2+y^2=1$; with the normal pointing up, the circle runs counterclockwise viewed from above.",
    "why": "Parametrizing the sphere is tedious; the boundary is just a unit circle, and its line integral takes one line.",
    "steps": [
      "Boundary $\\mathbf r(t)=(\\cos t,\\sin t,0)$, $\\mathbf r'=(-\\sin t,\\cos t,0)$.",
      "$\\mathbf F\\cdot\\mathbf r'=(-\\sin t)(-\\sin t)+\\cos t\\cos t=1$.",
      "$\\oint=\\int_0^{2\\pi}1\\,dt=2\\pi$."
    ],
    "trap": "Taking the boundary clockwise and getting $-2\\pi$; an upward normal goes with counterclockwise (right-hand rule).",
    "check": "Switch to the flat unit disk: $\\nabla\\times\\mathbf F=(0,0,2)$, flux $2\\times\\pi=2\\pi$ — the same boundary gives the same answer."
  },
  "lm-pr-001": {
    "spot": "$1-\\frac1{n^2}=\\frac{(n-1)(n+1)}{n\\cdot n}$: the numerator and denominator are offset by one, so consecutive factors cancel in the product (a telescoping product).",
    "why": "Writing the partial product in closed form and taking the limit is faster and exact, compared with taking logs to get a series and estimating it.",
    "steps": [
      "Factor: $1-\\frac1{n^2}=\\frac{n-1}{n}\\cdot\\frac{n+1}{n}$.",
      "$\\prod_{n=2}^N\\frac{n-1}{n}=\\frac1N$ and $\\prod_{n=2}^N\\frac{n+1}{n}=\\frac{N+1}{2}$, so the partial product is $P_N=\\frac{N+1}{2N}$. Check with $N=4$: $\\frac34\\cdot\\frac89\\cdot\\frac{15}{16}=\\frac58$.",
      "$N\\to\\infty$: $\\frac{N+1}{2N}\\to\\frac12$."
    ],
    "trap": "Thinking an infinite product of factors less than $1$ must go to $0$; here $\\frac1{n^2}$ shrinks fast enough that the product settles at $\\frac12$.",
    "check": "Taking logs: $\\sum_{n\\ge2}\\ln\\left(1-\\frac1{n^2}\\right)=\\ln\\frac12$."
  },
  "lx-app-009": {
    "spot": "$\\sum_{k=0}^n200(0.7)^k$ is a geometric series with first term $200$ and ratio $0.7$; since $|0.7|<1$, as $n\\to\\infty$ it converges to $\\frac{200}{1-0.7}$.",
    "why": "A geometric series has a closed form, so use the formula — no need to add up day by day.",
    "steps": [
      "Partial sum $S_n=200\\cdot\\frac{1-0.7^{n+1}}{1-0.7}$; for example, $n=3$: $200+140+98+68.6=506.6$.",
      "$0.7^{n+1}\\to0$.",
      "Limit $\\frac{200}{0.3}=\\frac{2000}{3}\\approx666.7$ mg."
    ],
    "trap": "Confusing the ratio with the fraction remaining and writing $\\frac{200}{0.7}\\approx285.7$; or using $\\frac{200}{1+0.7}$.",
    "check": "Steady state: the residual amount $L$ satisfies $L=0.7L+200$ (seventy percent remains, then another dose), which gives $L=\\frac{2000}{3}$."
  },
  "mob-bessel-005": {
    "spot": "Differentiating the series of $J_0$, $1-\\frac{x^2}{4}+\\frac{x^4}{64}-\\cdots$, term by term gives $-\\frac{x}{2}+\\frac{x^3}{16}-\\cdots$, exactly the negative of $J_1=\\frac x2-\\frac{x^3}{16}+\\cdots$.",
    "why": "Differentiating the series term by term is most direct; the integral representation can confirm it numerically.",
    "steps": [
      "$J_0(x)=1-\\frac{x^2}{4}+\\frac{x^4}{64}-\\cdots$; differentiating gives $-\\frac x2+\\frac{x^3}{16}-\\cdots$.",
      "$J_1(x)=\\frac x2-\\frac{x^3}{16}+\\cdots$, so the two differ by a sign.",
      "Verify with the integral formula $J_n(x)=\\frac1\\pi\\int_0^\\pi\\cos(n\\theta-x\\sin\\theta)\\,d\\theta$ at $x=0.7$: $J_0'(0.7)=-J_1(0.7)$.",
      "So $J_0'(x)=-J_1(x)$."
    ],
    "trap": "Dropping the minus sign and answering $J_1(x)$; $J_0$ starts at $1$ and falls, so its derivative just right of $0$ is negative, while $J_1$ is positive there.",
    "check": "At $x=1$: $J_0$ is decreasing (negative derivative) and $J_1(1)\\approx0.44>0$ — the signs agree."
  },
  "mob-bessel-006": {
    "spot": "$x^2y''+xy'+(x^2-\\nu^2)y=0$: the coefficient of $y''$ is $x^2$, of $y'$ is $x$, and of $y$ has an extra $x^2$ minus $\\nu^2$ — exactly the standard form of Bessel's equation, with $\\nu$ the order.",
    "why": "Recognizing an equation by its coefficient pattern is fastest; it differs from the Cauchy–Euler equation only by the extra $x^2$ in front of $y$.",
    "steps": [
      "Check with $\\nu=\\frac12$: $y=\\frac{\\sin x}{\\sqrt x}$ satisfies $x^2y''+xy'+\\left(x^2-\\frac14\\right)y=0$.",
      "The other independent solution $\\frac{\\cos x}{\\sqrt x}$ satisfies it too; the solution space of a second-order linear equation is two-dimensional.",
      "So this is Bessel's equation of order $\\nu$, with solutions $J_\\nu$ and $Y_\\nu$."
    ],
    "trap": "Seeing $x^2y''+xy'$ and calling it a Cauchy–Euler equation; in a Cauchy–Euler equation the coefficient of $y$ is constant, but here there's an extra $x^2$.",
    "check": "The $\\frac{\\sin x}{\\sqrt x}$ above is exactly $\\sqrt{\\frac\\pi2}\\,J_{1/2}(x)$, a Bessel function of half-integer order."
  },
  "mob-bessel-008": {
    "spot": "Negative integer order: $J_{-n}(x)=(-1)^nJ_n(x)$; $n=2$ is even, so the sign disappears.",
    "why": "For integer orders, positive and negative orders differ only by $(-1)^n$; the substitution $\\theta\\to\\pi-\\theta$ in the integral representation proves it in one step.",
    "steps": [
      "Integral formula: $J_n(x)=\\frac1\\pi\\int_0^\\pi\\cos(n\\theta-x\\sin\\theta)\\,d\\theta$, valid for every integer $n$ (including negative ones).",
      "$n=-2$: substituting $\\theta\\to\\pi-\\theta$ turns $\\cos(-2\\theta-x\\sin\\theta)$ into $\\cos(2\\theta-x\\sin\\theta-2\\pi)$, which is the integrand of $J_2$.",
      "Compare an odd order: at $n=-1$ an extra $-1$ appears, $J_{-1}=-J_1$.",
      "So $J_{-2}(x)=J_2(x)$."
    ],
    "trap": "Thinking a negative order gives a new independent solution, or writing $-J_2$ (applying the odd-order sign to an even order).",
    "check": "Near $0$, $J_2$ behaves like $\\frac{x^2}{8}$: at $x=0.1$ the integral for $J_{-2}$ is about $0.00125$."
  }
};
