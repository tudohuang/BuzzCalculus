// 詳解 v2 批次 012（60 題）。格式見 tools/build_solution_detail.js 的說明。
module.exports = {
  "rel-hard-ser-012": {
    "spot": "係數 $\\frac{n^n}{n!}$ 同時有 $n^n$ 和階乘 —— 相鄰兩項一除，階乘只剩一個 $n+1$，剩下 $\\left(1+\\frac{1}{n}\\right)^n$，比值法專用的形狀。",
    "why": "根式法要估 $(n!)^{1/n}$，得動用 Stirling；比值法把階乘約掉，直接落到 $e$ 的定義。",
    "steps": [
      [
        "設 $a_n=\\frac{n^n}{n!}$，相鄰比：$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)^{n+1}}{(n+1)!}\\cdot\\frac{n!}{n^n}=\\frac{(n+1)^n}{n^n}$。",
        "(n+1)^n/n^n == (1+1/n)^n"
      ],
      [
        "這正是 $\\left(1+\\frac{1}{n}\\right)^n$，極限是 $e$。",
        "LIM((1+1/n)^n, inf) == e"
      ],
      [
        "比值法：$R=\\lim\\frac{a_n}{a_{n+1}}=\\frac{1}{e}$。",
        "1/e == ANS"
      ]
    ],
    "trap": "把 $\\lim\\frac{a_{n+1}}{a_n}=e$ 直接當半徑答 $e$。比值的極限是 $\\frac{1}{R}$，要取倒數。",
    "check": [
      "$\\left(1+\\frac{1}{n}\\right)^n$ 從下方爬向 $e$：$n=1000$ 時已經是 $2.7169$，比值確實落在 $e$ 附近。",
      "SUB((1+1/n)^n, 1000) < e ;; SUB((1+1/n)^n, 1000) > 2.716"
    ]
  },
  "uni-der-010": {
    "spot": "極座標曲線問切線斜率 —— 寫成參數式 $x=r\\cos\\theta$、$y=r\\sin\\theta$，斜率是 $\\frac{dy/d\\theta}{dx/d\\theta}$。",
    "why": "$\\frac{dr}{d\\theta}$ 不是切線斜率，它只是半徑的變化率；斜率一定要回到直角座標的 $x,y$。",
    "steps": [
      [
        "參數式：$x=(1+\\cos\\theta)\\cos\\theta$、$y=(1+\\cos\\theta)\\sin\\theta$；在 $\\theta=\\frac{\\pi}{2}$ 點是 $(0,1)$。",
        "SUB((1+cos(t))*sin(t), pi/2) == 1 ;; SUB((1+cos(t))*cos(t), pi/2) == 0"
      ],
      [
        "$\\frac{dy}{d\\theta}=r'\\sin\\theta+r\\cos\\theta$，其中 $r'=-\\sin\\theta$；在 $\\frac{\\pi}{2}$：$-1\\cdot 1+1\\cdot 0=-1$。",
        "D((1+cos(t))*sin(t), pi/2) == -1"
      ],
      [
        "$\\frac{dx}{d\\theta}=r'\\cos\\theta-r\\sin\\theta$；在 $\\frac{\\pi}{2}$：$-1\\cdot 0-1\\cdot 1=-1$。",
        "D((1+cos(t))*cos(t), pi/2) == -1"
      ],
      [
        "斜率 $=\\frac{-1}{-1}=1$。",
        "D((1+cos(t))*sin(t), pi/2) / D((1+cos(t))*cos(t), pi/2) == ANS"
      ]
    ],
    "trap": "拿 $\\frac{dr}{d\\theta}=-\\sin\\frac{\\pi}{2}=-1$ 當斜率；或忘了乘積律，只算 $\\frac{d}{d\\theta}(\\sin\\theta)$ 之類的片段。",
    "check": [
      "往前一點點 $\\theta=\\frac{\\pi}{2}+0.001$，點從 $(0,1)$ 移到大約 $(-0.001,0.999)$，兩個座標同時減少，斜率為正、約為 $1$。",
      "(SUB((1+cos(t))*sin(t), pi/2+0.001) - 1) / SUB((1+cos(t))*cos(t), pi/2+0.001) > 0.99"
    ]
  },
  "uni-int-004": {
    "spot": "$\\arctan x$ 乘上一個好積的 $\\frac{1}{x^2}$ —— 分部積分把 $\\arctan$ 微掉變成有理函數，剩下的再部分分式。",
    "why": "$\\arctan x$ 本身不好積但微分後是 $\\frac{1}{1+x^2}$；讓它當 $u$，整題就降成有理函數積分。",
    "steps": [
      [
        "取 $u=\\arctan x$、$dv=\\frac{dx}{x^2}$，則 $v=-\\frac{1}{x}$。",
        "D(-1/x) == 1/x^2"
      ],
      [
        "分部：$\\int\\frac{\\arctan x}{x^2}dx=-\\frac{\\arctan x}{x}+\\int\\frac{1}{x(1+x^2)}dx$。",
        "D(-arctan(x)/x) == arctan(x)/x^2 - 1/(x(1+x^2))"
      ],
      [
        "部分分式：$\\frac{1}{x(1+x^2)}=\\frac{1}{x}-\\frac{x}{1+x^2}$。",
        "1/(x(1+x^2)) == 1/x - x/(1+x^2)"
      ],
      [
        "逐項積分：$\\ln|x|-\\frac{1}{2}\\ln(1+x^2)$。",
        "D(ln(x) - ln(1+x^2)/2) == 1/(x(1+x^2))"
      ],
      [
        "合起來：$-\\frac{\\arctan x}{x}+\\ln|x|-\\frac{1}{2}\\ln(1+x^2)+C$。",
        "-arctan(x)/x + ln(x) - ln(1+x^2)/2 ~= ANS"
      ]
    ],
    "trap": "部分分式寫成 $\\frac{1}{x}-\\frac{1}{1+x^2}$，積出 $\\ln|x|-\\arctan x$；把右邊通分會得到 $\\frac{1+x^2-x}{x(1+x^2)}$，對不上。",
    "check": [
      "把答案微回去要得到被積函數。",
      "D(ANS) == arctan(x)/x^2"
    ]
  },
  "uni-int-007": {
    "spot": "$\\sec$ 的偶數次方 —— 留一個 $\\sec^2x$ 給 $d(\\tan x)$，其餘用 $\\sec^2x=1+\\tan^2x$ 換成 $\\tan$。",
    "why": "換成 $u=\\tan x$ 之後變成多項式 $1+u^2$，一行積完；用降冪公式反而要繞好幾圈。",
    "steps": [
      [
        "拆：$\\sec^4x=\\sec^2x\\cdot\\sec^2x=(1+\\tan^2x)\\sec^2x$。",
        "1/cos(x)^4 == (1+tan(x)^2)/cos(x)^2"
      ],
      [
        "令 $u=\\tan x$，$du=\\sec^2x\\,dx$。",
        "D(tan(x)) == 1/cos(x)^2"
      ],
      [
        "$\\int(1+u^2)\\,du=u+\\frac{u^3}{3}$。",
        "D(u + u^3/3) == 1 + u^2"
      ],
      [
        "換回：$\\tan x+\\frac{\\tan^3x}{3}+C$。",
        "tan(x) + tan(x)^3/3 ~= ANS"
      ]
    ],
    "trap": "把 $\\sec^4x$ 當成 $(\\sec^2x)^2$ 直接寫成 $\\frac{\\tan^2x}{2}$ 之類的「次方加一」，忘了 $\\tan$ 的導數才是 $\\sec^2$。",
    "check": [
      "微回去：$\\sec^2x+\\tan^2x\\sec^2x=\\sec^2x(1+\\tan^2x)=\\sec^4x$。",
      "D(ANS) == 1/cos(x)^4"
    ]
  },
  "uni-lim-007": {
    "spot": "分子 $\\sin 2x-2\\sin x$ 的一次項 $2x-2x$ 剛好抵消，分母是 $x^3$ —— 要看到三次項，泰勒展開到 $x^3$。",
    "why": "羅必達要微三次、每次都是兩項；泰勒展開一行就看到 $x^3$ 的係數。也可以用 $\\sin 2x=2\\sin x\\cos x$ 因式分解。",
    "steps": [
      [
        "$\\sin 2x=2x-\\frac{(2x)^3}{6}+\\cdots=2x-\\frac{4}{3}x^3+\\cdots$。",
        "LIM((sin(2x)-2x)/x^3, 0) == -4/3"
      ],
      [
        "$2\\sin x=2x-\\frac{1}{3}x^3+\\cdots$。",
        "LIM((2sin(x)-2x)/x^3, 0) == -1/3"
      ],
      [
        "相減：$-\\frac{4}{3}x^3+\\frac{1}{3}x^3=-x^3$，除以 $x^3$ 得 $-1$。",
        "-4/3 + 1/3 == ANS ;; LIM((sin(2x)-2sin(x))/x^3, 0) == ANS"
      ]
    ],
    "trap": "只展開到一次項，看到 $2x-2x=0$ 就說極限是 $0$；分母是 $x^3$，一定要展到三次。",
    "check": [
      "因式分解對一次：$\\sin 2x-2\\sin x=2\\sin x(\\cos x-1)\\approx 2x\\cdot\\left(-\\frac{x^2}{2}\\right)=-x^3$。",
      "sin(2x)-2sin(x) == 2sin(x)(cos(x)-1) ;; LIM(2sin(x)(cos(x)-1)/x^3, 0) == -1"
    ]
  },
  "uni-lim-010": {
    "spot": "$\\arctan x$ 和 $\\arcsin x$ 一次項都是 $x$，相減後抵消，分母 $x^3$ —— 比的是兩個的三次係數。",
    "why": "羅必達對反三角函數微三次很亂；兩個的馬克勞林級數背起來，一減就完。",
    "steps": [
      [
        "$\\arctan x=x-\\frac{x^3}{3}+\\cdots$。",
        "LIM((arctan(x)-x)/x^3, 0) == -1/3"
      ],
      [
        "$\\arcsin x=x+\\frac{x^3}{6}+\\cdots$。",
        "LIM((arcsin(x)-x)/x^3, 0) == 1/6"
      ],
      [
        "相減：$-\\frac{1}{3}-\\frac{1}{6}=-\\frac{1}{2}$。",
        "-1/3 - 1/6 == ANS ;; LIM((arctan(x)-arcsin(x))/x^3, 0) == ANS"
      ]
    ],
    "trap": "$\\arcsin x$ 的三次係數記成 $-\\frac{1}{6}$（跟 $\\sin x$ 搞混），得到 $-\\frac{1}{3}+\\frac{1}{6}=-\\frac{1}{6}$。反函數的係數符號跟原函數相反。",
    "check": [
      "$|x|<1$ 時 $\\arctan x<x<\\arcsin x$（$x>0$），所以分子是負的，極限為負合理；代 $x=0.01$ 比值約 $-0.5$。",
      "SUB((arctan(x)-arcsin(x))/x^3, 0.01) < -0.49 ;; SUB((arctan(x)-arcsin(x))/x^3, 0.01) > -0.51"
    ]
  },
  "vc-div-003": {
    "spot": "封閉曲面（正方體六個面）的通量 —— 散度定理：換成散度在立方體裡的體積分，六個面一個都不用算。",
    "why": "直接算要做六個面積分；散度 $x+y+z$ 在單位立方體上一次就積完。",
    "steps": [
      [
        "散度：$\\nabla\\cdot\\mathbf{F}=\\frac{\\partial(xy)}{\\partial x}+\\frac{\\partial(yz)}{\\partial y}+\\frac{\\partial(zx)}{\\partial z}=y+z+x$。",
        "D(x*y, , x) == y ;; D(y*z, , y) == z ;; D(z*x, , z) == x"
      ],
      [
        "散度定理：通量 $=\\iiint_{[0,1]^3}(x+y+z)\\,dV$。三項對稱，每一項都等於 $\\int_0^1 x\\,dx=\\frac{1}{2}$（另外兩個方向各積出 $1$）。",
        "INT(x, 0, 1) == 1/2"
      ],
      [
        "合計 $3\\cdot\\frac{1}{2}=\\frac{3}{2}$。",
        "3*INT(x, 0, 1) == ANS"
      ]
    ],
    "trap": "散度寫成 $\\frac{\\partial(xy)}{\\partial y}+\\cdots=x+y+z$ 碰巧同答案，但這是把偏微分方向弄錯；換成 $\\langle x^2y,\\dots\\rangle$ 就會錯。第 $i$ 個分量對第 $i$ 個變數微。",
    "check": [
      "直接算一對面：$x=1$ 面上 $\\mathbf{F}\\cdot\\mathbf{n}=y$，積分 $\\frac{1}{2}$；$x=0$ 面上 $\\mathbf{F}\\cdot(-\\mathbf{i})=0$。三對面各貢獻 $\\frac{1}{2}$，合計 $\\frac{3}{2}$。",
      "INT(y, 0, 1, y) * 3 == ANS"
    ]
  },
  "vc-div-004": {
    "spot": "穿出正方體 $[0,1]^3$ 的通量 —— 封閉曲面，用散度定理；散度 $2x+2y+2z$ 是線性的，立方體上的平均值一看就知道。",
    "why": "六個面逐一算要六次面積分；散度定理一次體積分，而且三項對稱只算一項。",
    "steps": [
      [
        "散度：$\\nabla\\cdot\\mathbf{F}=2x+2y+2z$。",
        "D(x^2, , x) == 2x ;; D(y^2, , y) == 2y ;; D(z^2, , z) == 2z"
      ],
      [
        "每一項：$\\iiint 2x\\,dV=\\int_0^1 2x\\,dx\\cdot 1\\cdot 1=1$。",
        "INT(2x, 0, 1) == 1"
      ],
      [
        "三項對稱，通量 $=3\\cdot 1=3$。",
        "3*INT(2x, 0, 1) == ANS"
      ]
    ],
    "trap": "以為 $\\mathbf{F}$ 的分量都非負、只算 $x=1,y=1,z=1$ 三個面卻把面積或法向量弄錯；其實 $x=0$ 等三面上 $\\mathbf{F}\\cdot\\mathbf{n}=0$，三個遠面各給 $1$，答案一樣是 $3$。",
    "check": [
      "直接算：$x=1$ 面上 $\\mathbf{F}\\cdot\\mathbf{i}=1$，面積 $1$；$x=0$ 面上 $x^2=0$。三對面各 $1$，共 $3$。",
      "SUB(x^2, 1) * 3 == ANS"
    ]
  },
  "world-018": {
    "spot": "$\\ln x$ 乘上一個好積的 $\\frac{1}{(1+x)^2}$ —— 分部積分把 $\\ln x$ 微掉；關鍵是反導數取 $\\frac{x}{1+x}$（不是 $-\\frac{1}{1+x}$），讓 $x=0$ 的邊界項消失。",
    "why": "取 $v=-\\frac{1}{1+x}$ 時邊界項 $-\\frac{\\ln x}{1+x}$ 在 $0$ 爆掉；加常數 $1$ 改成 $v=\\frac{x}{1+x}$，$v(0)=0$ 正好壓住 $\\ln x$。",
    "steps": [
      [
        "取 $u=\\ln x$、$v=\\frac{x}{1+x}=1-\\frac{1}{1+x}$，確實 $v'=\\frac{1}{(1+x)^2}$。",
        "D(x/(1+x)) == 1/(1+x)^2"
      ],
      [
        "邊界項 $\\left[\\frac{x\\ln x}{1+x}\\right]_0^1$：$x=1$ 時 $\\ln 1=0$，$x\\to 0^+$ 時 $x\\ln x\\to 0$。",
        "SUB(x*ln(x)/(1+x), 1) == 0 ;; SUB(x*ln(x)/(1+x), 0.00001) > -0.0002 ;; SUB(x*ln(x)/(1+x), 0.00001) < 0"
      ],
      [
        "剩下 $-\\int_0^1\\frac{1}{x}\\cdot\\frac{x}{1+x}dx=-\\int_0^1\\frac{dx}{1+x}$。",
        "(1/x)*x/(1+x) == 1/(1+x)"
      ],
      [
        "$=-\\ln 2$。",
        "-INT(1/(1+x), 0, 1) == ANS ;; INT(ln(x)/(1+x)^2, 0, 1) == ANS"
      ]
    ],
    "trap": "照課本取 $v=-\\frac{1}{1+x}$，邊界項在 $0$ 變成 $+\\infty$、剩下的積分 $\\int\\frac{dx}{x(1+x)}$ 也發散，寫成 $\\infty-\\infty$ 卡住。",
    "check": [
      "$(0,1)$ 上 $\\ln x<0$，被積函數全負，答案應為負；$-\\ln 2\\approx -0.693$。",
      "ANS < 0 ;; ANS > -1"
    ]
  },
  "world-036": {
    "spot": "$\\sec x=\\frac{1}{\\cos x}$ 是偶函數、問 $x^6$ 係數 —— 設 $\\sec x=1+a_2x^2+a_4x^4+a_6x^6+\\cdots$，乘上 $\\cos x$ 的級數要等於 $1$，逐次比係數。",
    "why": "直接微六次 $\\sec x$ 非常亂；用「$\\cos x\\cdot\\sec x=1$」比係數，每一步只解一個一次方程式。",
    "steps": [
      [
        "$\\cos x=1-\\frac{x^2}{2}+\\frac{x^4}{24}-\\frac{x^6}{720}+\\cdots$。",
        "LIM((cos(x)-1+x^2/2-x^4/24)/x^6, 0) == -1/720"
      ],
      [
        "$x^2$：$a_2-\\frac{1}{2}=0$，$a_2=\\frac{1}{2}$。",
        "LIM((1/cos(x)-1)/x^2, 0) == 1/2"
      ],
      [
        "$x^4$：$a_4-\\frac{a_2}{2}+\\frac{1}{24}=0$，$a_4=\\frac{1}{4}-\\frac{1}{24}=\\frac{5}{24}$。",
        "1/4 - 1/24 == 5/24 ;; LIM((1/cos(x)-1-x^2/2)/x^4, 0) == 5/24"
      ],
      [
        "$x^6$：$a_6-\\frac{a_4}{2}+\\frac{a_2}{24}-\\frac{1}{720}=0$，$a_6=\\frac{5}{48}-\\frac{1}{48}+\\frac{1}{720}=\\frac{61}{720}$。",
        "5/48 - 1/48 + 1/720 == ANS"
      ]
    ],
    "trap": "以為 $\\frac{1}{\\cos x}$ 的係數就是 $\\cos x$ 的係數取倒數或變號，寫 $\\frac{1}{720}$；漏掉交叉項 $-\\frac{a_4}{2}$、$\\frac{a_2}{24}$。",
    "check": [
      "數值對照：$x=0.3$ 時 $\\sec x-1-\\frac{x^2}{2}-\\frac{5x^4}{24}$ 除以 $x^6$ 應接近 $\\frac{61}{720}\\approx 0.0847$（還要再加一點 $x^8$ 項）。",
      "SUB((1/cos(x)-1-x^2/2-5x^4/24)/x^6, 0.3) > ANS ;; SUB((1/cos(x)-1-x^2/2-5x^4/24)/x^6, 0.3) < 0.09"
    ]
  },
  "world-041": {
    "spot": "分母是 $\\ln x$、分子是 $x^a-x^b$ 的形狀：$\\frac{x-1}{\\ln x}=\\int_0^1x^t\\,dt$ —— 把它寫成對參數的積分，換積分順序。",
    "why": "$\\frac{x-1}{\\ln x}$ 沒有初等反導數；化成雙重積分後，先對 $x$ 積是 $\\frac{1}{t+1}$，馬上出 $\\ln 2$。",
    "steps": [
      [
        "$\\int_0^1x^t\\,dt=\\left[\\frac{x^t}{\\ln x}\\right]_0^1=\\frac{x-1}{\\ln x}$。",
        "INT(x^t, 0, 1, t) == (x-1)/ln(x)"
      ],
      [
        "換順序：$\\int_0^1\\!\\int_0^1x^t\\,dx\\,dt$，內層 $\\int_0^1x^t\\,dx=\\frac{1}{t+1}$。",
        "INT(x^t, 0, 1) == 1/(t+1)"
      ],
      [
        "$\\int_0^1\\frac{dt}{t+1}=\\ln 2$。",
        "INT(1/(t+1), 0, 1, t) == ANS ;; INT((x-1)/ln(x), 0, 1) == ANS"
      ]
    ],
    "trap": "看到分母 $\\ln x$ 在 $x=1$ 是 $0$ 就以為瑕積分發散；其實 $\\frac{x-1}{\\ln x}\\to 1$，被積函數在 $[0,1]$ 上有界。",
    "check": [
      "被積函數在 $0$ 是 $0$、在 $1$ 是 $1$，而且遞增，所以積分在 $0$ 和 $1$ 之間；$\\ln 2\\approx 0.693$。",
      "LIM((x-1)/ln(x), 1) == 1 ;; ANS < 1"
    ]
  },
  "world-048": {
    "spot": "$\\frac{(2n-1)!!}{(2n)!!}$ 是 $(1-x^2)^{-1/2}$ 的二項式係數，後面的 $\\frac{1}{2n+1}$ 是積分 $x^{2n}$ 留下的 —— 這是 $\\arcsin x$ 的級數在 $x=1$。",
    "why": "雙階乘用比值法、比較法只能判斷收斂；認出 $\\arcsin$ 的級數才能直接給值。",
    "steps": [
      [
        "二項式級數：$(1-x^2)^{-1/2}=\\sum_{n\\ge 0}\\frac{(2n-1)!!}{(2n)!!}x^{2n}$；例如 $x^2$ 的係數是 $\\frac{1}{2}$。",
        "D2(1/sqrt(1-x^2), 0) / 2 == 1/2"
      ],
      [
        "逐項積分從 $0$ 到 $x$：$\\arcsin x=\\sum\\frac{(2n-1)!!}{(2n)!!}\\cdot\\frac{x^{2n+1}}{2n+1}$。",
        "D(arcsin(x), 0.5) == 1/sqrt(1-0.25)"
      ],
      [
        "題目的級數就是 $x=1$ 時的值；係數都是正的，可以讓 $x\\to 1^-$（阿貝爾定理），得 $\\int_0^1\\frac{dx}{\\sqrt{1-x^2}}=\\arcsin 1$。",
        "LIM(arcsin(x), 1-) == pi/2"
      ],
      [
        "所以和為 $\\frac{\\pi}{2}$。",
        "INT(1/sqrt(1-x^2), 0, 1) == ANS"
      ]
    ],
    "trap": "以為 $x=1$ 落在收斂半徑邊界上級數就發散；其實項的大小約 $\\frac{1}{\\sqrt{\\pi n}}\\cdot\\frac{1}{2n}$，是 $n^{-3/2}$ 級，收斂。",
    "check": [
      "前四項 $1+\\frac{1}{6}+\\frac{3}{40}+\\frac{5}{112}\\approx 1.286$，比 $\\frac{\\pi}{2}\\approx 1.571$ 小，剩下的尾巴慢慢補上。",
      "1 + 1/6 + 3/40 + 5/112 < ANS"
    ]
  },
  "world-059": {
    "spot": "分母 $1+x^3$ 是立方和，可以分解成 $(1+x)(x^2-x+1)$ —— 部分分式，二次那一塊再拆成「分子是分母導數」加「配方成 $\\arctan$」。",
    "why": "有理函數的標準路線；二次因式沒有實根，一定落到 $\\ln$ 加 $\\arctan$。",
    "steps": [
      [
        "部分分式：$\\frac{1}{1+x^3}=\\frac{1/3}{1+x}+\\frac{-\\frac{1}{3}x+\\frac{2}{3}}{x^2-x+1}$。",
        "1/(1+x^3) == (1/3)/(1+x) + (-x/3+2/3)/(x^2-x+1)"
      ],
      [
        "第一塊：$\\frac{1}{3}\\int_0^1\\frac{dx}{1+x}=\\frac{1}{3}\\ln 2$。",
        "INT((1/3)/(1+x), 0, 1) == ln(2)/3"
      ],
      [
        "分子拆成 $-\\frac{1}{6}(2x-1)+\\frac{1}{2}$；前者積出 $-\\frac{1}{6}\\ln(x^2-x+1)$，在 $0$ 和 $1$ 都是 $\\ln 1=0$。",
        "-x/3 + 2/3 == -(2x-1)/6 + 1/2 ;; INT((2x-1)/(x^2-x+1), 0, 1) == 0"
      ],
      [
        "後者配方 $x^2-x+1=\\left(x-\\frac{1}{2}\\right)^2+\\frac{3}{4}$：$\\frac{1}{2}\\cdot\\frac{2}{\\sqrt3}\\left[\\arctan\\frac{2x-1}{\\sqrt3}\\right]_0^1=\\frac{1}{\\sqrt3}\\left(\\frac{\\pi}{6}+\\frac{\\pi}{6}\\right)=\\frac{\\pi}{3\\sqrt3}$。",
        "INT((1/2)/(x^2-x+1), 0, 1) == pi/(3*sqrt(3))"
      ],
      [
        "合計 $\\frac{\\ln 2}{3}+\\frac{\\pi}{3\\sqrt3}$。",
        "ln(2)/3 + pi/(3*sqrt(3)) == ANS ;; INT(1/(1+x^3), 0, 1) == ANS"
      ]
    ],
    "trap": "二次因式那一塊直接寫成 $\\ln(x^2-x+1)$ 的倍數，漏掉 $\\arctan$ 的部分 —— 分子不是分母導數的倍數，一定有剩。",
    "check": [
      "被積函數在 $[0,1]$ 從 $1$ 降到 $\\frac{1}{2}$，積分應在 $0.5$ 和 $1$ 之間；答案約 $0.836$。",
      "ANS > 0.5 ;; ANS < 1"
    ]
  },
  "world-061": {
    "spot": "$\\frac{\\ln(1-x)}{x}$：把 $\\ln(1-x)$ 展成冪級數，除以 $x$ 後每一項都好積，積完變成 $\\sum\\frac{1}{n^2}$。",
    "why": "這個積分沒有初等反導數（是雙對數函數）；級數逐項積分直接接到巴塞爾問題。",
    "steps": [
      [
        "$\\ln(1-x)=-\\sum_{n\\ge 1}\\frac{x^n}{n}$，所以 $\\frac{\\ln(1-x)}{x}=-\\sum\\frac{x^{n-1}}{n}$。",
        "LIM((ln(1-x)+x)/x^2, 0) == -1/2"
      ],
      [
        "逐項積：$\\int_0^1\\frac{x^{n-1}}{n}dx=\\frac{1}{n^2}$。",
        "INT(x^(n-1)/n, 0, 1) == 1/n^2"
      ],
      [
        "所以積分 $=-\\sum\\frac{1}{n^2}=-\\frac{\\pi^2}{6}$。",
        "SUM(1/n^2, 1) == pi^2/6"
      ],
      [
        "答案 $-\\frac{\\pi^2}{6}$。",
        "-pi^2/6 == ANS ;; INT(ln(1-x)/x, 0, 1) == ANS"
      ]
    ],
    "trap": "看到 $x\\to 1$ 時 $\\ln(1-x)\\to-\\infty$ 就判定發散；對數奇點可積，積分有限。",
    "check": [
      "$(0,1)$ 上 $\\ln(1-x)<0$，答案為負；而且 $\\ln(1-x)\\le -x$，所以積分 $\\le-1$。",
      "ANS < -1"
    ]
  },
  "world-064": {
    "spot": "分母是 $\\ln x$、分子是 $x^3-1$：$\\frac{x^3-1}{\\ln x}=\\int_0^3x^t\\,dt$ —— 參數積分換順序。",
    "why": "被積函數沒有初等反導數；寫成雙重積分後先對 $x$ 積得 $\\frac{1}{t+1}$，一行就完。",
    "steps": [
      [
        "$\\int_0^3x^t\\,dt=\\frac{x^3-1}{\\ln x}$。",
        "INT(x^t, 0, 3, t) == (x^3-1)/ln(x)"
      ],
      [
        "換順序，內層 $\\int_0^1x^t\\,dx=\\frac{1}{t+1}$。",
        "INT(x^t, 0, 1) == 1/(t+1)"
      ],
      [
        "$\\int_0^3\\frac{dt}{t+1}=\\ln 4$。",
        "INT(1/(t+1), 0, 3, t) == ANS ;; INT((x^3-1)/ln(x), 0, 1) == ANS"
      ]
    ],
    "trap": "參數區間取成 $[1,3]$（以為分子是 $x^3-x$），得到 $\\ln 2$。分子的 $1=x^0$，下限是 $0$。",
    "check": [
      "被積函數在 $x\\to 1$ 趨近 $3$、在 $0$ 是 $0$，積分應在 $0$ 和 $3$ 之間；$\\ln 4\\approx 1.386$。",
      "LIM((x^3-1)/ln(x), 1) == 3 ;; ANS < 3"
    ]
  },
  "world-068": {
    "spot": "變數同時在底數和指數 —— 先寫成 $e^{x\\ln(1+x)}$，指數部分從 $x^2$ 開始，所以 $e^u$ 只需要展到 $\\frac{u^2}{2}$。",
    "why": "直接微四次 $(1+x)^x$ 是對數微分的惡夢；指數形式的「級數套級數」只要追兩層。",
    "steps": [
      [
        "$(1+x)^x=e^{u}$，$u=x\\ln(1+x)=x^2-\\frac{x^3}{2}+\\frac{x^4}{3}-\\cdots$。",
        "LIM((x*ln(1+x)-x^2)/x^3, 0) == -1/2 ;; LIM((x*ln(1+x)-x^2+x^3/2)/x^4, 0) == 1/3"
      ],
      [
        "$e^u=1+u+\\frac{u^2}{2}+\\cdots$；$u^2=x^4+\\cdots$，$u^3$ 從 $x^6$ 開始，不影響 $x^4$。",
        "LIM((x*ln(1+x))^2/x^4, 0) == 1"
      ],
      [
        "$x^4$ 的係數：從 $u$ 來 $\\frac{1}{3}$，從 $\\frac{u^2}{2}$ 來 $\\frac{1}{2}$，合計 $\\frac{5}{6}$。",
        "1/3 + 1/2 == ANS"
      ],
      [
        "對照：$(1+x)^x=1+x^2-\\frac{x^3}{2}+\\frac{5}{6}x^4+\\cdots$。",
        "LIM(((1+x)^x - 1 - x^2 + x^3/2)/x^4, 0) == ANS"
      ]
    ],
    "trap": "只取 $e^u\\approx 1+u$，答 $\\frac{1}{3}$；漏掉 $\\frac{u^2}{2}$ 貢獻的 $\\frac{1}{2}x^4$。",
    "check": [
      "數值：$x=0.01$ 時 $\\frac{(1+x)^x-1-x^2+x^3/2}{x^4}$ 接近 $0.83$。",
      "SUB(((1+x)^x - 1 - x^2 + x^3/2)/x^4, 0.01) > 0.8 ;; SUB(((1+x)^x - 1 - x^2 + x^3/2)/x^4, 0.01) < 0.85"
    ]
  },
  "world-077": {
    "spot": "$\\arctan x$ 配 $\\frac{1}{1+x}$：分部積分把兩者對調成 $\\frac{\\ln(1+x)}{1+x^2}$ —— 這是令 $x=\\tan\\theta$ 後用 $\\theta\\to\\frac{\\pi}{4}-\\theta$ 對稱能解的經典積分。",
    "why": "原式直接換 $\\tan$ 不會變漂亮；分部之後才出現 $\\ln(1+\\tan\\theta)$，而它有 $(1+\\tan\\theta)(1+\\tan(\\frac{\\pi}{4}-\\theta))=2$ 這個恆等式。",
    "steps": [
      [
        "分部：$\\int_0^1\\frac{\\arctan x}{1+x}dx=\\left[\\arctan x\\ln(1+x)\\right]_0^1-\\int_0^1\\frac{\\ln(1+x)}{1+x^2}dx=\\frac{\\pi}{4}\\ln 2-J$。",
        "D(arctan(x)*ln(1+x)) == ln(1+x)/(1+x^2) + arctan(x)/(1+x)"
      ],
      [
        "令 $x=\\tan\\theta$：$J=\\int_0^{\\pi/4}\\ln(1+\\tan\\theta)\\,d\\theta$。",
        "INT(ln(1+x)/(1+x^2), 0, 1) == INT(ln(1+tan(t)), 0, pi/4, t)"
      ],
      [
        "關鍵恆等式：$1+\\tan\\left(\\frac{\\pi}{4}-\\theta\\right)=\\frac{2}{1+\\tan\\theta}$。",
        "SUB((1+tan(pi/4-t))*(1+tan(t)), 0.3) == 2 ;; SUB((1+tan(pi/4-t))*(1+tan(t)), 0.6) == 2"
      ],
      [
        "所以 $\\theta\\to\\frac{\\pi}{4}-\\theta$ 給 $J=\\frac{\\pi}{4}\\ln 2-J$，$J=\\frac{\\pi}{8}\\ln 2$。",
        "INT(ln(1+tan(t)), 0, pi/4, t) == pi*ln(2)/8"
      ],
      [
        "原積分 $=\\frac{\\pi}{4}\\ln 2-\\frac{\\pi}{8}\\ln 2=\\frac{\\pi\\ln 2}{8}$。",
        "pi*ln(2)/4 - pi*ln(2)/8 == ANS ;; INT(arctan(x)/(1+x), 0, 1) == ANS"
      ]
    ],
    "trap": "邊界項算成 $0$（忘了 $\\arctan 1\\ln 2=\\frac{\\pi}{4}\\ln 2$），得到 $-\\frac{\\pi\\ln 2}{8}$ —— 被積函數全正，答案不可能是負的。",
    "check": [
      "原式和 $J$ 恰好相等，都等於 $\\frac{\\pi\\ln 2}{8}\\approx 0.272$。",
      "INT(ln(1+x)/(1+x^2), 0, 1) == ANS"
    ]
  },
  "world-082": {
    "spot": "整個 $\\arcsin x$ 被平方、區間 $[0,1]$ —— 令 $x=\\sin\\theta$，變成 $\\int_0^{\\pi/2}\\theta^2\\cos\\theta\\,d\\theta$，多項式乘三角，分部兩次。",
    "why": "直接分部要處理 $\\frac{x\\arcsin x}{\\sqrt{1-x^2}}$；先換成 $\\theta$ 就是最標準的表格法。",
    "steps": [
      [
        "令 $x=\\sin\\theta$，$dx=\\cos\\theta\\,d\\theta$：原式 $=\\int_0^{\\pi/2}\\theta^2\\cos\\theta\\,d\\theta$。",
        "INT(arcsin(x)^2, 0, 1) == INT(t^2*cos(t), 0, pi/2, t)"
      ],
      [
        "表格法：反導數 $\\theta^2\\sin\\theta+2\\theta\\cos\\theta-2\\sin\\theta$。",
        "D(t^2*sin(t) + 2t*cos(t) - 2sin(t)) == t^2*cos(t)"
      ],
      [
        "代上下限：$\\theta=\\frac{\\pi}{2}$ 給 $\\frac{\\pi^2}{4}-2$，$\\theta=0$ 給 $0$。",
        "SUB(t^2*sin(t) + 2t*cos(t) - 2sin(t), pi/2) == pi^2/4 - 2 ;; SUB(t^2*sin(t) + 2t*cos(t) - 2sin(t), 0) == 0"
      ],
      [
        "答案 $\\frac{\\pi^2}{4}-2$。",
        "pi^2/4 - 2 == ANS"
      ]
    ],
    "trap": "第二次分部的正負號弄錯，寫成 $\\frac{\\pi^2}{4}+2$；被積函數最大才 $\\frac{\\pi^2}{4}\\approx 2.47$，積分不可能超過它。",
    "check": [
      "在 $[0,1]$ 上 $x^2\\le(\\arcsin x)^2\\le\\frac{\\pi^2}{4}$，所以答案介於 $\\frac{1}{3}$ 和 $\\frac{\\pi^2}{4}$ 之間；$\\frac{\\pi^2}{4}-2\\approx 0.467$。",
      "ANS > 1/3 ;; ANS < pi^2/4"
    ]
  },
  "burst-boss-int-008": {
    "spot": "$\\int_0^\\infty$ 的有理函數、分母 $1+x^4$ —— 用 $x\\to\\frac{1}{x}$ 讓 $\\frac{x^2}{1+x^4}$ 和 $\\frac{1}{1+x^4}$ 等值，平均後湊成 $\\frac{1+1/x^2}{(x-1/x)^2+2}$。",
    "why": "硬拆 $1+x^4=(x^2+\\sqrt2x+1)(x^2-\\sqrt2x+1)$ 的部分分式又長又容易錯；倒數代換加 $u=x-\\frac{1}{x}$ 一步變成 $\\arctan$。",
    "steps": [
      [
        "$x\\to\\frac{1}{x}$：$\\int_0^\\infty\\frac{x^2}{1+x^4}dx=\\int_0^\\infty\\frac{dx}{1+x^4}$，所以 $I=\\frac{1}{2}\\int_0^\\infty\\frac{1+x^2}{1+x^4}dx$。",
        "INT(x^2/(1+x^4), 0, inf) == INT(1/(1+x^4), 0, inf)"
      ],
      [
        "上下除以 $x^2$：$\\frac{1+x^2}{1+x^4}=\\frac{1+1/x^2}{x^2+1/x^2}$，而 $x^2+\\frac{1}{x^2}=\\left(x-\\frac{1}{x}\\right)^2+2$。",
        "(1+1/x^2)/((x-1/x)^2+2) == (1+x^2)/(1+x^4)"
      ],
      [
        "令 $u=x-\\frac{1}{x}$，$du=\\left(1+\\frac{1}{x^2}\\right)dx$，$x:0\\to\\infty$ 對應 $u:-\\infty\\to\\infty$：$\\int_{-\\infty}^\\infty\\frac{du}{u^2+2}=\\frac{\\pi}{\\sqrt2}$。",
        "D(x - 1/x) == 1 + 1/x^2 ;; 2*INT(1/(u^2+2), 0, inf, u) == pi/sqrt(2)"
      ],
      [
        "$I=\\frac{1}{2}\\cdot\\frac{\\pi}{\\sqrt2}=\\frac{\\pi}{2\\sqrt2}$。",
        "(1/2)*pi/sqrt(2) == ANS ;; INT(x^2/(1+x^4), 0, inf) == ANS"
      ]
    ],
    "trap": "$u=x-\\frac{1}{x}$ 的範圍只寫 $0\\to\\infty$，少算一半，得到 $\\frac{\\pi}{4\\sqrt2}$。$x\\to 0^+$ 時 $u\\to-\\infty$。",
    "check": [
      "跟公式 $\\int_0^\\infty\\frac{x^{s-1}}{1+x^n}dx=\\frac{\\pi}{n\\sin(\\pi s/n)}$ 對照：$n=4$、$s=3$ 得 $\\frac{\\pi}{4\\sin(3\\pi/4)}=\\frac{\\pi}{2\\sqrt2}$。",
      "pi/(4*sin(3*pi/4)) == ANS"
    ]
  },
  "burst-boss-int-011": {
    "spot": "$\\int_0^1(\\ln x)^n\\,dx$ —— 令 $x=e^{-t}$ 就變成 $\\int_0^\\infty t^ne^{-t}dt$ 的伽瑪函數（$n$ 偶數時正負號抵消），答案是 $n!$。",
    "why": "直接分部四次也行，但換成伽瑪函數一眼就看出 $4!=24$。",
    "steps": [
      [
        "令 $x=e^{-t}$，$\\ln x=-t$、$dx=-e^{-t}dt$：$\\int_0^1(\\ln x)^4dx=\\int_0^\\infty t^4e^{-t}dt$。",
        "INT(ln(x)^4, 0, 1) == INT(t^4*e^(-t), 0, inf, t)"
      ],
      [
        "分部遞迴：$\\int_0^\\infty t^ne^{-t}dt=n\\int_0^\\infty t^{n-1}e^{-t}dt$。",
        "INT(t^4*e^(-t), 0, inf, t) == 4*INT(t^3*e^(-t), 0, inf, t)"
      ],
      [
        "一路降到 $\\int_0^\\infty e^{-t}dt=1$：$4\\cdot 3\\cdot 2\\cdot 1=24$。",
        "INT(e^(-t), 0, inf, t) == 1 ;; 4*3*2*1 == ANS"
      ]
    ],
    "trap": "以為 $(\\ln x)^4$ 在 $0$ 附近爆掉積分就發散；對數的任意次方都比 $x^{-1}$ 溫和，可積。另一個錯是代換後正負號弄反，偶數次方剛好不影響、奇數次方就會錯。",
    "check": [
      "換成奇數次方對照：$\\int_0^1(\\ln x)^3dx=-6$，符號跟 $(-t)^3$ 一致。",
      "INT(ln(x)^3, 0, 1) == -6"
    ]
  },
  "burst-boss-int-017": {
    "spot": "$\\sin$ 和 $\\cos$ 同次方 —— $\\sin x\\cos x=\\frac{\\sin 2x}{2}$，整個變成 $\\frac{\\sin^82x}{256}$，再用沃利斯公式。",
    "why": "兩個八次方直接用貝塔函數要算 $\\Gamma(\\frac{9}{2})^2$；先倍角合併，就只剩一個熟悉的 $\\int\\sin^8$。",
    "steps": [
      [
        "倍角：$\\sin^8x\\cos^8x=\\left(\\frac{\\sin 2x}{2}\\right)^8=\\frac{\\sin^82x}{256}$。",
        "sin(x)^8*cos(x)^8 == sin(2x)^8/256"
      ],
      [
        "令 $u=2x$：$\\int_0^{\\pi/2}\\sin^82x\\,dx=\\frac{1}{2}\\int_0^\\pi\\sin^8u\\,du=\\int_0^{\\pi/2}\\sin^8u\\,du$（對稱）。",
        "INT(sin(2x)^8, 0, pi/2) == INT(sin(u)^8, 0, pi/2, u)"
      ],
      [
        "沃利斯：$\\int_0^{\\pi/2}\\sin^8u\\,du=\\frac{7\\cdot 5\\cdot 3\\cdot 1}{8\\cdot 6\\cdot 4\\cdot 2}\\cdot\\frac{\\pi}{2}=\\frac{35\\pi}{256}$。",
        "INT(sin(u)^8, 0, pi/2, u) == (7*5*3*1)/(8*6*4*2)*pi/2 ;; (7*5*3*1)/(8*6*4*2)*pi/2 == 35*pi/256"
      ],
      [
        "除以 $256$：$\\frac{35\\pi}{65536}$。",
        "35*pi/256/256 == ANS ;; INT(sin(x)^8*cos(x)^8, 0, pi/2) == ANS"
      ]
    ],
    "trap": "換 $u=2x$ 時上限改成 $\\pi$ 卻忘了 $\\frac{1}{2}$，或者乘了 $\\frac{1}{2}$ 又只積到 $\\frac{\\pi}{2}$，答案差一倍。",
    "check": [
      "$\\sin^8x\\cos^8x\\le\\frac{1}{256}$，積分不超過 $\\frac{\\pi}{512}\\approx 0.0061$；答案約 $0.00168$。",
      "ANS < pi/512 ;; ANS > 0"
    ]
  },
  "burst-int-002": {
    "spot": "$x^2$ 乘 $e^{-x}\\sin x$ 積到 $\\infty$ —— 已知 $\\int_0^\\infty e^{-tx}\\sin x\\,dx=\\frac{1}{1+t^2}$，對 $t$ 微兩次就拉下 $x^2$。",
    "why": "分部積分要做四、五次而且兩個循環；對參數微分只要微一個有理函數兩次。",
    "steps": [
      [
        "基本式：$F(t)=\\int_0^\\infty e^{-tx}\\sin x\\,dx=\\frac{1}{1+t^2}$（$t>0$）。",
        "INT(e^(-t*x)*sin(x), 0, inf) == 1/(1+t^2)"
      ],
      [
        "$\\frac{\\partial^2}{\\partial t^2}e^{-tx}=x^2e^{-tx}$，所以 $\\int_0^\\infty x^2e^{-tx}\\sin x\\,dx=F''(t)$。",
        "D2(e^(-x*t), , t) == x^2*e^(-x*t)"
      ],
      [
        "$F''(t)=\\frac{6t^2-2}{(1+t^2)^3}$。",
        "D2(1/(1+t^2)) == (6t^2-2)/(1+t^2)^3"
      ],
      [
        "代 $t=1$：$\\frac{6-2}{8}=\\frac{1}{2}$。",
        "SUB((6t^2-2)/(1+t^2)^3, 1) == ANS ;; INT(x^2*e^(-x)*sin(x), 0, inf) == ANS"
      ]
    ],
    "trap": "以為對 $t$ 微一次拉下 $x$、會有負號，微兩次就忘了 $(-x)^2$ 已經是正的，答 $-\\frac{1}{2}$。",
    "check": [
      "被積函數在 $(0,\\pi)$ 為正、之後被 $e^{-x}$ 壓得很小，答案應為正且不大。",
      "ANS > 0 ;; INT(x^2*e^(-x)*sin(x), 0, pi) > ANS"
    ]
  },
  "burst-int-003": {
    "spot": "$x^2e^{-2x}\\cos x$ 積到 $\\infty$ —— 從 $\\int_0^\\infty e^{-tx}\\cos x\\,dx=\\frac{t}{t^2+1}$ 出發，對 $t$ 微兩次拉下 $x^2$，再代 $t=2$。",
    "why": "表格法加循環分部很長；參數微分只要微一個有理函數兩次。",
    "steps": [
      [
        "基本式：$G(t)=\\int_0^\\infty e^{-tx}\\cos x\\,dx=\\frac{t}{t^2+1}$。",
        "INT(e^(-t*x)*cos(x), 0, inf) == t/(t^2+1)"
      ],
      [
        "微兩次：$\\int_0^\\infty x^2e^{-tx}\\cos x\\,dx=G''(t)=\\frac{2t^3-6t}{(t^2+1)^3}$。",
        "D2(t/(t^2+1)) == (2t^3-6t)/(t^2+1)^3"
      ],
      [
        "代 $t=2$：$\\frac{16-12}{125}=\\frac{4}{125}$。",
        "SUB((2t^3-6t)/(t^2+1)^3, 2) == ANS ;; INT(x^2*e^(-2x)*cos(x), 0, inf) == ANS"
      ]
    ],
    "trap": "代成 $t=1$（忘了指數是 $e^{-2x}$），得 $G''(1)=-\\frac{1}{2}$。",
    "check": [
      "粗估：拿掉 $\\cos x$ 時 $\\int_0^\\infty x^2e^{-2x}dx=\\frac{2}{8}=\\frac{1}{4}$；乘上會振盪的 $\\cos x$ 只會更小。",
      "INT(x^2*e^(-2x), 0, inf) == 1/4 ;; ANS < 1/4"
    ]
  },
  "burst-int-029": {
    "spot": "$\\sqrt x$ 在分子 —— 令 $x=u^2$ 把根號消掉，變成 $2\\int_0^\\infty\\frac{u^2}{1+u^4}du$，正是倒數代換能解的那一型。",
    "why": "換掉根號後是熟悉的 $\\frac{u^2}{1+u^4}$；直接處理 $x^{1/2}$ 只能靠貝塔函數。",
    "steps": [
      [
        "令 $x=u^2$，$dx=2u\\,du$：$\\int_0^\\infty\\frac{\\sqrt x}{1+x^2}dx=\\int_0^\\infty\\frac{2u^2}{1+u^4}du$。",
        "INT(sqrt(x)/(1+x^2), 0, inf) == 2*INT(u^2/(1+u^4), 0, inf, u)"
      ],
      [
        "$u\\to\\frac{1}{u}$ 讓 $\\frac{u^2}{1+u^4}$ 和 $\\frac{1}{1+u^4}$ 積分相等，平均成 $\\frac{1}{2}\\int\\frac{1+1/u^2}{(u-1/u)^2+2}du$。",
        "(1+1/u^2)/((u-1/u)^2+2) == (1+u^2)/(1+u^4)"
      ],
      [
        "令 $w=u-\\frac{1}{u}$ 跑遍整條實數線：$\\int_0^\\infty\\frac{u^2}{1+u^4}du=\\frac{1}{2}\\cdot\\frac{\\pi}{\\sqrt2}=\\frac{\\pi}{2\\sqrt2}$。",
        "INT(u^2/(1+u^4), 0, inf, u) == pi/(2*sqrt(2))"
      ],
      [
        "乘 $2$：$\\frac{\\pi}{\\sqrt2}$。",
        "2*pi/(2*sqrt(2)) == ANS"
      ]
    ],
    "trap": "代換時忘了 $dx=2u\\,du$ 的 $2$，答 $\\frac{\\pi}{2\\sqrt2}$。",
    "check": [
      "公式對照：$\\int_0^\\infty\\frac{x^{s-1}}{1+x^2}dx=\\frac{\\pi}{2\\sin(\\pi s/2)}$，$s=\\frac{3}{2}$ 得 $\\frac{\\pi}{2\\sin(3\\pi/4)}=\\frac{\\pi}{\\sqrt2}$。",
      "pi/(2*sin(3*pi/4)) == ANS"
    ]
  },
  "cx-hi-008": {
    "spot": "同一個函數 $e^{-tx}$ 在 $t=1$ 和 $t=2$ 的差、再除以 $x$：Frullani 型。$\\frac{e^{-x}-e^{-2x}}{x}=\\int_1^2e^{-tx}\\,dt$，換順序就好積。",
    "why": "兩項分開積都在 $0$ 發散；寫成參數積分後內層是 $\\frac{1}{t}$，直接出 $\\ln 2$。",
    "steps": [
      [
        "$\\int_1^2e^{-tx}dt=\\frac{e^{-x}-e^{-2x}}{x}$。",
        "INT(e^(-t*x), 1, 2, t) == (e^(-x)-e^(-2x))/x"
      ],
      [
        "換順序，內層 $\\int_0^\\infty e^{-tx}dx=\\frac{1}{t}$。",
        "INT(e^(-t*x), 0, inf) == 1/t"
      ],
      [
        "$\\int_1^2\\frac{dt}{t}=\\ln 2$。",
        "INT(1/t, 1, 2, t) == ANS ;; INT((e^(-x)-e^(-2x))/x, 0, inf) == ANS"
      ]
    ],
    "trap": "公式記反答 $\\ln\\frac{1}{2}<0$。$e^{-x}>e^{-2x}$，被積函數恆正，答案一定是正的。",
    "check": [
      "被積函數在 $0$ 附近趨近 $1$（$e^{-x}-e^{-2x}\\approx x$），之後指數衰減，面積不到 $1$ 合理。",
      "LIM((e^(-x)-e^(-2x))/x, 0) == 1 ;; ANS < 1"
    ]
  },
  "db-rr-008": {
    "spot": "面積固定 $xy=100$，問另一邊的變化率 —— 對時間隱微分：$x'y+xy'=0$。",
    "why": "先解出 $y=\\frac{100}{x}$ 再微也行，但隱微分一行就拿到 $y'=-\\frac{yx'}{x}$。",
    "steps": [
      [
        "長 $x=20$ 時，寬 $y=\\frac{100}{20}=5$。",
        "SUB(100/x, 20) == 5"
      ],
      [
        "$xy=100$ 對 $t$ 微：$x'y+xy'=0$，所以 $y'=-\\frac{y\\,x'}{x}$。",
        "D(100/x, 20) == -5/20"
      ],
      [
        "代 $x'=2$：$y'=-\\frac{5\\cdot 2}{20}=-\\frac{1}{2}$。",
        "-5*2/20 == ANS ;; D(100/x, 20)*2 == ANS"
      ]
    ],
    "trap": "以為長增加多少、寬就減少多少，答 $-2$；面積固定的是乘積，不是和。",
    "check": [
      "一秒後長約 $22$，寬 $\\frac{100}{22}\\approx 4.545$，減少約 $0.45$，跟每秒 $-0.5$ 的瞬時率吻合（率會越來越小）。",
      "SUB(100/x, 22) - 5 > -0.5 ;; SUB(100/x, 22) - 5 < -0.4"
    ]
  },
  "gx-041": {
    "spot": "極座標圍成的面積 —— $A=\\frac{1}{2}\\int r^2\\,d\\theta$；心臟線繞一圈是 $\\theta$ 從 $0$ 到 $2\\pi$。",
    "why": "化成直角座標方程式是四次曲線，沒法積；極座標面積公式加上 $\\cos^2$ 降冪就結束。",
    "steps": [
      [
        "$r^2=(1+\\cos\\theta)^2=1+2\\cos\\theta+\\cos^2\\theta=\\frac{3}{2}+2\\cos\\theta+\\frac{\\cos 2\\theta}{2}$。",
        "(1+cos(t))^2 == 3/2 + 2cos(t) + cos(2t)/2"
      ],
      [
        "積一整圈，$\\cos\\theta$ 和 $\\cos 2\\theta$ 都積成 $0$，只剩 $\\frac{3}{2}\\cdot 2\\pi=3\\pi$。",
        "INT((1+cos(t))^2, 0, 2*pi, t) == 3*pi"
      ],
      [
        "乘 $\\frac{1}{2}$：$A=\\frac{3\\pi}{2}$。",
        "INT((1+cos(t))^2, 0, 2*pi, t)/2 == ANS"
      ]
    ],
    "trap": "忘了公式裡的 $\\frac{1}{2}$，答 $3\\pi$；或把 $\\cos^2\\theta$ 的平均當成 $1$，答 $2\\pi$。",
    "check": [
      "心臟線最遠點離原點 $2$，整個圖形在半徑 $2$ 的圓內但又比半徑 $1$ 的圓大：$\\pi<\\frac{3\\pi}{2}<4\\pi$。",
      "ANS > pi ;; ANS < 4*pi"
    ]
  },
  "gx-042": {
    "spot": "一片花瓣 —— 找 $r=0$ 的兩個相鄰角度當積分範圍：$\\cos 2\\theta=0$ 在 $\\theta=\\pm\\frac{\\pi}{4}$，中間就是一片。",
    "why": "極座標面積公式 $\\frac{1}{2}\\int r^2d\\theta$；範圍抓對比什麼都重要，抓成 $0$ 到 $2\\pi$ 會變成四片。",
    "steps": [
      [
        "$r=\\cos 2\\theta$ 在 $\\theta=\\pm\\frac{\\pi}{4}$ 歸零，$\\theta=0$ 時 $r=1$ 是花瓣尖端。",
        "SUB(cos(2t), pi/4) == 0 ;; SUB(cos(2t), 0) == 1"
      ],
      [
        "降冪：$\\cos^22\\theta=\\frac{1+\\cos 4\\theta}{2}$，在 $[-\\frac{\\pi}{4},\\frac{\\pi}{4}]$ 上積得 $\\frac{\\pi}{4}$。",
        "INT(cos(2t)^2, -pi/4, pi/4, t) == pi/4"
      ],
      [
        "乘 $\\frac{1}{2}$：一片花瓣面積 $\\frac{\\pi}{8}$。",
        "INT(cos(2t)^2, -pi/4, pi/4, t)/2 == ANS"
      ]
    ],
    "trap": "以為「四葉」所以把 $0$ 到 $2\\pi$ 的總面積 $\\frac{\\pi}{2}$ 除以四卻用錯公式；或範圍取 $0$ 到 $\\frac{\\pi}{4}$，只算半片得 $\\frac{\\pi}{16}$。",
    "check": [
      "四片花瓣合計：$\\frac{1}{2}\\int_0^{2\\pi}\\cos^22\\theta\\,d\\theta=\\frac{\\pi}{2}=4\\cdot\\frac{\\pi}{8}$。",
      "INT(cos(2t)^2, 0, 2*pi, t)/2 == 4*ANS"
    ]
  },
  "gx-060": {
    "spot": "$y=\\ln x$ 在 $[1,e]$ 上非負，面積就是 $\\int_1^e\\ln x\\,dx$；$\\ln x$ 的反導數靠分部：$x\\ln x-x$。",
    "why": "把 $\\ln x$ 看成 $1\\cdot\\ln x$，讓 $\\ln x$ 被微掉；也可以對 $y$ 積：$\\int_0^1(e-e^y)dy$。",
    "steps": [
      [
        "$\\ln x\\ge 0$ 在 $[1,e]$ 上，面積 $=\\int_1^e\\ln x\\,dx$。",
        "SUB(ln(x), 1) == 0 ;; SUB(ln(x), e) == 1"
      ],
      [
        "分部：$\\int\\ln x\\,dx=x\\ln x-x$。",
        "D(x*ln(x) - x) == ln(x)"
      ],
      [
        "代上下限：$(e-e)-(0-1)=1$。",
        "SUB(x*ln(x)-x, e) - SUB(x*ln(x)-x, 1) == ANS"
      ]
    ],
    "trap": "反導數寫成 $\\frac{1}{x}$（把積分當微分），得 $\\frac{1}{e}-1<0$。",
    "check": [
      "換成對 $y$ 積：區域是 $0\\le y\\le 1$、$e^y\\le x\\le e$，面積 $\\int_0^1(e-e^y)dy=e-(e-1)=1$。",
      "INT(e - e^y, 0, 1, y) == ANS"
    ]
  },
  "hc-rad-008": {
    "spot": "分母 $1+x^6$、積到 $\\infty$ —— $1+x^6=(1+x^2)(x^4-x^2+1)$，拆開後 $\\frac{1}{x^4-x^2+1}$ 那塊用倒數代換配 $u=x-\\frac{1}{x}$。",
    "why": "也可以直接套 $\\int_0^\\infty\\frac{dx}{1+x^n}=\\frac{\\pi}{n\\sin(\\pi/n)}$；不記公式時，拆一次因式加倒數代換就能全程初等。",
    "steps": [
      [
        "部分分式：$\\frac{1}{1+x^6}=\\frac{1}{3}\\left(\\frac{1}{1+x^2}+\\frac{2-x^2}{x^4-x^2+1}\\right)$。",
        "1/(1+x^6) == (1/(1+x^2) + (2-x^2)/(x^4-x^2+1))/3"
      ],
      [
        "$x\\to\\frac{1}{x}$：$\\int_0^\\infty\\frac{x^2}{x^4-x^2+1}dx=\\int_0^\\infty\\frac{dx}{x^4-x^2+1}$，所以第二塊 $=\\int_0^\\infty\\frac{dx}{x^4-x^2+1}=\\frac{1}{2}\\int_0^\\infty\\frac{1+x^2}{x^4-x^2+1}dx$。",
        "INT(x^2/(x^4-x^2+1), 0, inf) == INT(1/(x^4-x^2+1), 0, inf)"
      ],
      [
        "上下除以 $x^2$：分母 $=\\left(x-\\frac{1}{x}\\right)^2+1$；令 $u=x-\\frac{1}{x}$ 跑遍實數線，$\\frac{1}{2}\\int_{-\\infty}^\\infty\\frac{du}{u^2+1}=\\frac{\\pi}{2}$。",
        "(x-1/x)^2 + 1 == (x^4-x^2+1)/x^2 ;; INT(1/(x^4-x^2+1), 0, inf) == pi/2"
      ],
      [
        "第一塊 $\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$。合計 $\\frac{1}{3}\\left(\\frac{\\pi}{2}+\\frac{\\pi}{2}\\right)=\\frac{\\pi}{3}$。",
        "(pi/2 + pi/2)/3 == ANS ;; INT(1/(1+x^6), 0, inf) == ANS"
      ]
    ],
    "trap": "以為 $\\int_0^\\infty\\frac{dx}{1+x^n}$ 都等於 $\\frac{\\pi}{2}$（只有 $n=2$ 才是）；$n$ 越大曲線越像寬度 $1$ 的方塊，值趨近 $1$。",
    "check": [
      "公式：$\\frac{\\pi}{6\\sin(\\pi/6)}=\\frac{\\pi}{3}\\approx 1.047$，比 $1$ 稍大，符合「$n$ 大時趨近 $1$」。",
      "pi/(6*sin(pi/6)) == ANS ;; ANS > 1"
    ]
  },
  "int-066": {
    "spot": "同一個 $e^{-tx}$ 在 $t=1$ 和 $t=4$ 的差除以 $x$：Frullani 型，寫成 $\\int_1^4e^{-tx}dt$ 換順序。",
    "why": "分開積兩項都在 $0$ 發散；參數積分化成 $\\int_1^4\\frac{dt}{t}$，一行搞定。",
    "steps": [
      [
        "$\\int_1^4e^{-tx}dt=\\frac{e^{-x}-e^{-4x}}{x}$。",
        "INT(e^(-t*x), 1, 4, t) == (e^(-x)-e^(-4x))/x"
      ],
      [
        "內層 $\\int_0^\\infty e^{-tx}dx=\\frac{1}{t}$。",
        "INT(e^(-t*x), 0, inf) == 1/t"
      ],
      [
        "$\\int_1^4\\frac{dt}{t}=\\ln 4$。",
        "INT(1/t, 1, 4, t) == ANS ;; INT((e^(-x)-e^(-4x))/x, 0, inf) == ANS"
      ]
    ],
    "trap": "公式 $\\ln\\frac{b}{a}$ 的 $a,b$ 對調，答 $-\\ln 4$；$e^{-x}>e^{-4x}$，被積函數為正，答案一定正。",
    "check": [
      "被積函數在 $0$ 附近趨近 $4-1=3$。",
      "LIM((e^(-x)-e^(-4x))/x, 0) == 3 ;; ANS > 0"
    ]
  },
  "int-072": {
    "spot": "兩個正弦相乘再除以 $x$：積化和差變成 $\\frac{\\cos 4x-\\cos 8x}{2x}$，是 Frullani 型。",
    "why": "單獨的 $\\int\\frac{\\cos ax}{x}$ 在 $0$ 發散，一定要兩項綁在一起；Frullani 公式直接給 $\\ln\\frac{8}{4}$。",
    "steps": [
      [
        "積化和差：$\\sin 2x\\sin 6x=\\frac{\\cos 4x-\\cos 8x}{2}$。",
        "sin(2x)sin(6x) == (cos(4x)-cos(8x))/2"
      ],
      [
        "Frullani：$\\int_\\varepsilon^\\infty\\frac{\\cos 4x-\\cos 8x}{x}dx=\\int_{4\\varepsilon}^{8\\varepsilon}\\frac{\\cos u}{u}du\\to\\ln\\frac{8}{4}=\\ln 2$。",
        "LIM(INT(cos(u)/u, 4x, 8x, u), 0+) == ln(2)"
      ],
      [
        "乘回 $\\frac{1}{2}$：$\\frac{\\ln 2}{2}$。",
        "ln(2)/2 == ANS ;; INT(sin(2x)sin(6x)/x, 0, inf) == ANS"
      ]
    ],
    "trap": "忘了積化和差的 $\\frac{1}{2}$，答 $\\ln 2$；或用 $\\ln\\frac{6}{2}$ 直接拿原本的頻率，得 $\\ln 3$。",
    "check": [
      "被積函數在 $0$ 附近 $\\approx 12x$、正的那一塊主導，答案為正。",
      "LIM(sin(2x)sin(6x)/x^2, 0) == 12 ;; ANS > 0"
    ]
  },
  "int-074": {
    "spot": "$\\arctan(ax)$ 在兩個尺度的差除以 $x$：Frullani 型，$f(0)=0$、$f(\\infty)=\\frac{\\pi}{2}$。",
    "why": "寫成 $\\int_2^5\\frac{dt}{1+t^2x^2}$ 換順序，內層是 $\\frac{\\pi}{2t}$；比分部積分乾淨。",
    "steps": [
      [
        "$\\frac{\\partial}{\\partial t}\\arctan(tx)=\\frac{x}{1+t^2x^2}$，所以 $\\frac{\\arctan 5x-\\arctan 2x}{x}=\\int_2^5\\frac{dt}{1+t^2x^2}$。",
        "INT(1/(1+t^2*x^2), 2, 5, t) == (arctan(5x)-arctan(2x))/x"
      ],
      [
        "換順序，內層 $\\int_0^\\infty\\frac{dx}{1+t^2x^2}=\\frac{\\pi}{2t}$。",
        "INT(1/(1+t^2*x^2), 0, inf) == pi/(2t)"
      ],
      [
        "$\\int_2^5\\frac{\\pi}{2t}dt=\\frac{\\pi}{2}\\ln\\frac{5}{2}$。",
        "INT(pi/(2t), 2, 5, t) == ANS ;; INT((arctan(5x)-arctan(2x))/x, 0, inf) == ANS"
      ]
    ],
    "trap": "套 Frullani 時把 $f(0)-f(\\infty)$ 當成 $1$，漏了 $\\frac{\\pi}{2}$，答 $\\ln\\frac{5}{2}$。",
    "check": [
      "被積函數在 $0$ 附近趨近 $5-2=3$，恆正。",
      "LIM((arctan(5x)-arctan(2x))/x, 0) == 3 ;; ANS > 0"
    ]
  },
  "rel-boss-002": {
    "spot": "$e^{-tx}$ 在 $t=2$ 和 $t=5$ 的差除以 $x$：Frullani 型，寫成 $\\int_2^5e^{-tx}dt$。",
    "why": "兩項分開都在 $0$ 發散；換順序後只剩 $\\int_2^5\\frac{dt}{t}$。",
    "steps": [
      [
        "$\\int_2^5e^{-tx}dt=\\frac{e^{-2x}-e^{-5x}}{x}$。",
        "INT(e^(-t*x), 2, 5, t) == (e^(-2x)-e^(-5x))/x"
      ],
      [
        "內層 $\\int_0^\\infty e^{-tx}dx=\\frac{1}{t}$。",
        "INT(e^(-t*x), 0, inf) == 1/t"
      ],
      [
        "$\\int_2^5\\frac{dt}{t}=\\ln\\frac{5}{2}$。",
        "INT(1/t, 2, 5, t) == ANS ;; INT((e^(-2x)-e^(-5x))/x, 0, inf) == ANS"
      ]
    ],
    "trap": "答 $\\ln\\frac{2}{5}$（公式記反）或 $\\ln 3$（以為是差）。被積函數恆正，答案要正；結果只看比值 $\\frac{5}{2}$。",
    "check": [
      "被積函數在 $0$ 趨近 $5-2=3$，恆正。",
      "LIM((e^(-2x)-e^(-5x))/x, 0) == 3 ;; ANS > 0"
    ]
  },
  "rel-boss-008": {
    "spot": "$\\frac{\\sin z}{z^5}$ 的留數是 $\\sin z$ 展開中 $z^4$ 的係數 —— 但 $\\sin z$ 是奇函數，只有奇次方，$z^4$ 的係數是 $0$。",
    "why": "五階極點用公式要微四次再取極限；看奇偶性一秒就知道答案。",
    "steps": [
      [
        "$\\frac{\\sin z}{z^5}$ 的 $\\frac{1}{z}$ 項來自 $\\sin z$ 的 $z^4$ 項。",
        "SUB(sin(x), 0) == 0"
      ],
      [
        "$\\sin z$ 是奇函數，只含奇次方：$\\sin z=z-\\frac{z^3}{6}+\\frac{z^5}{120}-\\cdots$；三次之後下一項直接是 $z^5$。",
        "sin(-x) == -sin(x) ;; LIM((sin(x)-x+x^3/6)/x^5, 0) == 1/120"
      ],
      [
        "等價地：$z^4$ 的係數是 $\\frac{\\sin^{(4)}(0)}{4!}$，而 $\\sin^{(4)}=\\sin$，在 $0$ 是 $0$。",
        "D2(sin(x)) == -sin(x) ;; SUB(sin(x), 0) == ANS"
      ],
      [
        "留數 $=0$。",
        "0 == ANS"
      ]
    ],
    "trap": "看到 $\\frac{z^5}{120}$ 就拿 $\\frac{1}{120}$ 當留數 —— 那是 $\\frac{\\sin z}{z^6}$ 的留數；除以 $z^5$ 後 $\\frac{z^5}{120}$ 變成常數項。",
    "check": [
      "$\\frac{\\sin z}{z^5}$ 是偶函數，偶函數的羅朗級數沒有奇次方，自然沒有 $z^{-1}$ 項。",
      "SUB(sin(x)/x^5, -0.7) == SUB(sin(x)/x^5, 0.7)"
    ]
  },
  "rel-hard-cpx-003": {
    "spot": "分母 $z^4$、分子是 $e^z$ 扣掉前兩項 —— 留數就是 $e^z$ 展開中 $z^3$ 的係數 $\\frac{1}{3!}$。",
    "why": "表面上看起來像四階極點，但分子從 $z^2$ 開始，其實是二階；不管幾階，讀級數係數都最快。",
    "steps": [
      [
        "$e^z-1-z=\\frac{z^2}{2}+\\frac{z^3}{6}+\\frac{z^4}{24}+\\cdots$。",
        "LIM((e^x-1-x)/x^2, 0) == 1/2"
      ],
      [
        "除以 $z^4$：$\\frac{1}{2z^2}+\\frac{1}{6z}+\\frac{1}{24}+\\cdots$，$\\frac{1}{z}$ 的係數是 $\\frac{1}{6}$。",
        "LIM((e^x-1-x-x^2/2)/x^3, 0) == ANS"
      ],
      [
        "留數 $=\\frac{1}{6}$。",
        "1/6 == ANS"
      ]
    ],
    "trap": "當成四階極點拿 $z^4$ 的係數 $\\frac{1}{24}$，或拿 $z^2$ 的係數 $\\frac{1}{2}$。$\\frac{1}{z}$ 對應的是分子的 $z^{4-1}=z^3$。",
    "check": [
      "用二階極點公式：$\\frac{d}{dz}\\left[z^2f(z)\\right]=\\frac{d}{dz}\\frac{e^z-1-z}{z^2}$ 在 $z\\to 0$ 的極限應是 $\\frac{1}{6}$。",
      "LIM(D((e^x-1-x)/x^2), 0) == ANS"
    ]
  },
  "rel-hard-cpx-004": {
    "spot": "$\\frac{\\ln(1+z)}{z^3}$ 的 $\\frac{1}{z}$ 項來自 $\\ln(1+z)$ 的 $z^2$ 項 —— 直接讀級數係數 $-\\frac{1}{2}$。",
    "why": "$\\ln(1+z)$ 從 $z$ 開始，極點其實是二階；讀係數比公式快。",
    "steps": [
      [
        "$\\ln(1+z)=z-\\frac{z^2}{2}+\\frac{z^3}{3}-\\cdots$。",
        "LIM(ln(1+x)/x, 0) == 1"
      ],
      [
        "除以 $z^3$：$\\frac{1}{z^2}-\\frac{1}{2z}+\\frac{1}{3}-\\cdots$，$\\frac{1}{z}$ 的係數是 $-\\frac{1}{2}$。",
        "LIM((ln(1+x)-x)/x^2, 0) == ANS"
      ],
      [
        "留數 $=-\\frac{1}{2}$。",
        "-1/2 == ANS"
      ]
    ],
    "trap": "拿 $z^3$ 的係數 $\\frac{1}{3}$（以為三階極點就看三次項）；分母 $z^3$ 要的是分子的 $z^2$ 項。",
    "check": [
      "二階極點公式：$\\lim_{z\\to 0}\\frac{d}{dz}\\frac{\\ln(1+z)}{z}=-\\frac{1}{2}$。",
      "LIM(D(ln(1+x)/x), 0) == ANS"
    ]
  },
  "rel-hard-cpx-009": {
    "spot": "$\\frac{e^{2z}-1}{z^3}$ 的 $\\frac{1}{z}$ 項來自 $e^{2z}$ 的 $z^2$ 項 $\\frac{(2z)^2}{2}=2z^2$。",
    "why": "讀級數係數一步完成；用二階極點公式要微分商，反而麻煩。",
    "steps": [
      [
        "$e^{2z}-1=2z+\\frac{(2z)^2}{2!}+\\frac{(2z)^3}{3!}+\\cdots=2z+2z^2+\\frac{4}{3}z^3+\\cdots$。",
        "LIM((e^(2x)-1)/x, 0) == 2"
      ],
      [
        "除以 $z^3$：$\\frac{2}{z^2}+\\frac{2}{z}+\\frac{4}{3}+\\cdots$，$\\frac{1}{z}$ 的係數是 $2$。",
        "LIM((e^(2x)-1-2x)/x^2, 0) == ANS"
      ],
      [
        "留數 $=2$。",
        "2 == ANS"
      ]
    ],
    "trap": "忘了 $(2z)^2$ 的 $2^2$，寫成 $\\frac{1}{2}$。",
    "check": [
      "二階極點公式：$\\lim_{z\\to 0}\\frac{d}{dz}\\frac{e^{2z}-1}{z}=2$。",
      "LIM(D((e^(2x)-1)/x), 0) == ANS"
    ]
  },
  "rel-hard-int-008": {
    "spot": "$e^{-tx}$ 在 $t=3$ 和 $t=11$ 的差除以 $x$：Frullani 型，寫成 $\\int_3^{11}e^{-tx}dt$。",
    "why": "分開積兩項都發散；換順序後只剩 $\\int_3^{11}\\frac{dt}{t}$。",
    "steps": [
      [
        "$\\int_3^{11}e^{-tx}dt=\\frac{e^{-3x}-e^{-11x}}{x}$。",
        "INT(e^(-t*x), 3, 11, t) == (e^(-3x)-e^(-11x))/x"
      ],
      [
        "內層 $\\int_0^\\infty e^{-tx}dx=\\frac{1}{t}$。",
        "INT(e^(-t*x), 0, inf) == 1/t"
      ],
      [
        "$\\int_3^{11}\\frac{dt}{t}=\\ln\\frac{11}{3}$。",
        "INT(1/t, 3, 11, t) == ANS ;; INT((e^(-3x)-e^(-11x))/x, 0, inf) == ANS"
      ]
    ],
    "trap": "答 $\\ln\\frac{3}{11}$（公式記反）。衰減得慢的 $e^{-3x}$ 比較大，被積函數恆正，答案要正。",
    "check": [
      "被積函數在 $0$ 趨近 $11-3=8$，恆正；$\\ln\\frac{11}{3}\\approx 1.30$。",
      "LIM((e^(-3x)-e^(-11x))/x, 0) == 8 ;; ANS > 0"
    ]
  },
  "world-023": {
    "spot": "$\\frac{1}{n^2(n+1)^2}=\\left(\\frac{1}{n}-\\frac{1}{n+1}\\right)^2$ —— 平方展開成兩個 $\\frac{1}{n^2}$ 型的和，加上一個會伸縮的交叉項。",
    "why": "直接部分分式要解四個係數；看成「差的平方」，三塊都是已知的和（兩個巴塞爾、一個伸縮）。",
    "steps": [
      [
        "$\\frac{1}{n(n+1)}=\\frac{1}{n}-\\frac{1}{n+1}$，平方：$\\frac{1}{n^2(n+1)^2}=\\frac{1}{n^2}+\\frac{1}{(n+1)^2}-\\frac{2}{n(n+1)}$。",
        "1/(n^2(n+1)^2) == 1/n^2 + 1/(n+1)^2 - 2/(n(n+1))"
      ],
      [
        "$\\sum_{n\\ge 1}\\frac{1}{n^2}=\\frac{\\pi^2}{6}$，$\\sum_{n\\ge 1}\\frac{1}{(n+1)^2}=\\frac{\\pi^2}{6}-1$。",
        "SUM(1/n^2, 1) == pi^2/6 ;; SUM(1/(n+1)^2, 1) == pi^2/6 - 1"
      ],
      [
        "伸縮：$\\sum\\frac{1}{n(n+1)}=1$。",
        "SUM(1/(n(n+1)), 1) == 1"
      ],
      [
        "合計：$\\frac{\\pi^2}{6}+\\frac{\\pi^2}{6}-1-2=\\frac{\\pi^2}{3}-3$。",
        "pi^2/3 - 3 == ANS ;; SUM(1/(n^2(n+1)^2), 1) == ANS"
      ]
    ],
    "trap": "第二個和也寫成 $\\frac{\\pi^2}{6}$，漏掉 $n+1$ 從 $2$ 開始少了一個 $1$，得到 $\\frac{\\pi^2}{3}-2$。",
    "check": [
      "第一項就是 $\\frac{1}{4}$，後面很小：答案約 $0.2899$，略大於 $\\frac{1}{4}$。",
      "ANS > 1/4 ;; ANS < 1/4 + 1/36 + 1/144 + 0.01"
    ]
  },
  "world-029": {
    "spot": "$\\int_0^\\infty\\ln x\\cdot(\\cdots)$ —— $x\\to\\frac{1}{x}$ 讓 $\\ln x$ 變號；把兩種寫法平均，出現 $\\frac{1-x^2}{(1+x^2)^2}=\\left(\\frac{x}{1+x^2}\\right)'$，可以分部積分。",
    "why": "參數微分要先算 $\\int\\frac{x^s}{(1+x^2)^2}$；倒數代換加分部完全初等。",
    "steps": [
      [
        "$x\\to\\frac{1}{x}$：$I=\\int_0^\\infty\\frac{-\\ln x\\cdot x^2}{(1+x^2)^2}dx$；跟原式平均得 $I=\\frac{1}{2}\\int_0^\\infty\\ln x\\cdot\\frac{1-x^2}{(1+x^2)^2}dx$。",
        "INT(ln(x)/(1+x^2)^2, 0, inf) == -INT(ln(x)*x^2/(1+x^2)^2, 0, inf)"
      ],
      [
        "$\\frac{1-x^2}{(1+x^2)^2}$ 正是 $\\frac{x}{1+x^2}$ 的導數。",
        "D(x/(1+x^2)) == (1-x^2)/(1+x^2)^2"
      ],
      [
        "分部：邊界項 $\\frac{x\\ln x}{1+x^2}$ 在 $0^+$ 和 $\\infty$ 都是 $0$。",
        "LIM(x*ln(x)/(1+x^2), 0+) == 0 ;; LIM(x*ln(x)/(1+x^2), inf) == 0"
      ],
      [
        "剩下 $-\\frac{1}{2}\\int_0^\\infty\\frac{1}{x}\\cdot\\frac{x}{1+x^2}dx=-\\frac{1}{2}\\cdot\\frac{\\pi}{2}=-\\frac{\\pi}{4}$。",
        "-INT(1/(1+x^2), 0, inf)/2 == ANS ;; INT(ln(x)/(1+x^2)^2, 0, inf) == ANS"
      ]
    ],
    "trap": "記得 $\\int_0^\\infty\\frac{\\ln x}{1+x^2}dx=0$，就以為平方之後也是 $0$；平方破壞了 $x\\to\\frac{1}{x}$ 的對稱，$(0,1)$ 那段的負值占上風。",
    "check": [
      "權重 $\\frac{1}{(1+x^2)^2}$ 在 $(0,1)$ 大、在 $(1,\\infty)$ 小，而 $\\ln x$ 在 $(0,1)$ 是負的 —— 答案為負合理。",
      "ANS < 0 ;; INT(ln(x)/(1+x^2)^2, 0, 1) < ANS"
    ]
  },
  "world-033": {
    "spot": "分子 $\\cos x-\\cos 3x$ 在 $0$ 附近是 $4x^2$，剛好壓住分母 $x^2$ —— 分部積分一次把 $\\frac{1}{x^2}$ 降成 $\\frac{1}{x}$，變成兩個狄利克雷積分 $\\int_0^\\infty\\frac{\\sin ax}{x}dx=\\frac{\\pi}{2}$。",
    "why": "$\\frac{1}{x^2}$ 的積分沒有現成公式；降一次冪就落到最熟的 $\\frac{\\pi}{2}$。",
    "steps": [
      [
        "取 $u=\\cos x-\\cos 3x$、$dv=\\frac{dx}{x^2}$，$v=-\\frac{1}{x}$。邊界項 $-\\frac{\\cos x-\\cos 3x}{x}$：在 $0$ 附近 $\\approx-4x\\to 0$，在 $\\infty$ 也趨近 $0$。",
        "LIM((cos(x)-cos(3x))/x^2, 0) == 4 ;; SUB((cos(x)-cos(3x))/x, 10000) < 0.001"
      ],
      [
        "剩下 $\\int_0^\\infty\\frac{u'}{x}dx$，$u'=-\\sin x+3\\sin 3x$。",
        "D(cos(x)-cos(3x)) == -sin(x)+3sin(3x)"
      ],
      [
        "狄利克雷：$\\int_0^\\infty\\frac{\\sin ax}{x}dx=\\frac{\\pi}{2}$（$a>0$），跟 $a$ 無關。",
        "INT(sin(x)/x, 0, inf) == pi/2 ;; INT(sin(3x)/x, 0, inf) == pi/2"
      ],
      [
        "所以 $I=-\\frac{\\pi}{2}+3\\cdot\\frac{\\pi}{2}=\\pi$。",
        "-pi/2 + 3*pi/2 == ANS ;; INT((cos(x)-cos(3x))/x^2, 0, inf) == ANS"
      ]
    ],
    "trap": "把 $\\int_0^\\infty\\frac{\\sin 3x}{x}dx$ 算成 $\\frac{3\\pi}{2}$（以為跟 $a$ 成正比），得到 $-\\frac{\\pi}{2}+\\frac{9\\pi}{2}=4\\pi$。$\\frac{\\sin ax}{x}$ 的積分跟 $a$ 無關，係數 $3$ 來自 $u'$。",
    "check": [
      "一般公式 $\\int_0^\\infty\\frac{\\cos ax-\\cos bx}{x^2}dx=\\frac{\\pi(b-a)}{2}$：$a=1$、$b=3$ 給 $\\pi$。",
      "pi*(3-1)/2 == ANS"
    ]
  },
  "world-038": {
    "spot": "$\\frac{\\sin^3x}{x^3}$：分子在 $0$ 附近是 $x^3$，可以分部兩次把 $\\frac{1}{x^3}$ 降成 $\\frac{1}{x}$；$\\sin^3x$ 先化成 $\\frac{3\\sin x-\\sin 3x}{4}$，二階導數一樣是正弦的組合。",
    "why": "降冪後全是 $\\int\\frac{\\sin ax}{x}=\\frac{\\pi}{2}$；不分部的話 $\\frac{1}{x^3}$ 沒有公式可套。",
    "steps": [
      [
        "三倍角：$\\sin^3x=\\frac{3\\sin x-\\sin 3x}{4}$。",
        "sin(x)^3 == (3sin(x)-sin(3x))/4"
      ],
      [
        "設 $f=\\sin^3x$。$f(x)/x^2$、$f'(x)/x$ 在 $0$ 和 $\\infty$ 都趨近 $0$，分部兩次：$\\int_0^\\infty\\frac{f}{x^3}dx=\\frac{1}{2}\\int_0^\\infty\\frac{f''}{x}dx$。",
        "LIM(sin(x)^3/x^3, 0) == 1"
      ],
      [
        "$f''=\\frac{-3\\sin x+9\\sin 3x}{4}$。",
        "D2(sin(x)^3) == (-3sin(x)+9sin(3x))/4"
      ],
      [
        "每個 $\\int_0^\\infty\\frac{\\sin ax}{x}dx=\\frac{\\pi}{2}$：$\\frac{1}{2}\\cdot\\frac{-3+9}{4}\\cdot\\frac{\\pi}{2}=\\frac{3\\pi}{8}$。",
        "INT(sin(3x)/x, 0, inf) == pi/2 ;; (1/2)*((-3+9)/4)*pi/2 == ANS"
      ],
      [
        "答案 $\\frac{3\\pi}{8}$。",
        "INT(sin(x)^3/x^3, 0, inf) == ANS"
      ]
    ],
    "trap": "以為 $\\int\\frac{\\sin^3x}{x^3}$ 跟 $\\int\\frac{\\sin x}{x}$ 一樣是 $\\frac{\\pi}{2}$；或分部時漏了 $\\frac{1}{2}$（$\\frac{1}{x^3}$ 積兩次給 $\\frac{1}{2x}$），答 $\\frac{3\\pi}{4}$。",
    "check": [
      "$\\left|\\frac{\\sin^3x}{x^3}\\right|$ 在 $[0,\\pi]$ 之外很小；答案 $\\approx 1.178$ 比 $\\int_0^\\infty\\frac{\\sin^2x}{x^2}=\\frac{\\pi}{2}$ 小，符合次方越高越窄。",
      "ANS < pi/2 ;; ANS > 1"
    ]
  },
  "world-043": {
    "spot": "$\\ln x$ 乘 $\\frac{1}{1+x^6}$ 積到 $\\infty$ —— $\\ln x=\\frac{\\partial}{\\partial s}x^s\\big|_{s=0}$，而 $\\int_0^\\infty\\frac{x^s}{1+x^6}dx=\\frac{\\pi}{6\\sin\\frac{\\pi(s+1)}{6}}$ 有公式，對 $s$ 微一次。",
    "why": "對 $\\ln x$ 沒有好用的反導數；把它當成「對指數微分」，就從已知的貝塔型公式微出來。",
    "steps": [
      [
        "對指數微分會拉下 $\\ln x$：$\\frac{\\partial}{\\partial s}x^s=x^s\\ln x$。",
        "D(x^t, , t) == x^t*ln(x)"
      ],
      [
        "公式：$I(s)=\\int_0^\\infty\\frac{x^s}{1+x^6}dx=\\frac{\\pi}{6\\sin\\frac{\\pi(s+1)}{6}}$（$-1<s<5$）；$s=0$ 時是 $\\frac{\\pi}{3}$。",
        "INT(x^t/(1+x^6), 0, inf) == pi/(6*sin(pi*(t+1)/6)) ;; SUB(pi/(6*sin(pi*(t+1)/6)), 0) == pi/3"
      ],
      [
        "$I'(s)=-\\frac{\\pi^2}{36}\\cdot\\frac{\\cos\\frac{\\pi(s+1)}{6}}{\\sin^2\\frac{\\pi(s+1)}{6}}$；代 $s=0$：$-\\frac{\\pi^2}{36}\\cdot\\frac{\\sqrt3/2}{1/4}=-\\frac{\\pi^2\\sqrt3}{18}$。",
        "D(pi/(6*sin(pi*(t+1)/6)), 0) == -pi^2*sqrt(3)/18"
      ],
      [
        "$-\\frac{\\pi^2\\sqrt3}{18}=-\\frac{\\pi^2}{6\\sqrt3}$。",
        "-pi^2*sqrt(3)/18 == ANS ;; INT(ln(x)/(1+x^6), 0, inf) == ANS"
      ]
    ],
    "trap": "以為跟 $\\int_0^\\infty\\frac{\\ln x}{1+x^2}dx=0$ 一樣靠 $x\\to\\frac{1}{x}$ 對稱得 $0$；那個對稱只對 $1+x^2$ 成立，$1+x^6$ 換過去會多出 $x^4$。",
    "check": [
      "$(0,1)$ 上 $\\ln x<0$ 而權重 $\\frac{1}{1+x^6}\\approx 1$，$(1,\\infty)$ 的權重衰減很快，答案應為負。",
      "ANS < 0 ;; INT(ln(x)/(1+x^6), 0, 1) < ANS"
    ]
  },
  "world-044": {
    "spot": "$x\\cot x$：$\\cot x$ 正好是 $\\ln\\sin x$ 的導數 —— 分部積分把 $x$ 微掉，留下經典的 $\\int_0^{\\pi/2}\\ln\\sin x\\,dx=-\\frac{\\pi}{2}\\ln 2$。",
    "why": "$x\\cot x$ 沒有初等反導數；分部之後交給一個背得起來的定積分。",
    "steps": [
      [
        "$u=x$、$dv=\\cot x\\,dx$，$v=\\ln\\sin x$：$\\int_0^{\\pi/2}x\\cot x\\,dx=\\left[x\\ln\\sin x\\right]_0^{\\pi/2}-\\int_0^{\\pi/2}\\ln\\sin x\\,dx$。",
        "D(x*ln(sin(x))) == ln(sin(x)) + x*cos(x)/sin(x)"
      ],
      [
        "邊界項：$\\frac{\\pi}{2}\\ln 1=0$，$x\\to 0^+$ 時 $x\\ln\\sin x\\approx x\\ln x\\to 0$。",
        "SUB(x*ln(sin(x)), pi/2) == 0 ;; LIM(x*ln(sin(x)), 0+) == 0"
      ],
      [
        "$J=\\int_0^{\\pi/2}\\ln\\sin x\\,dx$：用 $\\sin x=2\\sin\\frac{x}{2}\\cos\\frac{x}{2}$ 與對稱 $\\int\\ln\\sin=\\int\\ln\\cos$，得 $J=\\frac{\\pi}{2}\\ln 2+2J$，$J=-\\frac{\\pi}{2}\\ln 2$。",
        "INT(ln(sin(2x)), 0, pi/2) == INT(ln(sin(x)), 0, pi/2) ;; INT(ln(sin(x)), 0, pi/2) == -pi*ln(2)/2"
      ],
      [
        "所以原式 $=0-J=\\frac{\\pi\\ln 2}{2}$。",
        "pi*ln(2)/2 == ANS ;; INT(x*cos(x)/sin(x), 0, pi/2) == ANS"
      ]
    ],
    "trap": "看到 $\\cot x$ 在 $0$ 爆掉就說發散；$x\\cot x\\to 1$，被積函數有界。",
    "check": [
      "$x\\cot x$ 在 $[0,\\frac{\\pi}{2}]$ 從 $1$ 遞減到 $0$，積分應在 $0$ 和 $\\frac{\\pi}{2}$ 之間；答案約 $1.089$。",
      "LIM(x*cos(x)/sin(x), 0) == 1 ;; ANS < pi/2"
    ]
  },
  "world-047": {
    "spot": "$\\frac{\\sin^4x}{x^4}$：分子在 $0$ 附近是 $x^4$，可以分部三次把 $\\frac{1}{x^4}$ 降成 $\\frac{1}{x}$；三階導數是 $\\sin 2x$、$\\sin 4x$ 的組合，全部變成狄利克雷積分。",
    "why": "降冪三次後每一項都是 $\\frac{\\pi}{2}$；硬算 $\\frac{1}{x^4}$ 沒有公式可套。",
    "steps": [
      [
        "降冪：$\\sin^4x=\\frac{3-4\\cos 2x+\\cos 4x}{8}$。",
        "sin(x)^4 == (3-4cos(2x)+cos(4x))/8"
      ],
      [
        "設 $f=\\sin^4x$，$f,f',f''$ 在 $0$ 分別是 $x^4,4x^3,12x^2$ 級，邊界項都消失；分部三次：$\\int_0^\\infty\\frac{f}{x^4}dx=\\frac{1}{6}\\int_0^\\infty\\frac{f'''}{x}dx$。",
        "LIM(sin(x)^4/x^4, 0) == 1"
      ],
      [
        "$f'=4\\sin^3x\\cos x$，$f'''=-4\\sin 2x+8\\sin 4x$。",
        "D(sin(x)^4) == 4sin(x)^3*cos(x) ;; D2(4sin(x)^3*cos(x)) == -4sin(2x)+8sin(4x)"
      ],
      [
        "每個 $\\int_0^\\infty\\frac{\\sin ax}{x}dx=\\frac{\\pi}{2}$：$\\frac{1}{6}(-4+8)\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{3}$。",
        "INT(sin(4x)/x, 0, inf) == pi/2 ;; (1/6)*(-4+8)*pi/2 == ANS"
      ],
      [
        "答案 $\\frac{\\pi}{3}$。",
        "INT(sin(x)^4/x^4, 0, inf) == ANS"
      ]
    ],
    "trap": "分部時係數只寫 $\\frac{1}{3}$（漏了 $\\frac{1}{x^4}\\to\\frac{1}{3x^3}\\to\\frac{1}{6x^2}\\to\\frac{1}{6x}$ 的累乘），答 $\\frac{2\\pi}{3}$；或把 $\\int\\frac{\\sin 4x}{x}$ 當成 $4\\cdot\\frac{\\pi}{2}$。",
    "check": [
      "次方越高峰越窄：$\\int\\frac{\\sin^2x}{x^2}=\\frac{\\pi}{2}$、$\\int\\frac{\\sin^3x}{x^3}=\\frac{3\\pi}{8}$、這題 $\\frac{\\pi}{3}$，依序遞減。",
      "ANS < 3*pi/8 ;; ANS > 1"
    ]
  },
  "world-058": {
    "spot": "$e^{-x^2}$ 配 $\\cos x$ —— 把 $1$ 換成參數 $t$：$I(t)=\\int_0^\\infty e^{-x^2}\\cos tx\\,dx$，對 $t$ 微分後分部積分得到 $I'=-\\frac{t}{2}I$，一階微分方程式。",
    "why": "高斯函數沒有初等反導數；費曼技巧把它變成可分離的微分方程式，起點 $I(0)=\\frac{\\sqrt\\pi}{2}$ 已知。",
    "steps": [
      [
        "起點：$I(0)=\\int_0^\\infty e^{-x^2}dx=\\frac{\\sqrt\\pi}{2}$。",
        "INT(e^(-x^2), 0, inf) == sqrt(pi)/2"
      ],
      [
        "$I'(t)=-\\int_0^\\infty xe^{-x^2}\\sin tx\\,dx$；分部（$xe^{-x^2}$ 積成 $-\\frac{1}{2}e^{-x^2}$）得 $I'(t)=-\\frac{t}{2}I(t)$。",
        "SUB(INT(-x*e^(-x^2)*sin(t*x), 0, inf), 1.3, t) == SUB(-(t/2)*INT(e^(-x^2)*cos(t*x), 0, inf), 1.3, t)"
      ],
      [
        "解 $I'=-\\frac{t}{2}I$：$I(t)=\\frac{\\sqrt\\pi}{2}e^{-t^2/4}$。",
        "D(sqrt(pi)/2*e^(-t^2/4)) == -(t/2)*sqrt(pi)/2*e^(-t^2/4)"
      ],
      [
        "代 $t=1$：$\\frac{\\sqrt\\pi}{2}e^{-1/4}$。",
        "SUB(sqrt(pi)/2*e^(-t^2/4), 1) == ANS ;; INT(e^(-x^2)*cos(x), 0, inf) == ANS"
      ]
    ],
    "trap": "指數寫成 $e^{-t^2/2}$ 或 $e^{-t^2}$（把常態分配的公式搬過來），答 $\\frac{\\sqrt\\pi}{2}e^{-1/2}$。",
    "check": [
      "$\\cos x\\le 1$，答案要小於 $\\frac{\\sqrt\\pi}{2}\\approx 0.886$；$e^{-1/4}$ 這個折扣讓它是 $0.690$。",
      "ANS < sqrt(pi)/2 ;; ANS > 0.6"
    ]
  },
  "world-089": {
    "spot": "$x-\\sin x$ 在 $0$ 附近是 $\\frac{x^3}{6}$，剛好配 $\\frac{1}{x^3}$ —— 分部兩次，$f''=\\sin x$，變成 $\\frac{1}{2}\\int_0^\\infty\\frac{\\sin x}{x}dx$。",
    "why": "$f=x-\\sin x$ 的二階導數只剩 $\\sin x$，兩次分部直接落到狄利克雷積分。",
    "steps": [
      [
        "設 $f=x-\\sin x$：$f(x)\\approx\\frac{x^3}{6}$，所以 $\\frac{f}{x^2}$、$\\frac{f'}{x}$ 在 $0$ 都趨近 $0$；在 $\\infty$ 也都趨近 $0$。",
        "LIM((x-sin(x))/x^3, 0) == 1/6"
      ],
      [
        "分部兩次：$\\int_0^\\infty\\frac{f}{x^3}dx=\\frac{1}{2}\\int_0^\\infty\\frac{f''}{x}dx$，而 $f''=\\sin x$。",
        "D2(x - sin(x)) == sin(x)"
      ],
      [
        "$\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{4}$。",
        "INT(sin(x)/x, 0, inf)/2 == ANS ;; INT((x-sin(x))/x^3, 0, inf) == ANS"
      ]
    ],
    "trap": "拆成 $\\int\\frac{1}{x^2}-\\int\\frac{\\sin x}{x^3}$：兩個都在 $0$ 發散，變成 $\\infty-\\infty$。",
    "check": [
      "被積函數在 $0$ 附近是 $\\frac{1}{6}$、之後約 $\\frac{1}{x^2}$ 衰減，恆正；$\\frac{\\pi}{4}\\approx 0.785$ 合理。",
      "ANS > 0 ;; INT((x-sin(x))/x^3, 0, 2) < ANS"
    ]
  },
  "burst-boss-anti-003": {
    "spot": "多項式 $x^3$ 乘 $\\sin 2x$ —— 分部積分要做三次，用表格法：上排一直微 $x^3$ 到 $0$，下排一直積 $\\sin 2x$，斜線相乘、正負交錯。",
    "why": "多項式微三次就歸零、三角函數積多少次都不變形；表格法把三次分部壓成一張表，不容易漏符號。",
    "steps": [
      [
        "上排（微分）：$x^3,\\ 3x^2,\\ 6x,\\ 6,\\ 0$。",
        "D(x^3) == 3x^2 ;; D2(x^3) == 6x"
      ],
      [
        "下排（積分）：$-\\frac{\\cos 2x}{2},\\ -\\frac{\\sin 2x}{4},\\ \\frac{\\cos 2x}{8},\\ \\frac{\\sin 2x}{16}$。",
        "D(-cos(2x)/2) == sin(2x) ;; D(-sin(2x)/4) == -cos(2x)/2 ;; D(cos(2x)/8) == -sin(2x)/4 ;; D(sin(2x)/16) == cos(2x)/8"
      ],
      [
        "斜線相乘、符號 $+,-,+,-$：$-\\frac{x^3\\cos 2x}{2}+\\frac{3x^2\\sin 2x}{4}+\\frac{3x\\cos 2x}{4}-\\frac{3\\sin 2x}{8}$。",
        "D(-x^3*cos(2x)/2 + 3x^2*sin(2x)/4 + 3x*cos(2x)/4 - 3sin(2x)/8) == x^3*sin(2x)"
      ],
      [
        "加上 $C$ 就是答案。",
        "-x^3*cos(2x)/2 + 3x^2*sin(2x)/4 + 3x*cos(2x)/4 - 3sin(2x)/8 ~= ANS"
      ]
    ],
    "trap": "下排積分忘了每次除以 $2$（把 $\\sin 2x$ 當 $\\sin x$ 積），係數全部錯成 $1,3,6,6$。",
    "check": [
      "微回去要得到被積函數。",
      "D(ANS) == x^3*sin(2x)"
    ]
  },
  "burst-boss-der-005": {
    "spot": "$e^x\\cos 2x$ 是 $e^{(1+2i)x}$ 的實部 —— 微 $n$ 次就是乘 $(1+2i)^n$，在 $0$ 的值是 $\\mathrm{Re}(1+2i)^{16}$；十六次方用連續平方四次。",
    "why": "萊布尼茲公式要加十七項；複數指數把十六次微分變成算一個數的次方。",
    "steps": [
      [
        "每微一次，振幅乘 $\\sqrt5$、相位加 $\\varphi=\\arctan 2$：$\\frac{d}{dx}e^x\\cos 2x=\\sqrt5e^x\\cos(2x+\\varphi)$。",
        "D(e^x*cos(2x)) == sqrt(5)*e^x*cos(2x+arctan(2))"
      ],
      [
        "$(1+2i)^2=-3+4i$，所以二階導數在 $0$ 是 $-3$。",
        "D2(e^x*cos(2x), 0) == -3"
      ],
      [
        "再平方：$(-3+4i)^2=-7-24i$，$(-7-24i)^2=-527+336i$。",
        "(-3)^2 - 4^2 == -7 ;; 2*(-3)*4 == -24 ;; (-7)^2 - 24^2 == -527 ;; 2*(-7)*(-24) == 336"
      ],
      [
        "最後一次：$\\mathrm{Re}(-527+336i)^2=527^2-336^2=164833$。",
        "527^2 - 336^2 == ANS ;; 5^8*cos(16*arctan(2)) == ANS"
      ]
    ],
    "trap": "只看振幅，答 $5^8=390625$；或以為 $\\cos 2x$ 的導數每四次循環、直接答 $2^{16}$，漏了跟 $e^x$ 的交叉項。",
    "check": [
      "大小不能超過振幅：$|164833|\\le 5^8=390625$。",
      "ANS < 5^8 ;; ANS > -5^8"
    ]
  },
  "burst-der-008": {
    "spot": "$e^x\\cos x$ 微兩次變成 $-2e^x\\sin x$、微四次變成 $-4e^x\\cos x$ —— 四次一循環還帶一個因子 $-4$，十二次就是 $(-4)^3$。",
    "why": "萊布尼茲公式要加十三項；找到 $f^{(4)}=-4f$ 這個循環，直接跳到第十二次。",
    "steps": [
      [
        "$f=e^x\\cos x$：$f''=-2e^x\\sin x$。",
        "D2(e^x*cos(x)) == -2e^x*sin(x)"
      ],
      [
        "再微兩次：$(-2e^x\\sin x)''=-4e^x\\cos x$，即 $f^{(4)}=-4f$。",
        "D2(-2e^x*sin(x)) == -4e^x*cos(x)"
      ],
      [
        "所以 $f^{(12)}=(-4)^3f$，在 $0$ 的值 $=-64\\cdot 1=-64$。",
        "(-4)^3*SUB(e^x*cos(x), 0) == ANS"
      ]
    ],
    "trap": "以為四次一循環就回到原函數，答 $f(0)=1$；漏了每一輪的因子 $-4$。",
    "check": [
      "複數觀點：$\\mathrm{Re}(1+i)^{12}=(\\sqrt2)^{12}\\cos 3\\pi=-64$。",
      "sqrt(2)^12*cos(12*pi/4) == ANS"
    ]
  },
  "burst-der-010": {
    "spot": "$e^{2x}\\sin x$ 是 $e^{(2+i)x}$ 的虛部 —— 九階導數在 $0$ 就是 $\\mathrm{Im}(2+i)^9$；用 $(2+i)^8$ 連續平方再乘一次。",
    "why": "萊布尼茲公式要加十項還帶 $2^k$；複數次方只要四次乘法。",
    "steps": [
      [
        "每微一次，振幅乘 $\\sqrt5$、相位加 $\\arctan\\frac{1}{2}$：$\\frac{d}{dx}e^{2x}\\sin x=\\sqrt5e^{2x}\\sin\\left(x+\\arctan\\frac{1}{2}\\right)$。",
        "D(e^(2x)*sin(x)) == sqrt(5)*e^(2x)*sin(x+arctan(1/2))"
      ],
      [
        "$(2+i)^2=3+4i$，二階導數在 $0$ 是虛部 $4$。",
        "D2(e^(2x)*sin(x), 0) == 4"
      ],
      [
        "$(3+4i)^2=-7+24i$，$(-7+24i)^2=-527-336i$。",
        "3^2 - 4^2 == -7 ;; 2*3*4 == 24 ;; (-7)^2 - 24^2 == -527 ;; 2*(-7)*24 == -336"
      ],
      [
        "$(-527-336i)(2+i)$ 的虛部 $=-527-672=-1199$。",
        "-527*1 + (-336)*2 == ANS ;; sqrt(5)^9*sin(9*arctan(1/2)) == ANS"
      ]
    ],
    "trap": "取成實部（$-718$），把 $\\sin$ 跟 $\\cos$ 對應錯；$\\sin x$ 對應虛部。",
    "check": [
      "大小不超過振幅 $5^{9/2}\\approx 1397.5$。",
      "ANS > -sqrt(5)^9 ;; ANS < 0"
    ]
  },
  "burst-int-037": {
    "spot": "多項式 $x^2$ 乘 $\\sin 3x$ —— 分部兩次，用表格法：$x^2$ 微到 $0$，$\\sin 3x$ 一直積，斜線相乘正負交錯。",
    "why": "$x^2$ 微兩次就沒了，表格法三行寫完；每次積分記得除以 $3$。",
    "steps": [
      [
        "上排：$x^2,\\ 2x,\\ 2,\\ 0$；下排：$-\\frac{\\cos 3x}{3},\\ -\\frac{\\sin 3x}{9},\\ \\frac{\\cos 3x}{27}$。",
        "D(-cos(3x)/3) == sin(3x) ;; D(-sin(3x)/9) == -cos(3x)/3 ;; D(cos(3x)/27) == -sin(3x)/9"
      ],
      [
        "斜線相乘、符號 $+,-,+$：$-\\frac{x^2\\cos 3x}{3}+\\frac{2x\\sin 3x}{9}+\\frac{2\\cos 3x}{27}$。",
        "D(-x^2*cos(3x)/3 + 2x*sin(3x)/9 + 2cos(3x)/27) == x^2*sin(3x)"
      ],
      [
        "加上 $C$ 就是答案。",
        "-x^2*cos(3x)/3 + 2x*sin(3x)/9 + 2cos(3x)/27 ~= ANS"
      ]
    ],
    "trap": "最後一項符號弄反寫成 $-\\frac{2\\cos 3x}{27}$；表格法第三項是 $+$ 乘 $\\frac{\\cos 3x}{27}$。",
    "check": [
      "微回去要得到被積函數。",
      "D(ANS) == x^2*sin(3x)"
    ]
  },
  "burst-rec-005": {
    "spot": "$\\int_0^{\\pi/2}\\sin^mx\\,dx$ 的比值 —— 拆成 $\\sin^{m-1}x\\cdot\\sin x$ 分部一次，$\\cos^2=1-\\sin^2$ 把同一個積分換回來，得到降冪公式。",
    "why": "不需要算出 $A_n$ 本身；分部一次就給出 $mA=(m-1)A'$ 這個遞迴。",
    "steps": [
      [
        "分部：$\\int\\sin^mx\\,dx$，取 $u=\\sin^{m-1}x$、$dv=\\sin x\\,dx$，邊界項 $-\\sin^{m-1}x\\cos x$ 在 $0$ 和 $\\frac{\\pi}{2}$ 都是 $0$。以 $m=6$ 為例，$(-\\sin^5x\\cos x)'=\\sin^6x-5\\sin^4x\\cos^2x$，正是分部後的兩塊。",
        "D(-sin(x)^5*cos(x)) == sin(x)^6 - 5sin(x)^4*cos(x)^2"
      ],
      [
        "剩下 $(m-1)\\int\\sin^{m-2}x\\cos^2x=(m-1)\\int\\sin^{m-2}x-(m-1)\\int\\sin^mx$，移項：$\\int_0^{\\pi/2}\\sin^m=\\frac{m-1}{m}\\int_0^{\\pi/2}\\sin^{m-2}$。",
        "INT(sin(x)^6, 0, pi/2) == (5/6)*INT(sin(x)^4, 0, pi/2)"
      ],
      [
        "$m=2n$：$\\frac{A_n}{A_{n-1}}=\\frac{2n-1}{2n}$。",
        "INT(sin(x)^(2n), 0, pi/2) / INT(sin(x)^(2n-2), 0, pi/2) == ANS"
      ]
    ],
    "trap": "把比值寫成 $\\frac{2n}{2n-1}$（倒過來）；次方越高積分越小，比值一定小於 $1$。",
    "check": [
      "$n=1$：$A_1=\\frac{\\pi}{4}$、$A_0=\\frac{\\pi}{2}$，比值 $\\frac{1}{2}$。",
      "INT(sin(x)^2, 0, pi/2) / (pi/2) == SUB(ANS, 1)"
    ]
  },
  "gap-int-triple-005": {
    "spot": "區域是圓柱 $x^2+y^2\\le 4$、$0\\le z\\le 3$ —— 圓柱座標，$dV=r\\,dz\\,dr\\,d\\theta$，三個積分完全分離。",
    "why": "直角座標要處理 $\\sqrt{4-x^2}$ 的上下限；圓柱座標下界限全是常數。其實就是底面積乘高。",
    "steps": [
      [
        "$V=\\int_0^{2\\pi}\\!\\int_0^2\\!\\int_0^3 r\\,dz\\,dr\\,d\\theta$，三層各自獨立。",
        "INT(r, 0, 2, r) == 2"
      ],
      [
        "$\\int_0^3dz=3$、$\\int_0^2r\\,dr=2$、$\\int_0^{2\\pi}d\\theta=2\\pi$。",
        "INT(1, 0, 3, z) == 3"
      ],
      [
        "相乘：$2\\pi\\cdot 2\\cdot 3=12\\pi$。",
        "2*pi*2*3 == ANS"
      ]
    ],
    "trap": "漏了雅可比行列式的 $r$：這題 $\\int_0^2dr=2$ 恰好等於 $\\int_0^2r\\,dr=2$，答案碰巧沒錯；半徑換成 $3$ 就露餡，會算出 $18\\pi$ 而不是 $27\\pi$。",
    "check": [
      "底面積 $\\pi\\cdot 2^2=4\\pi$，乘高 $3$ 得 $12\\pi$。",
      "pi*2^2*3 == ANS"
    ]
  },
  "hc-der-007": {
    "spot": "$\\frac{\\sin x}{x}$ 在 $0$ 的高階導數 —— 寫成 $\\int_0^1\\cos(xt)\\,dt$，對 $x$ 微十次只是拉下 $t^{10}$、$\\cos$ 的十階導數在 $0$ 是 $-1$。",
    "why": "商的十次微分不可能手算；也可以從級數 $\\sum\\frac{(-1)^kx^{2k}}{(2k+1)!}$ 讀係數，積分表示把階乘直接變成 $\\frac{1}{11}$。",
    "steps": [
      [
        "$\\int_0^1\\cos(xt)\\,dt=\\frac{\\sin x}{x}$。",
        "INT(cos(x*t), 0, 1, t) == sin(x)/x"
      ],
      [
        "對 $x$ 微十次：$\\frac{d^{10}}{dx^{10}}\\cos(xt)=t^{10}\\cos^{(10)}(xt)$，而 $\\cos^{(10)}=-\\cos$，在 $x=0$ 是 $-t^{10}$。",
        "D2(cos(x)) == -cos(x) ;; SUB(-cos(x), 0) == -1"
      ],
      [
        "先拿二階對一下：$\\frac{d^2}{dx^2}\\frac{\\sin x}{x}\\big|_0=-\\int_0^1t^2dt=-\\frac{1}{3}$。",
        "D2(sin(x)/x, 0) == -INT(t^2, 0, 1, t)"
      ],
      [
        "十階：$-\\int_0^1t^{10}dt=-\\frac{1}{11}$。",
        "-INT(t^10, 0, 1, t) == ANS"
      ]
    ],
    "trap": "從級數讀出 $x^{10}$ 的係數 $-\\frac{1}{11!}$ 就當答案，忘了乘 $10!$；乘回去才是 $-\\frac{10!}{11!}=-\\frac{1}{11}$。",
    "check": [
      "級數對照：係數 $-\\frac{1}{11!}$ 乘 $10!$ 得 $-\\frac{1}{11}$。",
      "-(10*9*8*7*6*5*4*3*2*1)/(11*10*9*8*7*6*5*4*3*2*1) == ANS"
    ]
  },
  "int-069": {
    "spot": "$\\cos x$ 和 $\\cos 4x$ 的差除以 $x$：Frullani 型 $\\int_0^\\infty\\frac{f(ax)-f(bx)}{x}dx$，$f=\\cos$、$f(0)=1$。",
    "why": "單獨 $\\int\\frac{\\cos ax}{x}$ 在 $0$ 發散；兩項綁在一起，截斷後只剩 $0$ 附近一小段，給 $\\ln\\frac{4}{1}$。",
    "steps": [
      [
        "截斷：$\\int_\\varepsilon^\\infty\\frac{\\cos x-\\cos 4x}{x}dx=\\int_\\varepsilon^{4\\varepsilon}\\frac{\\cos u}{u}du$（兩項各自換變數後相減）。",
        "LIM(INT(cos(u)/u, x, 4x, u), 0+) == ln(4)"
      ],
      [
        "$\\varepsilon\\to 0$ 時 $\\cos u\\approx 1$，積分 $\\to\\ln\\frac{4\\varepsilon}{\\varepsilon}=\\ln 4$。",
        "INT(1/u, 1, 4, u) == ln(4)"
      ],
      [
        "答案 $\\ln 4$。",
        "ln(4) == ANS ;; INT((cos(x)-cos(4x))/x, 0, inf) == ANS"
      ]
    ],
    "trap": "以為 $\\int_0^\\infty\\frac{\\cos ax}{x}dx$ 跟 $a$ 無關（像 $\\frac{\\sin ax}{x}$ 那樣），兩項相減答 $0$；其實它們各自發散，差是有限的 $\\ln 4$。",
    "check": [
      "被積函數在 $0$ 附近 $\\approx\\frac{15x}{2}$ 為正，答案為正。",
      "LIM((cos(x)-cos(4x))/x^2, 0) == 15/2 ;; ANS > 0"
    ]
  },
  "int-075": {
    "spot": "$\\frac{1}{x}$ 乘 $f(2x)-f(5x)$，$f(x)=\\frac{1}{1+x}$：Frullani 型；而且通分後是有理函數，可以直接部分分式驗證。",
    "why": "Frullani 給 $(f(0)-f(\\infty))\\ln\\frac{5}{2}$；直接部分分式也只要兩項，兩條路互相對照。",
    "steps": [
      [
        "通分：$\\frac{1}{x}\\left(\\frac{1}{1+2x}-\\frac{1}{1+5x}\\right)=\\frac{3}{(1+2x)(1+5x)}$。",
        "(1/(1+2x) - 1/(1+5x))/x == 3/((1+2x)(1+5x))"
      ],
      [
        "部分分式：$\\frac{3}{(1+2x)(1+5x)}=\\frac{5}{1+5x}-\\frac{2}{1+2x}$，反導數 $\\ln\\frac{1+5x}{1+2x}$。",
        "3/((1+2x)(1+5x)) == 5/(1+5x) - 2/(1+2x) ;; D(ln((1+5x)/(1+2x))) == 3/((1+2x)(1+5x))"
      ],
      [
        "代上下限：$x\\to\\infty$ 時 $\\ln\\frac{1+5x}{1+2x}\\to\\ln\\frac{5}{2}$，$x=0$ 時是 $\\ln 1=0$。",
        "LIM(ln((1+5x)/(1+2x)), inf) == ANS ;; SUB(ln((1+5x)/(1+2x)), 0) == 0"
      ],
      [
        "答案 $\\ln\\frac{5}{2}$，跟 Frullani 公式 $(1-0)\\ln\\frac{5}{2}$ 一致。",
        "INT((1/(1+2x) - 1/(1+5x))/x, 0, inf) == ANS"
      ]
    ],
    "trap": "拆開成 $\\int\\frac{dx}{x(1+2x)}-\\int\\frac{dx}{x(1+5x)}$：兩個都在 $0$ 發散。",
    "check": [
      "被積函數在 $0$ 趨近 $3$，恆正。",
      "LIM((1/(1+2x) - 1/(1+5x))/x, 0) == 3 ;; ANS > 0"
    ]
  },
  "int-076": {
    "spot": "$\\frac{1}{x}$ 乘 $f(x)-f(6x)$，$f(x)=\\frac{1}{1+x}$：Frullani 型，$f(0)=1$、$f(\\infty)=0$，答案 $\\ln 6$；通分後也能直接部分分式。",
    "why": "Frullani 一行出答案；部分分式只有兩項，可以拿來確認。",
    "steps": [
      [
        "通分：$\\frac{1}{x}\\left(\\frac{1}{1+x}-\\frac{1}{1+6x}\\right)=\\frac{5}{(1+x)(1+6x)}$。",
        "(1/(1+x) - 1/(1+6x))/x == 5/((1+x)(1+6x))"
      ],
      [
        "部分分式：$\\frac{6}{1+6x}-\\frac{1}{1+x}$，反導數 $\\ln\\frac{1+6x}{1+x}$。",
        "5/((1+x)(1+6x)) == 6/(1+6x) - 1/(1+x) ;; D(ln((1+6x)/(1+x))) == 5/((1+x)(1+6x))"
      ],
      [
        "$x\\to\\infty$ 時 $\\to\\ln 6$，$x=0$ 時 $0$：答案 $\\ln 6$。",
        "LIM(ln((1+6x)/(1+x)), inf) == ANS ;; INT((1/(1+x) - 1/(1+6x))/x, 0, inf) == ANS"
      ]
    ],
    "trap": "Frullani 用成 $\\ln\\frac{1}{6}$（$a,b$ 對調）；$\\frac{1}{1+x}>\\frac{1}{1+6x}$，被積函數恆正，答案要正。",
    "check": [
      "被積函數在 $0$ 趨近 $6-1=5$，恆正。",
      "LIM((1/(1+x) - 1/(1+6x))/x, 0) == 5 ;; ANS > 0"
    ]
  },
  "rel-boss-003": {
    "spot": "$\\cos 2x$ 和 $\\cos 7x$ 的差除以 $x$：Frullani 型，$f=\\cos$、$f(0)=1$，答案 $\\ln\\frac{7}{2}$。",
    "why": "兩項分開都在 $0$ 發散；截斷後只剩 $\\int_{2\\varepsilon}^{7\\varepsilon}\\frac{\\cos u}{u}du\\to\\ln\\frac{7}{2}$。",
    "steps": [
      [
        "截斷：$\\int_\\varepsilon^\\infty\\frac{\\cos 2x-\\cos 7x}{x}dx=\\int_{2\\varepsilon}^{7\\varepsilon}\\frac{\\cos u}{u}du$。",
        "LIM(INT(cos(u)/u, 2x, 7x, u), 0+) == ln(7/2)"
      ],
      [
        "$\\varepsilon\\to 0$：$\\cos u\\approx 1$，得 $\\ln\\frac{7}{2}$。",
        "INT(1/u, 2, 7, u) == ln(7/2)"
      ],
      [
        "答案 $\\ln\\frac{7}{2}$。",
        "ln(7/2) == ANS ;; INT((cos(2x)-cos(7x))/x, 0, inf) == ANS"
      ]
    ],
    "trap": "答 $\\ln 5$（以為跟頻率差有關）或 $0$（以為 $\\int\\frac{\\cos ax}{x}$ 跟 $a$ 無關）。結果只看比值 $\\frac{7}{2}$。",
    "check": [
      "被積函數在 $0$ 附近 $\\approx\\frac{45x}{2}$，正的部分主導，答案為正。",
      "LIM((cos(2x)-cos(7x))/x^2, 0) == 45/2 ;; ANS > 0"
    ]
  }
};
