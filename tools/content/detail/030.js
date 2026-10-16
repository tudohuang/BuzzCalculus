// 詳解 v2 第 030 批。格式見 tools/build_solution_detail.js 的說明。
module.exports = {
  "cl-lim-041": {
    "spot": "分母 $\\sqrt{n^2+2kn}$ 可以提出 $n$，變成 $\\frac{1}{n}\\cdot\\frac{1}{\\sqrt{1+2\\frac{k}{n}}}$ —— $\\frac{1}{n}$ 乘上 $\\frac{k}{n}$ 的函數，就是 $[0,1]$ 上的黎曼和。",
    "why": "$n$ 項加起來、每項大小都是 $\\frac{1}{n}$ 級，這種和只能靠黎曼和換成積分；硬算部分和沒有封閉式。",
    "steps": [
      [
        "提出 $n$：$\\frac{1}{\\sqrt{n^2+2kn}}=\\frac{1}{n}\\cdot\\frac{1}{\\sqrt{1+2k/n}}$。",
        "SUB(1/sqrt(n^2+2*3*n), 7, n) == 1/7*1/sqrt(1+2*3/7)"
      ],
      [
        "所以和是 $f(x)=\\frac{1}{\\sqrt{1+2x}}$ 的右端點黎曼和，極限 $=\\int_0^1\\frac{dx}{\\sqrt{1+2x}}$。",
        "INT(1/sqrt(1+2x), 0, 1) > 0.7 ;; INT(1/sqrt(1+2x), 0, 1) < 0.75"
      ],
      [
        "反導數：$\\left(\\sqrt{1+2x}\\right)'=\\frac{1}{\\sqrt{1+2x}}$。",
        "D(sqrt(1+2x)) == 1/sqrt(1+2x)"
      ],
      [
        "代上下限：$\\sqrt 3-\\sqrt 1=\\sqrt 3-1\\approx 0.732$。",
        "INT(1/sqrt(1+2x), 0, 1) == ANS"
      ]
    ],
    "trap": "沒把 $n$ 提出來，看到「$n$ 項、每項約 $\\frac{1}{n}$」就猜極限是 $1$；每一項其實都比 $\\frac{1}{n}$ 小，越後面小越多。",
    "check": [
      "$n=2$ 實算：$\\frac{1}{\\sqrt 8}+\\frac{1}{\\sqrt{12}}\\approx 0.642$；$f$ 遞減，右端點和偏小，所以在答案下方。",
      "1/sqrt(8)+1/sqrt(12) < ANS ;; 1/sqrt(8)+1/sqrt(12) > 0.6"
    ]
  },
  "cl-lim-043": {
    "spot": "$\\frac{k}{n^2}=\\frac{1}{n}\\cdot\\frac{k}{n}$，$\\sin\\frac{k\\pi}{n}$ 也只跟 $\\frac{k}{n}$ 有關 —— 整個和是 $x\\sin(\\pi x)$ 在 $[0,1]$ 的黎曼和。",
    "why": "把 $\\frac{k}{n}$ 看成 $x$、$\\frac{1}{n}$ 看成 $dx$，極限直接變成一個分部積分的定積分。",
    "steps": [
      [
        "改寫：$\\sum_{k=1}^n\\frac{1}{n}\\cdot\\frac{k}{n}\\sin\\left(\\pi\\frac{k}{n}\\right)\\to\\int_0^1x\\sin(\\pi x)\\,dx$。",
        "INT(x*sin(pi*x), 0, 1) > 0.3 ;; INT(x*sin(pi*x), 0, 1) < 0.33"
      ],
      [
        "分部積分：$u=x$、$dv=\\sin(\\pi x)\\,dx$，反導數 $-\\frac{x\\cos(\\pi x)}{\\pi}+\\frac{\\sin(\\pi x)}{\\pi^2}$。",
        "D(-x*cos(pi*x)/pi+sin(pi*x)/pi^2) == x*sin(pi*x)"
      ],
      [
        "在 $1$：$-\\frac{\\cos\\pi}{\\pi}=\\frac{1}{\\pi}$；在 $0$：$0$。",
        "SUB(-x*cos(pi*x)/pi+sin(pi*x)/pi^2, 1) == 1/pi ;; SUB(-x*cos(pi*x)/pi+sin(pi*x)/pi^2, 0) == 0"
      ],
      [
        "極限 $=\\frac{1}{\\pi}\\approx 0.318$。",
        "INT(x*sin(pi*x), 0, 1) == ANS"
      ]
    ],
    "trap": "把 $\\frac{k}{n^2}$ 當成 $\\frac{1}{n}$ 而漏掉一個 $x$，算成 $\\int_0^1\\sin(\\pi x)\\,dx=\\frac{2}{\\pi}$。",
    "check": [
      "$n=4$ 實算：$\\frac{1}{16}\\left(\\sin\\frac{\\pi}{4}+2\\sin\\frac{\\pi}{2}+3\\sin\\frac{3\\pi}{4}\\right)\\approx 0.302$，已經接近 $0.318$。",
      "(sin(pi/4)+2*sin(pi/2)+3*sin(3*pi/4))/16 > 0.29 ;; (sin(pi/4)+2*sin(pi/2)+3*sin(3*pi/4))/16 < ANS"
    ]
  },
  "db-logd-003": {
    "spot": "底數和指數都有 $x$：$(\\sqrt x)^x$ 既不是冪函數也不是指數函數，要取對數把指數拿下來。",
    "why": "對數微分把「變數的變數次方」變成乘積 $\\frac{x}{2}\\ln x$；直接套 $x^n$ 或 $a^x$ 的公式都會錯。",
    "steps": [
      [
        "先化簡：$(\\sqrt x)^x=x^{x/2}$，取對數 $\\ln y=\\frac{x}{2}\\ln x$。",
        "sqrt(x)^x == x^(x/2) ;; ln(sqrt(x)^x) == x/2*ln(x)"
      ],
      [
        "兩邊微分：$\\frac{y'}{y}=\\frac{1}{2}\\ln x+\\frac{x}{2}\\cdot\\frac{1}{x}=\\frac{\\ln x+1}{2}$。",
        "D(x/2*ln(x)) == (ln(x)+1)/2"
      ],
      [
        "乘回 $y$：$y'=x^{x/2}\\cdot\\frac{\\ln x+1}{2}$。",
        "D(sqrt(x)^x) == ANS"
      ]
    ],
    "trap": "當冪函數微：$x\\cdot(\\sqrt x)^{x-1}\\cdot\\frac{1}{2\\sqrt x}$ —— 只算了底數的變化，漏掉指數 $x$ 也在變的 $\\ln$ 那一項。",
    "check": [
      "在 $x=1$：$y'=\\frac{0+1}{2}=\\frac{1}{2}$，跟數值導數一致。",
      "D(sqrt(x)^x, 1) == 1/2"
    ]
  },
  "db-newt-003": {
    "spot": "牛頓法要的是「某函數 $=0$」：先把 $\\cos x=x$ 移項成 $f(x)=\\cos x-x$，再套 $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$。",
    "why": "公式只有一步，關鍵是 $f$ 和 $f'$ 的符號別弄錯。",
    "steps": [
      [
        "$f(x)=\\cos x-x$，$f(1)=\\cos 1-1$。",
        "SUB(cos(x)-x, 1) == cos(1)-1"
      ],
      [
        "$f'(x)=-\\sin x-1$，$f'(1)=-(\\sin 1+1)$。",
        "D(cos(x)-x, 1) == -sin(1)-1"
      ],
      [
        "$x_1=1-\\frac{\\cos 1-1}{-(\\sin 1+1)}=1+\\frac{\\cos 1-1}{\\sin 1+1}\\approx 0.7504$。",
        "1-SUB(cos(x)-x, 1)/D(cos(x)-x, 1) == ANS"
      ]
    ],
    "trap": "$f'$ 的負號漏掉，寫成 $1-\\frac{\\cos 1-1}{\\sin 1+1}\\approx 1.25$，反而離根更遠。",
    "check": [
      "真正的根約 $0.739$；代 $x_1$ 進去 $\\cos x_1-x_1\\approx-0.019$，已經比 $f(1)\\approx-0.46$ 小很多。",
      "SUB(cos(x)-x, ANS) > -0.02 ;; SUB(cos(x)-x, ANS) < 0"
    ]
  },
  "db-tan-006": {
    "spot": "要的不是 $\\sin\\frac{\\pi}{2}$，是「在 $\\frac{\\pi}{3}$ 的切線」在 $\\frac{\\pi}{2}$ 的高度：先寫切線 $y=f(a)+f'(a)(x-a)$ 再代值。",
    "why": "切線方程只要點和斜率兩個數，代 $x=\\frac{\\pi}{2}$ 就是線性近似的估計值。",
    "steps": [
      [
        "切點：$\\sin\\frac{\\pi}{3}=\\frac{\\sqrt 3}{2}$。",
        "SUB(sin(x), pi/3) == sqrt(3)/2"
      ],
      [
        "斜率：$\\cos\\frac{\\pi}{3}=\\frac{1}{2}$。",
        "D(sin(x), pi/3) == 1/2"
      ],
      [
        "切線 $y=\\frac{\\sqrt 3}{2}+\\frac{1}{2}\\left(x-\\frac{\\pi}{3}\\right)$；代 $x=\\frac{\\pi}{2}$，$x-\\frac{\\pi}{3}=\\frac{\\pi}{6}$，得 $\\frac{\\sqrt 3}{2}+\\frac{\\pi}{12}$。",
        "SUB(sin(x), pi/3)+D(sin(x), pi/3)*(pi/2-pi/3) == ANS"
      ]
    ],
    "trap": "直接答 $\\sin\\frac{\\pi}{2}=1$ —— 那是曲線的值，不是切線的值。",
    "check": [
      "$\\sin x$ 在 $(0,\\pi)$ 上凹向下，切線在曲線上方：答案 $\\approx 1.128$ 應該大於 $1$。",
      "ANS > 1 ;; ANS < 1.2"
    ]
  },
  "dd-grw-002": {
    "spot": "「指數成長」就是 $P=P_0e^{kt}$，而且 $P'=kP$：兩個時間點的值定出 $k$，成長率等於 $k$ 乘當時的族群數。",
    "why": "用 $P'=kP$ 不必真的對 $P(t)$ 微分；只要算出 $k$ 和 $P(4)$ 相乘。",
    "steps": [
      [
        "$500e^{2k}=800$，$e^{2k}=1.6$，$k=\\frac{\\ln 1.6}{2}$。",
        "SUB(500*exp(ln(1.6)/2*t), 2, t) == 800"
      ],
      [
        "$P(4)=500\\left(e^{2k}\\right)^2=500\\cdot 1.6^2=1280$。",
        "SUB(500*exp(ln(1.6)/2*t), 4, t) == 1280"
      ],
      [
        "$P'(4)=kP(4)=\\frac{\\ln 1.6}{2}\\cdot 1280=640\\ln 1.6\\approx 300.8$。",
        "D(500*exp(ln(1.6)/2*t), 4) == ANS"
      ]
    ],
    "trap": "用平均變化率 $\\frac{800-500}{2}=150$ 當成長率，或把 $P(4)$ 當成 $1100$（線性外插）；指數成長在 $t=4$ 已經是 $1280$。",
    "check": [
      "比對 $P(2)\\to P(4)$ 的平均成長率 $\\frac{1280-800}{2}=240$，$t=4$ 是區間右端、成長最快，瞬時率要比它大。",
      "ANS > 240 ;; ANS < 320"
    ]
  },
  "dd-log-003": {
    "spot": "$(\\cos x)^{\\sin x}$ 底數和指數都隨 $x$ 變，標準的對數微分題：$\\ln y=\\sin x\\ln(\\cos x)$。",
    "why": "取對數後只剩乘積法則加連鎖律；直接套冪或指數公式都只顧到一半。",
    "steps": [
      [
        "取對數：$\\ln y=\\sin x\\cdot\\ln(\\cos x)$（$\\cos x>0$ 時）。",
        "ln(cos(0.5)^sin(0.5)) == sin(0.5)*ln(cos(0.5))"
      ],
      [
        "乘積法則：$\\frac{y'}{y}=\\cos x\\ln(\\cos x)+\\sin x\\cdot\\frac{-\\sin x}{\\cos x}$。",
        "D(sin(x)*ln(cos(x)), 0.5) == cos(0.5)*ln(cos(0.5))-sin(0.5)^2/cos(0.5) ;; D(sin(x)*ln(cos(x)), 1) == cos(1)*ln(cos(1))-sin(1)^2/cos(1)"
      ],
      [
        "乘回 $y$：$y'=(\\cos x)^{\\sin x}\\left(\\cos x\\ln(\\cos x)-\\frac{\\sin^2x}{\\cos x}\\right)$。",
        "D(cos(x)^sin(x), 0.5) == SUB(ANS, 0.5) ;; D(cos(x)^sin(x), 1.2) == SUB(ANS, 1.2)"
      ]
    ],
    "trap": "$\\ln(\\cos x)$ 微分時漏了內層的 $-\\sin x$，寫成 $\\frac{\\sin x}{\\cos x}$，符號整個反過來。",
    "check": [
      "在 $x=0$：$y=1$，括號內 $1\\cdot\\ln 1-0=0$，所以 $y'(0)=0$。",
      "D(cos(x)^sin(x), 0) == 0"
    ]
  },
  "dd-log-006": {
    "spot": "$x^{\\sqrt x}$：指數裡有 $x$、底數也有 $x$，取對數成 $\\sqrt x\\ln x$ 再微。",
    "why": "對數微分把次方變乘積；用 $x^n$ 的冪法則會漏掉指數在變的那一項。",
    "steps": [
      [
        "$\\ln y=\\sqrt x\\,\\ln x$。",
        "ln(x^sqrt(x)) == sqrt(x)*ln(x)"
      ],
      [
        "乘積法則：$\\frac{y'}{y}=\\frac{\\ln x}{2\\sqrt x}+\\frac{\\sqrt x}{x}=\\frac{\\ln x+2}{2\\sqrt x}$。",
        "D(sqrt(x)*ln(x)) == (ln(x)+2)/(2*sqrt(x))"
      ],
      [
        "乘回 $y$：$y'=x^{\\sqrt x}\\cdot\\frac{\\ln x+2}{2\\sqrt x}$。",
        "D(x^sqrt(x)) == ANS"
      ]
    ],
    "trap": "把 $\\frac{\\sqrt x}{x}$ 化成 $\\frac{1}{2\\sqrt x}$ 之類的錯誤化簡；$\\frac{\\sqrt x}{x}=\\frac{1}{\\sqrt x}=\\frac{2}{2\\sqrt x}$，所以分子是 $\\ln x+2$ 不是 $\\ln x+1$。",
    "check": [
      "在 $x=1$：$y'=1\\cdot\\frac{0+2}{2}=1$。",
      "D(x^sqrt(x), 1) == 1"
    ]
  },
  "depth-der-009": {
    "spot": "參數式的二階導數：$\\frac{d^2y}{dx^2}$ 是「$\\frac{dy}{dx}$ 對 $x$ 的導數」，要先對 $t$ 微、再除以 $\\frac{dx}{dt}$。",
    "why": "$\\frac{d^2y}{dx^2}=\\frac{\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)}{\\frac{dx}{dt}}$；直接拿 $\\frac{y''(t)}{x''(t)}$ 是錯的。",
    "steps": [
      [
        "$\\frac{dy}{dx}=\\frac{3t^2}{2t}=\\frac{3t}{2}$。",
        "D(t^3, 1)/D(t^2, 1) == 3/2"
      ],
      [
        "對 $t$ 微：$\\frac{d}{dt}\\left(\\frac{3t}{2}\\right)=\\frac{3}{2}$。",
        "D(3t/2) == 3/2"
      ],
      [
        "再除以 $\\frac{dx}{dt}=2t$：$\\frac{d^2y}{dx^2}=\\frac{3}{4t}$；$t=1$ 得 $\\frac{3}{4}$。",
        "(3/2)/D(t^2, 1) == ANS"
      ]
    ],
    "trap": "用 $\\frac{y''(t)}{x''(t)}=\\frac{6t}{2}=3$，在 $t=1$ 答 $3$。",
    "check": [
      "消去參數：$y=x^{3/2}$（$t>0$），$y''=\\frac{3}{4}x^{-1/2}$，在 $x=1$ 也是 $\\frac{3}{4}$。",
      "D2(x^(3/2), 1) == ANS"
    ]
  },
  "der-068": {
    "spot": "$F=ue^v$ 是乘積，$v=\\sin x$ 又包在指數裡：乘積法則加一層連鎖律。",
    "why": "把 $u,v$ 代回成 $x^2e^{\\sin x}$ 直接微，最不會漏項。",
    "steps": [
      [
        "代回：$F=x^2e^{\\sin x}$。",
        "x^2*exp(sin(x)) == x^2*exp(sin(x))"
      ],
      [
        "乘積法則：$(x^2)'e^{\\sin x}=2xe^{\\sin x}$。",
        "D(x^2) == 2x"
      ],
      [
        "連鎖律：$\\left(e^{\\sin x}\\right)'=e^{\\sin x}\\cos x$，乘上 $x^2$。",
        "D(exp(sin(x))) == exp(sin(x))*cos(x)"
      ],
      [
        "合起來：$F'=e^{\\sin x}\\left(2x+x^2\\cos x\\right)$。",
        "D(x^2*exp(sin(x))) == ANS"
      ]
    ],
    "trap": "$e^{\\sin x}$ 微成 $e^{\\sin x}$ 本身，漏掉內層的 $\\cos x$，得 $e^{\\sin x}(2x+x^2)$。",
    "check": [
      "在 $x=0$：$F'(0)=e^0\\cdot 0=0$。",
      "D(x^2*exp(sin(x)), 0) == 0"
    ]
  },
  "exam-der-011": {
    "spot": "分子是 $(x^2+1)^3$、分母 $x-1$：商法則，分子那一塊要用連鎖律，最後把公因式 $(x^2+1)^2$ 提出來。",
    "why": "商法則一次到位；先提公因式，答案才會是整齊的形式。",
    "steps": [
      [
        "分子的導數：$\\left((x^2+1)^3\\right)'=3(x^2+1)^2\\cdot 2x=6x(x^2+1)^2$。",
        "D((x^2+1)^3) == 6x*(x^2+1)^2"
      ],
      [
        "商法則：$\\frac{6x(x^2+1)^2(x-1)-(x^2+1)^3\\cdot 1}{(x-1)^2}$。",
        "D((x^2+1)^3/(x-1)) == (6x*(x^2+1)^2*(x-1)-(x^2+1)^3)/(x-1)^2"
      ],
      [
        "提出 $(x^2+1)^2$：$\\frac{(x^2+1)^2\\left(6x(x-1)-(x^2+1)\\right)}{(x-1)^2}$。",
        "D((x^2+1)^3/(x-1)) == ANS"
      ]
    ],
    "trap": "分子導數忘了內層 $2x$，寫成 $3(x^2+1)^2$；或商法則分子順序顛倒，整個差一個負號。",
    "check": [
      "在 $x=0$：$\\frac{1\\cdot(0-1)}{1}=-1$。",
      "D((x^2+1)^3/(x-1), 0) == -1"
    ]
  },
  "exam-der-013": {
    "spot": "$x,y$ 都用 $t$ 表示：$\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$，各自對 $t$ 微再相除。",
    "why": "參數式不用消去 $t$，兩個導數一除就是斜率。",
    "steps": [
      [
        "$\\frac{dy}{dt}=3t^2-1$，$t=2$ 時 $=11$。",
        "D(t^3-t, 2) == 11"
      ],
      [
        "$\\frac{dx}{dt}=2t$，$t=2$ 時 $=4$。",
        "D(t^2+1, 2) == 4"
      ],
      [
        "$\\frac{dy}{dx}=\\frac{11}{4}$。",
        "D(t^3-t, 2)/D(t^2+1, 2) == ANS"
      ]
    ],
    "trap": "分子分母放反，答 $\\frac{4}{11}$。",
    "check": [
      "用割線估：$t=1.99$ 到 $2.01$ 時 $\\frac{\\Delta y}{\\Delta x}$ 也非常接近 $2.75$。",
      "(SUB(t^3-t, 2.01, t)-SUB(t^3-t, 1.99, t))/(SUB(t^2+1, 2.01, t)-SUB(t^2+1, 1.99, t)) > 2.74 ;; (SUB(t^3-t, 2.01, t)-SUB(t^3-t, 1.99, t))/(SUB(t^2+1, 2.01, t)-SUB(t^2+1, 1.99, t)) < 2.76"
    ]
  },
  "exam-lim-001": {
    "spot": "分子刻意扣掉 $3x$ 和加上 $\\frac{9}{2}x^3$ —— 正好是 $\\sin(3x)$ 泰勒展開的前兩項，剩下的是 $x^5$ 項，分母也是 $x^5$。",
    "why": "泰勒展開一行就看出答案；羅必達要微五次。",
    "steps": [
      [
        "$\\sin u=u-\\frac{u^3}{6}+\\frac{u^5}{120}-\\cdots$，代 $u=3x$。",
        "LIM((sin(x)-x+x^3/6)/x^5, 0) == 1/120"
      ],
      [
        "前兩項：$3x-\\frac{27x^3}{6}=3x-\\frac{9}{2}x^3$，跟分子扣掉的完全抵消。",
        "27/6 == 9/2"
      ],
      [
        "剩下 $\\frac{3^5x^5}{120}=\\frac{243}{120}x^5=\\frac{81}{40}x^5$，除以 $x^5$ 得 $\\frac{81}{40}$。",
        "LIM((sin(3x)-3x+9/2*x^3)/x^5, 0) == ANS"
      ]
    ],
    "trap": "$x^5$ 係數忘了乘 $3^5$，答 $\\frac{1}{120}$。",
    "check": [
      "$x=0.1$ 實算比值約 $2.024$，接近 $\\frac{81}{40}=2.025$。",
      "SUB((sin(3x)-3x+9/2*x^3)/x^5, 0.1) > 2.0 ;; SUB((sin(3x)-3x+9/2*x^3)/x^5, 0.1) < ANS"
    ]
  },
  "exam-lim-009": {
    "spot": "$x-\\sin x$ 和 $1-\\cos x$ 都是「泰勒第一項被抵消」的經典組合：分子 $\\sim\\frac{x^3}{6}$，分母 $x\\cdot\\frac{x^2}{2}$。",
    "why": "各自換成主項就結束；羅必達要微三次且分母乘積很亂。",
    "steps": [
      [
        "分子：$x-\\sin x\\sim\\frac{x^3}{6}$。",
        "LIM((x-sin(x))/x^3, 0) == 1/6"
      ],
      [
        "分母：$1-\\cos x\\sim\\frac{x^2}{2}$，所以 $x(1-\\cos x)\\sim\\frac{x^3}{2}$。",
        "LIM(x*(1-cos(x))/x^3, 0) == 1/2"
      ],
      [
        "相除：$\\frac{1/6}{1/2}=\\frac{1}{3}$。",
        "LIM((x-sin(x))/(x*(1-cos(x))), 0) == ANS"
      ]
    ],
    "trap": "把 $\\sin x\\approx x$ 直接代進分子，得 $\\frac{0}{\\cdots}=0$；一階近似在這裡全部抵消，要多展一項。",
    "check": [
      "$x=0.1$ 時比值約 $0.3333$。",
      "SUB((x-sin(x))/(x*(1-cos(x))), 0.1) > 0.333 ;; SUB((x-sin(x))/(x*(1-cos(x))), 0.1) < 0.334"
    ]
  },
  "exam-lim-017": {
    "spot": "$\\cos x$ 和 $e^{-x^2/2}$ 的展開前兩項都是 $1-\\frac{x^2}{2}$，分母 $x^4$ 在問兩者 $x^4$ 係數的差。",
    "why": "泰勒展開到四次直接比係數；羅必達要四次。",
    "steps": [
      [
        "$\\cos x=1-\\frac{x^2}{2}+\\frac{x^4}{24}-\\cdots$。",
        "LIM((cos(x)-1+x^2/2)/x^4, 0) == 1/24"
      ],
      [
        "$e^{-x^2/2}=1-\\frac{x^2}{2}+\\frac{1}{2}\\left(\\frac{x^2}{2}\\right)^2-\\cdots=1-\\frac{x^2}{2}+\\frac{x^4}{8}-\\cdots$。",
        "LIM((exp(-x^2/2)-1+x^2/2)/x^4, 0) == 1/8"
      ],
      [
        "相減：$\\frac{1}{24}-\\frac{1}{8}=-\\frac{1}{12}$。",
        "LIM((cos(x)-exp(-x^2/2))/x^4, 0) == ANS"
      ]
    ],
    "trap": "$e^{u}$ 展開的 $\\frac{u^2}{2}$ 忘了除 $2$，把 $x^4$ 係數記成 $\\frac{1}{4}$，得 $-\\frac{5}{24}$。",
    "check": [
      "$x=0.2$ 實算比值約 $-0.0826$，從上方靠近 $-\\frac{1}{12}\\approx-0.0833$。",
      "SUB((cos(x)-exp(-x^2/2))/x^4, 0.2) > ANS ;; SUB((cos(x)-exp(-x^2/2))/x^4, 0.2) < -0.082"
    ]
  },
  "exam-ser-013": {
    "spot": "$n(n+1)$ 乘 $\\left(\\frac{1}{2}\\right)^n$：$n(n+1)x^{n-1}$ 正好是 $x^{n+1}$ 的二階導數 —— 把等比級數微兩次。",
    "why": "冪級數 $\\sum x^{n+1}=\\frac{x^2}{1-x}$ 可以逐項微分；比起拆成 $\\sum n^2$ 和 $\\sum n$ 分開算更直接。",
    "steps": [
      [
        "$\\sum_{n\\ge 1}x^{n+1}=\\frac{x^2}{1-x}$（$|x|<1$）。",
        "SUM(0.5^(n+1), 1) == SUB(x^2/(1-x), 0.5)"
      ],
      [
        "微兩次：$\\sum n(n+1)x^{n-1}=\\left(\\frac{x^2}{1-x}\\right)''=\\frac{2}{(1-x)^3}$。",
        "D2(x^2/(1-x)) == 2/(1-x)^3"
      ],
      [
        "乘 $x$：$\\sum n(n+1)x^n=\\frac{2x}{(1-x)^3}$；代 $x=\\frac{1}{2}$：$\\frac{1}{1/8}=8$。",
        "SUB(2x/(1-x)^3, 1/2) == 8"
      ],
      [
        "所以和為 $8$。",
        "SUM(n*(n+1)/2^n, 1) == ANS"
      ]
    ],
    "trap": "忘了乘回 $x$，直接拿 $\\frac{2}{(1-x)^3}$ 代 $\\frac{1}{2}$ 得 $16$。",
    "check": [
      "前幾項：$1+\\frac{6}{4}+\\frac{12}{8}+\\frac{20}{16}=5.25$，還在往上加，最後停在 $8$。",
      "1+6/4+12/8+20/16 < ANS ;; SUM(n*(n+1)/2^n, 5) == ANS-5.25"
    ]
  },
  "exam-ser-014": {
    "spot": "係數裡有 $4^n$ 和 $\\sqrt{n+1}$：比值法下 $\\sqrt{\\frac{n+1}{n+2}}\\to 1$，只剩 $4|x|$。",
    "why": "比值法把根號那一段變成趨近 $1$ 的比，收斂半徑由 $4^n$ 決定。",
    "steps": [
      [
        "比值：$\\left|\\frac{a_{n+1}}{a_n}\\right|=4|x|\\sqrt{\\frac{n+1}{n+2}}$。",
        "SUB(4^(n+1)/sqrt(n+2)/(4^n/sqrt(n+1)), 9, n) == 4*sqrt(10/11)"
      ],
      [
        "$n\\to\\infty$：$\\sqrt{\\frac{n+1}{n+2}}\\to 1$，比值極限 $=4|x|$。",
        "LIM(4*sqrt((x+1)/(x+2)), inf) == 4"
      ],
      [
        "$4|x|<1$ 收斂，所以 $R=\\frac{1}{4}$。",
        "1/LIM(4*sqrt((x+1)/(x+2)), inf) == ANS"
      ]
    ],
    "trap": "答成 $4$（把比值極限當成半徑）；$R$ 是它的倒數。",
    "check": [
      "根值法也一樣：$\\left(\\frac{4^n}{\\sqrt{n+1}}\\right)^{1/n}\\to 4$。",
      "LIM((4^x/sqrt(x+1))^(1/x), inf) == 4"
    ]
  },
  "gap-der-polar-001": {
    "spot": "極座標曲線的切線斜率：寫成 $x=r\\cos\\theta$、$y=r\\sin\\theta$，當成以 $\\theta$ 為參數的參數式。",
    "why": "$\\frac{dy}{dx}=\\frac{dy/d\\theta}{dx/d\\theta}$；直接拿 $\\frac{dr}{d\\theta}$ 當斜率是錯的。",
    "steps": [
      [
        "$y=(1+\\cos\\theta)\\sin\\theta$，$\\frac{dy}{d\\theta}=-\\sin^2\\theta+(1+\\cos\\theta)\\cos\\theta$；在 $\\frac{\\pi}{2}$ 為 $-1$。",
        "D((1+cos(x))*sin(x), pi/2) == -1"
      ],
      [
        "$x=(1+\\cos\\theta)\\cos\\theta$，$\\frac{dx}{d\\theta}=-\\sin\\theta\\cos\\theta-(1+\\cos\\theta)\\sin\\theta$；在 $\\frac{\\pi}{2}$ 為 $-1$。",
        "D((1+cos(x))*cos(x), pi/2) == -1"
      ],
      [
        "相除：$\\frac{dy}{dx}=\\frac{-1}{-1}=1$。",
        "D((1+cos(x))*sin(x), pi/2)/D((1+cos(x))*cos(x), pi/2) == ANS"
      ]
    ],
    "trap": "拿 $\\frac{dr}{d\\theta}=-\\sin\\frac{\\pi}{2}=-1$ 當斜率；那是 $r$ 對角度的變化率，不是 $\\frac{dy}{dx}$。",
    "check": [
      "幾何：$\\theta=\\frac{\\pi}{2}$ 的點是 $(0,1)$，往 $\\theta$ 增加方向 $x,y$ 同時減少，斜率為正，合理。",
      "SUB((1+cos(x))*cos(x), pi/2) == 0 ;; SUB((1+cos(x))*sin(x), pi/2) == 1"
    ]
  },
  "hc-der-006": {
    "spot": "在 $0$ 的高階導數：不要微八次，看泰勒係數。$e^{x^2}=\\sum\\frac{x^{2k}}{k!}$，$x^8$ 項來自 $k=4$。",
    "why": "$f^{(8)}(0)=8!\\times(x^8\\text{ 的係數})$；直接微八次會出現一堆乘積法則的項。",
    "steps": [
      [
        "$e^{u}=\\sum\\frac{u^k}{k!}$，代 $u=x^2$：$x^8$ 的係數是 $\\frac{1}{4!}=\\frac{1}{24}$。",
        "LIM((exp(x^2)-1-x^2-x^4/2-x^6/6)/x^8, 0) == 1/24"
      ],
      [
        "泰勒係數 $=\\frac{f^{(8)}(0)}{8!}$，所以 $f^{(8)}(0)=\\frac{8!}{4!}=8\\cdot7\\cdot6\\cdot5$。",
        "8*7*6*5 == 40320/24"
      ],
      [
        "$f^{(8)}(0)=1680$。",
        "8*7*6*5 == ANS"
      ]
    ],
    "trap": "把係數 $\\frac{1}{24}$ 當答案，忘了乘 $8!$；或用 $\\frac{1}{8!}$ 當係數（把 $x^2$ 當 $x$）得 $1$。",
    "check": [
      "同樣的邏輯驗低階：$x^2$ 係數 $1$，所以 $f''(0)=2!\\cdot 1=2$。",
      "D2(exp(x^2), 0) == 2"
    ]
  },
  "hc-ibp-008": {
    "spot": "$x^4\\ln(1+x)$：多項式乘對數，對數微掉才會變簡單，所以 $u=\\ln(1+x)$、$dv=x^4dx$。",
    "why": "分部積分後剩 $\\frac{x^5}{1+x}$，長除法就能積；反過來選會越積越難。",
    "steps": [
      [
        "分部：$\\left[\\frac{x^5}{5}\\ln(1+x)\\right]_0^1-\\frac{1}{5}\\int_0^1\\frac{x^5}{1+x}\\,dx$，第一項 $=\\frac{\\ln 2}{5}$。",
        "INT(x^4*ln(1+x), 0, 1) == ln(2)/5-1/5*INT(x^5/(1+x), 0, 1)"
      ],
      [
        "長除法：$\\frac{x^5}{1+x}=x^4-x^3+x^2-x+1-\\frac{1}{1+x}$。",
        "x^5/(1+x) == x^4-x^3+x^2-x+1-1/(1+x)"
      ],
      [
        "積分：$\\frac15-\\frac14+\\frac13-\\frac12+1-\\ln 2=\\frac{47}{60}-\\ln 2$。",
        "INT(x^5/(1+x), 0, 1) == 47/60-ln(2)"
      ],
      [
        "合起來：$\\frac{\\ln 2}{5}-\\frac{1}{5}\\left(\\frac{47}{60}-\\ln 2\\right)=\\frac{2\\ln 2}{5}-\\frac{47}{300}$。",
        "INT(x^4*ln(1+x), 0, 1) == ANS"
      ]
    ],
    "trap": "長除法漏掉最後的 $-\\frac{1}{1+x}$，結果少了一個 $\\frac{\\ln 2}{5}$，答 $\\frac{\\ln 2}{5}-\\frac{47}{300}$。",
    "check": [
      "大小：$0\\le x^4\\ln(1+x)\\le x^4\\ln 2$，所以答案介於 $0$ 和 $\\frac{\\ln 2}{5}\\approx 0.139$ 之間。",
      "ANS > 0 ;; ANS < ln(2)/5"
    ]
  },
  "hc-ibp-010": {
    "spot": "$x^3\\arctan x$：微掉 $\\arctan$ 會出現 $\\frac{1}{1+x^2}$。$x^3$ 的反導數選 $\\frac{x^4-1}{4}$（加常數 $-\\frac14$），剛好跟分母 $1+x^2$ 約掉。",
    "why": "反導數多減 $\\frac{1}{4}$，邊界項在 $0$ 和 $1$ 都變 $0$，剩下的被積函數直接約成多項式。",
    "steps": [
      [
        "分部積分：$u=\\arctan x$，$v=\\frac{x^4-1}{4}$；$v'=x^3$。",
        "D((x^4-1)/4) == x^3"
      ],
      [
        "邊界項 $\\left[\\frac{x^4-1}{4}\\arctan x\\right]_0^1=0-0=0$。",
        "SUB((x^4-1)/4*atan(x), 1) == 0 ;; SUB((x^4-1)/4*atan(x), 0) == 0"
      ],
      [
        "剩 $-\\int_0^1\\frac{x^4-1}{4(1+x^2)}\\,dx=-\\frac14\\int_0^1(x^2-1)\\,dx$。",
        "(x^4-1)/(4*(1+x^2)) == (x^2-1)/4"
      ],
      [
        "$-\\frac14\\left(\\frac13-1\\right)=\\frac16$。",
        "INT(x^3*atan(x), 0, 1) == ANS"
      ]
    ],
    "trap": "照一般選 $v=\\frac{x^4}{4}$ 也行，但要記得 $\\frac{x^4}{1+x^2}=x^2-1+\\frac{1}{1+x^2}$ 的最後一項，漏掉它會得 $\\frac{\\pi}{16}+\\frac16$。",
    "check": [
      "一般選法驗算：$\\frac{\\pi}{16}-\\frac14\\left(\\frac13-1+\\frac{\\pi}{4}\\right)=\\frac16$。",
      "pi/16-1/4*(1/3-1+pi/4) == ANS"
    ]
  },
  "hc-spec-007": {
    "spot": "分母是五個連續整數的乘積：$\\frac{1}{n(n+1)\\cdots(n+4)}$ 可以拆成「四個連續數乘積的倒數」的差，望遠鏡相消。",
    "why": "$\\frac{1}{n\\cdots(n+3)}-\\frac{1}{(n+1)\\cdots(n+4)}=\\frac{4}{n\\cdots(n+4)}$；比部分分式拆成五項簡單得多。",
    "steps": [
      [
        "恆等式：$\\frac{1}{n(n+1)(n+2)(n+3)(n+4)}=\\frac14\\left(\\frac{1}{n(n+1)(n+2)(n+3)}-\\frac{1}{(n+1)(n+2)(n+3)(n+4)}\\right)$。",
        "1/(n*(n+1)*(n+2)*(n+3)*(n+4)) == 1/4*(1/(n*(n+1)*(n+2)*(n+3))-1/((n+1)*(n+2)*(n+3)*(n+4)))"
      ],
      [
        "望遠鏡相消，只剩第一項 $\\frac14\\cdot\\frac{1}{1\\cdot2\\cdot3\\cdot4}$。",
        "1/4*1/(1*2*3*4) == 1/96"
      ],
      [
        "和 $=\\frac{1}{96}$。",
        "SUM(1/(n*(n+1)*(n+2)*(n+3)*(n+4)), 1) == ANS"
      ]
    ],
    "trap": "忘了前面的 $\\frac14$（拆出來的係數是 $\\frac{1}{(n+4)-n}$），答 $\\frac{1}{24}$。",
    "check": [
      "第一項就是 $\\frac{1}{120}\\approx 0.0083$，總和 $\\frac{1}{96}\\approx 0.0104$ 只比它多一點，合理。",
      "1/120 < ANS ;; ANS < 1/120+1/720*2"
    ]
  },
  "lec-03-q2b": {
    "spot": "$x^{\\sin x}$：指數 $\\sin x$ 和底數 $x$ 都在變，取對數讓 $\\sin x$ 掉下來。",
    "why": "對數微分把它變成 $\\sin x\\ln x$ 的乘積；冪法則或指數法則各只處理一半。",
    "steps": [
      [
        "$\\ln y=\\sin x\\ln x$。",
        "ln(x^sin(x)) == sin(x)*ln(x)"
      ],
      [
        "微分：$\\frac{y'}{y}=\\cos x\\ln x+\\frac{\\sin x}{x}$。",
        "D(sin(x)*ln(x)) == cos(x)*ln(x)+sin(x)/x"
      ],
      [
        "$y'=x^{\\sin x}\\left(\\cos x\\ln x+\\frac{\\sin x}{x}\\right)$。",
        "D(x^sin(x)) == ANS"
      ]
    ],
    "trap": "當冪函數：$\\sin x\\cdot x^{\\sin x-1}$ —— 那只是括號裡的第二項，漏了 $\\cos x\\ln x$。",
    "check": [
      "在 $x=\\frac{\\pi}{2}$：$\\cos=0$，$y'=\\frac{\\pi}{2}\\cdot\\frac{1}{\\pi/2}=1$。",
      "D(x^sin(x), pi/2) == 1"
    ]
  },
  "lec-03-q2c": {
    "spot": "乘、除、根號疊在一起：取對數後變成 $2\\ln x+\\frac12\\ln(x+1)-3\\ln(x-1)$，每一項各微各的。",
    "why": "對數微分把三層乘除變三個加減；用商法則加乘積法則要寫很長還容易掉項。",
    "steps": [
      [
        "取對數（$x>1$）：$\\ln y=2\\ln x+\\frac12\\ln(x+1)-3\\ln(x-1)$。",
        "ln(x^2*sqrt(x+1)/(x-1)^3) == 2ln(x)+1/2*ln(x+1)-3ln(x-1)"
      ],
      [
        "微分：$\\frac{y'}{y}=\\frac{2}{x}+\\frac{1}{2(x+1)}-\\frac{3}{x-1}$。",
        "D(2ln(x)+1/2*ln(x+1)-3ln(x-1)) == 2/x+1/(2*(x+1))-3/(x-1)"
      ],
      [
        "乘回 $y$：$y'=\\frac{x^2\\sqrt{x+1}}{(x-1)^3}\\left(\\frac{2}{x}+\\frac{1}{2(x+1)}-\\frac{3}{x-1}\\right)$。",
        "D(x^2*sqrt(x+1)/(x-1)^3) == ANS"
      ]
    ],
    "trap": "最後忘了乘回 $y$，只交出 $\\frac{y'}{y}$ 那個括號。",
    "check": [
      "在 $x=3$：$y=\\frac{9\\cdot2}{8}=\\frac94$，括號 $\\frac23+\\frac18-\\frac32=-\\frac{17}{24}$，$y'=-\\frac{51}{32}$。",
      "D(x^2*sqrt(x+1)/(x-1)^3, 3) == -51/32"
    ]
  },
  "lec-07-q2c": {
    "spot": "遞迴式已經給了，$n=5$ 是奇數：一路降到 $I_1=\\int_0^{\\pi/2}\\sin x\\,dx=1$。",
    "why": "用 $I_5=\\frac45I_3$、$I_3=\\frac23I_1$ 兩步就到底；直接積 $\\sin^5x$ 要拆 $(1-\\cos^2x)^2\\sin x$。",
    "steps": [
      [
        "底：$I_1=\\int_0^{\\pi/2}\\sin x\\,dx=1$。",
        "INT(sin(x), 0, pi/2) == 1"
      ],
      [
        "$I_3=\\frac23I_1=\\frac23$。",
        "INT(sin(x)^3, 0, pi/2) == 2/3"
      ],
      [
        "$I_5=\\frac45I_3=\\frac45\\cdot\\frac23=\\frac{8}{15}$。",
        "INT(sin(x)^5, 0, pi/2) == ANS"
      ]
    ],
    "trap": "降到 $I_0=\\frac{\\pi}{2}$ 去（奇數次方降不到 $0$），或把遞迴係數寫成 $\\frac{n}{n-1}$，答 $\\frac{15}{8}$；$\\sin^5x\\le 1$，積分不可能超過 $\\frac{\\pi}{2}$。",
    "check": [
      "$0\\le\\sin^5x\\le\\sin^3x$，所以 $I_5<I_3=\\frac23$。",
      "ANS < 2/3 ;; ANS > 0"
    ]
  },
  "lec-08-q4d": {
    "spot": "要的就是 $I_3$；遞迴 $I_n=nI_{n-1}$ 從 $I_0=1$ 往上推三次。",
    "why": "遞迴已給好，乘三次就是 $3!$；不必再分部積分三次。",
    "steps": [
      [
        "$I_0=\\int_0^\\infty e^{-x}\\,dx=1$。",
        "INT(exp(-x), 0, inf) == 1"
      ],
      [
        "$I_1=1\\cdot I_0=1$，$I_2=2I_1=2$。",
        "INT(x*exp(-x), 0, inf) == 1 ;; INT(x^2*exp(-x), 0, inf) == 2"
      ],
      [
        "$I_3=3I_2=6$。",
        "INT(x^3*exp(-x), 0, inf) == ANS"
      ]
    ],
    "trap": "以為 $I_n=n$ 而答 $3$；遞迴是乘上去的，$I_n=n!$。",
    "check": [
      "規律 $I_n=n!$：$I_4=24$。",
      "INT(x^4*exp(-x), 0, inf) == 24"
    ]
  },
  "lec-16-m1": {
    "spot": "兩個向量的夾角：用內積公式 $\\cos\\theta=\\frac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf u||\\mathbf v|}$。",
    "why": "只要算一個內積和兩個長度，比畫圖找角度可靠。",
    "steps": [
      [
        "內積：$\\mathbf u\\cdot\\mathbf v=1\\cdot1+1\\cdot0+0\\cdot1=1$。",
        "1*1+1*0+0*1 == 1"
      ],
      [
        "長度：$|\\mathbf u|=|\\mathbf v|=\\sqrt2$。",
        "sqrt(1+1+0) == sqrt(2)"
      ],
      [
        "$\\cos\\theta=\\frac{1}{\\sqrt2\\cdot\\sqrt2}=\\frac12$，所以 $\\theta=60^\\circ$。",
        "acos(1/(sqrt(2)*sqrt(2)))*180/pi == ANS"
      ]
    ],
    "trap": "忘了除以長度，以為 $\\cos\\theta=1$ 而答 $0^\\circ$。",
    "check": [
      "幾何：$(1,1,0)$、$(1,0,1)$、它們的差 $(0,1,-1)$ 長度都是 $\\sqrt2$，三邊相等的三角形，夾角 $60^\\circ$。",
      "sqrt(0+1+1) == sqrt(2)"
    ]
  },
  "lec-16-q4a": {
    "spot": "$f_x$ 是對 $x$ 的偏導數：$y$ 當常數。$x^3y$ 是常數倍的 $x^3$，$e^{xy^2}$ 的內層 $xy^2$ 對 $x$ 微給 $y^2$。",
    "why": "偏微分就是普通微分，只是把 $y$ 看成一個固定的數；連鎖律照用。",
    "steps": [
      [
        "$\\frac{\\partial}{\\partial x}(x^3y)=3x^2y$。",
        "D(x^3*y) == 3x^2*y"
      ],
      [
        "$\\frac{\\partial}{\\partial x}e^{xy^2}=e^{xy^2}\\cdot y^2$。",
        "D(exp(x*y^2)) == y^2*exp(x*y^2)"
      ],
      [
        "$f_x=3x^2y+y^2e^{xy^2}$。",
        "D(x^3*y+exp(x*y^2)) == ANS"
      ]
    ],
    "trap": "$e^{xy^2}$ 的內層導數寫成 $2xy$（那是對 $y$ 微的結果），或乾脆漏掉內層導數。",
    "check": [
      "對比 $f_y=x^3+2xye^{xy^2}$，兩個偏導數的內層因子不同，正好提醒哪個變數是常數。",
      "D(x^3*y+exp(x*y^2), , y) == x^3+2x*y*exp(x*y^2)"
    ]
  },
  "lec-19-q2b": {
    "spot": "區域是四分之一圓盤：圓的邊界在極座標下只是 $r\\le 2$、$0\\le\\theta\\le\\frac{\\pi}{2}$，被積函數 $x=r\\cos\\theta$。",
    "why": "極座標下上下限全是常數，二重積分直接拆成兩個一維積分相乘；直角座標會出現 $\\sqrt{4-x^2}$。",
    "steps": [
      [
        "換極座標：$\\iint_D x\\,dA=\\int_0^{\\pi/2}\\int_0^2 r\\cos\\theta\\cdot r\\,dr\\,d\\theta$（別忘了 $dA=r\\,dr\\,d\\theta$）。",
        "INT(INT(r^2*cos(t), 0, 2, r), 0, pi/2, t) == 8/3"
      ],
      [
        "$\\int_0^2r^2\\,dr=\\frac{8}{3}$。",
        "INT(r^2, 0, 2, r) == 8/3"
      ],
      [
        "$\\int_0^{\\pi/2}\\cos\\theta\\,d\\theta=1$，相乘得 $\\frac83$。",
        "INT(cos(t), 0, pi/2, t)*INT(r^2, 0, 2, r) == ANS"
      ]
    ],
    "trap": "漏了 $dA$ 的那個 $r$，算成 $\\int_0^2r\\,dr\\cdot1=2$。",
    "check": [
      "直角座標驗：$\\int_0^2x\\sqrt{4-x^2}\\,dx=\\frac83$。",
      "INT(x*sqrt(4-x^2), 0, 2) == ANS"
    ]
  },
  "lec-20-q1a": {
    "spot": "對弧長的線積分、路徑是直線段：參數化 $(3t,4t)$，$ds=|\\mathbf r'(t)|\\,dt=5\\,dt$。",
    "why": "線段的速度是常數 $5$，線積分立刻變成普通的 $t$ 積分。",
    "steps": [
      [
        "$\\mathbf r(t)=(3t,4t)$，$0\\le t\\le1$，$|\\mathbf r'|=\\sqrt{9+16}=5$。",
        "sqrt(3^2+4^2) == 5"
      ],
      [
        "被積函數：$x+y^2=3t+16t^2$。",
        "SUB(3t+(4t)^2, 1, t) == 19"
      ],
      [
        "$\\int_0^1(3t+16t^2)\\cdot5\\,dt=5\\left(\\frac32+\\frac{16}{3}\\right)=\\frac{205}{6}$。",
        "INT(5*(3t+16t^2), 0, 1, t) == ANS"
      ]
    ],
    "trap": "漏了 $ds=5\\,dt$ 的 $5$，答 $\\frac{41}{6}$。",
    "check": [
      "粗估：沿線段 $x+y^2$ 從 $0$ 長到 $19$，平均約 $6.8$，乘長度 $5$ 約 $34$。",
      "ANS > 34 ;; ANS < 34.5"
    ]
  },
  "lec-20-q1b": {
    "spot": "功 $=\\int_C\\mathbf F\\cdot d\\mathbf r$，路徑是單位圓的四分之一：參數化 $x=\\cos t$、$y=\\sin t$，$0\\le t\\le\\frac{\\pi}{2}$。",
    "why": "$\\mathbf F=(y,-x)$ 不是保守場（旋度非零），不能只看端點，要沿路徑真的積。",
    "steps": [
      [
        "$d\\mathbf r=(-\\sin t,\\cos t)\\,dt$，$\\mathbf F=(\\sin t,-\\cos t)$。",
        "D(cos(t)) == -sin(t) ;; D(sin(t)) == cos(t)"
      ],
      [
        "內積：$\\sin t(-\\sin t)+(-\\cos t)\\cos t=-1$。",
        "sin(t)*(-sin(t))+(-cos(t))*cos(t) == -1"
      ],
      [
        "$\\int_0^{\\pi/2}(-1)\\,dt=-\\frac{\\pi}{2}$。",
        "INT(-1+0*t, 0, pi/2, t) == ANS"
      ]
    ],
    "trap": "以為有位能函數，只看起終點就說功是 $0$；$\\frac{\\partial(-x)}{\\partial x}-\\frac{\\partial y}{\\partial y}=-2\\ne0$，不是保守場。",
    "check": [
      "$\\mathbf F$ 在圓上永遠指向順時針切線方向、大小 $1$，逆時針走弧長 $\\frac{\\pi}{2}$，功就是 $-\\frac{\\pi}{2}$。",
      "ANS < 0 ;; ANS == -pi/2"
    ]
  },
  "lec-20-q3c": {
    "spot": "封閉曲線、逆時針、區域是圓盤：用格林定理換成 $\\iint\\left(Q_x-P_y\\right)dA$，而 $-3x^2-3y^2=-3r^2$ 在極座標下最好積。",
    "why": "直接參數化要積 $\\sin^4t+\\cos^4t$；格林定理加極座標兩步就結束。",
    "steps": [
      [
        "$P=y^3$、$Q=-x^3$：$Q_x-P_y=-3x^2-3y^2$。",
        "D(-x^3) - D(y^3, , y) == -3x^2-3y^2"
      ],
      [
        "極座標：$\\iint_D-3r^2\\,dA=-3\\int_0^{2\\pi}\\int_0^2r^3\\,dr\\,d\\theta$。",
        "INT(r^3, 0, 2, r) == 4"
      ],
      [
        "$-3\\cdot2\\pi\\cdot4=-24\\pi$。",
        "-3*2*pi*INT(r^3, 0, 2, r) == ANS"
      ]
    ],
    "trap": "格林定理寫反成 $P_y-Q_x$，答 $24\\pi$；或忘了 $dA$ 的 $r$，算成 $-3\\cdot2\\pi\\cdot\\frac83=-16\\pi$。",
    "check": [
      "直接參數化 $x=2\\cos t$、$y=2\\sin t$：被積式化成 $-16(\\sin^4t+\\cos^4t)\\,dt$，積一圈也是 $-24\\pi$。",
      "INT(-16*(sin(t)^4+cos(t)^4), 0, 2*pi, t) == ANS"
    ]
  },
  "lim-019": {
    "spot": "$(1+x)^{1/x}\\to e$，題目問的是它「靠近 $e$ 的速度」：寫成 $e^{\\ln(1+x)/x}$，展開指數。",
    "why": "指數 $\\frac{\\ln(1+x)}{x}=1-\\frac{x}{2}+\\cdots$，再用 $e^{1+h}\\approx e(1+h)$；羅必達要微 $(1+x)^{1/x}$，很亂。",
    "steps": [
      [
        "$\\frac{\\ln(1+x)}{x}=1-\\frac{x}{2}+\\frac{x^2}{3}-\\cdots$。",
        "LIM((ln(1+x)/x-1)/x, 0) == -1/2"
      ],
      [
        "$(1+x)^{1/x}=e\\cdot e^{-x/2+\\cdots}=e\\left(1-\\frac{x}{2}+\\cdots\\right)$。",
        "LIM(((1+x)^(1/x)/exp(1)-1)/x, 0) == -1/2"
      ],
      [
        "減 $e$ 除 $x$：極限 $=-\\frac{e}{2}$。",
        "LIM(((1+x)^(1/x)-exp(1))/x, 0) == ANS"
      ]
    ],
    "trap": "以為 $(1+x)^{1/x}$ 就是 $e$，分子為 $0$ 而答 $0$；它只是趨近 $e$，差距是 $x$ 的一次方等級。",
    "check": [
      "$x=0.001$ 時比值約 $-1.358$，接近 $-\\frac{e}{2}\\approx-1.359$。",
      "SUB(((1+x)^(1/x)-exp(1))/x, 0.001) > ANS ;; SUB(((1+x)^(1/x)-exp(1))/x, 0.001) < -1.35"
    ]
  },
  "lm-rs-007": {
    "spot": "$\\frac1n\\sum f\\left(\\frac kn\\right)$ 的標準黎曼和，$f(x)=\\ln(1+x)$ 在 $[0,1]$。",
    "why": "極限直接是 $\\int_0^1\\ln(1+x)\\,dx$，再用分部積分。",
    "steps": [
      [
        "極限 $=\\int_0^1\\ln(1+x)\\,dx$。",
        "INT(ln(1+x), 0, 1) > 0.38 ;; INT(ln(1+x), 0, 1) < 0.39"
      ],
      [
        "反導數：$(1+x)\\ln(1+x)-x$。",
        "D((1+x)*ln(1+x)-x) == ln(1+x)"
      ],
      [
        "代上下限：$2\\ln2-1-0=2\\ln2-1\\approx0.386$。",
        "INT(ln(1+x), 0, 1) == ANS"
      ]
    ],
    "trap": "反導數寫成 $x\\ln(1+x)-x$（把 $\\ln x$ 的公式直接搬過來），在 $1$ 得 $\\ln2-1<0$，連正負號都不對。",
    "check": [
      "$n=2$ 的右端點和 $\\frac{\\ln1.5+\\ln2}{2}\\approx0.549$；$f$ 遞增，右端點和偏大。",
      "(ln(1.5)+ln(2))/2 > ANS"
    ]
  },
  "refine-derivatives-022": {
    "spot": "反函數的二階導數：先找 $g(1)$，也就是解 $x+e^x=1$，一眼看出 $x=0$；然後用 $g''=-\\frac{f''(g)}{f'(g)^3}$。",
    "why": "$g'=\\frac{1}{f'(g)}$ 再微一次就得公式；反函數 $g$ 沒有封閉式，只能靠 $f$ 在 $0$ 的導數。",
    "steps": [
      [
        "$f(0)=0+1=1$，所以 $g(1)=0$。",
        "SUB(x+exp(x), 0) == 1"
      ],
      [
        "$f'(x)=1+e^x$，$f'(0)=2$；$f''(x)=e^x$，$f''(0)=1$。",
        "D(x+exp(x), 0) == 2 ;; D2(x+exp(x), 0) == 1"
      ],
      [
        "$g'=\\frac{1}{f'(g)}$ 對 $x$ 微：$g''=-\\frac{f''(g)\\,g'}{f'(g)^2}=-\\frac{f''(g)}{f'(g)^3}$。",
        "-D2(x+exp(x), 0)/D(x+exp(x), 0)^3 == -1/8"
      ],
      [
        "$g''(1)=-\\frac{1}{8}$。",
        "-D2(x+exp(x), 0)/D(x+exp(x), 0)^3 == ANS"
      ]
    ],
    "trap": "算成 $\\frac{1}{f''(0)}=1$，或少乘一個 $g'$ 得 $-\\frac{f''}{f'^2}=-\\frac14$。",
    "check": [
      "數值反函數：$g(1.01)\\approx0.0049938$、$g(0.99)\\approx-0.0050063$，二階差分 $\\frac{g(1.01)-2g(1)+g(0.99)}{0.01^2}\\approx-0.125$。",
      "SUB(x+exp(x), 0.0049938) > 1.0099999 ;; SUB(x+exp(x), 0.0049938) < 1.0100001 ;; SUB(x+exp(x), -0.0050063) > 0.9899999 ;; SUB(x+exp(x), -0.0050063) < 0.9900001 ;; (0.0049938-0.0050063)/0.0001 == -0.125"
    ]
  },
  "refine-derivatives-029": {
    "spot": "右邊是四次多項式，$P''$ 會降兩次：$P$ 也是四次，而且只要偶次項。也可以想成 $P=(1+D^2)^{-1}x^4=(1-D^2+D^4)x^4$。",
    "why": "$(1+D^2)^{-1}=1-D^2+D^4-\\cdots$ 作用在多項式上幾項就停；比設五個未知係數解方程快。",
    "steps": [
      [
        "$(x^4)''=12x^2$。",
        "D2(x^4) == 12x^2"
      ],
      [
        "$(x^4)''''=(12x^2)''=24$。",
        "D2(12x^2) == 24"
      ],
      [
        "$P=x^4-12x^2+24$。",
        "x^4-12x^2+24 == ANS"
      ],
      [
        "驗：$P''=12x^2-24$，$P''+P=x^4$。",
        "D2(ANS)+ANS == x^4"
      ]
    ],
    "trap": "只修正一次得 $x^4-12x^2$，代回去多出 $-24$；$-12x^2$ 的二階導數 $-24$ 也要再補回來。",
    "check": [
      "在 $x=0$：$P(0)=24$，$P''(0)=-24$，相加 $0=0^4$。",
      "SUB(ANS, 0)+D2(ANS, 0) == 0"
    ]
  },
  "ser-034": {
    "spot": "係數 $n!$ 長得比任何 $r^n$ 都快：比值 $\\frac{a_{n+1}}{a_n}=(n+1)|x|$ 會跑到無窮大，除非 $x=0$。",
    "why": "比值法把 $n!$ 約成 $n+1$，一眼看出只有 $x=0$ 收斂。",
    "steps": [
      [
        "比值：$\\frac{(n+1)!|x|^{n+1}}{n!|x|^n}=(n+1)|x|$。",
        "(3*2*1)/(2*1) == 3"
      ],
      [
        "不管 $x\\ne0$ 多小，$n$ 夠大時 $(n+1)|x|>1$；例如 $|x|=0.01$、$n=1000$ 時已經是 $10.01$。",
        "SUB((n+1)*0.01, 1000, n) > 1"
      ],
      [
        "所以只在 $x=0$ 收斂，收斂半徑 $R=0$。",
        "0 == ANS"
      ]
    ],
    "trap": "把比值法的極限寫成 $\\frac{1}{n+1}\\to0$（分子分母顛倒），得出 $R=\\infty$；那是 $\\sum\\frac{x^n}{n!}$ 的情形。",
    "check": [
      "再小的 $x$ 也逃不掉：$|x|=0.001$ 時，$n=10000$ 的比值已經是 $10.001>1$。",
      "SUB((n+1)*0.001, 10000, n) > 1"
    ]
  },
  "uni-ser-012": {
    "spot": "$n(n-1)$ 搭 $x^n$：$n(n-1)x^{n-2}$ 是 $x^n$ 的二階導數 —— 把等比級數 $\\frac{1}{1-x}$ 微兩次。",
    "why": "冪級數逐項微分一次給出整族 $\\sum n(n-1)x^n$；分開算 $\\sum n^2$、$\\sum n$ 比較繞。",
    "steps": [
      [
        "$\\sum x^n=\\frac{1}{1-x}$，微兩次：$\\sum n(n-1)x^{n-2}=\\frac{2}{(1-x)^3}$。",
        "D2(1/(1-x)) == 2/(1-x)^3"
      ],
      [
        "乘 $x^2$：$\\sum n(n-1)x^n=\\frac{2x^2}{(1-x)^3}$。",
        "SUM(n*(n-1)*0.3^n, 0) == SUB(2x^2/(1-x)^3, 0.3)"
      ],
      [
        "代 $x=\\frac12$：$\\frac{2\\cdot\\frac14}{\\frac18}=4$。",
        "SUM(n*(n-1)/2^n, 0) == ANS"
      ]
    ],
    "trap": "只乘一個 $x$（或沒乘），代 $\\frac12$ 得 $8$ 或 $16$。",
    "check": [
      "$n=0,1$ 項為 $0$；從 $n=2$ 起：$\\frac{2}{4}+\\frac{6}{8}+\\frac{12}{16}=2$，剩下的尾巴補到 $4$。",
      "2/4+6/8+12/16 < ANS ;; SUM(n*(n-1)/2^n, 5) == ANS-2"
    ]
  },
  "ap-rr-005": {
    "spot": "觀察者固定、氣球垂直上升：水平距離 $40$ 是常數，仰角 $\\theta$ 跟高度 $h$ 的關係是 $\\tan\\theta=\\frac{h}{40}$。",
    "why": "把 $\\theta=\\arctan\\frac{h}{40}$ 對時間微，連鎖律直接給 $\\frac{d\\theta}{dt}$；用 $\\sec^2\\theta$ 的寫法也行，但要另外算 $\\cos\\theta$。",
    "steps": [
      [
        "$\\theta=\\arctan\\frac{h}{40}$，$\\frac{d\\theta}{dh}=\\frac{40}{1600+h^2}$。",
        "D(atan(x/40)) == 40/(1600+x^2)"
      ],
      [
        "$h=30$：$\\frac{40}{1600+900}=\\frac{40}{2500}=\\frac{2}{125}$。",
        "D(atan(x/40), 30) == 2/125"
      ],
      [
        "乘上 $\\frac{dh}{dt}=3$：$\\frac{d\\theta}{dt}=\\frac{6}{125}=0.048$。",
        "D(atan(x/40), 30)*3 == ANS"
      ]
    ],
    "trap": "用 $\\frac{1}{1+h^2}$ 忘了內層的 $\\frac{1}{40}$，或把距離 $40$ 當成斜邊，得到錯誤的 $\\cos\\theta$。",
    "check": [
      "另一條路：$\\sec^2\\theta\\cdot\\theta'=\\frac{3}{40}$，此時斜邊 $50$、$\\cos\\theta=\\frac45$，$\\theta'=\\frac{3}{40}\\cdot\\frac{16}{25}=\\frac{6}{125}$。",
      "3/40*(4/5)^2 == ANS"
    ]
  },
  "burst-boss-int-004": {
    "spot": "$\\int_0^\\infty$ 配上 $x^4$ 和 $1+x^6$：代 $x\\to\\frac1x$ 會把 $\\frac{x^4}{1+x^6}$ 換成 $\\frac{1}{1+x^6}$，兩個相加後分子 $1+x^4$ 可以對 $1+x^6=(1+x^2)(x^4-x^2+1)$ 拆。",
    "why": "對稱代換避開六次方的部分分式；加起來只剩 $\\frac{1}{1+x^2}$ 和 $\\frac{x^2}{1+x^6}$ 兩個好積的。",
    "steps": [
      [
        "代 $x=\\frac1u$：$\\int_0^\\infty\\frac{x^4}{1+x^6}\\,dx=\\int_0^\\infty\\frac{1}{1+u^6}\\,du$。",
        "INT(x^4/(1+x^6), 0, inf) == INT(1/(1+x^6), 0, inf)"
      ],
      [
        "所以 $2I=\\int_0^\\infty\\frac{1+x^4}{1+x^6}\\,dx$；而 $1+x^4=(x^4-x^2+1)+x^2$，得 $\\frac{1+x^4}{1+x^6}=\\frac{1}{1+x^2}+\\frac{x^2}{1+x^6}$。",
        "(1+x^4)/(1+x^6) == 1/(1+x^2)+x^2/(1+x^6)"
      ],
      [
        "$\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$；$\\int_0^\\infty\\frac{x^2}{1+x^6}\\,dx$ 代 $w=x^3$ 得 $\\frac13\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{6}$。",
        "INT(1/(1+x^2), 0, inf) == pi/2 ;; INT(x^2/(1+x^6), 0, inf) == pi/6"
      ],
      [
        "$2I=\\frac{\\pi}{2}+\\frac{\\pi}{6}=\\frac{2\\pi}{3}$，$I=\\frac{\\pi}{3}$。",
        "INT(x^4/(1+x^6), 0, inf) == ANS"
      ]
    ],
    "trap": "代 $x=\\frac1u$ 時漏了 $dx=-\\frac{du}{u^2}$ 的 $\\frac{1}{u^2}$，以為 $\\frac{x^4}{1+x^6}$ 變成 $\\frac{u^2}{1+u^6}$，答 $\\frac{\\pi}{6}$。",
    "check": [
      "公式 $\\int_0^\\infty\\frac{x^{m}}{1+x^{n}}\\,dx=\\frac{\\pi/n}{\\sin\\frac{(m+1)\\pi}{n}}$：$m=4$、$n=6$ 給 $\\frac{\\pi/6}{1/2}=\\frac{\\pi}{3}$。",
      "(pi/6)/sin(5*pi/6) == ANS"
    ]
  },
  "burst-boss-int-016": {
    "spot": "$\\int_0^\\pi x\\cdot f(\\sin x)$：代 $x\\to\\pi-x$ 時 $\\sin$ 不變，$x$ 可以換成平均值 $\\frac{\\pi}{2}$ 提出去；剩下 $\\sin^{10}x$ 用瓦里斯公式。",
    "why": "$x$ 跟 $\\sin^{10}x$ 分部積分會沒完沒了；對稱代換一步把 $x$ 消掉。",
    "steps": [
      [
        "$I=\\int_0^\\pi(\\pi-x)\\sin^{10}x\\,dx$，與原式相加：$2I=\\pi\\int_0^\\pi\\sin^{10}x\\,dx$。",
        "INT(x*sin(x)^10, 0, pi) == pi/2*INT(sin(x)^10, 0, pi)"
      ],
      [
        "$\\int_0^\\pi\\sin^{10}x\\,dx=2\\int_0^{\\pi/2}\\sin^{10}x\\,dx$，所以 $I=\\pi\\int_0^{\\pi/2}\\sin^{10}x\\,dx$。",
        "INT(sin(x)^10, 0, pi) == 2*INT(sin(x)^10, 0, pi/2)"
      ],
      [
        "瓦里斯（偶次）：$\\int_0^{\\pi/2}\\sin^{10}x\\,dx=\\frac{9}{10}\\cdot\\frac78\\cdot\\frac56\\cdot\\frac34\\cdot\\frac12\\cdot\\frac{\\pi}{2}=\\frac{63}{256}\\cdot\\frac{\\pi}{2}$。",
        "INT(sin(x)^10, 0, pi/2) == 9/10*7/8*5/6*3/4*1/2*pi/2 ;; 9/10*7/8*5/6*3/4*1/2 == 63/256"
      ],
      [
        "$I=\\pi\\cdot\\frac{63\\pi}{512}=\\frac{63\\pi^2}{512}$。",
        "INT(x*sin(x)^10, 0, pi) == ANS"
      ]
    ],
    "trap": "瓦里斯公式偶次方忘了最後乘 $\\frac{\\pi}{2}$（那是奇數次方才沒有的），答 $\\frac{63\\pi}{256}$。",
    "check": [
      "大小：$\\int_0^\\pi x\\,dx=\\frac{\\pi^2}{2}$，乘上平均值很小的 $\\sin^{10}x$，答案 $\\approx1.214$ 比 $\\frac{\\pi^2}{2}\\approx4.93$ 小很多。",
      "ANS > 1.2 ;; ANS < 1.22"
    ]
  },
  "burst-boss2-int-001": {
    "spot": "$\\ln x$ 乘有理函數、積 $0$ 到 $\\infty$：$\\ln x$ 是 $x^s$ 對 $s$ 的導數（在 $s=0$）。先算 $\\int_0^\\infty\\frac{x^s}{1+x^3}\\,dx$ 的公式，再對 $s$ 微。",
    "why": "$\\int_0^\\infty\\frac{x^{s}}{1+x^{n}}\\,dx=\\frac{\\pi/n}{\\sin\\frac{(s+1)\\pi}{n}}$ 是現成的；直接處理 $\\ln x$ 沒有好的反導數。",
    "steps": [
      [
        "公式：$F(s)=\\int_0^\\infty\\frac{x^s}{1+x^3}\\,dx=\\frac{\\pi/3}{\\sin\\frac{(s+1)\\pi}{3}}$（$-1<s<2$）；以 $s=\\frac12$ 驗證。",
        "SUB(INT(x^u/(1+x^3), 0, inf, x), 0.5, u) == SUB(pi/3/sin(pi*(u+1)/3), 0.5, u)"
      ],
      [
        "所求 $=F'(0)$：對 $s$ 微，$F'(s)=-\\frac{\\pi}{3}\\cdot\\frac{\\frac{\\pi}{3}\\cos\\frac{(s+1)\\pi}{3}}{\\sin^2\\frac{(s+1)\\pi}{3}}$。",
        "D(pi/3/sin(pi*(x+1)/3)) == -(pi/3)*(pi/3)*cos(pi*(x+1)/3)/sin(pi*(x+1)/3)^2"
      ],
      [
        "$s=0$：$\\cos\\frac{\\pi}{3}=\\frac12$、$\\sin^2\\frac{\\pi}{3}=\\frac34$，$F'(0)=-\\frac{\\pi^2}{9}\\cdot\\frac{1/2}{3/4}=-\\frac{2\\pi^2}{27}$。",
        "D(pi/3/sin(pi*(x+1)/3), 0) == -2*pi^2/27"
      ],
      [
        "所以積分 $=-\\frac{2\\pi^2}{27}$。",
        "INT(ln(x)/(1+x^3), 0, inf) == ANS"
      ]
    ],
    "trap": "用 $x\\to\\frac1x$ 以為積分是 $0$（像 $\\int_0^\\infty\\frac{\\ln x}{1+x^2}\\,dx=0$ 那題）；那個技巧只對 $1+x^2$ 成立，這裡分母換成 $1+x^3$ 後不對稱。",
    "check": [
      "符號：$(0,1)$ 上 $\\ln x<0$ 而 $\\frac{1}{1+x^3}$ 接近 $1$，負的部分比 $(1,\\infty)$ 衰減得快的正部分大，答案為負合理。",
      "INT(ln(x)/(1+x^3), 0, 1) < 0 ;; INT(ln(x)/(1+x^3), 1, inf) > 0"
    ]
  },
  "burst-boss2-int-007": {
    "spot": "$\\frac{1-\\cos x}{x^2}$：分母 $x^2$ 很適合分部積分降一次，$(1-\\cos x)'=\\sin x$，剩下 $\\frac{\\sin x}{x}$ 的狄利克雷積分。",
    "why": "分部後邊界項兩端都是 $0$，直接接到已知的 $\\int_0^\\infty\\frac{\\sin x}{x}\\,dx=\\frac{\\pi}{2}$。",
    "steps": [
      [
        "分部：$u=1-\\cos x$、$dv=\\frac{dx}{x^2}$，$v=-\\frac1x$。乘積的導數：$\\left(-\\frac{1-\\cos x}{x}\\right)'=\\frac{1-\\cos x}{x^2}-\\frac{\\sin x}{x}$。",
        "D(-(1-cos(x))/x) == (1-cos(x))/x^2-sin(x)/x"
      ],
      [
        "邊界項：$x\\to0$ 時 $\\frac{1-\\cos x}{x}\\sim\\frac{x}{2}\\to0$；$x\\to\\infty$ 時 $\\left|\\frac{1-\\cos x}{x}\\right|\\le\\frac2x\\to0$。",
        "LIM((1-cos(x))/x^2, 0) == 1/2"
      ],
      [
        "所以 $\\int_0^\\infty\\frac{1-\\cos x}{x^2}\\,dx=\\int_0^\\infty\\frac{\\sin x}{x}\\,dx=\\frac{\\pi}{2}$。",
        "INT(sin(x)/x, 0, inf) == ANS"
      ]
    ],
    "trap": "以為 $1-\\cos x$ 在 $0$ 附近像 $1$，認定積分在 $0$ 發散；其實 $1-\\cos x\\sim\\frac{x^2}{2}$，被積函數在 $0$ 趨近 $\\frac12$。",
    "check": [
      "截到 $100$ 的數值積分：尾巴小於 $\\int_{100}^\\infty\\frac{2}{x^2}dx=0.02$，所以應落在 $\\frac{\\pi}{2}-0.02$ 到 $\\frac{\\pi}{2}$ 之間。",
      "INT((1-cos(x))/x^2, 0, 100) < ANS ;; INT((1-cos(x))/x^2, 0, 100) > ANS-0.02"
    ]
  },
  "burst-boss2-lim-006": {
    "spot": "分子扣掉 $\\frac{x^3}{3}$、加回 $\\frac{x^5}{10}$ —— 正是 $\\int_0^x\\ln(1+t^2)\\,dt$ 展開的前兩項，要的是 $x^7$ 的係數。",
    "why": "把 $\\ln(1+u)=u-\\frac{u^2}{2}+\\frac{u^3}{3}$ 代 $u=t^2$ 再逐項積分，比對變上限積分用羅必達三次乾淨。",
    "steps": [
      [
        "$\\ln(1+t^2)=t^2-\\frac{t^4}{2}+\\frac{t^6}{3}-\\cdots$。",
        "LIM((ln(1+x^2)-x^2+x^4/2)/x^6, 0) == 1/3"
      ],
      [
        "逐項積分：$\\int_0^x\\ln(1+t^2)\\,dt=\\frac{x^3}{3}-\\frac{x^5}{10}+\\frac{x^7}{21}-\\cdots$。",
        "INT(t^2-t^4/2+t^6/3, 0, 0.7, t) == 0.7^3/3-0.7^5/10+0.7^7/21"
      ],
      [
        "前兩項跟分子扣掉的抵消，剩 $\\frac{x^7}{21}$；極限 $=\\frac{1}{21}$（也可羅必達一次：分子導數 $\\ln(1+x^2)-x^2+\\frac{x^4}{2}$ 除以 $7x^6$）。",
        "LIM((ln(1+x^2)-x^2+x^4/2)/(7x^6), 0) == ANS"
      ]
    ],
    "trap": "積分時忘了除以次方，把 $\\frac{t^6}{3}$ 的貢獻當成 $\\frac{x^7}{3}$，答 $\\frac13$。",
    "check": [
      "$x=0.3$ 實算：分子用積分算，比值約 $0.0453$，從下方靠近 $\\frac{1}{21}\\approx0.0476$（下一項 $-\\frac{x^9}{36}$ 還在往下拉）。",
      "(INT(ln(1+t^2), 0, 0.3, t)-0.3^3/3+0.3^5/10)/0.3^7 > 0.045 ;; (INT(ln(1+t^2), 0, 0.3, t)-0.3^3/3+0.3^5/10)/0.3^7 < ANS"
    ]
  },
  "burst-boss2-lim-008": {
    "spot": "$\\frac{1}{n^2+k^2}=\\frac{1}{n^2}\\cdot\\frac{1}{1+(k/n)^2}$：和是 $\\frac1n\\times$（$\\frac{1}{1+x^2}$ 的右端點黎曼和）；扣掉主項 $\\frac{\\pi}{4n}$ 再乘 $n^2$，問的是黎曼和誤差的 $\\frac1n$ 項。",
    "why": "右端點黎曼和的誤差主項是 $\\frac{f(1)-f(0)}{2n}$（梯形修正）；逐項估計會很亂。",
    "steps": [
      [
        "$\\sum_{k=1}^n\\frac{1}{n^2+k^2}=\\frac1n\\cdot\\frac1n\\sum_{k=1}^nf\\left(\\frac kn\\right)$，$f(x)=\\frac{1}{1+x^2}$，$\\int_0^1f=\\frac{\\pi}{4}$。",
        "INT(1/(1+x^2), 0, 1) == pi/4"
      ],
      [
        "右端點和：$\\frac1n\\sum f\\left(\\frac kn\\right)=\\frac{\\pi}{4}+\\frac{f(1)-f(0)}{2n}+O\\left(\\frac{1}{n^2}\\right)$，其中 $f(1)-f(0)=-\\frac12$。",
        "SUB(1/(1+x^2), 1)-SUB(1/(1+x^2), 0) == -1/2"
      ],
      [
        "所以原和 $=\\frac{\\pi}{4n}-\\frac{1}{4n^2}+O\\left(\\frac{1}{n^3}\\right)$；扣掉 $\\frac{\\pi}{4n}$ 乘 $n^2$，極限 $-\\frac14$。",
        "(SUB(1/(1+x^2), 1)-SUB(1/(1+x^2), 0))/2 == ANS"
      ]
    ],
    "trap": "以為黎曼和跟積分的差是 $o\\left(\\frac1n\\right)$ 而答 $0$；右端點和的誤差是 $\\frac1n$ 等級，乘 $n^2$ 前已經被多除了一個 $n$，剛好留下有限值。",
    "check": [
      "$n=2$ 實算：$4\\left(\\frac15+\\frac18-\\frac{\\pi}{8}\\right)\\approx-0.271$；下一階修正約 $-\\frac{1}{24n}$，$n=2$ 時 $-0.25-0.021=-0.271$。",
      "4*(1/5+1/8-pi/8) < ANS ;; 4*(1/5+1/8-pi/8) > -0.28"
    ]
  },
  "burst-boss2-param-004": {
    "spot": "$x$ 乘 $e^{-ax}$：$xe^{-ax}=-\\frac{\\partial}{\\partial a}e^{-ax}$。先算沒有 $x$ 的 $G(a)=\\int_0^\\infty e^{-ax}\\cos x\\,dx$，再對 $a$ 微。",
    "why": "對參數微分把 $x$ 變出來，省掉兩次分部積分；$G(a)=\\frac{a}{a^2+1}$ 是拉普拉斯轉換的標準結果。",
    "steps": [
      [
        "$G(a)=\\int_0^\\infty e^{-ax}\\cos x\\,dx=\\frac{a}{a^2+1}$（$a>0$）。",
        "INT(exp(-a*x)*cos(x), 0, inf) == a/(a^2+1)"
      ],
      [
        "$F(a)=-G'(a)$，因為 $\\frac{\\partial}{\\partial a}e^{-ax}=-xe^{-ax}$。",
        "D(exp(-a*x), , a) == -x*exp(-a*x)"
      ],
      [
        "$G'(a)=\\frac{(a^2+1)-2a^2}{(a^2+1)^2}=\\frac{1-a^2}{(a^2+1)^2}$，所以 $F(a)=\\frac{a^2-1}{(a^2+1)^2}$。",
        "-D(a/(a^2+1)) == ANS"
      ],
      [
        "直接數值積分核對。",
        "INT(x*exp(-a*x)*cos(x), 0, inf, x) == ANS"
      ]
    ],
    "trap": "忘了 $-G'$ 的負號，答 $\\frac{1-a^2}{(a^2+1)^2}$；$a$ 很大時 $\\cos x\\approx1$，$F\\approx\\frac{1}{a^2}>0$，可以抓到這個錯。",
    "check": [
      "$a=1$ 時 $F(1)=0$：$\\int_0^\\infty xe^{-x}\\cos x\\,dx=0$。",
      "INT(x*exp(-x)*cos(x), 0, inf) == 0"
    ]
  },
  "burst-boss2-param-005": {
    "spot": "分母 $\\ln x$ 是 $x^a$ 對 $a$ 微分會掉出來的東西：$\\frac{\\partial}{\\partial a}\\frac{x^a-1}{\\ln x}=x^a$ —— 費曼技巧。",
    "why": "對 $a$ 微分後被積函數變成 $x^a$，積分一行；原式直接積沒有初等反導數。",
    "steps": [
      [
        "$F'(a)=\\int_0^1x^a\\,dx=\\frac{1}{a+1}$。",
        "D((x^a-1)/ln(x), , a) == x^a ;; INT(x^a, 0, 1, x) == 1/(a+1)"
      ],
      [
        "初值：$F(0)=\\int_0^1\\frac{1-1}{\\ln x}\\,dx=0$。",
        "SUB(ANS, 0, a) == 0"
      ],
      [
        "積回去：$F(a)=\\ln(a+1)$。",
        "D(ANS) == 1/(a+1)"
      ],
      [
        "數值積分核對。",
        "INT((x^a-1)/ln(x), 0, 1, x) == ANS"
      ]
    ],
    "trap": "積回去時忘了用 $F(0)=0$ 定常數，或寫成 $\\ln a$（把 $\\int_0^1x^a\\,dx$ 算成 $\\frac1a$）。",
    "check": [
      "代 $a=1$ 驗算：$\\int_0^1\\frac{x-1}{\\ln x}\\,dx=\\ln2$。",
      "INT((x-1)/ln(x), 0, 1) == ln(2)"
    ]
  },
  "burst-boss2-ser-002": {
    "spot": "只有奇數的四次方倒數：全部 $\\sum\\frac{1}{n^4}=\\frac{\\pi^4}{90}$ 減掉偶數項，偶數項是全部的 $\\frac{1}{2^4}$。",
    "why": "奇偶拆分直接把它接到 $\\zeta(4)$；不必另做傅立葉級數。",
    "steps": [
      [
        "$\\sum_{n\\ge1}\\frac{1}{n^4}=\\frac{\\pi^4}{90}$。",
        "SUM(1/n^4, 1) == pi^4/90"
      ],
      [
        "偶數項：$\\sum\\frac{1}{(2n)^4}=\\frac{1}{16}\\cdot\\frac{\\pi^4}{90}$。",
        "SUM(1/(2n)^4, 1) == pi^4/90/16"
      ],
      [
        "奇數項 $=\\frac{15}{16}\\cdot\\frac{\\pi^4}{90}=\\frac{\\pi^4}{96}$。",
        "15/16*pi^4/90 == pi^4/96"
      ],
      [
        "所以和為 $\\frac{\\pi^4}{96}$。",
        "SUM(1/(2n-1)^4, 1) == ANS"
      ]
    ],
    "trap": "以為奇數項剛好是一半，答 $\\frac{\\pi^4}{180}$；偶數項只佔 $\\frac{1}{16}$，第一項 $1$ 就幾乎是全部。",
    "check": [
      "第一項是 $1$，第二項 $\\frac{1}{81}$：總和 $\\frac{\\pi^4}{96}\\approx1.0147$ 只比 $1+\\frac{1}{81}$ 多一點點。",
      "ANS > 1+1/81 ;; ANS < 1+1/81+0.003"
    ]
  },
  "burst-boss2-ser-005": {
    "spot": "$\\sum n^k r^n$、$r=\\frac13$：把指標平移一格，$(n+1)^k$ 用二項式展開，得到 $S_k$ 用 $S_1,\\dots,S_{k-1}$ 表示的遞迴。",
    "why": "平移遞迴只要加減乘，四次方也不用微四次；$r=\\frac13$ 時遞迴是 $S_k=\\frac12\\left(\\frac32+\\sum_{j=1}^{k-1}\\binom kjS_j\\right)$。",
    "steps": [
      [
        "$S_k=\\sum_{n\\ge1}\\frac{n^k}{3^n}=\\frac13\\sum_{n\\ge0}\\frac{(n+1)^k}{3^n}$；展開後 $\\frac23S_k=\\frac13\\left(\\frac32+\\sum_{j=1}^{k-1}\\binom kjS_j\\right)$。以 $k=2$ 驗：$S_2=\\frac12\\left(\\frac32+2S_1\\right)$。",
        "SUM(n^2/3^n, 1) == 1/2*(3/2+2*SUM(n/3^n, 1))"
      ],
      [
        "$S_1=\\frac12\\cdot\\frac32=\\frac34$，$S_2=\\frac12\\left(\\frac32+\\frac32\\right)=\\frac32$。",
        "SUM(n/3^n, 1) == 3/4 ;; SUM(n^2/3^n, 1) == 3/2"
      ],
      [
        "$S_3=\\frac12\\left(\\frac32+3\\cdot\\frac34+3\\cdot\\frac32\\right)=\\frac{33}{8}$。",
        "SUM(n^3/3^n, 1) == 1/2*(3/2+3*3/4+3*3/2) ;; SUM(n^3/3^n, 1) == 33/8"
      ],
      [
        "$S_4=\\frac12\\left(\\frac32+4\\cdot\\frac34+6\\cdot\\frac32+4\\cdot\\frac{33}{8}\\right)=\\frac12(1.5+3+9+16.5)=15$。",
        "1/2*(3/2+4*3/4+6*3/2+4*33/8) == ANS ;; SUM(n^4/3^n, 1) == ANS"
      ]
    ],
    "trap": "二項式係數用錯（例如 $(n+1)^4$ 的中間係數寫成 $4$ 而不是 $6$），或漏掉 $n=0$ 那一項的 $\\frac{1}{1-r}=\\frac32$。",
    "check": [
      "前四項 $\\frac13+\\frac{16}{9}+\\frac{81}{27}+\\frac{256}{81}\\approx8.27$，峰值在 $n=4$ 附近，尾巴補到 $15$。",
      "1/3+16/9+81/27+256/81 < ANS ;; SUM(n^4/3^n, 5) == ANS-(1/3+16/9+81/27+256/81)"
    ]
  },
  "burst-boss2-ser-006": {
    "spot": "又是 $\\sum n^kr^n$、$r=\\frac13$，這次 $k=5$：平移指標得遞迴 $S_k=\\frac12\\left(\\frac32+\\sum_{j=1}^{k-1}\\binom kjS_j\\right)$，前面幾個 $S_j$ 一路算上來。",
    "why": "對 $\\frac{1}{1-x}$ 套 $\\left(x\\frac{d}{dx}\\right)^5$ 很容易出錯；遞迴只用二項式係數。",
    "steps": [
      [
        "遞迴來源：$S_k=\\frac13\\sum_{n\\ge0}\\frac{(n+1)^k}{3^n}$，展開 $(n+1)^k$ 後把 $S_k$ 移到左邊。以 $k=3$ 驗。",
        "SUM(n^3/3^n, 1) == 1/2*(3/2+3*SUM(n/3^n, 1)+3*SUM(n^2/3^n, 1))"
      ],
      [
        "$S_1=\\frac34$、$S_2=\\frac32$、$S_3=\\frac{33}{8}$。",
        "SUM(n/3^n, 1) == 3/4 ;; SUM(n^2/3^n, 1) == 3/2 ;; SUM(n^3/3^n, 1) == 33/8"
      ],
      [
        "$S_4=\\frac12\\left(\\frac32+4\\cdot\\frac34+6\\cdot\\frac32+4\\cdot\\frac{33}{8}\\right)=15$。",
        "SUM(n^4/3^n, 1) == 15"
      ],
      [
        "$S_5=\\frac12\\left(\\frac32+5\\cdot\\frac34+10\\cdot\\frac32+10\\cdot\\frac{33}{8}+5\\cdot15\\right)=\\frac12(1.5+3.75+15+41.25+75)=\\frac{273}{4}$。",
        "1/2*(3/2+5*3/4+10*3/2+10*33/8+5*15) == ANS ;; SUM(n^5/3^n, 1) == ANS"
      ]
    ],
    "trap": "$(n+1)^5$ 的二項式係數 $1,5,10,10,5,1$ 少用一個，或忘了 $n=0$ 項貢獻的 $\\frac32$。",
    "check": [
      "比較相鄰：$S_4=15$、$S_5=68.25$，比值約 $4.5$；$S_3\\to S_4$ 約 $3.6$，次方越高峰越往右、增幅越大，合理。",
      "ANS/15 > 4.5 ;; ANS/15 < 4.6"
    ]
  },
  "burst-boss3-int-005": {
    "spot": "$\\int_0^\\pi x\\cdot f(\\sin x)$ 型：代 $x\\to\\pi-x$ 把 $x$ 換成 $\\frac{\\pi}{2}$；剩下的 $\\int_0^\\pi\\ln\\sin x\\,dx=-\\pi\\ln2$ 是經典結果。",
    "why": "對稱代換消掉 $x$，避免對 $\\ln\\sin x$ 分部積分（會出現 $x^2\\cot x$ 更難）。",
    "steps": [
      [
        "$I=\\int_0^\\pi(\\pi-x)\\ln\\sin x\\,dx$，相加得 $I=\\frac{\\pi}{2}\\int_0^\\pi\\ln\\sin x\\,dx$。",
        "INT(x*ln(sin(x)), 0, pi) == pi/2*INT(ln(sin(x)), 0, pi)"
      ],
      [
        "$J=\\int_0^{\\pi/2}\\ln\\sin x\\,dx$：由對稱 $\\int_0^\\pi\\ln\\sin x\\,dx=2J$；用 $\\sin x=2\\sin\\frac x2\\cos\\frac x2$ 拆開又得 $\\pi\\ln2+4J$。所以 $2J=\\pi\\ln2+4J$，$J=-\\frac{\\pi}{2}\\ln2$。",
        "INT(ln(sin(x)), 0, pi/2) == -pi/2*ln(2)"
      ],
      [
        "$\\int_0^\\pi\\ln\\sin x\\,dx=2J=-\\pi\\ln2$。",
        "INT(ln(sin(x)), 0, pi) == -pi*ln(2)"
      ],
      [
        "$I=\\frac{\\pi}{2}\\cdot(-\\pi\\ln2)=-\\frac{\\pi^2\\ln2}{2}$。",
        "INT(x*ln(sin(x)), 0, pi) == ANS"
      ]
    ],
    "trap": "把 $\\int_0^{\\pi/2}$ 的結果 $-\\frac{\\pi}{2}\\ln2$ 當成 $\\int_0^\\pi$ 的，答 $-\\frac{\\pi^2\\ln2}{4}$。",
    "check": [
      "$\\ln\\sin x\\le0$，所以答案必為負；大小約 $-3.42$。",
      "ANS < -3.4 ;; ANS > -3.45"
    ]
  },
  "burst-boss3-int-012": {
    "spot": "$\\frac{x^5}{e^x+1}$：把 $\\frac{1}{e^x+1}=\\sum_{k\\ge1}(-1)^{k-1}e^{-kx}$ 展開，每一項都是 $\\int_0^\\infty x^5e^{-kx}\\,dx=\\frac{5!}{k^6}$。",
    "why": "展開後變成交錯的 $\\zeta(6)$：$\\eta(6)=\\left(1-2^{-5}\\right)\\zeta(6)$；費米–狄拉克型積分的標準路線。",
    "steps": [
      [
        "$\\frac{1}{e^x+1}=\\frac{e^{-x}}{1+e^{-x}}=\\sum_{k\\ge1}(-1)^{k-1}e^{-kx}$；每項 $\\int_0^\\infty x^5e^{-kx}\\,dx=\\frac{120}{k^6}$（以 $k=3$ 驗）。",
        "INT(x^5*exp(-3x), 0, inf) == 5*4*3*2/3^6"
      ],
      [
        "積分 $=120\\sum_{k\\ge1}\\frac{(-1)^{k-1}}{k^6}=120\\,\\eta(6)$。",
        "SUM((-1)^(n-1)/n^6, 1) == (1-1/32)*SUM(1/n^6, 1)"
      ],
      [
        "$\\zeta(6)=\\frac{\\pi^6}{945}$，$\\eta(6)=\\frac{31}{32}\\cdot\\frac{\\pi^6}{945}$。",
        "SUM(1/n^6, 1) == pi^6/945"
      ],
      [
        "$120\\cdot\\frac{31}{32}\\cdot\\frac{\\pi^6}{945}=\\frac{31\\pi^6}{252}$。",
        "120*31/32*pi^6/945 == ANS ;; INT(x^5/(exp(x)+1), 0, inf) == ANS"
      ]
    ],
    "trap": "把 $e^x+1$ 當成 $e^x-1$ 用 $5!\\zeta(6)=\\frac{8\\pi^6}{63}$；加號給的是交錯級數，要乘 $1-2^{-5}=\\frac{31}{32}$。",
    "check": [
      "比玻色型 $\\int_0^\\infty\\frac{x^5}{e^x-1}\\,dx=\\frac{8\\pi^6}{63}$ 小一點，比值正好 $\\frac{31}{32}$。",
      "INT(x^5/(exp(x)-1), 0, inf)*31/32 == ANS"
    ]
  },
  "burst-boss3-int-013": {
    "spot": "$\\frac{x^3}{e^x+1}$：展開成 $\\sum(-1)^{k-1}e^{-kx}$，每項給 $\\frac{3!}{k^4}$，加起來是 $3!\\,\\eta(4)$。",
    "why": "幾何級數展開把積分變成已知的 $\\zeta(4)=\\frac{\\pi^4}{90}$；直接找反導數不可能。",
    "steps": [
      [
        "$\\int_0^\\infty x^3e^{-kx}\\,dx=\\frac{6}{k^4}$（以 $k=2$ 驗）。",
        "INT(x^3*exp(-2x), 0, inf) == 6/2^4"
      ],
      [
        "積分 $=6\\sum\\frac{(-1)^{k-1}}{k^4}=6\\,\\eta(4)$，$\\eta(4)=\\left(1-\\frac18\\right)\\zeta(4)=\\frac78\\cdot\\frac{\\pi^4}{90}$。",
        "SUM((-1)^(n-1)/n^4, 1) == 7/8*pi^4/90"
      ],
      [
        "$6\\cdot\\frac78\\cdot\\frac{\\pi^4}{90}=\\frac{7\\pi^4}{120}$。",
        "6*7/8*pi^4/90 == ANS ;; INT(x^3/(exp(x)+1), 0, inf) == ANS"
      ]
    ],
    "trap": "交錯係數記成 $1-\\frac{1}{16}$（把 $2^{1-s}$ 寫成 $2^{-s}$），答 $\\frac{\\pi^4}{16}$。",
    "check": [
      "跟 $\\int_0^\\infty\\frac{x^3}{e^x-1}\\,dx=\\frac{\\pi^4}{15}$ 比，比值 $\\frac78$。",
      "INT(x^3/(exp(x)-1), 0, inf)*7/8 == ANS"
    ]
  },
  "burst-boss3-lim-004": {
    "spot": "$\\frac1n\\sum e^{k/n}$ 是等比級數，可以算出封閉式：令 $h=\\frac1n$，和 $=(e-1)\\frac{he^h}{e^h-1}$；扣掉 $(e-1)$ 和 $\\frac{e-1}{2n}$ 後問的是 $h^2$ 係數。",
    "why": "有封閉式就不必用歐拉–麥克勞林；$\\frac{he^h}{e^h-1}=1+\\frac h2+\\frac{h^2}{12}+\\cdots$ 是伯努利數的生成函數。",
    "steps": [
      [
        "等比和：$\\sum_{k=1}^ne^{k/n}=e^{1/n}\\frac{e-1}{e^{1/n}-1}$；乘 $\\frac1n=h$ 得 $(e-1)\\frac{he^h}{e^h-1}$（以 $n=3$ 驗）。",
        "(exp(1/3)+exp(2/3)+exp(1))/3 == (exp(1)-1)*SUB(x*exp(x)/(exp(x)-1), 1/3)"
      ],
      [
        "展開：$\\frac{he^h}{e^h-1}=1+\\frac h2+\\frac{h^2}{12}+O(h^4)$。",
        "LIM((x*exp(x)/(exp(x)-1)-1-x/2)/x^2, 0) == 1/12"
      ],
      [
        "扣掉 $(e-1)\\left(1+\\frac h2\\right)$，乘 $n^2=\\frac{1}{h^2}$：極限 $=\\frac{e-1}{12}$。",
        "(exp(1)-1)*LIM((x*exp(x)/(exp(x)-1)-1-x/2)/x^2, 0) == ANS"
      ]
    ],
    "trap": "用歐拉–麥克勞林時把係數記成 $\\frac{1}{24}$ 或忘了是 $f'(1)-f'(0)=e-1$，答 $\\frac{e-1}{24}$。",
    "check": [
      "歐拉–麥克勞林也給同一個：$\\frac{f'(1)-f'(0)}{12}=\\frac{e-1}{12}$。",
      "(D(exp(x), 1)-D(exp(x), 0))/12 == ANS"
    ]
  },
  "burst-boss3-lim-006": {
    "spot": "$\\frac1n\\sum\\frac{1}{1+(k/n)^2}$ 是右端點黎曼和，題目已扣掉積分 $\\frac{\\pi}{4}$ 和一階誤差 $-\\frac{1}{4n}$，問的是 $\\frac{1}{n^2}$ 項 —— 歐拉–麥克勞林第二項。",
    "why": "歐拉–麥克勞林：右端點和 $=\\int_0^1f+\\frac{f(1)-f(0)}{2n}+\\frac{f'(1)-f'(0)}{12n^2}+\\cdots$，只要算 $f'$ 在兩端的值。",
    "steps": [
      [
        "$f(x)=\\frac{1}{1+x^2}$，$\\int_0^1f=\\frac{\\pi}{4}$。",
        "INT(1/(1+x^2), 0, 1) == pi/4"
      ],
      [
        "一階：$\\frac{f(1)-f(0)}{2n}=\\frac{1/2-1}{2n}=-\\frac{1}{4n}$，正好被題目的 $+\\frac{1}{4n}$ 抵消。",
        "(SUB(1/(1+x^2), 1)-SUB(1/(1+x^2), 0))/2 == -1/4"
      ],
      [
        "$f'(x)=-\\frac{2x}{(1+x^2)^2}$：$f'(1)=-\\frac12$、$f'(0)=0$。",
        "D(1/(1+x^2), 1) == -1/2 ;; D(1/(1+x^2), 0) == 0"
      ],
      [
        "二階係數 $\\frac{-1/2-0}{12}=-\\frac{1}{24}$。",
        "(D(1/(1+x^2), 1)-D(1/(1+x^2), 0))/12 == ANS"
      ]
    ],
    "trap": "以為扣掉積分和一階項後只剩 $0$，或把 $\\frac{1}{12}$ 記成中點法的 $\\frac{1}{24}$，答 $-\\frac{1}{48}$。",
    "check": [
      "$n=2$ 實算：$4\\left(\\frac{0.8+0.5}{2}-\\frac{\\pi}{4}+\\frac18\\right)\\approx-0.0416$，很接近 $-\\frac{1}{24}\\approx-0.0417$。",
      "4*((0.8+0.5)/2-pi/4+1/8) > -0.042 ;; 4*((0.8+0.5)/2-pi/4+1/8) < -0.041"
    ]
  },
  "burst-boss3-ser-002": {
    "spot": "$\\sum\\frac{n^7}{2^n}$：七次方用微分會微到崩潰。平移指標 $n\\to n+1$，$r=\\frac12$ 時遞迴特別乾淨：$S_k=2+\\sum_{j=1}^{k-1}\\binom kjS_j$。",
    "why": "遞迴只需要二項式係數和前面的 $S_j$；$\\left(x\\frac{d}{dx}\\right)^7\\frac{1}{1-x}$ 的分子是七次多項式，很難不算錯。",
    "steps": [
      [
        "$S_k=\\sum_{n\\ge1}\\frac{n^k}{2^n}=\\frac12\\sum_{n\\ge0}\\frac{(n+1)^k}{2^n}$，展開移項得 $S_k=2+\\sum_{j=1}^{k-1}\\binom kjS_j$。以 $k=2$ 驗：$S_2=2+2S_1$。",
        "SUM(n^2/2^n, 1) == 2+2*SUM(n/2^n, 1)"
      ],
      [
        "$S_1=2$、$S_2=6$、$S_3=2+3\\cdot2+3\\cdot6=26$。",
        "SUM(n/2^n, 1) == 2 ;; SUM(n^2/2^n, 1) == 6 ;; SUM(n^3/2^n, 1) == 26"
      ],
      [
        "$S_4=2+4\\cdot2+6\\cdot6+4\\cdot26=150$。",
        "2+4*2+6*6+4*26 == 150 ;; SUM(n^4/2^n, 1) == 150"
      ],
      [
        "$S_5=2+5\\cdot2+10\\cdot6+10\\cdot26+5\\cdot150=1082$。",
        "2+5*2+10*6+10*26+5*150 == 1082 ;; SUM(n^5/2^n, 1) == 1082"
      ],
      [
        "$S_6=2+6\\cdot2+15\\cdot6+20\\cdot26+15\\cdot150+6\\cdot1082=9366$。",
        "2+6*2+15*6+20*26+15*150+6*1082 == 9366 ;; SUM(n^6/2^n, 1) == 9366"
      ],
      [
        "$S_7=2+7\\cdot2+21\\cdot6+35\\cdot26+35\\cdot150+21\\cdot1082+7\\cdot9366=94586$。",
        "2+7*2+21*6+35*26+35*150+21*1082+7*9366 == ANS ;; SUM(n^7/2^n, 1) == ANS"
      ]
    ],
    "trap": "漏了 $n=0$ 項給的常數 $2$（$\\sum_{n\\ge0}\\frac{1}{2^n}=2$），每一層都少 $2$，錯誤一路放大。",
    "check": [
      "量級：峰值在 $n\\approx\\frac{7}{\\ln2}\\approx10$，$\\frac{10^7}{2^{10}}\\approx9766$，十來項加起來約十萬上下，合理。",
      "10^7/2^10 > 9700 ;; ANS > 90000"
    ]
  },
  "burst-boss3-ser-003": {
    "spot": "$\\sum\\frac{n^5}{4^n}$：平移指標的遞迴，$r=\\frac14$ 時是 $S_k=\\frac13\\left(\\frac43+\\sum_{j=1}^{k-1}\\binom kjS_j\\right)$。",
    "why": "從 $S_1$ 一路推到 $S_5$ 只要四則運算；微分法要對 $\\frac{1}{1-x}$ 套五次 $x\\frac{d}{dx}$。",
    "steps": [
      [
        "$S_k=\\frac14\\sum_{n\\ge0}\\frac{(n+1)^k}{4^n}$，展開移項：$\\frac34S_k=\\frac14\\left(\\frac43+\\sum_{j=1}^{k-1}\\binom kjS_j\\right)$。以 $k=2$ 驗。",
        "SUM(n^2/4^n, 1) == 1/3*(4/3+2*SUM(n/4^n, 1))"
      ],
      [
        "$S_1=\\frac49$、$S_2=\\frac13\\left(\\frac43+\\frac89\\right)=\\frac{20}{27}$。",
        "SUM(n/4^n, 1) == 4/9 ;; SUM(n^2/4^n, 1) == 20/27"
      ],
      [
        "$S_3=\\frac13\\left(\\frac43+3\\cdot\\frac49+3\\cdot\\frac{20}{27}\\right)=\\frac{44}{27}$。",
        "1/3*(4/3+3*4/9+3*20/27) == 44/27 ;; SUM(n^3/4^n, 1) == 44/27"
      ],
      [
        "$S_4=\\frac13\\left(\\frac43+4\\cdot\\frac49+6\\cdot\\frac{20}{27}+4\\cdot\\frac{44}{27}\\right)=\\frac{380}{81}$。",
        "1/3*(4/3+4*4/9+6*20/27+4*44/27) == 380/81 ;; SUM(n^4/4^n, 1) == 380/81"
      ],
      [
        "$S_5=\\frac13\\left(\\frac43+5\\cdot\\frac49+10\\cdot\\frac{20}{27}+10\\cdot\\frac{44}{27}+5\\cdot\\frac{380}{81}\\right)=\\frac{4108}{243}$。",
        "1/3*(4/3+5*4/9+10*20/27+10*44/27+5*380/81) == ANS ;; SUM(n^5/4^n, 1) == ANS"
      ]
    ],
    "trap": "忘了 $n=0$ 項：$\\sum_{n\\ge0}\\frac{1}{4^n}=\\frac43$；或移項時把 $1-\\frac14$ 漏掉，每層差一個 $\\frac34$ 倍。",
    "check": [
      "前三項 $\\frac14+\\frac{32}{16}+\\frac{243}{64}\\approx6.05$，峰值在 $n\\approx3.6$，總和約 $16.9$ 合理。",
      "1/4+32/16+243/64 < ANS ;; ANS < 17"
    ]
  },
  "burst-boss3-ser-004": {
    "spot": "$\\sum\\frac{n^6}{3^n}$：平移指標的遞迴 $S_k=\\frac12\\left(\\frac32+\\sum_{j=1}^{k-1}\\binom kjS_j\\right)$，從 $S_1$ 算到 $S_6$。",
    "why": "六次方微分法分子會是六次多項式；遞迴只用二項式係數 $1,6,15,20,15,6,1$。",
    "steps": [
      [
        "$S_k=\\frac13\\sum_{n\\ge0}\\frac{(n+1)^k}{3^n}$，展開移項得遞迴。以 $k=2$ 驗。",
        "SUM(n^2/3^n, 1) == 1/2*(3/2+2*SUM(n/3^n, 1))"
      ],
      [
        "$S_1=\\frac34$、$S_2=\\frac32$、$S_3=\\frac{33}{8}$。",
        "SUM(n/3^n, 1) == 3/4 ;; SUM(n^2/3^n, 1) == 3/2 ;; SUM(n^3/3^n, 1) == 33/8"
      ],
      [
        "$S_4=15$、$S_5=\\frac{273}{4}$。",
        "1/2*(3/2+4*3/4+6*3/2+4*33/8) == 15 ;; 1/2*(3/2+5*3/4+10*3/2+10*33/8+5*15) == 273/4"
      ],
      [
        "$S_6=\\frac12\\left(\\frac32+6\\cdot\\frac34+15\\cdot\\frac32+20\\cdot\\frac{33}{8}+15\\cdot15+6\\cdot\\frac{273}{4}\\right)=\\frac12(745.5)=\\frac{1491}{4}$。",
        "1/2*(3/2+6*3/4+15*3/2+20*33/8+15*15+6*273/4) == ANS ;; SUM(n^6/3^n, 1) == ANS"
      ]
    ],
    "trap": "$(n+1)^6$ 的係數用錯（例如中間寫成 $15$ 而不是 $20$），或漏掉 $n=0$ 項的 $\\frac32$。",
    "check": [
      "量級：峰值在 $n\\approx\\frac{6}{\\ln3}\\approx5.5$，$\\frac{5^6}{3^5}\\approx64$、$\\frac{6^6}{3^6}=64$，十來項加起來數百，$372.75$ 合理。",
      "6^6/3^6 == 64 ;; ANS > 370"
    ]
  },
  "burst-int-025": {
    "spot": "$\\frac{x^3}{e^x-1}$（普朗克型）：$\\frac{1}{e^x-1}=\\sum_{k\\ge1}e^{-kx}$，每項 $\\int_0^\\infty x^3e^{-kx}\\,dx=\\frac{3!}{k^4}$，總和 $3!\\,\\zeta(4)$。",
    "why": "幾何級數展開把它變成 $\\zeta(4)=\\frac{\\pi^4}{90}$；沒有初等反導數。",
    "steps": [
      [
        "$\\frac{1}{e^x-1}=\\frac{e^{-x}}{1-e^{-x}}=\\sum_{k\\ge1}e^{-kx}$（$x>0$）。",
        "SUM(exp(-n*0.7), 1) == 1/(exp(0.7)-1)"
      ],
      [
        "$\\int_0^\\infty x^3e^{-kx}\\,dx=\\frac{6}{k^4}$（以 $k=2$ 驗）。",
        "INT(x^3*exp(-2x), 0, inf) == 6/2^4"
      ],
      [
        "總和 $6\\zeta(4)=6\\cdot\\frac{\\pi^4}{90}=\\frac{\\pi^4}{15}$。",
        "6*SUM(1/n^4, 1) == pi^4/15"
      ],
      [
        "所以積分 $=\\frac{\\pi^4}{15}\\approx6.494$。",
        "INT(x^3/(exp(x)-1), 0, inf) == ANS"
      ]
    ],
    "trap": "每項積分寫成 $\\frac{3!}{k^3}$（少一次方），得 $6\\zeta(3)$；代 $u=kx$ 時 $x^3\\,dx$ 一共給出 $k^{-4}$。",
    "check": [
      "只取 $k=1$ 項就是 $6$，加上後面的項到 $6.494$：$\\zeta(4)\\approx1.0823$。",
      "ANS > 6 ;; ANS/6 == SUM(1/n^4, 1)"
    ]
  }
};
