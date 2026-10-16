// 詳解 v2 批次 022（60 題）。格式見 tools/build_solution_detail.js 的說明。
module.exports = {
  "burst-boss-param-003": {
    "spot": "分母是 $1+ax^2$ —— 把 $a$ 吸進變數裡（$u=\\sqrt a\\,x$）就變成 $\\frac{1}{1+u^2}$，反正切直接收掉。",
    "why": "這題雖然掛著參數，但不必對 $a$ 微分；一次縮放就回到最標準的 $\\int_0^\\infty\\frac{du}{1+u^2}=\\frac{\\pi}{2}$。",
    "steps": [
      [
        "令 $u=\\sqrt a\\,x$，$dx=\\frac{du}{\\sqrt a}$；反導數是 $\\frac{1}{\\sqrt a}\\arctan(\\sqrt a\\,x)$。",
        "D(atan(sqrt(a)*x)/sqrt(a)) == 1/(1+a*x^2)"
      ],
      [
        "下限 $x=0$ 給 $0$；上限 $x\\to\\infty$ 時 $\\arctan\\to\\frac{\\pi}{2}$。",
        "SUB(atan(sqrt(a)*x)/sqrt(a), 0) == 0 ;; LIM(atan(sqrt(a)*x)/sqrt(a), inf) == pi/(2*sqrt(a))"
      ],
      [
        "所以 $I(a)=\\frac{\\pi}{2\\sqrt a}$。",
        "INT(1/(1+a*x^2), 0, inf, x) == ANS"
      ]
    ],
    "trap": "縮放時忘了 $dx=\\frac{du}{\\sqrt a}$，寫成 $\\frac{\\pi}{2}$ 或 $\\frac{\\pi}{2a}$。",
    "check": [
      "$a=1$ 時要回到 $\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$。",
      "SUB(ANS, 1, a) == pi/2"
    ]
  },
  "dm-int-006": {
    "spot": "題目直接給了 $I'(t)=-2tI(t)$ —— 對參數微分會冒出 $x e^{-x^2}$，那正是 $e^{-x^2}$ 的導數，分部積分把它變回 $I$ 本身，得到一階微分方程。",
    "why": "直接算 $\\int e^{-x^2}\\cos 2x\\,dx$ 沒有初等反導數；把 $t$ 當變數解微分方程，只需要起點 $I(0)=\\frac{\\sqrt\\pi}{2}$。",
    "steps": [
      [
        "起點：$I(0)=\\int_0^\\infty e^{-x^2}dx=\\frac{\\sqrt\\pi}{2}$。",
        "INT(exp(-x^2), 0, inf) == sqrt(pi)/2"
      ],
      [
        "對 $t$ 微分：$I'(t)=\\int_0^\\infty(-2x e^{-x^2})\\sin(2tx)\\,dx$，而 $-2xe^{-x^2}$ 正是 $e^{-x^2}$ 的導數。",
        "D(exp(-x^2)) == -2x*exp(-x^2)"
      ],
      [
        "分部積分（邊界項 $e^{-x^2}\\sin 2tx$ 在 $0$ 與 $\\infty$ 都是 $0$）：$I'(t)=-2t\\int_0^\\infty e^{-x^2}\\cos(2tx)\\,dx=-2tI(t)$。以 $t=1$ 對一下。",
        "INT(-2x*exp(-x^2)*sin(2x), 0, inf) == -2*INT(exp(-x^2)*cos(2x), 0, inf)"
      ],
      [
        "$\\frac{I'}{I}=-2t$，積分得 $I(t)=I(0)e^{-t^2}=\\frac{\\sqrt\\pi}{2}e^{-t^2}$。",
        "D(sqrt(pi)/2*exp(-t^2)) == -2t*(sqrt(pi)/2*exp(-t^2))"
      ],
      [
        "代 $t=1$：$I(1)=\\frac{\\sqrt\\pi}{2e}$。",
        "SUB(sqrt(pi)/2*exp(-t^2), 1) == ANS ;; INT(exp(-x^2)*cos(2x), 0, inf) == ANS"
      ]
    ],
    "trap": "起點用了整條實軸的 $\\int_{-\\infty}^\\infty e^{-x^2}dx=\\sqrt\\pi$，答案變成 $\\frac{\\sqrt\\pi}{e}$，多了一倍；這裡積分只從 $0$ 開始。",
    "check": [
      "$t=2$ 時公式給 $\\frac{\\sqrt\\pi}{2}e^{-4}$，直接積分對得上。",
      "INT(exp(-x^2)*cos(4x), 0, inf) == sqrt(pi)/2*exp(-4)"
    ]
  },
  "dm-int-007": {
    "spot": "$\\frac{1}{1-xy}$ 而且 $0\\le xy<1$ —— 幾何級數 $\\sum(xy)^n$，而 $\\iint(xy)^n$ 拆成兩個一維積分的乘積，正好是 $\\frac{1}{(n+1)^2}$。",
    "why": "直接做內層積分會得到 $-\\frac{\\ln(1-x)}{x}$，外層還是要靠展開；一開始就展開，每一項都是一行。",
    "steps": [
      [
        "在 $[0,1)^2$ 上 $\\frac{1}{1-xy}=\\sum_{n\\ge0}(xy)^n$（各項非負，可以逐項積分）。",
        "SUB(1/(1-0.5*x), 0.6) == SUM((0.5*0.6)^n, 0)"
      ],
      [
        "每一項分離變數：$\\int_0^1\\!\\int_0^1x^ny^n\\,dx\\,dy=\\left(\\frac{1}{n+1}\\right)^2$。",
        "INT(x^n, 0, 1) == 1/(n+1)"
      ],
      [
        "所以積分 $=\\sum_{n\\ge0}\\frac{1}{(n+1)^2}=\\sum_{m\\ge1}\\frac{1}{m^2}=\\zeta(2)$。",
        "SUM(1/(n+1)^2, 0) == SUM(1/n^2, 1)"
      ],
      [
        "另一條路對一下：內層 $\\int_0^1\\frac{dy}{1-xy}=-\\frac{\\ln(1-x)}{x}$（以 $x=\\frac12$ 驗），外層 $\\int_0^1-\\frac{\\ln(1-x)}{x}dx$ 也是同一個數。",
        "INT(1/(1-0.5*y), 0, 1, y) == -log(1-0.5)/0.5 ;; INT(-log(1-x)/x, 0, 1) == SUM(1/n^2, 1)"
      ],
      [
        "$\\zeta(2)=\\frac{\\pi^2}{6}$。",
        "SUM(1/n^2, 1) == ANS"
      ]
    ],
    "trap": "把 $\\iint x^ny^n$ 算成 $\\frac{1}{2n+2}$（把兩個變數的次方加起來），級數就變成發散的調和級數。",
    "check": [
      "被積函數 $\\ge 1$，所以積分至少是 $1$；$\\frac{\\pi^2}{6}\\approx1.645$ 合理。",
      "ANS > 1 ;; ANS < 2"
    ]
  },
  "dm-int-009": {
    "spot": "題目要 $I''=I$ —— 二階常係數方程，解是 $Ae^t+Be^{-t}$；$|I|\\le\\frac{\\pi}{2}$ 有界砍掉 $e^t$，$I(0)=\\frac\\pi2$ 定出係數。",
    "why": "$\\frac{\\cos tx}{1+x^2}$ 沒有初等反導數；直接對 $t$ 微兩次會冒出不收斂的 $\\int\\cos tx\\,dx$，所以先用 $\\frac{x^2}{1+x^2}=1-\\frac{1}{1+x^2}$ 把 $I'$ 改寫，再微第二次。",
    "steps": [
      [
        "起點 $I(0)=\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$，而且 $|I(t)|\\le I(0)$。",
        "INT(1/(1+x^2), 0, inf) == pi/2"
      ],
      [
        "$I'(t)=-\\int_0^\\infty\\frac{x\\sin tx}{1+x^2}dx$。拆 $\\frac{x}{1+x^2}=\\frac1x-\\frac{1}{x(1+x^2)}$，再用 $\\int_0^\\infty\\frac{\\sin tx}{x}dx=\\frac{\\pi}{2}$（$t>0$）：$I'(t)=-\\frac{\\pi}{2}+\\int_0^\\infty\\frac{\\sin tx}{x(1+x^2)}dx$。",
        "x/(1+x^2) == 1/x-1/(x*(1+x^2))"
      ],
      [
        "後面那個積分對 $t$ 微分剛好給回 $\\frac{\\cos tx}{1+x^2}$，所以 $I''(t)=I(t)$。",
        "D(sin(t*x)/(x*(1+x^2)), , t) == cos(t*x)/(1+x^2)"
      ],
      [
        "$I=Ae^t+Be^{-t}$；有界逼 $A=0$，$I(0)=\\frac\\pi2$ 給 $B=\\frac\\pi2$：$I(t)=\\frac{\\pi}{2}e^{-t}$。",
        "D2(pi/2*exp(-t)) == pi/2*exp(-t) ;; SUB(pi/2*exp(-t), 0) == pi/2"
      ],
      [
        "代 $t=1$：$I(1)=\\frac{\\pi}{2e}$。",
        "SUB(pi/2*exp(-t), 1) == ANS ;; INT(cos(x)/(1+x^2), 0, inf) == ANS"
      ]
    ],
    "trap": "沒有用有界性，只用 $I(0)=\\frac\\pi2$ 一個條件解二階方程，係數定不出來；或誤取 $\\frac{\\pi}{2}\\cosh t$，$t\\to\\infty$ 會爆掉。",
    "check": [
      "$t=2$ 時公式給 $\\frac{\\pi}{2}e^{-2}$，直接積分對得上。",
      "INT(cos(2x)/(1+x^2), 0, inf) == pi/2*exp(-2)"
    ]
  },
  "dm-lim-012": {
    "spot": "要的是 $F(x)$ 乘上 $xe^{x^2}$ —— 也就是 $F$ 的主項。把 $e^{-t^2}$ 寫成 $\\frac{-1}{2t}\\cdot(-2te^{-t^2})$，分部積分一次就把主項 $\\frac{e^{-x^2}}{2x}$ 剝出來。",
    "why": "也可以對 $\\frac{F(x)}{e^{-x^2}/x}$ 用羅必達，但分部積分順便給出餘項的大小，誤差估計一起拿到。",
    "steps": [
      [
        "$-2te^{-t^2}$ 是 $e^{-t^2}$ 的導數，所以 $e^{-t^2}=\\frac{-1}{2t}\\,(e^{-t^2})'$。",
        "D(exp(-x^2)) == -2x*exp(-x^2)"
      ],
      [
        "分部積分：$F(x)=\\frac{e^{-x^2}}{2x}-\\int_x^\\infty\\frac{e^{-t^2}}{2t^2}dt$。以 $x=1$ 驗。",
        "INT(exp(-x^2), 1, inf) == exp(-1)/2 - INT(exp(-x^2)/(2x^2), 1, inf)"
      ],
      [
        "餘項：$t\\ge x$ 時 $\\frac{1}{2t^2}\\le\\frac{1}{2x^2}$，所以 $0\\le\\int_x^\\infty\\frac{e^{-t^2}}{2t^2}dt\\le\\frac{F(x)}{2x^2}$，也就是 $F(x)=\\frac{e^{-x^2}}{2x}(1+O(x^{-2}))$。以 $x=2$ 驗。",
        "INT(exp(-x^2)/(2x^2), 2, inf) < INT(exp(-x^2), 2, inf)/8"
      ],
      [
        "移項得 $\\frac12\\cdot\\frac{1}{1+\\frac{1}{2x^2}}\\le xe^{x^2}F(x)\\le\\frac12$。以 $x=3$ 驗。",
        "3*exp(9)*INT(exp(-x^2), 3, inf) < 1/2 ;; 3*exp(9)*INT(exp(-x^2), 3, inf) > (1/2)/(1+1/18)"
      ],
      [
        "兩邊夾到同一個數：極限是 $\\frac12$。",
        "LIM((1/2)/(1+1/(2x^2)), inf) == ANS"
      ]
    ],
    "trap": "以為 $F(x)\\approx e^{-x^2}$（直接把下限代進被積函數），得到極限 $\\infty$；漏掉分部積分帶出來的 $\\frac{1}{2x}$。",
    "check": [
      "羅必達對一下：$\\frac{F(x)}{e^{-x^2}/x}$ 上下微分，比值是 $\\frac{-e^{-x^2}}{-e^{-x^2}(2+x^{-2})}\\to\\frac12$。",
      "LIM(1/(2+1/x^2), inf) == ANS"
    ]
  },
  "dm-seq-002": {
    "spot": "$x_{n+1}=\\sin x_n\\to0$ 而問 $\\sqrt n\\,x_n$ —— 看 $\\frac{1}{x_n^2}$ 的增量：$\\frac{1}{\\sin^2x}-\\frac{1}{x^2}\\to\\frac13$，增量趨近常數，施篤茲（Stolz）定理把 $\\frac{1}{x_n^2}$ 變成 $\\frac n3$。",
    "why": "$x_n$ 沒有封閉式；換成 $\\frac{1}{x_n^2}$ 後每步大約加 $\\frac13$，這是唯一能直接求平均的量。",
    "steps": [
      [
        "泰勒展開：$\\sin x=x-\\frac{x^3}{6}+\\cdots$，所以 $\\frac{1}{\\sin^2x}-\\frac{1}{x^2}=\\frac{x^2-\\sin^2x}{x^2\\sin^2x}\\to\\frac13$。",
        "LIM((x-sin(x))/x^3, 0) == 1/6 ;; LIM(1/sin(x)^2-1/x^2, 0) == 1/3"
      ],
      [
        "因為 $x_n\\to0$，$\\frac{1}{x_{n+1}^2}-\\frac{1}{x_n^2}\\to\\frac13$。",
        "SUB(1/sin(x)^2-1/x^2, 0.01) > 0.33"
      ],
      [
        "施篤茲定理（分母 $n$ 嚴格遞增到 $\\infty$）：$\\lim\\frac{1/x_n^2}{n}=\\lim\\frac{1/x_{n+1}^2-1/x_n^2}{(n+1)-n}=\\frac13$。",
        "(1/3)/1 == 1/3"
      ],
      [
        "所以 $n x_n^2\\to3$，$\\sqrt n\\,x_n\\to\\sqrt3$（$x_n>0$ 取正根）。",
        "sqrt(1/(1/3)) == ANS"
      ]
    ],
    "trap": "以為 $\\sin x_n\\approx x_n$ 所以 $x_n$ 幾乎不動、$\\sqrt n\\,x_n\\to\\infty$；其實 $x_n$ 以 $\\sqrt{3/n}$ 的速度慢慢趨近 $0$。",
    "check": [
      "$\\frac{1}{x^2}$ 的增量在 $x=0.3$ 附近已經很接近 $\\frac13$，平均起來 $\\frac{1}{x_n^2}\\approx\\frac n3$。",
      "SUB(1/sin(x)^2-1/x^2, 0.3) < 0.34 ;; SUB(1/sin(x)^2-1/x^2, 0.3) > 0.33"
    ]
  },
  "dm-seq-006": {
    "spot": "$n$ 項加起來除以 $n^{3/2}$ —— 拆成 $\\frac1n\\sum\\sqrt{\\frac kn}$，就是 $\\sqrt x$ 在 $[0,1]$ 上的右端點黎曼和。",
    "why": "黎曼和一步落到 $\\int_0^1\\sqrt x\\,dx$；施篤茲定理也行，但要處理 $(n+1)^{3/2}-n^{3/2}$ 的差。",
    "steps": [
      [
        "$\\frac{\\sqrt k}{n^{3/2}}=\\frac1n\\sqrt{\\frac kn}$，所以整個式子是 $\\frac1n\\sum_{k=1}^n\\sqrt{\\frac kn}$。",
        "sqrt(4)/n^(3/2) == (1/n)*sqrt(4/n)"
      ],
      [
        "$n\\to\\infty$ 時黎曼和趨近 $\\int_0^1\\sqrt x\\,dx=\\frac23$。",
        "INT(sqrt(x), 0, 1) == 2/3"
      ],
      [
        "施篤茲定理對一下：$\\frac{\\sqrt{n+1}}{(n+1)^{3/2}-n^{3/2}}\\to\\frac{1}{3/2}$。",
        "LIM(sqrt(x+1)/((x+1)^(3/2)-x^(3/2)), inf) == 2/3"
      ],
      [
        "極限是 $\\frac23$。",
        "INT(sqrt(x), 0, 1) == ANS"
      ]
    ],
    "trap": "把分母當成 $n^2$ 或把和估成 $n\\sqrt n$，得到 $0$ 或 $1$；$\\sum\\sqrt k$ 的大小是 $\\frac23n^{3/2}$，不是 $n\\cdot\\sqrt n$。",
    "check": [
      "上下夾：$\\int_0^n\\sqrt x\\,dx\\le\\sum_{k=1}^n\\sqrt k\\le\\int_1^{n+1}\\sqrt x\\,dx$，兩邊除以 $n^{3/2}$ 都趨近 $\\frac23$。",
      "LIM(INT(sqrt(t), 1, x+1, t)/x^(3/2), inf) == ANS"
    ]
  },
  "fd-limx-609": {
    "spot": "$n!$ 配 $e^n$ 和 $n^{n+1/2}$ —— 這就是 Stirling 公式 $n!\\sim\\sqrt{2\\pi n}\\left(\\frac ne\\right)^n$ 的比值，極限就是那個根號常數 $\\sqrt{2\\pi}$。",
    "why": "要「推」而不是背的話，把 $n!$ 寫成 $\\int_0^\\infty t^ne^{-t}dt$，代 $t=n(1+u)$ 後被積函數集中在 $u=0$，近似成高斯積分就出現 $\\sqrt{2\\pi}$。",
    "steps": [
      [
        "$n!=\\int_0^\\infty t^ne^{-t}\\,dt$（以 $n=10$ 驗：$10!=3628800$）。",
        "INT(x^10*exp(-x), 0, inf) == 3628800"
      ],
      [
        "代 $t=n(1+u)$：$n!=n^{n+1}e^{-n}\\int_{-1}^\\infty\\left((1+u)e^{-u}\\right)^n du$，所以所求比值 $=\\sqrt n\\int_{-1}^\\infty\\left((1+u)e^{-u}\\right)^ndu$。",
        "INT(x^10*exp(-x), 0, inf) == 10^11*exp(-10)*INT(((1+u)*exp(-u))^10, -1, inf, u)"
      ],
      [
        "在 $u=0$ 附近 $\\ln\\left((1+u)e^{-u}\\right)=\\ln(1+u)-u\\approx-\\frac{u^2}{2}$，被積函數像 $e^{-nu^2/2}$。",
        "LIM((log(1+x)-x)/x^2, 0) == -1/2"
      ],
      [
        "高斯積分：$\\int_{-\\infty}^\\infty e^{-nu^2/2}du=\\sqrt{\\frac{2\\pi}{n}}$。",
        "2*INT(exp(-x^2/2), 0, inf) == sqrt(2*pi)"
      ],
      [
        "比值 $\\to\\sqrt n\\cdot\\sqrt{\\frac{2\\pi}{n}}=\\sqrt{2\\pi}$。",
        "SUB(sqrt(n)*sqrt(2*pi/n), 7) == ANS"
      ]
    ],
    "trap": "把分母記成 $n^n$（漏了 $\\sqrt n$），比值變成 $\\sqrt{2\\pi n}\\to\\infty$；或把 $e^n$ 的位置弄反得到 $0$。",
    "check": [
      "$n=10$ 時比值 $\\frac{10!\\,e^{10}}{10^{10.5}}\\approx2.528$，比 $\\sqrt{2\\pi}\\approx2.507$ 大一點，差距在 $e^{1/120}$ 以內（Stirling 的修正項）。",
      "3628800*exp(10)/10^(10.5) > ANS ;; 3628800*exp(10)/10^(10.5) < ANS*exp(1/120)"
    ]
  },
  "td-int-002": {
    "spot": "$\\ln(a+b\\cos x)$ 積過 $[0,\\pi]$，而且 $5+3\\cos x$ 可以寫成平方和：$(3+\\cos x)^2+\\sin^2x=2(5+3\\cos x)$ —— 對數拆成常數加上一個「平均是 $0$」的部分。",
    "why": "對參數 $a$ 微分（費曼技巧）也行，但要再定一個積分常數；分解成 $\\frac92\\left|1+\\frac{e^{ix}}{3}\\right|^2$ 後，餘下部分的傅立葉項在 $[0,\\pi]$ 上全部積成 $0$。",
    "steps": [
      [
        "配方：$(3+\\cos x)^2+\\sin^2x=10+6\\cos x=2(5+3\\cos x)$。",
        "(3+cos(x))^2+sin(x)^2 == 2*(5+3*cos(x))"
      ],
      [
        "提出 $9$：$5+3\\cos x=\\frac92\\left(1+\\frac23\\cos x+\\frac19\\right)$，括號裡是 $\\left|1+\\frac{e^{ix}}{3}\\right|^2$。",
        "5+3*cos(x) == (9/2)*(1+(2/3)*cos(x)+1/9) ;; 1+(2/3)*cos(x)+1/9 == (1+cos(x)/3)^2+(sin(x)/3)^2"
      ],
      [
        "$\\ln\\left|1+\\frac{e^{ix}}{3}\\right|^2=2\\sum_{n\\ge1}\\frac{(-1)^{n+1}}{n3^n}\\cos nx$，每一項 $\\int_0^\\pi\\cos nx\\,dx=0$，所以這部分積分是 $0$。",
        "INT(log(1+(2/3)*cos(x)+1/9), 0, pi) == 0"
      ],
      [
        "剩下常數：$\\int_0^\\pi\\ln\\frac92\\,dx=\\pi\\ln\\frac92$。",
        "INT(log(5+3*cos(x)), 0, pi) == ANS"
      ]
    ],
    "trap": "把 $\\int_0^\\pi\\ln(5+3\\cos x)$ 當成 $\\pi\\ln5$（以為 $\\cos$ 平均是 $0$ 就能拿掉）；但 $\\ln$ 不是線性的，答案是 $\\pi\\ln\\frac{5+\\sqrt{25-9}}{2}$。",
    "check": [
      "通用公式 $\\pi\\ln\\frac{a+\\sqrt{a^2-b^2}}{2}$：$a=5,b=3$ 給 $\\pi\\ln\\frac92$；費曼路線的導數 $\\int_0^\\pi\\frac{dx}{5+3\\cos x}=\\frac{\\pi}{4}$ 也對得上。",
      "INT(1/(5+3*cos(x)), 0, pi) == pi/4 ;; pi*log((5+sqrt(25-9))/2) == ANS"
    ]
  },
  "tr-bnd-009": {
    "spot": "二階泰勒多項式的誤差 —— 拉格朗日餘項用三階導數：$|R_2|\\le\\frac{M}{3!}|x-1|^3$，而 $e^x$ 的每一階導數都是 $e^x$。",
    "why": "$e^x$ 遞增，三階導數在 $[1,1.5]$ 上的最大值就在右端點，$M=e^{1.5}$ 不用另外找。",
    "steps": [
      [
        "$f'''(x)=e^x$，在 $[1,1.5]$ 上遞增，最大值 $M=e^{1.5}$。",
        "D(exp(x)) == exp(x) ;; SUB(exp(x), 1.5) > SUB(exp(x), 1)"
      ],
      [
        "距離 $|x-1|=0.5$，$|x-1|^3=\\frac18$；$3!=6$。",
        "0.5^3 == 1/8"
      ],
      [
        "上界 $\\frac{e^{1.5}}{6}\\cdot\\frac18=\\frac{e^{3/2}}{48}$。",
        "exp(1.5)*0.5^3/6 == ANS"
      ]
    ],
    "trap": "用二階導數或除以 $2!$，寫成 $\\frac{e^{1.5}}{8}$；或 $M$ 取 $e^1$（左端點），得到的不是上界。",
    "check": [
      "真正的誤差 $e^{1.5}-e(1+0.5+\\frac{0.25}{2})\\approx0.0757$，確實不超過上界 $\\approx0.0934$。",
      "exp(1.5)-exp(1)*(1+0.5+0.125) < ANS"
    ]
  },
  "tr-num-003": {
    "spot": "$\\sin x$ 的每一階導數絕對值都 $\\le1$，而區間最遠到 $x=1$ —— 拉格朗日餘項直接變成 $\\frac{1}{(n+1)!}$，只要找第一個 $(n+1)!>10^6$。",
    "why": "不必真的算誤差函數的最大值；餘項上界只看階乘，逐個試就好。",
    "steps": [
      [
        "$|R_n(x)|\\le\\frac{\\max|f^{(n+1)}|}{(n+1)!}x^{n+1}\\le\\frac{1}{(n+1)!}$（$0\\le x\\le1$）。",
        "D2(sin(x)) == -sin(x)"
      ],
      [
        "$n=8$：上界 $\\frac{1}{9!}=\\frac{1}{362880}\\approx2.8\\times10^{-6}$，不夠。而且 $P_8=P_7=x-\\frac{x^3}{6}+\\frac{x^5}{120}-\\frac{x^7}{5040}$，在 $x=1$ 的真實誤差也超過 $10^{-6}$。",
        "1/362880 > 10^(-6) ;; sin(1)-(1-1/6+1/120-1/5040) > 10^(-6)"
      ],
      [
        "$n=9$：上界 $\\frac{1}{10!}=\\frac{1}{3628800}<10^{-6}$。",
        "1/3628800 < 10^(-6)"
      ],
      [
        "最小階數 $n=9$。",
        "9 == ANS"
      ]
    ],
    "trap": "看到 $\\frac{1}{9!}\\approx2.8\\times10^{-6}$ 就以為「差不多」選 $n=8$；或把 $n$ 當成項數，答 $5$。",
    "check": [
      "$P_9$ 在 $x=1$ 的真實誤差 $\\approx2.5\\times10^{-8}$，遠小於 $10^{-6}$。",
      "sin(1)-(1-1/6+1/120-1/5040+1/362880) < 10^(-6)"
    ]
  },
  "der-004": {
    "spot": "$\\sqrt x$ 就是 $x^{1/2}$ —— 冪次法則，次方拿下來、次方減一。",
    "why": "改寫成冪次後一行結束，不必回到導數定義去有理化。",
    "steps": [
      [
        "$\\sqrt x=x^{1/2}$。",
        "sqrt(x) == x^(1/2)"
      ],
      [
        "冪次法則：$\\frac12x^{-1/2}$。",
        "D(x^(1/2)) == (1/2)*x^(-1/2)"
      ],
      [
        "寫回根號：$\\frac{1}{2\\sqrt x}$。",
        "D(sqrt(x)) == ANS"
      ]
    ],
    "trap": "次方減一算成 $x^{3/2}$ 或忘了乘 $\\frac12$，寫成 $\\frac{1}{\\sqrt x}$。",
    "check": [
      "在 $x=4$：切線斜率 $\\frac{1}{2\\cdot2}=\\frac14$。",
      "D(sqrt(x), 4) == 1/4"
    ]
  },
  "exam-int-016": {
    "spot": "$\\ln x$ 包在 $\\cos$ 裡，旁邊剛好有 $\\frac1x$ —— 那就是 $\\ln x$ 的導數，代 $u=\\ln x$。",
    "why": "內層函數的導數已經擺在那裡，代換後只剩 $\\int\\cos u\\,du$；分部積分反而繞遠路。",
    "steps": [
      [
        "令 $u=\\ln x$，$du=\\frac{dx}{x}$。",
        "D(log(x)) == 1/x"
      ],
      [
        "積分變成 $\\int\\cos u\\,du=\\sin u+C$。",
        "D(sin(u)) == cos(u)"
      ],
      [
        "換回：$\\sin(\\ln x)+C$。",
        "sin(log(x)) ~= ANS ;; D(sin(log(x))) == cos(log(x))/x"
      ]
    ],
    "trap": "把 $\\frac1x$ 單獨積成 $\\ln x$ 再乘上 $\\cos$ 的反導數，寫成 $\\ln x\\cdot\\sin(\\ln x)$。",
    "check": [
      "定積分對一下：$\\int_1^e\\frac{\\cos(\\ln x)}{x}dx=\\sin1$。",
      "INT(cos(log(x))/x, 1, exp(1)) == sin(1)"
    ]
  },
  "fd-lim-012": {
    "spot": "$\\frac{\\sin 4x}{\\sin 2x}$，而 $4x=2\\cdot2x$ —— 倍角公式把分子拆成 $2\\sin2x\\cos2x$，分母直接約掉。",
    "why": "約掉之後是連續函數直接代 $0$；用 $\\sin u\\sim u$ 也行，結果一樣是 $\\frac{4x}{2x}$。",
    "steps": [
      [
        "倍角公式：$\\sin4x=2\\sin2x\\cos2x$。",
        "sin(4x) == 2*sin(2x)*cos(2x)"
      ],
      [
        "約掉 $\\sin 2x$：式子 $=2\\cos 2x$。",
        "sin(4x)/sin(2x) == 2*cos(2x)"
      ],
      [
        "$x\\to0$：$2\\cos0=2$。",
        "LIM(sin(4x)/sin(2x), 0) == ANS"
      ]
    ],
    "trap": "把 $\\sin$ 當成線性、約成 $\\sin\\frac{4x}{2x}=\\sin 2$。",
    "check": [
      "等價無窮小：$\\frac{\\sin4x}{\\sin2x}\\approx\\frac{4x}{2x}=2$。",
      "LIM(sin(4x)/(4x), 0) == 1"
    ]
  },
  "int-002": {
    "spot": "基本反導數表：誰的導數是 $\\cos x$？$\\sin x$。",
    "why": "這是要背到反射的基本式，不用任何技巧。",
    "steps": [
      [
        "$(\\sin x)'=\\cos x$。",
        "D(sin(x)) == cos(x)"
      ],
      [
        "反過來看：$\\cos x$ 的反導數就是 $\\sin x$，再加任意常數 $C$（常數微分是 $0$）。",
        "D(sin(x)+5) == cos(x)"
      ],
      [
        "所以 $\\int\\cos x\\,dx=\\sin x+C$。",
        "sin(x) ~= ANS"
      ]
    ],
    "trap": "跟 $\\sin x$ 的積分搞混，寫成 $-\\sin x$。",
    "check": [
      "定積分對一下：$\\int_0^{\\pi/2}\\cos x\\,dx=\\sin\\frac\\pi2-\\sin0=1$。",
      "INT(cos(x), 0, pi/2) == 1"
    ]
  },
  "int-003": {
    "spot": "$x^{-1}$ —— 冪次法則唯一的例外（$\\frac{x^0}{0}$ 沒意義），答案是對數，而且要加絕對值。",
    "why": "$\\ln|x|$ 在 $x<0$ 也有定義、導數同樣是 $\\frac1x$，所以兩邊都涵蓋。",
    "steps": [
      [
        "$x>0$ 時 $(\\ln x)'=\\frac1x$。",
        "D(log(x)) == 1/x"
      ],
      [
        "$x<0$ 時 $(\\ln(-x))'=\\frac{-1}{-x}=\\frac1x$，也成立（以 $x=-2$ 驗）。",
        "D(log(abs(x)), -2) == -1/2"
      ],
      [
        "合起來：$\\int\\frac1x\\,dx=\\ln|x|+C$。",
        "log(abs(x)) ~= ANS"
      ]
    ],
    "trap": "套冪次法則寫 $\\frac{x^0}{0}$，或忘了絕對值只寫 $\\ln x$（$x<0$ 時沒有定義）。",
    "check": [
      "定積分對一下：$\\int_1^e\\frac{dx}{x}=\\ln e-\\ln1=1$。",
      "INT(1/x, 1, exp(1)) == 1"
    ]
  },
  "int-004": {
    "spot": "$e$ 的指數是 $3x$（一次式）—— 反導數還是 $e^{3x}$，只是要除以內層的係數 $3$。",
    "why": "內層是一次式，代換 $u=3x$ 只會吐出常數 $\\frac13$，可以直接寫。",
    "steps": [
      [
        "令 $u=3x$，$du=3\\,dx$，所以 $dx=\\frac{du}{3}$。",
        "D(3x) == 3"
      ],
      [
        "積分變成 $\\frac13\\int e^udu=\\frac13e^u+C$；微分回去，連鎖律吐出的 $3$ 剛好抵掉 $\\frac13$。",
        "D(exp(3x)) == 3*exp(3x) ;; D(exp(3x)/3) == exp(3x)"
      ],
      [
        "答案 $\\frac13e^{3x}+C$。",
        "exp(3x)/3 ~= ANS"
      ]
    ],
    "trap": "忘了除以 $3$，或反過來乘以 $3$，寫成 $3e^{3x}$。",
    "check": [
      "定積分對一下：$\\int_0^1e^{3x}dx=\\frac{e^3-1}{3}$。",
      "INT(exp(3x), 0, 1) == (exp(3)-1)/3"
    ]
  },
  "int-005": {
    "spot": "$e^{x^2}$ 旁邊有個 $x$ —— 正是內層 $x^2$ 的導數（差一個 $2$），代 $u=x^2$。",
    "why": "$e^{x^2}$ 本身沒有初等反導數，這題能做完全是因為那個 $x$；看到它就代換。",
    "steps": [
      [
        "令 $u=x^2$，$du=2x\\,dx$，所以 $x\\,dx=\\frac{du}{2}$。",
        "D(x^2) == 2x"
      ],
      [
        "積分變成 $\\frac12\\int e^udu=\\frac12e^u+C$。",
        "D(exp(u)/2) == exp(u)/2"
      ],
      [
        "換回：$\\frac12e^{x^2}+C$。",
        "exp(x^2)/2 ~= ANS ;; D(exp(x^2)/2) == x*exp(x^2)"
      ]
    ],
    "trap": "忘了 $\\frac12$，寫成 $e^{x^2}$（微分回去多了一個 $2$）。",
    "check": [
      "定積分對一下：$\\int_0^1xe^{x^2}dx=\\frac{e-1}{2}$。",
      "INT(x*exp(x^2), 0, 1) == (exp(1)-1)/2"
    ]
  },
  "int-006": {
    "spot": "分子 $2x$ 正好是分母 $1+x^2$ 的導數 —— $\\frac{f'}{f}$ 型，積出來是 $\\ln|f|$。",
    "why": "看到分子是分母的導數就不用拆、不用三角代換；$1+x^2>0$ 所以連絕對值都可以拿掉。",
    "steps": [
      [
        "$(1+x^2)'=2x$，就是分子。",
        "D(1+x^2) == 2x"
      ],
      [
        "$\\int\\frac{f'}{f}=\\ln|f|+C$，而 $1+x^2>0$：$\\ln(1+x^2)+C$。",
        "D(log(1+x^2)) == 2x/(1+x^2)"
      ],
      [
        "答案 $\\ln(1+x^2)+C$。",
        "log(1+x^2) ~= ANS"
      ]
    ],
    "trap": "看到 $1+x^2$ 就反射寫 $\\arctan x$；那是分子為 $1$ 時的答案。",
    "check": [
      "定積分對一下：$\\int_0^1\\frac{2x}{1+x^2}dx=\\ln2$。",
      "INT(2x/(1+x^2), 0, 1) == log(2)"
    ]
  },
  "int-007": {
    "spot": "$\\cos(x^2)$ 前面乘著 $x$ —— 內層 $x^2$ 的導數（差一個 $2$），代 $u=x^2$。",
    "why": "跟 $\\int xe^{x^2}dx$ 同一個模式：外層換成 $\\cos$ 而已。",
    "steps": [
      [
        "令 $u=x^2$，$x\\,dx=\\frac{du}{2}$。",
        "D(x^2) == 2x"
      ],
      [
        "積分變成 $\\frac12\\int\\cos u\\,du=\\frac12\\sin u+C$。",
        "D(sin(u)/2) == cos(u)/2"
      ],
      [
        "換回：$\\frac12\\sin(x^2)+C$。",
        "sin(x^2)/2 ~= ANS ;; D(sin(x^2)/2) == x*cos(x^2)"
      ]
    ],
    "trap": "漏了 $\\frac12$，或把 $\\sin(x^2)$ 寫成 $\\sin^2x$。",
    "check": [
      "定積分對一下：$\\int_0^{\\sqrt{\\pi/2}}x\\cos(x^2)dx=\\frac12\\sin\\frac\\pi2=\\frac12$。",
      "INT(x*cos(x^2), 0, sqrt(pi/2)) == 1/2"
    ]
  },
  "int-020": {
    "spot": "分子 $x^2$ 是分母 $1+x^3$ 導數 $3x^2$ 的三分之一 —— $\\frac{f'}{f}$ 型，乘個 $\\frac13$。",
    "why": "不必做部分分式（$1+x^3$ 拆開要處理二次因式），對數一行結束。",
    "steps": [
      [
        "$(1+x^3)'=3x^2$，所以 $\\frac{x^2}{1+x^3}=\\frac13\\cdot\\frac{3x^2}{1+x^3}$。",
        "D(1+x^3) == 3x^2"
      ],
      [
        "反導數 $\\frac13\\ln(1+x^3)$。",
        "D(log(1+x^3)/3) == x^2/(1+x^3)"
      ],
      [
        "代上下限：$\\frac13(\\ln2-\\ln1)=\\frac{\\ln2}{3}$。",
        "SUB(log(1+x^3)/3, 1) - SUB(log(1+x^3)/3, 0) == ANS ;; INT(x^2/(1+x^3), 0, 1) == ANS"
      ]
    ],
    "trap": "忘了 $\\frac13$，答 $\\ln2$。",
    "check": [
      "被積函數在 $[0,1]$ 上介於 $0$ 和 $\\frac12$ 之間，答案 $\\approx0.231$ 合理。",
      "ANS > 0 ;; ANS < 1/2"
    ]
  },
  "int-029": {
    "spot": "$\\frac{1}{x^2+9}$：分子常數、分母是 $x^2+a^2$（$a=3$）—— 反正切型，$\\frac1a\\arctan\\frac xa$。",
    "why": "分子不是分母的導數，所以不是對數；分母不能實數分解，所以也不是部分分式。",
    "steps": [
      [
        "提出 $9$：$\\frac{1}{x^2+9}=\\frac19\\cdot\\frac{1}{1+(x/3)^2}$。",
        "1/(x^2+9) == (1/9)/(1+(x/3)^2)"
      ],
      [
        "令 $u=\\frac x3$，$dx=3\\,du$：$\\frac19\\cdot3\\int\\frac{du}{1+u^2}=\\frac13\\arctan u+C$。",
        "D(atan(x/3)/3) == 1/(x^2+9)"
      ],
      [
        "答案 $\\frac13\\arctan\\frac x3+C$。",
        "atan(x/3)/3 ~= ANS"
      ]
    ],
    "trap": "寫成 $\\arctan\\frac x3$ 漏了前面的 $\\frac13$，或寫 $\\frac19\\arctan\\frac x3$（漏了 $dx=3du$）。",
    "check": [
      "定積分對一下：$\\int_0^3\\frac{dx}{x^2+9}=\\frac13\\cdot\\frac\\pi4=\\frac{\\pi}{12}$。",
      "INT(1/(x^2+9), 0, 3) == pi/12"
    ]
  },
  "lim-002": {
    "spot": "$1-\\cos x$ 除以 $x^2$ —— 半角公式 $1-\\cos x=2\\sin^2\\frac x2$，變成 $\\left(\\frac{\\sin(x/2)}{x/2}\\right)^2$ 的標準極限。",
    "why": "只用到 $\\frac{\\sin u}{u}\\to1$；羅必達要做兩次，泰勒展開 $1-\\cos x\\approx\\frac{x^2}{2}$ 則是同一件事的速記。",
    "steps": [
      [
        "半角公式：$1-\\cos x=2\\sin^2\\frac x2$。",
        "1-cos(x) == 2*sin(x/2)^2"
      ],
      [
        "$\\frac{2\\sin^2(x/2)}{x^2}=\\frac12\\left(\\frac{\\sin(x/2)}{x/2}\\right)^2$。",
        "2*sin(x/2)^2/x^2 == (1/2)*(sin(x/2)/(x/2))^2"
      ],
      [
        "括號趨近 $1$，極限 $\\frac12$。",
        "LIM((1-cos(x))/x^2, 0) == ANS"
      ]
    ],
    "trap": "只約到 $\\frac{1-\\cos x}{x}\\to0$ 就以為整題是 $0$，或把 $2\\sin^2\\frac x2$ 的 $\\frac x2$ 當成 $x$ 得到 $2$。",
    "check": [
      "泰勒展開：$\\cos x=1-\\frac{x^2}{2}+\\cdots$，所以 $1-\\cos x\\approx\\frac{x^2}{2}$。",
      "SUB((1-cos(x))/x^2, 0.01) < 0.5 ;; SUB((1-cos(x))/x^2, 0.01) > 0.4999"
    ]
  },
  "lim-003": {
    "spot": "代 $x=2$ 得 $\\frac00$，而分子 $x^2-4$ 是平方差，含有 $(x-2)$ 這個因式。",
    "why": "多項式的 $\\frac00$ 先因式分解約掉公因式；羅必達也行，但約分更快。",
    "steps": [
      [
        "$x^2-4=(x-2)(x+2)$。",
        "x^2-4 == (x-2)*(x+2)"
      ],
      [
        "$x\\ne2$ 時約掉：式子 $=x+2$。",
        "(x^2-4)/(x-2) == x+2"
      ],
      [
        "代 $x=2$：$4$。",
        "LIM((x^2-4)/(x-2), 2) == ANS"
      ]
    ],
    "trap": "看到 $\\frac00$ 就說極限不存在，或說是 $0$。",
    "check": [
      "羅必達：$\\frac{2x}{1}$ 在 $x=2$ 是 $4$。",
      "D(x^2-4, 2) == ANS"
    ]
  },
  "lim-004": {
    "spot": "$x\\to\\infty$ 的有理函數，分子分母都是二次 —— 只看最高次項：$\\frac{3x^2}{2x^2}=\\frac32$。",
    "why": "同次時極限就是首項係數比；上下同除 $x^2$ 是它的嚴格版。",
    "steps": [
      [
        "上下同除 $x^2$：$\\frac{3-\\frac1x+\\frac{7}{x^2}}{2+\\frac{5}{x^2}}$。",
        "(3x^2-x+7)/(2x^2+5) == (3-1/x+7/x^2)/(2+5/x^2)"
      ],
      [
        "$x\\to\\infty$ 時 $\\frac1x$、$\\frac{1}{x^2}$ 都趨近 $0$。",
        "LIM(1/x, inf) == 0 ;; LIM(7/x^2, inf) == 0"
      ],
      [
        "剩下首項係數比 $\\frac32$。",
        "LIM((3x^2-x+7)/(2x^2+5), inf) == ANS"
      ]
    ],
    "trap": "看常數項寫 $\\frac75$（那是 $x\\to0$ 的答案）。",
    "check": [
      "$x=1000$ 時已經很接近 $1.5$。",
      "SUB((3x^2-x+7)/(2x^2+5), 1000) > 1.499 ;; SUB((3x^2-x+7)/(2x^2+5), 1000) < 1.5"
    ]
  },
  "rel-basic-003": {
    "spot": "$\\frac{e^{4x}-1}{x}$ 在 $x\\to0$ —— 就是 $e^{4x}$ 在 $0$ 的導數定義，或用 $e^u-1\\sim u$。",
    "why": "認出導數定義，答案就是 $(e^{4x})'|_0=4$，不用動手算極限。",
    "steps": [
      [
        "$\\frac{e^{4x}-1}{x}=\\frac{e^{4x}-e^0}{x-0}$，極限是 $f(x)=e^{4x}$ 在 $0$ 的導數。",
        "SUB(exp(4x), 0) == 1"
      ],
      [
        "$f'(x)=4e^{4x}$，$f'(0)=4$。",
        "D(exp(4x), 0) == 4"
      ],
      [
        "極限 $=4$。",
        "LIM((exp(4x)-1)/x, 0) == ANS"
      ]
    ],
    "trap": "記成 $\\frac{e^u-1}{u}\\to1$ 但沒把分母補成 $4x$，答 $1$。",
    "check": [
      "等價無窮小 $e^{4x}-1\\approx4x$，比值 $\\approx4$。",
      "SUB((exp(4x)-1)/x, 0.001) > 4 ;; SUB((exp(4x)-1)/x, 0.001) < 4.01"
    ]
  },
  "rel-basic-005": {
    "spot": "分子有根號減一、$\\frac00$ —— 乘上共軛 $\\sqrt{1+x}+1$，把根號從分子趕走。",
    "why": "有理化後 $x$ 直接約掉；也可以看成 $\\sqrt{1+x}$ 在 $0$ 的導數 $\\frac12$。",
    "steps": [
      [
        "上下乘 $\\sqrt{1+x}+1$：分子 $(1+x)-1=x$。",
        "(sqrt(1+x)-1)*(sqrt(1+x)+1) == x"
      ],
      [
        "約掉 $x$：式子 $=\\frac{1}{\\sqrt{1+x}+1}$。",
        "(sqrt(1+x)-1)/x == 1/(sqrt(1+x)+1)"
      ],
      [
        "代 $x=0$：$\\frac{1}{1+1}=\\frac12$。",
        "LIM((sqrt(1+x)-1)/x, 0) == ANS"
      ]
    ],
    "trap": "乘錯共軛（乘 $\\sqrt{1+x}-1$），分子變成 $(\\sqrt{1+x}-1)^2$ 還是 $\\frac00$。",
    "check": [
      "導數定義：$(\\sqrt{1+x})'|_{0}=\\frac{1}{2\\sqrt1}=\\frac12$。",
      "D(sqrt(1+x), 0) == ANS"
    ]
  },
  "ser-024": {
    "spot": "一般項 $\\frac{1}{n\\ln n}$ 是正的、遞減的，而且 $\\frac{1}{x\\ln x}$ 有現成反導數 $\\ln(\\ln x)$ —— 積分審斂法。",
    "why": "比較審斂法找不到好對象（它比 $\\frac1n$ 小、又比任何 $\\frac{1}{n^p}$（$p>1$）大）；積分審斂直接看 $\\ln\\ln x$ 會不會長到無限大。",
    "steps": [
      [
        "$f(x)=\\frac{1}{x\\ln x}$ 在 $x\\ge2$ 為正且遞減。",
        "D(1/(x*log(x)), 3) < 0 ;; SUB(1/(x*log(x)), 2) > 0"
      ],
      [
        "令 $u=\\ln x$：$\\int\\frac{dx}{x\\ln x}=\\ln(\\ln x)+C$。",
        "D(log(log(x)), 3) == 1/(3*log(3))"
      ],
      [
        "$\\int_2^M\\frac{dx}{x\\ln x}=\\ln\\ln M-\\ln\\ln2$，隨 $M$ 無限增大（只是長得非常慢）。",
        "INT(1/(x*log(x)), 2, 1000) == log(log(1000))-log(log(2)) ;; SUB(log(log(x)), 10^300) > SUB(log(log(x)), 10^30)"
      ],
      [
        "積分發散，所以級數發散。",
        "SUB(log(log(x)), 10^300) > 6"
      ]
    ],
    "trap": "看到一般項 $\\to0$ 或「比 $\\frac1n$ 還小」就說收斂；比調和級數小不代表收斂。",
    "check": [
      "對照 $\\sum\\frac{1}{n(\\ln n)^2}$：反導數是 $-\\frac{1}{\\ln x}$，有界，那一個才收斂。",
      "D(-1/log(x), 3) == 1/(3*log(3)^2)"
    ]
  },
  "tb-tan-001": {
    "spot": "切線斜率就是導數在那一點的值：先微分、再代 $x=2$。",
    "why": "多項式逐項用冪次法則，不必回到極限定義。",
    "steps": [
      [
        "逐項冪次法則：$(x^3)'=3x^2$、$(2x)'=2$。",
        "D(x^3) == 3x^2 ;; D(2x) == 2"
      ],
      [
        "$y'=3x^2-2$。",
        "D(x^3-2x) == 3x^2-2"
      ],
      [
        "代 $x=2$：$3\\cdot4-2=10$。",
        "D(x^3-2x, 2) == ANS"
      ]
    ],
    "trap": "把 $x=2$ 代進原函數得 $y=4$，當成斜率。",
    "check": [
      "割線斜率逼近：$\\frac{y(2.001)-y(2)}{0.001}\\approx10$。",
      "(SUB(x^3-2x, 2.001)-SUB(x^3-2x, 2))/0.001 > 10 ;; (SUB(x^3-2x, 2.001)-SUB(x^3-2x, 2))/0.001 < 10.01"
    ]
  },
  "exam-int-007": {
    "spot": "$\\sec^2x$ 正是 $\\tan x$ 的導數 —— 代 $u=\\tan x$，整題變成 $\\int u\\,du$。",
    "why": "也可以代 $u=\\sec x$（$du=\\sec x\\tan x\\,dx$），答案差一個常數；選 $\\tan x$ 跟標準答案的形式一致。",
    "steps": [
      [
        "令 $u=\\tan x$，$du=\\sec^2x\\,dx$。",
        "D(tan(x)) == 1/cos(x)^2"
      ],
      [
        "$\\int u\\,du=\\frac{u^2}{2}+C=\\frac{\\tan^2x}{2}+C$。",
        "D(tan(x)^2/2) == tan(x)/cos(x)^2"
      ],
      [
        "答案 $\\frac12\\tan^2x+C$。",
        "tan(x)^2/2 ~= ANS"
      ]
    ],
    "trap": "看到用 $u=\\sec x$ 算出的 $\\frac12\\sec^2x$ 以為不同；其實 $\\sec^2x=1+\\tan^2x$，只差常數 $\\frac12$。",
    "check": [
      "兩種代換的答案只差常數。",
      "1/(2*cos(x)^2) ~= ANS"
    ]
  },
  "exam-int-015": {
    "spot": "$\\frac1x$ 跟 $\\ln x$ 擺在一起 —— $\\frac1x$ 是 $\\ln x$ 的導數，代 $u=\\ln x$ 後剩 $\\int\\frac{du}{u}$。",
    "why": "被積函數就是 $\\frac{(\\ln x)'}{\\ln x}$，$\\frac{f'}{f}$ 型，對數一行收掉。",
    "steps": [
      [
        "令 $u=\\ln x$，$du=\\frac{dx}{x}$。",
        "D(log(x)) == 1/x"
      ],
      [
        "$\\int\\frac{du}{u}=\\ln|u|+C$。",
        "D(log(u), 2) == 1/2"
      ],
      [
        "換回（$x>1$ 時 $\\ln x>0$）：$\\ln(\\ln x)+C$。以 $x=3$ 驗導數。",
        "D(log(log(x)), 3) == 1/(3*log(3))"
      ],
      [
        "答案 $\\ln(\\ln x)+C$。",
        "SUB(D(log(log(x))), 5) == SUB(D(ANS), 5)"
      ]
    ],
    "trap": "把 $\\frac{1}{x\\ln x}$ 拆成 $\\frac1x\\cdot\\frac{1}{\\ln x}$ 各自積分，寫成 $\\ln x\\cdot\\ln(\\ln x)$。",
    "check": [
      "定積分對一下：$\\int_e^{e^2}\\frac{dx}{x\\ln x}=\\ln2-\\ln1=\\ln2$。",
      "INT(1/(x*log(x)), exp(1), exp(2)) == log(2)"
    ]
  },
  "exam-int-018": {
    "spot": "分母 $x^4+1=(x^2)^2+1$，分子 $x$ 是 $x^2$ 導數的一半 —— 代 $u=x^2$ 變成反正切型。",
    "why": "不必把 $x^4+1$ 分解成兩個二次式做部分分式；一個代換就到 $\\int\\frac{du}{1+u^2}$。",
    "steps": [
      [
        "令 $u=x^2$，$x\\,dx=\\frac{du}{2}$。",
        "D(x^2) == 2x"
      ],
      [
        "積分變成 $\\frac12\\int\\frac{du}{1+u^2}=\\frac12\\arctan u+C$。",
        "D(atan(u)/2) == 1/(2*(1+u^2))"
      ],
      [
        "換回：$\\frac12\\arctan(x^2)+C$。",
        "atan(x^2)/2 ~= ANS ;; D(atan(x^2)/2) == x/(x^4+1)"
      ]
    ],
    "trap": "把分子 $x$ 當成分母的導數，寫成 $\\ln(x^4+1)$；分母的導數是 $4x^3$。",
    "check": [
      "定積分對一下：$\\int_0^1\\frac{x}{x^4+1}dx=\\frac12\\arctan1=\\frac\\pi8$。",
      "INT(x/(x^4+1), 0, 1) == pi/8"
    ]
  },
  "exam-int-024": {
    "spot": "分子 $\\sin x$ 正好是分母 $1+\\cos x$ 導數的相反數 —— $-\\frac{f'}{f}$ 型。",
    "why": "對數一行收掉；半角化成 $\\tan\\frac x2$ 也行，但多一步。",
    "steps": [
      [
        "$(1+\\cos x)'=-\\sin x$，所以 $\\frac{\\sin x}{1+\\cos x}=-\\frac{(1+\\cos x)'}{1+\\cos x}$。",
        "D(1+cos(x)) == -sin(x)"
      ],
      [
        "反導數 $-\\ln(1+\\cos x)$。",
        "D(-log(1+cos(x))) == sin(x)/(1+cos(x))"
      ],
      [
        "代上下限：$-\\ln1+\\ln2=\\ln2$。",
        "SUB(-log(1+cos(x)), pi/2) - SUB(-log(1+cos(x)), 0) == ANS ;; INT(sin(x)/(1+cos(x)), 0, pi/2) == ANS"
      ]
    ],
    "trap": "漏了負號，得到 $-\\ln2$；被積函數在區間上是正的，答案一定是正的。",
    "check": [
      "半角：$\\frac{\\sin x}{1+\\cos x}=\\tan\\frac x2$，$\\int_0^{\\pi/2}\\tan\\frac x2dx=-2\\ln\\cos\\frac\\pi4=\\ln2$。",
      "sin(x)/(1+cos(x)) == tan(x/2) ;; -2*log(cos(pi/4)) == ANS"
    ]
  },
  "int-013": {
    "spot": "$(\\ln x)^2$ 單獨一個、沒有現成的反導數 —— 分部積分把 $\\ln$ 放在要微分的那邊（$dv=dx$），每做一次 $\\ln$ 降一次。",
    "why": "$\\ln$ 微分會變簡單、積分不會；兩次分部積分就把 $\\ln$ 次方降到 $0$。",
    "steps": [
      [
        "$u=(\\ln x)^2$、$dv=dx$：$du=\\frac{2\\ln x}{x}dx$、$v=x$。",
        "D(log(x)^2) == 2*log(x)/x"
      ],
      [
        "$\\int(\\ln x)^2dx=x(\\ln x)^2-2\\int\\ln x\\,dx$。",
        "D(x*log(x)^2) - log(x)^2 == 2*log(x)"
      ],
      [
        "再一次：$\\int\\ln x\\,dx=x\\ln x-x$。",
        "D(x*log(x)-x) == log(x)"
      ],
      [
        "合起來：$x(\\ln x)^2-2x\\ln x+2x+C=x\\left((\\ln x)^2-2\\ln x+2\\right)+C$。",
        "D(x*(log(x)^2-2*log(x)+2)) == log(x)^2 ;; x*(log(x)^2-2*log(x)+2) ~= ANS"
      ]
    ],
    "trap": "第二次分部積分忘了前面的 $-2$，或把 $-(x\\ln x-x)$ 的負號只乘到第一項，寫成 $+2x$ 變 $-2x$。",
    "check": [
      "定積分對一下：$\\int_1^e(\\ln x)^2dx=e(1-2+2)-1\\cdot2=e-2$。",
      "INT(log(x)^2, 1, exp(1)) == exp(1)-2"
    ]
  },
  "int-017": {
    "spot": "多項式 $x$ 乘 $\\sin x$ —— 分部積分，讓 $x$ 被微分掉。",
    "why": "選 $u=x$ 微分後變常數；反過來選 $u=\\sin x$ 會讓 $x$ 升成 $\\frac{x^2}{2}$，越做越難。",
    "steps": [
      [
        "$u=x$、$dv=\\sin x\\,dx$：$du=dx$、$v=-\\cos x$。",
        "D(-cos(x)) == sin(x)"
      ],
      [
        "$\\int x\\sin x\\,dx=-x\\cos x+\\int\\cos x\\,dx=-x\\cos x+\\sin x+C$。",
        "D(-x*cos(x)+sin(x)) == x*sin(x)"
      ],
      [
        "代上下限：$\\left(0+1\\right)-\\left(0+0\\right)=1$。",
        "SUB(-x*cos(x)+sin(x), pi/2) - SUB(-x*cos(x)+sin(x), 0) == ANS ;; INT(x*sin(x), 0, pi/2) == ANS"
      ]
    ],
    "trap": "$v=\\int\\sin x\\,dx$ 寫成 $+\\cos x$，整個答案差一個號變成 $-1$。",
    "check": [
      "被積函數在 $[0,\\frac\\pi2]$ 上介於 $0$ 和 $\\frac\\pi2$，答案 $1$ 比矩形上界 $\\frac{\\pi^2}{4}\\approx2.47$ 小，合理。",
      "ANS < pi^2/4 ;; ANS > 0"
    ]
  },
  "lim-005": {
    "spot": "$\\frac{e^x-1}{x}$ —— 就是 $e^x$ 在 $0$ 的導數定義。",
    "why": "$(e^x)'=e^x$，在 $0$ 是 $1$；這是所有 $e^u-1\\sim u$ 的源頭。",
    "steps": [
      [
        "$\\frac{e^x-1}{x}=\\frac{e^x-e^0}{x-0}$，極限是 $e^x$ 在 $0$ 的導數。",
        "SUB(exp(x), 0) == 1"
      ],
      [
        "$(e^x)'=e^x$，在 $0$ 是 $1$。",
        "D(exp(x), 0) == 1"
      ],
      [
        "極限 $=1$。",
        "LIM((exp(x)-1)/x, 0) == ANS"
      ]
    ],
    "trap": "代 $x=0$ 得 $\\frac00$ 就說極限是 $0$ 或不存在。",
    "check": [
      "泰勒展開 $e^x=1+x+\\frac{x^2}{2}+\\cdots$，所以 $\\frac{e^x-1}{x}=1+\\frac x2+\\cdots$。",
      "LIM(((exp(x)-1)/x-1)/x, 0) == 1/2"
    ]
  },
  "lim-006": {
    "spot": "$\\ln(1+3x)$ 在 $x\\to0$：等價無窮小 $\\ln(1+u)\\sim u$，$u=3x$。",
    "why": "比值裡直接替換，一步得到 $\\frac{3x}{x}$；也就是 $\\ln(1+3x)$ 在 $0$ 的導數。",
    "steps": [
      [
        "$\\frac{\\ln(1+3x)}{x}=3\\cdot\\frac{\\ln(1+3x)}{3x}$。",
        "log(1+3x)/x == 3*(log(1+3x)/(3x))"
      ],
      [
        "$\\frac{\\ln(1+u)}{u}\\to1$。",
        "LIM(log(1+x)/x, 0) == 1"
      ],
      [
        "極限 $=3$。",
        "LIM(log(1+3x)/x, 0) == ANS"
      ]
    ],
    "trap": "記住 $\\frac{\\ln(1+x)}{x}\\to1$ 但沒調整係數，答 $1$。",
    "check": [
      "導數定義：$(\\ln(1+3x))'|_0=\\frac{3}{1+0}=3$。",
      "D(log(1+3x), 0) == ANS"
    ]
  },
  "ode-lin-007": {
    "spot": "$y'-2y=-4x$：一階線性，係數是常數 $-2$ —— 積分因子 $e^{-2x}$。",
    "why": "也可以猜特解 $y_p=ax+b$（右邊是一次式）再加齊次解 $Ce^{2x}$；積分因子是不用猜的通用流程。",
    "steps": [
      [
        "乘 $e^{-2x}$：左邊變成 $(ye^{-2x})'$，所以 $(ye^{-2x})'=-4xe^{-2x}$。",
        "D(exp(-2x)*(2x+1)) == -4x*exp(-2x)"
      ],
      [
        "分部積分得 $\\int-4xe^{-2x}dx=(2x+1)e^{-2x}+C$，所以 $y=2x+1+Ce^{2x}$。",
        "D(2x+1+exp(2x)) - 2*(2x+1+exp(2x)) == -4x"
      ],
      [
        "$y(0)=1+C=1$，所以 $C=0$。",
        "SUB(2x+1, 0) == 1"
      ],
      [
        "$y=2x+1$；代回方程：$2-2(2x+1)=-4x$。",
        "D(ANS) - 2*ANS == -4x ;; SUB(ANS, 0) == 1 ;; 2x+1 == ANS"
      ]
    ],
    "trap": "積分因子取成 $e^{2x}$（符號弄反），得到錯的指數項。",
    "check": [
      "猜特解 $y=ax+b$：$a-2ax-2b=-4x$ 給 $a=2$、$b=1$，跟答案一樣。",
      "D(2x+1) - 2*(2x+1) == -4x"
    ]
  },
  "refine-integrals-016": {
    "spot": "$\\frac3n$ 是寬度、$1+\\frac{3k}{n}$ 從 $1$ 走到 $4$ —— $\\int_1^4u^2du$（或 $\\int_0^3(1+x)^2dx$）的右端點黎曼和。",
    "why": "認出黎曼和就直接算定積分，不必展開 $\\sum k^2$ 的公式。",
    "steps": [
      [
        "分點 $x_k=\\frac{3k}{n}$ 把 $[0,3]$ 分成 $n$ 段，每段寬 $\\frac3n$；高度 $f(x_k)=(1+x_k)^2$。",
        "SUB((1+x)^2, 3) == 16"
      ],
      [
        "極限 $=\\int_0^3(1+x)^2dx=\\left[\\frac{(1+x)^3}{3}\\right]_0^3=\\frac{64-1}{3}$。",
        "D((1+x)^3/3) == (1+x)^2 ;; (64-1)/3 == 21"
      ],
      [
        "答案 $21$。",
        "INT((1+x)^2, 0, 3) == ANS"
      ]
    ],
    "trap": "把區間當成 $[0,1]$（只看到 $\\frac kn$），算 $\\int_0^1(1+3x)^2dx=7$，漏了寬度 $3$。",
    "check": [
      "換成 $u=1+x$：$\\int_1^4u^2du=\\frac{64-1}{3}=21$。",
      "INT(u^2, 1, 4, u) == ANS"
    ]
  },
  "si-set-002": {
    "spot": "多項式處處可微，臨界點就是 $f'=0$ 的解；$f'=4x^3-16x$ 可以提出 $4x$ 再用平方差。",
    "why": "因式分解一次看出三個根，不需要數值解。",
    "steps": [
      [
        "$f'(x)=4x^3-16x$。",
        "D(x^4-8x^2) == 4x^3-16x"
      ],
      [
        "$4x^3-16x=4x(x-2)(x+2)$。",
        "4x^3-16x == 4x*(x-2)*(x+2)"
      ],
      [
        "三個根都讓導數為 $0$。",
        "D(x^4-8x^2, -2) == 0 ;; D(x^4-8x^2, 0) == 0 ;; D(x^4-8x^2, 2) == 0"
      ],
      [
        "臨界點是 $x=-2,0,2$。",
        "SUB(x^4-8x^2, 2) == -16 ;; SUB(x^4-8x^2, -2) == -16"
      ]
    ],
    "trap": "提出 $4x$ 後只解 $x^2-4=0$，漏掉 $x=0$。",
    "check": [
      "$f$ 是偶函數，臨界點對稱於 $0$；$x=0$ 是局部極大、$\\pm2$ 是局部極小。",
      "D2(x^4-8x^2, 0) < 0 ;; D2(x^4-8x^2, 2) > 0"
    ]
  },
  "der-028": {
    "spot": "$\\arctan$ 裡面包著 $e^x$ —— 連鎖律：外層 $\\frac{1}{1+u^2}$，再乘內層導數 $e^x$。",
    "why": "只有一層合成，直接套 $(\\arctan u)'=\\frac{u'}{1+u^2}$。",
    "steps": [
      [
        "$(\\arctan u)'=\\frac{1}{1+u^2}$。",
        "D(atan(u)) == 1/(1+u^2)"
      ],
      [
        "$u=e^x$，$u'=e^x$，$u^2=e^{2x}$。",
        "D(exp(x)) == exp(x) ;; exp(x)^2 == exp(2x)"
      ],
      [
        "結果：$\\frac{e^x}{1+e^{2x}}$。",
        "D(atan(exp(x))) == ANS"
      ]
    ],
    "trap": "漏乘內層的 $e^x$，寫成 $\\frac{1}{1+e^{2x}}$；或把 $(e^x)^2$ 寫成 $e^{x^2}$。",
    "check": [
      "代 $x=0$：$\\frac{1}{1+1}=\\frac12$。",
      "D(atan(exp(x)), 0) == 1/2"
    ]
  },
  "int-011": {
    "spot": "$\\frac{1}{x^2+4}$：分母是 $x^2+a^2$（$a=2$）、分子常數 —— $\\frac1a\\arctan\\frac xa$。",
    "why": "分子不是分母的導數、分母又不能實數分解，就是反正切型。",
    "steps": [
      [
        "$\\frac{1}{x^2+4}=\\frac14\\cdot\\frac{1}{1+(x/2)^2}$。",
        "1/(x^2+4) == (1/4)/(1+(x/2)^2)"
      ],
      [
        "令 $u=\\frac x2$，$dx=2\\,du$：$\\frac14\\cdot2\\int\\frac{du}{1+u^2}=\\frac12\\arctan u+C$。",
        "D(atan(x/2)/2) == 1/(x^2+4)"
      ],
      [
        "答案 $\\frac12\\arctan\\frac x2+C$。",
        "atan(x/2)/2 ~= ANS"
      ]
    ],
    "trap": "寫成 $\\frac14\\arctan\\frac x2$（漏了 $dx=2du$）或 $\\arctan\\frac x2$。",
    "check": [
      "定積分對一下：$\\int_0^2\\frac{dx}{x^2+4}=\\frac12\\cdot\\frac\\pi4=\\frac\\pi8$。",
      "INT(1/(x^2+4), 0, 2) == pi/8"
    ]
  },
  "lim-024": {
    "spot": "$\\ln(1+x)-x$：一階項剛好被減掉 —— 要看泰勒展開的二次項 $-\\frac{x^2}{2}$。",
    "why": "分母是 $x^2$，展開到二次就夠；羅必達要做兩次，展開一步到位。",
    "steps": [
      [
        "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$。",
        "D2(log(1+x), 0) == -1"
      ],
      [
        "$\\ln(1+x)-x=-\\frac{x^2}{2}+O(x^3)$，除以 $x^2$：$-\\frac12+O(x)$。",
        "LIM((log(1+x)-x+x^2/2)/x^3, 0) == 1/3"
      ],
      [
        "極限 $=-\\frac12$。",
        "LIM((log(1+x)-x)/x^2, 0) == ANS"
      ]
    ],
    "trap": "用 $\\ln(1+x)\\sim x$ 直接替換得 $\\frac{0}{x^2}=0$；等價無窮小不能用在相減的地方。",
    "check": [
      "羅必達一次：$\\frac{\\frac{1}{1+x}-1}{2x}=\\frac{-1}{2(1+x)}\\to-\\frac12$。",
      "LIM(-1/(2*(1+x)), 0) == ANS"
    ]
  },
  "lim-040": {
    "spot": "$\\infty\\cdot0$ 型，而且 $\\ln(1+\\frac2x)$ 的裡面趨近 $0$ —— 令 $t=\\frac2x$，變成 $2\\cdot\\frac{\\ln(1+t)}{t}$。",
    "why": "換變數後是標準極限 $\\frac{\\ln(1+t)}{t}\\to1$；這也是 $\\left(1+\\frac2x\\right)^x\\to e^2$ 取對數的版本。",
    "steps": [
      [
        "令 $t=\\frac2x$，$x=\\frac2t$，$x\\to\\infty$ 對應 $t\\to0^+$：式子 $=2\\cdot\\frac{\\ln(1+t)}{t}$。",
        "SUB(x*log(1+2/x), 4) == SUB(2*log(1+t)/t, 1/2)"
      ],
      [
        "$\\frac{\\ln(1+t)}{t}\\to1$。",
        "LIM(log(1+t)/t, 0+) == 1"
      ],
      [
        "極限 $=2$。",
        "LIM(x*log(1+2/x), inf) == ANS"
      ]
    ],
    "trap": "看到 $\\ln(1+\\frac2x)\\to0$ 就說整個是 $0$，忽略 $x\\to\\infty$。",
    "check": [
      "對照 $\\left(1+\\frac2x\\right)^x\\to e^2$，取對數就是 $2$。",
      "LIM((1+2/x)^x, inf) == exp(2)"
    ]
  },
  "ode-lin-005": {
    "spot": "$y'=-y\\tan x$：右邊是 $y$ 乘一個只含 $x$ 的函數 —— 可分離，$\\frac{dy}{y}=-\\tan x\\,dx$。",
    "why": "$\\int-\\tan x\\,dx=\\ln|\\cos x|$ 一行就有，分離後直接指數化。",
    "steps": [
      [
        "分離：$\\frac{dy}{y}=-\\tan x\\,dx$。",
        "SUB(D(2*cos(x))/(2*cos(x)), 0.5) == -tan(0.5)"
      ],
      [
        "積分：$\\ln|y|=\\ln|\\cos x|+C$，因為 $(\\ln|\\cos x|)'=-\\tan x$。",
        "D(log(abs(cos(x)))) == -tan(x)"
      ],
      [
        "$y=A\\cos x$，$y(0)=A=2$。",
        "SUB(2*cos(x), 0) == 2"
      ],
      [
        "$y=2\\cos x$，代回方程成立。",
        "D(ANS) == -ANS*tan(x) ;; SUB(ANS, 0) == 2 ;; 2*cos(x) == ANS"
      ]
    ],
    "trap": "把 $\\int\\tan x\\,dx$ 記成 $\\ln|\\cos x|$（少了負號），得到 $y=\\frac{2}{\\cos x}$。",
    "check": [
      "$x=\\frac\\pi3$：$y=1$、$y'=-\\sqrt3$，而 $-y\\tan\\frac\\pi3=-\\sqrt3$。",
      "D(2*cos(x), pi/3) == -sqrt(3)"
    ]
  },
  "ser-030": {
    "spot": "一般項有 $n$ 和 $5^n$ —— 比值審斂：相鄰兩項的比 $\\frac{n}{n+1}\\cdot\\frac{|x-2|}{5}\\to\\frac{|x-2|}{5}$。",
    "why": "$\\frac{n}{n+1}\\to1$，多項式因子不影響半徑；半徑只看 $5^n$。",
    "steps": [
      [
        "係數 $c_n=\\frac{1}{n5^n}$，比值 $\\frac{c_{n+1}}{c_n}=\\frac{n}{5(n+1)}$。",
        "SUB((1/((n+1)*5^(n+1)))/(1/(n*5^n)), 4) == SUB(n/(5*(n+1)), 4)"
      ],
      [
        "$\\frac{n}{5(n+1)}\\to\\frac15$。",
        "LIM(n/(5*(n+1)), inf) == 1/5"
      ],
      [
        "$\\frac{|x-2|}{5}<1$ 收斂，所以半徑 $R=5$。",
        "1/(1/5) == ANS"
      ]
    ],
    "trap": "把中心 $2$ 跟半徑混在一起，答收斂區間的端點 $7$；或比值倒過來算出 $\\frac15$。",
    "check": [
      "根值審斂一樣：$\\sqrt[n]{n5^n}=5\\sqrt[n]{n}\\to5$。",
      "LIM(5*n^(1/n), inf) == ANS"
    ]
  },
  "ser-038": {
    "spot": "$\\ln(1+x)$ 的麥克勞林級數 $x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$ 要背；第 $n$ 項係數 $\\frac{(-1)^{n+1}}{n}$。",
    "why": "從 $\\frac{1}{1+x}=1-x+x^2-\\cdots$ 逐項積分得到，比算三階導數快。",
    "steps": [
      [
        "$\\frac{1}{1+x}=\\sum(-1)^nx^n$（$|x|<1$）。",
        "D(log(1+x)) == 1/(1+x) ;; SUB(1/(1+x), 0.3) == SUM((-0.3)^n, 0)"
      ],
      [
        "逐項積分：$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$。",
        "SUB(log(1+x), 0.3) == SUM((-1)^(n+1)*0.3^n/n, 1)"
      ],
      [
        "用導數公式對一下：$f'''(x)=\\frac{2}{(1+x)^3}$，係數 $\\frac{f'''(0)}{3!}=\\frac26=\\frac13$。",
        "D2(1/(1+x)) == 2/(1+x)^3 ;; SUB(2/(1+x)^3, 0)/6 == ANS"
      ]
    ],
    "trap": "把正負號弄反寫 $-\\frac13$，或把 $\\frac{x^n}{n}$ 記成 $\\frac{x^n}{n!}$ 寫成 $\\frac16$。",
    "check": [
      "$x=0.1$：$\\ln1.1-(0.1-0.005)\\approx0.00031$，跟 $\\frac{0.1^3}{3}\\approx0.00033$ 吻合。",
      "(log(1.1)-0.095)/0.001 > 0.30 ;; (log(1.1)-0.095)/0.001 < 0.34"
    ]
  },
  "si-set-013": {
    "spot": "多項式，臨界點就是 $f'=0$ 的根；$f'=4x^3-12x^2$ 提出 $4x^2$。",
    "why": "因式分解後一眼讀出根，$x=0$ 是重根但仍是臨界點。",
    "steps": [
      [
        "$f'(x)=4x^3-12x^2$。",
        "D(x^4-4x^3) == 4x^3-12x^2"
      ],
      [
        "$4x^3-12x^2=4x^2(x-3)$。",
        "4x^3-12x^2 == 4x^2*(x-3)"
      ],
      [
        "根：$x=0$（二重）與 $x=3$。",
        "D(x^4-4x^3, 0) == 0 ;; D(x^4-4x^3, 3) == 0"
      ],
      [
        "臨界點是 $x=0$ 與 $x=3$。",
        "SUB(x^4-4x^3, 3) == -27"
      ]
    ],
    "trap": "約掉 $x^2$ 只剩 $x=3$；或因為 $x=0$ 不是極值點（導數不變號）就把它排除 —— 臨界點只看 $f'=0$。",
    "check": [
      "$x=0$ 兩側 $f'$ 都是負的（不是極值），$x=3$ 兩側由負變正（局部極小）。",
      "D(x^4-4x^3, -0.5) < 0 ;; D(x^4-4x^3, 0.5) < 0 ;; D(x^4-4x^3, 4) > 0"
    ]
  },
  "si-set-014": {
    "spot": "商的形式 $\\frac{x}{x^2+1}$，分母恆正 —— 商法則後只看分子 $1-x^2=0$。",
    "why": "$x^2+1>0$ 處處可微、沒有導數不存在的點，臨界點只來自分子為 $0$。",
    "steps": [
      [
        "商法則：$f'(x)=\\frac{(x^2+1)-x\\cdot2x}{(x^2+1)^2}=\\frac{1-x^2}{(x^2+1)^2}$。",
        "D(x/(x^2+1)) == (1-x^2)/(x^2+1)^2"
      ],
      [
        "$1-x^2=0$：$x=\\pm1$。",
        "D(x/(x^2+1), 1) == 0 ;; D(x/(x^2+1), -1) == 0"
      ],
      [
        "臨界點是 $x=-1$ 與 $x=1$。",
        "SUB(x/(x^2+1), 1) == 1/2 ;; SUB(x/(x^2+1), -1) == -1/2"
      ]
    ],
    "trap": "商法則分子順序寫反成 $2x^2-(x^2+1)$，雖然根一樣，但後面判斷增減會全部顛倒。",
    "check": [
      "$f$ 是奇函數，臨界點對稱；$x=1$ 是最大值 $\\frac12$。",
      "SUB(x/(x^2+1), 2) < 1/2 ;; SUB(x/(x^2+1), 0.5) < 1/2"
    ]
  },
  "si-set-016": {
    "spot": "$f'(x)=2\\cos x+1$，令它為 $0$ 就是 $\\cos x=-\\frac12$ —— 單位圓上第二、三象限各一個角。",
    "why": "三角方程直接查特殊角，在 $(0,2\\pi)$ 裡列出全部解。",
    "steps": [
      [
        "$f'(x)=2\\cos x+1$。",
        "D(2*sin(x)+x) == 2*cos(x)+1"
      ],
      [
        "$\\cos x=-\\frac12$，在 $(0,2\\pi)$ 內：$x=\\frac{2\\pi}{3}$ 或 $\\frac{4\\pi}{3}$。",
        "D(2*sin(x)+x, 2*pi/3) == 0 ;; D(2*sin(x)+x, 4*pi/3) == 0"
      ],
      [
        "臨界點是 $x=\\frac{2\\pi}{3}$ 與 $x=\\frac{4\\pi}{3}$。",
        "cos(2*pi/3) == -1/2 ;; cos(4*pi/3) == -1/2"
      ]
    ],
    "trap": "只寫出 $\\frac{2\\pi}{3}$ 漏了第三象限的 $\\frac{4\\pi}{3}$；或解成 $\\cos x=\\frac12$ 得到 $\\frac\\pi3,\\frac{5\\pi}{3}$。",
    "check": [
      "$\\frac{2\\pi}{3}$ 是局部極大、$\\frac{4\\pi}{3}$ 是局部極小。",
      "D2(2*sin(x)+x, 2*pi/3) < 0 ;; D2(2*sin(x)+x, 4*pi/3) > 0"
    ]
  },
  "tmpl-int-partialfrac-001": {
    "spot": "分母是兩個相差 $1$ 的一次因式 $x(x+1)$ —— 部分分式 $\\frac1x-\\frac{1}{x+1}$，積出來是對數差。",
    "why": "兩個因式相差常數 $1$，拆開的係數直接是 $\\pm1$，不用解方程。",
    "steps": [
      [
        "$\\frac{1}{x(x+1)}=\\frac1x-\\frac{1}{x+1}$。",
        "1/(x*(x+1)) == 1/x-1/(x+1)"
      ],
      [
        "反導數 $\\ln x-\\ln(x+1)=\\ln\\frac{x}{x+1}$。",
        "D(log(x/(x+1))) == 1/(x*(x+1))"
      ],
      [
        "代上下限：$\\ln\\frac23-\\ln\\frac12=\\ln\\frac43$。",
        "SUB(log(x/(x+1)), 2) - SUB(log(x/(x+1)), 1) == log(4/3) ;; INT(1/(x*(x+1)), 1, 2) == ANS"
      ]
    ],
    "trap": "拆成 $\\frac1x+\\frac{1}{x+1}$（符號錯），得到 $\\ln3$。",
    "check": [
      "被積函數在 $[1,2]$ 上介於 $\\frac16$ 與 $\\frac12$，答案 $\\ln\\frac43\\approx0.288$ 落在中間。",
      "ANS > 1/6 ;; ANS < 1/2"
    ]
  },
  "exam-ser-017": {
    "spot": "$\\frac{x^n}{n!}$ 的形狀 —— 這是 $e^x$ 的麥克勞林級數，$x=2$。",
    "why": "認出級數就直接寫和；比值審斂只能告訴你收斂、算不出和。",
    "steps": [
      [
        "$e^x$ 的每一階導數都是 $e^x$，在 $0$ 都是 $1$，所以 $e^x=\\sum_{n\\ge0}\\frac{x^n}{n!}$。",
        "D(exp(x)) == exp(x) ;; D2(exp(x), 0) == 1"
      ],
      [
        "這個級數對所有 $x$ 都收斂：相鄰兩項比 $\\frac{x}{n+1}\\to0$。",
        "LIM(2/(n+1), inf) == 0"
      ],
      [
        "代 $x=2$：$\\sum\\frac{2^n}{n!}=e^2$。",
        "SUB(exp(x), 2) == ANS"
      ]
    ],
    "trap": "以為從 $n=1$ 開始，寫 $e^2-1$；這題從 $n=0$ 起，首項是 $1$。",
    "check": [
      "前六項 $1+2+2+\\frac43+\\frac23+\\frac{4}{15}\\approx7.27$，略小於 $e^2\\approx7.39$。",
      "1+2+2+4/3+2/3+4/15 < ANS ;; 1+2+2+4/3+2/3+4/15 > ANS-0.2"
    ]
  },
  "int-012": {
    "spot": "$\\sin^2x$ 偶數次方 —— 降冪公式 $\\sin^2x=\\frac{1-\\cos2x}{2}$。",
    "why": "降冪之後兩項都有現成反導數；而且 $\\cos2x$ 在 $[0,\\frac\\pi2]$ 上積分剛好是 $0$。",
    "steps": [
      [
        "$\\sin^2x=\\frac{1-\\cos2x}{2}$。",
        "sin(x)^2 == (1-cos(2x))/2"
      ],
      [
        "反導數 $\\frac x2-\\frac{\\sin2x}{4}$。",
        "D(x/2-sin(2x)/4) == sin(x)^2"
      ],
      [
        "代上下限：$\\frac\\pi4-0=\\frac\\pi4$。",
        "SUB(x/2-sin(2x)/4, pi/2) - SUB(x/2-sin(2x)/4, 0) == ANS ;; INT(sin(x)^2, 0, pi/2) == ANS"
      ]
    ],
    "trap": "寫成 $\\frac{\\sin^3x}{3}$（把 $\\sin$ 當成 $x$ 用冪次法則），微分回去少了 $\\cos x$。",
    "check": [
      "對稱：$\\int_0^{\\pi/2}\\sin^2x=\\int_0^{\\pi/2}\\cos^2x$，兩者相加是 $\\frac\\pi2$，各一半。",
      "INT(cos(x)^2, 0, pi/2) == ANS"
    ]
  },
  "int-025": {
    "spot": "積分區域是圓盤、被積函數是 $x^2+y^2$ —— 兩個都在喊極座標：$x^2+y^2=r^2$，$dA=r\\,dr\\,d\\theta$。",
    "why": "直角座標要處理 $\\sqrt{1-x^2}$ 的上下限；極座標下區域是長方形 $[0,1]\\times[0,2\\pi]$。",
    "steps": [
      [
        "極座標：被積函數 $r^2$，面積元素 $r\\,dr\\,d\\theta$，所以是 $\\int_0^{2\\pi}\\!\\int_0^1r^3\\,dr\\,d\\theta$。",
        "SUB(x^2+y^2, 0.6) == 0.36+y^2"
      ],
      [
        "內層 $\\int_0^1r^3dr=\\frac14$。",
        "INT(r^3, 0, 1, r) == 1/4"
      ],
      [
        "外層乘 $2\\pi$：$\\frac{2\\pi}{4}=\\frac\\pi2$。",
        "2*pi*INT(r^3, 0, 1, r) == ANS"
      ]
    ],
    "trap": "漏了 $dA$ 裡的 $r$，算 $2\\pi\\int_0^1r^2dr=\\frac{2\\pi}{3}$。",
    "check": [
      "直角座標對一下：先對 $y$ 從 $-\\sqrt{1-x^2}$ 積到 $\\sqrt{1-x^2}$，得 $2x^2\\sqrt{1-x^2}+\\frac23(1-x^2)^{3/2}$，再對 $x$ 積。",
      "INT(2*x^2*sqrt(1-x^2)+(2/3)*(1-x^2)^(3/2), -1, 1) == ANS"
    ]
  },
  "refine-series-012": {
    "spot": "「一正兩負」：每組是 $\\frac{1}{2k-1}-\\frac{1}{4k-2}-\\frac{1}{4k}$ —— 前兩項 $\\frac{1}{2k-1}-\\frac{1}{2(2k-1)}=\\frac{1}{2(2k-1)}$，一組剛好是原級數一組的一半。",
    "why": "條件收斂級數重排會改變和，不能直接說還是 $\\ln2$；把三項一組化簡，直接看出是原交錯調和級數的 $\\frac12$。",
    "steps": [
      [
        "第 $k$ 組：$\\frac{1}{2k-1}-\\frac{1}{4k-2}-\\frac{1}{4k}=\\frac{1}{4k-2}-\\frac{1}{4k}=\\frac12\\left(\\frac{1}{2k-1}-\\frac{1}{2k}\\right)$。",
        "1/(2k-1)-1/(4k-2)-1/(4k) == (1/2)*(1/(2k-1)-1/(2k))"
      ],
      [
        "原級數兩項一組：$\\sum\\left(\\frac{1}{2k-1}-\\frac{1}{2k}\\right)=\\ln2$。",
        "SUM(1/(2n-1)-1/(2n), 1) == log(2)"
      ],
      [
        "一般項趨近 $0$，所以組內停在哪裡都不影響極限；和 $=\\frac12\\ln2$。",
        "SUM((1/2)*(1/(2n-1)-1/(2n)), 1) == ANS"
      ]
    ],
    "trap": "以為「每一項都還在」所以和不變，答 $\\ln2$；條件收斂級數重排可以改變和（黎曼重排定理）。",
    "check": [
      "一般公式：$p$ 個正項配 $q$ 個負項，和 $=\\ln2+\\frac12\\ln\\frac pq$；$p=1,q=2$ 給 $\\frac12\\ln2$。",
      "log(2)+(1/2)*log(1/2) == ANS"
    ]
  },
  "refine-derivatives-037": {
    "spot": "右邊 $x\\sin x$，而 $\\sin x$ 本身就是 $y''+y=0$ 的解 —— 共振，猜測式要多乘一個 $x$，所以用 $x^2$ 次的多項式乘 $\\cos x$、$\\sin x$。",
    "why": "不乘 $x$ 的話 $(\\beta x+\\cdot)\\cos x$ 裡的常數部分會被齊次解吃掉、方程解不出來；題目已經給好形式，代進去比係數就好。",
    "steps": [
      [
        "設 $P=\\alpha x^2+\\beta x$、$Q=\\gamma x^2+\\delta x$，$y=P\\cos x+Q\\sin x$。算出 $y''+y=(P''+2Q')\\cos x+(Q''-2P')\\sin x$（以 $P=x^2$、$Q=0$ 驗）。",
        "D2(x^2*cos(x)) + x^2*cos(x) == 2*cos(x) - 4x*sin(x)"
      ],
      [
        "代入：$\\cos x$ 係數 $2\\alpha+2\\delta+4\\gamma x$、$\\sin x$ 係數 $2\\gamma-2\\beta-4\\alpha x$，要等於 $0$ 與 $x$。",
        "D2(x*sin(x)) + x*sin(x) == 2*cos(x)"
      ],
      [
        "比係數：$\\gamma=0$、$-4\\alpha=1$、$\\beta=\\gamma=0$、$\\alpha+\\delta=0$，所以 $\\alpha=-\\frac14$、$\\delta=\\frac14$。",
        "(-1/4)*2 + (1/4)*2 == 0 ;; -4*(-1/4) == 1"
      ],
      [
        "特解 $y_p=-\\frac{x^2}{4}\\cos x+\\frac x4\\sin x$；代回方程成立。",
        "D2(ANS) + ANS == x*sin(x) ;; -x^2*cos(x)/4 + x*sin(x)/4 == ANS"
      ]
    ],
    "trap": "沒乘 $x$，猜 $(Ax+B)\\cos x+(Cx+D)\\sin x$：$B\\cos x$、$D\\sin x$ 是齊次解，係數方程會矛盾。",
    "check": [
      "加上任何齊次解 $c_1\\cos x+c_2\\sin x$ 還是解，殘差不變。",
      "D2(ANS+3*cos(x)) + ANS + 3*cos(x) == x*sin(x)"
    ]
  },
  "refine-series-013": {
    "spot": "「四正一負」：正項跑得比負項快四倍 —— 用調和數的對數漸近：$p$ 正配 $q$ 負的重排和是 $\\ln2+\\frac12\\ln\\frac pq$。",
    "why": "黎曼重排：條件收斂級數的和取決於正負項的取用比例；看部分和裡兩堆各取多少項，用 $\\ln$ 漸近算差。",
    "steps": [
      [
        "取 $m$ 組：用掉前 $4m$ 個正項 $\\sum_{j\\le4m}\\frac{1}{2j-1}$ 與前 $m$ 個負項 $\\sum_{j\\le m}\\frac{1}{2j}$。",
        "SUB(4n, 3) == 12"
      ],
      [
        "漸近：$\\sum_{j\\le N}\\frac{1}{2j-1}=\\frac12\\ln N+\\ln2+\\frac\\gamma2+o(1)$，$\\sum_{j\\le m}\\frac{1}{2j}=\\frac12\\ln m+\\frac\\gamma2+o(1)$。用原級數（$N=m$）對一下：差趨近 $\\ln2$。",
        "SUM(1/(2n-1)-1/(2n), 1) == log(2)"
      ],
      [
        "$N=4m$：差 $=\\frac12\\ln(4m)+\\ln2-\\frac12\\ln m=\\ln2+\\ln2$。",
        "(1/2)*log(4n)+log(2)-(1/2)*log(n) == 2*log(2)"
      ],
      [
        "直接把每組加起來對一下：和 $=2\\ln2$。",
        "SUM(1/(8n-7)+1/(8n-5)+1/(8n-3)+1/(8n-1)-1/(2n), 1) == ANS"
      ]
    ],
    "trap": "以為重排不改變和，答 $\\ln2$；或把比例弄反（$\\frac14$）得到 $\\ln2-\\ln2=0$。",
    "check": [
      "公式 $\\ln2+\\frac12\\ln\\frac pq$，$p=4,q=1$。",
      "log(2)+(1/2)*log(4) == ANS"
    ]
  },
  "refine-series-015": {
    "spot": "「兩正一負」而項是 $\\frac{1}{\\sqrt n}$ —— 每組大約 $\\frac{2}{2\\sqrt m}-\\frac{1}{\\sqrt{2m}}=\\frac{1-1/\\sqrt2}{\\sqrt m}$，跟 $\\frac{1}{\\sqrt m}$ 同階，而 $\\sum\\frac{1}{\\sqrt m}$ 發散。",
    "why": "正項的取用速度是負項的兩倍，每組多出一個 $\\frac{1}{\\sqrt m}$ 大小的正量；對 $\\frac1n$ 這只差 $\\ln$，對 $\\frac{1}{\\sqrt n}$ 會累積到無限大。",
    "steps": [
      [
        "第 $m$ 組：$\\frac{1}{\\sqrt{4m-3}}+\\frac{1}{\\sqrt{4m-1}}-\\frac{1}{\\sqrt{2m}}$。乘上 $\\sqrt m$ 的極限是 $1-\\frac{1}{\\sqrt2}>0$。",
        "LIM(sqrt(n)*(1/sqrt(4n-3)+1/sqrt(4n-1)-1/sqrt(2n)), inf) == 1-1/sqrt(2)"
      ],
      [
        "每組都是正的（例如 $m=1$ 與 $m=100$），所以可以用極限比較。",
        "SUB(1/sqrt(4n-3)+1/sqrt(4n-1)-1/sqrt(2n), 1) > 0 ;; SUB(1/sqrt(4n-3)+1/sqrt(4n-1)-1/sqrt(2n), 100) > 0"
      ],
      [
        "$\\sum\\frac{1}{\\sqrt m}$ 是 $p=\\frac12\\le1$ 的 $p$ 級數，發散：$\\int_1^M\\frac{dx}{\\sqrt x}=2\\sqrt M-2$ 無上界。",
        "INT(1/sqrt(x), 1, 10^6) == 2*1000-2"
      ],
      [
        "極限比較：組和發散到 $+\\infty$，重排後的級數發散。",
        "SUB(2*sqrt(x)-2, 10^8) > 10000"
      ]
    ],
    "trap": "以為「原級數收斂、重排只換順序」所以還是收斂；條件收斂級數重排可以變成發散。",
    "check": [
      "對照 $\\frac1n$ 的兩正一負：組和只有 $O(m^{-2})$，級數收斂到 $\\frac32\\ln2$；差別在 $\\frac{1}{\\sqrt n}$ 的部分和是 $\\sqrt N$ 級、而不是 $\\ln N$ 級。",
      "SUM(1/(4n-3)+1/(4n-1)-1/(2n), 1) == (3/2)*log(2)"
    ]
  },
  "cx-int-008": {
    "spot": "分子 $x$ 是分母 $x^2+1$ 導數 $2x$ 的一半 —— $\\frac{f'}{f}$ 型。",
    "why": "對數一行收掉；看到 $x^2+1$ 不要反射寫 $\\arctan$（那是分子為常數的時候）。",
    "steps": [
      [
        "$(x^2+1)'=2x$，所以 $\\frac{x}{x^2+1}=\\frac12\\cdot\\frac{2x}{x^2+1}$。",
        "D(x^2+1) == 2x"
      ],
      [
        "反導數 $\\frac12\\ln(x^2+1)$。",
        "D(log(x^2+1)/2) == x/(x^2+1)"
      ],
      [
        "代上下限：$\\frac12\\ln2$。",
        "SUB(log(x^2+1)/2, 1) - SUB(log(x^2+1)/2, 0) == ANS ;; INT(x/(x^2+1), 0, 1) == ANS"
      ]
    ],
    "trap": "忘了 $\\frac12$，答 $\\ln2$。",
    "check": [
      "被積函數在 $[0,1]$ 上介於 $0$ 與 $\\frac12$，答案 $\\approx0.347$ 合理。",
      "ANS > 0 ;; ANS < 1/2"
    ]
  },
  "fd-der-012": {
    "spot": "多項式求某一點的導數：逐項冪次法則，再代 $x=3$。",
    "why": "先求 $f'(x)$ 再代值，最不容易出錯。",
    "steps": [
      [
        "逐項微分：$(x^2)'=2x$、$(4x)'=4$。",
        "D(x^2) == 2x ;; D(4x) == 4"
      ],
      [
        "$f'(x)=2x+4$。",
        "D(x^2+4x) == 2x+4"
      ],
      [
        "$f'(3)=6+4=10$。",
        "D(x^2+4x, 3) == ANS"
      ]
    ],
    "trap": "代進原函數算 $f(3)=21$。",
    "check": [
      "割線斜率逼近：$\\frac{f(3.001)-f(3)}{0.001}\\approx10$。",
      "(SUB(x^2+4x, 3.001)-SUB(x^2+4x, 3))/0.001 > 10 ;; (SUB(x^2+4x, 3.001)-SUB(x^2+4x, 3))/0.001 < 10.01"
    ]
  }
};
