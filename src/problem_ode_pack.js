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

  // 這一包的解法寫成步驟鏈（用 ⟹ 和句號分段），直接轉成 solutionSteps ——
  // 結算頁會渲染成有序清單，比一整段散文好跟。切出來少於兩段就維持散文。
  const stepsOf = (solution) => {
    const parts = String(solution || "")
      .split(/⟹|(?<=。)/)
      .map((part) => part.trim().replace(/^。|。$/g, ""))
      .map((part) => part.trim())
      .filter(Boolean);
    // 短尾段（「B=0」這種）併回前一步 —— 一步要是一個完整的動作，
    // 太短的片段是切割的殘渣不是步驟。
    const mergedParts = [];
    parts.forEach((part) => {
      if (part.length < 6 && mergedParts.length) mergedParts[mergedParts.length - 1] += "，" + part;
      else mergedParts.push(part);
    });
    return mergedParts.length >= 2 ? mergedParts : null;
  };

  const q = (id, rank, prompt, answer, tags, solution, timeLimit, verify, hints, extra) =>
    add({ id, rank, prompt, answer, tags, solution, timeLimit, verify, hints,
      solutionSteps: stepsOf(solution), ...(extra || {}) });

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

(function () {
  "use strict";
  // 課程缺口補題（10A 一階、10B 二階）：驗解、階數、斜率場、存在區間與唯一性、可分離／線性的辨識、
  // 積分因子、正合判斷與位能函數、疊加、特徵方程、三種根的通解與長期行為。
  // 判斷題的驗算一律把候選函數代回方程，在幾個點上算殘差（數值微分），不用作者的代數。
  const SOURCE = "Buzz course gap fill";

  // y(x₀)：對 k 偏微分 k·f(x) 剛好得到 f(x₀)（線性，數值上精確）
  const at = (f, x0) => ({ m: "deriv", f: `k\\left(${f}\\right)`, vars: ["x", "k"], at: [x0, 1], wrt: "k" });
  const d1 = (f, x0) => ({ m: "deriv", f, at: [x0] });
  const d2 = (f, x0) => ({ m: "deriv", f, at: [x0], order: 2 });
  // f(x₀, y₀) 與偏導
  const fxy = (f, x0, y0) => ({ m: "deriv", f: `k\\left(${f}\\right)`, vars: ["x", "y", "k"], at: [x0, y0, 1], wrt: "k" });
  const pxy = (f, x0, y0, wrt) => ({ m: "deriv", f, vars: ["x", "y"], at: [x0, y0], wrt });
  // 一階殘差 y′ − F(x, y)
  const res1 = (y, F, x0) => ({ m: "let", f: `p-\\left(${F}\\right)`,
    with: { p: d1(y, x0), y: at(y, x0), x: { m: "value", f: String(x0) } } });
  // 二階殘差 a·y″ + b·y′ + c·y − g(x₀)
  const res2 = (y, abc, x0, g) => ({ m: "let",
    f: `\\left(${abc[0]}\\right)\\cdot q+\\left(${abc[1]}\\right)\\cdot p+\\left(${abc[2]}\\right)\\cdot s-u`,
    with: { q: d2(y, x0), p: d1(y, x0), s: at(y, x0), u: at(g || "0", x0) } });
  const zero = (v) => ({ v, eq: 0, tol: 1e-5 });
  const nonzero = (v) => ({ v, ne: 0 });
  // 二階方程對 e^{rx} 的作用在 x=0：就是特徵多項式 p(r)
  const charAt = (abc, r) => res2(`e^{${r}x}`, abc, 0);
  // 判別式：p(0)、p(1)、p(−1) 還原出二次式的係數
  const disc = (abc) => ({ m: "let", f: "\\left(\\frac{v-w}{2}\\right)^2-4\\cdot\\frac{v+w-2u}{2}\\cdot u",
    with: { u: charAt(abc, 0), v: charAt(abc, 1), w: charAt(abc, -1) } });
  // 可分離 ⟺ f(x₁,y₁)f(x₂,y₂) = f(x₁,y₂)f(x₂,y₁)
  const sepGap = (f, x1, y1, x2, y2) => ({ m: "let", f: "a\\cdot b-c\\cdot d",
    with: { a: fxy(f, x1, y1), b: fxy(f, x2, y2), c: fxy(f, x1, y2), d: fxy(f, x2, y1) } });
  const separable = (f) => [zero(sepGap(f, 1, 2, 2, 3)), zero(sepGap(f, 0.5, 1.5, 1.7, 0.6))];
  // 對 y 是一次式 ⟺ f(x,1) + f(x,3) − 2f(x,2) = 0
  const affineGap = (f, x0) => ({ m: "let", f: "a+c-2b", with: { a: fxy(f, x0, 1), b: fxy(f, x0, 2), c: fxy(f, x0, 3) } });
  // 正合：M_y = N_x
  const exactAt = (M, N, x0, y0) => ({ v: pxy(M, x0, y0, "y"), eq: pxy(N, x0, y0, "x"), tol: 1e-5 });
  const exact = (M, N) => [exactAt(M, N, 0.6, 1.3), exactAt(M, N, 1.7, -0.4)];
  // Wronskian y₁y₂′ − y₁′y₂
  const wronskian = (f, g, x0) => ({ m: "let", f: "a\\cdot b-c\\cdot d",
    with: { a: at(f, x0), b: d1(g, x0), c: d1(f, x0), d: at(g, x0) } });
  // 從 (0,0) 沿直線到 (a,b) 的線積分 = F(a,b) − F(0,0)
  const potential = (M, N, a, b) => ({ m: "lineIntegral", kind: "work", F: [M, N], path: { x: `${a}t`, y: `${b}t`, from: 0, to: 1 } });
  const JIA = "\\text{甲：}";
  const YI = "\\quad\\text{乙：}";
  const BING = "\\quad\\text{丙：}";
  const DING = "\\quad\\text{丁：}";
  const FOUR = ["甲", "乙", "丙", "丁"];
  const pick = (answer) => ({ answerKind: "text", answer, answers: [answer], canonical: answer,
    distractors: FOUR.filter((x) => x !== answer) });

  const problems = [
    /* ═══════ 10A ode-intro ═══════ */
    { id: "cg-10a-001", rank: 1, answerKind: "text",
      prompt: "\\text{函數 }y=\\frac{1}{x+2}\\text{ 是不是微分方程 }y'=-y^2\\text{ 的解？}",
      answer: "是解", answers: ["是解"], canonical: "是解", distractors: ["不是解", "只在 x=0 時成立"],
      timeLimit: 45, tags: ["ode-verify-solution", "ode", "trap-drill"],
      hints: ["先把 y′ 算出來。", "再把 −y² 算出來，比較兩邊是不是對每個 x 都相等。"],
      solution: "y′ = −1/(x+2)²，而 −y² = −1/(x+2)²，兩邊對每個 x ≠ −2 都相等，所以是解。",
      solutionSteps: ["y = (x+2)⁻¹ ⟹ y′ = −(x+2)⁻²。", "−y² = −(x+2)⁻²。", "兩邊恆等 ⟹ 是解。"],
      verify: { m: "choice", options: [
        { say: "是解", all: [zero(res1("\\frac{1}{x+2}", "-y^2", 0.5)), zero(res1("\\frac{1}{x+2}", "-y^2", 1.7))] },
        { say: "不是解", all: [nonzero(res1("\\frac{1}{x+2}", "-y^2", 0.5))] },
        { say: "只在 x=0 時成立", all: [zero(res1("\\frac{1}{x+2}", "-y^2", 0)), nonzero(res1("\\frac{1}{x+2}", "-y^2", 1.7))] }
      ] } },
    { id: "cg-10a-002", rank: 2, answerKind: "text",
      prompt: "\\text{已知 }e^{2x}\\text{ 是 }y''-4y=0\\text{ 的解。函數 }y=x\\,e^{2x}\\text{ 是不是這個方程的解？}",
      answer: "不是解", answers: ["不是解"], canonical: "不是解", distractors: ["是解", "只在 x>0 時是解"],
      timeLimit: 60, tags: ["ode-verify-solution", "second-order", "trap-drill"],
      hints: ["用乘法律算兩次導數。", "把 y″ 和 4y 相減，看是不是恆為 0。"],
      solution: "y′ = (1+2x)e^{2x}，y″ = (4+4x)e^{2x}。y″ − 4y = 4e^{2x} ≠ 0，所以不是解。多乘 x 只在重根時才行。",
      solutionSteps: ["y′ = (1+2x)e^{2x}，y″ = (4+4x)e^{2x}。", "y″ − 4y = (4+4x)e^{2x} − 4xe^{2x} = 4e^{2x}。", "4e^{2x} 永遠不是 0 ⟹ 不是解。"],
      verify: { m: "choice", options: [
        { say: "不是解", all: [nonzero(res2("x\\,e^{2x}", [1, 0, -4], 0.5))] },
        { say: "是解", all: [zero(res2("x\\,e^{2x}", [1, 0, -4], 0.5)), zero(res2("x\\,e^{2x}", [1, 0, -4], 1.3))] },
        { say: "只在 x>0 時是解", all: [zero(res2("x\\,e^{2x}", [1, 0, -4], 0.8)), zero(res2("x\\,e^{2x}", [1, 0, -4], 1.5))] }
      ] } },
    { id: "cg-10a-003", rank: 2, answerKind: "text",
      prompt: "\\text{代 }x=1\\text{ 時，}y=x^3\\text{ 會讓 }y'=3y\\text{ 兩邊相等。}y=x^3\\text{ 是不是 }y'=3y\\text{ 的解？}",
      answer: "不是解", answers: ["不是解"], canonical: "不是解", distractors: ["是解", "在 x=1 附近是解"],
      timeLimit: 45, tags: ["ode-verify-solution", "ode", "trap-drill"],
      hints: ["「是解」要求兩邊對區間裡每一個 x 都相等，不是只有一個點。", "隨便代一個別的 x 試試看。"],
      solution: "y′ = 3x²，3y = 3x³。兩者只在 x = 0、1 相等，例如 x = 2 時 12 ≠ 24。不是解。",
      solutionSteps: ["y′ = 3x²，3y = 3x³。", "3x² = 3x³ 只在 x = 0 或 1 成立。", "解要在整個區間上恆等 ⟹ 不是解。"],
      verify: { m: "choice", options: [
        { say: "不是解", all: [nonzero(res1("x^3", "3y", 0.5))] },
        { say: "是解", all: [zero(res1("x^3", "3y", 0.5)), zero(res1("x^3", "3y", 1))] },
        { say: "在 x=1 附近是解", all: [zero(res1("x^3", "3y", 1)), zero(res1("x^3", "3y", 1.1))] }
      ] } },
    { id: "cg-10a-004", rank: 2, answerKind: "numeric",
      prompt: "\\left(y'\\right)^3=8x^3,\\ y(0)=1\\text{（取實數解）。這是一階方程，一個初始條件就夠。求 }y(1)",
      answer: "2", timeLimit: 60, tags: ["ode-order", "ivp", "trap-drill"],
      hints: ["階數看最高導數是幾階，不是看它的次方。", "兩邊開立方，得到一個普通的 y′ = …。"],
      solution: "最高導數是 y′，一階（次方 3 不是階數）。開立方：y′ = 2x，y = x² + 1，y(1) = 2。",
      solutionSteps: ["最高導數 y′ ⟹ 一階；3 是次方。", "實數立方根：y′ = 2x。", "y = x² + C，y(0)=1 ⟹ C = 1；y(1) = 2。"],
      verify: { m: "odeValue", f: "\\sqrt[3]{8x^3}", y0: [0, 1], at: 1 } },
    { id: "cg-10a-005", rank: 2, answerKind: "numeric",
      prompt: "\\left(y''\\right)^2=4,\\ y''>0,\\ y(0)=0,\\ y'(0)=1\\text{。這是幾階方程？用這兩個條件求 }y(2)",
      answer: "6", timeLimit: 60, tags: ["ode-order", "second-order", "ivp"],
      hints: ["最高導數是 y″，所以是二階 —— 次方 2 不影響階數，二階剛好要兩個條件。", "先解出 y″ 是多少，再積分兩次。"],
      solution: "二階方程（平方是次方）。y″ > 0 ⟹ y″ = 2，y′ = 2x + 1，y = x² + x，y(2) = 6。",
      solutionSteps: ["最高導數 y″ ⟹ 二階，要兩個條件。", "y″ = 2 ⟹ y′ = 2x + 1（用 y′(0)=1）。", "y = x² + x（用 y(0)=0），y(2) = 6。"],
      verify: { m: "ode2Value", f: "\\sqrt{4}", y0: [0, 0], yp0: 1, at: 2 } },
    { id: "cg-10a-006", rank: 2, ...pick("丙"),
      prompt: "\\text{某斜率場：同一條水平線上的線段斜率都一樣；}y=1\\text{ 上的線段是水平的；}y>1\\text{ 的地方線段往右下傾斜。它是哪個方程的斜率場？}\\ " + JIA + "y'=x-1" + YI + "y'=y-1" + BING + "y'=1-y" + DING + "y'=1-x",
      timeLimit: 75, tags: ["ode-slope-field", "ode", "equilibrium"],
      hints: ["斜率在水平線上不變，代表右邊只跟哪個變數有關？", "在 y = 2 代進去，斜率應該是負的。"],
      solution: "斜率只跟 y 有關 ⟹ 乙或丙。y = 1 斜率 0，兩者都符合；y > 1 斜率為負只有丙 y′ = 1 − y。",
      solutionSteps: ["水平線上斜率相同 ⟹ 右邊只含 y：排除甲、丁。", "乙、丙在 y = 1 都是 0。", "y = 2：乙給 1（往右上）、丙給 −1（往右下）⟹ 丙。"],
      verify: { m: "choice", options: [
        ["甲", "x-1"], ["乙", "y-1"], ["丙", "1-y"], ["丁", "1-x"]
      ].map(([say, f]) => ({ say, all: [
        { v: fxy(f, 0, 3), eq: fxy(f, 2, 3), tol: 1e-5 }, zero(fxy(f, 5, 1)), { v: fxy(f, 0, 2), lt: 0 }] })) } },
    { id: "cg-10a-007", rank: 2, answerKind: "numeric",
      prompt: "\\text{畫 }y'=(y-1)(y-3)\\text{ 的斜率場，看通過 }(0,2)\\text{ 的那條解曲線。}x\\to\\infty\\text{ 時 }y\\text{ 趨近多少？}",
      answer: "1", timeLimit: 60, tags: ["ode-slope-field", "equilibrium", "ode"],
      hints: ["先找水平的線段：哪些 y 讓右邊等於 0？", "在 1 < y < 3 之間，右邊是正還是負？解往哪邊走？"],
      solution: "平衡解 y = 1、3。在 1 < y < 3，(y−1)(y−3) < 0，解一路往下，被 y = 1 接住：極限是 1。",
      solutionSteps: ["y′ = 0 ⟹ y = 1 或 3（水平線段）。", "1 < y < 3 時 y′ < 0，解遞減。", "解不能穿過平衡解 y = 1 ⟹ y → 1。"],
      verify: { m: "odeValue", f: "(y-1)(y-3)", y0: [0, 2], at: 40 } },

    /* ═══════ 10A initial-value-problem ═══════ */
    { id: "cg-10a-008", rank: 2, answerKind: "numeric",
      prompt: "y'=y^2,\\ y(0)=\\tfrac12\\text{ 的解是 }y=\\frac{1}{2-x}\\text{。含 }x=0\\text{ 的最大存在區間是 }(-\\infty,b)\\text{，求 }b",
      answer: "2", timeLimit: 60, tags: ["ivp-interval-of-existence", "ivp", "blow-up"],
      hints: ["公式在哪裡沒有定義？", "存在區間要是一整段、而且包含初始點 x = 0。"],
      solution: "1/(2−x) 在 x = 2 爆掉。含 0 的那一段是 (−∞, 2)，所以 b = 2；x > 2 那一段是另一條解，不算。",
      solutionSteps: ["公式在 x = 2 沒有定義（分母 0）。", "包含 x = 0 的連通區間是 (−∞, 2)。", "b = 2。"],
      verify: { m: "choice", options: [
        { say: "2", all: [{ v: { m: "odeValue", f: "y^2", y0: [0, 0.5], at: 1.999 }, gt: 500 },
          { v: { m: "odeValue", f: "y^2", y0: [0, 0.5], at: 1.9 }, lt: 500 }] },
        { say: "1", all: [{ v: { m: "odeValue", f: "y^2", y0: [0, 0.5], at: 0.999 }, gt: 500 }] },
        { say: "4", all: [{ v: { m: "odeValue", f: "y^2", y0: [0, 0.5], at: 1.999 }, lt: 500 }] }
      ] } },
    { id: "cg-10a-009", rank: 3, answerKind: "numeric",
      prompt: "y'=1+y^2,\\ y(0)=1\\text{ 的解是 }y=\\tan\\left(x+\\frac{\\pi}{4}\\right)\\text{。含 }x=0\\text{ 的最大存在區間是 }(a,b)\\text{，求 }a",
      answer: "-3*pi/4", timeLimit: 90, tags: ["ivp-interval-of-existence", "ivp", "blow-up"],
      hints: ["tan u 在哪些 u 爆掉？", "x = 0 對應 u = π/4，往左找最近的那一個爆點。"],
      solution: "u = x + π/4 要落在含 π/4 的那一段 (−π/2, π/2)，所以 −3π/4 < x < π/4，a = −3π/4。",
      solutionSteps: ["tan u 在 (−π/2, π/2) 上有定義、連續。", "x = 0 ⟹ u = π/4 在這一段裡。", "−π/2 < x + π/4 < π/2 ⟹ a = −3π/4。"],
      verify: { m: "choice", options: [
        { say: "-3*pi/4", all: [{ v: { m: "odeValue", f: "1+y^2", y0: [0, 1], at: -3 * Math.PI / 4 + 0.001 }, lt: -500 },
          { v: { m: "odeValue", f: "1+y^2", y0: [0, 1], at: -3 * Math.PI / 4 + 0.1 }, gt: -500 }] },
        { say: "-pi/4", all: [{ v: { m: "odeValue", f: "1+y^2", y0: [0, 1], at: -Math.PI / 4 + 0.001 }, lt: -500 }] },
        { say: "-pi/2", all: [{ v: { m: "odeValue", f: "1+y^2", y0: [0, 1], at: -Math.PI / 2 + 0.001 }, lt: -500 }] }
      ] } },
    { id: "cg-10a-010", rank: 3, answerKind: "text",
      prompt: "y'=3y^{2/3},\\ y(0)=0\\text{。下列敘述何者正確？}",
      answer: "至少有兩個解", answers: ["至少有兩個解"], canonical: "至少有兩個解",
      distractors: ["恰好一個解，就是 y=0", "沒有解"],
      timeLimit: 90, tags: ["ivp-existence-uniqueness", "ivp", "trap-drill"],
      hints: ["y = 0 顯然是一個解。再試試 y = xⁿ 型的函數。", "唯一性定理要 ∂f/∂y 連續；y^{2/3} 對 y 的導數在 y = 0 會怎樣？"],
      solution: "y = 0 是解；y = x³ 也是：y′ = 3x² = 3(x³)^{2/3}，且 y(0) = 0。∂f/∂y = 2y^{−1/3} 在 y = 0 不連續，唯一性不保證。",
      solutionSteps: ["y = 0 代入兩邊都是 0，是解。", "y = x³：y′ = 3x²，3y^{2/3} = 3x²，y(0) = 0，也是解。", "∂f/∂y = 2y^{−1/3} 在 y = 0 爆掉 ⟹ 唯一性條件不成立，至少有兩個解。"],
      verify: { m: "choice", options: [
        { say: "至少有兩個解", all: [zero(res1("0", "3y^{2/3}", 0.5)), zero(res1("x^3", "3y^{2/3}", 0.5)),
          zero(res1("x^3", "3y^{2/3}", 1.3)), zero(at("x^3", 0)), nonzero(at("x^3", 1))] },
        { say: "恰好一個解，就是 y=0", all: [nonzero(res1("x^3", "3y^{2/3}", 0.5))] },
        { say: "沒有解", all: [nonzero(res1("0", "3y^{2/3}", 0.5))] }
      ] } },
    { id: "cg-10a-011", rank: 3, answerKind: "text",
      prompt: "\\text{對 }y'=\\sqrt{y-1}\\text{，存在唯一定理（}f\\text{ 與 }\\partial f/\\partial y\\text{ 在初始點附近連續）能保證下列哪一個初值問題有唯一解？}",
      answer: "y(0)=2", answers: ["y(0)=2"], canonical: "y(0)=2", distractors: ["y(0)=1", "y(3)=1"],
      timeLimit: 90, tags: ["ivp-existence-uniqueness", "ivp"],
      hints: ["算 ∂f/∂y，看它在哪些 y 會爆掉。", "定理只看初始點的 y 值；x 是多少不重要。"],
      solution: "∂f/∂y = 1/(2√(y−1))，在 y = 1 爆掉、在 y = 2 附近連續。所以只有 y(0)=2 被保證唯一；y = 1 出發時 y ≡ 1 與 y = 1 + x²/4 都是解。",
      solutionSteps: ["f = √(y−1) 在 y ≥ 1 連續。", "∂f/∂y = 1/(2√(y−1))：y = 1 時無界。", "初始 y = 2 時兩者都連續 ⟹ 只有 y(0)=2 被保證。"],
      verify: { m: "choice", options: [["y(0)=2", 0, 2], ["y(0)=1", 0, 1], ["y(3)=1", 3, 1]].map(([say, x0, y0]) => ({ say, all: [
        { v: { m: "let", f: "\\frac{a-b}{0.000001}", with: { a: fxy("\\sqrt{y-1}", x0, y0 + 1e-6), b: fxy("\\sqrt{y-1}", x0, y0) } }, lt: 10 }] })) } },
    { id: "cg-10a-012", rank: 1, answerKind: "expression", variable: "x",
      prompt: "y'=-2y,\\quad y(1)=5,\\quad \\text{求 }y(x)",
      answer: "5*exp(2-2*x)", timeLimit: 60, tags: ["ivp-solve-constant", "ivp", "separable"],
      hints: ["通解是 Ce^{−2x}。", "條件在 x = 1：代 x = 1 而不是 x = 0。"],
      solution: "y = Ce^{−2x}。y(1) = Ce^{−2} = 5 ⟹ C = 5e²。y = 5e^{2−2x}。",
      solutionSteps: ["通解 y = Ce^{−2x}。", "代 x = 1：Ce^{−2} = 5 ⟹ C = 5e²。", "y = 5e^{2−2x}。"],
      verify: { m: "ode1", f: "-2y", y0: [1, 5] } },

    /* ═══════ 10A separation-of-variables ═══════ */
    { id: "cg-10a-013", rank: 1, ...pick("丙"),
      prompt: "\\text{下列哪一個方程可以分離變數？}\\ " + JIA + "y'=x+y" + YI + "y'=\\sin(xy)" + BING + "y'=x^2y+y" + DING + "y'=x+y^2",
      timeLimit: 60, tags: ["separable-recognize", "separable"],
      hints: ["可分離 = 右邊能寫成「只含 x 的式子」乘「只含 y 的式子」。", "試著提公因式。"],
      solution: "丙：x²y + y = (x² + 1)·y，是 g(x)h(y)。甲、丁是相加拆不開；乙的 sin(xy) 也拆不成乘積。",
      solutionSteps: ["丙提出 y：(x²+1)y，可分離。", "x + y、x + y² 是和，拆不成乘積。", "sin(xy) ≠ g(x)h(y) ⟹ 只有丙。"],
      verify: { m: "choice", options: [["甲", "x+y"], ["乙", "\\sin(xy)"], ["丙", "x^2y+y"], ["丁", "x+y^2"]]
        .map(([say, f]) => ({ say, all: separable(f) })) } },
    { id: "cg-10a-014", rank: 1, ...pick("甲"),
      prompt: "\\text{下列哪一個方程可以分離變數？}\\ " + JIA + "y'=e^{x+y}" + YI + "y'=e^{xy}" + BING + "y'=\\ln(x+y)" + DING + "y'=x-y",
      timeLimit: 60, tags: ["separable-recognize", "separable", "trap-drill"],
      hints: ["指數律：e^{a+b} 可以拆成什麼？", "e^{xy} 能不能拆？"],
      solution: "甲：e^{x+y} = eˣ·eʸ，可分離。乙 e^{xy}、丙 ln(x+y)、丁 x − y 都拆不成 g(x)h(y)。",
      solutionSteps: ["e^{x+y} = eˣ·eʸ ⟹ 甲可分離。", "e^{xy}、ln(x+y)、x − y 都不是乘積形式。", "答案甲。"],
      verify: { m: "choice", options: [["甲", "e^{x+y}"], ["乙", "e^{xy}"], ["丙", "\\ln(x+y)"], ["丁", "x-y"]]
        .map(([say, f]) => ({ say, all: separable(f) })) } },
    { id: "cg-10a-015", rank: 2, answerKind: "set",
      prompt: "y'=\\left(y^2-y-2\\right)\\cos x\\text{。分離變數時要除以 }y^2-y-2\\text{，會漏掉常數解。求所有常數解 }y=c\\,\\text{ 的 }\\,c",
      answer: "{-1, 2}", timeLimit: 60, tags: ["separable-equilibrium", "separable", "equilibrium"],
      hints: ["常數解的 y′ = 0，所以右邊要對每個 x 都是 0。", "cos x 不會恆為 0，只能讓另一個因式為 0。"],
      solution: "y = c 是解 ⟺ (c² − c − 2)cos x ≡ 0 ⟺ c² − c − 2 = 0 ⟺ c = −1 或 2。",
      solutionSteps: ["常數解：y′ = 0，右邊必須恆為 0。", "cos x 不恆為 0 ⟹ c² − c − 2 = 0。", "(c−2)(c+1) = 0 ⟹ c = −1、2。"],
      verify: { m: "zeros", f: "\\left(x^2-x-2\\right)\\cos(0.4)", range: [-10, 10] } },
    { id: "cg-10a-016", rank: 2, answerKind: "expression", variable: "x",
      prompt: "y'=x\\left(y^2-4\\right),\\quad y(0)=2,\\quad \\text{求 }y(x)",
      answer: "2", timeLimit: 60, tags: ["separable-equilibrium", "separable", "trap-drill"],
      hints: ["分離前先問：初始值是不是讓右邊變成 0？", "右邊恆為 0 的話，y′ 是多少？"],
      solution: "y = 2 讓 y² − 4 = 0，是常數解，而且滿足 y(0) = 2。分離變數的公式除以 y² − 4，正好漏掉它。",
      solutionSteps: ["y(0) = 2 ⟹ 右邊在初始點是 0。", "y ≡ 2：y′ = 0 = x(4 − 4)，是解。", "唯一性成立（右邊可微）⟹ y = 2。"],
      verify: { m: "ode1", f: "x(y^2-4)", y0: [0, 2] } },

    /* ═══════ 10A first-order-linear ═══════ */
    { id: "cg-10a-017", rank: 1, answerKind: "expression", variable: "x",
      prompt: "xy'+2y=x^3\\ (x>0)\\text{ 寫成標準形 }y'+P(x)y=Q(x)\\text{，求 }P(x)",
      answer: "2/x", timeLimit: 45, tags: ["linear-standard-form", "linear-first-order", "trap-drill"],
      hints: ["標準形的 y′ 係數要是 1。", "整條方程除以 y′ 前面的係數。"],
      solution: "兩邊除以 x：y′ + (2/x)y = x²。P(x) = 2/x（不是 2）。",
      solutionSteps: ["y′ 的係數是 x，先除以 x。", "y′ + (2/x)y = x²。", "P(x) = 2/x，Q(x) = x²。"],
      verify: { m: "fn", cases: [0.5, 1.3, 2.2].map((x0) => ({ at: { x: x0 }, v: { m: "let", f: "\\frac{a}{b}", with: {
        a: { m: "deriv", f: "xp+2y-x^3", vars: ["x", "y", "p"], at: [x0, 0.7, 0.3], wrt: "y" },
        b: { m: "deriv", f: "xp+2y-x^3", vars: ["x", "y", "p"], at: [x0, 0.7, 0.3], wrt: "p" } } } })) } },
    { id: "cg-10a-018", rank: 1, answerKind: "numeric",
      prompt: "y'=3y+\\sin x\\text{ 寫成標準形 }y'+P(x)y=Q(x)\\text{，求 }P(x)",
      answer: "-3", timeLimit: 45, tags: ["linear-standard-form", "linear-first-order", "trap-drill"],
      hints: ["把含 y 的項全部搬到左邊。", "移項要變號。"],
      solution: "移項：y′ − 3y = sin x。P(x) = −3，Q(x) = sin x。",
      solutionSteps: ["3y 搬到左邊變 −3y。", "y′ − 3y = sin x。", "P(x) = −3。"],
      verify: { m: "let", f: "\\frac{a}{b}", with: {
        a: { m: "deriv", f: "p-3y-\\sin x", vars: ["x", "y", "p"], at: [0.9, 0.7, 0.3], wrt: "y" },
        b: { m: "deriv", f: "p-3y-\\sin x", vars: ["x", "y", "p"], at: [0.9, 0.7, 0.3], wrt: "p" } } } },
    { id: "cg-10a-019", rank: 1, ...pick("甲"),
      prompt: "\\text{下列哪一個是一階線性方程？}\\ " + JIA + "y'+x^2y=e^x" + YI + "y'+y^2=x" + BING + "yy'=x" + DING + "y'=\\sin y",
      timeLimit: 60, tags: ["linear-standard-form", "linear-first-order"],
      hints: ["線性：y 與 y′ 都只能是一次、係數只能含 x。", "y²、yy′、sin y 都不行。"],
      solution: "甲是 y′ + P y = Q 的樣子（P = x²、Q = eˣ）。乙有 y²，丙有 y·y′，丁有 sin y，都不是線性。",
      solutionSteps: ["甲：y′ + x²y = eˣ，P = x²、Q = eˣ。", "乙 y²、丙 yy′、丁 sin y 對 y 不是一次。", "答案甲。"],
      verify: { m: "choice", options: [["甲", "e^x-x^2y"], ["乙", "x-y^2"], ["丙", "\\frac{x}{y}"], ["丁", "\\sin y"]]
        .map(([say, f]) => ({ say, all: [zero(affineGap(f, 0.7)), zero(affineGap(f, 1.4))] })) } },
    { id: "cg-10a-020", rank: 2, answerKind: "expression", variable: "x",
      prompt: "\\text{已知 }y_p=x^2\\text{ 是 }y'+\\frac{2}{x}y=4x\\ (x>0)\\text{ 的一個解。寫出通解，並求滿足 }y(1)=3\\text{ 的解}",
      answer: "x^2+2/x^2", timeLimit: 90, tags: ["linear-solution-structure", "linear-first-order", "ivp"],
      hints: ["通解 = 特解 + 齊次方程 y′ + (2/x)y = 0 的通解。", "齊次方程可分離：dy/y = −(2/x)dx。"],
      solution: "齊次解 y_h = C/x²。通解 y = x² + C/x²。y(1) = 1 + C = 3 ⟹ C = 2。",
      solutionSteps: ["齊次：dy/y = −2dx/x ⟹ y_h = C x⁻²。", "通解 y = x² + C x⁻²。", "y(1) = 1 + C = 3 ⟹ C = 2，y = x² + 2/x²。"],
      verify: { m: "ode1", f: "4x-\\frac{2y}{x}", y0: [1, 3], from: 0.5, to: 2.5 } },
    { id: "cg-10a-021", rank: 2, answerKind: "expression", variable: "x",
      prompt: "\\text{已知 }y_p=\\sin x\\text{ 是 }y'+y=\\sin x+\\cos x\\text{ 的一個解。求滿足 }y(0)=4\\text{ 的解}",
      answer: "sin(x)+4*exp(-x)", timeLimit: 75, tags: ["linear-solution-structure", "linear-first-order", "ivp"],
      hints: ["齊次方程 y′ + y = 0 的通解是什麼？", "常數要在「特解 + 齊次解」上定，不是只在齊次解上。"],
      solution: "通解 y = sin x + Ce^{−x}。y(0) = 0 + C = 4 ⟹ C = 4。",
      solutionSteps: ["齊次解 Ce^{−x}。", "通解 y = sin x + Ce^{−x}。", "y(0) = C = 4 ⟹ y = sin x + 4e^{−x}。"],
      verify: { m: "ode1", f: "\\sin x+\\cos x-y", y0: [0, 4] } },

    /* ═══════ 10A integrating-factor ═══════ */
    { id: "cg-10a-022", rank: 1, answerKind: "expression", variable: "x",
      prompt: "y'-4y=x\\text{ 的積分因子 }\\mu(x)\\text{（取 }\\mu(0)=1\\text{）}",
      answer: "exp(-4*x)", timeLimit: 45, tags: ["integrating-factor-compute", "integrating-factor", "linear-first-order"],
      hints: ["μ = e^{∫P dx}，P 是標準形裡 y 的係數。", "P 的正負號照抄，不要丟掉負號。"],
      solution: "P = −4，μ = e^{∫−4 dx} = e^{−4x}。",
      solutionSteps: ["標準形 y′ + (−4)y = x ⟹ P = −4。", "∫P dx = −4x。", "μ = e^{−4x}。"],
      verify: { m: "ode1", f: "-4y", y0: [0, 1] } },
    { id: "cg-10a-023", rank: 1, answerKind: "expression", variable: "x",
      prompt: "y'+\\frac{3}{x}y=1\\ (x>0)\\text{ 的積分因子 }\\mu(x)\\text{（取 }\\mu(1)=1\\text{）}",
      answer: "x^3", timeLimit: 45, tags: ["integrating-factor-compute", "integrating-factor", "linear-first-order"],
      hints: ["∫(3/x) dx = 3 ln x。", "e^{3 ln x} 化簡成冪次。"],
      solution: "μ = e^{∫3/x dx} = e^{3 ln x} = x³。",
      solutionSteps: ["P = 3/x，∫P dx = 3 ln x。", "e^{3 ln x} = x³。", "μ = x³，μ(1) = 1 符合。"],
      verify: { m: "ode1", f: "\\frac{3y}{x}", y0: [1, 1], from: 0.5, to: 2.5 } },
    { id: "cg-10a-024", rank: 2, answerKind: "expression", variable: "x",
      prompt: "\\text{解 }y'+2y=e^x\\text{ 時算到 }e^{2x}y=\\frac13e^{3x}+C\\,\\text{。若 }\\,y(0)=1\\text{，求 }y(x)",
      answer: "exp(x)/3+2*exp(-2*x)/3", timeLimit: 75, tags: ["integrating-factor-constant-placement", "integrating-factor", "ivp"],
      hints: ["兩邊同除以 e^{2x}，常數 C 也要一起除。", "可以先代 x = 0 把 C 定出來。"],
      solution: "代 x = 0：1 = 1/3 + C ⟹ C = 2/3。除以 e^{2x}：y = eˣ/3 + (2/3)e^{−2x}。C 後面要跟著 e^{−2x}。",
      solutionSteps: ["x = 0：e⁰·1 = 1/3 + C ⟹ C = 2/3。", "整條除以 e^{2x}：y = (1/3)eˣ + C e^{−2x}。", "y = eˣ/3 + (2/3)e^{−2x}。"],
      verify: { m: "ode1", f: "e^x-2y", y0: [0, 1] } },

    /* ═══════ 10A exact-equations ═══════ */
    { id: "cg-10a-025", rank: 2, ...pick("乙"),
      prompt: "\\text{下列哪一個方程是正合方程？}\\ " + JIA + "(y^2+x)\\,dx+(x^2+y)\\,dy=0" + YI + "(2xy+y^2)\\,dx+(x^2+2xy)\\,dy=0" + BING + "3x^2y\\,dx+x^2\\,dy=0" + DING + "xy\\,dx+(x+y)\\,dy=0",
      timeLimit: 90, tags: ["exact-test", "exact-equation", "trap-drill"],
      hints: ["M dx + N dy = 0 正合 ⟺ ∂M/∂y = ∂N/∂x。", "是 M 對 y、N 對 x —— 比錯成 ∂M/∂x 與 ∂N/∂y 會掉進陷阱。"],
      solution: "乙：M_y = 2x + 2y = N_x，正合。甲 M_y = 2y、N_x = 2x（M_x = N_y = 1 是比錯的陷阱）；丙 3x² ≠ 2x；丁 x ≠ 1。",
      solutionSteps: ["乙：M_y = 2x + 2y，N_x = 2x + 2y，相等。", "甲：M_y = 2y ≠ 2x = N_x（比 M_x、N_y 才會誤以為相等）。", "丙、丁也不相等 ⟹ 乙。"],
      verify: { m: "choice", options: [
        ["甲", "y^2+x", "x^2+y"], ["乙", "2xy+y^2", "x^2+2xy"], ["丙", "3x^2y", "x^2"], ["丁", "xy", "x+y"]
      ].map(([say, M, N]) => ({ say, all: exact(M, N) })) } },
    { id: "cg-10a-026", rank: 2, answerKind: "numeric",
      prompt: "\\left(a\\,xy^2+1\\right)dx+\\left(3x^2y+2y\\right)dy=0\\text{ 是正合方程，求常數 }a",
      answer: "3", timeLimit: 60, tags: ["exact-test", "exact-equation"],
      hints: ["寫出 ∂M/∂y 與 ∂N/∂x。", "兩個要對所有 (x, y) 相等，比較係數。"],
      solution: "M_y = 2axy，N_x = 6xy。2a = 6 ⟹ a = 3。",
      solutionSteps: ["M_y = 2axy。", "N_x = 6xy。", "2a = 6 ⟹ a = 3。"],
      verify: { m: "choice", options: [["3", "3xy^2+1"], ["6", "6xy^2+1"], ["2", "2xy^2+1"]]
        .map(([say, M]) => ({ say, all: exact(M, "3x^2y+2y") })) } },
    { id: "cg-10a-027", rank: 3, answerKind: "expression", variables: ["x", "y"],
      prompt: "\\left(3x^2+2y\\right)dx+\\left(2x+4y^3\\right)dy=0\\text{ 是正合方程。求 }F(x,y)\\text{ 使 }F_x=M,\\ F_y=N\\text{，並取 }F(0,0)=0\\text{（解就是 }F=C\\text{）}",
      answer: "x^3+2*x*y+y^4", timeLimit: 120, tags: ["exact-find-potential", "exact-equation"],
      hints: ["先對 x 積分 M，常數改成 g(y)。", "再對 y 偏微分，跟 N 比較求 g′(y)。"],
      solution: "F = ∫(3x² + 2y)dx = x³ + 2xy + g(y)。F_y = 2x + g′(y) = 2x + 4y³ ⟹ g = y⁴。F = x³ + 2xy + y⁴。",
      solutionSteps: ["F = x³ + 2xy + g(y)。", "F_y = 2x + g′(y) = 2x + 4y³ ⟹ g′ = 4y³，g = y⁴（常數取 0）。", "F = x³ + 2xy + y⁴，解為 F = C。"],
      verify: { m: "fn", vars: ["x", "y"], cases: [[1, 2], [-0.5, 1.3], [0.8, -0.7]].map(([a, b]) => ({ at: { x: a, y: b },
        v: potential("3x^2+2y", "2x+4y^3", a, b) })) } },
    { id: "cg-10a-028", rank: 3, answerKind: "expression", variables: ["x", "y"],
      prompt: "\\left(e^x\\cos y+2x\\right)dx+\\left(1-e^x\\sin y\\right)dy=0\\text{ 是正合方程。求 }F(x,y)\\text{ 使 }F_x=M,\\ F_y=N\\text{，並取 }F(0,0)=0",
      answer: "exp(x)*cos(y)+x^2+y-1", timeLimit: 150, tags: ["exact-find-potential", "exact-equation"],
      hints: ["對 x 積分 M：eˣ cos y 的反導數還是它自己。", "最後檢查 F(0,0)：e⁰ cos 0 = 1，要扣掉。"],
      solution: "F = eˣcos y + x² + g(y)。F_y = −eˣ sin y + g′ = 1 − eˣ sin y ⟹ g = y + k。F(0,0) = 1 + k = 0 ⟹ k = −1。",
      solutionSteps: ["F = eˣ cos y + x² + g(y)。", "F_y = −eˣ sin y + g′(y) = N ⟹ g′ = 1，g = y + k。", "F(0,0) = 1 + k = 0 ⟹ F = eˣ cos y + x² + y − 1。"],
      verify: { m: "fn", vars: ["x", "y"], cases: [[1, 2], [-0.5, 1.3], [0.8, -0.7]].map(([a, b]) => ({ at: { x: a, y: b },
        v: potential("e^x\\cos y+2x", "1-e^x\\sin y", a, b) })) } },
    { id: "cg-10a-029", rank: 3, answerKind: "numeric",
      prompt: "\\left(y^2+2x\\right)dx+\\left(2xy+3\\right)dy=0\\text{ 的解曲線通過 }(1,1)\\text{。求它在 }x=0\\text{ 時的 }y\\text{ 值}",
      answer: "5/3", timeLimit: 150, tags: ["exact-find-potential", "exact-equation", "ivp"],
      hints: ["先檢查正合，再求 F 使 F_x = M、F_y = N。", "解曲線是 F = 常數；常數用 (1,1) 定，再代 x = 0。"],
      solution: "M_y = 2y = N_x，正合。F = xy² + x² + 3y。F(1,1) = 5。x = 0：3y = 5 ⟹ y = 5/3。",
      solutionSteps: ["M_y = N_x = 2y，正合。", "F = xy² + x² + g(y)，F_y = 2xy + g′ = 2xy + 3 ⟹ F = xy² + x² + 3y。", "F(1,1) = 5；x = 0 時 3y = 5 ⟹ y = 5/3。"],
      verify: { m: "odeValue", f: "-\\frac{y^2+2x}{2xy+3}", y0: [1, 1], at: 0 } },

    /* ═══════ 10B second-order-linear ═══════ */
    { id: "cg-10b-001", rank: 1, ...pick("甲"),
      prompt: "y_1=e^{x},\\ y_2=e^{-2x}\\text{ 都是 }y''+y'-2y=0\\text{ 的解。下列哪一個也一定是解？}\\ " + JIA + "3e^{x}-5e^{-2x}" + YI + "e^{x}\\cdot e^{-2x}" + BING + "e^{x}+1" + DING + "e^{2x}",
      timeLimit: 60, tags: ["second-order-superposition", "second-order", "constant-coefficients"],
      hints: ["齊次線性方程：解的線性組合 C₁y₁ + C₂y₂ 還是解。", "乘積、加常數都不是線性組合。"],
      solution: "甲 = 3y₁ − 5y₂，是線性組合，一定是解。乙是乘積 e^{−x}，丙加了常數，丁不是 y₁、y₂ 的組合，代進去都不為 0。",
      solutionSteps: ["疊加原理：C₁y₁ + C₂y₂ 是解。", "甲 = 3y₁ − 5y₂ ✓。", "乙 e^{−x}：1 − 1 − 2 ≠ 0；丙 eˣ + 1 多出 −2；丁 e^{2x}：4 + 2 − 2 ≠ 0。"],
      verify: { m: "choice", options: [["甲", "3e^{x}-5e^{-2x}"], ["乙", "e^{x}\\cdot e^{-2x}"], ["丙", "e^{x}+1"], ["丁", "e^{2x}"]]
        .map(([say, f]) => ({ say, all: [zero(res2(f, [1, 1, -2], 0.4)), zero(res2(f, [1, 1, -2], 1.1))] })) } },
    { id: "cg-10b-002", rank: 2, ...pick("乙"),
      prompt: "y_1=x,\\ y_2=x+e^{x}\\text{ 都是 }y''-y'=-1\\text{ 的解。下列哪一個也是這個方程的解？}\\ " + JIA + "y_1+y_2" + YI + "2y_2-y_1" + BING + "3y_1" + DING + "y_2-y_1",
      timeLimit: 90, tags: ["second-order-superposition", "second-order", "trap-drill"],
      hints: ["非齊次方程：兩個解相減得到的是齊次方程的解。", "L[ay₁ + by₂] = (a + b)·(−1)，什麼時候等於 −1？"],
      solution: "L[ay₁ + by₂] = −(a + b)，要等於 −1 需 a + b = 1。乙 2y₂ − y₁ 合格；甲給 −2、丙給 −3、丁給 0（它解的是齊次方程）。",
      solutionSteps: ["L[y] = y″ − y′ 是線性的：L[ay₁ + by₂] = −(a + b)。", "要 −(a + b) = −1 ⟹ a + b = 1。", "乙：2 + (−1) = 1 ✓；甲 2、丙 3、丁 0 都不行。"],
      verify: { m: "choice", options: [["甲", "2x+e^{x}"], ["乙", "x+2e^{x}"], ["丙", "3x"], ["丁", "e^{x}"]]
        .map(([say, f]) => ({ say, all: [zero(res2(f, [1, -1, 0], 0.4, "-1")), zero(res2(f, [1, -1, 0], 1.1, "-1"))] })) } },
    { id: "cg-10b-003", rank: 2, answerKind: "expression", variable: "x",
      prompt: "y_1=e^{3x},\\ y_2=2e^{3x},\\ y_3=e^{-x}\\text{ 都是 }y''-2y'-3y=0\\text{ 的解。挑兩個能組成通解的，求滿足 }y(0)=2,\\ y'(0)=2\\text{ 的解}",
      answer: "exp(3*x)+exp(-x)", timeLimit: 90, tags: ["second-order-general-solution", "second-order", "ivp"],
      hints: ["y₂ 只是 y₁ 的倍數，兩者不獨立。", "用 C₁e^{3x} + C₂e^{−x}，代兩個條件解聯立。"],
      solution: "y₁、y₂ 成比例（Wronskian 為 0），要用 y₁ 與 y₃。y = C₁e^{3x} + C₂e^{−x}：C₁ + C₂ = 2、3C₁ − C₂ = 2 ⟹ C₁ = C₂ = 1。",
      solutionSteps: ["y₂ = 2y₁，不獨立；y₁ 與 y₃ 獨立。", "y = C₁e^{3x} + C₂e^{−x}，y′ = 3C₁e^{3x} − C₂e^{−x}。", "C₁ + C₂ = 2，3C₁ − C₂ = 2 ⟹ C₁ = C₂ = 1。"],
      verify: { m: "ode2const", a: 1, b: -2, c: -3, y0: [0, 2], yp0: [0, 2] } },
    { id: "cg-10b-004", rank: 2, ...pick("乙"),
      prompt: "\\text{下列哪一組 }y_1,y_2\\text{ 可以組成 }y''-4y=0\\text{ 的通解 }C_1y_1+C_2y_2\\text{？}\\ " + JIA + "e^{2x},\\,-e^{2x}" + YI + "\\sinh 2x,\\,\\cosh 2x" + BING + "e^{2x},\\,xe^{2x}" + DING + "e^{-2x},\\,4e^{-2x}",
      timeLimit: 90, tags: ["second-order-general-solution", "second-order", "second-order-wronskian"],
      hints: ["兩個條件：兩個都是解，而且 Wronskian 不為 0。", "成倍數的兩個函數 Wronskian 是 0。"],
      solution: "乙：sinh 2x、cosh 2x 都是解，W = 2sinh²2x − 2cosh²2x = −2 ≠ 0。甲、丁成倍數；丙的 xe^{2x} 不是解（不是重根）。",
      solutionSteps: ["甲、丁成倍數 ⟹ W = 0。", "丙：(xe^{2x})″ − 4xe^{2x} = 4e^{2x} ≠ 0，不是解。", "乙兩個都是解，W = −2 ≠ 0 ⟹ 乙。"],
      verify: { m: "choice", options: [
        ["甲", "e^{2x}", "-e^{2x}"], ["乙", "\\sinh(2x)", "\\cosh(2x)"], ["丙", "e^{2x}", "x\\,e^{2x}"], ["丁", "e^{-2x}", "4e^{-2x}"]
      ].map(([say, f, g]) => ({ say, all: [zero(res2(f, [1, 0, -4], 0.5)), zero(res2(g, [1, 0, -4], 0.5)), nonzero(wronskian(f, g, 0.5))] })) } },

    /* ═══════ 10B characteristic-equation ═══════ */
    ...[
      ["cg-10b-005", "2y''-5y'+3y=0", [2, -5, 3], "2*r^2-5*r+3", "y″ → r²、y′ → r、y → 1，係數照抄。", "2r² − 5r + 3 = 0。"],
      ["cg-10b-006", "y''-7y=0", [1, 0, -7], "r^2-7", "沒有 y′ 項，就沒有 r 的一次項。", "r² − 7 = 0（沒有 r 項）。"],
      ["cg-10b-007", "4y''+9y'=0", [4, 9, 0], "4*r^2+9*r", "沒有 y 項，就沒有常數項。", "4r² + 9r = 0（沒有常數項）。"]
    ].map(([id, eq, abc, answer, hint2, last]) => ({ id, rank: 1, answerKind: "expression", variable: "r",
      prompt: `\\text{寫出 }${eq}\\text{ 的特徵方程 }p(r)=0\\text{（係數照方程，不要約分），求 }p(r)`,
      answer, timeLimit: 40, tags: ["characteristic-write-equation", "second-order", "constant-coefficients"],
      hints: ["把 y = e^{rx} 代進去，提出 e^{rx}。", hint2],
      solution: `代 y = e^{rx}：y′ = re^{rx}、y″ = r²e^{rx}，提出 e^{rx} 後得 ${last}`,
      solutionSteps: ["代 y = e^{rx}，y′ = re^{rx}，y″ = r²e^{rx}。", "提出 e^{rx}（永不為 0）。", `特徵方程 ${last}`],
      verify: { m: "fn", vars: ["r"], cases: [0.7, -1.3, 2.1].map((r) => ({ at: { r }, v: charAt(abc, r) })) } })),
    { id: "cg-10b-008", rank: 1, answerKind: "text",
      prompt: "2y''+3y'+2y=0\\text{ 的特徵根是哪一種？}",
      answer: "共軛複根", answers: ["共軛複根"], canonical: "共軛複根", distractors: ["相異實根", "重根"],
      timeLimit: 40, tags: ["characteristic-classify-discriminant", "second-order", "complex-roots"],
      hints: ["特徵方程 ar² + br + c = 0，看判別式 b² − 4ac 的正負。", "首項係數 2 也要乘進 4ac。"],
      solution: "2r² + 3r + 2 = 0，判別式 9 − 16 = −7 < 0，共軛複根。",
      solutionSteps: ["特徵方程 2r² + 3r + 2 = 0。", "b² − 4ac = 9 − 16 = −7。", "< 0 ⟹ 共軛複根。"],
      verify: { m: "choice", options: [
        { say: "相異實根", all: [{ v: disc([2, 3, 2]), gt: 0, tol: 1e-4 }] },
        { say: "重根", all: [{ v: disc([2, 3, 2]), eq: 0, tol: 1e-4 }] },
        { say: "共軛複根", all: [{ v: disc([2, 3, 2]), lt: 0, tol: 1e-4 }] }] } },
    { id: "cg-10b-009", rank: 2, answerKind: "text",
      prompt: "9y''-12y'+4y=0\\text{ 的特徵根是哪一種？}",
      answer: "重根", answers: ["重根"], canonical: "重根", distractors: ["相異實根", "共軛複根"],
      timeLimit: 45, tags: ["characteristic-classify-discriminant", "second-order", "repeated-root"],
      hints: ["算判別式 b² − 4ac。", "也可以看看 9r² − 12r + 4 是不是完全平方。"],
      solution: "9r² − 12r + 4 = (3r − 2)²，判別式 144 − 144 = 0，重根 r = 2/3。",
      solutionSteps: ["特徵方程 9r² − 12r + 4 = 0。", "b² − 4ac = 144 − 144 = 0。", "= 0 ⟹ 重根（r = 2/3）。"],
      verify: { m: "choice", options: [
        { say: "相異實根", all: [{ v: disc([9, -12, 4]), gt: 0, tol: 1e-4 }] },
        { say: "重根", all: [{ v: disc([9, -12, 4]), eq: 0, tol: 1e-4 }] },
        { say: "共軛複根", all: [{ v: disc([9, -12, 4]), lt: 0, tol: 1e-4 }] }] } },

    /* ═══════ 10B distinct-real-roots ═══════ */
    { id: "cg-10b-010", rank: 2, answerKind: "expression", variable: "x",
      prompt: "2y''-3y'-2y=0,\\quad y(0)=3,\\ y'(0)=1,\\quad \\text{求 }y(x)",
      answer: "exp(2*x)+2*exp(-x/2)", timeLimit: 90, tags: ["ode2-distinct-general", "second-order", "constant-coefficients"],
      hints: ["特徵方程 2r² − 3r − 2 = 0，可以因式分解。", "通解 C₁e^{r₁x} + C₂e^{r₂x}，再用兩個條件解聯立。"],
      solution: "(2r + 1)(r − 2) = 0，r = 2、−1/2。y = C₁e^{2x} + C₂e^{−x/2}：C₁ + C₂ = 3、2C₁ − C₂/2 = 1 ⟹ C₁ = 1、C₂ = 2。",
      solutionSteps: ["2r² − 3r − 2 = (2r+1)(r−2) ⟹ r = 2、−1/2。", "y = C₁e^{2x} + C₂e^{−x/2}。", "C₁ + C₂ = 3，2C₁ − C₂/2 = 1 ⟹ C₁ = 1、C₂ = 2。"],
      verify: { m: "ode2const", a: 2, b: -3, c: -2, y0: [0, 3], yp0: [0, 1] } },
    { id: "cg-10b-011", rank: 2, answerKind: "expression", variable: "x",
      prompt: "y''-3y'=0,\\quad y(0)=1,\\ y'(0)=6,\\quad \\text{求 }y(x)",
      answer: "2*exp(3*x)-1", timeLimit: 75, tags: ["ode2-distinct-general", "second-order", "constant-coefficients"],
      hints: ["特徵方程 r² − 3r = 0 有一個根是 0。", "r = 0 對應的解是 e^{0x} = 常數。"],
      solution: "r(r − 3) = 0，r = 0、3。y = C₁ + C₂e^{3x}。y′(0) = 3C₂ = 6 ⟹ C₂ = 2；C₁ = 1 − 2 = −1。",
      solutionSteps: ["r² − 3r = 0 ⟹ r = 0、3。", "y = C₁ + C₂e^{3x}，y′ = 3C₂e^{3x}。", "3C₂ = 6 ⟹ C₂ = 2，C₁ = −1 ⟹ y = 2e^{3x} − 1。"],
      verify: { m: "ode2const", a: 1, b: -3, c: 0, y0: [0, 1], yp0: [0, 6] } },
    { id: "cg-10b-012", rank: 2, answerKind: "numeric",
      prompt: "y''+2y'=0,\\ y(0)=1,\\ y'(0)=4\\text{。求 }\\lim_{x\\to\\infty}y(x)",
      answer: "3", timeLimit: 75, tags: ["ode2-long-term-behavior", "second-order", "constant-coefficients"],
      hints: ["特徵根 0 與 −2：一項是常數，一項會衰減。", "x → ∞ 時只剩常數那一項，把它定出來。"],
      solution: "y = C₁ + C₂e^{−2x}。y′(0) = −2C₂ = 4 ⟹ C₂ = −2；C₁ = 3。e^{−2x} → 0，極限 3。",
      solutionSteps: ["r(r + 2) = 0 ⟹ y = C₁ + C₂e^{−2x}。", "−2C₂ = 4 ⟹ C₂ = −2，C₁ = 1 + 2 = 3。", "e^{−2x} → 0 ⟹ y → 3。"],
      verify: { m: "ode2Value", f: "-2p", y0: [0, 1], yp0: 4, at: 40 } },
    { id: "cg-10b-013", rank: 2, answerKind: "text",
      prompt: "y''-y'-6y=0,\\ y(0)=1,\\ y'(0)=-3\\text{。}x\\to\\infty\\text{ 時 }y(x)\\text{ 怎麼走？}",
      answer: "趨近負無窮大", answers: ["趨近負無窮大"], canonical: "趨近負無窮大",
      distractors: ["趨近 0", "趨近正無窮大", "趨近一個非零常數"],
      timeLimit: 90, tags: ["ode2-long-term-behavior", "second-order", "trap-drill"],
      hints: ["通解 C₁e^{3x} + C₂e^{−2x}：x 很大時哪一項主宰？", "主宰那一項的係數是正還是負？"],
      solution: "r = 3、−2。C₁ + C₂ = 1、3C₁ − 2C₂ = −3 ⟹ C₁ = −1/5、C₂ = 6/5。e^{3x} 主宰而係數為負：趨近負無窮大。",
      solutionSteps: ["r² − r − 6 = (r−3)(r+2) ⟹ y = C₁e^{3x} + C₂e^{−2x}。", "C₁ + C₂ = 1，3C₁ − 2C₂ = −3 ⟹ C₁ = −1/5。", "e^{3x} 主宰、係數 −1/5 < 0 ⟹ 趨近負無窮大。"],
      verify: { m: "choice", options: [
        { say: "趨近負無窮大", all: [{ v: { m: "ode2Value", f: "p+6y", y0: [0, 1], yp0: -3, at: 6 }, lt: -1e5 },
          { v: { m: "ode2Value", f: "p+6y", y0: [0, 1], yp0: -3, at: 8 }, lt: { m: "ode2Value", f: "p+6y", y0: [0, 1], yp0: -3, at: 6 } }] },
        { say: "趨近正無窮大", all: [{ v: { m: "ode2Value", f: "p+6y", y0: [0, 1], yp0: -3, at: 6 }, gt: 1e5 }] },
        { say: "趨近 0", all: [{ v: { m: "ode2Value", f: "p+6y", y0: [0, 1], yp0: -3, at: 6 }, gt: -1 }] },
        { say: "趨近一個非零常數", all: [{ v: { m: "ode2Value", f: "p+6y", y0: [0, 1], yp0: -3, at: 8 },
          eq: { m: "ode2Value", f: "p+6y", y0: [0, 1], yp0: -3, at: 6 }, tol: 1e-2 }] }] } },

    /* ═══════ 10B repeated-roots ═══════ */
    { id: "cg-10b-014", rank: 2, answerKind: "expression", variable: "x",
      prompt: "4y''-4y'+y=0,\\quad y(0)=2,\\ y'(0)=0,\\quad \\text{求 }y(x)",
      answer: "(2-x)*exp(x/2)", timeLimit: 90, tags: ["ode2-repeated-general", "second-order", "repeated-root"],
      hints: ["4r² − 4r + 1 是完全平方。", "重根 r 的通解是 (C₁ + C₂x)e^{rx}。"],
      solution: "(2r − 1)² = 0，r = 1/2 重根。y = (C₁ + C₂x)e^{x/2}。C₁ = 2；y′(0) = C₂ + C₁/2 = 0 ⟹ C₂ = −1。",
      solutionSteps: ["4r² − 4r + 1 = (2r − 1)² ⟹ r = 1/2（重根）。", "y = (C₁ + C₂x)e^{x/2}，y′(0) = C₂ + C₁/2。", "C₁ = 2，C₂ = −1 ⟹ y = (2 − x)e^{x/2}。"],
      verify: { m: "ode2const", a: 4, b: -4, c: 1, y0: [0, 2], yp0: [0, 0] } },
    { id: "cg-10b-015", rank: 2, answerKind: "numeric",
      prompt: "9y''+6y'+y=0\\text{ 的通解寫成 }\\left(C_1+C_2x\\right)e^{rx}\\text{，求 }r",
      answer: "-1/3", timeLimit: 60, tags: ["ode2-repeated-general", "second-order", "repeated-root"],
      hints: ["寫出特徵方程，看它是不是完全平方。", "首項係數 9 不是 1，根要記得除。"],
      solution: "9r² + 6r + 1 = (3r + 1)² = 0，重根 r = −1/3。",
      solutionSteps: ["特徵方程 9r² + 6r + 1 = 0。", "(3r + 1)² = 0。", "r = −1/3（重根，所以有 xe^{rx}）。"],
      verify: { m: "choice", options: [["-1/3", "-x/3"], ["1/3", "x/3"], ["-3", "-3x"], ["-1/9", "-x/9"]]
        .map(([say, rx]) => ({ say, all: [zero(res2(`e^{${rx}}`, [9, 6, 1], 0.6)), zero(res2(`x\\,e^{${rx}}`, [9, 6, 1], 0.6))] })) } },
    { id: "cg-10b-016", rank: 3, answerKind: "expression", variable: "x",
      prompt: "y''-4y'+4y=0,\\quad y(0)=1,\\ y'(0)=5,\\quad \\text{求 }y(x)",
      answer: "(1+3*x)*exp(2*x)", timeLimit: 100, tags: ["ode2-repeated-ivp", "second-order", "repeated-root"],
      hints: ["重根通解 (C₁ + C₂x)e^{2x}。", "微分時用乘法律：y′ = C₂e^{2x} + 2(C₁ + C₂x)e^{2x}。"],
      solution: "(r − 2)² = 0。y = (C₁ + C₂x)e^{2x}。C₁ = 1；y′(0) = C₂ + 2C₁ = 5 ⟹ C₂ = 3。",
      solutionSteps: ["r = 2 重根，y = (C₁ + C₂x)e^{2x}。", "y(0) = C₁ = 1。", "y′(0) = C₂ + 2C₁ = 5 ⟹ C₂ = 3，y = (1 + 3x)e^{2x}。"],
      verify: { m: "ode2const", a: 1, b: -4, c: 4, y0: [0, 1], yp0: [0, 5] } },

    /* ═══════ 10B complex-roots ═══════ */
    { id: "cg-10b-017", rank: 2, answerKind: "expression", variable: "x",
      prompt: "y''+2y'+4y=0,\\quad y(0)=1,\\ y'(0)=\\sqrt3-1,\\quad \\text{求 }y(x)",
      answer: "exp(-x)*(cos(sqrt(3)*x)+sin(sqrt(3)*x))", timeLimit: 120, tags: ["ode2-complex-general", "second-order", "complex-roots"],
      hints: ["r = (−2 ± √(4 − 16))/2，虛部帶根號。", "通解 e^{αx}(C₁cos βx + C₂sin βx)，y′(0) = αC₁ + βC₂。"],
      solution: "r = −1 ± √3 i。y = e^{−x}(C₁cos√3x + C₂sin√3x)。C₁ = 1；y′(0) = −C₁ + √3C₂ = √3 − 1 ⟹ C₂ = 1。",
      solutionSteps: ["r² + 2r + 4 = 0 ⟹ r = −1 ± √3 i。", "y = e^{−x}(C₁cos√3x + C₂sin√3x)，C₁ = y(0) = 1。", "y′(0) = −1 + √3C₂ = √3 − 1 ⟹ C₂ = 1。"],
      verify: { m: "ode2const", a: 1, b: 2, c: 4, y0: [0, 1], yp0: [0, Math.sqrt(3) - 1] } },
    { id: "cg-10b-018", rank: 2, answerKind: "numeric",
      prompt: "y''-2y'+3y=0\\text{ 的通解寫成 }e^{\\alpha x}\\left(C_1\\cos\\beta x+C_2\\sin\\beta x\\right)\\ (\\beta>0)\\text{，求 }\\beta",
      answer: "sqrt(2)", timeLimit: 60, tags: ["ode2-complex-general", "second-order", "complex-roots"],
      hints: ["用公式解 r² − 2r + 3 = 0。", "β 是根的虛部；判別式開根號後別忘了除以 2。"],
      solution: "r = (2 ± √(4 − 12))/2 = 1 ± √2 i。β = √2（不是 √8）。",
      solutionSteps: ["r² − 2r + 3 = 0。", "r = (2 ± √−8)/2 = 1 ± √2 i。", "α = 1，β = √2。"],
      verify: { m: "choice", options: [["sqrt(2)", "\\sqrt{2}"], ["2", "2"], ["sqrt(8)", "\\sqrt{8}"], ["sqrt(3)", "\\sqrt{3}"]]
        .map(([say, b]) => ({ say, all: [zero(res2(`e^{x}\\cos\\left(${b}x\\right)`, [1, -2, 3], 0.7)),
          zero(res2(`e^{x}\\sin\\left(${b}x\\right)`, [1, -2, 3], 0.7))] })) } },
    { id: "cg-10b-019", rank: 2, ...pick("甲"),
      prompt: "\\text{已知 }e^{(1+2i)x}\\text{ 是 }y''-2y'+5y=0\\text{ 的複數解（方程係數都是實數）。下列哪一個一定也是實數解？}\\ " + JIA + "e^{x}\\sin 2x" + YI + "e^{2x}\\sin x" + BING + "e^{x}\\sin x" + DING + "\\sin 2x",
      timeLimit: 75, tags: ["ode2-complex-why-real", "second-order", "complex-roots"],
      hints: ["用 Euler 公式把 e^{(1+2i)x} 拆成實部 + i·虛部。", "係數是實數時，L[u + iv] = L[u] + iL[v] = 0 逼得實部、虛部各自為 0。"],
      solution: "e^{(1+2i)x} = eˣcos 2x + i eˣsin 2x。L 的係數是實數，L[u] + iL[v] = 0 ⟹ L[u] = L[v] = 0，所以 eˣ sin 2x 是解。",
      solutionSteps: ["Euler：e^{(1+2i)x} = eˣ(cos 2x + i sin 2x)。", "實係數 ⟹ L[u + iv] = L[u] + iL[v]，實部虛部各自為 0。", "虛部 eˣ sin 2x 是解 ⟹ 甲。"],
      verify: { m: "choice", options: [["甲", "e^{x}\\sin(2x)"], ["乙", "e^{2x}\\sin x"], ["丙", "e^{x}\\sin x"], ["丁", "\\sin(2x)"]]
        .map(([say, f]) => ({ say, all: [zero(res2(f, [1, -2, 5], 0.4)), zero(res2(f, [1, -2, 5], 1.1))] })) } }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE, topic: "integrals", difficulty: Math.min(4, problem.rank), ...problem })));
})();
