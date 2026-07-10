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
      tags: ["todai-inspired", "jacobian", "chain-rule"],
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
      tags: ["todai-inspired", "multivariable", "path-test"],
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
      tags: ["todai-inspired", "inverse-function", "jacobian"],
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
    }
  ];
})();
