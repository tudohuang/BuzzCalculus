(function () {
  "use strict";

  // 深層連鎖包（2026-08）：58 題，全部是「要套很多次鏈鎖律」的微分。
  //
  // 動機是量出來的：微分區 557 題裡，連鎖深度 4 的只有 4 題、深度 5 的 2 題，
  // 而那 6 題多半是 Laplacian 與參數式，不是純連鎖。
  // 帶 chain-rule 標籤的 60 題最深只到 3。
  // 也就是說「一層一層剝到底」這件事，題庫幾乎沒有在練。
  //
  // 這一包補的就是那一段：
  //   深層純複合 15  ── f(g(h(k(x))))，四到六層
  //   鏈鎖 × 乘除 12  ── 每個因式自己還是複合的
  //   指數塔        10  ── 底數與指數都含 x，鏈鎖疊在對數微分上
  //   看起來深其實會塌 9 ── 先化簡的人三行寫完，硬幹的人算半頁
  //   反三角與雙曲  12  ── 深層複合裡最容易漏掉內層導數的一群
  //
  // 「會塌」那一組是刻意的。深層連鎖真正要練的不是耐力，是**先看一眼**：
  // sqrt(1+tan²u) 就是 sec u，log(e^u) 就是 u，arctan(1/x)+arctan(x) 是常數。
  // 一包全是硬題會訓練出「看到就開始套公式」的壞反射。
  //
  // 驗算：題幹都是 \frac{d}{dx}(...)，驗算器直接對題幹做數值微分再跟答案比對，
  // 走的是跟「作者手推鏈鎖律」完全無關的路徑。
  const SOURCE = "Buzz chain depth pack";
  const problems = [];

  function add(problem) {
    const rank = problem.rank;
    const tags = [...(problem.tags || []), "chain-rule", `rank-${rank}`];
    if (rank >= 5) tags.push("boss-rank");
    if (rank === 6) tags.push("boss-plus");
    if (rank <= 2) tags.push("beginner-friendly");
    problems.push({
      source: SOURCE,
      difficulty: Math.min(4, rank),
      topic: "derivatives",
      answerKind: "expression",
      ...problem,
      tags
    });
  }

  const d = (id, rank, prompt, answer, tags, solution, timeLimit) =>
    add({ id, rank, prompt, answer, tags, solution, timeLimit });

  /* ═══════════ 一、深層純複合（15）═══════════
     由外往內一層一層剝，每一層乘上內層的導數。
     寫下來的時候順序反過來也沒關係 —— 乘法可交換，但**不能漏層**。 */

  d("ch-nest-001", 4,
    "\\frac{d}{dx}\\sin(\\cos(\\tan(x^2)))",
    "-2*x*cos(cos(tan(x^2)))*sin(tan(x^2))/cos(x^2)^2",
    ["trig"],
    "四層：sin′ → cos′（負號） → tan′（sec²） → (x²)′。少乘任何一層都錯。", 110);

  d("ch-nest-002", 4,
    "\\frac{d}{dx}\\,e^{\\sin(\\log(x^2+1))}",
    "2*x*exp(sin(log(x^2+1)))*cos(log(x^2+1))/(x^2+1)",
    ["exponential", "log"],
    "e^u 不變、sin′=cos、log′=1/u、最內層 2x。", 100);

  d("ch-nest-003", 4,
    "\\frac{d}{dx}\\log(\\sin(\\sqrt{x^2+1}))",
    "x*cos(sqrt(x^2+1))/(sqrt(x^2+1)*sin(sqrt(x^2+1)))",
    ["log", "trig", "radical"],
    "1/sin(·) × cos(·) × x/√(x²+1)。中間那個 cos 最常被寫成 sin。", 110);

  d("ch-nest-004", 4,
    "\\frac{d}{dx}\\arctan\\left(e^{\\sin(x^2)}\\right)",
    "2*x*exp(sin(x^2))*cos(x^2)/(1+exp(2*sin(x^2)))",
    ["inverse-trig", "exponential"],
    "arctan′ 的分母是 1+(內層)²，而內層是 e^{sin(x²)}，所以是 1+e^{2sin(x²)}。", 120);

  d("ch-nest-005", 4,
    "\\frac{d}{dx}\\cos\\left(\\log\\left(\\sqrt{1+e^x}\\right)\\right)",
    "-exp(x)*sin(log(sqrt(1+exp(x))))/(2*(1+exp(x)))",
    ["trig", "log", "radical"],
    "log√u = (1/2)log u，先化簡可以少剝一層根號。", 120);

  d("ch-nest-006", 5,
    "\\frac{d}{dx}\\,e^{e^{e^{\\sin x}}}",
    "exp(exp(exp(sin(x))))*exp(exp(sin(x)))*exp(sin(x))*cos(x)",
    ["exponential"],
    "三層指數：每一層都原樣留下，最後乘 cos x。", 100);

  d("ch-nest-007", 5,
    "\\frac{d}{dx}\\left(\\sin\\left(\\cos^2 x\\right)\\right)^3",
    "-6*sin(cos(x)^2)^2*cos(cos(x)^2)*cos(x)*sin(x)",
    ["trig"],
    "外層 3(·)²、中層 cos(cos²x)、內層 (cos²x)′ = −2 cos x sin x。", 130);

  d("ch-nest-008", 4,
    "\\frac{d}{dx}\\log\\left(\\log\\left(\\sin^2 x+2\\right)\\right)",
    "2*sin(x)*cos(x)/((sin(x)^2+2)*log(sin(x)^2+2))",
    ["log", "trig"],
    "兩層 log 各給一個「1/內層」，最內層是 (sin²x+2)′ = 2 sin x cos x。", 110);

  d("ch-nest-009", 6,
    "\\frac{d}{dx}\\sqrt{\\sin\\left(\\sqrt{\\cos(x^2)}\\right)}",
    "-x*cos(sqrt(cos(x^2)))*sin(x^2)/(2*sqrt(sin(sqrt(cos(x^2))))*sqrt(cos(x^2)))",
    ["radical", "trig"],
    "五層：√ → sin → √ → cos → x²。兩個根號各給一個 1/(2√·)，所以分母有個 4 被 2x 約掉一半。", 170);

  d("ch-nest-010", 5,
    "\\frac{d}{dx}\\sin(\\sin(\\sin(\\sin x)))",
    "cos(sin(sin(sin(x))))*cos(sin(sin(x)))*cos(sin(x))*cos(x)",
    ["trig"],
    "四個 cos 連乘，括號一層比一層少。寫的時候由外往內抄最不會亂。", 110);

  d("ch-nest-011", 5,
    "\\frac{d}{dx}\\,e^{\\sqrt{\\log(1+x^2)}}",
    "x*exp(sqrt(log(1+x^2)))/((1+x^2)*sqrt(log(1+x^2)))",
    ["exponential", "radical", "log"],
    "e^u × 1/(2√u) × 2x/(1+x²)，那個 2 剛好約掉。", 140);

  d("ch-nest-012", 5,
    "\\frac{d}{dx}\\log\\left(1+\\sqrt{1+\\sqrt{1+x}}\\right)",
    "1/(4*sqrt(1+x)*sqrt(1+sqrt(1+x))*(1+sqrt(1+sqrt(1+x))))",
    ["log", "radical"],
    "兩層根號各給 1/(2√·)，所以分母出現 4。三個因式由內而外排好就不會漏。", 150);

  d("ch-nest-013", 6,
    "\\frac{d}{dx}\\tan(\\sin(\\cos(\\log x)))",
    "-cos(cos(log(x)))*sin(log(x))/(x*cos(sin(cos(log(x))))^2)",
    ["trig", "log"],
    "五層，而且中間 cos 帶一個負號、最外層 tan 給 sec²。負號漏掉是最常見的錯。", 170);

  d("ch-nest-014", 5,
    "\\frac{d}{dx}\\,\\frac{1}{\\sqrt{1+\\sin^2(e^x)}}",
    "-exp(x)*sin(exp(x))*cos(exp(x))/(1+sin(exp(x))^2)^(3/2)",
    ["radical", "trig", "exponential"],
    "先寫成 (1+sin²(e^x))^{−1/2}，外層就變成 −(1/2)(·)^{−3/2}。", 150);

  d("ch-nest-015", 6,
    "\\frac{d}{dx}\\cos\\left(\\left(\\log x\\right)^{x}\\right)",
    "-sin((log(x))^x)*(log(x))^x*(log(log(x))+1/log(x))",
    ["log-differentiation", "trig", "log"],
    "外層 cos(·)，內層是指數塔 (log x)^x —— 要先取對數：log u = x·log(log x)。", 190);

  /* ═══════════ 二、鏈鎖 × 乘除（12）═══════════
     乘法律或商數律先拆，拆出來的每一塊自己還是複合的。 */

  d("ch-mix-001", 3,
    "\\frac{d}{dx}\\left(x^2\\sin\\left(e^{3x}\\right)\\right)",
    "2*x*sin(exp(3*x))+3*x^2*exp(3*x)*cos(exp(3*x))",
    ["product-rule", "exponential"],
    "乘法律：先 2x·sin(e^{3x})，再 x²·cos(e^{3x})·e^{3x}·3。", 100);

  d("ch-mix-002", 3,
    "\\frac{d}{dx}\\left(e^{2x}\\cos\\left(\\sqrt{x}\\right)\\right)",
    "2*exp(2*x)*cos(sqrt(x))-exp(2*x)*sin(sqrt(x))/(2*sqrt(x))",
    ["product-rule", "radical"],
    "第二項的 1/(2√x) 最常被漏掉。", 100);

  d("ch-mix-003", 4,
    "\\frac{d}{dx}\\,\\frac{\\sin(x^3)}{\\cos(x^2)}",
    "(3*x^2*cos(x^3)*cos(x^2)+2*x*sin(x^3)*sin(x^2))/cos(x^2)^2",
    ["quotient-rule", "trig"],
    "商數律的分子是「上微下 − 上下微」，而分母微分帶負號，兩個負號變加號。", 120);

  d("ch-mix-004", 4,
    "\\frac{d}{dx}\\,\\frac{e^{\\sqrt{x}}}{1+\\log x}",
    "(exp(sqrt(x))/(2*sqrt(x))*(1+log(x))-exp(sqrt(x))/x)/(1+log(x))^2",
    ["quotient-rule", "exponential", "log"],
    "分子分母各自都是複合的：上面 e^{√x}、下面 1+log x。", 130);

  d("ch-mix-005", 3,
    "\\frac{d}{dx}\\left(\\sqrt{x}\\,\\arctan(x^2)\\right)",
    "atan(x^2)/(2*sqrt(x))+2*x^(3/2)/(1+x^4)",
    ["product-rule", "inverse-trig"],
    "第二項：√x · 2x/(1+x⁴) = 2x^{3/2}/(1+x⁴)。", 110);

  d("ch-mix-006", 3,
    "\\frac{d}{dx}\\left(\\log(x)\\sin(\\log x)\\right)",
    "(sin(log(x))+log(x)*cos(log(x)))/x",
    ["product-rule", "log"],
    "兩項都會生出 1/x，提出來之後式子短很多。", 100);

  d("ch-mix-007", 4,
    "\\frac{d}{dx}\\,\\frac{\\tan\\left(\\sqrt{x}\\right)}{x}",
    "(sqrt(x)/(2*cos(sqrt(x))^2)-tan(sqrt(x)))/x^2",
    ["quotient-rule", "trig", "radical"],
    "分子的 x·sec²(√x)/(2√x) 化簡成 √x/2 · sec²(√x)。", 130);

  d("ch-mix-008", 4,
    "\\frac{d}{dx}\\left(e^{x^2}\\log(\\sin x)\\right)",
    "2*x*exp(x^2)*log(sin(x))+exp(x^2)*cos(x)/sin(x)",
    ["product-rule", "exponential", "log"],
    "第二項是 e^{x²}·(sin x)′/sin x = e^{x²} cot x。", 110);

  d("ch-mix-009", 4,
    "\\frac{d}{dx}\\,\\frac{\\sqrt{1+x^2}}{\\sin(2x)}",
    "(x*sin(2*x)/sqrt(1+x^2)-2*sqrt(1+x^2)*cos(2*x))/sin(2*x)^2",
    ["quotient-rule", "radical", "trig"],
    "分母微分的那個 2 來自 sin(2x) 的內層。", 130);

  d("ch-mix-010", 3,
    "\\frac{d}{dx}\\left(1+\\sin^2 x\\right)^5",
    "10*sin(x)*cos(x)*(1+sin(x)^2)^4",
    ["trig"],
    "外層 5(·)⁴，內層 (sin²x)′ = 2 sin x cos x，5×2 = 10。", 90);

  d("ch-mix-011", 5,
    "\\frac{d}{dx}\\left(\\frac{1+e^x}{1-e^x}\\right)^3",
    "6*exp(x)*((1+exp(x))/(1-exp(x)))^2/(1-exp(x))^2",
    ["quotient-rule", "exponential"],
    "內層商的導數化簡成 2e^x/(1−e^x)²，乘上外層的 3(·)² 得到 6。", 150);

  d("ch-mix-012", 4,
    "\\frac{d}{dx}\\cos^2\\left(\\log(1+x^2)\\right)",
    "-4*x*cos(log(1+x^2))*sin(log(1+x^2))/(1+x^2)",
    ["trig", "log"],
    "三層：平方 → cos → log。2×(−1)×2x = −4x。", 120);

  /* ═══════════ 三、指數塔（10）═══════════
     底數與指數都含 x 的時候，鏈鎖律單獨不夠用 —— 要先取對數。 */

  d("ch-pow-001", 4,
    "\\frac{d}{dx}\\left(\\sin x\\right)^{\\tan x}",
    "(sin(x))^(tan(x))*(log(sin(x))/cos(x)^2+1)",
    ["log-differentiation", "trig"],
    "log y = tan x·log sin x。微分後 sec²x·log sin x + tan x·cot x，而後者就是 1。", 150);

  d("ch-pow-002", 4,
    "\\frac{d}{dx}\\left(x^2+1\\right)^{\\sin x}",
    "(x^2+1)^(sin(x))*(cos(x)*log(x^2+1)+2*x*sin(x)/(x^2+1))",
    ["log-differentiation", "trig"],
    "log y = sin x·log(x²+1)，右邊用乘法律。", 130);

  d("ch-pow-003", 5,
    "\\frac{d}{dx}\\left(\\log x\\right)^{\\tan x}",
    "(log(x))^(tan(x))*(log(log(x))/cos(x)^2+tan(x)/(x*log(x)))",
    ["log-differentiation", "log", "trig"],
    "log y = tan x·log(log x)，兩項都要用鏈鎖。", 160);

  d("ch-pow-004", 5,
    "\\frac{d}{dx}\\left(1+x^2\\right)^{1/x}",
    "(1+x^2)^(1/x)*(2*x^2/(1+x^2)-log(1+x^2))/x^2",
    ["log-differentiation"],
    "log y = log(1+x²)/x，右邊用商數律。", 160);

  d("ch-pow-005", 5,
    "\\frac{d}{dx}\\,e^{x^x}",
    "exp(x^x)*x^x*(log(x)+1)",
    ["log-differentiation", "exponential"],
    "外層 e^u 原樣，內層 (x^x)′ = x^x(log x + 1)。", 130);

  d("ch-pow-006", 5,
    "\\frac{d}{dx}\\,x^{e^x}",
    "x^(exp(x))*exp(x)*(log(x)+1/x)",
    ["log-differentiation", "exponential"],
    "log y = e^x·log x，微分得 e^x log x + e^x/x。", 140);

  d("ch-pow-007", 5,
    "\\frac{d}{dx}\\left(\\cos x\\right)^{\\log x}",
    "(cos(x))^(log(x))*(log(cos(x))/x-log(x)*tan(x))",
    ["log-differentiation", "trig"],
    "log y = log x·log cos x。第二項的 −tan x 來自 (log cos x)′。", 150);

  d("ch-pow-008", 5,
    "\\frac{d}{dx}\\left(\\arctan x\\right)^{x}",
    "(atan(x))^x*(log(atan(x))+x/((1+x^2)*atan(x)))",
    ["log-differentiation", "inverse-trig"],
    "log y = x·log(arctan x)，第二項要對 arctan 再微分一次。", 160);

  d("ch-pow-009", 5,
    "\\frac{d}{dx}\\left(\\sqrt{x}\\right)^{\\sqrt{x}}",
    "(sqrt(x))^(sqrt(x))*(log(x)/(4*sqrt(x))+1/(2*sqrt(x)))",
    ["log-differentiation", "radical"],
    "log y = (√x/2)·log x（因為 log√x = (1/2)log x）。", 160);

  d("ch-pow-010", 6,
    "\\frac{d}{dx}\\left(\\sin(x^2)\\right)^{\\cos x}",
    "(sin(x^2))^(cos(x))*(-sin(x)*log(sin(x^2))+2*x*cos(x)*cos(x^2)/sin(x^2))",
    ["log-differentiation", "trig"],
    "底數與指數都是複合的：log y = cos x·log sin(x²)，兩邊都還要再鏈鎖一次。", 190);

  /* ═══════════ 四、看起來深、其實會塌（9）═══════════
     深層連鎖真正要練的不是耐力，是先看一眼會不會塌。
     這一組跟前面混在一起抽，才不會養成「看到就開始套公式」的反射。 */

  d("ch-trap-001", 4,
    "\\frac{d}{dx}\\sqrt{1+\\tan^2(\\sin x)}",
    "cos(x)*sin(sin(x))/cos(sin(x))^2",
    ["trap-drill", "trig"],
    "1+tan²u = sec²u，所以整串是 sec(sin x)。微分只剩兩層。", 130);

  d("ch-trap-002", 3,
    "\\frac{d}{dx}\\log\\left(e^{x^2+3x}\\right)",
    "2*x+3",
    ["trap-drill", "log"],
    "log 和 e 互相抵消，整串就是 x²+3x。", 60);

  d("ch-trap-003", 3,
    "\\frac{d}{dx}\\sin\\left(\\arcsin(x^3)\\right)",
    "3*x^2",
    ["trap-drill", "inverse-trig"],
    "sin 和 arcsin 抵消（在定義域內），剩 x³。", 60);

  d("ch-trap-004", 3,
    "\\frac{d}{dx}\\,e^{\\log(\\sin^2 x)}",
    "2*sin(x)*cos(x)",
    ["trap-drill", "exponential"],
    "e^{log u} = u，所以是 sin²x。", 70);

  d("ch-trap-005", 4,
    "\\frac{d}{dx}\\arctan\\left(\\frac{\\sin x}{\\cos x}\\right)",
    "1",
    ["trap-drill", "inverse-trig"],
    "括號裡是 tan x，而 arctan(tan x) = x（主值範圍內）。", 80);

  d("ch-trap-006", 3,
    "\\frac{d}{dx}\\left(\\cosh^2(3x)-\\sinh^2(3x)\\right)",
    "0",
    ["trap-drill", "hyperbolic"],
    "cosh²−sinh² 恆等於 1，跟裡面是 3x 還是什麼都無關。", 70);

  d("ch-trap-007", 4,
    "\\frac{d}{dx}\\log\\left(\\sqrt{\\frac{1+x}{1-x}}\\right)",
    "1/(1-x^2)",
    ["trap-drill", "log"],
    "先拆成 (1/2)[log(1+x) − log(1−x)]，微分後兩項通分正好是 1/(1−x²)。", 110);

  d("ch-trap-008", 4,
    "\\frac{d}{dx}\\left(\\arctan\\frac{1}{x}+\\arctan x\\right)",
    "0",
    ["trap-drill", "inverse-trig"],
    "兩者相加在 x>0 恆等於 π/2。硬微分也會得到 0，但要多寫五行。", 100);

  d("ch-trap-009", 4,
    "\\frac{d}{dx}\\,\\frac{e^{2\\log x}}{x}",
    "1",
    ["trap-drill", "log", "exponential"],
    "e^{2log x} = x²，整串就是 x。", 80);

  /* ═══════════ 五、反三角與雙曲的深層複合（12）═══════════
     這一群最容易漏內層導數，因為外層公式本身就長。 */

  d("ch-inv-001", 4,
    "\\frac{d}{dx}\\arcsin\\left(\\tanh(x^2)\\right)",
    "2*x/cosh(x^2)",
    ["inverse-trig", "hyperbolic"],
    "1−tanh²u = sech²u，開根號得 sech u，跟外層的 sech²u 約掉一個。答案短得不像四層。", 150);

  d("ch-inv-002", 4,
    "\\frac{d}{dx}\\arctan\\left(\\sinh(x^3)\\right)",
    "3*x^2/cosh(x^3)",
    ["inverse-trig", "hyperbolic"],
    "1+sinh²u = cosh²u，跟內層的 cosh u 約掉一個。", 150);

  d("ch-inv-003", 3,
    "\\frac{d}{dx}\\log(\\cosh(\\sin x))",
    "cos(x)*tanh(sin(x))",
    ["log", "hyperbolic", "trig"],
    "(log cosh u)′ = tanh u，再乘內層 cos x。", 100);

  d("ch-inv-004", 4,
    "\\frac{d}{dx}\\arctan(\\tanh x)",
    "1/((1+tanh(x)^2)*cosh(x)^2)",
    ["inverse-trig", "hyperbolic"],
    "外層 1/(1+u²)、內層 sech²x。這一題不會塌，別硬套上面兩題的結果。", 120);

  d("ch-inv-005", 4,
    "\\frac{d}{dx}\\sinh\\left(\\arctan(x^2)\\right)",
    "2*x*cosh(atan(x^2))/(1+x^4)",
    ["hyperbolic", "inverse-trig"],
    "sinh′ = cosh，內層 arctan(x²) 的導數是 2x/(1+x⁴)。", 120);

  d("ch-inv-006", 4,
    "\\frac{d}{dx}\\tanh\\left(\\log(1+x^2)\\right)",
    "2*x/((1+x^2)*cosh(log(1+x^2))^2)",
    ["hyperbolic", "log"],
    "tanh′ = sech²，內層 2x/(1+x²)。也可以先化簡成 (u²−1)/(u²+1)。", 130);

  d("ch-inv-007", 5,
    "\\frac{d}{dx}\\arccos\\left(e^{-x^2}\\right)",
    "2*x*exp(-x^2)/sqrt(1-exp(-2*x^2))",
    ["inverse-trig", "exponential"],
    "arccos′ 帶負號，內層 (e^{−x²})′ 也帶負號，兩個負號變正。", 150);

  d("ch-inv-008", 5,
    "\\frac{d}{dx}\\log\\left(\\arctan\\left(e^x\\right)\\right)",
    "exp(x)/((1+exp(2*x))*atan(exp(x)))",
    ["log", "inverse-trig", "exponential"],
    "三層：log → arctan → e^x。arctan 的分母是 1+e^{2x}。", 140);

  d("ch-inv-009", 5,
    "\\frac{d}{dx}\\arctan\\left(\\log(\\cosh x)\\right)",
    "tanh(x)/(1+log(cosh(x))^2)",
    ["inverse-trig", "log", "hyperbolic"],
    "內層 (log cosh x)′ = tanh x，外層分母是 1+(log cosh x)²。", 140);

  d("ch-inv-010", 4,
    "\\frac{d}{dx}\\tan\\left(\\arcsin(x^2)\\right)",
    "2*x/(1-x^4)^(3/2)",
    ["inverse-trig", "trap-drill"],
    "sec²(arcsin u) = 1/(1−u²)，乘上 arcsin 的 1/√(1−u²) 與內層 2x。", 140);

  d("ch-inv-011", 5,
    "\\frac{d}{dx}\\,e^{\\arctan(\\log x)}",
    "exp(atan(log(x)))/(x*(1+log(x)^2))",
    ["exponential", "inverse-trig", "log"],
    "三層：e^u → arctan → log。", 130);

  d("ch-inv-012", 5,
    "\\frac{d}{dx}\\operatorname{arsinh}\\left(\\sin(x^2)\\right)",
    "2*x*cos(x^2)/sqrt(1+sin(x^2)^2)",
    ["hyperbolic", "trig"],
    "arsinh′(u) = 1/√(1+u²)，內層 (sin x²)′ = 2x cos x²。", 150);

  /* ═══════════ 提示 ═══════════
     只寫給 R5 以上、而且原本一條提示都沒有的題。
     第一層說「該看出什麼」，第二層說「關鍵那一步」；兩層都不說出答案。
     深層連鎖的提示尤其不能只寫「用鏈鎖律」—— 那句話對這一整包都成立，
     也就是對每一題都沒用。要寫的是**這一題**最容易漏掉的那一層。 */
  const HINTS = {
    "ch-nest-007": [
      "三層：立方在最外、sin 在中間、cos²x 在最裡。先把三個導數各自寫下來再相乘。",
      "最內層 (cos²x)′ 本身還要再鏈鎖一次 —— 它不是 −sin x，這是這題最常掉的一層。"
    ],
    "ch-nest-012": [
      "由外往內剝：log、然後兩層根號。每一層只做一步，不要跳。",
      "兩層根號各自貢獻一個 1/(2√·)，所以最後分母會出現 4。三個因式由內而外排好就不會漏。"
    ],
    "ch-nest-015": [
      "最外層是 cos，但它的內層是一座指數塔 —— 那一塊沒辦法直接微分，要另外處理。",
      "先令 u 等於內層那個塔，用 log u = x·log(log x) 求出 u′，再乘上外層的 −sin(u)。"
    ],
    "ch-mix-011": [
      "外層是三次方，內層是一個商。先用商數律把內層的導數算乾淨再說。",
      "內層的導數會化簡成很短的一項（分子只剩單項）—— 別急著把分母展開。"
    ],
    "ch-pow-003": [
      "底數和指數都含 x，冪次律與指數律都不適用。取對數。",
      "log y = tan x · log(log x)。右邊用乘法律，而 log(log x) 自己還要再鏈鎖一次。"
    ],
    "ch-pow-004": [
      "取對數之後右邊會變成一個商，用商數律。",
      "log y = log(1+x²)/x。微分時分子那一項自己還要再鏈鎖一次。"
    ],
    "ch-pow-007": [
      "取對數：log y = log x · log(cos x)，兩個因子都含 x，要用乘法律。",
      "(log cos x)′ 會生出一個帶負號的三角函數 —— 那個負號是這題最常漏的地方。"
    ],
    "ch-pow-008": [
      "取對數：log y = x · log(arctan x)。",
      "乘法律的第二項要對 arctan 再微分一次，所以分母會同時出現 1+x² 與 arctan x 兩個因子。"
    ],
    "ch-pow-009": [
      "取對數之前先把 log√x 化簡成 (1/2)log x，可以少繞一圈。",
      "化簡後 log y 是兩個都含 x 的因子相乘，用乘法律。"
    ],
    "ch-pow-010": [
      "底數與指數都是複合函數。取對數：log y = cos x · log(sin(x²))。",
      "乘法律的兩項各自還要再鏈鎖一次：一邊是 (cos x)′，另一邊要對 sin(x²) 微分。"
    ],
    "ch-inv-007": [
      "arccos 的導數帶一個負號，而內層 e^{−x²} 的導數也帶一個負號。",
      "兩個負號會相消，結果是正的。分母裡的平方記得讓指數乘 2。"
    ],
    "ch-inv-008": [
      "三層：log → arctan → e^x，由外往內各寫一次。",
      "arctan 的分母是 1+(e^x)²，也就是 1+e^{2x} —— 不是 1+e^x。"
    ],
    "ch-inv-009": [
      "外層 arctan 給的是 1/(1+(內層)²)，而內層是 log(cosh x)。",
      "(log cosh x)′ 會化簡成一個雙曲函數。先把它算出來再代回外層。"
    ],
    "ch-inv-012": [
      "arsinh 的導數是 1/√(1+u²) —— 注意根號裡是加號，跟 arcsin 的減號差一個字。",
      "內層 sin(x²) 還要再鏈鎖一次，會生出一個 2x。"
    ]
  };

  problems.forEach((problem) => {
    if (HINTS[problem.id]) problem.hints = HINTS[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
