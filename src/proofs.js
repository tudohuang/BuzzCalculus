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
    }
  ];
})();
