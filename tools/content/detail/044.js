// 詳解 v2 第 044 批：60 題。格式見 tools/build_solution_detail.js 的說明。
module.exports = {
  "mob-bessel-009": {
    "spot": "階數是負「整數」$-1$：整數階的貝索函數有一條對稱 $J_{-n}(x)=(-1)^nJ_n(x)$，$J_{-1}$ 不是新的函數。",
    "why": "用整數階的積分表示 $J_n(x)=\\frac{1}{\\pi}\\int_0^\\pi\\cos(n\\tau-x\\sin\\tau)\\,d\\tau$，換一個變數就看出來，比展開級數比係數快。",
    "steps": [
      [
        "整數階的積分表示：$J_n(x)=\\frac{1}{\\pi}\\int_0^\\pi\\cos(n\\tau-x\\sin\\tau)\\,d\\tau$。例如 $J_1(0)=\\frac{1}{\\pi}\\int_0^\\pi\\cos\\tau\\,d\\tau=0$。",
        "SUB(INT(cos(t - x*sin(t)), 0, pi, t), 0) == 0"
      ],
      [
        "代 $n=-1$：$\\cos(-\\tau-x\\sin\\tau)=\\cos(\\tau+x\\sin\\tau)$（餘弦是偶函數）。",
        "cos(-t - x*sin(t)) == cos(t + x*sin(t))"
      ],
      [
        "換變數 $\\tau\\to\\pi-\\tau$：$\\sin\\tau$ 不變，$\\cos(\\pi-\\tau+x\\sin\\tau)=-\\cos(\\tau-x\\sin\\tau)$。",
        "SUB(cos(t + x*sin(t)), pi - t, t) == -cos(t - x*sin(t))"
      ],
      [
        "所以 $J_{-1}(x)=-\\frac{1}{\\pi}\\int_0^\\pi\\cos(\\tau-x\\sin\\tau)\\,d\\tau=-J_1(x)$，答案是 $-J_1(x)$。",
        "INT(cos(-t - x*sin(t)), 0, pi, t) == -INT(cos(t - x*sin(t)), 0, pi, t)"
      ]
    ],
    "trap": "把非整數階的結論搬過來，說 $J_{-1}$ 和 $J_1$ 線性獨立、是另一個解；或以為像 $\\cos$ 一樣是偶的，寫成 $J_1(x)$，差一個負號。",
    "check": [
      "小 $x$ 時 $J_1(x)\\approx\\frac{x}{2}>0$，所以 $J_{-1}(0.01)$ 應該是負的，約 $-0.005$。",
      "SUB(INT(cos(-t - x*sin(t)), 0, pi, t)/pi, 0.01) < 0"
    ]
  },
  "mob-tech-002": {
    "spot": "代 $x=0$ 是 $\\frac{0}{0}$，而且分子 $e^{2x}-1-2x$ 正好是把 $e^{2x}$ 的泰勒展開前兩項扣掉 —— 剩下的就是 $x^2$ 那一項。",
    "why": "分子已經是「展開式減掉前幾項」的樣子，泰勒展開一眼讀出主項；羅必達要微兩次，每次還得重新確認是不是 $\\frac{0}{0}$。",
    "steps": [
      [
        "$e^{2x}=1+2x+\\frac{(2x)^2}{2}+\\frac{(2x)^3}{6}+\\cdots=1+2x+2x^2+\\frac{4}{3}x^3+\\cdots$。",
        "D2(exp(2x), 0) == 2*2"
      ],
      [
        "所以分子 $=2x^2+\\frac{4}{3}x^3+\\cdots$，主項是 $2x^2$。",
        "LIM((exp(2x)-1-2x-2x^2)/x^3, 0) == 4/3"
      ],
      [
        "除以 $x^2$：$2+\\frac{4}{3}x+\\cdots\\to 2$。",
        "LIM((exp(2x)-1-2x)/x^2, 0) == 2"
      ],
      [
        "所以這題用泰勒展開。",
        "LIM((exp(2x)-1-2x)/x^2, 0) == 2"
      ]
    ],
    "trap": "只展到一次 $e^{2x}\\approx 1+2x$，分子變成 $0$，以為極限是 $0$；分母是 $x^2$，就要展到 $x^2$ 那一項。",
    "check": [
      "代 $x=0.01$：$\\frac{e^{0.02}-1.02}{0.0001}\\approx 2.013$，接近 $2$。",
      "SUB((exp(2x)-1-2x)/x^2, 0.01) > 2 ;; SUB((exp(2x)-1-2x)/x^2, 0.01) < 2.02"
    ]
  },
  "mob-tech-012": {
    "spot": "要在一條約束曲線 $g(x,y)=0$ 上找 $f$ 的極值，而且約束不一定解得出 $y$ —— 這正是拉格朗日乘數法的場景：極值點上 $\\nabla f$ 和 $\\nabla g$ 平行。",
    "why": "把約束解成 $y=y(x)$ 代回去只對簡單的 $g$ 行得通；乘數法不用解約束，直接列 $\\nabla f=\\lambda\\nabla g$ 和 $g=0$ 聯立。",
    "steps": [
      [
        "列方程：$\\nabla f=\\lambda\\nabla g$、$g(x,y)=0$，三個未知數 $x,y,\\lambda$、三條方程（下面的例子裡 $x=y=\\lambda$，代進約束得 $\\lambda=1$）。",
        "SUB(x + x - 2, 1) == 0"
      ],
      [
        "例：$f=xy$、$g=x+y-2=0$。$\\nabla f=(y,x)$、$\\nabla g=(1,1)$，得 $y=\\lambda$、$x=\\lambda$，所以 $x=y=1$。",
        "SUB(2 - x, 1) == 1"
      ],
      [
        "對照：把 $y=2-x$ 代回去，$f=x(2-x)$ 的導數在 $x=1$ 是 $0$，最大值 $1$ —— 跟乘數法一樣。",
        "D(x*(2-x), 1) == 0 ;; SUB(x*(2-x), 1) == 1"
      ],
      [
        "所以這題用拉格朗日乘數法。",
        "SUB(x*(2-x), 1) == 1"
      ]
    ],
    "trap": "把約束忘了，直接解 $\\nabla f=\\mathbf 0$：找到的是 $f$ 在整個平面上的臨界點，不在曲線 $g=0$ 上，跟題目無關。",
    "check": "例子裡 $\\nabla f(1,1)=(1,1)$ 正好是 $\\nabla g$ 的 $1$ 倍，$\\lambda=1$，兩個梯度平行。"
  },
  "mob-tech-016": {
    "spot": "積分從 $0$ 到 $\\infty$，被積函數是「$x$ 的冪 $\\times e^{-x}$」：$x^{s-1}e^{-x}$ 這個形狀一字不差就是 $\\Gamma(s)$ 的定義。",
    "why": "對一般的 $s$ 分部積分做不完；認出 $\\Gamma$ 函數，就能用 $\\Gamma(s+1)=s\\Gamma(s)$、$\\Gamma(n)=(n-1)!$、$\\Gamma(\\frac12)=\\sqrt\\pi$ 直接寫答案。",
    "steps": [
      [
        "定義：$\\Gamma(s)=\\int_0^\\infty x^{s-1}e^{-x}\\,dx$（$s>0$），題目的式子就是它。",
        "INT(x^(3-1)*exp(-x), 0, inf) > 0"
      ],
      [
        "整數時 $\\Gamma(n)=(n-1)!$：例如 $\\Gamma(3)=2!=2$。",
        "INT(x^(3-1)*exp(-x), 0, inf) == 2"
      ],
      [
        "遞迴 $\\Gamma(s+1)=s\\Gamma(s)$（分部積分一次就得到）：例如 $\\Gamma(3.5)=2.5\\,\\Gamma(2.5)$。",
        "INT(x^(2.5)*exp(-x), 0, inf) == 2.5*INT(x^(1.5)*exp(-x), 0, inf)"
      ],
      [
        "半整數的起點：$\\Gamma(\\frac12)=\\sqrt\\pi$。所以這題用 $\\Gamma$ 函數。",
        "INT(x^(1/2-1)*exp(-x), 0, inf) == sqrt(pi)"
      ]
    ],
    "trap": "把 $\\Gamma(n)$ 記成 $n!$：$\\int_0^\\infty x^2e^{-x}\\,dx$ 會答成 $3!=6$，正確是 $\\Gamma(3)=2!=2$。",
    "check": [
      "$s=1$ 時就是 $\\int_0^\\infty e^{-x}\\,dx=1=0!$。",
      "INT(exp(-x), 0, inf) == 1"
    ]
  },
  "mob-trap-008": {
    "spot": "二重積分「換變數」：新變數的一小格 $du\\,dv$ 在舊平面上的面積不一定是 $du\\,dv$，要乘上面積放大率 $\\left|\\frac{\\partial(x,y)}{\\partial(u,v)}\\right|$。",
    "why": "$dA$ 是面積，不是記號；換座標時面積會被拉伸或壓縮，雅可比行列式的絕對值就是那個伸縮倍數，漏乘答案就錯一個因子。",
    "steps": [
      [
        "公式：$\\iint_R f\\,dA=\\iint_S f(x(u,v),y(u,v))\\left|\\frac{\\partial(x,y)}{\\partial(u,v)}\\right|du\\,dv$。例：$x=\\frac{u+v}{2}$、$y=\\frac{u-v}{2}$，行列式 $=\\frac12\\cdot(-\\frac12)-\\frac12\\cdot\\frac12=-\\frac12$，取絕對值乘 $\\frac12$。",
        "(1/2)*(-1/2) - (1/2)*(1/2) == -1/2"
      ],
      [
        "極座標：$x=r\\cos\\theta$、$y=r\\sin\\theta$，雅可比行列式 $=\\cos\\theta\\cdot r\\cos\\theta-(-r\\sin\\theta)\\sin\\theta=r$。",
        "cos(t)*r*cos(t) + r*sin(t)*sin(t) == r"
      ],
      [
        "單位圓面積：$\\int_0^{2\\pi}\\int_0^1 r\\,dr\\,d\\theta=\\pi$，對。",
        "2*pi*INT(r, 0, 1, r) == pi"
      ],
      [
        "漏乘 $r$：$\\int_0^{2\\pi}\\int_0^1 1\\,dr\\,d\\theta=2\\pi$，錯成兩倍。所以主要陷阱是忘了乘雅可比行列式。",
        "2*pi*INT(1, 0, 1, r) == 2*pi"
      ]
    ],
    "trap": "用 $u=x+y$、$v=x-y$ 時乘上 $\\left|\\frac{\\partial(u,v)}{\\partial(x,y)}\\right|=2$ 而不是它的倒數 $\\frac12$：方向弄反，答案差四倍。",
    "check": "乘上去的是「舊對新」的偏導行列式 $\\frac{\\partial(x,y)}{\\partial(u,v)}$，還要取絕對值。"
  },
  "refine-integrals-028": {
    "spot": "內層要對 $y$ 積 $\\frac{1}{1+y^3}$，這個沒有好用的反導數；但外面若先對 $x$ 積，會冒出一個 $y^2$，正好是 $1+y^3$ 的導數的三分之一。",
    "why": "被積函數只跟 $y$ 有關，先積 $x$ 只是乘上 $x$ 方向的長度；照原順序積 $\\frac{1}{1+y^3}$ 要部分分式加反正切，又長又容易錯。",
    "steps": [
      [
        "畫區域：$0\\le x\\le 4$、$\\sqrt x\\le y\\le 2$，等價於 $0\\le y\\le 2$、$0\\le x\\le y^2$。",
        "SUB(x^2, 2) == 4"
      ],
      [
        "換順序後內層 $\\int_0^{y^2}\\frac{dx}{1+y^3}=\\frac{y^2}{1+y^3}$。",
        "INT(1/(1+2^3), 0, 2^2) == 2^2/(1+2^3)"
      ],
      [
        "外層：$\\int_0^2\\frac{y^2}{1+y^3}\\,dy=\\frac13\\ln(1+y^3)\\Big|_0^2=\\frac13\\ln 9$。",
        "D(ln(1+x^3)/3) == x^2/(1+x^3) ;; INT(x^2/(1+x^3), 0, 2) == ln(9)/3"
      ],
      [
        "$\\frac13\\ln 9=\\frac{2\\ln 3}{3}$。",
        "ln(9)/3 == ANS"
      ]
    ],
    "trap": "換順序時把 $x$ 的上限寫成 $\\sqrt y$（把 $y=\\sqrt x$ 反解錯）：會得 $\\int_0^2\\frac{\\sqrt y}{1+y^3}\\,dy$，又是積不出來的東西。",
    "check": [
      "照原順序直接數值積分，也是 $\\frac{2\\ln3}{3}\\approx 0.732$。",
      "INT(INT(1/(1+y^3), sqrt(x), 2, y), 0, 4, x) == ANS"
    ]
  },
  "refine-limits-046": {
    "spot": "$\\frac{k}{n^2}=\\frac1n\\cdot\\frac kn$，而 $\\cos\\frac{\\pi k}{2n}=\\cos\\left(\\frac\\pi2\\cdot\\frac kn\\right)$：整個和是 $\\frac1n\\sum g\\left(\\frac kn\\right)$，黎曼和。",
    "why": "求和裡同時有 $k$ 和 $\\cos$ 沒有閉合公式可加；看成黎曼和，極限直接變成 $\\int_0^1 x\\cos\\frac{\\pi x}{2}\\,dx$。",
    "steps": [
      [
        "改寫：$\\sum_{k=1}^n\\frac{k}{n^2}\\cos\\frac{\\pi k}{2n}=\\frac1n\\sum_{k=1}^n g\\left(\\frac kn\\right)$，$g(x)=x\\cos\\frac{\\pi x}{2}$。",
        "k/n^2*cos(pi*k/(2n)) == (1/n)*(k/n)*cos(pi/2*(k/n))"
      ],
      [
        "所以極限 $=\\int_0^1 x\\cos\\frac{\\pi x}{2}\\,dx$。",
        "INT(x*cos(pi*x/2), 0, 1) > 0"
      ],
      [
        "分部積分：反導數是 $\\frac{2x}{\\pi}\\sin\\frac{\\pi x}{2}+\\frac{4}{\\pi^2}\\cos\\frac{\\pi x}{2}$。",
        "D(2x/pi*sin(pi*x/2) + 4/pi^2*cos(pi*x/2)) == x*cos(pi*x/2)"
      ],
      [
        "代上下限：$\\left(\\frac2\\pi+0\\right)-\\left(0+\\frac4{\\pi^2}\\right)=\\frac2\\pi-\\frac4{\\pi^2}$。",
        "INT(x*cos(pi*x/2), 0, 1) == ANS"
      ]
    ],
    "trap": "分部積分時 $\\int\\sin\\frac{\\pi x}{2}\\,dx$ 忘了除 $\\frac\\pi2$，第二項寫成 $\\frac{2}{\\pi}\\cos$：答案變成 $\\frac2\\pi-\\frac2\\pi=0$，明顯不對（被積函數在 $(0,1)$ 都是正的）。",
    "check": "被積函數在 $[0,1]$ 上介於 $0$ 和 $x$ 之間，答案約 $0.231$，比 $\\int_0^1x\\,dx=\\frac12$ 小，合理。"
  },
  "refine-limits-047": {
    "spot": "乘積再開 $n$ 次方根：取對數就變成 $\\frac1n\\sum\\ln\\left(1+\\left(\\frac kn\\right)^2\\right)$，標準的黎曼和。",
    "why": "乘積沒有公式可算，取 $\\ln$ 把乘積變成和、把 $\\frac1n$ 次方變成平均，極限就是一個積分。",
    "steps": [
      [
        "取對數：$\\ln P_n=\\frac1n\\sum_{k=1}^n\\ln\\left(1+\\frac{k^2}{n^2}\\right)\\to\\int_0^1\\ln(1+x^2)\\,dx$。",
        "INT(ln(1+x^2), 0, 1) > 0"
      ],
      [
        "分部積分：$x\\ln(1+x^2)-\\int\\frac{2x^2}{1+x^2}\\,dx=x\\ln(1+x^2)-2x+2\\arctan x$。",
        "D(x*ln(1+x^2) - 2x + 2atan(x)) == ln(1+x^2)"
      ],
      [
        "代 $0$ 到 $1$：$\\ln2-2+\\frac\\pi2$。",
        "INT(ln(1+x^2), 0, 1) == ln(2) - 2 + pi/2"
      ],
      [
        "還原：$e^{\\ln 2-2+\\pi/2}=2e^{\\pi/2-2}$。",
        "exp(ln(2) - 2 + pi/2) == ANS"
      ]
    ],
    "trap": "取完對數忘了還原，答 $\\ln2-2+\\frac\\pi2\\approx 0.264$；題目問的是原來的乘積根，要再取 $e$ 的次方。",
    "check": "每個因子介於 $1$ 和 $2$ 之間，幾何平均也該在 $1$ 和 $2$ 之間；$2e^{\\pi/2-2}\\approx 1.30$，合理。"
  },
  "refine-limits-048": {
    "spot": "階乘開 $n$ 次方根除以 $n^2$：把 $n^2$ 寫成 $\\frac14(2n)^2$，$\\frac{(2n)!}{(2n)^{2n}}=\\prod_{k=1}^{2n}\\frac{k}{2n}$，取對數就是 $\\int_0^1\\ln x\\,dx$ 的黎曼和。",
    "why": "不必背斯特林公式：把階乘拆成 $\\frac{k}{2n}$ 的乘積，取對數就是一個黎曼和，一個積分就定出指數。",
    "steps": [
      [
        "改寫：$\\frac{\\sqrt[n]{(2n)!}}{n^2}=4\\left(\\frac{(2n)!}{(2n)^{2n}}\\right)^{1/n}$，因為 $\\left((2n)^{2n}\\right)^{1/n}=4n^2$。",
        "SUB((2*x)^(2*x), 3)^(1/3) == 4*3^2"
      ],
      [
        "取對數：$\\frac1n\\ln\\frac{(2n)!}{(2n)^{2n}}=2\\cdot\\frac{1}{2n}\\sum_{k=1}^{2n}\\ln\\frac{k}{2n}\\to 2\\int_0^1\\ln x\\,dx$。",
        "INT(ln(x), 0, 1) == -1"
      ],
      [
        "所以括號那一項的極限是 $e^{-2}$。",
        "exp(2*INT(ln(x), 0, 1)) == exp(-2)"
      ],
      [
        "乘回 $4$：極限 $=\\frac{4}{e^2}$。",
        "4*exp(2*INT(ln(x), 0, 1)) == ANS"
      ]
    ],
    "trap": "把 $\\sqrt[n]{(2n)!}$ 當成跟 $\\sqrt[n]{n!}\\sim\\frac ne$ 一樣，答 $\\frac{2}{e}$ 之類：$(2n)!$ 開的是 $n$ 次方而不是 $2n$ 次方，指數要乘 $2$。",
    "check": [
      "$n=20$ 時直接算（$(2n)!=\\int_0^\\infty t^{2n}e^{-t}\\,dt$）大約 $0.6$，比 $\\frac4{e^2}\\approx 0.541$ 略大，收斂得慢但方向對。",
      "SUB(INT(t^(2n)*exp(-t), 0, inf, t)^(1/n)/n^2, 20, n) > 0.54 ;; SUB(INT(t^(2n)*exp(-t), 0, inf, t)^(1/n)/n^2, 20, n) < 0.65"
    ]
  },
  "refine-limits-049": {
    "spot": "分母的 $n^2\\sqrt n=n^{5/2}$ 剛好是分子 $k^{3/2}$ 的次方加一：$\\frac{k\\sqrt k}{n^{5/2}}=\\frac1n\\left(\\frac kn\\right)^{3/2}$，黎曼和。",
    "why": "$\\sum k^{3/2}$ 沒有閉合公式；看成 $\\int_0^1x^{3/2}\\,dx$ 的黎曼和，一步算完。",
    "steps": [
      [
        "改寫每一項：$\\frac{k\\sqrt k}{n^2\\sqrt n}=\\frac1n\\left(\\frac kn\\right)^{3/2}$。",
        "k*sqrt(k)/(n^2*sqrt(n)) == (1/n)*(k/n)^(3/2)"
      ],
      [
        "所以極限 $=\\int_0^1x^{3/2}\\,dx$。",
        "INT(x^(3/2), 0, 1) > 0"
      ],
      [
        "$\\int_0^1x^{3/2}\\,dx=\\frac{x^{5/2}}{5/2}\\Big|_0^1=\\frac25$。",
        "INT(x^(3/2), 0, 1) == ANS"
      ]
    ],
    "trap": "把冪次加一算成 $\\frac{x^{5/2}}{3/2}$，答 $\\frac23$；除的是新的指數 $\\frac52$。",
    "check": "冪和的粗估 $\\sum_{k\\le n}k^p\\approx\\frac{n^{p+1}}{p+1}$，$p=\\frac32$ 給 $\\frac{n^{5/2}}{5/2}$，除以 $n^{5/2}$ 得 $\\frac25$。"
  },
  "refine-limits-050": {
    "spot": "$\\cos\\frac{2\\pi n}{3}$ 以 $3$ 為週期只取兩個值：$n$ 是 $3$ 的倍數時是 $1$，其他時候是 $-\\frac12$；前面的 $\\frac{n+1}{n}\\to1$ 不影響。",
    "why": "下極限就是所有子數列極限裡最小的；按 $n$ 除以 $3$ 的餘數分組，每組都有普通極限，比直接估下確界清楚。",
    "steps": [
      [
        "$n=3m$：$\\cos 2\\pi m=1$，這組趨近 $1$。",
        "SUB(cos(2*pi*n/3), 6) == 1"
      ],
      [
        "$n=3m+1$ 或 $3m+2$：$\\cos\\frac{2\\pi}{3}=\\cos\\frac{4\\pi}{3}=-\\frac12$。",
        "SUB(cos(2*pi*n/3), 4) == -1/2 ;; SUB(cos(2*pi*n/3), 5) == -1/2"
      ],
      [
        "這兩組是 $-\\frac12\\cdot\\frac{n+1}{n}\\to-\\frac12$。",
        "LIM(-(x+1)/(2x), inf) == -1/2"
      ],
      [
        "子數列極限只有 $1$ 和 $-\\frac12$，取最小的：下極限 $=-\\frac12$。",
        "LIM(-(x+1)/(2x), inf) == ANS"
      ]
    ],
    "trap": "看到各項都 $\\ge-\\frac12\\cdot\\frac{n+1}{n}$ 裡最小的 $n=1$ 那項 $-1$，答 $-1$：那是下確界，不是下極限，下極限只看尾巴。",
    "check": "$n=100$ 時 $\\frac{101}{100}\\cdot(-\\frac12)=-0.505$，已經很接近 $-\\frac12$。"
  },
  "refine-limits-051": {
    "spot": "指數裡的 $\\cos\\frac{n\\pi}{2}$ 以 $4$ 為週期輪流取 $1,0,-1,0$：數列拆成三種樣子 $(1+\\frac1n)^n$、$1$、$(1+\\frac1n)^{-n}$。",
    "why": "上極限是子數列極限裡最大的；按 $n$ 除以 $4$ 的餘數分組，每組都是熟悉的極限。",
    "steps": [
      [
        "$n=4m$：$\\cos 2m\\pi=1$，項是 $(1+\\frac1n)^n\\to e$。",
        "SUB(cos(n*pi/2), 8) == 1 ;; LIM((1+1/x)^x, inf) == exp(1)"
      ],
      [
        "$n$ 是奇數：$\\cos\\frac{n\\pi}{2}=0$，項恆等於 $1$。",
        "SUB(cos(n*pi/2), 9) == 0"
      ],
      [
        "$n=4m+2$：$\\cos=-1$，項是 $(1+\\frac1n)^{-n}\\to\\frac1e$。",
        "SUB(cos(n*pi/2), 6) == -1 ;; LIM((1+1/x)^(-x), inf) == exp(-1)"
      ],
      [
        "子數列極限是 $e,1,\\frac1e$，取最大：上極限 $=e$。",
        "LIM((1+1/x)^x, inf) == ANS"
      ]
    ],
    "trap": "以為 $1^\\infty$ 型就是 $1$，或看到 $\\cos$ 有正有負就說平均起來是 $1$：上極限要找最大的那個子數列極限 $e$。",
    "check": "$n=100$（$4$ 的倍數）時 $(1.01)^{100}\\approx 2.705$，接近 $e\\approx2.718$。"
  },
  "refine-limits-052": {
    "spot": "$x^n$ 在 $n$ 很大時把權重全部擠到 $x=1$ 附近，而 $n\\int_0^1x^n\\,dx=\\frac{n}{n+1}\\to1$：整個式子就是在 $x=1$ 取 $\\frac{1}{\\sqrt{3+x^2}}$ 的值。",
    "why": "分部積分把 $x^n$ 積掉，主項是 $f(1)$、剩下的被 $\\frac1n$ 壓住，比找夾擠的上下界乾淨。",
    "steps": [
      [
        "令 $f(x)=\\frac{1}{\\sqrt{3+x^2}}$。分部積分：$n\\int_0^1x^nf\\,dx=\\frac{n}{n+1}\\left[f(1)-\\int_0^1x^{n+1}f'(x)\\,dx\\right]$。",
        "SUB(1/sqrt(3+x^2), 1) == 1/2"
      ],
      [
        "$f'(x)=-\\frac{x}{(3+x^2)^{3/2}}$ 有界，所以 $\\left|\\int_0^1x^{n+1}f'\\,dx\\right|\\le\\frac{\\max|f'|}{n+2}\\to0$。",
        "D(1/sqrt(3+x^2)) == -x/(3+x^2)^(3/2)"
      ],
      [
        "$\\frac{n}{n+1}\\to1$，所以極限是 $f(1)=\\frac12$。",
        "LIM(x/(x+1), inf) * SUB(1/sqrt(3+x^2), 1) == ANS"
      ]
    ],
    "trap": "看到 $\\int_0^1x^n(\\cdots)\\,dx\\to0$ 就答 $0$：前面乘了 $n$，是 $0\\cdot\\infty$，要算到底。",
    "check": [
      "$n=200$ 時直接數值積分約 $0.498$，從下面逼近 $\\frac12$。",
      "SUB(n*INT(x^n/sqrt(3+x^2), 0, 1, x), 200, n) > 0.49 ;; SUB(n*INT(x^n/sqrt(3+x^2), 0, 1, x), 200, n) < 0.5"
    ]
  },
  "refine-limits-053": {
    "spot": "每一項的 $\\frac{k}{n^2}\\le\\frac1n$ 很小，$\\sqrt{1+\\varepsilon}-1\\approx\\frac\\varepsilon2$；總和 $\\sum\\frac{k}{n^2}=\\frac{n+1}{2n}\\to\\frac12$，再折半。",
    "why": "有理化寫成 $\\frac{\\varepsilon}{\\sqrt{1+\\varepsilon}+1}$，分母被夾在 $2$ 和 $\\sqrt{1+\\frac1n}+1$ 之間，夾擠就嚴謹了。",
    "steps": [
      [
        "有理化：$\\sqrt{1+\\varepsilon}-1=\\frac{\\varepsilon}{\\sqrt{1+\\varepsilon}+1}$，$\\varepsilon=\\frac{k}{n^2}$。",
        "sqrt(1+x) - 1 == x/(sqrt(1+x)+1)"
      ],
      [
        "$0<\\varepsilon\\le\\frac1n$，所以分母介於 $2$ 和 $\\sqrt{1+\\frac1n}+1$ 之間。",
        "LIM(sqrt(1+1/x)+1, inf) == 2"
      ],
      [
        "$\\sum_{k=1}^n\\frac{k}{n^2}=\\frac{n(n+1)}{2n^2}=\\frac{n+1}{2n}\\to\\frac12$。",
        "LIM((x+1)/(2x), inf) == 1/2"
      ],
      [
        "夾擠：上下界都趨近 $\\frac12\\cdot\\frac12=\\frac14$。",
        "LIM((x+1)/(2x)/(sqrt(1+1/x)+1), inf) == ANS ;; LIM((x+1)/(2x)/2, inf) == ANS"
      ]
    ],
    "trap": "看到每一項都趨近 $0$ 就答 $0$：項數 $n$ 也在增加，是「很多個很小的數」相加，要算總和。",
    "check": "用 $\\sqrt{1+\\varepsilon}-1\\approx\\frac\\varepsilon2$：$\\frac12\\sum\\frac{k}{n^2}\\to\\frac14$，一致。"
  },
  "refine-limits-054": {
    "spot": "$\\frac1x$ 在 $0$ 的兩側一邊趨近 $+\\infty$、一邊趨近 $-\\infty$：右邊 $e^{1/x}$ 爆大，左邊 $e^{1/x}\\to0$ —— 要分左右極限。",
    "why": "式子裡有 $e^{1/x}$ 就一定分左右看；右邊分母爆掉、左邊分母趨近 $1$，剩下的 $\\sin\\frac1x$ 在左邊就沒人壓得住。",
    "steps": [
      [
        "右極限：$|\\sin\\frac1x|\\le1$，分母 $1+e^{1/x}\\to\\infty$，所以 $\\to0$。",
        "LIM(sin(1/x)/(1+exp(1/x)), 0+) == 0"
      ],
      [
        "左邊：$\\frac1x\\to-\\infty$，$e^{1/x}\\to0$，分母趨近 $1$，式子幾乎就是 $\\sin\\frac1x$。",
        "LIM(exp(1/x), 0-) == 0"
      ],
      [
        "取 $x=-\\frac{1}{2m\\pi+\\pi/2}\\to0^-$：$\\sin\\frac1x=-1$，值趨近 $-1$；取 $x=-\\frac{1}{2m\\pi+3\\pi/2}$：值趨近 $+1$。（$m=10$ 時已經是 $\\mp0.99\\cdots$）",
        "SUB(sin(1/x)/(1+exp(1/x)), -1/(20*pi+pi/2)) < -0.99 ;; SUB(sin(1/x)/(1+exp(1/x)), -1/(20*pi+3*pi/2)) > 0.99"
      ],
      [
        "左極限不存在（在 $-1$ 和 $1$ 之間振盪），所以這個極限不存在。",
        "SUB(sin(1/x)/(1+exp(1/x)), -1/(20*pi+3*pi/2)) - SUB(sin(1/x)/(1+exp(1/x)), -1/(20*pi+pi/2)) > 1.9"
      ]
    ],
    "trap": "只看右邊得到 $0$ 就答 $0$；或以為 $\\frac{\\sin}{\\text{大東西}}$ 兩邊都被壓住 —— 左邊分母趨近 $1$，壓不住。",
    "check": "對照：把分子換成 $1$，左極限是 $1$、右極限是 $0$，也不存在；這題左邊更糟，連左極限都沒有。"
  },
  "refine-limits-055": {
    "spot": "餘弦的角度每次減半：$\\cos\\frac\\theta2\\cos\\frac\\theta4\\cdots$，這是倍角公式 $\\sin2u=2\\sin u\\cos u$ 的伸縮乘積（韋達公式的型），$\\theta=\\frac\\pi3$。",
    "why": "乘上 $\\sin\\frac{\\theta}{2^n}$ 後倍角公式一路往回收，整串乘積縮成 $\\frac{\\sin\\theta}{2^n\\sin(\\theta/2^n)}$，不用一項一項估。",
    "steps": [
      [
        "伸縮：$\\prod_{k=1}^n\\cos\\frac{\\theta}{2^k}=\\frac{\\sin\\theta}{2^n\\sin(\\theta/2^n)}$（例如 $n=3$）。",
        "cos(t/2)*cos(t/4)*cos(t/8) == sin(t)/(8*sin(t/8))"
      ],
      [
        "$n\\to\\infty$：$2^n\\sin\\frac{\\theta}{2^n}\\to\\theta$（因為 $\\frac{\\sin u}{u}\\to1$）。這裡 $\\theta=\\frac\\pi3$。",
        "LIM(x*sin(pi/(3x)), inf) == pi/3"
      ],
      [
        "所以乘積 $\\to\\frac{\\sin\\theta}{\\theta}=\\frac{\\sqrt3/2}{\\pi/3}=\\frac{3\\sqrt3}{2\\pi}$。",
        "sin(pi/3)/(pi/3) == ANS"
      ]
    ],
    "trap": "看成每一項都 $<1$、無窮多項相乘就趨近 $0$：$\\cos\\frac{\\theta}{2^k}$ 趨近 $1$ 得很快（$1-\\cos u\\approx\\frac{u^2}{2}$ 可加），乘積收斂到正數。",
    "check": "答案 $\\approx0.827$；前兩項 $\\cos\\frac\\pi6\\cos\\frac\\pi{12}\\approx0.837$，後面每項都很接近 $1$，再降一點點，合理。"
  },
  "refine-limits-056": {
    "spot": "遞迴 $a_{n+1}=a_n+\\frac1{a_n}$ 平方後變乾淨：$a_{n+1}^2=a_n^2+2+\\frac{1}{a_n^2}$，$a_n^2$ 每步大約加 $2$，所以 $a_n^2\\approx2n$。",
    "why": "直接看 $a_n$ 的增量 $\\frac1{a_n}$ 會自我參照；平方後增量是常數 $2$ 加一個小尾巴，一加就是線性成長。",
    "steps": [
      [
        "平方：$\\left(a+\\frac1a\\right)^2=a^2+2+\\frac1{a^2}$。",
        "(x+1/x)^2 == x^2 + 2 + 1/x^2"
      ],
      [
        "從 $a_1^2=1$ 加起來：$a_n^2=2n-1+\\sum_{k=1}^{n-1}\\frac1{a_k^2}\\ge2n-1$。",
        "SUB((x+1/x)^2, 1) == 2*2 - 1 + 1"
      ],
      [
        "上界：$a_k^2\\ge2k-1\\ge k$，所以 $\\sum\\frac1{a_k^2}\\le\\sum\\frac1k\\le1+\\ln n$，$a_n^2\\le2n+\\ln n$。",
        "LIM((2x + ln(x))/x, inf) == 2"
      ],
      [
        "夾擠：$\\frac{a_n^2}{n}\\to2$，所以 $\\frac{a_n}{\\sqrt n}\\to\\sqrt2$。",
        "sqrt(LIM((2x-1)/x, inf)) == ANS"
      ]
    ],
    "trap": "以為 $a_n$ 遞增又加的東西越來越小，所以收斂到某個 $L$：若 $a_n\\to L$，代進遞迴得 $\\frac1L=0$，不可能，所以 $a_n\\to\\infty$。",
    "check": "$a_2=2$、$a_3=2.5$、$a_4=2.9$：$a_4^2=8.41\\approx2\\cdot4$，對得上。"
  },
  "refine-limits-057": {
    "spot": "固定點是 $1$（$L=2-\\frac1L\\Rightarrow L=1$，而且是重根），收斂很慢；令 $b_n=a_n-1$ 後遞迴變成 $b_{n+1}=\\frac{b_n}{1+b_n}$，取倒數就是等差。",
    "why": "重根的固定點不是幾何收斂，泰勒近似要很小心；倒數 $\\frac1{b_n}$ 每步正好加 $1$，可以寫出精確公式。",
    "steps": [
      [
        "$a_{n+1}-1=1-\\frac1{a_n}=\\frac{a_n-1}{a_n}$，令 $b_n=a_n-1$：$b_{n+1}=\\frac{b_n}{1+b_n}$。",
        "1 - 1/(1+x) == x/(1+x)"
      ],
      [
        "取倒數：$\\frac1{b_{n+1}}=\\frac1{b_n}+1$。",
        "1/(x/(1+x)) == 1/x + 1"
      ],
      [
        "$b_1=2$，所以 $\\frac1{b_n}=\\frac12+(n-1)=n-\\frac12$，即 $a_n-1=\\frac{1}{n-1/2}$。（檢查 $a_2=\\frac53$：$b_2=\\frac23=\\frac{1}{3/2}$）",
        "1/(2 - 1/3 - 1) == 2 - 1/2"
      ],
      [
        "$n(a_n-1)=\\frac{n}{n-1/2}\\to1$。",
        "LIM(x/(x-1/2), inf) == ANS"
      ]
    ],
    "trap": "以為 $a_n\\to1$ 是幾何收斂，$a_n-1\\approx Cr^n$，結果 $n(a_n-1)\\to0$：在固定點 $f(a)=2-\\frac1a$ 的導數 $f'(1)=1$，不是幾何收斂。",
    "check": "$a_3=2-\\frac35=\\frac75$，$b_3=\\frac25=\\frac{1}{5/2}$，正好是 $\\frac{1}{3-1/2}$。"
  },
  "refine-limits-058": {
    "spot": "兩個開根號底數一樣是 $2$、只差在 $\\frac1n$ 和 $\\frac1{n+1}$：提出 $2^{1/(n+1)}$ 後剩 $2^{1/(n(n+1))}-1\\approx\\frac{\\ln2}{n(n+1)}$，正好跟 $n^2$ 抵消。",
    "why": "$2^\\varepsilon-1\\approx\\varepsilon\\ln2$ 是這題唯一要的近似；指數差 $\\frac1n-\\frac1{n+1}=\\frac{1}{n(n+1)}$ 一提出來就看得到。",
    "steps": [
      [
        "提出公因數：$2^{1/n}-2^{1/(n+1)}=2^{1/(n+1)}\\left(2^{\\frac{1}{n(n+1)}}-1\\right)$。",
        "2^(1/x) - 2^(1/(x+1)) == 2^(1/(x+1))*(2^(1/(x*(x+1))) - 1)"
      ],
      [
        "$\\frac{2^\\varepsilon-1}{\\varepsilon}\\to\\ln2$（$\\varepsilon\\to0$）。",
        "LIM((2^x - 1)/x, 0) == ln(2)"
      ],
      [
        "所以 $n^2(\\cdots)\\approx2^{1/(n+1)}\\cdot\\frac{n^2}{n(n+1)}\\ln2\\to\\ln2$。",
        "LIM(x^2*(2^(1/x) - 2^(1/(x+1))), inf) == ANS"
      ]
    ],
    "trap": "兩個都 $\\to1$ 就說差是 $0$；或只乘 $n$，得到 $0$ —— 差的大小是 $\\frac{1}{n^2}$ 級，要乘 $n^2$ 才看得到 $\\ln2$。",
    "check": "也可以用均值定理：$g(t)=2^{t}$ 在 $\\frac1{n+1}$ 和 $\\frac1n$ 之間斜率約 $\\ln2$，乘上間距 $\\frac{1}{n(n+1)}$ 再乘 $n^2$，得 $\\ln2$。"
  },
  "refine-limits-059": {
    "spot": "$0^0$ 型：底數 $\\frac\\pi2-\\arctan x=\\arctan\\frac1x\\approx\\frac1x$，指數 $\\frac1{\\ln x}$；取對數後是 $\\frac{\\ln(1/x)}{\\ln x}=-1$。",
    "why": "指數上有變數就取對數；先把 $\\frac\\pi2-\\arctan x$ 換成 $\\arctan\\frac1x$，主項 $\\frac1x$ 一眼可見，比對整個式子用羅必達快。",
    "steps": [
      [
        "$x>0$ 時 $\\frac\\pi2-\\arctan x=\\arctan\\frac1x$。",
        "pi/2 - atan(x) == atan(1/x)"
      ],
      [
        "$x\\arctan\\frac1x\\to1$，所以 $\\ln\\arctan\\frac1x=-\\ln x+\\ln\\left(x\\arctan\\frac1x\\right)$，後一項 $\\to0$。",
        "LIM(x*atan(1/x), inf) == 1"
      ],
      [
        "除以 $\\ln x$：$\\frac{\\ln(\\pi/2-\\arctan x)}{\\ln x}\\to-1$。",
        "LIM(ln(pi/2 - atan(x))/ln(x), inf) == -1"
      ],
      [
        "還原：極限 $=e^{-1}$。",
        "exp(-1) == ANS"
      ]
    ],
    "trap": "看到底數 $\\to0$ 就答 $0$：指數 $\\frac1{\\ln x}$ 也趨近 $0$，$0^0$ 是未定型，要取對數算。",
    "check": "直覺版：底數 $\\approx\\frac1x=e^{-\\ln x}$，開 $\\ln x$ 次方根正好是 $e^{-1}$。"
  },
  "refine-limits-060": {
    "spot": "$f(x)=x^2$ 在 $x=3$ 兩側不對稱：往右 $x^2$ 長得比往左快，所以右邊先碰到 $9.07$ 的邊界 —— 兩側各算一個距離取小的。",
    "why": "題目要的是「最大」的 $\\delta$，不是隨便一個夠用的；直接解 $|x^2-9|<0.07$ 得到精確區間，比套 $\\delta=\\frac{\\varepsilon}{|x+3|}$ 這種估計精確。",
    "steps": [
      [
        "$|x^2-9|<0.07\\iff 8.93<x^2<9.07\\iff\\sqrt{8.93}<x<\\sqrt{9.07}$（$x$ 在 $3$ 附近為正）。",
        "SUB(x^2, sqrt(9.07)) == 9.07 ;; SUB(x^2, sqrt(8.93)) == 8.93"
      ],
      [
        "右邊的距離 $\\sqrt{9.07}-3\\approx0.011644$，左邊的距離 $3-\\sqrt{8.93}\\approx0.011711$。",
        "sqrt(9.07) - 3 < 3 - sqrt(8.93)"
      ],
      [
        "$\\delta$ 要讓對稱區間 $(3-\\delta,3+\\delta)$ 整個落在裡面，所以取較小的那個：$\\delta=\\sqrt{9.07}-3$。",
        "sqrt(9.07) - 3 == ANS"
      ]
    ],
    "trap": "用估計 $|x+3|\\approx6$ 取 $\\delta=\\frac{0.07}{6}\\approx0.011667$：比正確答案大一點點，在右邊靠近 $3+\\delta$ 的地方 $x^2$ 會超過 $9.07$，不成立。",
    "check": [
      "$\\frac{0.07}{6}$ 確實比答案大，所以那個估計太貪心。",
      "0.07/6 > ANS"
    ]
  },
  "refine-series-025": {
    "spot": "被加的東西只跟 $m+n$ 有關：按 $s=m+n$ 分組，每組有 $s-1$ 對 $(m,n)$，變成單一級數 $\\sum_{s\\ge2}\\frac{s-1}{s!}$。",
    "why": "雙重和直接加兩層都不好算；按對角線 $m+n=s$ 重排（正項可以重排），係數 $s-1$ 再拆成 $\\frac{1}{(s-1)!}-\\frac{1}{s!}$ 就伸縮掉了。",
    "steps": [
      [
        "$m,n\\ge1$ 且 $m+n=s$ 的對數：$m=1,\\dots,s-1$，共 $s-1$ 對。所以總和 $=\\sum_{s=2}^\\infty\\frac{s-1}{s!}$。",
        "SUB(n - 1, 5) == 4"
      ],
      [
        "拆：$\\frac{s-1}{s!}=\\frac{s}{s!}-\\frac1{s!}=\\frac1{(s-1)!}-\\frac1{s!}$。",
        "SUB(n/(n*(n-1)*(n-2)*(n-3)*(n-4)) - 1/(n*(n-1)*(n-2)*(n-3)*(n-4)), 5) == 4/120"
      ],
      [
        "伸縮：$\\sum_{s\\ge2}\\left(\\frac1{(s-1)!}-\\frac1{s!}\\right)=\\frac1{1!}=1$。用 $s!=\\int_0^\\infty t^se^{-t}\\,dt$ 直接加也是 $1$。",
        "SUM((n-1)/INT(t^n*exp(-t), 0, inf, t), 2) == ANS"
      ]
    ],
    "trap": "以為每組只有一對，算成 $\\sum_{s\\ge2}\\frac1{s!}=e-2$；或把每組數成 $s+1$ 對（誤把 $m,n$ 從 $0$ 開始）。",
    "check": "也可以先對 $n$ 加：$\\sum_n\\frac1{(m+n)!}$ 是 $e$ 的尾巴，再對 $m$ 加，結果一樣是 $(e-1)-(e-2)=1$。"
  },
  "refine-series-034": {
    "spot": "中心二項係數 $\\binom{2n}{n}$ 配幾何因子 $x^n$：這是生成函數 $\\sum\\binom{2n}{n}x^n=\\frac{1}{\\sqrt{1-4x}}$，代 $x=\\frac18$。",
    "why": "$\\binom{2n}{n}$ 這個係數看到就想 $(1-4x)^{-1/2}$；不認得的話只能逐項加，收斂又不算快。",
    "steps": [
      [
        "二項展開：$(1-4x)^{-1/2}=\\sum_{n\\ge0}\\binom{2n}{n}x^n$。檢查前幾項：一次係數 $\\binom21=2$、二次係數 $\\binom42=6$。",
        "D(1/sqrt(1-4x), 0) == 2 ;; D2(1/sqrt(1-4x), 0) == 2*6"
      ],
      [
        "收斂半徑 $\\frac14$，$x=\\frac18$ 在裡面。",
        "1/8 < 1/4"
      ],
      [
        "代入：$\\frac{1}{\\sqrt{1-4/8}}=\\frac{1}{\\sqrt{1/2}}=\\sqrt2$。",
        "1/sqrt(1 - 4/8) == ANS"
      ]
    ],
    "trap": "把生成函數記成 $\\frac{1}{1-4x}$（少了根號），答 $2$；或代成 $\\frac{1}{\\sqrt{1-x}}$，答 $\\sqrt{8/7}$。",
    "check": [
      "另一條路：$\\frac{\\binom{2n}{n}}{4^n}=\\frac2\\pi\\int_0^{\\pi/2}\\sin^{2n}t\\,dt$，加成幾何級數得 $\\frac2\\pi\\int_0^{\\pi/2}\\frac{dt}{1-\\frac12\\sin^2t}$，也是 $\\sqrt2$。",
      "(2/pi)*INT(1/(1 - sin(t)^2/2), 0, pi/2, t) == ANS"
    ]
  },
  "ser-015": {
    "spot": "$n^2$ 乘幾何因子 $\\left(\\frac12\\right)^n$：從 $\\sum x^n$ 出發，「微分再乘 $x$」做兩次就生出 $n^2x^n$。",
    "why": "多項式乘幾何就是對幾何級數做 $x\\frac{d}{dx}$；比拆成兩個級數再各自錯位相減快。",
    "steps": [
      [
        "$\\sum_{n\\ge1}x^n=\\frac{x}{1-x}$。做一次 $x\\frac{d}{dx}$：$\\sum nx^n=\\frac{x}{(1-x)^2}$。",
        "x*D(x/(1-x)) == x/(1-x)^2"
      ],
      [
        "再做一次：$\\sum n^2x^n=x\\frac{d}{dx}\\frac{x}{(1-x)^2}=\\frac{x(1+x)}{(1-x)^3}$。",
        "x*D(x/(1-x)^2) == x*(1+x)/(1-x)^3"
      ],
      [
        "代 $x=\\frac12$：$\\frac{\\frac12\\cdot\\frac32}{\\frac18}=6$。",
        "SUB(x*(1+x)/(1-x)^3, 1/2) == ANS ;; SUM(n^2/2^n, 1) == ANS"
      ]
    ],
    "trap": "只做一次 $x\\frac{d}{dx}$，得到 $\\sum n x^n$ 在 $\\frac12$ 的值 $2$；$n^2$ 要做兩次。",
    "check": "前幾項 $\\frac12+1+\\frac98+1+\\frac{25}{32}\\approx4.41$，後面還有不少，加到 $6$ 合理。"
  },
  "tr-err-003": {
    "spot": "要的是「實際誤差的最大值」，不是誤差上界：$g(x)=\\cos x-1+\\frac{x^2}{2}$ 在 $[0,\\frac12]$ 上單調，最大值落在端點 $x=\\frac12$。",
    "why": "拉格朗日餘項只給上界 $\\frac{x^4}{24}$，不是精確的最大值；直接看 $g$ 的單調性，最大值就是 $g(\\frac12)$。",
    "steps": [
      [
        "令 $g(x)=\\cos x-\\left(1-\\frac{x^2}{2}\\right)$，$g(0)=0$。",
        "SUB(cos(x) - 1 + x^2/2, 0) == 0"
      ],
      [
        "$g'(x)=x-\\sin x\\ge0$（$\\sin x\\le x$），所以 $g$ 遞增、而且 $g\\ge0$。",
        "D(cos(x) - 1 + x^2/2) == x - sin(x) ;; x - sin(x) > 0"
      ],
      [
        "最大值在 $x=\\frac12$：$\\cos\\frac12-1+\\frac18=\\cos\\frac12-\\frac78$。",
        "SUB(cos(x) - 1 + x^2/2, 1/2) == ANS"
      ]
    ],
    "trap": "答餘項上界 $\\frac{(1/2)^4}{24}=\\frac{1}{384}\\approx0.002604$：那是上界，實際最大值 $\\approx0.002583$ 比它小。",
    "check": [
      "實際值比上界 $\\frac1{384}$ 小、又比下一項以後的估計 $\\frac{1}{384}-\\frac{(1/2)^6}{720}$ 大。",
      "ANS < 1/384 ;; ANS > 1/384 - 1/(64*720)"
    ]
  },
  "tr-err-004": {
    "spot": "問「實際誤差」：先寫出二階泰勒多項式 $x-\\frac{x^2}{2}$，在 $x=\\frac12$ 算出 $\\frac38$，再拿真值 $\\ln\\frac32$ 去減。",
    "why": "實際誤差就是真值減近似值，有真值就直接相減；用拉格朗日餘項只會得到上界。",
    "steps": [
      [
        "$\\ln(1+x)$ 在 $0$：$f(0)=0$、$f'(0)=1$、$f''(0)=-1$，所以 $P_2(x)=x-\\frac{x^2}{2}$。",
        "D(ln(1+x), 0) == 1 ;; D2(ln(1+x), 0) == -1"
      ],
      [
        "$P_2\\left(\\frac12\\right)=\\frac12-\\frac18=\\frac38$。",
        "SUB(x - x^2/2, 1/2) == 3/8"
      ],
      [
        "實際誤差 $=\\ln\\frac32-\\frac38\\approx0.0305$。",
        "ln(3/2) - SUB(x - x^2/2, 1/2) == ANS"
      ]
    ],
    "trap": "把二階多項式寫成 $x-x^2$（忘了 $\\frac{f''(0)}{2!}$ 的 $2!$），近似值變 $\\frac14$，誤差算成 $0.155$。",
    "check": [
      "交錯級數：誤差介於下一項 $\\frac{(1/2)^3}{3}=\\frac1{24}$ 和 $\\frac1{24}-\\frac{(1/2)^4}{4}$ 之間。",
      "ANS < 1/24 ;; ANS > 1/24 - 1/64"
    ]
  },
  "tr-err-005": {
    "spot": "$\\frac1{1-x}$ 的泰勒多項式就是幾何級數截斷 $1+x+x^2+x^3$，扣掉的尾巴有精確公式 $\\frac{x^4}{1-x}$。",
    "why": "幾何級數的餘項可以精確加總，不用拉格朗日估計；直接相減也只要算 $1.25-1.248$。",
    "steps": [
      [
        "$P_3(x)=1+x+x^2+x^3$，誤差 $\\frac1{1-x}-P_3(x)=\\frac{x^4}{1-x}$。",
        "1/(1-x) - (1+x+x^2+x^3) == x^4/(1-x)"
      ],
      [
        "$x=0.2$：真值 $\\frac{1}{0.8}=1.25$，近似值 $1+0.2+0.04+0.008=1.248$。",
        "SUB(1+x+x^2+x^3, 0.2) == 1.248"
      ],
      [
        "誤差 $=\\frac{0.0016}{0.8}=0.002=\\frac{1}{500}$。",
        "SUB(x^4/(1-x), 0.2) == ANS"
      ]
    ],
    "trap": "以為誤差就是下一項 $x^4=0.0016$：後面還有 $x^5+x^6+\\cdots$，全部加起來是 $\\frac{x^4}{1-x}=0.002$。",
    "check": "$1.25-1.248=0.002$，跟公式一致。"
  },
  "world-076": {
    "spot": "被積函數是 $\\arctan x$ 乘上它自己的導數 $\\frac{1}{1+x^2}$：$u\\,du$ 的形狀，令 $u=\\arctan x$。",
    "why": "看到「函數乘自己的導數」就換元，瑕積分順便變成 $u$ 從 $0$ 到 $\\frac\\pi2$ 的正常積分，連極限都不用另外取。",
    "steps": [
      [
        "令 $u=\\arctan x$，$du=\\frac{dx}{1+x^2}$；$x:0\\to\\infty$ 對應 $u:0\\to\\frac\\pi2$。",
        "D(atan(x)) == 1/(1+x^2) ;; LIM(atan(x), inf) == pi/2"
      ],
      [
        "積分變成 $\\int_0^{\\pi/2}u\\,du=\\frac{u^2}{2}\\Big|_0^{\\pi/2}$。",
        "D(atan(x)^2/2) == atan(x)/(1+x^2)"
      ],
      [
        "$=\\frac{1}{2}\\cdot\\frac{\\pi^2}{4}=\\frac{\\pi^2}{8}$。",
        "INT(u, 0, pi/2, u) == ANS"
      ]
    ],
    "trap": "上限代成 $u=\\arctan\\infty$ 時寫成 $\\pi$，答 $\\frac{\\pi^2}{2}$；$\\arctan$ 的極限是 $\\frac\\pi2$。",
    "check": [
      "直接數值積分原式也是 $\\frac{\\pi^2}{8}\\approx1.234$。",
      "INT(atan(x)/(1+x^2), 0, inf) == ANS"
    ]
  },
  "an-sr-002": {
    "spot": "$a_n=\\frac{1}{n\\ln n}$ 遞減為正，凝聚只要把 $n$ 換成 $2^k$：$2^k\\cdot\\frac{1}{2^k\\ln 2^k}$，$2^k$ 消掉、$\\ln2^k=k\\ln2$。",
    "why": "凝聚判別把 $\\ln n$ 變成 $k\\ln2$，對數級數立刻變成調和級數；比積分判別少一次換元。",
    "steps": [
      [
        "$a_{2^k}=\\frac{1}{2^k\\ln(2^k)}$，乘上 $2^k$：$2^ka_{2^k}=\\frac{1}{\\ln(2^k)}$。",
        "2^k*(1/(2^k*ln(2^k))) == 1/ln(2^k)"
      ],
      [
        "$\\ln(2^k)=k\\ln2$，所以 $2^ka_{2^k}=\\frac{1/\\ln2}{k}$。",
        "1/ln(2^k) == (1/ln(2))/k"
      ],
      [
        "所以 $c=\\frac{1}{\\ln2}$（凝聚後是調和級數的常數倍，原級數發散）。",
        "1/ln(2) == ANS"
      ]
    ],
    "trap": "忘了乘 $2^k$，只寫 $a_{2^k}=\\frac{1}{2^kk\\ln2}$：那是收斂的，會誤判原級數收斂，常數也讀不出來。",
    "check": "$c=\\frac1{\\ln2}\\approx1.443$；$k=3$ 時 $2^3a_8=\\frac{1}{\\ln8}\\approx0.481=\\frac{1.443}{3}$。"
  },
  "ch-nest-007": {
    "spot": "三層：最外面 $(\\cdot)^3$、中間 $\\sin(\\cdot)$、最裡面 $\\cos^2x$（它自己又是 $(\\cos x)^2$）—— 鏈鎖律由外往內一層一層剝。",
    "why": "每一層都是基本函數，照順序乘上各層導數最穩；先展開或化簡反而更亂。",
    "steps": [
      [
        "最外層：$\\frac{d}{dx}u^3=3u^2u'$，$u=\\sin(\\cos^2x)$。",
        "D(x^3) == 3x^2"
      ],
      [
        "中間層：$\\frac{d}{dx}\\sin(v)=\\cos(v)\\,v'$，$v=\\cos^2x$。",
        "D(sin(cos(x)^2)) == cos(cos(x)^2)*D(cos(x)^2)"
      ],
      [
        "最裡層：$(\\cos^2x)'=2\\cos x\\cdot(-\\sin x)=-2\\cos x\\sin x$。",
        "D(cos(x)^2) == -2cos(x)*sin(x)"
      ],
      [
        "乘起來：$-6\\sin^2(\\cos^2x)\\cos(\\cos^2x)\\cos x\\sin x$。",
        "D(sin(cos(x)^2)^3) == ANS"
      ]
    ],
    "trap": "最裡層只寫 $2\\cos x$（漏了 $\\cos x$ 的導數 $-\\sin x$），答案少一個 $-\\sin x$，正負號也跟著錯。",
    "check": "$x=0$ 時 $\\cos^2x$ 有極大、導數為 $0$，所以整個導數在 $x=0$ 也該是 $0$；答案裡有 $\\sin x$ 因子，對。"
  },
  "ch-nest-014": {
    "spot": "形狀是 $\\left(1+\\sin^2(e^x)\\right)^{-1/2}$：外層冪次 $-\\frac12$，裡面 $\\sin^2$ 套 $e^x$，一共四層。",
    "why": "先把根號倒數寫成 $-\\frac12$ 次方，再用鏈鎖律；用商法則對 $1$ 除以根號只會多繞一圈。",
    "steps": [
      [
        "外層：$\\frac{d}{dx}w^{-1/2}=-\\frac12w^{-3/2}w'$，$w=1+\\sin^2(e^x)$。",
        "D(x^(-1/2)) == -1/2*x^(-3/2)"
      ],
      [
        "$w'=2\\sin(e^x)\\cos(e^x)\\cdot e^x$（$\\sin^2$ 給 $2\\sin\\cos$，$e^x$ 給 $e^x$）。",
        "D(1 + sin(exp(x))^2) == 2sin(exp(x))*cos(exp(x))*exp(x)"
      ],
      [
        "乘起來，$-\\frac12$ 和 $2$ 消掉：$-\\frac{e^x\\sin(e^x)\\cos(e^x)}{(1+\\sin^2(e^x))^{3/2}}$。",
        "D(1/sqrt(1 + sin(exp(x))^2)) == ANS"
      ]
    ],
    "trap": "冪次減一減錯：$-\\frac12-1$ 寫成 $\\frac12$，分母變成 $\\sqrt{1+\\sin^2(e^x)}$，少了一次方。",
    "check": "$1+\\sin^2$ 越大，原函數越小；分子的 $\\sin\\cos$ 為正時（$w$ 在變大）導數為負，方向一致。"
  },
  "cl-int-044": {
    "spot": "繞自身中心軸轉的圓錐：橫切成一片片圓盤，每片圓盤繞中心的轉動慣量是 $\\frac12(\\text{質量})(\\text{半徑})^2$，半徑隨高度線性縮小。",
    "why": "圓盤切片只要一個單變數積分；用柱殼或三重積分也行，但要多寫一層。",
    "steps": [
      [
        "底面放在 $z=0$：高度 $z$ 處半徑 $\\rho(z)=1-\\frac z3$。",
        "SUB(1 - z/3, 3) == 0"
      ],
      [
        "厚 $dz$ 的圓盤質量 $\\pi\\rho^2dz$，轉動慣量 $\\frac12\\pi\\rho^2dz\\cdot\\rho^2=\\frac\\pi2\\rho^4dz$。",
        "INT((1 - z/3)^4, 0, 3, z) == 3/5"
      ],
      [
        "$I=\\frac\\pi2\\int_0^3\\left(1-\\frac z3\\right)^4dz=\\frac\\pi2\\cdot\\frac35=\\frac{3\\pi}{10}$。",
        "(pi/2)*INT((1 - z/3)^4, 0, 3, z) == ANS"
      ]
    ],
    "trap": "把每片圓盤當成圓環，用 $\\rho^2\\cdot(\\text{質量})$ 而不是 $\\frac12\\rho^2\\cdot(\\text{質量})$，答案變成兩倍 $\\frac{3\\pi}{5}$。",
    "check": [
      "公式 $I=\\frac{3}{10}MR^2$，$M=\\frac13\\pi R^2h=\\pi$，得 $\\frac{3\\pi}{10}$。",
      "(3/10)*(pi*1^2*3/3)*1^2 == ANS"
    ]
  },
  "cl-lim-009": {
    "spot": "$(1+\\frac1n)^n$ 從下面逼近 $e$；取對數 $n\\ln(1+\\frac1n)=1-\\frac{1}{2n}+\\cdots$，差的就是那個 $-\\frac1{2n}$。",
    "why": "要的是誤差的主項，泰勒展開 $\\ln(1+t)=t-\\frac{t^2}{2}+\\cdots$ 一行給出；直接用羅必達處理 $n\\left(e-(1+\\frac1n)^n\\right)$ 會很亂。",
    "steps": [
      [
        "$n\\ln(1+\\frac1n)=1-\\frac{1}{2n}+O(\\frac{1}{n^2})$。",
        "LIM(x*(x*ln(1+1/x) - 1), inf) == -1/2"
      ],
      [
        "所以 $(1+\\frac1n)^n=e\\cdot e^{-\\frac1{2n}+\\cdots}=e\\left(1-\\frac1{2n}+\\cdots\\right)$。",
        "LIM(x*(1 - exp(x*ln(1+1/x) - 1)), inf) == 1/2"
      ],
      [
        "$e-(1+\\frac1n)^n\\approx\\frac{e}{2n}$，所以 $c=\\frac e2$。",
        "LIM(x*(exp(1) - (1+1/x)^x), inf) == ANS"
      ]
    ],
    "trap": "以為 $(1+\\frac1n)^n$ 跟 $e$ 的差是 $\\frac1{2n}$，答 $c=\\frac12$：相對誤差是 $\\frac1{2n}$，絕對誤差要再乘 $e$。",
    "check": "$n=100$：$e-(1.01)^{100}\\approx0.01346$，而 $\\frac{e}{200}\\approx0.01359$，很接近。"
  },
  "cl-lim-019": {
    "spot": "$|\\sin t|$ 週期 $\\pi$，每個週期面積都是 $2$：所以 $\\int_0^x|\\sin t|\\,dt$ 大約是 $\\frac{2x}{\\pi}$，平均值 $\\frac2\\pi$。",
    "why": "週期函數的長期平均就是一個週期的平均；用 $x$ 落在哪個週期 $[m\\pi,(m+1)\\pi)$ 夾擠就嚴謹了。",
    "steps": [
      [
        "一個週期的面積：$\\int_0^\\pi|\\sin t|\\,dt=2$。",
        "INT(abs(sin(t)), 0, pi, t) == 2"
      ],
      [
        "$m\\pi\\le x<(m+1)\\pi$ 時，$2m\\le\\int_0^x|\\sin t|\\,dt\\le2m+2$。",
        "INT(abs(sin(t)), 0, pi, t) + INT(abs(sin(t)), pi, 2*pi, t) == 4"
      ],
      [
        "除以 $x$：$\\frac{2m}{(m+1)\\pi}\\le\\frac1x\\int_0^x|\\sin t|\\,dt\\le\\frac{2m+2}{m\\pi}$，兩邊 $m\\to\\infty$ 都趨近 $\\frac2\\pi$。",
        "LIM(2x/((x+1)*pi), inf) == ANS ;; LIM((2x+2)/(x*pi), inf) == ANS"
      ]
    ],
    "trap": "去掉絕對值算 $\\int_0^x\\sin t\\,dt=1-\\cos x$，除以 $x$ 得 $0$：絕對值讓每一拱都正貢獻，不會互相抵消。",
    "check": "$|\\sin t|$ 介於 $0$ 和 $1$，平均 $\\frac2\\pi\\approx0.637$ 落在中間偏上，合理（拱形比三角形胖）。"
  },
  "cl-lim-036": {
    "spot": "遞迴裡出現 $e^{-x_n}$，而題目問 $e^{x_n}$：令 $y_n=e^{x_n}$，遞迴變成 $y_{n+1}=y_ne^{1/y_n}$，每步增量 $y(e^{1/y}-1)\\to1$。",
    "why": "換成 $y_n$ 後增量趨近常數 $1$，用施篤茲（離散羅必達）$\\frac{y_n}{n}\\to\\lim(y_{n+1}-y_n)$ 一步到位。",
    "steps": [
      [
        "$y_{n+1}=e^{x_n+e^{-x_n}}=y_ne^{1/y_n}$，增量 $y_{n+1}-y_n=y_n\\left(e^{1/y_n}-1\\right)>1$。",
        "x*(exp(1/x) - 1) > 1"
      ],
      [
        "所以 $y_n\\ge n$，$y_n\\to\\infty$，增量 $\\to\\lim_{y\\to\\infty}y(e^{1/y}-1)=1$。",
        "LIM(x*(exp(1/x) - 1), inf) == 1"
      ],
      [
        "施篤茲定理：$\\frac{y_n}{n}\\to1$，也就是 $\\frac{e^{x_n}}{n}\\to1$。",
        "LIM(x*(exp(1/x) - 1), inf) == ANS"
      ]
    ],
    "trap": "以為 $x_n$ 增量 $e^{-x_n}$ 越來越小，$x_n$ 會收斂：若 $x_n\\to L$，代進遞迴得 $e^{-L}=0$，矛盾；$x_n$ 像 $\\ln n$ 一樣慢慢發散。",
    "check": "$y_1=1$、$y_2=e\\approx2.72$、$y_3=e\\cdot e^{1/e}\\approx3.93$，大約每步加 $1$ 多一點，對得上 $y_n\\approx n$。"
  },
  "cl-lim-038": {
    "spot": "增量是 $\\sqrt{a_n}$，題目問 $\\frac{a_n}{n^2}$：看 $b_n=\\sqrt{a_n}$，它每步大約加 $\\frac12$，所以 $\\sqrt{a_n}\\approx\\frac n2$。",
    "why": "對 $\\sqrt{a_n}$ 有理化，增量 $\\sqrt{a+\\sqrt a}-\\sqrt a\\to\\frac12$，施篤茲直接給 $\\frac{\\sqrt{a_n}}{n}\\to\\frac12$。",
    "steps": [
      [
        "有理化：$\\sqrt{a+\\sqrt a}-\\sqrt a=\\frac{\\sqrt a}{\\sqrt{a+\\sqrt a}+\\sqrt a}$。",
        "sqrt(x + sqrt(x)) - sqrt(x) == sqrt(x)/(sqrt(x + sqrt(x)) + sqrt(x))"
      ],
      [
        "$a_n\\ge1$ 遞增且每步至少加 $1$，所以 $a_n\\to\\infty$，增量 $\\to\\frac12$。",
        "LIM(sqrt(x + sqrt(x)) - sqrt(x), inf) == 1/2"
      ],
      [
        "施篤茲：$\\frac{\\sqrt{a_n}}{n}\\to\\frac12$，平方得 $\\frac{a_n}{n^2}\\to\\frac14$。",
        "LIM(sqrt(x + sqrt(x)) - sqrt(x), inf)^2 == ANS"
      ]
    ],
    "trap": "用連續版 $a'=\\sqrt a$ 解出 $a=\\frac{t^2}{4}$ 是對的，但若把增量當成 $\\sqrt{a_1}=1$ 不變，得 $a_n\\approx n$、極限 $0$，錯。",
    "check": "$a_1=1$、$a_2=2$、$a_3\\approx3.41$、$a_4\\approx5.26$…；$n=4$ 時 $\\frac{n^2}{4}=4$，同一個量級，越後面越準。"
  },
  "cl-lim-042": {
    "spot": "乘積開 $n$ 次方根，因子是 $2+\\frac kn$：取對數就是 $\\frac1n\\sum\\ln\\left(2+\\frac kn\\right)$，$\\int_0^1\\ln(2+x)\\,dx$ 的黎曼和。",
    "why": "幾何平均取對數變算術平均，算術平均的極限是積分；乘積本身沒辦法直接化簡。",
    "steps": [
      [
        "$\\ln P_n=\\frac1n\\sum_{k=1}^n\\ln\\left(2+\\frac kn\\right)\\to\\int_0^1\\ln(2+x)\\,dx$。",
        "INT(ln(2+x), 0, 1) > 0"
      ],
      [
        "反導數：$(2+x)\\ln(2+x)-x$。",
        "D((2+x)*ln(2+x) - x) == ln(2+x)"
      ],
      [
        "代 $0$ 到 $1$：$3\\ln3-1-2\\ln2$。",
        "INT(ln(2+x), 0, 1) == 3ln(3) - 2ln(2) - 1"
      ],
      [
        "還原：$e^{3\\ln3-2\\ln2-1}=\\frac{27}{4e}$。",
        "exp(3ln(3) - 2ln(2) - 1) == ANS"
      ]
    ],
    "trap": "反導數寫成 $x\\ln(2+x)-x$（把 $\\int\\ln(2+x)$ 當成 $\\int\\ln x$ 的公式直接套），代下限時漏掉 $-2\\ln2$，答成 $\\frac{3}{e}$。",
    "check": "因子介於 $2$ 和 $3$，幾何平均該在 $2$ 和 $3$ 之間；$\\frac{27}{4e}\\approx2.48$，合理。"
  },
  "cl-lim-046": {
    "spot": "$1^\\infty$ 型：括號 $\\to1$、指數 $n\\to\\infty$。$2^{1/n}\\approx1+\\frac{\\ln2}{n}$，平均起來 $\\approx1+\\frac{\\ln2+\\ln8}{2n}$。",
    "why": "$1^\\infty$ 一律取對數；括號裡每一項做一階近似，平均的一階項就是指數，比整個羅必達省事。",
    "steps": [
      [
        "$a^{1/n}=e^{\\ln a/n}\\approx1+\\frac{\\ln a}{n}$，所以括號 $\\approx1+\\frac{\\ln2+\\ln8}{2n}=1+\\frac{2\\ln2}{n}$。",
        "(ln(2) + ln(8))/2 == 2ln(2)"
      ],
      [
        "$n\\ln(\\text{括號})\\to2\\ln2$。",
        "LIM(x*ln((2^(1/x) + 8^(1/x))/2), inf) == 2ln(2)"
      ],
      [
        "還原：$e^{2\\ln2}=4$（正好是 $2$ 和 $8$ 的幾何平均）。",
        "exp(2ln(2)) == ANS"
      ]
    ],
    "trap": "括號趨近 $1$ 就答 $1$；或把 $\\frac{2+8}{2}=5$ 當答案 —— $1^\\infty$ 型看的是一階項，結果是幾何平均 $\\sqrt{2\\cdot8}=4$。",
    "check": "一般結論：$\\left(\\frac{a^{1/n}+b^{1/n}}{2}\\right)^n\\to\\sqrt{ab}$，$\\sqrt{16}=4$。"
  },
  "cl-lim-049": {
    "spot": "被積函數 $n\\left((1+x)^{1/n}-1\\right)$ 對每個 $x$ 都趨近 $\\ln(1+x)$（$\\frac{a^t-1}{t}\\to\\ln a$）—— 把極限搬進積分號。",
    "why": "逐點極限一眼看出；用 $e^u-1$ 夾在 $u$ 和 $ue^u$ 之間給上下界，搬極限就有根據，不用真的算出 $(1+x)^{1/n}$ 的積分。",
    "steps": [
      [
        "令 $u=\\frac{\\ln(1+x)}{n}$：$n\\left((1+x)^{1/n}-1\\right)=\\frac{e^u-1}{u}\\ln(1+x)$。",
        "LIM((exp(x) - 1)/x, 0) == 1"
      ],
      [
        "$u\\le e^u-1\\le ue^u$，而 $e^u\\le2^{1/n}$，所以被積函數夾在 $\\ln(1+x)$ 和 $2^{1/n}\\ln(1+x)$ 之間（$n=100$ 驗一下）。",
        "SUB(n*INT((1+x)^(1/n) - 1, 0, 1, x), 100, n) > ANS ;; SUB(n*INT((1+x)^(1/n) - 1, 0, 1, x), 100, n) < 2^(1/100)*ANS"
      ],
      [
        "夾擠：極限 $=\\int_0^1\\ln(1+x)\\,dx=\\left[(1+x)\\ln(1+x)-x\\right]_0^1=2\\ln2-1$。",
        "D((1+x)*ln(1+x) - x) == ln(1+x) ;; INT(ln(1+x), 0, 1) == ANS"
      ]
    ],
    "trap": "看到 $(1+x)^{1/n}\\to1$ 就說積分 $\\to0$：前面乘了 $n$，是 $0\\cdot\\infty$。",
    "check": "答案 $2\\ln2-1\\approx0.386$；$\\ln(1+x)$ 在 $[0,1]$ 介於 $0$ 和 $\\ln2\\approx0.693$，平均在中間，合理。"
  },
  "cl-ser-015": {
    "spot": "分子 $n$、分母 $(2n+1)!$：把 $n$ 寫成 $\\frac{(2n+1)-1}{2}$，就拆成 $\\frac{1}{(2n)!}$ 和 $\\frac1{(2n+1)!}$ 兩條 —— 正是 $\\cosh1$ 和 $\\sinh1$ 的級數。",
    "why": "分子跟分母的階乘「對齊」後直接約分，剩下的是熟悉的偶、奇次項和；比找生成函數再微分積分快。",
    "steps": [
      [
        "$n=\\frac{(2n+1)-1}{2}$，所以 $\\frac{n}{(2n+1)!}=\\frac12\\left(\\frac{1}{(2n)!}-\\frac{1}{(2n+1)!}\\right)$。",
        "n == ((2n+1) - 1)/2"
      ],
      [
        "$\\sum_{n\\ge1}\\frac{1}{(2n)!}=\\cosh1-1$（用 $m!=\\int_0^\\infty t^me^{-t}\\,dt$ 驗算）。",
        "SUM(1/INT(t^(2n)*exp(-t), 0, inf, t), 1) == cosh(1) - 1"
      ],
      [
        "$\\sum_{n\\ge1}\\frac{1}{(2n+1)!}=\\sinh1-1$。",
        "SUM(1/INT(t^(2n+1)*exp(-t), 0, inf, t), 1) == sinh(1) - 1"
      ],
      [
        "相減除以 $2$：$\\frac12(\\cosh1-\\sinh1)=\\frac{e^{-1}}{2}$。",
        "(cosh(1) - 1 - (sinh(1) - 1))/2 == ANS"
      ]
    ],
    "trap": "把 $\\sum_{n\\ge1}\\frac1{(2n)!}$ 寫成 $\\cosh1$（忘了扣 $n=0$ 那項 $1$）：兩個 $-1$ 剛好抵消，這題沒差，但單獨算其中一條就錯了。",
    "check": [
      "直接加原級數也得 $\\frac{1}{2e}\\approx0.184$；第一項 $\\frac16$ 就占了大部分。",
      "SUM(n/INT(t^(2n+1)*exp(-t), 0, inf, t), 1) == ANS"
    ]
  },
  "cl-ser-019": {
    "spot": "尾巴是幾何級數，可以加成閉式 $R_5(x)=\\frac{xe^{-6x}}{1-e^{-x}}$；$x\\to0^+$ 時分母 $\\approx x$，整個趨近 $1$ —— 最壞的地方在左端點附近。",
    "why": "先把尾巴寫成閉式，再用 $e^x-1>x$ 一行證明它永遠小於 $1$，上確界就是 $x\\to0^+$ 的極限；不必微分找臨界點。",
    "steps": [
      [
        "幾何級數：$\\sum_{n\\ge6}xe^{-nx}=\\frac{xe^{-6x}}{1-e^{-x}}=\\frac{xe^{-5x}}{e^x-1}$。",
        "SUM(x*exp(-n*x), 6) == x*exp(-6x)/(1 - exp(-x)) ;; x*exp(-6x)/(1 - exp(-x)) == x*exp(-5x)/(exp(x) - 1)"
      ],
      [
        "$e^x-1>x$，所以 $R_5(x)<e^{-5x}<1$ 對所有 $x>0$。",
        "exp(x) - 1 > x ;; x*exp(-5x)/(exp(x) - 1) < 1"
      ],
      [
        "$x\\to0^+$：$\\frac{x}{e^x-1}\\to1$、$e^{-5x}\\to1$，所以 $R_5(x)\\to1$，上確界 $=1$（取不到）。",
        "LIM(x*exp(-6x)/(1 - exp(-x)), 0+) == ANS"
      ]
    ],
    "trap": "看到每一項在 $x=0$ 是 $0$，就以為 $R_5(0^+)=0$、上確界在中間某個臨界點：無窮多個小項加起來，靠近 $0$ 時總和趨近 $1$。",
    "check": "這說明對任何 $N$ 都有 $\\sup R_N=1$，不趨近 $0$，所以這個級數在 $(0,\\infty)$ 上不是一致收斂。"
  },
  "cl-ser-021": {
    "spot": "$\\ln(1+x)$ 的餘項有精確積分式 $R_N(x)=\\pm\\int_0^x\\frac{t^N}{1+t}\\,dt$，它隨 $x$ 遞增，最壞的點是 $x=1$。",
    "why": "交錯級數估計只給上界 $\\frac{1}{N+1}$，會要 $N=100$，太保守；用積分式在 $x=1$ 精確算，才找得到「最小」的 $N$。",
    "steps": [
      [
        "$\\frac{1}{1+t}=1-t+\\cdots+(-t)^{N-1}+\\frac{(-t)^N}{1+t}$（例如 $N=3$），從 $0$ 積到 $x$：$\\ln(1+x)-S_N(x)=\\int_0^x\\frac{(-t)^N}{1+t}\\,dt$。",
        "1/(1+t) - (1 - t + t^2) == -t^3/(1+t)"
      ],
      [
        "絕對值 $\\int_0^x\\frac{t^N}{1+t}\\,dt$ 對 $x$ 遞增，所以上確界在 $x=1$：$E_N=\\int_0^1\\frac{t^N}{1+t}\\,dt\\approx\\frac{1}{2N}$。",
        "INT(t^50/(1+t), 0, 1, t) > 0"
      ],
      [
        "$N=50$：$E_{50}<0.01$，夠了。",
        "INT(t^50/(1+t), 0, 1, t) < 0.01"
      ],
      [
        "$N=49$：$E_{49}>0.01$，不夠。所以最小的 $N=50$。",
        "INT(t^49/(1+t), 0, 1, t) > 0.01 ;; 50 == ANS"
      ]
    ],
    "trap": "用交錯級數的上界「下一項 $\\frac{1}{N+1}<0.01$」得 $N=100$：那只是保證夠，不是最小；實際誤差大約只有下一項的一半。",
    "check": "$x=1$ 時誤差就是 $|\\ln2-S_N|$，大約 $\\frac{1}{2N+1}$：$N=50$ 給 $0.0099$、$N=49$ 給 $0.0101$，剛好跨過 $0.01$。"
  },
  "cl-ser-022": {
    "spot": "一般項 $\\frac{x}{(1+(n-1)x)(1+nx)}$ 分母是相鄰兩個 $1+kx$：部分分式後伸縮，$S_N(x)=1-\\frac{1}{1+Nx}$，誤差有精確公式。",
    "why": "伸縮後誤差就是 $\\frac{1}{1+Nx}$，在區間上的最大值在左端點 $x=\\frac14$，直接解不等式，不用估計。",
    "steps": [
      [
        "部分分式：$\\frac{x}{(1+(n-1)x)(1+nx)}=\\frac{1}{1+(n-1)x}-\\frac{1}{1+nx}$。",
        "x/((1+(n-1)x)(1+n*x)) == 1/(1+(n-1)x) - 1/(1+n*x)"
      ],
      [
        "伸縮：$S_N(x)=1-\\frac{1}{1+Nx}$，$x>0$ 時 $S(x)=1$，誤差 $=\\frac{1}{1+Nx}$。",
        "LIM(1/(1+x*0.25), inf) == 0"
      ],
      [
        "誤差對 $x$ 遞減，最壞在 $x=\\frac14$：要 $\\frac{1}{1+N/4}<0.03$，即 $N>129.\\overline3$。",
        "SUB(1/(1+130x), 1/4) < 0.03 ;; SUB(1/(1+129x), 1/4) > 0.03"
      ],
      [
        "所以最小的 $N=130$。",
        "130 == ANS"
      ]
    ],
    "trap": "拿右端點 $x=1$ 算：$\\frac{1}{1+N}<0.03$ 得 $N=33$，只保證了 $x=1$ 附近；一致收斂要顧最壞的 $x=\\frac14$。",
    "check": "$N=130$：$\\frac{1}{33.5}\\approx0.0299$；$N=129$：$\\frac{1}{33.25}\\approx0.0301$，剛好跨過 $0.03$。"
  },
  "cl-ser-023": {
    "spot": "每一項 $x^2e^{-nx}$ 在 $[0,\\infty)$ 上有明確的最大值（在 $x=\\frac2n$），最大值像 $\\frac{1}{n^2}$ 一樣小 —— 魏爾斯特拉斯 M 判別的標準訊號。",
    "why": "M 判別只要每一項的上確界可加總；比算出和函數再估尾巴的上確界簡單。",
    "steps": [
      [
        "$\\frac{d}{dx}x^2e^{-nx}=(2x-nx^2)e^{-nx}$，臨界點 $x=\\frac2n$（以 $n=3$ 為例：$x=\\frac23$）。",
        "D(x^2*exp(-3x), 2/3) == 0"
      ],
      [
        "最大值 $M_n=\\frac{4}{n^2}e^{-2}$（$n=3$：$\\frac{4}{9e^2}$）。",
        "SUB(x^2*exp(-3x), 2/3) == 4/(9*exp(2))"
      ],
      [
        "$\\sum M_n=\\frac{4}{e^2}\\sum\\frac1{n^2}=\\frac{4}{e^2}\\cdot\\frac{\\pi^2}{6}$，收斂。",
        "SUM(4/(exp(2)*n^2), 1) == 4*pi^2/(6*exp(2))"
      ],
      [
        "由 M 判別，級數在 $[0,\\infty)$ 上一致收斂。",
        "SUM(4/(exp(2)*n^2), 1) < 1"
      ]
    ],
    "trap": "跟 $\\sum xe^{-nx}$ 搞混而答「不一致收斂」：那題的 $M_n=\\frac{1}{ne}$ 是調和級數；多了一個 $x$，最大值變成 $\\frac{1}{n^2}$ 級，就收斂了。",
    "check": "和函數 $\\frac{x^2e^{-x}}{1-e^{-x}}$ 在 $x\\to0^+$ 趨近 $0$，跟 $x=0$ 的值一致，連續，沒有出現破壞一致收斂的跳躍。"
  },
  "cl-ser-033": {
    "spot": "底數和指數都是 $\\ln n$：$(\\ln n)^{\\ln n}=e^{\\ln n\\cdot\\ln\\ln n}=n^{\\ln\\ln n}$，指數 $\\ln\\ln n$ 會慢慢超過 $2$。",
    "why": "換成 $n$ 的冪就能跟 $p$ 級數比；比值判別在這裡極限是 $1$，判不出來。",
    "steps": [
      [
        "改寫：$(\\ln n)^{\\ln n}=n^{\\ln\\ln n}$（例如 $n=100$）。",
        "SUB(ln(x)^ln(x), 100) == SUB(x^ln(ln(x)), 100)"
      ],
      [
        "$n\\ge e^{e^2}\\approx1618$ 時 $\\ln\\ln n\\ge2$。",
        "SUB(ln(ln(x)), exp(exp(2))) == 2"
      ],
      [
        "所以從那裡開始 $\\frac{1}{(\\ln n)^{\\ln n}}\\le\\frac1{n^2}$（例如 $n=2000$）。",
        "SUB(1/(ln(x))^(ln(x)), 2000) < SUB(1/x^2, 2000)"
      ],
      [
        "前面有限多項不影響，和 $\\sum\\frac{1}{n^2}$ 比較，級數收斂。",
        "SUM(1/n^2, 1619) < 1"
      ]
    ],
    "trap": "看到 $\\ln n$ 長得很慢，就以為跟 $\\sum\\frac{1}{\\ln n}$ 一樣發散：這裡 $\\ln n$ 在指數上，整項比任何 $\\frac{1}{n^p}$ 都小得快。",
    "check": "對照 $\\sum\\frac{1}{(\\ln n)^2}$ 發散；把指數從常數 $2$ 換成會長大的 $\\ln n$，就從發散變成收斂。"
  },
  "cl-ser-034": {
    "spot": "比值判別的極限是 $1$，判不出來 —— 題目要的 $n\\left(\\frac{a_n}{a_{n+1}}-1\\right)$ 是拉比判別；比值化簡後是 $\\frac{e}{(1+1/n)^n}$，正好接上 $(1+\\frac1n)^n$ 的誤差主項。",
    "why": "比值裡的 $n!$ 和 $e^n$ 會約到只剩 $(1+\\frac1n)^n$；用已知的 $(1+\\frac1n)^n=e\\left(1-\\frac1{2n}+\\cdots\\right)$，一步讀出極限。",
    "steps": [
      [
        "$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)^{n+1}}{e^{n+1}(n+1)!}\\cdot\\frac{e^nn!}{n^n}=\\frac{(n+1)^n}{e\\,n^n}=\\frac{(1+\\frac1n)^n}{e}$。",
        "(n+1)^(n+1)*n^(-n)/(exp(1)*(n+1)) == (1+1/n)^n/exp(1)"
      ],
      [
        "所以 $\\frac{a_n}{a_{n+1}}=\\frac{e}{(1+\\frac1n)^n}$；而 $(1+\\frac1n)^n=e\\left(1-\\frac{1}{2n}+\\cdots\\right)$。",
        "LIM(x*(1 - (1+1/x)^x/exp(1)), inf) == 1/2"
      ],
      [
        "$\\frac{a_n}{a_{n+1}}-1\\approx\\frac{1}{2n}$，所以 $n\\left(\\frac{a_n}{a_{n+1}}-1\\right)\\to\\frac12$。",
        "LIM(x*(exp(1)/(1+1/x)^x - 1), inf) == ANS"
      ]
    ],
    "trap": "比值寫反成 $\\frac{a_{n+1}}{a_n}$，得到 $-\\frac12$；拉比判別用的是 $\\frac{a_n}{a_{n+1}}$。",
    "check": "拉比值 $\\frac12<1$，級數 $\\sum a_n$ 發散；跟斯特林公式 $a_n\\approx\\frac{1}{\\sqrt{2\\pi n}}$ 一致（像 $p=\\frac12$ 級數）。"
  },
  "cl-ser-049": {
    "spot": "題目指定 $f(x)=|x|$ 加帕塞瓦爾等式：$|x|$ 的傅立葉係數只有奇數 $k$ 不為 $0$，而且正比於 $\\frac{1}{k^2}$，平方後就是 $\\frac{1}{(2k-1)^4}$。",
    "why": "係數的平方和等於函數平方的積分，而 $\\int x^2$ 一下就算完；所以要的四次方和會從等式裡直接解出來。",
    "steps": [
      [
        "$a_0=\\frac1\\pi\\int_{-\\pi}^{\\pi}|x|\\,dx=\\pi$；$a_k=\\frac2\\pi\\int_0^\\pi x\\cos kx\\,dx=\\frac{2((-1)^k-1)}{\\pi k^2}$，奇數 $k$ 是 $-\\frac{4}{\\pi k^2}$（例如 $k=3$）。",
        "(1/pi)*INT(abs(x), -pi, pi) == pi ;; (2/pi)*INT(x*cos(3x), 0, pi) == -4/(9*pi)"
      ],
      [
        "帕塞瓦爾：$\\frac1\\pi\\int_{-\\pi}^{\\pi}x^2\\,dx=\\frac{a_0^2}{2}+\\sum a_k^2$，左邊 $=\\frac{2\\pi^2}{3}$。",
        "(1/pi)*INT(x^2, -pi, pi) == 2*pi^2/3"
      ],
      [
        "$\\frac{2\\pi^2}{3}=\\frac{\\pi^2}{2}+\\frac{16}{\\pi^2}\\sum_{k\\ge1}\\frac{1}{(2k-1)^4}$，所以 $\\sum=\\left(\\frac{2\\pi^2}{3}-\\frac{\\pi^2}{2}\\right)\\cdot\\frac{\\pi^2}{16}=\\frac{\\pi^4}{96}$。",
        "(2*pi^2/3 - pi^2/2)*pi^2/16 == ANS"
      ]
    ],
    "trap": "帕塞瓦爾的常數項寫成 $a_0^2$ 而不是 $\\frac{a_0^2}{2}$：左邊減掉 $\\pi^2$ 變成負的，馬上看得出錯。",
    "check": [
      "直接加 $1+\\frac1{81}+\\frac1{625}+\\cdots\\approx1.0147$，正是 $\\frac{\\pi^4}{96}$。",
      "SUM(1/(2n-1)^4, 1) == ANS"
    ]
  },
  "db-chain-012": {
    "spot": "$x$ 乘一個複合函數 $\\arctan\\frac1x$：外面是乘積法則，第二個因子再用鏈鎖律，內層 $\\frac1x$ 的導數是 $-\\frac{1}{x^2}$。",
    "why": "乘積法則加鏈鎖律是最直接的；$\\arctan\\frac1x$ 的導數化簡後剛好是 $-\\frac{1}{1+x^2}$，很乾淨。",
    "steps": [
      [
        "$\\frac{d}{dx}\\arctan\\frac1x=\\frac{1}{1+1/x^2}\\cdot\\left(-\\frac{1}{x^2}\\right)=-\\frac{1}{x^2+1}$。",
        "D(atan(1/x)) == -1/(1+x^2)"
      ],
      [
        "乘積法則：$\\left(x\\arctan\\frac1x\\right)'=\\arctan\\frac1x+x\\cdot\\left(-\\frac{1}{1+x^2}\\right)$。",
        "D(x*atan(1/x)) == atan(1/x) + x*(-1/(1+x^2))"
      ],
      [
        "整理：$\\arctan\\frac1x-\\frac{x}{1+x^2}$。",
        "D(x*atan(1/x)) == ANS"
      ]
    ],
    "trap": "鏈鎖律漏掉內層 $\\left(\\frac1x\\right)'=-\\frac1{x^2}$，寫成 $\\frac{1}{1+1/x^2}=\\frac{x^2}{x^2+1}$，答案第二項變成 $\\frac{x^3}{1+x^2}$。",
    "check": "$x>0$ 時 $\\arctan\\frac1x=\\frac\\pi2-\\arctan x$，它的導數 $-\\frac{1}{1+x^2}$，跟第一步一致。"
  },
  "db-def-007": {
    "spot": "分子是兩個 $\\ln$ 在 $2$ 附近、往不同方向偏：$\\ln(2+2h)$ 和 $\\ln(2-3h)$ 各自減 $\\ln2$，就是兩個導數定義，係數 $2$ 和 $-3$ 會乘出來。",
    "why": "加減 $\\ln2$ 拆成兩個導數定義，每個都是 $(\\ln x)'=\\frac1x$ 在 $x=2$ 乘上偏移的係數；比羅必達更看得出結構。",
    "steps": [
      [
        "拆：$\\frac{\\ln(2+2h)-\\ln2}{h}+\\frac{\\ln2-\\ln(2-3h)}{h}$。",
        "LIM((ln(2+2x) - ln(2))/x + (ln(2) - ln(2-3x))/x, 0) == LIM((ln(2+2x) - ln(2-3x))/x, 0)"
      ],
      [
        "第一項：$2\\cdot\\frac{\\ln(2+2h)-\\ln2}{2h}\\to2\\cdot\\frac12=1$。",
        "LIM((ln(2+2x) - ln(2))/x, 0) == 1"
      ],
      [
        "第二項：$3\\cdot\\frac{\\ln(2-3h)-\\ln2}{-3h}\\to3\\cdot\\frac12=\\frac32$。",
        "LIM((ln(2) - ln(2-3x))/x, 0) == 3/2"
      ],
      [
        "相加：$1+\\frac32=\\frac52$。",
        "LIM((ln(2+2x) - ln(2-3x))/x, 0) == ANS"
      ]
    ],
    "trap": "第二項的負號處理錯，寫成 $2\\cdot\\frac12-3\\cdot\\frac12=-\\frac12$：$-\\ln(2-3h)$ 往 $-3h$ 方向偏，兩個負號相乘是正的。",
    "check": "也可以寫成 $\\ln\\frac{2+2h}{2-3h}$，在 $h=0$ 對 $h$ 微分：$\\frac{2}{2}+\\frac{3}{2}=\\frac52$。"
  },
  "db-imp-007": {
    "spot": "隱函數求二階導數：先對 $x^3+y^3=2$ 微一次得 $y'=-\\frac{x^2}{y^2}$，在 $(1,1)$ 是 $-1$；再對 $y'$ 微一次，記得 $y$ 是 $x$ 的函數。",
    "why": "先算出點上的 $y'$ 再代進二階式子，數字比較少；也可以解出 $y=(2-x^3)^{1/3}$ 直接微，但根號微兩次更亂。",
    "steps": [
      [
        "微一次：$3x^2+3y^2y'=0$，$y'=-\\frac{x^2}{y^2}$，在 $(1,1)$：$y'=-1$。",
        "D((2-x^3)^(1/3), 1) == -1"
      ],
      [
        "對 $y'=-\\frac{x^2}{y^2}$ 再微（商法則）：$y''=-\\frac{2xy^2-x^2\\cdot2yy'}{y^4}$。",
        "SUB(-(2x*1 - x^2*2*1*(-1))/1, 1) == -4"
      ],
      [
        "代 $x=y=1$、$y'=-1$：$y''=-\\frac{2-2(-1)}{1}=-4$。",
        "D2((2-x^3)^(1/3), 1) == ANS"
      ]
    ],
    "trap": "第二次微分時把 $y^2$ 當常數，得 $y''=-\\frac{2x}{y^2}=-2$：漏了 $y$ 也在變的那一項 $2yy'$。",
    "check": "曲線在 $(1,1)$ 附近對稱於 $y=x$，斜率 $-1$；$y''<0$ 表示往下彎，符合 $x^3+y^3=2$ 在第一象限的凸起形狀。"
  },
  "db-imp-009": {
    "spot": "$\\arctan\\frac yx$ 和 $\\ln\\sqrt{x^2+y^2}$ 是極座標的 $\\theta$ 和 $\\ln r$：這條曲線是 $\\theta=\\ln r$，即對數螺線 $r=e^\\theta$，$(1,0)$ 對應 $\\theta=0$。",
    "why": "直接隱函數微分兩邊分母都是 $x^2+y^2$，消掉後是一次方程；認出極座標還能用參數式再驗一次。",
    "steps": [
      [
        "先確認點在曲線上：$\\arctan0=0=\\ln1$。",
        "atan(0/1) == ln(sqrt(1^2 + 0^2))"
      ],
      [
        "兩邊對 $x$ 微：左 $\\frac{xy'-y}{x^2+y^2}$、右 $\\frac{x+yy'}{x^2+y^2}$，所以 $xy'-y=x+yy'$。",
        "D(atan(x/2)) == 2/(4 + x^2)"
      ],
      [
        "解出 $y'=\\frac{x+y}{x-y}$，代 $(1,0)$：$y'=\\frac{1+0}{1-0}=1$。",
        "(1+0)/(1-0) == ANS"
      ]
    ],
    "trap": "左邊微 $\\arctan\\frac yx$ 時只寫 $\\frac{1}{1+(y/x)^2}\\cdot\\frac{y'}{x}$，漏了商法則裡的 $-\\frac{y}{x^2}$；這題在 $y=0$ 剛好沒差，但換一點就錯。",
    "check": [
      "參數式 $x=e^t\\cos t$、$y=e^t\\sin t$，在 $t=0$：$\\frac{dy}{dx}=\\frac{y'(0)}{x'(0)}=\\frac11=1$。",
      "D(exp(t)*sin(t), 0)/D(exp(t)*cos(t), 0) == ANS"
    ]
  },
  "db-logd-006": {
    "spot": "底數和指數都有 $x$：$(1+x)^{1/x}$ 不能用冪法則也不能用指數法則，要取對數 $\\ln y=\\frac{\\ln(1+x)}{x}$。",
    "why": "對數微分把「變數的變數次方」變成商，只要商法則；直接寫成 $e^{\\ln(1+x)/x}$ 再微也一樣，就是同一件事。",
    "steps": [
      [
        "$\\ln y=\\frac{\\ln(1+x)}{x}$。",
        "ln((1+x)^(1/x)) == ln(1+x)/x"
      ],
      [
        "商法則：$\\frac{y'}{y}=\\frac{\\frac{x}{1+x}-\\ln(1+x)}{x^2}$。",
        "D(ln(1+x)/x) == (x/(1+x) - ln(1+x))/x^2"
      ],
      [
        "乘回 $y$：$y'=(1+x)^{1/x}\\cdot\\frac{\\frac{x}{1+x}-\\ln(1+x)}{x^2}$。",
        "D((1+x)^(1/x)) == ANS"
      ]
    ],
    "trap": "當成冪函數用 $\\frac1x(1+x)^{1/x-1}$：指數也在變，這樣漏掉了一整項。",
    "check": "$(1+x)^{1/x}$ 從 $x\\to0^+$ 的 $e$ 往下降到 $1$，應該是遞減；$\\frac{x}{1+x}<\\ln(1+x)$，導數確實為負。"
  },
  "db-tay-008": {
    "spot": "高階導數在 $0$ 的值 $=$ 泰勒係數 $\\times n!$：$xe^{2x}=\\sum\\frac{2^k}{k!}x^{k+1}$，$x^6$ 的係數來自 $k=5$。",
    "why": "直接微六次很長；讀泰勒係數只要一行，再乘 $6!$。",
    "steps": [
      [
        "$xe^{2x}=x\\sum_k\\frac{(2x)^k}{k!}$，$x^6$ 的係數是 $\\frac{2^5}{5!}=\\frac{32}{120}$。",
        "2^5/(5*4*3*2*1) == 32/120"
      ],
      [
        "$f^{(6)}(0)=6!\\cdot\\frac{32}{120}=6\\cdot32=192$。",
        "720*32/120 == 192"
      ],
      [
        "對照萊布尼茲：$f^{(5)}(x)=(32x+80)e^{2x}$，再微一次在 $0$ 是 $80\\cdot2+32=192$。",
        "D((32x+80)*exp(2x)) == (64x+192)*exp(2x) ;; SUB(D((32x+80)*exp(2x)), 0) == ANS"
      ]
    ],
    "trap": "把係數當成 $x^6$ 來自 $k=6$，算成 $6!\\cdot\\frac{2^6}{6!}=64$：前面多乘了一個 $x$，次方要往前挪一格。",
    "check": "一般式 $f^{(n)}(0)=n\\cdot2^{n-1}$：$n=6$ 給 $6\\cdot32=192$。"
  },
  "db-tay-009": {
    "spot": "$e^x\\cos x$ 的導數每微一次會乘上 $\\sqrt2$ 並轉 $45^\\circ$；微兩次得 $-2e^x\\sin x$，再兩次就是 $-4e^x\\cos x$。",
    "why": "先算兩階找出規律，四階就是把兩階的規律做兩次；比展開兩個泰勒級數再乘起來快。",
    "steps": [
      [
        "$f'=e^x(\\cos x-\\sin x)$。",
        "D(exp(x)*cos(x)) == exp(x)*(cos(x) - sin(x))"
      ],
      [
        "$f''=-2e^x\\sin x$。",
        "D2(exp(x)*cos(x)) == -2exp(x)*sin(x)"
      ],
      [
        "對 $-2e^x\\sin x$ 再微兩次：$e^x\\sin x$ 的二階導數是 $2e^x\\cos x$，所以 $f^{(4)}=-4e^x\\cos x$。",
        "D2(-2exp(x)*sin(x)) == -4exp(x)*cos(x)"
      ],
      [
        "代 $0$：$f^{(4)}(0)=-4$。",
        "SUB(-4exp(x)*cos(x), 0) == ANS"
      ]
    ],
    "trap": "以為 $e^x$ 的導數不變、$\\cos$ 微四次回到自己，就答 $1$：乘積法則每次都會產生交叉項，不能分開算。",
    "check": "用泰勒：$e^x\\cos x=1+x-\\frac{x^3}{3}-\\frac{x^4}{6}+\\cdots$，$x^4$ 係數 $-\\frac16$ 乘 $4!=24$ 得 $-4$。"
  },
  "dd-log-002": {
    "spot": "底數 $\\ln x$、指數 $\\sin x$ 都隨 $x$ 變：變數的變數次方，取對數 $\\ln y=\\sin x\\cdot\\ln(\\ln x)$。",
    "why": "對數微分把次方變成乘積，乘積法則就好；冪法則和指數法則各只顧一半。",
    "steps": [
      [
        "$\\ln y=\\sin x\\ln(\\ln x)$（$x>1$）。",
        "SUB(ln(ln(x)^sin(x)), 2) == SUB(sin(x)*ln(ln(x)), 2)"
      ],
      [
        "乘積法則：$\\frac{y'}{y}=\\cos x\\ln(\\ln x)+\\sin x\\cdot\\frac{1}{\\ln x}\\cdot\\frac1x$。",
        "D(sin(x)*ln(ln(x)), 2) == SUB(cos(x)*ln(ln(x)) + sin(x)/(x*ln(x)), 2)"
      ],
      [
        "乘回 $y$：$y'=(\\ln x)^{\\sin x}\\left(\\cos x\\ln(\\ln x)+\\frac{\\sin x}{x\\ln x}\\right)$（在 $x=2$、$x=3$ 驗）。",
        "D((ln(x))^(sin(x)), 2) == SUB(ANS, 2) ;; D((ln(x))^(sin(x)), 3) == SUB(ANS, 3)"
      ]
    ],
    "trap": "$\\ln(\\ln x)$ 微分時漏掉內層，寫成 $\\frac{1}{\\ln x}$，第二項少了 $\\frac1x$。",
    "check": "定義域要 $\\ln x>0$，也就是 $x>1$；答案裡的 $\\ln(\\ln x)$ 也只在 $x>1$ 有定義，一致。"
  },
  "dd-log-005": {
    "spot": "$\\left(1+\\frac1x\\right)^x$ 底數和指數都含 $x$：取對數 $\\ln y=x\\ln\\left(1+\\frac1x\\right)$，再用乘積法則。",
    "why": "對數微分把次方拉下來；內層 $\\ln(1+\\frac1x)$ 的導數會化成 $-\\frac{1}{x(x+1)}$，乘上 $x$ 變得很乾淨。",
    "steps": [
      [
        "$\\ln y=x\\ln\\left(1+\\frac1x\\right)$。",
        "ln((1+1/x)^x) == x*ln(1+1/x)"
      ],
      [
        "$\\frac{d}{dx}\\ln\\left(1+\\frac1x\\right)=\\frac{-1/x^2}{1+1/x}=-\\frac{1}{x(x+1)}$。",
        "D(ln(1+1/x)) == -1/(x*(x+1))"
      ],
      [
        "乘積法則：$\\frac{y'}{y}=\\ln\\left(1+\\frac1x\\right)-\\frac{1}{x+1}$。",
        "D(x*ln(1+1/x)) == ln(1+1/x) - 1/(x+1)"
      ],
      [
        "乘回 $y$：$y'=\\left(1+\\frac1x\\right)^x\\left(\\ln\\left(1+\\frac1x\\right)-\\frac{1}{x+1}\\right)$。",
        "D((1+1/x)^x) == ANS"
      ]
    ],
    "trap": "當成冪函數微：$x\\left(1+\\frac1x\\right)^{x-1}\\cdot\\left(-\\frac1{x^2}\\right)$，只算了底數的變化，漏了指數那一項。",
    "check": "$(1+\\frac1x)^x$ 往上逼近 $e$，是遞增的；$\\ln(1+\\frac1x)>\\frac{1}{x+1}$，導數為正，對。"
  },
  "dd-log-009": {
    "spot": "$(\\ln x)^{\\ln x}$：底數和指數是同一個 $\\ln x$，取對數 $\\ln y=\\ln x\\cdot\\ln(\\ln x)$。",
    "why": "對數微分後是乘積法則，兩項都帶 $\\frac1x$，可以提出來整理成一行。",
    "steps": [
      [
        "$\\ln y=\\ln x\\cdot\\ln(\\ln x)$（$x>1$）。",
        "SUB(ln(ln(x)^ln(x)), 3) == SUB(ln(x)*ln(ln(x)), 3)"
      ],
      [
        "乘積法則：$\\frac{y'}{y}=\\frac1x\\ln(\\ln x)+\\ln x\\cdot\\frac{1}{x\\ln x}=\\frac{1+\\ln(\\ln x)}{x}$。",
        "D(ln(x)*ln(ln(x)), 3) == SUB((1 + ln(ln(x)))/x, 3)"
      ],
      [
        "乘回 $y$：$y'=(\\ln x)^{\\ln x}\\cdot\\frac{1+\\ln(\\ln x)}{x}$（在 $x=2$、$x=3$ 驗）。",
        "D((ln(x))^(ln(x)), 2) == SUB(ANS, 2) ;; D((ln(x))^(ln(x)), 3) == SUB(ANS, 3)"
      ]
    ],
    "trap": "用冪法則寫 $\\ln x\\cdot(\\ln x)^{\\ln x-1}\\cdot\\frac1x$，只得到答案裡「$1$」那一項，漏了 $\\ln(\\ln x)$。",
    "check": "導數在 $\\ln(\\ln x)=-1$，即 $x=e^{1/e}\\approx1.44$ 為 $0$：$u^u$ 在 $u=\\frac1e$ 有最小值，這裡 $u=\\ln x$，對得上。"
  },
  "dd-nest-005": {
    "spot": "三層：$\\arctan(\\cdot)$ 套 $e^{(\\cdot)}$ 套 $\\sqrt x$；由外往內乘 $\\frac{1}{1+u^2}$、$e^v$、$\\frac{1}{2\\sqrt x}$。",
    "why": "每一層都是基本導數，鏈鎖律照順序乘最不會漏；$u^2=e^{2\\sqrt x}$ 這個平方要記得。",
    "steps": [
      [
        "外層：$(\\arctan u)'=\\frac{u'}{1+u^2}$，$u=e^{\\sqrt x}$，$u^2=e^{2\\sqrt x}$。",
        "D(atan(x)) == 1/(1+x^2)"
      ],
      [
        "$u'=e^{\\sqrt x}\\cdot\\frac{1}{2\\sqrt x}$。",
        "D(exp(sqrt(x))) == exp(sqrt(x))/(2*sqrt(x))"
      ],
      [
        "乘起來：$\\frac{e^{\\sqrt x}}{2\\sqrt x\\left(1+e^{2\\sqrt x}\\right)}$。",
        "D(atan(exp(sqrt(x)))) == ANS"
      ]
    ],
    "trap": "把 $u^2$ 寫成 $e^{x}$（以為 $(e^{\\sqrt x})^2=e^{x}$）：平方是指數乘 $2$，應該是 $e^{2\\sqrt x}$。",
    "check": "$\\arctan$ 遞增、$e^{\\sqrt x}$ 遞增，所以導數應該處處為正；答案每個因子都是正的，對。"
  },
  "dd-opt-003": {
    "spot": "容積固定、表面積最小的有蓋圓柱：用容積把高 $h$ 消掉，表面積變成只有半徑 $r$ 的函數 $2\\pi r^2+\\frac{2000}{r}$，微分找臨界點。",
    "why": "約束是一條簡單的等式，代掉一個變數就是單變數最佳化；不必動用拉格朗日乘數。",
    "steps": [
      [
        "$\\pi r^2h=1000\\Rightarrow h=\\frac{1000}{\\pi r^2}$，表面積 $A=2\\pi r^2+2\\pi rh=2\\pi r^2+\\frac{2000}{r}$。",
        "SUB(2*pi*x^2 + 2*pi*x*1000/(pi*x^2), 5) == SUB(2*pi*x^2 + 2000/x, 5)"
      ],
      [
        "$A'(r)=4\\pi r-\\frac{2000}{r^2}=0\\Rightarrow r^3=\\frac{500}{\\pi}$。",
        "D(2*pi*x^2 + 2000/x, (500/pi)^(1/3)) == 0"
      ],
      [
        "此時 $h=\\frac{1000}{\\pi r^2}=2r$（高等於直徑），$A=2\\pi r^2+4\\pi r^2=6\\pi r^2$。",
        "SUB(1000/(pi*x^2), (500/pi)^(1/3)) == 2*(500/pi)^(1/3)"
      ],
      [
        "$6\\pi r^2=6\\pi\\left(\\frac{500}{\\pi}\\right)^{2/3}=6\\sqrt[3]{250000\\pi}\\approx553.6$ 平方公分。",
        "SUB(2*pi*x^2 + 2000/x, (500/pi)^(1/3)) == ANS"
      ]
    ],
    "trap": "忘了有蓋，只算一個底面 $\\pi r^2$：會得到 $h=r$ 的另一個最佳解，答案變小，跟題目不符。",
    "check": [
      "臨界點兩側試一下：$r=5$ 和 $r=6$ 的表面積都比答案大。",
      "SUB(2*pi*x^2 + 2000/x, 5) > ANS ;; SUB(2*pi*x^2 + 2000/x, 6) > ANS"
    ]
  },
  "dm-seq-011": {
    "spot": "$e^{-n}\\frac{n^k}{k!}$ 是平均 $n$ 的卜瓦松分佈在 $k$ 的機率，所以 $S_n=P(X\\le n)$；$X$ 是 $n$ 個獨立的平均 $1$ 卜瓦松相加，平均 $n$、變異數 $n$。",
    "why": "中央極限定理把「不超過平均值」的機率送到標準常態的 $\\Phi(0)=\\frac12$；硬估部分和和 $e^n$ 的比例很難。",
    "steps": [
      [
        "等價寫法：$S_n=\\frac{1}{n!}\\int_n^\\infty t^ne^{-t}\\,dt$（$n=3$ 時 $e^{-3}(1+3+\\frac92+\\frac{27}{6})=13e^{-3}$）。",
        "SUB(INT(t^n*exp(-t), n, inf, t)/INT(t^n*exp(-t), 0, inf, t), 3, n) == 13*exp(-3)"
      ],
      [
        "中央極限定理：$P(X\\le n)=P\\left(\\frac{X-n}{\\sqrt n}\\le0\\right)\\to\\Phi(0)$。",
        "INT(exp(-x^2/2), 0, inf)/sqrt(2*pi) == 1/2"
      ],
      [
        "收斂從上面來：$n=50$ 時 $S_{50}\\approx0.538$，誤差約 $\\frac{2}{3\\sqrt{2\\pi n}}\\approx0.038$。",
        "SUB(INT(t^n*exp(-t), n, inf, t)/INT(t^n*exp(-t), 0, inf, t), 50, n) > 0.5 ;; SUB(INT(t^n*exp(-t), n, inf, t)/INT(t^n*exp(-t), 0, inf, t), 50, n) < 0.54"
      ],
      [
        "所以極限是 $\\Phi(0)=\\frac12$。",
        "INT(exp(-x^2/2), 0, inf)/sqrt(2*pi) == ANS"
      ]
    ],
    "trap": "以為 $\\sum\\frac{n^k}{k!}\\approx e^n$，答 $1$：那是加到無窮；這裡只加到 $k=n$，正好切在分佈的中間，只拿到一半。",
    "check": "$n=3$ 時 $13e^{-3}\\approx0.647$、$n=50$ 時約 $0.538$，一路往 $0.5$ 降。"
  }
};
