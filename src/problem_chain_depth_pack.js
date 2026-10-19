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
    "\\frac{d}{dx}\\,e^{\\sin(\\ln(x^2+1))}",
    "2*x*exp(sin(log(x^2+1)))*cos(log(x^2+1))/(x^2+1)",
    ["exponential", "log"],
    "e^u 不變、sin′=cos、log′=1/u、最內層 2x。", 100);

  d("ch-nest-003", 4,
    "\\frac{d}{dx}\\ln(\\sin(\\sqrt{x^2+1}))",
    "x*cos(sqrt(x^2+1))/(sqrt(x^2+1)*sin(sqrt(x^2+1)))",
    ["log", "trig", "radical"],
    "1/sin(·) × cos(·) × x/√(x²+1)。中間那個 cos 最常被寫成 sin。", 110);

  d("ch-nest-004", 4,
    "\\frac{d}{dx}\\arctan\\left(e^{\\sin(x^2)}\\right)",
    "2*x*exp(sin(x^2))*cos(x^2)/(1+exp(2*sin(x^2)))",
    ["inverse-trig", "exponential"],
    "arctan′ 的分母是 1+(內層)²，而內層是 e^{sin(x²)}，所以是 1+e^{2sin(x²)}。", 120);

  d("ch-nest-005", 4,
    "\\frac{d}{dx}\\cos\\left(\\ln\\left(\\sqrt{1+e^x}\\right)\\right)",
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
    "\\frac{d}{dx}\\ln\\left(\\ln\\left(\\sin^2 x+2\\right)\\right)",
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
    "\\frac{d}{dx}\\,e^{\\sqrt{\\ln(1+x^2)}}",
    "x*exp(sqrt(log(1+x^2)))/((1+x^2)*sqrt(log(1+x^2)))",
    ["exponential", "radical", "log"],
    "e^u × 1/(2√u) × 2x/(1+x²)，那個 2 剛好約掉。", 140);

  d("ch-nest-012", 5,
    "\\frac{d}{dx}\\ln\\left(1+\\sqrt{1+\\sqrt{1+x}}\\right)",
    "1/(4*sqrt(1+x)*sqrt(1+sqrt(1+x))*(1+sqrt(1+sqrt(1+x))))",
    ["log", "radical"],
    "兩層根號各給 1/(2√·)，所以分母出現 4。三個因式由內而外排好就不會漏。", 150);

  d("ch-nest-013", 6,
    "\\frac{d}{dx}\\tan(\\sin(\\cos(\\ln x)))",
    "-cos(cos(log(x)))*sin(log(x))/(x*cos(sin(cos(log(x))))^2)",
    ["trig", "log"],
    "五層，而且中間 cos 帶一個負號、最外層 tan 給 sec²。負號漏掉是最常見的錯。", 170);

  d("ch-nest-014", 5,
    "\\frac{d}{dx}\\,\\frac{1}{\\sqrt{1+\\sin^2(e^x)}}",
    "-exp(x)*sin(exp(x))*cos(exp(x))/(1+sin(exp(x))^2)^(3/2)",
    ["radical", "trig", "exponential"],
    "先寫成 (1+sin²(e^x))^{−1/2}，外層就變成 −(1/2)(·)^{−3/2}。", 150);

  d("ch-nest-015", 6,
    "\\frac{d}{dx}\\cos\\left(\\left(\\ln x\\right)^{x}\\right)",
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
    "\\frac{d}{dx}\\,\\frac{e^{\\sqrt{x}}}{1+\\ln x}",
    "(exp(sqrt(x))/(2*sqrt(x))*(1+log(x))-exp(sqrt(x))/x)/(1+log(x))^2",
    ["quotient-rule", "exponential", "log"],
    "分子分母各自都是複合的：上面 e^{√x}、下面 1+log x。", 130);

  d("ch-mix-005", 3,
    "\\frac{d}{dx}\\left(\\sqrt{x}\\,\\arctan(x^2)\\right)",
    "atan(x^2)/(2*sqrt(x))+2*x^(3/2)/(1+x^4)",
    ["product-rule", "inverse-trig"],
    "第二項：√x · 2x/(1+x⁴) = 2x^{3/2}/(1+x⁴)。", 110);

  d("ch-mix-006", 3,
    "\\frac{d}{dx}\\left(\\ln(x)\\sin(\\ln x)\\right)",
    "(sin(log(x))+log(x)*cos(log(x)))/x",
    ["product-rule", "log"],
    "兩項都會生出 1/x，提出來之後式子短很多。", 100);

  d("ch-mix-007", 4,
    "\\frac{d}{dx}\\,\\frac{\\tan\\left(\\sqrt{x}\\right)}{x}",
    "(sqrt(x)/(2*cos(sqrt(x))^2)-tan(sqrt(x)))/x^2",
    ["quotient-rule", "trig", "radical"],
    "分子的 x·sec²(√x)/(2√x) 化簡成 √x/2 · sec²(√x)。", 130);

  d("ch-mix-008", 4,
    "\\frac{d}{dx}\\left(e^{x^2}\\ln(\\sin x)\\right)",
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
    "\\frac{d}{dx}\\cos^2\\left(\\ln(1+x^2)\\right)",
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
    "\\frac{d}{dx}\\left(\\ln x\\right)^{\\tan x}",
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
    "\\frac{d}{dx}\\left(\\cos x\\right)^{\\ln x}",
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
    "\\frac{d}{dx}\\ln\\left(e^{x^2+3x}\\right)",
    "2*x+3",
    ["trap-drill", "log"],
    "log 和 e 互相抵消，整串就是 x²+3x。", 60);

  d("ch-trap-003", 3,
    "\\frac{d}{dx}\\sin\\left(\\arcsin(x^3)\\right)",
    "3*x^2",
    ["trap-drill", "inverse-trig"],
    "sin 和 arcsin 抵消（在定義域內），剩 x³。", 60);

  d("ch-trap-004", 3,
    "\\frac{d}{dx}\\,e^{\\ln(\\sin^2 x)}",
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
    "\\frac{d}{dx}\\ln\\left(\\sqrt{\\frac{1+x}{1-x}}\\right)",
    "1/(1-x^2)",
    ["trap-drill", "log"],
    "先拆成 (1/2)[log(1+x) − log(1−x)]，微分後兩項通分正好是 1/(1−x²)。", 110);

  d("ch-trap-008", 4,
    "\\frac{d}{dx}\\left(\\arctan\\frac{1}{x}+\\arctan x\\right)",
    "0",
    ["trap-drill", "inverse-trig"],
    "兩者相加在 x>0 恆等於 π/2。硬微分也會得到 0，但要多寫五行。", 100);

  d("ch-trap-009", 4,
    "\\frac{d}{dx}\\,\\frac{e^{2\\ln x}}{x}",
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
    "\\frac{d}{dx}\\ln(\\cosh(\\sin x))",
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
    "\\frac{d}{dx}\\tanh\\left(\\ln(1+x^2)\\right)",
    "2*x/((1+x^2)*cosh(log(1+x^2))^2)",
    ["hyperbolic", "log"],
    "tanh′ = sech²，內層 2x/(1+x²)。也可以先化簡成 (u²−1)/(u²+1)。", 130);

  d("ch-inv-007", 5,
    "\\frac{d}{dx}\\arccos\\left(e^{-x^2}\\right)",
    "2*x*exp(-x^2)/sqrt(1-exp(-2*x^2))",
    ["inverse-trig", "exponential"],
    "arccos′ 帶負號，內層 (e^{−x²})′ 也帶負號，兩個負號變正。", 150);

  d("ch-inv-008", 5,
    "\\frac{d}{dx}\\ln\\left(\\arctan\\left(e^x\\right)\\right)",
    "exp(x)/((1+exp(2*x))*atan(exp(x)))",
    ["log", "inverse-trig", "exponential"],
    "三層：log → arctan → e^x。arctan 的分母是 1+e^{2x}。", 140);

  d("ch-inv-009", 5,
    "\\frac{d}{dx}\\arctan\\left(\\ln(\\cosh x)\\right)",
    "tanh(x)/(1+log(cosh(x))^2)",
    ["inverse-trig", "log", "hyperbolic"],
    "內層 (log cosh x)′ = tanh x，外層分母是 1+(log cosh x)²。", 140);

  d("ch-inv-010", 4,
    "\\frac{d}{dx}\\tan\\left(\\arcsin(x^2)\\right)",
    "2*x/(1-x^4)^(3/2)",
    ["inverse-trig", "trap-drill"],
    "sec²(arcsin u) = 1/(1−u²)，乘上 arcsin 的 1/√(1−u²) 與內層 2x。", 140);

  d("ch-inv-011", 5,
    "\\frac{d}{dx}\\,e^{\\arctan(\\ln x)}",
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
    "ch-nest-014": [
      "把 1/√u 看成 u^{-1/2}，外層先給 −½u^{-3/2}。",
      "內層 sin²(eˣ) 是三層：平方 → sin → eˣ，鏈鎖出 2sin(eˣ)cos(eˣ)·eˣ —— 可併成 sin(2eˣ)·eˣ。"
    ],
    "ch-pow-005": [
      "e 的指數是 x^x —— 塔的上層先另外處理。",
      "(x^x)' = x^x(1+log x)（對數微分），再乘回 e^{x^x}。"
    ],
    "ch-pow-006": [
      "底數 x、指數 eˣ 都活著 —— 取對數：log y = eˣ·log x。",
      "乘法律兩項：eˣlog x + eˣ/x，乘回 x^{eˣ}。"
    ],
    "ch-inv-011": [
      "三層：e → arctan → log。由外往內一層一行。",
      "e^u·(1/(1+log²x))·(1/x) —— arctan 的分母是 1+(內層)²，內層是 log x。"
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
(function () {
  "use strict";
  // 課程缺口補題（10C、10D、11A）：待定係數的猜形式與重根修正、參數變異、簡諧／阻尼／受迫振盪與共振的物理題、
  // 漸近等價的替換陷阱、little-o 運算、成長階梯、ln n! 估計、分母是 ln n 的 Stolz、Euler–Maclaurin 的多項式和與尾巴修正。
  //
  // 驗算路徑（都不重用解題的代數）：
  //   猜形式題 —— 正解：把具體的 y_p 數值微分代回方程；誘答：在 k+1 個點上看 g 是否落在 {L[φ_i]} 的線性生成裡（行列式 ≠ 0 就不在）
  //   物理初值題 —— 答案跟 RK4（ode2Value）從題幹的方程與初始條件直接積出來的值逐點比
  //   穩態解與振幅 —— 從零初始條件積到暫態死光（e^{-20} 以下），再取樣
  const SOURCE = "Buzz course gap fill";

  // L[φ](x₀) = a·φ″ + b·φ′ + c·φ（數值微分）；phi 是 (t) => LaTeX
  const Lat = (phi, c, x) => ({ m: "let", f: `(${c[0]})*p+(${c[1]})*q+(${c[2]})*r`,
    with: { p: { m: "deriv", f: phi("x"), at: [x], order: 2 }, q: { m: "deriv", f: phi("x"), at: [x] }, r: { m: "value", f: phi(`(${x})`) } } });
  // 具體的 y_p 代回方程：殘差在每一個點都是 0
  const solves = (yp, c, g, xs) => xs.map((x) => ({ v: { m: "let", f: "u-v", with: { u: Lat(yp, c, x), v: { m: "value", f: g(`(${x})`) } } }, eq: 0, tol: 1e-4 }));
  // 殘差不是 0（用來推翻「這一題不能用待定係數」：給出一個真的能用的 y_p）
  const residualNonzero = (yp, c, g, x) => ({ v: { m: "let", f: "u-v", with: { u: Lat(yp, c, x), v: { m: "value", f: g(`(${x})`) } } }, ne: 0, tol: 1e-4 });
  // 行列式（字母矩陣，Laplace 展開）
  const LETTERS = "abcfghjklmnopqrs".split("");
  const detTex = (rows) => {
    if (rows.length === 1) return rows[0][0];
    return rows[0].map((entry, j) => {
      const minor = rows.slice(1).map((row) => row.filter((_, k) => k !== j));
      return `${j % 2 ? "-" : "+"}(${entry})*(${detTex(minor)})`;
    }).join("");
  };
  // 「g 落在 span{L[φ₁],…,L[φ_k]} 裡」的必要條件：k+1 個點上的 (k+1)×(k+1) 行列式為 0。算出來不是 0 ⟹ 這個形式猜不到解
  const inSpan = (phis, c, g, xs) => {
    const n = phis.length + 1;
    const withs = {};
    const rows = [];
    let index = 0;
    for (let i = 0; i < n; i += 1) {
      const row = [];
      for (let j = 0; j < n; j += 1) {
        const name = LETTERS[index]; index += 1;
        withs[name] = j < phis.length ? Lat(phis[j], c, xs[i]) : { m: "value", f: g(`(${xs[i]})`) };
        row.push(name);
      }
      rows.push(row);
    }
    return { v: { m: "let", f: detTex(rows), with: withs }, eq: 0, tol: 1e-6 };
  };
  // 二階 IVP 的數值解（RK4）：x″ = rhs(t, x, x′)，rhs 用 x（時間）、y（位移）、p（速度）
  const ivp = (rhs, x0, v0, at, t0) => ({ m: "ode2Value", f: rhs, y0: [t0 || 0, x0], yp0: v0, at });
  const ivpCases = (rhs, x0, v0, ts, t0) => ({ m: "fn", vars: ["t"], cases: ts.map((t) => ({ at: { t }, v: ivp(rhs, x0, v0, t, t0) })) });
  // 從靜止出發積到暫態消失後，量穩態振幅：x(T)² + x(T + π/(2ω))²
  const steadyAmp = (rhs, w, T) => ({ m: "let", f: "\\sqrt{u^2+v^2}", with: { u: ivp(rhs, 0, 0, T), v: ivp(rhs, 0, 0, T + Math.PI / (2 * w)) } });

  const STORY = "story-problem";
  const problems = [
    /* ── 10C 待定係數 ───────────────────────────── */
    { id: "cg-10c-001", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "y''-y'-2y=3\\cos x\\text{。用待定係數法時，特解 }y_p\\text{ 應該猜成哪一種形式？}",
      answers: ["A cos x + B sin x"], canonical: "A cos x + B sin x",
      distractors: ["A cos x", "Ax cos x + Bx sin x", "Aeˣ cos x"],
      timeLimit: 75, tags: ["undet-guess-form", "undetermined-coefficients", "second-order"],
      hints: ["cos x 微分一次會變成 sin x：y′ 那一項會把 sin 帶進來。", "先看 ±i 是不是特徵根；不是的話不用乘 x。"],
      solution: "y′ 項會把 cos x 變成 sin x，所以 cos、sin 兩個都要放。特徵根是 2、−1，不含 ±i，不必乘 x。代入可得 A = −9/10、B = −3/10。",
      solutionSteps: ["特徵方程 r² − r − 2 = 0，根 2、−1；±i 不是根，不用乘 x。", "y′ 會把 cos x 變成 sin x，只猜 A cos x 比不了 sin 的係數。", "猜 y_p = A cos x + B sin x（代入得 A = −9/10、B = −3/10）。"],
      verify: { m: "choice", options: [
        { say: "A cos x + B sin x", all: solves((t) => `-0.9\\cos(${t})-0.3\\sin(${t})`, [1, -1, -2], (t) => `3\\cos(${t})`, [0.4, 1.1, 2.3]) },
        { say: "A cos x", all: [inSpan([(t) => `\\cos(${t})`], [1, -1, -2], (t) => `3\\cos(${t})`, [0.3, 1.2])] },
        { say: "Ax cos x + Bx sin x", all: [inSpan([(t) => `${t}\\cos(${t})`, (t) => `${t}\\sin(${t})`], [1, -1, -2], (t) => `3\\cos(${t})`, [0.3, 0.9, 1.7])] },
        { say: "Aeˣ cos x", all: [inSpan([(t) => `e^{${t}}\\cos(${t})`], [1, -1, -2], (t) => `3\\cos(${t})`, [0.3, 1.2])] }
      ] } },
    { id: "cg-10c-002", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "y''+2y'+3y=x^2\\text{。用待定係數法時，特解 }y_p\\text{ 應該猜成哪一種形式？}",
      answers: ["Ax² + Bx + C"], canonical: "Ax² + Bx + C",
      distractors: ["Ax²", "Ax² + B", "Ax³ + Bx² + Cx"],
      timeLimit: 75, tags: ["undet-guess-form", "undetermined-coefficients", "second-order"],
      hints: ["微分會把 x² 降成 x、再降成常數：這些次數都會出現在左邊。", "0 是不是特徵根？決定要不要升次。"],
      solution: "y′、y″ 會從 x² 生出 x 與常數項，所以同次以下的每一項都要有。0 不是特徵根，不用升次。代入得 A = 1/3、B = −4/9、C = 2/27。",
      solutionSteps: ["0 不是 r² + 2r + 3 = 0 的根，多項式不用乘 x。", "y′、y″ 會生出 x 與常數項，猜的多項式要完整到常數。", "猜 Ax² + Bx + C（代入得 A = 1/3、B = −4/9、C = 2/27）。"],
      verify: { m: "choice", options: [
        { say: "Ax² + Bx + C", all: solves((t) => `\\frac{${t}^2}{3}-\\frac{4${t}}{9}+\\frac{2}{27}`, [1, 2, 3], (t) => `${t}^2`, [0.4, 1.1, 2.3]) },
        { say: "Ax²", all: [inSpan([(t) => `${t}^2`], [1, 2, 3], (t) => `${t}^2`, [0.5, 1.4])] },
        { say: "Ax² + B", all: [inSpan([(t) => `${t}^2`, (t) => "1"], [1, 2, 3], (t) => `${t}^2`, [0.3, 1.1, 2.0])] },
        { say: "Ax³ + Bx² + Cx", all: [inSpan([(t) => `${t}^3`, (t) => `${t}^2`, (t) => `${t}`], [1, 2, 3], (t) => `${t}^2`, [0.3, 0.9, 1.6, 2.4])] }
      ] } },
    { id: "cg-10c-003", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "y''-4y=xe^{x}\\text{。用待定係數法時，特解 }y_p\\text{ 應該猜成哪一種形式？}",
      answers: ["(Ax + B)eˣ"], canonical: "(Ax + B)eˣ",
      distractors: ["Axeˣ", "Aeˣ", "(Ax² + Bx)eˣ"],
      timeLimit: 75, tags: ["undet-guess-form", "undetermined-coefficients", "second-order"],
      hints: ["右邊是「一次多項式 × eˣ」：猜的時候多項式那一部分要完整。", "1 是不是特徵根？特徵根是 ±2。"],
      solution: "多項式乘 eˣ 時，猜「同次的完整多項式 × eˣ」。1 不是特徵根（根是 ±2），不必再乘 x。代入得 A = −1/3、B = −2/9。",
      solutionSteps: ["特徵根 ±2，1 不是根，不用乘 x。", "(Axeˣ)″ 會生出 eˣ 項，所以常數 B 也要放。", "猜 (Ax + B)eˣ（代入得 A = −1/3、B = −2/9）。"],
      verify: { m: "choice", options: [
        { say: "(Ax + B)eˣ", all: solves((t) => `\\left(-\\frac{${t}}{3}-\\frac{2}{9}\\right)e^{${t}}`, [1, 0, -4], (t) => `${t}e^{${t}}`, [0.4, 1.1, 2.3]) },
        { say: "Axeˣ", all: [inSpan([(t) => `${t}e^{${t}}`], [1, 0, -4], (t) => `${t}e^{${t}}`, [0.5, 1.4])] },
        { say: "Aeˣ", all: [inSpan([(t) => `e^{${t}}`], [1, 0, -4], (t) => `${t}e^{${t}}`, [0.5, 1.4])] },
        { say: "(Ax² + Bx)eˣ", all: [inSpan([(t) => `${t}^2e^{${t}}`, (t) => `${t}e^{${t}}`], [1, 0, -4], (t) => `${t}e^{${t}}`, [0.3, 1.0, 1.8])] }
      ] } },
    { id: "cg-10c-004", topic: "integrals", rank: 3, answerKind: "expression", variable: "x",
      prompt: "y''-2y'+y=e^{x},\\quad y(0)=0,\\ y'(0)=0,\\quad \\text{求 }y(x)",
      answer: "x^2*exp(x)/2",
      timeLimit: 150, tags: ["undet-modification-rule", "undetermined-coefficients", "repeated-root", "ivp"],
      hints: ["特徵方程是 (r − 1)² = 0：eˣ 和 xeˣ 都已經是齊次解。", "猜 Aeˣ、Axeˣ 代進去都會得到 0，要再多乘一次 x。"],
      solution: "1 是二重特徵根，eˣ、xeˣ 都是齊次解，特解要猜 Ax²eˣ：代入得 2A = 1，A = 1/2。通解 (C₁ + C₂x)eˣ + x²eˣ/2；初始條件給 C₁ = C₂ = 0。",
      solutionSteps: ["(r − 1)² = 0，重根 1；eˣ、xeˣ 都是齊次解。", "猜 y_p = Ax²eˣ：y_p″ − 2y_p′ + y_p = 2Aeˣ ⟹ A = 1/2。", "y = (C₁ + C₂x)eˣ + x²eˣ/2；y(0) = C₁ = 0，y′(0) = C₂ = 0。", "y = x²eˣ/2。"],
      verify: { m: "ode2const", a: 1, b: -2, c: 1, g: "e^{x}", y0: [0, 0], yp0: [0, 0] } },
    { id: "cg-10c-005", topic: "integrals", rank: 3, answerKind: "expression", variable: "x",
      prompt: "y''-4y'+4y=6e^{2x},\\quad y(0)=1,\\ y'(0)=1,\\quad \\text{求 }y(x)",
      answer: "(3*x^2-x+1)*exp(2*x)",
      timeLimit: 170, tags: ["undet-modification-rule", "undetermined-coefficients", "repeated-root", "ivp"],
      hints: ["2 是特徵方程 (r − 2)² = 0 的二重根。", "特解要乘到 x²；之後齊次部分 (C₁ + C₂x)e^{2x} 的係數用初始條件定。"],
      solution: "二重根 2，特解猜 Ax²e^{2x}：代入得 2A = 6，A = 3。y = (C₁ + C₂x + 3x²)e^{2x}；y(0) = C₁ = 1，y′(0) = C₂ + 2C₁ = 1 ⟹ C₂ = −1。",
      solutionSteps: ["(r − 2)² = 0：e^{2x}、xe^{2x} 是齊次解，猜 y_p = Ax²e^{2x}。", "代入：2Ae^{2x} = 6e^{2x} ⟹ A = 3。", "y = (C₁ + C₂x + 3x²)e^{2x}；C₁ = 1，C₂ + 2 = 1 ⟹ C₂ = −1。", "y = (3x² − x + 1)e^{2x}。"],
      verify: { m: "ode2const", a: 1, b: -4, c: 4, g: "6e^{2x}", y0: [0, 1], yp0: [0, 1] } },

    /* ── 10C 參數變異 ───────────────────────────── */
    { id: "cg-10c-006", topic: "integrals", rank: 4, answerKind: "expression", variable: "x",
      prompt: "y''+y=\\sec x,\\ -\\tfrac{\\pi}{2}<x<\\tfrac{\\pi}{2},\\quad y(0)=0,\\ y'(0)=0,\\quad \\text{用參數變異法求 }y(x)",
      answer: "x*sin(x)+cos(x)*log(cos(x))",
      timeLimit: 240, tags: ["vop-formula", "variation-of-parameters", "second-order", "ivp"],
      hints: ["y₁ = cos x、y₂ = sin x，Wronskian W = 1。", "u₁′ = −y₂g/W、u₂′ = y₁g/W；其中一個積分是 ∫ tan x dx。"],
      solution: "W = 1。u₁′ = −tan x ⟹ u₁ = ln(cos x)；u₂′ = 1 ⟹ u₂ = x。y_p = cos x ln(cos x) + x sin x，剛好滿足兩個零初始條件。",
      solutionSteps: ["y₁ = cos x、y₂ = sin x，W = cos²x + sin²x = 1。", "u₁′ = −sin x sec x = −tan x ⟹ u₁ = ln(cos x)；u₂′ = 1 ⟹ u₂ = x。", "y_p = cos x ln(cos x) + x sin x；y_p(0) = 0、y_p′(0) = 0，齊次部分係數都是 0。", "y = x sin x + cos x ln(cos x)。"],
      verify: { m: "ode2const", a: 1, b: 0, c: 1, g: "\\sec x", y0: [0, 0], yp0: [0, 0] } },
    { id: "cg-10c-007", topic: "integrals", rank: 4, answerKind: "expression", variable: "x",
      prompt: "y''+y=\\tan x,\\ -\\tfrac{\\pi}{2}<x<\\tfrac{\\pi}{2},\\quad y(0)=0,\\ y'(0)=0,\\quad \\text{用參數變異法求 }y(x)",
      answer: "sin(x)-cos(x)*log(1/cos(x)+tan(x))",
      timeLimit: 260, tags: ["vop-formula", "variation-of-parameters", "second-order", "ivp"],
      hints: ["u₁′ = −sin x tan x = −sin²x/cos x，把 sin²x 寫成 1 − cos²x。", "∫ sec x dx = ln|sec x + tan x|；最後別忘了用初始條件補齊次解。"],
      solution: "u₁′ = cos x − sec x、u₂′ = sin x，得 y_p = −cos x ln(sec x + tan x)。y_p(0) = 0 但 y_p′(0) = −1，所以再加 sin x。",
      solutionSteps: ["W = 1；u₁′ = −sin x tan x = cos x − sec x，u₂′ = cos x tan x = sin x。", "u₁ = sin x − ln(sec x + tan x)，u₂ = −cos x ⟹ y_p = −cos x ln(sec x + tan x)。", "y_p(0) = 0、y_p′(0) = −1：y = y_p + A cos x + B sin x，A = 0、B = 1。", "y = sin x − cos x ln(sec x + tan x)。"],
      verify: { m: "ode2const", a: 1, b: 0, c: 1, g: "\\tan x", y0: [0, 0], yp0: [0, 0] } },
    { id: "cg-10c-008", topic: "integrals", rank: 4, answerKind: "expression", variable: "x",
      prompt: "y''-2y'+y=\\frac{e^{x}}{x},\\ x>0,\\quad y(1)=0,\\ y'(1)=0,\\quad \\text{用參數變異法求 }y(x)",
      answer: "x*exp(x)*log(x)+(1-x)*exp(x)",
      timeLimit: 260, tags: ["vop-formula", "variation-of-parameters", "repeated-root", "ivp"],
      hints: ["y₁ = eˣ、y₂ = xeˣ，W = e^{2x}。", "u₁′ = −y₂g/W、u₂′ = y₁g/W 化簡後都很乾淨；初始條件在 x = 1。"],
      solution: "W = e^{2x}，u₁′ = −1、u₂′ = 1/x，y_p = xeˣ ln x − xeˣ。通解 xeˣ ln x + (A + Bx)eˣ；x = 1 的兩個條件給 A = 1、B = −1。",
      solutionSteps: ["y₁ = eˣ、y₂ = xeˣ，W = e^{2x}；u₁′ = −1、u₂′ = 1/x。", "u₁ = −x、u₂ = ln x ⟹ y_p = xeˣ ln x − xeˣ（−xeˣ 併進齊次解）。", "y = xeˣ ln x + (A + Bx)eˣ；y(1) = (A + B)e = 0，y′(1) = (1 + A + 2B)e = 0 ⟹ A = 1、B = −1。", "y = xeˣ ln x + (1 − x)eˣ。"],
      verify: { m: "ode2const", a: 1, b: -2, c: 1, g: "\\frac{e^{x}}{x}", y0: [1, 0], yp0: [1, 0] } },
    { id: "cg-10c-009", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "y''+y=g(x)\\text{。下列哪一個右邊 }g(x)\\text{ 不能用待定係數法，必須用參數變異法？}",
      answers: ["tan x"], canonical: "tan x",
      distractors: ["x²eˣ", "eˣ cos 2x", "x sin x"],
      timeLimit: 60, tags: ["vop-when-to-use", "variation-of-parameters", "undetermined-coefficients"],
      hints: ["待定係數能用的條件：g 一直微分下去只會出現有限幾種函數。", "x sin x 雖然撞到齊次解，乘 x 修正後仍然是待定係數。"],
      solution: "x²eˣ、eˣ cos 2x、x sin x 一直微分只會出現有限幾種函數，都能猜（x sin x 要乘 x）。tan x 的導數 sec²x、2sec²x tan x… 越來越多種，猜不完，只能參數變異。",
      solutionSteps: ["待定係數要求 g 與它的各階導數只張出有限維的函數空間。", "x²eˣ、eˣ cos 2x 直接猜；x sin x 撞到齊次解，乘 x 後仍可猜。", "tan x 的導數 sec²x、2sec²x tan x… 種類一直增加 ⟹ 只能參數變異：tan x。"],
      verify: { m: "choice", options: [
        { say: "tan x", unknown: "tan x 的各階導數張不成有限維空間：這是待定係數的適用範圍本身，數值上判不了" },
        { say: "x²eˣ", all: [residualNonzero((t) => `\\left(\\frac{${t}^2}{2}-${t}+\\frac12\\right)e^{${t}}`, [1, 0, 1], (t) => `${t}^2e^{${t}}`, 0.7), residualNonzero((t) => `\\left(\\frac{${t}^2}{2}-${t}+\\frac12\\right)e^{${t}}`, [1, 0, 1], (t) => `${t}^2e^{${t}}`, 1.9)] },
        { say: "eˣ cos 2x", all: [residualNonzero((t) => `\\frac{e^{${t}}(2\\sin(2${t})-\\cos(2${t}))}{10}`, [1, 0, 1], (t) => `e^{${t}}\\cos(2${t})`, 0.7), residualNonzero((t) => `\\frac{e^{${t}}(2\\sin(2${t})-\\cos(2${t}))}{10}`, [1, 0, 1], (t) => `e^{${t}}\\cos(2${t})`, 1.9)] },
        { say: "x sin x", all: [residualNonzero((t) => `\\frac{${t}\\sin(${t})-${t}^2\\cos(${t})}{4}`, [1, 0, 1], (t) => `${t}\\sin(${t})`, 0.7), residualNonzero((t) => `\\frac{${t}\\sin(${t})-${t}^2\\cos(${t})}{4}`, [1, 0, 1], (t) => `${t}\\sin(${t})`, 1.9)] }
      ] } },
    { id: "cg-10c-010", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "y''-3y'+2y=g(x)\\text{。下列哪一個右邊 }g(x)\\text{ 不能用待定係數法，必須用參數變異法？}",
      answers: ["ln x"], canonical: "ln x",
      distractors: ["x³", "e²ˣ", "sin x"],
      timeLimit: 60, tags: ["vop-when-to-use", "variation-of-parameters", "undetermined-coefficients"],
      hints: ["把每個選項一直微分下去，看會不會冒出越來越多種函數。", "e²ˣ 剛好是齊次解，但「要乘 x」不等於「不能用待定係數」。"],
      solution: "x³ 猜三次多項式、sin x 猜 A cos x + B sin x、e²ˣ 是齊次解就猜 Axe²ˣ。ln x 的導數是 1/x、−1/x²、2/x³…，種類無限多，只能參數變異。",
      solutionSteps: ["x³ → 猜完整三次多項式；sin x → 猜 A cos x + B sin x。", "e²ˣ 是齊次解（特徵根 1、2），猜 Axe²ˣ 即可，仍是待定係數。", "ln x 的導數 1/x、−1/x²、… 種類無限多 ⟹ 只能參數變異：ln x。"],
      verify: { m: "choice", options: [
        { say: "ln x", unknown: "ln x 的各階導數張不成有限維空間：這是待定係數的適用範圍本身，數值上判不了" },
        { say: "x³", all: [residualNonzero((t) => `\\frac{${t}^3}{2}+\\frac{9${t}^2}{4}+\\frac{21${t}}{4}+\\frac{45}{8}`, [1, -3, 2], (t) => `${t}^3`, 0.7), residualNonzero((t) => `\\frac{${t}^3}{2}+\\frac{9${t}^2}{4}+\\frac{21${t}}{4}+\\frac{45}{8}`, [1, -3, 2], (t) => `${t}^3`, 1.9)] },
        { say: "e²ˣ", all: [residualNonzero((t) => `${t}e^{2${t}}`, [1, -3, 2], (t) => `e^{2${t}}`, 0.7), residualNonzero((t) => `${t}e^{2${t}}`, [1, -3, 2], (t) => `e^{2${t}}`, 1.9)] },
        { say: "sin x", all: [residualNonzero((t) => `0.3\\cos(${t})+0.1\\sin(${t})`, [1, -3, 2], (t) => `\\sin(${t})`, 0.7), residualNonzero((t) => `0.3\\cos(${t})+0.1\\sin(${t})`, [1, -3, 2], (t) => `\\sin(${t})`, 1.9)] }
      ] } },
    { id: "cg-10c-011", topic: "integrals", rank: 3, answerKind: "expression", variable: "x",
      prompt: "3y''+3y=\\csc x,\\ 0<x<\\pi,\\quad y\\left(\\tfrac{\\pi}{2}\\right)=0,\\ y'\\left(\\tfrac{\\pi}{2}\\right)=0,\\quad \\text{用參數變異法求 }y(x)",
      answer: "(sin(x)*log(sin(x))-x*cos(x))/3+pi*cos(x)/6",
      timeLimit: 260, tags: ["vop-standard-form", "variation-of-parameters", "second-order", "ivp"],
      hints: ["參數變異的公式要在首項係數是 1 的標準形下用：先整條除以 3。", "y₁ = cos x、y₂ = sin x，W = 1；初始條件在 x = π/2。"],
      solution: "化成 y″ + y = csc x/3。u₁′ = −1/3、u₂′ = cot x/3，y_p = (sin x ln sin x − x cos x)/3。在 π/2：y_p = 0、y_p′ = π/6，補 (π/6)cos x。",
      solutionSteps: ["除以 3：y″ + y = (csc x)/3，g = csc x / 3。", "W = 1：u₁′ = −1/3、u₂′ = cot x / 3 ⟹ y_p = (sin x ln(sin x) − x cos x)/3。", "y_p(π/2) = 0、y_p′(π/2) = π/6；y = y_p + A cos x + B sin x ⟹ B = 0、A = π/6。", "y = (sin x ln(sin x) − x cos x)/3 + (π/6)cos x。"],
      verify: { m: "ode2const", a: 3, b: 0, c: 3, g: "\\csc x", y0: [Math.PI / 2, 0], yp0: [Math.PI / 2, 0] } },

    /* ── 10C 簡諧振盪 ───────────────────────────── */
    { id: "cg-10c-012", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{質量 }0.5\\text{ kg 的木塊接在彈簧常數 }18\\text{ N/m 的彈簧上，在光滑水平面上無阻尼振動。求振動週期 }T\\text{（秒）}",
      answer: "pi/3",
      timeLimit: 60, tags: ["sho-model", "harmonic-oscillator", STORY],
      hints: ["運動方程 m x″ + k x = 0，角頻率 ω₀ = √(k/m)。", "週期是角頻率走完 2π 所需的時間。"],
      solution: "ω₀ = √(k/m) = √(18/0.5) = 6 rad/s，T = 2π/ω₀ = π/3 ≈ 1.047 秒。",
      solutionSteps: ["0.5x″ + 18x = 0 ⟹ x″ + 36x = 0，ω₀ = 6 rad/s。", "T = 2π/ω₀ = 2π/6 = π/3 ≈ 1.047 秒。"],
      verify: { m: "value", f: "2\\pi\\sqrt{0.5/18}" } },
    { id: "cg-10c-013", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{一個彈簧振子的週期是 }1.2\\text{ 秒。彈簧不變，把質量換成原來的 }4\\text{ 倍，新的週期是多少秒？}",
      answer: "2.4",
      timeLimit: 60, tags: ["sho-model", "harmonic-oscillator", STORY],
      hints: ["T = 2π√(m/k)：週期跟質量的哪一個次方成正比？", "質量變 4 倍，√m 變幾倍？"],
      solution: "T = 2π√(m/k) ∝ √m。質量變 4 倍，週期變 √4 = 2 倍：1.2 × 2 = 2.4 秒。",
      solutionSteps: ["T = 2π√(m/k)，k 不變時 T ∝ √m。", "m → 4m：T → √4·T = 2 × 1.2 = 2.4 秒。"],
      verify: { m: "value", f: "1.2\\cdot\\frac{2\\pi\\sqrt{4\\cdot0.3/7}}{2\\pi\\sqrt{0.3/7}}" } },
    { id: "cg-10c-014", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{把 }0.4\\text{ kg 的物體掛在鉛直彈簧上，平衡時彈簧伸長 }0.098\\text{ m（}g=9.8\\text{ m/s}^2\\text{）。讓它上下做無阻尼振動，求角頻率 }\\omega_0\\text{（rad/s）}",
      answer: "10",
      timeLimit: 75, tags: ["sho-model", "harmonic-oscillator", STORY],
      hints: ["平衡時彈力等於重力：k·(伸長量) = mg，先求 k。", "ω₀ = √(k/m)。"],
      solution: "kΔ = mg ⟹ k = 0.4·9.8/0.098 = 40 N/m。ω₀ = √(40/0.4) = 10 rad/s。",
      solutionSteps: ["平衡：kΔ = mg ⟹ k = 0.4 × 9.8 / 0.098 = 40 N/m。", "ω₀ = √(k/m) = √(40/0.4) = 10 rad/s。"],
      verify: { m: "value", f: "\\sqrt{\\frac{0.4\\cdot9.8/0.098}{0.4}}" } },
    { id: "cg-10c-015", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "x''+4x=0,\\ x(0)=-1,\\ x'(0)=2\\sqrt{3}\\text{。把解寫成 }x(t)=A\\cos(2t-\\varphi)\\text{，}A>0,\\ -\\pi<\\varphi\\le\\pi\\text{。求 }\\varphi",
      answer: "2*pi/3",
      timeLimit: 150, tags: ["sho-amplitude-phase", "harmonic-oscillator", "trig"],
      hints: ["展開 A cos(2t − φ)：t = 0 給 A cos φ = x(0)，微分後給 2A sin φ = x′(0)。", "cos φ < 0、sin φ > 0：φ 落在第幾象限？直接按計算機的 arctan 會落錯象限。"],
      solution: "A cos φ = −1、A sin φ = √3 ⟹ A = 2，cos φ = −1/2、sin φ = √3/2，φ 在第二象限：φ = 2π/3。arctan(−√3) = −π/3 是錯的象限。",
      solutionSteps: ["x(0) = A cos φ = −1；x′(0) = 2A sin φ = 2√3 ⟹ A sin φ = √3。", "A = √(1 + 3) = 2；cos φ = −1/2、sin φ = √3/2。", "第二象限：φ = 2π/3（不是 arctan(−√3) = −π/3）。"],
      verify: { m: "let", f: "2s", with: { s: { m: "criticalPoint", f: "-\\cos(2x)+\\sqrt{3}\\sin(2x)", x0: 1 } } } },
    { id: "cg-10c-016", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "x''+9x=0,\\ x(0)=-1,\\ x'(0)=-3\\text{。把解寫成 }x(t)=A\\cos(3t-\\varphi)\\text{，}A>0,\\ -\\pi<\\varphi\\le\\pi\\text{。求 }\\varphi",
      answer: "-3*pi/4",
      timeLimit: 150, tags: ["sho-amplitude-phase", "harmonic-oscillator", "trig"],
      hints: ["A cos φ = x(0)，3A sin φ = x′(0)。", "cos φ 與 sin φ 都是負的：φ 在第三象限，要落在 (−π, π] 裡。"],
      solution: "A cos φ = −1、A sin φ = −1 ⟹ A = √2，φ 在第三象限。(−π, π] 裡的第三象限角是 −3π/4（等同 5π/4，但要寫在指定範圍內）。",
      solutionSteps: ["x(0) = A cos φ = −1；x′(0) = 3A sin φ = −3 ⟹ A sin φ = −1。", "A = √2；cos φ = sin φ = −1/√2，第三象限。", "落在 (−π, π]：φ = −3π/4。"],
      verify: { m: "let", f: "3s-2\\pi", with: { s: { m: "criticalPoint", f: "-\\cos(3x)-\\sin(3x)", x0: 1.3 } } } },
    { id: "cg-10c-017", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{質量 }2\\text{ kg、彈簧常數 }200\\text{ N/m 的無阻尼彈簧振子，在離平衡點 }0.1\\text{ m 處以 }1\\text{ m/s 的速度往外推出。求最大位移（振幅，公尺）}",
      answer: "sqrt(2)/10",
      timeLimit: 120, tags: ["sho-energy", "harmonic-oscillator", STORY],
      hints: ["總能量 = 彈性位能 ½kx² + 動能 ½mv²，在運動中不變。", "到最大位移時速度是 0，全部能量都是彈性位能。"],
      solution: "E = ½·200·0.1² + ½·2·1² = 1 + 1 = 2 J。最大位移時 ½kA² = E ⟹ A² = 4/200 = 0.02，A = √2/10 ≈ 0.1414 m。",
      solutionSteps: ["E = ½kx₀² + ½mv₀² = ½·200·0.01 + ½·2·1 = 2 J。", "最大位移處 v = 0：½kA² = 2 ⟹ A² = 0.02。", "A = √0.02 = √2/10 ≈ 0.1414 m。"],
      verify: { m: "extremeOf", kind: "sup", integer: false, f: "0.1\\cos(10x)+0.1\\sin(10x)", range: [0, 1] } },
    { id: "cg-10c-018", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{質量 }0.5\\text{ kg、彈簧常數 }8\\text{ N/m 的無阻尼彈簧振子，在 }x=0.3\\text{ m 處速度為 }0.8\\text{ m/s。求運動中的最大速率（m/s）}",
      answer: "2*sqrt(13)/5",
      timeLimit: 120, tags: ["sho-energy", "harmonic-oscillator", STORY],
      hints: ["總能量 ½kx² + ½mv² 守恆。", "速率最大時在哪個位置？那時彈性位能是多少？"],
      solution: "E = ½·8·0.09 + ½·0.5·0.64 = 0.36 + 0.16 = 0.52 J。通過平衡點時位能為 0：½·0.5·v² = 0.52 ⟹ v² = 2.08，v = 2√13/5 ≈ 1.442 m/s。",
      solutionSteps: ["E = ½kx² + ½mv² = 0.36 + 0.16 = 0.52 J。", "速率最大在平衡點 x = 0：½mv_max² = E ⟹ v_max² = 2.08。", "v_max = √2.08 = 2√13/5 ≈ 1.442 m/s。"],
      verify: { m: "extremeOf", kind: "sup", integer: false, f: "-1.2\\sin(4x)+0.8\\cos(4x)", range: [0, 2] } },

    /* ── 10D 阻尼振盪 ───────────────────────────── */
    { id: "cg-10d-001", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "2x''+8x'+8x=0\\text{ 描述的阻尼振盪屬於哪一種？}",
      answers: ["臨界阻尼"], canonical: "臨界阻尼", distractors: ["欠阻尼", "過阻尼"],
      timeLimit: 45, tags: ["damped-classify", "damped-oscillator", "second-order"],
      hints: ["看特徵方程 m r² + c r + k = 0 的判別式 c² − 4mk。", "判別式 < 0、= 0、> 0 各對應一種阻尼。"],
      solution: "c² − 4mk = 64 − 4·2·8 = 0，特徵方程有二重根 −2，是臨界阻尼。",
      solutionSteps: ["m = 2、c = 8、k = 8：c² − 4mk = 64 − 64 = 0。", "判別式 = 0 ⟹ 二重根 r = −2 ⟹ 臨界阻尼。"],
      verify: { m: "choice", options: [
        { say: "臨界阻尼", all: [{ v: { m: "value", f: "8^2-4\\cdot2\\cdot8" }, eq: 0 }] },
        { say: "欠阻尼", all: [{ v: { m: "value", f: "8^2-4\\cdot2\\cdot8" }, lt: 0 }] },
        { say: "過阻尼", all: [{ v: { m: "value", f: "8^2-4\\cdot2\\cdot8" }, gt: 0 }] }
      ] } },
    { id: "cg-10d-002", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{質量 }1\\text{ kg、阻尼係數 }c=6\\text{ kg/s、彈簧常數 }k=25\\text{ N/m。這是欠阻尼，求擬頻率 }\\omega_d\\text{（rad/s）}",
      answer: "4",
      timeLimit: 60, tags: ["damped-classify", "damped-oscillator", STORY],
      hints: ["方程 x″ + 6x′ + 25x = 0，解特徵方程。", "複數根 α ± βi 的虛部 β 就是擬頻率。"],
      solution: "r² + 6r + 25 = 0 ⟹ r = −3 ± 4i。判別式 36 − 100 < 0 是欠阻尼，ω_d = 4 rad/s（也等於 √(ω₀² − γ²) = √(25 − 9)）。",
      solutionSteps: ["x″ + 6x′ + 25x = 0：r = (−6 ± √(36 − 100))/2 = −3 ± 4i。", "欠阻尼，解是 e^{−3t}(A cos 4t + B sin 4t)，ω_d = 4 rad/s。"],
      verify: { m: "value", f: "\\frac{\\sqrt{4\\cdot1\\cdot25-6^2}}{2\\cdot1}" } },
    { id: "cg-10d-003", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{質量 }0.5\\text{ kg、阻尼係數 }c=5\\text{ kg/s、彈簧常數 }k=8\\text{ N/m 的阻尼振子屬於哪一種？}",
      answers: ["過阻尼"], canonical: "過阻尼", distractors: ["欠阻尼", "臨界阻尼"],
      timeLimit: 45, tags: ["damped-classify", "damped-oscillator", STORY],
      hints: ["方程是 m x″ + c x′ + k x = 0。", "比較 c² 與 4mk。"],
      solution: "c² − 4mk = 25 − 4·0.5·8 = 9 > 0，特徵方程兩個相異負實根（−1、−9），過阻尼，不會來回振盪。",
      solutionSteps: ["c² − 4mk = 25 − 16 = 9 > 0。", "兩相異實根 −1、−9 ⟹ 過阻尼。"],
      verify: { m: "choice", options: [
        { say: "過阻尼", all: [{ v: { m: "value", f: "5^2-4\\cdot0.5\\cdot8" }, gt: 0 }] },
        { say: "欠阻尼", all: [{ v: { m: "value", f: "5^2-4\\cdot0.5\\cdot8" }, lt: 0 }] },
        { say: "臨界阻尼", all: [{ v: { m: "value", f: "5^2-4\\cdot0.5\\cdot8" }, eq: 0 }] }
      ] } },
    { id: "cg-10d-004", topic: "integrals", rank: 3, answerKind: "expression", variable: "t",
      prompt: "x''+5x'+4x=0,\\quad x(0)=1,\\ x'(0)=2,\\quad \\text{求 }x(t)",
      answer: "2*exp(-t)-exp(-4*t)",
      timeLimit: 120, tags: ["damped-overdamped-solve", "damped-oscillator", "ivp"],
      hints: ["特徵方程 r² + 5r + 4 = 0 有兩個負實根。", "x = C₁e^{r₁t} + C₂e^{r₂t}，兩個初始條件解 C₁、C₂。"],
      solution: "根 −1、−4（過阻尼）。x = C₁e^{−t} + C₂e^{−4t}；C₁ + C₂ = 1、−C₁ − 4C₂ = 2 ⟹ C₂ = −1、C₁ = 2。",
      solutionSteps: ["r² + 5r + 4 = (r + 1)(r + 4) = 0：r = −1、−4。", "x = C₁e^{−t} + C₂e^{−4t}；C₁ + C₂ = 1，−C₁ − 4C₂ = 2。", "C₂ = −1、C₁ = 2：x = 2e^{−t} − e^{−4t}。"],
      verify: ivpCases("-5p-4y", 1, 2, [0.4, 1.3, 2.6]) },
    { id: "cg-10d-005", topic: "integrals", rank: 3, answerKind: "expression", variable: "t",
      prompt: "x''+6x'+5x=0,\\quad x(0)=0,\\ x'(0)=4,\\quad \\text{求 }x(t)",
      answer: "exp(-t)-exp(-5*t)",
      timeLimit: 120, tags: ["damped-overdamped-solve", "damped-oscillator", "ivp"],
      hints: ["先因式分解特徵方程。", "x(0) = 0 告訴你兩個係數的關係。"],
      solution: "根 −1、−5。x = C₁e^{−t} + C₂e^{−5t}；C₁ + C₂ = 0、−C₁ − 5C₂ = 4 ⟹ C₁ = 1、C₂ = −1。",
      solutionSteps: ["r² + 6r + 5 = (r + 1)(r + 5)：r = −1、−5。", "C₁ + C₂ = 0、−C₁ − 5C₂ = 4 ⟹ C₁ = 1、C₂ = −1。", "x = e^{−t} − e^{−5t}。"],
      verify: ivpCases("-6p-5y", 0, 4, [0.4, 1.3, 2.6]) },
    { id: "cg-10d-006", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{質量 }2\\text{ kg、彈簧常數 }50\\text{ N/m 的振子，阻尼係數 }c\\,\\text{ 調到剛好臨界阻尼。從 }x(0)=0.1\\text{ m 靜止放開，求 }t=0.2\\text{ 秒時的位移（公尺）}",
      answer: "0.2*exp(-1)",
      timeLimit: 180, tags: ["damped-model", "damped-oscillator", STORY, "repeated-root"],
      hints: ["臨界阻尼：c² = 4mk。", "二重根 r 的解是 (C₁ + C₂t)e^{rt}。"],
      solution: "c = 2√(mk) = 20，方程化成 x″ + 10x′ + 25x = 0，重根 −5。x = (0.1 + 0.5t)e^{−5t}，x(0.2) = 0.2/e ≈ 0.0736 m。",
      solutionSteps: ["臨界：c = 2√(2·50) = 20 kg/s；方程 x″ + 10x′ + 25x = 0，重根 −5。", "x = (C₁ + C₂t)e^{−5t}：C₁ = 0.1，C₂ − 5C₁ = 0 ⟹ C₂ = 0.5。", "x(0.2) = (0.1 + 0.1)e^{−1} = 0.2/e ≈ 0.0736 m。"],
      verify: ivp("-\\frac{2\\sqrt{2\\cdot50}}{2}p-\\frac{50}{2}y", 0.1, 0, 0.2) },
    { id: "cg-10d-007", topic: "integrals", rank: 3, answerKind: "expression", variable: "t",
      prompt: "\\text{質量 }1\\text{ kg、阻尼係數 }2\\text{ kg/s、彈簧常數 }5\\text{ N/m，}x(0)=1\\text{ m、}x'(0)=0\\text{。建立方程並求位移 }x(t)",
      answer: "exp(-t)*(cos(2*t)+sin(2*t)/2)",
      timeLimit: 180, tags: ["damped-model", "damped-oscillator", STORY, "complex-roots"],
      hints: ["m x″ + c x′ + k x = 0，代入數字。", "根是 α ± βi 時解是 e^{αt}(C₁ cos βt + C₂ sin βt)；x′(0) 要用乘法律。"],
      solution: "x″ + 2x′ + 5x = 0，r = −1 ± 2i。x = e^{−t}(C₁ cos 2t + C₂ sin 2t)；C₁ = 1，x′(0) = −C₁ + 2C₂ = 0 ⟹ C₂ = 1/2。",
      solutionSteps: ["x″ + 2x′ + 5x = 0：r = −1 ± 2i，欠阻尼。", "x = e^{−t}(C₁ cos 2t + C₂ sin 2t)；x(0) = C₁ = 1。", "x′(0) = −C₁ + 2C₂ = 0 ⟹ C₂ = 1/2：x = e^{−t}(cos 2t + ½ sin 2t)。"],
      verify: ivpCases("-2p-5y", 1, 0, [0.5, 1.4, 2.9]) },

    /* ── 10D 受迫振盪 ───────────────────────────── */
    { id: "cg-10d-008", topic: "integrals", rank: 3, answerKind: "expression", variable: "t",
      prompt: "x''+2x'+5x=10\\cos t\\text{。求穩態解 }x_{ss}(t)\\text{（長時間後留下來的週期解）}",
      answer: "2*cos(t)+sin(t)",
      timeLimit: 150, tags: ["driven-steady-state", "driven-oscillator", "undetermined-coefficients"],
      hints: ["猜 x_ss = A cos t + B sin t，代入比較 cos、sin 的係數。", "齊次解有 e^{−t} 因子，會消失，不算在穩態解裡。"],
      solution: "代入 A cos t + B sin t：cos 係數 4A + 2B = 10，sin 係數 4B − 2A = 0 ⟹ A = 2、B = 1。",
      solutionSteps: ["猜 x_ss = A cos t + B sin t，x″ = −x_ss。", "cos：−A + 2B + 5A = 10；sin：−B − 2A + 5B = 0 ⟹ A = 2B。", "10B = 10 ⟹ B = 1、A = 2：x_ss = 2 cos t + sin t。"],
      verify: ivpCases("10\\cos x-2p-5y", 0, 0, [40, 40.7, 41.5]) },
    { id: "cg-10d-009", topic: "integrals", rank: 3, answerKind: "expression", variable: "t",
      prompt: "x''+4x'+3x=65\\cos 2t\\text{。求穩態解 }x_{ss}(t)",
      answer: "-cos(2*t)+8*sin(2*t)",
      timeLimit: 150, tags: ["driven-steady-state", "driven-oscillator", "undetermined-coefficients"],
      hints: ["猜 A cos 2t + B sin 2t，注意 x″ 會帶出 −4 倍。", "解兩條一次方程：一條來自 cos 2t，一條來自 sin 2t。"],
      solution: "代入：cos 係數 −4A + 8B + 3A = 65，sin 係數 −4B − 8A + 3B = 0 ⟹ B = −8A，−A − 64A = 65 ⟹ A = −1、B = 8。",
      solutionSteps: ["猜 x_ss = A cos 2t + B sin 2t。", "cos：−A + 8B = 65；sin：−B − 8A = 0 ⟹ B = −8A。", "−65A = 65 ⟹ A = −1、B = 8：x_ss = −cos 2t + 8 sin 2t。"],
      verify: ivpCases("65\\cos(2x)-4p-3y", 0, 0, [40, 40.6, 41.3]) },
    { id: "cg-10d-010", topic: "integrals", rank: 3, answerKind: "expression", variable: "t",
      prompt: "x''+2x'+10x=52\\cos 2t\\text{。求穩態解 }x_{ss}(t)",
      answer: "6*cos(2*t)+4*sin(2*t)",
      timeLimit: 150, tags: ["driven-steady-state", "driven-oscillator", "undetermined-coefficients"],
      hints: ["猜 A cos 2t + B sin 2t 代入。", "也可以用複數：x_ss = Re[52e^{2it}/(10 − 4 + 4i)]。"],
      solution: "52/(6 + 4i) = 52(6 − 4i)/52 = 6 − 4i，取實部 Re[(6 − 4i)e^{2it}] = 6 cos 2t + 4 sin 2t。",
      solutionSteps: ["複數法：x″ + 2x′ + 10x = 52e^{2it}，特解 Ce^{2it}，C(−4 + 4i + 10) = 52。", "C = 52/(6 + 4i) = 6 − 4i。", "x_ss = Re[(6 − 4i)(cos 2t + i sin 2t)] = 6 cos 2t + 4 sin 2t。"],
      verify: ivpCases("52\\cos(2x)-2p-10y", 0, 0, [40, 40.6, 41.3]) },
    { id: "cg-10d-011", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "x''+0.4x'+4x=2\\cos\\omega t\\,\\text{。穩態振幅記為 }A(\\omega)\\text{，求 }A(2)",
      answer: "2.5",
      timeLimit: 120, tags: ["driven-amplitude-formula", "driven-oscillator"],
      hints: ["x″ + 2γx′ + ω₀²x = F₀ cos ωt 的穩態振幅 A(ω) = F₀/√((ω₀² − ω²)² + (2γω)²)。", "這裡 ω₀² = 4、2γ = 0.4、F₀ = 2。"],
      solution: "A(2) = 2/√((4 − 4)² + (0.4·2)²) = 2/0.8 = 2.5。外力頻率等於自然頻率，只剩阻尼項限制振幅。",
      solutionSteps: ["ω₀² = 4、2γ = 0.4、F₀ = 2。", "A(2) = 2/√(0² + 0.8²) = 2.5。"],
      verify: steadyAmp("2\\cos(2x)-0.4p-4y", 2, 100) },
    { id: "cg-10d-012", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "x''+2x'+4x=\\cos\\omega t\\text{。外力角頻率 }\\omega=1\\text{ 與 }\\omega=3\\text{ 時的穩態振幅分別是 }A(1)\\text{、}A(3)\\text{，求 }\\frac{A(1)}{A(3)}",
      answer: "sqrt(61/13)",
      timeLimit: 150, tags: ["driven-amplitude-formula", "driven-oscillator"],
      hints: ["A(ω) = F₀/√((ω₀² − ω²)² + (2γω)²)，這裡 ω₀² = 4、2γ = 2。", "比值裡 F₀ 會消掉。"],
      solution: "A(1) = 1/√(9 + 4) = 1/√13，A(3) = 1/√(25 + 36) = 1/√61。比值 √(61/13) ≈ 2.166。",
      solutionSteps: ["ω₀² = 4、2γ = 2。", "A(1) = 1/√((4 − 1)² + 2²) = 1/√13；A(3) = 1/√((4 − 9)² + 6²) = 1/√61。", "A(1)/A(3) = √(61/13) ≈ 2.166。"],
      verify: { m: "let", f: "\\frac{u}{v}", with: { u: steadyAmp("\\cos(x)-2p-4y", 1, 40), v: steadyAmp("\\cos(3x)-2p-4y", 3, 40) } } },
    { id: "cg-10d-013", topic: "integrals", rank: 4, answerKind: "expression", variable: "t",
      prompt: "x''+4x'+5x=8\\cos t,\\quad x(0)=0,\\ x'(0)=0,\\quad \\text{求 }x(t)",
      answer: "cos(t)+sin(t)-exp(-2*t)*(cos(t)+3*sin(t))",
      timeLimit: 240, tags: ["driven-full-solution", "driven-oscillator", "ivp"],
      hints: ["先求穩態解（猜 A cos t + B sin t），再加齊次解 e^{−2t}(C₁ cos t + C₂ sin t)。", "初始條件要用在「穩態 + 暫態」的整個解上。"],
      solution: "穩態 cos t + sin t；齊次根 −2 ± i。x = cos t + sin t + e^{−2t}(C₁ cos t + C₂ sin t)，零初始條件給 C₁ = −1、C₂ = −3。",
      solutionSteps: ["穩態 x_ss = A cos t + B sin t：cos 4A + 4B = 8、sin 4B − 4A = 0 ⟹ A = B = 1。", "齊次：r = −2 ± i，x_h = e^{−2t}(C₁ cos t + C₂ sin t)。", "x(0) = 1 + C₁ = 0；x′(0) = 1 − 2C₁ + C₂ = 0 ⟹ C₁ = −1、C₂ = −3。", "x = cos t + sin t − e^{−2t}(cos t + 3 sin t)。"],
      verify: ivpCases("8\\cos x-4p-5y", 0, 0, [0.5, 1.3, 2.7]) },
    { id: "cg-10d-014", topic: "integrals", rank: 4, answerKind: "expression", variable: "t",
      prompt: "x''+3x'+2x=10\\cos t,\\quad x(0)=1,\\ x'(0)=0,\\quad \\text{求 }x(t)",
      answer: "cos(t)+3*sin(t)-3*exp(-t)+3*exp(-2*t)",
      timeLimit: 240, tags: ["driven-full-solution", "driven-oscillator", "ivp"],
      hints: ["穩態解猜 A cos t + B sin t；齊次根是 −1、−2。", "整個解 = 穩態 + C₁e^{−t} + C₂e^{−2t}，再代初始條件。"],
      solution: "穩態 cos t + 3 sin t；齊次根 −1、−2。x = cos t + 3 sin t + C₁e^{−t} + C₂e^{−2t}，初始條件給 C₁ = −3、C₂ = 3。",
      solutionSteps: ["穩態：cos 係數 A + 3B = 10，sin 係數 B − 3A = 0 ⟹ A = 1、B = 3。", "x = cos t + 3 sin t + C₁e^{−t} + C₂e^{−2t}。", "x(0)：C₁ + C₂ = 0；x′(0)：3 − C₁ − 2C₂ = 0 ⟹ C₂ = 3、C₁ = −3。", "x = cos t + 3 sin t − 3e^{−t} + 3e^{−2t}。"],
      verify: ivpCases("10\\cos x-3p-2y", 1, 0, [0.5, 1.3, 2.7]) },
    { id: "cg-10d-015", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "x''+2x'+5x=10\\cos 3t\\text{，從任意初始狀態出發。很久以後，}x(t)\\text{ 以多少角頻率（rad/s）振盪？}",
      answers: ["3"], canonical: "3", distractors: ["2", "√5"],
      timeLimit: 60, tags: ["driven-transient", "driven-oscillator"],
      hints: ["解 = 暫態（齊次解）+ 穩態（特解）。哪一部分帶著 e^{−t}？", "留下來的那一部分，頻率跟誰一樣？"],
      solution: "齊次解 e^{−t}(C₁ cos 2t + C₂ sin 2t) 會衰減掉；留下的穩態解跟外力同頻率 3 rad/s。2 是擬頻率、√5 是自然頻率，都只屬於會消失的暫態。",
      solutionSteps: ["齊次根 −1 ± 2i：暫態 e^{−t}(…cos 2t…) → 0。", "穩態解 A cos 3t + B sin 3t 留下來，角頻率 3 rad/s。"],
      verify: { m: "choice", options: [
        { say: "3", all: [{ v: { m: "let", f: "u-v", with: { u: ivp("10\\cos(3x)-2p-5y", 1, 0, 30), v: ivp("10\\cos(3x)-2p-5y", 1, 0, 30 + 2 * Math.PI / 3) } }, eq: 0, tol: 1e-5 }] },
        { say: "2", all: [{ v: { m: "let", f: "u-v", with: { u: ivp("10\\cos(3x)-2p-5y", 1, 0, 30), v: ivp("10\\cos(3x)-2p-5y", 1, 0, 30 + Math.PI) } }, eq: 0, tol: 1e-5 }] },
        { say: "√5", all: [{ v: { m: "let", f: "u-v", with: { u: ivp("10\\cos(3x)-2p-5y", 1, 0, 30), v: ivp("10\\cos(3x)-2p-5y", 1, 0, 30 + 2 * Math.PI / Math.sqrt(5)) } }, eq: 0, tol: 1e-5 }] }
      ] } },

    /* ── 10D 共振 ───────────────────────────── */
    { id: "cg-10d-016", topic: "integrals", rank: 4, answerKind: "expression", variable: "t",
      prompt: "x''+4x=\\sin 2t,\\quad x(0)=0,\\ x'(0)=0,\\quad \\text{求 }x(t)",
      answer: "sin(2*t)/8-t*cos(2*t)/4",
      timeLimit: 240, tags: ["resonance-modification", "resonance", "undetermined-coefficients", "ivp"],
      hints: ["sin 2t 本身就是齊次解：猜 A cos 2t + B sin 2t 會整個消掉。", "改猜 t(A cos 2t + B sin 2t)，代入後比係數。"],
      solution: "共振，猜 t(A cos 2t + B sin 2t)：A = −1/4、B = 0。再加齊次解 C₁ cos 2t + C₂ sin 2t，零初始條件給 C₁ = 0、C₂ = 1/8。",
      solutionSteps: ["ω = ω₀ = 2，共振：猜 x_p = t(A cos 2t + B sin 2t)。", "x_p″ + 4x_p = −4A sin 2t + 4B cos 2t = sin 2t ⟹ A = −1/4、B = 0。", "x = −(t/4)cos 2t + C₁ cos 2t + C₂ sin 2t；C₁ = 0，−1/4 + 2C₂ = 0 ⟹ C₂ = 1/8。", "x = (1/8)sin 2t − (t/4)cos 2t。"],
      verify: ivpCases("\\sin(2x)-4y", 0, 0, [0.6, 1.7, 3.2]) },
    { id: "cg-10d-017", topic: "integrals", rank: 4, answerKind: "expression", variable: "t",
      prompt: "x''+9x=6\\cos 3t,\\quad x(0)=1,\\ x'(0)=0,\\quad \\text{求 }x(t)",
      answer: "cos(3*t)+t*sin(3*t)",
      timeLimit: 240, tags: ["resonance-modification", "resonance", "undetermined-coefficients", "ivp"],
      hints: ["cos 3t 是齊次解，特解要乘 t。", "(t sin 3t)″ 用兩次乘法律；最後兩個初始條件定齊次部分。"],
      solution: "共振，猜 t(A cos 3t + B sin 3t)：A = 0、B = 1。x = t sin 3t + C₁ cos 3t + C₂ sin 3t，初始條件給 C₁ = 1、C₂ = 0。",
      solutionSteps: ["共振：猜 x_p = t(A cos 3t + B sin 3t)。", "x_p″ + 9x_p = −6A sin 3t + 6B cos 3t = 6 cos 3t ⟹ A = 0、B = 1。", "x = t sin 3t + C₁ cos 3t + C₂ sin 3t；C₁ = 1、C₂ = 0。", "x = cos 3t + t sin 3t。"],
      verify: ivpCases("6\\cos(3x)-9y", 1, 0, [0.6, 1.7, 3.2]) },
    { id: "cg-10d-018", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "x''+2x'+10x=F_0\\cos\\omega t\\,\\text{。穩態振幅 }A(\\omega)\\text{ 在哪一個 }\\omega>0\\text{ 最大？}",
      answer: "2*sqrt(2)",
      timeLimit: 200, tags: ["resonance-peak-frequency", "resonance", "driven-oscillator"],
      hints: ["A(ω) 最大 ⟺ 分母裡的 D(ω) = (ω₀² − ω²)² + (2γω)² 最小。", "把 D 看成 u = ω² 的二次式，或直接對 ω 微分。"],
      solution: "D(u) = (10 − u)² + 4u，u = ω²。D′(u) = −2(10 − u) + 4 = 0 ⟹ u = 8，ω = 2√2 ≈ 2.83（比自然頻率 √10 小一點）。",
      solutionSteps: ["A(ω) = F₀/√D，D = (10 − ω²)² + 4ω²。", "令 u = ω²：D′(u) = −2(10 − u) + 4 = 0 ⟹ u = 8。", "ω = √8 = 2√2（公式 √(ω₀² − 2γ²) = √(10 − 2)）。"],
      verify: { m: "criticalPoint", f: "\\frac{1}{(10-x^2)^2+4x^2}", x0: 2.7 } },
    { id: "cg-10d-019", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "x''+2x'+5x=4\\cos\\omega t\\text{。在所有 }\\omega>0\\text{ 中，穩態振幅 }A(\\omega)\\text{ 的最大值是多少？}",
      answer: "1",
      timeLimit: 200, tags: ["resonance-peak-frequency", "resonance", "driven-oscillator"],
      hints: ["先求振幅最大的 ω：讓 (5 − ω²)² + 4ω² 最小。", "把那個 ω 代回 A(ω) = 4/√(…)。"],
      solution: "D = (5 − u)² + 4u（u = ω²），D′ = 0 ⟹ u = 3。D(3) = 4 + 12 = 16，A_max = 4/√16 = 1，在 ω = √3 取到。",
      solutionSteps: ["D(u) = (5 − u)² + 4u，D′(u) = −2(5 − u) + 4 = 0 ⟹ u = 3。", "D(3) = 4 + 12 = 16。", "A_max = 4/√16 = 1（ω = √3）。"],
      verify: { m: "extremeOf", kind: "sup", integer: false, f: "\\frac{4}{\\sqrt{(5-x^2)^2+4x^2}}", range: [0, 5] } },
    { id: "cg-10d-020", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "x''+0.5x'+4x=F_0\\cos\\omega t\\text{。共振時（}\\omega=2\\text{）的穩態振幅是靜力（}\\omega=0\\text{，外力是常數 }F_0\\text{）位移的幾倍？}",
      answer: "4",
      timeLimit: 150, tags: ["resonance-damped-amplitude", "resonance", "driven-oscillator"],
      hints: ["ω = 0 時外力是常數，穩態解就是常數 F₀/ω₀²。", "ω = ω₀ 時 A = F₀/(2γω₀)。"],
      solution: "靜力位移 F₀/4；共振振幅 F₀/(0.5·2) = F₀。倍數 = F₀ ÷ (F₀/4) = 4，阻尼越小這個倍數越大。",
      solutionSteps: ["ω = 0：x_ss = F₀/ω₀² = F₀/4。", "ω = 2：A = F₀/√(0² + (0.5·2)²) = F₀。", "倍數 = F₀/(F₀/4) = 4。"],
      verify: { m: "let", f: "\\frac{u}{v}", with: { u: steadyAmp("\\cos(2x)-0.5p-4y", 2, 100), v: ivp("1-0.5p-4y", 0, 0, 100) } } },
    { id: "cg-10d-021", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "x''+4x=\\cos 2t,\\ x(0)=0,\\ x'(0)=0\\text{（無阻尼、外力頻率等於自然頻率）。隨著時間增加，振幅會怎樣？}",
      answers: ["隨時間線性變大，沒有上界"], canonical: "隨時間線性變大，沒有上界",
      distractors: ["趨近一個固定的有限值", "以指數速度變大"],
      timeLimit: 60, tags: ["resonance-growth", "resonance"],
      hints: ["共振時特解要乘 t：t 乘在 sin 2t 前面。", "沒有阻尼，就沒有 e^{−γt} 把它拉回來。"],
      solution: "解是 x = (t/4) sin 2t，振幅 t/4 跟時間成正比、沒有上界。有阻尼時共振振幅才會停在有限值 F₀/(2γω₀)。",
      solutionSteps: ["共振：x_p = t(A cos 2t + B sin 2t)，代入得 x = (t/4) sin 2t。", "振幅 t/4 線性成長，沒有上界（有阻尼才會有限）。"],
      verify: { m: "choice", options: [
        { say: "隨時間線性變大，沒有上界", all: [{ v: { m: "let", f: "\\frac{c}{b}", with: { b: ivp("\\cos(2x)-4y", 0, 0, 10.25 * Math.PI), c: ivp("\\cos(2x)-4y", 0, 0, 20.25 * Math.PI) } }, eq: "\\frac{20.25}{10.25}", tol: 1e-4 }] },
        { say: "趨近一個固定的有限值", all: [{ v: { m: "let", f: "c-b", with: { b: ivp("\\cos(2x)-4y", 0, 0, 20.25 * Math.PI), c: ivp("\\cos(2x)-4y", 0, 0, 30.25 * Math.PI) } }, lt: 0.5 }] },
        { say: "以指數速度變大", all: [{ v: { m: "let", f: "\\frac{c}{b}-\\frac{b}{a}", with: { a: ivp("\\cos(2x)-4y", 0, 0, 10.25 * Math.PI), b: ivp("\\cos(2x)-4y", 0, 0, 20.25 * Math.PI), c: ivp("\\cos(2x)-4y", 0, 0, 30.25 * Math.PI) } }, eq: 0, tol: 1e-4 }] }
      ] } },

    /* ── 11A 漸近等價的替換陷阱 ───────────────────────────── */
    { id: "cg-11a-001", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{有人這樣算：}x\\to0\\text{ 時 }\\arctan x\\sim x\\text{，所以 }\\lim_{x\\to0}\\frac{x-\\arctan x}{x^3}=\\lim_{x\\to0}\\frac{x-x}{x^3}=0\\text{。這樣對嗎？}",
      answers: ["不對，極限是 1/3"], canonical: "不對，極限是 1/3",
      distractors: ["對，極限是 0", "不對，極限是 1", "不對，極限不存在"],
      timeLimit: 90, tags: ["asymptotic-equivalence-difference-trap", "asymptotic-equivalence", "taylor-series"],
      hints: ["等價替換只能用在乘除的因子上；相減時主項 x 會互相抵消。", "抵消之後剩下的是下一項：arctan x 的 Taylor 展開到 x³。"],
      solution: "相減時主項抵消，∼ 給不出差的大小。arctan x = x − x³/3 + o(x³)，所以 x − arctan x = x³/3 + o(x³)，極限 1/3。",
      solutionSteps: ["x − arctan x 的主項 x 互相抵消，不能用 arctan x ∼ x 替換。", "arctan x = x − x³/3 + o(x³) ⟹ x − arctan x = x³/3 + o(x³)。", "極限 = 1/3，原推論不對。"],
      verify: { m: "choice", options: [
        { say: "不對，極限是 1/3", all: [{ v: { m: "limit", f: "\\frac{x-\\arctan x}{x^3}", at: 0 }, eq: "1/3", tol: 1e-5 }] },
        { say: "對，極限是 0", all: [{ v: { m: "limit", f: "\\frac{x-\\arctan x}{x^3}", at: 0 }, eq: 0, tol: 1e-5 }] },
        { say: "不對，極限是 1", all: [{ v: { m: "limit", f: "\\frac{x-\\arctan x}{x^3}", at: 0 }, eq: 1, tol: 1e-5 }] },
        { say: "不對，極限不存在", all: [{ v: { m: "limit", f: "\\frac{x-\\arctan x}{x^3}", at: 0 }, ne: "1/3" }] }
      ] } },
    { id: "cg-11a-002", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\text{有人這樣算：}x\\to\\infty\\text{ 時 }1+\\frac{3}{x}\\sim1\\text{，所以 }\\left(1+\\frac{3}{x}\\right)^{x}\\sim1^{x}=1\\text{。這樣對嗎？}",
      answers: ["不對，極限是 e³"], canonical: "不對，極限是 e³",
      distractors: ["對，極限是 1", "不對，極限是 3", "不對，極限是 ∞"],
      timeLimit: 90, tags: ["asymptotic-equivalence-difference-trap", "asymptotic-equivalence", "exponential-limit"],
      hints: ["指數裡的 x 會放大底數的微小差距：底數只差 3/x，乘上 x 次就不是小事。", "取對數：x·ln(1 + 3/x)，再對 ln(1 + u) 用 ∼ u。"],
      solution: "底數 ∼ 1 不代表 x 次方後 ∼ 1。取對數 x ln(1 + 3/x) ∼ x·(3/x) = 3（這裡是乘積，可以替換），所以極限 e³。",
      solutionSteps: ["指數上的替換不合法：底數的誤差 3/x 會被 x 次方放大。", "ln 之後：x ln(1 + 3/x)，ln(1 + u) ∼ u 是乘積裡的替換 ⟹ → 3。", "極限 e³，原推論不對。"],
      verify: { m: "choice", options: [
        { say: "不對，極限是 e³", all: [{ v: { m: "limit", f: "\\left(1+\\frac{3}{x}\\right)^{x}", at: "inf" }, eq: "e^3", tol: 1e-5 }] },
        { say: "對，極限是 1", all: [{ v: { m: "limit", f: "\\left(1+\\frac{3}{x}\\right)^{x}", at: "inf" }, eq: 1, tol: 1e-5 }] },
        { say: "不對，極限是 3", all: [{ v: { m: "limit", f: "\\left(1+\\frac{3}{x}\\right)^{x}", at: "inf" }, eq: 3, tol: 1e-5 }] },
        { say: "不對，極限是 ∞", all: [{ v: { m: "limit", f: "\\left(1+\\frac{3}{x}\\right)^{x}", at: "inf" }, gt: 1000 }] }
      ] } },

    /* ── 11A little-o 運算與成長階梯 ───────────────────────────── */
    { id: "cg-11a-003", topic: "limits", rank: 2, answerKind: "text",
      prompt: "x\\to0\\text{ 時，}x^3\\cdot o(x^2)\\text{ 可以寫成下列哪一個？}",
      answers: ["o(x⁵)"], canonical: "o(x⁵)", distractors: ["o(x⁶)", "O(x⁶)"],
      timeLimit: 60, tags: ["little-o-arithmetic", "little-o", "big-o"],
      hints: ["o(x²) 是「除以 x² 之後趨近 0」的某個函數 f。", "x³f 除以 x⁵ 等於 f 除以 x²。"],
      solution: "f = o(x²) 代表 f/x² → 0，那麼 (x³f)/x⁵ = f/x² → 0，所以 x³·o(x²) = o(x⁵)。反例 f = x^{2.5}：x³f = x^{5.5}，它不是 o(x⁶)，也不是 O(x⁶)。",
      solutionSteps: ["設 f = o(x²)：f/x² → 0。", "(x³f)/x⁵ = f/x² → 0 ⟹ x³·o(x²) = o(x⁵)。", "f = x^{2.5} 時 x³f = x^{5.5}，x^{5.5}/x⁶ → ∞：o(x⁶)、O(x⁶) 都不對。"],
      verify: { m: "choice", options: [
        { say: "o(x⁵)", unknown: "x³·o(x²) = o(x⁵) 是記號的定義推出來的恆等式，對所有 f 成立，數值只能驗個例" },
        { say: "o(x⁶)", given: [{ v: { m: "limit", f: "\\frac{x^{2.5}}{x^2}", at: 0, dir: "+" }, eq: 0 }], all: [{ v: { m: "limit", f: "\\frac{x^6}{x^3\\cdot x^{2.5}}", at: 0, dir: "+" }, ne: 0 }] },
        { say: "O(x⁶)", given: [{ v: { m: "limit", f: "\\frac{x^{2.5}}{x^2}", at: 0, dir: "+" }, eq: 0 }], all: [{ v: { m: "limit", f: "\\frac{x^6}{x^3\\cdot x^{2.5}}", at: 0, dir: "+" }, ne: 0 }] }
      ] } },
    { id: "cg-11a-004", topic: "limits", rank: 2, answerKind: "text",
      prompt: "x\\to0\\text{ 時，}o(x^2)+o(x^3)\\text{ 可以寫成下列哪一個？}",
      answers: ["o(x²)"], canonical: "o(x²)", distractors: ["o(x³)", "O(x³)", "o(x⁵)"],
      timeLimit: 60, tags: ["little-o-arithmetic", "little-o", "big-o"],
      hints: ["x → 0 時，x 的次方越高越小：o(x³) 也一定是 o(x²)。", "加起來之後，由「比較大」的那一項決定。"],
      solution: "g = o(x³) 時 g/x² = x·(g/x³) → 0，所以 g 也是 o(x²)，和就是 o(x²)。反例 f = x^{2.5}、g = x^{3.5}：和不是 o(x³)、O(x³)，更不是 o(x⁵)。",
      solutionSteps: ["o(x³) ⊂ o(x²)：g/x² = x·(g/x³) → 0。", "所以 o(x²) + o(x³) = o(x²) + o(x²) = o(x²)。", "反例 x^{2.5} + x^{3.5}：除以 x³ 會發散，所以 o(x³)、O(x³)、o(x⁵) 都不對。"],
      verify: { m: "choice", options: [
        { say: "o(x²)", unknown: "o(x²) + o(x³) = o(x²) 是記號的定義推出來的恆等式，數值只能驗個例" },
        // 反例 f = x^{2.5}、g = x^{3.5}；極限改用 x = t² 參數化（t → 0⁺），避開 √ 型收斂讓外插不穩
        { say: "o(x³)", given: [{ v: { m: "limit", f: "\\frac{x^{5}}{x^4}", at: 0, dir: "+" }, eq: 0 }, { v: { m: "limit", f: "\\frac{x^{7}}{x^6}", at: 0, dir: "+" }, eq: 0 }], all: [{ v: { m: "limit", f: "\\frac{x^6}{x^{5}+x^{7}}", at: 0, dir: "+" }, ne: 0 }] },
        { say: "O(x³)", given: [{ v: { m: "limit", f: "\\frac{x^{5}}{x^4}", at: 0, dir: "+" }, eq: 0 }, { v: { m: "limit", f: "\\frac{x^{7}}{x^6}", at: 0, dir: "+" }, eq: 0 }], all: [{ v: { m: "limit", f: "\\frac{x^6}{x^{5}+x^{7}}", at: 0, dir: "+" }, ne: 0 }] },
        { say: "o(x⁵)", given: [{ v: { m: "limit", f: "\\frac{x^{5}}{x^4}", at: 0, dir: "+" }, eq: 0 }, { v: { m: "limit", f: "\\frac{x^{7}}{x^6}", at: 0, dir: "+" }, eq: 0 }], all: [{ v: { m: "limit", f: "\\frac{x^{10}}{x^{5}+x^{7}}", at: 0, dir: "+" }, ne: 0 }] }
      ] } },
    { id: "cg-11a-005", topic: "limits", rank: 2, answerKind: "text",
      prompt: "n\\to\\infty\\text{ 時，把 }\\ln n,\\ \\sqrt{n},\\ 2^n,\\ n!\\text{ 由成長最慢排到最快：}",
      answers: ["ln n、√n、2ⁿ、n!"], canonical: "ln n、√n、2ⁿ、n!",
      distractors: ["√n、ln n、2ⁿ、n!", "ln n、√n、n!、2ⁿ", "ln n、2ⁿ、√n、n!"],
      timeLimit: 60, tags: ["growth-ladder", "little-o", "sequence-limit"],
      hints: ["對數 ≪ 任何正次方 ≪ 指數 ≪ 階乘。", "n! 和 2ⁿ 比：n! 每多一項乘 n，2ⁿ 每多一項只乘 2。"],
      solution: "ln n/√n → 0、√n/2ⁿ → 0、2ⁿ/n! → 0，所以 ln n ≪ √n ≪ 2ⁿ ≪ n!。",
      solutionSteps: ["ln n/√n → 0：對數比任何正次方慢。", "√n/2ⁿ → 0：次方比指數慢。", "2ⁿ/n! → 0：指數比階乘慢 ⟹ ln n、√n、2ⁿ、n!。"],
      verify: { m: "choice", options: [
        { say: "ln n、√n、2ⁿ、n!", all: [
          // ln、√、2^x 是連續函數，數列極限等於 x → ∞ 的函數極限（數列外插對 ln n/√n 收斂太慢）
          { v: { m: "limit", f: "\\frac{\\ln x}{\\sqrt{x}}", at: "inf" }, eq: 0, tol: 1e-4 },
          { v: { m: "limit", f: "\\frac{\\sqrt{x}}{2^x}", at: "inf" }, eq: 0, tol: 1e-4 },
          { v: { m: "seqLimit", f: "\\frac{2^n}{n!}" }, eq: 0, tol: 1e-4 }] },
        { say: "√n、ln n、2ⁿ、n!", all: [{ v: { m: "limit", f: "\\frac{\\ln x}{\\sqrt{x}}", at: "inf" }, ne: 0 }] },
        { say: "ln n、√n、n!、2ⁿ", all: [{ v: { m: "seqLimit", f: "\\frac{2^n}{n!}" }, ne: 0 }] },
        { say: "ln n、2ⁿ、√n、n!", all: [{ v: { m: "limit", f: "\\frac{\\sqrt{x}}{2^x}", at: "inf" }, ne: 0 }] }
      ] } },
    { id: "cg-11a-006", topic: "limits", rank: 2, answerKind: "text",
      prompt: "n\\to\\infty\\text{ 時，下列哪一個敘述正確？}",
      answers: ["n³ = o(1.5ⁿ)"], canonical: "n³ = o(1.5ⁿ)",
      distractors: ["1.5ⁿ = o(n³)", "n! = o(5ⁿ)", "nⁿ = o(n!)"],
      timeLimit: 75, tags: ["growth-ladder", "little-o", "sequence-limit"],
      hints: ["a = o(b) 的意思是 a/b → 0。", "底數大於 1 的指數最後一定贏任何次方；但階乘又贏任何固定底數的指數。"],
      solution: "n³/1.5ⁿ → 0（指數贏次方，即使底數只有 1.5）。反過來 1.5ⁿ/n³ → ∞；5ⁿ/n! → 0 所以 n! 比 5ⁿ 快；n!/nⁿ → 0 所以 nⁿ 比 n! 快。",
      solutionSteps: ["n³/1.5ⁿ → 0：n³ = o(1.5ⁿ) 正確。", "5ⁿ/n! → 0：n! 比 5ⁿ 快，n! = o(5ⁿ) 錯。", "n!/nⁿ → 0：nⁿ 比 n! 快，nⁿ = o(n!) 錯；1.5ⁿ = o(n³) 也錯。"],
      verify: { m: "choice", options: [
        { say: "n³ = o(1.5ⁿ)", all: [{ v: { m: "seqLimit", f: "\\frac{n^3}{1.5^n}" }, eq: 0, tol: 1e-4 }] },
        { say: "1.5ⁿ = o(n³)", all: [{ v: { m: "seqLimit", f: "\\frac{n^3}{1.5^n}" }, ne: 0 }] },
        { say: "n! = o(5ⁿ)", all: [{ v: { m: "seqLimit", f: "\\frac{5^n}{n!}" }, ne: 0 }] },
        { say: "nⁿ = o(n!)", all: [{ v: { m: "seqLimit", f: "\\frac{n!}{n^n}" }, ne: 0 }] }
      ] } },

    /* ── 11A Stirling：用積分夾 ln n! ───────────────────────────── */
    { id: "cg-11a-007", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "\\lim_{n\\to\\infty}\\frac{\\ln(n!)-n\\ln n}{n}",
      answer: "-1",
      timeLimit: 150, tags: ["stirling-log-factorial", "stirling", "integral-comparison"],
      hints: ["ln(n!) = Σ ln k，用 ∫₁ⁿ ln x dx 與 ∫₁^{n+1} ln x dx 把它夾住。", "∫ ln x dx = x ln x − x，兩邊都是 n ln n − n + O(ln n)。"],
      solution: "∫₁ⁿ ln x dx ≤ ln(n!) ≤ ∫₁^{n+1} ln x dx，兩端都是 n ln n − n + O(ln n)。所以 (ln n! − n ln n)/n = −1 + O(ln n / n) → −1。",
      solutionSteps: ["ln x 遞增：∫₁ⁿ ln x dx ≤ Σ_{k=2}^{n} ln k ≤ ∫₁^{n+1} ln x dx。", "∫₁ⁿ ln x dx = n ln n − n + 1；上界 = (n+1)ln(n+1) − n，差 O(ln n)。", "ln n! = n ln n − n + O(ln n) ⟹ 極限 = −1。"] },
    { id: "cg-11a-008", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "\\lim_{n\\to\\infty}\\frac{\\ln((2n)!)-2\\ln(n!)}{n}",
      answer: "2*log(2)",
      timeLimit: 180, tags: ["stirling-log-factorial", "stirling", "integral-comparison"],
      hints: ["用 ln m! = m ln m − m + O(ln m)，分別代 m = 2n 與 m = n。", "−m 那兩項會抵消；剩下 2n ln(2n) − 2n ln n。"],
      solution: "ln(2n)! − 2 ln n! = [2n ln 2n − 2n] − 2[n ln n − n] + O(ln n) = 2n ln 2 + O(ln n)。除以 n → 2 ln 2 ≈ 1.386。",
      solutionSteps: ["ln m! = m ln m − m + O(ln m)（積分夾擠）。", "ln(2n)! − 2 ln n! = 2n ln(2n) − 2n − 2n ln n + 2n + O(ln n) = 2n ln 2 + O(ln n)。", "除以 n：極限 2 ln 2 ≈ 1.386。"] },

    /* ── 11A Stolz：分母是 ln n ───────────────────────────── */
    { id: "cg-11a-009", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "\\lim_{n\\to\\infty}\\frac{1}{\\ln n}\\sum_{k=1}^{n}\\frac{2k+1}{k^2+k+1}",
      answer: "2",
      timeLimit: 180, tags: ["stolz-log-denominator", "stolz-cesaro", "sequence-limit"],
      hints: ["分母 ln n 遞增到 ∞：用 Stolz，看相鄰差的比。", "ln(n+1) − ln n = ln(1 + 1/n) ∼ 1/n。"],
      solution: "Stolz：a_{n+1} − a_n = (2n+3)/((n+1)² + (n+1) + 1) ∼ 2/n，b_{n+1} − b_n = ln(1 + 1/n) ∼ 1/n。比值 → 2。",
      solutionSteps: ["a_n = Σ (2k+1)/(k²+k+1)，b_n = ln n ↑ ∞，用 Stolz。", "a_{n+1} − a_n = (2n+3)/(n² + 3n + 3) ∼ 2/n。", "b_{n+1} − b_n = ln(1 + 1/n) ∼ 1/n ⟹ 極限 = 2。"],
      verify: { m: "let", f: "\\frac{s}{\\ln 2}", with: { s: { m: "seqLimit", f: "\\sum_{k=n+1}^{2n}\\frac{2k+1}{k^2+k+1}", n0: 500 } } } },
    { id: "cg-11a-010", topic: "limits", rank: 4, answerKind: "numeric",
      prompt: "\\lim_{n\\to\\infty}\\frac{1}{(\\ln n)^2}\\sum_{k=1}^{n}\\frac{\\ln k}{k}",
      answer: "1/2",
      timeLimit: 210, tags: ["stolz-log-denominator", "stolz-cesaro", "sequence-limit"],
      hints: ["分母 b_n = (ln n)²；Stolz 要算 b_{n+1} − b_n。", "(ln(n+1))² − (ln n)² = (ln(n+1) − ln n)(ln(n+1) + ln n)。"],
      solution: "Stolz：a_{n+1} − a_n = ln(n+1)/(n+1)，b_{n+1} − b_n = ln(1 + 1/n)(ln(n+1) + ln n) ∼ 2 ln n / n，比值 → 1/2。",
      solutionSteps: ["a_n = Σ ln k / k，b_n = (ln n)² ↑ ∞，用 Stolz。", "b_{n+1} − b_n = ln(1 + 1/n)(ln(n+1) + ln n) ∼ 2 ln n / n。", "(ln(n+1)/(n+1)) ÷ (2 ln n / n) → 1/2。"],
      verify: { m: "seqLimit", f: "\\frac{\\sum_{k=n+1}^{2n}\\frac{\\ln k}{k}}{(\\ln(2n))^2-(\\ln n)^2}", n0: 500 } },

    /* ── 11A Euler–Maclaurin ───────────────────────────── */
    { id: "cg-11a-011", topic: "series", rank: 3, answerKind: "expression", variable: "n",
      prompt: "\\text{Euler–Maclaurin：}\\sum_{k=0}^{n}f(k)=\\int_0^n f\\,dx+\\frac{f(0)+f(n)}{2}+\\frac{f'(n)-f'(0)}{12}-\\frac{f'''(n)-f'''(0)}{720}+\\cdots\\text{，對多項式在有限項停止。用它求 }\\sum_{k=1}^{n}k^3",
      answer: "n^2*(n+1)^2/4",
      timeLimit: 200, tags: ["euler-maclaurin-polynomial-sum", "euler-maclaurin", "power-sum"],
      hints: ["f(x) = x³：f′ = 3x²、f‴ = 6 是常數，所以 f‴ 那一項是 0。", "把 ∫₀ⁿ x³ dx、(f(0)+f(n))/2、(f′(n) − f′(0))/12 加起來（k = 0 那項是 0）。"],
      solution: "∫₀ⁿ x³ dx = n⁴/4，(0 + n³)/2 = n³/2，(3n² − 0)/12 = n²/4，f‴ 項相消。和 = n⁴/4 + n³/2 + n²/4 = n²(n+1)²/4。",
      solutionSteps: ["f = x³：∫₀ⁿ f = n⁴/4，(f(0) + f(n))/2 = n³/2。", "(f′(n) − f′(0))/12 = 3n²/12 = n²/4；f‴ ≡ 6，下一項為 0。", "Σ k³ = n⁴/4 + n³/2 + n²/4 = n²(n+1)²/4。"],
      verify: { m: "fn", vars: ["n"], cases: [3, 7, 12, 20].map((n) => ({ at: { n }, v: { m: "series", f: "k^3", v: "k", from: 1, to: n } })) } },
    { id: "cg-11a-012", topic: "series", rank: 3, answerKind: "expression", variable: "n",
      prompt: "\\text{Euler–Maclaurin：}\\sum_{k=0}^{n}f(k)=\\int_0^n f\\,dx+\\frac{f(0)+f(n)}{2}+\\frac{f'(n)-f'(0)}{12}-\\cdots\\text{，對多項式在有限項停止。用它求 }\\sum_{k=1}^{n}(2k-1)^2",
      answer: "n*(2*n-1)*(2*n+1)/3",
      timeLimit: 200, tags: ["euler-maclaurin-polynomial-sum", "euler-maclaurin", "power-sum"],
      hints: ["f(x) = (2x − 1)²，二次多項式：f‴ = 0。", "公式算的是從 k = 0 開始的和；f(0) = 1，要把它扣掉。"],
      solution: "f = (2x − 1)²：積分、端點平均、f′ 修正三項相加得 Σ_{k=0}^{n} = 4n³/3 + n/3 + 1，再扣掉 f(0) = 1，得 n(2n−1)(2n+1)/3。",
      solutionSteps: ["f = (2x−1)²：∫₀ⁿ f = 4n³/3 − 2n² + n。", "(f(0) + f(n))/2 = (1 + 4n² − 4n + 1)/2 = 2n² − 2n + 1；f′ = 4(2x−1)，(f′(n) − f′(0))/12 = 2n/3。", "Σ_{k=0}^{n} = 4n³/3 + n/3 + 1；扣掉 f(0) = 1：Σ_{k=1}^{n} = (4n³ − n)/3 = n(2n−1)(2n+1)/3。"],
      verify: { m: "fn", vars: ["n"], cases: [3, 7, 12, 20].map((n) => ({ at: { n }, v: { m: "series", f: "(2k-1)^2", v: "k", from: 1, to: n } })) } },
    { id: "cg-11a-013", topic: "series", rank: 4, answerKind: "numeric",
      prompt: "\\text{用 Euler–Maclaurin 的尾巴估計 }\\sum_{k=N}^{\\infty}f(k)\\approx\\int_N^{\\infty}f\\,dx+\\frac{f(N)}{2}-\\frac{f'(N)}{12}\\text{，取 }f(x)=\\frac{1}{x^3},\\ N=10\\text{。求這個估計值（寫成分數）}",
      answer: "221/40000",
      timeLimit: 200, tags: ["euler-maclaurin-tail-estimate", "euler-maclaurin", "series-estimate"],
      hints: ["∫₁₀^∞ x⁻³ dx = 1/(2·10²)。", "f′(x) = −3x⁻⁴，所以 −f′(10)/12 是正的。"],
      solution: "∫₁₀^∞ x⁻³ dx = 0.005，f(10)/2 = 0.0005，−f′(10)/12 = 0.000025。合計 0.005525 = 221/40000；真值約 0.0055221，誤差約 3×10⁻⁶。",
      solutionSteps: ["∫₁₀^∞ x⁻³ dx = 1/200 = 0.005。", "f(10)/2 = 1/2000 = 0.0005；f′(10) = −3/10⁴，−f′(10)/12 = 0.000025。", "合計 0.005525 = 221/40000。"],
      verify: { m: "let", f: "a+\\frac{b}{2}-\\frac{c}{12}", with: { a: { m: "integral", f: "x^{-3}", a: 10, b: 100000 }, b: { m: "value", f: "10^{-3}" }, c: { m: "deriv", f: "x^{-3}", at: [10] } } } },
    { id: "cg-11a-014", topic: "series", rank: 4, answerKind: "numeric",
      prompt: "\\text{估計 }\\sum_{k=1}^{\\infty}\\frac{1}{k^2}\\text{：前 }4\\text{ 項直接相加，從 }k=5\\text{ 起的尾巴用 }\\int_5^{\\infty}f\\,dx+\\frac{f(5)}{2}-\\frac{f'(5)}{12}\\text{（}f(x)=\\frac{1}{x^2}\\text{）。求這個估計值（寫成分數）}",
      answer: "29609/18000",
      timeLimit: 240, tags: ["euler-maclaurin-tail-estimate", "euler-maclaurin", "series-estimate"],
      hints: ["前四項：1 + 1/4 + 1/9 + 1/16。", "尾巴：∫₅^∞ x⁻² dx = 1/5，f(5)/2 = 1/50，f′(5) = −2/125。"],
      solution: "前四項 205/144；尾巴 1/5 + 1/50 + (2/125)/12 = 83/375。合計 29609/18000 ≈ 1.6449444，和 π²/6 ≈ 1.6449341 只差約 1×10⁻⁵。",
      solutionSteps: ["前四項：1 + 1/4 + 1/9 + 1/16 = 205/144。", "尾巴：1/5 + 1/50 + 1/750 = 83/375。", "合計 205/144 + 83/375 = 29609/18000 ≈ 1.64494。"],
      verify: { m: "let", f: "s+a+\\frac{b}{2}-\\frac{c}{12}", with: { s: { m: "series", f: "\\frac{1}{k^2}", v: "k", from: 1, to: 4 }, a: { m: "integral", f: "x^{-2}", a: 5, b: 1e9 }, b: { m: "value", f: "5^{-2}" }, c: { m: "deriv", f: "x^{-2}", at: [5] } } } }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE, difficulty: Math.min(4, problem.rank), ...problem })));
})();
