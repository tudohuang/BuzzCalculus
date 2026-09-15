(function () {
  "use strict";

  window.BUZZ_PROOFS = [
    {
      id: "proof-mvt-001",
      tier: "basic",
      title: "Rolle 定理",
      difficulty: 1,
      tags: ["rolle", "mvt"],
      statement: "證明 Rolle theorem 的核心結論。",
      prompt: "f\\in C([a,b])\\cap C^1((a,b)),\\quad f(a)=f(b)\\Rightarrow \\exists c\\in(a,b),\\ f'(c)=0",
      hints: ["先用極值定理。", "如果最大值等於最小值，函數是常數。", "如果不是常數，內點極值搭配 Fermat theorem。"],
      keySteps: ["Extreme Value Theorem", "constant case", "Fermat theorem"],
      solution: [
        { text: "由連續性，f 在閉區間上取到最大值與最小值。", tex: "\\exists x_m,x_M\\in[a,b]\\quad f(x_m)=m,\\quad f(x_M)=M" },
        { text: "若 m=M，則 f 在 [a,b] 上為常數，任取 c in (a,b) 即可。", tex: "m=M\\Rightarrow f(x)\\equiv m\\Rightarrow f'(c)=0" },
        { text: "若 m<M，因 f(a)=f(b)，最大值或最小值至少有一個發生在內點。", tex: "\\exists c\\in(a,b)\\quad c\\text{ is a local extremum}" },
        { text: "f 在 c 可微，且 c 是內點局部極值，所以 Fermat theorem 給出導數為 0。", tex: "f'(c)=0" }
      ]
    },
    {
      id: "proof-mvt-002",
      tier: "basic",
      title: "平均值定理",
      difficulty: 1,
      tags: ["mvt"],
      statement: "用 Rolle theorem 證明 Mean Value Theorem。",
      prompt: "f\\in C([a,b])\\cap C^1((a,b))\\Rightarrow \\exists c\\in(a,b),\\ f'(c)=\\frac{f(b)-f(a)}{b-a}",
      hints: ["扣掉割線。", "讓新函數在兩端點相等。", "對新函數用 Rolle theorem。"],
      keySteps: ["secant slope", "auxiliary function", "Rolle theorem"],
      solution: [
        { text: "令 s 為割線斜率，並把割線從 f 中扣掉。", tex: "s=\\frac{f(b)-f(a)}{b-a},\\qquad g(x)=f(x)-f(a)-s(x-a)" },
        { text: "此時 g 仍連續且可微，而且兩端點相等。", tex: "g(a)=0,\\qquad g(b)=f(b)-f(a)-s(b-a)=0" },
        { text: "由 Rolle theorem，存在 c in (a,b) 使 g'(c)=0。", tex: "\\exists c\\in(a,b)\\quad g'(c)=0" },
        { text: "展開 g'(c)=0 即得到平均值定理。", tex: "0=g'(c)=f'(c)-s\\Rightarrow f'(c)=\\frac{f(b)-f(a)}{b-a}" }
      ]
    },
    {
      id: "proof-mvt-003",
      tier: "basic",
      title: "導數恆為零則函數為常數",
      difficulty: 1,
      tags: ["mvt", "constant"],
      statement: "證明可微函數若導數處處為 0，則在區間上為常數。",
      prompt: "f'(x)=0\\ \\forall x\\in I\\Rightarrow f\\text{ is constant on }I",
      hints: ["任取兩點 x<y。", "在 [x,y] 上使用 MVT。", "差值會被導數吃掉。"],
      keySteps: ["choose two points", "MVT", "zero difference"],
      solution: [
        { text: "任取 x<y 且 x,y in I，只要證明 f(x)=f(y) 即可。", tex: "x<y,\\quad x,y\\in I" },
        { text: "在 [x,y] 上套平均值定理。", tex: "f(y)-f(x)=f'(c)(y-x)\\quad\\text{for some }c\\in(x,y)" },
        { text: "因為 f'(c)=0，所以兩點函數值相等。", tex: "f(y)-f(x)=0\\cdot (y-x)=0" },
        { text: "任意兩點函數值都相同，因此 f 為常數。", tex: "\\forall x,y\\in I,\\quad f(x)=f(y)" }
      ]
    },
    {
      id: "proof-mvt-004",
      tier: "basic",
      title: "導數正則嚴格遞增",
      difficulty: 1,
      tags: ["mvt", "monotonicity"],
      statement: "用平均值定理證明導數符號控制單調性。",
      prompt: "f'(x)>0\\ \\forall x\\in I\\Rightarrow f\\text{ is strictly increasing on }I",
      hints: ["任取 x<y。", "套 MVT。", "注意 y-x>0。"],
      keySteps: ["MVT", "positive derivative", "strict inequality"],
      solution: [
        { text: "任取 x<y。由 MVT，存在 c in (x,y) 使差商等於 f'(c)。", tex: "f(y)-f(x)=f'(c)(y-x)" },
        { text: "已知 f'(c)>0，且 y-x>0。", tex: "f'(c)>0,\\quad y-x>0" },
        { text: "因此 f(y)-f(x)>0。", tex: "f(y)-f(x)>0" },
        { text: "所以 x<y 時 f(x)<f(y)，即 f 嚴格遞增。", tex: "x<y\\Rightarrow f(x)<f(y)" }
      ]
    },
    {
      id: "proof-ineq-001",
      tier: "basic",
      title: "指數不等式",
      difficulty: 2,
      tags: ["mvt", "inequality"],
      statement: "證明常用估計 e^x>1+x。",
      prompt: "x>0\\Rightarrow e^x>1+x",
      hints: ["考慮 e^x-1-x。", "看 0 附近的值。", "用導數正性。"],
      keySteps: ["auxiliary function", "derivative sign", "monotonicity"],
      solution: [
        { text: "設輔助函數。", tex: "g(x)=e^x-1-x" },
        { text: "先看基準點。", tex: "g(0)=0" },
        { text: "當 x>0 時，g 的導數為正。", tex: "g'(x)=e^x-1>0" },
        { text: "所以 g 在 (0,infty) 上嚴格遞增，x>0 時 g(x)>g(0)。", tex: "x>0\\Rightarrow g(x)>0" },
        { text: "把 g(x)>0 展開，即得到結論。", tex: "e^x-1-x>0\\Rightarrow e^x>1+x" }
      ]
    },
    {
      id: "proof-ineq-002",
      tier: "standard",
      title: "對數不等式",
      difficulty: 2,
      tags: ["mvt", "inequality", "log"],
      statement: "證明 log 的基本上界。",
      prompt: "x>0\\Rightarrow \\ln(1+x)<x",
      hints: ["考慮 x-ln(1+x)。", "導數化簡後會是正的。", "從 0 出發比較。"],
      keySteps: ["auxiliary function", "derivative sign", "strict bound"],
      solution: [
        { text: "設輔助函數。", tex: "g(x)=x-\\ln(1+x)" },
        { text: "基準點為 0。", tex: "g(0)=0" },
        { text: "對 x>0，導數為正。", tex: "g'(x)=1-\\frac{1}{1+x}=\\frac{x}{1+x}>0" },
        { text: "所以 x>0 時 g(x)>0。", tex: "x>0\\Rightarrow x-\\ln(1+x)>0" },
        { text: "移項得到欲證不等式。", tex: "\\ln(1+x)<x" }
      ]
    },
    {
      id: "proof-mvt-005",
      tier: "standard",
      title: "Cauchy 平均值定理",
      difficulty: 2,
      tags: ["mvt", "cauchy"],
      statement: "用 Rolle theorem 證明 Cauchy MVT。",
      prompt: "\\exists c\\in(a,b):\\quad (f(b)-f(a))g'(c)=(g(b)-g(a))f'(c)",
      hints: ["組合 f 與 g。", "讓端點值相等。", "對組合函數用 Rolle。"],
      keySteps: ["linear combination", "Rolle theorem", "expand derivative"],
      solution: [
        { text: "令 A=f(b)-f(a)，B=g(b)-g(a)，考慮線性組合。", tex: "h(x)=Bf(x)-Ag(x)" },
        { text: "h 在端點的差為 0。", tex: "h(b)-h(a)=B(f(b)-f(a))-A(g(b)-g(a))=BA-AB=0" },
        { text: "因此 h(a)=h(b)，可套 Rolle theorem。", tex: "\\exists c\\in(a,b)\\quad h'(c)=0" },
        { text: "展開 h'(c)=0。", tex: "Bf'(c)-Ag'(c)=0" },
        { text: "代回 A,B 即得 Cauchy MVT。", tex: "(g(b)-g(a))f'(c)=(f(b)-f(a))g'(c)" }
      ]
    },
    {
      id: "proof-taylor-001",
      tier: "standard",
      title: "Taylor 餘項估計",
      difficulty: 3,
      tags: ["taylor", "remainder"],
      statement: "用 Lagrange remainder 得到 Taylor 誤差界。",
      prompt: "|f^{(n+1)}(t)|\\le M\\Rightarrow |R_n(x)|\\le \\frac{M|x-a|^{n+1}}{(n+1)!}",
      hints: ["寫出 Taylor theorem。", "餘項中有某個 xi。", "最後取絕對值。"],
      keySteps: ["Taylor theorem", "Lagrange remainder", "absolute value"],
      solution: [
        { text: "Taylor theorem 給出 n 階展開與餘項。", tex: "f(x)=\\sum_{k=0}^{n}\\frac{f^{(k)}(a)}{k!}(x-a)^k+R_n(x)" },
        { text: "Lagrange 形式的餘項為下式，其中 xi 介於 a 與 x 之間。", tex: "R_n(x)=\\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-a)^{n+1}" },
        { text: "由假設，該點的高階導數絕對值不超過 M。", tex: "|f^{(n+1)}(\\xi)|\\le M" },
        { text: "取絕對值後得到估計。", tex: "|R_n(x)|\\le \\frac{M|x-a|^{n+1}}{(n+1)!}" }
      ]
    },
    {
      id: "proof-integral-001",
      tier: "standard",
      title: "積分平均值定理",
      difficulty: 3,
      tags: ["integral", "mvt"],
      statement: "證明連續函數的定積分等於某點函數值乘上長度。",
      prompt: "f\\in C([a,b])\\Rightarrow \\exists c\\in[a,b],\\ \\int_a^b f(x)\\,dx=f(c)(b-a)",
      hints: ["先用極值定理夾住 f。", "對不等式積分。", "再用介值定理。"],
      keySteps: ["EVT", "integral bound", "IVT"],
      solution: [
        { text: "由極值定理，f 在 [a,b] 上有最小值 m 與最大值 M。", tex: "m\\le f(x)\\le M" },
        { text: "對不等式積分。", tex: "m(b-a)\\le \\int_a^b f(x)\\,dx\\le M(b-a)" },
        { text: "除以 b-a，得到平均值落在 [m,M] 之間。", tex: "m\\le \\frac{1}{b-a}\\int_a^b f(x)\\,dx\\le M" },
        { text: "由介值定理，存在 c 使 f(c) 等於這個平均值。", tex: "f(c)=\\frac{1}{b-a}\\int_a^b f(x)\\,dx" },
        { text: "移項即得結論。", tex: "\\int_a^b f(x)\\,dx=f(c)(b-a)" }
      ]
    },
    {
      id: "proof-compact-001",
      tier: "standard",
      title: "閉區間連續則一致連續",
      difficulty: 3,
      tags: ["compactness", "continuity"],
      statement: "證明 Heine-Cantor theorem 在閉區間上的版本。",
      prompt: "f\\in C([a,b])\\Rightarrow f\\text{ is uniformly continuous on }[a,b]",
      hints: ["反證法。", "取兩列點距離趨近 0 但函數值差不小。", "用緊緻性取收斂子列。"],
      keySteps: ["contradiction", "subsequence", "continuity"],
      solution: [
        { text: "反設 f 不一致連續，則存在 epsilon0>0 與兩列點。", tex: "\\exists \\varepsilon_0>0,\\ |x_n-y_n|\\to0,\\quad |f(x_n)-f(y_n)|\\ge\\varepsilon_0" },
        { text: "因 [a,b] 緊緻，可從 x_n 取收斂子列。", tex: "x_{n_k}\\to x_0\\in[a,b]" },
        { text: "又 |x_n-y_n| -> 0，所以對應的 y 子列也收斂到同一點。", tex: "y_{n_k}\\to x_0" },
        { text: "由 f 在 x0 連續，兩邊函數值都收斂到 f(x0)。", tex: "f(x_{n_k})\\to f(x_0),\\qquad f(y_{n_k})\\to f(x_0)" },
        { text: "因此函數值差趨近 0，與差值至少 epsilon0 矛盾。", tex: "|f(x_{n_k})-f(y_{n_k})|\\to0" }
      ]
    },
    {
      id: "proof-convex-001",
      tier: "advanced",
      title: "凸函數切線不等式",
      difficulty: 3,
      tags: ["convexity", "inequality"],
      statement: "證明二階導數非負時，圖形在任一切線上方。",
      prompt: "f''(t)\\ge0\\Rightarrow f(y)\\ge f(x)+f'(x)(y-x)",
      hints: ["固定 x，考慮扣掉切線的函數。", "看 g(x) 與 g'(x)。", "利用 g''>=0 推得 g 的最小值。"],
      keySteps: ["subtract tangent", "convex derivative", "global lower bound"],
      solution: [
        { text: "固定 x，定義扣掉切線後的函數。", tex: "g(t)=f(t)-f(x)-f'(x)(t-x)" },
        { text: "在 t=x 時，g 與 g' 都為 0。", tex: "g(x)=0,\\qquad g'(x)=0" },
        { text: "且 g''(t)=f''(t)>=0，所以 g' 單調遞增。", tex: "g''(t)=f''(t)\\ge0" },
        { text: "若 y>x，則 g'(t)>=0 on [x,y]，所以 g(y)>=g(x)。", tex: "g(y)-g(x)=\\int_x^y g'(t)\\,dt\\ge0" },
        { text: "若 y<x，則在 [y,x] 上 g'(t)<=0，仍可得 g(y)>=g(x)。", tex: "g(y)-g(x)=-\\int_y^x g'(t)\\,dt\\ge0" },
        { text: "因此任意 y 都有 g(y)>=0，展開即為切線不等式。", tex: "f(y)\\ge f(x)+f'(x)(y-x)" }
      ]
    },
    {
      id: "proof-convex-002",
      tier: "advanced",
      title: "Jensen 二點不等式",
      difficulty: 3,
      tags: ["convexity", "jensen"],
      statement: "用凸性定義證明二點 Jensen inequality。",
      prompt: "f\\text{ convex}\\Rightarrow f(\\lambda x+(1-\\lambda)y)\\le \\lambda f(x)+(1-\\lambda)f(y)",
      hints: ["這其實就是凸性的定義。", "把點寫成 x,y 的 convex combination。", "注意 0<=lambda<=1。"],
      keySteps: ["convex combination", "definition", "endpoint weights"],
      solution: [
        { text: "令 z 是 x 與 y 的凸組合。", tex: "z=\\lambda x+(1-\\lambda)y,\\qquad 0\\le\\lambda\\le1" },
        { text: "凸函數的定義就是函數值不超過端點函數值的同權重平均。", tex: "f(z)\\le \\lambda f(x)+(1-\\lambda)f(y)" },
        { text: "代回 z 的定義。", tex: "f(\\lambda x+(1-\\lambda)y)\\le \\lambda f(x)+(1-\\lambda)f(y)" },
        { text: "等號通常出現在 x=y、lambda 為 0 或 1，或 f 在該段為線性時。", tex: "\\text{equality in the linear case}" }
      ]
    },
    {
      id: "proof-lhopital-001",
      tier: "advanced",
      title: "L'Hopital 0/0 型核心證明",
      difficulty: 4,
      tags: ["lhopital", "cauchy-mvt"],
      statement: "用 Cauchy MVT 證明 L'Hopital rule 的局部核心。",
      prompt: "f(a)=g(a)=0,\\ \\lim_{x\\to a}\\frac{f'(x)}{g'(x)}=L\\Rightarrow \\lim_{x\\to a}\\frac{f(x)}{g(x)}=L",
      hints: ["在 [a,x] 上用 Cauchy MVT。", "把 f(x)/g(x) 變成某點的 f'/g'。", "讓 x->a。"],
      keySteps: ["Cauchy MVT", "derivative ratio", "limit transfer"],
      solution: [
        { text: "固定 x 接近 a，對 f,g 在 [a,x] 使用 Cauchy MVT。", tex: "\\frac{f(x)-f(a)}{g(x)-g(a)}=\\frac{f'(c_x)}{g'(c_x)}" },
        { text: "因 f(a)=g(a)=0，左邊就是原本的比值。", tex: "\\frac{f(x)}{g(x)}=\\frac{f'(c_x)}{g'(c_x)}" },
        { text: "Cauchy MVT 給出的 c_x 介於 a 與 x 之間。", tex: "c_x\\in(a,x)\\quad\\text{or}\\quad c_x\\in(x,a)" },
        { text: "當 x->a 時，c_x->a。", tex: "x\\to a\\Rightarrow c_x\\to a" },
        { text: "由導數比的極限，得到原比值極限為 L。", tex: "\\lim_{x\\to a}\\frac{f(x)}{g(x)}=\\lim_{x\\to a}\\frac{f'(c_x)}{g'(c_x)}=L" }
      ]
    },
    {
      id: "proof-lm-001",
      tier: "advanced",
      title: "Lagrange Multiplier 必要條件",
      difficulty: 4,
      tags: ["lagrange-multiplier", "optimization"],
      statement: "證明受限極值的一階必要條件。",
      prompt: "\\nabla g(a)\\ne0,\\ f|_{g=0}\\text{ has local extremum at }a\\Rightarrow \\nabla f(a)=\\lambda \\nabla g(a)",
      hints: ["沿著 constraint curve 取參數化。", "對 f(r(t)) 微分。", "所有切向量都垂直於 grad f。"],
      keySteps: ["constraint tangent", "chain rule", "normal space"],
      solution: [
        { text: "設 r(t) 是約束曲面 g=0 上穿過 a 的任意光滑曲線。", tex: "r(0)=a,\\qquad g(r(t))=0" },
        { text: "由鏈鎖律，曲線切向量 v=r'(0) 滿足下式。", tex: "0=\\frac{d}{dt}g(r(t))\\bigg|_{t=0}=\\nabla g(a)\\cdot v" },
        { text: "因 f 在約束上有局部極值，沿任意這樣的曲線，f(r(t)) 在 0 有極值。", tex: "0=\\frac{d}{dt}f(r(t))\\bigg|_{t=0}=\\nabla f(a)\\cdot v" },
        { text: "所以 grad f 與所有約束切向量垂直。", tex: "\\nabla f(a)\\perp T_a(g=0)" },
        { text: "在 regular point，約束的法向空間由 grad g 張成，因此兩梯度平行。", tex: "\\nabla f(a)=\\lambda\\nabla g(a)" }
      ]
    },
    {
      id: "proof-fubini-001",
      tier: "advanced",
      title: "矩形區域換序的直觀證明",
      difficulty: 4,
      tags: ["double-integral", "fubini"],
      statement: "在連續情況下說明矩形上二重積分可以換序。",
      prompt: "f\\in C([a,b]\\times[c,d])\\Rightarrow \\int_a^b\\int_c^d f(x,y)\\,dy\\,dx=\\int_c^d\\int_a^b f(x,y)\\,dx\\,dy",
      hints: ["先用 Riemann sum。", "矩形網格的雙重和可交換。", "再取極限。"],
      keySteps: ["partition", "double sum", "limit"],
      solution: [
        { text: "取矩形分割，二重積分可由雙重 Riemann sum 逼近。", tex: "S(P)=\\sum_i\\sum_j f(x_i^*,y_j^*)\\Delta x_i\\Delta y_j" },
        { text: "有限雙重和可以交換加總順序。", tex: "\\sum_i\\sum_j f(x_i^*,y_j^*)\\Delta x_i\\Delta y_j=\\sum_j\\sum_i f(x_i^*,y_j^*)\\Delta x_i\\Delta y_j" },
        { text: "左邊的極限對應先對 y 積再對 x 積。", tex: "\\lim_{\\|P\\|\\to0}\\sum_i\\left(\\sum_j f(x_i^*,y_j^*)\\Delta y_j\\right)\\Delta x_i" },
        { text: "右邊的極限對應先對 x 積再對 y 積。", tex: "\\lim_{\\|P\\|\\to0}\\sum_j\\left(\\sum_i f(x_i^*,y_j^*)\\Delta x_i\\right)\\Delta y_j" },
        { text: "連續性保證兩種 Riemann sum 極限存在且相同。", tex: "\\int_a^b\\int_c^d f\\,dy\\,dx=\\int_c^d\\int_a^b f\\,dx\\,dy" }
      ]
    },
    {
      id: "proof-jacobian-001",
      tier: "boss",
      title: "Jacobian 鏈鎖律",
      difficulty: 5,
      tags: ["jacobian", "chain-rule"],
      statement: "證明多變數變數變換中的 Jacobian chain rule。",
      prompt: "\\frac{\\partial(u,v)}{\\partial(x,y)}=\\frac{\\partial(u,v)}{\\partial(r,s)}\\frac{\\partial(r,s)}{\\partial(x,y)}",
      hints: ["把 Jacobian 看成導數矩陣的 determinant。", "用矩陣鏈鎖律。", "最後取 determinant。"],
      keySteps: ["Jacobian matrix", "matrix chain rule", "determinant product"],
      solution: [
        { text: "令 F=(u,v)，G=(r,s)。複合映射是 F∘G。", tex: "(x,y)\\mapsto (r,s)\\mapsto (u,v)" },
        { text: "多變數鏈鎖律在矩陣形式為。", tex: "D(F\\circ G)(x,y)=DF(G(x,y))DG(x,y)" },
        { text: "兩邊取 determinant。", tex: "\\det D(F\\circ G)=\\det(DF(G(x,y))DG(x,y))" },
        { text: "使用 determinant 的乘法性。", tex: "\\det(AB)=\\det(A)\\det(B)" },
        { text: "把 determinant 寫回 Jacobian 記號，即得結論。", tex: "\\frac{\\partial(u,v)}{\\partial(x,y)}=\\frac{\\partial(u,v)}{\\partial(r,s)}\\frac{\\partial(r,s)}{\\partial(x,y)}" }
      ]
    },
    {
      id: "proof-limit-001",
      tier: "boss",
      title: "多變數極限不存在：路徑陷阱",
      difficulty: 5,
      tags: ["multivariable", "path-test"],
      statement: "用兩條路徑證明多變數極限不存在。",
      prompt: "\\lim_{(x,y)\\to(0,0)}\\frac{x^2y^2}{(x^2+y^2)^2}\\text{ does not exist}",
      hints: ["先走 y=0。", "再走 y=x。", "兩個結果不同。"],
      keySteps: ["path y=0", "path y=x", "different limits"],
      solution: [
        { text: "沿路徑 y=0，函數值恆為 0。", tex: "\\frac{x^2\\cdot0^2}{(x^2+0^2)^2}=0" },
        { text: "因此沿 y=0 的極限為 0。", tex: "\\lim_{x\\to0}0=0" },
        { text: "沿路徑 y=x，代入得到常數。", tex: "\\frac{x^2x^2}{(x^2+x^2)^2}=\\frac{x^4}{4x^4}=\\frac14" },
        { text: "因此沿 y=x 的極限為 1/4。", tex: "\\lim_{x\\to0}\\frac14=\\frac14" },
        { text: "兩條路徑給出不同極限，所以原極限不存在。", tex: "0\\ne\\frac14\\Rightarrow \\text{DNE}" }
      ]
    },
    {
      id: "proof-hessian-001",
      tier: "boss",
      title: "Hessian 正定推出嚴格局部極小",
      difficulty: 5,
      tags: ["hessian", "optimization", "taylor"],
      statement: "用二階 Taylor 展開證明 Hessian 正定時的局部極小判別。",
      prompt: "\\nabla f(a)=0,\\ H_f(a)>0\\Rightarrow a\\text{ is a strict local minimum}",
      hints: ["寫二階 Taylor。", "正定給出二次型下界。", "餘項比二次項小。"],
      keySteps: ["Taylor expansion", "positive definite lower bound", "small remainder"],
      solution: [
        { text: "令 h=x-a。二階 Taylor 展開為。", tex: "f(a+h)-f(a)=\\nabla f(a)\\cdot h+\\frac12 h^TH_f(a)h+o(\\|h\\|^2)" },
        { text: "因為 a 是 critical point，一階項消失。", tex: "\\nabla f(a)=0" },
        { text: "Hessian 正定表示存在 m>0，使二次型有下界。", tex: "h^TH_f(a)h\\ge m\\|h\\|^2" },
        { text: "餘項 o(||h||^2) 對足夠小的 h 可被二次項的一半控制。", tex: "|o(\\|h\\|^2)|\\le \\frac{m}{4}\\|h\\|^2" },
        { text: "所以非零且足夠小的 h 會讓函數值上升。", tex: "f(a+h)-f(a)\\ge \\frac{m}{4}\\|h\\|^2>0" }
      ]
    },
    {
      id: "proof-wronskian-001",
      tier: "boss",
      title: "Wronskian 的 Abel 公式",
      difficulty: 5,
      tags: ["wronskian", "ode"],
      statement: "證明二階線性 ODE 的 Wronskian 滿足一階方程。",
      prompt: "y''+p(x)y'+q(x)y=0\\Rightarrow W'(x)=-p(x)W(x)",
      hints: ["寫 W=y1 y2'-y1' y2。", "直接微分。", "用 ODE 代掉 y''。"],
      keySteps: ["differentiate W", "substitute ODE", "factor"],
      solution: [
        { text: "取兩個解 y1,y2，Wronskian 為。", tex: "W=y_1y_2'-y_1'y_2" },
        { text: "直接微分，中間項抵消。", tex: "W'=y_1y_2''-y_1''y_2" },
        { text: "由 ODE，任一解都滿足 y''=-py'-qy。", tex: "y_i''=-p y_i'-q y_i" },
        { text: "代回 W'。", tex: "W'=y_1(-py_2'-qy_2)-(-py_1'-qy_1)y_2" },
        { text: "q 項抵消，剩下 -p 倍的 W。", tex: "W'=-p(y_1y_2'-y_1'y_2)=-pW" }
      ]
    },
    {
      id: "proof-inverse-001",
      tier: "boss",
      title: "反函數 Jacobian 公式",
      difficulty: 5,
      tags: ["inverse-function", "jacobian"],
      statement: "用鏈鎖律證明反函數的 Jacobian determinant 是倒數。",
      prompt: "G=F^{-1}\\Rightarrow J_G(F(x))=\\frac{1}{J_F(x)}",
      hints: ["從 G(F(x))=x 出發。", "對兩邊微分。", "取 determinant。"],
      keySteps: ["inverse identity", "differentiate", "determinant"],
      solution: [
        { text: "由反函數定義。", tex: "G(F(x))=x" },
        { text: "對 x 微分，使用矩陣鏈鎖律。", tex: "DG(F(x))DF(x)=I" },
        { text: "兩邊取 determinant。", tex: "\\det DG(F(x))\\det DF(x)=\\det I=1" },
        { text: "若 J_F(x) 不為 0，移項得到。", tex: "J_G(F(x))=\\frac{1}{J_F(x)}" },
        { text: "這就是變數變換中反向 Jacobian 的來源。", tex: "d u\\,d v=|J_F(x,y)|\\,dx\\,dy" }
      ]
    },
    {
      id: "proof-series-001",
      tier: "boss",
      title: "Root Test 證明",
      difficulty: 5,
      tags: ["series", "root-test"],
      statement: "證明根值審斂法的收斂半部。",
      prompt: "\\limsup_{n\\to\\infty}\\sqrt[n]{|a_n|}=L<1\\Rightarrow \\sum a_n\\text{ converges absolutely}",
      hints: ["選 r 使 L<r<1。", "大 n 時 nth root 小於 r。", "用幾何級數比較。"],
      keySteps: ["limsup bound", "geometric comparison", "absolute convergence"],
      solution: [
        { text: "取 r 介於 L 與 1 之間。", tex: "L<r<1" },
        { text: "由 limsup 定義，存在 N，使 n>=N 時根值小於 r。", tex: "n\\ge N\\Rightarrow \\sqrt[n]{|a_n|}\\le r" },
        { text: "因此尾項被幾何級數控制。", tex: "|a_n|\\le r^n\\qquad(n\\ge N)" },
        { text: "幾何級數收斂。", tex: "\\sum_{n=N}^{\\infty}r^n<\\infty" },
        { text: "比較判別法得到絕對收斂。", tex: "\\sum |a_n|<\\infty" }
      ]
    },

    /* ===== 競賽 tier(達摩院 / Putnam 風格長證明)=====
       每題 solution 的可量化主張都由 tools/verify_proof_claims.js
       在具體實例上數值驗證(恆等式 / 不等式 / 漸近行為)。 */
    {
      id: "proof-contest-001",
      tier: "contest",
      title: "Stolz–Cesàro 定理",
      difficulty: 5,
      tags: ["stolz", "sequence", "damo-style"],
      statement: "證明 Stolz–Cesàro 定理(∞/∞ 型):它是數列版的 L'Hôpital。",
      prompt: "b_n\\uparrow\\infty,\\ \\lim_{n\\to\\infty}\\frac{a_{n+1}-a_n}{b_{n+1}-b_n}=L\\Rightarrow \\lim_{n\\to\\infty}\\frac{a_n}{b_n}=L",
      hints: ["把差商夾在 L±ε 之間。", "從 N 望遠鏡疊加到 n。", "除以 b_n,讓固定項被 b_n 吃掉。"],
      keySteps: ["epsilon sandwich", "telescoping sum", "divide by b_n", "limsup = liminf"],
      solution: [
        { text: "給 ε>0。由差商極限,存在 N,使 n≥N 時差商夾在 L±ε 之間(b 遞增使分母為正)。", tex: "(L-\\varepsilon)(b_{n+1}-b_n)<a_{n+1}-a_n<(L+\\varepsilon)(b_{n+1}-b_n)" },
        { text: "把不等式從 N 疊加到 n-1,中間全部望遠鏡相消。", tex: "(L-\\varepsilon)(b_n-b_N)<a_n-a_N<(L+\\varepsilon)(b_n-b_N)" },
        { text: "除以 b_n(夠大時為正),把 a_n/b_n 分離出來。", tex: "\\frac{a_n}{b_n}=\\frac{a_N}{b_n}+\\left(1-\\frac{b_N}{b_n}\\right)\\cdot\\frac{a_n-a_N}{b_n-b_N}" },
        { text: "因 b_n→∞,固定的 a_N/b_n 與 b_N/b_n 都趨於 0,所以上下極限都落在 L±ε。", tex: "L-\\varepsilon\\le\\liminf\\frac{a_n}{b_n}\\le\\limsup\\frac{a_n}{b_n}\\le L+\\varepsilon" },
        { text: "ε 任意小,故極限存在且等於 L。", tex: "\\lim_{n\\to\\infty}\\frac{a_n}{b_n}=L" }
      ]
    },
    {
      id: "proof-contest-002",
      tier: "contest",
      title: "a(n+1)=a(n)+1/a(n) 的漸近行為",
      difficulty: 6,
      tags: ["recursive", "asymptotics", "damo-style"],
      statement: "達摩院風格經典:證明遞迴數列 a_{n+1}=a_n+1/a_n(a_1=1)滿足 a_n ~ √(2n)。",
      prompt: "a_1=1,\\ a_{n+1}=a_n+\\frac{1}{a_n}\\Rightarrow \\lim_{n\\to\\infty}\\frac{a_n}{\\sqrt{2n}}=1",
      hints: ["平方遞迴式。", "先拿下界 a_n^2 ≥ 2n-1。", "把 1/a_k^2 用下界回代,得到上界。"],
      keySteps: ["square the recursion", "lower bound by induction", "upper bound via harmonic sum", "squeeze"],
      solution: [
        { text: "平方遞迴式,得到精確的增量恆等式。", tex: "a_{n+1}^2=a_n^2+2+\\frac{1}{a_n^2}" },
        { text: "由增量至少為 2,歸納得下界。", tex: "a_n^2\\ge a_1^2+2(n-1)=2n-1" },
        { text: "把下界回代增量式中的 1/a_k^2,疊加得上界(和被調和級數控制)。", tex: "a_n^2=2n-1+\\sum_{k=1}^{n-1}\\frac{1}{a_k^2}\\le 2n-1+\\sum_{k=1}^{n-1}\\frac{1}{2k-1}\\le 2n+\\ln n+1" },
        { text: "兩邊除以 2n,夾擠。", tex: "\\frac{2n-1}{2n}\\le\\frac{a_n^2}{2n}\\le\\frac{2n+\\ln n+1}{2n}\\to 1" },
        { text: "開根號即得結論。", tex: "\\frac{a_n}{\\sqrt{2n}}\\to 1" }
      ]
    },
    {
      id: "proof-contest-003",
      tier: "contest",
      title: "x(n+1)=sin x(n) 的 √(3/n) 漸近",
      difficulty: 6,
      tags: ["recursive", "taylor", "stolz", "damo-style"],
      statement: "分析名題:迭代 sin 的數列以 √(3/n) 的速度趨於 0。",
      prompt: "x_1=1,\\ x_{n+1}=\\sin x_n\\Rightarrow \\lim_{n\\to\\infty}\\sqrt{n}\\,x_n=\\sqrt{3}",
      hints: ["先證 x_n 單調遞減趨於 0。", "對 1/x^2 做 Taylor:1/sin²x - 1/x² → 1/3。", "對 1/x_n² 用 Stolz。"],
      keySteps: ["monotone to zero", "Taylor of 1/sin^2", "Stolz on 1/x_n^2", "take square root"],
      solution: [
        { text: "在 (0,1] 上 0<sin x<x,故 x_n 單調遞減且有下界 0;極限 ℓ 滿足 ℓ=sin ℓ,只能是 0。", tex: "x_n\\downarrow 0" },
        { text: "用 sin x = x - x³/6 + O(x⁵) 展開倒數平方,關鍵是常數項 1/3。", tex: "\\frac{1}{\\sin^2 x}-\\frac{1}{x^2}=\\frac13+O(x^2)\\quad(x\\to0)" },
        { text: "代入 x = x_n(它趨於 0),得到相鄰倒數平方的差趨於 1/3。", tex: "\\frac{1}{x_{n+1}^2}-\\frac{1}{x_n^2}\\to\\frac13" },
        { text: "對 c_n = 1/x_n² 與 b_n = n 用 Stolz–Cesàro。", tex: "\\frac{1}{n\\,x_n^2}\\to\\frac13\\iff n\\,x_n^2\\to 3" },
        { text: "開根號得結論。", tex: "\\sqrt{n}\\,x_n\\to\\sqrt3" }
      ]
    },
    {
      id: "proof-contest-004",
      tier: "contest",
      title: "積分形 Cauchy–Schwarz 不等式",
      difficulty: 5,
      tags: ["inequality", "cauchy-schwarz"],
      statement: "用二次式判別式證明積分形 Cauchy–Schwarz。",
      prompt: "\\left(\\int_a^b fg\\right)^2\\le\\int_a^b f^2\\cdot\\int_a^b g^2",
      hints: ["考慮 q(t)=∫(f+tg)²。", "q 是 t 的二次式且恆非負。", "判別式 ≤ 0。"],
      keySteps: ["quadratic in t", "nonnegativity", "discriminant"],
      solution: [
        { text: "對任意實數 t,被積函數是平方,積分非負。", tex: "q(t)=\\int_a^b(f+tg)^2\\,dx\\ge0" },
        { text: "展開成 t 的二次式。", tex: "q(t)=t^2\\int g^2+2t\\int fg+\\int f^2" },
        { text: "若 ∫g²=0(g 恆為 0),兩邊皆 0,不等式成立;否則 q 是開口向上的二次式且恆非負。", tex: "\\int g^2>0" },
        { text: "恆非負的二次式判別式不為正。", tex: "4\\left(\\int fg\\right)^2-4\\int f^2\\int g^2\\le0" },
        { text: "移項即得 Cauchy–Schwarz。", tex: "\\left(\\int fg\\right)^2\\le\\int f^2\\int g^2" }
      ]
    },
    {
      id: "proof-contest-005",
      tier: "contest",
      title: "Young 不等式",
      difficulty: 5,
      tags: ["inequality", "convexity"],
      statement: "用 ln 的凹性證明 Young 不等式(Hölder 的引擎)。",
      prompt: "a,b>0,\\ \\frac1p+\\frac1q=1\\ (p>1)\\Rightarrow ab\\le\\frac{a^p}{p}+\\frac{b^q}{q}",
      hints: ["把 ab 寫成 exp(ln)。", "ln 是凹函數:加權平均在裡面較大。", "權重取 1/p 與 1/q。"],
      keySteps: ["write ab as exp", "concavity of ln", "exponentiate"],
      solution: [
        { text: "ln 在 (0,∞) 上是凹函數(二階導數 -1/x²<0),對權重 1/p+1/q=1 有 Jensen 不等式。", tex: "\\ln\\!\\left(\\frac{u}{p}+\\frac{v}{q}\\right)\\ge\\frac{\\ln u}{p}+\\frac{\\ln v}{q}\\quad(u,v>0)" },
        { text: "取 u=aᵖ,v=b^q。", tex: "\\ln\\!\\left(\\frac{a^p}{p}+\\frac{b^q}{q}\\right)\\ge\\frac{p\\ln a}{p}+\\frac{q\\ln b}{q}=\\ln(ab)" },
        { text: "ln 嚴格遞增,兩邊取 exp 保序。", tex: "\\frac{a^p}{p}+\\frac{b^q}{q}\\ge ab" },
        { text: "等號成立當且僅當 u=v,即 aᵖ=b^q。", tex: "a^p=b^q\\iff\\text{equality}" }
      ]
    },
    {
      id: "proof-contest-006",
      tier: "contest",
      title: "Dirichlet 積分收斂但不絕對收斂",
      difficulty: 6,
      tags: ["improper-integral", "dirichlet", "damo-style"],
      statement: "證明 ∫₀^∞ sin x/x dx 收斂,但 ∫₀^∞ |sin x|/x dx 發散。",
      prompt: "\\int_0^{\\infty}\\frac{\\sin x}{x}dx\\text{ converges},\\qquad \\int_0^{\\infty}\\frac{\\left|\\sin x\\right|}{x}dx=\\infty",
      hints: ["[0,1] 沒有瑕點:sin x/x 可連續延拓。", "尾巴用分部積分,把 1/x 變成 1/x²。", "發散半部:每個半週期至少貢獻 2/((k+1)π)。"],
      keySteps: ["continuous extension near 0", "IBP tail bound 2/a", "Cauchy criterion", "harmonic lower bound"],
      solution: [
        { text: "x→0 時 sin x/x → 1,故 [0,1] 上是普通積分,只需處理尾巴。", tex: "\\lim_{x\\to0}\\frac{\\sin x}{x}=1" },
        { text: "對 1≤a<b 分部積分,把振盪積掉、留下可絕對收斂的 1/x²。", tex: "\\int_a^b\\frac{\\sin x}{x}dx=\\frac{\\cos a}{a}-\\frac{\\cos b}{b}-\\int_a^b\\frac{\\cos x}{x^2}dx" },
        { text: "三項分別以 1/a、1/b、∫dx/x² 估計,得到一致的尾巴上界。", tex: "\\left|\\int_a^b\\frac{\\sin x}{x}dx\\right|\\le\\frac1a+\\frac1b+\\left(\\frac1a-\\frac1b\\right)=\\frac2a" },
        { text: "a→∞ 時上界趨於 0,Cauchy 準則給出收斂。", tex: "\\int_0^{\\infty}\\frac{\\sin x}{x}dx\\ \\text{converges}" },
        { text: "絕對值版本:第 k 個半週期上 1/x ≥ 1/((k+1)π),而 ∫|sin|=2。", tex: "\\int_{k\\pi}^{(k+1)\\pi}\\frac{\\left|\\sin x\\right|}{x}dx\\ge\\frac{2}{(k+1)\\pi}" },
        { text: "對 k 求和是調和級數,發散。", tex: "\\sum_k\\frac{2}{(k+1)\\pi}=\\infty" }
      ]
    },
    {
      id: "proof-contest-007",
      tier: "contest",
      title: "Riemann–Lebesgue 引理(C¹ 版)",
      difficulty: 5,
      tags: ["fourier", "ibp", "riemann-lebesgue"],
      statement: "證明 C¹ 函數對高頻正弦的積分以 1/n 速度趨於 0。",
      prompt: "f\\in C^1([a,b])\\Rightarrow \\int_a^b f(x)\\sin(nx)\\,dx\\to 0\\quad(n\\to\\infty)",
      hints: ["分部積分,把 sin(nx) 積起來。", "邊界項與新積分都帶 1/n。", "用 |f| 與 ∫|f'| 統一估計。"],
      keySteps: ["IBP", "1/n bound", "conclude"],
      solution: [
        { text: "分部積分,把振盪因子積掉。", tex: "\\int_a^b f\\sin(nx)dx=\\left[-\\frac{f(x)\\cos(nx)}{n}\\right]_a^b+\\frac1n\\int_a^b f'(x)\\cos(nx)dx" },
        { text: "邊界項與積分項都以 1/n 為因子估計(|cos|≤1)。", tex: "\\left|\\int_a^b f\\sin(nx)dx\\right|\\le\\frac{|f(a)|+|f(b)|+\\int_a^b|f'|}{n}" },
        { text: "分子是與 n 無關的常數,故整體是 O(1/n)。", tex: "\\int_a^b f\\sin(nx)dx=O\\!\\left(\\frac1n\\right)\\to0" }
      ]
    },
    {
      id: "proof-contest-008",
      tier: "contest",
      title: "Dini 定理",
      difficulty: 6,
      tags: ["uniform-convergence", "compactness"],
      statement: "證明:緊區間上單調收斂到連續函數的連續函數列必一致收斂,並說明緊性不可省。",
      prompt: "f_n\\in C(K),\\ f_n\\uparrow f\\in C(K),\\ K\\text{ compact}\\Rightarrow f_n\\rightrightarrows f",
      hints: ["看差 g_n = f - f_n:連續、遞減、逐點趨於 0。", "E_n = {g_n < ε} 是遞增開覆蓋。", "緊性抽有限子覆蓋。"],
      keySteps: ["reduce to g_n down to 0", "open sets E_n", "finite subcover", "counterexample x^n"],
      solution: [
        { text: "令 g_n = f - f_n:連續、對 n 遞減、逐點趨於 0。", tex: "g_n\\in C(K),\\quad g_n\\downarrow 0\\ \\text{pointwise}" },
        { text: "給 ε>0,集合 E_n 是開集(g_n 連續),且因 g_n 遞減而遞增。", tex: "E_n=\\{x\\in K: g_n(x)<\\varepsilon\\},\\qquad E_1\\subseteq E_2\\subseteq\\cdots" },
        { text: "逐點收斂使每個 x 都落在某個 E_n,故 {E_n} 覆蓋 K。", tex: "K=\\bigcup_n E_n" },
        { text: "K 緊,抽出有限子覆蓋;遞增性讓最大指標 N 一個就夠。", tex: "K=E_N" },
        { text: "n≥N 時 g_n ≤ g_N < ε 在整個 K 上成立,即一致收斂。", tex: "\\sup_K|f-f_n|\\le\\varepsilon\\quad(n\\ge N)" },
        { text: "緊性不可省:x^n 在 [0,1) 上連續單調趨於 0,但 sup 恆為 1,不一致收斂。", tex: "\\sup_{[0,1)}x^n=1\\ \\forall n" }
      ]
    },
    {
      id: "proof-contest-009",
      tier: "contest",
      title: "e 是無理數",
      difficulty: 5,
      tags: ["series", "irrationality", "damo-style"],
      statement: "用級數尾巴估計證明 e 是無理數。",
      prompt: "e=\\sum_{k=0}^{\\infty}\\frac{1}{k!}\\notin\\mathbb{Q}",
      hints: ["令 s_n 為部分和,估計 e - s_n。", "尾巴比幾何級數小:0 < e-s_n < 1/(n!·n)。", "假設 e=p/q,乘上 q! 得到 (0,1) 間的整數。"],
      keySteps: ["tail estimate", "multiply by n!", "integer in (0,1) contradiction"],
      solution: [
        { text: "令 s_n 為前 n+1 項部分和,尾巴用幾何級數比較。", tex: "0<e-s_n=\\sum_{k=n+1}^{\\infty}\\frac{1}{k!}<\\frac{1}{(n+1)!}\\sum_{j=0}^{\\infty}\\frac{1}{(n+1)^j}=\\frac{1}{n!\\,n}" },
        { text: "假設 e = p/q(p,q 為正整數),取 n=q 並乘上 q!。", tex: "q!\\,e=p\\,(q-1)!\\in\\mathbb{Z},\\qquad q!\\,s_q=\\sum_{k=0}^{q}\\frac{q!}{k!}\\in\\mathbb{Z}" },
        { text: "但尾巴估計乘上 q! 後落在 (0,1) 開區間。", tex: "0<q!\\,(e-s_q)<\\frac1q\\le1" },
        { text: "兩個整數之差是整數,卻嚴格落在 0 與 1 之間,矛盾。", tex: "q!\\,e-q!\\,s_q\\in\\mathbb{Z}\\cap(0,1)=\\varnothing" },
        { text: "故 e 是無理數。", tex: "e\\notin\\mathbb{Q}" }
      ]
    },
    {
      id: "proof-contest-010",
      tier: "contest",
      title: "Darboux 定理:導數的中間值性",
      difficulty: 6,
      tags: ["darboux", "mvt", "damo-style"],
      statement: "導數不必連續,卻仍有中間值性:證明 Darboux 定理。",
      prompt: "f\\ \\text{differentiable on }[a,b],\\ f'(a)<y<f'(b)\\Rightarrow\\exists c\\in(a,b),\\ f'(c)=y",
      hints: ["設 g(x)=f(x)-yx,把問題化成 g'(c)=0。", "g 在緊區間上取到最小值。", "端點導數符號排除端點,內點極值用 Fermat。"],
      keySteps: ["auxiliary g(x)=f(x)-yx", "extreme value theorem", "endpoints excluded", "Fermat"],
      solution: [
        { text: "設輔助函數,把 y 吸收進去。", tex: "g(x)=f(x)-yx,\\qquad g'(a)=f'(a)-y<0,\\quad g'(b)=f'(b)-y>0" },
        { text: "g 連續(可微),在緊區間 [a,b] 上取得最小值,設在 c。", tex: "g(c)=\\min_{[a,b]}g" },
        { text: "g'(a)<0 表示 a 右側附近有比 g(a) 更小的值,最小值不在 a;同理 g'(b)>0 排除 b。", tex: "c\\in(a,b)" },
        { text: "內點最小值且 g 可微,Fermat 定理給出導數為 0。", tex: "g'(c)=0" },
        { text: "展開 g' 即得結論;注意 f' 可以不連續,IVT 不能直接用在 f' 上,這正是本定理的價值。", tex: "f'(c)=y" }
      ]
    },
    {
      id: "proof-contest-011",
      tier: "contest",
      title: "Gronwall 不等式",
      difficulty: 6,
      tags: ["gronwall", "ode", "inequality"],
      statement: "證明 Gronwall 不等式:ODE 解的唯一性與穩定性的核心工具。",
      prompt: "u\\ge0,\\ u(t)\\le\\alpha+\\int_0^t\\beta(s)u(s)ds\\ (\\alpha>0,\\ \\beta\\ge0)\\Rightarrow u(t)\\le\\alpha\\,e^{\\int_0^t\\beta(s)ds}",
      hints: ["令 v(t) 為右邊,注意 v(0)=α 且 v'=βu。", "用假設 u≤v 得 v'≤βv。", "對 ln v 微分,積分回來。"],
      keySteps: ["define v = RHS", "v' = beta u <= beta v", "(ln v)' <= beta", "integrate"],
      solution: [
        { text: "令 v 為不等式右邊;因 βu≥0,v 遞增,故 v≥α>0(這裡用到 u≥0,否則 v 可能碰到 0)。", tex: "v(t)=\\alpha+\\int_0^t\\beta(s)u(s)ds,\\qquad v'(t)=\\beta(t)u(t),\\qquad v\\ge\\alpha>0" },
        { text: "假設給的是 u≤v,配合 β≥0,得到 v 的微分不等式。", tex: "v'(t)=\\beta(t)u(t)\\le\\beta(t)v(t)" },
        { text: "v>0,可以除過去:ln v 的導數被 β 控制。", tex: "\\frac{d}{dt}\\ln v(t)=\\frac{v'(t)}{v(t)}\\le\\beta(t)" },
        { text: "從 0 積到 t。", tex: "\\ln v(t)-\\ln\\alpha\\le\\int_0^t\\beta(s)ds" },
        { text: "取 exp 並用 u≤v 收尾;α=0 的情形對 α↓0 取極限即可。", tex: "u(t)\\le v(t)\\le\\alpha\\,e^{\\int_0^t\\beta(s)ds}" }
      ]
    },
    {
      id: "proof-contest-012",
      tier: "contest",
      title: "邊界層極限 n∫x^n f(x)dx → f(1)",
      difficulty: 5,
      tags: ["boundary-layer", "epsilon-delta", "damo-style"],
      statement: "證明質量集中現象:n∫₀¹xⁿf(x)dx → f(1)(f 連續)。",
      prompt: "f\\in C([0,1])\\Rightarrow \\lim_{n\\to\\infty}n\\int_0^1x^nf(x)\\,dx=f(1)",
      hints: ["先算常數的情形:n∫xⁿdx = n/(n+1) → 1。", "把 f(x) 換成 f(x)-f(1),拆 [0,1-δ] 與 [1-δ,1]。", "前段被 (1-δ)ⁿ 壓死,後段用連續性。"],
      keySteps: ["constant case", "split at 1-delta", "geometric decay", "continuity near 1"],
      solution: [
        { text: "常數情形直接積分。", tex: "n\\int_0^1x^nf(1)dx=\\frac{n}{n+1}f(1)\\to f(1)" },
        { text: "只需證差趨於 0。給 ε>0,由 f 在 1 連續,取 δ 使 |f(x)-f(1)|<ε 於 [1-δ,1]。", tex: "D_n=n\\int_0^1x^n\\left(f(x)-f(1)\\right)dx" },
        { text: "前段 [0,1-δ]:被積函數以 M=2max|f| 與 (1-δ)ⁿ 控制,幾何衰減壓過線性的 n。", tex: "\\left|n\\int_0^{1-\\delta}x^n(f-f(1))dx\\right|\\le Mn(1-\\delta)^{n+1}\\to0" },
        { text: "後段 [1-δ,1]:用連續性的 ε 估計。", tex: "\\left|n\\int_{1-\\delta}^1x^n(f-f(1))dx\\right|\\le\\varepsilon\\, n\\int_0^1x^ndx\\le\\varepsilon" },
        { text: "故 limsup|D_n| ≤ ε 對任意 ε 成立,即 D_n→0,結論成立。", tex: "\\lim_{n\\to\\infty}n\\int_0^1x^nf(x)dx=f(1)" }
      ]
    },

    /* ===== Lean tier:真.機器驗證 =====
       把 statement 裡的骨架貼到 https://live.lean-lang.org,把 sorry 補完;
       編譯零錯誤 = 證明被 Lean 核心機器認證。每題的 lean 欄位是參考解答,
       由 tools/verify_lean_proofs.js 實際編譯驗證(WSL + elan)。
       solution steps:text 是 tactic 指令,tex 是該步之後的目標狀態。 */
    {
      id: "proof-lean-001",
      tier: "lean",
      title: "rfl:定義上就相等",
      difficulty: 1,
      tags: ["lean", "rfl"],
      statement: "第一課:2+2=4 在 Lean 裡「算一算就相等」。貼上並補完:example : 2 + 2 = 4 := by sorry",
      prompt: "2+2=4",
      hints: ["Lean 會把兩邊算到底,算出同一個值就叫定義相等。", "有一個 tactic 專門收掉這種目標:rfl。"],
      keySteps: ["rfl"],
      lean: "example : 2 + 2 = 4 := by rfl",
      leanSkeleton: "example : 2 + 2 = 4 := by\n  sorry",
      solution: [
        { text: "目標是一個等式,兩邊都是封閉的算式。", tex: "\\vdash 2+2=4" },
        { text: "rfl(reflexivity)要求 Lean 把兩邊 normalize:都變成 4。", tex: "4=4" },
        { text: "完整解答:example : 2 + 2 = 4 := by rfl", tex: "\\blacksquare" }
      ]
    },
    {
      id: "proof-lean-002",
      tier: "lean",
      title: "intro / exact:蘊含就是函數",
      difficulty: 1,
      tags: ["lean", "intro", "exact"],
      statement: "證 p → (q → p):拿到 p 之後,不管 q 是什麼都能還你 p。貼上並補完:example (p q : Prop) (hp : p) : q → p := by sorry",
      prompt: "p\\Rightarrow(q\\Rightarrow p)",
      hints: ["目標是 q → p:先用 intro 把 q 的證明拿進來。", "手上已經有 hp : p,用 exact hp 交卷。"],
      keySteps: ["intro", "exact"],
      lean: "example (p q : Prop) (hp : p) : q → p := by\n  intro _\n  exact hp",
      leanSkeleton: "example (p q : Prop) (hp : p) : q → p := by\n  sorry",
      solution: [
        { text: "初始目標:已知 hp : p,要證 q → p。", tex: "hp:p\\ \\vdash\\ q\\to p" },
        { text: "intro _ 把 q 的證明取進來(用不到,取名 _),目標剩 p。", tex: "hp:p\\ \\vdash\\ p" },
        { text: "exact hp:手上就有,直接交出。這正是「蘊含 = 函數」:整個證明其實是 fun _ => hp。", tex: "\\blacksquare" }
      ]
    },
    {
      id: "proof-lean-003",
      tier: "lean",
      title: "And:證明是一個配對",
      difficulty: 1,
      tags: ["lean", "and", "constructor"],
      statement: "p ∧ q 的證明就是⟨p 的證明, q 的證明⟩這個配對。貼上並補完:example (p q : Prop) (hp : p) (hq : q) : p ∧ q := by sorry",
      prompt: "p,\\ q\\ \\vdash\\ p\\land q",
      hints: ["constructor 把 ∧ 拆成兩個子目標。", "或直接一行:exact ⟨hp, hq⟩(尖括號打 \\< \\>)。"],
      keySteps: ["constructor", "anonymous constructor ⟨,⟩"],
      lean: "example (p q : Prop) (hp : p) (hq : q) : p ∧ q := by\n  constructor\n  · exact hp\n  · exact hq",
      leanSkeleton: "example (p q : Prop) (hp : p) (hq : q) : p ∧ q := by\n  sorry",
      solution: [
        { text: "目標 p ∧ q。constructor 拆成兩個子目標。", tex: "\\vdash p\\quad\\text{and}\\quad\\vdash q" },
        { text: "兩個子目標分別用 exact hp、exact hq 收掉(· 是子目標聚焦符號)。", tex: "\\blacksquare" },
        { text: "行家寫法:example ... := ⟨hp, hq⟩ — 證明就是資料,∧ 的證明就是個 pair。", tex: "\\langle h_p,h_q\\rangle" }
      ]
    },
    {
      id: "proof-lean-004",
      tier: "lean",
      title: "Or / cases:分情況討論",
      difficulty: 2,
      tags: ["lean", "or", "cases"],
      statement: "證 p ∨ q → q ∨ p:紙筆的「分兩種情況」在 Lean 是 cases。貼上並補完:example (p q : Prop) (h : p ∨ q) : q ∨ p := by sorry",
      prompt: "p\\lor q\\Rightarrow q\\lor p",
      hints: ["cases h with | inl hp => … | inr hq => … 分成左右兩支。", "左支手上是 p,要證 q ∨ p:選右邊,Or.inr hp。"],
      keySteps: ["cases", "Or.inl / Or.inr"],
      lean: "example (p q : Prop) (h : p ∨ q) : q ∨ p := by\n  cases h with\n  | inl hp => exact Or.inr hp\n  | inr hq => exact Or.inl hq",
      leanSkeleton: "example (p q : Prop) (h : p ∨ q) : q ∨ p := by\n  sorry",
      solution: [
        { text: "h : p ∨ q 有兩種來源,cases 把證明分成兩支。", tex: "\\text{case }1:\\ h_p:p\\qquad\\text{case }2:\\ h_q:q" },
        { text: "第一支:有 p,目標 q ∨ p 選右側,Or.inr hp。", tex: "\\vdash q\\lor p\\ \\Leftarrow\\ p" },
        { text: "第二支:有 q,選左側,Or.inl hq。兩支都收掉,證明完成。", tex: "\\blacksquare" }
      ]
    },
    {
      id: "proof-lean-005",
      tier: "lean",
      title: "存在量詞:交出見證",
      difficulty: 2,
      tags: ["lean", "exists"],
      statement: "證 ∃ n, n·n = 36:紙筆寫「取 n=6」,Lean 寫 ⟨6, 證明⟩。貼上並補完:example : ∃ n : Nat, n * n = 36 := by sorry",
      prompt: "\\exists n\\in\\mathbb{N},\\ n\\cdot n=36",
      hints: ["exact ⟨6, ?⟩:第一格是見證,第二格是 6*6=36 的證明。", "6*6=36 算一算就相等——rfl。"],
      keySteps: ["witness", "rfl"],
      lean: "example : ∃ n : Nat, n * n = 36 := by\n  exact ⟨6, rfl⟩",
      leanSkeleton: "example : ∃ n : Nat, n * n = 36 := by\n  sorry",
      solution: [
        { text: "∃ 的證明 = ⟨見證, 該見證滿足性質的證明⟩。", tex: "\\langle 6,\\ ?\\,\\rangle" },
        { text: "代入見證後剩 6·6=36,封閉算式用 rfl。", tex: "6\\cdot6=36" },
        { text: "完整解答:exact ⟨6, rfl⟩。「取 c=…」從此不能再唬爛——Lean 要你真的交出那個 c。", tex: "\\blacksquare" }
      ]
    },
    {
      id: "proof-lean-006",
      tier: "lean",
      title: "rw:等式改寫",
      difficulty: 2,
      tags: ["lean", "rw"],
      statement: "已知 a = b,證 a + a = b + b:用 rw 把目標裡的 a 全部換成 b。貼上並補完:example (a b : Nat) (h : a = b) : a + a = b + b := by sorry",
      prompt: "a=b\\Rightarrow a+a=b+b",
      hints: ["rw [h] 會把目標中的 a 改寫成 b。", "改寫完兩邊相同,rw 會自動用 rfl 收尾。"],
      keySteps: ["rw"],
      lean: "example (a b : Nat) (h : a = b) : a + a = b + b := by\n  rw [h]",
      leanSkeleton: "example (a b : Nat) (h : a = b) : a + a = b + b := by\n  sorry",
      solution: [
        { text: "初始目標。", tex: "h:a=b\\ \\vdash\\ a+a=b+b" },
        { text: "rw [h]:目標中每個 a 都被 h 改寫成 b。", tex: "\\vdash b+b=b+b" },
        { text: "兩邊字面相同,rw 自動 rfl 收尾。這就是「代入」的機器版。", tex: "\\blacksquare" }
      ]
    },
    {
      id: "proof-lean-007",
      tier: "lean",
      title: "induction:歸納法",
      difficulty: 3,
      tags: ["lean", "induction"],
      statement: "證 0 + n = n。注意:Nat 的加法是對右邊遞迴定義的,所以 n + 0 = n 是 rfl,但 0 + n = n 真的需要歸納!貼上並補完:example (n : Nat) : 0 + n = n := by sorry",
      prompt: "\\forall n\\in\\mathbb{N},\\ 0+n=n",
      hints: ["induction n with | zero => … | succ k ih => …", "zero 支:0+0=0 是 rfl。", "succ 支:先 rw [Nat.add_succ] 再用歸納假設 ih。"],
      keySteps: ["induction", "Nat.add_succ", "ih"],
      lean: "example (n : Nat) : 0 + n = n := by\n  induction n with\n  | zero => rfl\n  | succ k ih => rw [Nat.add_succ, ih]",
      leanSkeleton: "example (n : Nat) : 0 + n = n := by\n  sorry",
      solution: [
        { text: "induction n 拆成基底與歸納步。", tex: "\\text{base}:\\ 0+0=0\\qquad\\text{step}:\\ 0+(k+1)=k+1" },
        { text: "基底:兩邊都算成 0,rfl。", tex: "0=0" },
        { text: "歸納步:Nat.add_succ 把 0+(k+1) 改寫成 (0+k)+1,再用歸納假設 ih : 0+k=k。", tex: "(0+k)+1=k+1\\ \\xrightarrow{ih}\\ k+1=k+1" },
        { text: "數學歸納法在 Lean 就是對資料結構的遞迴——證明和程式是同一件事。", tex: "\\blacksquare" }
      ]
    },
    {
      id: "proof-lean-008",
      tier: "lean",
      title: "組合拳:偶數的平方是偶數",
      difficulty: 3,
      tags: ["lean", "exists", "rw"],
      statement: "已知 n = 2k,證 ∃ m, n·n = 2m:見證 + 改寫 + 結合律一起上。貼上並補完:example (n k : Nat) (h : n = 2 * k) : ∃ m, n * n = 2 * m := by sorry",
      prompt: "n=2k\\Rightarrow\\exists m,\\ n^2=2m",
      hints: ["見證取 m = k*(2*k),因為 (2k)(2k) = 2·(k·(2k))。", "先 rw [h] 把 n 換掉,再 rw [Nat.mul_assoc] 調括號。"],
      keySteps: ["witness m = k*(2k)", "rw [h]", "Nat.mul_assoc"],
      lean: "example (n k : Nat) (h : n = 2 * k) : ∃ m, n * n = 2 * m := by\n  exact ⟨k * (2 * k), by rw [h, Nat.mul_assoc]⟩",
      leanSkeleton: "example (n k : Nat) (h : n = 2 * k) : ∃ m, n * n = 2 * m := by\n  sorry",
      solution: [
        { text: "交出見證 m = k·(2k),剩下要證 n·n = 2·(k·(2k))。", tex: "\\vdash n\\cdot n=2\\cdot(k\\cdot(2k))" },
        { text: "rw [h]:把 n 換成 2k。", tex: "\\vdash (2k)(2k)=2(k(2k))" },
        { text: "rw [Nat.mul_assoc]:把左邊 (2·k)·(2k) 的括號重排成 2·(k·(2k)),兩邊相同。", tex: "2\\cdot(k\\cdot(2k))=2\\cdot(k\\cdot(2k))" },
        { text: "之後想證真正的分析題(MVT、ε-δ)就要 import Mathlib——那裡有 ℝ、導數與我們競賽 tier 的全部定理。", tex: "\\blacksquare" }
      ]
    },
    /* ── 東大杉浦《解析演習》章末問題（第 II、III、IV 章）───────────────────────
       原題日文，中譯自 PDF。這一族的證明大多是 3–6 步的經典論證；
       每一題可算的主張都在 tools/verify_proof_claims.js 用具體例子驗過。 */
    {
      id: "proof-todai-201",
      tier: "todai",
      title: "東大 II-1：唯一的不動點",
      difficulty: 4,
      tags: ["ivt", "mvt", "fixed-point", "todai"],
      statement: "設 f 在 [0,1] 上連續、在 (0,1) 上可微，0 ≤ f(x) ≤ 1，且 f′(x) ≠ 1（∀x ∈ (0,1)）。證明恰有一個 x ∈ [0,1] 使 f(x) = x。",
      prompt: "0\\le f\\le 1,\\ f'\\ne 1\\ \\Rightarrow\\ \\exists!\\,x\\in[0,1]:\\ f(x)=x",
      hints: ["存在性：看 g(x) = f(x) − x 在兩端的正負。", "唯一性：兩個不動點 a < b 之間用平均值定理。", "f(b) − f(a) = b − a 會逼出 f′(ξ) = 1。"],
      keySteps: ["auxiliary g = f − x", "IVT for existence", "MVT between two fixed points", "f′(ξ) = 1 contradiction"],
      solution: [
        { text: "令 g(x) = f(x) − x。g 連續，且兩端異號（或已經是零）。", tex: "g(0)=f(0)\\ge 0,\\qquad g(1)=f(1)-1\\le 0" },
        { text: "若 g(0) = 0 或 g(1) = 0 就找到了；否則 g(0) > 0 > g(1)，由中間值定理存在 c ∈ (0,1) 使 g(c) = 0。", tex: "\\exists c\\in[0,1]:\\ f(c)=c" },
        { text: "唯一性：反設 a < b 都是不動點。對 f 在 [a,b] 用平均值定理。", tex: "f(b)-f(a)=f'(\\xi)(b-a),\\quad \\xi\\in(a,b)" },
        { text: "但 f(b) − f(a) = b − a，所以 f′(ξ) = 1，與 f′ ≠ 1 矛盾。故不動點唯一。", tex: "b-a=f'(\\xi)(b-a)\\ \\Rightarrow\\ f'(\\xi)=1" }
      ]
    },
    {
      id: "proof-todai-202",
      tier: "todai",
      title: "東大 II-2：|f| ≤ A、|f″| ≤ B ⇒ |f′| ≤ 2√(AB)",
      difficulty: 4,
      tags: ["taylor", "inequality", "landau", "todai"],
      statement: "設 f 在 (0,∞) 上二次可微，|f(x)| ≤ A、|f″(x)| ≤ B（∀x > 0）。證明 |f′(x)| ≤ 2√(AB)。",
      prompt: "|f|\\le A,\\ |f''|\\le B\\ \\Rightarrow\\ |f'|\\le 2\\sqrt{AB}",
      hints: ["對任意 h > 0 寫泰勒展開到二階（Lagrange 餘項）。", "把 f′(x) 解出來，用三角不等式，得到一個含 h 的上界。", "上界 2A/h + Bh/2 對 h 取最小值。"],
      keySteps: ["Taylor with Lagrange remainder", "solve for f′(x)", "bound 2A/h + Bh/2", "optimize h = 2√(A/B)"],
      solution: [
        { text: "任取 x > 0、h > 0。由泰勒定理存在 ξ ∈ (x, x+h)。", tex: "f(x+h)=f(x)+hf'(x)+\\frac{h^2}{2}f''(\\xi)" },
        { text: "解出 f′(x)，三角不等式，再用題目的界。", tex: "|f'(x)|\\le\\frac{|f(x+h)|+|f(x)|}{h}+\\frac{h}{2}|f''(\\xi)|\\le\\frac{2A}{h}+\\frac{Bh}{2}" },
        { text: "右邊對 h > 0 取最小：算幾不等式（或微分）給出最小值在 h = 2√(A/B)。", tex: "\\frac{2A}{h}+\\frac{Bh}{2}\\ge 2\\sqrt{\\frac{2A}{h}\\cdot\\frac{Bh}{2}}=2\\sqrt{AB}" },
        { text: "h 可以任取，取 h = 2√(A/B) 就得到等號的那個界；x 任意，故處處成立。", tex: "|f'(x)|\\le 2\\sqrt{AB}\\quad(\\forall x>0)" }
      ]
    },
    {
      id: "proof-todai-204",
      tier: "todai",
      title: "東大 II-4：Hermite 多項式有 n 個實根",
      difficulty: 5,
      tags: ["hermite", "rolle", "induction", "todai"],
      statement: "定義 H_n(x) = (−1)^n e^{x²/2} (d/dx)^n e^{−x²/2}。證明 H_n 是 n 次多項式，且恰有 n 個相異實根。",
      prompt: "H_n(x)=(-1)^n e^{x^2/2}\\frac{d^n}{dx^n}e^{-x^2/2}\\ \\text{is a degree-}n\\text{ polynomial with }n\\text{ real roots}",
      hints: ["先推遞迴式 H_{n+1} = xH_n − H_n′。", "次數與首項係數用歸納。", "根：對 φ_n = e^{−x²/2}H_n 用 Rolle，兩端 φ_n → 0 各多給一個根。"],
      keySteps: ["recurrence H_{n+1} = xH_n − H_n′", "degree by induction", "Rolle on e^{−x²/2}H_n", "extra roots from decay at ±∞"],
      solution: [
        { text: "把定義寫成 (d/dx)^n e^{−x²/2} = (−1)^n e^{−x²/2} H_n，再微分一次，得遞迴式。", tex: "H_{n+1}(x)=xH_n(x)-H_n'(x)" },
        { text: "H_0 = 1。若 H_n 是首項係數 1 的 n 次多項式，xH_n 是 n+1 次、H_n′ 只有 n−1 次，故 H_{n+1} 是首項係數 1 的 n+1 次多項式。", tex: "H_1=x,\\ H_2=x^2-1,\\ H_3=x^3-3x,\\ H_4=x^4-6x^2+3" },
        { text: "歸納假設 H_n 有 n 個相異實根 x_1 < ⋯ < x_n。令 φ_n(x) = e^{−x²/2}H_n(x)，它在這 n 點為零，且 φ_n(x) → 0（x → ±∞）。", tex: "\\varphi_n'(x)=-e^{-x^2/2}H_{n+1}(x)" },
        { text: "Rolle：每兩個相鄰零點之間 φ_n′ 有一個零點（n−1 個）；又 φ_n 在 (−∞, x_1) 與 (x_n, ∞) 上從 0 出發又回到 0，各再給一個零點。共 n+1 個相異實根，全是 H_{n+1} 的根。", tex: "\\#\\{H_{n+1}=0\\}\\ge (n-1)+2=n+1=\\deg H_{n+1}" }
      ]
    },
    {
      id: "proof-todai-205",
      tier: "todai",
      title: "東大 II-5：exp(−1/x²) 是無限次可微的",
      difficulty: 5,
      tags: ["smooth", "induction", "limit", "todai"],
      statement: "設 f(x) = e^{−1/x²}（x > 0）、f(x) = 0（x ≤ 0）。證明 f 在 ℝ 上無限次可微。",
      prompt: "f(x)=\\begin{cases}e^{-1/x^2}&x>0\\\\0&x\\le 0\\end{cases}\\ \\in C^\\infty(\\mathbb{R})",
      hints: ["x > 0 時 f^{(n)}(x) = P_n(1/x) e^{−1/x²}，P_n 是多項式（歸納）。", "難的只有 x = 0 這一點：用定義算 f^{(n)}(0)。", "關鍵極限：t^k e^{−t²} → 0（t → ∞），指數贏過任何多項式。"],
      keySteps: ["form P_n(1/x)e^{−1/x²} by induction", "derivative at 0 by definition", "t^k e^{−t²} → 0", "all derivatives continuous"],
      solution: [
        { text: "x > 0 時歸納：若 f^{(n)}(x) = P_n(1/x)e^{−1/x²}，微分一次仍是同樣的形。", tex: "P_{n+1}(t)=2t^3P_n(t)-t^2P_n'(t),\\qquad P_0=1,\\ P_1(t)=2t^3" },
        { text: "x < 0 時 f ≡ 0，所有導數為 0。剩下 x = 0。", tex: "f^{(n)}(x)=0\\quad(x<0)" },
        { text: "歸納證 f^{(n)}(0) = 0：右導數的差商是 (1/h)P_n(1/h)e^{−1/h²}，令 t = 1/h → ∞，它是 tP_n(t)e^{−t²} → 0；左導數顯然是 0。", tex: "\\lim_{t\\to\\infty}t^k e^{-t^2}=0\\ (\\forall k)\\ \\Rightarrow\\ f^{(n+1)}(0)=0" },
        { text: "同一個極限也給出 f^{(n)}(x) → 0（x → 0+），所以每一階導數都連續：f ∈ C^∞。", tex: "\\lim_{x\\to 0^+}P_n(1/x)e^{-1/x^2}=0=f^{(n)}(0)" }
      ]
    },
    {
      id: "proof-todai-206",
      tier: "todai",
      title: "東大 II-6：加權 Jensen 不等式",
      difficulty: 4,
      tags: ["jensen", "convexity", "inequality", "todai"],
      statement: "設 f 在開區間 I 上 f″ ≥ 0。證明對任意 x_1,…,x_n ∈ I 與 p_i ≥ 0、Σp_i = 1，有 Σ p_i f(x_i) ≥ f(Σ p_i x_i)。",
      prompt: "f''\\ge 0\\ \\Rightarrow\\ \\sum_{i=1}^n p_i f(x_i)\\ge f\\Big(\\sum_{i=1}^n p_i x_i\\Big)",
      hints: ["f″ ≥ 0 給的是切線不等式：f(y) ≥ f(m) + f′(m)(y − m)。", "把切線畫在 m = Σ p_i x_i 那一點。", "乘 p_i 相加，一次項自動消掉。"],
      keySteps: ["tangent-line inequality from f″ ≥ 0", "tangent at the weighted mean", "sum with weights", "linear term vanishes"],
      solution: [
        { text: "f″ ≥ 0 ⇒ f′ 遞增 ⇒ 切線不等式：對任意 m, y ∈ I，由平均值定理 f(y) − f(m) = f′(η)(y − m) 且 f′(η) 與 f′(m) 的大小關係跟 y − m 同向。", tex: "f(y)\\ge f(m)+f'(m)(y-m)\\quad(\\forall y,m\\in I)" },
        { text: "令 m = Σ p_i x_i（凸組合，仍在 I 裡）。對每個 x_i 用切線不等式。", tex: "f(x_i)\\ge f(m)+f'(m)(x_i-m)" },
        { text: "乘 p_i 相加：Σ p_i = 1，而 Σ p_i (x_i − m) = m − m = 0。", tex: "\\sum p_i f(x_i)\\ge f(m)+f'(m)\\sum p_i(x_i-m)=f(m)" }
      ]
    },
    {
      id: "proof-todai-207",
      tier: "todai",
      title: "東大 II-7：Wronskian 與線性相關",
      difficulty: 6,
      tags: ["wronskian", "linear-dependence", "cramer", "todai"],
      statement: "設 f_1,…,f_n 在開區間 I 上 C^{n−1}，W = W(f_1,…,f_n) 為 Wronskian。證明：(1) 線性相關 ⇒ W ≡ 0；(2) 若 W ≡ 0 而 W(f_1,…,f_{n−1})(x_0) ≠ 0，則在 x_0 附近 f_n 是 f_1,…,f_{n−1} 的線性組合。",
      prompt: "\\text{dependent}\\Rightarrow W\\equiv 0;\\quad W\\equiv 0,\\ W(f_1,\\dots,f_{n-1})(x_0)\\ne 0\\Rightarrow f_n=\\sum_{i<n}c_if_i\\ \\text{near }x_0",
      hints: ["(1)：Σc_i f_i ≡ 0 微分 n−1 次，c 是每一點 Wronskian 矩陣的核向量。", "(2)：用 Cramer 在 x_0 附近解出 c_i(x)，先讓前 n−1 個方程成立。", "再證 c_i′(x) = 0：微分方程組、跟下一列相減。"],
      keySteps: ["differentiate the dependence n−1 times", "nonzero kernel vector ⇒ det = 0", "Cramer near x_0 gives smooth c_i(x)", "show c_i′ = 0 using W_n ≡ 0"],
      solution: [
        { text: "(1) 若 Σ c_i f_i ≡ 0 且 c ≠ 0，逐次微分得 Σ c_i f_i^{(k)} ≡ 0（k = 0,…,n−1）：c 是 Wronskian 矩陣在每一點的非零核向量。", tex: "\\begin{pmatrix}f_1&\\cdots&f_n\\\\ \\vdots&&\\vdots\\\\ f_1^{(n-1)}&\\cdots&f_n^{(n-1)}\\end{pmatrix}c=0\\ \\Rightarrow\\ W\\equiv 0" },
        { text: "(2) W_{n−1}(x_0) ≠ 0，連續性給一個鄰域 J 上 W_{n−1} ≠ 0。在 J 上用 Cramer 解前 n−1 個方程，得 C^1 的係數 c_i(x)。", tex: "\\sum_{i<n}c_i(x)f_i^{(k)}(x)=f_n^{(k)}(x),\\quad k=0,\\dots,n-2" },
        { text: "把第 k 個方程微分、減去第 k+1 個方程，得 Σ c_i′ f_i^{(k)} = 0（k = 0,…,n−3）；k = n−2 那一個微分後多出 Σ c_i f_i^{(n−1)} 這一項。", tex: "\\sum_{i<n}c_i'f_i^{(k)}=0\\ (k\\le n-3),\\qquad\\sum_{i<n}c_i'f_i^{(n-2)}+\\sum_{i<n}c_if_i^{(n-1)}=f_n^{(n-1)}" },
        { text: "W_n ≡ 0 且 W_{n−1} ≠ 0：Wronskian 矩陣的第 n 欄是前 n−1 欄的組合，係數由前 n−1 列唯一決定，正是 c_i(x)；所以第 n−1 列也成立 f_n^{(n−1)} = Σ c_i f_i^{(n−1)}。代回上式得 Σ c_i′ f_i^{(n−2)} = 0，於是 c′ 在 W_{n−1} 矩陣的核裡，c′ ≡ 0：c_i 是常數，f_n = Σ c_i f_i。", tex: "W_{n-1}\\,c'=0,\\ W_{n-1}\\ne 0\\ \\Rightarrow\\ c'\\equiv 0\\ \\Rightarrow\\ f_n=\\sum_{i<n}c_if_i\\ \\text{on }J" }
      ]
    },
    {
      id: "proof-todai-208",
      tier: "todai",
      title: "東大 II-8：對稱差商給二階導數",
      difficulty: 3,
      tags: ["taylor", "second-derivative", "limit", "todai"],
      statement: "證明：(1) f 在原點附近 C²，則 f″(0) = lim_{x→0} (f(x) + f(−x) − 2f(0))/x²；(2) f(x,y) 在原點附近 C²，則 f_xy(0,0) = lim_{t→0} (f(t,t) − f(t,0) − f(0,t) + f(0,0))/t²。",
      prompt: "f''(0)=\\lim_{x\\to 0}\\frac{f(x)+f(-x)-2f(0)}{x^2},\\qquad f_{xy}(0,0)=\\lim_{t\\to 0}\\frac{f(t,t)-f(t,0)-f(0,t)+f(0,0)}{t^2}",
      hints: ["Peano 餘項的泰勒展開到二階。", "f(x) 與 f(−x) 相加，一階項抵消。", "(2) 用二元的二階泰勒展開，只有 xy 那一項留下來。"],
      keySteps: ["Taylor with Peano remainder", "odd terms cancel in f(x)+f(−x)", "two-variable Taylor", "only the mixed term survives"],
      solution: [
        { text: "(1) 二階泰勒（Peano 餘項）：f(±x) = f(0) ± f′(0)x + f″(0)x²/2 + o(x²)。", tex: "f(x)+f(-x)-2f(0)=f''(0)x^2+o(x^2)" },
        { text: "除以 x² 取極限即得 (1)。", tex: "\\lim_{x\\to 0}\\frac{f(x)+f(-x)-2f(0)}{x^2}=f''(0)" },
        { text: "(2) 二元二階泰勒：f(h,k) = f + f_x h + f_y k + (f_xx h² + 2 f_xy hk + f_yy k²)/2 + o(h²+k²)（各偏導在原點取值）。", tex: "f(t,t)-f(t,0)-f(0,t)+f(0,0)=f_{xy}(0,0)t^2+o(t^2)" },
        { text: "代 (t,t)、(t,0)、(0,t)、(0,0) 四點：一階項與 f_xx、f_yy 項兩兩抵消，只剩 f_xy t²。除以 t² 取極限。", tex: "\\lim_{t\\to 0}\\frac{f(t,t)-f(t,0)-f(0,t)+f(0,0)}{t^2}=f_{xy}(0,0)" }
      ]
    },
    {
      id: "proof-todai-211",
      tier: "todai",
      title: "東大 II-11：正交座標變換下的 Laplacian",
      difficulty: 4,
      tags: ["chain-rule", "laplacian", "orthogonal", "multivariable", "todai"],
      statement: "在 ℝⁿ 中考慮正交座標變換 x = Py（P 正交矩陣）。若 f(x) = g(y)，證明 Σ ∂²f/∂x_i² = Σ ∂²g/∂y_i² 且 Σ (∂f/∂x_i)² = Σ (∂g/∂y_i)²。",
      prompt: "x=Py,\\ P^{\\mathsf T}P=I,\\ f(x)=g(y)\\ \\Rightarrow\\ \\Delta_x f=\\Delta_y g,\\ |\\nabla_x f|=|\\nabla_y g|",
      hints: ["連鎖律：∇_y g = Pᵀ ∇_x f。", "Hessian 也一樣：H_y g = Pᵀ (H_x f) P。", "正交矩陣保長度、相似變換保 trace。"],
      keySteps: ["chain rule ∇g = Pᵀ∇f", "|Pᵀv| = |v|", "Hessian transforms by congruence", "trace is similarity invariant"],
      solution: [
        { text: "連鎖律：∂g/∂y_i = Σ_j (∂f/∂x_j)(∂x_j/∂y_i) = Σ_j P_{ji} ∂f/∂x_j，即梯度以 Pᵀ 變換。", tex: "\\nabla_y g=P^{\\mathsf T}\\nabla_x f" },
        { text: "正交矩陣保長度：|Pᵀv|² = vᵀPPᵀv = |v|²。", tex: "\\sum_i\\Big(\\frac{\\partial g}{\\partial y_i}\\Big)^2=|P^{\\mathsf T}\\nabla_x f|^2=|\\nabla_x f|^2" },
        { text: "再微分一次（P 是常數矩陣）：Hessian 以合同變換。", tex: "H_y g=P^{\\mathsf T}(H_x f)P" },
        { text: "Laplacian 是 Hessian 的 trace，而 Pᵀ = P⁻¹，所以 Pᵀ H P 與 H 相似、trace 相等。", tex: "\\Delta_y g=\\operatorname{tr}(P^{-1}H_xfP)=\\operatorname{tr}H_xf=\\Delta_x f" }
      ]
    },
    {
      id: "proof-todai-212",
      tier: "todai",
      title: "東大 II-12：lim Π(1 + k/n²) = √e",
      difficulty: 3,
      tags: ["limit", "product", "squeeze", "log", "todai"],
      statement: "求 lim_{n→∞} (1 + 1/n²)(1 + 2/n²)⋯(1 + n/n²)，並證明。",
      prompt: "\\lim_{n\\to\\infty}\\prod_{k=1}^{n}\\Big(1+\\frac{k}{n^2}\\Big)=\\sqrt{e}",
      hints: ["取對數，乘積變成和。", "t − t²/2 ≤ log(1+t) ≤ t（t ≥ 0）。", "Σk/n² = (n+1)/(2n)，Σk²/n⁴ ≤ 1/n。"],
      keySteps: ["take logarithms", "two-sided bound for log(1+t)", "sum formulas", "squeeze then exponentiate"],
      solution: [
        { text: "令 L_n = Σ_{k=1}^n log(1 + k/n²)。要的是 lim e^{L_n}。", tex: "\\prod_{k=1}^n\\Big(1+\\frac{k}{n^2}\\Big)=e^{L_n}" },
        { text: "對 t ≥ 0 有 t − t²/2 ≤ log(1+t) ≤ t，代 t = k/n² 相加。", tex: "\\sum_{k=1}^n\\frac{k}{n^2}-\\frac12\\sum_{k=1}^n\\frac{k^2}{n^4}\\le L_n\\le\\sum_{k=1}^n\\frac{k}{n^2}" },
        { text: "兩個和都算得出來：Σk/n² = (n+1)/(2n) → 1/2，Σk²/n⁴ ≤ n·n²/n⁴ = 1/n → 0。", tex: "\\frac{n+1}{2n}-\\frac{1}{2n}\\le L_n\\le\\frac{n+1}{2n}" },
        { text: "夾擠得 L_n → 1/2，指數函數連續，故極限是 e^{1/2}。", tex: "\\lim_{n\\to\\infty}\\prod_{k=1}^n\\Big(1+\\frac{k}{n^2}\\Big)=e^{1/2}=\\sqrt e" }
      ]
    },
    {
      id: "proof-todai-215",
      tier: "todai",
      title: "東大 II-15：arctan(1/x) 的 n 階導數",
      difficulty: 5,
      tags: ["induction", "derivative", "arctan", "todai"],
      statement: "設 y = arctan(1/x)（x > 0）。證明 y^{(n)} = (−1)^n (n−1)! (sin y)^n sin(ny)，並證明 lim_{x→±∞} y^{(n)} = 0。",
      prompt: "y=\\arctan\\frac1x\\ \\Rightarrow\\ y^{(n)}=(-1)^n(n-1)!\\,(\\sin y)^n\\sin(ny),\\quad\\lim_{x\\to\\pm\\infty}y^{(n)}=0",
      hints: ["先算 y′ = −1/(1+x²)，再用 sin y = 1/√(1+x²) 把它寫成 −sin²y。", "歸納：對公式微分，用 y′ = −sin²y 與和角公式。", "x → ∞ 時 y → 0，sin y → 0。"],
      keySteps: ["y′ = −sin² y", "differentiate the formula", "sin(a+b) identity", "sin y → 0 kills every derivative"],
      solution: [
        { text: "x > 0 時 y ∈ (0, π/2)，tan y = 1/x，所以 sin y = 1/√(1+x²)，而 y′ = −1/(1+x²) = −sin²y。這就是 n = 1 的公式。", tex: "y'=-\\sin^2 y=(-1)^1\\,0!\\,(\\sin y)^1\\sin(1\\cdot y)" },
        { text: "歸納：對 y^{(n)} = (−1)^n(n−1)! sin^n y sin(ny) 微分（連鎖律乘 y′）。", tex: "y^{(n+1)}=(-1)^n(n-1)!\\,n\\sin^{n-1}y\\,[\\cos y\\sin(ny)+\\sin y\\cos(ny)]\\,y'" },
        { text: "中括號是 sin((n+1)y)，y′ = −sin²y 補上一個負號與兩個 sin y。", tex: "y^{(n+1)}=(-1)^{n+1}n!\\,(\\sin y)^{n+1}\\sin((n+1)y)" },
        { text: "x → ±∞ 時 y → 0（x → −∞ 時 y → 0⁻ 同理成立），sin y → 0，故每一階導數都趨於 0。", tex: "\\lim_{x\\to\\pm\\infty}y^{(n)}=0\\quad(n=1,2,\\dots)" }
      ]
    },
    {
      id: "proof-todai-217",
      tier: "todai",
      title: "東大 II-17：(1 − x²)y″ − 2xy′ = 0 的解",
      difficulty: 4,
      tags: ["ode", "power-series", "log", "todai"],
      statement: "證明微分方程 (1 − x²)y″ − 2xy′ = 0 在原點附近可展開為冪級數的解，都可寫成 c₁ + c₂·(1/2)log((1+x)/(1−x))。",
      prompt: "(1-x^2)y''-2xy'=0\\ \\Rightarrow\\ y=c_1+c_2\\cdot\\frac12\\log\\frac{1+x}{1-x}",
      hints: ["左邊是一個全微分：((1 − x²)y′)′。", "所以 (1 − x²)y′ 是常數。", "1/(1 − x²) 的積分是 (1/2)log((1+x)/(1−x))。"],
      keySteps: ["recognize ((1−x²)y′)′", "first integral (1−x²)y′ = c", "partial fractions", "artanh series has radius 1"],
      solution: [
        { text: "觀察 ((1 − x²)y′)′ = (1 − x²)y″ − 2xy′：方程就是說這個導數為零。", tex: "\\frac{d}{dx}\\big[(1-x^2)y'\\big]=0" },
        { text: "所以 (1 − x²)y′ = c₂（常數），在 |x| < 1 上 y′ = c₂/(1 − x²)。", tex: "y'=\\frac{c_2}{1-x^2}=\\frac{c_2}{2}\\Big(\\frac{1}{1+x}+\\frac{1}{1-x}\\Big)" },
        { text: "積分得解的一般形；它在 |x| < 1 上是收斂的冪級數（artanh 的展開）。", tex: "y=c_1+c_2\\cdot\\frac12\\log\\frac{1+x}{1-x}=c_1+c_2\\sum_{k\\ge 0}\\frac{x^{2k+1}}{2k+1}" }
      ]
    },
    {
      id: "proof-todai-220",
      tier: "todai",
      title: "東大 II-20：exp(a·arcsin x) 的微分方程與泰勒級數",
      difficulty: 4,
      tags: ["ode", "taylor", "recurrence", "todai"],
      statement: "證明 y = e^{a arcsin x} 滿足 (1 − x²)y″ − xy′ − a²y = 0，並利用它求 y 在原點的泰勒級數。",
      prompt: "y=e^{a\\arcsin x}\\ \\Rightarrow\\ (1-x^2)y''-xy'-a^2y=0,\\quad c_{n+2}=\\frac{n^2+a^2}{(n+1)(n+2)}c_n",
      hints: ["先算 y′，平方後乘 (1 − x²) 把根號去掉。", "再微分一次、除以 2y′。", "把 y = Σ c_n xⁿ 代入方程，比較係數。"],
      keySteps: ["(1−x²)y′² = a²y²", "differentiate and divide by 2y′", "substitute power series", "two-step recurrence"],
      solution: [
        { text: "y′ = a y/√(1 − x²)，所以 (1 − x²)y′² = a²y²。", tex: "(1-x^2)y'^2=a^2y^2" },
        { text: "微分：(1 − x²)·2y′y″ − 2xy′² = 2a²yy′，除以 2y′（y′ ≠ 0）。", tex: "(1-x^2)y''-xy'-a^2y=0" },
        { text: "代 y = Σ c_n xⁿ：(1 − x²)Σ n(n−1)c_n x^{n−2} − Σ n c_n xⁿ − a² Σ c_n xⁿ = 0，比較 xⁿ 的係數。", tex: "(n+2)(n+1)c_{n+2}=\\big(n(n-1)+n+a^2\\big)c_n=(n^2+a^2)c_n" },
        { text: "初始值 c₀ = y(0) = 1、c₁ = y′(0) = a，遞迴式決定全部係數。", tex: "y=1+ax+\\frac{a^2}{2}x^2+\\frac{a(1+a^2)}{6}x^3+\\frac{a^2(4+a^2)}{24}x^4+\\cdots" }
      ]
    },
    {
      id: "proof-todai-221",
      tier: "todai",
      title: "東大 II-21：橢圓內接三角形的最大面積",
      difficulty: 4,
      tags: ["optimization", "affine", "jensen", "todai"],
      statement: "求內接於橢圓 x²/a² + y²/b² = 1 的三角形之最大面積，並證明。",
      prompt: "\\max\\operatorname{Area}=\\frac{3\\sqrt3}{4}ab",
      hints: ["仿射變換 (x,y) ↦ (x/a, y/b) 把橢圓變成單位圓，面積乘 1/(ab)。", "單位圓內接三角形面積 = (1/2)(sin α + sin β + sin γ)，α+β+γ = 2π 是圓心角。", "sin 在 [0, π] 上凹：Jensen ⇒ 正三角形最大。"],
      keySteps: ["affine map to the unit circle", "area via central angles", "concavity of sin on [0,π]", "equilateral is optimal"],
      solution: [
        { text: "線性映射 T(x,y) = (x/a, y/b) 把橢圓映成單位圓，且把所有面積乘以 1/(ab)。所以只要找單位圓的最大內接三角形。", tex: "\\operatorname{Area}(\\triangle)=ab\\cdot\\operatorname{Area}(T\\triangle)" },
        { text: "單位圓上三點把圓周分成圓心角 α, β, γ（和為 2π），三角形是三個等腰三角形拼起來（圓心在內部時；否則面積更小）。", tex: "\\operatorname{Area}=\\tfrac12(\\sin\\alpha+\\sin\\beta+\\sin\\gamma),\\quad \\alpha+\\beta+\\gamma=2\\pi" },
        { text: "sin 在 [0, π] 上凹，Jensen：(sin α + sin β + sin γ)/3 ≤ sin((α+β+γ)/3) = sin(2π/3)，等號在 α = β = γ。", tex: "\\operatorname{Area}\\le\\tfrac32\\sin\\frac{2\\pi}{3}=\\frac{3\\sqrt3}{4}" },
        { text: "拉回橢圓：最大面積 (3√3/4)ab，由正三角形的像達到。", tex: "\\max\\operatorname{Area}=\\frac{3\\sqrt3}{4}\\,ab" }
      ]
    },
    {
      id: "proof-todai-228",
      tier: "todai",
      title: "東大 II-28：d/dt exp(tX) = X exp(tX)",
      difficulty: 4,
      tags: ["matrix-exponential", "power-series", "uniform-convergence", "todai"],
      statement: "對 n×n 實矩陣 X 定義 exp X = Σ_{k≥0} X^k/k!。證明 d/dt exp(tX) = X exp(tX)。",
      prompt: "\\frac{d}{dt}\\exp(tX)=X\\exp(tX)",
      hints: ["用任何一個矩陣範數：‖X^k‖ ≤ ‖X‖^k，級數絕對收斂。", "exp(tX) 是 t 的冪級數（矩陣係數），收斂半徑 ∞。", "冪級數可逐項微分。"],
      keySteps: ["norm bound ‖X^k‖ ≤ ‖X‖^k", "absolute convergence for every t", "termwise differentiation", "reindex to X·exp(tX)"],
      solution: [
        { text: "取一個次乘性的矩陣範數。每一項的範數被數列 (|t|‖X‖)^k/k! 控制，它的和是 e^{|t|‖X‖}。", tex: "\\Big\\|\\frac{t^kX^k}{k!}\\Big\\|\\le\\frac{(|t|\\,\\|X\\|)^k}{k!}" },
        { text: "所以 exp(tX) = Σ t^k X^k/k! 是 t 的冪級數（係數是矩陣），對所有 t 絕對收斂、在任何有界區間上一致收斂。", tex: "\\exp(tX)=\\sum_{k=0}^\\infty\\frac{t^k}{k!}X^k,\\quad R=\\infty" },
        { text: "冪級數可逐項微分（逐項微分後的級數同樣被 e^{|t|‖X‖} 型的級數控制、一致收斂）。", tex: "\\frac{d}{dt}\\exp(tX)=\\sum_{k=1}^\\infty\\frac{kt^{k-1}}{k!}X^k=\\sum_{k=1}^\\infty\\frac{t^{k-1}}{(k-1)!}X^k" },
        { text: "提出一個 X，重新編號。", tex: "=X\\sum_{j=0}^\\infty\\frac{t^j}{j!}X^j=X\\exp(tX)" }
      ]
    },
    {
      id: "proof-todai-303",
      tier: "todai",
      title: "東大 III-3：cos(tx)/(1+x²) 從 0 到 ∞ 的積分",
      difficulty: 6,
      tags: ["improper-integral", "ode", "uniform-convergence", "feynman", "todai"],
      statement: "令 f(t) = ∫₀^∞ cos(tx)/(1+x²) dx。依序證明：(1) 積分對 t 一致收斂，f 連續；(2) F(t) = ∫₀^t f = ∫₀^∞ sin(tx)/(x(1+x²)) dx；(3) F″ = F − π/2（t > 0）；(4) F(t) = (π/2)(1 − e^{−t})；(5) f(t) = (π/2)e^{−|t|}。",
      prompt: "\\int_0^\\infty\\frac{\\cos tx}{1+x^2}\\,dx=\\frac{\\pi}{2}e^{-|t|}",
      hints: ["|cos tx/(1+x²)| ≤ 1/(1+x²)：Weierstrass M-test。", "1/(x(1+x²)) − 1/x = −x/(1+x²)，而 ∫₀^∞ sin(tx)/x dx = π/2（t > 0）。", "F″ = F − π/2 的解裡 e^t 那一項要靠 F′ = f 有界才能殺掉。"],
      keySteps: ["M-test ⇒ uniform convergence", "integrate under the integral sign", "Dirichlet integral π/2", "solve F″ = F − π/2 with boundedness", "evenness gives |t|"],
      solution: [
        { text: "(1) |cos(tx)/(1+x²)| ≤ 1/(1+x²) 可積，M-test 給一致收斂，故 f 連續且 |f| ≤ π/2。", tex: "|f(t)|\\le\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}" },
        { text: "(2) 一致收斂可以對 t 積分交換次序：∫₀^t cos(sx) ds = sin(tx)/x。", tex: "F(t)=\\int_0^t f(s)\\,ds=\\int_0^\\infty\\frac{\\sin tx}{x(1+x^2)}\\,dx" },
        { text: "(3) 1/(x(1+x²)) = 1/x − x/(1+x²)，而 Dirichlet 積分 ∫₀^∞ sin(tx)/x dx = π/2（t > 0）。剩下的 −∫ x sin(tx)/(1+x²) dx 正是 f′(t)（對 t 微分，一致收斂性由 Dirichlet 型判別法保證）。", tex: "F(t)-\\frac{\\pi}{2}=-\\int_0^\\infty\\frac{x\\sin tx}{1+x^2}\\,dx=f'(t)=F''(t)" },
        { text: "(4) 解 F″ = F − π/2：F = π/2 + c₁e^t + c₂e^{−t}。F′ = f 有界迫使 c₁ = 0，F(0) = 0 給 c₂ = −π/2。", tex: "F(t)=\\frac{\\pi}{2}(1-e^{-t})\\quad(t>0)" },
        { text: "(5) f = F′ = (π/2)e^{−t}（t > 0）；f 是偶函數，且 f(0) = π/2，故對所有 t 成立。", tex: "f(t)=\\frac{\\pi}{2}e^{-|t|}\\quad(\\forall t\\in\\mathbb{R})" }
      ]
    },
    {
      id: "proof-todai-305",
      tier: "todai",
      title: "東大 III-5：(x^p − x^q)/log x 從 0 到 1 的積分",
      difficulty: 5,
      tags: ["feynman", "parameter-integral", "log", "todai"],
      statement: "證明對 p, q > −1，∫₀¹ (x^p − x^q)/log x dx = log((p+1)/(q+1))。",
      prompt: "\\int_0^1\\frac{x^p-x^q}{\\log x}\\,dx=\\log\\frac{p+1}{q+1}\\quad(p,q>-1)",
      hints: ["把 p 當參數：I(p) = ∫₀¹ (x^p − x^q)/log x dx。", "∂/∂p 把 log x 消掉：∂/∂p x^p = x^p log x。", "I(q) = 0 定出積分常數。"],
      keySteps: ["differentiate in the parameter p", "log x cancels", "integrate 1/(p+1)", "normalize with I(q) = 0"],
      solution: [
        { text: "被積函數在 x → 0⁺ 趨於 0、在 x → 1⁻ 趨於 p − q（L'Hôpital），所以積分收斂，且對 p 在 [q, p] 上可在積分號下微分（一致可積的控制函數）。", tex: "I(p)=\\int_0^1\\frac{x^p-x^q}{\\log x}\\,dx" },
        { text: "對 p 微分：∂/∂p 的 x^p = x^p log x，log x 剛好約掉。", tex: "I'(p)=\\int_0^1 x^p\\,dx=\\frac{1}{p+1}" },
        { text: "積分回去，並用 I(q) = 0 定常數。", tex: "I(p)=\\log(p+1)+C,\\quad 0=I(q)=\\log(q+1)+C" },
        { text: "所以 I(p) = log(p+1) − log(q+1)。", tex: "\\int_0^1\\frac{x^p-x^q}{\\log x}\\,dx=\\log\\frac{p+1}{q+1}" }
      ]
    },
    {
      id: "proof-todai-306",
      tier: "todai",
      title: "東大 III-6：(1−x)/((1+x) log x) 從 0 到 1 的積分",
      difficulty: 6,
      tags: ["series", "wallis", "feynman", "todai"],
      statement: "利用前題證明 ∫₀¹ (1 − x)/((1 + x) log x) dx = log(2/π)。",
      prompt: "\\int_0^1\\frac{1-x}{1+x}\\cdot\\frac{dx}{\\log x}=\\log\\frac{2}{\\pi}",
      hints: ["(1−x)/(1+x) = (1−x)Σ(−x)^k = Σ(−1)^k(x^k − x^{k+1})。", "每一項用 III-5：∫(x^k − x^{k+1})/log x = log((k+1)/(k+2))。", "交錯乘積 (1/2)(3/2)(3/4)(5/4)⋯ 是 Wallis 乘積。"],
      keySteps: ["geometric series expansion", "termwise III-5", "alternating sum of logs = log of a product", "Wallis product = 2/π"],
      solution: [
        { text: "展開：(1 − x)/(1 + x) = (1 − x)Σ_{k≥0}(−x)^k = Σ(−1)^k(x^k − x^{k+1})，在 [0,1) 上逐項可積（交錯、單調控制）。", tex: "\\int_0^1\\frac{1-x}{(1+x)\\log x}\\,dx=\\sum_{k=0}^\\infty(-1)^k\\int_0^1\\frac{x^k-x^{k+1}}{\\log x}\\,dx" },
        { text: "每一項用 III-5（p = k、q = k+1）。", tex: "\\int_0^1\\frac{x^k-x^{k+1}}{\\log x}\\,dx=\\log\\frac{k+1}{k+2}" },
        { text: "交錯和的部分和是一個乘積的對數。", tex: "\\sum_{k=0}^{2m-1}(-1)^k\\log\\frac{k+1}{k+2}=\\log\\Big(\\frac12\\cdot\\frac32\\cdot\\frac34\\cdot\\frac54\\cdots\\frac{2m-1}{2m}\\Big)" },
        { text: "括號裡是 Wallis 乘積 Π (2m−1)(2m+1)/(2m)² 的部分乘積（差一個 → 1 的因子），極限是 2/π。", tex: "\\prod_{m=1}^\\infty\\frac{(2m-1)(2m+1)}{(2m)^2}=\\frac{2}{\\pi}\\ \\Rightarrow\\ \\int_0^1\\frac{1-x}{(1+x)\\log x}\\,dx=\\log\\frac2\\pi" }
      ]
    },
    {
      id: "proof-todai-308",
      tier: "todai",
      title: "東大 III-8：log(a + b cos x) 從 0 到 π 的積分",
      difficulty: 5,
      tags: ["feynman", "parameter-integral", "trig-integral", "todai"],
      statement: "對 a ≥ b > 0 求 ∫₀^π log(a + b cos x) dx，並證明。",
      prompt: "\\int_0^\\pi\\log(a+b\\cos x)\\,dx=\\pi\\log\\frac{a+\\sqrt{a^2-b^2}}{2}",
      hints: ["把 b 當參數微分：I′(b) = ∫ cos x/(a + b cos x) dx。", "cos x/(a + b cos x) = (1/b)(1 − a/(a + b cos x))。", "∫₀^π dx/(a + b cos x) = π/√(a² − b²)（Weierstrass 代換）。"],
      keySteps: ["differentiate in b", "split off the constant", "∫dx/(a+b cos x) = π/√(a²−b²)", "integrate back with I(0) = π log a"],
      solution: [
        { text: "令 I(b) = ∫₀^π log(a + b cos x) dx（0 ≤ b < a）。對 b 微分。", tex: "I'(b)=\\int_0^\\pi\\frac{\\cos x}{a+b\\cos x}\\,dx=\\frac1b\\int_0^\\pi\\Big(1-\\frac{a}{a+b\\cos x}\\Big)dx" },
        { text: "標準積分（t = tan(x/2)）：∫₀^π dx/(a + b cos x) = π/√(a² − b²)。", tex: "I'(b)=\\frac{\\pi}{b}-\\frac{a\\pi}{b\\sqrt{a^2-b^2}}" },
        { text: "積分：右邊是 d/db [π log(a + √(a² − b²))]（直接微分驗證）。", tex: "\\frac{d}{db}\\,\\pi\\log\\big(a+\\sqrt{a^2-b^2}\\big)=\\frac{-\\pi b}{\\sqrt{a^2-b^2}\\,(a+\\sqrt{a^2-b^2})}=\\frac{\\pi}{b}-\\frac{a\\pi}{b\\sqrt{a^2-b^2}}" },
        { text: "I(0) = π log a 定常數：π log((a + a)/2) = π log a ✓。b = a 的情形由連續性得到。", tex: "\\int_0^\\pi\\log(a+b\\cos x)\\,dx=\\pi\\log\\frac{a+\\sqrt{a^2-b^2}}{2}" }
      ]
    },
    {
      id: "proof-todai-310",
      tier: "todai",
      title: "東大 III-10：Frullani 公式",
      difficulty: 5,
      tags: ["frullani", "improper-integral", "substitution", "todai"],
      statement: "設 f 在 x ≥ 0 上 C¹，且對 0 < a, b 極限 C = lim_{t→∞} ∫_a^b f(tx)/x dx 存在。證明 ∫₀^∞ (f(bx) − f(ax))/x dx = f(0) log(a/b) + C。",
      prompt: "\\int_0^\\infty\\frac{f(bx)-f(ax)}{x}\\,dx=f(0)\\log\\frac ab+C",
      hints: ["先在 [ε, R] 上算，兩項各自換元 u = bx、u = ax。", "相減後只剩兩個短區間：[aR, bR] 與 [aε, bε]。", "[aε, bε] 上 f ≈ f(0)，長度給 log(b/a)。"],
      keySteps: ["truncate to [ε, R]", "substitute in each term", "difference of two short intervals", "f(0)·log from the ε end, C from the R end"],
      solution: [
        { text: "在 [ε, R] 上把兩項分開換元 u = bx、u = ax。", tex: "\\int_\\varepsilon^R\\frac{f(bx)-f(ax)}{x}\\,dx=\\int_{b\\varepsilon}^{bR}\\frac{f(u)}{u}\\,du-\\int_{a\\varepsilon}^{aR}\\frac{f(u)}{u}\\,du" },
        { text: "共同的部分相消，只剩兩頭。", tex: "=\\int_{aR}^{bR}\\frac{f(u)}{u}\\,du-\\int_{a\\varepsilon}^{b\\varepsilon}\\frac{f(u)}{u}\\,du" },
        { text: "R 端：換回 u = Rx，就是題目假設的極限 C。", tex: "\\int_{aR}^{bR}\\frac{f(u)}{u}\\,du=\\int_a^b\\frac{f(Rx)}{x}\\,dx\\ \\xrightarrow{R\\to\\infty}\\ C" },
        { text: "ε 端：f 連續，在 [aε, bε] 上 f(u) = f(0) + o(1)，而 ∫ du/u = log(b/a)。", tex: "\\int_{a\\varepsilon}^{b\\varepsilon}\\frac{f(u)}{u}\\,du\\ \\xrightarrow{\\varepsilon\\to 0}\\ f(0)\\log\\frac ba" },
        { text: "合起來（注意 −log(b/a) = log(a/b)）。", tex: "\\int_0^\\infty\\frac{f(bx)-f(ax)}{x}\\,dx=C+f(0)\\log\\frac ab" }
      ]
    },
    {
      id: "proof-todai-311",
      tier: "todai",
      title: "東大 III-11：Frullani 的三個應用",
      difficulty: 4,
      tags: ["frullani", "improper-integral", "todai"],
      statement: "利用 Frullani 公式求（a, b > 0）：(1) ∫₀^∞ (cos bx − cos ax)/x dx；(2) ∫₀^∞ (e^{−bx} − e^{−ax})/x dx；(3) ∫₀^∞ sin(ax) sin(bx)/x dx（a ≠ b）。",
      prompt: "\\int_0^\\infty\\frac{\\cos bx-\\cos ax}{x}dx=\\log\\frac ab,\\quad\\int_0^\\infty\\frac{e^{-bx}-e^{-ax}}{x}dx=\\log\\frac ab,\\quad\\int_0^\\infty\\frac{\\sin ax\\sin bx}{x}dx=\\frac12\\log\\Big|\\frac{a+b}{a-b}\\Big|",
      hints: ["每一題先認出 f，再算 f(0) 與 C。", "f = cos 時 C = lim ∫_a^b cos(tx)/x dx = 0（Riemann–Lebesgue）。", "(3) 用積化和差：sin ax sin bx = (cos(a−b)x − cos(a+b)x)/2。"],
      keySteps: ["identify f, f(0), C", "C = 0 for cos and e^{−x}", "product-to-sum for (3)", "log of the ratio"],
      solution: [
        { text: "(1) f(x) = cos x：f(0) = 1，而 ∫_a^b cos(tx)/x dx → 0（t → ∞，Riemann–Lebesgue），C = 0。", tex: "\\int_0^\\infty\\frac{\\cos bx-\\cos ax}{x}\\,dx=\\log\\frac ab" },
        { text: "(2) f(x) = e^{−x}：f(0) = 1，∫_a^b e^{−tx}/x dx ≤ e^{−ta}log(b/a) → 0，C = 0。", tex: "\\int_0^\\infty\\frac{e^{-bx}-e^{-ax}}{x}\\,dx=\\log\\frac ab" },
        { text: "(3) 積化和差，變成 (1) 的形式：分子是 cos((a−b)x) − cos((a+b)x)，除以 2。", tex: "\\int_0^\\infty\\frac{\\sin ax\\sin bx}{x}\\,dx=\\frac12\\int_0^\\infty\\frac{\\cos|a-b|x-\\cos(a+b)x}{x}\\,dx=\\frac12\\log\\frac{a+b}{|a-b|}" }
      ]
    },
    {
      id: "proof-todai-312",
      tier: "todai",
      title: "東大 III-12：等周不等式 L² ≥ 4πF（Hurwitz）",
      difficulty: 6,
      tags: ["fourier", "parseval", "isoperimetric", "todai"],
      statement: "設 C 為分段 C¹ 的 Jordan 閉曲線，長 L、圍面積 F。用 Fourier 級數與 Parseval 等式證明 L² ≥ 4πF，且等號只在圓周成立。",
      prompt: "L^2\\ge 4\\pi F,\\quad\\text{equality iff }C\\text{ is a circle}",
      hints: ["把弧長參數縮放成週期 2π：x′² + y′² = (L/2π)²。", "x, y 各展成 Fourier 級數，Parseval 算 ∫(x′² + y′²) 與 F = ∫ x y′。", "逐項比較：n|a_n||b_n| ≤ n²(|a_n|² + |b_n|²)/2，等號只在 n = ±1。"],
      keySteps: ["arclength parametrization scaled to 2π", "Parseval for L²", "Green's theorem for F", "termwise n ≤ n² and AM-GM", "equality ⇒ only n = ±1 ⇒ circle"],
      solution: [
        { text: "以弧長參數化再縮放，得週期 2π 的 x(t), y(t)，且 x′² + y′² ≡ (L/2π)²。展成 Fourier 級數 x = Σ a_n e^{int}、y = Σ b_n e^{int}。", tex: "\\int_0^{2\\pi}(x'^2+y'^2)\\,dt=2\\pi\\Big(\\frac{L}{2\\pi}\\Big)^2=\\frac{L^2}{2\\pi}" },
        { text: "Parseval：∫₀^{2π}|x′|² = 2π Σ n²|a_n|²，y 同理。", tex: "\\frac{L^2}{2\\pi}=2\\pi\\sum_{n}n^2\\big(|a_n|^2+|b_n|^2\\big)" },
        { text: "Green 定理：F = ∫₀^{2π} x y′ dt，再用 Parseval（y′ 的係數是 i n b_n）。", tex: "F=\\int_0^{2\\pi}x\\,y'\\,dt=2\\pi\\sum_n n\\,\\operatorname{Im}\\big(a_n\\overline{b_n}\\big)" },
        { text: "逐項：n Im(a_n b̄_n) ≤ |n||a_n||b_n| ≤ n²(|a_n|² + |b_n|²)/2。相加得 F ≤ L²/(4π)。", tex: "F\\le 2\\pi\\sum_n\\frac{n^2(|a_n|^2+|b_n|^2)}{2}=\\frac{L^2}{4\\pi}" },
        { text: "等號要每一項都取等：|n| = n² 只在 n = ±1 非零、且 |a_1| = |b_1| 並相位差 π/2，即 x = a cos t + b sin t 型的圓。", tex: "L^2=4\\pi F\\iff x(t)=x_0+r\\cos(t+\\theta),\\ y(t)=y_0+r\\sin(t+\\theta)" }
      ]
    },
    {
      id: "proof-todai-313",
      tier: "todai",
      title: "東大 III-13：Legendre 多項式的正交性",
      difficulty: 5,
      tags: ["legendre", "orthogonality", "integration-by-parts", "todai"],
      statement: "令 P_n(x) = (1/(n! 2ⁿ)) dⁿ/dxⁿ (x² − 1)ⁿ。證明 ∫_{−1}^{1} P_n P_m dx = 2/(2n+1) δ_{nm}，且 P_n(1) = 1。",
      prompt: "\\int_{-1}^1P_nP_m\\,dx=\\frac{2}{2n+1}\\delta_{nm},\\qquad P_n(1)=1",
      hints: ["u = (x² − 1)ⁿ 在 ±1 有 n 重零點，分部積分時邊界項全是 0。", "m < n 時分部 n 次，把 n 階導數全部丟到 P_m 上，P_m 被微分 n 次變成 0。", "P_n(1)：Leibniz 展開 (x−1)ⁿ(x+1)ⁿ，在 x = 1 只有一項活著。"],
      keySteps: ["Rodrigues formula", "boundary terms vanish", "n integrations by parts", "∫(1−x²)ⁿ = 2·(2n)!!/(2n+1)!!", "P_n(1) by Leibniz"],
      solution: [
        { text: "令 u_n = (x² − 1)ⁿ，它在 ±1 各有 n 重零點，所以 u_n^{(k)}(±1) = 0（k < n）：分部積分沒有邊界項。", tex: "\\int_{-1}^1u_n^{(n)}\\,g\\,dx=(-1)^n\\int_{-1}^1u_n\\,g^{(n)}\\,dx\\quad(g\\text{ polynomial})" },
        { text: "m < n 時取 g = P_m（次數 m < n），g^{(n)} = 0，積分為 0。對稱地 m > n 亦然。", tex: "\\int_{-1}^1P_nP_m\\,dx=0\\quad(m\\ne n)" },
        { text: "m = n：P_n^{(n)} = (2n)!/(n! 2ⁿ)（首項係數乘 n!），再算 ∫(1 − x²)ⁿ dx（β 函數或遞迴）。", tex: "\\int_{-1}^1P_n^2\\,dx=\\frac{(2n)!}{(n!2^n)^2}\\int_{-1}^1(1-x^2)^n\\,dx=\\frac{(2n)!}{(n!2^n)^2}\\cdot\\frac{2^{2n+1}(n!)^2}{(2n+1)!}=\\frac{2}{2n+1}" },
        { text: "P_n(1)：Leibniz 展開 dⁿ/dxⁿ[(x−1)ⁿ(x+1)ⁿ]，在 x = 1 只有 (x−1)ⁿ 被微分 n 次那一項不為 0。", tex: "P_n(1)=\\frac{1}{n!2^n}\\cdot n!\\cdot(1+1)^n=1" }
      ]
    },
    {
      id: "proof-todai-321",
      tier: "todai",
      title: "東大 III-21：Σ (2n−1)!!/(2n)!! · 1/n = 2 log 2",
      difficulty: 6,
      tags: ["series", "wallis-integral", "log", "todai"],
      statement: "求 s = Σ_{n≥1} (2n−1)!!/(2n)!! · 1/n，可使用 ∫₀^{π/2} sin^{2n}x dx = (2n−1)!!/(2n)!! · π/2。",
      prompt: "\\sum_{n=1}^\\infty\\frac{(2n-1)!!}{(2n)!!}\\cdot\\frac1n=2\\log 2",
      hints: ["把每一項寫成積分：(2n−1)!!/(2n)!! = (2/π)∫ sin^{2n}x dx。", "Σ sin^{2n}x/n = −log(1 − sin²x) = −2 log cos x。", "∫₀^{π/2} log cos x dx = −(π/2) log 2。"],
      keySteps: ["term as Wallis integral", "interchange sum and integral (positive terms)", "Σ tⁿ/n = −log(1−t)", "∫ log cos = −(π/2)log 2"],
      solution: [
        { text: "每一項換成積分，正項級數可以跟積分交換（單調收斂）。", tex: "s=\\frac2\\pi\\int_0^{\\pi/2}\\sum_{n=1}^\\infty\\frac{\\sin^{2n}x}{n}\\,dx" },
        { text: "Σ tⁿ/n = −log(1 − t)（0 ≤ t < 1），代 t = sin²x。", tex: "\\sum_{n=1}^\\infty\\frac{\\sin^{2n}x}{n}=-\\log(1-\\sin^2x)=-2\\log\\cos x" },
        { text: "經典積分 ∫₀^{π/2} log cos x dx = −(π/2) log 2（用 log sin x 對稱與倍角公式）。", tex: "s=-\\frac4\\pi\\int_0^{\\pi/2}\\log\\cos x\\,dx=-\\frac4\\pi\\cdot\\Big(-\\frac\\pi2\\log 2\\Big)=2\\log 2" }
      ]
    },
    {
      id: "proof-todai-322",
      tier: "todai",
      title: "東大 III-22：Legendre 關係式 EK′ + E′K − KK′ = π/2",
      difficulty: 6,
      tags: ["elliptic-integral", "ode", "limit", "todai"],
      statement: "K(k) = ∫₀^{π/2} dt/√(1 − k² sin²t)，E(k) = ∫₀^{π/2} √(1 − k² sin²t) dt，k′ = √(1 − k²)，K′ = K(k′)，E′ = E(k′)。證明 EK′ + E′K − KK′ = π/2。",
      prompt: "EK'+E'K-KK'=\\frac{\\pi}{2}",
      hints: ["先算 dE/dk = (E − K)/k 與 dK/dk = (E − k′²K)/(k k′²)。", "把左邊對 k 微分，全部用這兩條，會發現導數是 0。", "k → 0 時 K, E → π/2、E′ → 1、K′ ~ log(4/k)，但 (E − K)K′ → 0。"],
      keySteps: ["derivatives of K and E", "chain rule through k′", "derivative of the combination vanishes", "evaluate the limit k → 0⁺"],
      solution: [
        { text: "積分號下微分（k < 1 時被積函數光滑），整理得標準公式。", tex: "\\frac{dE}{dk}=\\frac{E-K}{k},\\qquad\\frac{dK}{dk}=\\frac{E-k'^2K}{kk'^2}" },
        { text: "K′、E′ 是同樣的函數在 k′ 的值，而 dk′/dk = −k/k′。令 G(k) = EK′ + E′K − KK′，用連鎖律微分。", tex: "\\frac{dK'}{dk}=-\\frac{k}{k'}\\cdot\\frac{E'-k^2K'}{k'k^2},\\qquad\\frac{dE'}{dk}=-\\frac{k}{k'}\\cdot\\frac{E'-K'}{k'}" },
        { text: "把四個導數代進 G′，逐項相消（每一項都是 E、K、E′、K′ 的雙線性式），得 G′ ≡ 0，故 G 是常數。", tex: "G'(k)=0\\quad(0<k<1)" },
        { text: "k → 0⁺：K, E → π/2，E′ → 1，K′ → ∞ 但只有對數階，而 E − K = O(k²)，所以 (E − K)K′ → 0；G → π/2·1 = π/2。", tex: "G=\\lim_{k\\to 0^+}\\big[(E-K)K'+E'K\\big]=0+1\\cdot\\frac\\pi2=\\frac\\pi2" }
      ]
    },
    {
      id: "proof-todai-410",
      tier: "todai",
      title: "東大 IV-10：波動方程的能量守恆",
      difficulty: 4,
      tags: ["pde", "wave-equation", "energy", "divergence", "todai"],
      statement: "u(t,x,y,z) ∈ C²(ℝ⁴) 滿足 u_tt/c² = u_xx + u_yy + u_zz，且對每個固定 t 在 (x,y,z) 上有緊支撐。證明 E(t) = (1/2)∭ (u_x² + u_y² + u_z² + u_t²/c²) dxdydz 與 t 無關。",
      prompt: "E(t)=\\frac12\\iiint\\Big(|\\nabla u|^2+\\frac{1}{c^2}u_t^2\\Big)dx\\,dy\\,dz\\ \\text{is constant}",
      hints: ["對 t 微分，微分可以進積分（緊支撐、C²）。", "∇u·∇u_t + u_t Δu = div(u_t ∇u)。", "散度定理：緊支撐的向量場積分為 0。"],
      keySteps: ["differentiate under the integral", "use the wave equation for u_tt", "product rule ⇒ divergence", "divergence theorem with compact support"],
      solution: [
        { text: "對 t 微分，微分進積分：E′ = ∭(∇u·∇u_t + u_t u_tt/c²)。", tex: "E'(t)=\\iiint\\Big(\\nabla u\\cdot\\nabla u_t+\\frac{1}{c^2}u_tu_{tt}\\Big)" },
        { text: "用波動方程把 u_tt/c² 換成 Δu。", tex: "E'(t)=\\iiint\\big(\\nabla u\\cdot\\nabla u_t+u_t\\,\\Delta u\\big)" },
        { text: "乘積法則：這正是 div(u_t ∇u)。", tex: "\\nabla u\\cdot\\nabla u_t+u_t\\Delta u=\\operatorname{div}(u_t\\nabla u)" },
        { text: "u 緊支撐，散度定理給 0：E′(t) = 0，E 是守恆量。", tex: "E'(t)=\\iiint\\operatorname{div}(u_t\\nabla u)=\\oint_{\\text{far away}}u_t\\nabla u\\cdot n\\,dS=0" }
      ]
    },
    {
      id: "proof-todai-416",
      tier: "todai",
      title: "東大 IV-16：ζ(3) 是無理數（Apéry，Beukers 路線）",
      difficulty: 6,
      tags: ["apery", "zeta", "irrationality", "legendre", "todai"],
      statement: "假設素數定理，依 14 步證明 ζ(3) = Σ 1/n³ 是無理數（Beukers 的積分證明）。這裡把每一步的主張列出來；能算的都在驗證器裡算過。",
      prompt: "\\zeta(3)=\\sum_{n=1}^\\infty\\frac{1}{n^3}\\notin\\mathbb{Q}",
      hints: ["核心是三重積分 I_n，它同時「很小」又是「(A_n + B_nζ(3))/d_n³」型的數。", "小：被積函數在 [0,1]³ 上 ≤ (√2−1)⁴，所以 |I_n| ≤ 2(√2−1)^{4n}ζ(3)。", "大：若 ζ(3) = p/q，則 q d_n³ I_n 是非零整數，但 d_n ≤ 3ⁿ 使它趨於 0。"],
      keySteps: ["∫∫ x^{n+t}y^{m+t}/(1−xy) as a series", "differentiate in t ⇒ log(xy) kernel", "denominators divide d_n³", "Legendre-type P_n(x) = (1/n!) dⁿ/dxⁿ xⁿ(1−x)ⁿ", "I_n = (A_n + B_nζ(3))/d_n³", "change of variables to a positive kernel ≤ (√2−1)⁴", "d_n ≤ 3ⁿ from the prime number theorem", "integer sandwich ⇒ contradiction"],
      solution: [
        { text: "(1)(2) 幾何級數逐項積分：∫∫ x^{n+t}y^{m+t}/(1−xy) = Σ_k 1/((n+t+k+1)(m+t+k+1))。對 t 微分產生 log(xy)，得到有理數值（n > m ≥ 0）。", tex: "-\\int_0^1\\!\\!\\int_0^1\\frac{\\log(xy)}{1-xy}x^ny^m\\,dx\\,dy=\\sum_{k=0}^{n-m-1}\\frac{1}{(m+k+1)^2(n-m)}" },
        { text: "(3)(4) 這些有理數的分母整除 d_n³（d_n = lcm(1,…,n)）；n = m 時級數變成 2(ζ(3) − Σ_{k≤n} 1/k³)。", tex: "-\\int_0^1\\!\\!\\int_0^1\\frac{\\log(xy)}{1-xy}x^ny^n\\,dx\\,dy=2\\Big(\\zeta(3)-\\sum_{k=1}^n\\frac{1}{k^3}\\Big)" },
        { text: "(5) 令 P_n(x) = (1/n!) dⁿ/dxⁿ[xⁿ(1−x)ⁿ]（整係數），I_n = −∫∫ log(xy)/(1−xy) P_n(x)P_n(y)。展開 P_n 用 (1)–(4)：存在整數 A_n, B_n 使 I_n = (A_n + B_nζ(3))/d_n³。", tex: "I_n=\\frac{A_n+B_n\\zeta(3)}{d_n^3},\\qquad A_n,B_n\\in\\mathbb{Z}" },
        { text: "(6)–(9) 把 −log(xy)/(1−xy) 寫成 ∫₀¹ dz/(1−(1−xy)z)，分部積分 n 次、換元 z = (1−w)/(1−(1−xy)w)，再分部 n 次，得到正的被積函數。", tex: "I_n=\\int_0^1\\!\\!\\int_0^1\\!\\!\\int_0^1\\frac{x^n(1-x)^ny^n(1-y)^nw^n(1-w)^n}{\\{1-(1-xy)w\\}^{n+1}}\\,dx\\,dy\\,dw" },
        { text: "(10)(11) 在 [0,1]³ 上 x(1−x)y(1−y)w(1−w)/(1−(1−xy)w) ≤ (√2−1)⁴，而剩下的 ∫∫∫ dxdydw/(1−(1−xy)w) = 2ζ(3)。", tex: "0<|I_n|\\le 2(\\sqrt2-1)^{4n}\\zeta(3)" },
        { text: "(12)(13) 素數定理給 d_n ≤ 3ⁿ（n 大時）。若 ζ(3) = p/q，則 q·d_n³·I_n = q(A_n + B_nζ(3)) 是非零整數，但它 ≤ 2qζ(3)·(27(√2−1)⁴)ⁿ < 2qζ(3)(4/5)ⁿ → 0，矛盾。", tex: "0<|A_n+B_n\\zeta(3)|<2\\zeta(3)\\Big(\\frac45\\Big)^n\\ \\Rightarrow\\ \\zeta(3)\\notin\\mathbb{Q}" },
        { text: "(14) d_n = Π_{p≤n} p^{⌊log n/log p⌋} ≤ Π_{p≤n} n = n^{π(n)}，而 π(n) ~ n/log n 給 n^{π(n)} = e^{(1+o(1))n} ≤ 3ⁿ（n 大時）。", tex: "\\log d_n=\\sum_{p\\le n}\\Big\\lfloor\\frac{\\log n}{\\log p}\\Big\\rfloor\\log p\\le\\pi(n)\\log n\\sim n" }
      ]
    },
    {
      id: "proof-todai-417",
      tier: "todai",
      title: "東大 IV-17：全空間有界調和函數必為常數",
      difficulty: 5,
      tags: ["harmonic", "liouville", "mean-value", "todai"],
      statement: "證明定義在整個 ℝ³ 上、上下有界的調和函數必為常數（Liouville）。",
      prompt: "\\Delta u=0\\ \\text{on }\\mathbb{R}^3,\\ |u|\\le M\\ \\Rightarrow\\ u\\equiv\\text{const}",
      hints: ["調和函數的球平均值性質：u(ξ) = (1/|B_R|)∫_{B_R(ξ)} u。", "u(ξ) − u(0) 是兩個球上的平均之差，只剩對稱差上的積分。", "對稱差的體積 / 球體積 → 0（R → ∞）。"],
      keySteps: ["mean value property over balls", "difference of two averages", "symmetric difference volume O(R²)", "let R → ∞"],
      solution: [
        { text: "調和函數在每個球上等於球平均（由 Green 函數／Poisson 公式或散度定理推出）。", tex: "u(\\xi)=\\frac{1}{|B_R|}\\int_{B_R(\\xi)}u\\,dx,\\qquad|B_R|=\\tfrac43\\pi R^3" },
        { text: "固定 ξ，令 d = |ξ|。u(ξ) − u(0) 是兩個半徑 R 的球平均之差，共同部分相消。", tex: "|u(\\xi)-u(0)|\\le\\frac{1}{|B_R|}\\int_{B_R(\\xi)\\,\\triangle\\,B_R(0)}|u|\\,dx\\le\\frac{M\\,|B_R(\\xi)\\triangle B_R(0)|}{|B_R|}" },
        { text: "對稱差包含在球殼 B_{R+d} ∖ B_{R−d} 裡，體積是 O(R²d)。", tex: "|B_R(\\xi)\\triangle B_R(0)|\\le\\tfrac43\\pi\\big((R+d)^3-(R-d)^3\\big)=\\tfrac43\\pi(6R^2d+2d^3)" },
        { text: "除以 (4/3)πR³ 後是 O(d/R) → 0（R → ∞），故 u(ξ) = u(0)：u 是常數。", tex: "|u(\\xi)-u(0)|\\le M\\cdot\\frac{6R^2d+2d^3}{R^3}\\ \\xrightarrow{R\\to\\infty}\\ 0" }
      ]
    }
  ];

  // ── 填空證明（2026-09-04）─────────────────────────────────────
  //
  // 抽象證明的空格（輔助函數、定理選擇）沒辦法數值判分 —— 所以走
  // 選圖題的老路：**具名誘答**。每個錯誤選項都要說得出為什麼錯，
  // 答錯的當下直接看到自己犯的是哪一種錯（循環論證、端點誤用、
  // 定理張冠李戴…）。具體算式的空格才用輸入框＋數值等價判分。
  const CLOZE = {
    "proof-mvt-001": [
      {
        kind: "choice",
        ask: "情況一：最大值 m 等於最小值 M。結論怎麼來？",
        options: [
          { label: "f 是常數，任取內點導數都是 0", correct: true },
          { label: "f 在端點取極值，套 Fermat 定理", why: "Fermat 只適用於**內點**極值 —— 端點極值的導數未必為 0，這正是這個證明要繞開的坑。" },
          { label: "由介值定理存在 c 使 f(c)=0", why: "介值定理給的是函數值，結論要的是導數值 f′(c)=0 —— 兩回事。" }
        ]
      },
      {
        kind: "choice",
        ask: "情況二：m<M。為什麼極值一定發生在內點？",
        options: [
          { label: "因為 f(a)=f(b)：兩端點值相同，比它大（或小）的極值只能在內部", correct: true },
          { label: "因為連續函數的極值都在內點", why: "錯 —— 單調函數的極值就在端點。這一步靠的是 f(a)=f(b) 這個條件，不是連續性。" },
          { label: "因為 f 可微", why: "可微是讓 Fermat 能用的條件，不是極值落在內點的理由。" }
        ]
      }
    ],
    "proof-mvt-002": [
      {
        kind: "choice",
        ask: "輔助函數 g 要怎麼設計？",
        options: [
          { tex: "g(x)=f(x)-f(a)-s(x-a)", correct: true },
          { tex: "g(x)=f(x)-f(a)-s(x-b)", why: "代 x=a 得 −s(a−b)≠0、代 x=b 得 f(b)−f(a)≠0 —— 兩端不相等，Rolle 用不了。設計輔助函數的唯一目標是讓兩端相等，設完要代進去檢查。" },
          { tex: "g(x)=f(x)-\\frac{f(b)}{b}\\,x", why: "只有 f(a)、a 湊巧配合時兩端才會相等 —— 這不是從條件推出來的設計，是賭。" }
        ]
      },
      {
        kind: "choice",
        ask: "為什麼 g 滿足 Rolle 的條件？",
        options: [
          { label: "g 連續、可微，而且 g(a)=g(b)=0", correct: true },
          { label: "因為 g′(x)=f′(x)−s 存在", why: "可微只是條件之一 —— Rolle 的關鍵前提是**兩端點值相等**，漏了它整個證明站不住。" },
          { label: "因為 g 在 (a,b) 內有極值", why: "那是 Rolle 證明過程的中間結果，不是套用 Rolle 需要的前提 —— 前提與結論不能對調。" }
        ]
      }
    ],
    "proof-mvt-003": [
      {
        kind: "choice",
        ask: "在 [x,y] 上套 MVT 之後，f(y)−f(x) 等於？",
        options: [
          { tex: "f'(c)(y-x)\\ \\text{（某個 }c\\in(x,y)\\text{）}", correct: true },
          { tex: "f'(x)(y-x)", why: "MVT 的 c 是區間**內**某一點，不是端點 —— 拿端點導數是 MVT 最常見的誤用。" },
          { tex: "0", why: "f(y)−f(x)=0 是**結論**：要先寫成 f′(c)(y−x)，再把 f′(c)=0 代進去才推得到。跳步就是循環。" }
        ]
      }
    ],
    "proof-mvt-004": [
      {
        kind: "choice",
        ask: "「嚴格遞增」的最後一擊，是哪兩個因子相乘為正？",
        options: [
          { label: "f′(c)>0 且 y−x>0", correct: true },
          { label: "f′(c)>0 且 f(y)>f(x)", why: "f(y)>f(x) 是要證的結論 —— 拿結論當理由是循環論證。" },
          { label: "f′(c)≥0 且 y−x>0", why: "≥ 只推得出「不減」（可以平的）—— 嚴格遞增需要嚴格不等號。" }
        ]
      }
    ],
    "proof-ineq-001": [
      {
        kind: "expression",
        ask: "要證 e^x > 1+x（x>0），設的輔助函數 g(x) =",
        answer: "exp(x)-1-x",
        placeholder: "exp(x)-…"
      },
      {
        kind: "choice",
        ask: "x>0 時 g′(x)>0 的理由是？",
        options: [
          { label: "g′(x)=e^x−1，而 x>0 時 e^x>1", correct: true },
          { label: "e^x>0 恆成立", why: "恆正只給出 g′>−1 —— 要的是 e^x−1>0，也就是 e^x>1，這需要 x>0。" },
          { label: "g(0)=0", why: "基準點的值與導數的符號是兩件事：g(0)=0 是起跑線，g′>0 才是往上跑。" }
        ]
      }
    ],
    "proof-integral-001": [
      {
        kind: "choice",
        ask: "從「m ≤ 平均值 ≤ M」到「存在 c 使 f(c) = 平均值」，用的是哪個定理？",
        options: [
          { label: "介值定理（IVT）", correct: true },
          { label: "極值定理", why: "極值定理是第一步拿到 m、M 用的；這一步要的是「連續函數取到中間每個值」—— 那是介值定理。" },
          { label: "平均值定理（MVT）", why: "名字像，但這裡完全不需要導數 —— 是連續函數的介值性質。" }
        ]
      }
    ]
  };
  window.BUZZ_PROOFS.forEach((proof) => {
    if (CLOZE[proof.id]) proof.cloze = CLOZE[proof.id];
  });
})();
