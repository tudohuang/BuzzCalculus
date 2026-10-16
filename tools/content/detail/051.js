// 詳解 v2 第 051 批：52 題。格式見 tools/build_solution_detail.js 的說明。
module.exports = {
  "refine-series-022": {
    "spot": "指數 $(-1)^{n+1}$ 讓因子輪流是 $\\frac{n+1}{n}$ 與 $\\frac{n}{n+1}$；相鄰兩個綁成一組是 $\\frac{2k}{2k-1}\\cdot\\frac{2k}{2k+1}$，正是華里斯乘積的形狀。",
    "why": "一個一個看，因子在 $2$ 和 $\\frac23$ 之間跳來跳去看不出極限；兩兩配對後變成熟悉的 $\\prod\\frac{4k^2}{4k^2-1}$，而它由正弦的乘積公式直接給出。",
    "steps": [
      [
        "$n=2k-1$（奇數）給 $\\frac{2k}{2k-1}$，$n=2k$（偶數）給 $\\left(\\frac{2k+1}{2k}\\right)^{-1}=\\frac{2k}{2k+1}$；一組的乘積是 $\\frac{4k^2}{4k^2-1}$。",
        "SUB((1+1/n)^((-1)^(n+1)), 3, n) == 4/3 ;; SUB((1+1/n)^((-1)^(n+1)), 4, n) == 4/5 ;; (2k/(2k-1))*(2k/(2k+1)) == 4k^2/(4k^2-1)"
      ],
      [
        "正弦的乘積公式 $\\frac{\\sin x}{x}=\\prod_{k\\ge1}\\left(1-\\frac{x^2}{k^2\\pi^2}\\right)$ 代 $x=\\frac{\\pi}{2}$：$\\frac{2}{\\pi}=\\prod_{k\\ge1}\\left(1-\\frac{1}{4k^2}\\right)=\\prod_{k\\ge1}\\frac{4k^2-1}{4k^2}$。",
        "SUM(ln(1-1/(4k^2)), 1, k) == ln(2/pi)"
      ],
      [
        "取倒數：前 $2N$ 個因子 $\\prod_{k=1}^{N}\\frac{4k^2}{4k^2-1}\\to\\frac{\\pi}{2}$。",
        "exp(-SUM(ln(1-1/(4k^2)), 1, k)) == pi/2"
      ],
      [
        "奇數個因子時多乘一個 $\\frac{2N+2}{2N+1}\\to1$，極限不變。乘積 $=\\frac{\\pi}{2}$。",
        "LIM((2n+2)/(2n+1), inf) == 1 ;; exp(-SUM(ln(1-1/(4n^2)), 1)) == ANS"
      ]
    ],
    "trap": "以為指數正負交替、因子會兩兩抵消成 $1$；其實第一組就是 $2\\cdot\\frac23=\\frac43\\ne1$，每一組都比 $1$ 大一點。",
    "check": [
      "前四個因子 $2\\cdot\\frac23\\cdot\\frac43\\cdot\\frac45=\\frac{64}{45}\\approx1.42$，偶數個因子的部分乘積從下面慢慢爬向 $\\frac{\\pi}{2}\\approx1.571$。",
      "2*(2/3)*(4/3)*(4/5) < ANS ;; 2*(2/3)*(4/3)*(4/5) > 1.4"
    ]
  },
  "refine-series-026": {
    "spot": "被加項只透過 $m+n$ 出現：把 $m+n=k$ 的項收在一起，雙重和變成單一和，每個 $k\\ge2$ 剛好有 $k-1$ 組 $(m,n)$。",
    "why": "正項級數可以任意分組；照對角線 $m+n=k$ 分組，比先對 $n$ 求和（留下一條不好處理的尾巴）乾淨得多。",
    "steps": [
      [
        "照 $k=m+n$ 分組：$k=2$ 只有 $(1,1)$，$k=3$ 有 $(1,2),(2,1)$……所以和 $=\\sum_{k\\ge2}\\frac{k-1}{k\\,2^k}$。",
        "SUB((k-1)/(k*2^k), 2, k) == 1/8 ;; SUB((k-1)/(k*2^k), 3, k) == 2*(1/(3*8))"
      ],
      [
        "拆開：$\\frac{k-1}{k\\,2^k}=\\frac{1}{2^k}-\\frac{1}{k\\,2^k}$。",
        "(k-1)/(k*2^k) == 1/2^k-1/(k*2^k)"
      ],
      [
        "等比：$\\sum_{k\\ge2}\\frac{1}{2^k}=\\frac12$。",
        "SUM(1/2^k, 2, k) == 1/2"
      ],
      [
        "$\\sum_{k\\ge1}\\frac{x^k}{k}=-\\ln(1-x)$ 在 $x=\\frac12$ 是 $\\ln 2$，扣掉 $k=1$ 的 $\\frac12$：$\\sum_{k\\ge2}\\frac{1}{k\\,2^k}=\\ln2-\\frac12$。",
        "SUM(1/(k*2^k), 1, k) == ln(2) ;; SUM(1/(k*2^k), 2, k) == ln(2)-1/2"
      ],
      [
        "和 $=\\frac12-\\left(\\ln2-\\frac12\\right)=1-\\ln 2$。",
        "1/2-(ln(2)-1/2) == ANS ;; SUM((k-1)/(k*2^k), 2, k) == ANS"
      ]
    ],
    "trap": "每個 $k$ 數成 $k$ 組（把 $m=0$ 或 $n=0$ 也算進去），和變成 $\\sum_{k\\ge2}\\frac{1}{2^k}=\\frac12$。",
    "check": [
      "前兩項 $\\frac18+\\frac1{12}\\approx0.208$，後面每項大約減半，總和 $1-\\ln2\\approx0.307$ 合理。",
      "ANS > 1/8+1/12 ;; ANS < 1/8+1/12+1/8"
    ]
  },
  "refine-series-030": {
    "spot": "對 $n$ 是公比 $-\\frac1k$ 的等比級數，每一個 $k$ 都有封閉式；但題目先對 $k$ 求和，要交換次序得先確認絕對收斂。",
    "why": "照原順序先對 $k$ 求和會得到 $\\zeta(n)-1$ 的交錯和，不好算；交換後每個 $k$ 是等比級數，再望遠鏡就結束。",
    "steps": [
      [
        "絕對值的雙重和：$\\sum_{k\\ge2}\\sum_{n\\ge2}k^{-n}=\\sum_{k\\ge2}\\frac{1}{k(k-1)}=1<\\infty$，所以可以交換求和次序。",
        "SUM(1/k^n, 2) == 1/(k*(k-1)) ;; SUM(1/(k*(k-1)), 2, k) == 1"
      ],
      [
        "固定 $k$：$\\sum_{n\\ge2}\\left(-\\frac1k\\right)^n=\\frac{1/k^2}{1+1/k}=\\frac{1}{k(k+1)}$。",
        "SUM((-1)^n/k^n, 2) == 1/(k*(k+1))"
      ],
      [
        "望遠鏡：$\\frac{1}{k(k+1)}=\\frac1k-\\frac1{k+1}$，從 $k=2$ 加起來是 $\\frac12$。",
        "1/(k*(k+1)) == 1/k-1/(k+1) ;; SUM(1/(k*(k+1)), 2, k) == ANS"
      ]
    ],
    "trap": "公比寫成 $\\frac1k$ 忘了負號，每行得 $\\frac{1}{k(k-1)}$，答成 $1$（那是絕對值級數的和）。",
    "check": [
      "按 $n$ 一行一行看：$n=2$ 那行 $\\frac{\\pi^2}{6}-1\\approx0.645$，$n=3$ 那行減掉約 $0.202$，交錯下去落在 $0.443$ 與 $0.645$ 之間，$\\frac12$ 合理。",
      "SUM(1/k^2, 2, k)-SUM(1/k^3, 2, k) < ANS ;; SUM(1/k^2, 2, k) > ANS"
    ]
  },
  "refine-series-040": {
    "spot": "線性遞迴 $a_{n+1}=2a_n+n$ 加上「代 $\\frac13$ 的冪級數」——典型的生成函數題；$\\frac13<\\frac12$ 剛好落在收斂範圍內。",
    "why": "生成函數把遞迴一次變成代數方程，不必先猜通項；猜出 $a_n=2^n-n-1$ 再拆三個級數也行，正好拿來驗算。",
    "steps": [
      [
        "令 $A(x)=\\sum_{n\\ge0}a_nx^n$。遞迴乘 $x^{n+1}$ 加總：$A(x)-a_0=2xA(x)+\\sum_{n\\ge0}nx^{n+1}=2xA(x)+\\frac{x^2}{(1-x)^2}$。",
        "SUM(n/3^(n+1), 0) == (1/3)^2/(1-1/3)^2"
      ],
      [
        "$a_0=0$，解出 $A(x)=\\frac{x^2}{(1-x)^2(1-2x)}$，$|x|<\\frac12$ 收斂；展開前幾項 $a_2=1$、$a_3=4$ 對得上遞迴。",
        "LIM((x^2/((1-x)^2*(1-2x))-x^2)/x^3, 0) == 4"
      ],
      [
        "代 $x=\\frac13$：$\\frac{1/9}{(4/9)(1/3)}=\\frac34$。",
        "SUB(x^2/((1-x)^2*(1-2x)), 1/3) == ANS"
      ],
      [
        "對照通項 $a_n=2^n-n-1$（滿足遞迴）：$\\sum\\frac{2^n-n-1}{3^n}=3-\\frac34-\\frac32=\\frac34$。",
        "2^(n+1)-(n+1)-1 == 2*(2^n-n-1)+n ;; SUM((2^n-n-1)/3^n, 0) == ANS"
      ]
    ],
    "trap": "把 $\\sum nx^{n+1}$ 寫成 $\\frac{x}{(1-x)^2}$（少乘一個 $x$），得 $A(x)=\\frac{x}{(1-x)^2(1-2x)}$，代進去變成 $\\frac94$。",
    "check": [
      "前幾項 $\\frac19+\\frac4{27}+\\frac{11}{81}\\approx0.395$，後面每項大約是 $\\left(\\frac23\\right)^n$ 量級，慢慢補到 $0.75$。",
      "1/9+4/27+11/81 < ANS"
    ]
  },
  "refine-series-045": {
    "spot": "$\\sum_{k\\le n}\\frac1{k^2}-\\frac{\\pi^2}{6}$ 就是負的尾巴 $-\\sum_{k>n}\\frac1{k^2}$，而 $\\frac1n-\\frac1{2n^2}$ 正好是尾巴展開的前兩項——題目在問第三項的係數。",
    "why": "尾巴用歐拉–麥克勞林展開（積分加端點修正加 $B_2$ 修正），一次給到 $\\frac1{n^3}$ 階；乘 $n^3$ 只留下那個係數。",
    "steps": [
      [
        "括號 $=\\frac1n-\\frac1{2n^2}-\\sum_{k>n}\\frac1{k^2}$；尾巴夾在 $\\frac1{n+1}$ 與 $\\frac1n$ 之間，主項是 $\\frac1n$。",
        "SUM(1/k^2, n+1, k) < 1/n ;; SUM(1/k^2, n+1, k) > 1/(n+1)"
      ],
      [
        "歐拉–麥克勞林（$f(x)=\\frac1{x^2}$）：$\\sum_{k>n}f(k)=\\int_n^\\infty f\\,dx-\\frac{f(n)}{2}-\\frac{B_2}{2!}f'(n)+\\cdots=\\frac1n-\\frac1{2n^2}+\\frac1{6n^3}-\\frac1{30n^5}+\\cdots$。",
        "INT(1/x^2, n, inf) == 1/n ;; SUM(1/k^2, n+1, k) < 1/n-1/(2n^2)+1/(6n^3) ;; SUM(1/k^2, n+1, k) > 1/n-1/(2n^2)+1/(6n^3)-1/(30n^5)"
      ],
      [
        "所以括號 $=-\\frac{1}{6n^3}+O\\!\\left(\\frac1{n^5}\\right)$，乘 $n^3$ 夾在 $-\\frac16$ 與 $-\\frac16+\\frac1{30n^2}$ 之間。",
        "n^3*(1/n-1/(2n^2)-SUM(1/k^2, n+1, k)) > -1/6 ;; n^3*(1/n-1/(2n^2)-SUM(1/k^2, n+1, k)) < -1/6+1/(30n^2)"
      ],
      [
        "極限 $-\\frac16$。",
        "LIM(n^3*(-1/(6n^3)+1/(30n^5)), inf) == ANS"
      ]
    ],
    "trap": "端點修正的符號弄反（尾巴寫成 $\\frac1n+\\frac1{2n^2}+\\cdots$），括號剩下 $\\frac1{n^2}$ 量級，乘 $n^3$ 以為發散。",
    "check": [
      "$n=3$ 直接算：$1+\\frac14+\\frac19-\\frac{\\pi^2}{6}+\\frac13-\\frac1{18}\\approx-0.00605$，乘 $27$ 得 $-0.163$，已經靠近 $-\\frac16$。",
      "27*(1+1/4+1/9-pi^2/6+1/3-1/18) > ANS ;; 27*(1+1/4+1/9-pi^2/6+1/3-1/18) < -0.16"
    ]
  },
  "refine-series-050": {
    "spot": "$c_k=\\binom{2k}{k}\\frac1{4^k}$ 滿足 $c_k=c_{k-1}\\cdot\\frac{2k-1}{2k}$，部分和有封閉式 $\\sum_{k=0}^{n}c_k=(2n+1)c_n$；再配上 $c_n\\sim\\frac1{\\sqrt{\\pi n}}$ 就結束。",
    "why": "逐項用斯特林再拿積分比較也可以，但部分和恰好望遠鏡成 $(2n+1)c_n$，只要一個漸近式，不必處理求和的誤差。",
    "steps": [
      [
        "比值：$\\frac{c_k}{c_{k-1}}=\\frac{(2k)(2k-1)}{k^2\\cdot4}=\\frac{2k-1}{2k}$。",
        "(2k)*(2k-1)/(k^2*4) == (2k-1)/(2k)"
      ],
      [
        "望遠鏡：$(2k+1)c_k-(2k-1)c_{k-1}=c_{k-1}\\left[\\frac{(2k+1)(2k-1)}{2k}-(2k-1)\\right]=c_{k-1}\\cdot\\frac{2k-1}{2k}=c_k$，所以 $\\sum_{k=0}^{n}c_k=(2n+1)c_n$（$n=2$：$1+\\frac12+\\frac38=5\\cdot\\frac38$）。",
        "(2k+1)*(2k-1)/(2k)-(2k-1) == (2k-1)/(2k) ;; 1+1/2+3/8 == 5*(3/8)"
      ],
      [
        "華里斯：$c_n=\\frac2\\pi\\int_0^{\\pi/2}\\sin^{2n}t\\,dt$，且 $\\sqrt{\\pi n}\\,c_n\\to1$（夾在 $1-\\frac1{8n}$ 與 $1$ 之間）。",
        "SUB((2/pi)*INT(sin(t)^(2n), 0, pi/2, t), 3, n) == 5/16 ;; sqrt(pi*n)*(2/pi)*INT(sin(t)^(2n), 0, pi/2, t) < 1 ;; sqrt(pi*n)*(2/pi)*INT(sin(t)^(2n), 0, pi/2, t) > 1-1/(8n)"
      ],
      [
        "$\\frac{(2n+1)c_n}{\\sqrt n}\\sim\\frac{2n+1}{\\sqrt n\\cdot\\sqrt{\\pi n}}\\to\\frac{2}{\\sqrt\\pi}$。",
        "LIM((2n+1)/(sqrt(n)*sqrt(pi*n)), inf) == ANS"
      ]
    ],
    "trap": "看到 $c_k\\sim\\frac1{\\sqrt{\\pi k}}$ 就把 $\\sum_{k\\le n}\\frac1{\\sqrt k}$ 當成 $\\sqrt n$，答 $\\frac{1}{\\sqrt\\pi}$；其實 $\\int_0^n\\frac{dx}{\\sqrt x}=2\\sqrt n$。",
    "check": [
      "$n=2$：部分和 $\\frac{15}{8}$ 除以 $\\sqrt2$ 約 $1.33$，比極限 $\\frac2{\\sqrt\\pi}\\approx1.128$ 大，而 $(2n+1)$ 比 $2n$ 多出的 $1$ 正是小 $n$ 時偏大的原因。",
      "15/8/sqrt(2) > ANS"
    ]
  },
  "refine-series-056": {
    "spot": "$H_n$ 是 $\\frac1k$ 的部分和，而「部分和的生成函數 $=$ 原生成函數 $\\div(1-x)$」；$\\frac{(-1)^{n+1}}{2^n}$ 就是代 $x=-\\frac12$ 再變號。",
    "why": "把 $H_n$ 拆成雙重和再交換也可以，但 $\\sum H_nx^n=\\frac{-\\ln(1-x)}{1-x}$ 是柯西乘積一步得到的，直接代值最快。",
    "steps": [
      [
        "$\\sum_{n\\ge1}H_nx^n=\\left(\\sum_{k\\ge1}\\frac{x^k}{k}\\right)\\left(\\sum_{j\\ge0}x^j\\right)=\\frac{-\\ln(1-x)}{1-x}$，$|x|<1$。",
        "SUM((-1/2)^n/n, 1) == -ln(3/2) ;; SUM((-1/2)^n, 0) == 2/3 ;; SUB(-ln(1-x)/(1-x), -1/2) == SUM((-1/2)^n/n, 1)*SUM((-1/2)^n, 0)"
      ],
      [
        "$(-1)^{n+1}=-(-1)^n$，所以所求 $=-\\sum H_n\\left(-\\frac12\\right)^n$。",
        "(-1)^(n+1) == -(-1)^n"
      ],
      [
        "代入：$\\frac{-\\ln(3/2)}{3/2}=-\\frac23\\ln\\frac32$，變號得 $\\frac23\\ln\\frac32$。",
        "-SUB(-ln(1-x)/(1-x), -1/2) == ANS"
      ]
    ],
    "trap": "忘了 $(-1)^{n+1}$ 比 $(-1)^n$ 多一個負號，答 $-\\frac23\\ln\\frac32\\approx-0.270$；第一項 $\\frac12$ 是正的就知道不對。",
    "check": [
      "前三項 $\\frac12-\\frac{3/2}{4}+\\frac{11/6}{8}\\approx0.354$，再減第四項 $\\frac{25/12}{16}\\approx0.130$ 得 $0.224$；交錯和夾在這兩者之間，$0.270$ 合理。",
      "ANS < 1/2-3/8+11/48 ;; ANS > 1/2-3/8+11/48-25/192"
    ]
  },
  "refine-series-061": {
    "spot": "分母 $n^2+1$ 正是 $\\cosh x$ 傅立葉係數裡的 $1+n^2$，符號 $(-1)^n$ 來自 $\\cos(n\\pi)$；題目要的是級數在 $x=0$ 的值。",
    "why": "算出係數、在連續點代值，就從一個已知函數「讀出」級數和；$\\sum\\frac{(-1)^{n+1}}{n^2+1}$ 本身沒有初等的求和工具。",
    "steps": [
      [
        "$\\cosh x$ 是偶函數，只有餘弦項；分部積分兩次：$a_n=\\frac1\\pi\\int_{-\\pi}^{\\pi}\\cosh x\\cos nx\\,dx=\\frac{2(-1)^n\\sinh\\pi}{\\pi(1+n^2)}$。",
        "INT(cosh(x)*cos(n*x), -pi, pi)/pi == 2*(-1)^n*sinh(pi)/(pi*(1+n^2))"
      ],
      [
        "$a_0=\\frac1\\pi\\int_{-\\pi}^{\\pi}\\cosh x\\,dx=\\frac{2\\sinh\\pi}{\\pi}$，常數項 $\\frac{a_0}{2}=\\frac{\\sinh\\pi}{\\pi}$。",
        "INT(cosh(x), -pi, pi)/pi == 2*sinh(pi)/pi"
      ],
      [
        "週期延拓是連續的（$\\cosh(-\\pi)=\\cosh\\pi$），級數在 $x=0$ 收斂到 $\\cosh0=1$：$1=\\frac{\\sinh\\pi}{\\pi}\\left[1+2\\sum_{n\\ge1}\\frac{(-1)^n}{1+n^2}\\right]$。",
        "sinh(pi)/pi*(1+2*SUM((-1)^n/(n^2+1), 1)) == 1"
      ],
      [
        "解出 $\\sum\\frac{(-1)^n}{n^2+1}=\\frac12\\left(\\frac{\\pi}{\\sinh\\pi}-1\\right)$；所求是它的相反數 $\\frac12\\left(1-\\frac{\\pi}{\\sinh\\pi}\\right)$。",
        "SUM((-1)^n/(n^2+1), 1) == (pi/sinh(pi)-1)/2 ;; (1-pi/sinh(pi))/2 == ANS"
      ]
    ],
    "trap": "題目是 $(-1)^{n+1}$、係數裡是 $(-1)^n$，忘了變號就答 $\\frac12\\left(\\frac{\\pi}{\\sinh\\pi}-1\\right)\\approx-0.364$；第一項 $\\frac12$ 為正，和不可能是負的。",
    "check": [
      "交錯級數的和夾在相鄰部分和之間：$\\frac12-\\frac15=0.3$ 與 $\\frac12-\\frac15+\\frac1{10}=0.4$，$0.364$ 落在中間。",
      "ANS > 1/2-1/5 ;; ANS < 1/2-1/5+1/10"
    ]
  },
  "refine-series-066": {
    "spot": "每一項被 $\\frac1{2^n}$ 壓住，一致收斂可以逐項積分；積完的 $\\frac{\\sin(n\\pi/2)}{n}$ 只留奇數項、正負交替，是 $\\arctan$ 的級數。",
    "why": "先把級數加成 $\\frac{2\\cos x-1}{5-4\\cos x}$ 再積分也可以，但那個積分要萬能代換；逐項積分直接落在熟悉的 $\\arctan$ 級數上。",
    "steps": [
      [
        "魏爾斯特拉斯判別：$\\left|\\frac{\\cos nx}{2^n}\\right|\\le\\frac1{2^n}$ 而 $\\sum\\frac1{2^n}$ 收斂，所以一致收斂，可以逐項積分。",
        "SUM(1/2^n, 1) == 1"
      ],
      [
        "$\\int_0^{\\pi/2}\\cos nx\\,dx=\\frac{\\sin(n\\pi/2)}{n}$。",
        "INT(cos(n*x), 0, pi/2) == sin(n*pi/2)/n"
      ],
      [
        "$\\sin\\frac{n\\pi}{2}$：$n$ 偶數是 $0$，$n=2j+1$ 是 $(-1)^j$。和 $=\\sum_{j\\ge0}\\frac{(-1)^j}{(2j+1)\\,2^{2j+1}}=\\frac12-\\frac{1}{3\\cdot8}+\\frac{1}{5\\cdot32}-\\cdots$。",
        "SUM((-1)^n/((2n+1)*2^(2n+1)), 0) == SUM(sin(n*pi/2)/(n*2^n), 1)"
      ],
      [
        "這是 $\\arctan y=\\sum_{j\\ge0}\\frac{(-1)^jy^{2j+1}}{2j+1}$ 在 $y=\\frac12$ 的值：答案 $\\arctan\\frac12$。",
        "SUM((-1)^n/((2n+1)*2^(2n+1)), 0) == ANS"
      ]
    ],
    "trap": "以為每一項都貢獻 $\\frac1n$（把 $\\sin\\frac{n\\pi}{2}$ 全當成 $1$），得 $\\sum\\frac{1}{n2^n}=\\ln2\\approx0.693$。",
    "check": [
      "反過來先求和：$\\sum\\frac{\\cos nx}{2^n}=\\frac{2\\cos x-1}{5-4\\cos x}$，數值積分 $\\int_0^{\\pi/2}$ 也是 $0.4636$。",
      "SUM(cos(n*x)/2^n, 1) == (2cos(x)-1)/(5-4cos(x)) ;; INT((2cos(x)-1)/(5-4cos(x)), 0, pi/2) == ANS"
    ]
  },
  "refine-series-072": {
    "spot": "$\\frac{n}{n+1}=1-\\frac1{n+1}$：拆成「不收斂但切薩羅和已知的 $1-1+1-\\cdots$」減「真的收斂的交錯級數」。",
    "why": "切薩羅和是線性的，而收斂級數的切薩羅和就是它的和；拆開後各算各的，比直接平均部分和省事。",
    "steps": [
      [
        "拆：$(-1)^{n+1}\\frac{n}{n+1}=(-1)^{n+1}-\\frac{(-1)^{n+1}}{n+1}$。",
        "n/(n+1) == 1-1/(n+1)"
      ],
      [
        "$1-1+1-\\cdots$ 的部分和是 $1,0,1,0,\\dots$，前 $2N$ 個的平均恰好 $\\frac12$，切薩羅和 $\\frac12$。",
        "(n*1+n*0)/(2n) == 1/2"
      ],
      [
        "$\\sum_{n\\ge1}\\frac{(-1)^{n+1}}{n+1}=\\frac12-\\frac13+\\frac14-\\cdots=1-\\ln2$，收斂，切薩羅和就是它。",
        "SUM((-1)^(n+1)/(n+1), 1) == 1-ln(2)"
      ],
      [
        "線性：切薩羅和 $=\\frac12-(1-\\ln2)=\\ln2-\\frac12$。",
        "1/2-(1-ln(2)) == ANS"
      ]
    ],
    "trap": "第三步的符號弄反：$\\frac12-\\frac13+\\cdots$ 是 $1-\\ln2$（正的），寫成 $\\ln2-1$ 就會答 $\\frac32-\\ln2\\approx0.807$。",
    "check": [
      "部分和 $\\frac12,-\\frac16,\\frac7{12},\\dots$：奇數項往 $\\ln2$、偶數項往 $\\ln2-1$ 擺，兩者平均正是 $\\ln2-\\frac12\\approx0.193$。",
      "((ln(2)-1)+ln(2))/2 == ANS"
    ]
  },
  "refine-series-076": {
    "spot": "項 $n\\cos\\frac{2n\\pi}{3}$ 不趨於 $0$，級數發散；題目指定阿貝爾和：先求 $|x|<1$ 時的和函數，再讓 $x\\to1^-$。$nx^n$ 提示用 $\\sum nz^n=\\frac{z}{(1-z)^2}$。",
    "why": "把 $\\cos n\\theta$ 寫成 $\\mathrm{Re}\\,e^{in\\theta}$，和函數一次就有封閉式；拿部分和去平均，線性成長的部分和會讓切薩羅平均也不收斂。",
    "steps": [
      [
        "$z=xe^{i\\theta}$，$\\sum nz^n=\\frac{z}{(1-z)^2}$ 取實部：$\\sum_{n\\ge1}n\\cos(n\\theta)x^n=\\frac{x\\left[(1+x^2)\\cos\\theta-2x\\right]}{(1-2x\\cos\\theta+x^2)^2}$。",
        "SUM(n*cos(n)/2^n, 1) == SUB(x*((1+x^2)*cos(1)-2x)/(1-2x*cos(1)+x^2)^2, 1/2)"
      ],
      [
        "$\\theta=\\frac{2\\pi}{3}$，$\\cos\\theta=-\\frac12$：和函數 $=\\frac{x\\left(-\\frac{1+x^2}{2}-2x\\right)}{(1+x+x^2)^2}$。",
        "SUM(n*cos(2*n*pi/3)/2^n, 1) == SUB(x*(-(1+x^2)/2-2x)/(1+x+x^2)^2, 1/2) ;; SUM(n*cos(2*n*pi/3)/3^n, 1) == SUB(x*(-(1+x^2)/2-2x)/(1+x+x^2)^2, 1/3)"
      ],
      [
        "$x\\to1^-$：分子 $\\to-1-2=-3$，分母 $\\to9$，阿貝爾和 $-\\frac13$。",
        "LIM(x*(-(1+x^2)/2-2x)/(1+x+x^2)^2, 1-) == ANS"
      ]
    ],
    "trap": "順序弄反：先令 $x=1$ 再求和，得到的是發散的 $-\\frac12-1+3-2-\\frac52+6-\\cdots$；阿貝爾和是先在 $|x|<1$ 求和、最後才取極限。",
    "check": [
      "一般公式：$\\sum n\\cos n\\theta$ 的阿貝爾和 $=-\\frac{1}{4\\sin^2(\\theta/2)}$，$\\theta=\\frac{2\\pi}{3}$ 時 $\\sin^2\\frac\\pi3=\\frac34$，得 $-\\frac13$。",
      "-1/(4*sin(pi/3)^2) == ANS"
    ]
  },
  "cl-der-042": {
    "spot": "一族帶參數 $t$ 的直線，問的是包絡線：同時解 $F=0$ 與 $\\frac{\\partial F}{\\partial t}=0$ 消去 $t$。",
    "why": "包絡線上每一點都是相鄰兩條線交點的極限，條件正是 $\\partial_tF=0$；憑印象猜「是個圓弧」沒有根據，而且是錯的。",
    "steps": [
      [
        "$F=\\frac{x}{\\cos t}+\\frac{y}{\\sin t}-1$，$\\partial_tF=\\frac{x\\sin t}{\\cos^2t}-\\frac{y\\cos t}{\\sin^2t}=0$，即 $\\frac{x}{\\cos^3t}=\\frac{y}{\\sin^3t}$。",
        "D(x/cos(t)+y/sin(t), , t) == x*sin(t)/cos(t)^2-y*cos(t)/sin(t)^2"
      ],
      [
        "設共同值為 $\\lambda$ 代回 $F=0$：$\\lambda(\\cos^2t+\\sin^2t)=1$，所以 $x=\\cos^3t$、$y=\\sin^3t$（星形線 $x^{2/3}+y^{2/3}=1$）。",
        "cos(t)^3/cos(t)+sin(t)^3/sin(t) == 1 ;; SUB(D(cos(u)^3/cos(t)+sin(u)^3/sin(t), , t), u, t) == 0"
      ],
      [
        "$x=\\frac18$：$\\cos^3t=\\frac18$，$\\cos t=\\frac12$，$t=\\frac\\pi3$。",
        "SUB(cos(t)^3, pi/3, t) == 1/8"
      ],
      [
        "$y=\\sin^3\\frac\\pi3=\\left(\\frac{\\sqrt3}{2}\\right)^3=\\frac{3\\sqrt3}{8}$。",
        "SUB(sin(t)^3, pi/3, t) == ANS"
      ]
    ],
    "trap": "用 $x^{2/3}+y^{2/3}=1$ 時開錯次方：$y^{2/3}=\\frac34$ 寫成 $y=\\left(\\frac34\\right)^{2/3}\\approx0.825$；正確是 $\\left(\\frac34\\right)^{3/2}$。",
    "check": [
      "$\\left(\\frac18\\right)^{2/3}+\\left(\\frac{3\\sqrt3}{8}\\right)^{2/3}=\\frac14+\\frac34=1$，點在星形線上。",
      "(1/8)^(2/3)+ANS^(2/3) == 1"
    ]
  },
  "cl-der-046": {
    "spot": "交線是球面與平面兩個曲面的交集，切線方向同時垂直兩個法向量，所以就是 $\\nabla F\\times\\nabla G$。",
    "why": "不必把交線（一個斜放的圓）參數化；兩個梯度叉積一次就有切向量。",
    "steps": [
      [
        "先確認點在兩個曲面上：$1+4+1=6$、$1-2+1=0$。",
        "1+4+1 == 6 ;; 1-2+1 == 0"
      ],
      [
        "$\\nabla F=(2x,2y,2z)=(2,-4,2)$，$\\nabla G=(1,1,1)$。",
        "D(y^2, -2, y) == -4 ;; D(x^2, 1) == 2"
      ],
      [
        "叉積 $(-4\\cdot1-2\\cdot1,\\ 2\\cdot1-2\\cdot1,\\ 2\\cdot1-(-4)\\cdot1)=(-6,0,6)\\parallel(-1,0,1)$；它跟兩個法向量的內積都是 $0$。",
        "(-4)*1-2*1 == -6 ;; 2*1-2*1 == 0 ;; 2*1-(-4)*1 == 6 ;; -2+0+2 == 0 ;; -1+0+1 == 0"
      ],
      [
        "切線 $(1-s,\\,-2,\\,1+s)$；$x=0$ 時 $s=1$，$z=2$。",
        "1+1 == ANS"
      ]
    ],
    "trap": "只用球面的法向量 $(2,-4,2)$ 當方向，直線 $(1+2s,-2-4s,1+2s)$ 在 $x=0$ 時 $s=-\\frac12$，得 $z=0$——那是法線，不是切線。",
    "check": [
      "交點 $(0,-2,2)$ 也在平面 $x+y+z=0$ 上（切線本來就躺在平面裡）。",
      "0-2+ANS == 0"
    ]
  },
  "refine-derivatives-046": {
    "spot": "$y$ 是 $x=ye^y$ 的反函數，而 $x(y)=ye^y$ 在 $y=0$ 的各階導數一眼就有：$x'=1$、$x''=2$、$x'''=3$。",
    "why": "反函數的三階導數公式只要 $x',x'',x'''$；硬做三次隱函數微分要處理一堆 $y'$ 的乘積，容易漏項。",
    "steps": [
      [
        "$x(y)=ye^y$：$x'=(1+y)e^y$、$x''=(2+y)e^y$、$x'''=(3+y)e^y$，在 $y=0$ 依序是 $1,2,3$。",
        "D(x*exp(x), 0) == 1 ;; D2(x*exp(x), 0) == 2 ;; D((2+x)*exp(x)) == (3+x)*exp(x)"
      ],
      [
        "反函數：$y'=\\frac1{x'}$、$y''=-\\frac{x''}{x'^3}$、$y'''=\\frac{3x''^2-x'x'''}{x'^5}$（拿 $x=e^y$、$y=\\ln x$ 試：公式給 $\\frac{2}{x^3}$，正是 $(\\ln x)'''$）。",
        "D2(1/x) == (3*exp(2*ln(x))-exp(2*ln(x)))/exp(5*ln(x))"
      ],
      [
        "代值：$y'''(0)=\\frac{3\\cdot2^2-1\\cdot3}{1^5}=9$。",
        "(3*2^2-1*3)/1^5 == ANS"
      ]
    ],
    "trap": "把一階的倒數關係直接搬到高階，以為 $y'''=\\frac{1}{x'''}=\\frac13$。",
    "check": [
      "把 $y=x-x^2+\\frac32x^3$（$\\frac{9}{3!}=\\frac32$）代回 $ye^y-x$，誤差從 $x^4$ 才開始（係數 $\\frac83$），三次以下全部對上。",
      "LIM(((x-x^2+3x^3/2)*exp(x-x^2+3x^3/2)-x)/x^4, 0) == 8/3"
    ]
  },
  "refine-derivatives-048": {
    "spot": "$\\prod\\left(1-\\frac{x^2}{n^2}\\right)$ 是 $\\frac{\\sin\\pi x}{\\pi x}$ 的乘積展開；$\\frac{f'}{f}$ 就是 $(\\ln f)'$，取對數後乘積變成和。",
    "why": "認出 $f$ 的封閉式之後對數導數只要一行；逐項的 $\\sum\\frac{-2x}{n^2-x^2}$ 自己加不出封閉式。",
    "steps": [
      [
        "$f(x)=\\frac{\\sin\\pi x}{\\pi x}$（在 $x=\\frac13$ 驗：$\\sum\\ln\\left(1-\\frac{1}{9n^2}\\right)=\\ln\\frac{\\sin(\\pi/3)}{\\pi/3}$）。",
        "SUM(ln(1-1/(9n^2)), 1) == ln(sin(pi/3)/(pi/3))"
      ],
      [
        "$\\frac{f'}{f}=(\\ln\\sin\\pi x-\\ln\\pi x)'=\\pi\\cot\\pi x-\\frac1x$，也等於逐項的 $\\sum\\frac{-2x}{n^2-x^2}$。",
        "D(ln(sin(pi*x)/(pi*x)), 1/3) == SUB(pi*cos(pi*x)/sin(pi*x)-1/x, 1/3) ;; SUM(-2x/(n^2-x^2), 1) == pi*cos(pi*x)/sin(pi*x)-1/x"
      ],
      [
        "$x=\\frac13$：$\\pi\\cot\\frac\\pi3-3=\\frac{\\pi}{\\sqrt3}-3$。",
        "SUB(pi*cos(pi*x)/sin(pi*x)-1/x, 1/3) == ANS"
      ]
    ],
    "trap": "只對 $\\sin\\pi x$ 取對數導數，忘了分母 $\\pi x$ 貢獻的 $-\\frac1x$，答 $\\frac{\\pi}{\\sqrt3}\\approx1.814$。",
    "check": [
      "逐項看 $\\frac{-2x}{n^2-x^2}$ 每項都是負的，答案 $\\approx-1.186$ 也是負的；第一項 $\\frac{-2/3}{8/9}=-0.75$ 已占一大半。",
      "ANS < -3/4 ;; ANS > -2"
    ]
  },
  "refine-derivatives-049": {
    "spot": "$h=f(x^2)$ 是合成函數要四階導數；連鎖律每微一次，內層 $x^2$ 的二階導數 $2$ 都會多帶出項，先導出一般式 $h''''=12f''+48x^2f'''+16x^4f''''$ 再代值。",
    "why": "一般式只要微四次、每次整理一次，最後代數字不會漏項；令 $x=1+t$ 比 $t^4$ 係數是另一條路，正好拿來驗算。",
    "steps": [
      [
        "$h'=2xf'(x^2)$，$h''=2f'+4x^2f''$（拿 $f=e^s$ 試：$\\left(e^{x^2}\\right)''=e^{x^2}(2+4x^2)$）。",
        "D(exp(x^2)) == 2x*exp(x^2) ;; D2(exp(x^2)) == exp(x^2)*(2+4x^2)"
      ],
      [
        "再微兩次：$h'''=12xf''+8x^3f'''$，$h''''=12f''+48x^2f'''+16x^4f''''$（用 $f=e^s$ 和 $f=s^4$ 各試一次）。",
        "D2(exp(x^2)*(2+4x^2)) == exp(x^2)*(12+48x^2+16x^4) ;; D2(56x^6) == 12*12*x^4+48*x^2*24*x^2+16*x^4*24"
      ],
      [
        "$x=1$：$12\\cdot(-1)+48\\cdot3+16\\cdot1=148$。",
        "12*(-1)+48*3+16*1 == ANS"
      ]
    ],
    "trap": "把 $h''''$ 當成 $(2x)^4f''''=16f''''$，只得 $16$——漏了內層二階導數帶出來的 $12f''$ 與 $48x^2f'''$。",
    "check": [
      "展開法：$x=1+t$，$s=2t+t^2$，$f(1+s)$ 的 $t^4$ 係數 $-\\frac12+6+\\frac23=\\frac{37}{6}$，乘 $4!$ 也是 $148$。",
      "24*(-1/2+6+2/3) == ANS"
    ]
  },
  "refine-derivatives-050": {
    "spot": "$\\ln(1+x^2)$ 微一次就變有理函數 $\\frac{2x}{1+x^2}$，剩下三次是有理函數的微分，可以一路求出封閉式再代 $x=1$。",
    "why": "也可拆成 $\\ln(x+i)+\\ln(x-i)$ 用 $(x\\pm i)^{-4}$，但要小心複數次方；有理函數一步步微最不容易出錯。",
    "steps": [
      [
        "$\\frac{d}{dx}\\ln(1+x^2)=\\frac{2x}{1+x^2}$。",
        "D(ln(1+x^2)) == 2x/(1+x^2)"
      ],
      [
        "商法則：$\\left(\\frac{2x}{1+x^2}\\right)'=\\frac{2(1-x^2)}{(1+x^2)^2}$。",
        "D(2x/(1+x^2)) == 2*(1-x^2)/(1+x^2)^2"
      ],
      [
        "再微兩次：$\\frac{d^2}{dx^2}\\frac{2(1-x^2)}{(1+x^2)^2}=\\frac{-12(x^4-6x^2+1)}{(1+x^2)^4}$。",
        "D2(2*(1-x^2)/(1+x^2)^2) == -12*(x^4-6x^2+1)/(1+x^2)^4"
      ],
      [
        "$x=1$：$\\frac{-12(1-6+1)}{16}=3$。",
        "SUB(-12*(x^4-6x^2+1)/(1+x^2)^4, 1) == ANS"
      ]
    ],
    "trap": "走複數那條路時把 $(1+i)^4$ 算成 $4$：$(1+i)^2=2i$、$(2i)^2=-4$，符號錯就答成 $-3$。",
    "check": [
      "複數拆法：$\\frac{d^4}{dx^4}\\ln(x\\pm i)=-\\frac{6}{(x\\pm i)^4}$，$(1\\pm i)^4=-4$，兩項各 $\\frac64$，合計 $3$。",
      "6/4+6/4 == ANS"
    ]
  },
  "refine-derivatives-051": {
    "spot": "$\\arctan x$ 微一次就是 $\\frac{1}{1+x^2}$，五階導數 $=$ $\\frac{1}{1+x^2}$ 的四階導數，用兩次二階導數做完。",
    "why": "有理函數的導數有封閉式，每一步都能檢查；複數拆法 $\\frac{1}{1+x^2}=\\mathrm{Im}\\frac{1}{x-i}$ 更快，留著驗算。",
    "steps": [
      [
        "$(\\arctan x)'=\\frac{1}{1+x^2}$。",
        "D(atan(x)) == 1/(1+x^2)"
      ],
      [
        "$\\left(\\frac{1}{1+x^2}\\right)''=\\frac{6x^2-2}{(1+x^2)^3}$。",
        "D2(1/(1+x^2)) == (6x^2-2)/(1+x^2)^3"
      ],
      [
        "再微兩次：$\\left(\\frac{6x^2-2}{(1+x^2)^3}\\right)''=\\frac{24(5x^4-10x^2+1)}{(1+x^2)^5}$。",
        "D2((6x^2-2)/(1+x^2)^3) == 24*(5x^4-10x^2+1)/(1+x^2)^5"
      ],
      [
        "$x=1$：$\\frac{24(5-10+1)}{32}=-3$。",
        "SUB(24*(5x^4-10x^2+1)/(1+x^2)^5, 1) == ANS"
      ]
    ],
    "trap": "以為 $\\arctan$ 遞增、導數都是正的而答 $3$；高階導數會變號，$5-10+1=-4$。",
    "check": [
      "複數法：$\\frac{1}{1+x^2}=\\mathrm{Im}\\frac{1}{x-i}$，四階導數是 $24\\,\\mathrm{Im}(x-i)^{-5}$；$(1-i)^5=-4+4i$，$\\mathrm{Im}\\frac{1}{-4+4i}=-\\frac18$，乘 $24$ 得 $-3$。",
      "24*(-1/8) == ANS"
    ]
  },
  "refine-derivatives-052": {
    "spot": "$y=e^{\\arcsin x}$ 滿足 $\\sqrt{1-x^2}\\,y'=y$；再微一次得到係數是多項式的二階方程，在 $x=0$ 微 $n$ 次只剩兩項，變成導數的遞迴。",
    "why": "直接微七次不可能；方程用萊布尼茲公式微 $n$ 次後代 $x=0$，所有帶 $x$ 的項都消失，奇數階一路乘上去。",
    "steps": [
      [
        "$y'=\\frac{y}{\\sqrt{1-x^2}}$，在 $x=0$ 得 $y'(0)=1$。",
        "D(exp(asin(x)), 0.5) == exp(asin(0.5))/sqrt(1-0.25) ;; D(exp(asin(x)), 0) == 1"
      ],
      [
        "$\\sqrt{1-x^2}\\,y'=y$ 再微一次乘 $\\sqrt{1-x^2}$：$(1-x^2)y''-xy'-y=0$。",
        "(1-0.25)*D2(exp(asin(x)), 0.5)-0.5*D(exp(asin(x)), 0.5) == exp(asin(0.5))"
      ],
      [
        "萊布尼茲微 $n$ 次：$(1-x^2)y^{(n+2)}-(2n+1)xy^{(n+1)}-(n^2+1)y^{(n)}=0$；$x=0$ 得 $y^{(n+2)}(0)=(n^2+1)\\,y^{(n)}(0)$。$n=1$：$y'''(0)=2$。",
        "D2(exp(asin(x))/sqrt(1-x^2), 0) == 2"
      ],
      [
        "$y^{(5)}(0)=10\\cdot2=20$，$y^{(7)}(0)=26\\cdot20=520$。",
        "26*10*2*1 == ANS"
      ]
    ],
    "trap": "遞迴係數寫成 $n^2$（漏了 $-y$ 那項帶來的 $+1$），得 $y'''=1$、$y^{(5)}=9$、$y^{(7)}=225$。",
    "check": [
      "偶數階從 $y(0)=1$ 出發：$y''(0)=(0+1)\\cdot1=1$，跟直接數值微分一致。",
      "D2(exp(asin(x)), 0) == 1"
    ]
  },
  "refine-derivatives-054": {
    "spot": "高斯乘餘弦的積分有封閉式 $I(a)=\\frac{\\sqrt\\pi}{2}e^{-a^2/4}$；有了它，$I''(2)$ 只是普通的二階導數。",
    "why": "在積分號下微兩次會得到 $-\\int x^2e^{-x^2}\\cos ax\\,dx$，還得再算；先用「微一次＋分部積分」得到 $I'=-\\frac a2I$ 求出封閉式最快。",
    "steps": [
      [
        "積分號下微分：$I'(a)=-\\int_0^\\infty xe^{-x^2}\\sin ax\\,dx$，對 $xe^{-x^2}$ 分部積分得 $I'(a)=-\\frac a2I(a)$（在 $a=2$ 驗）。",
        "INT(-x*exp(-x^2)*sin(2x), 0, inf) == -INT(exp(-x^2)*cos(2x), 0, inf)"
      ],
      [
        "解 $I'=-\\frac a2I$，$I(0)=\\frac{\\sqrt\\pi}{2}$：$I(a)=\\frac{\\sqrt\\pi}{2}e^{-a^2/4}$。",
        "INT(exp(-x^2), 0, inf) == sqrt(pi)/2 ;; INT(exp(-x^2)*cos(2x), 0, inf) == sqrt(pi)/2*exp(-1)"
      ],
      [
        "微兩次：$I''(a)=\\frac{\\sqrt\\pi}{2}e^{-a^2/4}\\left(\\frac{a^2}{4}-\\frac12\\right)$。",
        "D2(sqrt(pi)/2*exp(-x^2/4)) == sqrt(pi)/2*exp(-x^2/4)*(x^2/4-1/2)"
      ],
      [
        "$a=2$：$\\frac{\\sqrt\\pi}{2}e^{-1}\\cdot\\frac12=\\frac{\\sqrt\\pi}{4e}$。",
        "D2(sqrt(pi)/2*exp(-x^2/4), 2) == ANS"
      ]
    ],
    "trap": "二階導數只微到指數的平方項、漏了乘積法則的 $-\\frac12$，得 $\\frac{\\sqrt\\pi}{2}e^{-1}\\cdot1=\\frac{\\sqrt\\pi}{2e}$。",
    "check": [
      "直接數值算 $I''(2)=-\\int_0^\\infty x^2e^{-x^2}\\cos2x\\,dx$ 也得 $\\approx0.163$。",
      "INT(-x^2*exp(-x^2)*cos(2x), 0, inf) == ANS"
    ]
  },
  "refine-derivatives-055": {
    "spot": "牛頓法對 $\\sin x$ 是 $x_{n+1}=x_n-\\tan x_n$；在 $\\pi$ 附近 $\\tan(\\pi+e)=\\tan e$，誤差遞迴變成 $e_{n+1}=e_n-\\tan e_n$，而 $\\tan e-e$ 從三次項開始。",
    "why": "牛頓法一般是二階收斂（係數 $\\frac{f''}{2f'}$），但這裡 $f''(\\pi)=-\\sin\\pi=0$，二次項消失，要看三次項才有非零極限。",
    "steps": [
      [
        "$x_{n+1}=x_n-\\frac{\\sin x_n}{\\cos x_n}$；令 $x_n=\\pi+e_n$，週期 $\\pi$ 讓 $\\tan(\\pi+e_n)=\\tan e_n$，所以 $e_{n+1}=e_n-\\tan e_n$。",
        "sin(pi+x)/cos(pi+x) == sin(x)/cos(x)"
      ],
      [
        "$\\tan e=e+\\frac{e^3}{3}+O(e^5)$，所以 $e_{n+1}=-\\frac{e_n^3}{3}+O(e_n^5)$。",
        "LIM((sin(x)/cos(x)-x)/x^3, 0) == 1/3"
      ],
      [
        "$\\frac{e_{n+1}}{e_n^3}\\to-\\frac13$。",
        "LIM((x-sin(x)/cos(x))/x^3, 0) == ANS"
      ]
    ],
    "trap": "套二階收斂公式，看到 $\\frac{e_{n+1}}{e_n^2}\\to\\frac{f''(\\pi)}{2f'(\\pi)}=0$ 就以為答案是 $0$；或忘了負號答 $\\frac13$。",
    "check": [
      "數值：$e_0=0.1$ 時 $e_1=0.1-\\tan0.1\\approx-0.000335$，比值 $\\approx-0.335$。",
      "(0.1-sin(0.1)/cos(0.1))/0.001 < -0.33 ;; (0.1-sin(0.1)/cos(0.1))/0.001 > -0.34"
    ]
  },
  "refine-derivatives-056": {
    "spot": "$\\frac{f(x)+f(y)}{1+f(x)f(y)}$ 是 $\\tanh$ 的加法公式；對 $y$ 微分再令 $y=0$，函數方程就變成微分方程 $f'=f'(0)(1-f^2)$。",
    "why": "憑加法公式的形狀猜 $\\tanh$ 很快，但係數要靠 $f'(0)=2$ 才定得下來；化成可分離的微分方程，答案和係數一起出來。",
    "steps": [
      [
        "$x=y=0$：$f(0)=\\frac{2f(0)}{1+f(0)^2}$，$f(0)\\in\\{0,\\pm1\\}$。若 $f(0)=\\pm1$，取 $y=0$ 得 $f(x)=\\frac{f(x)\\pm1}{1\\pm f(x)}=\\pm1$ 是常數，與 $f'(0)=2$ 矛盾；所以 $f(0)=0$。",
        "(x+1)/(1+x) == 1"
      ],
      [
        "對 $y$ 微分令 $y=0$（用 $f(0)=0$）：$f'(x)=f'(0)\\left(1-f(x)^2\\right)=2\\left(1-f(x)^2\\right)$。",
        "D(tanh(2x)) == 2*(1-tanh(2x)^2)"
      ],
      [
        "解 $f'=2(1-f^2)$、$f(0)=0$：$f=\\tanh2x$，確實滿足原方程。",
        "SUB(tanh(2x), 0) == 0 ;; tanh(2*(x+y)) == (tanh(2x)+tanh(2y))/(1+tanh(2x)*tanh(2y))"
      ],
      [
        "$f(\\ln2)=\\tanh(2\\ln2)=\\frac{4-\\frac14}{4+\\frac14}=\\frac{15}{17}$。",
        "SUB(tanh(2x), ln(2)) == ANS"
      ]
    ],
    "trap": "只認出是 $\\tanh$ 就寫 $f=\\tanh x$，丟了 $f'(0)=2$ 的係數，答 $\\tanh\\ln2=\\frac35$。",
    "check": [
      "用加法公式本身倍角：$f\\left(\\frac{\\ln2}{2}\\right)=\\tanh\\ln2=\\frac35$，$f(\\ln2)=\\frac{2\\cdot\\frac35}{1+\\frac9{25}}=\\frac{15}{17}$，而且 $|f|<1$。",
      "2*(3/5)/(1+9/25) == ANS"
    ]
  },
  "refine-derivatives-060": {
    "spot": "乘積 $xy^2z^3$ 配平方和的限制：取對數後拉格朗日條件給 $x^2:y^2:z^2=1:2:3$，平方和 $9$ 按指數比例分配。",
    "why": "也可以用算幾不等式把 $9=x^2+\\frac{y^2}{2}+\\frac{y^2}{2}+\\frac{z^2}{3}+\\frac{z^2}{3}+\\frac{z^2}{3}$ 拆成六份；拉格朗日直接告訴你每一份該多大。",
    "steps": [
      [
        "最大化 $\\ln x+2\\ln y+3\\ln z$：$\\frac1x=2\\lambda x$、$\\frac2y=2\\lambda y$、$\\frac3z=2\\lambda z$，所以 $x^2:y^2:z^2=1:2:3$。",
        "D(ln(x)+2ln(y)+3ln(z), , y) == 2/y ;; D(ln(x)+2ln(y)+3ln(z), , z) == 3/z"
      ],
      [
        "$9$ 分成六份、每份 $\\frac32$：$x^2=\\frac32$、$y^2=3$、$z^2=\\frac92$。",
        "3/2+3+9/2 == 9"
      ],
      [
        "最大值 $\\sqrt{\\frac32}\\cdot3\\cdot\\left(\\frac92\\right)^{3/2}=\\frac{81\\sqrt3}{4}$。",
        "sqrt(3/2)*3*(9/2)^(3/2) == ANS"
      ]
    ],
    "trap": "把比例套在 $x:y:z$ 上（取 $x:y:z=1:2:3$），得到的點乘積只有約 $28.7$，不是最大值。",
    "check": [
      "換球面上另一點比較：$x^2=1$、$y^2=3$、$z^2=5$ 得 $3\\cdot5^{3/2}\\approx33.5$，比 $\\frac{81\\sqrt3}{4}\\approx35.07$ 小。",
      "1*3*5^(3/2) < ANS"
    ]
  },
  "refine-integrals-020": {
    "spot": "旋轉軸是斜線 $y=x$，而區域的上邊界正好就是軸本身；垂直於軸切片，半徑是拋物線上一點到 $y=x$ 的距離 $\\frac{x-x^2}{\\sqrt2}$。",
    "why": "用沿軸方向的座標 $u=\\frac{x+y}{\\sqrt2}$ 做圓盤法最直接；帕普斯定理（面積乘形心繞行距離）可以獨立驗算。",
    "steps": [
      [
        "拋物線上的點 $(x,x^2)$：到軸距離 $r=\\frac{x-x^2}{\\sqrt2}$，沿軸位置 $u=\\frac{x+x^2}{\\sqrt2}$，$du=\\frac{1+2x}{\\sqrt2}dx$。",
        "D((x+x^2)/sqrt(2)) == (1+2x)/sqrt(2)"
      ],
      [
        "$V=\\int\\pi r^2\\,du=\\frac{\\pi}{2\\sqrt2}\\int_0^1(x-x^2)^2(1+2x)\\,dx$。",
        "INT(pi*((x-x^2)/sqrt(2))^2*(1+2x)/sqrt(2), 0, 1) == pi/(2*sqrt(2))*INT((x-x^2)^2*(1+2x), 0, 1)"
      ],
      [
        "展開 $(x-x^2)^2(1+2x)=x^2-3x^4+2x^5$，積分 $\\frac13-\\frac35+\\frac13=\\frac1{15}$。",
        "(x-x^2)^2*(1+2x) == x^2-3x^4+2x^5 ;; INT((x-x^2)^2*(1+2x), 0, 1) == 1/15"
      ],
      [
        "$V=\\frac{\\pi}{2\\sqrt2}\\cdot\\frac1{15}=\\frac{\\pi}{30\\sqrt2}=\\frac{\\pi\\sqrt2}{60}$。",
        "pi/(2*sqrt(2))/15 == ANS"
      ]
    ],
    "trap": "厚度直接用 $dx$（忘了沿軸方向的伸縮 $\\frac{1+2x}{\\sqrt2}$），得 $\\frac\\pi2\\int_0^1(x-x^2)^2dx=\\frac{\\pi}{60}$。",
    "check": [
      "帕普斯：面積 $\\frac16$、形心 $\\left(\\frac12,\\frac25\\right)$，到軸距離 $\\frac{1/10}{\\sqrt2}$，$V=2\\pi\\cdot\\frac{1}{10\\sqrt2}\\cdot\\frac16$ 一樣。",
      "INT(x-x^2, 0, 1) == 1/6 ;; 6*INT((x^2-x^4)/2, 0, 1) == 2/5 ;; 2*pi*(1/10)/sqrt(2)*(1/6) == ANS"
    ]
  },
  "refine-series-004": {
    "spot": "$\\sin n\\sin2n$ 積化和差成 $\\frac{\\cos n-\\cos3n}{2}$，兩個都是 $\\sum\\frac{\\cos nx}{n}=-\\ln\\left(2\\sin\\frac x2\\right)$ 的特例，$x=1$、$x=3$ 都在 $(0,2\\pi)$ 內。",
    "why": "乘積的級數沒有現成公式；拆成單一頻率後，每個都是 $-\\ln(1-e^{ix})$ 的實部。",
    "steps": [
      [
        "積化和差：$\\sin n\\sin2n=\\frac{\\cos n-\\cos3n}{2}$；兩個 $\\sum\\frac{\\cos kn}{n}$ 由狄利克雷判別各自收斂，可以分開算。",
        "sin(x)*sin(2x) == (cos(x)-cos(3x))/2"
      ],
      [
        "$\\sum\\frac{\\cos nx}{n}=\\mathrm{Re}\\left[-\\ln(1-e^{ix})\\right]=-\\ln\\left|1-e^{ix}\\right|=-\\ln\\left(2\\sin\\frac x2\\right)$，$0<x<2\\pi$。$x=1$：",
        "SUM(cos(n)/n, 1) == -ln(2*sin(1/2))"
      ],
      [
        "$x=3$：$\\sum\\frac{\\cos3n}{n}=-\\ln\\left(2\\sin\\frac32\\right)$。",
        "SUM(cos(3n)/n, 1) == -ln(2*sin(3/2))"
      ],
      [
        "和 $=\\frac12\\left[-\\ln\\left(2\\sin\\frac12\\right)+\\ln\\left(2\\sin\\frac32\\right)\\right]=\\frac12\\ln\\frac{\\sin(3/2)}{\\sin(1/2)}$。",
        "(-ln(2*sin(1/2))+ln(2*sin(3/2)))/2 == ANS"
      ]
    ],
    "trap": "把 $|1-e^{ix}|=2\\sin\\frac x2$ 記成 $2\\sin x$，得 $\\frac12\\ln\\frac{\\sin3}{\\sin1}\\approx-0.89$，連正負都錯。",
    "check": [
      "前兩項 $\\sin1\\sin2+\\frac{\\sin2\\sin4}{2}\\approx0.765-0.344=0.421$，之後正負交雜，和 $\\approx0.366$ 合理。",
      "ANS > 0 ;; ANS < 1/2"
    ]
  },
  "refine-series-005": {
    "spot": "$\\sin^3n$ 用三倍角降次成 $\\frac{3\\sin n-\\sin3n}{4}$，兩個都是 $\\sum\\frac{\\sin nx}{n}=\\frac{\\pi-x}{2}$ 的特例，$x=1$、$x=3$ 都在 $(0,2\\pi)$ 內。",
    "why": "三次方沒有直接的級數公式；降次後每個是鋸齒波的傅立葉級數，代值即可。",
    "steps": [
      [
        "三倍角：$\\sin^3n=\\frac{3\\sin n-\\sin3n}{4}$；兩個 $\\sum\\frac{\\sin kn}{n}$ 由狄利克雷判別各自收斂。",
        "sin(x)^3 == (3*sin(x)-sin(3x))/4"
      ],
      [
        "$0<x<2\\pi$ 時 $\\sum\\frac{\\sin nx}{n}=\\frac{\\pi-x}{2}$：$x=1$ 得 $\\frac{\\pi-1}{2}$，$x=3$ 得 $\\frac{\\pi-3}{2}$。",
        "SUM(sin(n)/n, 1) == (pi-1)/2 ;; SUM(sin(3n)/n, 1) == (pi-3)/2"
      ],
      [
        "和 $=\\frac14\\left[\\frac{3(\\pi-1)}{2}-\\frac{\\pi-3}{2}\\right]=\\frac14\\cdot\\frac{2\\pi}{2}=\\frac\\pi4$。",
        "(3*(pi-1)/2-(pi-3)/2)/4 == ANS"
      ]
    ],
    "trap": "三倍角係數放反成 $\\frac{3\\sin3n-\\sin n}{4}$，得 $\\frac{\\pi-4}{4}\\approx-0.215$。",
    "check": [
      "直接用兩個級數的數值重組：$\\frac34\\sum\\frac{\\sin n}{n}-\\frac14\\sum\\frac{\\sin3n}{n}\\approx0.785$。",
      "3*SUM(sin(n)/n, 1)/4-SUM(sin(3n)/n, 1)/4 == ANS"
    ]
  },
  "refine-series-007": {
    "spot": "分母 $n+1$ 跟 $\\sin n$ 的頻率對不齊；指標平移 $m=n+1$ 後分子變 $\\sin(m-1)$，用和角公式拆回 $\\sum\\frac{\\sin m}{m}$ 與 $\\sum\\frac{\\cos m}{m}$ 兩個已知級數。",
    "why": "平移後分母都是單純的 $m$，兩個傅立葉級數 $\\frac{\\pi-x}{2}$ 與 $-\\ln\\left(2\\sin\\frac x2\\right)$ 都能直接代 $x=1$。",
    "steps": [
      [
        "$m=n+1$：和 $=\\sum_{m\\ge2}\\frac{\\sin(m-1)}{m}$；$m=1$ 那項 $\\sin0=0$，可以補進來從 $m=1$ 開始。",
        "SUM(sin(n)/(n+1), 1) == SUM(sin(n-1)/n, 1)"
      ],
      [
        "和角：$\\sin(m-1)=\\sin m\\cos1-\\cos m\\sin1$，兩個級數都由狄利克雷判別收斂，可以分開。",
        "sin(x-1) == sin(x)*cos(1)-cos(x)*sin(1)"
      ],
      [
        "代入 $\\sum\\frac{\\sin m}{m}=\\frac{\\pi-1}{2}$、$\\sum\\frac{\\cos m}{m}=-\\ln\\left(2\\sin\\frac12\\right)$。",
        "SUM(sin(n)/n, 1) == (pi-1)/2 ;; SUM(cos(n)/n, 1) == -ln(2*sin(1/2))"
      ],
      [
        "和 $=\\cos1\\cdot\\frac{\\pi-1}{2}+\\sin1\\cdot\\ln\\left(2\\sin\\frac12\\right)$。",
        "cos(1)*(pi-1)/2+sin(1)*ln(2*sin(1/2)) == ANS"
      ]
    ],
    "trap": "和角公式寫成 $\\sin m\\cos1+\\cos m\\sin1$（那是 $\\sin(m+1)$），修正項變號，得約 $0.614$。",
    "check": [
      "主要部分 $\\cos1\\cdot\\frac{\\pi-1}{2}\\approx0.579$，修正項很小（$2\\sin\\frac12\\approx0.959$ 接近 $1$），和 $\\approx0.543$。",
      "ANS < cos(1)*(pi-1)/2 ;; ANS > cos(1)*(pi-1)/2-0.05"
    ]
  },
  "refine-series-014": {
    "spot": "重排成「兩正一負」：$K$ 組用掉 $2K$ 個正項、只用 $K$ 個負項，比原級數前 $2K$ 項多出 $K$ 個正項 $\\frac{1}{4j-3}$（$K<j\\le2K$）——多出來的這一段和趨近 $\\frac14\\ln2$。",
    "why": "條件收斂的級數重排會改變和（黎曼重排定理）；把重排後的部分和寫成「原部分和＋多出來的一段」，多出的部分用積分比較就能算出極限。",
    "steps": [
      [
        "正項是 $\\frac{1}{4j-3}$、負項是 $\\frac{1}{4j-1}$。前 $K$ 組 $=L_{2K}+\\sum_{j=K+1}^{2K}\\frac{1}{4j-3}$，其中 $L_{2K}$ 是原級數前 $2K$ 項。",
        "1+1/5-1/3 == (1-1/3)+1/5"
      ],
      [
        "$L_{2K}\\to\\frac\\pi4$。",
        "SUM((-1)^n/(2n+1), 0) == pi/4"
      ],
      [
        "多出來的 $K$ 項夾在 $\\int_{K+1}^{2K+1}\\frac{dx}{4x-3}$ 與 $\\int_K^{2K}\\frac{dx}{4x-3}=\\frac14\\ln\\frac{8K-3}{4K-3}$ 之間，兩者都 $\\to\\frac14\\ln2$。",
        "INT(1/(4x-3), n, 2n) == ln((8n-3)/(4n-3))/4 ;; LIM(ln((8n-3)/(4n-3))/4, inf) == ln(2)/4"
      ],
      [
        "組內的部分和差距 $\\to0$（項趨近 $0$），所以和 $=\\frac\\pi4+\\frac14\\ln2$。",
        "pi/4+ln(2)/4 == ANS"
      ]
    ],
    "trap": "以為重排只是換順序、和仍是 $\\frac\\pi4\\approx0.785$；條件收斂級數不能隨便重排。",
    "check": [
      "一般地，$p$ 個正項配 $q$ 個負項，和 $=\\frac\\pi4+\\frac14\\ln\\frac pq$；$p=2$、$q=1$ 正是這題。",
      "pi/4+ln(2/1)/4 == ANS"
    ]
  },
  "refine-series-023": {
    "spot": "$1+\\frac1{n^3}=\\frac{(n+1)(n^2-n+1)}{n^3}$，而 $n^2-n+1=\\left(n-\\frac12\\right)^2+\\frac34$——這是 $\\cosh\\pi y=\\prod_{n\\ge1}\\left(1+\\frac{y^2}{(n-1/2)^2}\\right)$ 的形狀，$y=\\frac{\\sqrt3}{2}$。",
    "why": "用 $\\Gamma$ 函數的反射公式最正統；拆成「$\\cosh$ 的乘積」乘「一個華里斯型的乘積」，只需要兩個熟悉的乘積公式。",
    "steps": [
      [
        "改寫：$1+\\frac1{n^3}=\\frac{n^2-n+1}{(n-\\frac12)^2}\\cdot\\frac{(n+1)(n-\\frac12)^2}{n^3}$，且 $n^2-n+1=\\left(n-\\frac12\\right)^2+\\frac34$。",
        "1+1/n^3 == (n^2-n+1)/(n-1/2)^2*(n+1)*(n-1/2)^2/n^3 ;; n^2-n+1 == (n-1/2)^2+3/4"
      ],
      [
        "第一塊 $\\prod\\left(1+\\frac{3/4}{(n-\\frac12)^2}\\right)=\\cosh\\frac{\\sqrt3\\pi}{2}$。",
        "SUM(ln(1+3/(4*(n-1/2)^2)), 1) == ln(cosh(sqrt(3)*pi/2))"
      ],
      [
        "第二塊前 $N$ 項：$\\prod\\frac{n+1}{n}=N+1$，$\\prod\\frac{(n-\\frac12)^2}{n^2}=c_N^2$，$c_N=\\prod_{n\\le N}\\frac{2n-1}{2n}\\sim\\frac1{\\sqrt{\\pi N}}$；乘積 $\\frac{N+1}{\\pi N}\\to\\frac1\\pi$。",
        "SUM(ln((n+1)*(n-1/2)^2/n^3), 1) == -ln(pi)"
      ],
      [
        "相乘：$\\prod\\left(1+\\frac1{n^3}\\right)=\\frac{1}{\\pi}\\cosh\\frac{\\sqrt3\\pi}{2}$。",
        "exp(SUM(ln(1+1/n^3), 1)) == ANS"
      ]
    ],
    "trap": "把 $(1+\\frac1n)$ 單獨拿出來相乘得 $N+1\\to\\infty$，就以為整個乘積發散；它要跟 $\\frac{(n-1/2)^2}{n^2}$ 的 $\\frac{1}{\\pi N}$ 配對抵消。",
    "check": [
      "前兩個因子 $2\\cdot\\frac98=2.25$，之後每個因子都略大於 $1$ 且乘積收斂很快，$\\frac{\\cosh(\\sqrt3\\pi/2)}{\\pi}\\approx2.429$ 合理。",
      "ANS > 9/4 ;; ANS < 9/4*exp(SUM(1/n^3, 3))"
    ]
  },
  "refine-series-027": {
    "spot": "固定 $m$ 時，$\\frac{m!\\,n!}{(m+n+2)!}$ 對 $n$ 可以望遠鏡：它等於 $b_n-b_{n+1}$，$b_n=\\frac{m!\\,n!}{(m+1)(m+n+1)!}$。內層和是 $\\frac1{(m+1)^2}$，外層就是 $\\zeta(2)$。",
    "why": "狄利克雷積分把整個雙重和化成 $\\int_0^1\\frac{-\\ln x}{1-x}dx$ 也行，但要處理瑕積分；望遠鏡只用到階乘的代數。",
    "steps": [
      [
        "$b_n-b_{n+1}=\\frac{m!\\,n!}{(m+1)(m+n+2)!}\\big[(m+n+2)-(n+1)\\big]=\\frac{m!\\,n!}{(m+n+2)!}$。",
        "(k+n+2)-(n+1) == k+1"
      ],
      [
        "所以 $\\sum_{n\\ge0}\\frac{m!\\,n!}{(m+n+2)!}=b_0=\\frac{m!}{(m+1)(m+1)!}=\\frac{1}{(m+1)^2}$。$m=0,1,2$ 驗：$1,\\frac14,\\frac19$。",
        "SUM(1/((n+1)*(n+2)), 0) == 1 ;; SUM(1/((n+1)*(n+2)*(n+3)), 0) == 1/4 ;; SUM(2/((n+1)*(n+2)*(n+3)*(n+4)), 0) == 1/9"
      ],
      [
        "外層：$\\sum_{m\\ge0}\\frac{1}{(m+1)^2}=\\frac{\\pi^2}{6}$。",
        "SUM(1/(k+1)^2, 0, k) == ANS"
      ]
    ],
    "trap": "把 $(m+n+2)!$ 當成貝他函數的 $(m+n+1)!$，內層和變成 $\\frac1m$，外層是調和級數，以為發散。",
    "check": [
      "狄利克雷積分版本：和 $=\\int_0^1\\frac{-\\ln x}{1-x}dx$，數值也是 $1.6449$。",
      "INT(-ln(x)/(1-x), 0, 1) == ANS"
    ]
  },
  "refine-series-028": {
    "spot": "分母 $m+n+2$ 把兩個指標綁在一起；寫成 $\\frac1{m+n+2}=\\int_0^1x^{m+n+1}dx$ 就拆開了，$\\sum\\frac{x^m}{m}$ 與 $\\sum\\frac{x^n}{n}$ 各自是 $-\\ln(1-x)$。",
    "why": "積分表示把耦合的分母變成乘積 $x^m\\cdot x^n$，雙重和直接分解成平方；部分分式對兩個指標都拆不乾淨。",
    "steps": [
      [
        "$\\frac{1}{m+n+2}=\\int_0^1x^{m+n+1}\\,dx$。",
        "INT(x^(n+k+1), 0, 1) == 1/(n+k+2)"
      ],
      [
        "正項可以交換：和 $=\\int_0^1x\\left(\\sum\\frac{x^m}{m}\\right)\\left(\\sum\\frac{x^n}{n}\\right)dx=\\int_0^1x\\ln^2(1-x)\\,dx$（$\\sum\\frac{x^n}{n}=-\\ln(1-x)$，在 $x=\\frac12$ 驗）。",
        "SUM(1/(n*2^n), 1) == ln(2)"
      ],
      [
        "$u=1-x$ 得 $\\int_0^1(1-u)\\ln^2u\\,du$；再令 $u=e^{-t}$：$\\int_0^1u^a\\ln^2u\\,du=\\int_0^\\infty t^2e^{-(a+1)t}dt=\\frac{2}{(a+1)^3}$，$a=0$ 得 $2$、$a=1$ 得 $\\frac14$。",
        "INT(t^2*exp(-t), 0, inf) == 2 ;; INT(t^2*exp(-2t), 0, inf) == 1/4"
      ],
      [
        "和 $=2-\\frac14=\\frac74$。",
        "INT(t^2*exp(-t)-t^2*exp(-2t), 0, inf) == ANS"
      ]
    ],
    "trap": "公式記成 $\\frac{2}{(a+1)^2}$，把 $\\int_0^1u\\ln^2u\\,du$ 算成 $\\frac12$，答 $\\frac32$。",
    "check": [
      "$m=n=1$ 一項就是 $\\frac14$，$(1,2)$ 與 $(2,1)$ 各 $\\frac1{10}$；項像 $\\frac{1}{mn(m+n)}$，收斂不快，慢慢累積到 $1.75$。",
      "ANS > 1/4+2/10"
    ]
  },
  "refine-series-031": {
    "spot": "內層 $\\sum_k k^{-2n}=\\zeta(2n)-1$ 直接加很難；交換次序後對 $n$ 是 $\\sum\\frac{y^n}{n}=-\\ln(1-y)$，$y=\\frac{1}{k^2}$。",
    "why": "正項級數可以交換次序；換完之後 $-\\ln\\left(1-\\frac1{k^2}\\right)$ 加總是一個望遠鏡乘積的對數。",
    "steps": [
      [
        "交換次序，固定 $k$：$\\sum_{n\\ge1}\\frac{(1/k^2)^n}{n}=-\\ln\\left(1-\\frac1{k^2}\\right)$。",
        "SUM(k^(-2n)/n, 1) == -ln(1-1/k^2)"
      ],
      [
        "$1-\\frac1{k^2}=\\frac{k-1}{k}\\cdot\\frac{k+1}{k}$，前 $K$ 個因子的乘積望遠鏡成 $\\frac{K+1}{2K}\\to\\frac12$。",
        "1-1/k^2 == (k-1)/k*(k+1)/k ;; LIM((n+1)/(2n), inf) == 1/2 ;; SUM(ln(1-1/k^2), 2, k) == ln(1/2)"
      ],
      [
        "和 $=-\\ln\\frac12=\\ln2$。",
        "SUM(-ln(1-1/k^2), 2, k) == ANS"
      ]
    ],
    "trap": "望遠鏡乘積算成 $\\frac{K+1}{K}\\to1$（漏了 $\\frac{k-1}{k}$ 那串留下的 $\\frac12$），得 $0$。",
    "check": [
      "$n=1$ 那項 $\\zeta(2)-1\\approx0.645$，$n=2$ 加 $\\frac{\\zeta(4)-1}{2}\\approx0.041$，已到 $0.686$，接近 $\\ln2\\approx0.693$。",
      "SUM(1/k^2, 2, k)+SUM(1/k^4, 2, k)/2 < ANS ;; SUM(1/k^2, 2, k)+SUM(1/k^4, 2, k)/2 > 0.68"
    ]
  },
  "refine-series-036": {
    "spot": "$\\binom{2n}{n}$ 的生成函數是 $\\frac{1}{\\sqrt{1-4t}}$；多一個 $\\frac1n$ 等於「除以 $t$ 再從 $0$ 積分」，$\\frac1{8^n}$ 是代 $x=\\frac18$（在收斂半徑 $\\frac14$ 內）。",
    "why": "係數除以 $n$ 對應積分，這是生成函數的標準操作；積分用 $s=\\sqrt{1-4t}$ 代換就化成有理函數。",
    "steps": [
      [
        "$\\sum_{n\\ge0}\\binom{2n}{n}t^n=\\frac{1}{\\sqrt{1-4t}}$（係數 $1,2,6,20,\\dots$）。",
        "LIM((1/sqrt(1-4x)-1-2x-6x^2)/x^3, 0) == 20"
      ],
      [
        "去掉常數項、除以 $t$ 再積分：$\\sum_{n\\ge1}\\binom{2n}{n}\\frac{x^n}{n}=\\int_0^x\\frac{1}{t}\\left(\\frac{1}{\\sqrt{1-4t}}-1\\right)dt$。",
        "INT((1/sqrt(1-4t)-1)/t, 0, 1/8) > 2/8"
      ],
      [
        "$s=\\sqrt{1-4t}$，$t=\\frac{1-s^2}{4}$：被積式化成 $-\\frac{2}{1+s}ds$，積分 $=2\\ln\\frac{2}{1+\\sqrt{1-4x}}$。",
        "D(2*ln(2/(1+sqrt(1-4x))), 0.1) == SUB((1/sqrt(1-4x)-1)/x, 0.1) ;; SUB(2*ln(2/(1+sqrt(1-4x))), 0) == 0"
      ],
      [
        "$x=\\frac18$：$\\sqrt{1/2}=\\frac{1}{\\sqrt2}$，$\\frac{2}{1+1/\\sqrt2}=2\\sqrt2(\\sqrt2-1)=4-2\\sqrt2$。和 $=2\\ln(4-2\\sqrt2)$。",
        "SUB(2*ln(2/(1+sqrt(1-4x))), 1/8) == ANS ;; INT((1/sqrt(1-4t)-1)/t, 0, 1/8) == ANS"
      ]
    ],
    "trap": "忘了 $\\frac1n$ 直接代生成函數，得 $\\frac{1}{\\sqrt{1/2}}-1=\\sqrt2-1\\approx0.414$。",
    "check": [
      "前三項 $\\frac28+\\frac{6}{2\\cdot64}+\\frac{20}{3\\cdot512}\\approx0.310$，後面項很小，和 $\\approx0.3167$ 合理。",
      "ANS > 2/8+6/128+20/1536"
    ]
  },
  "refine-series-041": {
    "spot": "錯排數除以 $n!$——指數型生成函數 $D(x)=\\sum D_n\\frac{x^n}{n!}$；遞迴 $D_{n+1}=n(D_n+D_{n-1})$ 乘 $\\frac{x^n}{n!}$ 加總會變成一階微分方程。",
    "why": "係數裡的 $n$ 在指數型生成函數裡對應乘 $x$ 與微分，遞迴一次變成可分離的方程；硬找 $D_n$ 的通項再求和要繞遠路。",
    "steps": [
      [
        "左邊 $\\sum D_{n+1}\\frac{x^n}{n!}=D'(x)$；右邊 $\\sum nD_n\\frac{x^n}{n!}=xD'$、$\\sum nD_{n-1}\\frac{x^n}{n!}=xD$。得 $(1-x)D'=xD$。",
        "(1-x)*D(exp(-x)/(1-x)) == x*exp(-x)/(1-x)"
      ],
      [
        "分離變數：$\\frac{D'}{D}=\\frac{x}{1-x}=-1+\\frac{1}{1-x}$，$D(0)=1$，所以 $D(x)=\\frac{e^{-x}}{1-x}$，$|x|<1$。",
        "D(ln(exp(-x)/(1-x)), 0.5) == 0.5/(1-0.5)"
      ],
      [
        "係數對得上：$\\frac{D_2}{2!}=\\frac12$、$\\frac{D_3}{3!}=\\frac26=\\frac13$。",
        "LIM((exp(-x)/(1-x)-1)/x^2, 0) == 1/2 ;; LIM((exp(-x)/(1-x)-1-x^2/2)/x^3, 0) == 1/3"
      ],
      [
        "所求 $=D\\left(\\frac12\\right)=\\frac{e^{-1/2}}{1/2}=2e^{-1/2}$。",
        "SUB(exp(-x)/(1-x), 1/2) == ANS"
      ]
    ],
    "trap": "分離變數時把 $\\int\\frac{x}{1-x}dx$ 算成 $-\\ln(1-x)$（漏了 $-x$），得 $D=\\frac{1}{1-x}$、答 $2$——那是全排列 $n!$ 的生成函數。",
    "check": [
      "前四項 $1+\\frac18+\\frac1{24}+\\frac{3}{128}\\approx1.190$；因為 $\\frac{D_n}{n!}\\le\\frac12$，剩下的不超過 $\\frac1{32}$，$1.213$ 合理。",
      "ANS > 1+1/8+1/24+3/128 ;; ANS < 1+1/8+1/24+3/128+1/32"
    ]
  },
  "refine-series-042": {
    "spot": "$t_n$ 除以 $n!$ 求和——指數型生成函數 $T(x)=\\sum t_n\\frac{x^n}{n!}$；遞迴 $t_{n+1}=t_n+nt_{n-1}$ 裡的 $n$ 在指數型裡對應乘 $x$。",
    "why": "遞迴乘 $\\frac{x^n}{n!}$ 加總後是 $T'=(1+x)T$，一行解完；要求的和就是 $T(1)$。",
    "steps": [
      [
        "$\\sum t_{n+1}\\frac{x^n}{n!}=T'$，$\\sum t_n\\frac{x^n}{n!}=T$，$\\sum nt_{n-1}\\frac{x^n}{n!}=x\\sum t_{n-1}\\frac{x^{n-1}}{(n-1)!}=xT$。得 $T'=(1+x)T$。",
        "D(exp(x+x^2/2)) == (1+x)*exp(x+x^2/2)"
      ],
      [
        "$T(0)=1$：$T(x)=e^{x+x^2/2}$，對所有 $x$ 收斂；係數 $t_2=2$、$t_3=4$ 對得上。",
        "D2(exp(x+x^2/2), 0) == 2 ;; LIM((exp(x+x^2/2)-1-x-x^2)/x^3, 0) == 4/6"
      ],
      [
        "所求 $=T(1)=e^{3/2}$。",
        "SUB(exp(x+x^2/2), 1) == ANS"
      ]
    ],
    "trap": "把 $\\sum nt_{n-1}\\frac{x^n}{n!}$ 化成 $xT'$，得 $(1-x)T'=T$、$T=\\frac{1}{1-x}$，在 $x=1$ 爆掉。",
    "check": [
      "前六項 $1+1+1+\\frac46+\\frac{10}{24}+\\frac{26}{120}\\approx4.30$，往 $e^{1.5}\\approx4.48$ 靠近。",
      "ANS > 1+1+1+4/6+10/24+26/120"
    ]
  },
  "refine-series-046": {
    "spot": "括號是 $\\ln n!$ 減掉斯特林公式的主要部分，剩下的正是斯特林級數的下一項 $\\frac{1}{12n}$；乘 $n$ 就是在問那個係數。",
    "why": "歐拉–麥克勞林對 $\\ln x$ 直接給出 $\\ln n!$ 的漸近展開，修正項的係數由 $B_2=\\frac16$ 決定，不必另外估誤差。",
    "steps": [
      [
        "$\\ln n!=\\sum_{k\\le n}\\ln k$；歐拉–麥克勞林的主項 $\\int_1^n\\ln x\\,dx=n\\ln n-n+1$，加端點 $\\frac{\\ln n}{2}$。",
        "INT(ln(x), 1, n) == n*ln(n)-n+1"
      ],
      [
        "常數由斯特林定為 $\\frac12\\ln2\\pi$，下一項 $\\frac{B_2}{2}\\cdot\\frac1n$：$\\ln n!=\\left(n+\\frac12\\right)\\ln n-n+\\frac12\\ln2\\pi+\\frac{1}{12n}-\\frac{1}{360n^3}+\\cdots$（用 $n!=\\int_0^\\infty t^ne^{-t}dt$ 驗夾擠）。",
        "SUB(INT(t^n*exp(-t), 0, inf, t), 4, n) == 24 ;; n*(ln(INT(t^n*exp(-t), 0, inf, t))-(n+1/2)*ln(n)+n-ln(2*pi)/2) < 1/12 ;; n*(ln(INT(t^n*exp(-t), 0, inf, t))-(n+1/2)*ln(n)+n-ln(2*pi)/2) > 1/12-1/(360n^2)"
      ],
      [
        "括號 $=\\frac{1}{12n}+O\\!\\left(\\frac1{n^3}\\right)$，乘 $n$ 得 $\\frac{1}{12}$。",
        "(1/6)/2 == ANS ;; LIM(n*(1/(12n)-1/(360n^3)), inf) == ANS"
      ]
    ],
    "trap": "把修正項記成 $\\frac{1}{12n^2}$（跟調和數的展開搞混），乘 $n$ 以為極限是 $0$。",
    "check": [
      "$n=1$：$0-0+1-\\frac12\\ln2\\pi\\approx0.0811$，已經接近 $\\frac1{12}\\approx0.0833$。",
      "1-ln(2*pi)/2 < ANS ;; 1-ln(2*pi)/2 > 0.08"
    ]
  },
  "refine-series-047": {
    "spot": "括號是 $H_n$ 的漸近展開扣掉前三項 $\\ln n$、$\\gamma$、$\\frac1{2n}$，剩下的首項由 $B_2$ 決定：$-\\frac{1}{12n^2}$。",
    "why": "歐拉–麥克勞林對 $f(x)=\\frac1x$ 一次給出每一階的係數；乘 $n^2$ 只留下 $\\frac1{n^2}$ 的係數。",
    "steps": [
      [
        "$H_n=\\int_0^1\\frac{1-t^n}{1-t}dt$（$n=3$ 驗：$1+\\frac12+\\frac13$）。",
        "SUB(INT((1-t^n)/(1-t), 0, 1, t), 3, n) == 1+1/2+1/3"
      ],
      [
        "歐拉–麥克勞林：修正項 $\\frac{B_2}{2!}f'(n)$，$f'(n)=-\\frac1{n^2}$，所以 $H_n=\\ln n+\\gamma+\\frac{1}{2n}-\\frac{1}{12n^2}+\\frac{1}{120n^4}-\\cdots$（$\\gamma\\approx0.5772156649$）。",
        "D(1/x) == -1/x^2 ;; n^2*(INT((1-t^n)/(1-t), 0, 1, t)-ln(n)-0.5772156649015329-1/(2n)) > -1/12 ;; n^2*(INT((1-t^n)/(1-t), 0, 1, t)-ln(n)-0.5772156649015329-1/(2n)) < -1/12+1/(120n^2)"
      ],
      [
        "括號 $=-\\frac1{12n^2}+O\\!\\left(\\frac1{n^4}\\right)$，乘 $n^2$ 得 $-\\frac1{12}$。",
        "LIM(n^2*(-1/(12n^2)+1/(120n^4)), inf) == ANS"
      ]
    ],
    "trap": "把 $\\frac{1}{2n}$ 的符號記反（以為 $H_n\\approx\\ln n+\\gamma-\\frac1{2n}$），括號剩 $\\frac1n$ 量級，乘 $n^2$ 以為發散。",
    "check": [
      "$n=1$：$1-0-\\gamma-\\frac12\\approx-0.0772$，已經接近 $-\\frac1{12}\\approx-0.0833$。",
      "1-0.5772156649015329-1/2 > ANS ;; 1-0.5772156649015329-1/2 < -0.07"
    ]
  },
  "refine-series-051": {
    "spot": "$\\left(\\frac kn\\right)^n$ 只有 $k$ 靠近 $n$ 的項不小；令 $j=n-k$ 變成 $\\left(1-\\frac jn\\right)^n\\approx e^{-j}$，下一階修正是 $e^{-j}\\cdot\\left(-\\frac{j^2}{2n}\\right)$。",
    "why": "每一項展開到 $\\frac1n$ 階再加總：主項 $\\sum e^{-j}=\\frac{e}{e-1}$ 剛好抵掉題目扣的常數，剩下 $\\frac{1}{2n}\\sum j^2e^{-j}$。",
    "steps": [
      [
        "$j=n-k$：$\\sum_{k=1}^n\\left(\\frac kn\\right)^n=\\sum_{j=0}^{n-1}\\left(1-\\frac jn\\right)^n$。",
        "SUB((x/10)^10, 7) == SUB((1-x/10)^10, 3)"
      ],
      [
        "$n\\ln\\left(1-\\frac jn\\right)=-j-\\frac{j^2}{2n}-O\\!\\left(\\frac{j^3}{n^2}\\right)$，所以 $\\left(1-\\frac jn\\right)^n=e^{-j}\\left(1-\\frac{j^2}{2n}\\right)+O\\!\\left(\\frac{j^4e^{-j}}{n^2}\\right)$（$j=3$：修正係數 $-\\frac92$）。",
        "LIM((exp(ln(1-3x)/x+3)-1)/x, 0+) == -9/2"
      ],
      [
        "主項 $\\sum_{j\\ge0}e^{-j}=\\frac{e}{e-1}$ 抵掉；截掉的 $j\\ge n$ 部分指數小，誤差加總是 $O\\!\\left(\\frac1{n^2}\\right)$。",
        "SUM(exp(-n), 0) == exp(1)/(exp(1)-1)"
      ],
      [
        "$\\sum j^2y^j=\\frac{y(1+y)}{(1-y)^3}$，$y=e^{-1}$：$\\sum j^2e^{-j}=\\frac{e(e+1)}{(e-1)^3}$。",
        "SUM(n^2*exp(-n), 0) == exp(1)*(exp(1)+1)/(exp(1)-1)^3"
      ],
      [
        "括號乘 $n$ 的極限 $=\\frac12\\sum j^2e^{-j}=\\frac{e(e+1)}{2(e-1)^3}$。",
        "SUM(n^2*exp(-n), 0)/2 == ANS"
      ]
    ],
    "trap": "只展開到 $e^{-j}$ 就以為誤差是指數小、極限 $0$；或忘了 $\\frac12$，答 $\\frac{e(e+1)}{(e-1)^3}\\approx1.99$。",
    "check": [
      "$n=20000$ 直接算得 $0.99610$，跟 $\\frac{e(e+1)}{2(e-1)^3}\\approx0.99615$ 只差 $O\\!\\left(\\frac1n\\right)$。",
      "ANS > 0.9961 ;; ANS < 0.9962"
    ]
  },
  "refine-series-052": {
    "spot": "主項 $\\frac{1}{\\sqrt{\\pi n}}$ 已知，要下一階就用帶 $1+\\frac{1}{12m}$ 的斯特林：分子 $(2n)!$ 給 $\\frac1{24n}$，分母 $(n!)^2$ 給兩個 $\\frac1{12n}$。",
    "why": "斯特林的修正項是乘法因子，取比值時直接相加減；比用華里斯積分去估下一階省事得多。",
    "steps": [
      [
        "$m!=\\sqrt{2\\pi m}\\left(\\frac me\\right)^m\\left(1+\\frac1{12m}+O\\!\\left(\\frac{1}{m^2}\\right)\\right)$（$m=10$ 驗：比值略大於 $1+\\frac1{120}$）。",
        "SUB(INT(t^n*exp(-t), 0, inf, t)/(sqrt(2*pi*n)*(n/exp(1))^n), 10, n) > 1+1/120 ;; SUB(INT(t^n*exp(-t), 0, inf, t)/(sqrt(2*pi*n)*(n/exp(1))^n), 10, n) < 1+1/120+1/2000"
      ],
      [
        "$\\binom{2n}{n}\\frac1{4^n}=\\frac{(2n)!}{(n!)^24^n}=\\frac{\\sqrt{4\\pi n}}{2\\pi n}\\cdot\\frac{1+\\frac1{24n}}{\\left(1+\\frac1{12n}\\right)^2}$，前面的因子就是 $\\frac{1}{\\sqrt{\\pi n}}$。",
        "sqrt(4*pi*n)/(2*pi*n) == 1/sqrt(pi*n)"
      ],
      [
        "$\\frac{1+\\frac1{24n}}{(1+\\frac1{12n})^2}=1+\\frac1{24n}-\\frac{2}{12n}+O\\!\\left(\\frac1{n^2}\\right)=1-\\frac1{8n}+\\cdots$；用華里斯積分驗夾擠。",
        "n*(sqrt(pi*n)*(2/pi)*INT(sin(t)^(2n), 0, pi/2, t)-1) > -1/8 ;; n*(sqrt(pi*n)*(2/pi)*INT(sin(t)^(2n), 0, pi/2, t)-1) < -1/8+1/(64n)"
      ],
      [
        "極限 $-\\frac18$。",
        "LIM(n*((1+1/(24n))/(1+1/(12n))^2-1), inf) == ANS"
      ]
    ],
    "trap": "分母 $(n!)^2$ 的修正只算一次 $\\frac{1}{12n}$（忘了平方），得 $\\frac1{24}-\\frac1{12}=-\\frac1{24}$。",
    "check": [
      "$n=4$：$4\\left(\\sqrt{4\\pi}\\cdot\\frac{70}{256}-1\\right)\\approx-0.123$，已經靠近 $-\\frac18$。",
      "4*(sqrt(4*pi)*70/256-1) < -0.12 ;; 4*(sqrt(4*pi)*70/256-1) > ANS"
    ]
  },
  "refine-series-057": {
    "spot": "只取偶數下標 $H_{2n}$，權重 $\\frac1{4^n}=\\left(\\frac12\\right)^{2n}$：用 $\\frac{g(x)+g(-x)}{2}$ 從 $g(x)=\\sum H_mx^m$ 濾出偶數次的項，$x=\\frac12$。",
    "why": "$g(x)=\\frac{-\\ln(1-x)}{1-x}$ 是已知封閉式，奇偶濾波只要代兩個點；直接處理 $H_{2n}$ 要拆成兩串調和數，麻煩得多。",
    "steps": [
      [
        "$g(x)=\\sum_{m\\ge1}H_mx^m=\\frac{-\\ln(1-x)}{1-x}$（柯西乘積 $\\sum\\frac{x^k}{k}\\cdot\\sum x^j$）。",
        "SUB(-ln(1-x)/(1-x), 1/2) == SUM(1/(n*2^n), 1)*SUM(1/2^n, 0)"
      ],
      [
        "$g\\left(\\frac12\\right)=\\frac{\\ln2}{1/2}=2\\ln2$，$g\\left(-\\frac12\\right)=\\frac{-\\ln(3/2)}{3/2}=-\\frac23\\ln\\frac32$。",
        "SUB(-ln(1-x)/(1-x), 1/2) == 2*ln(2) ;; SUB(-ln(1-x)/(1-x), -1/2) == -2*ln(3/2)/3"
      ],
      [
        "偶數次的項 $=\\frac{g(\\frac12)+g(-\\frac12)}{2}=\\ln2-\\frac13\\ln\\frac32$。",
        "(SUB(-ln(1-x)/(1-x), 1/2)+SUB(-ln(1-x)/(1-x), -1/2))/2 == ANS"
      ]
    ],
    "trap": "看到 $\\frac1{4^n}$ 就代 $x=\\frac14$，算成 $g\\left(\\frac14\\right)=\\frac43\\ln\\frac43\\approx0.384$——但下標是 $2n$，對應的是 $x^{2n}$。",
    "check": [
      "前兩項 $\\frac{3/2}{4}+\\frac{25/12}{16}\\approx0.505$，後面項很快變小，和 $\\approx0.558$ 合理。",
      "ANS > 3/8+25/192"
    ]
  },
  "refine-series-058": {
    "spot": "$\\frac{1}{n(n+1)(n+2)}$ 可以裂成兩個相鄰的 $\\frac{1}{n(n+1)}$ 型差；配上 $H_n=\\sum_{k\\le n}\\frac1k$，交換求和次序後內層都是望遠鏡。",
    "why": "$H_n$ 搭配望遠鏡型的權重時，交換次序 $\\sum_n\\sum_{k\\le n}=\\sum_k\\sum_{n\\ge k}$ 讓內層變成 $\\frac1k$ 之類的簡單式子，外層就是熟悉的級數。",
    "steps": [
      [
        "裂項：$\\frac{1}{n(n+1)(n+2)}=\\frac12\\left[\\frac{1}{n(n+1)}-\\frac{1}{(n+1)(n+2)}\\right]$，兩塊配上 $H_n$ 各自收斂。",
        "1/(n*(n+1)*(n+2)) == (1/(n*(n+1))-1/((n+1)*(n+2)))/2"
      ],
      [
        "$\\sum\\frac{H_n}{n(n+1)}=\\sum_k\\frac1k\\sum_{n\\ge k}\\frac{1}{n(n+1)}=\\sum_k\\frac1k\\cdot\\frac1k=\\frac{\\pi^2}{6}$。",
        "SUM(1/(n*(n+1)), k) == 1/k ;; SUM(1/k^2, 1, k) == pi^2/6"
      ],
      [
        "$\\sum\\frac{H_n}{(n+1)(n+2)}=\\sum_k\\frac1k\\sum_{n\\ge k}\\frac{1}{(n+1)(n+2)}=\\sum_k\\frac{1}{k(k+1)}=1$。",
        "SUM(1/((n+1)*(n+2)), k) == 1/(k+1) ;; SUM(1/(k*(k+1)), 1, k) == 1"
      ],
      [
        "和 $=\\frac12\\left(\\frac{\\pi^2}{6}-1\\right)=\\frac{\\pi^2}{12}-\\frac12$。",
        "(pi^2/6-1)/2 == ANS"
      ]
    ],
    "trap": "裂項漏了前面的 $\\frac12$，答 $\\frac{\\pi^2}{6}-1\\approx0.645$。",
    "check": [
      "前三項 $\\frac16+\\frac{3/2}{24}+\\frac{11/6}{60}\\approx0.260$，後面補到 $0.3225$ 合理。",
      "ANS > 1/6+3/48+11/360"
    ]
  },
  "refine-series-062": {
    "spot": "$\\frac{1}{(n^2+1)^2}$ 是 $\\frac{1}{n^2+a^2}$ 對 $a$ 微分的形狀：$\\frac{\\partial}{\\partial a}\\frac{1}{n^2+a^2}=-\\frac{2a}{(n^2+a^2)^2}$；而 $\\sum\\frac{1}{n^2+a^2}$ 有傅立葉給的封閉式。",
    "why": "對參數微分把「平方的分母」降回已知的級數；直接找 $\\frac{1}{(n^2+1)^2}$ 的傅立葉來源反而要多算一個積分。",
    "steps": [
      [
        "由 $\\cosh ax$ 的傅立葉級數：$\\sum_{n\\ge1}\\frac{1}{n^2+a^2}=\\frac{\\pi a\\coth(\\pi a)-1}{2a^2}$（下式以 $u$ 代 $a$）。",
        "SUM(1/(n^2+u^2), 1) == (pi*u*cosh(pi*u)/sinh(pi*u)-1)/(2u^2)"
      ],
      [
        "逐項對 $a$ 微分（在 $a$ 遠離 $0$ 時一致收斂）：$\\sum\\frac{1}{(n^2+a^2)^2}=-\\frac{1}{2a}\\frac{d}{da}\\left[\\frac{\\pi a\\coth(\\pi a)-1}{2a^2}\\right]$。",
        "SUM(1/(n^2+u^2)^2, 1) == -D((pi*u*cosh(pi*u)/sinh(pi*u)-1)/(2u^2), , u)/(2u)"
      ],
      [
        "$\\frac{d}{da}\\left[\\frac{\\pi\\coth\\pi a}{2a}-\\frac{1}{2a^2}\\right]=-\\frac{\\pi\\coth\\pi a}{2a^2}-\\frac{\\pi^2}{2a\\sinh^2\\pi a}+\\frac1{a^3}$；$a=1$ 乘 $-\\frac12$ 得 $\\frac{\\pi\\coth\\pi}{4}+\\frac{\\pi^2}{4\\sinh^2\\pi}-\\frac12$。",
        "-D((pi*u*cosh(pi*u)/sinh(pi*u)-1)/(2u^2), 1, u)/2 == ANS"
      ]
    ],
    "trap": "用了 $\\sum_{n\\in\\mathbb Z}$ 的版本卻忘了扣掉 $n=0$ 的 $1$ 再除以 $2$，得約 $1.614$。",
    "check": [
      "前三項 $\\frac14+\\frac1{25}+\\frac1{100}=0.30$，剩下不到 $\\sum_{n\\ge4}\\frac1{n^4}$，$0.3068$ 合理。",
      "ANS > 1/4+1/25+1/100 ;; ANS < 1/4+1/25+1/100+SUM(1/n^4, 4)"
    ]
  },
  "refine-series-063": {
    "spot": "$\\sin^2n=\\frac{1-\\cos2n}{2}$ 把級數拆成 $\\sum\\frac1{n^2}$ 減 $\\sum\\frac{\\cos2n}{n^2}$；後者是 $\\sum\\frac{\\cos n\\theta}{n^2}=\\frac{\\pi^2}{6}-\\frac{\\pi\\theta}{2}+\\frac{\\theta^2}{4}$ 在 $\\theta=2$（落在 $[0,2\\pi]$ 內）。",
    "why": "降次後每一塊都是已知的傅立葉多項式，代值就好；直接估 $\\sin^2n$ 沒有規律可用。",
    "steps": [
      [
        "降次：$\\frac{\\sin^2n}{n^2}=\\frac12\\left(\\frac1{n^2}-\\frac{\\cos2n}{n^2}\\right)$。",
        "sin(x)^2 == (1-cos(2x))/2"
      ],
      [
        "$\\theta=2$：$\\sum\\frac{\\cos2n}{n^2}=\\frac{\\pi^2}{6}-\\pi+1$。",
        "SUM(cos(2n)/n^2, 1) == pi^2/6-pi+1"
      ],
      [
        "和 $=\\frac12\\left[\\frac{\\pi^2}{6}-\\left(\\frac{\\pi^2}{6}-\\pi+1\\right)\\right]=\\frac{\\pi-1}{2}$。",
        "(pi^2/6-(pi^2/6-pi+1))/2 == ANS"
      ]
    ],
    "trap": "傅立葉多項式記錯成 $\\frac{\\pi^2}{6}-\\pi\\theta+\\frac{\\theta^2}{4}$，得 $\\frac{2\\pi-1}{2}\\approx2.64$，比 $\\sum\\frac1{n^2}$ 還大，不可能。",
    "check": [
      "數值重組 $\\frac12\\left(\\sum\\frac1{n^2}-\\sum\\frac{\\cos2n}{n^2}\\right)\\approx1.0708$；巧的是它跟 $\\sum\\frac{\\sin n}{n}$ 一樣大。",
      "(SUM(1/n^2, 1)-SUM(cos(2n)/n^2, 1))/2 == ANS ;; SUM(sin(n)/n, 1) == ANS"
    ]
  },
  "refine-series-067": {
    "spot": "對 $\\sum\\frac{\\sin nx}{n^3}$ 逐項微分得 $\\sum\\frac{\\cos nx}{n^2}$，被 $\\sum\\frac1{n^2}$ 控制、一致收斂，所以逐項微分合法；剩下的是已知的傅立葉多項式。",
    "why": "逐項微分後就是 $\\frac{\\pi^2}{6}-\\frac{\\pi\\theta}{2}+\\frac{\\theta^2}{4}$ 代值；先求 $g$ 本身的封閉式（三次多項式）再微分是繞遠路。",
    "steps": [
      [
        "逐項微分：$\\left(\\frac{\\sin nx}{n^3}\\right)'=\\frac{\\cos nx}{n^2}$，而 $\\left|\\frac{\\cos nx}{n^2}\\right|\\le\\frac{1}{n^2}$、$\\sum\\frac1{n^2}$ 收斂，一致收斂，$g'(x)=\\sum\\frac{\\cos nx}{n^2}$。",
        "D(sin(n*x)/n^3) == cos(n*x)/n^2 ;; SUM(1/n^2, 1) == pi^2/6"
      ],
      [
        "$0\\le\\theta\\le2\\pi$ 時 $\\sum\\frac{\\cos n\\theta}{n^2}=\\frac{\\pi^2}{6}-\\frac{\\pi\\theta}{2}+\\frac{\\theta^2}{4}$（$\\theta=1$ 驗）。",
        "SUM(cos(n)/n^2, 1) == pi^2/6-pi/2+1/4"
      ],
      [
        "$\\theta=\\frac\\pi3$：$\\frac{\\pi^2}{6}-\\frac{\\pi^2}{6}+\\frac{\\pi^2}{36}=\\frac{\\pi^2}{36}$。",
        "pi^2/6-pi^2/6+pi^2/36 == ANS ;; SUM(cos(n*pi/3)/n^2, 1) == ANS"
      ]
    ],
    "trap": "微分時只把 $\\sin$ 換成 $\\cos$、忘了乘 $n$，算成 $\\sum\\frac{\\cos(n\\pi/3)}{n^3}$。",
    "check": [
      "$\\cos\\frac{n\\pi}{3}$ 以 $\\frac12,-\\frac12,-1,-\\frac12,\\frac12,1$ 循環；前三項 $\\frac12-\\frac18-\\frac19\\approx0.264$，加上後面得 $0.274$。",
      "ANS > 1/2-1/8-1/9"
    ]
  },
  "refine-series-069": {
    "spot": "$a_n^3=\\frac{\\cos^3(2n\\pi/3)}{n}$，係數以 $-\\frac18,-\\frac18,1$ 循環，平均 $\\frac14$；扣掉平均後剩下的恰好是 $\\frac34\\cos\\frac{2n\\pi}{3}$。",
    "why": "扣掉 $\\frac14\\sum\\frac1n$ 後括號變成 $\\frac34\\sum\\frac{\\cos(2n\\pi/3)}{n}$，正是 $-\\ln\\left(2\\sin\\frac\\theta2\\right)$ 的傅立葉級數，直接代值。",
    "steps": [
      [
        "$\\cos\\frac{2\\pi}{3}=\\cos\\frac{4\\pi}{3}=-\\frac12$、$\\cos2\\pi=1$，所以 $\\cos^3$ 依序是 $-\\frac18,-\\frac18,1$，平均 $\\frac14\\ne0$，$\\sum a_n^3$ 像 $\\frac14\\sum\\frac1n$ 一樣發散。",
        "cos(2*pi/3)^3 == -1/8 ;; cos(2*pi)^3 == 1"
      ],
      [
        "$\\cos^3\\frac{2n\\pi}{3}-\\frac14$ 依序是 $-\\frac38,-\\frac38,\\frac34$，正好 $=\\frac34\\cos\\frac{2n\\pi}{3}$；括號 $\\to\\frac34\\sum\\frac{\\cos(2n\\pi/3)}{n}$。",
        "cos(2*n*pi/3)^3-1/4 == (3/4)*cos(2*n*pi/3)"
      ],
      [
        "$\\sum\\frac{\\cos n\\theta}{n}=-\\ln\\left(2\\sin\\frac\\theta2\\right)$，$\\theta=\\frac{2\\pi}{3}$：$-\\ln\\left(2\\cdot\\frac{\\sqrt3}{2}\\right)=-\\frac{\\ln3}{2}$。",
        "SUM(cos(2*n*pi/3)/n, 1) == -ln(3)/2 ;; -ln(2*sin(pi/3)) == -ln(3)/2"
      ],
      [
        "答案 $=\\frac34\\cdot\\left(-\\frac{\\ln3}{2}\\right)=-\\frac38\\ln3$。",
        "(3/4)*(-ln(3)/2) == ANS"
      ]
    ],
    "trap": "以為 $\\cos^3$ 的平均跟 $\\cos$ 一樣是 $0$，沒扣 $\\frac14$；或扣完忘了乘 $\\frac34$，答 $-\\frac{\\ln3}{2}$。",
    "check": [
      "三倍角驗算：$\\cos^3\\theta=\\frac{3\\cos\\theta+\\cos3\\theta}{4}$，$\\theta=\\frac{2n\\pi}{3}$ 時 $\\cos3\\theta=1$，正好是 $\\frac34\\cos\\theta+\\frac14$。",
      "cos(x)^3 == (3*cos(x)+cos(3x))/4"
    ]
  },
  "refine-series-073": {
    "spot": "部分和 $S_{2m}=-\\frac12H_m\\to-\\infty$、$S_{2m+1}\\to+\\infty$，但相鄰兩個的平均 $\\frac12(H_{2m+1}-H_m)\\to\\frac12\\ln2$——切薩羅平均正是把這兩條拉回中間。",
    "why": "兩兩配對後部分和有乾淨的式子，平均的極限一眼可見；直接平均全部部分和反而看不出規律。",
    "steps": [
      [
        "配對：$H_{2k-1}-H_{2k}=-\\frac{1}{2k}$，所以 $S_{2m}=-\\frac12H_m$（用 $H_n=\\int_0^1\\frac{1-t^n}{1-t}dt$ 驗）。",
        "INT((1-t^(2k-1))/(1-t), 0, 1, t)-INT((1-t^(2k))/(1-t), 0, 1, t) == -1/(2k)"
      ],
      [
        "$S_{2m+1}=S_{2m}+H_{2m+1}$，相鄰平均 $\\frac{S_{2m}+S_{2m+1}}{2}=\\frac12(H_{2m+1}-H_m)$；而 $H_{2m+1}-H_m=\\sum_{j=m+1}^{2m+1}\\frac1j$ 夾在 $\\ln2$ 與 $\\ln2+\\frac1{m+1}$ 之間。",
        "INT((t^n-t^(2n+1))/(1-t), 0, 1, t) > ln(2) ;; INT((t^n-t^(2n+1))/(1-t), 0, 1, t) < ln(2)+1/(n+1)"
      ],
      [
        "切薩羅平均 $=$ 這些對平均的平均（另加 $O\\!\\left(\\frac{\\ln N}{N}\\right)$ 的零頭）$\\to\\frac{\\ln2}{2}$。阿貝爾和也一樣：$\\sum(-1)^{n+1}H_nx^n=\\frac{\\ln(1+x)}{1+x}\\to\\frac{\\ln2}{2}$。",
        "LIM(ln(1+x)/(1+x), 1-) == ANS"
      ]
    ],
    "trap": "看到 $S_{2m}=-\\frac12H_m\\to-\\infty$ 就說切薩羅和不存在；奇偶兩條往相反方向以同樣速度發散，平均起來是收斂的。",
    "check": [
      "數值：前兩百萬項部分和的平均是 $0.34657$，跟 $\\frac{\\ln2}{2}\\approx0.34657$ 吻合。",
      "ANS > 0.3465 ;; ANS < 0.3466"
    ]
  },
  "refine-series-077": {
    "spot": "部分和 $S_{2k}=\\ln\\frac{1\\cdot3\\cdots(2k-1)}{2\\cdot4\\cdots(2k)}$ 是華里斯比值的對數；加上半個 $\\ln(2k+1)$（相鄰平均）後收斂到 $\\frac12\\ln\\frac2\\pi$。",
    "why": "切薩羅和存在時阿貝爾和就等於它，而切薩羅平均只要看相鄰部分和的平均；冪級數 $\\sum(-1)^{n+1}x^n\\ln n$ 沒有好算的封閉式。",
    "steps": [
      [
        "$S_{2k}=\\sum_{j=1}^{k}\\ln\\frac{2j-1}{2j}$，$S_{2k+1}=S_{2k}+\\ln(2k+1)$（例：$\\ln1-\\ln2+\\ln3-\\ln4=\\ln\\frac38$）。",
        "ln(1)-ln(2)+ln(3)-ln(4) == ln(3/8)"
      ],
      [
        "相鄰平均 $S_{2k}+\\frac12\\ln(2k+1)$；把 $\\frac12\\ln(2k+1)=\\sum_{j\\le k}\\frac12\\ln\\frac{2j+1}{2j-1}$ 望遠鏡拆開，每項合併成 $\\frac12\\ln\\left(1-\\frac{1}{4j^2}\\right)$。",
        "ln((2n-1)/(2n))+ln((2n+1)/(2n-1))/2 == ln(1-1/(4n^2))/2"
      ],
      [
        "華里斯：$\\prod\\left(1-\\frac1{4j^2}\\right)=\\frac2\\pi$。",
        "SUM(ln(1-1/(4n^2)), 1) == ln(2/pi)"
      ],
      [
        "相鄰平均 $\\to\\frac12\\ln\\frac2\\pi$，切薩羅和存在，阿貝爾和相同：$\\frac12\\ln\\frac2\\pi$。",
        "SUM(ln(1-1/(4n^2)), 1)/2 == ANS"
      ]
    ],
    "trap": "符號倒過來答 $\\frac12\\ln\\frac\\pi2\\approx0.226$；$S_{2k}$ 每一項都是負的，平均不可能是正的。",
    "check": [
      "等價說法：$\\sum(-1)^{n+1}\\ln n=-\\eta'(0)$，而 $\\eta'(0)=\\frac12\\ln\\frac\\pi2$，得 $\\frac12\\ln\\frac2\\pi\\approx-0.226$。",
      "-ln(pi/2)/2 == ANS"
    ]
  },
  "refine-series-080": {
    "spot": "係數 $(2+\\sin n)^n$ 本身就是「某數的 $n$ 次方」——開 $n$ 次方根剩 $2+\\sin n$，用根值法（柯西–阿達馬），問題變成 $\\sin n$ 的上極限。",
    "why": "比值 $\\frac{(2+\\sin(n+1))^{n+1}}{(2+\\sin n)^n}$ 亂跳、沒有極限，比值法用不上；根值法用上極限，永遠適用。",
    "steps": [
      [
        "$\\sqrt[n]{|a_n|}=2+\\sin n$。",
        "((2+sin(n))^n)^(1/n) == 2+sin(n)"
      ],
      [
        "$\\pi$ 是無理數，$n$ 除以 $2\\pi$ 的餘數在 $[0,2\\pi)$ 稠密，所以 $\\sin n$ 可以任意靠近 $1$（例如 $\\sin33\\approx0.99991$），但 $2+\\sin n<3$。上極限 $=3$。",
        "2+sin(33) > 2.999 ;; 2+sin(n) < 3"
      ],
      [
        "柯西–阿達馬：$R=\\frac{1}{\\limsup\\sqrt[n]{|a_n|}}=\\frac13$。",
        "1/(2+1) == ANS"
      ]
    ],
    "trap": "用下極限或平均值：取最小的 $2+\\sin n\\to1$ 得 $R=1$，或取平均 $2$ 得 $R=\\frac12$；收斂半徑看的是上極限。",
    "check": "$|x|<\\frac13$ 時 $\\left|(2+\\sin n)x\\right|\\le3|x|<1$，每項被收斂的等比級數壓住；$|x|>\\frac13$ 時無窮多項的 $(2+\\sin n)|x|>1$，項不趨於 $0$。"
  },
  "burst-boss2-param-001": {
    "spot": "$e^{-ax}\\sin bx$ 是「指數乘三角」：分部積分兩次會繞回原積分；更快是看成 $e^{-(a-bi)x}$ 的虛部，一次積完。",
    "why": "複數指數把兩次分部積分壓成一個積分 $\\int_0^\\infty e^{-(a-bi)x}dx=\\frac{1}{a-bi}$；收斂需要 $a>0$。",
    "steps": [
      [
        "$a>0$ 時 $\\int_0^\\infty e^{-(a-bi)x}dx=\\frac{1}{a-bi}=\\frac{a+bi}{a^2+b^2}$；實部是 $\\cos$ 的積分 $\\frac{a}{a^2+b^2}$。",
        "INT(exp(-a*x)*cos(b*x), 0, inf) == a/(a^2+b^2)"
      ],
      [
        "取虛部，對應的實數原函數是 $\\frac{e^{-ax}(-a\\sin bx-b\\cos bx)}{a^2+b^2}$。",
        "D(exp(-a*x)*(-a*sin(b*x)-b*cos(b*x))/(a^2+b^2)) == exp(-a*x)*sin(b*x)"
      ],
      [
        "代上下限：$x\\to\\infty$ 為 $0$，$x=0$ 為 $-\\frac{b}{a^2+b^2}$。$F(a,b)=\\frac{b}{a^2+b^2}$。",
        "0-SUB(exp(-a*x)*(-a*sin(b*x)-b*cos(b*x))/(a^2+b^2), 0) == ANS ;; INT(exp(-a*x)*sin(b*x), 0, inf) == ANS"
      ]
    ],
    "trap": "取成實部，答 $\\frac{a}{a^2+b^2}$——那是 $\\cos bx$ 的積分。",
    "check": [
      "$a=2$、$b=3$ 時是 $\\frac3{13}$；$b=0$ 時 $\\sin0=0$，積分也該是 $0$。",
      "SUB(SUB(ANS, 2, a), 3, b) == 3/13 ;; SUB(SUB(ANS, 2, a), 0, b) == 0"
    ]
  },
  "burst-boss2-param-002": {
    "spot": "$e^{-ax}\\cos bx$ 是「指數乘三角」：看成 $e^{-(a-bi)x}$ 的實部，一次積完，不必分部積分兩次。",
    "why": "複數指數把兩次分部積分壓成 $\\int_0^\\infty e^{-(a-bi)x}dx=\\frac{1}{a-bi}$；收斂需要 $a>0$。",
    "steps": [
      [
        "$a>0$ 時 $\\int_0^\\infty e^{-(a-bi)x}dx=\\frac{1}{a-bi}=\\frac{a+bi}{a^2+b^2}$。",
        "INT(exp(-a*x)*sin(b*x), 0, inf) == b/(a^2+b^2)"
      ],
      [
        "取實部，對應的實數原函數是 $\\frac{e^{-ax}(b\\sin bx-a\\cos bx)}{a^2+b^2}$。",
        "D(exp(-a*x)*(b*sin(b*x)-a*cos(b*x))/(a^2+b^2)) == exp(-a*x)*cos(b*x)"
      ],
      [
        "代上下限：$x\\to\\infty$ 為 $0$，$x=0$ 為 $-\\frac{a}{a^2+b^2}$。$F(a,b)=\\frac{a}{a^2+b^2}$。",
        "0-SUB(exp(-a*x)*(b*sin(b*x)-a*cos(b*x))/(a^2+b^2), 0) == ANS ;; INT(exp(-a*x)*cos(b*x), 0, inf) == ANS"
      ]
    ],
    "trap": "取成虛部，答 $\\frac{b}{a^2+b^2}$——那是 $\\sin bx$ 的積分。",
    "check": [
      "$b=0$ 時是 $\\int_0^\\infty e^{-ax}dx=\\frac1a$；$a=2$ 得 $\\frac12$。",
      "SUB(SUB(ANS, 2, a), 0, b) == 1/2"
    ]
  },
  "lec-20-q3b": {
    "spot": "題目已給面積公式 $A=\\frac12\\oint(x\\,dy-y\\,dx)$ 和參數式，直接把 $dx$、$dy$ 換成 $dt$ 代進去。",
    "why": "橢圓的參數式讓 $x\\,dy-y\\,dx$ 化成常數 $ab\\,dt$，積分一眼就出來；用直角座標 $\\int2b\\sqrt{1-x^2/a^2}\\,dx$ 還得三角代換。",
    "steps": [
      [
        "$dx=-a\\sin t\\,dt$、$dy=b\\cos t\\,dt$。",
        "D(a*cos(t), , t) == -a*sin(t) ;; D(b*sin(t), , t) == b*cos(t)"
      ],
      [
        "$x\\,dy-y\\,dx=ab\\cos^2t\\,dt+ab\\sin^2t\\,dt=ab\\,dt$。",
        "a*cos(t)*D(b*sin(t), , t)-b*sin(t)*D(a*cos(t), , t) == a*b"
      ],
      [
        "$A=\\frac12\\int_0^{2\\pi}ab\\,dt=\\pi ab$。",
        "INT(a*b, 0, 2*pi, t)/2 == ANS"
      ]
    ],
    "trap": "忘了前面的 $\\frac12$，答 $2\\pi ab$；或 $y\\,dx$ 的負號沒處理好，兩項相消得 $0$。",
    "check": [
      "$a=b=2$ 時是半徑 $2$ 的圓，面積 $4\\pi$。",
      "SUB(SUB(ANS, 2, a), 2, b) == 4*pi"
    ]
  },
  "lec-19-m5": {
    "spot": "代換 $x=au$、$y=bv$ 把橢圓 $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}\\le1$ 拉成單位圓盤 $u^2+v^2\\le1$，面積只差一個雅可比行列式 $ab$。",
    "why": "單位圓盤的面積 $\\pi$ 已知，乘上雅可比就是答案；直接在 $xy$ 平面積分要處理根號與三角代換。",
    "steps": [
      [
        "雅可比：$\\frac{\\partial(x,y)}{\\partial(u,v)}=\\begin{vmatrix}a&0\\\\0&b\\end{vmatrix}=ab$。",
        "D(a*u, , u)*D(b*v, , v) == a*b"
      ],
      [
        "區域：$\\frac{(au)^2}{a^2}+\\frac{(bv)^2}{b^2}=u^2+v^2\\le1$，是單位圓盤，面積 $\\pi$。",
        "(a*u)^2/a^2+(b*v)^2/b^2 == u^2+v^2 ;; INT(2*sqrt(1-u^2), -1, 1, u) == pi"
      ],
      [
        "面積 $=\\iint_{u^2+v^2\\le1}ab\\,du\\,dv=\\pi ab$。",
        "a*b*pi == ANS"
      ]
    ],
    "trap": "忘了乘雅可比，答成單位圓的 $\\pi$；或把單位圓面積記成 $2\\pi$，得 $2\\pi ab$。",
    "check": [
      "$a=2$、$b=3$ 時面積 $6\\pi$；$a=b$ 時退化成圓面積 $\\pi a^2$。",
      "SUB(SUB(ANS, 2, a), 3, b) == 6*pi"
    ]
  }
};
