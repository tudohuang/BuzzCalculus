(function () {
  "use strict";

  // 應用情境 + 圖形判讀包（2026-07 第二波擴充）：
  // ap- 情境敘述題：運動學 / 成長衰變冷卻 / 功 / 相關變率變體 / 邊際 / 混合 / 形心 / 複合最佳化
  // gp- 圖形題：problem.graph 由 app 以 SVG 呈現；座標同時寫進題幹，工作簿仍自足。
  const SOURCE = "Buzz applied & graph pack";
  const problems = [];

  function add(problem) {
    const rank = problem.rank;
    const tags = [...(problem.tags || []), `rank-${rank}`];
    if (rank >= 5) tags.push("boss-rank");
    if (rank === 6) tags.push("boss-plus");
    if (rank <= 2) tags.push("beginner-friendly");
    problems.push({
      source: SOURCE,
      difficulty: Math.min(4, rank),
      tabLimit: 1,
      ...problem,
      tags
    });
  }

  function num(id, topic, rank, prompt, answer, tags, solution, timeLimit, graph) {
    add({ id, topic, rank, prompt, answerKind: "numeric", answer, tags, solution, timeLimit, graph });
  }

  const STORY = "story-problem";

  // ================= 運動學 =================
  num("ap-kin-001", "derivatives", 2,
    "s(t)=t^3-6t^2+9t\\ \\text{（公尺），速度為零的最早時刻 }t", "1",
    [STORY, "kinematics"], "v=3t²−12t+9=3(t−1)(t−3)，最早 t=1。", 50);
  num("ap-kin-002", "derivatives", 2,
    "s(t)=t^3-6t^2+9t,\\quad t=3\\ \\text{時的加速度}", "6",
    [STORY, "kinematics"], "a=s''=6t−12，代 t=3 得 6。", 45);
  num("ap-kin-003", "derivatives", 3,
    "\\text{鉛直上拋 }h(t)=20t-5t^2\\ \\text{（公尺），最大高度}", "20",
    [STORY, "kinematics", "optimization"], "v=20−10t=0 → t=2，h(2)=40−20=20。", 55);
  num("ap-kin-004", "integrals", 3,
    "v(t)=6t^2-4t+1,\\ s(0)=2,\\quad s(2)=?", "12",
    [STORY, "kinematics", "ftc"], "s(2)=2+∫₀²v = 2+(16−8+2)=12。", 60);
  num("ap-kin-005", "integrals", 4,
    "v(t)=t^2-4t+3,\\ 0\\le t\\le 4,\\quad \\text{質點走的總路程}", "4",
    [STORY, "kinematics"], "v 在 t=1,3 變號：|∫₀¹|+|∫₁³|+|∫₃⁴| = 4/3+4/3+4/3 = 4。", 100);
  num("ap-kin-006", "integrals", 3,
    "\\text{煞車後 }v(t)=30-6t\\ \\text{（m/s），到停止共滑行幾公尺？}", "75",
    [STORY, "kinematics"], "t=5 停止，∫₀⁵(30−6t)dt = 150−75 = 75。", 60);

  // ================= 指數成長 / 衰變 / 冷卻 =================
  num("ap-gro-001", "derivatives", 2,
    "\\text{細菌每 2 小時倍增，初始 100 隻，8 小時後有幾隻？}", "1600",
    [STORY, "exponential-growth"], "倍增 4 次：100·2⁴ = 1600。", 45);
  num("ap-gro-002", "derivatives", 3,
    "\\text{半衰期 10 天的同位素 80 g，30 天後剩幾 g？}", "10",
    [STORY, "half-life"], "3 個半衰期：80·(1/2)³ = 10。", 45);
  num("ap-gro-003", "derivatives", 3,
    "y'=ky,\\ y(0)=50,\\ y(3)=400,\\quad k=?", "log(2)",
    [STORY, "exponential-growth", "ode-intro"], "e^{3k}=8 → 3k=ln 8 → k=ln 2。", 65);
  num("ap-gro-004", "derivatives", 4,
    "\\text{牛頓冷卻：室溫 }20^{\\circ}\\text{C，物體 }100^{\\circ}\\text{C，10 分鐘後 }60^{\\circ}\\text{C，20 分鐘後幾度？}", "40",
    [STORY, "newton-cooling", "ode-intro"], "溫差 80 每 10 分鐘減半：80→40→20，T=20+20=40。", 90);
  num("ap-gro-005", "derivatives", 4,
    "\\text{咖啡 }100^{\\circ}\\text{C 放在 }20^{\\circ}\\text{C 房間，4 分鐘後 }60^{\\circ}\\text{C，幾分鐘後降到 }30^{\\circ}\\text{C？}", "12",
    [STORY, "newton-cooling", "ode-intro"], "溫差 80 每 4 分鐘減半，降到 10（=80/8）需 3 個週期：12 分鐘。", 95);
  num("ap-gro-006", "derivatives", 3,
    "\\text{人口以 }e^{0.02t}\\text{ 成長，幾年後倍增？}", "50*log(2)",
    [STORY, "exponential-growth"], "e^{0.02t}=2 → t = ln 2/0.02 = 50 ln 2 ≈ 34.7。", 60);

  // ================= 功（work） =================
  num("ap-work-001", "integrals", 3,
    "\\text{彈簧拉伸 0.1 m 需 20 N，從自然長拉伸 0.2 m 所需的功（J）}", "4",
    [STORY, "work-integral"], "k=200，W=½kx²=½·200·0.04=4。", 70);
  num("ap-work-002", "integrals", 4,
    "\\text{彈簧常數 k=200 N/m 的彈簧，從伸長 0.1 m 拉到 0.3 m 所需的功（J）}", "8",
    [STORY, "work-integral"], "W=½k(0.3²−0.1²)=100·0.08=8。", 75);
  num("ap-work-003", "integrals", 4,
    "\\text{10 m 長、每公尺 2 kg 的鏈條垂在井中，全部拉上來的功（g=10）}", "1000",
    [STORY, "work-integral"], "深度 x 的小段升高 x：∫₀¹⁰ 2·10·x dx = 1000 J。", 90);
  num("ap-work-004", "integrals", 5,
    "\\text{半徑 2、高 4 的圓柱水槽裝滿水（}\\rho g=10^4\\text{），把水全部抽到頂端的功（J）}", "320000*pi",
    [STORY, "work-integral"], "深 y 的水層抽升 (4−y)：10⁴·4π∫₀⁴(4−y)dy = 10⁴·4π·8 = 32×10⁴π。", 130);

  // ================= 相關變率變體 =================
  num("ap-rr-001", "derivatives", 3,
    "\\text{路燈高 5 m，身高 2 m 的人以 1.5 m/s 走離燈柱，影子頂端的移動速率（m/s）}", "5/2",
    [STORY, "related-rates"], "相似三角形：頂端速率 = v·H/(H−h) = 1.5·5/3 = 2.5。", 90);
  num("ap-rr-002", "derivatives", 4,
    "\\text{路燈高 4 m，身高 1.6 m 的人以 1.2 m/s 走離燈柱，影子長度的增長率（m/s）}", "4/5",
    [STORY, "related-rates"], "影長 s 滿足 s/h=(x+s)/H → s=x·h/(H−h)，速率 1.2·1.6/2.4 = 0.8。", 95);
  num("ap-rr-003", "derivatives", 4,
    "\\text{甲船以 30 km/h 向北、乙船以 40 km/h 向東同時同地出發，1 小時後兩船距離的變化率（km/h）}", "50",
    [STORY, "related-rates"], "d=50t（3-4-5 直角），變化率恆為 50。", 90);
  num("ap-rr-004", "derivatives", 4,
    "\\text{圓錐沙堆高恆等於底半徑，體積以 }9\\pi\\ \\text{m}^3/\\text{min 增加，}h=3\\text{ 時 }\\frac{dh}{dt}", "1",
    [STORY, "related-rates"], "V=πh³/3，dV/dh=πh²=9π → dh/dt=9π/9π=1。", 100);
  num("ap-rr-005", "derivatives", 4,
    "\\text{氣球從距觀察者 40 m 處鉛直上升 3 m/s，高度 30 m 時仰角的變化率（rad/s）}", "6/125",
    [STORY, "related-rates", "inverse-trig"], "θ=arctan(y/40)，dθ/dt = 40/(1600+y²)·3 = 120/2500 = 6/125。", 110);
  num("ap-rr-006", "derivatives", 3,
    "\\text{圓面積以 }8\\ \\text{cm}^2/\\text{s 增加，}r=2\\text{ 時 }\\frac{dr}{dt}", "2/pi",
    [STORY, "related-rates"], "dA/dt=2πr·dr/dt → dr/dt = 8/(4π) = 2/π。", 70);

  // ================= 邊際分析 =================
  num("ap-eco-001", "derivatives", 2,
    "C(x)=1000+5x+0.01x^2,\\quad x=100\\ \\text{時的邊際成本}", "7",
    [STORY, "marginal"], "C'(x)=5+0.02x，代 100 得 7。", 50);
  num("ap-eco-002", "derivatives", 3,
    "\\text{單價 }p=120-2x\\text{，收益 }R=p\\cdot x\\text{ 最大的 }x", "30",
    [STORY, "marginal", "optimization"], "R=120x−2x²，R'=120−4x=0 → x=30。", 60);
  num("ap-eco-003", "derivatives", 4,
    "C(x)=100+4x+x^2,\\quad \\text{平均成本最小的 }x", "10",
    [STORY, "marginal", "optimization"], "平均成本 100/x+4+x，導數 −100/x²+1=0 → x=10。", 80);

  // ================= 混合問題 =================
  num("ap-mix-001", "derivatives", 5,
    "\\text{100 L 水箱含鹽 20 kg，純水以 5 L/min 流入、混合液同速流出，20 分鐘後鹽量（kg）}", "20*exp(-1)",
    [STORY, "mixing", "ode-intro", "separable"], "y'=−5y/100=−y/20 → y=20e^{−t/20}，t=20 得 20/e。", 120);
  num("ap-mix-002", "derivatives", 5,
    "\\text{100 L 清水箱，濃度 0.5 kg/L 鹽水以 4 L/min 流入、混合液同速流出，25 分鐘後鹽量（kg）}", "50*(1-exp(-1))",
    [STORY, "mixing", "ode-intro", "integrating-factor"], "y'=2−y/25 → y=50(1−e^{−t/25})，t=25 得 50(1−1/e)。", 140);

  // ================= 形心 =================
  num("ap-cen-001", "integrals", 4,
    "y=x^2,\\ 0\\le x\\le 1\\ \\text{與 }x\\text{ 軸間區域形心的 }\\bar{x}", "3/4",
    [STORY, "centroid"], "x̄ = ∫x·x²dx / ∫x²dx = (1/4)/(1/3) = 3/4。", 90);
  num("ap-cen-002", "integrals", 5,
    "\\text{上半單位圓盤（}y=\\sqrt{1-x^2}\\text{ 與 }x\\text{ 軸間）形心的 }\\bar{y}", "4/(3*pi)",
    [STORY, "centroid"], "ȳ = (1/A)∫½(1−x²)dx = (2/π)·(2/3) = 4/(3π)。", 120);

  // ================= 複合最佳化 =================
  num("ap-opt-001", "derivatives", 5,
    "\\text{有蓋圓柱罐體積 }54\\pi\\text{，表面積最小時的底半徑 }r", "3",
    [STORY, "optimization"], "S=2πr²+108π/r，S'=4πr−108π/r²=0 → r³=27 → r=3（此時 h=2r）。", 120);
  num("ap-opt-002", "derivatives", 5,
    "\\text{人在岸上，目標在對岸下游：河寬 3 km、下游 8 km，划船 3 km/h、走路 5 km/h，應划向下游 }x\\text{ km 處上岸，}x=?", "9/4",
    [STORY, "optimization"], "T=√(9+x²)/3+(8−x)/5，T'=0 → 5x=3√(9+x²) → x=9/4。", 150);

  // ================= 圖形題 =================
  const G1 = { window: [-1, 5, -1, 5], polylines: [[[0, 0], [2, 4], [4, 0]]] };
  num("gp-001", "integrals", 3,
    "f\\ \\text{為過 }(0,0),(2,4),(4,0)\\text{ 的折線（如圖），}g(x)=\\int_0^x f(t)\\,dt,\\quad g(4)=?", "8",
    ["graph-reading", "ftc", "area"], "g(4) 是三角形面積：½·4·4 = 8。", 70, G1);
  num("gp-002", "derivatives", 3,
    "f\\ \\text{為過 }(0,0),(2,4),(4,0)\\text{ 的折線（如圖），}g(x)=\\int_0^x f(t)\\,dt,\\quad g'(3)=?", "2",
    ["graph-reading", "ftc", "moving-limits"], "FTC：g'(3)=f(3)，讀圖得 2。", 70, G1);
  num("gp-003", "derivatives", 4,
    "f\\ \\text{為過 }(0,0),(2,4),(4,0)\\text{ 的折線（如圖），}g(x)=\\int_0^x f(t)\\,dt\\ \\text{的反曲點 }x", "2",
    ["graph-reading", "ftc", "inflection"], "g''=f'，f 在 x=2 由升轉降，g 的凹向在那裡改變。", 85, G1);
  const G2 = { window: [-1, 7, -4, 6], polylines: [[[0, 4], [2, 0], [5, -2], [6, 0]]] };
  num("gp-004", "integrals", 3,
    "\\text{速度圖：}v\\ \\text{為過 }(0,4),(2,0),(5,-2),(6,0)\\text{ 的折線（如圖），}0\\le t\\le 6\\ \\text{的位移}", "0",
    ["graph-reading", "kinematics", "area"], "正面積 4（三角形），負面積 3+1=4，位移 0。", 90, G2);
  num("gp-005", "integrals", 4,
    "\\text{速度圖：}v\\ \\text{為過 }(0,4),(2,0),(5,-2),(6,0)\\text{ 的折線（如圖），}0\\le t\\le 6\\ \\text{的總路程}", "8",
    ["graph-reading", "kinematics", "area"], "路程取絕對值：4+3+1 = 8。", 90, G2);
  num("gp-006", "derivatives", 3,
    "f\\ \\text{為過 }(0,0),(1,2),(3,-2),(4,0)\\text{ 的折線（如圖），在 }(0,4)\\text{ 內不可微分的點有幾個？}", "2",
    ["graph-reading", "continuity"], "折角 x=1, 3 兩處左右斜率不同。", 60,
    { window: [-1, 5, -4, 4], polylines: [[[0, 0], [1, 2], [3, -2], [4, 0]]] });
  num("gp-007", "integrals", 4,
    "f\\ \\text{為過 }(0,2),(2,-2),(4,2)\\text{ 的折線（如圖），}\\int_0^4 |f(x)|\\,dx=?", "4",
    ["graph-reading", "area"], "四個全等三角形各面積 1（過零於 x=1,3），共 4。", 90,
    { window: [-1, 5, -4, 4], polylines: [[[0, 2], [2, -2], [4, 2]]] });
  num("gp-008", "derivatives", 4,
    "\\text{圖為 }f'\\text{ 的圖形：過 }(0,-3),(4,5)\\text{ 的直線。}f\\ \\text{在 }[0,4]\\text{ 的極小值位置 }x", "3/2",
    ["graph-reading", "optimization"], "f' 在 x=3/2 由負轉正，f 有極小。", 80,
    { window: [-1, 5, -5, 6], polylines: [[[0, -3], [4, 5]]] });
  num("gp-009", "derivatives", 4,
    "\\text{圖為 }f'\\text{ 的圖形：過 }(0,-2),(1,0),(2,2),(3,0),(4,-2)\\text{ 的折線。}f\\ \\text{的極大值位置 }x", "3",
    ["graph-reading", "optimization"], "f' 在 x=3 由正轉負 → 極大；x=1 由負轉正是極小。", 90,
    { window: [-1, 5, -4, 4], polylines: [[[0, -2], [1, 0], [2, 2], [3, 0], [4, -2]]] });
  num("gp-010", "integrals", 3,
    "f\\ \\text{為過 }(0,0),(1,2),(2,2),(3,0)\\text{ 的折線（如圖），}\\int_0^3 f(x)\\,dx=?", "4",
    ["graph-reading", "area"], "梯形面積：½(3+1)·2 = 4。", 65,
    { window: [-1, 4, -1, 4], polylines: [[[0, 0], [1, 2], [2, 2], [3, 0]]] });
  num("gp-011", "integrals", 5,
    "f\\ \\text{為過 }(0,2),(2,2),(4,-2),(6,-2)\\text{ 的折線（如圖），}g(x)=\\int_0^x f\\ \\text{在 }[0,6]\\text{ 的最大值}", "5",
    ["graph-reading", "ftc", "optimization"], "f 在 x=3 過零轉負，g 最大在 x=3：4（矩形）+1（三角形）= 5。", 120,
    { window: [-1, 7, -4, 4], polylines: [[[0, 2], [2, 2], [4, -2], [6, -2]]] });
  num("gp-012", "limits", 3,
    "\\text{如圖：}f\\ \\text{在 }[0,1)\\text{ 沿 }(0,0)\\to(1,2)\\text{ 直線、}x\\ge 1\\text{ 時 }f=3\\text{。求 }\\lim_{x\\to 1^-}f(x)", "2",
    ["graph-reading", "continuity"], "左極限沿直線逼近 (1,2)：答案 2（跳躍不連續）。", 60,
    { window: [-1, 3, -1, 5], polylines: [[[0, 0], [1, 2]], [[1, 3], [2.5, 3]]], points: [{ x: 1, y: 2, open: true }, { x: 1, y: 3 }] });
  num("gp-013", "derivatives", 4,
    "\\text{圖中虛線為 }f\\ \\text{在 }x=2\\text{ 的切線，通過 }(0,-1)\\text{ 與 }(5,9)\\text{。求 }f'(2)", "2",
    ["graph-reading", "tangent-normal"], "切線斜率 = (9−(−1))/(5−0) = 2 = f'(2)。", 70,
    { window: [-1, 6, -2, 10], curves: [{ expr: "x*x/2+1", domain: [-1, 4.2] }], dashed: [[[0, -1], [5, 9]]], points: [{ x: 2, y: 3 }] });
  num("gp-014", "integrals", 4,
    "\\text{如圖 }y=x^2\\text{。用梯形法（}n=2\\text{）估計 }\\int_0^1 x^2\\,dx", "3/8",
    ["graph-reading", "riemann-sum"], "T = ¼(f(0)+2f(½)+f(1)) = ¼(0+½+1) = 3/8（凹向上 → 高估）。", 90,
    { window: [-0.5, 1.5, -0.5, 1.6], curves: [{ expr: "x*x", domain: [-0.4, 1.25] }], dashed: [[[0, 0], [0.5, 0.25], [1, 1]]], points: [{ x: 0.5, y: 0.25 }, { x: 1, y: 1 }] });

  // ---- 獨立驗算規格（2026-10 高曝光題補驗算）----
  // 情境題的題幹是一段文字，自動辨識器讀不出結構；這裡把題幹的物理／幾何
  // 翻成被積函數或微分方程，數值積分／RK4 由驗算器自己跑 —— 不抄解答的代數，
  // 能換一種列式就換（鏈條用「剩下的重量」、水槽用柱座標體積分、形心用水平切片）。
  const VERIFY = {
    // 冷卻：T′ = k(T − 20)，k 只用「10 分鐘後 60°C」這筆資料定，再 RK4 跑到 t = 20
    "ap-gro-004": { m: "odeValue", f: "\\frac{1}{10}\\ln\\left(\\frac{60-20}{100-20}\\right)(y-20)", y0: [0, 100], at: 20 },
    // 降到 30°C 的時刻：模型 T(t) 由「4 分鐘後 60°C」定出，牛頓法解 T(t) = 30
    "ap-gro-005": { m: "root", f: "20+80\\exp\\left(\\frac{x}{4}\\ln\\left(\\frac{60-20}{100-20}\\right)\\right)-30", x0: 5 },
    // 鹽量 y′ = 流入 4·0.5 − 流出 4·y/100，y(0)=0
    "ap-mix-002": { m: "odeValue", f: "4\\cdot 0.5-\\frac{4y}{100}", y0: [0, 0], at: 25 },
    // 圓錐 V = πr²h/3 且 r = h；dh/dt = (dV/dt)/V′(h)
    "ap-rr-004": { m: "relatedRate", f: "\\frac{1}{3}\\pi h^2\\cdot h", v: "h", at: 3, given: "9\\pi" },
    // 虎克定律 F = kx，k = 20/0.1
    "ap-work-001": { m: "integral", f: "\\frac{20}{0.1}x", a: 0, b: 0.2 },
    "ap-work-002": { m: "integral", f: "200x", a: 0.1, b: 0.3 },
    // 已拉上 y 公尺時，還垂著的 (10−y) 公尺重 2·10·(10−y) 牛頓
    "ap-work-003": { m: "integral", v: "y", f: "2\\cdot 10\\cdot(10-y)", a: 0, b: 10 },
    // 柱座標體積分：高度 z 的水升到頂端 4 −z，dV = 2πr dr dz
    "ap-work-004": { m: "double", u: "r", v: "z", f: "10^4(4-z)\\cdot 2\\pi r", a: 0, b: 2, c: 0, d: 4 },
    // 形心定義 x̄ = ∫∫x dA / ∫∫dA（鉛直切片）
    "ap-cen-001": { m: "value", f: "\\frac{\\int_0^1\\int_0^{x^2}x\\,dy\\,dx}{\\int_0^1\\int_0^{x^2}1\\,dy\\,dx}" },
    // 上半圓盤 ȳ：水平切片，高度 y 的切片寬 2√(1−y²)
    "ap-cen-002": { m: "value", f: "\\frac{\\int_0^1 y\\cdot 2\\sqrt{1-y^2}\\,dy}{\\int_0^1 2\\sqrt{1-y^2}\\,dy}" }
  };
  problems.forEach((problem) => {
    if (VERIFY[problem.id]) problem.verify = VERIFY[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

/* ═══ 課程缺口補題（3A–3E 導數應用，cg-3a- ～ cg-3e-，2026-10）═══
   課程寫課時記下的缺口：f′ 不存在的臨界點與定義域檢查、斷開定義域的增減與凹性、
   尖角處的一階判別、加速／減速、切線高估低估、f″ 不存在或不換號的反曲點、二階判別失效、
   x→−∞ 與非有理函數的漸近線、作圖前置（定義域、截距、奇偶）與一致性檢查、
   答案在端點的最佳化、相對誤差、Rolle 數根與條件檢查、均值定理適用性、
   L'Hôpital 的誤用與失效、∞⁰ 與通分型 ∞−∞。
   判斷題一律走 choice：每個誘答都被數值條件（導數、極限、見證函數）正面推翻。 */
(function () {
  "use strict";

  const SOURCE = "Buzz course gap fill";
  const STORY = "story-problem";
  // 數值路徑的小幫手：某點的一階／二階導數、v·a 的乘積（加速或減速只看這個正負）
  const D = (f, at, order) => (order ? { m: "deriv", f, at: [at], order } : { m: "deriv", f, at: [at] });
  const VA = (f, t) => ({ m: "let", f: "v\\cdot a", with: { v: D(f, t), a: D(f, t, 2) } });
  const V = (f) => ({ m: "value", f });

  const problems = [
    /* ── 3.1 臨界點：f′ 不存在的點、定義域檢查 ── */
    { id: "cg-3a-001", topic: "derivatives", rank: 1, answerKind: "set",
      prompt: "\\text{求 }f(x)=x+2|x-1|\\text{ 的所有臨界點}",
      answer: "{1}", timeLimit: 45,
      tags: ["critical-undefined-derivative", "critical-points", "absolute-value"],
      hints: ["把絕對值拆成 x<1 與 x>1 兩段，各自求 f′。", "臨界點也包含「f 有定義、但 f′ 不存在」的點。"],
      solution: "x<1 時 f=−x+2，f′=−1；x>1 時 f=3x−2，f′=3。f′ 沒有零點，但在 x=1 左右斜率不同，f′(1) 不存在，所以唯一的臨界點是 x=1。",
      solutionSteps: ["x<1：f(x)=x−2(x−1)=−x+2，f′=−1。", "x>1：f(x)=x+2(x−1)=3x−2，f′=3。", "f′ 從不為 0；x=1 左右斜率 −1 與 3 不同，f′(1) 不存在，而 f(1)=1 有定義。", "臨界點：{1}。"],
      verify: { m: "critical", f: "x+2|x-1|", range: [-6, 6] } },
    { id: "cg-3a-002", topic: "derivatives", rank: 2, answerKind: "set",
      prompt: "\\text{求 }f(x)=x-3x^{2/3}\\text{ 的所有臨界點}",
      answer: "{0, 8}", timeLimit: 60,
      tags: ["critical-undefined-derivative", "critical-points", "radical"],
      hints: ["f′(x)=1−2x^{−1/3}，通分寫成一個分式。", "分子為 0 的點與分母為 0 的點都要看：f 在那裡有沒有定義？"],
      solution: "f′(x)=1−2x^{−1/3}=(x^{1/3}−2)/x^{1/3}。分子為 0：x^{1/3}=2，x=8；分母為 0：x=0，而 f(0)=0 有定義、f′(0) 不存在。臨界點 {0, 8}。",
      solutionSteps: ["f′(x)=1−2x^{−1/3}=(x^{1/3}−2)/x^{1/3}。", "f′=0：x^{1/3}=2，x=8。", "f′ 不存在：x=0，f(0)=0 有定義，所以也是臨界點。", "臨界點：{0, 8}。"],
      verify: { m: "critical", f: "x-3(x^2)^{1/3}", range: [-6, 20] } },
    { id: "cg-3a-003", topic: "derivatives", rank: 2, answerKind: "set",
      prompt: "\\text{求 }f(x)=\\left(x^2-4\\right)^{2/3}\\text{ 的所有臨界點}",
      answer: "{-2, 0, 2}", timeLimit: 70,
      tags: ["critical-undefined-derivative", "critical-points", "chain-rule"],
      hints: ["用連鎖律：f′(x)=(2/3)(x²−4)^{−1/3}·2x。", "負指數代表分母；分母為 0 的地方 f 本身有沒有定義？"],
      solution: "f′(x)=4x/(3(x²−4)^{1/3})。分子為 0：x=0；分母為 0：x=±2，這兩點 f=0 有定義但 f′ 不存在。臨界點 {−2, 0, 2}。",
      solutionSteps: ["f′(x)=(2/3)(x²−4)^{−1/3}·2x=4x/(3(x²−4)^{1/3})。", "f′=0：x=0。", "f′ 不存在：x²−4=0，x=±2，而 f(±2)=0 有定義。", "臨界點：{−2, 0, 2}。"],
      verify: { m: "critical", f: "((x^2-4)^2)^{1/3}", range: [-6, 6] } },
    { id: "cg-3a-004", topic: "derivatives", rank: 2, answerKind: "set",
      prompt: "\\text{求 }f(x)=x^2-8\\ln x\\text{ 的所有臨界點}",
      answer: "{2}", timeLimit: 50,
      tags: ["critical-domain-check", "critical-points", "log", "domain-aware"],
      hints: ["先寫定義域。", "f′ 通分成一個分式後，分子的根、分母的根都要拿去跟定義域比。"],
      solution: "定義域 x>0。f′(x)=2x−8/x=2(x²−4)/x。分子為 0 得 x=±2，但 −2 不在定義域；分母為 0 的 x=0 也不在定義域，不算臨界點。臨界點只有 {2}。",
      solutionSteps: ["定義域：x>0。", "f′(x)=2x−8/x=2(x−2)(x+2)/x。", "x=−2 與 x=0 都不在定義域，不算。", "臨界點：{2}。"],
      verify: { m: "critical", f: "x^2-8\\ln x", range: [0.05, 12] } },
    { id: "cg-3a-005", topic: "derivatives", rank: 3, answerKind: "set",
      prompt: "\\text{求 }f(x)=\\ln\\left(x^2-1\\right)-x\\text{ 的所有臨界點}",
      answer: "{1+sqrt(2)}", timeLimit: 90,
      tags: ["critical-domain-check", "critical-points", "log", "domain-aware"],
      hints: ["定義域是 x²−1>0，也就是 |x|>1。", "f′ 通分後分子是二次式；用公式解出兩個根，再一個一個檢查在不在定義域。"],
      solution: "定義域 |x|>1。f′=2x/(x²−1)−1=−(x²−2x−1)/(x²−1)。分子為 0：x=1±√2；1−√2≈−0.41 不在定義域。分母為 0 的 ±1 也不在定義域。臨界點 {1+√2}。",
      solutionSteps: ["定義域：x<−1 或 x>1。", "f′(x)=2x/(x²−1)−1=−(x²−2x−1)/(x²−1)。", "x²−2x−1=0：x=1±√2；1−√2≈−0.414 落在 (−1,1)，不在定義域。", "臨界點：{1+√2}。"],
      verify: { m: "critical", f: "\\ln(x^2-1)-x", range: [-8, 8] } },

    /* ── 3.2 增減區間：定義域斷開 ── */
    { id: "cg-3a-006", topic: "derivatives", rank: 2, answerKind: "interval",
      prompt: "\\text{求 }f(x)=\\dfrac{x+1}{x-3}\\text{ 的遞減區間（寫成區間，多段用 U）}",
      answer: "(-inf, 3) U (3, inf)", timeLimit: 60,
      tags: ["monotone-domain-split", "monotonicity", "rational-function"],
      hints: ["用商的微分法則算 f′，看它的正負。", "x=3 不在定義域；在它兩邊的區間可以合寫成一段嗎？比較 f(0) 與 f(4)。"],
      solution: "f′(x)=((x−3)−(x+1))/(x−3)²=−4/(x−3)²<0，但 x=3 不在定義域。f(0)=−1/3<f(4)=5，跨過 x=3 不是遞減，所以要寫成兩段 (−∞,3) U (3,∞)。",
      solutionSteps: ["f′(x)=−4/(x−3)²，在定義域上處處小於 0。", "x=3 把定義域切成兩段；f(0)=−1/3、f(4)=5，跨過 3 並沒有遞減。", "遞減區間：(−∞, 3) U (3, ∞)。"],
      verify: { m: "choice", note: "decreasing 掃描會把 x=3 這一個洞併掉；改驗四段 f′ 的正負與 1/f 的零點（極點）",
        options: [{ say: "(-inf, 3) U (3, inf)", all: [
          { v: D("\\frac{x+1}{x-3}", -5), lt: 0 }, { v: D("\\frac{x+1}{x-3}", 2.9), lt: 0 },
          { v: D("\\frac{x+1}{x-3}", 3.1), lt: 0 }, { v: D("\\frac{x+1}{x-3}", 10), lt: 0 },
          { v: { m: "root", f: "\\frac{x-3}{x+1}", x0: 2.5 }, eq: 3 },
          { v: V("\\frac{0+1}{0-3}-\\frac{4+1}{4-3}"), lt: 0 }] }] } },
    { id: "cg-3a-007", topic: "derivatives", rank: 2, answerKind: "interval",
      prompt: "\\text{求 }f(x)=\\dfrac{x^2}{x^2-1}\\text{ 的遞增區間（寫成區間，多段用 U）}",
      answer: "(-inf, -1) U (-1, 0)", timeLimit: 75,
      tags: ["monotone-domain-split", "monotonicity", "rational-function"],
      hints: ["商的微分法則：分子化簡後只剩一項。", "分母 (x²−1)² 恆正；定義域少了哪兩點？"],
      solution: "f′(x)=(2x(x²−1)−x²·2x)/(x²−1)²=−2x/(x²−1)²。x<0 時 f′>0，但 x=−1 不在定義域，所以遞增區間是 (−∞,−1) U (−1,0)。",
      solutionSteps: ["f′(x)=−2x/(x²−1)²。", "分母恆正（x≠±1），f′>0 ⇔ x<0。", "扣掉不在定義域的 x=−1：(−∞, −1) U (−1, 0)。"],
      verify: { m: "choice", note: "increasing 掃描會把 x=−1 的洞併掉；改驗各段 f′ 的正負、極點與臨界點",
        options: [{ say: "(-inf, -1) U (-1, 0)", all: [
          { v: D("\\frac{x^2}{x^2-1}", -3), gt: 0 }, { v: D("\\frac{x^2}{x^2-1}", -1.1), gt: 0 },
          { v: D("\\frac{x^2}{x^2-1}", -0.5), gt: 0 }, { v: D("\\frac{x^2}{x^2-1}", 0.5), lt: 0 },
          { v: D("\\frac{x^2}{x^2-1}", 2), lt: 0 },
          { v: { m: "root", f: "\\frac{x^2-1}{x^2}", x0: -1.3 }, eq: -1 },
          { v: { m: "criticalPoint", f: "\\frac{x^2}{x^2-1}", x0: 0.3 }, eq: 0 }] }] } },

    /* ── 3.3 一階導數判別：尖角、f′ 不存在；直接給 f 問極值 ── */
    { id: "cg-3a-008", topic: "derivatives", rank: 2, answerKind: "set",
      prompt: "\\text{求 }f(x)=x^{2/3}(x+5)\\text{ 所有局部極小點的 }x\\text{ 座標}",
      answer: "{0}", timeLimit: 80,
      tags: ["fdt-nondifferentiable", "first-derivative-test", "radical"],
      hints: ["展開成 x^{5/3}+5x^{2/3} 再微分，通分成一個分式。", "f′=0 的點與 f′ 不存在的點都是臨界點，各自看 f′ 左右的正負。"],
      solution: "f′=(5/3)x^{2/3}+(10/3)x^{−1/3}=5(x+2)/(3x^{1/3})。臨界點 x=−2 與 x=0（f′ 不存在）。f′ 在 −2 由正變負（極大），在 0 由負變正（極小），局部極小點只有 x=0。",
      solutionSteps: ["f(x)=x^{5/3}+5x^{2/3}，f′(x)=5(x+2)/(3x^{1/3})。", "臨界點：x=−2（f′=0）、x=0（f′ 不存在）。", "x<−2：f′>0；−2<x<0：f′<0；x>0：f′>0。", "由負變正的只有 x=0：{0}。"],
      verify: { m: "localMin", f: "(x^2)^{1/3}(x+5)", range: [-8, 6] } },
    { id: "cg-3a-009", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\text{求 }f(x)=x^2-6|x|+1\\text{ 的局部極大值}",
      answer: "1", timeLimit: 70,
      tags: ["fdt-nondifferentiable", "first-derivative-test", "absolute-value"],
      hints: ["分 x>0 與 x<0 兩段寫 f′。", "x=0 處 f′ 不存在，看 f′ 在 0 左右的正負。"],
      solution: "x>0：f′=2x−6；x<0：f′=2x+6。臨界點 x=±3 與 x=0（尖角）。f′ 在 0 左邊接近 6、右邊接近 −6，由正變負，x=0 是局部極大，值 f(0)=1；x=±3 是局部極小。",
      solutionSteps: ["x>0：f′=2x−6；x<0：f′=2x+6；x=0 的左右斜率不同，f′(0) 不存在。", "臨界點：x=−3、0、3。", "f′ 在 −3 由負變正、在 0 由正變負、在 3 由負變正。", "局部極大只在 x=0，值 f(0)=1。"],
      verify: { m: "extremum1d", f: "x^2-6|x|+1", v: "x", lo: -2, hi: 2, kind: "max" } },
    { id: "cg-3a-010", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\text{求 }f(x)=x^3-12x+5\\text{ 的局部極大值}",
      answer: "21", timeLimit: 50,
      tags: ["fdt-sign-change", "first-derivative-test", "polynomial"],
      hints: ["令 f′(x)=0 找臨界點。", "f′ 由正變負的那一點才是局部極大，把它代回 f。"],
      solution: "f′=3x²−12=3(x−2)(x+2)，臨界點 x=±2。f′ 在 −2 由正變負，局部極大值 f(−2)=−8+24+5=21。",
      solutionSteps: ["f′(x)=3(x−2)(x+2)，臨界點 x=±2。", "x<−2：f′>0；−2<x<2：f′<0，所以 x=−2 是局部極大。", "f(−2)=−8+24+5=21。"],
      verify: { m: "extremum1d", f: "x^3-12x+5", v: "x", lo: -3, hi: 0, kind: "max" } },
    { id: "cg-3a-011", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "f(x)=2x^3-3x^2-36x+1\\text{。求「局部極大值}-\\text{局部極小值」}",
      answer: "125", timeLimit: 80,
      tags: ["fdt-sign-change", "first-derivative-test", "polynomial"],
      hints: ["f′(x)=6x²−6x−36，先提出 6 再分解。", "分別判斷兩個臨界點是極大還是極小，再各自代回 f。"],
      solution: "f′=6(x−3)(x+2)。f′ 在 −2 由正變負：局部極大 f(−2)=−16−12+72+1=45；在 3 由負變正：局部極小 f(3)=54−27−108+1=−80。相減 45−(−80)=125。",
      solutionSteps: ["f′(x)=6(x−3)(x+2)，臨界點 x=−2、3。", "局部極大 f(−2)=45；局部極小 f(3)=−80。", "45−(−80)=125。"],
      verify: { m: "let", f: "M-n", with: {
        M: { m: "extremum1d", f: "2x^3-3x^2-36x+1", v: "x", lo: -3, hi: 0, kind: "max" },
        n: { m: "extremum1d", f: "2x^3-3x^2-36x+1", v: "x", lo: 0, hi: 5, kind: "min" } } } },

    /* ── 3.4 二階導數：加速／減速、f′ 的增減 ── */
    { id: "cg-3a-012", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\text{質點位置 }s(t)=t^3-9t^2+24t\\text{（公尺，}t\\text{ 秒）。在 }t=1\\text{ 秒時，質點的速率正在變快（加速）還是變慢（減速）？}",
      answers: ["減速", "變慢", "在減速"], canonical: "減速", answer: "減速", distractors: ["加速", "等速"], timeLimit: 60,
      tags: ["second-deriv-speeding-up", "kinematics", STORY],
      hints: ["分別算 v(1) 與 a(1) 的正負號。", "速率變快或變慢，看 v 與 a 同號還是異號。"],
      solution: "v=3t²−18t+24，v(1)=9>0；a=6t−18，a(1)=−12<0。速度與加速度異號，速率在變小：減速。",
      solutionSteps: ["v(t)=3t²−18t+24，v(1)=9>0（往正方向走）。", "a(t)=6t−18，a(1)=−12<0。", "v、a 異號 ⇒ 速率變小：減速。"],
      verify: { m: "choice", options: [
        { say: "減速", all: [{ v: VA("x^3-9x^2+24x", 1), lt: 0 }] },
        { say: "加速", all: [{ v: VA("x^3-9x^2+24x", 1), gt: 0 }] },
        { say: "等速", all: [{ v: D("x^3-9x^2+24x", 1, 2), eq: 0 }] }] } },
    { id: "cg-3a-013", topic: "derivatives", rank: 3, answerKind: "interval",
      prompt: "\\text{質點位置 }s(t)=t^3-6t^2+9t\\text{（公尺，}t>0\\text{ 秒）。求質點在減速（速率變小）的時段（寫成開區間，多段用 U）}",
      answer: "(0, 1) U (2, 3)", timeLimit: 120,
      tags: ["second-deriv-speeding-up", "kinematics", STORY, "sign-chart"],
      hints: ["v=s′、a=s″，分別找出它們變號的時刻。", "把 t>0 切成幾段，在每一段看 v 與 a 是不是異號。"],
      solution: "v=3(t−1)(t−3)，a=6(t−2)。0<t<1：v>0、a<0 減速；1<t<2：同為負，加速；2<t<3：v<0、a>0 減速；t>3：同為正，加速。減速時段 (0,1) U (2,3)。",
      solutionSteps: ["v(t)=3t²−12t+9=3(t−1)(t−3)，a(t)=6t−12=6(t−2)。", "分段：(0,1) v+ a−；(1,2) v− a−；(2,3) v− a+；(3,∞) v+ a+。", "v、a 異號的是 (0,1) 與 (2,3)。", "答案：(0, 1) U (2, 3)。"],
      verify: { m: "choice", note: "速率的增減區間在 t=0 邊界上掃描會變成 −∞；改驗各段 v·a 的正負與 v、a 的零點",
        options: [{ say: "(0, 1) U (2, 3)", all: [
          { v: VA("x^3-6x^2+9x", 0.5), lt: 0 }, { v: VA("x^3-6x^2+9x", 1.5), gt: 0 },
          { v: VA("x^3-6x^2+9x", 2.5), lt: 0 }, { v: VA("x^3-6x^2+9x", 4), gt: 0 },
          { v: { m: "criticalPoint", f: "x^3-6x^2+9x", x0: 0.8 }, eq: 1 },
          { v: { m: "criticalPoint", f: "x^3-6x^2+9x", x0: 3.3 }, eq: 3 },
          { v: { m: "criticalPoint", f: "x^3-6x^2+9x", x0: 2.2, order: 2 }, eq: 2 }] }] } },
    { id: "cg-3a-014", topic: "derivatives", rank: 2, answerKind: "interval",
      prompt: "f(x)=x^3-6x^2+5x\\text{。求 }f'\\text{ 遞增的區間}",
      answer: "(2, inf)", timeLimit: 50,
      tags: ["second-deriv-fprime-monotone", "second-derivative", "polynomial"],
      hints: ["f′ 遞增，要看 f′ 的導數，也就是 f″ 的正負。", "f″ 是一次式，找它大於 0 的範圍。"],
      solution: "f′=3x²−12x+5，f′ 的導數 f″=6x−12>0 ⇔ x>2。f′ 在 (2,∞) 遞增。",
      solutionSteps: ["f′(x)=3x²−12x+5。", "(f′)′=f″(x)=6x−12。", "6x−12>0 ⇔ x>2：f′ 遞增區間 (2, ∞)。"],
      verify: { m: "concaveUp", f: "x^3-6x^2+5x", range: [-20, 20] } },
    { id: "cg-3a-015", topic: "derivatives", rank: 2, answerKind: "interval",
      prompt: "\\text{已知 }f'(x)=x^2e^{-x}\\text{。求 }f'\\text{ 遞增的區間}",
      answer: "(0, 2)", timeLimit: 70,
      tags: ["second-deriv-fprime-monotone", "second-derivative", "exponential"],
      hints: ["對 f′ 再微分一次（乘積法則），提出 e^{−x}。", "e^{−x} 恆正，正負只看剩下的二次式。"],
      solution: "f″=(x²e^{−x})′=2xe^{−x}−x²e^{−x}=x(2−x)e^{−x}。e^{−x}>0，f″>0 ⇔ x(2−x)>0 ⇔ 0<x<2，所以 f′ 在 (0,2) 遞增。",
      solutionSteps: ["f″(x)=2xe^{−x}+x²·(−e^{−x})=x(2−x)e^{−x}。", "e^{−x}>0，f″>0 ⇔ x(2−x)>0 ⇔ 0<x<2。", "f′ 遞增區間：(0, 2)。"],
      verify: { m: "increasing", f: "x^2e^{-x}", range: [-20, 20] } },

    /* ── 3.5 凹向：切線高估低估、f′ 與 f″ 分工、斷開的定義域 ── */
    { id: "cg-3a-016", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\text{用 }f(x)=\\sqrt{x}\\text{ 在 }x=4\\text{ 的切線估計 }\\sqrt{4.1}\\text{。不必算真值，只看凹性：這個估計是高估還是低估？}",
      answers: ["高估", "偏高", "估計值比較大"], canonical: "高估", answer: "高估", distractors: ["低估", "剛好相等"], timeLimit: 50,
      tags: ["concavity-tangent-position", "concavity", "linear-approximation"],
      hints: ["算 f″(x) 在 x>0 的正負。", "凹向下的曲線，切線在曲線的上方還是下方？"],
      solution: "f″(x)=−(1/4)x^{−3/2}<0，√x 凹向下，切線落在曲線上方，所以切線估計值大於真值：高估。",
      solutionSteps: ["f′=(1/2)x^{−1/2}，f″=−(1/4)x^{−3/2}<0（x>0）。", "凹向下 ⇒ 切線在曲線上方。", "估計值 2.025 大於真值：高估。"],
      verify: { m: "choice", options: [
        { say: "高估", all: [{ v: { m: "linApprox", f: "\\sqrt{x}", a: 4, dx: 0.1 }, gt: V("\\sqrt{4.1}") }] },
        { say: "低估", all: [{ v: { m: "linApprox", f: "\\sqrt{x}", a: 4, dx: 0.1 }, lt: V("\\sqrt{4.1}") }] },
        { say: "剛好相等", all: [{ v: { m: "linApprox", f: "\\sqrt{x}", a: 4, dx: 0.1 }, eq: V("\\sqrt{4.1}"), tol: 1e-9 }] }] } },
    { id: "cg-3a-017", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\text{用 }f(x)=\\dfrac{1}{x}\\text{ 在 }x=2\\text{ 的切線估計 }\\dfrac{1}{1.9}\\text{。只看凹性：這個估計是高估還是低估？}",
      answers: ["低估", "偏低", "估計值比較小"], canonical: "低估", answer: "低估", distractors: ["高估", "剛好相等"], timeLimit: 50,
      tags: ["concavity-tangent-position", "concavity", "linear-approximation"],
      hints: ["算 f″(x) 在 x>0 的正負。", "凹向上的曲線，切線在曲線的上方還是下方？"],
      solution: "f″(x)=2/x³>0（x>0），1/x 凹向上，切線落在曲線下方，所以估計值小於真值：低估。",
      solutionSteps: ["f′=−1/x²，f″=2/x³>0（x>0）。", "凹向上 ⇒ 切線在曲線下方。", "估計值 0.525 小於真值 1/1.9≈0.5263：低估。"],
      verify: { m: "choice", options: [
        { say: "低估", all: [{ v: { m: "linApprox", f: "\\frac{1}{x}", a: 2, dx: -0.1 }, lt: V("\\frac{1}{1.9}") }] },
        { say: "高估", all: [{ v: { m: "linApprox", f: "\\frac{1}{x}", a: 2, dx: -0.1 }, gt: V("\\frac{1}{1.9}") }] },
        { say: "剛好相等", all: [{ v: { m: "linApprox", f: "\\frac{1}{x}", a: 2, dx: -0.1 }, eq: V("\\frac{1}{1.9}"), tol: 1e-9 }] }] } },
    { id: "cg-3a-018", topic: "derivatives", rank: 1, answerKind: "text",
      prompt: "f(x)=\\dfrac{1}{x}\\text{ 在 }x>0\\text{ 這一段的圖形是哪一種？}",
      answers: ["遞減且凹向上"], canonical: "遞減且凹向上", answer: "遞減且凹向上",
      distractors: ["遞減且凹向下", "遞增且凹向上", "遞增且凹向下"], timeLimit: 45,
      tags: ["concavity-vs-monotone", "concavity", "monotonicity"],
      hints: ["增減看 f′ 的正負。", "凹向看 f″ 的正負——兩件事分開判斷。"],
      solution: "f′=−1/x²<0，遞減；f″=2/x³>0（x>0），凹向上。增減與凹向是兩個獨立的問題。",
      solutionSteps: ["f′(x)=−1/x²<0 ⇒ 遞減。", "f″(x)=2/x³>0（x>0）⇒ 凹向上。", "答案：遞減且凹向上。"],
      verify: { m: "choice", options: [
        { say: "遞減且凹向上", all: [{ v: D("\\frac{1}{x}", 0.5), lt: 0 }, { v: D("\\frac{1}{x}", 3), lt: 0 }, { v: D("\\frac{1}{x}", 0.5, 2), gt: 0 }, { v: D("\\frac{1}{x}", 3, 2), gt: 0 }] },
        { say: "遞減且凹向下", all: [{ v: D("\\frac{1}{x}", 1, 2), lt: 0 }] },
        { say: "遞增且凹向上", all: [{ v: D("\\frac{1}{x}", 1), gt: 0 }] },
        { say: "遞增且凹向下", all: [{ v: D("\\frac{1}{x}", 1), gt: 0 }, { v: D("\\frac{1}{x}", 1, 2), lt: 0 }] }] } },
    { id: "cg-3a-019", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\text{已知 }f'(x)=\\dfrac{1}{x}\\ (x>0)\\text{。}f\\text{ 在 }x>0\\text{ 上的圖形是哪一種？}",
      answers: ["遞增且凹向下"], canonical: "遞增且凹向下", answer: "遞增且凹向下",
      distractors: ["遞增且凹向上", "遞減且凹向下", "遞減且凹向上"], timeLimit: 50,
      tags: ["concavity-vs-monotone", "concavity", "monotonicity"],
      hints: ["f 的增減：看題目給的 f′ 本身的正負。", "f 的凹向：看 f′ 自己是在變大還是變小。"],
      solution: "f′=1/x>0，所以 f 遞增；f″=(1/x)′=−1/x²<0，所以 f 凹向下。f′ 是正的、但越來越小。",
      solutionSteps: ["f′(x)=1/x>0（x>0）⇒ f 遞增。", "f″(x)=−1/x²<0 ⇒ f 凹向下。", "答案：遞增且凹向下。"],
      verify: { m: "choice", options: [
        { say: "遞增且凹向下", all: [{ v: V("\\frac{1}{0.5}"), gt: 0 }, { v: V("\\frac{1}{3}"), gt: 0 }, { v: D("\\frac{1}{x}", 0.5), lt: 0 }, { v: D("\\frac{1}{x}", 3), lt: 0 }] },
        { say: "遞增且凹向上", all: [{ v: D("\\frac{1}{x}", 1), gt: 0 }] },
        { say: "遞減且凹向下", all: [{ v: V("\\frac{1}{1}"), lt: 0 }] },
        { say: "遞減且凹向上", all: [{ v: V("\\frac{1}{1}"), lt: 0 }, { v: D("\\frac{1}{x}", 1), gt: 0 }] }] } },
    { id: "cg-3a-020", topic: "derivatives", rank: 2, answerKind: "interval",
      prompt: "\\text{求 }f(x)=\\dfrac{x}{x+1}\\text{ 凹向上的區間}",
      answer: "(-inf, -1)", timeLimit: 60,
      tags: ["concavity-domain-split", "concavity", "rational-function"],
      hints: ["先把 f 寫成 1−1/(x+1)，微分比較快。", "f″ 的正負由 (x+1)³ 決定；x=−1 不在定義域。"],
      solution: "f=1−1/(x+1)，f′=1/(x+1)²，f″=−2/(x+1)³。x<−1 時 (x+1)³<0，f″>0，凹向上；x>−1 時凹向下。凹向上區間 (−∞,−1)。",
      solutionSteps: ["f(x)=1−1/(x+1)，f′(x)=(x+1)^{−2}。", "f″(x)=−2(x+1)^{−3}。", "f″>0 ⇔ (x+1)³<0 ⇔ x<−1：(−∞, −1)。"],
      verify: { m: "concaveUp", f: "\\frac{x}{x+1}", range: [-20, 20] } },

    /* ── 3.6 反曲點：f″ 不存在、f″=0 但不換號 ── */
    { id: "cg-3a-021", topic: "derivatives", rank: 2, answerKind: "set",
      prompt: "\\text{求 }f(x)=\\sqrt[3]{x-1}+2\\text{ 所有反曲點的 }x\\text{ 座標}",
      answer: "{1}", timeLimit: 60,
      tags: ["inflection-undefined-second", "inflection", "radical"],
      hints: ["寫成 (x−1)^{1/3}+2，微分兩次。", "f″ 永遠不等於 0，但有一點 f″ 不存在；看那一點兩側 f″ 的正負，並確認 f 在那裡有定義。"],
      solution: "f′=(1/3)(x−1)^{−2/3}，f″=−(2/9)(x−1)^{−5/3}。f″ 沒有零點，但在 x=1 不存在；x<1 時 f″>0、x>1 時 f″<0，凹向改變且 f(1)=2 有定義，所以 x=1 是反曲點。",
      solutionSteps: ["f″(x)=−(2/9)(x−1)^{−5/3}，從不為 0。", "x=1 處 f″ 不存在，但 f(1)=2 有定義。", "x<1：f″>0；x>1：f″<0，凹向改變。", "反曲點：{1}。"],
      verify: { m: "inflection", f: "\\sgn(x-1)|x-1|^{1/3}+2", range: [-6, 6] } },
    { id: "cg-3a-022", topic: "derivatives", rank: 3, answerKind: "set",
      prompt: "\\text{求 }f(x)=x^{1/3}(x+4)\\text{ 所有反曲點的 }x\\text{ 座標}",
      answer: "{0, 2}", timeLimit: 110,
      tags: ["inflection-undefined-second", "inflection", "radical"],
      hints: ["展開成 x^{4/3}+4x^{1/3}，微分兩次後提出 x^{−5/3}。", "f″=0 的點與 f″ 不存在的點都要檢查兩側正負。"],
      solution: "f′=(4/3)x^{1/3}+(4/3)x^{−2/3}，f″=(4/9)x^{−2/3}−(8/9)x^{−5/3}=(4/9)x^{−5/3}(x−2)。x<0：f″>0；0<x<2：f″<0；x>2：f″>0。x=0（f″ 不存在）與 x=2（f″=0）都換號，反曲點 {0, 2}。",
      solutionSteps: ["f(x)=x^{4/3}+4x^{1/3}，f″(x)=(4/9)x^{−5/3}(x−2)。", "候選：x=2（f″=0）、x=0（f″ 不存在，f(0)=0 有定義）。", "符號：(−∞,0) 正、(0,2) 負、(2,∞) 正，兩點都換號。", "反曲點：{0, 2}。"],
      verify: { m: "inflection", f: "\\sgn(x)|x|^{1/3}(x+4)", range: [-6, 8] } },
    { id: "cg-3a-023", topic: "derivatives", rank: 3, answerKind: "set",
      prompt: "\\text{求 }f(x)=x^5-5x^4+1\\text{ 所有反曲點的 }x\\text{ 座標}",
      answer: "{3}", timeLimit: 80,
      tags: ["inflection-sign-check", "inflection", "polynomial"],
      hints: ["f″ 可以提出 x²。", "f″=0 的每一個根都要檢查兩側有沒有換號。"],
      solution: "f″=20x³−60x²=20x²(x−3)。x=0 時 f″=0，但 x² 不換號，兩側 f″ 都是負的，不是反曲點；x=3 兩側由負變正，是反曲點。答案 {3}。",
      solutionSteps: ["f′=5x⁴−20x³，f″=20x³−60x²=20x²(x−3)。", "候選 x=0、x=3。", "x=0 兩側 f″<0（x² 不換號），不是反曲點；x=3 由負變正。", "反曲點：{3}。"],
      verify: { m: "choice", note: "inflection 掃描會把 f″ 的偶重根 x=0 也算成根；改驗 f″ 各段正負與換號點",
        options: [{ say: "{3}", all: [
          { v: D("x^5-5x^4+1", -1, 2), lt: 0 }, { v: D("x^5-5x^4+1", 1, 2), lt: 0 },
          { v: D("x^5-5x^4+1", 2.9, 2), lt: 0 }, { v: D("x^5-5x^4+1", 3.1, 2), gt: 0 },
          { v: D("x^5-5x^4+1", 5, 2), gt: 0 },
          { v: { m: "criticalPoint", f: "x^5-5x^4+1", x0: 3.5, order: 2 }, eq: 3 }] }] } },
    { id: "cg-3a-024", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "f(x)=(x-1)^4+x\\text{ 滿足 }f''(1)=0\\text{。}x=1\\text{ 是不是 }f\\text{ 的反曲點？}",
      answers: ["不是"], canonical: "不是", answer: "不是",
      distractors: ["是，因為 f″(1)=0", "是，因為 f′(1)=0"], timeLimit: 50,
      tags: ["inflection-sign-check", "inflection", "polynomial"],
      hints: ["f″(1)=0 只是候選，還要看 f″ 在 1 的兩側。", "把 f″ 算出來，看它在 x=1 左右的正負。"],
      solution: "f″=12(x−1)²≥0，在 x=1 兩側都是正的，凹向沒有改變，所以 x=1 不是反曲點。f′(1)=1 也不是 0。",
      solutionSteps: ["f′=4(x−1)³+1，f′(1)=1。", "f″=12(x−1)²，在 x=1 兩側都大於 0。", "凹向不變：x=1 不是反曲點。"],
      verify: { m: "choice", options: [
        { say: "不是", all: [{ v: D("(x-1)^4+x", 0.8, 2), gt: 0 }, { v: D("(x-1)^4+x", 1.2, 2), gt: 0 }] },
        { say: "是，因為 f″(1)=0", all: [{ v: D("(x-1)^4+x", 1, 2), eq: 0, tol: 1e-4 }, { v: D("(x-1)^4+x", 0.8, 2), lt: 0 }] },
        { say: "是，因為 f′(1)=0", all: [{ v: D("(x-1)^4+x", 1), eq: 0 }] }] } },

    /* ── 3.7 二階導數判別：失效時改一階、直接套用 ── */
    { id: "cg-3a-025", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "f(x)=x^4-4x^3\\text{ 在 }x=0\\text{ 有 }f'(0)=0\\text{、}f''(0)=0\\text{，二階判別失效。改用一階判別，}x=0\\text{ 是什麼點？}",
      answers: ["不是極值", "不是局部極值", "都不是"], canonical: "不是極值", answer: "不是極值",
      distractors: ["局部極大", "局部極小"], timeLimit: 60,
      tags: ["sdt-inconclusive", "second-derivative-test", "first-derivative-test"],
      hints: ["把 f′ 因式分解。", "看 f′ 在 0 的左邊與右邊是什麼號。"],
      solution: "f′=4x³−12x²=4x²(x−3)。x 在 0 附近時 x−3<0、x²>0，f′ 在 0 兩側都是負的，不換號，所以 x=0 不是極值（f 在那裡一路往下）。",
      solutionSteps: ["f′(x)=4x²(x−3)。", "0 的左右兩側：4x²>0、x−3<0，f′<0。", "f′ 不換號 ⇒ x=0 不是局部極值。"],
      verify: { m: "choice", options: [
        { say: "不是極值", all: [{ v: D("x^4-4x^3", -0.1), lt: 0 }, { v: D("x^4-4x^3", 0.1), lt: 0 }] },
        { say: "局部極大", all: [{ v: D("x^4-4x^3", -0.1), gt: 0 }, { v: D("x^4-4x^3", 0.1), lt: 0 }] },
        { say: "局部極小", all: [{ v: D("x^4-4x^3", -0.1), lt: 0 }, { v: D("x^4-4x^3", 0.1), gt: 0 }] }] } },
    { id: "cg-3a-026", topic: "derivatives", rank: 3, answerKind: "numeric",
      prompt: "\\text{求 }f(x)=x^4-8x^3+24x^2-32x+19\\text{ 的局部極小值}",
      answer: "3", timeLimit: 100,
      tags: ["sdt-inconclusive", "second-derivative-test", "first-derivative-test"],
      hints: ["f′ 提出 4 之後，看看是不是某個一次式的完全立方。", "唯一的臨界點上 f″ 是 0，二階判別說不出結論，改看 f′ 的正負。"],
      solution: "f′=4x³−24x²+48x−32=4(x−2)³，唯一臨界點 x=2，f″(2)=12(2−2)²=0，二階判別失效。f′ 在 2 由負變正，局部極小值 f(2)=16−64+96−64+19=3。",
      solutionSteps: ["f′(x)=4(x³−6x²+12x−8)=4(x−2)³。", "f″(x)=12(x−2)²，f″(2)=0，二階判別失效。", "x<2：f′<0；x>2：f′>0 ⇒ x=2 局部極小。", "f(2)=16−64+96−64+19=3。"],
      verify: { m: "extremum1d", f: "x^4-8x^3+24x^2-32x+19", v: "x", lo: -2, hi: 6, kind: "min" } },
    { id: "cg-3a-027", topic: "derivatives", rank: 1, answerKind: "text",
      prompt: "\\text{已知 }f\\text{ 二階可微，}f'(2)=0\\text{ 且 }f''(2)=-5\\text{。}x=2\\text{ 是什麼點？}",
      answers: ["局部極大", "局部極大值", "極大"], canonical: "局部極大", answer: "局部極大",
      distractors: ["局部極小", "反曲點"], timeLimit: 40,
      tags: ["sdt-apply", "second-derivative-test"],
      hints: ["f′(2)=0：切線水平。", "f″(2) 的正負告訴你那附近是凹向上還是凹向下。"],
      solution: "二階判別：f′(2)=0 且 f″(2)<0，曲線在 2 附近凹向下，水平切線點在山頂，所以是局部極大。f″ 在 2 附近不換號，也不是反曲點。",
      solutionSteps: ["f′(2)=0：x=2 是臨界點。", "f″(2)=−5<0：在 2 附近凹向下。", "凹向下的水平切線點是局部極大。"],
      verify: { m: "choice", note: "見證函數 −(5/2)(x−2)² 滿足兩個條件，用它推翻誘答；正解是二階判別本身",
        options: [
          { say: "局部極大", given: [{ v: D("-\\frac{5}{2}(x-2)^2", 2), eq: 0 }, { v: D("-\\frac{5}{2}(x-2)^2", 2, 2), eq: -5, tol: 1e-4 }],
            all: [{ v: D("-\\frac{5}{2}(x-2)^2", 1.9), gt: 0 }, { v: D("-\\frac{5}{2}(x-2)^2", 2.1), lt: 0 }] },
          { say: "局部極小", given: [{ v: D("-\\frac{5}{2}(x-2)^2", 2), eq: 0 }, { v: D("-\\frac{5}{2}(x-2)^2", 2, 2), eq: -5, tol: 1e-4 }],
            all: [{ v: D("-\\frac{5}{2}(x-2)^2", 1.9), lt: 0 }, { v: D("-\\frac{5}{2}(x-2)^2", 2.1), gt: 0 }] },
          { say: "反曲點", given: [{ v: D("-\\frac{5}{2}(x-2)^2", 2), eq: 0 }, { v: D("-\\frac{5}{2}(x-2)^2", 2, 2), eq: -5, tol: 1e-4 }],
            all: [{ v: { m: "let", f: "p\\cdot q", with: { p: D("-\\frac{5}{2}(x-2)^2", 1.9, 2), q: D("-\\frac{5}{2}(x-2)^2", 2.1, 2) } }, lt: 0 }] }] } },
    { id: "cg-3a-028", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\text{用二階導數判別，求 }f(x)=x^3-3x^2-9x+2\\text{ 的局部極小值}",
      answer: "-25", timeLimit: 60,
      tags: ["sdt-apply", "second-derivative-test", "polynomial"],
      hints: ["先解 f′(x)=0。", "把兩個臨界點代進 f″，正的那個是極小。"],
      solution: "f′=3x²−6x−9=3(x−3)(x+1)，f″=6x−6。f″(3)=12>0 → 局部極小 f(3)=27−27−27+2=−25；f″(−1)=−12<0 → 局部極大。",
      solutionSteps: ["f′(x)=3(x−3)(x+1)，臨界點 −1、3。", "f″(x)=6x−6：f″(3)=12>0，f″(−1)=−12<0。", "局部極小值 f(3)=27−27−27+2=−25。"],
      verify: { m: "extremum1d", f: "x^3-3x^2-9x+2", v: "x", lo: 0, hi: 6, kind: "min" } },

    /* ── 3.8 漸近線：x→−∞、非有理函數的垂直與斜漸近線 ── */
    { id: "cg-3b-001", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "f(x)=\\dfrac{3x}{\\sqrt{x^2+4}}\\text{ 在 }x\\to-\\infty\\text{ 的水平漸近線是 }y=c\\,\\text{，求 }c",
      answer: "-3", timeLimit: 60,
      tags: ["asymptote-negative-infinity-root", "asymptote", "limit-at-infinity", "radical"],
      hints: ["分子分母同除以 |x|，因為 √(x²)=|x|。", "x<0 時 |x|=−x，分子除以 |x| 會多一個負號。"],
      solution: "x<0 時 √(x²+4)=|x|√(1+4/x²)=−x√(1+4/x²)。f=3x/(−x√(1+4/x²))=−3/√(1+4/x²)→−3。（x→+∞ 時是 y=3，兩邊不同。）",
      solutionSteps: ["x<0：√(x²+4)=−x·√(1+4/x²)。", "f(x)=3x/(−x√(1+4/x²))=−3/√(1+4/x²)。", "x→−∞：c=−3。"],
      verify: { m: "limit", f: "\\frac{3x}{\\sqrt{x^2+4}}", at: "-inf" } },
    { id: "cg-3b-002", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "f(x)=\\sqrt{4x^2+x}+2x\\text{ 在 }x\\to-\\infty\\text{ 的水平漸近線是 }y=c\\,\\text{，求 }c",
      answer: "-1/4", timeLimit: 100,
      tags: ["asymptote-negative-infinity-root", "asymptote", "limit-at-infinity", "rationalize"],
      hints: ["x→−∞ 時 2x 是很大的負數，是 ∞−∞ 型：乘以共軛 √(4x²+x)−2x。", "通分後分子分母同除以 |x|=−x。"],
      solution: "乘共軛：f=(4x²+x−4x²)/(√(4x²+x)−2x)=x/(√(4x²+x)−2x)。x<0 時同除以 −x：−1/(√(4+1/x)+2)→−1/4。",
      solutionSteps: ["f(x)=x/(√(4x²+x)−2x)（乘共軛）。", "x<0：√(4x²+x)=−x√(4+1/x)，分子分母同除以 −x。", "f=−1/(√(4+1/x)+2)→−1/(2+2)=−1/4。"],
      verify: { m: "limit", f: "\\sqrt{4x^2+x}+2x", at: "-inf" } },
    { id: "cg-3b-003", topic: "limits", rank: 2, answerKind: "set",
      prompt: "\\text{求 }f(x)=\\tan(2x)\\text{ 在 }0<x<\\pi\\text{ 範圍內所有垂直漸近線的 }x",
      answer: "{pi/4, 3*pi/4}", timeLimit: 60,
      tags: ["asymptote-vertical", "asymptote", "trig"],
      hints: ["tan(2x)=sin(2x)/cos(2x)，分母為 0 時分子不為 0。", "解 cos(2x)=0，注意 2x 的範圍是 (0, 2π)。"],
      solution: "tan(2x) 在 cos(2x)=0 處趨向 ±∞。2x∈(0,2π)，2x=π/2 或 3π/2，所以 x=π/4、3π/4。",
      solutionSteps: ["垂直漸近線在 cos(2x)=0、sin(2x)≠0 的地方。", "0<2x<2π：2x=π/2、3π/2。", "x=π/4、3π/4。"],
      verify: { m: "zeros", f: "\\cos(2x)", range: [0.01, 3.13] } },
    { id: "cg-3b-004", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "f(x)=\\dfrac{\\ln x}{x-1}\\text{ 只有一條垂直漸近線 }x=a\\,\\text{，求 }a",
      answer: "0", timeLimit: 80,
      tags: ["asymptote-vertical", "asymptote", "log", "asymptote-hole-vs-vertical"],
      hints: ["分母為 0 的 x=1：分子也是 0，算 x→1 的極限看看是不是有限。", "定義域的邊界 x=0⁺：ln x 會怎樣？"],
      solution: "x→1 時是 0/0，用 L'Hôpital 得 (1/x)/1→1，有限，不是漸近線。x→0⁺ 時 ln x→−∞、x−1→−1，f→+∞，所以 a=0。",
      solutionSteps: ["x=1：lim (ln x)/(x−1)=lim (1/x)/1=1，有限，只是洞。", "x→0⁺：ln x→−∞，x−1→−1，f→+∞。", "垂直漸近線 x=0：a=0。"],
      verify: { m: "choice", note: "f→+∞ 改驗 e^{−f}=x^{1/(1−x)}→0；x=1 驗極限有限",
        options: [{ say: "0", all: [
          { v: { m: "limit", f: "x^{\\frac{1}{1-x}}", at: 0, dir: "+" }, eq: 0 },
          { v: { m: "limit", f: "\\frac{\\ln x}{x-1}", at: 1 }, eq: 1 }] }] } },
    { id: "cg-3b-005", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "f(x)=xe^{1/x}\\text{ 在 }x\\to\\infty\\text{ 有斜漸近線 }y=m\\,x+b\\,\\text{，求 }b",
      answer: "1", timeLimit: 110,
      tags: ["asymptote-slant", "asymptote", "limit-at-infinity", "exponential"],
      hints: ["先求 m=lim f(x)/x。", "再求 b=lim (f(x)−mx)；令 t=1/x 會變成 0/0 型。"],
      solution: "m=lim e^{1/x}=1。b=lim (xe^{1/x}−x)=lim (e^{1/x}−1)/(1/x)，令 t=1/x→0⁺，得 lim (e^t−1)/t=1。斜漸近線 y=x+1，b=1。",
      solutionSteps: ["m=lim_{x→∞} f(x)/x=lim e^{1/x}=1。", "b=lim (xe^{1/x}−x)=lim_{t→0⁺} (e^t−1)/t（t=1/x）。", "(e^t−1)/t→1，所以 b=1。"],
      verify: { m: "choice", note: "m 與 b 各自數值取極限",
        options: [{ say: "1", all: [
          { v: { m: "limit", f: "e^{1/x}", at: "inf" }, eq: 1 },
          { v: { m: "limit", f: "xe^{1/x}-x", at: "inf" }, eq: 1 }] }] } },

    /* ── 3.9 作圖前置：定義域、截距、奇偶 ── */
    { id: "cg-3b-006", topic: "derivatives", rank: 2, answerKind: "interval",
      prompt: "\\text{求 }f(x)=\\sqrt{x+4}+\\ln(1-x)\\text{ 的定義域}",
      answer: "[-4, 1)", timeLimit: 50,
      tags: ["sketch-domain-intercepts", "domain", "curve-sketching"],
      hints: ["根號裡要 ≥ 0，對數裡要 > 0。", "兩個條件同時成立，取交集；端點要看是 ≥ 還是 >。"],
      solution: "√(x+4) 要 x+4≥0，即 x≥−4；ln(1−x) 要 1−x>0，即 x<1。交集 [−4, 1)。",
      solutionSteps: ["x+4≥0 ⇒ x≥−4（可以等號）。", "1−x>0 ⇒ x<1（不能等號）。", "定義域：[−4, 1)。"],
      verify: { m: "domain", f: "\\sqrt{x+4}+\\ln(1-x)", range: [-10, 10] } },
    { id: "cg-3b-007", topic: "derivatives", rank: 2, answerKind: "set",
      prompt: "\\text{求 }f(x)=\\left(x^2-4\\right)\\sqrt{x+1}\\text{ 所有 }x\\text{ 截距}",
      answer: "{-1, 2}", timeLimit: 60,
      tags: ["sketch-domain-intercepts", "curve-sketching", "domain-aware", "radical"],
      hints: ["乘積為 0：其中一個因式為 0。", "解出來的每個 x 都要在定義域 x≥−1 裡。"],
      solution: "定義域 x≥−1。x²−4=0 得 x=±2，但 −2 不在定義域；√(x+1)=0 得 x=−1。x 截距是 {−1, 2}。",
      solutionSteps: ["定義域：x≥−1。", "x²−4=0：x=±2，x=−2 不在定義域。", "√(x+1)=0：x=−1。", "x 截距：{−1, 2}。"],
      verify: { m: "zeros", f: "(x^2-4)\\sqrt{x+1}", range: [-1, 6] } },
    { id: "cg-3b-008", topic: "derivatives", rank: 1, answerKind: "text",
      prompt: "f(x)=\\dfrac{x^3}{x^2+1}\\text{ 是奇函數、偶函數，還是都不是？}",
      answers: ["奇函數", "奇"], canonical: "奇函數", answer: "奇函數", distractors: ["偶函數", "都不是"], timeLimit: 30,
      tags: ["sketch-symmetry", "symmetry", "curve-sketching"],
      hints: ["把 x 換成 −x，化簡 f(−x)。", "f(−x)=f(x) 是偶，f(−x)=−f(x) 是奇。"],
      solution: "f(−x)=(−x)³/((−x)²+1)=−x³/(x²+1)=−f(x)，所以是奇函數，圖形對原點對稱。",
      solutionSteps: ["分子 (−x)³=−x³，分母 (−x)²+1=x²+1。", "f(−x)=−f(x)。", "奇函數。"],
      verify: { m: "choice", options: [
        { say: "奇函數", all: [{ v: V("\\frac{1.3^3}{1.3^2+1}+\\frac{(-1.3)^3}{(-1.3)^2+1}"), eq: 0 }, { v: V("\\frac{0.7^3}{0.7^2+1}+\\frac{(-0.7)^3}{(-0.7)^2+1}"), eq: 0 }] },
        { say: "偶函數", all: [{ v: V("\\frac{1.3^3}{1.3^2+1}-\\frac{(-1.3)^3}{(-1.3)^2+1}"), eq: 0 }] },
        { say: "都不是", all: [{ v: V("\\frac{1.3^3}{1.3^2+1}+\\frac{(-1.3)^3}{(-1.3)^2+1}"), ne: 0 }] }] } },
    { id: "cg-3b-009", topic: "derivatives", rank: 1, answerKind: "text",
      prompt: "f(x)=x\\tan x\\text{ 是奇函數、偶函數，還是都不是？}",
      answers: ["偶函數", "偶"], canonical: "偶函數", answer: "偶函數", distractors: ["奇函數", "都不是"], timeLimit: 30,
      tags: ["sketch-symmetry", "symmetry", "trig"],
      hints: ["x 是奇函數，tan x 也是奇函數。", "算 f(−x)=(−x)·tan(−x)。"],
      solution: "f(−x)=(−x)·tan(−x)=(−x)(−tan x)=x tan x=f(x)，兩個奇函數相乘是偶函數。",
      solutionSteps: ["tan(−x)=−tan x。", "f(−x)=(−x)(−tan x)=x tan x=f(x)。", "偶函數。"],
      verify: { m: "choice", options: [
        { say: "偶函數", all: [{ v: V("1.1\\tan(1.1)-(-1.1)\\tan(-1.1)"), eq: 0 }, { v: V("0.4\\tan(0.4)-(-0.4)\\tan(-0.4)"), eq: 0 }] },
        { say: "奇函數", all: [{ v: V("1.1\\tan(1.1)+(-1.1)\\tan(-1.1)"), eq: 0 }] },
        { say: "都不是", all: [{ v: V("1.1\\tan(1.1)-(-1.1)\\tan(-1.1)"), ne: 0 }] }] } },

    /* ── 3.10 作圖一致性檢查 ── */
    { id: "cg-3b-010", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\text{同學分析 }f(x)=x^3-3x\\text{ 寫了四句話，哪一句是錯的？}",
      answers: ["在 (−1, 1) 凹向下"], canonical: "在 (−1, 1) 凹向下", answer: "在 (−1, 1) 凹向下",
      distractors: ["x=−1 是局部極大", "x=1 是局部極小", "在 (0, ∞) 凹向上"], timeLimit: 70,
      tags: ["sketch-consistency-check", "curve-sketching", "concavity"],
      hints: ["極值看 f′=3x²−3 的換號，凹向看 f″=6x 的正負。", "凹向改變的點在哪裡？它有沒有落在 (−1, 1) 裡面？"],
      solution: "f′=3(x−1)(x+1)：−1 極大、1 極小，兩句都對。f″=6x：(0,∞) 凹向上對；但 (−1,0) 凹向下、(0,1) 凹向上，「(−1,1) 凹向下」是錯的——反曲點 0 在中間。",
      solutionSteps: ["f′=3(x−1)(x+1)：x=−1 由正變負（極大）、x=1 由負變正（極小）。", "f″=6x：x>0 凹向上、x<0 凹向下。", "(−1,1) 跨過反曲點 0，不是整段凹向下：這句錯。"],
      verify: { m: "choice", pick: "false", options: [
        { say: "在 (−1, 1) 凹向下", all: [{ v: D("x^3-3x", -0.5, 2), lt: 0 }, { v: D("x^3-3x", 0.5, 2), lt: 0 }] },
        { say: "x=−1 是局部極大", all: [{ v: D("x^3-3x", -1.1), gt: 0 }, { v: D("x^3-3x", -0.9), lt: 0 }] },
        { say: "x=1 是局部極小", all: [{ v: D("x^3-3x", 0.9), lt: 0 }, { v: D("x^3-3x", 1.1), gt: 0 }] },
        { say: "在 (0, ∞) 凹向上", all: [{ v: D("x^3-3x", 0.1, 2), gt: 0 }, { v: D("x^3-3x", 1, 2), gt: 0 }, { v: D("x^3-3x", 10, 2), gt: 0 }] }] } },
    { id: "cg-3b-011", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "\\text{某函數 }f\\text{ 二階可微。下列哪一組結論不可能同時成立？}",
      answers: ["f′(1)=0、f″(1)>0、f(1) 是局部極大"], canonical: "f′(1)=0、f″(1)>0、f(1) 是局部極大", answer: "f′(1)=0、f″(1)>0、f(1) 是局部極大",
      distractors: ["f′(1)=0、f″(1)=0、f(1) 是局部極小", "f′(1)=0、f″(1)=0、f(1) 不是極值", "f′(1)=0、f″(1)<0、f(1) 是局部極大"], timeLimit: 90,
      tags: ["sketch-consistency-check", "second-derivative-test", "curve-sketching"],
      hints: ["f″(1)>0 代表 1 附近凹向上；凹向上的水平切線點是山頂還是谷底？", "f″(1)=0 的兩組：試試 (x−1)⁴ 與 (x−1)³。"],
      solution: "f′(1)=0 且 f″(1)>0 時二階判別保證 f(1) 是嚴格局部極小，不可能是局部極大。其餘三組都有例子：(x−1)⁴（極小）、(x−1)³（不是極值）、−(x−1)²（極大）。",
      solutionSteps: ["二階判別：f′(1)=0、f″(1)>0 ⇒ 嚴格局部極小，和「局部極大」矛盾。", "(x−1)⁴：f′(1)=f″(1)=0，局部極小；(x−1)³：f′(1)=f″(1)=0，不是極值。", "−(x−1)²：f″(1)=−2<0，局部極大。", "不可能的是第一組。"],
      verify: { m: "choice", pick: "false", note: "選項讀成「可以同時成立」：三組誘答各用一個見證函數正面成立；正解是二階判別本身",
        options: [
          { say: "f′(1)=0、f″(1)>0、f(1) 是局部極大", unknown: "二階判別定理：f′(1)=0、f″(1)>0 必為嚴格局部極小" },
          { say: "f′(1)=0、f″(1)=0、f(1) 是局部極小", all: [{ v: D("(x-1)^4", 1), eq: 0 }, { v: D("(x-1)^4", 1, 2), eq: 0, tol: 1e-4 }, { v: D("(x-1)^4", 0.9), lt: 0 }, { v: D("(x-1)^4", 1.1), gt: 0 }] },
          { say: "f′(1)=0、f″(1)=0、f(1) 不是極值", all: [{ v: D("(x-1)^3", 1), eq: 0 }, { v: D("(x-1)^3", 1, 2), eq: 0, tol: 1e-4 }, { v: D("(x-1)^3", 0.9), gt: 0 }, { v: D("(x-1)^3", 1.1), gt: 0 }] },
          { say: "f′(1)=0、f″(1)<0、f(1) 是局部極大", all: [{ v: D("-(x-1)^2", 1), eq: 0 }, { v: D("-(x-1)^2", 1, 2), lt: 0 }, { v: D("-(x-1)^2", 0.9), gt: 0 }, { v: D("-(x-1)^2", 1.1), lt: 0 }] }] } },

    /* ── 3.11 最佳化：臨界點落在範圍外，答案在端點 ── */
    { id: "cg-3c-001", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\text{用 100 公尺圍籬靠著一面長牆圍出長方形菜園（靠牆的那一邊不用圍）。因為地形，和牆平行的那一邊最長只能 40 公尺。菜園面積最大是多少平方公尺？}",
      answer: "1200", timeLimit: 120,
      tags: ["optimization-domain", "optimization", STORY, "closed-interval"],
      hints: ["設和牆平行的邊長 x，寫出面積 A(x)，並寫出 x 的範圍。", "A′=0 解出的 x 落在範圍裡嗎？不在的話，看範圍的端點。"],
      solution: "設平行牆的邊 x（0<x≤40），另兩邊各 (100−x)/2，A=x(100−x)/2。A′=50−x=0 得 x=50，超出範圍；A 在 (0,40] 遞增，最大在 x=40：A=40×30=1200 平方公尺。",
      solutionSteps: ["A(x)=x·(100−x)/2，0<x≤40。", "A′(x)=50−x=0 ⇒ x=50，不在 (0,40] 裡。", "A′>0 在整個範圍，最大在端點 x=40：另兩邊各 30 公尺。", "最大面積 40×30=1200 平方公尺。"],
      verify: { m: "extremum1d", f: "\\frac{x(100-x)}{2}", v: "x", lo: 0, hi: 40, kind: "max" } },
    { id: "cg-3c-002", topic: "derivatives", rank: 3, answerKind: "numeric",
      prompt: "\\text{從 12 公分}\\times 12\\text{ 公分的正方形紙板四角各剪掉邊長 }x\\text{ 公分的小正方形，折成無蓋盒。規定盒子不能太淺：}x\\ge 3\\text{。盒子最大容積是多少立方公分？}",
      answer: "108", timeLimit: 150,
      tags: ["optimization-domain", "optimization", STORY, "closed-interval"],
      hints: ["V(x)=x(12−2x)²，x 的範圍是 3≤x<6。", "V′=0 的解有沒有落在範圍裡？沒有的話，V 在範圍裡怎麼變化？"],
      solution: "V=x(12−2x)²，V′=(12−2x)(12−6x)，臨界點 x=2、6，都不在 [3,6) 的內部。範圍內 V′<0，V 遞減，最大在 x=3：V=3×6²=108 立方公分。",
      solutionSteps: ["V(x)=x(12−2x)²，3≤x<6。", "V′(x)=(12−2x)²−4x(12−2x)=(12−2x)(12−6x)，零點 x=2、6。", "3<x<6 時 12−2x>0、12−6x<0，V′<0，V 遞減。", "最大在 x=3：V=3·6²=108 立方公分。"],
      verify: { m: "extremum1d", f: "x(12-2x)^2", v: "x", lo: 3, hi: 6, kind: "max" } },

    /* ── 3.13 路線最佳化：最佳解在端點 ── */
    { id: "cg-3c-003", topic: "derivatives", rank: 3, answerKind: "numeric",
      prompt: "\\text{你在湖上的小船裡，離筆直的湖岸 3 公里（垂足為 }P\\,\\text{）。目的地 }Q\\,\\text{ 在岸上、離 }P\\,\\text{ 4 公里。划船時速 5 公里、跑步時速 4 公里。先划到岸上某點再沿岸跑到 }Q\\,\\text{，最少要幾分鐘？}",
      answer: "60", timeLimit: 180,
      tags: ["optimization-endpoint-check", "optimization", STORY, "optimization-path-time"],
      hints: ["設上岸點離 P 為 x 公里（0≤x≤4），寫出總時間 T(x)。", "試著解 T′(x)=0：x/√(9+x²) 永遠小於 1，等式有沒有解？"],
      solution: "T(x)=√(9+x²)/5+(4−x)/4。T′=x/(5√(9+x²))−1/4，因為 x/√(9+x²)<1，T′<1/5−1/4<0，T 一路遞減，最小在 x=4：直接划到 Q，T=5/5=1 小時=60 分鐘。",
      solutionSteps: ["T(x)=√(9+x²)/5+(4−x)/4，0≤x≤4。", "T′(x)=x/(5√(9+x²))−1/4<1/5−1/4<0，沒有臨界點。", "T 遞減，最小在端點 x=4：T(4)=√25/5=1 小時。", "最少 60 分鐘（划船比跑步快，直接划到 Q）。"],
      verify: { m: "extremum1d", f: "60\\left(\\frac{\\sqrt{9+x^2}}{5}+\\frac{4-x}{4}\\right)", v: "x", lo: 0, hi: 4, kind: "min" } },
    { id: "cg-3c-004", topic: "derivatives", rank: 3, answerKind: "numeric",
      prompt: "\\text{河寬 2 公里，工廠在對岸、下游 6 公里處。電纜沿本岸鋪每公里 60 萬元、在水下鋪每公里 50 萬元。先沿本岸鋪 }x\\text{ 公里（}0\\le x\\le 6\\text{）再斜穿河到工廠，最低總成本是多少萬元？}",
      answer: "100sqrt(10)", timeLimit: 180,
      tags: ["optimization-endpoint-check", "optimization", STORY, "optimization-path-cost"],
      hints: ["水下那段長 √(4+(6−x)²)，寫出 C(x)。", "C′(x) 裡的 (6−x)/√(4+(6−x)²) 永遠小於 1，C′ 的正負會改變嗎？"],
      solution: "C(x)=60x+50√(4+(6−x)²)。C′=60−50(6−x)/√(4+(6−x)²)>60−50>0，C 遞增，最小在 x=0：全部走水下，C=50√40=100√10≈316.2 萬元。",
      solutionSteps: ["C(x)=60x+50√(4+(6−x)²)，0≤x≤6。", "C′(x)=60−50·(6−x)/√(4+(6−x)²)>60−50=10>0。", "C 遞增，最小在端點 x=0。", "C(0)=50√40=100√10≈316.2 萬元。"],
      verify: { m: "extremum1d", f: "60x+50\\sqrt{4+(6-x)^2}", v: "x", lo: 0, hi: 6, kind: "min" } },

    /* ── 3.15 線性近似：高估還是低估 ── */
    { id: "cg-3d-001", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\text{用 }\\ln x\\text{ 在 }x=1\\text{ 的線性近似估計 }\\ln 0.9\\text{，得到 }-0.1\\text{。這個估計比真值大（高估）還是小（低估）？}",
      answers: ["高估", "偏高", "比真值大"], canonical: "高估", answer: "高估", distractors: ["低估", "剛好相等"], timeLimit: 50,
      tags: ["linapprox-over-under", "linear-approximation", "concavity", "log"],
      hints: ["(ln x)″ 的正負決定切線在曲線上方還是下方。", "不管往左還是往右估計，結論都一樣。"],
      solution: "(ln x)″=−1/x²<0，凹向下，切線在曲線上方，所以 −0.1 大於真值 ln 0.9≈−0.1054：高估。",
      solutionSteps: ["L(x)=x−1，L(0.9)=−0.1。", "(ln x)″=−1/x²<0：凹向下，切線在曲線上方。", "−0.1>ln 0.9≈−0.1054：高估。"],
      verify: { m: "choice", options: [
        { say: "高估", all: [{ v: { m: "linApprox", f: "\\ln x", a: 1, dx: -0.1 }, gt: V("\\ln 0.9") }] },
        { say: "低估", all: [{ v: { m: "linApprox", f: "\\ln x", a: 1, dx: -0.1 }, lt: V("\\ln 0.9") }] },
        { say: "剛好相等", all: [{ v: { m: "linApprox", f: "\\ln x", a: 1, dx: -0.1 }, eq: V("\\ln 0.9"), tol: 1e-9 }] }] } },
    { id: "cg-3d-002", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\text{用 }(1+x)^{10}\\text{ 在 }x=0\\text{ 的線性近似估計 }1.02^{10}\\text{，得到 }1.2\\text{。這個估計比真值大（高估）還是小（低估）？}",
      answers: ["低估", "偏低", "比真值小"], canonical: "低估", answer: "低估", distractors: ["高估", "剛好相等"], timeLimit: 50,
      tags: ["linapprox-over-under", "linear-approximation", "concavity"],
      hints: ["算 (1+x)^{10} 的二階導數，看 x=0 附近的正負。", "凹向上的曲線，切線在曲線的哪一邊？"],
      solution: "f″=90(1+x)^8>0，凹向上，切線在曲線下方，所以 1.2 小於真值 1.02^{10}≈1.219：低估。",
      solutionSteps: ["L(x)=1+10x，L(0.02)=1.2。", "f″(x)=90(1+x)^8>0：凹向上，切線在曲線下方。", "1.2<1.02^{10}≈1.219：低估。"],
      verify: { m: "choice", options: [
        { say: "低估", all: [{ v: { m: "linApprox", f: "(1+x)^{10}", a: 0, dx: 0.02 }, lt: V("1.02^{10}") }] },
        { say: "高估", all: [{ v: { m: "linApprox", f: "(1+x)^{10}", a: 0, dx: 0.02 }, gt: V("1.02^{10}") }] },
        { say: "剛好相等", all: [{ v: { m: "linApprox", f: "(1+x)^{10}", a: 0, dx: 0.02 }, eq: V("1.02^{10}"), tol: 1e-9 }] }] } },

    /* ── 3.16 微分與誤差：相對誤差、dy 與 Δy ── */
    { id: "cg-3d-003", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\text{量球的半徑時相對誤差最多 }2\\%\\text{。用微分估計：算出來的體積，相對誤差最多約百分之幾？（填數字，例如 5 代表 }5\\%\\text{）}",
      answer: "6", timeLimit: 70,
      tags: ["differential-relative-error", "differentials", STORY, "error-propagation"],
      hints: ["dV=V′(r)dr，相對誤差是 dV/V。", "把 dV/V 寫成 dr/r 的倍數。"],
      solution: "V=(4/3)πr³，dV=4πr²dr，dV/V=3·dr/r=3×2%=6%。",
      solutionSteps: ["V=(4/3)πr³，dV=4πr²·dr。", "dV/V=4πr²dr/((4/3)πr³)=3·(dr/r)。", "3×2%=6%。"],
      verify: { m: "let", f: "100\\frac{d}{W}", with: {
        d: { m: "differential", f: "\\frac{4}{3}\\pi x^3", a: 1, dx: 0.02 }, W: V("\\frac{4}{3}\\pi") } } },
    { id: "cg-3d-004", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\text{單擺週期 }T=2\\pi\\sqrt{L/g}\\text{。擺長 }L\\text{ 量錯了 }4\\%\\text{，用微分估計週期的相對誤差約百分之幾？（填數字）}",
      answer: "2", timeLimit: 70,
      tags: ["differential-relative-error", "differentials", STORY, "error-propagation"],
      hints: ["T 是 L 的 1/2 次方乘上常數。", "dT/T 是 dL/L 的幾倍？"],
      solution: "T=kL^{1/2}，dT=(1/2)kL^{−1/2}dL，dT/T=(1/2)(dL/L)=(1/2)×4%=2%。",
      solutionSteps: ["T=(2π/√g)·L^{1/2}。", "dT/T=(1/2)·dL/L。", "(1/2)×4%=2%。"],
      verify: { m: "let", f: "100\\frac{d}{W}", with: {
        d: { m: "differential", f: "2\\pi\\sqrt{x/9.8}", a: 1, dx: 0.04 }, W: V("2\\pi\\sqrt{1/9.8}") } } },
    { id: "cg-3d-005", topic: "derivatives", rank: 3, answerKind: "numeric",
      prompt: "\\text{要讓算出來的正立方體體積相對誤差不超過 }3\\%\\text{，邊長量測的相對誤差最多可以是百分之幾？（用微分估計，填數字）}",
      answer: "1", timeLimit: 80,
      tags: ["differential-relative-error", "differentials", STORY, "error-propagation"],
      hints: ["先找出 dV/V 和 dx/x 的關係。", "反過來：體積的誤差上限給定，解邊長的誤差上限。"],
      solution: "V=x³，dV/V=3·dx/x。要 3·dx/x≤3%，所以 dx/x≤1%。",
      solutionSteps: ["V=x³，dV=3x²dx，dV/V=3·(dx/x)。", "3·(dx/x)≤3%。", "dx/x≤1%。"],
      verify: { m: "let", f: "\\frac{3}{100d}", with: { d: { m: "differential", f: "x^3", a: 1, dx: 0.01 } } } },
    { id: "cg-3d-006", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "y=\\sqrt{x}\\text{，}x=16\\text{、}dx=0.5\\text{。求微分 }dy",
      answer: "1/16", timeLimit: 40,
      tags: ["differential-dy", "differentials"],
      hints: ["dy=f′(x)·dx。", "先算 f′(16)。"],
      solution: "f′(x)=1/(2√x)，f′(16)=1/8，dy=(1/8)(0.5)=1/16=0.0625。",
      solutionSteps: ["f′(x)=1/(2√x)，f′(16)=1/8。", "dy=f′(16)·dx=(1/8)·0.5=1/16。"],
      verify: { m: "differential", f: "\\sqrt{x}", a: 16, dx: 0.5 } },
    { id: "cg-3d-007", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "y=x^3\\text{，}x=2\\text{、}\\Delta x=dx=0.1\\text{。求 }\\Delta y-dy",
      answer: "0.061", timeLimit: 70,
      tags: ["differential-dy", "differentials"],
      hints: ["Δy 是真正的變化量 f(2.1)−f(2)；dy=f′(2)·dx。", "分別算出兩個數再相減。"],
      solution: "Δy=2.1³−2³=9.261−8=1.261；dy=3·2²·0.1=1.2。Δy−dy=0.061，差很小——這就是 dy≈Δy 的意思。",
      solutionSteps: ["Δy=f(2.1)−f(2)=9.261−8=1.261。", "dy=f′(2)·dx=12×0.1=1.2。", "Δy−dy=0.061。"],
      verify: { m: "let", f: "P-q", with: { P: V("2.1^3-2^3"), q: { m: "differential", f: "x^3", a: 2, dx: 0.1 } } } },

    /* ── 3.17 Rolle：數根、條件檢查 ── */
    { id: "cg-3e-001", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "x^3+4x-7=0\\quad\\text{的實根個數}",
      answer: "1", timeLimit: 60,
      tags: ["rolle-root-count", "rolle-theorem", "monotonicity"],
      hints: ["至少一個：f(0) 與 f(2) 異號，用中間值定理。", "至多一個：如果有兩個根，Rolle 定理說 f′ 在中間有零點——f′ 會是 0 嗎？"],
      solution: "f(0)=−7<0、f(2)=9>0，至少一根。若有兩根 a<b，Rolle 給 c 使 f′(c)=0，但 f′=3x²+4>0，矛盾。恰有 1 個實根。",
      solutionSteps: ["f(0)=−7<0、f(2)=9>0：中間值定理給至少一根。", "f′(x)=3x²+4>0，沒有零點。", "兩根之間 Rolle 會給 f′(c)=0，不可能：恰 1 個。"],
      verify: { m: "rootCount", f: "x^3+4x-7", range: [-10, 10] } },
    { id: "cg-3e-002", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "2x-1-\\sin x=0\\quad\\text{的實根個數}",
      answer: "1", timeLimit: 70,
      tags: ["rolle-root-count", "rolle-theorem", "trig"],
      hints: ["令 f(x)=2x−1−sin x，比較 f(0) 與 f(π) 的正負。", "f′=2−cos x 會不會等於 0？"],
      solution: "f(0)=−1<0、f(π)=2π−1>0，至少一根。f′=2−cos x≥1>0，若有兩根，Rolle 會給 f′(c)=0，矛盾。恰有 1 個實根。",
      solutionSteps: ["f(0)=−1<0、f(π)=2π−1>0：至少一根。", "f′(x)=2−cos x≥1>0。", "Rolle：兩根之間必有 f′=0，不可能，所以恰 1 個。"],
      verify: { m: "rootCount", f: "2x-1-\\sin x", range: [-10, 10] } },
    { id: "cg-3e-003", topic: "derivatives", rank: 3, answerKind: "numeric",
      prompt: "x^4-4x+1=0\\quad\\text{的實根個數}",
      answer: "2", timeLimit: 100,
      tags: ["rolle-root-count", "rolle-theorem", "polynomial"],
      hints: ["f′=4x³−4 只有一個實根；由 Rolle，f 最多有幾個根？", "再用 f(0)、f(1)、f(2) 的正負找出實際有幾個。"],
      solution: "f′=4(x³−1) 只在 x=1 為 0。若 f 有三根，Rolle 給 f′ 兩個零點，矛盾，所以至多 2 根。f(0)=1>0、f(1)=−2<0、f(2)=9>0，(0,1) 與 (1,2) 各一根：恰 2 個。",
      solutionSteps: ["f′(x)=4(x³−1)，唯一零點 x=1。", "Rolle：f 的相鄰兩根之間必有 f′ 的零點，所以 f 至多 2 根。", "f(0)=1、f(1)=−2、f(2)=9：(0,1)、(1,2) 各至少一根。", "恰 2 個實根。"],
      verify: { m: "rootCount", f: "x^4-4x+1", range: [-10, 10] } },
    { id: "cg-3e-004", topic: "derivatives", rank: 1, answerKind: "text",
      prompt: "f(x)=x^{2/3}\\text{ 在 }[-1,1]\\text{ 上 }f(-1)=f(1)\\text{，卻找不到 }c\\,\\text{ 使 }f'(c)=0\\text{。Rolle 定理的哪個條件不成立？}",
      answers: ["在 (−1, 1) 不是處處可微"], canonical: "在 (−1, 1) 不是處處可微", answer: "在 (−1, 1) 不是處處可微",
      distractors: ["在 [−1, 1] 不連續", "f(−1) ≠ f(1)"], timeLimit: 45,
      tags: ["rolle-hypothesis-check", "rolle-theorem", "radical"],
      hints: ["f(−1) 和 f(1) 各是多少？f 在 0 連續嗎？", "算 f′(x)=(2/3)x^{−1/3}，x=0 時會怎樣？"],
      solution: "f(±1)=1，f 處處連續；但 f′(x)=(2/3)x^{−1/3} 在 x=0 不存在（尖點），(−1,1) 上不是處處可微，Rolle 的條件不成立，所以不保證有 c。",
      solutionSteps: ["f(−1)=f(1)=1，第三個條件成立。", "x^{2/3} 是連續函數，第一個條件成立。", "f′(x)=(2/3)x^{−1/3} 在 x=0 不存在：可微的條件不成立。"],
      verify: { m: "choice", options: [
        { say: "在 (−1, 1) 不是處處可微", all: [{ v: { m: "limit", f: "\\frac{x}{(x^2)^{1/3}}", at: 0, dir: "+" }, eq: 0 }] },
        { say: "在 [−1, 1] 不連續", all: [{ v: { m: "limit", f: "(x^2)^{1/3}", at: 0 }, ne: 0 }] },
        { say: "f(−1) ≠ f(1)", all: [{ v: V("((-1)^2)^{1/3}-(1^2)^{1/3}"), ne: 0 }] }] } },
    { id: "cg-3e-005", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "f(x)=x\\ (0\\le x<1)\\text{，而 }f(1)=0\\text{。}f(0)=f(1)=0\\text{，但 }(0,1)\\text{ 裡沒有 }c\\,\\text{ 使 }f'(c)=0\\text{。Rolle 定理的哪個條件不成立？}",
      answers: ["在 [0, 1] 不連續"], canonical: "在 [0, 1] 不連續", answer: "在 [0, 1] 不連續",
      distractors: ["在 (0, 1) 不可微", "f(0) ≠ f(1)"], timeLimit: 50,
      tags: ["rolle-hypothesis-check", "rolle-theorem", "piecewise"],
      hints: ["在 (0,1) 裡 f(x)=x，它可微嗎？", "x→1⁻ 時 f(x) 趨近多少？和 f(1) 一樣嗎？"],
      solution: "(0,1) 上 f(x)=x，f′=1，可微；f(0)=f(1)=0 也成立。但 x→1⁻ 時 f→1≠0=f(1)，f 在 x=1 不連續，[0,1] 上連續的條件不成立。",
      solutionSteps: ["(0,1) 上 f′(x)=1，可微。", "f(0)=0=f(1)。", "lim_{x→1⁻} f(x)=1≠f(1)=0：在 x=1 不連續。"],
      verify: { m: "choice", options: [
        { say: "在 [0, 1] 不連續", all: [{ v: { m: "limit", f: "x", at: 1, dir: "-" }, ne: 0 }] },
        { say: "在 (0, 1) 不可微", all: [{ v: D("x", 0.5), ne: 1 }] },
        { say: "f(0) ≠ f(1)", all: [{ v: V("0-0"), ne: 0 }] }] } },

    /* ── 3.18 均值定理：適不適用 ── */
    { id: "cg-3e-006", topic: "derivatives", rank: 1, answerKind: "text",
      prompt: "f(x)=\\dfrac{1}{x}\\text{ 在 }[-1,1]\\text{ 上，均值定理能不能用？}",
      answers: ["不能用：f 在 x=0 不連續"], canonical: "不能用：f 在 x=0 不連續", answer: "不能用：f 在 x=0 不連續",
      distractors: ["能用：f 在 [−1, 1] 連續", "能用：因為 f(−1)=f(1)"], timeLimit: 40,
      tags: ["mvt-hypothesis-check", "mean-value-theorem"],
      hints: ["均值定理要 f 在 [a,b] 連續、在 (a,b) 可微。", "x=0 在 [−1,1] 裡面嗎？f(0) 有定義嗎？"],
      solution: "x=0 在 [−1,1] 裡，但 1/x 在 0 沒有定義、兩側趨向 ±∞，不連續，所以均值定理不能用。實際上平均斜率 (1−(−1))/2=1，而 f′=−1/x²<0，真的找不到 c。",
      solutionSteps: ["均值定理的條件：[−1,1] 連續、(−1,1) 可微。", "1/x 在 x=0 沒有定義，x→0 時趨向 ±∞：不連續。", "條件不成立，不能用（f(−1)=−1、f(1)=1 也不相等）。"],
      verify: { m: "choice", options: [
        { say: "不能用：f 在 x=0 不連續", all: [{ v: { m: "limit", f: "\\frac{1}{1/x}", at: 0 }, eq: 0 }] },
        { say: "能用：f 在 [−1, 1] 連續", all: [{ v: { m: "limit", f: "\\frac{1}{1/x}", at: 0 }, ne: 0 }] },
        { say: "能用：因為 f(−1)=f(1)", all: [{ v: V("\\frac{1}{-1}-\\frac{1}{1}"), eq: 0 }] }] } },
    { id: "cg-3e-007", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\text{下列哪個函數在 }[-1,2]\\text{ 上滿足均值定理的所有條件？}",
      answers: ["x²", "x^2"], canonical: "x²", answer: "x²", distractors: ["|x|", "x^(2/3)", "1/x"], timeLimit: 60,
      tags: ["mvt-hypothesis-check", "mean-value-theorem", "absolute-value"],
      hints: ["每個候選都檢查 x=0：連續嗎？可微嗎？", "均值定理不要求 f(−1)=f(2)。"],
      solution: "均值定理只要 [−1,2] 連續、(−1,2) 可微。|x| 在 0 有尖角、x^{2/3} 在 0 有尖點，都不可微；1/x 在 0 不連續。只有 x² 符合，c=1/2。",
      solutionSteps: ["|x|：0 處左右斜率 −1、1，不可微。", "x^{2/3}：f′=(2/3)x^{−1/3} 在 0 不存在。", "1/x：0 處沒有定義，不連續。", "x² 符合：平均斜率 (4−1)/3=1=2c，c=1/2。"],
      verify: { m: "choice", options: [
        { say: "x²", all: [
          { v: { m: "limit", f: "\\frac{x^2}{x}", at: 0, dir: "+" }, eq: { m: "limit", f: "\\frac{x^2}{x}", at: 0, dir: "-" } },
          { v: { m: "mvtPoint", f: "x^2", a: -1, b: 2 }, eq: 0.5 }] },
        { say: "|x|", all: [{ v: { m: "limit", f: "\\frac{|x|}{x}", at: 0, dir: "+" }, eq: { m: "limit", f: "\\frac{|x|}{x}", at: 0, dir: "-" } }] },
        { say: "x^(2/3)", all: [{ v: { m: "limit", f: "\\frac{x}{(x^2)^{1/3}}", at: 0, dir: "+" }, ne: 0 }] },
        { say: "1/x", all: [{ v: { m: "limit", f: "\\frac{1}{1/x}", at: 0 }, ne: 0 }] }] } },

    /* ── 3.19 L'Hôpital：先檢查型式、f′/g′ 沒有極限 ── */
    { id: "cg-3e-008", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\lim_{x\\to 0}\\frac{e^x+1}{x+1}",
      answer: "2", timeLimit: 30,
      tags: ["lhopital-check-form", "lhopital", "direct-substitution"],
      hints: ["先把 x=0 直接代進分子和分母。", "不是 0/0 也不是 ∞/∞，就不能用 L'Hôpital。"],
      solution: "代入：分子 e⁰+1=2、分母 1，不是不定型，極限就是 2。誤用 L'Hôpital 會得到 e⁰/1=1，是錯的。",
      solutionSteps: ["x=0：分子 2、分母 1。", "不是不定型，直接代入：2/1=2。"] },
    { id: "cg-3e-009", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to\\pi}\\frac{\\sin x}{1-\\cos x}",
      answer: "0", timeLimit: 45,
      tags: ["lhopital-check-form", "lhopital", "trig", "direct-substitution"],
      hints: ["x=π 時 sin π 與 cos π 各是多少？", "分母不是 0 的話，可以直接代入。"],
      solution: "sin π=0、1−cos π=2，是 0/2 不是 0/0，極限 0。誤用 L'Hôpital 會變成 cos x/sin x→−1/0，得到錯的結論。",
      solutionSteps: ["分子 sin π=0，分母 1−cos π=1−(−1)=2。", "0/2=0，不是不定型，答案 0。"] },
    { id: "cg-3e-010", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to\\infty}\\frac{2x+\\sin x}{x}",
      answer: "2", timeLimit: 50,
      tags: ["lhopital-inconclusive", "lhopital", "squeeze", "trig"],
      hints: ["用 L'Hôpital 會得到 2+cos x，它在 x→∞ 時有極限嗎？", "改成分項：2+(sin x)/x，再用 |sin x|≤1。"],
      solution: "L'Hôpital 得 (2+cos x)/1，沒有極限，但這不代表原極限不存在。直接拆開：2+(sin x)/x，|sin x/x|≤1/x→0，所以極限是 2。",
      solutionSteps: ["L'Hôpital 後 2+cos x 一直擺盪，法則說不出結論。", "(2x+sin x)/x=2+(sin x)/x。", "|sin x|/x≤1/x→0，極限 2。"],
      // x→∞ 的振盪數列外插不穩；換元 x=1/t（只代換、不化簡）後在 t→0⁺ 走夾擠
      verify: { m: "limit", f: "\\frac{2/x+\\sin(1/x)}{1/x}", at: 0, dir: "+" } },
    { id: "cg-3e-011", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "\\lim_{x\\to 0}\\frac{x^2\\sin(1/x)}{\\sin x}",
      answer: "0", timeLimit: 90,
      tags: ["lhopital-inconclusive", "lhopital", "squeeze", "trig"],
      hints: ["L'Hôpital 後分子會出現 cos(1/x)，它在 x→0 時有極限嗎？", "改寫成 (x/sin x)·(x sin(1/x))，兩個因式分別看。"],
      solution: "L'Hôpital 得 (2x sin(1/x)−cos(1/x))/cos x，沒有極限，法則失效。改寫：(x/sin x)·x sin(1/x)，前者→1，|x sin(1/x)|≤|x|→0，極限 0。",
      solutionSteps: ["L'Hôpital 後出現 cos(1/x)，擺盪，說不出結論。", "原式=(x/sin x)·(x sin(1/x))。", "x/sin x→1，|x sin(1/x)|≤|x|→0，極限 0。"] },

    /* ── 3.20 其他不定型：∞⁰、通分型 ∞−∞ ── */
    { id: "cg-3e-012", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "\\lim_{x\\to\\infty}\\left(x^2+1\\right)^{1/\\ln x}",
      answer: "e^2", timeLimit: 100,
      tags: ["indeterminate-inf-pow-zero", "indeterminate-take-log", "lhopital"],
      hints: ["底數→∞、指數→0：∞⁰ 型，先取 ln。", "ln y=ln(x²+1)/ln x 是 ∞/∞ 型。"],
      solution: "ln y=ln(x²+1)/ln x，L'Hôpital：(2x/(x²+1))/(1/x)=2x²/(x²+1)→2，所以極限是 e²。",
      solutionSteps: ["y=(x²+1)^{1/ln x}，ln y=ln(x²+1)/ln x（∞/∞）。", "L'Hôpital：(2x/(x²+1))·x=2x²/(x²+1)→2。", "ln y→2，y→e²。"] },
    { id: "cg-3e-013", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to 0^+}\\left(\\frac{1}{x}\\right)^{\\tan x}",
      answer: "1", timeLimit: 80,
      tags: ["indeterminate-inf-pow-zero", "indeterminate-take-log", "trig"],
      hints: ["底數→∞、指數→0：取 ln 變成 tan x·ln(1/x)=−tan x·ln x。", "tan x 和 x 在 0 附近差不多；x ln x→0。"],
      solution: "ln y=tan x·ln(1/x)=−(tan x/x)·(x ln x)。tan x/x→1、x ln x→0，所以 ln y→0，極限 e⁰=1。",
      solutionSteps: ["ln y=−tan x·ln x=−(tan x/x)·(x ln x)。", "tan x/x→1，x ln x→0。", "ln y→0，y→1。"] },
    { id: "cg-3e-014", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to 3}\\left(\\frac{1}{x-3}-\\frac{6}{x^2-9}\\right)",
      answer: "1/6", timeLimit: 60,
      tags: ["indeterminate-inf-minus-inf", "common-denominator", "factoring"],
      hints: ["x²−9=(x−3)(x+3)，通分成同一個分母。", "分子化簡後會出現 (x−3)，可以約掉。"],
      solution: "通分：((x+3)−6)/((x−3)(x+3))=(x−3)/((x−3)(x+3))=1/(x+3)→1/6。",
      solutionSteps: ["通分：((x+3)−6)/((x−3)(x+3))。", "分子 x−3，約掉得 1/(x+3)。", "x→3：1/6。"] },
    { id: "cg-3e-015", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to 0}\\left(\\frac{1}{x}-\\frac{2}{x^2+2x}\\right)",
      answer: "1/2", timeLimit: 55,
      tags: ["indeterminate-inf-minus-inf", "common-denominator", "factoring"],
      hints: ["x²+2x=x(x+2)，通分。", "分子化簡後可以和分母約掉一個 x。"],
      solution: "通分：((x+2)−2)/(x(x+2))=x/(x(x+2))=1/(x+2)→1/2。",
      solutionSteps: ["通分：((x+2)−2)/(x(x+2))。", "=x/(x(x+2))=1/(x+2)。", "x→0：1/2。"] }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE,
    difficulty: Math.min(4, problem.rank),
    ...problem
  })));
})();
