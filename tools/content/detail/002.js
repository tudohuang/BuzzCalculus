// 詳解 v2 第 002 批（60 題）。格式見 tools/build_solution_detail.js 的說明。
module.exports = {
  "burst-int-010": {
    "spot": "指數裡是 $x^2$，前面是奇數次方 $x^5=x^4\\cdot x$：多出來的那個 $x$ 正好湊成 $d(x^2)$，代 $u=x^2$ 就變成 Gamma 函數。",
    "why": "分部積分要連做兩次、每次都得重新湊 $xe^{-x^2}$；代換一次就落到 $\\Gamma(3)=2!$，直接查表。",
    "steps": [
      [
        "令 $u=x^2$，$du=2x\\,dx$，所以 $x^5\\,dx=x^4\\cdot x\\,dx=u^2\\cdot\\frac{du}{2}$。",
        "INT(x^5 e^(-x^2), 0, 2) == INT(u^2*e^(-u)/2, 0, 4, u)"
      ],
      [
        "上下限：$x=0\\to u=0$，$x\\to\\infty\\to u\\to\\infty$，積分變成 $\\frac{1}{2}\\int_0^\\infty u^2e^{-u}\\,du$。",
        "INT(x^5 e^(-x^2), 0, inf) == INT(u^2*e^(-u)/2, 0, inf, u)"
      ],
      [
        "$\\int_0^\\infty u^2e^{-u}\\,du=\\Gamma(3)=2!=2$。",
        "INT(u^2*e^(-u), 0, inf, u) == 2"
      ],
      [
        "乘上 $\\frac{1}{2}$：答案是 $\\frac{1}{2}\\cdot 2=1$。",
        "INT(x^5 e^(-x^2), 0, inf) == ANS"
      ]
    ],
    "trap": "代換時把 $x^5$ 寫成 $u^{5/2}$、$dx$ 寫成 $\\frac{du}{2\\sqrt{u}}$ 也行，但很多人忘了 $\\frac{du}{2x}$ 裡的 $\\frac{1}{2}$，得到 $\\Gamma(3)=2$。",
    "check": [
      "反導函數 $-\\frac{1}{2}(x^4+2x^2+2)e^{-x^2}$ 在 $0$ 是 $-1$、在 $\\infty$ 是 $0$，相減正好是 $1$。",
      "D(-(x^4+2x^2+2)*e^(-x^2)/2) == x^5 e^(-x^2) ;; SUB(-(x^4+2x^2+2)*e^(-x^2)/2, 0) == -1"
    ]
  },
  "putnam-012": {
    "spot": "分子是同一個函數 $\\arctan$ 在 $2x$ 和 $x$ 的差、再除以 $x$ —— 這是 Frullani 型。把差寫成對參數 $t$ 的積分，除以 $x$ 之後剛好變得好積。",
    "why": "拆成 $\\int\\frac{\\arctan 2x}{x}-\\int\\frac{\\arctan x}{x}$ 兩個都發散；寫成二重積分再交換順序，內層是標準的 $\\int\\frac{dx}{1+t^2x^2}$。",
    "steps": [
      [
        "$\\arctan(2x)-\\arctan x=\\int_1^2\\frac{\\partial}{\\partial t}\\arctan(tx)\\,dt=\\int_1^2\\frac{x}{1+t^2x^2}\\,dt$。",
        "arctan(2x)-arctan(x) == INT(x/(1+t^2 x^2), 1, 2, t)"
      ],
      [
        "除以 $x$：被積函數 $=\\int_1^2\\frac{dt}{1+t^2x^2}$，原積分 $=\\int_1^2\\int_0^\\infty\\frac{dx}{1+t^2x^2}\\,dt$（被積函數是正的，可以交換順序）。",
        "(arctan(2x)-arctan(x))/x == INT(1/(1+t^2 x^2), 1, 2, t)"
      ],
      [
        "內層：令 $s=tx$，$\\int_0^\\infty\\frac{dx}{1+t^2x^2}=\\frac{1}{t}\\cdot\\frac{\\pi}{2}$。",
        "INT(1/(1+t^2 x^2), 0, inf, x) == pi/(2t)"
      ],
      [
        "外層：$\\int_1^2\\frac{\\pi}{2t}\\,dt=\\frac{\\pi}{2}\\ln 2$。",
        "INT(pi/(2t), 1, 2, t) == ANS ;; INT((arctan(2x)-arctan(x))/x, 0, inf) == ANS"
      ]
    ],
    "trap": "直接套 Frullani 公式 $(f(0)-f(\\infty))\\ln\\frac{b}{a}$ 時把 $a,b$ 對調，得到 $-\\frac{\\pi}{2}\\ln 2$。被積函數處處為正（$\\arctan 2x>\\arctan x$），答案一定是正的。",
    "check": [
      "$\\frac{\\pi}{2}\\ln 2\\approx 1.089>0$，跟被積函數恆正一致；在 $x=1$ 被積函數是 $\\arctan 2-\\frac{\\pi}{4}\\approx 0.32$。",
      "ANS > 1.08 ;; ANS < 1.09 ;; SUB((arctan(2x)-arctan(x))/x, 1) > 0.32"
    ]
  },
  "rel-boss-009": {
    "spot": "$z=0$ 是 $\\frac{e^z}{z^4}$ 的四階極點，分子 $e^z$ 的展開人人會背 —— 留數就是 Laurent 展開裡 $\\frac{1}{z}$ 的係數，也就是 $e^z$ 的 $z^3$ 係數。",
    "why": "高階極點公式要微三次再除 $3!$；直接展開 $e^z$ 一眼讀出係數，不會算錯階乘。",
    "steps": [
      [
        "$e^z=1+z+\\frac{z^2}{2}+\\frac{z^3}{6}+\\frac{z^4}{24}+\\cdots$，第三次方的係數是 $\\frac{1}{3!}=\\frac{1}{6}$。",
        "LIM((e^x-1-x-x^2/2)/x^3, 0) == 1/6"
      ],
      [
        "除以 $z^4$：$\\frac{e^z}{z^4}=\\frac{1}{z^4}+\\frac{1}{z^3}+\\frac{1}{2z^2}+\\frac{1}{6z}+\\frac{1}{24}+\\cdots$。",
        "LIM((e^x-1-x-x^2/2-x^3/6)/x^4, 0) == 1/24"
      ],
      [
        "留數 $=\\frac{1}{z}$ 項的係數 $=\\frac{1}{6}$。用圍道 $z=e^{it}$ 驗：$\\frac{1}{2\\pi}\\int_0^{2\\pi}e^{\\cos t}\\cos(\\sin t-3t)\\,dt$ 就是這個係數。",
        "INT(e^(cos(t))*cos(sin(t)-3t), 0, 2*pi, t)/(2*pi) == ANS"
      ]
    ],
    "trap": "抓錯項：把常數項 $\\frac{1}{24}$（$e^z$ 的 $z^4$ 係數）當留數。留數要的是 $z^{-1}$，對應 $e^z$ 的 $z^{4-1}=z^3$。",
    "check": [
      "公式法：四階極點的留數 $=\\frac{1}{3!}\\left.\\frac{d^3}{dz^3}e^z\\right|_{z=0}=\\frac{1}{6}$，兩條路一致。",
      "LIM((e^x-1-x-x^2/2)/x^3, 0) == ANS"
    ]
  },
  "rel-hard-cpx-001": {
    "spot": "$\\frac{\\sin z}{z^4}$：分子 $\\sin z$ 自己在 $0$ 有一個零點，所以其實是三階極點。留數就是 $\\sin z$ 展開裡 $z^3$ 的係數。",
    "why": "展開 $\\sin z=z-\\frac{z^3}{6}+\\cdots$ 一行就讀到係數；套高階極點公式還得先判斷階數、再微兩到三次。",
    "steps": [
      [
        "$\\sin z=z-\\frac{z^3}{6}+\\frac{z^5}{120}-\\cdots$，$z^3$ 的係數是 $-\\frac{1}{6}$。",
        "LIM((sin(x)-x)/x^3, 0) == -1/6"
      ],
      [
        "除以 $z^4$：$\\frac{\\sin z}{z^4}=\\frac{1}{z^3}-\\frac{1}{6z}+\\frac{z}{120}-\\cdots$。",
        "LIM((sin(x)-x+x^3/6)/x^5, 0) == 1/120"
      ],
      [
        "留數 $=\\frac{1}{z}$ 項的係數 $=-\\frac{1}{6}$。圍道 $z=e^{it}$ 驗算：$\\frac{1}{2\\pi}\\int_0^{2\\pi}\\mathrm{Re}\\left(\\sin(e^{it})e^{-3it}\\right)dt$ 等於它。",
        "INT(sin(cos(t))*(e^(sin(t))+e^(-sin(t)))/2*cos(3t)+cos(cos(t))*(e^(sin(t))-e^(-sin(t)))/2*sin(3t), 0, 2*pi, t)/(2*pi) == ANS"
      ]
    ],
    "trap": "只把 $\\sin z$ 近似成 $z$，得 $\\frac{1}{z^3}$，以為沒有 $\\frac{1}{z}$ 項、留數是 $0$。留數藏在下一項 $-\\frac{z^3}{6}$ 裡。",
    "check": [
      "公式法（三階極點）：$\\frac{1}{2!}\\left.\\frac{d^2}{dz^2}\\left(z^3\\cdot\\frac{\\sin z}{z^4}\\right)\\right|_{0}=\\frac{1}{2}\\left.\\frac{d^2}{dz^2}\\frac{\\sin z}{z}\\right|_0=\\frac{1}{2}\\cdot\\left(-\\frac{1}{3}\\right)=-\\frac{1}{6}$。",
      "LIM((sin(x)/x-1)/x^2, 0) == ANS"
    ]
  },
  "rel-hard-cpx-007": {
    "spot": "分母 $\\sin^2 z$ 在 $0$ 是二階零點，分子 $z$ 吃掉一階 —— 淨剩一階極點。一階極點的留數就是 $\\lim z f(z)$。",
    "why": "先數清楚極點階數，留數就只是一個極限 $\\left(\\frac{z}{\\sin z}\\right)^2\\to 1$；硬展開 $\\csc^2 z$ 也行，但要多記一條級數。",
    "steps": [
      [
        "$\\sin^2 z=z^2\\left(1-\\frac{z^2}{6}+\\cdots\\right)^2$，是二階零點；$\\frac{z}{\\sin^2 z}$ 在 $0$ 的行為像 $\\frac{z}{z^2}=\\frac{1}{z}$：一階極點。",
        "LIM(x*(x/sin(x)^2), 0) == 1"
      ],
      [
        "一階極點：$\\mathrm{Res}=\\lim_{z\\to 0}z\\cdot\\frac{z}{\\sin^2 z}=\\lim_{z\\to 0}\\left(\\frac{z}{\\sin z}\\right)^2$。",
        "x*(x/sin(x)^2) == (x/sin(x))^2"
      ],
      [
        "$\\frac{z}{\\sin z}\\to 1$，所以留數 $=1^2=1$。",
        "LIM((x/sin(x))^2, 0) == ANS"
      ]
    ],
    "trap": "看到分子分母在 $0$ 都是零，就以為是可去奇點、留數 $0$。分母是二階零點、分子只有一階，抵銷不完。",
    "check": [
      "展開驗：$\\frac{z^2}{\\sin^2 z}=1+\\frac{z^2}{3}+\\cdots$，所以 $\\frac{z}{\\sin^2 z}=\\frac{1}{z}+\\frac{z}{3}+\\cdots$，$\\frac{1}{z}$ 的係數確實是 $1$。",
      "LIM((x^2/sin(x)^2-1)/x^2, 0) == 1/3"
    ]
  },
  "world-057": {
    "spot": "分母是 $1+x^2$、範圍是 $0$ 到 $\\infty$：代 $x=\\tan\\theta$ 會讓 $\\frac{dx}{1+x^2}$ 直接變成 $d\\theta$，而 $\\ln(1+\\tan^2\\theta)=-2\\ln\\cos\\theta$，落到經典積分 $\\int_0^{\\pi/2}\\ln\\cos\\theta\\,d\\theta$。",
    "why": "Feynman 引入參數 $\\ln(1+a^2x^2)$ 要做部分分式；三角代換一行就變成已知積分。",
    "steps": [
      [
        "令 $x=\\tan\\theta$，$dx=\\sec^2\\theta\\,d\\theta$，$1+x^2=\\sec^2\\theta$：$\\frac{\\ln(1+x^2)}{1+x^2}dx=\\ln(\\sec^2\\theta)\\,d\\theta=-2\\ln\\cos\\theta\\,d\\theta$。",
        "INT(ln(1+x^2)/(1+x^2), 0, 1) == INT(-2ln(cos(t)), 0, pi/4, t)"
      ],
      [
        "上限 $x\\to\\infty$ 對到 $\\theta\\to\\frac{\\pi}{2}$：原積分 $=-2\\int_0^{\\pi/2}\\ln\\cos\\theta\\,d\\theta$。",
        "INT(ln(1+x^2)/(1+x^2), 0, inf) == INT(-2ln(cos(t)), 0, pi/2, t)"
      ],
      [
        "記 $I=\\int_0^{\\pi/2}\\ln\\cos\\theta\\,d\\theta=\\int_0^{\\pi/2}\\ln\\sin\\theta\\,d\\theta$（對稱）。相加：$2I=\\int_0^{\\pi/2}\\ln\\frac{\\sin 2\\theta}{2}\\,d\\theta=I-\\frac{\\pi}{2}\\ln 2$（$\\sin 2\\theta$ 在 $[0,\\frac{\\pi}{2}]$ 的積分跟 $\\sin\\theta$ 一樣）。",
        "INT(ln(sin(2t)), 0, pi/2, t) == INT(ln(sin(t)), 0, pi/2, t)"
      ],
      [
        "解出 $I=-\\frac{\\pi}{2}\\ln 2$。",
        "INT(ln(cos(t)), 0, pi/2, t) == -pi/2*ln(2)"
      ],
      [
        "原積分 $=-2\\cdot\\left(-\\frac{\\pi}{2}\\ln 2\\right)=\\pi\\ln 2$。",
        "-2*(-pi/2*ln(2)) == ANS ;; INT(ln(1+x^2)/(1+x^2), 0, inf) == ANS"
      ]
    ],
    "trap": "看到 $\\ln\\cos\\theta$ 在 $\\theta=\\frac{\\pi}{2}$ 爆到 $-\\infty$，就以為積分發散。$\\ln$ 爆得非常慢，在端點附近仍然可積。",
    "check": [
      "$\\pi\\ln 2\\approx 2.18$；被積函數恆正，而且 $\\int_0^1$ 那一段只有約 $0.43$，剩下大部分來自 $x>1$ 的長尾，合理。",
      "INT(ln(1+x^2)/(1+x^2), 0, 1) < 0.44 ;; ANS > 2.17 ;; ANS < 2.18"
    ]
  },
  "depth-der-015": {
    "spot": "$\\frac{1-x^2}{1+x^2}$ 是 $\\cos 2\\theta$ 的「萬能代換」形狀（$x=\\tan\\theta$）。看到它就先化簡函數本身，再微分。",
    "why": "直接用 $\\arccos$ 的鏈鎖律會碰到 $\\sqrt{1-u^2}=\\frac{2|x|}{1+x^2}$，絕對值很容易出錯；先化成 $2\\arctan x$ 只要一行。",
    "steps": [
      [
        "令 $x=\\tan\\theta$：$\\frac{1-\\tan^2\\theta}{1+\\tan^2\\theta}=\\cos 2\\theta$。",
        "SUB((1-x^2)/(1+x^2), tan(t)) == cos(2t)"
      ],
      [
        "$x>0$ 時 $\\theta\\in(0,\\frac{\\pi}{2})$，$2\\theta\\in(0,\\pi)$ 正好落在 $\\arccos$ 的值域裡，所以 $\\arccos(\\cos 2\\theta)=2\\theta=2\\arctan x$。",
        "arccos((1-x^2)/(1+x^2)) == 2arctan(x)"
      ],
      [
        "微分：$\\frac{d}{dx}2\\arctan x=\\frac{2}{1+x^2}$。",
        "D(2arctan(x)) == 2/(1+x^2) ;; D(arccos((1-x^2)/(1+x^2))) == ANS"
      ]
    ],
    "trap": "硬套鏈鎖律時把 $\\sqrt{1-u^2}=\\sqrt{\\frac{4x^2}{(1+x^2)^2}}$ 直接寫成 $\\frac{2x}{1+x^2}$。題目給 $x>0$ 所以這次碰巧對；$x<0$ 時那是 $\\frac{-2x}{1+x^2}$，導數會變成 $-\\frac{2}{1+x^2}$。",
    "check": [
      "$x=1$：函數值 $\\arccos 0=\\frac{\\pi}{2}=2\\arctan 1$，導數 $\\frac{2}{2}=1$。",
      "SUB(arccos((1-x^2)/(1+x^2)), 1) == pi/2 ;; D(arccos((1-x^2)/(1+x^2)), 1) == 1"
    ]
  },
  "depth-int-011": {
    "spot": "分子 $x^2=x\\cdot x$，而 $\\frac{x}{(1+x^2)^2}$ 是一眼就積得出來的（內層導數就在旁邊）。把一個 $x$ 留下、另一個 $x$ 跟分母配對 —— 分部積分。",
    "why": "拆成 $\\frac{1}{1+x^2}-\\frac{1}{(1+x^2)^2}$ 也行，但後面那項還要三角代換；分部一次就把次方降下來。",
    "steps": [
      [
        "取 $u=x$、$dv=\\frac{x}{(1+x^2)^2}dx$，則 $v=-\\frac{1}{2(1+x^2)}$。",
        "D(-1/(2(1+x^2))) == x/(1+x^2)^2"
      ],
      [
        "分部：$\\int\\frac{x^2}{(1+x^2)^2}dx=-\\frac{x}{2(1+x^2)}+\\int\\frac{dx}{2(1+x^2)}$。",
        "D(-x/(2(1+x^2))) + 1/(2(1+x^2)) == x^2/(1+x^2)^2"
      ],
      [
        "剩下的是 $\\frac{1}{2}\\arctan x$，所以答案 $=\\frac{1}{2}\\arctan x-\\frac{x}{2(1+x^2)}+C$。",
        "D(arctan(x)/2 - x/(2(1+x^2))) == x^2/(1+x^2)^2 ;; arctan(x)/2 - x/(2(1+x^2)) ~= ANS"
      ]
    ],
    "trap": "拆項後把 $\\int\\frac{dx}{(1+x^2)^2}$ 當成冪次規則算成 $-\\frac{1}{1+x^2}$ —— 那是對 $1+x^2$ 積分，不是對 $x$；少了內層導數 $2x$。",
    "check": [
      "定積分 $\\int_0^1$：代答案得 $\\frac{\\pi}{8}-\\frac{1}{4}\\approx 0.143$，跟數值積分一致。",
      "INT(x^2/(1+x^2)^2, 0, 1) == pi/8-1/4"
    ]
  },
  "der-060": {
    "spot": "朗斯基行列式 $W(f,g)=\\begin{vmatrix}f&g\\\\f'&g'\\end{vmatrix}=fg'-f'g$。$\\cos$ 和 $\\sin$ 互為導數（差一個負號），乘出來會變成 $\\cos^2+\\sin^2$。",
    "why": "行列式公式直接代就好；記住順序是「第一列放函數、第二列放導數」，正負號就不會反。",
    "steps": [
      [
        "$f=\\cos x$、$g=\\sin x$，$f'=-\\sin x$、$g'=\\cos x$。",
        "D(cos(x)) == -sin(x) ;; D(sin(x)) == cos(x)"
      ],
      [
        "$W=fg'-f'g=\\cos x\\cdot\\cos x-(-\\sin x)\\sin x=\\cos^2x+\\sin^2x$。",
        "cos(x)*D(sin(x)) - D(cos(x))*sin(x) == cos(x)^2+sin(x)^2"
      ],
      [
        "$\\cos^2x+\\sin^2x=1$，對所有 $x$ 都是 $1$（不為零，所以兩者線性獨立）。",
        "cos(x)*D(sin(x)) - D(cos(x))*sin(x) == ANS"
      ]
    ],
    "trap": "行列式順序寫反成 $f'g-fg'$，得到 $-1$。",
    "check": [
      "代 $x=0$：$W=\\cos 0\\cdot\\cos 0-0=1$。",
      "SUB(cos(x)*cos(x)+sin(x)*sin(x), 0) == ANS"
    ]
  },
  "exam-lim-012": {
    "spot": "底 $1+\\frac{2}{x}\\to 1$、指數 $3x\\to\\infty$：$1^\\infty$ 型。取對數變成「$\\infty\\cdot 0$」，再用 $\\ln(1+u)\\approx u$。",
    "why": "記公式 $\\left(1+\\frac{a}{x}\\right)^{bx}\\to e^{ab}$ 最快，但取對數那一步就是公式的來源，記錯時能自己補回來。",
    "steps": [
      [
        "底趨近 $1$、指數趨近 $\\infty$：$1^\\infty$ 不定型，不能說是 $1$。",
        "LIM(1+2/x, inf) == 1"
      ],
      [
        "取對數：$\\ln y=3x\\ln\\left(1+\\frac{2}{x}\\right)$。$\\ln(1+u)\\approx u$，$u=\\frac{2}{x}$，所以 $\\ln y\\approx 3x\\cdot\\frac{2}{x}=6$。",
        "LIM(3x*ln(1+2/x), inf) == 6"
      ],
      [
        "$y\\to e^6$。",
        "LIM((1+2/x)^(3x), inf) == ANS"
      ]
    ],
    "trap": "看到底趨近 $1$ 就說 $1^\\infty=1$。$1^\\infty$ 是不定型，底差 $1$ 的那一點點會被很大的次方放大。",
    "check": [
      "代 $x=1000$：$(1.002)^{3000}\\approx e^{5.988}\\approx 398.6$，略小於 $e^6\\approx 403.4$，從下面逼近。",
      "SUB((1+2/x)^(3x), 1000) < ANS ;; SUB((1+2/x)^(3x), 1000) > 0.98*ANS"
    ]
  },
  "exam-lim-007": {
    "spot": "括號裡是 $\\sqrt{1+\\frac{3}{x}}$ 扣掉 $1+\\frac{3}{2x}$ —— 正好是它泰勒展開的前兩項；前面乘 $x^2$，就是在問展開的第三項（$\\frac{1}{x^2}$ 項）係數。",
    "why": "有理化會留下 $\\frac{3}{2x}$ 那一項處理不乾淨；令 $u=\\frac{3}{x}$ 套 $\\sqrt{1+u}$ 的展開一步到位。",
    "steps": [
      [
        "括號 $\\to 0$、$x^2\\to\\infty$：$\\infty\\cdot 0$ 型。",
        "LIM(sqrt(1+3/x)-1-3/(2x), inf) == 0"
      ],
      [
        "$\\sqrt{1+u}=1+\\frac{u}{2}-\\frac{u^2}{8}+\\cdots$。",
        "LIM((sqrt(1+u)-1-u/2)/u^2, 0, u) == -1/8"
      ],
      [
        "代 $u=\\frac{3}{x}$：括號 $=-\\frac{1}{8}\\cdot\\frac{9}{x^2}+O\\!\\left(\\frac{1}{x^3}\\right)$。",
        "LIM((sqrt(1+3u)-1-3u/2)/u^2, 0+, u) == -9/8"
      ],
      [
        "乘 $x^2$：極限 $=-\\frac{9}{8}$。",
        "LIM((sqrt(1+3u)-1-3u/2)/u^2, 0+, u) == ANS"
      ]
    ],
    "trap": "只展開到一次項（$\\sqrt{1+u}\\approx 1+\\frac{u}{2}$），括號變成 $0$，誤答 $0$；或把 $u^2$ 係數記成 $-\\frac{1}{4}$，得 $-\\frac{9}{4}$。",
    "check": [
      "代 $x=100$：$10000\\left(\\sqrt{1.03}-1.015\\right)\\approx -1.108$，靠近 $-1.125$ 且略大（下一項 $+\\frac{27}{16x}$ 是正的）。",
      "SUB(x^2*(sqrt(1+3/x)-1-3/(2x)), 100) > ANS ;; SUB(x^2*(sqrt(1+3/x)-1-3/(2x)), 100) < -1.1"
    ]
  },
  "gap-ser-end-001": {
    "spot": "冪級數 $\\sum\\frac{x^n}{n}$ 的收斂半徑是 $1$，問的是端點 $x=-1$：代進去變成交錯調和級數。端點題永遠要分開看「原級數」和「取絕對值後」。",
    "why": "比值判別法在端點給出 $1$、判不出來；端點只能代進去，用交錯級數判別法和 $p$ 級數各自判。",
    "steps": [
      [
        "代 $x=-1$：$\\sum_{n=1}^\\infty\\frac{(-1)^n}{n}=-1+\\frac{1}{2}-\\frac{1}{3}+\\cdots$。",
        "SUB(x^n/n, -1, x) == (-1)^n/n"
      ],
      [
        "取絕對值得 $\\sum\\frac{1}{n}$：調和級數（$p=1$）發散 —— 部分和一直比 $\\int_1^{N+1}\\frac{dx}{x}=\\ln(N+1)$ 大。所以不是絕對收斂。",
        "1+1/2+1/3+1/4+1/5 > INT(1/x, 1, 6)"
      ],
      [
        "原級數交錯，$\\frac{1}{n}$ 遞減且趨近 $0$：交錯級數判別法說它收斂（和是 $-\\ln 2$）。",
        "1/(n+1) < 1/n ;; LIM(1/n, inf, n) == 0 ;; SUM((-1)^n/n, 1) == -ln(2)"
      ],
      [
        "收斂但不絕對收斂：在 $x=-1$ 是條件收斂。",
        "SUM((-1)^n/n, 1) > -1"
      ]
    ],
    "trap": "知道 $x=1$ 是調和級數發散，就把兩端一起判成發散。$x=-1$ 多了正負交錯，會互相抵銷而收斂。",
    "check": [
      "$\\ln(1+x)=\\sum\\frac{(-1)^{n+1}x^n}{n}$，所以 $\\sum\\frac{x^n}{n}=-\\ln(1-x)$，代 $x=-1$ 得 $-\\ln 2$，有限值。",
      "SUM((-1)^n/n, 1) == -ln(1-(-1))"
    ]
  },
  "hc-spec-006": {
    "spot": "$x^{\\text{偶數}}e^{-ax^2}$ 從 $0$ 積到 $\\infty$：高斯動差，代 $u=ax^2$ 落到 $\\Gamma\\!\\left(\\frac{m+1}{2}\\right)$。這題 $m=4$、$a=2$。",
    "why": "也可以對 $a$ 把 $\\int e^{-ax^2}$ 微兩次，但係數容易丟；代換一次直接得 $\\Gamma\\!\\left(\\frac{5}{2}\\right)$。",
    "steps": [
      [
        "令 $u=2x^2$：$x^4=\\frac{u^2}{4}$，$dx=\\frac{du}{2\\sqrt{2u}}$，被積變成 $\\frac{u^{3/2}e^{-u}}{8\\sqrt{2}}$。",
        "INT(x^4 e^(-2x^2), 0, inf) == INT(u^(3/2)*e^(-u), 0, inf, u)/(8*sqrt(2))"
      ],
      [
        "$\\int_0^\\infty u^{3/2}e^{-u}\\,du=\\Gamma\\!\\left(\\frac{5}{2}\\right)=\\frac{3}{2}\\cdot\\frac{1}{2}\\sqrt{\\pi}=\\frac{3\\sqrt{\\pi}}{4}$。",
        "INT(u^(3/2)*e^(-u), 0, inf, u) == 3*sqrt(pi)/4"
      ],
      [
        "合起來：$\\frac{3\\sqrt{\\pi}}{4}\\cdot\\frac{1}{8\\sqrt{2}}=\\frac{3\\sqrt{\\pi}}{32\\sqrt{2}}$。",
        "3*sqrt(pi)/4/(8*sqrt(2)) == ANS ;; INT(x^4 e^(-2x^2), 0, inf) == ANS"
      ]
    ],
    "trap": "用整條實數線的公式 $\\int_{-\\infty}^{\\infty}x^4e^{-ax^2}dx=\\frac{3\\sqrt{\\pi}}{4a^{5/2}}$ 卻忘了題目只積半邊，答案大了一倍。",
    "check": [
      "數值約 $0.1175$；跟 $\\int_{-\\infty}^\\infty$ 公式除以 $2$ 一致：$\\frac{1}{2}\\cdot\\frac{3\\sqrt{\\pi}}{4\\cdot 2^{5/2}}$。",
      "ANS == 3*sqrt(pi)/(8*2^(5/2)) ;; ANS > 0.117 ;; ANS < 0.118"
    ]
  },
  "int-035": {
    "spot": "上下限全是常數、被積函數 $r^2\\cdot r$ 不含 $\\theta$：二重積分直接拆成兩個一維積分相乘。那個多出來的 $r$ 是極座標的面積元素。",
    "why": "不必換回直角座標；分離之後 $\\theta$ 那一半只是乘 $2\\pi$。",
    "steps": [
      [
        "被積函數 $r^3$ 跟 $\\theta$ 無關：$\\int_0^{2\\pi}\\int_0^1 r^3\\,dr\\,d\\theta=\\left(\\int_0^{2\\pi}d\\theta\\right)\\left(\\int_0^1 r^3\\,dr\\right)$。",
        "INT(1, 0, 2*pi) == 2*pi"
      ],
      [
        "$\\int_0^1 r^3\\,dr=\\frac{1}{4}$。",
        "INT(r^3, 0, 1, r) == 1/4"
      ],
      [
        "相乘：$2\\pi\\cdot\\frac{1}{4}=\\frac{\\pi}{2}$。",
        "2*pi*INT(r^3, 0, 1, r) == ANS"
      ]
    ],
    "trap": "看到極座標就反射性地再乘一次 $r$，算成 $\\int r^4\\,dr=\\frac{1}{5}$，得 $\\frac{2\\pi}{5}$。題目已經把 $r\\,dr\\,d\\theta$ 的 $r$ 寫進去了。",
    "check": [
      "這就是 $\\iint_{x^2+y^2\\le 1}(x^2+y^2)\\,dA$；用直角座標算也是 $\\frac{\\pi}{2}$。",
      "INT(INT(x^2+y^2, -sqrt(1-y^2), sqrt(1-y^2), x), -1, 1, y) == ANS"
    ]
  },
  "int-040": {
    "spot": "多項式乘 $e^{-x}$ 從 $0$ 積到 $\\infty$：這就是 $\\Gamma(2)=1!$。不想背 Gamma 就分部積分一次。",
    "why": "分部時讓 $x$ 被微掉、$e^{-x}$ 被積，一次就沒有 $x$ 了；反過來取會越積越複雜。",
    "steps": [
      [
        "$u=x$、$dv=e^{-x}dx$：$\\int xe^{-x}dx=-xe^{-x}+\\int e^{-x}dx=-(x+1)e^{-x}+C$。",
        "D(-(x+1)e^(-x)) == x*e^(-x)"
      ],
      [
        "上限：$x\\to\\infty$ 時 $(x+1)e^{-x}\\to 0$（指數贏多項式）；下限 $x=0$ 時是 $-1$。",
        "LIM(-(x+1)e^(-x), inf) == 0 ;; SUB(-(x+1)e^(-x), 0) == -1"
      ],
      [
        "$0-(-1)=1$。",
        "INT(x*e^(-x), 0, inf) == ANS"
      ]
    ],
    "trap": "下限代錯：$-(0+1)e^0=-1$，相減是 $0-(-1)=+1$；把符號弄反會得 $-1$，但被積函數恆正，答案不可能是負的。",
    "check": [
      "$\\Gamma(n+1)=n!$，$\\Gamma(2)=1!=1$，兩條路一致。",
      "INT(x^1*e^(-x), 0, inf) == ANS"
    ]
  },
  "int-065": {
    "spot": "分子是同一個函數 $e^{-tx}$ 在 $t=3$ 和 $t=7$ 的差、再除以 $x$：Frullani 型。$\\frac{e^{-3x}-e^{-7x}}{x}=\\int_3^7 e^{-tx}\\,dt$，換順序就好積。",
    "why": "拆成兩個積分各自在 $x=0$ 發散（$\\frac{1}{x}$）；寫成二重積分再交換，內層只是 $\\int_0^\\infty e^{-tx}dx=\\frac{1}{t}$。",
    "steps": [
      [
        "$\\frac{e^{-3x}-e^{-7x}}{x}=\\int_3^7 e^{-tx}\\,dt$（對 $t$ 積 $e^{-tx}$ 得 $-\\frac{e^{-tx}}{x}$）。",
        "(e^(-3x)-e^(-7x))/x == INT(e^(-t*x), 3, 7, t)"
      ],
      [
        "交換順序（被積函數是正的）：原積分 $=\\int_3^7\\int_0^\\infty e^{-tx}\\,dx\\,dt$，內層 $=\\frac{1}{t}$。",
        "INT(e^(-t*x), 0, inf, x) == 1/t"
      ],
      [
        "$\\int_3^7\\frac{dt}{t}=\\ln 7-\\ln 3=\\ln\\frac{7}{3}$。",
        "INT(1/t, 3, 7, t) == ANS ;; INT((e^(-3x)-e^(-7x))/x, 0, inf) == ANS"
      ]
    ],
    "trap": "Frullani 公式記反，答 $\\ln\\frac{3}{7}<0$。$e^{-3x}>e^{-7x}$，被積函數恆正，答案一定是正的：衰減得慢的那個（$a=3$）放分母。",
    "check": [
      "$\\ln\\frac{7}{3}\\approx 0.847>0$；被積函數在 $x\\to 0^+$ 趨近 $7-3=4$，不是發散的。",
      "LIM((e^(-3x)-e^(-7x))/x, 0+) == 4 ;; ANS > 0.84 ;; ANS < 0.85"
    ]
  },
  "rel-hard-cpx-006": {
    "spot": "分母 $(z-1)^2$：$z=1$ 是二階極點，分子 $e^z$ 在那裡解析。二階極點的留數 $=\\left.\\frac{d}{dz}\\left[(z-1)^2f(z)\\right]\\right|_{z=1}$。",
    "why": "也可以把 $e^z=e\\cdot e^{z-1}$ 對 $z-1$ 展開，但公式只要微一次 $e^z$，最短。",
    "steps": [
      [
        "$(z-1)^2f(z)=e^z$，在 $z=1$ 解析且不為零，所以確實是二階極點。",
        "SUB(e^x, 1) == e"
      ],
      [
        "二階極點公式：$\\mathrm{Res}=\\left.\\frac{d}{dz}e^z\\right|_{z=1}=e$。",
        "D(e^x, 1) == e"
      ],
      [
        "展開驗算：$e^z=e\\left(1+(z-1)+\\frac{(z-1)^2}{2}+\\cdots\\right)$，除以 $(z-1)^2$ 後 $\\frac{1}{z-1}$ 的係數是 $e$。圍道 $z=1+e^{it}$ 也給同一個值。",
        "LIM((e^x-e)/(x-1), 1) == ANS ;; INT(e^(1+cos(t))*cos(sin(t)-t), 0, 2*pi, t)/(2*pi) == ANS"
      ]
    ],
    "trap": "以為留數就是「分子在極點的值」$e^1=e$ —— 這題碰巧數字一樣，但道理是錯的：換成 $\\frac{e^{2z}}{(z-1)^2}$，分子值是 $e^2$，真正的留數是導數 $2e^2$。",
    "check": [
      "對照：$\\frac{e^{2z}}{(z-1)^2}$ 的留數是 $\\left.\\frac{d}{dz}e^{2z}\\right|_1=2e^2$，不是 $e^2$。",
      "D(e^(2x), 1) == 2*e^2"
    ]
  },
  "burst-boss-param-002": {
    "spot": "$xe^{-ax}$ 裡的 $x$ 可以由「對 $a$ 微分」產生：$\\frac{\\partial}{\\partial a}e^{-ax}=-xe^{-ax}$。先算簡單的 $\\int_0^\\infty e^{-ax}dx$，再對 $a$ 微。",
    "why": "分部積分也行，但參數微分一次處理整個家族 $\\int x^ne^{-ax}$，這題只是 $n=1$。",
    "steps": [
      [
        "$J(a)=\\int_0^\\infty e^{-ax}\\,dx=\\frac{1}{a}$（$a>0$）。",
        "INT(e^(-a*x), 0, inf, x) == 1/a"
      ],
      [
        "對 $a$ 微分：$J'(a)=\\int_0^\\infty(-x)e^{-ax}\\,dx=-I(a)$。",
        "INT(x*e^(-a*x), 0, inf, x) == -D(1/a, , a)"
      ],
      [
        "$J'(a)=-\\frac{1}{a^2}$，所以 $I(a)=\\frac{1}{a^2}$。",
        "-D(1/a, , a) == 1/a^2 ;; INT(x*e^(-a*x), 0, inf, x) == ANS"
      ]
    ],
    "trap": "忘了 $\\frac{\\partial}{\\partial a}e^{-ax}$ 帶出來的負號，得 $I(a)=-\\frac{1}{a^2}$。被積函數恆正，答案不可能是負的。",
    "check": [
      "$a=1$ 時是 $\\int_0^\\infty xe^{-x}dx=\\Gamma(2)=1$，跟 $\\frac{1}{1^2}$ 對得上。",
      "SUB(ANS, 1, a) == INT(x*e^(-x), 0, inf)"
    ]
  },
  "cx-curve-007": {
    "spot": "反曲點看的是 $f''$ 變號的點。$f=\\frac{x}{x^2+1}$ 是奇函數，$x=0$ 一定是一個；再看 $f''$ 的分子還有沒有別的根。",
    "why": "只解 $f''=0$ 還不夠，要確認每個根兩側真的變號 —— 這題分子是 $2x(x^2-3)$，三個單根，全部都變號。",
    "steps": [
      [
        "$f'=\\frac{(x^2+1)-x\\cdot 2x}{(x^2+1)^2}=\\frac{1-x^2}{(x^2+1)^2}$。",
        "D(x/(x^2+1)) == (1-x^2)/(x^2+1)^2"
      ],
      [
        "再微一次並約分：$f''=\\frac{2x(x^2-3)}{(x^2+1)^3}$。",
        "D2(x/(x^2+1)) == 2x(x^2-3)/(x^2+1)^3"
      ],
      [
        "分母恆正，$f''=0\\Leftrightarrow x=0,\\ \\pm\\sqrt{3}$。",
        "SUB(2x(x^2-3), 0) == 0 ;; SUB(2x(x^2-3), sqrt(3)) == 0 ;; SUB(2x(x^2-3), -sqrt(3)) == 0"
      ],
      [
        "正負號依序是 $(-\\infty,-\\sqrt{3})$ 負、$(-\\sqrt{3},0)$ 正、$(0,\\sqrt{3})$ 負、$(\\sqrt{3},\\infty)$ 正：三個點都變號，反曲點共 $3$ 個。",
        "D2(x/(x^2+1), -2) < 0 ;; D2(x/(x^2+1), -1) > 0 ;; D2(x/(x^2+1), 1) < 0 ;; D2(x/(x^2+1), 2) > 0 ;; 3 == ANS"
      ]
    ],
    "trap": "把 $f'=0$ 的 $x=\\pm 1$（極大、極小）當成反曲點，答 $2$。極值看 $f'$、凹凸看 $f''$。",
    "check": [
      "奇函數的反曲點對稱成對，再加上原點：$1+2=3$，數目是奇數合理。",
      "D2(x/(x^2+1), 0) == 0 ;; D2(x/(x^2+1), 1.5) == -D2(x/(x^2+1), -1.5)"
    ]
  },
  "cx-exam-001": {
    "spot": "分子是兩個根號相減、代 $x=0$ 得 $\\frac{0}{0}$：根號差就乘共軛，平方差會把根號消掉，剛好約掉分母的 $x$。",
    "why": "這其實是 $g(x)=\\sqrt{1+x}-\\sqrt{1-x}$ 在 $0$ 的導數，但有理化不用任何微分公式，一步就看到 $x$ 被約掉。",
    "steps": [
      [
        "代 $x=0$：分子 $1-1=0$、分母 $0$，是 $\\frac{0}{0}$。",
        "SUB(sqrt(1+x)-sqrt(1-x), 0) == 0"
      ],
      [
        "乘共軛 $\\sqrt{1+x}+\\sqrt{1-x}$：分子變成 $(1+x)-(1-x)=2x$，式子 $=\\frac{2}{\\sqrt{1+x}+\\sqrt{1-x}}$。",
        "SUB((sqrt(1+x)-sqrt(1-x))/x, 0.5) == SUB(2/(sqrt(1+x)+sqrt(1-x)), 0.5) ;; SUB((sqrt(1+x)-sqrt(1-x))/x, 0.2) == SUB(2/(sqrt(1+x)+sqrt(1-x)), 0.2)"
      ],
      [
        "現在可以直接代 $x=0$：$\\frac{2}{1+1}=1$。",
        "LIM(2/(sqrt(1+x)+sqrt(1-x)), 0) == ANS"
      ]
    ],
    "trap": "有理化後分子寫成 $(1+x)-(1-x)=x$（漏了 $2$），答 $\\frac{1}{2}$。",
    "check": [
      "導數觀點：$g'(0)=\\frac{1}{2}+\\frac{1}{2}=1$，一致。",
      "D(sqrt(1+x)-sqrt(1-x), 0) == ANS"
    ]
  },
  "cx-sa-002": {
    "spot": "$y=\\sqrt{4-x^2}$ 是半徑 $2$ 的上半圓，繞 $x$ 軸轉出整個球面。關鍵：$y\\sqrt{1+y'^2}$ 對圓永遠等於半徑，被積函數是常數。",
    "why": "公式 $S=2\\pi\\int y\\sqrt{1+y'^2}\\,dx$ 代進去會看到根號全部消掉；不必背球面積也能算。",
    "steps": [
      [
        "$y'=\\frac{-x}{\\sqrt{4-x^2}}$，$1+y'^2=\\frac{4}{4-x^2}$。",
        "D(sqrt(4-x^2)) == -x/sqrt(4-x^2) ;; 1+(x/sqrt(4-x^2))^2 == 4/(4-x^2)"
      ],
      [
        "$y\\sqrt{1+y'^2}=\\sqrt{4-x^2}\\cdot\\frac{2}{\\sqrt{4-x^2}}=2$，常數。",
        "sqrt(4-x^2)*sqrt(1+D(sqrt(4-x^2))^2) == 2"
      ],
      [
        "$S=2\\pi\\int_{-2}^{2}2\\,dx=2\\pi\\cdot 2\\cdot 4=16\\pi$。",
        "2*pi*INT(2, -2, 2) == ANS"
      ]
    ],
    "trap": "忘了弧長因子，算成 $2\\pi\\int_{-2}^2 y\\,dx=2\\pi\\cdot 2\\pi=4\\pi^2$ —— 那是把半圓面積乘 $2\\pi$，不是表面積。",
    "check": [
      "球面積 $4\\pi r^2=4\\pi\\cdot 4=16\\pi$。",
      "4*pi*2^2 == ANS"
    ]
  },
  "db-ext-001": {
    "spot": "閉區間 $[0,2]$ 上的連續函數求最大值：候選只有「區間內的臨界點」和「兩個端點」，全部代進去比大小。",
    "why": "不用判斷是極大還是極小，直接比值就好；最大值常常落在端點，二階判別法看不到。",
    "steps": [
      [
        "$f'(x)=3x^2-3=0\\Rightarrow x=\\pm 1$，在 $[0,2]$ 內只有 $x=1$。",
        "D(x^3-3x) == 3x^2-3 ;; SUB(3x^2-3, 1) == 0"
      ],
      [
        "代候選點：$f(0)=0$、$f(1)=-2$、$f(2)=8-6=2$。",
        "SUB(x^3-3x, 0) == 0 ;; SUB(x^3-3x, 1) == -2 ;; SUB(x^3-3x, 2) == 2"
      ],
      [
        "最大的是 $f(2)=2$（臨界點 $x=1$ 反而是最小值）。",
        "SUB(x^3-3x, 2) == ANS"
      ]
    ],
    "trap": "只看臨界點 $x=1$ 就停下，答 $-2$ —— 那是最小值。閉區間題一定要比端點。",
    "check": [
      "$f$ 在 $(1,2)$ 上遞增（$f'>0$），所以最大值在右端點合理。",
      "D(x^3-3x, 1.5) > 0 ;; SUB(x^3-3x, 1.9) < ANS"
    ]
  },
  "ch-mix-010": {
    "spot": "整個括號的 $5$ 次方，括號裡又有 $\\sin^2x$：三層鏈鎖 —— $(\\cdot)^5$、$1+(\\cdot)^2$、$\\sin x$。由外往內一層一層剝。",
    "why": "展開 $(1+\\sin^2x)^5$ 是自找麻煩；鏈鎖律每層一個因子，乘起來就好。",
    "steps": [
      [
        "最外層：$\\frac{d}{du}u^5=5u^4$，$u=1+\\sin^2x$。",
        "D(u^5, , u) == 5u^4"
      ],
      [
        "中間與最內層：$\\frac{d}{dx}(1+\\sin^2x)=2\\sin x\\cos x$。",
        "D(1+sin(x)^2) == 2sin(x)cos(x)"
      ],
      [
        "相乘：$5(1+\\sin^2x)^4\\cdot 2\\sin x\\cos x=10\\sin x\\cos x(1+\\sin^2x)^4$。",
        "D((1+sin(x)^2)^5) == 5(1+sin(x)^2)^4*2sin(x)cos(x) ;; D((1+sin(x)^2)^5) == ANS"
      ]
    ],
    "trap": "只剝兩層，把 $(\\sin^2x)'$ 寫成 $2\\sin x$（漏了 $\\cos x$），或寫成 $\\cos^2x$。",
    "check": [
      "代 $x=\\frac{\\pi}{4}$：$\\sin x\\cos x=\\frac{1}{2}$、$1+\\sin^2x=\\frac{3}{2}$，導數 $=10\\cdot\\frac{1}{2}\\cdot\\frac{81}{16}=\\frac{405}{16}$。",
      "SUB(ANS, pi/4) == 405/16 ;; D((1+sin(x)^2)^5, pi/4) == 405/16"
    ]
  },
  "cx-ode-001": {
    "spot": "$y'=3y$：變化率跟自己成正比，這是指數成長的定義式。解一定是 $Ce^{3x}$，再用 $y(0)$ 定 $C$。",
    "why": "分離變數 $\\frac{dy}{y}=3\\,dx$ 是推導，但這個型認得出來就直接寫答案，只剩代初值。",
    "steps": [
      [
        "分離變數：$\\frac{dy}{y}=3\\,dx\\Rightarrow\\ln|y|=3x+c\\Rightarrow y=Ce^{3x}$。",
        "D(e^(3x)) == 3e^(3x)"
      ],
      [
        "代 $y(0)=2$：$Ce^0=C=2$。",
        "SUB(2e^(3x), 0) == 2"
      ],
      [
        "$y=2e^{3x}$。",
        "2e^(3x) == ANS ;; D(ANS) == 3*ANS"
      ]
    ],
    "trap": "把常數加在外面寫成 $y=e^{3x}+1$（湊 $y(0)=2$）：微出來是 $3e^{3x}\\ne 3y$。積分常數在 $\\ln$ 那一層，變回來是「乘」一個常數。",
    "check": [
      "代回方程：$y'=6e^{3x}=3\\cdot 2e^{3x}=3y$，而且 $y(0)=2$。",
      "D(ANS) - 3*ANS == 0 ;; SUB(ANS, 0) == 2"
    ]
  },
  "cx-rev-004": {
    "spot": "區域夾在 $y$ 軸和曲線 $x=\\sqrt{y}$ 之間、$y$ 從 $0$ 到 $1$，又是繞 $y$ 軸：每個高度 $y$ 的切片是半徑 $\\sqrt{y}$ 的圓盤 —— 對 $y$ 積分。",
    "why": "繞 $y$ 軸又貼著 $y$ 軸的區域，用對 $y$ 的圓盤法最直接；殼層法要先想清楚殼的高度是 $1-x^2$。",
    "steps": [
      [
        "把曲線寫成 $x=\\sqrt{y}$：高度 $y$ 處的圓盤半徑是 $\\sqrt{y}$，面積 $\\pi y$。",
        "SUB(pi*(sqrt(y))^2, 0.25, y) == pi/4"
      ],
      [
        "$V=\\pi\\int_0^1 y\\,dy=\\frac{\\pi}{2}$。",
        "INT(pi*y, 0, 1, y) == ANS"
      ],
      [
        "殼層法交叉驗：$x$ 處的殼高 $1-x^2$，$V=2\\pi\\int_0^1x(1-x^2)\\,dx=2\\pi\\left(\\frac{1}{2}-\\frac{1}{4}\\right)=\\frac{\\pi}{2}$。",
        "INT(2*pi*x*(1-x^2), 0, 1) == ANS"
      ]
    ],
    "trap": "圓盤法卻對 $x$ 積：$\\pi\\int_0^1 x^2\\,dx=\\frac{\\pi}{3}$。繞 $y$ 軸的圓盤是水平的，厚度是 $dy$，半徑要寫成 $y$ 的函數。",
    "check": [
      "這個旋轉體裝在半徑 $1$、高 $1$ 的圓柱（體積 $\\pi$）裡，佔一半：$\\frac{\\pi}{2}<\\pi$。",
      "ANS < pi ;; ANS == pi/2"
    ]
  },
  "dd-par-001": {
    "spot": "$x$、$y$ 都用 $t$ 表示：參數式的斜率 $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$，各自對 $t$ 微再相除。",
    "why": "把 $t$ 消掉寫成 $y(x)$ 要解二次方程，麻煩又有兩支；直接相除最乾淨。",
    "steps": [
      [
        "$\\frac{dx}{dt}=2t-1$、$\\frac{dy}{dt}=3t^2-3$。",
        "D(t^2-t, , t) == 2t-1 ;; D(t^3-3t, , t) == 3t^2-3"
      ],
      [
        "$\\frac{dy}{dx}=\\frac{3t^2-3}{2t-1}$。",
        "D(t^3-3t, , t)/D(t^2-t, , t) == (3t^2-3)/(2t-1)"
      ],
      [
        "代 $t=2$：$\\frac{12-3}{4-1}=\\frac{9}{3}=3$。",
        "SUB((3t^2-3)/(2t-1), 2, t) == ANS"
      ]
    ],
    "trap": "只算 $\\frac{dy}{dt}=9$ 就交，或把分子分母顛倒成 $\\frac{dx/dt}{dy/dt}=\\frac{1}{3}$。",
    "check": [
      "數值驗：$t$ 從 $2$ 走到 $2.001$，$\\frac{\\Delta y}{\\Delta x}=\\frac{0.009006}{0.003001}\\approx 3.001$。",
      "(SUB(t^3-3t, 2.001, t)-2)/(SUB(t^2-t, 2.001, t)-2) > 2.99 ;; (SUB(t^3-3t, 2.001, t)-2)/(SUB(t^2-t, 2.001, t)-2) < 3.01"
    ]
  },
  "lm-sq-002": {
    "spot": "$\\cos\\frac{1}{x^2}$ 在 $0$ 附近瘋狂震盪，但它有界（在 $-1$ 和 $1$ 之間），前面還乘了一個趨近 $0$ 的 $x$：「有界 × 趨近零」，夾擠。",
    "why": "羅必達和代數化簡對震盪項都沒用；夾擠只需要 $|\\cos|\\le 1$ 一個事實。",
    "steps": [
      [
        "$\\left|\\cos\\frac{1}{x^2}\\right|\\le 1$，所以 $\\left|x\\cos\\frac{1}{x^2}\\right|\\le|x|$。",
        "abs(x*cos(1/x^2)) <= abs(x)"
      ],
      [
        "也就是 $-|x|\\le x\\cos\\frac{1}{x^2}\\le|x|$，兩邊都趨近 $0$。",
        "LIM(abs(x), 0) == 0 ;; LIM(-abs(x), 0) == 0"
      ],
      [
        "夾擠定理：極限 $=0$。",
        "LIM(abs(x), 0) == ANS ;; LIM(-abs(x), 0) == ANS"
      ]
    ],
    "trap": "看到 $\\cos\\frac{1}{x^2}$ 震盪就答「不存在」。震盪本身不可怕，要看有沒有因子把振幅壓到零 —— 這題有 $x$。",
    "check": [
      "代 $x=0.001$：$|x\\cos(10^6)|\\le 0.001$，已經貼著 $0$。",
      "abs(SUB(x*cos(1/x^2), 0.001)) <= 0.001"
    ]
  },
  "ode-h2-006": {
    "spot": "常係數二階齊次 $y''-y=0$：特徵方程 $r^2-1=0$ 兩個相異實根 $\\pm 1$，解是 $Ae^x+Be^{-x}$，再用兩個初值定 $A$、$B$。",
    "why": "注意是減號：$y''-y$ 給指數，$y''+y$ 才給三角函數；先看符號再寫通解。",
    "steps": [
      [
        "特徵方程 $r^2-1=0$，$r=\\pm 1$。",
        "SUB(r^2-1, 1, r) == 0 ;; SUB(r^2-1, -1, r) == 0"
      ],
      [
        "通解 $y=Ae^x+Be^{-x}$，$y'=Ae^x-Be^{-x}$。",
        "D2(3e^x+5e^(-x)) - (3e^x+5e^(-x)) == 0"
      ],
      [
        "初值：$y(0)=A+B=2$、$y'(0)=A-B=0$，所以 $A=B=1$。",
        "SUB(e^x+e^(-x), 0) == 2 ;; D(e^x+e^(-x), 0) == 0"
      ],
      [
        "$y=e^x+e^{-x}$（也就是 $2\\cosh x$）。",
        "e^x+e^(-x) == ANS ;; D2(ANS) - ANS == 0"
      ]
    ],
    "trap": "把 $y''-y=0$ 當成 $y''+y=0$，寫出 $A\\cos x+B\\sin x$，得 $2\\cos x$。代回去 $y''-y=-4\\cos x\\ne 0$。",
    "check": [
      "$y$ 是偶函數、$y(0)=2$ 是最小值，跟 $y'(0)=0$ 一致；而且 $y''(0)=y(0)=2>0$。",
      "D2(ANS, 0) == 2 ;; SUB(ANS, 1) > 2"
    ]
  },
  "an-sup-005": {
    "spot": "$x+\\frac{1}{x}$，兩項乘積是常數 $1$：算幾不等式的標準形，最小值在兩項相等（$x=1$）時。",
    "why": "微分找極值也行，但算幾一行同時給出下界和取到的位置；下確界就是最小值。",
    "steps": [
      [
        "$x+\\frac{1}{x}-2=\\left(\\sqrt{x}-\\frac{1}{\\sqrt{x}}\\right)^2\\ge 0$，所以每個元素都 $\\ge 2$。",
        "x+1/x-2 == (sqrt(x)-1/sqrt(x))^2 ;; x+1/x >= 2"
      ],
      [
        "等號在 $\\sqrt{x}=\\frac{1}{\\sqrt{x}}$，即 $x=1$：$1+1=2$ 真的在集合裡。",
        "SUB(x+1/x, 1) == 2"
      ],
      [
        "$2$ 是下界又被取到，所以 $\\inf S=\\min S=2$。",
        "SUB(x+1/x, 1) == ANS"
      ]
    ],
    "trap": "以為下確界要往邊界找：$x\\to 0^+$ 時 $x\\to 0$，就答 $0$ —— 但 $\\frac{1}{x}$ 同時爆到 $\\infty$。兩端都往上衝，最低點在中間。",
    "check": [
      "$x=0.9$ 和 $x=1.1$ 的值都比 $2$ 大一點點，$x=1$ 是谷底。",
      "SUB(x+1/x, 0.9) > ANS ;; SUB(x+1/x, 1.1) > ANS"
    ]
  },
  "cx-arc-003": {
    "spot": "$x=3\\cos t$、$y=3\\sin t$ 是半徑 $3$ 的圓，$t$ 走 $\\frac{\\pi}{2}$ 就是四分之一圓。參數式弧長 $\\int\\sqrt{x'^2+y'^2}\\,dt$，而圓的速率是常數 $3$。",
    "why": "套弧長公式之後根號裡是 $9(\\sin^2t+\\cos^2t)=9$，被積函數是常數；不用把它改寫成 $y(x)$。",
    "steps": [
      [
        "$x'=-3\\sin t$、$y'=3\\cos t$。",
        "D(3cos(t), , t) == -3sin(t) ;; D(3sin(t), , t) == 3cos(t)"
      ],
      [
        "速率 $\\sqrt{9\\sin^2t+9\\cos^2t}=3$。",
        "sqrt(D(3cos(t), , t)^2 + D(3sin(t), , t)^2) == 3"
      ],
      [
        "$L=\\int_0^{\\pi/2}3\\,dt=\\frac{3\\pi}{2}$。",
        "INT(3, 0, pi/2) == ANS"
      ]
    ],
    "trap": "忘了開根號，算成 $\\int_0^{\\pi/2}9\\,dt=\\frac{9\\pi}{2}$。",
    "check": [
      "圓周長 $2\\pi\\cdot 3=6\\pi$ 的四分之一是 $\\frac{3\\pi}{2}$。",
      "2*pi*3/4 == ANS"
    ]
  },
  "lm-os-001": {
    "spot": "單側極限 $x\\to 0^+$：先看指數 $-\\frac{1}{x}$ 往哪裡跑。$x$ 是很小的正數，$\\frac{1}{x}\\to+\\infty$，指數 $\\to-\\infty$。",
    "why": "羅必達用不上（不是分式），直接追蹤指數的去向最快；左右兩側要分開看。",
    "steps": [
      [
        "$x\\to 0^+$：$-\\frac{1}{x}\\to-\\infty$（例如 $x=0.01$ 時是 $-100$）。",
        "SUB(-1/x, 0.01) == -100"
      ],
      [
        "$e^u\\to 0$ 當 $u\\to-\\infty$，所以 $e^{-1/x}\\to 0$。",
        "LIM(e^u, -inf, u) == 0"
      ],
      [
        "右極限 $=0$。",
        "LIM(e^(-1/x), 0+) == ANS"
      ]
    ],
    "trap": "不看側：從左邊 $x\\to 0^-$ 時 $-\\frac{1}{x}\\to+\\infty$，$e^{-1/x}$ 爆掉。題目只問右側，答案是 $0$；要是問雙側就不存在。",
    "check": [
      "$x=0.1$ 時 $e^{-10}\\approx 4.5\\times 10^{-5}$ 已經很小；$x=-0.1$ 時 $e^{10}\\approx 22026$，兩側差很多。",
      "SUB(e^(-1/x), 0.1) < 0.0001 ;; SUB(e^(-1/x), -0.1) > 20000"
    ]
  },
  "vc-nab-006": {
    "spot": "「最大方向導數」就是梯度的長度 $|\\nabla f|$，方向是梯度方向。不用設單位向量去最佳化。",
    "why": "$D_{\\mathbf{u}}f=\\nabla f\\cdot\\mathbf{u}=|\\nabla f|\\cos\\theta$，$\\theta=0$ 時最大 —— 一條內積公式就結束。",
    "steps": [
      [
        "$\\nabla f=(2xy,\\ x^2,\\ 1)$。",
        "D(x^2*y+z, , x) == 2x*y ;; D(x^2*y+z, , y) == x^2 ;; D(x^2*y+z, , z) == 1"
      ],
      [
        "在 $(1,2,0)$：$\\nabla f=(4,1,1)$。",
        "D(x^2*2+0, 1) == 4 ;; D(1*y+0, 2, y) == 1 ;; D(1*2+z, 0, z) == 1"
      ],
      [
        "最大方向導數 $=|\\nabla f|=\\sqrt{16+1+1}=\\sqrt{18}=3\\sqrt{2}$。",
        "sqrt(4^2+1^2+1^2) == ANS"
      ]
    ],
    "trap": "把梯度分量直接相加 $4+1+1=6$，或忘了開根號答 $18$。",
    "check": [
      "沿單位向量 $\\frac{(4,1,1)}{3\\sqrt{2}}$ 的方向導數 $=\\frac{16+1+1}{3\\sqrt{2}}=3\\sqrt{2}$；換別的方向（例如 $(1,0,0)$）只得 $4<3\\sqrt{2}\\approx 4.24$。",
      "(4*4+1*1+1*1)/(3*sqrt(2)) == ANS ;; 4 < ANS"
    ]
  },
  "vc-surf-002": {
    "spot": "曲面是圓柱側面 $x^2+y^2=4$，被積函數正好是 $x^2+y^2$ —— 在曲面上它恆等於 $4$。常數提出來，剩下就是側面積。",
    "why": "不用真的參數化去積；但參數化 $(2\\cos\\theta,2\\sin\\theta,z)$ 能確認 $dS=2\\,d\\theta\\,dz$。",
    "steps": [
      [
        "在曲面上 $x^2+y^2=4$。參數化 $x=2\\cos\\theta$、$y=2\\sin\\theta$。",
        "(2cos(t))^2+(2sin(t))^2 == 4"
      ],
      [
        "$\\mathbf{r}_\\theta\\times\\mathbf{r}_z=(2\\cos\\theta,2\\sin\\theta,0)$，長度 $2$：$dS=2\\,d\\theta\\,dz$。側面積 $=2\\cdot 2\\pi\\cdot 3=12\\pi$。",
        "sqrt((2cos(t))^2+(2sin(t))^2) == 2 ;; 3*INT(2, 0, 2*pi) == 12*pi"
      ],
      [
        "$\\iint_S 4\\,dS=4\\cdot 12\\pi=48\\pi$。",
        "4*3*INT(2, 0, 2*pi) == ANS"
      ]
    ],
    "trap": "參數化後把 $dS$ 寫成 $d\\theta\\,dz$（漏了半徑 $2$），得 $24\\pi$。",
    "check": [
      "側面積 $2\\pi rh=2\\pi\\cdot 2\\cdot 3=12\\pi$，乘 $4$ 得 $48\\pi$。",
      "4*2*pi*2*3 == ANS"
    ]
  },
  "vc-green-001": {
    "spot": "$\\oint x\\,dy-y\\,dx$ 是格林定理的招牌式子：$\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}=1-(-1)=2$，所以它等於「兩倍面積」。",
    "why": "直接沿三條邊做線積分要參數化三次；格林把它變成面積，三角形面積一眼就有。",
    "steps": [
      [
        "$P=-y$、$Q=x$：$\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}=1+1=2$。",
        "D(x) - D(-y, , y) == 2"
      ],
      [
        "格林定理（逆時針）：$\\oint x\\,dy-y\\,dx=\\iint_D 2\\,dA=2\\cdot\\text{面積}$。",
        "INT(3-3x/2, 0, 2) == 3"
      ],
      [
        "三角形面積 $\\frac{1}{2}\\cdot 2\\cdot 3=3$，所以答案 $=6$。",
        "2*INT(3-3x/2, 0, 2) == ANS"
      ]
    ],
    "trap": "忘了係數 $2$，答 $3$（只是面積）。$\\frac{1}{2}\\oint x\\,dy-y\\,dx$ 才是面積。",
    "check": [
      "直接算：兩條座標軸上的邊貢獻 $0$（$y=0$ 時 $dy=0$、$x=0$ 時 $dx=0$），斜邊 $(2-2t,3t)$ 上被積式 $=6\\,dt$，積出 $6$。",
      "INT((2-2t)*3 - 3t*(-2), 0, 1, t) == ANS"
    ]
  },
  "vc-stokes-005": {
    "spot": "求旋度的通量、曲面又有邊界（上半球的邊界是赤道圓）：Stokes 定理把它換成沿邊界的線積分，而 $\\mathbf{F}=\\langle -y,x,0\\rangle$ 沿單位圓是最簡單的線積分。",
    "why": "在球面上直接積要算法向量和 $dS$；換成赤道線積分，被積式化簡成常數 $1$。",
    "steps": [
      [
        "$\\nabla\\times\\mathbf{F}=(0,0,\\ \\partial_x x-\\partial_y(-y))=(0,0,2)$。",
        "D(x) - D(-y, , y) == 2"
      ],
      [
        "Stokes：法向朝上 ↔ 邊界從上往下看逆時針。赤道 $x=\\cos t$、$y=\\sin t$，$t:0\\to 2\\pi$。",
        "SUB(cos(t)^2+sin(t)^2, 1, t) == 1"
      ],
      [
        "$-y\\,dx+x\\,dy=(\\sin^2t+\\cos^2t)\\,dt=dt$，積分 $=2\\pi$。",
        "INT(-sin(t)*D(cos(t), , t) + cos(t)*D(sin(t), , t), 0, 2*pi, t) == ANS"
      ]
    ],
    "trap": "方向弄反（順時針走赤道），得 $-2\\pi$。法向朝上時，右手四指沿邊界逆時針（從上往下看）。",
    "check": [
      "直接在球面上積：$\\nabla\\times\\mathbf{F}\\cdot\\mathbf{n}=2z=2\\cos\\varphi$，$dS=\\sin\\varphi\\,d\\varphi\\,d\\theta$，$2\\pi\\int_0^{\\pi/2}2\\cos\\varphi\\sin\\varphi\\,d\\varphi=2\\pi$。",
      "2*pi*INT(2*cos(u)*sin(u), 0, pi/2, u) == ANS"
    ]
  },
  "int-042": {
    "spot": "根號裡是 $1+x^3$，外面正好有 $x^2$ —— 它的導數（差常數 $3$）。內層導數就在旁邊，代 $u=1+x^3$。",
    "why": "看到「函數 × 它內層的導數」就是代換的訊號，不需要分部或展開。",
    "steps": [
      [
        "$u=1+x^3$，$du=3x^2dx$，所以 $x^2dx=\\frac{du}{3}$。",
        "D(1+x^3) == 3x^2"
      ],
      [
        "$\\int\\frac{1}{3}u^{1/2}du=\\frac{1}{3}\\cdot\\frac{2}{3}u^{3/2}=\\frac{2}{9}u^{3/2}$。",
        "D((2/9)*u^(3/2), , u) == u^(1/2)/3"
      ],
      [
        "換回 $x$：$\\frac{2}{9}(1+x^3)^{3/2}+C$。",
        "D((2/9)*(1+x^3)^(3/2)) == x^2*sqrt(1+x^3) ;; (2/9)*(1+x^3)^(3/2) ~= ANS"
      ]
    ],
    "trap": "忘了 $du=3x^2dx$ 的 $\\frac{1}{3}$，得 $\\frac{2}{3}(1+x^3)^{3/2}$；微回去會多出一個 $3$。",
    "check": [
      "$\\int_0^2$：$\\frac{2}{9}(27-1)=\\frac{52}{9}$，跟數值積分一致。",
      "INT(x^2*sqrt(1+x^3), 0, 2) == 52/9"
    ]
  },
  "exam-der-005": {
    "spot": "三個因子 $x^2$、$e^{-x}$、$\\sin x$ 相乘：三因子乘積法則 $(uvw)'=u'vw+uv'w+uvw'$ —— 每次只微一個，其他照抄。",
    "why": "兩兩分組套兩次乘積法則也行，但三項輪流微最不容易漏；$e^{-x}$ 可以最後提出來。",
    "steps": [
      [
        "各自的導數：$(x^2)'=2x$、$(e^{-x})'=-e^{-x}$、$(\\sin x)'=\\cos x$。",
        "D(x^2) == 2x ;; D(e^(-x)) == -e^(-x) ;; D(sin(x)) == cos(x)"
      ],
      [
        "輪流微：$2x\\,e^{-x}\\sin x-x^2e^{-x}\\sin x+x^2e^{-x}\\cos x$。",
        "D(x^2*e^(-x)*sin(x)) == 2x*e^(-x)*sin(x) - x^2*e^(-x)*sin(x) + x^2*e^(-x)*cos(x)"
      ],
      [
        "提出 $e^{-x}$：$e^{-x}\\left(2x\\sin x-x^2\\sin x+x^2\\cos x\\right)$。",
        "D(x^2*e^(-x)*sin(x)) == ANS"
      ]
    ],
    "trap": "$e^{-x}$ 的導數漏掉負號，中間那項變成 $+x^2e^{-x}\\sin x$。",
    "check": [
      "對數微分交叉驗：$\\frac{f'}{f}=\\frac{2}{x}-1+\\cot x$，乘回 $f$ 就是上面三項。",
      "ANS/(x^2*e^(-x)*sin(x)) == 2/x - 1 + cos(x)/sin(x)"
    ]
  },
  "int-033": {
    "spot": "區域是圓盤 $x^2+y^2\\le 4$：極座標。被積函數 $x^2=r^2\\cos^2\\theta$，加上面積元素的 $r$，$r$ 和 $\\theta$ 分離。",
    "why": "直角座標要積 $x^2\\sqrt{4-x^2}$，得三角代換；極座標下兩個一維積分相乘。也可以用對稱：$\\iint x^2=\\iint y^2=\\frac{1}{2}\\iint r^2$。",
    "steps": [
      [
        "$\\iint x^2\\,dA=\\int_0^{2\\pi}\\int_0^2 r^2\\cos^2\\theta\\cdot r\\,dr\\,d\\theta=\\left(\\int_0^{2\\pi}\\cos^2\\theta\\,d\\theta\\right)\\left(\\int_0^2 r^3\\,dr\\right)$。",
        "INT(r^3, 0, 2, r) == 4"
      ],
      [
        "$\\int_0^{2\\pi}\\cos^2\\theta\\,d\\theta=\\pi$（$\\cos^2$ 在一整圈的平均是 $\\frac{1}{2}$）。",
        "INT(cos(t)^2, 0, 2*pi, t) == pi"
      ],
      [
        "相乘：$\\pi\\cdot 4=4\\pi$。",
        "INT(cos(t)^2, 0, 2*pi, t)*INT(r^3, 0, 2, r) == ANS"
      ]
    ],
    "trap": "忘了面積元素的 $r$，算成 $\\int_0^2 r^2\\,dr=\\frac{8}{3}$，得 $\\frac{8\\pi}{3}$。",
    "check": [
      "直角座標：對 $y$ 先積得 $2x^2\\sqrt{4-x^2}$，再對 $x$ 從 $-2$ 積到 $2$，也是 $4\\pi$。",
      "INT(2*x^2*sqrt(4-x^2), -2, 2) == ANS"
    ]
  },
  "ig-num-003": {
    "spot": "左端點和：每一段用「左邊那一點」的高度。$[0,2]$ 切 $4$ 段，寬 $\\frac{1}{2}$，取樣點 $0,\\frac{1}{2},1,\\frac{3}{2}$ —— 不含右端的 $2$。",
    "why": "黎曼和就是照定義加：先列取樣點、再算高度、最後乘寬度，三步不會亂。",
    "steps": [
      [
        "$\\Delta x=\\frac{2-0}{4}=\\frac{1}{2}$，左端點 $0,\\frac{1}{2},1,\\frac{3}{2}$。",
        "SUB(x^2, 3/2) == 9/4"
      ],
      [
        "高度和：$0+\\frac{1}{4}+1+\\frac{9}{4}=\\frac{7}{2}$。",
        "SUB(x^2, 0)+SUB(x^2, 1/2)+SUB(x^2, 1)+SUB(x^2, 3/2) == 7/2"
      ],
      [
        "乘寬度：$\\frac{1}{2}\\cdot\\frac{7}{2}=\\frac{7}{4}$。",
        "(1/2)*(SUB(x^2, 0)+SUB(x^2, 1/2)+SUB(x^2, 1)+SUB(x^2, 3/2)) == ANS"
      ]
    ],
    "trap": "取到右端點 $2$（$\\frac{1}{2},1,\\frac{3}{2},2$），那是右端點和 $\\frac{15}{4}$；或忘了乘 $\\Delta x$，答 $\\frac{7}{2}$。",
    "check": [
      "$x^2$ 在 $[0,2]$ 遞增，左端點和一定低估：$\\frac{7}{4}<\\int_0^2x^2dx=\\frac{8}{3}$。",
      "ANS < INT(x^2, 0, 2)"
    ]
  },
  "lim-025": {
    "spot": "$x$ 和 $y$ 只以乘積 $xy$ 的形式出現：令 $u=xy$，$(x,y)\\to(0,0)$ 時 $u\\to 0$，變成單變數的 $\\frac{\\sin u}{u}$。",
    "why": "試路徑只能證明極限不存在、不能證明存在；整體代換才能一次涵蓋所有接近方式。",
    "steps": [
      [
        "$|xy|\\le\\frac{x^2+y^2}{2}$，所以 $(x,y)\\to(0,0)$ 時 $u=xy\\to 0$。",
        "abs(x*y) <= (x^2+y^2)/2"
      ],
      [
        "標準極限：$\\lim_{u\\to 0}\\frac{\\sin u}{u}=1$。",
        "LIM(sin(u)/u, 0, u) == 1"
      ],
      [
        "所以原極限 $=1$（在 $xy=0$ 的座標軸上函數沒定義，極限只看定義域內的點）。",
        "LIM(sin(u)/u, 0, u) == ANS"
      ]
    ],
    "trap": "只試 $y=x$、$y=2x$ 幾條路徑都得 $1$ 就下結論。路徑法只能否定；這題能成立，是因為整個式子只透過 $u=xy$ 依賴 $(x,y)$。",
    "check": [
      "沿 $y=x$：$\\frac{\\sin x^2}{x^2}\\to 1$；沿 $y=x^2$：$\\frac{\\sin x^3}{x^3}\\to 1$，跟結論一致。",
      "LIM(sin(x^2)/x^2, 0) == ANS ;; LIM(sin(x^3)/x^3, 0) == ANS"
    ]
  },
  "lm-rs-004": {
    "spot": "$\\frac{1}{n}\\sum_{k=1}^n f\\!\\left(\\frac{k}{n}\\right)$ 的形狀：$\\frac{1}{n}$ 是寬度、$\\frac{k}{n}$ 是 $[0,1]$ 上的取樣點。看到它就翻成 $\\int_0^1 f(x)\\,dx$，這題 $f=\\sqrt{x}$。",
    "why": "$\\sum\\sqrt{k}$ 沒有封閉公式，直接求和走不通；黎曼和是唯一順路。",
    "steps": [
      [
        "$\\Delta x=\\frac{1}{n}$、$x_k=\\frac{k}{n}$（右端點），$f(x)=\\sqrt{x}$。例如 $n=4$ 的和略大於積分（$\\sqrt{x}$ 遞增，右端點高估）。",
        "(1/4)*(sqrt(1/4)+sqrt(2/4)+sqrt(3/4)+sqrt(4/4)) > INT(sqrt(x), 0, 1)"
      ],
      [
        "$n\\to\\infty$：和 $\\to\\int_0^1\\sqrt{x}\\,dx$。",
        "D(2/3*x^(3/2)) == sqrt(x)"
      ],
      [
        "$\\int_0^1x^{1/2}dx=\\left[\\frac{2}{3}x^{3/2}\\right]_0^1=\\frac{2}{3}$。",
        "INT(sqrt(x), 0, 1) == ANS"
      ]
    ],
    "trap": "漏看前面的 $\\frac{1}{n}$，覺得 $\\sum\\sqrt{k/n}$ 有 $n$ 項、每項最多 $1$，就說發散。$\\frac{1}{n}$ 正是寬度，把它變成平均。",
    "check": [
      "$\\sqrt{x}$ 在 $[0,1]$ 的平均高度 $\\frac{2}{3}$ 介於 $0$ 和 $1$ 之間，而且比 $\\sqrt{\\frac{1}{2}}\\approx 0.707$ 小（凹函數的平均小於中點值）。",
      "ANS < sqrt(1/2) ;; ANS > 0.5"
    ]
  },
  "si-int-014": {
    "spot": "函數套了兩層 $\\ln$：每一層 $\\ln$ 都要求「裡面 $>0$」。外層要求 $\\ln x>0$，內層要求 $x>0$，取交集。",
    "why": "由外往內列條件最不會漏；外層的條件 $\\ln x>0$ 比內層嚴格，交集就是它。",
    "steps": [
      [
        "內層 $\\ln x$ 要 $x>0$。",
        "SUB(ln(x), 0.5) < 0"
      ],
      [
        "外層 $\\ln(\\ln x)$ 要 $\\ln x>0$。$\\ln$ 遞增且 $\\ln 1=0$，所以 $\\ln x>0\\Leftrightarrow x>1$。",
        "SUB(ln(x), 1) == 0 ;; SUB(ln(x), 1.001) > 0"
      ],
      [
        "$x>1$ 已經包含 $x>0$，定義域是 $(1,\\infty)$，開區間、不含 $1$。",
        "SUB(ln(ln(x)), e) == 0"
      ]
    ],
    "trap": "只寫內層條件得 $(0,\\infty)$；或寫成 $[1,\\infty)$ —— 但 $\\ln(\\ln 1)=\\ln 0$ 沒有定義。",
    "check": [
      "$x=e$ 在定義域裡：$\\ln(\\ln e)=\\ln 1=0$；$x=0.5$ 不在：$\\ln 0.5<0$，外層取不了 $\\ln$。",
      "SUB(ln(ln(x)), e) == 0 ;; SUB(ln(x), 0.5) < 0"
    ]
  },
  "an-en-001": {
    "spot": "$a_n-2$ 化簡後是 $-\\frac{5}{n+3}$，很乾淨：解 $\\frac{5}{n+3}<0.01$ 這個不等式，再取最小整數。",
    "why": "先把誤差化成單一分式，ε-N 就只是解一次不等式；直接代數字試是猜，不是找最小值。",
    "steps": [
      [
        "$a_n-2=\\frac{2n+1-2(n+3)}{n+3}=\\frac{-5}{n+3}$，所以 $|a_n-2|=\\frac{5}{n+3}$。",
        "(2n+1)/(n+3)-2 == -5/(n+3)"
      ],
      [
        "$\\frac{5}{n+3}<0.01\\Leftrightarrow n+3>500\\Leftrightarrow n>497$。",
        "SUB(5/(n+3), 497, n) == 0.01 ;; SUB(5/(n+3), 498, n) < 0.01"
      ],
      [
        "$n=497$ 時剛好等於 $0.01$（不是嚴格小於），所以最小的 $N=498$；$\\frac{5}{n+3}$ 遞減，之後全部成立。",
        "5/(n+4) < 5/(n+3) ;; 498 == ANS"
      ]
    ],
    "trap": "解出 $n+3\\ge 500$ 而答 $N=497$：題目要的是嚴格不等式 $<0.01$，$n=497$ 只做到 $=0.01$。",
    "check": [
      "$a_{498}=\\frac{997}{501}\\approx 1.99002$，跟 $2$ 差 $0.00998<0.01$。",
      "abs(SUB((2n+1)/(n+3), 498, n)-2) < 0.01 ;; abs(SUB((2n+1)/(n+3), 497, n)-2) >= 0.01"
    ]
  },
  "an-int-002": {
    "spot": "達布上和：每一段取 $f$ 的上確界。$x^2$ 在 $[0,1]$ 遞增，每段的最大值就在右端點 —— 上和等於右端點黎曼和。",
    "why": "單調函數不用找每段的 $\\sup$，直接取端點；遞增取右、遞減取左。",
    "steps": [
      [
        "分點 $0,\\frac{1}{4},\\frac{1}{2},\\frac{3}{4},1$，每段寬 $\\frac{1}{4}$；$f$ 遞增，各段最大值在右端點 $\\frac{1}{4},\\frac{1}{2},\\frac{3}{4},1$。",
        "D(x^2, 0.5) > 0"
      ],
      [
        "高度：$\\frac{1}{16}+\\frac{4}{16}+\\frac{9}{16}+\\frac{16}{16}=\\frac{30}{16}$。",
        "SUB(x^2, 1/4)+SUB(x^2, 1/2)+SUB(x^2, 3/4)+SUB(x^2, 1) == 30/16"
      ],
      [
        "$U_4=\\frac{1}{4}\\cdot\\frac{30}{16}=\\frac{15}{32}$。",
        "(1/4)*(SUB(x^2, 1/4)+SUB(x^2, 1/2)+SUB(x^2, 3/4)+SUB(x^2, 1)) == ANS"
      ]
    ],
    "trap": "用左端點，算成 $\\frac{1}{4}\\cdot\\frac{14}{16}=\\frac{7}{32}$ —— 那是下和。",
    "check": [
      "上和一定 $\\ge$ 積分 $\\frac{1}{3}$，而且上和減下和 $=\\frac{1}{4}(f(1)-f(0))=\\frac{1}{4}$。",
      "ANS > INT(x^2, 0, 1) ;; ANS - 7/32 == 1/4"
    ]
  },
  "an-sup-001": {
    "spot": "$1-\\frac{1}{n}$ 隨 $n$ 遞增、永遠小於 $1$、又無限靠近 $1$：上確界是 $1$，但不被取到。",
    "why": "證 $\\sup$ 要兩件事：是上界、而且沒有更小的上界；遞增數列的 $\\sup$ 就是它的極限。",
    "steps": [
      [
        "每一項 $1-\\frac{1}{n}<1$：$1$ 是上界。",
        "1-1/n < 1"
      ],
      [
        "任何 $1-\\varepsilon$ 都不是上界：取 $n>\\frac{1}{\\varepsilon}$ 就有 $1-\\frac{1}{n}>1-\\varepsilon$（例如 $\\varepsilon=0.01$ 取 $n=101$）。",
        "SUB(1-1/n, 101, n) > 0.99"
      ],
      [
        "所以 $\\sup S=1$（等於 $n\\to\\infty$ 的極限），但 $1\\notin S$，$S$ 沒有最大元。",
        "LIM(1-1/n, inf, n) == ANS"
      ]
    ],
    "trap": "以為 $\\sup$ 一定是集合裡最大的那個數，因為找不到最大元就說不存在。$\\sup$ 只要求最小上界，不必被取到。",
    "check": [
      "$S$ 的最小元是 $n=1$ 的 $0$，最大的上界下限是 $1$：所有元素都在 $[0,1)$ 裡。",
      "SUB(1-1/n, 1, n) == 0 ;; SUB(1-1/n, 1000, n) < ANS"
    ]
  },
  "an-sup-006": {
    "spot": "$\\frac{n}{2^n}$：分子線性長、分母指數長，最後趨近 $0$；但開頭幾項不一定遞減。$\\sup$ 要看最前面，不是看極限。",
    "why": "看相鄰比值 $\\frac{a_{n+1}}{a_n}=\\frac{n+1}{2n}$ 何時 $\\le 1$，就知道數列從哪裡開始下降，最大值一定在那之前。",
    "steps": [
      [
        "前幾項：$a_1=\\frac{1}{2}$、$a_2=\\frac{2}{4}=\\frac{1}{2}$、$a_3=\\frac{3}{8}$。",
        "SUB(n/2^n, 1, n) == 1/2 ;; SUB(n/2^n, 2, n) == 1/2 ;; SUB(n/2^n, 3, n) == 3/8"
      ],
      [
        "比值 $\\frac{a_{n+1}}{a_n}=\\frac{n+1}{2n}$：$n=1$ 時等於 $1$，$n\\ge 2$ 時 $<1$。所以從 $a_2$ 之後一路遞減。",
        "SUB((n+1)/(2n), 1, n) == 1 ;; (n+1)/(2n) < 1"
      ],
      [
        "最大值是 $a_1=a_2=\\frac{1}{2}$，所以 $\\sup S=\\frac{1}{2}$，而且被取到。",
        "SUB(n/2^n, 1, n) == ANS"
      ]
    ],
    "trap": "看到 $\\frac{n}{2^n}\\to 0$ 就答 $0$。$0$ 是下確界（極限、取不到），上確界在數列開頭。",
    "check": [
      "所有項都 $\\le\\frac{1}{2}$：$n=4$ 是 $\\frac{1}{4}$、$n=10$ 約 $0.0098$。",
      "SUB(n/2^n, 4, n) < ANS ;; LIM(n/2^n, inf, n) == 0"
    ]
  },
  "cx-curve-004": {
    "spot": "分子分母都是二次：$x\\to\\pm\\infty$ 時只剩最高次項 $\\frac{2x^2}{x^2}$，水平漸近線就是首項係數比。",
    "why": "長除法 $\\frac{2x^2+1}{x^2+3}=2-\\frac{5}{x^2+3}$ 同時給出漸近線和「從哪一側靠近」，比只背係數比多一層保險。",
    "steps": [
      [
        "長除：$\\frac{2x^2+1}{x^2+3}=2-\\frac{5}{x^2+3}$。",
        "(2x^2+1)/(x^2+3) == 2-5/(x^2+3)"
      ],
      [
        "$x\\to\\pm\\infty$ 時 $\\frac{5}{x^2+3}\\to 0$。",
        "LIM(5/(x^2+3), inf) == 0"
      ],
      [
        "兩側極限都是 $2$，水平漸近線 $y=2$。",
        "LIM((2x^2+1)/(x^2+3), inf) == ANS ;; LIM((2x^2+1)/(x^2+3), -inf) == ANS"
      ]
    ],
    "trap": "拿常數項比 $\\frac{1}{3}$ 當答案 —— 那是 $y(0)$，看的是 $x\\to 0$，不是 $x\\to\\infty$。",
    "check": [
      "因為減掉的 $\\frac{5}{x^2+3}$ 恆正，曲線永遠在 $y=2$ 下方，從下面貼近。",
      "(2x^2+1)/(x^2+3) < ANS ;; SUB((2x^2+1)/(x^2+3), 100) > 1.999"
    ]
  },
  "der-025": {
    "spot": "對 $x$ 偏微分：$y$ 整個當常數。外層 $\\ln u$、內層 $u=x^2+y^2$，一層鏈鎖律。",
    "why": "偏微分就是普通微分加一條規則「其他變數不動」，不需要新公式。",
    "steps": [
      [
        "內層對 $x$：$\\frac{\\partial}{\\partial x}(x^2+y^2)=2x$（$y^2$ 是常數，微掉）。",
        "D(x^2+y^2, , x) == 2x"
      ],
      [
        "外層：$\\frac{d}{du}\\ln u=\\frac{1}{u}$。",
        "D(ln(u), , u) == 1/u"
      ],
      [
        "相乘：$\\frac{2x}{x^2+y^2}$。",
        "D(ln(x^2+y^2), , x) == ANS"
      ]
    ],
    "trap": "把 $y^2$ 也微成 $2y$，得 $\\frac{2x+2y}{x^2+y^2}$ —— 那是把 $y$ 當成 $x$ 的函數（隱微分），不是偏微分。",
    "check": [
      "對稱：$\\frac{\\partial}{\\partial y}$ 應該得 $\\frac{2y}{x^2+y^2}$，把 $x,y$ 對調正好是它。",
      "D(ln(x^2+y^2), , y) == 2y/(x^2+y^2)"
    ]
  },
  "gap-int-polar-001": {
    "spot": "$r=2$ 是常數：圓。$\\theta$ 從 $0$ 到 $\\frac{\\pi}{2}$ 是四分之一圓。極座標面積公式 $A=\\frac{1}{2}\\int r^2\\,d\\theta$。",
    "why": "公式來自扇形面積 $\\frac{1}{2}r^2\\Delta\\theta$；這題甚至可以直接用四分之一圓面積驗。",
    "steps": [
      [
        "$A=\\frac{1}{2}\\int_0^{\\pi/2}r^2\\,d\\theta$，$r^2=4$。",
        "INT(r, 0, 2, r) == 1/2*2^2"
      ],
      [
        "$A=\\frac{1}{2}\\cdot 4\\cdot\\frac{\\pi}{2}=\\pi$。",
        "INT(1/2*2^2, 0, pi/2) == ANS"
      ],
      [
        "對照：半徑 $2$ 的圓面積 $4\\pi$，四分之一是 $\\pi$。",
        "(1/4)*pi*2^2 == ANS"
      ]
    ],
    "trap": "寫成 $\\int r\\,d\\theta=\\int_0^{\\pi/2}2\\,d\\theta$，這題碰巧也得 $\\pi$ —— 但那是弧長。換成 $r=3$ 就露餡：弧長 $\\frac{3\\pi}{2}$，面積 $\\frac{9\\pi}{4}$。",
    "check": [
      "$r=3$ 的四分之一圓：面積公式給 $\\frac{9\\pi}{4}$，跟 $\\frac{1}{4}\\pi\\cdot 9$ 一致；而 $\\int r\\,d\\theta$ 給的是 $\\frac{3\\pi}{2}$，不一樣。",
      "INT(1/2*3^2, 0, pi/2) == pi*9/4 ;; INT(3, 0, pi/2) == 3*pi/2"
    ]
  },
  "int-026": {
    "spot": "積分範圍是長方形（上下限全是常數）、被積函數 $xy$ 是「$x$ 的函數 × $y$ 的函數」：二重積分直接拆成兩個一維積分相乘。",
    "why": "可以先積 $y$ 再積 $x$，但分離之後兩個都是一行的積分，不用處理中間式。",
    "steps": [
      [
        "先積內層 $y$（$x$ 當常數）：$\\int_0^3 xy\\,dy=\\frac{9}{2}x$。",
        "INT(x*y, 0, 3, y) == 9x/2"
      ],
      [
        "等同於分離：$\\left(\\int_0^2x\\,dx\\right)\\left(\\int_0^3y\\,dy\\right)=2\\cdot\\frac{9}{2}$。",
        "INT(x, 0, 2) == 2 ;; INT(y, 0, 3, y) == 9/2"
      ],
      [
        "$2\\cdot\\frac{9}{2}=9$。",
        "INT(x, 0, 2)*INT(y, 0, 3, y) == ANS ;; INT(9x/2, 0, 2) == ANS"
      ]
    ],
    "trap": "對不上上下限：$dy$ 在內層，所以 $y$ 用 $0$ 到 $3$、$x$ 用 $0$ 到 $2$。這題對調碰巧結果一樣，但被積函數不對稱時（例如 $xy^2$）就會錯。",
    "check": [
      "$xy$ 在長方形上的平均值是 $\\bar{x}\\bar{y}=1\\cdot\\frac{3}{2}$，乘面積 $6$ 得 $9$。",
      "1*(3/2)*6 == ANS"
    ]
  },
  "tb-mvt-003": {
    "spot": "均值定理：找 $c$ 使 $f'(c)$ 等於割線斜率。$f=\\frac{1}{x}$ 的導數 $-\\frac{1}{c^2}$ 很好解，算完記得檢查 $c$ 在區間內。",
    "why": "照定義兩步：先算割線斜率、再解 $f'(c)=$ 斜率；解出兩個根時用區間篩掉一個。",
    "steps": [
      [
        "割線斜率：$\\frac{f(4)-f(1)}{4-1}=\\frac{\\frac{1}{4}-1}{3}=-\\frac{1}{4}$。",
        "(SUB(1/x, 4)-SUB(1/x, 1))/3 == -1/4"
      ],
      [
        "$f'(c)=-\\frac{1}{c^2}=-\\frac{1}{4}\\Rightarrow c^2=4\\Rightarrow c=\\pm 2$。",
        "D(1/x) == -1/x^2 ;; D(1/x, 2) == -1/4"
      ],
      [
        "只有 $c=2$ 在 $(1,4)$ 裡。",
        "D(1/x, ANS) == -1/4 ;; sqrt(1*4) == ANS"
      ]
    ],
    "trap": "解完 $c^2=4$ 寫 $c=\\pm 2$ 就交。均值定理保證的 $c$ 在開區間 $(1,4)$ 裡，$-2$ 要刪。",
    "check": [
      "$\\frac{1}{x}$ 的均值點恰好是端點的幾何平均 $\\sqrt{ab}$：$\\sqrt{1\\cdot 4}=2$。",
      "sqrt(1*4) == ANS"
    ]
  },
  "vc-cons-002": {
    "spot": "$\\mathbf{F}=\\langle e^x\\sin y,\\ e^x\\cos y\\rangle$：兩個分量一看就是 $e^x\\sin y$ 分別對 $x$、$y$ 偏微分 —— 保守場，有位能 $f=e^x\\sin y$，線積分只看終點減起點。",
    "why": "題目沒給路徑形狀，正是在暗示「跟路徑無關」；位能法免參數化。",
    "steps": [
      [
        "檢查保守：$\\frac{\\partial P}{\\partial y}=e^x\\cos y=\\frac{\\partial Q}{\\partial x}$。",
        "D(e^x*sin(y), , y) == D(e^x*cos(y), , x)"
      ],
      [
        "位能 $f=e^x\\sin y$：$f_x=e^x\\sin y$、$f_y=e^x\\cos y$，正好是 $\\mathbf{F}$。",
        "D(e^x*sin(y), , x) == e^x*sin(y) ;; D(e^x*sin(y), , y) == e^x*cos(y)"
      ],
      [
        "$\\int_C\\mathbf{F}\\cdot d\\mathbf{r}=f\\left(0,\\frac{\\pi}{2}\\right)-f(0,0)=1-0=1$。",
        "SUB(SUB(e^x*sin(y), 0, x), pi/2, y) - SUB(SUB(e^x*sin(y), 0, x), 0, y) == ANS"
      ]
    ],
    "trap": "沒注意是保守場，自己挑一條路徑參數化卻漏了 $dy$ 那一項；或把位能寫成 $e^x\\cos y$（拿 $Q$ 當位能）。",
    "check": [
      "沿直線 $x=0$、$y=t$：$\\mathbf{F}\\cdot d\\mathbf{r}=e^0\\cos t\\,dt$，$\\int_0^{\\pi/2}\\cos t\\,dt=1$。",
      "INT(cos(t), 0, pi/2, t) == ANS"
    ]
  },
  "an-int-004": {
    "spot": "達布下和取每段的下確界；$\\frac{1}{x}$ 在 $[1,2]$ 遞減，每段的最小值在右端點。",
    "why": "單調函數直接取端點，遞減時下和用右端點、上和用左端點；不用逐段找 $\\inf$。",
    "steps": [
      [
        "分點 $1,1.2,1.4,1.6,1.8,2$，寬 $\\frac{1}{5}$；$f$ 遞減，取右端點 $1.2,1.4,1.6,1.8,2$。",
        "D(1/x, 1.5) < 0"
      ],
      [
        "每一項 $\\frac{1}{5}\\cdot\\frac{1}{1+k/5}=\\frac{1}{5+k}$：例如 $\\frac{1}{5}\\cdot\\frac{1}{1.2}=\\frac{1}{6}$。",
        "(1/5)*SUB(1/x, 1.2) == 1/6 ;; (1/5)*SUB(1/x, 2) == 1/10"
      ],
      [
        "$L_5=\\frac{1}{6}+\\frac{1}{7}+\\frac{1}{8}+\\frac{1}{9}+\\frac{1}{10}\\approx 0.6456$。",
        "(1/5)*(SUB(1/x, 1.2)+SUB(1/x, 1.4)+SUB(1/x, 1.6)+SUB(1/x, 1.8)+SUB(1/x, 2)) == ANS"
      ]
    ],
    "trap": "照遞增函數的習慣用左端點，得 $\\frac{1}{5}+\\frac{1}{6}+\\cdots+\\frac{1}{9}\\approx 0.7456$ —— 那是上和。",
    "check": [
      "下和要小於 $\\int_1^2\\frac{dx}{x}=\\ln 2\\approx 0.693$，上和要大於它。",
      "ANS < ln(2) ;; 1/5+1/6+1/7+1/8+1/9 > ln(2)"
    ]
  },
  "an-ls-001": {
    "spot": "$(-1)^n$ 把數列拆成兩條子數列：偶數項 $\\frac{n}{n+1}\\to 1$、奇數項 $-\\frac{n}{n+1}\\to-1$。$\\limsup$ 是子數列極限裡最大的那個。",
    "why": "整個數列沒有極限，但奇偶拆開各自收斂；$\\limsup$ 只要比較兩條子列的極限。",
    "steps": [
      [
        "偶數項 $n=2m$：$\\frac{2m}{2m+1}\\to 1$。",
        "LIM(2n/(2n+1), inf, n) == 1"
      ],
      [
        "奇數項 $n=2m+1$：$-\\frac{2m+1}{2m+2}\\to-1$。",
        "LIM(-(2n+1)/(2n+2), inf, n) == -1"
      ],
      [
        "子數列極限只有 $1$ 和 $-1$，$\\limsup$ 取大的：$1$。",
        "LIM(2n/(2n+1), inf, n) == ANS"
      ]
    ],
    "trap": "因為 $\\lim$ 不存在就說 $\\limsup$ 也不存在。有界數列的 $\\limsup$ 一定存在。",
    "check": [
      "每一項都 $<1$，但偶數項可以任意接近 $1$（$n=1000$ 時約 $0.999$）。",
      "(-1)^n*n/(n+1) < ANS ;; SUB((-1)^n*n/(n+1), 1000, n) > 0.998"
    ]
  },
  "an-ls-002": {
    "spot": "$(-1)^n$ 在 $\\pm 1$ 之間跳、$\\frac{1}{n}\\to 0$ 只是小擾動：奇數項 $\\to-1$、偶數項 $\\to 1$。$\\liminf$ 取子數列極限裡最小的。",
    "why": "拆奇偶最直接；擾動項 $\\frac{1}{n}$ 不改變子列極限，只決定是從上面還是下面逼近。",
    "steps": [
      [
        "奇數項 $n=2m-1$：$-1+\\frac{1}{2m-1}\\to-1$。",
        "LIM(-1+1/(2n-1), inf, n) == -1"
      ],
      [
        "偶數項 $n=2m$：$1+\\frac{1}{2m}\\to 1$。",
        "LIM(1+1/(2n), inf, n) == 1"
      ],
      [
        "$\\liminf=\\min\\{-1,1\\}=-1$。",
        "LIM(-1+1/(2n-1), inf, n) == ANS"
      ]
    ],
    "trap": "因為 $-1$ 不是任何一項的值（每一項都比 $-1$ 大）就以為 $\\liminf$ 不是 $-1$。$\\liminf$ 是極限意義下的，不必被取到。",
    "check": [
      "每一項都 $>-1$，但奇數項可以任意貼近 $-1$。",
      "(-1)^n+1/n > ANS ;; SUB((-1)^n+1/n, 999, n) < -0.998"
    ]
  },
  "an-uc-002": {
    "spot": "$\\sqrt{x}$ 在 $0$ 附近導數爆掉，但函數值的變化被開根號壓住：$|\\sqrt{x}-\\sqrt{y}|\\le\\sqrt{|x-y|}$，一個 $\\delta=\\varepsilon^2$ 全區間通用。",
    "why": "直接證不等式就得到統一的 $\\delta$；用「導數有界」判斷會在 $0$ 附近失靈，因為那只是充分條件。",
    "steps": [
      [
        "設 $x,y\\ge 0$：$(\\sqrt{x}-\\sqrt{y})^2\\le|\\sqrt{x}-\\sqrt{y}|(\\sqrt{x}+\\sqrt{y})=|x-y|$。",
        "(sqrt(x)-sqrt(y))^2 <= abs(sqrt(x)-sqrt(y))*(sqrt(x)+sqrt(y)) ;; abs(sqrt(x)-sqrt(y))*(sqrt(x)+sqrt(y)) == abs(x-y)"
      ],
      [
        "開根號：$|\\sqrt{x}-\\sqrt{y}|\\le\\sqrt{|x-y|}$。",
        "abs(sqrt(x)-sqrt(y)) <= sqrt(abs(x-y))"
      ],
      [
        "給 $\\varepsilon>0$，取 $\\delta=\\varepsilon^2$：$|x-y|<\\delta\\Rightarrow|\\sqrt{x}-\\sqrt{y}|<\\varepsilon$，而且 $\\delta$ 跟位置無關（例如 $\\varepsilon=0.1$、$\\delta=0.01$，在任何 $x$ 都成立）。",
        "abs(sqrt(x+0.01)-sqrt(x)) <= 0.1 ;; SUB(sqrt(x), 0.01) == 0.1"
      ],
      [
        "所以 $\\sqrt{x}$ 在 $[0,\\infty)$ 上一致連續。",
        "abs(sqrt(x+0.0001)-sqrt(x)) <= 0.01"
      ]
    ],
    "trap": "看到 $\\sqrt{x}$ 的導數在 $0$ 附近無界就判「不一致連續」。導數有界只是一致連續的充分條件；$\\sqrt{x}$ 在原點最陡的地方，最大變化也只有 $\\sqrt{\\delta}$。",
    "check": [
      "最壞情況就在原點：$x=0$、$y=\\delta$ 時差是 $\\sqrt{\\delta}$，正好達到上界；離原點越遠差越小。",
      "SUB(sqrt(x), 0.01) - SUB(sqrt(x), 0) == sqrt(0.01) ;; sqrt(1.01)-sqrt(1) < 0.1"
    ]
  },
  "an-uf-002": {
    "spot": "$x^n$ 出麻煩只在 $x=1$ 附近；區間 $\\left[0,\\frac{1}{2}\\right]$ 離 $1$ 很遠。一致收斂就看 $\\sup|f_n-0|$ 會不會趨近 $0$。",
    "why": "一致收斂的定義就是 $\\sup$ 誤差 $\\to 0$；$x^n$ 遞增，$\\sup$ 落在右端點，一行算完。",
    "steps": [
      [
        "逐點極限：$0\\le x\\le\\frac{1}{2}$ 時 $x^n\\to 0$，極限函數 $f=0$。",
        "LIM(0.4^n, inf, n) == 0"
      ],
      [
        "$x^n$ 在 $\\left[0,\\frac{1}{2}\\right]$ 上遞增，所以 $\\sup|x^n-0|=\\left(\\frac{1}{2}\\right)^n$。",
        "SUB(x^n, 0.4, x) < SUB(x^n, 0.5, x) ;; SUB(x^n, 1/2, x) == 2^(-n)"
      ],
      [
        "$\\left(\\frac{1}{2}\\right)^n\\to 0$：$\\sup$ 誤差趨近 $0$，所以 $x^n$ 在 $\\left[0,\\frac{1}{2}\\right]$ 上一致收斂到 $0$。",
        "LIM(2^(-n), inf, n) == 0"
      ]
    ],
    "trap": "記得「$x^n$ 在 $[0,1]$ 不一致收斂」就套過來。不一致的原因在 $x\\to 1$（$\\sup$ 一直是 $1$ 附近）；把 $1$ 附近切掉，問題就消失。",
    "check": [
      "對照 $[0,1)$：取 $x=1-\\frac{1}{n}$，$x^n\\to\\frac{1}{e}$，$\\sup$ 不趨近 $0$；在 $\\left[0,\\frac{1}{2}\\right]$ 上這種點不存在。",
      "LIM((1-1/n)^n, inf, n) == 1/e ;; SUB(2^(-n), 20, n) < 0.000001"
    ]
  },
  "gap-der-param-005": {
    "spot": "速率 = 速度向量 $\\left(\\frac{dx}{dt},\\frac{dy}{dt}\\right)$ 的長度。$x=3t$、$y=4t$ 是等速直線，速度 $(3,4)$ —— 3-4-5 直角三角形。",
    "why": "題目已經給了公式，只差把兩個導數算出來代進去。",
    "steps": [
      [
        "$\\frac{dx}{dt}=3$、$\\frac{dy}{dt}=4$。",
        "D(3t, , t) == 3 ;; D(4t, , t) == 4"
      ],
      [
        "平方和：$9+16=25$。",
        "D(3t, , t)^2 + D(4t, , t)^2 == 25"
      ],
      [
        "開根號：速率 $=\\sqrt{25}=5$。",
        "sqrt(D(3t, , t)^2 + D(4t, , t)^2) == ANS"
      ]
    ],
    "trap": "把分量直接相加得 $7$，或忘了開根號答 $25$。",
    "check": [
      "$t=0$ 到 $t=1$ 從 $(0,0)$ 走到 $(3,4)$，距離 $5$，花一單位時間，速率 $5$。",
      "sqrt(SUB(3t, 1, t)^2 + SUB(4t, 1, t)^2) == ANS"
    ]
  },
  "lb-con-004": {
    "spot": "只問 $f_3$ 一個函數的積分：$f_3(x)=3xe^{-3x^2}$ 是連續函數，勒貝格積分就是普通的黎曼積分。指數上是 $x^2$、前面有 $x$ —— 代 $u=3x^2$。",
    "why": "別被 $d\\mu$ 嚇到：連續函數在閉區間上兩種積分一樣，直接用微積分基本定理。",
    "steps": [
      [
        "$f_3(x)=3xe^{-3x^2}$。令 $u=3x^2$，$du=6x\\,dx$，所以 $3x\\,dx=\\frac{du}{2}$。",
        "D(-e^(-3x^2)/2) == 3x*e^(-3x^2)"
      ],
      [
        "$\\int_0^1 3xe^{-3x^2}dx=\\left[-\\frac{1}{2}e^{-3x^2}\\right]_0^1=-\\frac{1}{2}e^{-3}+\\frac{1}{2}$。",
        "SUB(-e^(-3x^2)/2, 1) - SUB(-e^(-3x^2)/2, 0) == (1-e^(-3))/2"
      ],
      [
        "答案 $\\frac{1-e^{-3}}{2}\\approx 0.4751$。",
        "INT(3x*e^(-3x^2), 0, 1) == ANS"
      ]
    ],
    "trap": "代換時漏了 $\\frac{1}{2}$（$du=6x\\,dx$ 不是 $3x\\,dx$），得 $1-e^{-3}$。",
    "check": [
      "一般的 $\\int_0^1 f_n=\\frac{1-e^{-n}}{2}$，$n=3$ 時比極限 $\\frac{1}{2}$ 小一點。",
      "INT(n*x*e^(-n*x^2), 0, 1) == (1-e^(-n))/2 ;; ANS < 1/2"
    ]
  },
  "lb-con-006": {
    "spot": "題目特別說「這一列遞增」，而且 $f_n\\ge 0$：單調收斂定理的條件全齊，可以把極限搬進積分裡。",
    "why": "單調收斂定理只要遞增、非負，不需要一致收斂；這題也能直接算 $\\int_0^1x^{1/n}dx=\\frac{n}{n+1}$ 對照。",
    "steps": [
      [
        "逐點極限：$x\\in(0,1]$ 時 $x^{1/n}\\to 1$；$x=0$ 時是 $0$，但單點測度為 $0$。",
        "LIM(0.3^(1/n), inf, n) == 1"
      ],
      [
        "遞增：$0<x<1$ 時 $x^{1/(n+1)}>x^{1/n}$。",
        "SUB(x^(1/(n+1)), 0.3) > SUB(x^(1/n), 0.3)"
      ],
      [
        "單調收斂定理：$\\lim\\int_0^1 f_n\\,d\\mu=\\int_0^1 1\\,d\\mu=1$。",
        "INT(1, 0, 1) == ANS"
      ],
      [
        "直接算驗證：$\\int_0^1x^{1/n}dx=\\frac{n}{n+1}\\to 1$。",
        "INT(x^(1/n), 0, 1) == n/(n+1) ;; LIM(n/(n+1), inf, n) == ANS"
      ]
    ],
    "trap": "看到極限函數在 $x=0$ 跳了一下（$0$ 對 $1$），就以為不一致收斂所以不能交換極限與積分。單調收斂定理根本不需要一致收斂。",
    "check": [
      "每個 $\\int f_n=\\frac{n}{n+1}<1$，從下面遞增逼近 $1$，跟「遞增序列」一致。",
      "INT(x^(1/n), 0, 1) < ANS ;; SUB(n/(n+1), 99, n) == 0.99"
    ]
  }
};
