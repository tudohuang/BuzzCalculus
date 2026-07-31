(function () {
  "use strict";

  // 理科秒殺包（2026-07）：物理 ph- / 化學 ch-
  // 定位：不是微積分題，而是「一看到公式就該反射出答案」的速算題。
  // 主站仍主攻微積分，所以這些題只在選了「物理 / 化學」題型或理科訓練包時才會抽到
  // （app.js 的 SCIENCE_TOPICS 閘門），不會混進快速訓練、每日挑戰、大考模式或每週卷。
  // 常數一律寫進題幹（g=10、c=3×10⁸、k=9×10⁹、R=0.082、原子量），答案才會是唯一精確值。
  const SOURCE = "Buzz science flash pack";
  const problems = [];

  function add(problem) {
    const rank = problem.rank;
    const subject = problem.topic === "physics" ? "physics-flash" : "chem-flash";
    const tags = [...(problem.tags || []), "science-flash", subject, `rank-${rank}`];
    if (rank <= 2) tags.push("beginner-friendly");
    problems.push({
      source: SOURCE,
      difficulty: Math.min(4, rank),
      tabLimit: 1,
      answerKind: "numeric",
      ...problem,
      tags
    });
  }

  function phy(id, rank, prompt, answer, tags, solution, timeLimit) {
    add({ id, topic: "physics", rank, prompt, answer, tags, solution, timeLimit });
  }

  function chem(id, rank, prompt, answer, tags, solution, timeLimit) {
    add({ id, topic: "chemistry", rank, prompt, answer, tags, solution, timeLimit });
  }

  // 背誦型題（沉澱表 / 氧化還原角色 / 熱力學過程）：答案是分類而不是數字，
  // 誘答一定要自己帶——選擇題若從題庫抓同型答案，只會給出微積分式的選項。
  function recall(id, topic, rank, prompt, answers, distractors, tags, solution, timeLimit) {
    add({
      id,
      topic,
      rank,
      prompt,
      answerKind: "text",
      answers,
      canonical: answers[0],
      distractors,
      tags,
      solution,
      timeLimit
    });
  }

  // ==================== 物理：運動學 ====================
  phy("ph-kin-001", 1,
    "g=10\\ \\text{m/s}^2\\text{，靜止自由落下 }3\\ \\text{s 的速率（m/s）}", "30",
    ["kinematics"], "v = gt = 10×3 = 30。", 25);
  phy("ph-kin-002", 1,
    "g=10\\ \\text{m/s}^2\\text{，靜止自由落下 }5\\ \\text{s 的下落距離（m）}", "125",
    ["kinematics"], "h = ½gt² = ½·10·25 = 125。", 30);
  phy("ph-kin-003", 2,
    "\\text{以 }20\\ \\text{m/s 鉛直上拋（}g=10\\text{），回到原高度的總時間（s）}", "4",
    ["kinematics"], "上升 t = v₀/g = 2 s，來回對稱共 4 s。", 30);
  phy("ph-kin-004", 2,
    "v_0=4\\ \\text{m/s},\\ a=2\\ \\text{m/s}^2\\text{，}t=3\\ \\text{s 的位移（m）}", "21",
    ["kinematics"], "s = v₀t + ½at² = 12 + 9 = 21。", 35);
  phy("ph-kin-005", 1,
    "72\\ \\text{km/h 換算成 m/s}", "20",
    ["unit-conversion"], "÷3.6：72/3.6 = 20。", 20);
  phy("ph-kin-006", 2,
    "\\text{靜止起以 }a=5\\ \\text{m/s}^2\\text{ 前進 }10\\ \\text{m 時的速率（m/s）}", "10",
    ["kinematics"], "v² = 2as = 2·5·10 = 100 → v = 10。", 30);
  phy("ph-kin-007", 2,
    "\\text{從 }20\\ \\text{m 高處水平拋出（}g=10\\text{），落地所需時間（s）}", "2",
    ["projectile"], "鉛直方向自由落體：20 = ½·10·t² → t = 2。", 30);
  phy("ph-kin-008", 3,
    "\\text{從 }20\\ \\text{m 高處以 }15\\ \\text{m/s 水平拋出（}g=10\\text{），水平射程（m）}", "30",
    ["projectile"], "落地 t = 2 s，水平等速：x = 15×2 = 30。", 40);
  phy("ph-kin-009", 3,
    "\\text{去程 }60\\ \\text{km/h、原路返回 }30\\ \\text{km/h，全程平均速率（km/h）}", "40",
    ["kinematics", "average-rate"], "調和平均：2·60·30/(60+30) = 40，不是 45。", 45);
  phy("ph-kin-010", 2,
    "108\\ \\text{km/h 的車 }5\\ \\text{s 內煞停，平均加速度大小（m/s}^2\\text{）}", "6",
    ["kinematics"], "108 km/h = 30 m/s，|a| = 30/5 = 6。", 35);

  // ==================== 物理：牛頓力學 ====================
  phy("ph-dyn-001", 1,
    "m=4\\ \\text{kg},\\ a=3\\ \\text{m/s}^2\\text{，合力（N）}", "12",
    ["newton-law"], "F = ma = 12。", 20);
  phy("ph-dyn-002", 2,
    "\\text{靜止的 }2\\ \\text{kg 物體受合力 }10\\ \\text{N，}5\\ \\text{s 後的速率（m/s）}", "25",
    ["newton-law"], "a = 5 m/s²，v = at = 25。", 30);
  phy("ph-dyn-003", 2,
    "\\mu=0.2,\\ m=5\\ \\text{kg},\\ g=10\\text{，水平面上的動摩擦力（N）}", "10",
    ["friction"], "f = μmg = 0.2·5·10 = 10。", 30);
  phy("ph-dyn-004", 2,
    "\\text{光滑 }30^{\\circ}\\text{ 斜面上 }2\\ \\text{kg 物體（}g=10\\text{），沿斜面的下滑力（N）}", "10",
    ["inclined-plane"], "mg sin30° = 2·10·0.5 = 10。", 35);
  phy("ph-dyn-005", 2,
    "\\text{彈簧 }k=200\\ \\text{N/m，壓縮 }0.05\\ \\text{m 時的彈力（N）}", "10",
    ["hooke-law"], "F = kx = 200·0.05 = 10。", 25);
  phy("ph-dyn-006", 3,
    "\\text{電梯以 }a=2\\ \\text{m/s}^2\\text{ 加速上升，}50\\ \\text{kg 的人受地板正向力（}g=10\\text{，N）}", "600",
    ["newton-law", "apparent-weight"], "N − mg = ma → N = m(g+a) = 50·12 = 600。", 45);
  phy("ph-dyn-007", 2,
    "\\text{等速圓周 }v=10\\ \\text{m/s},\\ r=5\\ \\text{m，向心加速度（m/s}^2\\text{）}", "20",
    ["circular-motion"], "a = v²/r = 100/5 = 20。", 30);
  phy("ph-dyn-008", 3,
    "m=2\\ \\text{kg 以 }v=10\\ \\text{m/s 繞 }r=4\\ \\text{m 圓周運動，向心力（N）}", "50",
    ["circular-motion"], "F = mv²/r = 2·100/4 = 50。", 35);

  // ==================== 物理：動量 ====================
  phy("ph-mom-001", 1,
    "m=3\\ \\text{kg},\\ v=4\\ \\text{m/s，動量（kg}\\cdot\\text{m/s）}", "12",
    ["momentum"], "p = mv = 12。", 20);
  phy("ph-mom-002", 2,
    "2\\ \\text{kg 物體由 }5\\ \\text{m/s 變成 }15\\ \\text{m/s，所受衝量（N}\\cdot\\text{s）}", "20",
    ["impulse"], "J = Δp = 2(15−5) = 20。", 30);
  phy("ph-mom-003", 3,
    "4\\ \\text{kg 以 }6\\ \\text{m/s 撞上靜止的 }2\\ \\text{kg 並黏合，共同速率（m/s）}", "4",
    ["momentum", "collision"], "動量守恆：24 = 6v → v = 4。", 45);
  phy("ph-mom-004", 3,
    "\\text{靜止的 }6\\ \\text{kg 炸成 }2\\ \\text{kg（}9\\ \\text{m/s）與 }4\\ \\text{kg，後者速率（m/s）}", "4.5",
    ["momentum", "collision"], "0 = 2·9 − 4v → v = 4.5。", 50);
  phy("ph-mom-005", 2,
    "\\text{靜止的 }2\\ \\text{kg 受 }20\\ \\text{N 作用 }0.5\\ \\text{s，末速（m/s）}", "5",
    ["impulse"], "Ft = mv → 10 = 2v → v = 5。", 30);

  // ==================== 物理：功與能量 ====================
  phy("ph-nrg-001", 1,
    "m=4\\ \\text{kg},\\ v=5\\ \\text{m/s，動能（J）}", "50",
    ["kinetic-energy"], "½mv² = ½·4·25 = 50。", 25);
  phy("ph-nrg-002", 1,
    "m=2\\ \\text{kg 升高 }10\\ \\text{m（}g=10\\text{），位能增加量（J）}", "200",
    ["potential-energy"], "mgh = 2·10·10 = 200。", 25);
  phy("ph-nrg-003", 1,
    "\\text{做 }600\\ \\text{J 的功花 }3\\ \\text{s，平均功率（W）}", "200",
    ["power"], "P = W/t = 200。", 25);
  phy("ph-nrg-004", 2,
    "\\text{自由落下 }20\\ \\text{m 落地時的速率（}g=10\\text{，m/s）}", "20",
    ["energy-conservation"], "½v² = gh → v = √(2·10·20) = 20。", 35);
  phy("ph-nrg-005", 2,
    "\\text{彈簧 }k=400\\ \\text{N/m 伸長 }0.1\\ \\text{m 儲存的彈力位能（J）}", "2",
    ["potential-energy", "hooke-law"], "½kx² = ½·400·0.01 = 2。", 35);
  phy("ph-nrg-006", 2,
    "\\text{以 }10\\ \\text{N 的力、與位移夾 }60^{\\circ}\\text{ 拉動 }5\\ \\text{m 所做的功（J）}", "25",
    ["work"], "W = Fd cos60° = 10·5·0.5 = 25。", 35);
  phy("ph-nrg-007", 3,
    "\\text{輸入 }500\\ \\text{W、輸出 }400\\ \\text{W 的機器效率（}\\%\\text{）}", "80",
    ["efficiency"], "400/500 = 0.8 → 80%。", 30);
  phy("ph-nrg-008", 3,
    "60\\ \\text{kg 的人 }10\\ \\text{s 爬上 }5\\ \\text{m（}g=10\\text{），平均功率（W）}", "300",
    ["power"], "W = mgh = 3000 J，P = 3000/10 = 300。", 45);

  // ==================== 物理：振動與波 ====================
  phy("ph-wav-001", 2,
    "\\text{單擺 }L=2.5\\ \\text{m（}g=10\\text{），週期 }T=2\\pi\\sqrt{L/g}\\ \\text{（s）}", "pi",
    ["oscillation"], "√(2.5/10) = 0.5，T = 2π·0.5 = π。", 40);
  phy("ph-wav-002", 3,
    "\\text{彈簧振子 }m=1\\ \\text{kg},\\ k=100\\ \\text{N/m，}T=2\\pi\\sqrt{m/k}\\ \\text{（s）}", "pi/5",
    ["oscillation"], "√(1/100) = 0.1，T = 2π/10 = π/5。", 45);
  phy("ph-wav-003", 1,
    "f=50\\ \\text{Hz},\\ \\lambda=4\\ \\text{m，波速（m/s）}", "200",
    ["wave"], "v = fλ = 200。", 20);
  phy("ph-wav-004", 2,
    "\\text{聲速 }340\\ \\text{m/s，}f=170\\ \\text{Hz 的波長（m）}", "2",
    ["wave"], "λ = v/f = 340/170 = 2。", 25);
  phy("ph-wav-005", 1,
    "f=250\\ \\text{Hz 的週期（s）}", "0.004",
    ["wave"], "T = 1/f = 0.004。", 20);
  phy("ph-wav-006", 3,
    "\\text{兩端固定、長 }1.2\\ \\text{m 的弦，基音波長（m）}", "2.4",
    ["wave", "standing-wave"], "基音只有半個波長在弦上：λ = 2L = 2.4。", 45);

  // ==================== 物理：光學 ====================
  phy("ph-opt-001", 2,
    "\\text{凸透鏡 }f=10\\ \\text{cm，物距 }15\\ \\text{cm，像距（cm）}", "30",
    ["optics", "lens"], "1/q = 1/10 − 1/15 = 1/30 → q = 30。", 45);
  phy("ph-opt-002", 2,
    "\\text{光在介質中速率 }2\\times 10^{8}\\ \\text{m/s（}c=3\\times 10^{8}\\text{），折射率}", "1.5",
    ["optics", "refraction"], "n = c/v = 3/2 = 1.5。", 30);
  phy("ph-opt-003", 3,
    "\\text{折射率 }2\\text{ 的介質對空氣的全反射臨界角（度）}", "30",
    ["optics", "refraction"], "sinθc = 1/n = 0.5 → θc = 30°。", 45);
  phy("ph-opt-004", 2,
    "\\text{站在平面鏡前 }2\\ \\text{m，人與自己的像相距（m）}", "4",
    ["optics", "mirror"], "像在鏡後 2 m，總距離 4 m。", 30);

  // ==================== 物理：電學 ====================
  phy("ph-ele-001", 1,
    "I=2\\ \\text{A},\\ R=5\\ \\Omega\\text{，電壓（V）}", "10",
    ["ohm-law"], "V = IR = 10。", 20);
  phy("ph-ele-002", 2,
    "3\\ \\Omega\\text{ 與 }6\\ \\Omega\\text{ 並聯的等效電阻（}\\Omega\\text{）}", "2",
    ["circuit"], "(3·6)/(3+6) = 2。", 30);
  phy("ph-ele-003", 1,
    "110\\ \\text{V 下通過 }2\\ \\text{A 的電功率（W）}", "220",
    ["power", "circuit"], "P = VI = 220。", 20);
  phy("ph-ele-004", 1,
    "3\\ \\text{A 電流通過 }10\\ \\text{s 的電量（C）}", "30",
    ["circuit"], "Q = It = 30。", 20);
  phy("ph-ele-005", 3,
    "k=9\\times 10^{9}\\text{，兩個 }1\\ \\mu\\text{C 點電荷相距 }3\\ \\text{m 的靜電力（N）}", "0.001",
    ["coulomb-law"], "F = kq²/r² = 9×10⁹·10⁻¹²/9 = 10⁻³。", 55);
  phy("ph-ele-006", 2,
    "C=5\\ \\mu\\text{F 接上 }12\\ \\text{V，所帶電量（}\\mu\\text{C）}", "60",
    ["capacitor"], "Q = CV = 5·12 = 60 μC。", 30);
  phy("ph-ele-007", 3,
    "2000\\ \\text{W 的電器用 }1.5\\ \\text{小時，耗電（度，即 kWh）}", "3",
    ["power", "unit-conversion"], "2 kW × 1.5 h = 3 kWh。", 35);

  // ==================== 物理：熱學與近代 ====================
  phy("ph-thm-001", 1,
    "27\\ ^{\\circ}\\text{C 換算成絕對溫度（K）}", "300",
    ["thermal"], "T = 27 + 273 = 300。", 20);
  phy("ph-thm-002", 2,
    "200\\ \\text{g 水（比熱 }1\\ \\text{cal/g}\\cdot^{\\circ}\\text{C）升溫 }15\\ ^{\\circ}\\text{C 需的熱量（cal）}", "3000",
    ["thermal"], "Q = mcΔT = 200·1·15 = 3000。", 35);
  phy("ph-thm-003", 3,
    "100\\ \\text{g 的 }80\\ ^{\\circ}\\text{C 水與 }100\\ \\text{g 的 }20\\ ^{\\circ}\\text{C 水混合後的溫度（}^{\\circ}\\text{C）}", "50",
    ["thermal", "equilibrium"], "等質量同物質取平均：(80+20)/2 = 50。", 45);
  phy("ph-thm-004", 2,
    "\\text{等溫下 }2\\ \\text{atm}\\cdot 3\\ \\text{L 的氣體膨脹到 }6\\ \\text{L，壓力（atm）}", "1",
    ["gas-law"], "P₁V₁ = P₂V₂：6 = 6P → P = 1。", 35);
  phy("ph-thm-005", 2,
    "\\text{功函數 }2\\ \\text{eV 的金屬被 }5\\ \\text{eV 光子照射，光電子最大動能（eV）}", "3",
    ["modern-physics", "photoelectric"], "K = hf − W = 5 − 2 = 3。", 35);
  phy("ph-thm-006", 3,
    "\\text{氫原子 }E_n=-13.6/n^2\\ \\text{eV，}n=2\\ \\text{的能量（eV）}", "-3.4",
    ["modern-physics", "bohr-model"], "−13.6/4 = −3.4。", 35);
  phy("ph-thm-007", 3,
    "\\text{半衰期 }8\\ \\text{天的核種 }32\\ \\text{g，經過 }24\\ \\text{天後剩（g）}", "4",
    ["modern-physics", "half-life"], "3 個半衰期：32 → 16 → 8 → 4。", 40);

  // ==================== 物理：流體與壓力 ====================
  phy("ph-flu-001", 1,
    "270\\ \\text{g 佔 }100\\ \\text{cm}^3\\text{，密度（g/cm}^3\\text{）}", "2.7",
    ["density"], "ρ = m/V = 2.7。", 25);
  phy("ph-flu-002", 1,
    "200\\ \\text{N 壓在 }0.5\\ \\text{m}^2\\text{ 上的壓力（Pa）}", "400",
    ["pressure"], "P = F/A = 400。", 25);
  phy("ph-flu-003", 2,
    "\\text{水面下 }2\\ \\text{m 的水壓（}\\rho=1000,\\ g=10\\text{，Pa）}", "20000",
    ["pressure"], "P = ρgh = 1000·10·2 = 20000。", 35);
  phy("ph-flu-004", 3,
    "\\text{體積 }0.002\\ \\text{m}^3\\text{ 的物體全浸入水中的浮力（}\\rho=1000,\\ g=10\\text{，N）}", "20",
    ["buoyancy"], "F = ρgV = 1000·10·0.002 = 20。", 45);
  phy("ph-flu-005", 3,
    "\\text{帕斯卡原理：小活塞 }0.01\\ \\text{m}^2\\text{ 施 }50\\ \\text{N，大活塞 }0.1\\ \\text{m}^2\\text{ 的力（N）}", "500",
    ["pressure", "pascal-law"], "壓力相同 5000 Pa，F = 5000·0.1 = 500。", 50);

  // ==================== 物理：轉動 ====================
  // 轉動慣量一律寫成 I=kMR²（或 kML²）問係數 k：背起來的表就是拿來秒答的。
  phy("ph-rot-001", 2,
    "\\text{均勻圓盤繞中心垂直軸 }I=k\,M\,R^2\\text{，}k=?", "1/2",
    ["rotation", "moment-of-inertia"], "圓盤（實心圓柱）繞中心軸：I = ½MR²。", 30);
  phy("ph-rot-002", 2,
    "\\text{薄圓環（薄圓筒）繞中心軸 }I=k\,M\,R^2\\text{，}k=?", "1",
    ["rotation", "moment-of-inertia"], "質量全在半徑 R 上：I = MR²。", 30);
  phy("ph-rot-003", 3,
    "\\text{均勻實心球繞直徑 }I=k\,M\,R^2\\text{，}k=?", "2/5",
    ["rotation", "moment-of-inertia"], "實心球：I = (2/5)MR²。", 35);
  phy("ph-rot-004", 3,
    "\\text{薄球殼繞直徑 }I=k\,M\,R^2\\text{，}k=?", "2/3",
    ["rotation", "moment-of-inertia"], "球殼：I = (2/3)MR²，比實心球大。", 35);
  phy("ph-rot-005", 3,
    "\\text{細長棒繞中心且垂直棒身 }I=k\,M\,L^2\\text{，}k=?", "1/12",
    ["rotation", "moment-of-inertia"], "繞質心：I = ML²/12。", 35);
  phy("ph-rot-006", 3,
    "\\text{細長棒繞一端且垂直棒身 }I=k\,M\,L^2\\text{，}k=?", "1/3",
    ["rotation", "moment-of-inertia"], "平行軸：ML²/12 + M(L/2)² = ML²/3。", 40);
  phy("ph-rot-007", 3,
    "M=3\\ \\text{kg},\\ L=2\\ \\text{m 的細棒繞一端轉動的轉動慣量（kg}\\cdot\\text{m}^2\\text{）}", "4",
    ["rotation", "moment-of-inertia", "parallel-axis"], "ML²/3 = 3·4/3 = 4。", 45);
  phy("ph-rot-008", 2,
    "\\tau=I\\alpha\\text{：}I=2\\ \\text{kg}\\cdot\\text{m}^2,\\ \\alpha=3\\ \\text{rad/s}^2\\text{，力矩（N}\\cdot\\text{m）}", "6",
    ["rotation", "torque"], "τ = Iα = 6。", 30);
  phy("ph-rot-009", 2,
    "I=4\\ \\text{kg}\\cdot\\text{m}^2,\\ \\omega=3\\ \\text{rad/s，轉動動能（J）}", "18",
    ["rotation", "kinetic-energy"], "½Iω² = ½·4·9 = 18。", 35);
  phy("ph-rot-010", 2,
    "I=5\\ \\text{kg}\\cdot\\text{m}^2,\\ \\omega=4\\ \\text{rad/s，角動量（kg}\\cdot\\text{m}^2\\text{/s）}", "20",
    ["rotation", "angular-momentum"], "L = Iω = 20。", 30);
  phy("ph-rot-011", 3,
    "\\text{花式滑冰收手使 }I\\ \\text{減半（無外力矩），角速度變原來的幾倍}", "2",
    ["rotation", "angular-momentum"], "Iω 守恆，I 減半 → ω 加倍。", 40);
  phy("ph-rot-012", 2,
    "\\text{純滾動 }v=\\omega r\\text{：}\\omega=10\\ \\text{rad/s},\\ r=0.3\\ \\text{m，質心速率（m/s）}", "3",
    ["rotation", "rolling"], "v = ωr = 3。", 30);

  // ==================== 物理：熱力學過程 ====================
  phy("ph-thd-001", 2,
    "\\text{理想氣體等溫過程的 }\\Delta U\\ \\text{（J）}", "0",
    ["thermodynamics", "first-law"], "理想氣體內能只看溫度，等溫 → ΔU = 0。", 30);
  phy("ph-thd-002", 2,
    "\\text{絕熱過程中系統吸收的熱量 }Q\\ \\text{（J）}", "0",
    ["thermodynamics", "first-law"], "絕熱的定義就是 Q = 0，此時 ΔU = −W。", 30);
  phy("ph-thd-003", 2,
    "\\text{等容過程中氣體對外作的功 }W\\ \\text{（J）}", "0",
    ["thermodynamics", "first-law"], "W = PΔV，體積不變 → W = 0，Q 全變內能。", 30);
  phy("ph-thd-004", 2,
    "\\Delta U=Q-W\\text{：吸熱 }500\\ \\text{J、對外作功 }200\\ \\text{J，}\\Delta U\\ \\text{（J）}", "300",
    ["thermodynamics", "first-law"], "500 − 200 = 300。", 35);
  phy("ph-thd-005", 2,
    "\\text{等壓 }W=P\\,\\Delta V\\text{，}\\quad P=2\\times 10^{5}\\ \\text{Pa},\\ \\Delta V=0.01\\ \\text{m}^3\\text{，功（J）}", "2000",
    ["thermodynamics"], "2×10⁵ × 0.01 = 2000 J。", 40);
  phy("ph-thd-006", 3,
    "\\text{卡諾熱機 }T_h=400\\ \\text{K},\\ T_c=300\\ \\text{K 的效率}", "0.25",
    ["thermodynamics", "carnot"], "η = 1 − Tc/Th = 1 − 0.75 = 0.25。", 45);
  phy("ph-thd-007", 3,
    "\\text{卡諾熱機 }T_h=600\\ \\text{K、效率 }0.5\\text{，低溫熱庫溫度（K）}", "300",
    ["thermodynamics", "carnot"], "Tc = Th(1−η) = 600·0.5 = 300。", 50);
  phy("ph-thd-008", 3,
    "\\text{熱機每循環吸熱 }800\\ \\text{J、放熱 }600\\ \\text{J，效率（}\\%\\text{）}", "25",
    ["thermodynamics", "efficiency"], "W = 200 J，η = 200/800 = 25%。", 45);
  phy("ph-thd-009", 2,
    "\\text{熱機每循環吸熱 }500\\ \\text{J、放熱 }300\\ \\text{J，對外作功（J）}", "200",
    ["thermodynamics", "first-law"], "循環一圈 ΔU = 0 → W = Q吸 − Q放 = 200。", 35);
  phy("ph-thd-010", 2,
    "\\text{單原子理想氣體 }C_V=kR\\text{，}k=?", "3/2",
    ["thermodynamics", "heat-capacity"], "每個自由度 ½R，單原子 3 個平動自由度。", 40);
  phy("ph-thd-011", 2,
    "\\text{單原子理想氣體 }C_P=kR\\text{，}k=?", "5/2",
    ["thermodynamics", "heat-capacity"], "Cp = Cv + R = 3R/2 + R。", 40);
  phy("ph-thd-012", 3,
    "\\text{單原子理想氣體的 }\\gamma=C_P/C_V", "5/3",
    ["thermodynamics", "heat-capacity"], "(5R/2)/(3R/2) = 5/3 ≈ 1.67。", 40);
  phy("ph-thd-013", 3,
    "\\text{常溫雙原子理想氣體 }C_V=kR\\text{，}k=?", "5/2",
    ["thermodynamics", "heat-capacity"], "3 平動 + 2 轉動 = 5 個自由度 → 5R/2。", 45);
  phy("ph-thd-014", 3,
    "1\\ \\text{mol 單原子理想氣體由 }300\\ \\text{K 升到 }400\\ \\text{K，}\\Delta U=kR\\text{，}k=?", "150",
    ["thermodynamics", "heat-capacity"], "ΔU = (3/2)nRΔT = 1.5·100·R = 150R。", 50);
  recall("ph-thd-015", "physics", 2,
    "\\text{氣體被快速壓縮、來不及與外界交換熱量，屬於哪種過程}",
    ["絕熱過程", "絕熱"], ["等溫過程", "等壓過程", "等容過程"],
    ["thermodynamics", "process-id"], "來不及交換熱 → Q = 0，是絕熱過程。", 35);
  recall("ph-thd-016", "physics", 2,
    "P\\,V\\ \\text{圖上一條水平線代表的過程}",
    ["等壓過程", "等壓"], ["等溫過程", "等容過程", "絕熱過程"],
    ["thermodynamics", "process-id"], "壓力不變 → 等壓；面積 PΔV 就是功。", 35);
  recall("ph-thd-017", "physics", 2,
    "P\\,V\\ \\text{圖上一條鉛直線代表的過程}",
    ["等容過程", "等容", "等體積過程"], ["等溫過程", "等壓過程", "絕熱過程"],
    ["thermodynamics", "process-id"], "體積不變 → 等容，W = 0。", 35);
  recall("ph-thd-018", "physics", 3,
    "P\\,V=\\text{定值 的雙曲線代表的過程}",
    ["等溫過程", "等溫"], ["等壓過程", "等容過程", "絕熱過程"],
    ["thermodynamics", "process-id"], "PV = nRT，PV 固定 → 溫度固定 → 等溫。", 40);

  // ==================== 化學：莫耳 ====================
  chem("ch-mol-001", 1,
    "\\text{水 }\\text{H}_2\\text{O}\\text{ 的莫耳質量（}\\text{H}=1,\\ \\text{O}=16\\text{，g/mol）}", "18",
    ["mole"], "2·1 + 16 = 18。", 25);
  chem("ch-mol-002", 1,
    "36\\ \\text{g 水的莫耳數（}M=18\\text{）}", "2",
    ["mole"], "36/18 = 2。", 25);
  chem("ch-mol-003", 2,
    "2\\ \\text{mol }\\text{CO}_2\\text{ 的質量（}\\text{C}=12,\\ \\text{O}=16\\text{，g）}", "88",
    ["mole"], "M = 44，2·44 = 88。", 30);
  chem("ch-mol-004", 1,
    "\\text{標準狀態下 }1\\ \\text{mol 氣體的體積（L）}", "22.4",
    ["mole", "gas-law"], "STP 莫耳體積 22.4 L。", 20);
  chem("ch-mol-005", 2,
    "\\text{標準狀態下 }11.2\\ \\text{L 氧氣的莫耳數}", "0.5",
    ["mole", "gas-law"], "11.2/22.4 = 0.5。", 25);
  chem("ch-mol-006", 2,
    "0.5\\ \\text{mol }\\text{H}_2\\text{O}\\text{ 含氫原子幾莫耳}", "1",
    ["mole"], "每分子 2 個 H：0.5×2 = 1。", 30);
  chem("ch-mol-007", 2,
    "5.6\\ \\text{g 鐵的莫耳數（}\\text{Fe}=56\\text{）}", "0.1",
    ["mole"], "5.6/56 = 0.1。", 25);
  chem("ch-mol-008", 3,
    "44\\ \\text{g }\\text{CO}_2\\text{ 含氧原子幾莫耳（}M=44\\text{）}", "2",
    ["mole"], "1 mol CO₂ 有 2 mol O。", 35);

  // ==================== 化學：計量與平衡式 ====================
  chem("ch-stoi-001", 2,
    "\\text{甲烷燃燒 }\\text{CH}_4+2\\text{O}_2\\to \\text{CO}_2+2\\text{H}_2\\text{O}\\text{ 的係數總和}", "6",
    ["stoichiometry", "balancing"], "1+2+1+2 = 6。", 35);
  chem("ch-stoi-002", 2,
    "\\text{丙烷 }\\text{C}_3\\text{H}_8\\text{ 完全燃燒平衡後 }\\text{O}_2\\text{ 的係數}", "5",
    ["stoichiometry", "balancing"], "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O。", 45);
  chem("ch-stoi-003", 3,
    "16\\ \\text{g }\\text{CH}_4\\text{（}M=16\\text{）完全燃燒需 }\\text{O}_2\\text{ 幾莫耳}", "2",
    ["stoichiometry"], "1 mol CH₄ 配 2 mol O₂。", 40);
  chem("ch-stoi-004", 3,
    "2\\text{H}_2+\\text{O}_2\\to 2\\text{H}_2\\text{O}\\text{：}4\\ \\text{g }\\text{H}_2\\text{ 完全反應生成水的質量（g）}", "36",
    ["stoichiometry"], "2 mol H₂ → 2 mol H₂O = 36 g。", 50);
  chem("ch-stoi-005", 3,
    "\\text{N}_2+3\\text{H}_2\\to 2\\text{NH}_3\\text{：}1\\ \\text{mol }\\text{N}_2\\text{ 與足量 }\\text{H}_2\\text{ 產生 }\\text{NH}_3\\text{（}M=17\\text{，g）}", "34",
    ["stoichiometry"], "生成 2 mol NH₃ = 34 g。", 45);
  chem("ch-stoi-006", 3,
    "2\\text{H}_2+\\text{O}_2\\to 2\\text{H}_2\\text{O}\\text{：}2\\ \\text{mol }\\text{H}_2\\text{ 與 }2\\ \\text{mol }\\text{O}_2\\text{ 生成水幾莫耳}", "2",
    ["stoichiometry", "limiting-reagent"], "H₂ 是限量試劑：2 mol H₂ → 2 mol H₂O。", 50);

  // ==================== 化學：溶液 ====================
  chem("ch-sol-001", 1,
    "0.5\\ \\text{mol 溶質配成 }2\\ \\text{L 溶液的體積莫耳濃度（M）}", "0.25",
    ["solution"], "M = n/V = 0.25。", 25);
  chem("ch-sol-002", 2,
    "2\\ \\text{M 溶液 }50\\ \\text{mL 稀釋到 }200\\ \\text{mL 的濃度（M）}", "0.5",
    ["solution", "dilution"], "M₁V₁ = M₂V₂：100 = 200M → 0.5。", 35);
  chem("ch-sol-003", 2,
    "117\\ \\text{g }\\text{NaCl}\\text{（式量 }58.5\\text{）配成 }1\\ \\text{L 的濃度（M）}", "2",
    ["solution"], "117/58.5 = 2 mol，除以 1 L。", 35);
  chem("ch-sol-004", 1,
    "20\\ \\text{g 溶質溶於 }80\\ \\text{g 水的重量百分濃度（}\\%\\text{）}", "20",
    ["solution"], "20/100 = 20%（分母是溶液總重）。", 30);
  chem("ch-sol-005", 3,
    "0.1\\ \\text{M 溶液 }100\\ \\text{mL 與 }0.3\\ \\text{M 同溶質 }100\\ \\text{mL 混合後的濃度（M）}", "0.2",
    ["solution"], "(0.01+0.03)/0.2 L = 0.2 M。", 45);
  chem("ch-sol-006", 2,
    "\\text{配 }1\\ \\text{L }0.5\\ \\text{M }\\text{NaOH}\\text{（式量 }40\\text{）需幾克}", "20",
    ["solution"], "0.5 mol × 40 = 20 g。", 35);

  // ==================== 化學：氣體 ====================
  chem("ch-gas-001", 2,
    "\\text{等溫：}2\\ \\text{atm}\\cdot 3\\ \\text{L 加壓到 }4\\ \\text{atm 的體積（L）}", "1.5",
    ["gas-law"], "P₁V₁ = P₂V₂ → V = 6/4 = 1.5。", 35);
  chem("ch-gas-002", 2,
    "\\text{定壓：}300\\ \\text{K 時 }2\\ \\text{L，升到 }600\\ \\text{K 的體積（L）}", "4",
    ["gas-law"], "V/T 固定，體積加倍。", 35);
  chem("ch-gas-003", 3,
    "P\\cdot V=nRT\\text{：}n=2,\\ T=300\\ \\text{K},\\ P=1\\ \\text{atm},\\ R=0.082\\text{，體積（L）}", "49.2",
    ["gas-law"], "V = 2·0.082·300 = 49.2。", 50);
  chem("ch-gas-004", 3,
    "3\\ \\text{mol }\\text{N}_2\\text{ 與 }1\\ \\text{mol }\\text{O}_2\\text{ 混合，總壓 }8\\ \\text{atm 時 }\\text{O}_2\\text{ 的分壓（atm）}", "2",
    ["gas-law", "partial-pressure"], "莫耳分率 1/4 × 8 = 2。", 45);

  // ==================== 化學：酸鹼 ====================
  chem("ch-acid-001", 1,
    "[\\text{H}^{+}]=10^{-3}\\ \\text{M 的 pH}", "3",
    ["acid-base"], "pH = −log[H⁺] = 3。", 25);
  chem("ch-acid-002", 1,
    "\\text{pH}=11\\ \\text{的溶液 pOH（}25\\ ^{\\circ}\\text{C）}", "3",
    ["acid-base"], "pH + pOH = 14。", 25);
  chem("ch-acid-003", 2,
    "0.01\\ \\text{M }\\text{HCl}\\text{ 的 pH}", "2",
    ["acid-base"], "強酸全解離：[H⁺] = 10⁻² → pH = 2。", 30);
  chem("ch-acid-004", 2,
    "0.1\\ \\text{M }\\text{HCl}\\ 20\\ \\text{mL 需 }0.1\\ \\text{M }\\text{NaOH}\\text{ 幾 mL 中和}", "20",
    ["acid-base", "titration"], "1:1 且等濃度，體積相同。", 35);
  chem("ch-acid-005", 3,
    "0.1\\ \\text{M }\\text{H}_2\\text{SO}_4\\ 20\\ \\text{mL 需 }0.1\\ \\text{M }\\text{NaOH}\\text{ 幾 mL 中和}", "40",
    ["acid-base", "titration"], "二質子酸：H⁺ 有 0.004 mol，需 40 mL。", 45);
  chem("ch-acid-006", 2,
    "\\text{pH}=3\\ \\text{的強酸稀釋成 pH}=5\\text{，體積要變成原來的幾倍}", "100",
    ["acid-base", "dilution"], "[H⁺] 降為 1/100，體積 ×100。", 40);
  chem("ch-acid-007", 3,
    "0.005\\ \\text{M }\\text{Ba(OH)}_2\\text{ 的 pH（}25\\ ^{\\circ}\\text{C，完全解離）}", "12",
    ["acid-base"], "[OH⁻] = 0.01 → pOH = 2 → pH = 12。", 55);

  // ==================== 化學：原子結構 ====================
  chem("ch-atom-001", 1,
    "\\text{質子數 }17\\ \\text{的 }\\text{Cl}^{-}\\text{ 的電子數}", "18",
    ["atomic-structure"], "陰離子多得一個電子：17+1 = 18。", 25);
  chem("ch-atom-002", 1,
    "\\text{原子序 }26\\text{、質量數 }56\\ \\text{的中子數}", "30",
    ["atomic-structure"], "56 − 26 = 30。", 25);
  chem("ch-atom-003", 2,
    "\\text{電子組態 }1s^2 2s^2 2p^6 3s^2 3p^4\\ \\text{的價電子數}", "6",
    ["atomic-structure", "electron-configuration"], "最外層 3s²3p⁴ 共 6 個。", 35);
  chem("ch-atom-004", 3,
    "\\text{某元素 }75\\%\\ \\text{質量數 }35\\text{、}25\\%\\ \\text{質量數 }37\\text{，平均原子量}", "35.5",
    ["atomic-structure", "isotope"], "0.75·35 + 0.25·37 = 35.5。", 45);
  chem("ch-atom-005", 2,
    "3d\\ \\text{軌域最多容納的電子數}", "10",
    ["atomic-structure", "electron-configuration"], "d 有 5 個軌域 × 2 = 10。", 25);
  chem("ch-atom-006", 2,
    "\\text{第 }n=3\\ \\text{層最多容納的電子數（}2n^2\\text{）}", "18",
    ["atomic-structure"], "2·9 = 18。", 25);

  // ==================== 化學：氧化還原 ====================
  chem("ch-redox-001", 2,
    "\\text{KMnO}_4\\ \\text{中 }\\text{Mn}\\ \\text{的氧化數}", "7",
    ["redox", "oxidation-number"], "+1 + x + 4(−2) = 0 → x = +7。", 35);
  chem("ch-redox-002", 1,
    "\\text{H}_2\\text{SO}_4\\ \\text{中 }\\text{S}\\ \\text{的氧化數}", "6",
    ["redox", "oxidation-number"], "2(+1) + x + 4(−2) = 0 → x = +6。", 30);
  chem("ch-redox-003", 3,
    "\\text{Cr}_2\\text{O}_7^{2-}\\ \\text{中 }\\text{Cr}\\ \\text{的氧化數}", "6",
    ["redox", "oxidation-number"], "2x + 7(−2) = −2 → x = +6。", 45);
  chem("ch-redox-004", 2,
    "\\text{NH}_3\\ \\text{中 }\\text{N}\\ \\text{的氧化數}", "-3",
    ["redox", "oxidation-number"], "x + 3(+1) = 0 → x = −3。", 30);
  chem("ch-redox-005", 2,
    "\\text{HClO}_3\\ \\text{中 }\\text{Cl}\\ \\text{的氧化數}", "5",
    ["redox", "oxidation-number"], "+1 + x + 3(−2) = 0 → x = +5。", 35);
  chem("ch-redox-006", 3,
    "\\text{電解 }\\text{CuSO}_4\\text{，通過 }1\\ \\text{法拉第可析出 }\\text{Cu}\\ \\text{幾莫耳}", "0.5",
    ["redox", "electrolysis"], "Cu²⁺ 需 2 mol 電子：1/2 = 0.5 mol。", 50);

  // ==================== 化學：鍵結 ====================
  chem("ch-bond-001", 1,
    "\\text{CH}_4\\ \\text{分子中的 }\\sigma\\ \\text{鍵數}", "4",
    ["bonding"], "4 個 C–H 單鍵都是 σ 鍵。", 25);
  chem("ch-bond-002", 2,
    "\\text{N}_2\\ \\text{的三鍵中 }\\pi\\ \\text{鍵數}", "2",
    ["bonding"], "三鍵 = 1 σ + 2 π。", 30);
  chem("ch-bond-003", 2,
    "\\text{CO}_2\\ \\text{的鍵角（度）}", "180",
    ["bonding", "vsepr"], "直線形分子。", 25);
  chem("ch-bond-004", 2,
    "\\text{NH}_3\\ \\text{中心原子的孤對電子對數}", "1",
    ["bonding", "vsepr"], "N 有 5 價電子，3 個成鍵、1 對孤對。", 30);

  // ==================== 化學：速率 / 平衡 / 其他 ====================
  chem("ch-rate-001", 3,
    "\\text{溫度每升 }10\\ ^{\\circ}\\text{C 反應速率變兩倍，升 }30\\ ^{\\circ}\\text{C 變幾倍}", "8",
    ["kinetics"], "2³ = 8。", 35);
  chem("ch-rate-002", 3,
    "\\text{碳 }14\\ \\text{半衰期 }5730\\ \\text{年，剩下 }25\\%\\ \\text{經過幾年}", "11460",
    ["kinetics", "half-life"], "剩 1/4 = 2 個半衰期：2×5730。", 40);
  chem("ch-eq-001", 3,
    "\\text{N}_2+3\\text{H}_2\\rightleftharpoons 2\\text{NH}_3\\text{，平衡時 }[\\text{N}_2]=1,\\ [\\text{H}_2]=2,\\ [\\text{NH}_3]=2\\text{，}K_c", "0.5",
    ["equilibrium"], "K = 2²/(1·2³) = 4/8 = 0.5。", 55);
  chem("ch-misc-001", 2,
    "0.00450\\ \\text{的有效數字位數}", "3",
    ["significant-figures"], "前導零不算，末尾零算：4、5、0 共 3 位。", 30);

  // ==================== 化學：沉澱表 / 溶解度規則 ====================
  // 規則：硝酸鹽與銨鹽全溶；鹼金屬鹽全溶；鹵化物除 Ag/Pb/Hg₂ 外可溶；
  // 硫酸鹽除 Ba/Pb/Sr 外可溶；碳酸鹽、磷酸鹽、氫氧化物多不溶（鹼金屬與銨除外）。
  const SOLUBLE = ["可溶", "溶", "易溶", "溶於水"];
  const INSOLUBLE = ["不溶", "難溶", "沉澱", "不溶於水"];
  const SOL_DISTRACTORS = ["不溶", "微溶", "與水反應"];
  const INSOL_DISTRACTORS = ["可溶", "易溶", "微溶"];

  recall("ch-ppt-001", "chemistry", 1,
    "\\text{AgCl}\\ \\text{在水中的溶解性}", INSOLUBLE, INSOL_DISTRACTORS,
    ["solubility-rules", "precipitate"], "鹵化物可溶，但 Ag⁺、Pb²⁺、Hg₂²⁺ 例外 → AgCl 是白色沉澱。", 30);
  recall("ch-ppt-002", "chemistry", 1,
    "\\text{NaNO}_3\\ \\text{在水中的溶解性}", SOLUBLE, SOL_DISTRACTORS,
    ["solubility-rules"], "硝酸鹽（與鈉鹽）全部可溶，沒有例外。", 25);
  recall("ch-ppt-003", "chemistry", 2,
    "\\text{BaSO}_4\\ \\text{在水中的溶解性}", INSOLUBLE, INSOL_DISTRACTORS,
    ["solubility-rules", "precipitate"], "硫酸鹽可溶，但 Ba²⁺、Pb²⁺、Sr²⁺ 例外。", 30);
  recall("ch-ppt-004", "chemistry", 2,
    "\\text{CaCO}_3\\ \\text{在水中的溶解性}", INSOLUBLE, INSOL_DISTRACTORS,
    ["solubility-rules", "precipitate"], "碳酸鹽多半不溶，只有鹼金屬與銨鹽例外。", 30);
  recall("ch-ppt-005", "chemistry", 2,
    "\\text{(NH}_4)_2\\text{S}\\ \\text{在水中的溶解性}", SOLUBLE, SOL_DISTRACTORS,
    ["solubility-rules"], "銨鹽一律可溶，即使硫化物大多不溶。", 35);
  recall("ch-ppt-006", "chemistry", 2,
    "\\text{PbI}_2\\ \\text{在水中的溶解性}", INSOLUBLE, INSOL_DISTRACTORS,
    ["solubility-rules", "precipitate"], "碘化物遇 Pb²⁺ 例外 → 黃色沉澱。", 35);
  recall("ch-ppt-007", "chemistry", 2,
    "\\text{K}_2\\text{CO}_3\\ \\text{在水中的溶解性}", SOLUBLE, SOL_DISTRACTORS,
    ["solubility-rules"], "碳酸鹽不溶，但鹼金屬（K⁺）是例外。", 30);
  recall("ch-ppt-008", "chemistry", 2,
    "\\text{Mg(OH)}_2\\ \\text{在水中的溶解性}", INSOLUBLE, INSOL_DISTRACTORS,
    ["solubility-rules", "precipitate"], "氫氧化物多不溶；鹼金屬可溶、Ba(OH)₂ 較可溶。", 35);
  chem("ch-ppt-009", 3,
    "\\text{AgCl}\\text{、}\\text{NaCl}\\text{、}\\text{BaSO}_4\\text{、}\\text{KNO}_3\\ \\text{中不溶於水的個數}", "2",
    ["solubility-rules", "precipitate"], "AgCl 與 BaSO₄ 不溶；NaCl、KNO₃ 可溶。", 45);
  chem("ch-ppt-010", 3,
    "\\text{BaCl}_2\\ \\text{與 }\\text{Na}_2\\text{SO}_4\\ \\text{溶液混合會生成幾種沉澱}", "1",
    ["solubility-rules", "precipitate"], "只有 BaSO₄ 沉澱，NaCl 留在溶液中。", 45);
  recall("ch-ppt-011", "chemistry", 3,
    "\\text{Na}_2\\text{SO}_4\\ \\text{與 }\\text{KNO}_3\\ \\text{溶液混合有沒有沉澱}",
    ["沒有", "無", "不會"], ["有", "一種", "兩種"],
    ["solubility-rules", "precipitate"], "可能的組合 NaNO₃、K₂SO₄ 都可溶 → 沒有反應。", 45);
  recall("ch-ppt-012", "chemistry", 2,
    "\\text{AgCl}\\ \\text{沉澱的顏色}", ["白色", "白"], ["黃色", "黑色", "藍色"],
    ["solubility-rules", "precipitate"], "AgCl 白色、AgBr 淡黃、AgI 黃色。", 30);
  recall("ch-ppt-013", "chemistry", 3,
    "\\text{AgI}\\ \\text{沉澱的顏色}", ["黃色", "黃"], ["白色", "紅棕色", "藍色"],
    ["solubility-rules", "precipitate"], "鹵化銀顏色由淺到深：Cl 白 → Br 淡黃 → I 黃。", 35);
  recall("ch-ppt-014", "chemistry", 3,
    "\\text{Fe(OH)}_3\\ \\text{沉澱的顏色}", ["紅棕色", "紅褐色", "棕色"], ["白色", "藍色", "黃色"],
    ["solubility-rules", "precipitate"], "Fe(OH)₃ 紅棕色、Fe(OH)₂ 白綠色。", 35);
  recall("ch-ppt-015", "chemistry", 3,
    "\\text{Cu(OH)}_2\\ \\text{沉澱的顏色}", ["藍色", "藍"], ["白色", "紅棕色", "黑色"],
    ["solubility-rules", "precipitate"], "銅的水合離子與氫氧化物都是藍色。", 35);

  // ==================== 化學：氧化還原 / 電化學 ====================
  recall("ch-ox-001", "chemistry", 2,
    "\\text{Zn}+\\text{Cu}^{2+}\\to \\text{Zn}^{2+}+\\text{Cu}\\ \\text{中 }\\text{Zn}\\ \\text{扮演}",
    ["還原劑"], ["氧化劑", "催化劑", "電解質"],
    ["redox", "oxidizing-reducing-agent"], "Zn 自己被氧化（失電子），所以是還原劑。", 40);
  recall("ch-ox-002", "chemistry", 2,
    "\\text{Zn}+\\text{Cu}^{2+}\\to \\text{Zn}^{2+}+\\text{Cu}\\ \\text{中 }\\text{Cu}^{2+}\\ \\text{扮演}",
    ["氧化劑"], ["還原劑", "催化劑", "電解質"],
    ["redox", "oxidizing-reducing-agent"], "Cu²⁺ 得電子被還原，所以是氧化劑。", 40);
  recall("ch-ox-003", "chemistry", 1,
    "\\text{氧化數增加的物質發生了什麼反應}",
    ["氧化", "被氧化", "氧化反應"], ["還原", "中和", "沉澱"],
    ["redox", "oxidation-number"], "氧化數增加 = 失電子 = 被氧化。", 30);
  recall("ch-ox-004", "chemistry", 2,
    "\\text{不論電池或電解池，發生氧化反應的電極稱為}",
    ["陽極"], ["陰極", "鹽橋", "電解質"],
    ["redox", "electrochemistry"], "定義就是「陽極氧化、陰極還原」，與正負極標示無關。", 40);
  chem("ch-ox-005", 3,
    "\\text{MnO}_4^{-}\\to \\text{Mn}^{2+}\\ \\text{的半反應得到幾個電子}", "5",
    ["redox", "half-reaction"], "Mn 由 +7 降到 +2，差 5。", 45);
  chem("ch-ox-006", 3,
    "\\text{Cr}_2\\text{O}_7^{2-}\\to 2\\text{Cr}^{3+}\\ \\text{的半反應得到幾個電子}", "6",
    ["redox", "half-reaction"], "兩個 Cr 各由 +6 降到 +3。", 50);
  chem("ch-ox-007", 2,
    "\\text{Al}\\to \\text{Al}^{3+}\\ \\text{失去幾個電子}", "3",
    ["redox", "half-reaction"], "氧化數 0 → +3。", 25);
  chem("ch-ox-008", 2,
    "\\text{H}_2\\text{O}_2\\ \\text{中 }\\text{O}\\ \\text{的氧化數}", "-1",
    ["redox", "oxidation-number"], "過氧化物是 −2 規則的經典例外。", 40);
  chem("ch-ox-009", 2,
    "\\text{NaClO}\\ \\text{中 }\\text{Cl}\\ \\text{的氧化數}", "1",
    ["redox", "oxidation-number"], "+1 + x + (−2) = 0 → x = +1。", 35);
  chem("ch-ox-010", 3,
    "\\text{MnO}_4^{-}\\ \\text{氧化 }\\text{Fe}^{2+}\\ \\text{的平衡式中 }\\text{Fe}^{2+}\\ \\text{的係數}", "5",
    ["redox", "half-reaction", "balancing"], "Mn 得 5 個電子，每個 Fe²⁺ 只給 1 個 → 係數 5。", 55);
  recall("ch-ox-011", "chemistry", 2,
    "\\text{F}_2\\ \\text{在反應中通常扮演}",
    ["氧化劑"], ["還原劑", "催化劑", "溶劑"],
    ["redox", "oxidizing-reducing-agent"], "氟的電負度最大，是最強的氧化劑。", 35);
  recall("ch-ox-012", "chemistry", 2,
    "\\text{Zn}\\ \\text{片放入 }\\text{CuSO}_4\\ \\text{溶液會不會反應}",
    ["會", "可以", "會反應"], ["不會", "要加熱才會", "要通電才會"],
    ["redox", "activity-series"], "Zn 比 Cu 活潑，可置換出銅（藍色變淡、析出紅銅）。", 40);
  recall("ch-ox-013", "chemistry", 2,
    "\\text{Cu}\\ \\text{片放入 }\\text{ZnSO}_4\\ \\text{溶液會不會反應}",
    ["不會", "不反應", "沒有反應"], ["會", "會冒氫氣", "會析出鋅"],
    ["redox", "activity-series"], "活性小的金屬無法置換活性大的金屬。", 40);
  chem("ch-ox-014", 3,
    "\\text{電解水時陰極 }\\text{H}_2\\ \\text{與陽極 }\\text{O}_2\\ \\text{的體積比}", "2",
    ["redox", "electrochemistry", "electrolysis"], "2H₂O → 2H₂ + O₂，體積比 2:1。", 45);
  chem("ch-ox-015", 1,
    "\\text{金屬單質（例如 }\\text{Fe}\\text{）的氧化數}", "0",
    ["redox", "oxidation-number"], "任何元素單質的氧化數都是 0。", 25);

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
