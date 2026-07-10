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
    "\\text{同上彈簧（k=200 N/m），從伸長 0.1 m 拉到 0.3 m 的功（J）}", "8",
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

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
