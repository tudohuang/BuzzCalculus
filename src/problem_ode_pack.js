(function () {
  "use strict";

  // 微分方程包（2026-09）：36 題，一階與二階常係數。
  //
  // 這是題庫掃描出的最大空洞：大一微積分的期末幾乎都考到一階 ODE 與
  // 二階常係數，而全站原本一題都沒有（只有 Frullani 那組掛著 ode-style 標籤）。
  //
  //   一階分離        8 ── 分離變數、代入初始條件
  //   一階線性        8 ── 積分因子；兩題設計成 (xy)' 直接看出來
  //   二階齊次        8 ── 特徵根三態：相異實根、重根、共軛複根
  //   二階非齊次      6 ── 未定係數；含一題共振（右端撞上齊次解）
  //   IVP 數值        6 ── 問 y(a) 的值，不問解析解
  //
  // 驗證是這一包的重點，三條路全部與解法無關：
  //   ode1     ── 對答案函數數值微分，代回 y'=f(x,y) 看殘差，再驗初始條件
  //   ode2const── 同上，但驗 a·y''+b·y'+c·y = g(x)
  //   odeValue ── RK4 從初始條件直接積到目標點，跟數值答案比
  // 換句話說：解錯的答案代回去一定露餡，數值題連解析解都不用會。
  const SOURCE = "Buzz ODE pack";
  const problems = [];

  function add(problem) {
    const rank = problem.rank;
    const tags = [...(problem.tags || []), "ode", `rank-${rank}`];
    if (rank >= 5) tags.push("boss-rank");
    if (rank <= 2) tags.push("beginner-friendly");
    problems.push({
      source: SOURCE,
      difficulty: Math.min(4, rank),
      topic: "integrals",
      answerKind: "expression",
      variable: "x",
      ...problem,
      tags
    });
  }

  const q = (id, rank, prompt, answer, tags, solution, timeLimit, verify, hints, extra) =>
    add({ id, rank, prompt, answer, tags, solution, timeLimit, verify, hints, ...(extra || {}) });

  /* ═══════════ 一、一階分離（8）═══════════ */

  q("ode-sep-001", 2,
    "y'=y,\\quad y(0)=1,\\quad \\text{求 }y(x)",
    "exp(x)",
    ["separable", "ivp"],
    "dy/y = dx，積分得 ln y = x + C，y = Ce^x。代 y(0)=1 得 C=1。",
    60,
    { m: "ode1", f: "y", y0: [0, 1] },
    ["把 y 全搬到左邊、x 全搬到右邊，兩邊各自積分。", "積出來的常數用 y(0)=1 定下來。"]);

  q("ode-sep-002", 2,
    "y'=2xy,\\quad y(0)=1,\\quad \\text{求 }y(x)",
    "exp(x^2)",
    ["separable", "ivp"],
    "dy/y = 2x dx ⟹ ln y = x² + C ⟹ y = e^{x²}。",
    70,
    { m: "ode1", f: "2xy", y0: [0, 1] },
    ["右邊是 x 的函數乘上 y —— 分離變數的標準形。", "∫2x dx = x²，指數回去別忘了初始條件。"]);

  q("ode-sep-003", 3,
    "y'=y^2,\\quad y(0)=1,\\quad \\text{求 }y(x)\\ (x<1)",
    "1/(1-x)",
    ["separable", "ivp", "blow-up"],
    "dy/y² = dx ⟹ −1/y = x + C ⟹ y = 1/(C'−x)。代初始條件 C'=1。注意解在 x=1 爆掉 —— 非線性方程的解不一定活到無窮遠。",
    90,
    { m: "ode1", f: "y^2", y0: [0, 1], from: 0.05, to: 0.85 },
    ["∫dy/y² 是 −1/y。", "解出來的分母會在某個 x 變成 0 —— 那就是解的壽命。"]);

  q("ode-sep-004", 3,
    "y'=\\frac{x}{y},\\quad y(0)=2,\\quad \\text{求 }y(x)",
    "sqrt(x^2+4)",
    ["separable", "ivp"],
    "y dy = x dx ⟹ y²/2 = x²/2 + C ⟹ y² = x²+4（用 y(0)=2）。取正根因為 y(0)>0。",
    90,
    { m: "ode1", f: "\\frac{x}{y}", y0: [0, 2] },
    ["把 y 乘過去：y·dy = x·dx，兩邊都是可以直接積的形。", "積完是 y² 的關係式，開根號時想想該取哪一支。"]);

  q("ode-sep-005", 3,
    "y'=e^{-y},\\quad y(0)=0,\\quad \\text{求 }y(x)",
    "log(1+x)",
    ["separable", "ivp"],
    "e^y dy = dx ⟹ e^y = x + C ⟹ y = ln(x+1)（C=1 由初始條件）。",
    90,
    { m: "ode1", f: "e^{-y}", y0: [0, 0] },
    ["把 e^{-y} 除過去變成 e^y dy = dx。", "積分後對 e^y = x + C 取對數。"]);

  q("ode-sep-006", 4,
    "y'=y(1-y),\\quad y(0)=\\tfrac12,\\quad \\text{求 }y(x)",
    "1/(1+exp(-x))",
    ["separable", "ivp", "logistic"],
    "部分分式：dy/(y(1−y)) = (1/y + 1/(1−y))dy = dx ⟹ ln(y/(1−y)) = x + C。y(0)=1/2 給 C=0，解出 y = 1/(1+e^{-x})。",
    130,
    { m: "ode1", f: "y(1-y)", y0: [0, 0.5] },
    ["左邊 1/(y(1−y)) 先做部分分式再積。", "積出來是 ln(y/(1−y)) = x + C —— 解 y 時把指數搬回去。"]);

  q("ode-sep-007", 3,
    "y'=1+y^2,\\quad y(0)=0,\\quad \\text{求 }y(x)",
    "tan(x)",
    ["separable", "ivp"],
    "dy/(1+y²) = dx ⟹ arctan y = x + C ⟹ y = tan x（C=0）。",
    80,
    { m: "ode1", f: "1+y^2", y0: [0, 0], from: 0.05, to: 1.2 },
    ["∫dy/(1+y²) 是哪個反三角函數？", "arctan y = x 反解回去。"]);

  q("ode-sep-008", 3,
    "y'=-2xy^2,\\quad y(0)=1,\\quad \\text{求 }y(x)",
    "1/(1+x^2)",
    ["separable", "ivp"],
    "−dy/y² = 2x dx ⟹ 1/y = x² + C ⟹ y = 1/(x²+1)。",
    90,
    { m: "ode1", f: "-2xy^2", y0: [0, 1] },
    ["分離後左邊是 ∫dy/y²，右邊是 ∫−2x dx。", "1/y = x² + C，用初始條件定 C 再倒回來。"]);

  /* ═══════════ 二、一階線性（8）═══════════ */

  q("ode-lin-001", 3,
    "y'+y=x,\\quad y(0)=1,\\quad \\text{求 }y(x)",
    "x-1+2*exp(-x)",
    ["linear-first-order", "integrating-factor", "ivp"],
    "積分因子 e^x：(e^x y)' = xe^x，積分得 e^x y = (x−1)e^x + C。y(0)=1 給 C=2。",
    110,
    { m: "ode1", f: "x-y", y0: [0, 1] },
    ["標準形 y'+P(x)y=Q(x)，積分因子是 e^{∫P dx}。", "右邊會出現 ∫xe^x dx —— 分部積分。"]);

  q("ode-lin-002", 3,
    "y'-y=e^{x},\\quad y(0)=0,\\quad \\text{求 }y(x)",
    "x*exp(x)",
    ["linear-first-order", "integrating-factor", "ivp"],
    "積分因子 e^{-x}：(e^{-x}y)' = 1 ⟹ e^{-x}y = x + C ⟹ y = xe^x（C=0）。",
    100,
    { m: "ode1", f: "y+e^x", y0: [0, 0] },
    ["積分因子是 e^{-x}（P = −1）。", "乘上去之後右邊變成常數 1，一步就積完。"]);

  q("ode-lin-003", 2,
    "y'+2y=4,\\quad y(0)=0,\\quad \\text{求 }y(x)",
    "2-2*exp(-2*x)",
    ["linear-first-order", "ivp"],
    "平衡解 y=2；齊次解 Ce^{-2x}。y = 2 + Ce^{-2x}，初始條件給 C=−2。",
    80,
    { m: "ode1", f: "4-2y", y0: [0, 0] },
    ["先找常數解：什麼 y 讓右邊等於 0？", "通解 = 常數解 + Ce^{-2x}，再用 y(0)=0。"]);

  q("ode-lin-004", 4,
    "xy'+y=x^2,\\quad y(1)=1,\\quad \\text{求 }y(x)\\ (x>0)",
    "(x^3+2)/(3*x)",
    ["linear-first-order", "exact-form", "ivp"],
    "左邊就是 (xy)'：(xy)' = x² ⟹ xy = x³/3 + C。y(1)=1 給 C=2/3。",
    120,
    { m: "ode1", f: "\\frac{x^2-y}{x}", y0: [1, 1], from: 0.5, to: 2.5 },
    ["先看一眼左邊 —— xy'+y 是不是某個東西的導數？", "認出 (xy)' 之後整題只剩一次積分。"]);

  q("ode-lin-005", 3,
    "y'=-y\\tan x,\\quad y(0)=2,\\quad \\text{求 }y(x)",
    "2*cos(x)",
    ["linear-first-order", "separable", "ivp"],
    "分離：dy/y = −tan x dx ⟹ ln y = ln(cos x) + C ⟹ y = C·cos x，C=2。",
    90,
    { m: "ode1", f: "-y\\tan x", y0: [0, 2], from: 0.05, to: 1.2 },
    ["∫tan x dx = −ln(cos x)。", "指數回去時 e^{ln cos x} 就是 cos x。"]);

  q("ode-lin-006", 4,
    "y'+\\frac{y}{x}=\\frac{1}{x^2},\\quad y(1)=0,\\quad \\text{求 }y(x)\\ (x>0)",
    "log(x)/x",
    ["linear-first-order", "integrating-factor", "ivp"],
    "積分因子 x：(xy)' = 1/x ⟹ xy = ln x + C。y(1)=0 給 C=0。",
    120,
    { m: "ode1", f: "\\frac{1}{x^2}-\\frac{y}{x}", y0: [1, 0], from: 0.5, to: 3 },
    ["積分因子 e^{∫dx/x} = x。", "(xy)' = 1/x，右邊積出對數。"]);

  q("ode-lin-007", 3,
    "y'-2y=-4x,\\quad y(0)=1,\\quad \\text{求 }y(x)",
    "2*x+1",
    ["linear-first-order", "ivp", "trap-drill"],
    "試多項式特解 y=ax+b：a−2(ax+b) = −4x ⟹ a=2、b=1。通解 2x+1+Ce^{2x}，而 y(0)=1 恰好逼出 C=0 —— 指數項整個消失。",
    100,
    { m: "ode1", f: "2y-4x", y0: [0, 1] },
    ["右邊是一次式，先猜特解 y=ax+b 代進去比係數。", "通解帶 Ce^{2x}，但初始條件可能讓 C=0 —— 別假設指數項一定活著。"]);

  q("ode-lin-008", 4,
    "y'+y=\\sin x,\\quad y(0)=0,\\quad \\text{求 }y(x)",
    "(sin(x)-cos(x)+exp(-x))/2",
    ["linear-first-order", "integrating-factor", "ivp"],
    "特解試 A sin x + B cos x，比係數得 (sin x − cos x)/2；齊次 Ce^{-x}。y(0)=0 給 C=1/2。",
    130,
    { m: "ode1", f: "\\sin x - y", y0: [0, 0] },
    ["特解用 A sin x + B cos x 代進去比係數 —— 兩個都要，右邊只有 sin 也一樣。", "算出特解後別忘了齊次解 Ce^{-x} 還在，初始條件是用來抓 C 的。"]);

  /* ═══════════ 三、二階常係數齊次（8）═══════════ */

  q("ode-h2-001", 3,
    "y''-3y'+2y=0,\\quad y(0)=0,\\ y'(0)=1,\\quad \\text{求 }y(x)",
    "exp(2*x)-exp(x)",
    ["second-order", "constant-coefficients", "ivp"],
    "特徵方程 r²−3r+2=0，根 1、2。y = Ae^x + Be^{2x}；A+B=0、A+2B=1 ⟹ B=1、A=−1。",
    110,
    { m: "ode2const", a: 1, b: -3, c: 2, y0: [0, 0], yp0: [0, 1] },
    ["寫下特徵方程 r²−3r+2=0，因式分解。", "兩個初始條件給兩條線性方程，解 A、B。"]);

  q("ode-h2-002", 2,
    "y''+y=0,\\quad y(0)=1,\\ y'(0)=0,\\quad \\text{求 }y(x)",
    "cos(x)",
    ["second-order", "constant-coefficients", "ivp"],
    "特徵根 ±i，通解 A cos x + B sin x。初始條件直接給 A=1、B=0。",
    60,
    { m: "ode2const", a: 1, b: 0, c: 1, y0: [0, 1], yp0: [0, 0] },
    ["r²+1=0 的根是純虛數 —— 解是三角函數。", "y(0) 定 cos 的係數、y'(0) 定 sin 的係數。"]);

  q("ode-h2-003", 4,
    "y''-2y'+y=0,\\quad y(0)=1,\\ y'(0)=0,\\quad \\text{求 }y(x)",
    "(1-x)*exp(x)",
    ["second-order", "constant-coefficients", "repeated-root", "ivp"],
    "特徵方程 (r−1)²=0，重根。通解 (A+Bx)e^x；A=1，y' = (B+A+Bx)e^x 在 0 是 B+1=0 ⟹ B=−1。",
    130,
    { m: "ode2const", a: 1, b: -2, c: 1, y0: [0, 1], yp0: [0, 0] },
    ["特徵方程是完全平方 —— 重根的通解要多乘一個 x。", "(A+Bx)e^x 微分時用乘法律，別漏掉 B 那一項。"]);

  q("ode-h2-004", 3,
    "y''+4y'+4y=0,\\quad y(0)=1,\\ y'(0)=-2,\\quad \\text{求 }y(x)",
    "exp(-2*x)",
    ["second-order", "constant-coefficients", "repeated-root", "ivp", "trap-drill"],
    "重根 −2：通解 (A+Bx)e^{-2x}。A=1；y'(0) = B−2A = −2 ⟹ B=0 —— x 那一項被初始條件殺掉了。",
    110,
    { m: "ode2const", a: 1, b: 4, c: 4, y0: [0, 1], yp0: [0, -2] },
    ["(r+2)²=0，重根，通解帶 (A+Bx)。", "算出來 B 可能是 0 —— 重根不保證 x 項一定出現。"]);

  q("ode-h2-005", 4,
    "y''+2y'+5y=0,\\quad y(0)=1,\\ y'(0)=-1,\\quad \\text{求 }y(x)",
    "exp(-x)*cos(2*x)",
    ["second-order", "constant-coefficients", "complex-roots", "ivp"],
    "根 −1±2i：通解 e^{-x}(A cos 2x + B sin 2x)。A=1；y'(0) = −A+2B = −1 ⟹ B=0。",
    130,
    { m: "ode2const", a: 1, b: 2, c: 5, y0: [0, 1], yp0: [0, -1] },
    ["判別式是負的 —— 根是 α±βi，解是 e^{αx} 乘三角。", "y'(0) 的方程裡 α 和 β 都會出現，別只代一個。"]);

  q("ode-h2-006", 3,
    "y''-y=0,\\quad y(0)=2,\\ y'(0)=0,\\quad \\text{求 }y(x)",
    "exp(x)+exp(-x)",
    ["second-order", "constant-coefficients", "ivp"],
    "根 ±1：y = Ae^x + Be^{-x}。A+B=2、A−B=0 ⟹ A=B=1。",
    90,
    { m: "ode2const", a: 1, b: 0, c: -1, y0: [0, 2], yp0: [0, 0] },
    ["r²=1 的兩個根一正一負。", "兩條初始條件方程相加減就解出 A、B。"]);

  q("ode-h2-007", 3,
    "y''+9y=0,\\quad y(0)=0,\\ y'(0)=3,\\quad \\text{求 }y(x)",
    "sin(3*x)",
    ["second-order", "constant-coefficients", "ivp"],
    "根 ±3i：y = A cos 3x + B sin 3x。A=0；y'(0)=3B=3 ⟹ B=1。",
    80,
    { m: "ode2const", a: 1, b: 0, c: 9, y0: [0, 0], yp0: [0, 3] },
    ["r²+9=0 給 ±3i —— 頻率是 3。", "微分 sin 3x 會掉一個 3 出來，y'(0) 的方程要除回去。"]);

  q("ode-h2-008", 5,
    "y''-4y'+13y=0,\\quad y(0)=0,\\ y'(0)=3,\\quad \\text{求 }y(x)",
    "exp(2*x)*sin(3*x)",
    ["second-order", "constant-coefficients", "complex-roots", "ivp"],
    "根 2±3i：y = e^{2x}(A cos 3x + B sin 3x)。A=0；y' = e^{2x}(2B sin 3x + 3B cos 3x) 在 0 是 3B=3 ⟹ B=1。",
    160,
    { m: "ode2const", a: 1, b: -4, c: 13, y0: [0, 0], yp0: [0, 3] },
    ["配方求根：r = 2 ± 3i，實部進指數、虛部進頻率。", "A=0 之後 y' 仍有兩項（乘法律），在 x=0 只剩 3B。"]);

  /* ═══════════ 四、二階非齊次（6）═══════════ */

  q("ode-p2-001", 4,
    "y''+y=x,\\quad y(0)=0,\\ y'(0)=0,\\quad \\text{求 }y(x)",
    "x-sin(x)",
    ["second-order", "undetermined-coefficients", "ivp"],
    "特解 y_p = x（代進去剛好）。通解 x + A cos x + B sin x；A=0、1+B=0 ⟹ B=−1。",
    130,
    { m: "ode2const", a: 1, b: 0, c: 1, g: "x", y0: [0, 0], yp0: [0, 0] },
    ["右邊是 x，特解猜 ax+b 代進去。", "特解找到後齊次解還在 —— 兩個初始條件抓 A、B。"]);

  q("ode-p2-002", 4,
    "y''-y=e^{2x},\\quad y(0)=\\tfrac13,\\ y'(0)=\\tfrac23,\\quad \\text{求 }y(x)",
    "exp(2*x)/3",
    ["second-order", "undetermined-coefficients", "ivp", "trap-drill"],
    "特解 Ae^{2x}：4A−A=1 ⟹ A=1/3。這組初始條件剛好讓齊次部分全滅 —— y = e^{2x}/3。",
    140,
    { m: "ode2const", a: 1, b: 0, c: -1, g: "e^{2x}", y0: [0, 1 / 3], yp0: [0, 2 / 3] },
    ["猜特解 Ae^{2x}，代進去解 A（2 不是特徵根，可以直接猜）。", "齊次解 Ae^x+Be^{-x} 加上去之後，用初始條件解 —— 這題兩個都會是 0。"]);

  q("ode-p2-003", 3,
    "y''+4y=8,\\quad y(0)=0,\\ y'(0)=0,\\quad \\text{求 }y(x)",
    "2-2*cos(2*x)",
    ["second-order", "undetermined-coefficients", "ivp"],
    "常數特解 y_p=2。通解 2 + A cos 2x + B sin 2x；2+A=0、2B=0 ⟹ A=−2、B=0。",
    110,
    { m: "ode2const", a: 1, b: 0, c: 4, g: "8", y0: [0, 0], yp0: [0, 0] },
    ["右邊是常數 —— 特解就猜常數。", "cos 2x 微分掉出來的 2 別忘了。"]);

  q("ode-p2-004", 4,
    "y''-3y'+2y=2x,\\quad y(0)=\\tfrac32,\\ y'(0)=1,\\quad \\text{求 }y(x)",
    "x+3/2",
    ["second-order", "undetermined-coefficients", "ivp", "trap-drill"],
    "特解 ax+b：−3a+2(ax+b)=2x ⟹ a=1、b=3/2。初始條件讓齊次部分歸零，答案就是特解本身。",
    130,
    { m: "ode2const", a: 1, b: -3, c: 2, g: "2x", y0: [0, 1.5], yp0: [0, 1] },
    ["特解猜 ax+b，注意 y' 那一項會把 a 帶進常數項。", "驗一下初始條件 —— 這題的齊次係數會全是 0。"]);

  q("ode-p2-005", 4,
    "y''+y'=1,\\quad y(0)=0,\\ y'(0)=0,\\quad \\text{求 }y(x)",
    "x-1+exp(-x)",
    ["second-order", "undetermined-coefficients", "ivp", "resonance"],
    "常數是齊次解（r=0 是特徵根），特解要升一階猜 ax：a=1。通解 x + A + Be^{-x}；A+B=0、1−B=0 ⟹ B=1、A=−1。",
    140,
    { m: "ode2const", a: 1, b: 1, c: 0, g: "1", y0: [0, 0], yp0: [0, 0] },
    ["先看 r=0 是不是特徵根 —— 是的話常數猜不動，特解要乘一個 x。", "通解裡的常數 A 和 e^{-x} 的 B 用兩個初始條件一起解。"]);

  q("ode-p2-006", 5,
    "y''+y=\\cos x,\\quad y(0)=0,\\ y'(0)=0,\\quad \\text{求 }y(x)",
    "x*sin(x)/2",
    ["second-order", "undetermined-coefficients", "resonance", "ivp"],
    "cos x 撞上齊次解（共振）：特解升階猜 x(A cos x + B sin x)，代入得 A=0、B=1/2。初始條件讓齊次部分為 0。",
    170,
    { m: "ode2const", a: 1, b: 0, c: 1, g: "\\cos x", y0: [0, 0], yp0: [0, 0] },
    ["右邊的 cos x 本身就是齊次解 —— 直接猜 A cos x 會全消掉。", "共振的特解要乘 x：猜 x(A cos x + B sin x) 再代回去比係數。"]);

  /* ═══════════ 五、IVP 數值（6）═══════════
     問 y(a) 的值。驗證是 RK4 直接積過去 —— 不會解析解也算得出來，
     所以答案錯了一定被抓。 */

  const v = (id, rank, prompt, answer, tags, solution, timeLimit, verify, hints) =>
    add({ id, rank, prompt, answer, tags, solution, timeLimit, verify, hints, answerKind: "numeric" });

  v("ode-val-001", 2,
    "y'=y,\\quad y(0)=1,\\quad \\text{求 }y(1)",
    "E",
    ["separable", "ivp"],
    "y = e^x，所以 y(1) = e。",
    60,
    { m: "odeValue", f: "y", y0: [0, 1], at: 1 },
    ["這是最經典的方程 —— 解就是指數函數。", "y = e^x，代 x=1。"]);

  v("ode-val-002", 3,
    "y'=-2xy,\\quad y(0)=1,\\quad \\text{求 }y(1)",
    "1/E",
    ["separable", "ivp"],
    "y = e^{-x²}，y(1) = e^{-1}。",
    80,
    { m: "odeValue", f: "-2xy", y0: [0, 1], at: 1 },
    ["分離變數：dy/y = −2x dx。", "y = e^{-x²}，代 1 進去。"]);

  v("ode-val-003", 4,
    "y'=x+y,\\quad y(0)=1,\\quad \\text{求 }y(1)",
    "2*E-2",
    ["linear-first-order", "ivp"],
    "積分因子 e^{-x}：(e^{-x}y)' = xe^{-x}，積分得 y = 2e^x − x − 1。y(1) = 2e − 2。",
    130,
    { m: "odeValue", f: "x+y", y0: [0, 1], at: 1 },
    ["線性方程，積分因子 e^{-x}。", "右邊 ∫xe^{-x}dx 要分部；整理出 y = 2e^x − x − 1。"]);

  v("ode-val-004", 3,
    "y'=y^2,\\quad y(0)=1,\\quad \\text{求 }y\\!\\left(\\tfrac12\\right)",
    "2",
    ["separable", "ivp"],
    "y = 1/(1−x)，y(1/2) = 2。",
    80,
    { m: "odeValue", f: "y^2", y0: [0, 1], at: 0.5 },
    ["跟 y'=y² 的標準解一樣：y = 1/(1−x)。", "代 x = 1/2。"]);

  v("ode-val-005", 2,
    "y'=\\frac{y}{x},\\quad y(1)=1,\\quad \\text{求 }y(3)",
    "3",
    ["separable", "ivp", "trap-drill"],
    "dy/y = dx/x ⟹ y = Cx，C=1 ⟹ y=x。整題就是一條直線。",
    70,
    { m: "odeValue", f: "\\frac{y}{x}", y0: [1, 1], at: 3 },
    ["分離之後兩邊都是對數。", "ln y = ln x + C ⟹ y 跟 x 成正比 —— 別把它想複雜。"]);

  v("ode-val-006", 4,
    "y'=y\\sin x,\\quad y(0)=1,\\quad \\text{求 }y(\\pi)",
    "exp(2)",
    ["separable", "ivp"],
    "dy/y = sin x dx ⟹ ln y = 1−cos x ⟹ y = e^{1-\\cos x}。y(π) = e²。",
    120,
    { m: "odeValue", f: "y\\sin x", y0: [0, 1], at: 3.14159265358979 },
    ["分離變數，∫sin x dx = −cos x。", "常數用 y(0)=1 定：ln y = 1 − cos x。代 x=π 時 cos π = −1。"]);

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
