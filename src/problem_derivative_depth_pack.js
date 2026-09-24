(function () {
  "use strict";

  // 微分深水包（2026-08）：100 題，把微分那一區的重心從「高階導數」搬回來。
  //
  // 動機是題庫盤點的結果：derivatives 有 457 題，其中帶
  // higher-derivative / super-high-derivative 的就有 66 題，
  // 而 related-rates 只有 14、tangent-normal 2、linear-approximation 2、
  // newton-method 2、differentiability 0。
  // 也就是說「算 d²⁰/dx²⁰」的題比「這根梯子倒下來有多快」多了四倍 ——
  // 但後者才是微分真正被用到的地方，而且是大考與工程課的主戰場。
  //
  // 所以這 100 題一題高階導數都沒有，全押在兩個方向：
  //   刁鑽函數微分 52：對數微分 / 巢狀鏈鎖 / 反三角雙曲 / 隱函數 /
  //                    反函數導數 / 導數定義 / 尖點與可微性 / 參數式
  //   應用題       48：相關變率 / 最佳化 / 運動 / 線性近似 / 邊際 / 牛頓法 / 成長衰變
  //
  // 驗算：算式型的題幹是 \frac{d}{dx}(...)，驗算器直接對題幹做數值微分再跟答案比；
  // 應用題的題幹是一段文字，自動辨識讀不出結構，所以每一題都自己帶 verify 描述子，
  // 走 tools/lib/verify_engine.js 的 implicit / inverseDeriv / paramSlope /
  // linApprox / differential / extremum / deriv / root 路徑。
  // 這幾條路徑一律用數值微分或數值求根，不重複作者手上的代數 ——
  // 手推的 f′ 錯了、或「f(a)=b」根本不成立，驗算端會算出不同的數字。
  const SOURCE = "Buzz derivative depth pack";
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
      ...problem,
      tags
    });
  }

  // 算式型：答案是一個函數，題幹本身就是 d/dx(...)，交給自動驗算
  function expr(id, rank, prompt, answer, tags, solution, timeLimit) {
    add({ id, topic: "derivatives", rank, prompt, answerKind: "expression", answer, tags, solution, timeLimit });
  }

  // 數值型：答案是一個數，verify 指定獨立的驗算路徑
  function num(id, rank, prompt, answer, tags, solution, timeLimit, verify) {
    add({ id, topic: "derivatives", rank, prompt, answerKind: "numeric", answer, tags, solution, timeLimit, verify });
  }

  const LOGD = "log-differentiation";
  const CHAIN = "chain-rule";
  const IMP = "implicit-differentiation";
  const STORY = "story-problem";
  const RR = "related-rates";
  const OPT = "optimization";

  /* ═══════════════ 一、對數微分（10）═══════════════
     指數和底數同時含 x 的時候，乘法律鏈鎖律都不管用 ——
     必須先取 log 把指數拉下來。 */

  expr("dd-log-001", 3,
    "\\frac{d}{dx}\\left(x^{2x}\\right)",
    "x^(2*x)*2*(log(x)+1)", [LOGD, "exponential"],
    "取對數：log y = 2x log x，兩邊微分 y'/y = 2 log x + 2。", 55);

  expr("dd-log-002", 5,
    "\\frac{d}{dx}\\left((\\ln x)^{\\sin x}\\right)",
    "(log(x))^(sin(x))*(cos(x)*log(log(x))+sin(x)/(x*log(x)))", [LOGD, "trig", "log"],
    "log y = sin x · log(log x)，右邊用乘積律：cos x log(log x) + sin x/(x log x)。", 95);

  expr("dd-log-003", 4,
    "\\frac{d}{dx}\\left((\\cos x)^{\\sin x}\\right)",
    "(cos(x))^(sin(x))*(cos(x)*log(cos(x))-sin(x)^2/cos(x))", [LOGD, "trig"],
    "log y = sin x log cos x，y'/y = cos x log cos x − sin²x/cos x。", 85);

  expr("dd-log-004", 4,
    "\\frac{d}{dx}\\left(x^{1/x}\\right)",
    "x^(1/x)*(1-log(x))/x^2", [LOGD],
    "log y = (log x)/x，右邊用商數律得 (1 − log x)/x²。", 70);

  expr("dd-log-005", 5,
    "\\frac{d}{dx}\\left(\\left(1+\\frac1x\\right)^x\\right)",
    "(1+1/x)^x*(log(1+1/x)-1/(x+1))", [LOGD, "euler-number"],
    "log y = x log(1+1/x)。微分右邊：log(1+1/x) + x·(−1/x²)/(1+1/x) = log(1+1/x) − 1/(x+1)。", 90);

  expr("dd-log-006", 4,
    "\\frac{d}{dx}\\left(x^{\\sqrt{x}}\\right)",
    "x^(sqrt(x))*(log(x)+2)/(2*sqrt(x))", [LOGD, "radical"],
    "log y = √x log x，y'/y = log x/(2√x) + 1/√x = (log x + 2)/(2√x)。", 75);

  expr("dd-log-007", 5,
    "\\frac{d}{dx}\\left((\\ln x)^x\\right)",
    "(log(x))^x*(log(log(x))+1/log(x))", [LOGD, "log"],
    "log y = x log(log x)，y'/y = log(log x) + x·1/(x log x)。", 85);

  expr("dd-log-008", 4,
    "\\frac{d}{dx}\\left(\\frac{(x+1)^2\\sqrt{x-1}}{(x+3)^4}\\right)",
    "(x+1)^2*sqrt(x-1)/(x+3)^4*(2/(x+1)+1/(2*(x-1))-4/(x+3))",
    [LOGD, "quotient-rule"],
    "整串乘除取 log 後變加減：y'/y = 2/(x+1) + 1/(2(x−1)) − 4/(x+3)。直接用商數律會爆炸。", 95);

  expr("dd-log-009", 5,
    "\\frac{d}{dx}\\left((\\ln x)^{\\ln x}\\right)",
    "(log(x))^(log(x))*(1+log(log(x)))/x", [LOGD, "log"],
    "log y = log x · log(log x)，微分得 (1/x)log(log x) + log x·1/(x log x) = (1 + log log x)/x。", 95);

  expr("dd-log-010", 6,
    "\\frac{d}{dx}\\left(x^{x^x}\\right)",
    "x^(x^x)*x^x*(log(x)*(log(x)+1)+1/x)", [LOGD, "power-exponential"],
    "log y = xˣ log x。再微分一次要用到 (xˣ)' = xˣ(log x + 1)，得 xˣ(log x)(log x + 1) + xˣ/x。", 130);

  /* ═══════════════ 二、巢狀鏈鎖（8）═══════════════
     三層以上的複合，重點是從最外層開始一層一層剝，不要急著展開。 */

  expr("dd-nest-001", 3,
    "\\frac{d}{dx}\\sin(\\sin(\\sin x))",
    "cos(sin(sin(x)))*cos(sin(x))*cos(x)", [CHAIN, "trig"],
    "三層鏈鎖，由外往內逐層乘。", 55);

  expr("dd-nest-002", 3,
    "\\frac{d}{dx}\\,e^{\\sin(x^2)}",
    "2*x*cos(x^2)*exp(sin(x^2))", [CHAIN, "exponential"],
    "外層 e^u 不變，內層 sin(x²) 的導數是 2x cos(x²)。", 55);

  expr("dd-nest-003", 5,
    "\\frac{d}{dx}\\sqrt{1+\\sqrt{1+\\sqrt{x}}}",
    "1/(8*sqrt(x)*sqrt(1+sqrt(x))*sqrt(1+sqrt(1+sqrt(x))))", [CHAIN, "radical"],
    "每一層根號都貢獻一個 1/(2√·)，三層乘起來就是 1/8 配上三個根號。", 100);

  expr("dd-nest-004", 4,
    "\\frac{d}{dx}\\ln\\left(\\ln\\left(x^2+4\\right)\\right)",
    "2*x/((x^2+4)*log(x^2+4))", [CHAIN, "log"],
    "每層 log 貢獻一個「1/內層」，最內層 x²+4 再貢獻 2x。", 60);

  expr("dd-nest-005", 5,
    "\\frac{d}{dx}\\arctan\\left(e^{\\sqrt{x}}\\right)",
    "exp(sqrt(x))/(2*sqrt(x)*(1+exp(2*sqrt(x))))", [CHAIN, "inverse-trig"],
    "arctan 外層給 1/(1+e^{2√x})，中層 e^{√x}，內層 1/(2√x)。", 90);

  expr("dd-nest-006", 4,
    "\\frac{d}{dx}\\sin(\\cos(\\tan x))",
    "-cos(cos(tan(x)))*sin(tan(x))/cos(x)^2", [CHAIN, "trig"],
    "三層都是三角，中間 cos 的負號別漏，最內層 tan' = sec²x。", 75);

  expr("dd-nest-007", 4,
    "\\frac{d}{dx}\\left(\\frac{x+1}{x-1}\\right)^{1/3}",
    "-2/(3*((x+1)/(x-1))^(2/3)*(x-1)^2)", [CHAIN, "quotient-rule"],
    "先把 1/3 次方當外層，內層商的導數是 −2/(x−1)²。", 80);

  expr("dd-nest-008", 4,
    "\\frac{d}{dx}\\,e^{e^{\\sin x}}",
    "exp(exp(sin(x)))*exp(sin(x))*cos(x)", [CHAIN, "exponential"],
    "兩層指數：外層原樣、中層原樣、最內層 cos x。", 60);

  /* ═══════════════ 三、反三角與雙曲（8）═══════════════
     這一區的陷阱是「先化簡再微分」往往比硬套公式短一大截。 */

  expr("dd-inv-001", 3,
    "\\frac{d}{dx}\\arcsin\\left(\\frac{x}{\\sqrt{1+x^2}}\\right)",
    "1/(1+x^2)", ["inverse-trig", CHAIN],
    "硬微分要用商數律加鏈鎖律；但這個角度的 tan 就是 x，整串其實等於 arctan x。", 70);

  expr("dd-inv-002", 5,
    "\\frac{d}{dx}\\arctan\\left(\\frac{x}{1+\\sqrt{1+x^2}}\\right)",
    "1/(2*(1+x^2))", ["inverse-trig", "trig"],
    "半角公式：這整串等於 (1/2)arctan x。硬微分要算半頁，認出來只要一行。", 105);

  expr("dd-inv-003", 4,
    "\\frac{d}{dx}\\left(x\\arcsin x+\\sqrt{1-x^2}\\right)",
    "arcsin(x)", ["inverse-trig", "product-rule"],
    "乘積律給 arcsin x + x/√(1−x²)，第二項的導數 −x/√(1−x²) 剛好抵掉。", 70);

  expr("dd-inv-004", 5,
    "\\frac{d}{dx}\\arctan\\sqrt{x^2-1}",
    "1/(x*sqrt(x^2-1))", ["inverse-trig", CHAIN],
    "外層 1/(1+(x²−1)) = 1/x²，內層 x/√(x²−1)。", 85);

  expr("dd-inv-005", 4,
    "\\frac{d}{dx}\\tanh(\\ln x)",
    "4*x/(x^2+1)^2", ["hyperbolic", "trap-drill"],
    "先化簡：tanh(log x) = (x²−1)/(x²+1)，再用商數律。硬套 sech² 也對，但會多繞一圈。", 80);

  expr("dd-inv-006", 3,
    "\\frac{d}{dx}\\ln(\\cosh x)",
    "tanh(x)", ["hyperbolic", CHAIN],
    "(cosh x)'/cosh x = sinh x / cosh x = tanh x。", 50);

  expr("dd-inv-007", 4,
    "\\frac{d}{dx}\\sinh(\\ln x)",
    "(1+1/x^2)/2", ["hyperbolic"],
    "sinh(log x) = (x − 1/x)/2，導數 (1 + 1/x²)/2。", 65);

  expr("dd-inv-008", 4,
    "\\frac{d}{dx}\\,\\frac{\\sinh x}{1+\\cosh x}",
    "1/(1+cosh(x))", ["hyperbolic", "quotient-rule"],
    "商數律的分子是 cosh(1+cosh) − sinh²＝cosh + 1，和分母約掉一個 (1+cosh)。", 80);

  /* ═══════════════ 四、隱函數（8）═══════════════
     y 是 x 的函數，微分 y 的任何式子都要補一個 y'。
     驗算走 implicit：在點附近用牛頓法解出 y(x) 再數值微分，不套 −F_x/F_y。 */

  num("dd-imp-001", 3,
    "x^2+4y^2=25\\ \\text{在點}\\ (3,2)\\ \\text{的}\\ \\frac{dy}{dx}",
    "-3/8", [IMP],
    "2x + 8y y' = 0 → y' = −x/(4y) = −3/8。橢圓比圓多出來的那個 4 最容易漏。", 60,
    { m: "implicit", F: "x^2+4y^2-25", at: [3, 2] });

  num("dd-imp-002", 4,
    "x^3+y^3=6xy\\ \\text{在點}\\ (3,3)\\ \\text{的}\\ \\frac{dy}{dx}",
    "-1", [IMP],
    "3x²+3y²y' = 6y+6xy' → y'(3y²−6x) = 6y−3x²，代 (3,3) 得 −9/9 = −1。", 75,
    { m: "implicit", F: "x^3+y^3-6xy", at: [3, 3] });

  num("dd-imp-003", 4,
    "e^{xy}=x+y\\ \\text{在點}\\ (0,1)\\ \\text{的}\\ \\frac{dy}{dx}",
    "0", [IMP, "exponential"],
    "e^{xy}(y+xy') = 1+y'，代 (0,1)：1·(1+0) = 1+y' → y' = 0。", 85,
    { m: "implicit", F: "e^{xy}-x-y", at: [0, 1] });

  num("dd-imp-004", 5,
    "x^y=y^x\\ \\text{在點}\\ (2,4)\\ \\text{的}\\ \\frac{dy}{dx}",
    "(4*log(2)-4)/(2*log(2)-1)", [IMP, LOGD],
    "兩邊取 log：y log x = x log y。微分後 y' log x + y/x = log y + x y'/y，代 (2,4) 解出。", 120,
    { m: "implicit", F: "x^y-y^x", at: [2, 4] });

  num("dd-imp-005", 3,
    "\\sqrt{x}+\\sqrt{y}=4\\ \\text{在點}\\ (4,4)\\ \\text{的}\\ \\frac{dy}{dx}",
    "-1", [IMP, "radical"],
    "1/(2√x) + y'/(2√y) = 0 → y' = −√y/√x = −1。", 55,
    { m: "implicit", F: "\\sqrt{x}+\\sqrt{y}-4", at: [4, 4] });

  num("dd-imp-006", 3,
    "y^3+xy=10\\ \\text{在點}\\ (1,2)\\ \\text{的}\\ \\frac{dy}{dx}",
    "-2/13", [IMP],
    "3y²y' + y + xy' = 0 → y'(12+1) = −2。", 60,
    { m: "implicit", F: "y^3+xy-10", at: [1, 2] });

  num("dd-imp-007", 4,
    "\\ln(xy)+y=1\\ \\text{在點}\\ (1,1)\\ \\text{的}\\ \\frac{dy}{dx}",
    "-1/2", [IMP, "log"],
    "log(xy) = log x + log y，所以 1/x + y'/y + y' = 0，代 (1,1) 得 1 + 2y' = 0。", 75,
    { m: "implicit", F: "\\ln(xy)+y-1", at: [1, 1] });

  num("dd-imp-008", 4,
    "x^3+y^3=9xy\\ \\text{在點}\\ (2,4)\\ \\text{的切線斜率}",
    "4/5", [IMP, "tangent-normal"],
    "3x²+3y²y' = 9y+9xy'，代 (2,4)：12+48y' = 36+18y' → y' = 24/30。", 80,
    { m: "implicit", F: "x^3+y^3-9xy", at: [2, 4] });

  /* ═══════════════ 五、反函數的導數（5）═══════════════
     (f⁻¹)′(b) = 1/f′(a)，其中 f(a)=b。難的不是公式，是找出那個 a。
     驗算走 inverseDeriv：自己解 f(x)=b，所以 a 找錯會被抓到。 */

  num("dd-invf-001", 3,
    "f(x)=x^3+x+1,\\ g=f^{-1}.\\quad g'(3)=?",
    "1/4", ["inverse-function"],
    "f(1)=3，f'(x)=3x²+1，f'(1)=4，所以 g'(3)=1/4。", 65,
    { m: "inverseDeriv", f: "x^3+x+1", at: 3, x0: 0.5 });

  num("dd-invf-002", 3,
    "f(x)=x^5+2x^3+7x+1,\\ g=f^{-1}.\\quad g'(1)=?",
    "1/7", ["inverse-function"],
    "f(0)=1，f'(0)=7，所以 g'(1)=1/7。", 65,
    { m: "inverseDeriv", f: "x^5+2x^3+7x+1", at: 1, x0: 0.3 });

  num("dd-invf-003", 3,
    "f(x)=x+\\sin x,\\ g=f^{-1}.\\quad g'(0)=?",
    "1/2", ["inverse-function", "trig"],
    "f(0)=0，f'(x)=1+cos x，f'(0)=2。", 60,
    { m: "inverseDeriv", f: "x+\\sin x", at: 0, x0: 0.4 });

  num("dd-invf-004", 4,
    "f(x)=x^3+3x^2+3x,\\ g=f^{-1}.\\quad g'(7)=?",
    "1/12", ["inverse-function"],
    "f(1)=7（看出是 (x+1)³−1 會更快），f'(1)=3+6+3=12。", 75,
    { m: "inverseDeriv", f: "x^3+3x^2+3x", at: 7, x0: 0.5 });

  num("dd-invf-005", 3,
    "f(x)=e^x+2x,\\ g=f^{-1}.\\quad g'(1)=?",
    "1/3", ["inverse-function", "exponential"],
    "f(0)=1，f'(0)=1+2=3。", 60,
    { m: "inverseDeriv", f: "e^x+2x", at: 1, x0: 0.2 });

  /* ═══════════════ 六、認出這是導數定義（5）═══════════════
     這種極限硬算會卡住，但只要看出 f 和 a 是誰，答案就是 f'(a)。 */

  num("dd-def-001", 2,
    "\\lim_{h\\to 0}\\frac{\\sqrt{9+h}-3}{h}",
    "1/6", ["derivative-definition"],
    "這是 f(x)=√x 在 x=9 的導數：1/(2·3)=1/6。", 45);

  num("dd-def-002", 3,
    "\\lim_{h\\to 0}\\frac{(2+h)^{10}-2^{10}}{h}",
    "5120", ["derivative-definition"],
    "f(x)=x¹⁰ 在 x=2 的導數：10·2⁹ = 5120。", 55);

  num("dd-def-003", 3,
    "\\lim_{h\\to 0}\\frac{\\sin\\left(\\frac{\\pi}{6}+h\\right)-\\frac12}{h}",
    "sqrt(3)/2", ["derivative-definition", "trig"],
    "f(x)=sin x 在 π/6 的導數：cos(π/6)=√3/2。", 55);

  num("dd-def-004", 3,
    "\\lim_{h\\to 0}\\frac{\\tan\\left(\\frac{\\pi}{4}+h\\right)-1}{h}",
    "2", ["derivative-definition", "trig"],
    "f(x)=tan x 在 π/4 的導數：sec²(π/4)=2。", 55);

  num("dd-def-005", 2,
    "\\lim_{h\\to 0}\\frac{\\ln(3+h)-\\ln 3}{h}",
    "1/3", ["derivative-definition", "log"],
    "f(x)=log x 在 x=3 的導數：1/3。", 45);

  /* ═══════════════ 七、尖點與可微性（4）═══════════════
     導數存不存在、在哪裡不存在，比會不會算更常考。 */

  num("dd-pw-001", 2,
    "f(x)=\\sqrt{x^2}\\ \\text{在}\\ x=-3\\ \\text{的導數}",
    "-1", ["differentiability"],
    "√(x²) 是 |x| 不是 x。x<0 那側等於 −x，導數 −1。（x=0 處左右導數 −1≠1，所以不可微。）", 60,
    { m: "deriv", f: "\\sqrt{x^2}", at: [-3] });

  num("dd-pw-002", 3,
    "f(x)=\\sqrt[3]{x-1}\\ \\text{在}\\ x=9\\ \\text{的導數}",
    "1/12", ["differentiability", "radical"],
    "f'(x) = (1/3)(x−1)^{−2/3}，代 x=9 得 (1/3)·8^{−2/3} = 1/12。（在 x=1 則是垂直切線，導數不存在。）", 60,
    { m: "deriv", f: "(x-1)^{1/3}", at: [9] });

  num("dd-pw-003", 3,
    "f(x)=x^2\\ (x\\ge 1),\\ f(x)=ax+b\\ (x<1)\\ \\text{處處可微，求}\\ a",
    "2", ["differentiability"],
    "可微 ⟹ 左右導數相等：a = (x²)'|_{x=1} = 2。（連續再給 b = −1。）", 70,
    { m: "deriv", f: "x^2", at: [1] });

  num("dd-pw-004", 4,
    "f(x)=\\sqrt{x}\\ (x\\ge 4),\\ f(x)=ax+b\\ (x<4)\\ \\text{處處可微，求}\\ b",
    "1", ["differentiability", "linearization"],
    "ax+b 就是 √x 在 x=4 的切線，b 是它的 y 截距：2 − (1/4)·4 = 1。", 85,
    { m: "linApprox", f: "\\sqrt{x}", a: 4, dx: -4 });

  /* ═══════════════ 八、參數式與極座標（4）═══════════════
     dy/dx = (dy/dt)/(dx/dt)，別直接對 t 微分就交卷。 */

  num("dd-par-001", 3,
    "x=t^2-t,\\ y=t^3-3t.\\quad t=2\\ \\text{時的}\\ \\frac{dy}{dx}",
    "3", ["parametric-differentiation"],
    "(3t²−3)/(2t−1)，代 t=2 得 9/3 = 3。", 60,
    { m: "paramSlope", x: "t^2-t", y: "t^3-3t", at: 2 });

  num("dd-par-002", 4,
    "x=\\cos t,\\ y=\\sin 2t.\\quad t=\\frac{\\pi}{6}\\ \\text{時的}\\ \\frac{dy}{dx}",
    "-2", ["parametric-differentiation", "trig"],
    "(2cos 2t)/(−sin t)，代 t=π/6 得 1/(−1/2) = −2。", 75,
    { m: "paramSlope", x: "\\cos t", y: "\\sin(2t)", at: "\\pi/6" });

  num("dd-par-003", 4,
    "x=e^t\\cos t,\\ y=e^t\\sin t.\\quad t=\\frac{\\pi}{2}\\ \\text{時的}\\ \\frac{dy}{dx}",
    "-1", ["parametric-differentiation", "exponential"],
    "分子分母的 e^t 消掉，剩 (sin t + cos t)/(cos t − sin t)，代 π/2 得 1/(−1) = −1。", 80,
    { m: "paramSlope", x: "e^t\\cos t", y: "e^t\\sin t", at: "\\pi/2" });

  num("dd-par-004", 5,
    "r=1+\\cos\\theta\\ \\text{在}\\ \\theta=\\frac{\\pi}{2}\\ \\text{的}\\ \\frac{dy}{dx}",
    "1", ["polar-curve", "parametric-differentiation"],
    "極座標先寫成參數式 x=r cos θ、y=r sin θ。θ=π/2 時 r=1、r'=−1，dy/dθ = −1、dx/dθ = −1。", 110,
    { m: "paramSlope", x: "(1+\\cos t)\\cos t", y: "(1+\\cos t)\\sin t", at: "\\pi/2" });

  /* ═══════════════ 九、相關變率（14）═══════════════
     每一題的驗算都把「隨時間變動的量」寫成一個 t 的函數再數值微分，
     和「先寫關係式、兩邊對 t 微分」共用不到任何一步代數。 */

  num("dd-rr-001", 3,
    "\\text{長 }5\\text{ 公尺的梯子靠牆，底端以每秒 }1\\text{ 公尺遠離牆。底端離牆 }3\\text{ 公尺時，頂端下降的速率（公尺／秒）}",
    "3/4", [RR, STORY],
    "x²+y²=25，2x x' + 2y y' = 0。x=3、y=4、x'=1 → y' = −3/4，下降速率 3/4。", 90,
    { m: "deriv", f: "4-\\sqrt{25-(3+x)^2}", at: [0] });

  num("dd-rr-002", 2,
    "\\text{水面漣漪半徑以每秒 }2\\text{ 公分擴大，半徑 }10\\text{ 公分時面積的變化率（平方公分／秒）}",
    "40*pi", [RR, STORY],
    "A=πr²，A' = 2πr r' = 2π·10·2 = 40π。", 60,
    { m: "deriv", f: "\\pi(10+2x)^2", at: [0] });

  num("dd-rr-003", 3,
    "\\text{球形氣球以每秒 }100\\text{ 立方公分充氣，半徑 }5\\text{ 公分時半徑的變化率（公分／秒）}",
    "1/pi", [RR, STORY],
    "V=4πr³/3，V' = 4πr² r' → 100 = 4π·25·r' → r' = 1/π。", 90,
    { m: "deriv", f: "\\left(\\frac{3\\left(\\frac{500\\pi}{3}+100x\\right)}{4\\pi}\\right)^{1/3}", at: [0] });

  num("dd-rr-004", 4,
    "\\text{倒圓錐水槽頂半徑 }2\\text{ 公尺、高 }4\\text{ 公尺，以每分鐘 }3\\text{ 立方公尺注水。水深 }2\\text{ 公尺時水位上升率（公尺／分）}",
    "3/pi", [RR, STORY],
    "相似三角形給 r=h/2，V = πh³/12，V' = (πh²/4)h' → 3 = π h' → h' = 3/π。", 110,
    { m: "deriv", f: "\\left(\\frac{12\\left(\\frac{2\\pi}{3}+3x\\right)}{\\pi}\\right)^{1/3}", at: [0] });

  num("dd-rr-005", 3,
    "\\text{路燈高 }6\\text{ 公尺，身高 }1.8\\text{ 公尺的人以每秒 }1.5\\text{ 公尺走離燈桿。影子長度的增加率（公尺／秒）}",
    "9/14", [RR, STORY],
    "相似三角形：1.8/s = 6/(d+s) → s = 1.8d/4.2。所以 s' = 1.8·1.5/4.2 = 9/14。", 100,
    { m: "deriv", f: "\\frac{1.8(20+1.5x)}{4.2}", at: [0] });

  num("dd-rr-006", 4,
    "\\text{飛機以每小時 }500\\text{ 公里水平飛過雷達站正上方 }2\\text{ 公里處。與雷達站距離 }5\\text{ 公里時，距離的變化率（公里／時）}",
    "100*sqrt(21)", [RR, STORY],
    "L²=x²+4，L L' = x x'。L=5 時 x=√21，L' = 500√21/5。", 110,
    { m: "deriv", f: "\\sqrt{(\\sqrt{21}+500x)^2+4}", at: [0] });

  num("dd-rr-007", 4,
    "\\text{滑輪在船頭上方 }6\\text{ 公尺處，以每秒 }2\\text{ 公尺收繩。船離碼頭 }8\\text{ 公尺時船前進的速率（公尺／秒）}",
    "5/2", [RR, STORY],
    "繩長 L²=x²+36，此刻 L=10。L L' = x x' → 10·(−2) = 8x' → x' = −2.5，速率 5/2。", 110,
    { m: "deriv", f: "8-\\sqrt{(10-2x)^2-36}", at: [0] });

  num("dd-rr-008", 4,
    "\\text{雪球表面積以每分鐘 }1\\text{ 平方公分縮小，半徑 }5\\text{ 公分時半徑的縮小率（公分／分）}",
    "1/(40*pi)", [RR, STORY],
    "A=4πr²，A' = 8πr r' → −1 = 40π r' → r' = −1/(40π)。", 100,
    { m: "deriv", f: "5-\\sqrt{\\frac{100\\pi-x}{4\\pi}}", at: [0] });

  num("dd-rr-009", 3,
    "\\text{熱氣球以每秒 }3\\text{ 公尺上升，觀察者站在 }50\\text{ 公尺外。氣球高 }50\\text{ 公尺時仰角的變化率（弧度／秒）}",
    "3/100", [RR, STORY],
    "θ = arctan(h/50)，θ' = (1/(1+1))·(3/50) = 3/100。", 95,
    { m: "deriv", f: "\\arctan\\frac{50+3x}{50}", at: [0] });

  num("dd-rr-010", 5,
    "\\text{兩電阻並聯：}R_1=80\\ \\text{以每秒 }0.3\\ \\text{增加、}R_2=100\\ \\text{以每秒 }0.2\\ \\text{減少。此刻總電阻的變化率}",
    "43/810", [RR, STORY],
    "1/R = 1/R₁+1/R₂ → R = 400/9。微分得 R' = R²(R₁'/R₁² + R₂'/R₂²) = (400/9)²(0.3/6400 − 0.2/10000)。", 140,
    { m: "deriv", f: "\\frac{(80+0.3x)(100-0.2x)}{180+0.1x}", at: [0] });

  num("dd-rr-011", 4,
    "\\text{沙以每分鐘 }10\\text{ 立方英尺落成圓錐堆，高恆等於底直徑。高 }15\\text{ 英尺時高度的上升率（英尺／分）}",
    "8/(45*pi)", [RR, STORY],
    "h=2r → V = πh³/12，V' = (πh²/4)h' → 10 = (225π/4)h'。", 120,
    { m: "deriv", f: "\\left(\\frac{12\\left(\\frac{1125\\pi}{4}+10x\\right)}{\\pi}\\right)^{1/3}", at: [0] });

  num("dd-rr-012", 2,
    "\\text{甲車向東 }60\\text{ 公里／時、乙車自同一點向北 }80\\text{ 公里／時。出發 }2\\text{ 小時後兩車距離的變化率（公里／時）}",
    "100", [RR, STORY],
    "距離 = √((60t)²+(80t)²) = 100t，變化率恆為 100（3-4-5）。", 70,
    { m: "deriv", f: "\\sqrt{(60x)^2+(80x)^2}", at: [2] });

  num("dd-rr-013", 2,
    "\\text{正立方體邊長以每秒 }2\\text{ 公分增加，邊長 }10\\text{ 公分時體積的變化率（立方公分／秒）}",
    "600", [RR, STORY],
    "V=x³，V' = 3x²x' = 3·100·2 = 600。", 55,
    { m: "deriv", f: "(10+2x)^3", at: [0] });

  num("dd-rr-014", 3,
    "\\text{正立方體表面積以每秒 }0.5\\text{ 平方公分增加，邊長 }4\\text{ 公分時邊長的變化率（公分／秒）}",
    "1/96", [RR, STORY],
    "A=6x²，A' = 12x x' → 0.5 = 48x' → x' = 1/96。", 85,
    { m: "deriv", f: "\\sqrt{\\frac{96+0.5x}{6}}", at: [0] });

  /* ═══════════════ 十、最佳化（14）═══════════════
     驗算走 extremum：多起點梯度搜尋直接找極值，不重跑「求導、解臨界點」。
     有界的幾何限制用 \sqrt{x^2} 或 6+6\sin u 這類寫法把定義域包進函數本身，
     否則搜尋會跑到限制外的假極值去。 */

  num("dd-opt-001", 3,
    "\\text{用 }100\\text{ 公尺圍籬沿直牆圍出矩形（牆那側不圍），最大面積（平方公尺）}",
    "1250", [OPT, STORY],
    "設兩側各 x，面積 A = x(100−2x)，x=25 時最大，A=1250。", 90,
    { m: "extremum", f: "x(100-2x)", vars: ["x"], kind: "max" });

  num("dd-opt-002", 4,
    "\\text{容積 }32000\\text{ 立方公分的無蓋方底盒，最省的表面積（平方公分）}",
    "4800", [OPT, STORY],
    "S = x² + 128000/x，x=40 時最小，S = 1600+3200 = 4800。", 110,
    { m: "extremum", f: "x^2+\\frac{128000}{\\sqrt{x^2}}", vars: ["x"], kind: "min" });

  num("dd-opt-003", 5,
    "\\text{容積 }1000\\text{ 立方公分的有蓋圓柱罐，最省的表面積（平方公分）}",
    "6*(250000*pi)^(1/3)", [OPT, STORY],
    "S = 2πr² + 2000/r，r³ = 500/π 時最小，代回整理得 6∛(250000π) ≈ 553.58。", 140,
    { m: "extremum", f: "2\\pi x^2+\\frac{2000}{\\sqrt{x^2}}", vars: ["x"], kind: "min" });

  num("dd-opt-004", 4,
    "\\text{點 }(0,3)\\ \\text{到拋物線 }y=x^2\\ \\text{的最短距離}",
    "sqrt(11)/2", [OPT],
    "d² = x²+(x²−3)²，令 u=x² 得 u²−5u+9，u=5/2 時最小值 11/4，d=√11/2。", 120,
    { m: "extremum", f: "\\sqrt{x^2+(x^2-3)^2}", vars: ["x"], kind: "min" });

  num("dd-opt-005", 4,
    "\\text{半徑 }5\\ \\text{的半圓內接矩形（一邊在直徑上）的最大面積}",
    "25", [OPT],
    "A = 2x√(25−x²)，x = 5/√2 時最大，A = 25（恰是 R²）。", 110,
    { m: "extremum", f: "2x\\sqrt{25-x^2}", vars: ["x"], kind: "max" });

  num("dd-opt-006", 5,
    "\\text{半徑 }3\\ \\text{的球內接圓柱的最大體積}",
    "12*sqrt(3)*pi", [OPT],
    "設半高 h，r² = 9−h²，V = 2πh(9−h²)。h=√3 時最大，V = 12√3 π。", 140,
    { m: "extremum", f: "2\\pi\\sqrt{x^2}(9-x^2)", vars: ["x"], kind: "max" });

  num("dd-opt-007", 4,
    "\\text{面積 }384\\text{ 平方公分的海報，上下留白各 }6\\text{ 公分、左右各 }4\\text{ 公分。最大印刷面積}",
    "96", [OPT, STORY],
    "寬 w、高 384/w，印刷面積 = 480 − 12w − 3072/w，w=16 時最大得 96。", 130,
    { m: "extremum", f: "480-12\\sqrt{x^2}-\\frac{3072}{\\sqrt{x^2}}", vars: ["x"], kind: "max" });

  num("dd-opt-008", 3,
    "\\text{需求為 }q=1000-20p\\ \\text{時，使收益 }p\\,q\\ \\text{最大的售價 }p",
    "25", [OPT, "marginal", STORY],
    "R = p(1000−20p) 是開口向下的拋物線，頂點在 p=25。", 80,
    { m: "extremum", f: "x(1000-20x)", vars: ["x"], kind: "max", arg: 0, tol: 1e-4 });

  num("dd-opt-009", 5,
    "\\text{小島離岸 }3\\text{ 公里，沿岸 }8\\text{ 公里處有小鎮。划船 }3\\text{ 公里／時、跑步 }5\\text{ 公里／時，最短所需時間（小時）}",
    "12/5", [OPT, STORY],
    "T(x) = √(9+x²)/3 + (8−x)/5。x/(3√(9+x²)) = 1/5 → x = 9/4，T = 5/4 + 23/20 = 2.4。", 150,
    { m: "extremum", f: "\\frac{\\sqrt{9+x^2}}{3}+\\frac{8-x}{5}", vars: ["x"], kind: "min" });

  num("dd-opt-010", 4,
    "\\text{河寬 }1\\text{ 公里，對岸下游 }5\\text{ 公里處有工廠。水下每公里 }5\\text{ 萬、陸上每公里 }3\\text{ 萬，最低總成本（萬）}",
    "19", [OPT, STORY],
    "C(x) = 5√(1+x²) + 3(5−x)。5x/√(1+x²) = 3 → x = 3/4，C = 25/4 + 51/4 = 19。", 140,
    { m: "extremum", f: "5\\sqrt{1+x^2}+3(5-x)", vars: ["x"], kind: "min" });

  num("dd-opt-011", 4,
    "\\text{邊長 }24\\text{ 的正方形鐵皮四角剪去小正方形折成無蓋盒，最大容積}",
    "1024", [OPT, STORY],
    "V = x(24−2x)²，x=4 時最大，V = 4·256 = 1024。", 120,
    // 剪去的邊長只能落在 (0,12)。x = 6+6 sin u 把這段區間攤成整條實數線，
    // 搜尋就不會跑到 x>12 的假極值去。
    { m: "extremum", f: "(6+6\\sin u)(24-2(6+6\\sin u))^2", vars: ["u"], kind: "max" });

  num("dd-opt-012", 4,
    "\\text{周長 }10\\text{ 公尺的諾曼窗（矩形上接半圓）的最大面積（平方公尺）}",
    "50/(4+pi)", [OPT, STORY],
    "設半圓半徑 r：2r+2h+πr = 10，A = 10r − 2r² − πr²/2。r = 10/(4+π) 時 A = 50/(4+π)。", 140,
    { m: "extremum", f: "10x-2x^2-\\frac{\\pi x^2}{2}", vars: ["x"], kind: "max" });

  num("dd-opt-013", 4,
    "\\text{直徑 }30\\text{ 的圓木切出矩形梁，強度正比於「寬}\\times\\text{高}^2\\text{」。這個乘積的最大值}",
    "6000*sqrt(3)", [OPT, STORY],
    "b²+h² = 900 → bh² = b(900−b²)，b = 10√3 時最大，值 6000√3。", 130,
    { m: "extremum", f: "\\sqrt{x^2}(900-x^2)", vars: ["x"], kind: "max" });

  num("dd-opt-014", 3,
    "C(q)=q^3-6q^2+15q\\ \\text{的最小平均成本}",
    "6", [OPT, "marginal"],
    "平均成本 C/q = q²−6q+15，q=3 時最小值 6。", 80,
    { m: "extremum", f: "x^2-6x+15", vars: ["x"], kind: "min" });

  /* ═══════════════ 十一、運動（5）═══════════════ */

  num("dd-kin-001", 2,
    "s(t)=t^3-9t^2+24t.\\quad t=3\\ \\text{時的速度}",
    "-3", ["kinematics", STORY],
    "v = 3t²−18t+24，代 t=3 得 27−54+24 = −3（此刻正在往回走）。", 55,
    { m: "deriv", f: "x^3-9x^2+24x", at: [3] });

  num("dd-kin-002", 3,
    "h(t)=-5t^2+40t+1\\ \\text{（公尺），最大高度（公尺）}",
    "81", ["kinematics", STORY, OPT],
    "v = −10t+40 = 0 → t=4，h(4) = −80+160+1 = 81。", 70,
    { m: "extremum", f: "-5x^2+40x+1", vars: ["x"], kind: "max" });

  num("dd-kin-003", 3,
    "x(t)=\\sin 2t.\\quad t=\\frac{\\pi}{6}\\ \\text{時的加速度}",
    "-2*sqrt(3)", ["kinematics"],
    "a = −4 sin 2t，代 t=π/6 得 −4 sin(π/3) = −2√3。", 65,
    { m: "deriv", f: "\\sin(2x)", at: ["\\pi/6"], order: 2, tol: 1e-4 });

  num("dd-kin-004", 3,
    "s(t)=t^4-4t^3+2.\\quad t=1\\ \\text{時的加速度}",
    "-12", ["kinematics"],
    "a = 12t²−24t，代 t=1 得 −12。", 55,
    { m: "deriv", f: "x^4-4x^3+2", at: [1], order: 2, tol: 1e-4 });

  num("dd-kin-005", 3,
    "s(t)=\\frac{t}{t^2+1}.\\quad t=2\\ \\text{時的速度}",
    "-3/25", ["kinematics", "quotient-rule"],
    "v = (1−t²)/(1+t²)²，代 t=2 得 −3/25。", 65,
    { m: "deriv", f: "\\frac{x}{x^2+1}", at: [2] });

  /* ═══════════════ 十二、線性近似與誤差傳遞（5）═══════════════
     驗算的 f′ 一律由數值微分給，所以手推的導數錯了就對不上。 */

  num("dd-lin-001", 2,
    "\\text{用線性近似估計 }\\sqrt[3]{8.06}",
    "2.005", ["linear-approximation", "estimate"],
    "f(x)=∛x，f(8)=2、f'(8)=1/12。L = 2 + 0.06/12 = 2.005。", 70,
    { m: "linApprox", f: "x^{1/3}", a: 8, dx: 0.06 });

  num("dd-lin-002", 2,
    "\\text{用線性近似估計 }\\sqrt{101}",
    "10.05", ["linear-approximation", "estimate"],
    "f(x)=√x 在 100：f'(100)=1/20，L = 10 + 1/20 = 10.05。", 60,
    { m: "linApprox", f: "\\sqrt{x}", a: 100, dx: 1 });

  num("dd-lin-003", 2,
    "\\text{用線性近似估計 }\\ln(1.05)",
    "0.05", ["linear-approximation", "log", "estimate"],
    "f(x)=log x 在 1：f'(1)=1，L = 0 + 0.05。", 60,
    { m: "linApprox", f: "\\ln(x)", a: 1, dx: 0.05 });

  num("dd-lin-004", 3,
    "\\text{球半徑量得 }10\\text{ 公分、誤差 }0.05\\text{ 公分。用微分估計體積的誤差（立方公分）}",
    "20*pi", ["linear-approximation", STORY],
    "V = 4πr³/3，dV = 4πr²dr = 4π·100·0.05 = 20π。", 80,
    { m: "differential", f: "\\frac{4}{3}\\pi x^3", a: 10, dx: 0.05 });

  num("dd-lin-005", 3,
    "\\text{正立方體邊長量得 }5\\text{ 公分、誤差 }0.02\\text{ 公分。用微分估計體積的誤差（立方公分）}",
    "1.5", ["linear-approximation", STORY],
    "V = x³，dV = 3x²dx = 75·0.02 = 1.5。", 70,
    { m: "differential", f: "x^3", a: 5, dx: 0.02 });

  /* ═══════════════ 十三、邊際分析（4）═══════════════ */

  num("dd-mar-001", 2,
    "C(q)=0.01q^3-0.6q^2+13q+100.\\quad q=50\\ \\text{時的邊際成本}",
    "28", ["marginal", STORY],
    "C' = 0.03q²−1.2q+13，代 q=50 得 75−60+13 = 28。", 65,
    { m: "deriv", f: "0.01x^3-0.6x^2+13x+100", at: [50] });

  num("dd-mar-002", 2,
    "R(q)=q(60-0.5q).\\quad q=20\\ \\text{時的邊際收益}",
    "40", ["marginal", STORY],
    "R = 60q−0.5q²，R' = 60−q = 40。", 55,
    { m: "deriv", f: "x(60-0.5x)", at: [20] });

  num("dd-mar-003", 3,
    "R(q)=100q-0.5q^2,\\ C(q)=20q+500.\\quad \\text{最大利潤}",
    "2700", ["marginal", OPT, STORY],
    "P = 80q − 0.5q² − 500，q=80 時 P = 6400−3200−500 = 2700。", 95,
    { m: "extremum", f: "80x-0.5x^2-500", vars: ["x"], kind: "max" });

  num("dd-mar-004", 3,
    "C(q)=0.5q^2+20q+800.\\quad \\text{最小平均成本}",
    "60", ["marginal", OPT, STORY],
    "C/q = 0.5q + 20 + 800/q，q=40 時最小：20+20+20 = 60。", 95,
    { m: "extremum", f: "0.5\\sqrt{x^2}+20+\\frac{800}{\\sqrt{x^2}}", vars: ["x"], kind: "min" });

  /* ═══════════════ 十四、牛頓法（3）═══════════════
     驗算真的跑一次牛頓迭代，而且斜率用數值微分算 —— 手推的 f′ 錯了會被抓出來。 */

  num("dd-new-001", 3,
    "f(x)=x^3-2x-5,\\ x_0=2.\\quad \\text{牛頓法一次迭代後的 }x_1",
    "21/10", ["newton-method"],
    "f(2) = −1、f'(2) = 10，x₁ = 2 − (−1)/10 = 2.1。", 70,
    { m: "root", f: "x^3-2x-5", x0: 2, n: 1 });

  num("dd-new-002", 3,
    "f(x)=x^2-2,\\ x_0=1.\\quad \\text{牛頓法兩次迭代後的 }x_2",
    "17/12", ["newton-method"],
    "x₁ = 1 − (−1)/2 = 3/2；x₂ = 3/2 − (1/4)/3 = 17/12 ≈ 1.4167。", 85,
    { m: "root", f: "x^2-2", x0: 1, n: 2 });

  num("dd-new-003", 3,
    "f(x)=x^3-7,\\ x_0=2.\\quad \\text{牛頓法一次迭代後的 }x_1",
    "23/12", ["newton-method"],
    "f(2) = 1、f'(2) = 12，x₁ = 2 − 1/12 = 23/12。", 70,
    { m: "root", f: "x^3-7", x0: 2, n: 1 });

  /* ═══════════════ 十五、成長與衰變的瞬時速率（3）═══════════════ */

  num("dd-grw-001", 3,
    "T(t)=20+80e^{-0.05t}\\ \\text{（}^{\\circ}\\text{C）。}t=10\\ \\text{時的降溫速率}",
    "-4*exp(-0.5)", ["newton-cooling", STORY, "exponential"],
    "T' = −4e^{−0.05t}，代 t=10 得 −4e^{−0.5} ≈ −2.43 °C／分。", 85,
    { m: "deriv", f: "20+80e^{-0.05x}", at: [10] });

  num("dd-grw-002", 4,
    "\\text{指數成長的族群 }P(0)=500,\\ P(2)=800\\text{。}t=4\\ \\text{時的成長率}",
    "640*log(1.6)", ["exponential-growth", STORY],
    "e^{2k} = 1.6 → k = (log 1.6)/2。P(4) = 500·1.6² = 1280，P'(4) = 1280k = 640 log 1.6 ≈ 300.8。", 120,
    { m: "deriv", f: "500e^{\\frac{\\ln(1.6)}{2}x}", at: [4] });

  num("dd-grw-003", 4,
    "\\text{半衰期 }8\\text{ 天的同位素，初始 }40\\text{ 公克。}t=8\\ \\text{天時的衰變速率（公克／天）}",
    "-2.5*log(2)", ["half-life", STORY],
    "m(t) = 40·2^{−t/8}，m' = −5 log2 · 2^{−t/8}，代 t=8 得 −2.5 log 2 ≈ −1.733。", 110,
    { m: "deriv", f: "40\\cdot 2^{-x/8}", at: [8] });

  /* ═══════════ 提示 ═══════════
     只寫給 R5 以上、而且原本一條提示都沒有的題。
     第一層說「該看出什麼」，第二層說「關鍵那一步」；兩層都不說出答案。 */
  const HINTS = {
    "dd-nest-005": [
      "三層：arctan 在最外、e^(·) 在中間、√x 在最裡。先由外往內把三個導數各寫下來。",
      "arctan 的分母是 1+(內層)²，而內層是 e^{√x} —— 平方之後是指數乘 2，不是把 √x 平方。"
    ],
    "dd-inv-002": [
      "先不要動手微分。令 x = tan θ 代進去，看看整串會化簡成什麼。",
      "化簡後的形狀是半角公式。認出來這題只剩一行；硬微分要算半頁。"
    ],
    "dd-imp-004": [
      "兩邊取自然對數，把指數搬下來變成乘積，再做隱微分。",
      "微分之後先代入該點再解 y′。注意 log 2 不會消掉，它會留在答案裡。"
    ],
    "dd-par-004": [
      "極座標要先寫成參數式 x = r cos θ、y = r sin θ，再用 dy/dx = (dy/dθ)/(dx/dθ)。",
      "在該點先把 r 與 r′ 算出來；兩個微分裡都會用到乘法律。"
    ],
    "dd-rr-010": [
      "先寫下並聯關係式 1/R = 1/R₁ + 1/R₂，再對時間微分 —— 每一項都會冒出一個負號。",
      "整理成 R′ = R²(R₁′/R₁² + R₂′/R₂²)。注意其中一個電阻是在**減少**，它的變化率是負的。"
    ],
    "dd-opt-003": [
      "用體積的限制把高消掉，讓表面積只剩半徑一個變數。",
      "表面積會長成「二次項加上常數除以 r」。微分設 0 之後會得到 r³ 等於某個數。"
    ],
    "dd-opt-006": [
      "設圓柱的半高，用畢氏定理把底半徑用球半徑與半高表示出來。",
      "體積會變成半高的三次多項式，微分設 0 解出半高再代回去。"
    ],
    "dd-opt-009": [
      "設登陸點離小鎮正對岸的距離，把總時間寫成它的函數 —— 划船那一段是直角三角形的斜邊。",
      "微分設 0 會得到一個含根號的方程；移項平方解出來之後，記得回頭檢查端點。"
    ]
  };

  problems.forEach((problem) => {
    if (HINTS[problem.id]) problem.hints = HINTS[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

(function () {
  "use strict";

  // ── 第二段：微分平衡包（2026-09）──────────────────────────────────
  // 跟上面的深水包放同一個檔：script 標籤預算（66 支）裡寫著「題庫檔再加就先合併」。
  // 兩段各自是獨立的 IIFE，id 前綴不同（dd- 與 db-），互不影響。
  //
  // 微分平衡包（2026-09）：131 題，把微分那一區的難度分佈拉回來。
  //
  // 動機是題庫盤點（2026-09-20）：單變數的微分題 558 題、積分題 579 題，看起來平衡，
  // 但拆開難度看：R5 微分只有 49 題、積分有 129 題；而微分的 R5–R6 裡
  // 高階導數（d²⁰/dx²⁰ 那種）加複變佔了一半 —— 練到後段的人會覺得
  // 「微分題很少，而且都是怪題」。這一包一題 n 階怪函數都沒有，
  // 全押在課本會考、考試會出、但題庫缺的那幾類，R3–R5 為主：
  //   導數定義的極限形式 8 · 深層鏈鎖律 12 · 隱函數（含二階）9 · 反函數導數 9
  //   反三角與雙曲 8 · 對數微分 6 · 切線與法線 9 · 相關變率 10 · 線性近似與微分 8
  //   極值與 MVT 13 · 參數式 8 · 泰勒係數與 f⁽ⁿ⁾(0) 9 · 變上限積分 6 · 牛頓法 4 · 最佳化 8 · 運動與邊際 4
  //
  // 驗算：算式型（d/dx(...)）與極限型的題幹交給自動驗算；數值型每一題都帶 verify 描述子，
  // 走 tools/lib/verify_engine.js 的 deriv / implicitDeriv / inverseDeriv / paramSlope / paramSecond /
  // criticalPoint / mvtPoint / ftcDeriv / derivAt0 / linApprox / differential / tangentNormal / root /
  // extremum1d 路徑。這些路徑一律用數值微分、數值積分、掃描與求根，不重複作者的代數 ——
  // 手推的 f′ 錯了、「f(a) = b」根本不成立、切點不在曲線上，驗算端會算出不同的數字或直接丟錯。
  const SOURCE = "Buzz derivative balance pack";
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
      ...problem,
      tags
    });
  }

  // 算式型：答案是一個函數，題幹本身就是 d/dx(...)，交給自動驗算
  function expr(id, rank, prompt, answer, tags, solution, timeLimit) {
    add({ id, topic: "derivatives", rank, prompt, answerKind: "expression", answer, tags, solution, timeLimit });
  }

  // 數值型：答案是一個數，verify 指定獨立的驗算路徑（極限形式的題幹自動驗，不用 verify）
  function num(id, rank, prompt, answer, tags, solution, timeLimit, verify) {
    add({ id, topic: "derivatives", rank, prompt, answerKind: "numeric", answer, tags, solution, timeLimit, verify });
  }

  const CHAIN = "chain-rule";
  const IMP = "implicit-differentiation";
  const INV = "inverse-function";
  const ITRIG = "inverse-trig";
  const HYP = "hyperbolic";
  const LOGD = "log-differentiation";
  const TAN = "tangent-normal";
  const RR = "related-rates";
  const LIN = "linear-approximation";
  const OPT = "optimization";
  const MVT = "mvt";
  const PAR = "parametric";
  const TAY = "taylor";
  const FTC = "ftc";
  const DEF = "derivative-definition";
  const STORY = "story-problem";

  /* ═══════════════ 一、導數定義的極限形式（8）═══════════════
     看到 lim (f(a+h) − f(a))/h 要認出它是 f′(a)，不要真的去算極限。 */

  num("db-def-001", 2,
    "\\lim_{h\\to 0}\\frac{(2+h)^3-8}{h}",
    "12", [DEF],
    "這是 f(x) = x³ 在 x = 2 的導數：3·2² = 12。", 45);

  num("db-def-002", 3,
    "\\lim_{h\\to 0}\\frac{\\cos\\left(\\frac{\\pi}{3}+h\\right)-\\frac12}{h}",
    "-sqrt(3)/2", [DEF, "trig"],
    "f(x) = cos x 在 π/3 的導數 = −sin(π/3) = −√3/2。", 55);

  num("db-def-003", 3,
    "\\lim_{x\\to 1}\\frac{x^x-1}{x-1}",
    "1", [DEF, LOGD],
    "f(x) = x^x 在 x = 1 的導數：f′ = x^x(ln x + 1)，代 1 得 1。", 60);

  num("db-def-004", 4,
    "\\lim_{h\\to 0}\\frac{e^{3h}-e^{-2h}}{h}",
    "5", [DEF, "exponential"],
    "拆成 (e^{3h} − 1)/h − (e^{−2h} − 1)/h = 3 − (−2) = 5。", 65);

  num("db-def-005", 4,
    "\\lim_{h\\to 0}\\frac{\\arctan(1+h)-\\frac{\\pi}{4}}{h}",
    "1/2", [DEF, ITRIG],
    "arctan 在 x = 1 的導數 1/(1 + 1²) = 1/2。", 60);

  num("db-def-006", 4,
    "\\lim_{h\\to 0}\\frac{\\ln(e+h)-1}{h}",
    "1/e", [DEF, "log"],
    "ln 在 x = e 的導數 1/e（ln e = 1 是那個「減掉的 f(a)」）。", 60);

  num("db-def-007", 5,
    "\\lim_{h\\to 0}\\frac{\\ln(2+2h)-\\ln(2-3h)}{h}",
    "5/2", [DEF, "log"],
    "寫成 [f(2+2h) − f(2)]/h − [f(2−3h) − f(2)]/h = 2f′(2) + 3f′(2) = 5·(1/2)。", 80);

  num("db-def-008", 3,
    "\\lim_{x\\to \\pi/4}\\frac{\\tan x-1}{x-\\frac{\\pi}{4}}",
    "2", [DEF, "trig"],
    "tan 在 π/4 的導數 sec²(π/4) = 2。", 55);

  /* ═══════════════ 二、深層鏈鎖律（12）═══════════════
     一層一層剝，最外層先微，裡面的照抄再乘內層的導數。 */

  expr("db-chain-001", 2,
    "\\frac{d}{dx}\\left(\\sin(3x^2)\\right)",
    "6*x*cos(3*x^2)", [CHAIN, "trig"],
    "外層 sin → cos(3x²)，內層 3x² → 6x。", 40);

  expr("db-chain-002", 3,
    "\\frac{d}{dx}\\left(\\sqrt{1+\\sqrt{x}}\\right)",
    "1/(4*sqrt(x)*sqrt(1+sqrt(x)))", [CHAIN, "radical"],
    "外層 1/(2√(1+√x))，內層 √x 的導數 1/(2√x)，相乘。", 60);

  expr("db-chain-003", 3,
    "\\frac{d}{dx}\\left(e^{\\sin(2x)}\\right)",
    "2*cos(2*x)*exp(sin(2*x))", [CHAIN, "exponential", "trig"],
    "e^{u} 照抄再乘 u′ = 2cos(2x)。", 50);

  expr("db-chain-004", 3,
    "\\frac{d}{dx}\\left(\\ln(\\cos x)\\right)",
    "-tan(x)", [CHAIN, "log", "trig"],
    "(cos x)′/cos x = −sin x/cos x = −tan x。", 45);

  expr("db-chain-005", 4,
    "\\frac{d}{dx}\\left(\\cos\\left(\\sin(x^2)\\right)\\right)",
    "-2*x*sin(sin(x^2))*cos(x^2)", [CHAIN, "trig"],
    "三層：−sin(sin(x²)) · cos(x²) · 2x。", 80);

  expr("db-chain-006", 4,
    "\\frac{d}{dx}\\left(\\ln\\left(\\sqrt{x^2+4}-x\\right)\\right)",
    "-1/sqrt(x^2+4)", [CHAIN, "log", "radical"],
    "分子 x/√(x²+4) − 1 = (x − √(x²+4))/√(x²+4)，跟分母約掉剩 −1/√(x²+4)。", 80);

  expr("db-chain-007", 4,
    "\\frac{d}{dx}\\left(\\arctan\\left(e^{2x}\\right)\\right)",
    "2*exp(2*x)/(1+exp(4*x))", [CHAIN, ITRIG, "exponential"],
    "1/(1+u²) 乘 u′，u = e^{2x}，u² = e^{4x}。", 65);

  expr("db-chain-008", 4,
    "\\frac{d}{dx}\\left(\\frac{x}{\\sqrt{1-x^2}}\\right)",
    "1/(1-x^2)^(3/2)", [CHAIN, "quotient-rule", "radical"],
    "商數律後通分：[(1−x²) + x²]/(1−x²)^{3/2}。", 80);

  expr("db-chain-009", 5,
    "\\frac{d}{dx}\\left(\\ln\\left(\\ln(x^2+2)\\right)\\right)",
    "2*x/((x^2+2)*log(x^2+2))", [CHAIN, "log"],
    "兩層 ln 再一層 x²+2：1/ln(x²+2) · 1/(x²+2) · 2x。", 70);

  expr("db-chain-010", 5,
    "\\frac{d}{dx}\\left(\\sqrt{x+\\sqrt{x+\\sqrt{x}}}\\right)",
    "(1+(1+1/(2*sqrt(x)))/(2*sqrt(x+sqrt(x))))/(2*sqrt(x+sqrt(x+sqrt(x))))", [CHAIN, "radical"],
    "由外往內：1/(2√外) · (1 + 內層的導數)，內層又是同一個模樣，寫三次。", 100);

  expr("db-chain-011", 4,
    "\\frac{d}{dx}\\left(\\tan^3(2x)\\right)",
    "6*tan(2*x)^2/cos(2*x)^2", [CHAIN, "trig"],
    "3tan²(2x) · sec²(2x) · 2。", 60);

  expr("db-chain-012", 5,
    "\\frac{d}{dx}\\left(x\\arctan\\frac{1}{x}\\right)",
    "atan(1/x)-x/(1+x^2)", [CHAIN, ITRIG, "product-rule"],
    "乘積律：arctan(1/x) + x · [1/(1+1/x²)] · (−1/x²) = arctan(1/x) − x/(x²+1)。", 90);

  /* ═══════════════ 三、隱函數（9）：含二階 ═══════════════
     y 是 y(x)：微分 y 要補 y′。二階時 y′ 再代回去。 */

  num("db-imp-001", 2,
    "y^3+xy=6\\ \\text{在點}\\ (5,1)\\ \\text{的}\\ \\frac{dy}{dx}",
    "-1/8", [IMP],
    "3y²y′ + y + xy′ = 0 → y′(3 + 5) = −1。", 55,
    { m: "implicit", F: "y^3+xy-6", at: [5, 1] });

  num("db-imp-002", 3,
    "x^2-xy+y^2=7\\ \\text{在點}\\ (2,3)\\ \\text{的}\\ \\frac{dy}{dx}",
    "-1/4", [IMP],
    "2x − y − xy′ + 2yy′ = 0 → y′ = (y − 2x)/(2y − x) = (3 − 4)/(6 − 2)。", 60,
    { m: "implicit", F: "x^2-xy+y^2-7", at: [2, 3] });

  num("db-imp-003", 3,
    "xe^{y}+ye^{x}=1\\ \\text{在點}\\ (0,1)\\ \\text{的}\\ \\frac{dy}{dx}",
    "-(e+1)", [IMP, "exponential"],
    "e^y + xe^y y′ + y′e^x + ye^x = 0，代 (0, 1)：e + y′ + 1 = 0。", 70,
    { m: "implicit", F: "xe^{y}+ye^{x}-1", at: [0, 1] });

  num("db-imp-004", 4,
    "\\cos y=x\\ \\text{在點}\\ \\left(\\tfrac12,\\tfrac{\\pi}{3}\\right)\\ \\text{的}\\ \\frac{dy}{dx}",
    "-2/sqrt(3)", [IMP, "trig"],
    "−sin y · y′ = 1 → y′ = −1/sin(π/3) = −2/√3。這就是 arccos 的導數。", 60,
    { m: "implicit", F: "\\cos y-x", at: ["1/2", "\\pi/3"] });

  num("db-imp-005", 4,
    "x^2+y^2=25\\ \\text{在點}\\ (3,4)\\ \\text{的}\\ \\frac{d^2y}{dx^2}",
    "-25/64", [IMP, "second-derivative"],
    "y′ = −x/y；再微分 y″ = −(y − xy′)/y² = −(y² + x²)/y³ = −25/64。", 90,
    { m: "implicitDeriv", F: "x^2+y^2-25", at: [3, 4], order: 2 });

  num("db-imp-006", 4,
    "xy=4\\ \\text{在點}\\ (2,2)\\ \\text{的}\\ \\frac{d^2y}{dx^2}",
    "1", [IMP, "second-derivative"],
    "y + xy′ = 0 → y′ = −y/x；y″ = −(y′x − y)/x² = 2y/x² = 1。", 75,
    { m: "implicitDeriv", F: "xy-4", at: [2, 2], order: 2 });

  num("db-imp-007", 5,
    "x^3+y^3=2\\ \\text{在點}\\ (1,1)\\ \\text{的}\\ \\frac{d^2y}{dx^2}",
    "-4", [IMP, "second-derivative"],
    "x² + y²y′ = 0 → y′ = −1；再微分 2x + 2y(y′)² + y²y″ = 0 → 2 + 2 + y″ = 0。", 100,
    { m: "implicitDeriv", F: "x^3+y^3-2", at: [1, 1], order: 2 });

  num("db-imp-008", 4,
    "x^2y+xy^3=2\\ \\text{在點}\\ (1,1)\\ \\text{的}\\ \\frac{dy}{dx}",
    "-3/4", [IMP],
    "2xy + x²y′ + y³ + 3xy²y′ = 0 → 2 + y′ + 1 + 3y′ = 0。", 65,
    { m: "implicit", F: "x^2y+xy^3-2", at: [1, 1] });

  num("db-imp-009", 5,
    "\\arctan\\frac{y}{x}=\\ln\\sqrt{x^2+y^2}\\ \\text{在點}\\ (1,0)\\ \\text{的}\\ \\frac{dy}{dx}",
    "1", [IMP, ITRIG, "log"],
    "左邊導數 (xy′ − y)/(x² + y²)，右邊 (x + yy′)/(x² + y²)：xy′ − y = x + yy′，代 (1, 0) 得 y′ = 1。", 110,
    { m: "implicit", F: "\\arctan(y/x)-\\ln\\sqrt{x^2+y^2}", at: [1, 0] });

  /* ═══════════════ 四、反函數導數（9）═══════════════
     (f⁻¹)′(b) = 1/f′(a)，而且 a 要自己找：解 f(a) = b。最常錯的是 a 找錯。 */

  num("db-inv-001", 2,
    "f(x)=x^3+x,\\quad (f^{-1})'(2)",
    "1/4", [INV],
    "f(1) = 2，f′(1) = 3 + 1 = 4。", 50,
    { m: "inverseDeriv", f: "x^3+x", at: 2 });

  num("db-inv-002", 3,
    "f(x)=x+e^{x},\\quad (f^{-1})'(1)",
    "1/2", [INV, "exponential"],
    "f(0) = 1，f′(0) = 1 + 1 = 2。", 55,
    { m: "inverseDeriv", f: "x+e^{x}", at: 1, x0: 0.5 });

  num("db-inv-003", 3,
    "f(x)=x^5+x^3+x,\\quad (f^{-1})'(3)",
    "1/9", [INV],
    "f(1) = 3，f′(1) = 5 + 3 + 1 = 9。", 55,
    { m: "inverseDeriv", f: "x^5+x^3+x", at: 3 });

  num("db-inv-004", 4,
    "f(x)=2x+\\sin x,\\quad (f^{-1})'(2\\pi)",
    "1", [INV, "trig"],
    "f(π) = 2π，f′(π) = 2 + cos π = 1。", 65,
    { m: "inverseDeriv", f: "2x+\\sin x", at: "2\\pi", x0: 3 });

  num("db-inv-005", 4,
    "f(x)=x+\\ln x,\\quad (f^{-1})'(1)",
    "1/2", [INV, "log"],
    "f(1) = 1，f′(1) = 1 + 1 = 2。", 60,
    { m: "inverseDeriv", f: "x+\\ln x", at: 1, x0: 1.5 });

  num("db-inv-006", 4,
    "f(x)=x^3+3x+1,\\quad (f^{-1})'(5)",
    "1/6", [INV],
    "f(1) = 5，f′(1) = 3 + 3 = 6。", 60,
    { m: "inverseDeriv", f: "x^3+3x+1", at: 5 });

  num("db-inv-007", 5,
    "f(x)=xe^{x}\\ (x>0),\\quad (f^{-1})'(e)",
    "1/(2*e)", [INV, "exponential"],
    "f(1) = e，f′(x) = (x + 1)e^x，f′(1) = 2e。", 75,
    { m: "inverseDeriv", f: "xe^{x}", at: "e", x0: 1.2 });

  num("db-inv-008", 5,
    "f(x)=\\tan x+x\\ \\left(|x|<\\tfrac{\\pi}{2}\\right),\\quad (f^{-1})'\\left(1+\\tfrac{\\pi}{4}\\right)",
    "1/3", [INV, "trig"],
    "f(π/4) = 1 + π/4，f′(π/4) = sec²(π/4) + 1 = 3。", 85,
    { m: "inverseDeriv", f: "\\tan x+x", at: "1+\\pi/4", x0: 0.7 });

  num("db-inv-009", 4,
    "f(x)=x^3+2x+\\sin x,\\quad (f^{-1})'(0)",
    "1/3", [INV, "trig"],
    "f(0) = 0，f′(0) = 0 + 2 + 1 = 3。", 60,
    { m: "inverseDeriv", f: "x^3+2x+\\sin x", at: 0, x0: 0.5 });

  /* ═══════════════ 五、反三角與雙曲（8）═══════════════ */

  expr("db-itrig-001", 2,
    "\\frac{d}{dx}\\left(\\arcsin\\frac{x}{2}\\right)",
    "1/sqrt(4-x^2)", [ITRIG, CHAIN],
    "1/√(1 − u²) 乘 u′ = 1/2：1/(2√(1 − x²/4)) = 1/√(4 − x²)。", 45);

  expr("db-itrig-002", 3,
    "\\frac{d}{dx}\\left(\\arctan(x^2)\\right)",
    "2*x/(1+x^4)", [ITRIG, CHAIN],
    "1/(1 + u²) 乘 2x，u² = x⁴。", 45);

  expr("db-itrig-003", 3,
    "\\frac{d}{dx}\\left(x\\arctan x-\\tfrac12\\ln(1+x^2)\\right)",
    "atan(x)", [ITRIG, "log"],
    "乘積律的 x/(1+x²) 跟後面那項的導數剛好抵消，只剩 arctan x。這是 ∫arctan 的來源。", 60);

  expr("db-itrig-004", 4,
    "\\frac{d}{dx}\\left(\\arctan\\sqrt{x^2+1}\\right)",
    "x/((x^2+2)*sqrt(x^2+1))", [ITRIG, CHAIN, "radical"],
    "1/(1 + u²) 乘 u′：1 + u² = x² + 2，u′ = x/√(x²+1)。", 75);

  expr("db-itrig-005", 3,
    "\\frac{d}{dx}\\left(\\sinh x\\cosh x\\right)",
    "cosh(2*x)", [HYP, "product-rule"],
    "cosh²x + sinh²x = cosh 2x。", 50);

  expr("db-itrig-006", 3,
    "\\frac{d}{dx}\\left(\\tanh(x^2)\\right)",
    "2*x/cosh(x^2)^2", [HYP, CHAIN],
    "sech²(u) 乘 u′ = 2x。", 50);

  expr("db-itrig-007", 4,
    "\\frac{d}{dx}\\left(\\arctan(\\tanh x)\\right)",
    "1/cosh(2*x)", [ITRIG, HYP, CHAIN],
    "sech²x/(1 + tanh²x)，分子分母同乘 cosh²x：1/(cosh²x + sinh²x) = 1/cosh 2x。", 85);

  expr("db-itrig-008", 4,
    "\\frac{d}{dx}\\left(\\arctan(\\sinh x)\\right)",
    "1/cosh(x)", [HYP, ITRIG, CHAIN],
    "cosh x/(1 + sinh²x) = cosh x/cosh²x。", 65);

  /* ═══════════════ 六、對數微分（6）═══════════════ */

  expr("db-logd-001", 4,
    "\\frac{d}{dx}\\left(x^{\\arctan x}\\right)",
    "x^atan(x)*(log(x)/(1+x^2)+atan(x)/x)", [LOGD, ITRIG],
    "ln y = arctan x · ln x，微分 y′/y = ln x/(1 + x²) + arctan x/x。", 75);

  expr("db-logd-002", 4,
    "\\frac{d}{dx}\\left((x+1)^{x^2}\\right)",
    "(x+1)^(x^2)*(2*x*log(x+1)+x^2/(x+1))", [LOGD],
    "ln y = x² ln(x+1)，y′/y = 2x ln(x+1) + x²/(x+1)。", 75);

  expr("db-logd-003", 3,
    "\\frac{d}{dx}\\left((\\sqrt{x})^{x}\\right)",
    "x^(x/2)*(log(x)+1)/2", [LOGD, "radical"],
    "(√x)^x = x^{x/2}，ln y = (x/2) ln x，y′/y = (ln x + 1)/2。", 60);

  expr("db-logd-004", 4,
    "\\frac{d}{dx}\\left(\\left(1+\\frac{1}{x}\\right)^{x}\\right)\\quad (x>1)",
    "(1+1/x)^x*(log(1+1/x)-1/(x+1))", [LOGD],
    "ln y = x ln(1 + 1/x)，y′/y = ln(1 + 1/x) + x · (−1/x²)/(1 + 1/x) = ln(1 + 1/x) − 1/(x + 1)。", 85);

  expr("db-logd-005", 4,
    "\\frac{d}{dx}\\left(x^{e^{x}}\\right)",
    "x^exp(x)*(exp(x)*log(x)+exp(x)/x)", [LOGD, "exponential"],
    "ln y = e^x ln x，y′/y = e^x ln x + e^x/x。", 70);

  expr("db-logd-006", 5,
    "\\frac{d}{dx}\\left((1+x)^{1/x}\\right)\\quad (x>0)",
    "(1+x)^(1/x)*(x/(1+x)-log(1+x))/x^2", [LOGD],
    "ln y = ln(1+x)/x，商數律：y′/y = [x/(1+x) − ln(1+x)]/x²。這條曲線在 0 附近趨近 e。", 100);

  /* ═══════════════ 七、切線與法線（9）═══════════════
     切線的量全部從 f(a) 與 f′(a) 來：斜率、截距、在某個 x 的值。 */

  num("db-tan-001", 2,
    "y=x^4-3x^2\\ \\text{在}\\ x=2\\ \\text{處切線的斜率}",
    "20", [TAN],
    "y′ = 4x³ − 6x，代 2：32 − 12。", 40,
    { m: "tangentNormal", f: "x^4-3x^2", a: 2, kind: "slope" });

  num("db-tan-002", 3,
    "y=xe^{-x}\\ \\text{在}\\ x=1\\ \\text{處切線的}\\ y\\ \\text{截距}",
    "1/e", [TAN, "exponential"],
    "y′ = (1 − x)e^{−x} 在 1 是 0：切線水平，就是 y = 1/e。", 60,
    { m: "tangentNormal", f: "xe^{-x}", a: 1, kind: "yIntercept" });

  num("db-tan-003", 3,
    "y=\\ln x\\ \\text{在}\\ x=e^{2}\\ \\text{處切線的}\\ y\\ \\text{截距}",
    "1", [TAN, "log"],
    "切線 y = 2 + (1/e²)(x − e²)，x = 0 時 y = 2 − 1 = 1。", 60,
    { m: "tangentNormal", f: "\\ln x", a: "e^{2}", kind: "yIntercept" });

  num("db-tan-004", 3,
    "y=\\sqrt{x}\\ \\text{在}\\ x=4\\ \\text{處的切線，在}\\ x=4.4\\ \\text{的}\\ y\\ \\text{值}",
    "2.1", [TAN, LIN, "radical"],
    "2 + (1/4)(0.4) = 2.1。", 55,
    { m: "linApprox", f: "\\sqrt{x}", a: 4, dx: 0.4 });

  num("db-tan-005", 4,
    "y=x^2-2\\ \\text{在}\\ x=2\\ \\text{處切線的}\\ x\\ \\text{截距}",
    "3/2", [TAN, "newton-method"],
    "切線 y = 2 + 4(x − 2)，令 y = 0：x = 2 − 2/4。這就是牛頓法跑一步。", 60,
    { m: "tangentNormal", f: "x^2-2", a: 2, kind: "xIntercept" });

  num("db-tan-006", 4,
    "y=\\sin x\\ \\text{在}\\ x=\\tfrac{\\pi}{3}\\ \\text{處的切線，在}\\ x=\\tfrac{\\pi}{2}\\ \\text{的}\\ y\\ \\text{值}",
    "sqrt(3)/2+pi/12", [TAN, LIN, "trig"],
    "sin(π/3) + cos(π/3)·(π/2 − π/3) = √3/2 + (1/2)(π/6)。", 75,
    { m: "linApprox", f: "\\sin x", a: "\\pi/3", dx: "\\pi/6" });

  num("db-tan-007", 4,
    "y=x^2\\ \\text{在}\\ (1,1)\\ \\text{處法線的}\\ y\\ \\text{截距}",
    "3/2", [TAN],
    "切線斜率 2，法線斜率 −1/2：y = 1 − (1/2)(x − 1)，x = 0 時 y = 3/2。", 60,
    { m: "tangentNormal", f: "x^2", a: 1, kind: "normalYIntercept" });

  num("db-tan-008", 3,
    "y=x^3-3x^2+1\\ \\text{有水平切線的點中，}x>0\\ \\text{的那個}\\ x",
    "2", [TAN, "critical-points"],
    "y′ = 3x² − 6x = 3x(x − 2) = 0。", 50,
    { m: "criticalPoint", f: "x^3-3x^2+1", x0: 3 });

  num("db-tan-009", 5,
    "y=x^2\\ln x\\ \\text{有水平切線的點的}\\ x",
    "exp(-1/2)", [TAN, "critical-points", "log"],
    "y′ = 2x ln x + x = x(2 ln x + 1) = 0 → ln x = −1/2。", 80,
    { m: "criticalPoint", f: "x^2\\ln x", x0: 0.5 });

  /* ═══════════════ 八、相關變率（10）═══════════════
     先寫幾何關係，對 t 微分，最後才代數字。 */

  num("db-rr-001", 2,
    "\\text{球的半徑以每秒 2 cm 增加。半徑 3 cm 時，體積的變化率（cm}^3\\text{/s）}",
    "72*pi", [RR, STORY],
    "V = (4/3)πr³，dV/dt = 4πr² · dr/dt = 4π·9·2。", 55,
    { m: "differential", f: "\\frac{4}{3}\\pi x^3", a: 3, dx: 2 });

  num("db-rr-002", 3,
    "\\text{正方形的邊長以每秒 0.5 增加。面積為 100 時，面積的變化率}",
    "10", [RR, STORY],
    "面積 100 時邊長 10；dA/dt = 2s · ds/dt = 2·10·0.5。", 50,
    { m: "differential", f: "x^2", a: 10, dx: 0.5 });

  num("db-rr-003", 3,
    "\\text{10 m 長的梯子靠牆，底端以每秒 1 m 遠離牆。底端距牆 6 m 時，頂端的高度變化率（向下為負）}",
    "-3/4", [RR, STORY, IMP],
    "x² + y² = 100，2x x′ + 2y y′ = 0 → y′ = −(x/y)x′ = −(6/8)·1。", 70,
    { m: "implicitDeriv", F: "x^2+y^2-100", at: [6, 8], rate: 1 });

  num("db-rr-004", 4,
    "\\text{倒立圓錐水槽頂半徑 3 m、高 6 m，以每分鐘 2 m}^3\\text{ 注水。水深 4 m 時水面上升的速率（m/min）}",
    "1/(2*pi)", [RR, STORY],
    "r = h/2，V = πh³/12，dV/dt = (πh²/4) dh/dt = 4π · dh/dt = 2。", 90,
    { m: "relatedRate", f: "\\frac{\\pi h^3}{12}", v: "h", at: 4, given: 2 });

  num("db-rr-005", 4,
    "\\text{路燈高 5.4 m，身高 1.8 m 的人以每秒 1.5 m 走離燈柱。影子長度的變化率（m/s）}",
    "3/4", [RR, STORY],
    "相似三角形 s/(x + s) = 1.8/5.4 = 1/3 → s = x/2，ds/dt = (1/2)(1.5)。", 85,
    { m: "implicitDeriv", F: "\\frac{y}{x+y}-\\frac{1}{3}", at: [10, 5], rate: 1.5 });

  num("db-rr-006", 4,
    "\\text{兩車同時從同一點出發，一車向北每小時 60 km、一車向東每小時 80 km。1 小時後兩車距離的變化率（km/h）}",
    "100", [RR, STORY],
    "D = √((60t)² + (80t)²) = 100t，dD/dt = 100。", 65,
    { m: "deriv", f: "\\sqrt{(60x)^2+(80x)^2}", at: [1] });

  num("db-rr-007", 4,
    "\\text{風箏在 40 m 高處水平飛離放風箏的人，速率每秒 2 m。已放出 50 m 線時，線放出的速率（m/s）}",
    "6/5", [RR, STORY],
    "L² = x² + 40²；L = 50 時 x = 30，2LL′ = 2xx′ → L′ = (30/50)·2。", 85,
    { m: "implicitDeriv", F: "x^2+1600-y^2", at: [30, 50], rate: 2 });

  num("db-rr-008", 5,
    "\\text{長方形面積固定為 100，長以每秒 2 增加。長為 20 時，寬的變化率}",
    "-1/2", [RR, STORY],
    "Lw = 100，L′w + Lw′ = 0 → w′ = −(w/L)L′ = −(5/20)·2。", 70,
    { m: "implicitDeriv", F: "xy-100", at: [20, 5], rate: 2 });

  num("db-rr-009", 5,
    "\\text{一點沿曲線}\\ y=x^3\\ \\text{移動，}\\frac{dx}{dt}=2\\text{。}x=1\\ \\text{時，該點到原點距離的變化率}",
    "4*sqrt(2)", [RR, STORY],
    "D = √(x² + x⁶)，dD/dt = (2x + 6x⁵)/(2D) · 2 = (8/(2√2)) · 2。", 90,
    { m: "differential", f: "\\sqrt{x^2+x^6}", a: 1, dx: 2 });

  num("db-rr-010", 3,
    "\\text{正立方體的邊長以每秒 1 cm 增加。體積 27 cm}^3\\text{ 時，表面積的變化率（cm}^2\\text{/s）}",
    "36", [RR, STORY],
    "邊長 3；S = 6s²，dS/dt = 12s · ds/dt = 36。", 55,
    { m: "differential", f: "6x^2", a: 3, dx: 1 });

  /* ═══════════════ 九、線性近似與微分（8）═══════════════
     f(a + dx) ≈ f(a) + f′(a) dx；誤差傳遞 df = f′(a) dx。 */

  num("db-lin-001", 2,
    "\\text{用線性近似估計}\\ \\sqrt{26}",
    "5.1", [LIN, "radical"],
    "在 a = 25：5 + (1/10)(1)。", 45,
    { m: "linApprox", f: "\\sqrt{x}", a: 25, dx: 1 });

  num("db-lin-002", 3,
    "\\text{用線性近似估計}\\ \\sqrt[3]{28}",
    "82/27", [LIN, "radical"],
    "在 a = 27：3 + (1/27)(1)。", 55,
    { m: "linApprox", f: "\\sqrt[3]{x}", a: 27, dx: 1 });

  num("db-lin-003", 3,
    "\\text{用線性近似估計}\\ e^{0.05}",
    "1.05", [LIN, "exponential"],
    "在 a = 0：1 + 1·0.05。", 40,
    { m: "linApprox", f: "e^{x}", a: 0, dx: 0.05 });

  num("db-lin-004", 3,
    "\\text{用線性近似估計}\\ \\sin\\left(\\tfrac{\\pi}{6}+\\tfrac{\\pi}{180}\\right)",
    "1/2+sqrt(3)*pi/360", [LIN, "trig"],
    "在 a = π/6：1/2 + cos(π/6)·(π/180)。", 65,
    { m: "linApprox", f: "\\sin x", a: "\\pi/6", dx: "\\pi/180" });

  num("db-lin-005", 4,
    "\\text{用線性近似估計}\\ (0.98)^{5}",
    "0.9", [LIN],
    "在 a = 1：1 + 5·(−0.02)。真值 0.9039，線性近似少了曲率那一塊。", 50,
    { m: "linApprox", f: "x^{5}", a: 1, dx: -0.02 });

  num("db-lin-006", 4,
    "\\text{球的半徑測得 10 cm，誤差最多 0.1 cm。用微分估計體積的最大誤差（cm}^3\\text{）}",
    "40*pi", [LIN, STORY],
    "dV = 4πr² dr = 4π·100·0.1。", 60,
    { m: "differential", f: "\\frac{4}{3}\\pi x^3", a: 10, dx: 0.1 });

  num("db-lin-007", 4,
    "\\text{立方體的邊長測得 2 m，誤差最多 0.01 m。用微分估計表面積的最大誤差（m}^2\\text{）}",
    "0.24", [LIN, STORY],
    "dS = 12s ds = 12·2·0.01。", 55,
    { m: "differential", f: "6x^2", a: 2, dx: 0.01 });

  num("db-lin-008", 5,
    "\\text{用線性近似估計}\\ \\arctan(1.1)",
    "pi/4+1/20", [LIN, ITRIG],
    "在 a = 1：π/4 + (1/2)(0.1)。", 60,
    { m: "linApprox", f: "\\arctan x", a: 1, dx: 0.1 });

  /* ═══════════════ 十、極值與 MVT（13）═══════════════
     閉區間極值：臨界點與端點一起比。MVT 的 c：解 f′(c) = 平均斜率。 */

  num("db-ext-001", 2,
    "f(x)=x^3-3x\\ \\text{在}\\ [0,2]\\ \\text{的最大值}",
    "2", ["extrema"],
    "f′ = 3x² − 3 = 0 → x = 1，f(1) = −2；端點 f(0) = 0、f(2) = 2。", 55,
    { m: "extremum1d", f: "x^3-3x", v: "x", lo: 0, hi: 2, kind: "max" });

  num("db-ext-002", 3,
    "f(x)=x+\\frac{1}{x}\\ \\text{在}\\ \\left[\\tfrac12,3\\right]\\ \\text{的最小值}",
    "2", ["extrema"],
    "f′ = 1 − 1/x² = 0 → x = 1，f(1) = 2；端點 2.5 與 10/3 都比它大。", 55,
    { m: "extremum1d", f: "x+\\frac{1}{x}", v: "x", lo: "1/2", hi: 3, kind: "min" });

  num("db-ext-003", 3,
    "f(x)=xe^{-x}\\ \\text{在}\\ [0,3]\\ \\text{的最大值}",
    "1/e", ["extrema", "exponential"],
    "f′ = (1 − x)e^{−x} = 0 → x = 1，f(1) = 1/e。", 60,
    { m: "extremum1d", f: "xe^{-x}", v: "x", lo: 0, hi: 3, kind: "max" });

  num("db-ext-004", 4,
    "f(x)=\\sin x+\\cos x\\ \\text{在}\\ [0,\\pi]\\ \\text{的最大值}",
    "sqrt(2)", ["extrema", "trig"],
    "f′ = cos x − sin x = 0 → x = π/4，f = √2；或寫成 √2 sin(x + π/4)。", 60,
    { m: "extremum1d", f: "\\sin x+\\cos x", v: "x", lo: 0, hi: "\\pi", kind: "max" });

  num("db-ext-005", 4,
    "f(x)=x^2\\ln x\\ (x>0)\\ \\text{的最小值}",
    "-1/(2*e)", ["extrema", "log"],
    "f′ = x(2 ln x + 1) = 0 → x = e^{−1/2}，f = e^{−1}·(−1/2)。", 80,
    { m: "extremum1d", f: "x^2\\ln x", v: "x", lo: 0.01, hi: 3, kind: "min" });

  num("db-ext-006", 4,
    "f(x)=x^3\\ \\text{在}\\ [0,2]\\ \\text{上滿足平均值定理的}\\ c",
    "2/sqrt(3)", [MVT],
    "f′(c) = 3c² = (8 − 0)/2 = 4 → c = 2/√3。", 60,
    { m: "mvtPoint", f: "x^3", a: 0, b: 2 });

  num("db-ext-007", 3,
    "f(x)=\\sqrt{x}\\ \\text{在}\\ [1,4]\\ \\text{上滿足平均值定理的}\\ c",
    "9/4", [MVT, "radical"],
    "1/(2√c) = (2 − 1)/3 = 1/3 → √c = 3/2。", 60,
    { m: "mvtPoint", f: "\\sqrt{x}", a: 1, b: 4 });

  num("db-ext-008", 4,
    "f(x)=\\ln x\\ \\text{在}\\ [1,e]\\ \\text{上滿足平均值定理的}\\ c",
    "e-1", [MVT, "log"],
    "1/c = (1 − 0)/(e − 1)。", 60,
    { m: "mvtPoint", f: "\\ln x", a: 1, b: "e" });

  num("db-ext-009", 5,
    "f(x)=x^3-x\\ \\text{在}\\ [1,3]\\ \\text{上滿足平均值定理的}\\ c",
    "sqrt(13/3)", [MVT],
    "平均斜率 (24 − 0)/2 = 12；3c² − 1 = 12 → c² = 13/3。", 75,
    { m: "mvtPoint", f: "x^3-x", a: 1, b: 3 });

  num("db-ext-010", 3,
    "f(x)=x^4-6x^2\\ \\text{的反曲點中，}x>0\\ \\text{的那個}\\ x",
    "1", ["inflection", "second-derivative"],
    "f″ = 12x² − 12 = 0 → x = ±1。", 50,
    { m: "criticalPoint", f: "x^4-6x^2", x0: 0.8, order: 2 });

  num("db-ext-011", 4,
    "f(x)=x^2e^{-x}\\ \\text{的反曲點中，較大的那個}\\ x",
    "2+sqrt(2)", ["inflection", "second-derivative", "exponential"],
    "f″ = (x² − 4x + 2)e^{−x} = 0 → x = 2 ± √2。", 75,
    { m: "criticalPoint", f: "x^2e^{-x}", x0: 3.5, order: 2 });

  num("db-ext-012", 5,
    "f(x)=x^4-4x^3\\ \\text{的局部極小值點的}\\ x\\ \\text{座標}",
    "3", ["extrema", "critical-points"],
    "f′ = 4x²(x − 3)：x = 0 處導數不變號（不是極值），x = 3 才是極小。", 75,
    { m: "criticalPoint", f: "x^4-4x^3", x0: 2.5 });

  num("db-ext-013", 3,
    "f(x)=\\frac{x}{x^2+1}\\ \\text{的最大值}",
    "1/2", ["extrema", "quotient-rule"],
    "f′ = (1 − x²)/(x² + 1)² = 0 → x = 1，f(1) = 1/2。", 60,
    { m: "extremum1d", f: "\\frac{x}{x^2+1}", v: "x", lo: -5, hi: 5, kind: "max" });

  /* ═══════════════ 十一、參數式（8）═══════════════
     dy/dx = (dy/dt)/(dx/dt)；二階是「對 dy/dx 再對 t 微分，再除以 dx/dt」。 */

  num("db-par-001", 2,
    "x=t^2,\\ y=t^3\\ \\text{在}\\ t=1\\ \\text{的}\\ \\frac{dy}{dx}",
    "3/2", [PAR],
    "(3t²)/(2t) = 3t/2。", 45,
    { m: "paramSlope", x: "t^2", y: "t^3", at: 1 });

  num("db-par-002", 3,
    "x=\\cos t,\\ y=\\sin 2t\\ \\text{在}\\ t=\\tfrac{\\pi}{6}\\ \\text{的}\\ \\frac{dy}{dx}",
    "-2", [PAR, "trig"],
    "2cos 2t/(−sin t) = 2(1/2)/(−1/2)。", 60,
    { m: "paramSlope", x: "\\cos t", y: "\\sin 2t", at: "\\pi/6" });

  num("db-par-003", 3,
    "\\text{擺線}\\ x=t-\\sin t,\\ y=1-\\cos t\\ \\text{在}\\ t=\\tfrac{\\pi}{2}\\ \\text{的}\\ \\frac{dy}{dx}",
    "1", [PAR, "trig"],
    "sin t/(1 − cos t) = 1/1。", 60,
    { m: "paramSlope", x: "t-\\sin t", y: "1-\\cos t", at: "\\pi/2" });

  num("db-par-004", 4,
    "x=e^{t},\\ y=te^{t}\\ \\text{在}\\ t=1\\ \\text{的}\\ \\frac{dy}{dx}",
    "2", [PAR, "exponential"],
    "(e^t + te^t)/e^t = 1 + t。", 55,
    { m: "paramSlope", x: "e^{t}", y: "te^{t}", at: 1 });

  num("db-par-005", 4,
    "x=t^2,\\ y=t^3\\ \\text{在}\\ t=1\\ \\text{的}\\ \\frac{d^2y}{dx^2}",
    "3/4", [PAR, "second-derivative"],
    "dy/dx = 3t/2，對 t 微分得 3/2，再除以 dx/dt = 2t = 2。", 75,
    { m: "paramSecond", x: "t^2", y: "t^3", at: 1 });

  num("db-par-006", 5,
    "\\text{擺線}\\ x=t-\\sin t,\\ y=1-\\cos t\\ \\text{在}\\ t=\\tfrac{\\pi}{2}\\ \\text{的}\\ \\frac{d^2y}{dx^2}",
    "-1", [PAR, "second-derivative", "trig"],
    "dy/dx = cot(t/2)，對 t 微分 −(1/2)csc²(t/2)，除以 1 − cos t = 2sin²(t/2)：−1/(4 sin⁴(t/2)) = −1。", 110,
    { m: "paramSecond", x: "t-\\sin t", y: "1-\\cos t", at: "\\pi/2" });

  num("db-par-007", 4,
    "x=t+\\frac{1}{t},\\ y=t-\\frac{1}{t}\\ \\text{在}\\ t=2\\ \\text{的}\\ \\frac{dy}{dx}",
    "5/3", [PAR],
    "(1 + 1/t²)/(1 − 1/t²) = (5/4)/(3/4)。", 60,
    { m: "paramSlope", x: "t+\\frac{1}{t}", y: "t-\\frac{1}{t}", at: 2 });

  num("db-par-008", 5,
    "x=\\ln t,\\ y=t^2-1\\ \\text{在}\\ t=1\\ \\text{的}\\ \\frac{d^2y}{dx^2}",
    "4", [PAR, "second-derivative", "log"],
    "dy/dx = 2t/(1/t) = 2t²；對 t 微分 4t，除以 1/t 得 4t² = 4。", 90,
    { m: "paramSecond", x: "\\ln t", y: "t^2-1", at: 1 });

  /* ═══════════════ 十二、泰勒係數與 f⁽ⁿ⁾(0)（9）═══════════════
     不要硬微 n 次：寫出展開式，x^n 的係數乘 n! 就是 f⁽ⁿ⁾(0)。 */

  num("db-tay-001", 3,
    "f(x)=x^2e^{x},\\quad f^{(5)}(0)",
    "20", [TAY, "higher-derivative"],
    "x²e^x = Σ x^{n+2}/n!，x⁵ 的係數是 1/3!，乘 5! 得 120/6。", 70,
    { m: "derivAt0", f: "x^2e^{x}", n: 5 });

  num("db-tay-002", 4,
    "f(x)=\\sin(x^2),\\quad f^{(6)}(0)",
    "-120", [TAY, "higher-derivative", "trig"],
    "sin(x²) = x² − x⁶/6 + …，x⁶ 的係數 −1/6 乘 6! = −120。", 75,
    { m: "derivAt0", f: "\\sin(x^2)", n: 6 });

  num("db-tay-003", 3,
    "f(x)=\\frac{1}{1-x},\\quad f^{(7)}(0)",
    "5040", [TAY, "higher-derivative"],
    "1/(1−x) = Σ xⁿ，係數 1 乘 7!。", 55,
    { m: "derivAt0", f: "\\frac{1}{1-x}", n: 7 });

  num("db-tay-004", 4,
    "f(x)=\\arctan x,\\quad f^{(5)}(0)",
    "24", [TAY, "higher-derivative", ITRIG],
    "arctan x = x − x³/3 + x⁵/5 − …，(1/5)·5! = 24。", 70,
    { m: "derivAt0", f: "\\arctan x", n: 5 });

  num("db-tay-005", 3,
    "f(x)=\\ln(1+x),\\quad f^{(4)}(0)",
    "-6", [TAY, "higher-derivative", "log"],
    "係數 (−1)^{n+1}/n，n = 4：(−1/4)·4! = −6。", 55,
    { m: "derivAt0", f: "\\ln(1+x)", n: 4 });

  num("db-tay-006", 4,
    "f(x)=e^{x^2},\\quad f^{(4)}(0)",
    "12", [TAY, "higher-derivative", "exponential"],
    "e^{x²} = 1 + x² + x⁴/2 + …，(1/2)·4! = 12。", 65,
    { m: "derivAt0", f: "e^{x^2}", n: 4 });

  num("db-tay-007", 5,
    "f(x)=\\frac{1}{1+x^2},\\quad f^{(6)}(0)",
    "-720", [TAY, "higher-derivative"],
    "1/(1+x²) = 1 − x² + x⁴ − x⁶ + …，係數 −1 乘 6!。", 75,
    { m: "derivAt0", f: "\\frac{1}{1+x^2}", n: 6 });

  num("db-tay-008", 5,
    "f(x)=xe^{2x},\\quad f^{(6)}(0)",
    "192", [TAY, "higher-derivative", "exponential"],
    "xe^{2x} = Σ 2ⁿ x^{n+1}/n!，x⁶ 的係數 2⁵/5!，乘 6! 得 32·6。", 80,
    { m: "derivAt0", f: "xe^{2x}", n: 6 });

  num("db-tay-009", 5,
    "f(x)=e^{x}\\cos x,\\quad f^{(4)}(0)",
    "-4", [TAY, "higher-derivative", "trig", "exponential"],
    "e^x cos x = Re e^{(1+i)x}，f^{(4)}(0) = Re (1+i)⁴ = Re(−4) = −4。或直接把兩個級數相乘取 x⁴ 的係數 −1/6。", 100,
    { m: "derivAt0", f: "e^{x}\\cos x", n: 4 });

  /* ═══════════════ 十三、變上限積分的導數（6）═══════════════
     F(x) = ∫_{a(x)}^{b(x)} g(t) dt → F′ = g(b) b′ − g(a) a′。被積函數含 x 時要先分開。 */

  num("db-ftc-001", 2,
    "F(x)=\\int_0^{x}e^{-t^2}\\,dt,\\quad F'(1)",
    "exp(-1)", [FTC, "exponential"],
    "F′(x) = e^{−x²}。", 45,
    { m: "ftcDeriv", g: "e^{-t^2}", lo: 0, hi: "x", at: 1 });

  num("db-ftc-002", 3,
    "F(x)=\\int_0^{x^2}\\sin t\\,dt,\\quad F'(1)",
    "2*sin(1)", [FTC, CHAIN, "trig"],
    "F′(x) = sin(x²)·2x。", 55,
    { m: "ftcDeriv", g: "\\sin t", lo: 0, hi: "x^2", at: 1 });

  num("db-ftc-003", 4,
    "F(x)=\\int_{x}^{2x}e^{-t^2}\\,dt,\\quad F'(1)",
    "2*exp(-4)-exp(-1)", [FTC, CHAIN, "exponential"],
    "F′(x) = e^{−4x²}·2 − e^{−x²}·1。", 70,
    { m: "ftcDeriv", g: "e^{-t^2}", lo: "x", hi: "2x", at: 1 });

  num("db-ftc-004", 4,
    "F(x)=\\int_0^{\\sqrt{x}}\\cos(t^2)\\,dt,\\quad F'(1)",
    "cos(1)/2", [FTC, CHAIN, "trig"],
    "F′(x) = cos(x)·1/(2√x)。", 65,
    { m: "ftcDeriv", g: "\\cos(t^2)", lo: 0, hi: "\\sqrt{x}", at: 1 });

  num("db-ftc-005", 5,
    "F(x)=\\int_{x^2}^{x^3}\\sqrt{1+t^2}\\,dt,\\quad F'(1)",
    "sqrt(2)", [FTC, CHAIN, "radical"],
    "F′(1) = √(1+1)·3 − √(1+1)·2 = √2。", 80,
    { m: "ftcDeriv", g: "\\sqrt{1+t^2}", lo: "x^2", hi: "x^3", at: 1 });

  num("db-ftc-006", 5,
    "F(x)=\\int_0^{x}(x-t)e^{t}\\,dt,\\quad F'(1)",
    "e-1", [FTC, "exponential"],
    "被積函數含 x，先拆：F = x∫₀ˣ e^t dt − ∫₀ˣ te^t dt，F′ = ∫₀ˣ e^t dt + xe^x − xe^x = e^x − 1。", 100,
    { m: "ftcDeriv", g: "(x-t)e^{t}", lo: 0, hi: "x", at: 1 });

  /* ═══════════════ 十四、牛頓法（4）═══════════════ */

  num("db-newt-001", 2,
    "\\text{用牛頓法解}\\ x^2-2=0\\text{，從}\\ x_0=1\\ \\text{出發的}\\ x_1",
    "3/2", ["newton-method"],
    "x₁ = 1 − (1 − 2)/2 = 3/2。", 45,
    { m: "root", f: "x^2-2", x0: 1, n: 1 });

  num("db-newt-002", 3,
    "\\text{用牛頓法解}\\ x^3-2x-5=0\\text{，從}\\ x_0=2\\ \\text{出發的}\\ x_1",
    "2.1", ["newton-method"],
    "f(2) = −1，f′(2) = 10，x₁ = 2 + 1/10。", 55,
    { m: "root", f: "x^3-2x-5", x0: 2, n: 1 });

  num("db-newt-003", 4,
    "\\text{用牛頓法解}\\ \\cos x=x\\text{，從}\\ x_0=1\\ \\text{出發的}\\ x_1",
    "1+(cos(1)-1)/(sin(1)+1)", ["newton-method", "trig"],
    "f = cos x − x，f′ = −sin x − 1；x₁ = 1 − (cos 1 − 1)/(−sin 1 − 1)。", 75,
    { m: "root", f: "\\cos x-x", x0: 1, n: 1 });

  num("db-newt-004", 4,
    "\\text{用牛頓法解}\\ x^2-2=0\\text{，從}\\ x_0=1\\ \\text{出發的}\\ x_2",
    "17/12", ["newton-method"],
    "x₁ = 3/2，x₂ = 3/2 − (9/4 − 2)/3 = 3/2 − 1/12。", 65,
    { m: "root", f: "x^2-2", x0: 1, n: 2 });

  /* ═══════════════ 十五、最佳化（8）═══════════════
     先把幾何翻成單變數目標式，再找臨界點、比端點。 */

  num("db-opt-001", 2,
    "\\text{周長 40 的長方形，面積最大是多少}",
    "100", [OPT, STORY],
    "A = x(20 − x)，x = 10 時最大。", 45,
    { m: "extremum1d", f: "x(20-x)", v: "x", lo: 0, hi: 20, kind: "max" });

  num("db-opt-002", 3,
    "\\text{面積 100 的長方形，周長最小是多少}",
    "40", [OPT, STORY],
    "P = 2x + 200/x，P′ = 2 − 200/x² = 0 → x = 10。", 55,
    { m: "extremum1d", f: "2x+\\frac{200}{x}", v: "x", lo: 1, hi: 100, kind: "min" });

  num("db-opt-003", 3,
    "\\text{16 × 10 的長方形紙板四角各剪掉邊長}\\ x\\ \\text{的正方形折成無蓋盒，最大體積}",
    "144", [OPT, STORY],
    "V = x(16 − 2x)(10 − 2x)，V′ = 12x² − 104x + 160 = 4(3x − 20)(x − 2) → x = 2，V = 2·12·6。", 80,
    { m: "extremum1d", f: "x(16-2x)(10-2x)", v: "x", lo: 0, hi: 5, kind: "max" });

  num("db-opt-004", 4,
    "\\text{點}\\ (3,0)\\ \\text{到曲線}\\ y=\\sqrt{x}\\ \\text{的最短距離}",
    "sqrt(11)/2", [OPT, STORY, "radical"],
    "距離平方 (x − 3)² + x，導數 2x − 5 = 0 → x = 5/2，距離平方 1/4 + 5/2 = 11/4。", 80,
    { m: "extremum1d", f: "\\sqrt{(x-3)^2+x}", v: "x", lo: 0, hi: 10, kind: "min" });

  num("db-opt-005", 4,
    "\\text{體積}\\ 16\\pi\\ \\text{的封閉圓柱罐，表面積最小是多少}",
    "24*pi", [OPT, STORY],
    "h = 16/r²，S = 2πr² + 32π/r，S′ = 4πr − 32π/r² = 0 → r = 2，S = 8π + 16π。", 85,
    { m: "extremum1d", f: "2\\pi x^2+\\frac{32\\pi}{x}", v: "x", lo: 0.1, hi: 10, kind: "min" });

  num("db-opt-006", 4,
    "\\text{內接於半徑 1 的圓的長方形，面積最大是多少}",
    "2", [OPT, STORY],
    "半寬 x、半高 √(1 − x²)，A = 4x√(1 − x²)，x = 1/√2 時最大（正方形）。", 70,
    { m: "extremum1d", f: "4x\\sqrt{1-x^2}", v: "x", lo: 0, hi: 1, kind: "max" });

  num("db-opt-007", 5,
    "\\text{直圓錐的母線長固定為 3，體積最大是多少}",
    "2*sqrt(3)*pi", [OPT, STORY],
    "r² + h² = 9，V = (π/3)(9 − h²)h，V′ = (π/3)(9 − 3h²) = 0 → h = √3，V = (π/3)·6·√3。", 100,
    { m: "extremum1d", f: "\\frac{\\pi}{3}(9-h^2)h", v: "h", lo: 0, hi: 3, kind: "max" });

  num("db-opt-008", 5,
    "\\text{原點到曲線}\\ y=\\frac{1}{x}\\ (x>0)\\ \\text{的最短距離}",
    "sqrt(2)", [OPT, STORY],
    "距離平方 x² + 1/x²，導數 2x − 2/x³ = 0 → x = 1，距離 √2。", 70,
    { m: "extremum1d", f: "\\sqrt{x^2+\\frac{1}{x^2}}", v: "x", lo: 0.1, hi: 5, kind: "min" });

  /* ═══════════════ 十六、運動與邊際（4）═══════════════ */

  num("db-mot-001", 2,
    "s(t)=t^3-6t^2+9t\\text{，速度為 0 的時刻中較大的那個}\\ t",
    "3", ["motion", "critical-points"],
    "v = 3t² − 12t + 9 = 3(t − 1)(t − 3)。", 50,
    { m: "criticalPoint", f: "x^3-6x^2+9x", x0: 4 });

  num("db-mot-002", 3,
    "s(t)=t^3-6t^2+9t\\text{，}t=4\\ \\text{時的加速度}",
    "12", ["motion", "second-derivative"],
    "a = 6t − 12。", 40,
    { m: "deriv", f: "x^3-6x^2+9x", at: [4], order: 2 });

  num("db-mot-003", 3,
    "s(t)=e^{-t}\\sin t\\text{，}t=\\tfrac{\\pi}{2}\\ \\text{時的速度}",
    "-exp(-pi/2)", ["motion", "exponential", "trig"],
    "v = e^{−t}(cos t − sin t)，代 π/2 得 −e^{−π/2}。", 60,
    { m: "deriv", f: "e^{-x}\\sin x", at: ["\\pi/2"] });

  num("db-mot-004", 4,
    "\\text{成本函數}\\ C(x)=0.01x^3-0.6x^2+13x\\text{，}x=20\\ \\text{的邊際成本}",
    "1", ["motion", STORY],
    "C′ = 0.03x² − 1.2x + 13，代 20：12 − 24 + 13。", 55,
    { m: "deriv", f: "0.01x^3-0.6x^2+13x", at: [20] });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

/* ═══════════════════════════════════════════════════════════════════
   微分深化包（dx-，2026-09-24）：把應用題的領域拉開，並補 R5–R6 的厚度。
   盤點：904 題微分裡有 109 題應用題，但幾乎全擠在三種情境 ——
   最佳化（圍籬、盒子、內接柱）、相關變率（梯子、影子、球脹大）、運動學。
   經濟（彈性、最大利潤）、生醫（藥物峰值、族群成長最快）、工程（光照、樑、
   折射）、曲率、正交軌線、誤差上界這些課本明明會教的，一題都沒有。
   難度也偏：R5 只有 74 題、R6 只有 37 題（8% 與 4%）。

   驗算：敘述型題幹自動辨識器讀不出結構，一律自帶 verify；
   新的三條路徑 curvature / chainRate / elasticity 都只做數值微分。
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const SOURCE = "Buzz 微分深化 2026-09";
  const problems = [];

  function add(problem) {
    const tags = (problem.tags || []).slice();
    tags.push(`rank-${problem.rank}`);
    if (problem.rank >= 5) tags.push("boss-rank");
    if (problem.rank <= 2) tags.push("beginner-friendly");
    problems.push({
      source: SOURCE,
      topic: "derivatives",
      difficulty: Math.min(4, problem.rank),
      answerKind: "numeric",
      timeLimit: problem.timeLimit || 110,
      ...problem,
      tags
    });
  }

  /* ── A. 經濟：彈性、邊際、最大利潤（R4–R5）── */
  add({ id: "dx-eco-001", rank: 4,
    prompt: "\\text{需求函數 }q(p)=500-4p^{2}\\text{（件），價格 }p=5\\text{ 元。}\\quad\\text{價格彈性 }E=-\\dfrac{p\\,q'(p)}{q(p)}\\text{ 是多少？}",
    answer: "0.5", verify: { m: "elasticity", f: "500-4p^2", at: 5, v: "p" },
    tags: ["marginal", "applied-derivative", "word-problem"], timeLimit: 110,
    hints: ["q′(p)=−8p。", "E = −p(−8p)/(500−4p²)。", "p=5 時 q=400。"],
    solution: "E = 8·25/400 = 0.5（|E|<1，需求缺乏彈性：漲價總收益會增加）。" });

  add({ id: "dx-eco-002", rank: 5,
    prompt: "\\text{需求 }q(p)=1200e^{-0.05p}\\text{，價格 }p=30\\text{ 元。}\\quad\\text{價格彈性 }E=-\\dfrac{p\\,q'(p)}{q(p)}\\text{ 是多少？}",
    answer: "1.5", verify: { m: "elasticity", f: "1200e^{-0.05p}", at: 30, v: "p" },
    tags: ["marginal", "applied-derivative", "word-problem", "exponential"], timeLimit: 110,
    hints: ["指數需求的彈性 E = 0.05p。", "不用算 q 本身，它會約掉。"],
    solution: "E = 0.05·30 = 1.5（|E|>1，需求有彈性：漲價總收益會下降）。" });

  add({ id: "dx-eco-003", rank: 4,
    prompt: "\\text{總成本 }C(x)=0.02x^{3}-1.8x^{2}+60x+800\\text{ 元。}\\quad\\text{產量 }x=20\\text{ 件時的邊際成本（元／件）}",
    answer: "12", verify: { m: "deriv", f: "0.02x^3-1.8x^2+60x+800", at: [20] },
    tags: ["marginal", "applied-derivative", "word-problem"], timeLimit: 90,
    hints: ["邊際成本＝C′(x)。", "C′ = 0.06x² − 3.6x + 60。"],
    solution: "C′(20) = 24 − 72 + 60 = 12 元／件。" });

  add({ id: "dx-eco-004", rank: 5,
    prompt: "\\text{收益 }R(x)=x(90-0.5x)\\text{、成本 }C(x)=20x+300\\text{（元）。}\\quad\\text{利潤最大時的產量 }x",
    answer: "70", verify: { m: "criticalPoint", f: "x(90-0.5x)-(20x+300)", x0: 60, order: 1 },
    tags: ["optimization", "applied-derivative", "word-problem"], timeLimit: 110,
    hints: ["利潤 P = R − C。", "P′ = 90 − x − 20 = 0。"],
    solution: "P′ = 70 − x = 0 → x = 70（此時邊際收益＝邊際成本）。" });

  /* ── B. 生醫：藥物峰值、族群成長最快、血流（R4–R6）── */
  add({ id: "dx-bio-001", rank: 5,
    prompt: "\\text{口服後血中濃度 }C(t)=8\\left(e^{-0.2t}-e^{-0.8t}\\right)\\text{ 毫克／公升。}\\quad\\text{濃度最高在第幾小時？}",
    answer: "log(4)/0.6", verify: { m: "criticalPoint", f: "8(e^{-0.2x}-e^{-0.8x})", x0: 2, order: 1 },
    tags: ["optimization", "applied-derivative", "word-problem", "exponential"], timeLimit: 130,
    hints: ["C′(t)=0：0.8e^{−0.8t}=0.2e^{−0.2t}。", "兩邊取對數。", "t = ln4 / 0.6。"],
    solution: "t = ln 4/0.6 ≈ 2.31 小時。" });

  add({ id: "dx-bio-002", rank: 5,
    prompt: "\\text{族群 }P(t)=\\dfrac{9}{1+8e^{-0.4t}}\\text{ 千隻。}\\quad\\text{成長最快（}P'\\text{ 最大）在第幾年？}",
    answer: "log(8)/0.4", verify: { m: "criticalPoint", f: "\\frac{9}{1+8e^{-0.4x}}", x0: 5, order: 2 },
    tags: ["inflection", "applied-derivative", "word-problem", "exponential"], timeLimit: 140,
    hints: ["成長最快＝P″=0，也就是 logistic 曲線的反曲點。", "反曲點在 P = 承載量的一半。", "9/(1+8e^{−0.4t}) = 4.5 → 8e^{−0.4t}=1。"],
    solution: "t = ln 8/0.4 ≈ 5.20 年（此時族群正好是 4.5 千隻，承載量的一半）。" });

  add({ id: "dx-bio-003", rank: 4,
    prompt: "\\text{Poiseuille 定律：血流量 }Q=k\\,r^{4}\\text{，}k=0.02\\text{。}\\quad\\text{半徑 }r=0.5\\text{ 公分、每分鐘縮小 }0.01\\text{ 公分時，血流量的變化率（立方公分／分）}",
    answer: "-0.0001", verify: { m: "chainRate", f: "0.02x^4", at: 0.5, given: -0.01 },
    tags: ["related-rates", "applied-derivative", "word-problem"], timeLimit: 110,
    hints: ["dQ/dt = 4k r³ · dr/dt。", "4·0.02·0.125 = 0.01。"],
    solution: "dQ/dt = 0.01·(−0.01) = −1×10⁻⁴（半徑少 2% 流量掉 8%）。" });

  /* ── C. 工程與幾何：光照、樑、折射、曲率（R4–R6）── */
  add({ id: "dx-eng-001", rank: 5,
    prompt: "\\text{兩盞燈相距 }10\\text{ 公尺，亮度分別為 }1\\text{ 與 }8\\text{（強度與距離平方成反比）。}\\quad\\text{兩燈之間最暗的點離第一盞燈多遠？}",
    answer: "10/3", verify: { m: "criticalPoint", f: "\\frac{1}{x^2}+\\frac{8}{(10-x)^2}", x0: 3, order: 1 },
    tags: ["optimization", "applied-derivative", "word-problem"], timeLimit: 150,
    hints: ["總強度 I(x)=1/x² + 8/(10−x)²。", "I′=0 → 2/x³ = 16/(10−x)³。", "(10−x)/x = 2。"],
    solution: "10−x = 2x → x = 10/3 ≈ 3.33 公尺（離較暗的那盞近一些）。" });

  add({ id: "dx-eng-002", rank: 5,
    prompt: "\\text{從直徑 }30\\text{ 公分的圓木鋸出矩形樑，強度正比於寬 }\\times\\text{ 高}^{2}\\text{。}\\quad\\text{最強的樑寬是多少公分？}",
    answer: "10*sqrt(3)", verify: { m: "criticalPoint", f: "x(900-x^2)", x0: 17, order: 1 },
    tags: ["optimization", "applied-derivative", "word-problem"], timeLimit: 150,
    hints: ["寬 w、高 h 滿足 w²+h²=30²。", "強度 S = w·h² = w(900−w²)。", "S′ = 900 − 3w² = 0。"],
    solution: "w = √300 = 10√3 ≈ 17.3 公分（高 = √600 ≈ 24.5）。" });

  add({ id: "dx-eng-003", rank: 4,
    prompt: "\\text{曲線 }y=x^{3}-2x\\text{ 在 }x=1\\text{ 的曲率半徑}",
    answer: "sqrt(2)/3", verify: { m: "curvature", f: "x^3-2x", at: 1, kind: "radius" },
    tags: ["curvature", "applied-derivative"], timeLimit: 120,
    hints: ["κ = |y″|/(1+y′²)^{3/2}。", "y′(1)=1、y″(1)=6。"],
    solution: "κ = 6/2^{3/2} = 3√2/2，曲率半徑 = 2^{3/2}/6 = √2/3 ≈ 0.471。" });

  add({ id: "dx-eng-004", rank: 4,
    prompt: "\\text{懸鏈線 }y=\\cosh x\\text{ 在 }x=0\\text{ 的曲率}",
    answer: "1", verify: { m: "curvature", f: "\\cosh x", at: 0 },
    tags: ["curvature", "hyperbolic"], timeLimit: 100,
    hints: ["y′(0)=0、y″(0)=1。", "κ = |y″|/(1+y′²)^{3/2}。"],
    solution: "κ = 1/1 = 1（曲率半徑也是 1）。" });

  /* ── D. 更難的相關變率（R4–R6）── */
  add({ id: "dx-rr-001", rank: 5,
    prompt: "\\text{倒圓錐水槽：頂半徑 }3\\text{ 公尺、深 }6\\text{ 公尺，注水 }2\\text{ 立方公尺／分。}\\quad\\text{水深 }4\\text{ 公尺時水面上升多快（公尺／分）？}",
    answer: "1/(2*pi)", verify: { m: "relatedRate", f: "\\frac{\\pi}{12}h^3", at: 4, given: 2, v: "h" },
    tags: ["related-rates", "applied-derivative", "word-problem"], timeLimit: 150,
    hints: ["相似三角形：r = h/2。", "V = (π/3)r²h = (π/12)h³。", "dV/dt = (π/4)h²·dh/dt。"],
    solution: "2 = (π/4)·16·dh/dt → dh/dt = 1/(2π) ≈ 0.159 公尺／分。" });

  add({ id: "dx-rr-002", rank: 5,
    prompt: "\\text{雷達站在跑道旁 }500\\text{ 公尺處，飛機以 }200\\text{ 公尺／秒沿跑道飛離。}\\quad\\text{飛機距雷達正對點 }500\\text{ 公尺時，仰角變化率（弧度／秒）}",
    answer: "-0.2", verify: { m: "chainRate", f: "\\arctan(\\frac{500}{x})", at: 500, given: 200 },
    tags: ["related-rates", "applied-derivative", "word-problem", "inverse-trig"], timeLimit: 150,
    hints: ["θ = arctan(500/x)，x 是水平距離。", "dθ/dx = −500/(x²+500²)。", "x=500 時 dθ/dx = −1/1000。"],
    solution: "dθ/dt = (−1/1000)·200 = −0.2 弧度／秒（角度在變小）。" });

  add({ id: "dx-rr-003", rank: 5,
    prompt: "\\text{甲船在乙船正北 }60\\text{ 海里，甲以 }15\\text{ 節向南、乙以 }20\\text{ 節向東。}\\quad 2\\text{ 小時後兩船距離的變化率（節）}",
    answer: "7", verify: { m: "chainRate", f: "\\sqrt{(60-15x)^2+(20x)^2}", at: 2, given: 1 },
    tags: ["related-rates", "applied-derivative", "word-problem"], timeLimit: 160,
    hints: ["t 小時後：南北距 60−15t、東西距 20t。", "D(t)=√((60−15t)²+(20t)²)。", "對 t 微分再代 t=2。"],
    solution: "D(2)=√(30²+40²)=50；D′(2) = (30·(−15) + 40·20)/50 = 350/50 = 7 節（正在遠離）。" });

  add({ id: "dx-rr-004", rank: 6,
    prompt: "\\text{熱氣球從距觀測者 }150\\text{ 公尺處垂直上升，速率 }6\\text{ 公尺／秒。}\\quad\\text{高度 }150\\text{ 公尺時仰角的變化率（弧度／秒）}",
    answer: "0.02", verify: { m: "chainRate", f: "\\arctan(\\frac{x}{150})", at: 150, given: 6 },
    tags: ["related-rates", "applied-derivative", "word-problem", "inverse-trig"], timeLimit: 140,
    hints: ["θ = arctan(h/150)。", "dθ/dh = 150/(h²+150²)。", "h=150 時 dθ/dh = 1/300。"],
    solution: "dθ/dt = 6/300 = 0.02 弧度／秒。" });

  /* ── E. 定理與觀念（R4–R6）── */
  add({ id: "dx-thm-001", rank: 4,
    prompt: "\\text{一輛車在 }2\\text{ 小時內走了 }180\\text{ 公里，位置 }s(t)=50t^{2}-10t^{3}+30t\\text{（公里）。}\\quad\\text{由均值定理，瞬時速度等於平均速度的時刻 }t\\text{（小時）}",
    answer: "(5-sqrt(7))/3", verify: { m: "mvtPoint", f: "50x^2-10x^3+30x", a: 0, b: 2, x0: 0.8 },
    tags: ["mean-value", "applied-derivative", "word-problem"], timeLimit: 150,
    hints: ["平均速度 = (s(2)−s(0))/2。", "解 s′(t) = 該平均值。", "s′ = 100t − 30t² + 30。"],
    solution: "平均速度 90 公里／時；解 3t²−10t+6=0 取 (0,2) 內的根 t = (5−√7)/3 ≈ 0.78 小時。" });

  add({ id: "dx-thm-002", rank: 5,
    prompt: "\\text{用線性近似估 }\\sqrt[3]{28}\\text{（以 }a=27\\text{ 為基準）}",
    answer: "82/27", verify: { m: "linApprox", f: "x^{1/3}", a: 27, dx: 1 },
    tags: ["linear-approximation", "applied-derivative"], timeLimit: 100,
    hints: ["f(x)=x^{1/3}，f′(x)=1/(3x^{2/3})。", "f′(27)=1/27。", "3 + 1/27。"],
    solution: "≈ 3 + 1/27 ≈ 3.0370（真值 3.03659）。" });

  add({ id: "dx-thm-003", rank: 5,
    prompt: "\\text{球半徑量得 }10\\text{ 公分，誤差 }\\pm 0.05\\text{ 公分。}\\quad\\text{用微分估體積的最大誤差（立方公分）}",
    answer: "20*pi", verify: { m: "differential", f: "\\frac{4}{3}\\pi x^3", a: 10, dx: 0.05 },
    tags: ["linear-approximation", "applied-derivative", "word-problem"], timeLimit: 110,
    hints: ["dV = 4πr²·dr。", "4π·100·0.05。"],
    solution: "dV = 20π ≈ 62.8 立方公分（相對誤差 1.5%）。" });

  add({ id: "dx-thm-004", rank: 5,
    prompt: "\\text{用牛頓法解 }x^{3}+x-3=0\\text{，從 }x_{0}=1\\text{ 出發。}\\quad x_{2}\\text{ 是多少？}",
    answer: "17/14", verify: { m: "root", f: "x^3+x-3", x0: 1, n: 2 },
    tags: ["newton", "applied-derivative"], timeLimit: 130,
    hints: ["x₁ = 1 − f(1)/f′(1) = 1 + 1/4 = 1.25。", "再跑一次：f(1.25)=0.203、f′(1.25)=5.6875。"],
    solution: "x₂ = 1.25 − 0.203125/5.6875 = 17/14 ≈ 1.2143（真根 1.21341）。" });

  add({ id: "dx-thm-005", rank: 5, answerKind: "text",
    prompt: "\\text{函數 }f(x)=x^{2/3}\\text{ 在 }x=0\\text{ 的性質為何？}",
    answers: ["連續但不可微", "連續不可微", "連續但不可導", "尖點"], canonical: "連續但不可微",
    distractors: ["可微且連續", "不連續", "可微但不連續"],
    tags: ["differentiability", "applied-derivative"], timeLimit: 80,
    hints: ["f(0)=0，左右極限都是 0。", "f′(x)=2/(3x^{1/3}) 在 0 炸開。"],
    solution: "連續但不可微：x=0 是尖點，切線垂直。" });

  /* ── F. 更難的計算（R5–R6）── */
  add({ id: "dx-calc-001", rank: 5, answerKind: "expression",
    prompt: "\\frac{d}{dx}\\left(x^{\\sin x}\\right)\\quad (x>0)",
    answer: "x^(sin(x))*(cos(x)*log(x)+sin(x)/x)", variable: "x",
    tags: ["log-differentiation", "trig"], timeLimit: 140,
    hints: ["取對數：ln y = sin x · ln x。", "兩邊微分：y′/y = cos x·ln x + sin x/x。"],
    solution: "y′ = x^{sin x}(cos x·ln x + sin x/x)。" });

  add({ id: "dx-calc-002", rank: 6, answerKind: "expression",
    prompt: "\\frac{d}{dx}\\left(\\left(\\ln x\\right)^{x}\\right)\\quad (x>1)",
    answer: "(log(x))^x*(log(log(x))+1/log(x))", variable: "x",
    tags: ["log-differentiation", "log"], timeLimit: 150,
    hints: ["取對數：ln y = x·ln(ln x)。", "微分：y′/y = ln(ln x) + x·(1/ln x)·(1/x)。"],
    solution: "y′ = (ln x)^x(ln(ln x) + 1/ln x)。" });

  add({ id: "dx-calc-003", rank: 5,
    prompt: "\\text{曲線 }x^{3}+y^{3}=6xy\\text{ 在點 }(3,3)\\text{ 的切線斜率}",
    answer: "-1", verify: { m: "implicitDeriv", F: "x^3+y^3-6xy", at: [3, 3], order: 1 },
    tags: ["implicit-differentiation"], timeLimit: 120,
    hints: ["3x²+3y²y′ = 6y + 6xy′。", "代 (3,3)：27+27y′ = 18+18y′。"],
    solution: "9y′ = −9 → y′ = −1（笛卡兒葉形線在該點的切線）。" });

  add({ id: "dx-calc-004", rank: 6,
    prompt: "\\text{曲線 }x^{2}+xy+y^{2}=3\\text{ 在點 }(1,1)\\text{ 的 }\\dfrac{d^{2}y}{dx^{2}}",
    answer: "-2/3", verify: { m: "implicitDeriv", F: "x^2+xy+y^2-3", at: [1, 1], order: 2 },
    tags: ["implicit-differentiation", "higher-derivative"], timeLimit: 160,
    hints: ["先得 y′ = −(2x+y)/(x+2y)，在 (1,1) 是 −1。", "再對 x 微分一次，代入 y′=−1。"],
    solution: "2 + 3y″ = 0 → y″(1) = −2/3。" });

  add({ id: "dx-calc-005", rank: 6,
    prompt: "f(x)=\\dfrac{1}{1-2x}\\quad\\text{求 }f^{(5)}(0)",
    answer: "3840", verify: { m: "derivAt0", f: "\\frac{1}{1-2x}", n: 5, r: 0.2 },
    tags: ["higher-derivative", "taylor"], timeLimit: 140,
    hints: ["1/(1−2x) = Σ(2x)ⁿ。", "x⁵ 的係數是 2⁵=32。", "f⁽⁵⁾(0) = 5!·32。"],
    solution: "120·32 = 3840。" });

  add({ id: "dx-calc-006", rank: 6,
    prompt: "\\text{參數式 }x=t-\\sin t,\\ y=1-\\cos t\\text{（擺線）在 }t=\\dfrac{\\pi}{2}\\text{ 的 }\\dfrac{d^{2}y}{dx^{2}}",
    answer: "-1", verify: { m: "paramSecond", x: "t-\\sin t", y: "1-\\cos t", at: "\\pi/2" },
    tags: ["parametric", "higher-derivative"], timeLimit: 170,
    hints: ["dy/dx = sin t/(1−cos t)。", "d²y/dx² = (d/dt)(dy/dx) / (dx/dt)。"],
    solution: "在 t=π/2 得 −1。" });

  add({ id: "dx-calc-007", rank: 5,
    prompt: "g\\text{ 是 }f(x)=x^{5}+x^{3}+2x\\text{ 的反函數。}\\quad\\text{求 }g'(4)",
    answer: "1/10", verify: { m: "inverseDeriv", f: "x^5+x^3+2x", at: 4, x0: 1 },
    tags: ["inverse-function", "derivative-definition"], timeLimit: 120,
    hints: ["先找 a 使 f(a)=4：試 a=1。", "g′(4)=1/f′(1)。", "f′=5x⁴+3x²+2。"],
    solution: "f(1)=4、f′(1)=10 → g′(4)=1/10。" });

  add({ id: "dx-calc-008", rank: 6, answerKind: "expression",
    prompt: "\\frac{d}{dx}\\left(\\operatorname{arcsinh}\\left(e^{x}\\right)\\right)",
    answer: "exp(x)/sqrt(1+exp(2*x))", variable: "x",
    tags: ["inverse-trig", "hyperbolic", "chain-rule"], timeLimit: 150,
    hints: ["(arcsinh u)′ = u′/√(1+u²)。", "u = eˣ，u′ = eˣ。", "分母是 √(1+e^{2x})。"],
    solution: "導數是 eˣ/√(1+e^{2x})。" });

  /* ── G. 切線、法線與正交軌線（R4–R5）── */
  add({ id: "dx-tan-001", rank: 4,
    prompt: "\\text{曲線 }y=\\dfrac{x}{x^{2}+1}\\text{ 在 }x=2\\text{ 的切線與 }x\\text{ 軸的交點}",
    answer: "16/3", verify: { m: "tangentNormal", f: "\\frac{x}{x^2+1}", a: 2, kind: "xIntercept" },
    tags: ["tangent-normal"], timeLimit: 120,
    hints: ["y′ = (1−x²)/(1+x²)²，在 x=2 是 −3/25。", "切點 (2, 2/5)。", "x 截距 = 2 − (2/5)/(−3/25)。"],
    solution: "2 + 10/3 = 16/3 ≈ 5.33。" });

  add({ id: "dx-tan-002", rank: 5,
    prompt: "\\text{從原點畫 }y=\\ln x\\text{ 的切線，切點的 }x\\text{ 座標}",
    answer: "exp(1)", verify: { m: "root", f: "\\ln x-1", x0: 2 },
    tags: ["tangent-normal", "log"], timeLimit: 140,
    hints: ["切點 (a, ln a)，切線斜率 1/a。", "過原點：ln a − 0 = (1/a)(a − 0)。", "ln a = 1。"],
    solution: "a = e ≈ 2.718（切線是 y = x/e）。" });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
