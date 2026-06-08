(function () {
  "use strict";

  window.BUZZ_PROOFS = [
    {
      id: "proof-mvt-001",
      tier: "basic",
      title: "Rolle Theorem",
      difficulty: 1,
      tags: ["rolle", "mvt"],
      statement: "證明 Rolle theorem 的標準形式。",
      prompt: "f\\in C([a,b])\\cap C^1((a,b)),\\quad f(a)=f(b)\\Rightarrow \\exists c\\in(a,b),\\ f'(c)=0",
      hints: ["先用極值定理。", "如果最大值和最小值都在端點，函數會變成常數。", "如果內點達到極值，用 Fermat theorem。"],
      keySteps: ["Extreme Value Theorem", "endpoint case", "Fermat theorem"],
      solution: [
        {
          text: "因為 f 在閉區間上連續，所以由 extreme value theorem，f 在 [a,b] 上取到最大值與最小值。",
          tex: "\\exists x_m,x_M\\in[a,b]\\quad f(x_m)=m,\\quad f(x_M)=M"
        },
        {
          text: "若 m=M，則 f 在整個 [a,b] 上為常數，因此任取 c in (a,b) 都有導數為 0。",
          tex: "m=M\\Rightarrow f(x)\\equiv m\\Rightarrow f'(c)=0"
        },
        {
          text: "若 m<M，由 f(a)=f(b) 可知最大值或最小值至少有一個不是只在端點出現，因此存在內點 c 使 f 在 c 取得局部極值。",
          tex: "\\exists c\\in(a,b)\\quad c\\text{ is a local extremum of }f"
        },
        {
          text: "f 在 c 可微，且 c 是內點局部極值，因此由 Fermat theorem 得到 f'(c)=0。",
          tex: "f'(c)=0"
        }
      ]
    },
    {
      id: "proof-mvt-002",
      tier: "basic",
      title: "Mean Value Theorem",
      difficulty: 1,
      tags: ["mvt"],
      statement: "用 Rolle theorem 證明平均值定理。",
      prompt: "f\\in C([a,b])\\cap C^1((a,b))\\Rightarrow \\exists c\\in(a,b),\\ f'(c)=\\frac{f(b)-f(a)}{b-a}",
      hints: ["扣掉連接兩端點的割線。", "構造一個兩端點值相同的函數。", "對新函數用 Rolle theorem。"],
      keySteps: ["secant line", "Rolle theorem", "solve slope"],
      solution: [
        {
          text: "設割線斜率為 s，並把 f 減掉通過兩端點的直線。",
          tex: "s=\\frac{f(b)-f(a)}{b-a},\\qquad g(x)=f(x)-f(a)-s(x-a)"
        },
        {
          text: "g 保持連續與可微，且兩端點值相同。",
          tex: "g(a)=0,\\qquad g(b)=f(b)-f(a)-s(b-a)=0"
        },
        {
          text: "由 Rolle theorem，存在 c in (a,b) 使 g'(c)=0。",
          tex: "\\exists c\\in(a,b),\\qquad g'(c)=0"
        },
        {
          text: "計算 g' 並代回即可得到 MVT。",
          tex: "g'(c)=f'(c)-s=0\\Rightarrow f'(c)=\\frac{f(b)-f(a)}{b-a}"
        }
      ]
    },
    {
      id: "proof-mvt-003",
      tier: "basic",
      title: "Zero Derivative Implies Constant",
      difficulty: 1,
      tags: ["mvt", "constant"],
      statement: "證明一個可微函數若導數處處為 0，則在區間上為常數。",
      prompt: "f'(x)=0\\ \\forall x\\in I\\Rightarrow f\\text{ is constant on }I",
      hints: ["任取兩點 x<y。", "在 [x,y] 上使用 MVT。", "斜率等於某點導數。"],
      keySteps: ["choose two points", "MVT", "difference is zero"],
      solution: [
        {
          text: "任取 x<y 且 x,y in I。只要證明 f(x)=f(y)，就能推出 f 在 I 上為常數。",
          tex: "x<y,\\quad x,y\\in I"
        },
        {
          text: "在 [x,y] 上套用 MVT，存在 c in (x,y) 使割線斜率等於 f'(c)。",
          tex: "f(y)-f(x)=f'(c)(y-x)"
        },
        {
          text: "由假設 f'(c)=0，所以兩點函數值相同。",
          tex: "f(y)-f(x)=0\\cdot(y-x)=0"
        },
        {
          text: "任意兩點函數值都相同，因此 f 在 I 上為常數。",
          tex: "\\forall x,y\\in I,\\ f(x)=f(y)"
        }
      ]
    },
    {
      id: "proof-mvt-004",
      tier: "basic",
      title: "Derivative Sign and Monotonicity",
      difficulty: 1,
      tags: ["mvt", "monotonicity"],
      statement: "證明導數恆正會推出函數嚴格遞增。",
      prompt: "f'(x)>0\\ \\forall x\\in I\\Rightarrow f\\text{ is strictly increasing on }I",
      hints: ["任取 x<y。", "對 [x,y] 使用 MVT。", "注意 y-x 的正負。"],
      keySteps: ["MVT", "positive slope", "strict increase"],
      solution: [
        {
          text: "任取 x<y。由 MVT，存在 c in (x,y) 使差商等於 f'(c)。",
          tex: "f(y)-f(x)=f'(c)(y-x)"
        },
        {
          text: "因為 f'(c)>0 且 y-x>0，所以右邊為正。",
          tex: "f'(c)(y-x)>0"
        },
        {
          text: "因此 f(y)>f(x)。",
          tex: "f(y)-f(x)>0\\Rightarrow f(y)>f(x)"
        },
        {
          text: "這對任意 x<y 都成立，所以 f 嚴格遞增。",
          tex: "x<y\\Rightarrow f(x)<f(y)"
        }
      ]
    },
    {
      id: "proof-ineq-001",
      tier: "basic",
      title: "Exponential Inequality",
      difficulty: 2,
      tags: ["mvt", "inequality"],
      statement: "證明指數函數的基本不等式。",
      prompt: "x>0\\Rightarrow e^x>1+x",
      hints: ["考慮 e^x-1-x。", "看它在 0 的值。", "證明它在正半軸遞增。"],
      keySteps: ["auxiliary function", "derivative sign", "monotonicity"],
      solution: [
        {
          text: "定義輔助函數。",
          tex: "g(x)=e^x-1-x"
        },
        {
          text: "先看基準點。",
          tex: "g(0)=e^0-1-0=0"
        },
        {
          text: "計算導數。當 x>0 時，導數為正。",
          tex: "g'(x)=e^x-1>0\\qquad (x>0)"
        },
        {
          text: "所以 g 在 (0,infty) 上嚴格遞增，對 x>0 有 g(x)>g(0)。",
          tex: "x>0\\Rightarrow g(x)>0"
        },
        {
          text: "展開 g(x)>0 即得結論。",
          tex: "e^x-1-x>0\\Rightarrow e^x>1+x"
        }
      ]
    },
    {
      id: "proof-ineq-002",
      tier: "standard",
      title: "Logarithm Inequality",
      difficulty: 2,
      tags: ["mvt", "inequality", "log"],
      statement: "證明 log 的基本上界。",
      prompt: "x>0\\Rightarrow \\ln(1+x)<x",
      hints: ["把右邊減左邊。", "導數應該是正的。", "用 0 當基準點。"],
      keySteps: ["auxiliary function", "derivative sign", "strict inequality"],
      solution: [
        {
          text: "設輔助函數為右邊減左邊。",
          tex: "g(x)=x-\\ln(1+x)"
        },
        {
          text: "在 0 處，兩者相等。",
          tex: "g(0)=0"
        },
        {
          text: "計算導數，對 x>0 為正。",
          tex: "g'(x)=1-\\frac{1}{1+x}=\\frac{x}{1+x}>0"
        },
        {
          text: "因此 g 在正半軸嚴格遞增，x>0 時 g(x)>0。",
          tex: "x>0\\Rightarrow x-\\ln(1+x)>0"
        },
        {
          text: "移項得到要證的不等式。",
          tex: "\\ln(1+x)<x"
        }
      ]
    },
    {
      id: "proof-convex-001",
      tier: "standard",
      title: "Convex Tangent Inequality",
      difficulty: 2,
      tags: ["convexity", "inequality"],
      statement: "證明二階導數非負時，函數圖形在任意切線上方。",
      prompt: "f''(t)\\ge0\\Rightarrow f(y)\\ge f(x)+f'(x)(y-x)",
      hints: ["固定 x，對 y 做輔助函數。", "證明輔助函數在 x 附近由 0 往外不會變負。", "也可以用積分形式。"],
      keySteps: ["convexity", "monotone derivative", "tangent lower bound"],
      solution: [
        {
          text: "固定 x，定義扣掉切線後的函數。",
          tex: "g(t)=f(t)-f(x)-f'(x)(t-x)"
        },
        {
          text: "在 t=x 時，g 與 g' 都為 0。",
          tex: "g(x)=0,\\qquad g'(x)=f'(x)-f'(x)=0"
        },
        {
          text: "因為 g''=f''>=0，所以 g' 單調遞增。",
          tex: "g''(t)=f''(t)\\ge0"
        },
        {
          text: "若 y>x，則在 [x,y] 上 g'(t)>=0，所以 g(y)>=g(x)=0。",
          tex: "y>x\\Rightarrow g(y)-g(x)=\\int_x^y g'(t)\\,dt\\ge0"
        },
        {
          text: "若 y<x，則在 [y,x] 上 g'(t)<=0，因此積分方向反過來仍得到 g(y)>=0。",
          tex: "y<x\\Rightarrow g(y)-g(x)=-\\int_y^x g'(t)\\,dt\\ge0"
        },
        {
          text: "所以對所有 y 都有 g(y)>=0，整理即得切線不等式。",
          tex: "f(y)\\ge f(x)+f'(x)(y-x)"
        }
      ]
    },
    {
      id: "proof-taylor-001",
      tier: "standard",
      title: "Taylor Remainder Estimate",
      difficulty: 3,
      tags: ["taylor", "remainder"],
      statement: "用 Lagrange remainder 證明 Taylor 餘項估計。",
      prompt: "|f^{(n+1)}(t)|\\le M\\Rightarrow |R_n(x)|\\le \\frac{M|x-a|^{n+1}}{(n+1)!}",
      hints: ["先寫出 Taylor theorem 的 Lagrange 餘項。", "餘項中的 xi 介於 a 與 x 之間。", "最後取絕對值估計。"],
      keySteps: ["Taylor theorem", "Lagrange remainder", "absolute value bound"],
      solution: [
        {
          text: "Taylor theorem 給出 n 階展開與 Lagrange 型餘項。",
          tex: "f(x)=\\sum_{k=0}^{n}\\frac{f^{(k)}(a)}{k!}(x-a)^k+R_n(x)"
        },
        {
          text: "其中存在 xi 介於 a 與 x 之間，使得餘項為。",
          tex: "R_n(x)=\\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-a)^{n+1}"
        },
        {
          text: "由假設，xi 落在區間內時有導數界。",
          tex: "|f^{(n+1)}(\\xi)|\\le M"
        },
        {
          text: "取絕對值並代入估計。",
          tex: "|R_n(x)|\\le \\frac{M|x-a|^{n+1}}{(n+1)!}"
        }
      ]
    },
    {
      id: "proof-integral-001",
      tier: "standard",
      title: "Integral Mean Value Theorem",
      difficulty: 3,
      tags: ["integral", "mvt"],
      statement: "證明連續函數的積分平均值定理。",
      prompt: "f\\in C([a,b])\\Rightarrow \\exists c\\in[a,b],\\ \\int_a^b f(x)\\,dx=f(c)(b-a)",
      hints: ["用 extreme value theorem 找上下界。", "把積分平均值夾在最小值與最大值之間。", "最後用 IVT。"],
      keySteps: ["EVT", "average value", "IVT"],
      solution: [
        {
          text: "由 extreme value theorem，f 在 [a,b] 上取得最小值 m 與最大值 M。",
          tex: "m\\le f(x)\\le M\\qquad (x\\in[a,b])"
        },
        {
          text: "對不等式積分。",
          tex: "m(b-a)\\le\\int_a^b f(x)\\,dx\\le M(b-a)"
        },
        {
          text: "令 A 為平均值，得到 A 介於 m 與 M 之間。",
          tex: "A=\\frac{1}{b-a}\\int_a^b f(x)\\,dx,\\qquad m\\le A\\le M"
        },
        {
          text: "由 IVT，存在 c in [a,b] 使 f(c)=A。",
          tex: "\\exists c\\in[a,b],\\qquad f(c)=A"
        },
        {
          text: "乘回 b-a 即得結論。",
          tex: "\\int_a^b f(x)\\,dx=f(c)(b-a)"
        }
      ]
    },
    {
      id: "proof-improper-001",
      tier: "standard",
      title: "p-Integral Criterion",
      difficulty: 3,
      tags: ["improper-integral", "comparison"],
      statement: "證明 p-integral 的收斂條件。",
      prompt: "\\int_1^\\infty \\frac{1}{x^p}\\,dx\\text{ converges}\\Longleftrightarrow p>1",
      hints: ["先改成從 1 到 R 的極限。", "p=1 需要分開看。", "p 不等於 1 時直接積分。"],
      keySteps: ["improper integral", "limit", "if and only if"],
      solution: [
        {
          text: "若 p=1，積分變成 log，極限發散。",
          tex: "\\int_1^R\\frac{dx}{x}=\\ln R\\to\\infty"
        },
        {
          text: "若 p 不等於 1，先算有限上限 R。",
          tex: "\\int_1^R x^{-p}\\,dx=\\frac{R^{1-p}-1}{1-p}"
        },
        {
          text: "若 p>1，則 1-p<0，R^{1-p} 會趨近 0，因此極限有限。",
          tex: "p>1\\Rightarrow R^{1-p}\\to0"
        },
        {
          text: "若 p<1，則 1-p>0，R^{1-p} 趨近無限大，因此發散。",
          tex: "p<1\\Rightarrow R^{1-p}\\to\\infty"
        },
        {
          text: "合併 p=1 的情況，收斂若且唯若 p>1。",
          tex: "\\int_1^\\infty x^{-p}\\,dx<\\infty\\Longleftrightarrow p>1"
        }
      ]
    },
    {
      id: "proof-series-001",
      tier: "standard",
      title: "Alternating Series Test",
      difficulty: 3,
      tags: ["series", "alternating"],
      statement: "證明 Leibniz alternating series test。",
      prompt: "a_n\\downarrow0,\\ a_n\\ge0\\Rightarrow \\sum_{n=1}^{\\infty}(-1)^{n+1}a_n\\text{ converges}",
      hints: ["觀察偶數部分和與奇數部分和。", "一邊遞增，一邊遞減。", "兩列部分和距離趨近 0。"],
      keySteps: ["partial sums", "monotone convergence", "gap to zero"],
      solution: [
        {
          text: "令 s_n 為部分和。",
          tex: "s_n=\\sum_{k=1}^{n}(-1)^{k+1}a_k"
        },
        {
          text: "偶數部分和單調遞增，因為每多兩項增加非負量。",
          tex: "s_{2n+2}-s_{2n}=a_{2n+1}-a_{2n+2}\\ge0"
        },
        {
          text: "奇數部分和單調遞減。",
          tex: "s_{2n+3}-s_{2n+1}=-a_{2n+2}+a_{2n+3}\\le0"
        },
        {
          text: "且偶數部分和永遠不超過奇數部分和。",
          tex: "s_{2n}\\le s_{2n+1},\\qquad s_{2n+1}-s_{2n}=a_{2n+1}\\to0"
        },
        {
          text: "兩列單調有界且距離趨近 0，所以收斂到同一極限，原級數收斂。",
          tex: "\\lim s_{2n}=\\lim s_{2n+1}\\Rightarrow \\lim s_n\\text{ exists}"
        }
      ]
    },
    {
      id: "proof-series-002",
      tier: "standard",
      title: "Root Test",
      difficulty: 3,
      tags: ["series", "root-test"],
      statement: "證明 root test 的收斂方向。",
      prompt: "\\limsup_{n\\to\\infty}|a_n|^{1/n}=L<1\\Rightarrow \\sum a_n\\text{ absolutely converges}",
      hints: ["選一個 r 使 L<r<1。", "利用 limsup 的定義。", "最後比較幾何級數。"],
      keySteps: ["limsup", "geometric comparison", "absolute convergence"],
      solution: [
        {
          text: "選 r 介於 L 與 1 之間。",
          tex: "L<r<1"
        },
        {
          text: "由 limsup 的定義，存在 N，使得 n>=N 時根號量被 r 控制。",
          tex: "n\\ge N\\Rightarrow |a_n|^{1/n}\\le r"
        },
        {
          text: "因此尾端每一項都被幾何級數項控制。",
          tex: "|a_n|\\le r^n\\qquad(n\\ge N)"
        },
        {
          text: "因為 r<1，幾何級數收斂。",
          tex: "\\sum_{n=N}^{\\infty}r^n<\\infty"
        },
        {
          text: "比較判別法推出絕對收斂。",
          tex: "\\sum |a_n|<\\infty\\Rightarrow \\sum a_n\\text{ converges absolutely}"
        }
      ]
    },
    {
      id: "proof-uniform-001",
      tier: "advanced",
      title: "Weierstrass M-Test",
      difficulty: 4,
      tags: ["series", "uniform-convergence"],
      statement: "證明 Weierstrass M-test。",
      prompt: "|f_n(x)|\\le M_n\\ \\forall x\\in E,\\quad \\sum M_n<\\infty\\Rightarrow \\sum f_n\\text{ uniformly converges on }E",
      hints: ["用 uniform Cauchy criterion。", "函數級數尾巴可被 M_n 尾巴控制。", "M_n 的尾巴與 x 無關。"],
      keySteps: ["uniform Cauchy", "tail estimate", "M-series convergence"],
      solution: [
        {
          text: "令 S_N 為前 N 項部分和。",
          tex: "S_N(x)=\\sum_{n=1}^{N}f_n(x)"
        },
        {
          text: "對 m>n，估計部分和差。",
          tex: "|S_m(x)-S_n(x)|\\le\\sum_{k=n+1}^{m}|f_k(x)|\\le\\sum_{k=n+1}^{m}M_k"
        },
        {
          text: "因為 sum M_k 收斂，其尾和可任意小。",
          tex: "\\forall\\varepsilon>0,\\ \\exists N,\\ n\\ge N\\Rightarrow \\sum_{k=n+1}^{\\infty}M_k<\\varepsilon"
        },
        {
          text: "這個估計不依賴 x，因此 S_N 是 uniformly Cauchy。",
          tex: "\\sup_{x\\in E}|S_m(x)-S_n(x)|<\\varepsilon"
        },
        {
          text: "由 uniform Cauchy criterion，函數級數一致收斂。",
          tex: "\\sum f_n\\text{ converges uniformly on }E"
        }
      ]
    },
    {
      id: "proof-multi-001",
      tier: "advanced",
      title: "Differentiability Implies Continuity",
      difficulty: 4,
      tags: ["multivariable", "differentiability"],
      statement: "證明多變數可微必連續。",
      prompt: "f:\\mathbb{R}^n\\to\\mathbb{R},\\quad f\\text{ differentiable at }a\\Rightarrow f\\text{ continuous at }a",
      hints: ["寫出可微定義。", "線性部分會被常數乘 norm 控制。", "小 o 項也會趨近 0。"],
      keySteps: ["definition", "linear bound", "limit"],
      solution: [
        {
          text: "由可微定義，存在線性映射 L，使增量可分成線性主項與小 o 誤差。",
          tex: "f(a+h)-f(a)=L(h)+r(h),\\qquad \\frac{r(h)}{\\lVert h\\rVert}\\to0"
        },
        {
          text: "有限維線性映射是有界的，所以存在 C 使 L(h) 被 norm 控制。",
          tex: "|L(h)|\\le C\\lVert h\\rVert"
        },
        {
          text: "又 r(h)=o(norm h)，因此 r(h) 也趨近 0。",
          tex: "r(h)=o(\\lVert h\\rVert)\\Rightarrow r(h)\\to0"
        },
        {
          text: "合併估計，函數增量趨近 0。",
          tex: "|f(a+h)-f(a)|\\le C\\lVert h\\rVert+|r(h)|\\to0"
        },
        {
          text: "所以 f 在 a 連續。",
          tex: "\\lim_{h\\to0}f(a+h)=f(a)"
        }
      ]
    },
    {
      id: "proof-multi-002",
      tier: "advanced",
      title: "Total Differential Error Estimate",
      difficulty: 4,
      tags: ["total-differential", "estimate"],
      statement: "證明全微分近似的誤差是高階小量。",
      prompt: "f\\text{ differentiable at }a\\Rightarrow f(a+h)=f(a)+Df(a)h+o(\\lVert h\\rVert)",
      hints: ["這幾乎就是可微定義。", "把剩下來的部分命名成 r(h)。", "證明 r(h)/norm h -> 0。"],
      keySteps: ["definition", "linear approximation", "little-o"],
      solution: [
        {
          text: "可微的定義就是存在線性映射 Df(a)，使下列極限為 0。",
          tex: "\\lim_{h\\to0}\\frac{f(a+h)-f(a)-Df(a)h}{\\lVert h\\rVert}=0"
        },
        {
          text: "令分子中扣掉線性近似後的量為 r(h)。",
          tex: "r(h)=f(a+h)-f(a)-Df(a)h"
        },
        {
          text: "由上式，r(h) 除以 norm h 會趨近 0。",
          tex: "\\frac{r(h)}{\\lVert h\\rVert}\\to0"
        },
        {
          text: "這正是 r(h)=o(norm h) 的意思。",
          tex: "r(h)=o(\\lVert h\\rVert)"
        },
        {
          text: "把 r(h) 移回原式，即得全微分估計。",
          tex: "f(a+h)=f(a)+Df(a)h+o(\\lVert h\\rVert)"
        }
      ]
    },
    {
      id: "proof-hessian-001",
      tier: "advanced",
      title: "Positive Definite Hessian Test",
      difficulty: 4,
      tags: ["hessian", "optimization"],
      statement: "證明臨界點處 Hessian 正定會推出嚴格局部極小。",
      prompt: "f\\in C^2,\\ \\nabla f(a)=0,\\ H_f(a)>0\\Rightarrow a\\text{ is a strict local minimum}",
      hints: ["用二階 Taylor 展開。", "正定矩陣給二次型下界。", "小 o 項要被二次項吸收。"],
      keySteps: ["second-order Taylor", "quadratic lower bound", "strict local minimum"],
      solution: [
        {
          text: "在 a 做二階 Taylor 展開。因為 gradient 為 0，一階項消失。",
          tex: "f(a+h)-f(a)=\\frac12 h^T H_f(a)h+o(\\lVert h\\rVert^2)"
        },
        {
          text: "Hessian 正定，所以存在 lambda>0 使二次型有下界。",
          tex: "h^T H_f(a)h\\ge\\lambda\\lVert h\\rVert^2"
        },
        {
          text: "小 o 項可以被二次項的一半控制。當 h 足夠小時，",
          tex: "|o(\\lVert h\\rVert^2)|\\le\\frac{\\lambda}{4}\\lVert h\\rVert^2"
        },
        {
          text: "因此對非零且足夠小的 h，函數增量為正。",
          tex: "f(a+h)-f(a)\\ge\\frac{\\lambda}{2}\\lVert h\\rVert^2-\\frac{\\lambda}{4}\\lVert h\\rVert^2>0"
        },
        {
          text: "所以 a 是 strict local minimum。",
          tex: "0<\\lVert h\\rVert<\\delta\\Rightarrow f(a+h)>f(a)"
        }
      ]
    },
    {
      id: "proof-jacobian-001",
      tier: "advanced",
      title: "Jacobian Chain Rule",
      difficulty: 4,
      tags: ["jacobian", "chain-rule"],
      statement: "證明多變數 Jacobian chain rule。",
      prompt: "F:\\mathbb{R}^n\\to\\mathbb{R}^m,\\ G:\\mathbb{R}^m\\to\\mathbb{R}^k\\Rightarrow D(G\\circ F)(a)=DG(F(a))DF(a)",
      hints: ["分別寫出 F 與 G 的線性近似。", "把 F 的增量塞進 G。", "確認剩餘項仍是 o(norm h)。"],
      keySteps: ["linear approximation", "composition", "matrix product"],
      solution: [
        {
          text: "F 在 a 可微，因此有線性近似。",
          tex: "F(a+h)=F(a)+DF(a)h+r_F(h),\\qquad r_F(h)=o(\\lVert h\\rVert)"
        },
        {
          text: "G 在 F(a) 可微，因此對小增量 u 有。",
          tex: "G(F(a)+u)=G(F(a))+DG(F(a))u+r_G(u),\\qquad r_G(u)=o(\\lVert u\\rVert)"
        },
        {
          text: "令 u=F(a+h)-F(a)。由 F 可微，u=O(norm h)。",
          tex: "u=DF(a)h+r_F(h)=O(\\lVert h\\rVert)"
        },
        {
          text: "把 u 代入 G 的展開。",
          tex: "G(F(a+h))=G(F(a))+DG(F(a))DF(a)h+DG(F(a))r_F(h)+r_G(u)"
        },
        {
          text: "最後兩項都是 o(norm h)，因此總線性部分就是矩陣乘積。",
          tex: "D(G\\circ F)(a)=DG(F(a))DF(a)"
        }
      ]
    },
    {
      id: "proof-implicit-001",
      tier: "boss",
      title: "Implicit Function Derivative",
      difficulty: 5,
      tags: ["implicit-function", "jacobian"],
      statement: "在隱函數已存在的假設下，證明一階導數公式。",
      prompt: "F(x,g(x))=0,\\ F_y(a,b)\\ne0,\\ g(a)=b\\Rightarrow g'(a)=-\\frac{F_x(a,b)}{F_y(a,b)}",
      hints: ["對 F(x,g(x))=0 微分。", "使用 chain rule。", "最後在 x=a 代入。"],
      keySteps: ["implicit relation", "chain rule", "solve for derivative"],
      solution: [
        {
          text: "因為 y=g(x) 滿足隱式方程，所以恆等式成立。",
          tex: "F(x,g(x))=0"
        },
        {
          text: "對 x 微分並使用 chain rule。",
          tex: "\\frac{d}{dx}F(x,g(x))=F_x(x,g(x))+F_y(x,g(x))g'(x)=0"
        },
        {
          text: "代入 x=a 且 g(a)=b。",
          tex: "F_x(a,b)+F_y(a,b)g'(a)=0"
        },
        {
          text: "由 F_y(a,b) 不為 0，可以解出 g'(a)。",
          tex: "g'(a)=-\\frac{F_x(a,b)}{F_y(a,b)}"
        }
      ]
    },
    {
      id: "proof-todai-001",
      tier: "boss",
      title: "Todai-Style Jacobian Gate",
      difficulty: 5,
      tags: ["todai-inspired", "jacobian", "inverse-function"],
      statement: "考慮變數變換 u=x+y, v=xy。在 x 不等於 y 的地方，證明可局部反解並求反向 Jacobian。",
      prompt: "u=x+y,\\ v=xy,\\ x\\ne y\\Rightarrow \\frac{\\partial(x,y)}{\\partial(u,v)}=\\frac{1}{x-y}",
      hints: ["先求正向 Jacobian。", "x-y 不為 0 才能用 inverse function theorem。", "反向 Jacobian 是正向 Jacobian 的倒數。"],
      keySteps: ["Jacobian determinant", "nonzero condition", "local inverse"],
      solution: [
        {
          text: "先計算從 (x,y) 到 (u,v) 的 Jacobian determinant。",
          tex: "\\frac{\\partial(u,v)}{\\partial(x,y)}=\\det\\begin{pmatrix}1&1\\\\ y&x\\end{pmatrix}=x-y"
        },
        {
          text: "當 x 不等於 y 時，這個 determinant 非零。",
          tex: "x\\ne y\\Rightarrow \\frac{\\partial(u,v)}{\\partial(x,y)}\\ne0"
        },
        {
          text: "由 inverse function theorem，映射在該點附近可局部反解，所以 (x,y) 可視為 (u,v) 的函數。",
          tex: "(x,y)=\\Phi(u,v)\\quad\\text{locally}"
        },
        {
          text: "反函數的 Jacobian determinant 是原 determinant 的倒數。",
          tex: "\\frac{\\partial(x,y)}{\\partial(u,v)}=\\left(\\frac{\\partial(u,v)}{\\partial(x,y)}\\right)^{-1}"
        },
        {
          text: "因此得到答案。",
          tex: "\\frac{\\partial(x,y)}{\\partial(u,v)}=\\frac{1}{x-y}"
        }
      ]
    },
    {
      id: "proof-todai-002",
      tier: "boss",
      title: "Path Trap and Non-Continuity",
      difficulty: 5,
      tags: ["todai-inspired", "multivariable", "path-test"],
      statement: "證明下列函數在原點不可能透過指定函數值變成連續。",
      prompt: "f(x,y)=\\frac{x^2y}{x^4+y^2}\\ ((x,y)\\ne(0,0))\\Rightarrow \\nexists L\\text{ such that }f(0,0)=L\\text{ makes }f\\text{ continuous}",
      hints: ["沿 y=0 看一次。", "沿 y=x^2 再看一次。", "兩條路徑極限不同。"],
      keySteps: ["path y=0", "path y=x^2", "different limits"],
      solution: [
        {
          text: "沿著 y=0 接近原點，函數值恆為 0。",
          tex: "f(x,0)=\\frac{x^2\\cdot0}{x^4+0}=0\\Rightarrow \\lim_{x\\to0}f(x,0)=0"
        },
        {
          text: "沿著 y=x^2 接近原點，函數值變成常數。",
          tex: "f(x,x^2)=\\frac{x^2\\cdot x^2}{x^4+x^4}=\\frac12"
        },
        {
          text: "所以沿第二條路徑的極限為 1/2。",
          tex: "\\lim_{x\\to0}f(x,x^2)=\\frac12"
        },
        {
          text: "兩條路徑給出的極限不同，因此二變數極限不存在。",
          tex: "0\\ne\\frac12\\Rightarrow \\lim_{(x,y)\\to(0,0)}f(x,y)\\text{ does not exist}"
        },
        {
          text: "若極限不存在，就沒有任何 L 能使函數在原點連續。",
          tex: "\\nexists L\\quad f(0,0)=L\\text{ makes }f\\text{ continuous at }(0,0)"
        }
      ]
    }
  ];
})();
