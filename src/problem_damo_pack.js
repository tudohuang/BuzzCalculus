(function () {
  "use strict";

  // 達摩院 / 競賽長題 pack (2026-07)。
  // Long-form analysis problems in the spirit of the Alibaba Global Math
  // Competition (達摩院) qualifiers: multi-step setups, slow-burn asymptotics,
  // classic hard integrals and series. All ranked 4-6 with generous time
  // limits. Every answer numerically verified via an independent scratchpad
  // harness (iteration / quadrature / summation), see repo history.
  const SOURCE = "達摩院風格長題 pack 2026";
  const TIME = { 4: 300, 5: 420, 6: 600 };
  const problems = [];

  function add(p) {
    const rank = p.rank || 5;
    const rankTags = ["damo", "long-form", "competition"];
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
    "S_n = P(Poisson(n) ≤ n),由中央極限定理對稱地趨於 1/2。經典 Putnam 1958 / 競賽題。",
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

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
