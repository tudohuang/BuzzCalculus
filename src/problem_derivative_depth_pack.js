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
    "\\frac{d}{dx}\\left((\\log x)^{\\sin x}\\right)",
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
    "\\frac{d}{dx}\\left((\\log x)^x\\right)",
    "(log(x))^x*(log(log(x))+1/log(x))", [LOGD, "log"],
    "log y = x log(log x)，y'/y = log(log x) + x·1/(x log x)。", 85);

  expr("dd-log-008", 4,
    "\\frac{d}{dx}\\left(\\frac{(x+1)^2\\sqrt{x-1}}{(x+3)^4}\\right)",
    "(x+1)^2*sqrt(x-1)/(x+3)^4*(2/(x+1)+1/(2*(x-1))-4/(x+3))",
    [LOGD, "quotient-rule"],
    "整串乘除取 log 後變加減：y'/y = 2/(x+1) + 1/(2(x−1)) − 4/(x+3)。直接用商數律會爆炸。", 95);

  expr("dd-log-009", 5,
    "\\frac{d}{dx}\\left((\\log x)^{\\log x}\\right)",
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
    "\\frac{d}{dx}\\log\\left(\\log\\left(x^2+4\\right)\\right)",
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
    "\\frac{d}{dx}\\tanh(\\log x)",
    "4*x/(x^2+1)^2", ["hyperbolic", "trap-drill"],
    "先化簡：tanh(log x) = (x²−1)/(x²+1)，再用商數律。硬套 sech² 也對，但會多繞一圈。", 80);

  expr("dd-inv-006", 3,
    "\\frac{d}{dx}\\log(\\cosh x)",
    "tanh(x)", ["hyperbolic", CHAIN],
    "(cosh x)'/cosh x = sinh x / cosh x = tanh x。", 50);

  expr("dd-inv-007", 4,
    "\\frac{d}{dx}\\sinh(\\log x)",
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
    "\\log(xy)+y=1\\ \\text{在點}\\ (1,1)\\ \\text{的}\\ \\frac{dy}{dx}",
    "-1/2", [IMP, "log"],
    "log(xy) = log x + log y，所以 1/x + y'/y + y' = 0，代 (1,1) 得 1 + 2y' = 0。", 75,
    { m: "implicit", F: "\\log(xy)+y-1", at: [1, 1] });

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
    "\\lim_{h\\to 0}\\frac{\\log(3+h)-\\log 3}{h}",
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
    "\\text{用線性近似估計 }\\log(1.05)",
    "0.05", ["linear-approximation", "log", "estimate"],
    "f(x)=log x 在 1：f'(1)=1，L = 0 + 0.05。", 60,
    { m: "linApprox", f: "\\log(x)", a: 1, dx: 0.05 });

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
    { m: "deriv", f: "500e^{\\frac{\\log(1.6)}{2}x}", at: [4] });

  num("dd-grw-003", 4,
    "\\text{半衰期 }8\\text{ 天的同位素，初始 }40\\text{ 公克。}t=8\\ \\text{天時的衰變速率（公克／天）}",
    "-2.5*log(2)", ["half-life", STORY],
    "m(t) = 40·2^{−t/8}，m' = −5 log2 · 2^{−t/8}，代 t=8 得 −2.5 log 2 ≈ −1.733。", 110,
    { m: "deriv", f: "40\\cdot 2^{-x/8}", at: [8] });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
