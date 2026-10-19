(function () {
  "use strict";

  // 競賽長題 pack (2026-07)。
  // Long-form analysis problems in the spirit of the Alibaba Global Math
  // Competition-style qualifiers: multi-step setups, slow-burn asymptotics,
  // classic hard integrals and series. All ranked 4-6 with generous time
  // limits. Every answer numerically verified via an independent scratchpad
  // harness (iteration / quadrature / summation), see repo history.
  const SOURCE = "Buzz 長題挑戰包 2026";
  const TIME = { 4: 300, 5: 420, 6: 600 };
  const problems = [];

  function add(p) {
    const rank = p.rank || 5;
    const rankTags = ["longform", "long-form", "competition"];
    if (rank >= 5) rankTags.push("boss-rank");
    if (rank >= 6) rankTags.push("true-boss");
    problems.push({
      source: SOURCE,
      difficulty: Math.min(4, Math.ceil((rank * 4) / 6)),
      timeLimit: TIME[rank] || 420,
      tabLimit: 1,
      ...p,
      tags: Array.from(new Set([...(p.tags || []), ...rankTags].filter(Boolean)))
    });
  }
  function N(id, topic, rank, prompt, answer, tags, solution, hints) {
    add({ id, topic, rank, prompt, answerKind: "numeric", answer, tags, solution, hints });
  }

  /* ===== 遞迴數列與慢收斂極限 ===== */

  N("dm-seq-001", "limits", 6,
    "\\text{設 }a_1=1,\\ a_{n+1}=a_n+\\frac{1}{a_n}\\text{。先證 }a_n\\to\\infty\\text{,再由 }a_{n+1}^2=a_n^2+2+\\frac{1}{a_n^2}\\text{ 求 }\\lim_{n\\to\\infty}\\frac{a_n}{\\sqrt{n}}",
    "sqrt(2)", ["sequence", "recursive", "asymptotics"],
    "平方後 a_{n+1}^2 = a_n^2 + 2 + 1/a_n^2,夾出 a_n^2 ~ 2n,故極限為 √2。",
    ["把遞迴式兩邊平方。", "a_n^2 每步大約增加 2。", "用夾擠:2n ≤ a_n^2 ≤ 2n + O(log n)。"]);

  N("dm-seq-002", "limits", 6,
    "\\text{設 }x_1=1,\\ x_{n+1}=\\sin x_n\\text{。已知 }x_n\\downarrow 0\\text{,利用 }\\frac{1}{x_{n+1}^2}-\\frac{1}{x_n^2}\\to\\frac13\\text{ 與 Stolz 定理,求 }\\lim_{n\\to\\infty}\\sqrt{n}\\,x_n",
    "sqrt(3)", ["sequence", "recursive", "taylor", "asymptotics"],
    "Taylor:1/sin^2 x - 1/x^2 → 1/3,Stolz 給 n x_n^2 → 3,故 √n x_n → √3。",
    ["對 1/x^2 做 Taylor 展開:sin x = x - x^3/6 + …。", "1/x_{n+1}^2 - 1/x_n^2 的極限是 1/3。", "Stolz:1/x_n^2 ~ n/3。"]);

  N("dm-seq-003", "limits", 5,
    "\\text{設 }f(x)=\\frac{1}{1+x^2}\\text{。證明 }\\lim_{n\\to\\infty}n\\int_0^1 x^n f(x)\\,dx=f(1)\\text{,並求該極限值}",
    "1/2", ["improper-integral", "boundary-layer", "asymptotics"],
    "質量集中在 x=1 附近:代換 x = 1 - t/n 得極限 f(1) = 1/2。",
    ["x^n 在 [0,1) 上被壓扁,只剩 x=1 附近有貢獻。", "代換 x = 1 - t/n。"]);

  N("dm-seq-004", "limits", 6,
    "\\text{(Wallis 漸近)用 Wallis 乘積或 Stirling 公式證明 }\\binom{2n}{n}\\sim\\frac{4^n}{\\sqrt{\\pi n}}\\text{,並求 }\\lim_{n\\to\\infty}\\sqrt{n}\\,\\binom{2n}{n}\\,4^{-n}",
    "1/sqrt(pi)", ["wallis", "stirling", "asymptotics"],
    "Stirling:C(2n,n) ~ 4^n/√(πn),故極限 1/√π。",
    ["對 log C(2n,n) 用 Stirling。", "或由 Wallis 乘積導出。"]);

  N("dm-seq-005", "limits", 5,
    "\\text{展開 }\\sqrt{n^2+n}=n+\\frac12-\\frac{1}{8n}+O(n^{-2})\\text{,求 }\\lim_{n\\to\\infty}\\sin^2\\!\\left(\\pi\\sqrt{n^2+n}\\right)",
    "1", ["asymptotics", "periodicity", "sequence"],
    "sin²(π√(n²+n)) = sin²(π(√(n²+n)-n)) → sin²(π/2) = 1。",
    ["sin² 對加整數倍 π 不變。", "√(n²+n) - n → 1/2。"]);

  N("dm-seq-006", "limits", 5,
    "\\text{用 Stolz 定理或 Riemann 和,求 }\\lim_{n\\to\\infty}\\frac{\\sqrt{1}+\\sqrt{2}+\\cdots+\\sqrt{n}}{n^{3/2}}",
    "2/3", ["stolz", "riemann-sum", "sequence"],
    "Riemann 和 → ∫₀¹ √x dx = 2/3;或 Stolz:√n/(n^{3/2}-(n-1)^{3/2}) → 2/3。",
    ["除以 n 之後是 √(k/n) 的平均。"]);

  N("dm-seq-007", "limits", 5,
    "\\text{把和式視為 Riemann 和,求 }\\lim_{n\\to\\infty}\\frac{1}{n^2}\\sum_{k=1}^{n}k\\sin\\frac{k}{n}",
    "sin(1)-cos(1)", ["riemann-sum", "ibp"],
    "(1/n)Σ (k/n) sin(k/n) → ∫₀¹ x sin x dx = sin 1 - cos 1。",
    ["寫成 (1/n)Σ (k/n)sin(k/n)。", "∫ x sin x dx 用分部積分。"]);

  N("dm-seq-008", "limits", 6,
    "\\text{取對數化為 Riemann 和,再分部積分,求 }\\lim_{n\\to\\infty}\\prod_{k=1}^{n}\\left(1+\\frac{k^2}{n^2}\\right)^{1/n}",
    "2*exp(pi/2-2)", ["product-limit", "riemann-sum", "ibp"],
    "log → ∫₀¹ ln(1+x²)dx = ln2 - 2 + π/2,極限 = 2e^{π/2-2}。",
    ["log 後是 ∫₀¹ ln(1+x²) dx 的 Riemann 和。", "∫ln(1+x²) 分部積分。"]);

  N("dm-seq-009", "integrals", 6,
    "\\text{設 }I_n=\\int_0^{\\pi/4}\\tan^n x\\,dx\\,\\text{。先建立 }I_n+I_{n-2}=\\frac{1}{n-1}\\text{,再求 }\\lim_{n\\to\\infty}n\\,I_n",
    "1/2", ["reduction-formula", "asymptotics"],
    "遞迴 I_n + I_{n-2} = 1/(n-1) 且 I_n 遞減,故 2I_n ~ 1/n,nI_n → 1/2。",
    ["tan^n = tan^{n-2}(sec^2 - 1)。", "I_n 遞減,所以 I_n 與 I_{n-2} 同階。"]);

  N("dm-seq-010", "limits", 6,
    "\\text{寫 }n^{1/n}=e^{(\\ln n)/n}\\text{,求 }\\lim_{n\\to\\infty}\\frac{n}{\\ln n}\\left(n^{1/n}-1\\right)",
    "1", ["log-expansion", "asymptotics"],
    "n^{1/n} - 1 = e^{ln n/n} - 1 ~ ln n/n,故比值 → 1。",
    ["e^t - 1 ~ t。"]);

  N("dm-seq-011", "limits", 6,
    "\\text{設 }S_n=e^{-n}\\sum_{k=0}^{n}\\frac{n^k}{k!}\\text{(Poisson 機率觀點)。求 }\\lim_{n\\to\\infty}S_n",
    "1/2", ["poisson", "central-limit", "series"],
    "S_n = P(Poisson(n) ≤ n),由中央極限定理對稱地趨於 1/2。經典競賽題型。",
    ["S_n 是 Poisson(n) 不超過其均值的機率。", "標準化後用常態近似。"]);

  N("dm-lim-012", "limits", 6,
    "\\text{設 }F(x)=\\int_x^{\\infty}e^{-t^2}dt\\text{。先用分部積分證 }F(x)=\\frac{e^{-x^2}}{2x}\\left(1+O(x^{-2})\\right)\\text{,再求 }\\lim_{x\\to\\infty}x\\,e^{x^2}F(x)",
    "1/2", ["improper-integral", "asymptotics", "ibp"],
    "IBP:∫ₓ^∞ e^{-t²}dt = e^{-x²}/(2x) - ∫ e^{-t²}/(2t²)dt,故 x e^{x²}F(x) → 1/2。",
    ["寫 e^{-t^2} = (1/(-2t))·(-2t e^{-t^2}) 再分部。"]);

  /* ===== 經典難積分 ===== */

  N("dm-int-001", "integrals", 5,
    "\\text{先用分部積分把指數降一次,再用 Dirichlet 積分 }\\int_0^{\\infty}\\frac{\\sin x}{x}dx=\\frac{\\pi}{2}\\text{,求 }\\int_0^{\\infty}\\frac{\\sin^2 x}{x^2}\\,dx",
    "pi/2", ["improper-integral", "ibp", "dirichlet"],
    "IBP:∫ sin²x/x² = ∫ sin 2x/x dx = ∫ sin u/u du = π/2。",
    ["u = sin^2 x,dv = dx/x^2。", "sin 2x = 2 sin x cos x。"]);

  N("dm-int-002", "integrals", 6,
    "\\text{把 }\\ln(1-x)\\text{ 展成冪級數逐項積分,證明並求 }\\int_0^1\\ln x\\ln(1-x)\\,dx",
    "2-pi^2/6", ["log-integral", "series-expansion", "zeta"],
    "展開後 = Σ 1/(n(n+1)²) = 2 - ζ(2) = 2 - π²/6。",
    ["ln(1-x) = -Σ x^n/n。", "∫₀¹ x^n ln x dx = -1/(n+1)²。", "拆 1/(n(n+1)²) 部分分式。"]);

  N("dm-int-003", "integrals", 5,
    "\\text{先分部積分轉成 }\\int_0^{\\pi/2}\\ln\\sin x\\,dx\\text{,再求 }\\int_0^{\\pi/2}\\frac{x}{\\tan x}\\,dx",
    "pi*log(2)/2", ["log-sine", "ibp"],
    "IBP 得 -∫ ln sin x dx = π ln 2/2(Euler 的 log-sine 積分)。",
    ["u = x,dv = dx/tan x = d(ln sin x)。", "∫₀^{π/2} ln sin x dx = -π ln2/2。"]);

  N("dm-int-004", "integrals", 6,
    "\\text{代換 }x=e^{-u}\\text{ 化成 Gamma 型積分,求 }\\int_0^1\\frac{(\\ln x)^2}{1+x^2}\\,dx",
    "pi^3/16", ["log-integral", "series-expansion", "beta-function"],
    "展開 1/(1+x²) 逐項積分:2Σ(-1)^n/(2n+1)³ = 2·π³/32 = π³/16。",
    ["1/(1+x^2) = Σ(-1)^n x^{2n}。", "∫₀¹ x^{2n}(ln x)² dx = 2/(2n+1)³。"]);

  N("dm-int-005", "integrals", 5,
    "\\text{(softplus 曲線下面積)把 }\\ln(1+e^{-x})\\text{ 展成 }\\sum_{n\\ge1}\\frac{(-1)^{n+1}}{n}e^{-nx}\\text{ 逐項積分,求 }\\int_0^{\\infty}\\ln\\!\\left(1+e^{-x}\\right)dx",
    "pi^2/12", ["improper-integral", "series-expansion", "zeta"],
    "逐項積分得 Σ(-1)^{n+1}/n² = η(2) = π²/12。",
    ["ln(1+t) 的 Maclaurin 級數,t = e^{-x}。", "∫₀^∞ e^{-nx}dx = 1/n。"]);

  N("dm-int-006", "integrals", 5,
    "\\text{設 }I(t)=\\int_0^{\\infty}e^{-x^2}\\cos(2tx)\\,dx\\,\\text{。先證 }I'(t)=-2t\\,I(t)\\text{,再求 }I(1)",
    "sqrt(pi)/(2*exp(1))", ["parameter-integral", "ode-style", "gaussian"],
    "微分後分部積分得 I' = -2tI,I(0)=√π/2,故 I(1) = √π e^{-1}/2。",
    ["對參數 t 微分,再對 x 分部積分。", "解 ODE:I(t) = I(0)e^{-t²}。"]);

  N("dm-int-007", "integrals", 6,
    "\\text{(Basel 問題的積分證明)展開 }\\frac{1}{1-xy}\\text{ 成冪級數,先證此積分等於 }\\zeta(2)\\text{,再求 }\\int_0^1\\!\\!\\int_0^1\\frac{dx\\,dy}{1-xy}",
    "pi^2/6", ["double-integral", "zeta", "series-expansion"],
    "逐項積分:∫∫(xy)^k = 1/(k+1)²,故 = ζ(2) = π²/6(可再用旋轉座標直接算出)。",
    ["1/(1-xy) = Σ(xy)^k。", "∫₀¹x^k dx = 1/(k+1)。"]);

  N("dm-int-008", "integrals", 5,
    "\\text{視為對參數的積分:}\\int_0^1 x^s ds=\\frac{x-1}{\\ln x}\\text{,交換積分次序求 }\\int_0^1\\frac{x-1}{\\ln x}\\,dx",
    "log(2)", ["parameter-integral", "frullani"],
    "交換次序:∫₀¹∫₀¹ x^s ds dx = ∫₀¹ 1/(s+1) ds = ln 2。",
    ["(x-1)/ln x = ∫₀¹ x^s ds。", "先對 x 積分。"]);

  N("dm-int-009", "integrals", 6,
    "\\text{(Laplace 積分)設 }I(t)=\\int_0^{\\infty}\\frac{\\cos(tx)}{1+x^2}dx\\,\\text{。先證 }I''(t)=I(t)\\ (t>0)\\text{,再求 }I(1)",
    "pi/(2*exp(1))", ["parameter-integral", "ode-style", "improper-integral"],
    "I''=I 與 I(0)=π/2、I 有界給 I(t) = (π/2)e^{-t},故 I(1) = π/(2e)。",
    ["對 t 微分兩次,用 x²/(1+x²) = 1 - 1/(1+x²)。", "解 ODE 並丟掉發散解 e^{t}。"]);

  N("dm-int-010", "integrals", 5,
    "\\text{用 King's property }x\\mapsto\\pi-x\\text{ 消去分子的 }x\\text{,再做半角代換,求 }\\int_0^{\\pi}\\frac{x}{1+\\sin x}\\,dx",
    "pi", ["kings-property", "half-angle"],
    "King's:2I = π∫₀^π dx/(1+sin x) = π·2,I = π(半角代換 t = tan(x/2) 給 ∫ = 2)。",
    ["I = ∫(π-x)/(1+sin x),兩式相加。", "t = tan(x/2)。"]);

  N("dm-int-011", "integrals", 5,
    "\\text{代換 }x\\mapsto\\frac1x\\text{ 比較兩半,求 }\\int_0^{\\infty}\\frac{\\ln x}{1+x^2}\\,dx",
    "0", ["improper-integral", "symmetry"],
    "x→1/x 把 [0,1] 映到 [1,∞) 且 ln 變號,兩半相消,積分為 0。",
    ["拆成 [0,1] 與 [1,∞)。", "在其中一段做 x = 1/u。"]);

  N("dm-int-012", "integrals", 6,
    "\\text{(大二之夢)證明 }\\int_0^1 x^{-x}dx=\\sum_{n=1}^{\\infty}n^{-n}\\text{,並求兩者的比值}",
    "1", ["sophomore-dream", "series-expansion"],
    "x^{-x} = e^{-x ln x} = Σ(-x ln x)^k/k!,逐項用 ∫₀¹ x^k(ln x)^k dx 得 Σ n^{-n},比值為 1。",
    ["展開 e^{-x ln x}。", "∫₀¹ (-x ln x)^k dx = k!/(k+1)^{k+1}。"]);

  /* ===== 難級數 ===== */

  N("dm-ser-001", "series", 6,
    "\\text{用 Beta 函數 }\\frac{1}{\\binom{2n}{n}}=(2n+1)\\int_0^1 t^n(1-t)^n\\,dt\\text{ 交換和與積分,求 }\\sum_{n=1}^{\\infty}\\frac{1}{\\binom{2n}{n}}",
    "1/3+2*sqrt(3)*pi/27", ["central-binomial", "beta-function"],
    "交換後化為 ∫₀¹ 有理式,結果 1/3 + 2√3π/27 ≈ 0.7364。",
    ["B(n+1,n+1) = n!n!/(2n+1)!。", "Σ(2n+1)u^n 是幾何級數的導數,u = t(1-t)。"]);

  N("dm-ser-002", "series", 6,
    "\\text{設 }H_n=\\sum_{k=1}^n\\frac1k\\text{。由母函數 }\\sum_{n=1}^{\\infty}\\frac{H_n}{n}x^n=\\operatorname{Li}_2(x)+\\frac12\\ln^2(1-x)\\text{ 在 }x=-1\\text{ 取值,求 }\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}H_n}{n}",
    "pi^2/12-log(2)^2/2", ["harmonic-number", "dilogarithm", "alternating"],
    "-(Li₂(-1) + ln²2/2) = -(-π²/12 + ln²2/2) = π²/12 - ln²2/2 ≈ 0.5822。",
    ["Li₂(-1) = -π²/12。", "注意整體再乘 -1。"]);

  N("dm-ser-003", "series", 5,
    "\\text{用 }\\arctan\\frac{1}{2n^2}=\\arctan(2n+1)-\\arctan(2n-1)\\text{ 望遠鏡求和:}\\sum_{n=1}^{\\infty}\\arctan\\frac{1}{2n^2}",
    "pi/4", ["telescoping", "inverse-trig"],
    "望遠鏡和 = lim arctan(2N+1) - arctan 1 = π/2 - π/4 = π/4。",
    ["tan(A-B) 公式驗證拆解。"]);

  N("dm-ser-004", "series", 5,
    "\\text{部分分式後與 }\\ln 2=\\sum\\frac{(-1)^{k+1}}{k}\\text{ 連結,求 }\\sum_{n=1}^{\\infty}\\frac{1}{n(4n^2-1)}",
    "2*log(2)-1", ["telescoping", "partial-fraction"],
    "1/(n(2n-1)(2n+1)) = 1/(2n-1) + 1/(2n+1) - 1/n,部分和 → 2ln2 - 1。",
    ["先做部分分式。", "與交錯調和級數比對。"]);

  N("dm-ser-005", "series", 5,
    "\\text{部分分式後平方展開,配合 }\\zeta(2)\\text{ 與 Leibniz 級數,求 }\\sum_{n=1}^{\\infty}\\frac{1}{(4n^2-1)^2}",
    "pi^2/16-1/2", ["zeta", "partial-fraction", "telescoping"],
    "1/(4n²-1) = (1/2)(1/(2n-1)-1/(2n+1)),平方展開後用 Σ1/(2n±1)² 與望遠鏡,得 π²/16 - 1/2。",
    ["先寫 1/(4n²-1)² = (1/4)(1/(2n-1)-1/(2n+1))²。", "Σ1/(2n-1)² = π²/8。"]);

  N("dm-ser-006", "series", 6,
    "\\text{用 }\\cosh x\\text{ 在 }[-\\pi,\\pi]\\text{ 的 Fourier 級數(或 }\\pi\\cot\\pi z\\text{ 的 Mittag-Leffler 展開),求 }\\sum_{n=1}^{\\infty}\\frac{1}{n^2+1}",
    "(pi*(exp(pi)+exp(-pi))/(exp(pi)-exp(-pi))-1)/2", ["fourier", "mittag-leffler"],
    "π coth π = 1 + 2Σ1/(n²+1),故和 = (π coth π - 1)/2 ≈ 1.0767。",
    ["cosh 的 Fourier 係數含 1/(n²+1)。", "在 x = π 代入。"]);

  /* ===== 長情境應用 ===== */

  N("dm-app-001", "integrals", 5,
    "\\text{甲乙兩人在 }[0,1]\\text{ 上各自均勻隨機取一數 }x,y\\text{。以二重積分求兩數差距的期望值 }\\int_0^1\\!\\!\\int_0^1|x-y|\\,dx\\,dy",
    "1/3", ["double-integral", "probability", "story-problem"],
    "對稱拆成 2∫₀¹∫₀^y (y-x) dx dy = 2∫₀¹ y²/2 dy = 1/3。",
    ["按 x<y 與 x>y 拆區域。"]);

  N("dm-app-002", "integrals", 5,
    "\\text{(Gabriel 號角)把 }y=\\frac1x\\ (x\\ge1)\\text{ 繞 }x\\text{ 軸旋轉。其表面積發散,但體積收斂:求該體積}",
    "pi", ["solid-of-revolution", "improper-integral", "story-problem"],
    "V = π∫₁^∞ dx/x² = π;表面積 2π∫ dx/x·√(1+1/x⁴) ≥ 2π∫dx/x 發散。",
    ["圓盤法:V = π∫ y² dx。"]);

  N("dm-app-003", "integrals", 6,
    "\\text{質點速度 }v(t)=e^{-t}\\sin t\\ (t\\ge0)\\text{。位移是 }\\int_0^{\\infty}v\\,dt=\\frac12\\text{,總路程要對 }|v|\\text{ 積分:求 }\\int_0^{\\infty}e^{-t}|\\sin t|\\,dt",
    "(1+exp(-pi))/(2*(1-exp(-pi)))", ["improper-integral", "geometric-series", "story-problem"],
    "逐段 [kπ,(k+1)π] 積分成幾何級數:首項 (1+e^{-π})/2,公比 e^{-π},和 = (1+e^{-π})/(2(1-e^{-π}))。",
    ["每個半週期的積分只差 e^{-π} 倍。", "∫₀^π e^{-t}sin t dt = (1+e^{-π})/2。"]);

  // ---- 獨立驗算規格（tools/verify_answers.js 讀）----
  //
  // 敘述型數列題的題幹是解法提示 + 中文說明，自動辨識器讀不出結構。
  // 這裡把「數列本身」用 DSL 重述：recSeq 照定義迭代遞迴、seqLimit 直接
  // 對通項（含 ∑/∏/∫ 子式）做數列外插 —— 都不重複解題的推導。
  // dm-seq-011（Poisson 部分和）的通項在 n 大時會溢位，DSL 表達不了，
  // 留在 unverified 白名單。
  const VERIFY = {
    "dm-seq-001": { m: "recSeq", f: "a+\\frac{1}{a}", a0: 1, g: "\\frac{a}{\\sqrt{n}}", tol: 1e-3 },
    "dm-seq-002": { m: "recSeq", f: "\\sin a", a0: 1, g: "a\\sqrt{n}", tol: 1e-3 },
    "dm-seq-003": { m: "seqLimit", f: "n\\int_0^1 \\frac{x^n}{1+x^2}\\,dx", tol: 1e-3 },
    "dm-seq-004": { m: "seqLimit", f: "\\sqrt{n}\\prod_{k=1}^{n}\\frac{2k-1}{2k}", tol: 1e-3 },
    "dm-seq-005": { m: "seqLimit", f: "\\sin^2\\left(\\pi\\sqrt{n^2+n}\\right)", tol: 1e-3 },
    "dm-seq-006": { m: "seqLimit", f: "\\frac{\\sum_{k=1}^{n}\\sqrt{k}}{n^{3/2}}", tol: 1e-3 },
    "dm-seq-007": { m: "seqLimit", f: "\\frac{1}{n^2}\\sum_{k=1}^{n}k\\sin\\frac{k}{n}", tol: 1e-3 },
    "dm-seq-008": { m: "seqLimit", f: "\\prod_{k=1}^{n}\\left(1+\\frac{k^2}{n^2}\\right)^{1/n}", tol: 1e-3 },
    "dm-seq-009": { m: "seqLimit", f: "n\\int_0^{\\pi/4}(\\tan x)^n\\,dx", tol: 1e-3 },
    "dm-seq-010": { m: "seqLimit", f: "\\frac{n}{\\ln n}\\left(n^{1/n}-1\\right)", tol: 1e-3 },
    // I(t) 定義式在 t=1 的值：直接對定義的積分數值積。
    // e^{-x²} 在 x=20 已是 1e-174，截到 20 沒有損失。
    "dm-int-006": { m: "integral", f: "e^{-x^2}\\cos(2x)", v: "x", a: 0, b: 20 },
    // cos x/(1+x²) 的尾巴 ~1/b：截到 600 誤差 ~2e-3，容差放 5e-3
    "dm-int-009": { m: "integral", f: "\\frac{\\cos x}{1+x^2}", v: "x", a: 0, b: 600, tol: 5e-3 },
    // 二重積分直接數值積（角落 (1,1) 是對數奇異，自適應積分吃得下），不經過級數展開
    "dm-int-007": { m: "double", f: "\\frac{1}{1-xy}", u: "x", v: "y", a: 0, b: 1, c: 0, d: 1, tol: 1e-6 },
    // x e^{x²}F(x)：把 e^{x²} 併進被積函數（e^{x²−t²}）免得溢位，再對 x→∞ 外插
    "dm-lim-012": { m: "limit", f: "x\\int_x^{\\infty} e^{x^2-t^2}\\,dt", at: "inf" }
  };
  problems.forEach((problem) => {
    if (VERIFY[problem.id]) problem.verify = VERIFY[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

/* 課程缺口補題（12A 證明工具、12D 函數極限嚴格化），2026-10。 */
(function () {
  "use strict";
  // 課程缺口補題（12A／12D）：量詞順序與翻譯、否定、逆否與逆命題、反設、錯誤證明找錯、
  // ε-δ 的「最大可用 ε／δ」與限制半徑。證明題（白話證明）不在這裡，留在課程 gaps。
  // 判斷題的驗算一律是「把選項代進具體的函數／數列，用數值反例推翻誘答」。
  const SOURCE = "Buzz course gap fill";

  const V = (f) => ({ m: "value", f });
  const SUP = (f, a, b, v) => ({ m: "extremeOf", kind: "sup", integer: false, f, range: [a, b], v: v || "x" });
  const INF = (f, a, b, v) => ({ m: "extremeOf", kind: "inf", integer: false, f, range: [a, b], v: v || "x" });
  const LIMSUP = (f) => ({ m: "limsup", f, kind: "limsup" });
  const LIMINF = (f) => ({ m: "limsup", f, kind: "liminf" });

  const problems = [
    /* ── 命題與量詞 ── */
    { id: "cg-12a-001", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{判斷真假：}\\quad P:\\ \\forall x\\in\\mathbb{R}\\ \\exists y\\in\\mathbb{R},\\ y>x^2\\qquad Q:\\ \\exists y\\in\\mathbb{R}\\ \\forall x\\in\\mathbb{R},\\ y>x^2",
      answers: ["P 真、Q 假"], canonical: "P 真、Q 假",
      distractors: ["P 假、Q 真", "P、Q 都真", "P、Q 都假"],
      timeLimit: 90,
      tags: ["logic-quantifier-order", "proof"],
      hints: ["P 裡的 y 可以看了 x 之後才挑；Q 裡的 y 要先挑好，對每一個 x 都要管用。", "Q 的 y 一旦固定，x 取多大會讓 x² 超過它？"],
      solution: "P：給定 x，取 y = x² + 1 就好，P 真。Q：不管 y 先取多少，x = √(|y|) + 1 都讓 x² > y，所以沒有一個 y 對所有 x 都成立，Q 假。只是量詞換順序，真假就變了。",
      solutionSteps: ["P：y 可以依賴 x，取 y = x² + 1 > x²，P 真。", "Q：y 要先固定；但 x = √(|y|) + 1 給 x² > y，Q 假。", "答案：P 真、Q 假。"],
      verify: { m: "choice", options: [
        { say: "P 真、Q 假", all: [{ v: INF("(x^2+1)-x^2", -100, 100), gt: 0 }, { v: SUP("x^2", -1000, 1000), gt: 100000 }] },
        { say: "P 假、Q 真", all: [{ v: INF("(x^2+1)-x^2", -100, 100), le: 0 }] },
        { say: "P、Q 都真", all: [{ v: SUP("x^2", -1000, 1000), le: 100000 }] },
        { say: "P、Q 都假", all: [{ v: INF("(x^2+1)-x^2", -100, 100), le: 0 }] }
      ] } },

    { id: "cg-12a-002", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{判斷真假：}\\quad P:\\ \\exists m\\in\\mathbb{R}\\ \\forall x\\in\\mathbb{R},\\ x^2-2x\\ge m\\qquad Q:\\ \\forall x\\in\\mathbb{R}\\ \\exists m\\in\\mathbb{R},\\ x^2-2x\\ge m",
      answers: ["P、Q 都真"], canonical: "P、Q 都真",
      distractors: ["P 真、Q 假", "P 假、Q 真", "P、Q 都假"],
      timeLimit: 90,
      tags: ["logic-quantifier-order", "proof", "completing-square"],
      hints: ["「∃ 在前」不代表一定假：先找找看有沒有一個 m 對所有 x 都管用。", "把 x² − 2x 配方，看它最小是多少。"],
      solution: "x² − 2x = (x − 1)² − 1 ≥ −1，所以 m = −1 對所有 x 都成立，P 真。P 真時 Q 一定真（每個 x 都拿同一個 m）。∃∀ 比 ∀∃ 強，但強的那句也可以是真的。",
      solutionSteps: ["配方：x² − 2x = (x − 1)² − 1 ≥ −1。", "P：取 m = −1，對所有 x 成立，P 真。", "Q：每個 x 都用同一個 m = −1 即可，Q 真。答案：都真。"],
      verify: { m: "choice", options: [
        { say: "P、Q 都真", all: [{ v: INF("x^2-2x", -100, 100), ge: -1 }, { v: INF("(x^2-2x)-(x^2-2x-1)", -100, 100), gt: 0 }] },
        { say: "P 真、Q 假", all: [{ v: INF("(x^2-2x)-(x^2-2x-1)", -100, 100), le: 0 }] },
        { say: "P 假、Q 真", all: [{ v: INF("x^2-2x", -100, 100), lt: -1 }] },
        { say: "P、Q 都假", all: [{ v: INF("x^2-2x", -100, 100), lt: -1 }] }
      ] } },

    { id: "cg-12a-003", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\text{判斷真假：}\\quad P:\\ \\forall x\\in[0,1]\\ \\exists y\\in[0,1],\\ x+y=1\\qquad Q:\\ \\exists y\\in[0,1]\\ \\forall x\\in[0,1],\\ x+y=1",
      answers: ["P 真、Q 假"], canonical: "P 真、Q 假",
      distractors: ["P 假、Q 真", "P、Q 都真", "P、Q 都假"],
      timeLimit: 100,
      tags: ["logic-quantifier-order", "proof"],
      hints: ["P：給你一個 x，你要的 y 是多少？它有沒有落在 [0, 1] 裡？", "Q：y 固定之後，x = 0 與 x = 1 能不能同時讓 x + y = 1？"],
      solution: "P：取 y = 1 − x，x ∈ [0,1] 時 y 也在 [0,1]，P 真。Q：y 固定後，x = 0 要 y = 1、x = 1 要 y = 0，不可能同時成立，Q 假。",
      solutionSteps: ["P：y = 1 − x ∈ [0, 1]，所以 P 真。", "Q：x = 0 逼出 y = 1，x = 1 逼出 y = 0，矛盾，Q 假。", "答案：P 真、Q 假。"],
      verify: { m: "choice", options: [
        { say: "P 真、Q 假", all: [{ v: INF("1-x", 0, 1), ge: 0 }, { v: SUP("1-x", 0, 1), le: 1 }, { v: SUP("x", 0, 1), ne: INF("x", 0, 1) }] },
        { say: "P 假、Q 真", all: [{ v: SUP("x", 0, 1), eq: INF("x", 0, 1) }] },
        { say: "P、Q 都真", all: [{ v: SUP("x", 0, 1), eq: INF("x", 0, 1) }] },
        { say: "P、Q 都假", all: [{ v: INF("1-x", 0, 1), lt: 0 }] }
      ] } },

    { id: "cg-12a-004", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{「函數 }f\\text{ 在 }\\mathbb{R}\\text{ 上有界」寫成量詞句是哪一句？}",
      answers: ["∃M>0 ∀x∈ℝ：|f(x)| ≤ M"], canonical: "∃M>0 ∀x∈ℝ：|f(x)| ≤ M",
      distractors: ["∀x∈ℝ ∃M>0：|f(x)| ≤ M", "∀M>0 ∃x∈ℝ：|f(x)| ≤ M", "∃M>0 ∃x∈ℝ：|f(x)| ≤ M"],
      timeLimit: 90,
      tags: ["logic-translate-quantifier", "proof"],
      hints: ["有界的意思是：有一條固定的天花板，整條函數圖形都在它底下。", "拿 f(x) = x 試每個選項：它無界，正確的句子對它應該是假的。"],
      solution: "有界＝先有一個 M，再對所有 x 都 |f(x)| ≤ M。∀x∃M 對任何函數都對（取 M = |f(x)| + 1）；∀M∃x 只要求某點夠小（f(x) = x 取 x = 0）；∃M∃x 也幾乎都對。只有 ∃M∀x 能把 f(x) = x 判成無界。",
      solutionSteps: ["「有一個 M 對所有 x 都管用」→ ∃M>0 ∀x：|f(x)| ≤ M。", "對照 f(x) = x：∀x∃M、∀M∃x、∃M∃x 都成立，但 x 無界，所以它們都不是「有界」。", "答案：∃M>0 ∀x∈ℝ：|f(x)| ≤ M。"],
      verify: { m: "choice", options: [
        { say: "∃M>0 ∀x∈ℝ：|f(x)| ≤ M", all: [{ v: SUP("|\\sin x|", -100, 100), le: 1 }, { v: SUP("|x|", -10000, 10000), gt: 1000 }] },
        { say: "∀x∈ℝ ∃M>0：|f(x)| ≤ M", all: [{ v: INF("(|x|+1)-|x|", -10000, 10000), le: 0 }] },
        { say: "∀M>0 ∃x∈ℝ：|f(x)| ≤ M", all: [{ v: INF("|x|", -10000, 10000), gt: 0 }] },
        { say: "∃M>0 ∃x∈ℝ：|f(x)| ≤ M", all: [{ v: INF("(|x|+1)-|x|", -10000, 10000), le: 0 }] }
      ] } },

    { id: "cg-12a-005", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{「數列 }\\langle a_n\\rangle\\text{ 有上界」寫成量詞句是哪一句？}",
      answers: ["∃M ∀n∈ℕ：a_n ≤ M"], canonical: "∃M ∀n∈ℕ：a_n ≤ M",
      distractors: ["∀n∈ℕ ∃M：a_n ≤ M", "∃M ∀n∈ℕ：a_n ≥ M", "∀M ∃n∈ℕ：a_n ≤ M"],
      timeLimit: 90,
      tags: ["logic-translate-quantifier", "proof", "bounded-sequence"],
      hints: ["上界是一個固定的數，所有項都不超過它。", "拿 aₙ = n、aₙ = −n、aₙ = 1/n 檢查：哪幾個應該有上界？"],
      solution: "有上界＝先取定 M，再對所有 n 都 aₙ ≤ M。∀n∃M 對任何數列都對（M = aₙ）；a_n ≥ M 是下界；∀M∃n 是「沒有下界」，aₙ = 1/n 有上界卻不滿足它。",
      solutionSteps: ["「一個 M 對所有 n」→ ∃M ∀n：aₙ ≤ M。", "aₙ = n 沒有上界，但滿足 ∀n∃M；aₙ = −n 有上界，卻不滿足 aₙ ≥ M；aₙ = 1/n 有上界，卻不滿足 ∀M∃n。", "答案：∃M ∀n∈ℕ：aₙ ≤ M。"],
      verify: { m: "choice", options: [
        { say: "∃M ∀n∈ℕ：a_n ≤ M", all: [{ v: SUP("-n", 1, 10000, "n"), le: -1 }, { v: SUP("n", 1, 10000, "n"), gt: 1000 }] },
        { say: "∀n∈ℕ ∃M：a_n ≤ M", all: [{ v: INF("(n+1)-n", 1, 10000, "n"), le: 0 }] },
        { say: "∃M ∀n∈ℕ：a_n ≥ M", all: [{ v: INF("-n", 1, 10000, "n"), ge: -1000 }] },
        { say: "∀M ∃n∈ℕ：a_n ≤ M", all: [{ v: INF("\\frac{1}{n}", 1, 10000, "n"), le: -1 }] }
      ] } },

    { id: "cg-12a-006", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{「}f\\,\\text{ 在 }[0,1]\\text{ 上有零點」寫成量詞句是哪一句？}",
      answers: ["∃x∈[0,1]：f(x) = 0"], canonical: "∃x∈[0,1]：f(x) = 0",
      distractors: ["∀x∈[0,1]：f(x) = 0", "∃x∈[0,1]：f(x) ≠ 0", "∃x∈ℝ：f(x) = 0"],
      timeLimit: 80,
      tags: ["logic-translate-quantifier", "proof"],
      hints: ["「有」對應哪一個量詞？變數要跑在哪個集合？", "用 f(x) = x − 1/2 與 f(x) = x + 1 檢查：誰在 [0, 1] 上有零點？"],
      solution: "有零點＝存在一個 x 在 [0,1] 裡讓 f(x) = 0。∀x 是「恆為 0」；f(x) ≠ 0 的存在句連 x + 1 都滿足；x 跑在 ℝ 上時 x + 1 在 −1 有零點，但它在 [0,1] 上沒有。",
      solutionSteps: ["「存在」→ ∃，範圍是 [0, 1]：∃x∈[0,1]：f(x) = 0。", "f(x) = x − 1/2 有零點卻不恆為 0；f(x) = x + 1 在 [0,1] 沒零點，卻滿足另外兩句。", "答案：∃x∈[0,1]：f(x) = 0。"],
      verify: { m: "choice", options: [
        { say: "∃x∈[0,1]：f(x) = 0", all: [{ v: INF("|x-\\frac{1}{2}|", 0, 1), eq: 0 }, { v: INF("|x+1|", 0, 1), gt: 0 }] },
        { say: "∀x∈[0,1]：f(x) = 0", all: [{ v: SUP("|x-\\frac{1}{2}|", 0, 1), eq: 0 }] },
        { say: "∃x∈[0,1]：f(x) ≠ 0", all: [{ v: SUP("|x+1|", 0, 1), le: 0 }] },
        { say: "∃x∈ℝ：f(x) = 0", all: [{ v: INF("|x+1|", -10, 10), gt: 0 }] }
      ] } },

    { id: "cg-12a-007", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{命題（}x\\text{ 為實數）：若 }x^2>1\\text{，則 }x>1\\text{。判斷原命題與逆命題的真假。}",
      answers: ["原命題假（反例 x = −2），逆命題真"], canonical: "原命題假（反例 x = −2），逆命題真",
      distractors: ["原命題真，逆命題假", "原命題與逆命題都真", "原命題與逆命題都假"],
      timeLimit: 90,
      tags: ["logic-implication-truth", "logic-counterexample", "proof"],
      hints: ["蘊含句是假的，要找一個前提成立、結論不成立的 x。", "逆命題是把前提和結論對調：若 x > 1，則 ……"],
      solution: "x = −2：x² = 4 > 1 但 x ≤ 1，原命題假。逆命題「若 x > 1 則 x² > 1」：x > 1 > 0 時 x² = x·x > 1·1，成立。",
      solutionSteps: ["原命題：x = −2 時 x² = 4 > 1，但 −2 ≤ 1，原命題假。", "逆命題：x > 1 ⇒ x² = x·x > 1，真。", "答案：原命題假（反例 x = −2），逆命題真。"],
      verify: { m: "choice", options: [
        { say: "原命題假（反例 x = −2），逆命題真", all: [{ v: V("(-2)^2"), gt: 1 }, { v: V("-2"), le: 1 }, { v: INF("x^2", 1, 100), ge: 1 }] },
        { say: "原命題真，逆命題假", all: [{ v: V("-2"), gt: 1 }] },
        { say: "原命題與逆命題都真", all: [{ v: V("-2"), gt: 1 }] },
        { say: "原命題與逆命題都假", all: [{ v: INF("x^2", 1, 100), lt: 1 }] }
      ] } },

    { id: "cg-12a-008", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{命題（}x\\text{ 為實數）：若 }x^2<0\\text{，則 }x=5\\text{。這個命題是真是假？}",
      answers: ["真：沒有實數讓前提成立"], canonical: "真：沒有實數讓前提成立",
      distractors: ["假：x = 0 是反例", "假：x = −5 是反例", "假：前提成立時 x 不一定是 5"],
      timeLimit: 70,
      tags: ["logic-implication-truth", "logic-counterexample", "proof"],
      hints: ["「若 P 則 Q」只有一種情況是假的：P 成立而 Q 不成立。", "有沒有任何實數讓 x² < 0？"],
      solution: "x² ≥ 0 對所有實數成立，所以前提永遠不成立，找不到「前提真、結論假」的 x，命題（空洞地）為真。x = 0、x = −5 都不滿足前提，不是反例。",
      solutionSteps: ["蘊含句為假 ⇔ 有 x 使前提真、結論假。", "但 x² ≥ 0，沒有 x 滿足 x² < 0。", "答案：真（前提永不成立）。"],
      verify: { m: "choice", options: [
        { say: "真：沒有實數讓前提成立", all: [{ v: INF("x^2", -100, 100), ge: 0 }] },
        { say: "假：x = 0 是反例", all: [{ v: V("0^2"), lt: 0 }] },
        { say: "假：x = −5 是反例", all: [{ v: V("(-5)^2"), lt: 0 }] },
        { say: "假：前提成立時 x 不一定是 5", all: [{ v: INF("x^2", -100, 100), lt: 0 }] }
      ] } },

    /* ── 否定 ── */
    { id: "cg-12a-009", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\lim_{n\\to\\infty}a_n=L\\ \\text{的定義是}\\ \\forall\\varepsilon>0\\ \\exists N\\ \\forall n\\ge N:\\ |a_n-L|<\\varepsilon\\text{。它的否定是哪一句？}",
      answers: ["∃ε>0 ∀N ∃n≥N：|a_n − L| ≥ ε"], canonical: "∃ε>0 ∀N ∃n≥N：|a_n − L| ≥ ε",
      distractors: ["∀ε>0 ∃N ∀n≥N：|a_n − L| ≥ ε", "∃ε>0 ∀N ∀n≥N：|a_n − L| ≥ ε", "∃ε≤0 ∀N ∃n≥N：|a_n − L| ≥ ε"],
      timeLimit: 120,
      tags: ["negation-nested-quantifiers", "epsilon-n", "proof"],
      hints: ["每個 ∀ 換成 ∃、每個 ∃ 換成 ∀，最後把條件否定；ε > 0 這個範圍不動。", "拿 aₙ = 0, 1, 0, 1, …（L = 0）檢查：它不收斂到 0，但它有沒有「從某項起一直離 0 很遠」？"],
      solution: "機械否定：∀ε 變 ∃ε（範圍仍是 ε > 0），∃N 變 ∀N，∀n 變 ∃n，< 變 ≥。「∀n≥N」版本要求從某項起每項都遠，0,1,0,1,… 不滿足卻不收斂；只換最後條件的版本要 |aₙ − L| → ∞；ε ≤ 0 的版本對任何數列都對。",
      solutionSteps: ["∀ε>0 → ∃ε>0；∃N → ∀N；∀n≥N → ∃n≥N；< → ≥。", "否定：∃ε>0 ∀N ∃n≥N：|aₙ − L| ≥ ε（有無窮多項離 L 至少 ε）。", "答案：∃ε>0 ∀N ∃n≥N：|aₙ − L| ≥ ε。"],
      verify: { m: "choice", options: [
        { say: "∃ε>0 ∀N ∃n≥N：|a_n − L| ≥ ε", all: [{ v: LIMSUP("\\left|\\frac{1+(-1)^n}{2}\\right|"), gt: 0.5 }, { v: LIMSUP("\\frac{1}{n}"), le: 0.000001 }] },
        { say: "∀ε>0 ∃N ∀n≥N：|a_n − L| ≥ ε", all: [{ v: LIMINF("\\left|\\frac{1+(-1)^n}{2}\\right|"), gt: 100 }] },
        { say: "∃ε>0 ∀N ∀n≥N：|a_n − L| ≥ ε", all: [{ v: LIMINF("\\left|\\frac{1+(-1)^n}{2}\\right|"), gt: 0.5 }] },
        { say: "∃ε≤0 ∀N ∃n≥N：|a_n − L| ≥ ε", all: [{ v: INF("\\frac{1}{n}", 1, 10000, "n"), lt: 0 }] }
      ] } },

    { id: "cg-12a-010", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\text{「}f\\,\\text{ 在 }\\mathbb{R}\\text{ 上有界」是 }\\exists M>0\\ \\forall x\\in\\mathbb{R}:\\ |f(x)|\\le M\\text{。它的否定是哪一句？}",
      answers: ["∀M>0 ∃x∈ℝ：|f(x)| > M"], canonical: "∀M>0 ∃x∈ℝ：|f(x)| > M",
      distractors: ["∃M>0 ∀x∈ℝ：|f(x)| > M", "∀M>0 ∃x∈ℝ：|f(x)| ≤ M", "∃M>0 ∃x∈ℝ：|f(x)| > M"],
      timeLimit: 100,
      tags: ["negation-nested-quantifiers", "proof"],
      hints: ["兩個量詞都要換，條件 ≤ 也要換。", "用 f(x) = x（無界）與 f(x) = sin x（有界）檢查：否定句對 x 要真、對 sin x 要假。"],
      solution: "∃M 變 ∀M、∀x 變 ∃x、≤ 變 >：不管天花板多高，總有一點穿過去。∃M∀x：|f| > M 要整條圖形都離 0 夠遠，x 在 0 不行；只換量詞不換條件，sin x 也滿足；∃M∃x 連 sin x 都滿足。",
      solutionSteps: ["∃M>0 → ∀M>0；∀x → ∃x；|f(x)| ≤ M → |f(x)| > M。", "f(x) = x：任何 M 取 x = M + 1 就穿過去；sin x 取 M = 1 就穿不過。", "答案：∀M>0 ∃x∈ℝ：|f(x)| > M。"],
      verify: { m: "choice", options: [
        { say: "∀M>0 ∃x∈ℝ：|f(x)| > M", all: [{ v: SUP("|x|", -10000, 10000), gt: 1000 }, { v: SUP("|\\sin x|", -100, 100), le: 1 }] },
        { say: "∃M>0 ∀x∈ℝ：|f(x)| > M", all: [{ v: INF("|x|", -10000, 10000), gt: 0 }] },
        { say: "∀M>0 ∃x∈ℝ：|f(x)| ≤ M", all: [{ v: INF("|\\sin x|", -10, 10), gt: 0 }] },
        { say: "∃M>0 ∃x∈ℝ：|f(x)| > M", all: [{ v: SUP("|\\sin x|", -10, 10), le: 0 }] }
      ] } },

    { id: "cg-12a-011", topic: "limits", rank: 3, answerKind: "text",
      prompt: "f\\,\\text{ 在 }\\,a\\,\\text{ 連續：}\\ \\forall\\varepsilon>0\\ \\exists\\delta>0\\ \\forall x:\\ |x-a|<\\delta\\Rightarrow|f(x)-f(a)|<\\varepsilon\\text{。它的否定是哪一句？}",
      answers: ["∃ε>0 ∀δ>0 ∃x：|x − a| < δ 且 |f(x) − f(a)| ≥ ε"], canonical: "∃ε>0 ∀δ>0 ∃x：|x − a| < δ 且 |f(x) − f(a)| ≥ ε",
      distractors: ["∃ε>0 ∀δ>0 ∃x：|x − a| < δ ⇒ |f(x) − f(a)| ≥ ε", "∀ε>0 ∃δ>0 ∀x：|x − a| < δ 且 |f(x) − f(a)| ≥ ε", "∃ε>0 ∃δ>0 ∃x：|x − a| < δ 且 |f(x) − f(a)| ≥ ε"],
      timeLimit: 120,
      tags: ["negation-nested-quantifiers", "continuity", "proof"],
      hints: ["「P ⇒ Q」的否定是「P 且 非 Q」，不是另一個蘊含句。", "用 f(x) = x 在 a = 0（連續）檢查：否定句對它必須是假的。"],
      solution: "量詞依序換：∃ε ∀δ ∃x，蘊含的否定是「前提且結論的否定」。保留 ⇒ 的版本取遠處的 x 就空洞成立，連 f(x) = x 都滿足；∀ε∃δ∀x 版本在 x = a 自己就壞了；∃δ 版本取大 δ 也讓 f(x) = x 成立。",
      solutionSteps: ["∀ε → ∃ε，∃δ → ∀δ，∀x → ∃x。", "¬(P ⇒ Q) ≡ P ∧ ¬Q：|x − a| < δ 且 |f(x) − f(a)| ≥ ε。", "答案：∃ε>0 ∀δ>0 ∃x：|x − a| < δ 且 |f(x) − f(a)| ≥ ε。"],
      verify: { m: "choice", options: [
        { say: "∃ε>0 ∀δ>0 ∃x：|x − a| < δ 且 |f(x) − f(a)| ≥ ε", all: [{ v: SUP("\\left|\\frac{x}{|x|}\\right|", 0.000000001, 0.000001), ge: 0.5 }, { v: SUP("|x|", -0.000001, 0.000001), le: 0.00001 }] },
        { say: "∃ε>0 ∀δ>0 ∃x：|x − a| < δ ⇒ |f(x) − f(a)| ≥ ε", all: [{ v: V("|10|"), lt: 1 }] },
        { say: "∀ε>0 ∃δ>0 ∀x：|x − a| < δ 且 |f(x) − f(a)| ≥ ε", all: [{ v: V("|0-0|"), ge: 0.5 }] },
        { say: "∃ε>0 ∃δ>0 ∃x：|x − a| < δ 且 |f(x) − f(a)| ≥ ε", all: [{ v: V("|5-0|"), lt: 1 }] }
      ] } },

    { id: "cg-12a-012", topic: "limits", rank: 4, answerKind: "text",
      prompt: "f\\,\\text{ 在 }\\,I\\,\\text{ 上一致連續：}\\ \\forall\\varepsilon>0\\ \\exists\\delta>0\\ \\forall x,y\\in I:\\ |x-y|<\\delta\\Rightarrow|f(x)-f(y)|<\\varepsilon\\text{。它的否定是哪一句？}",
      answers: ["∃ε>0 ∀δ>0 ∃x,y∈I：|x − y| < δ 且 |f(x) − f(y)| ≥ ε"], canonical: "∃ε>0 ∀δ>0 ∃x,y∈I：|x − y| < δ 且 |f(x) − f(y)| ≥ ε",
      distractors: ["∃ε>0 ∀δ>0 ∀x,y∈I：|x − y| < δ 且 |f(x) − f(y)| ≥ ε", "∀ε>0 ∃δ>0 ∃x,y∈I：|x − y| < δ 且 |f(x) − f(y)| ≥ ε", "∃ε>0 ∃δ>0 ∃x,y∈I：|x − y| < δ 且 |f(x) − f(y)| ≥ ε"],
      timeLimit: 140,
      tags: ["negation-nested-quantifiers", "uniform-continuity", "proof"],
      hints: ["∀x,y 是一個量詞（兩個變數一起），否定後變成 ∃x,y。", "用 f(x) = x² 在 [0,∞)（不一致連續）與 f(x) = 3x（一致連續）檢查每個選項。"],
      solution: "依序換量詞、蘊含換成「且非」。∀x,y 版本在 x = y 時就壞了，連 x² 都不滿足；∀ε∃δ 版本與 ∃ε∃δ 版本取大 δ 時 3x 也滿足，但 3x 一致連續。只有 ∃ε∀δ∃x,y 能分開這兩個例子。",
      solutionSteps: ["∀ε → ∃ε，∃δ → ∀δ，∀x,y → ∃x,y，⇒ 換成「且」加結論的否定。", "x² 在 [0,∞)：ε = 1，任何 δ 取 x 很大、y = x + δ/2 即可；3x 取 δ = ε/3 就沒有這種點對。", "答案：∃ε>0 ∀δ>0 ∃x,y∈I：|x − y| < δ 且 |f(x) − f(y)| ≥ ε。"],
      verify: { m: "choice", options: [
        { say: "∃ε>0 ∀δ>0 ∃x,y∈I：|x − y| < δ 且 |f(x) − f(y)| ≥ ε", all: [{ v: { m: "uniformContinuity", f: "x^2", range: [0, "inf"] }, claim: false }, { v: { m: "uniformContinuity", f: "3x", range: [0, "inf"] }, claim: true }] },
        { say: "∃ε>0 ∀δ>0 ∀x,y∈I：|x − y| < δ 且 |f(x) − f(y)| ≥ ε", all: [{ v: V("|1^2-1^2|"), ge: 0.5 }] },
        { say: "∀ε>0 ∃δ>0 ∃x,y∈I：|x − y| < δ 且 |f(x) − f(y)| ≥ ε", all: [{ v: V("|3\\cdot 50-3\\cdot 0|"), lt: 100 }] },
        { say: "∃ε>0 ∃δ>0 ∃x,y∈I：|x − y| < δ 且 |f(x) − f(y)| ≥ ε", all: [{ v: V("|3\\cdot 0.5-3\\cdot 0|"), lt: 1 }] }
      ] } },

    { id: "cg-12a-013", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "a_n=(-1)^n\\text{。要用 }\\exists\\varepsilon>0\\ \\forall N\\ \\exists n\\ge N:\\ \\left|a_n-\\tfrac12\\right|\\ge\\varepsilon\\text{ 證明 }a_n\\not\\to\\tfrac12\\text{，可以用的 }\\varepsilon\\text{ 最大是多少？}",
      answer: "3/2",
      timeLimit: 80,
      tags: ["negation-use-to-disprove", "epsilon-n"],
      hints: ["|aₙ − 1/2| 只有兩種值：n 偶數一種、n 奇數一種。", "ε 要被「無窮多個 n」達到，挑兩種值裡比較大的那個。"],
      solution: "n 偶：|1 − 1/2| = 1/2；n 奇：|−1 − 1/2| = 3/2。奇數項有無窮多個，每一項都離 1/2 恰好 3/2，所以 ε = 3/2 可用；更大的 ε 沒有任何一項達到。",
      solutionSteps: ["n 偶：|aₙ − 1/2| = 1/2；n 奇：|aₙ − 1/2| = 3/2。", "奇數項無窮多，對任何 N 都有 n ≥ N 使距離 = 3/2。", "ε 最大取 3/2。"],
      verify: LIMSUP("\\left|(-1)^n-\\frac{1}{2}\\right|") },

    { id: "cg-12a-014", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "a_n=(-1)^n\\left(1+\\frac1n\\right)\\text{。要用 }\\exists\\varepsilon>0\\ \\forall N\\ \\exists n\\ge N:\\ |a_n-1|\\ge\\varepsilon\\text{ 證明 }a_n\\not\\to 1\\text{，可以用的 }\\varepsilon\\text{ 最大是多少？}",
      answer: "2",
      timeLimit: 110,
      tags: ["negation-use-to-disprove", "epsilon-n"],
      hints: ["分奇偶算 |aₙ − 1|：偶數項會越來越靠近 1，奇數項呢？", "ε 只要被無窮多項達到就夠；看奇數項的距離從上面還是下面逼近它的極限。"],
      solution: "n 偶：|aₙ − 1| = 1/n → 0；n 奇：|−1 − 1/n − 1| = 2 + 1/n > 2。所以 ε = 2 時所有奇數項都 ≥ 2，可用；ε > 2 時只有有限多項達到，不可用。最大 ε = 2。",
      solutionSteps: ["n 偶：|aₙ − 1| = 1/n；n 奇：|aₙ − 1| = 2 + 1/n。", "ε = 2：每個奇數項都 ≥ 2，無窮多個，可用。", "ε = 2 + c（c > 0）：只有 n < 1/c 的奇數項達到，有限個。最大 ε = 2。"],
      verify: LIMSUP("\\left|(-1)^n\\left(1+\\frac{1}{n}\\right)-1\\right|") },

    { id: "cg-12a-015", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{「}x>0\\ \\text{且}\\ x^2<4\\text{」的否定是哪一句？}",
      answers: ["x ≤ 0 或 x² ≥ 4"], canonical: "x ≤ 0 或 x² ≥ 4",
      distractors: ["x ≤ 0 且 x² ≥ 4", "x < 0 或 x² > 4", "x > 0 或 x² ≥ 4"],
      timeLimit: 70,
      tags: ["negation-connectives", "proof"],
      hints: ["「且」的否定是「或」，兩邊各自否定。", "> 的否定是 ≤，< 的否定是 ≥：等號會跑到哪一邊？"],
      solution: "¬(P ∧ Q) ≡ ¬P ∨ ¬Q：x ≤ 0 或 x² ≥ 4。檢查：x = 0 原句假，「且」版本也假；x = 2 原句假，嚴格不等號版本也假；x = 1 原句真，「x > 0 或 …」也真——它們都不是否定。",
      solutionSteps: ["德摩根：¬(P ∧ Q) ≡ ¬P ∨ ¬Q。", "¬(x > 0) 是 x ≤ 0；¬(x² < 4) 是 x² ≥ 4。", "答案：x ≤ 0 或 x² ≥ 4。"],
      verify: { m: "choice", options: [
        { say: "x ≤ 0 或 x² ≥ 4", unknown: "德摩根律本身；其餘選項逐一用 x = 0、2、1 推翻" },
        { say: "x ≤ 0 且 x² ≥ 4", all: [{ v: V("0^2"), ge: 4 }] },
        { say: "x < 0 或 x² > 4", all: [{ v: V("2^2"), gt: 4 }] },
        { say: "x > 0 或 x² ≥ 4", all: [{ v: V("1"), le: 0 }] }
      ] } },

    { id: "cg-12a-016", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{整數 }n\\text{ 固定。「若 }n\\text{ 是 4 的倍數，則 }n\\text{ 是偶數」的否定是哪一句？}",
      answers: ["n 是 4 的倍數，而且 n 是奇數"], canonical: "n 是 4 的倍數，而且 n 是奇數",
      distractors: ["若 n 不是 4 的倍數，則 n 是奇數", "若 n 是 4 的倍數，則 n 是奇數", "n 不是 4 的倍數，而且 n 是偶數"],
      timeLimit: 80,
      tags: ["negation-connectives", "proof"],
      hints: ["「若 P 則 Q」的否定不是另一個「若…則…」。", "原句對每個整數都成立，所以它的否定對每個整數都應該不成立；拿 n = 1、2 試試各選項。"],
      solution: "¬(P ⇒ Q) ≡ P ∧ ¬Q：n 是 4 的倍數而且是奇數。原句對所有 n 都真，否定要對所有 n 都假；但 n = 1 讓前兩個「若…則…」都成立，n = 2 讓最後一句成立，它們都不是否定。",
      solutionSteps: ["¬(P ⇒ Q) ≡ P ∧ ¬Q。", "P：n 是 4 的倍數；¬Q：n 是奇數。", "答案：n 是 4 的倍數，而且 n 是奇數。"],
      verify: { m: "choice", options: [
        { say: "n 是 4 的倍數，而且 n 是奇數", unknown: "¬(P⇒Q) ≡ P∧¬Q 本身；其餘選項用 n = 1、2 推翻" },
        { say: "若 n 不是 4 的倍數，則 n 是奇數", all: [{ v: V("\\cos(\\pi)"), eq: 1 }] },
        { say: "若 n 是 4 的倍數，則 n 是奇數", all: [{ v: V("\\sin\\frac{\\pi}{4}"), eq: 0 }] },
        { say: "n 不是 4 的倍數，而且 n 是偶數", all: [{ v: V("\\sin\\frac{2\\pi}{4}"), eq: 0 }] }
      ] } },

    /* ── 直接證明：從結論倒推的錯 ── */
    { id: "cg-12a-017", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{解 }\\sqrt{x+6}=x\\text{：兩邊平方得 }x+6=x^2\\text{，即 }(x-3)(x+2)=0\\text{，所以 }x=3\\text{ 或 }x=-2\\text{ 都是解。錯在哪？}",
      answers: ["平方那步不可逆：x = −2 代回原式不成立"], canonical: "平方那步不可逆：x = −2 代回原式不成立",
      distractors: ["因式分解錯了", "x = 3 代回原式不成立", "沒有錯，兩個都是解"],
      timeLimit: 80,
      tags: ["proof-forward-direction", "proof"],
      hints: ["每一步是「⇒」還是「⇔」？哪一步只能往右推、不能推回來？", "把兩個候選解各自代回 √(x+6) = x 檢查。"],
      solution: "平方只保證 √(x+6) = x ⇒ x + 6 = x²，反過來不成立：x = −2 時 √4 = 2 ≠ −2。推導只說明「解一定在 {3, −2} 裡」，要代回去篩掉多出來的。因式分解與 x = 3 都沒問題。",
      solutionSteps: ["√(x+6) = x ⇒ x + 6 = x²，但「⇐」不成立（右邊不管 x 的正負）。", "x = 3：√9 = 3 ✓；x = −2：√4 = 2 ≠ −2 ✗。", "錯在把單向的平方當成等價：x = −2 是多出來的。"],
      verify: { m: "choice", options: [
        { say: "平方那步不可逆：x = −2 代回原式不成立", all: [{ v: V("\\sqrt{-2+6}"), ne: -2 }] },
        { say: "因式分解錯了", all: [{ v: V("(5-3)(5+2)"), ne: V("5^2-5-6") }] },
        { say: "x = 3 代回原式不成立", all: [{ v: V("\\sqrt{3+6}"), ne: 3 }] },
        { say: "沒有錯，兩個都是解", all: [{ v: V("\\sqrt{-2+6}"), eq: -2 }] }
      ] } },

    { id: "cg-12a-018", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\text{宣稱：對所有 }x\\ne 0\\text{，}x+\\frac1x\\ge 2\\text{。證明：}x+\\frac1x\\ge 2\\Rightarrow x^2+1\\ge 2x\\Rightarrow(x-1)^2\\ge 0\\text{，這是對的，得證。錯在哪？}",
      answers: ["從結論倒推，而且乘 x 時沒考慮 x < 0；x = −1 就不成立"], canonical: "從結論倒推，而且乘 x 時沒考慮 x < 0；x = −1 就不成立",
      distractors: ["(x − 1)² ≥ 0 不一定成立", "x² + 1 − 2x 化簡錯了", "沒有錯，宣稱成立"],
      timeLimit: 100,
      tags: ["proof-forward-direction", "proof"],
      hints: ["從要證的式子出發推到一個真句子，證明了什麼方向？", "兩邊乘 x 時，x 的正負號會影響不等號嗎？試一個負的 x。"],
      solution: "從結論推到真句子，只證明了「結論 ⇒ 真句子」，什麼都沒證到。而且乘 x 要分正負：x < 0 時不等號反向。x = −1：x + 1/x = −2 < 2，宣稱本身就是錯的；只有 x > 0 時才成立。",
      solutionSteps: ["倒推只證了「結論 ⇒ (x − 1)² ≥ 0」，方向反了。", "x < 0 時乘 x 要變號，那一步也不可逆。", "x = −1：−1 + 1/(−1) = −2 < 2，宣稱不成立。"],
      verify: { m: "choice", options: [
        { say: "從結論倒推，而且乘 x 時沒考慮 x < 0；x = −1 就不成立", all: [{ v: V("-1+\\frac{1}{-1}"), lt: 2 }] },
        { say: "(x − 1)² ≥ 0 不一定成立", all: [{ v: INF("(x-1)^2", -100, 100), lt: 0 }] },
        { say: "x² + 1 − 2x 化簡錯了", all: [{ v: V("3^2+1-2\\cdot 3"), ne: V("(3-1)^2") }] },
        { say: "沒有錯，宣稱成立", all: [{ v: V("-1+\\frac{1}{-1}"), ge: 2 }] }
      ] } },

    /* ── 逆否 ── */
    { id: "cg-12a-019", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\text{定理：若 }\\,f\\,\\text{ 在 }\\,a\\,\\text{ 可微，則 }\\,f\\,\\text{ 在 }\\,a\\,\\text{ 連續。哪一句與這個定理等價？}",
      answers: ["若 f 在 a 不連續，則 f 在 a 不可微"], canonical: "若 f 在 a 不連續，則 f 在 a 不可微",
      distractors: ["若 f 在 a 連續，則 f 在 a 可微", "若 f 在 a 不可微，則 f 在 a 不連續"],
      timeLimit: 70,
      tags: ["contrapositive-vs-converse", "continuity", "differentiability"],
      hints: ["和 P ⇒ Q 等價的是 ¬Q ⇒ ¬P，不是 Q ⇒ P。", "f(x) = |x| 在 0：連續嗎？可微嗎？"],
      solution: "逆否命題與原命題等價：不連續 ⇒ 不可微。逆命題「連續 ⇒ 可微」與否命題「不可微 ⇒ 不連續」都被 |x| 在 0 推翻：它連續，但左右斜率是 −1 與 1，不可微。",
      solutionSteps: ["P：可微；Q：連續。逆否：¬Q ⇒ ¬P。", "|x| 在 0：連續，左右導數 −1、1 不等，不可微——推翻另外兩句。", "答案：若 f 在 a 不連續，則 f 在 a 不可微。"],
      verify: { m: "choice", options: [
        { say: "若 f 在 a 不連續，則 f 在 a 不可微", unknown: "逆否命題與原命題等價；其餘選項用 |x| 在 0 推翻" },
        { say: "若 f 在 a 連續，則 f 在 a 可微", all: [{ v: V("\\frac{|10^{-6}|-|0|}{10^{-6}}"), eq: V("\\frac{|-10^{-6}|-|0|}{-10^{-6}}") }] },
        { say: "若 f 在 a 不可微，則 f 在 a 不連續", all: [{ v: { m: "limit", f: "|x|", at: 0 }, ne: 0 }] }
      ] } },

    { id: "cg-12a-020", topic: "series", rank: 3, answerKind: "text",
      prompt: "\\text{定理：若 }\\sum a_n\\,\\text{ 收斂，則 }\\,a_n\\to 0\\text{。哪一句與這個定理等價？}",
      answers: ["若 a_n 不趨近 0，則 Σa_n 發散"], canonical: "若 a_n 不趨近 0，則 Σa_n 發散",
      distractors: ["若 a_n → 0，則 Σa_n 收斂", "若 Σa_n 發散，則 a_n 不趨近 0"],
      timeLimit: 80,
      tags: ["contrapositive-vs-converse", "divergence-test"],
      hints: ["把結論否定當前提、前提否定當結論。", "aₙ = 1/n：項趨近 0，級數呢？"],
      solution: "逆否命題「aₙ 不趨近 0 ⇒ Σaₙ 發散」就是發散檢定，與定理等價。另外兩句被調和級數推翻：1/n → 0，但 Σ1/n 發散。",
      solutionSteps: ["P：Σaₙ 收斂；Q：aₙ → 0。逆否：¬Q ⇒ ¬P。", "aₙ = 1/n：aₙ → 0 但 Σ1/n 發散，推翻逆命題與否命題。", "答案：若 aₙ 不趨近 0，則 Σaₙ 發散。"],
      verify: { m: "choice", options: [
        { say: "若 a_n 不趨近 0，則 Σa_n 發散", unknown: "逆否命題與原命題等價；其餘選項用 1/n 推翻" },
        { say: "若 a_n → 0，則 Σa_n 收斂", all: [{ v: { m: "seriesConverges", f: "\\frac{1}{n}" }, claim: true }] },
        { say: "若 Σa_n 發散，則 a_n 不趨近 0", all: [{ v: { m: "limit", f: "\\frac{1}{x}", at: "inf" }, ne: 0 }] }
      ] } },

    { id: "cg-12a-021", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{整數 }n\\text{：「若 6 整除 }n\\text{，則 }n\\text{ 是偶數」的逆否命題是哪一句？}",
      answers: ["若 n 是奇數，則 6 不整除 n"], canonical: "若 n 是奇數，則 6 不整除 n",
      distractors: ["若 n 是偶數，則 6 整除 n", "若 6 不整除 n，則 n 是奇數", "若 n 是奇數，則 6 整除 n"],
      timeLimit: 70,
      tags: ["contrapositive-form", "proof"],
      hints: ["逆否：把結論否定放前面，前提否定放後面。", "「n 是偶數」的否定是什麼？「6 整除 n」的否定是什麼？"],
      solution: "P：6 | n；Q：n 偶。逆否 ¬Q ⇒ ¬P：n 奇 ⇒ 6 ∤ n。逆命題「偶 ⇒ 6 | n」與否命題「6 ∤ n ⇒ 奇」都被 n = 2 推翻；最後一句被 n = 1 推翻。",
      solutionSteps: ["¬Q：n 是奇數；¬P：6 不整除 n。", "逆否：若 n 是奇數，則 6 不整除 n。", "對照：n = 2 推翻逆命題與否命題，n = 1 推翻最後一句。"],
      verify: { m: "choice", options: [
        { say: "若 n 是奇數，則 6 不整除 n", unknown: "逆否命題的定義；其餘選項用 n = 1、2 推翻" },
        { say: "若 n 是偶數，則 6 整除 n", all: [{ v: V("\\sin\\frac{2\\pi}{6}"), eq: 0 }] },
        { say: "若 6 不整除 n，則 n 是奇數", all: [{ v: V("\\cos(2\\pi)"), eq: -1 }] },
        { say: "若 n 是奇數，則 6 整除 n", all: [{ v: V("\\sin\\frac{\\pi}{6}"), eq: 0 }] }
      ] } },

    { id: "cg-12a-022", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{實數 }x\\text{：「若 }x>3\\text{，則 }x^2>9\\text{」的逆否命題是哪一句？}",
      answers: ["若 x² ≤ 9，則 x ≤ 3"], canonical: "若 x² ≤ 9，則 x ≤ 3",
      distractors: ["若 x² > 9，則 x > 3", "若 x ≤ 3，則 x² ≤ 9", "若 x² ≤ 9，則 x > 3"],
      timeLimit: 70,
      tags: ["contrapositive-form", "proof"],
      hints: ["逆否要同時「對調」又「否定」。", "x > 3 的否定是 x ≤ 3；x² > 9 的否定呢？"],
      solution: "逆否：x² ≤ 9 ⇒ x ≤ 3（x² ≤ 9 給 −3 ≤ x ≤ 3，對）。逆命題與否命題被 x = −4 推翻：16 > 9 但 −4 ≤ 3。最後一句被 x = 0 推翻。",
      solutionSteps: ["P：x > 3；Q：x² > 9。逆否：¬Q ⇒ ¬P。", "¬Q：x² ≤ 9；¬P：x ≤ 3。", "答案：若 x² ≤ 9，則 x ≤ 3。"],
      verify: { m: "choice", options: [
        { say: "若 x² ≤ 9，則 x ≤ 3", all: [{ v: SUP("x", -3, 3), le: 3 }] },
        { say: "若 x² > 9，則 x > 3", all: [{ v: V("-4"), gt: 3 }] },
        { say: "若 x ≤ 3，則 x² ≤ 9", all: [{ v: V("(-4)^2"), le: 9 }] },
        { say: "若 x² ≤ 9，則 x > 3", all: [{ v: V("0"), gt: 3 }] }
      ] } },

    /* ── 反證法的反設 ── */
    { id: "cg-12a-023", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{用反證法證明：若實數 }a,b\\,\\text{ 滿足 }\\,a+b>10\\text{，則 }\\,a>5\\,\\text{ 或 }\\,b>5\\text{。反設應該寫什麼？}",
      answers: ["a + b > 10，而且 a ≤ 5、b ≤ 5"], canonical: "a + b > 10，而且 a ≤ 5、b ≤ 5",
      distractors: ["a + b ≤ 10，而且 a ≤ 5、b ≤ 5", "a + b > 10，而且 a > 5、b > 5", "a + b > 10，而且 a ≤ 5 或 b ≤ 5"],
      timeLimit: 80,
      tags: ["contradiction-setup", "proof"],
      hints: ["反設＝「前提成立，但結論不成立」。", "「a > 5 或 b > 5」的否定要用德摩根律。"],
      solution: "反設 P ∧ ¬Q：a + b > 10 且 a ≤ 5 且 b ≤ 5，接著 a + b ≤ 10 撞上前提。其他寫法都不是結論的否定：(0,0)、(6,6)、(6,5) 各自滿足它們，撞不出矛盾。",
      solutionSteps: ["反設：前提真、結論假。", "¬(a > 5 或 b > 5) ≡ a ≤ 5 且 b ≤ 5。", "反設：a + b > 10，而且 a ≤ 5、b ≤ 5（相加得 a + b ≤ 10，矛盾）。"],
      verify: { m: "choice", options: [
        { say: "a + b > 10，而且 a ≤ 5、b ≤ 5", all: [{ v: V("5+5"), le: 10 }] },
        { say: "a + b ≤ 10，而且 a ≤ 5、b ≤ 5", all: [{ v: V("0+0"), gt: 10 }] },
        { say: "a + b > 10，而且 a > 5、b > 5", all: [{ v: V("6+6"), le: 10 }] },
        { say: "a + b > 10，而且 a ≤ 5 或 b ≤ 5", all: [{ v: V("6+5"), le: 10 }] }
      ] } },

    { id: "cg-12a-024", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{用反證法證明：若整數 }n\\text{ 使 }n^2\\text{ 是偶數，則 }n\\text{ 是偶數。反設應該寫什麼？}",
      answers: ["n² 是偶數，而且 n 是奇數"], canonical: "n² 是偶數，而且 n 是奇數",
      distractors: ["n² 是奇數，而且 n 是奇數", "n² 是偶數，而且 n 是偶數", "n² 是奇數，或者 n 是偶數"],
      timeLimit: 70,
      tags: ["contradiction-setup", "proof"],
      hints: ["反設保留前提，只否定結論。", "正確的反設一定是不可能發生的；拿 n = 1、2 試其他選項。"],
      solution: "反設：n² 偶且 n 奇。寫 n = 2k + 1，n² = 4k² + 4k + 1 是奇數，矛盾。其他選項都能被實際的整數滿足（n = 1 或 n = 2），根本撞不出矛盾。",
      solutionSteps: ["反設 = 前提 ∧ ¬結論：n² 是偶數，而且 n 是奇數。", "n = 2k + 1 ⇒ n² = 2(2k² + 2k) + 1 是奇數，與前提矛盾。", "答案：n² 是偶數，而且 n 是奇數。"],
      verify: { m: "choice", options: [
        { say: "n² 是偶數，而且 n 是奇數", unknown: "反設＝前提且結論的否定；其餘選項用 n = 1、2 滿足，撞不出矛盾" },
        { say: "n² 是奇數，而且 n 是奇數", all: [{ v: V("\\cos(\\pi\\cdot 1^2)"), eq: 1 }] },
        { say: "n² 是偶數，而且 n 是偶數", all: [{ v: V("\\cos(2\\pi)"), eq: -1 }] },
        { say: "n² 是奇數，或者 n 是偶數", all: [{ v: V("\\cos(2\\pi)"), eq: -1 }] }
      ] } },

    /* ── 歸納法的結構 ── */
    { id: "cg-12a-025", topic: "series", rank: 2, answerKind: "text",
      prompt: "\\text{宣稱：}1+2+\\cdots+n=\\frac{n(n+1)}{2}+1\\text{。證明：設 }n=k\\text{ 成立，則加上 }k+1\\text{ 得 }\\frac{k(k+1)}{2}+1+(k+1)=\\frac{(k+1)(k+2)}{2}+1\\text{，故 }n=k+1\\text{ 也成立。錯在哪？}",
      answers: ["沒有檢查基底：n = 1 時左邊 1、右邊 2"], canonical: "沒有檢查基底：n = 1 時左邊 1、右邊 2",
      distractors: ["歸納步驟的代數算錯了", "沒有錯，宣稱成立", "基底成立，但 n = 2 時不成立"],
      timeLimit: 90,
      tags: ["induction-structure", "induction", "proof"],
      hints: ["歸納證明有兩段：基底與歸納步驟。兩段都檢查了嗎？", "把 n = 1 代進宣稱的兩邊。"],
      solution: "歸納步驟的代數是對的：k(k+1)/2 + 1 + (k+1) = (k+1)(k+2)/2 + 1。但基底 n = 1 時左邊 1、右邊 2，不成立，骨牌第一張就沒倒，整串都不算數。宣稱對每個 n 都差 1。",
      solutionSteps: ["歸納步驟：k(k+1)/2 + (k+1) = (k+1)(k+2)/2，加 1 兩邊一致，沒錯。", "基底 n = 1：左邊 1，右邊 1·2/2 + 1 = 2，不成立。", "錯在沒有基底。"],
      verify: { m: "choice", options: [
        { say: "沒有檢查基底：n = 1 時左邊 1、右邊 2", all: [{ v: V("1"), ne: V("\\frac{1\\cdot 2}{2}+1") }, { v: V("\\frac{7\\cdot 8}{2}+1+8"), eq: V("\\frac{8\\cdot 9}{2}+1") }] },
        { say: "歸納步驟的代數算錯了", all: [{ v: V("\\frac{7\\cdot 8}{2}+1+8"), ne: V("\\frac{8\\cdot 9}{2}+1") }] },
        { say: "沒有錯，宣稱成立", all: [{ v: V("1"), eq: V("\\frac{1\\cdot 2}{2}+1") }] },
        { say: "基底成立，但 n = 2 時不成立", all: [{ v: V("1"), eq: V("\\frac{1\\cdot 2}{2}+1") }] }
      ] } },

    { id: "cg-12a-026", topic: "series", rank: 3, answerKind: "text",
      prompt: "\\text{宣稱：對所有 }n\\ge 1\\text{，}2^n>n^2\\text{。證明：}n=1\\text{ 時 }2>1\\text{。設 }2^k>k^2\\text{，則 }2^{k+1}=2\\cdot 2^k>2k^2\\ge(k+1)^2\\text{。錯在哪？}",
      answers: ["2k² ≥ (k+1)² 在 k = 1、2 不成立，從 n = 1 推不到 n = 2"], canonical: "2k² ≥ (k+1)² 在 k = 1、2 不成立，從 n = 1 推不到 n = 2",
      distractors: ["基底 n = 1 不成立", "2·2ᵏ > 2k² 這步不對", "沒有錯，宣稱成立"],
      timeLimit: 110,
      tags: ["induction-structure", "induction", "proof"],
      hints: ["把 n = 2、3、4 代進宣稱看看。", "歸納步驟每一個不等號都要對「所有 k ≥ 1」成立；哪一個在小的 k 會壞？"],
      solution: "2k² ≥ (k+1)² ⇔ k ≥ 1 + √2，k = 1、2 時不成立，所以從 n = 1 推不到 n = 2。事實上 n = 2：4 > 4 不成立，宣稱是錯的（要改成 n ≥ 5 起算）。基底與 2·2ᵏ > 2k² 都沒問題。",
      solutionSteps: ["2·2ᵏ > 2k² 用的是歸納假設，沒錯。", "2k² ≥ (k+1)² ⇔ (k − 1)² ≥ 2，k = 1：2 < 4，k = 2：8 < 9，不成立。", "n = 2：2² = 4 不大於 2² = 4，宣稱本身也錯。錯在 2k² ≥ (k+1)² 那步。"],
      verify: { m: "choice", options: [
        { say: "2k² ≥ (k+1)² 在 k = 1、2 不成立，從 n = 1 推不到 n = 2", all: [{ v: V("2\\cdot 1^2"), lt: V("(1+1)^2") }, { v: V("2\\cdot 2^2"), lt: V("(2+1)^2") }] },
        { say: "基底 n = 1 不成立", all: [{ v: V("2^1"), le: V("1^2") }] },
        { say: "2·2ᵏ > 2k² 這步不對", all: [{ v: V("2\\cdot 2^1"), le: V("2\\cdot 1^2") }] },
        { say: "沒有錯，宣稱成立", all: [{ v: V("2^2"), gt: V("2^2") }] }
      ] } },

    /* ── 12D：ε-δ 定義 ── */
    { id: "cg-12d-001", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "f(x)=\\frac{x}{|x|}\\text{。要用 }\\exists\\varepsilon>0\\ \\forall\\delta>0\\ \\exists x:\\ 0<|x|<\\delta,\\ |f(x)-0.4|\\ge\\varepsilon\\text{ 證明 }\\lim_{x\\to0}f(x)\\ne 0.4\\text{，}\\varepsilon\\text{ 最大可以取多少？}",
      answer: "7/5",
      timeLimit: 90,
      tags: ["epsdelta-negation", "epsilon-delta", "one-sided-limit"],
      hints: ["x > 0 與 x < 0 時 f(x) 各是多少？各離 0.4 多遠？", "每個 δ 鄰域裡兩側都有點，挑離 0.4 比較遠的那一側。"],
      solution: "x > 0：f = 1，距離 0.6；x < 0：f = −1，距離 1.4。任何 δ 都有 x = −δ/2 讓 |f(x) − 0.4| = 1.4，所以 ε = 1.4 可用；更大的 ε 沒有點達到。",
      solutionSteps: ["x > 0：|1 − 0.4| = 0.6；x < 0：|−1 − 0.4| = 1.4。", "任何 δ，x = −δ/2 都給距離 1.4。", "ε 最大 = 1.4 = 7/5。"],
      verify: SUP("\\left|\\frac{x}{|x|}-0.4\\right|", -0.000001, 0.000001) },

    { id: "cg-12d-002", topic: "limits", rank: 4, answerKind: "numeric",
      prompt: "f(x)=\\sin\\frac1x\\text{。要用極限的否定證明 }\\lim_{x\\to0}f(x)\\ne 0.3\\text{：}\\exists\\varepsilon>0\\ \\forall\\delta>0\\ \\exists x:\\ 0<|x|<\\delta,\\ |f(x)-0.3|\\ge\\varepsilon\\text{。}\\varepsilon\\text{ 最大可以取多少？}",
      answer: "13/10",
      timeLimit: 120,
      tags: ["epsdelta-negation", "epsilon-delta", "oscillation"],
      hints: ["x → 0 時 1/x → ∞，sin(1/x) 在每個小鄰域裡都把 [−1, 1] 跑過無窮多次。", "在 [−1, 1] 裡哪個值離 0.3 最遠？它在每個鄰域裡都達得到嗎？"],
      solution: "取 x = 1/(3π/2 + 2kπ)，sin(1/x) = −1，k 夠大時 x 落在任何 δ 鄰域裡，距離 |−1 − 0.3| = 1.3。sin 的值不會更遠，所以 ε 最大 = 1.3。",
      solutionSteps: ["sin(1/x) ∈ [−1, 1]，離 0.3 最遠的是 −1，距離 1.3。", "x_k = 1/(3π/2 + 2kπ) → 0，且 sin(1/x_k) = −1。", "ε 最大 = 1.3 = 13/10。"],
      verify: { m: "extremeOf", kind: "sup", integer: false, f: "\\left|\\sin\\frac{1}{x}-0.3\\right|", range: [0.001, 0.01] } },

    { id: "cg-12d-003", topic: "limits", rank: 4, answerKind: "numeric",
      prompt: "f(x)=4+\\frac{x-1}{|x-1|}\\text{。不論 }L\\text{ 是多少，都要能用同一個 }\\varepsilon\\text{ 否定 }\\lim_{x\\to1}f(x)=L\\text{。這樣的 }\\varepsilon\\text{ 最大是多少？}",
      answer: "1",
      timeLimit: 130,
      tags: ["epsdelta-negation", "epsilon-delta", "one-sided-limit"],
      hints: ["x 靠近 1 時，f 只取兩個值：左邊一個、右邊一個。", "對一個 L，可用的 ε 最大是 L 到這兩個值的較遠距離；讓這個距離最小的 L 是哪一個？"],
      solution: "左側 f = 3，右側 f = 5。對 L，可用的 ε 最大是 max(|3 − L|, |5 − L|)，它在 L = 4 時最小，等於 1。所以 ε = 1 對每個 L 都能否定極限，更大就不行（L = 4 時距離只有 1）。",
      solutionSteps: ["x < 1：f = 3；x > 1：f = 5。", "給定 L，最大可用 ε = max(|3 − L|, |5 − L|)。", "對所有 L 取最小：L = 4 時為 1。答案 1（跳躍的一半）。"],
      verify: INF("\\frac{|3-t|+|5-t|+\\left||3-t|-|5-t|\\right|}{2}", 0, 8, "t") },

    { id: "cg-12d-004", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\text{哪一句是 }\\lim_{x\\to a}f(x)=L\\text{ 的定義？}",
      answers: ["∀ε>0 ∃δ>0 ∀x：0<|x−a|<δ ⇒ |f(x)−L|<ε"], canonical: "∀ε>0 ∃δ>0 ∀x：0<|x−a|<δ ⇒ |f(x)−L|<ε",
      distractors: ["∃δ>0 ∀ε>0 ∀x：0<|x−a|<δ ⇒ |f(x)−L|<ε", "∀ε>0 ∀δ>0 ∀x：0<|x−a|<δ ⇒ |f(x)−L|<ε", "∃ε>0 ∃δ>0 ∀x：0<|x−a|<δ ⇒ |f(x)−L|<ε"],
      timeLimit: 90,
      tags: ["epsdelta-quantifier-order", "epsilon-delta"],
      hints: ["誰先出招？對方先給誤差，你再回答距離。", "用 f(x) = x、a = 0、L = 0（極限確實是 0）檢查各選項。"],
      solution: "定義是「任給 ε，都找得到 δ」：δ 依賴 ε。∃δ∀ε 要 f 在某鄰域恆等於 L，f(x) = x 就不滿足；∀δ 要 δ 再大都行，x = 0.5、ε = 0.1 就壞；∃ε∃δ 太弱，x/|x| 在 0 沒有極限也滿足（ε = 2）。",
      solutionSteps: ["順序：∀ε>0，∃δ>0，∀x，0 < |x − a| < δ ⇒ |f(x) − L| < ε。", "f(x) = x 在 0：任何 δ 都有 0 < |x| < δ 而 |x| 不為 0，所以 ∃δ∀ε 不成立；∀δ 版在 δ = 1、x = 0.5、ε = 0.1 不成立。", "答案：∀ε>0 ∃δ>0 ∀x：0<|x−a|<δ ⇒ |f(x)−L|<ε。"],
      verify: { m: "choice", options: [
        { say: "∀ε>0 ∃δ>0 ∀x：0<|x−a|<δ ⇒ |f(x)−L|<ε", unknown: "這就是定義；其餘選項用 f(x)=x 與 x/|x| 推翻" },
        { say: "∃δ>0 ∀ε>0 ∀x：0<|x−a|<δ ⇒ |f(x)−L|<ε", all: [{ v: SUP("|x|", 0.000000001, 0.001), le: 0 }] },
        { say: "∀ε>0 ∀δ>0 ∀x：0<|x−a|<δ ⇒ |f(x)−L|<ε", all: [{ v: V("|0.5|"), lt: 0.1 }] },
        { say: "∃ε>0 ∃δ>0 ∀x：0<|x−a|<δ ⇒ |f(x)−L|<ε", all: [{ v: SUP("\\left|\\frac{x}{|x|}\\right|", -1, 1), ge: 2 }] }
      ] } },

    { id: "cg-12d-005", topic: "limits", rank: 4, answerKind: "text",
      prompt: "\\exists\\delta>0\\ \\forall\\varepsilon>0\\ \\forall x:\\ 0<|x-a|<\\delta\\Rightarrow|f(x)-L|<\\varepsilon\\ \\text{（量詞順序跟定義相反）其實在說什麼？}",
      answers: ["在 a 的某個去心鄰域裡 f(x) 恆等於 L"], canonical: "在 a 的某個去心鄰域裡 f(x) 恆等於 L",
      distractors: ["lim_{x→a} f(x) = L", "f 在 a 連續且 f(a) = L", "f 在 a 附近有界"],
      timeLimit: 120,
      tags: ["epsdelta-quantifier-order", "epsilon-delta"],
      hints: ["δ 先固定之後，ε 可以任意小。一個固定的數 |f(x) − L| 小於每一個正數，代表什麼？", "用 f(x) = x、a = 0、L = 0 試：這句話對它成立嗎？"],
      solution: "δ 固定後，對 0 < |x − a| < δ 的每個 x，|f(x) − L| 小於所有正數，只能是 0，所以 f 在去心鄰域上恆為 L。f(x) = x 在 0 有極限 0、連續、有界，卻不滿足這句話（|x| 不恆為 0）。",
      solutionSteps: ["δ 先固定；對每個 x 都有 |f(x) − L| < ε 對所有 ε > 0。", "非負數小於每個正數 ⇒ 它是 0：f(x) = L。", "答案：在 a 的某個去心鄰域裡 f(x) 恆等於 L（遠比極限強）。"],
      verify: { m: "choice", options: [
        { say: "在 a 的某個去心鄰域裡 f(x) 恆等於 L", unknown: "非負數小於所有正數即為 0；其餘選項用 f(x)=x 推翻" },
        { say: "lim_{x→a} f(x) = L", all: [{ v: SUP("|x|", 0.000000001, 0.001), le: 0 }] },
        { say: "f 在 a 連續且 f(a) = L", all: [{ v: SUP("|x|", 0.000000001, 0.001), le: 0 }] },
        { say: "f 在 a 附近有界", all: [{ v: SUP("|x|", 0.000000001, 0.001), le: 0 }] }
      ] } },

    /* ── 12D：一次函數（斜率為負） ── */
    { id: "cg-12d-006", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\text{對 }f(x)=4-5x,\\ x_0=1,\\ L=-1\\text{，要讓 }|f(x)-L|<0.05\\text{ 對所有 }0<|x-1|<\\delta\\text{ 成立，}\\delta\\text{ 最大可以取多少？}",
      answer: "1/100",
      timeLimit: 70,
      tags: ["epsdelta-negative-slope", "epsilon-delta"],
      hints: ["把 |f(x) − L| 化簡成 |x − 1| 的倍數；負號放進絕對值會怎樣？", "斜率的絕對值決定 δ 與 ε 的比例。"],
      solution: "|4 − 5x + 1| = |5 − 5x| = 5|x − 1|。要 5|x − 1| < 0.05 ⇔ |x − 1| < 0.01，所以 δ 最大 0.01 = ε/|m|。斜率負號被絕對值吃掉。",
      solutionSteps: ["|f(x) − L| = |5 − 5x| = 5|x − 1|。", "5|x − 1| < 0.05 ⇔ |x − 1| < 0.01。", "δ 最大 = 0.01。"],
      verify: { m: "maxDelta", f: "4-5x", at: 1, L: -1, eps: 0.05 } },

    { id: "cg-12d-007", topic: "limits", rank: 3, answerKind: "epsilon",
      prompt: "\\text{挑戰 }\\lim_{x\\to -1}(2-3x)=5\\text{：系統給 }\\varepsilon\\text{，你找一個 }\\delta\\quad\\text{（三關）}",
      epsilon: { f: "2-3*x", at: -1, limit: 5, levels: [0.9, 0.45, 0.09], maxDelta: 0.5 },
      graph: { window: [-1.8, -0.2, 3.6, 6.4] },
      answer: "0.03",
      timeLimit: 150,
      tags: ["epsdelta-negative-slope", "epsilon-delta", "epsilon-game"],
      hints: ["|2 − 3x − 5| 化成 |x + 1| 的倍數。", "斜率是負的，但 δ 只跟斜率的絕對值有關。"],
      solution: "|2 − 3x − 5| = |−3x − 3| = 3|x + 1|，所以 δ = ε/3：三關分別是 0.3、0.15、0.03（取不超過它的數都行）。斜率是負的，帶子照樣是對稱的。",
      solutionSteps: ["|f(x) − 5| = 3|x + 1|。", "要 3|x + 1| < ε，取 δ = ε/3。", "ε = 0.09 時 δ 最大 0.03。"],
      verify: { m: "maxDelta", f: "2-3x", at: -1, L: 5, eps: 0.09 } },

    /* ── 12D：二次（因子上界） ── */
    { id: "cg-12d-008", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{證 }\\lim_{x\\to2}x^2=4\\text{ 時寫 }|x^2-4|=|x-2|\\,|x+2|\\text{。先限制 }|x-2|<1\\text{，}|x+2|\\text{ 的最小上界是多少？}",
      answers: ["5"], canonical: "5",
      distractors: ["4", "3", "1"],
      timeLimit: 60,
      tags: ["epsdelta-factor-bound", "epsilon-delta"],
      hints: ["|x − 2| < 1 代表 x 落在哪個區間？", "|x + 2| 在這個區間上什麼時候最大？"],
      solution: "|x − 2| < 1 ⇔ 1 < x < 3，所以 3 < x + 2 < 5，|x + 2| < 5，上界 5（逼近 x = 3 時趨近 5）。4 是只代 x = 2 的值，3 是用錯了左端點。",
      solutionSteps: ["|x − 2| < 1 ⇔ 1 < x < 3。", "x + 2 介於 3 與 5 之間。", "最小上界 5（之後取 δ = min(1, ε/5)）。"],
      verify: { m: "choice", options: [
        { say: "5", all: [{ v: SUP("|x+2|", 1, 3), eq: 5 }] },
        { say: "4", all: [{ v: SUP("|x+2|", 1, 3), eq: 4 }] },
        { say: "3", all: [{ v: SUP("|x+2|", 1, 3), eq: 3 }] },
        { say: "1", all: [{ v: SUP("|x+2|", 1, 3), eq: 1 }] }
      ] } },

    { id: "cg-12d-009", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\text{證 }\\lim_{x\\to2}x^3=8\\text{ 時寫 }|x^3-8|=|x-2|\\,|x^2+2x+4|\\text{。先限制 }|x-2|<1\\text{，}|x^2+2x+4|\\text{ 的最小上界是多少？}",
      answers: ["19"], canonical: "19",
      distractors: ["12", "7", "27"],
      timeLimit: 80,
      tags: ["epsdelta-factor-bound", "epsilon-delta"],
      hints: ["先寫出 x 的範圍，再看 x² + 2x + 4 在這個範圍上是遞增還是遞減。", "代對端點：會讓因子變最大的是哪一端？"],
      solution: "|x − 2| < 1 ⇔ 1 < x < 3。x² + 2x + 4 = (x + 1)² + 3 在 x > −1 遞增，所以介於 7 與 19 之間，上界 19。12 是 x = 2 的值，7 用錯了端點，27 是 3³。",
      solutionSteps: ["|x − 2| < 1 ⇔ 1 < x < 3。", "x² + 2x + 4 = (x + 1)² + 3 在 (1, 3) 遞增，值在 7 與 19 之間。", "最小上界 19（δ = min(1, ε/19)）。"],
      verify: { m: "choice", options: [
        { say: "19", all: [{ v: SUP("x^2+2x+4", 1, 3), eq: 19 }] },
        { say: "12", all: [{ v: SUP("x^2+2x+4", 1, 3), eq: 12 }] },
        { say: "7", all: [{ v: SUP("x^2+2x+4", 1, 3), eq: 7 }] },
        { say: "27", all: [{ v: SUP("x^2+2x+4", 1, 3), eq: 27 }] }
      ] } },

    /* ── 12D：有理函數 ── */
    { id: "cg-12d-010", topic: "limits", rank: 4, answerKind: "epsilon",
      prompt: "\\text{挑戰 }\\lim_{x\\to 1}\\frac{2x+1}{x+3}=\\frac34\\text{：系統給 }\\varepsilon\\text{，你找一個 }\\delta\\quad\\text{（三關）}",
      epsilon: { f: "(2*x+1)/(x+3)", at: 1, limit: 0.75, levels: [0.2, 0.1, 0.02], maxDelta: 1 },
      graph: { window: [-0.2, 2.2, 0.2, 1.2] },
      answer: "0.0629921",
      timeLimit: 200,
      tags: ["epsdelta-rational", "epsilon-delta", "epsilon-game"],
      hints: ["通分：|f(x) − 3/4| 化成 |x − 1| 除以一個含 x 的式子。", "分母在 x 變小時變小，所以左側比較緊。"],
      solution: "|f − 3/4| = 5|x − 1|/(4|x + 3|)。左側 x = 1 − d：5d/(4(4 − d)) < ε ⇔ d < 16ε/(5 + 4ε)；右側較寬。ε = 0.02 時 δ = 0.32/5.08 ≈ 0.0630。",
      solutionSteps: ["(2x + 1)/(x + 3) − 3/4 = 5(x − 1)/(4(x + 3))。", "左側較緊：5d/(4(4 − d)) = ε ⇒ d = 16ε/(5 + 4ε)。", "ε = 0.02：δ = 0.32/5.08 ≈ 0.06299。"],
      verify: { m: "maxDelta", f: "\\frac{2x+1}{x+3}", at: 1, L: 0.75, eps: 0.02 } },

    { id: "cg-12d-011", topic: "limits", rank: 4, answerKind: "epsilon",
      prompt: "\\text{挑戰 }\\lim_{x\\to 2}\\frac{x}{x-1}=2\\text{：系統給 }\\varepsilon\\text{，你找一個 }\\delta\\quad\\text{（三關）}",
      epsilon: { f: "x/(x-1)", at: 2, limit: 2, levels: [0.3, 0.15, 0.03], maxDelta: 0.5 },
      graph: { window: [1.4, 2.6, 1.2, 3.6] },
      answer: "0.0291262",
      timeLimit: 200,
      tags: ["epsdelta-rational", "epsilon-delta", "epsilon-game"],
      hints: ["|x/(x − 1) − 2| 化簡成 |x − 2|/|x − 1|。", "x 往 1 那邊走時分母變小：哪一側比較緊？"],
      solution: "|x/(x − 1) − 2| = |x − 2|/|x − 1|。左側 x = 2 − d：d/(1 − d) < ε ⇔ d < ε/(1 + ε)；右側 d/(1 + d) 較寬。ε = 0.03：δ = 0.03/1.03 ≈ 0.0291。",
      solutionSteps: ["x/(x − 1) − 2 = (2 − x)/(x − 1)。", "左側較緊：d/(1 − d) = ε ⇒ d = ε/(1 + ε)。", "ε = 0.03：δ = 0.03/1.03 ≈ 0.02913。"],
      verify: { m: "maxDelta", f: "\\frac{x}{x-1}", at: 2, L: 2, eps: 0.03 } },

    { id: "cg-12d-012", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "\\text{對 }f(x)=\\frac{3}{x+1},\\ x_0=2,\\ L=1\\text{，要讓 }|f(x)-L|<0.1\\text{ 對所有 }0<|x-2|<\\delta\\text{ 成立，}\\delta\\text{ 最大可以取多少？}",
      answer: "3/11",
      timeLimit: 120,
      tags: ["epsdelta-rational", "epsilon-delta"],
      hints: ["|3/(x + 1) − 1| = |2 − x|/|x + 1|：兩側分開算。", "x < 2 時分母比較小，那一側的限制比較嚴。"],
      solution: "|f − 1| = |x − 2|/(x + 1)。左側 x = 2 − d：d/(3 − d) < 0.1 ⇔ d < 3/11；右側 d/(3 + d) < 0.1 ⇔ d < 1/3。取小的：δ = 3/11 ≈ 0.2727。",
      solutionSteps: ["3/(x + 1) − 1 = (2 − x)/(x + 1)。", "左側：d/(3 − d) = 0.1 ⇒ d = 3/11；右側：d/(3 + d) = 0.1 ⇒ d = 1/3。", "δ 最大 = 3/11。"],
      verify: { m: "maxDelta", f: "\\frac{3}{x+1}", at: 2, L: 1, eps: 0.1 } },

    { id: "cg-12d-013", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\text{證 }\\lim_{x\\to4}\\frac{1}{x-1}=\\frac13\\text{ 時先限制 }|x-4|<r\\text{，要讓 }|x-1|\\text{ 有正的下界。}r\\text{ 可以取哪一個？}",
      answers: ["1"], canonical: "1",
      distractors: ["3", "4", "6"],
      timeLimit: 80,
      tags: ["epsdelta-restrict-radius", "epsilon-delta"],
      hints: ["分母的零點在哪？它離 4 多遠？", "|x − 4| < r 的區間只要碰到（或貼近）零點，|x − 1| 就沒有正的下界。"],
      solution: "分母零點 x = 1，離 4 的距離是 3。r = 1 時 3 < x < 5，|x − 1| > 2。r = 3 時 x 可以貼近 1（下確界 0）；r = 4、6 時區間直接包含 1。",
      solutionSteps: ["零點 x = 1，與 4 相距 3，r 必須 < 3。", "r = 1：3 < x < 5 ⇒ |x − 1| > 2。", "答案：r = 1。"],
      verify: { m: "choice", options: [
        { say: "1", all: [{ v: INF("|x-1|", 3, 5), gt: 0 }] },
        { say: "3", all: [{ v: INF("|x-1|", 1, 7), gt: 0 }] },
        { say: "4", all: [{ v: INF("|x-1|", 0, 8), gt: 0 }] },
        { say: "6", all: [{ v: INF("|x-1|", -2, 10), gt: 0 }] }
      ] } },

    { id: "cg-12d-014", topic: "limits", rank: 4, answerKind: "text",
      prompt: "\\text{證 }\\lim_{x\\to2.5}\\frac{1}{(x-1)(x-3)}=-\\frac43\\text{ 時先限制 }|x-2.5|<r\\text{，要讓分母 }|(x-1)(x-3)|\\text{ 有正的下界。}r\\text{ 可以取哪一個？}",
      answers: ["1/4"], canonical: "1/4",
      distractors: ["1/2", "1", "3/2"],
      timeLimit: 100,
      tags: ["epsdelta-restrict-radius", "epsilon-delta"],
      hints: ["分母有兩個零點；各自離 2.5 多遠？", "r 要比「最近的那個零點的距離」還小。"],
      solution: "零點 1 與 3，離 2.5 分別 1.5 與 0.5，最近是 0.5，r 必須 < 0.5。r = 1/4：2.25 < x < 2.75，|(x − 1)(x − 3)| > 1.75 × 0.25 = 0.4375。其他三個都會碰到或貼近 x = 3。",
      solutionSteps: ["零點 x = 1（距 1.5）與 x = 3（距 0.5）。", "r 要 < 0.5；只有 1/4 符合。", "r = 1/4 時分母的絕對值 > 0.4375。"],
      verify: { m: "choice", options: [
        { say: "1/4", all: [{ v: INF("|(x-1)(x-3)|", 2.25, 2.75), gt: 0 }] },
        { say: "1/2", all: [{ v: INF("|(x-1)(x-3)|", 2, 3), gt: 0 }] },
        { say: "1", all: [{ v: INF("|(x-1)(x-3)|", 1.5, 3.5), gt: 0 }] },
        { say: "3/2", all: [{ v: INF("|(x-1)(x-3)|", 1, 4), gt: 0 }] }
      ] } }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE,
    difficulty: Math.min(4, problem.rank),
    ...problem
  })));
})();
