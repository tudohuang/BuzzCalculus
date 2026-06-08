(function () {
  "use strict";

  window.BUZZ_PROOFS = [
    {
      id: "proof-mvt-001",
      tier: "basic",
      title: "Rolle Theorem 基礎版",
      difficulty: 1,
      tags: ["rolle", "mvt"],
      prompt: "\\text{設 }f\\text{ 在 }[a,b]\\text{ 連續、在 }(a,b)\\text{ 可微，且 }f(a)=f(b).\\text{ 證明存在 }c\\in(a,b)\\text{ 使 }f'(c)=0.",
      hints: ["先看 f 是否為常數。", "若不是常數，最大值或最小值會在內點取得。", "內點極值點的導數為 0。"],
      keySteps: ["Extreme Value Theorem", "內點極值", "Fermat theorem"],
      solution: [
        "由連續性，f 在 [a,b] 上取得最大值與最小值。",
        "若 f 為常數，任取 c in (a,b) 即有 f'(c)=0。",
        "若 f 不是常數，因 f(a)=f(b)，最大值或最小值至少有一個不會只在端點取得。",
        "取該內點極值 c，依 Fermat theorem 得 f'(c)=0。"
      ]
    },
    {
      id: "proof-mvt-002",
      tier: "basic",
      title: "Mean Value Theorem",
      difficulty: 1,
      tags: ["mvt"],
      prompt: "\\text{設 }f\\text{ 在 }[a,b]\\text{ 連續、在 }(a,b)\\text{ 可微。證明存在 }c\\in(a,b)\\text{ 使 }f'(c)=\\frac{f(b)-f(a)}{b-a}.",
      hints: ["把割線斜率扣掉。", "令 g(x)=f(x)-線性函數。", "對 g 使用 Rolle theorem。"],
      keySteps: ["建構輔助函數", "Rolle theorem", "還原斜率"],
      solution: [
        "令 g(x)=f(x)-f(a)-((f(b)-f(a))/(b-a))(x-a)。",
        "則 g 在 [a,b] 連續、在 (a,b) 可微，且 g(a)=g(b)=0。",
        "由 Rolle theorem，存在 c in (a,b) 使 g'(c)=0。",
        "因此 f'(c)-(f(b)-f(a))/(b-a)=0，結論成立。"
      ]
    },
    {
      id: "proof-mvt-003",
      tier: "basic",
      title: "導數為零推出常數",
      difficulty: 1,
      tags: ["mvt", "constant"],
      prompt: "\\text{設 }f\\text{ 在區間 }I\\text{ 上可微，且對所有 }x\\in I\\text{ 有 }f'(x)=0.\\text{ 證明 }f\\text{ 為常數。}",
      hints: ["任取兩點 x<y。", "在 [x,y] 上用 MVT。", "割線斜率等於某點導數。"],
      keySteps: ["任取兩點", "MVT", "差值為 0"],
      solution: [
        "任取 x<y in I。",
        "由 MVT，存在 c in (x,y) 使 f(y)-f(x)=f'(c)(y-x)。",
        "因 f'(c)=0，所以 f(y)-f(x)=0。",
        "任兩點函數值相同，故 f 為常數。"
      ]
    },
    {
      id: "proof-mvt-004",
      tier: "basic",
      title: "單調性判準",
      difficulty: 1,
      tags: ["mvt", "monotonicity"],
      prompt: "\\text{設 }f\\text{ 在區間 }I\\text{ 上可微，且 }f'(x)>0.\\text{ 證明 }f\\text{ 在 }I\\text{ 上嚴格遞增。}",
      hints: ["任取 x<y。", "對 [x,y] 使用 MVT。", "導數正，差值正。"],
      keySteps: ["MVT", "正導數", "嚴格遞增"],
      solution: [
        "任取 x<y in I。",
        "由 MVT，存在 c in (x,y) 使 f(y)-f(x)=f'(c)(y-x)。",
        "因 f'(c)>0 且 y-x>0，所以 f(y)-f(x)>0。",
        "因此 f(x)<f(y)，f 嚴格遞增。"
      ]
    },
    {
      id: "proof-ineq-001",
      tier: "basic",
      title: "指數不等式",
      difficulty: 2,
      tags: ["mvt", "inequality"],
      prompt: "\\text{證明對所有 }x>0,\\ e^x>1+x.",
      hints: ["令 f(x)=e^x-1-x。", "看 f(0) 與 f'(x)。", "或直接對 e^t 在 [0,x] 用 MVT。"],
      keySteps: ["輔助函數", "導數正", "嚴格遞增"],
      solution: [
        "令 f(x)=e^x-1-x。",
        "有 f(0)=0，且 f'(x)=e^x-1。",
        "當 x>0 時，f'(x)>0，因此 f 在 (0,infty) 上遞增。",
        "所以 x>0 時 f(x)>f(0)=0，即 e^x>1+x。"
      ]
    },
    {
      id: "proof-ineq-002",
      tier: "standard",
      title: "log 不等式",
      difficulty: 2,
      tags: ["mvt", "inequality", "log"],
      prompt: "\\text{證明對所有 }x>0,\\ \\ln(1+x)<x.",
      hints: ["令 f(x)=x-ln(1+x)。", "檢查 f(0)。", "f'(x)=x/(1+x)。"],
      keySteps: ["輔助函數", "導數非負", "嚴格性"],
      solution: [
        "令 f(x)=x-ln(1+x)。",
        "有 f(0)=0，且 f'(x)=1-1/(1+x)=x/(1+x)。",
        "當 x>0 時 f'(x)>0，所以 f(x)>f(0)=0。",
        "因此 ln(1+x)<x。"
      ]
    },
    {
      id: "proof-convex-001",
      tier: "standard",
      title: "凸性與切線不等式",
      difficulty: 2,
      tags: ["convexity", "inequality"],
      prompt: "\\text{設 }f''(x)\\ge0.\\text{ 證明 }f(y)\\ge f(x)+f'(x)(y-x).",
      hints: ["令 g(t)=f(t)-f(x)-f'(x)(t-x)。", "g(x)=0, g'(x)=0。", "用 g' 的單調性分 y>x 與 y<x。"],
      keySteps: ["輔助函數", "g'' >= 0", "切線在圖形下方"],
      solution: [
        "令 g(t)=f(t)-f(x)-f'(x)(t-x)。",
        "則 g(x)=0, g'(x)=0，且 g''(t)=f''(t)>=0。",
        "因此 g' 單調遞增。",
        "若 y>x，則 g'(t)>=0 on [x,y]，所以 g(y)>=g(x)=0。",
        "若 y<x，則由 g' 單調遞增得 t in [y,x] 時 g'(t)<=0，積分也得 g(y)>=0。",
        "故 f(y)>=f(x)+f'(x)(y-x)。"
      ]
    },
    {
      id: "proof-taylor-001",
      tier: "standard",
      title: "Taylor Remainder 估計",
      difficulty: 3,
      tags: ["taylor", "remainder"],
      prompt: "\\text{若 }|f^{(n+1)}(t)|\\le M\\text{ on }[a,x],\\text{ 證明 Taylor 餘項 }|R_n(x)|\\le \\frac{M|x-a|^{n+1}}{(n+1)!}.",
      hints: ["使用 Lagrange remainder。", "R_n=f^{(n+1)}(xi)(x-a)^{n+1}/(n+1)!。", "取絕對值。"],
      keySteps: ["Taylor theorem", "Lagrange remainder", "絕對值估計"],
      solution: [
        "由 Taylor theorem with Lagrange remainder，存在 xi between a and x 使",
        "R_n(x)=f^{(n+1)}(xi)(x-a)^{n+1}/(n+1)!。",
        "取絕對值並使用 |f^{(n+1)}(xi)|<=M。",
        "得到 |R_n(x)|<=M|x-a|^{n+1}/(n+1)!。"
      ]
    },
    {
      id: "proof-integral-001",
      tier: "standard",
      title: "積分平均值定理",
      difficulty: 3,
      tags: ["integral", "mvt"],
      prompt: "\\text{設 }f\\text{ 在 }[a,b]\\text{ 連續。證明存在 }c\\in[a,b]\\text{ 使 }\\int_a^b f(x)dx=f(c)(b-a).",
      hints: ["用 extreme value theorem。", "m <= f <= M。", "介值定理補最後一步。"],
      keySteps: ["EVT", "積分夾擠", "IVT"],
      solution: [
        "由連續性，f 在 [a,b] 取得最小值 m 與最大值 M。",
        "所以 m(b-a)<=int_a^b f(x)dx<=M(b-a)。",
        "令 A=(1/(b-a))int_a^b f(x)dx，則 m<=A<=M。",
        "由介值定理，存在 c in [a,b] 使 f(c)=A。",
        "因此 int_a^b f(x)dx=f(c)(b-a)。"
      ]
    },
    {
      id: "proof-improper-001",
      tier: "standard",
      title: "p-integral 收斂判準",
      difficulty: 3,
      tags: ["improper-integral", "comparison"],
      prompt: "\\text{證明 }\\int_1^\\infty \\frac{1}{x^p}dx\\text{ 收斂若且唯若 }p>1.",
      hints: ["直接計算 improper integral。", "分 p=1 與 p 不等於 1。", "看 R -> infinity。"],
      keySteps: ["反導數", "極限", "iff"],
      solution: [
        "若 p=1，int_1^R dx/x=ln R，R->infty 發散。",
        "若 p!=1，int_1^R x^{-p}dx=(R^{1-p}-1)/(1-p)。",
        "當 p>1 時，1-p<0，R^{1-p}->0，極限有限。",
        "當 p<1 時，R^{1-p}->infty，發散。",
        "故收斂若且唯若 p>1。"
      ]
    },
    {
      id: "proof-series-001",
      tier: "standard",
      title: "交錯級數判別",
      difficulty: 3,
      tags: ["series", "alternating"],
      prompt: "\\text{設 }a_n\\downarrow0\\text{ 且 }a_n\\ge0.\\text{ 證明 }\\sum (-1)^{n+1}a_n\\text{ 收斂。}",
      hints: ["看偶數部分和與奇數部分和。", "一個遞增，一個遞減。", "差距趨近 0。"],
      keySteps: ["partial sums", "monotone convergence", "gap -> 0"],
      solution: [
        "令 s_n=sum_{k=1}^n (-1)^{k+1}a_k。",
        "偶數部分和 s_{2n} 遞增，奇數部分和 s_{2n+1} 遞減。",
        "且 s_{2n}<=s_{2n+1}，兩者差為 a_{2n+1}->0。",
        "由單調有界收斂，兩個子列收斂且極限相同。",
        "因此原級數收斂。"
      ]
    },
    {
      id: "proof-series-002",
      tier: "standard",
      title: "Root Test",
      difficulty: 3,
      tags: ["series", "root-test"],
      prompt: "\\text{若 }\\limsup |a_n|^{1/n}=L<1,\\text{ 證明 }\\sum a_n\\text{ 絕對收斂。}",
      hints: ["選 r 使 L<r<1。", "充分大 n 有 |a_n|^{1/n}<=r。", "和 geometric series 比較。"],
      keySteps: ["limsup", "geometric comparison", "absolute convergence"],
      solution: [
        "取 r 滿足 L<r<1。",
        "由 limsup 定義，存在 N 使 n>=N 時 |a_n|^{1/n}<=r。",
        "因此 |a_n|<=r^n for n>=N。",
        "因 sum r^n 收斂，比較判別得 sum |a_n| 收斂。",
        "故 sum a_n 絕對收斂。"
      ]
    },
    {
      id: "proof-uniform-001",
      tier: "advanced",
      title: "Weierstrass M-test",
      difficulty: 4,
      tags: ["series", "uniform-convergence"],
      prompt: "\\text{若 }|f_n(x)|\\le M_n\\text{ for all }x\\in E\\text{ 且 }\\sum M_n\\text{ 收斂，證明 }\\sum f_n\\text{ 一致收斂。}",
      hints: ["用 Cauchy criterion for uniform convergence。", "尾和絕對值小於 M_n 尾和。", "M_n 的尾和可任意小。"],
      keySteps: ["uniform Cauchy", "tail estimate", "M-series convergence"],
      solution: [
        "令 S_N(x)=sum_{n=1}^N f_n(x)。",
        "對 m>n，有 |S_m(x)-S_n(x)|<=sum_{k=n+1}^m |f_k(x)|<=sum_{k=n+1}^m M_k。",
        "因 sum M_k 收斂，其尾和對充分大 n 可小於任意 epsilon。",
        "此估計與 x 無關，因此 S_N 是 uniformly Cauchy。",
        "故 sum f_n 在 E 上一致收斂。"
      ]
    },
    {
      id: "proof-multi-001",
      tier: "advanced",
      title: "可微推出連續",
      difficulty: 4,
      tags: ["multivariable", "differentiability"],
      prompt: "\\text{設 }f:\\mathbb{R}^n\\to\\mathbb{R}\\text{ 在 }a\\text{ 可微。證明 }f\\text{ 在 }a\\text{ 連續。}",
      hints: ["寫出可微定義。", "f(a+h)-f(a)=L(h)+r(h)。", "兩項都趨近 0。"],
      keySteps: ["differentiability definition", "linear part", "remainder"],
      solution: [
        "由可微，存在線性映射 L 使 f(a+h)-f(a)=L(h)+r(h)，且 r(h)/||h|| -> 0。",
        "線性映射在有限維空間連續，故 |L(h)|<=C||h||。",
        "同時 r(h)=o(||h||)。",
        "因此 |f(a+h)-f(a)|<=C||h||+o(||h||)->0。",
        "所以 f 在 a 連續。"
      ]
    },
    {
      id: "proof-multi-002",
      tier: "advanced",
      title: "Total Differential Error Estimate",
      difficulty: 4,
      tags: ["total-differential", "estimate"],
      prompt: "\\text{若 }f\\text{ 在 }a\\text{ 可微，證明 }f(a+h)=f(a)+Df(a)h+o(\\|h\\|).",
      hints: ["這其實是可微定義。", "把誤差項單獨命名。", "證明誤差除以 ||h|| 趨近 0。"],
      keySteps: ["definition", "linear approximation", "little-o"],
      solution: [
        "依可微定義，存在線性映射 Df(a) 使",
        "lim_{h->0} [f(a+h)-f(a)-Df(a)h]/||h||=0。",
        "令 r(h)=f(a+h)-f(a)-Df(a)h。",
        "則 r(h)/||h||->0，即 r(h)=o(||h||)。",
        "所以 f(a+h)=f(a)+Df(a)h+o(||h||)。"
      ]
    },
    {
      id: "proof-hessian-001",
      tier: "advanced",
      title: "Hessian Positive Definite 判準",
      difficulty: 4,
      tags: ["hessian", "optimization"],
      prompt: "\\text{設 }f\\in C^2\\text{ 且 }\\nabla f(a)=0,\\ H_f(a)\\text{ positive definite. 證明 }a\\text{ 是 strict local minimum.",
      hints: ["用二階 Taylor 展開。", "positive definite 給二次型下界。", "餘項比 ||h||^2 小。"],
      keySteps: ["second-order Taylor", "quadratic lower bound", "strict local min"],
      solution: [
        "由二階 Taylor 展開，f(a+h)-f(a)=1/2 h^T H_f(a)h+o(||h||^2)，因為 gradient 項為 0。",
        "H_f(a) positive definite，所以存在 lambda>0 使 h^T H_f(a)h>=lambda||h||^2。",
        "當 h 足夠小，o(||h||^2) 的絕對值小於 (lambda/4)||h||^2。",
        "故 f(a+h)-f(a)>= (lambda/2)||h||^2/2 - (lambda/4)||h||^2 >0 for h !=0 sufficiently small。",
        "因此 a 是 strict local minimum。"
      ]
    },
    {
      id: "proof-jacobian-001",
      tier: "advanced",
      title: "Jacobian Chain Rule",
      difficulty: 4,
      tags: ["jacobian", "chain-rule"],
      prompt: "\\text{設 }F:\\mathbb{R}^n\\to\\mathbb{R}^m,\\ G:\\mathbb{R}^m\\to\\mathbb{R}^k\\text{ 可微。證明 }D(G\\circ F)(a)=DG(F(a))DF(a).",
      hints: ["分別寫 F 與 G 的線性近似。", "把 F(a+h)-F(a) 代入 G 的展開。", "收集線性項與小 o。"],
      keySteps: ["linear approximation", "composition", "matrix product"],
      solution: [
        "因 F 在 a 可微，F(a+h)=F(a)+DF(a)h+r_F(h)，其中 r_F(h)=o(||h||)。",
        "因 G 在 F(a) 可微，G(F(a)+u)=G(F(a))+DG(F(a))u+r_G(u)，其中 r_G(u)=o(||u||)。",
        "令 u=DF(a)h+r_F(h)，則 u=O(||h||)。",
        "代入得 G(F(a+h))=G(F(a))+DG(F(a))DF(a)h+DG(F(a))r_F(h)+r_G(u)。",
        "後兩項都是 o(||h||)，所以導數為 DG(F(a))DF(a)。"
      ]
    },
    {
      id: "proof-implicit-001",
      tier: "boss",
      title: "Implicit Function Derivative",
      difficulty: 5,
      tags: ["implicit-function", "jacobian"],
      prompt: "\\text{設 }F(x,y)=0\\text{ 在點 }(a,b)\\text{ 附近定義 }y=g(x),\\ F_y(a,b)\\ne0.\\text{ 證明 }g'(a)=-F_x(a,b)/F_y(a,b).",
      hints: ["從 F(x,g(x))=0 開始。", "兩邊對 x 微分。", "在 x=a 代入。"],
      keySteps: ["implicit relation", "chain rule", "solve for g'"],
      solution: [
        "由隱函數關係，F(x,g(x))=0。",
        "對 x 微分得 F_x(x,g(x))+F_y(x,g(x))g'(x)=0。",
        "令 x=a，且 g(a)=b，得到 F_x(a,b)+F_y(a,b)g'(a)=0。",
        "因 F_y(a,b) 不為 0，可解得 g'(a)=-F_x(a,b)/F_y(a,b)。"
      ]
    },
    {
      id: "proof-todai-001",
      tier: "boss",
      title: "Todai-style Jacobian Gate",
      difficulty: 5,
      tags: ["todai-inspired", "jacobian", "inverse-function"],
      prompt: "\\text{設 }u=x+y,\\ v=xy.\\text{ 在 }x\\ne y\\text{ 的區域中，證明 }(u,v)\\text{ 可作為局部座標，並求 }\\frac{\\partial(x,y)}{\\partial(u,v)}.",
      hints: ["先算 ∂(u,v)/∂(x,y)。", "行列式非零時可用 inverse function theorem。", "反 Jacobian 是倒數。"],
      keySteps: ["Jacobian determinant", "nonzero condition", "local inverse"],
      solution: [
        "計算 Jacobian：J=det [[u_x,u_y],[v_x,v_y]]=det [[1,1],[y,x]]=x-y。",
        "當 x!=y 時，J 不為 0。",
        "由 inverse function theorem，映射 (x,y)->(u,v) 在該點附近有局部反函數，所以 (u,v) 可作為局部座標。",
        "反變換的 Jacobian determinant 為倒數。",
        "因此 ∂(x,y)/∂(u,v)=1/(x-y)。"
      ]
    },
    {
      id: "proof-todai-002",
      tier: "boss",
      title: "可怕但不壓箱底：Path + Continuity",
      difficulty: 5,
      tags: ["todai-inspired", "multivariable", "path-test"],
      prompt: "\\text{令 }f(x,y)=\\frac{x^2y}{x^4+y^2}\\text{ for }(x,y)\\ne(0,0).\\text{ 證明不存在任何 }L\\text{ 使 }f\\text{ 在 }(0,0)\\text{ 可連續延拓為 }L.",
      hints: ["沿 y=0 看。", "沿 y=x^2 看。", "兩條路徑給不同極限。"],
      keySteps: ["path y=0", "path y=x^2", "different limits"],
      solution: [
        "沿 y=0，f(x,0)=0，所以極限為 0。",
        "沿 y=x^2，f(x,x^2)=x^2*x^2/(x^4+x^4)=1/2。",
        "同一點趨近但兩條路徑得到不同極限。",
        "因此二變數極限不存在。",
        "若可連續延拓，極限必須存在且等於 L，矛盾。"
      ]
    }
  ];
})();
