(function () {
  "use strict";

  const extraProblems = [
    {
      id: "lim-021",
      topic: "limits",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\lim_{x\\to0}\\frac{\\tan x-x}{x^3}",
      answerKind: "numeric",
      answer: "1/3",
      timeLimit: 55,
      tabLimit: 1,
      tags: ["taylor", "trig-limit"],
      hints: ["把 tan x 展開到 x^3。", "tan x = x + x^3/3 + O(x^5)。", "最低非零項決定極限。"],
      solution: "tan x = x + x^3/3 + O(x^5)，所以分子約為 x^3/3，極限為 1/3。"
    },
    {
      id: "lim-022",
      topic: "limits",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\lim_{x\\to\\infty}\\left(\\sqrt{x^2+3x}-x\\right)",
      answerKind: "numeric",
      answer: "3/2",
      timeLimit: 55,
      tabLimit: 1,
      tags: ["rationalize", "infinity"],
      hints: ["先有理化。", "分母會變成 sqrt(x^2+3x)+x。", "上下同除以 x。"],
      solution: "有理化後為 3x/(sqrt(x^2+3x)+x)，上下同除以 x 得 3/(sqrt(1+3/x)+1)，極限為 3/2。"
    },
    {
      id: "lim-024",
      topic: "limits",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\lim_{x\\to0}\\frac{\\ln(1+x)-x}{x^2}",
      answerKind: "numeric",
      answer: "-1/2",
      timeLimit: 50,
      tabLimit: 1,
      tags: ["taylor", "log"],
      hints: ["使用 log(1+x) 的展開。", "log(1+x)=x-x^2/2+O(x^3)。", "扣掉 x 後看二次項。"],
      solution: "log(1+x)=x-x^2/2+O(x^3)，分子為 -x^2/2+O(x^3)，極限為 -1/2。"
    },
    {
      id: "lim-025",
      topic: "limits",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\lim_{(x,y)\\to(0,0)}\\frac{\\sin(xy)}{xy}",
      answerKind: "numeric",
      answer: "1",
      timeLimit: 55,
      tabLimit: 1,
      tags: ["multivariable", "standard-limit"],
      hints: ["把 xy 視為一個整體變數。", "令 u=xy，當 (x,y)->(0,0) 時 u->0。", "使用 sin u / u -> 1。"],
      solution: "令 u=xy，則 u->0，標準極限 sin u/u = 1。"
    },
    {
      id: "lim-026",
      topic: "limits",
      difficulty: 3,
      source: "Buzz original",
      prompt: "\\lim_{(x,y)\\to(0,0)}\\frac{x^2y}{x^2+y^2}",
      answerKind: "numeric",
      answer: "0",
      timeLimit: 70,
      tabLimit: 1,
      tags: ["multivariable", "squeeze"],
      hints: ["用極座標估計階數。", "分子是三次階，分母是二次階。", "整體大小被常數乘 r 控住。"],
      solution: "令 x=r cos theta, y=r sin theta，原式 = r cos^2 theta sin theta，當 r->0 時趨近 0。"
    },
    {
      id: "lim-027",
      topic: "limits",
      difficulty: 3,
      source: "Buzz original",
      prompt: "\\lim_{(x,y)\\to(0,0)}\\frac{xy}{x^2+y^2}",
      answerKind: "numeric",
      answer: "dne",
      timeLimit: 70,
      tabLimit: 1,
      tags: ["multivariable", "path-test", "dne"],
      hints: ["試兩條不同路徑。", "沿 y=x 與 y=-x 比較。", "如果結果不同，極限不存在。"],
      solution: "沿 y=x 得 1/2；沿 y=-x 得 -1/2。路徑極限不同，所以 DNE。"
    },
    {
      id: "lim-028",
      topic: "limits",
      difficulty: 3,
      source: "Buzz original",
      prompt: "\\lim_{(x,y)\\to(0,0)}\\frac{\\sqrt{1+x^2+y^2}-1}{x^2+y^2}",
      answerKind: "numeric",
      answer: "1/2",
      timeLimit: 75,
      tabLimit: 1,
      tags: ["multivariable", "rationalize"],
      hints: ["設 r^2=x^2+y^2。", "有理化分子。", "分母會出現 sqrt(1+r^2)+1。"],
      solution: "設 r^2=x^2+y^2。有理化後為 1/(sqrt(1+r^2)+1)，令 r->0 得 1/2。"
    },
    {
      id: "lim-029",
      topic: "limits",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\lim_{(x,y)\\to(0,0)}\\frac{x^4+y^4}{x^2+y^2}",
      answerKind: "numeric",
      answer: "0",
      timeLimit: 60,
      tabLimit: 1,
      tags: ["multivariable", "squeeze"],
      hints: ["分子是四次階，分母是二次階。", "用 x^4+y^4 <= (x^2+y^2)^2。", "因此原式被 x^2+y^2 控住。"],
      solution: "因 x^4+y^4 <= (x^2+y^2)^2，所以原式 <= x^2+y^2，極限為 0。"
    },
    {
      id: "lim-030",
      topic: "limits",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\lim_{x\\to0}\\frac{1-\\cos(3x)}{x^2}",
      answerKind: "numeric",
      answer: "9/2",
      timeLimit: 50,
      tabLimit: 1,
      tags: ["standard-limit", "trig-limit"],
      hints: ["使用 1-cos u ~ u^2/2。", "令 u=3x。", "注意係數平方。"],
      solution: "1-cos(3x) ~ (3x)^2/2，所以極限為 9/2。"
    },
    {
      id: "der-021",
      topic: "derivatives",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\frac{\\partial}{\\partial x}\\left(x^2y+\\sin(xy)\\right)",
      answerKind: "expression",
      answer: "2*x*y+y*cos(x*y)",
      variables: ["x", "y"],
      timeLimit: 65,
      tabLimit: 1,
      tags: ["multivariable", "partial-derivative", "chain-rule"],
      hints: ["對 x 微分時，把 y 當常數。", "sin(xy) 要用鏈鎖律。", "xy 對 x 的導數是 y。"],
      solution: "偏 x 微分得 2xy + cos(xy)*y。"
    },
    {
      id: "der-022",
      topic: "derivatives",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\frac{\\partial}{\\partial y}\\left(xe^{xy}+y^3\\right)",
      answerKind: "expression",
      answer: "x^2*exp(x*y)+3*y^2",
      variables: ["x", "y"],
      timeLimit: 65,
      tabLimit: 1,
      tags: ["multivariable", "partial-derivative", "chain-rule"],
      hints: ["對 y 微分時，把 x 當常數。", "e^{xy} 的內層 xy 對 y 導數為 x。", "外面的 x 也要保留。"],
      solution: "d/dy of x e^{xy} = x*e^{xy}*x = x^2 e^{xy}，再加 3y^2。"
    },
    {
      id: "der-023",
      topic: "derivatives",
      difficulty: 3,
      source: "Buzz original",
      prompt: "\\frac{\\partial^2}{\\partial x\\partial y}e^{xy}",
      answerKind: "expression",
      answer: "exp(x*y)*(1+x*y)",
      variables: ["x", "y"],
      timeLimit: 70,
      tabLimit: 1,
      tags: ["multivariable", "mixed-partial", "chain-rule"],
      hints: ["先對 y 微分，再對 x 微分。", "對 y 微分後得到 x e^{xy}。", "再對 x 用乘法律。"],
      solution: "先得 f_y=x e^{xy}，再對 x 微分為 e^{xy}+xy e^{xy}=e^{xy}(1+xy)。"
    },
    {
      id: "der-024",
      topic: "derivatives",
      difficulty: 3,
      source: "Buzz original",
      prompt: "\\text{Directional derivative of }f=x^2+y^2\\text{ at }(1,2)\\text{ in direction }(3,4)/5",
      answerKind: "numeric",
      answer: "22/5",
      timeLimit: 75,
      tabLimit: 1,
      tags: ["multivariable", "directional-derivative", "gradient"],
      hints: ["先求梯度。", "grad f(1,2)=(2,4)。", "方向導數是梯度與單位方向內積。"],
      solution: "grad f=(2x,2y)，在 (1,2) 為 (2,4)。與 (3/5,4/5) 內積得 22/5。"
    },
    {
      id: "der-025",
      topic: "derivatives",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\frac{\\partial}{\\partial x}\\ln(x^2+y^2)",
      answerKind: "expression",
      answer: "2*x/(x^2+y^2)",
      variables: ["x", "y"],
      timeLimit: 60,
      tabLimit: 1,
      tags: ["multivariable", "partial-derivative", "log"],
      hints: ["log u 的導數是 u'/u。", "u=x^2+y^2。", "對 x 微分時 y^2 是常數。"],
      solution: "令 u=x^2+y^2，u_x=2x，所以 f_x=2x/(x^2+y^2)。"
    },
    {
      id: "der-026",
      topic: "derivatives",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\frac{d}{dx}\\left(x^2\\sin(3x)\\right)",
      answerKind: "expression",
      answer: "2*x*sin(3*x)+3*x^2*cos(3*x)",
      timeLimit: 55,
      tabLimit: 1,
      tags: ["product-rule", "chain-rule"],
      hints: ["同時用乘法律與鏈鎖律。", "x^2 微分是 2x。", "sin(3x) 微分是 3cos(3x)。"],
      solution: "乘法律給 2x sin(3x)+x^2*3cos(3x)。"
    },
    {
      id: "der-027",
      topic: "derivatives",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\frac{d}{dx}\\ln\\sqrt{1+x^2}",
      answerKind: "expression",
      answer: "x/(1+x^2)",
      timeLimit: 55,
      tabLimit: 1,
      tags: ["log", "chain-rule"],
      hints: ["先把 log sqrt 改寫。", "log sqrt(1+x^2)=1/2 log(1+x^2)。", "再用鏈鎖律。"],
      solution: "原式為 (1/2)log(1+x^2)，微分得 x/(1+x^2)。"
    },
    {
      id: "der-028",
      topic: "derivatives",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\frac{d}{dx}\\arctan(e^x)",
      answerKind: "expression",
      answer: "exp(x)/(1+exp(2*x))",
      timeLimit: 60,
      tabLimit: 1,
      tags: ["inverse-trig", "chain-rule"],
      hints: ["arctan u 的導數是 u'/(1+u^2)。", "令 u=e^x。", "u'=e^x。"],
      solution: "由鏈鎖律得 e^x/(1+e^{2x})。"
    },
    {
      id: "der-029",
      topic: "derivatives",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\frac{d^2}{dx^2}\\left(xe^x\\right)",
      answerKind: "expression",
      answer: "exp(x)*(x+2)",
      timeLimit: 60,
      tabLimit: 1,
      tags: ["second-derivative", "product-rule"],
      hints: ["先微分一次。", "第一次微分是 e^x(x+1)。", "再用乘法律微分一次。"],
      solution: "f'=e^x(x+1)，f''=e^x(x+1)+e^x=e^x(x+2)。"
    },
    {
      id: "der-030",
      topic: "derivatives",
      difficulty: 3,
      source: "Buzz original",
      prompt: "\\text{Find }y'\\text{ from }x^2+xy+y^2=7",
      answerKind: "expression",
      answer: "-(2*x+y)/(x+2*y)",
      variables: ["x", "y"],
      timeLimit: 80,
      tabLimit: 1,
      tags: ["implicit-differentiation"],
      hints: ["把 y 視為 x 的函數。", "xy 微分是 y + x y'。", "把含 y' 的項移到同一邊。"],
      solution: "微分得 2x+y+xy'+2yy'=0，所以 y'=-(2x+y)/(x+2y)。"
    },
    {
      id: "int-021",
      topic: "integrals",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\int_0^1\\int_0^1(x+y)\\,dy\\,dx",
      answerKind: "numeric",
      answer: "1",
      timeLimit: 60,
      tabLimit: 1,
      tags: ["multivariable", "double-integral"],
      hints: ["先對 y 積分。", "內積分結果是 x+1/2。", "再對 x 從 0 到 1 積分。"],
      solution: "內積分為 x+1/2，外積分為 1/2+1/2=1。"
    },
    {
      id: "int-022",
      topic: "integrals",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\iint_D1\\,dA,\\quad D=\\{x\\ge0,y\\ge0,x+y\\le2\\}",
      answerKind: "numeric",
      answer: "2",
      timeLimit: 55,
      tabLimit: 1,
      tags: ["multivariable", "area", "double-integral"],
      hints: ["這是求三角形面積。", "截距都是 2。", "面積是 1/2*2*2。"],
      solution: "D 是直角三角形，兩股長皆為 2，面積為 2。"
    },
    {
      id: "int-023",
      topic: "integrals",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\int_0^1\\int_0^x xy\\,dy\\,dx",
      answerKind: "numeric",
      answer: "1/8",
      timeLimit: 65,
      tabLimit: 1,
      tags: ["multivariable", "double-integral"],
      hints: ["先對 y 積分。", "x 在內積分中是常數。", "得到 x^3/2 後再積分。"],
      solution: "內積分為 x*y^2/2|_0^x=x^3/2，外積分得 1/8。"
    },
    {
      id: "int-024",
      topic: "integrals",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\int_0^1\\int_0^{1-x}(x+y)\\,dy\\,dx",
      answerKind: "numeric",
      answer: "1/3",
      timeLimit: 70,
      tabLimit: 1,
      tags: ["multivariable", "double-integral", "triangle"],
      hints: ["積分區域是單位三角形。", "先對 y 積分。", "化簡後會得到 (1-x^2)/2。"],
      solution: "內積分為 x(1-x)+(1-x)^2/2=(1-x^2)/2，外積分得 1/3。"
    },
    {
      id: "int-025",
      topic: "integrals",
      difficulty: 3,
      source: "Buzz original",
      prompt: "\\iint_{x^2+y^2\\le1}(x^2+y^2)\\,dA",
      answerKind: "numeric",
      answer: "pi/2",
      timeLimit: 75,
      tabLimit: 1,
      tags: ["multivariable", "polar-coordinates", "double-integral"],
      hints: ["改用極座標。", "x^2+y^2=r^2，dA=r dr dtheta。", "積分 r^3。"],
      solution: "極座標下為 int_0^{2pi} int_0^1 r^3 dr dtheta = 2pi*(1/4)=pi/2。"
    },
    {
      id: "int-026",
      topic: "integrals",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\int_0^2\\int_0^3 xy\\,dy\\,dx",
      answerKind: "numeric",
      answer: "9",
      timeLimit: 55,
      tabLimit: 1,
      tags: ["multivariable", "double-integral", "separable"],
      hints: ["矩形區域上 xy 可分離。", "等於 int_0^2 x dx 乘 int_0^3 y dy。", "兩者分別是 2 與 9/2。"],
      solution: "分離為 (int_0^2 x dx)(int_0^3 y dy)=2*(9/2)=9。"
    },
    {
      id: "int-027",
      topic: "integrals",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\int \\frac{x}{1+x^2}\\,dx",
      answerKind: "antiderivative",
      answer: "log(1+x^2)/2",
      timeLimit: 55,
      tabLimit: 1,
      tags: ["substitution", "log"],
      hints: ["令 u=1+x^2。", "du=2x dx。", "差一個 1/2。"],
      solution: "u=1+x^2，積分為 (1/2)log(1+x^2)。"
    },
    {
      id: "int-028",
      topic: "integrals",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\int \\ln x\\,dx",
      answerKind: "antiderivative",
      answer: "x*log(x)-x",
      timeLimit: 60,
      tabLimit: 1,
      tags: ["integration-by-parts", "log"],
      hints: ["用分部積分。", "取 u=log x，dv=dx。", "du=1/x dx，v=x。"],
      solution: "分部積分得 x log x - int 1 dx = x log x - x。"
    },
    {
      id: "int-029",
      topic: "integrals",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\int \\frac{1}{x^2+9}\\,dx",
      answerKind: "antiderivative",
      answer: "atan(x/3)/3",
      timeLimit: 55,
      tabLimit: 1,
      tags: ["inverse-trig", "standard-integral"],
      hints: ["辨認 arctan 型。", "公式 int dx/(x^2+a^2)=atan(x/a)/a。", "這裡 a=3。"],
      solution: "由標準公式得 (1/3)atan(x/3)。"
    },
    {
      id: "int-030",
      topic: "integrals",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\int_0^{\\pi/2}\\sin^3x\\cos x\\,dx",
      answerKind: "numeric",
      answer: "1/4",
      timeLimit: 55,
      tabLimit: 1,
      tags: ["substitution", "definite-integral"],
      hints: ["令 u=sin x。", "du=cos x dx。", "上下限從 0 到 1。"],
      solution: "令 u=sin x，積分變成 int_0^1 u^3 du = 1/4。"
    },
    {
      id: "ser-024",
      topic: "series",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\sum_{n=2}^{\\infty}\\frac{1}{n\\ln n}",
      answerKind: "text",
      answers: ["diverges", "divergent", "發散"],
      canonical: "發散",
      timeLimit: 60,
      tabLimit: 1,
      tags: ["integral-test", "log"],
      hints: ["考慮積分判別。", "int dx/(x log x)=log log x。", "上限無窮大時會發散。"],
      solution: "由積分判別，int_2^infty dx/(x log x)=infty，所以級數發散。"
    },
    {
      id: "ser-027",
      topic: "series",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\text{Coefficient of }x^4\\text{ in }e^{2x}",
      answerKind: "numeric",
      answer: "2/3",
      timeLimit: 50,
      tabLimit: 1,
      tags: ["taylor", "coefficient"],
      hints: ["e^{2x}=sum (2x)^n/n!。", "x^4 項來自 n=4。", "係數是 2^4/4!。"],
      solution: "係數為 2^4/4! = 16/24 = 2/3。"
    },
    {
      id: "ser-030",
      topic: "series",
      difficulty: 2,
      source: "Buzz original",
      prompt: "\\text{Radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{(x-2)^n}{n5^n}",
      answerKind: "numeric",
      answer: "5",
      timeLimit: 55,
      tabLimit: 1,
      tags: ["power-series", "radius"],
      hints: ["中心平移不影響半徑。", "用比值或根值判別。", "條件是 |x-2|/5<1。"],
      solution: "根值判別得到 |x-2|/5<1，因此收斂半徑為 5。"
    }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(extraProblems);
})();

/* ═══ 課程缺口補題（6D、6E、6F、7A，cg-6d-／cg-6e-／cg-6f-／cg-7a-，2026-10）═══
   交錯級數判別只問收斂發散、f′ 判遞減；|cos|≤1 壓住的絕對收斂、比值判別；要比較才看得出的條件收斂；
   重排（絕對收斂不變、交錯調和級數的 p 正 q 負排法）；幾何級數代換、讀中心與係數、偶次方的收斂半徑；
   中心不在 0 的 Taylor 多項式與級數、由級數讀高階導數、二項級數先提常數；
   參數曲線消參數、範圍與方向、自交點、水平／鉛直切線、尖點、凹向、弧長、曲線下面積與封閉曲線面積。
   選擇題的每一個誘答都由數值路徑（seriesConverges、series、paramSecond、lineIntegral…）各自推翻。 */
(function () {
  "use strict";
  // 課程缺口補題（6D–7A）：補交錯／絕對／條件收斂、重排、冪級數、Taylor、參數曲線各課 gaps 記下的題型
  const SOURCE = "Buzz course gap fill";
  const CONV = ["收斂", "converges", "convergent"];
  const DIV = ["發散", "diverges", "divergent"];
  const ABS = ["絕對收斂", "absolutely convergent"];
  const COND = ["條件收斂", "conditionally convergent"];
  const conv = (f, from) => ({ m: "seriesConverges", f, from });
  // 三分類選擇題：每個選項各自翻成「原級數／絕對值級數收不收斂」
  const classify = (f, from) => ({ m: "choice", options: [
    { say: "絕對收斂", all: [{ v: { m: "seriesConverges", f, from, absolute: true }, claim: true }] },
    { say: "條件收斂", all: [
      { v: { m: "seriesConverges", f, from }, claim: true },
      { v: { m: "seriesConverges", f, from, absolute: true }, claim: false }] },
    { say: "發散", all: [{ v: { m: "seriesConverges", f, from }, claim: false }] }
  ] });
  // 答案是 x 的式子：在幾個 x 上跟巢狀路徑比
  const fnCases = (cases) => ({ m: "fn", cases: cases.map(([x, v]) => ({ at: { x }, v })) });
  const tv = (f, a, n, at) => ({ m: "taylorValue", f, a, n, at });
  const val = (f) => ({ m: "value", f });
  const ps = (at) => ({ m: "paramSecond", x: "t^2", y: "t^3+3t", at });
  const ps2 = (at) => ({ m: "paramSecond", x: "e^{t}", y: "t^2e^{t}", at });

  const problems = [
    /* ── 6D 交錯級數判別：只問收斂還是發散 ── */
    { id: "cg-6d-001", topic: "series", rank: 2, answerKind: "text",
      prompt: "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{\\sqrt{n+2}}\\text{ 收斂還是發散？}",
      answers: CONV, canonical: "收斂", distractors: ["發散", "無法判定"], timeLimit: 60,
      tags: ["ast-conditions", "alternating-series", "convergence-test"],
      hints: ["正負號交錯，把 bₙ = 1/√(n+2) 拿出來檢查三個條件。", "bₙ 是正的嗎？會遞減嗎？趨近多少？"],
      solution: "bₙ = 1/√(n+2) > 0，分母越來越大所以 bₙ 遞減，且 bₙ → 0。三個條件都成立，交錯級數判別給出收斂。",
      
      verify: conv("\\frac{(-1)^{n+1}}{\\sqrt{n+2}}", 1) },
    { id: "cg-6d-002", topic: "series", rank: 2, answerKind: "text",
      prompt: "\\sum_{n=1}^{\\infty}(-1)^n\\frac{2n}{n+5}\\text{ 收斂還是發散？}",
      answers: DIV, canonical: "發散", distractors: ["收斂", "無法判定"], timeLimit: 60,
      tags: ["ast-conditions", "alternating-series", "term-test"],
      hints: ["交錯級數判別的第三個條件是 bₙ → 0，先算 bₙ 的極限。", "如果 bₙ 不趨近 0，項 aₙ 本身會趨近 0 嗎？"],
      solution: "bₙ = 2n/(n+5) → 2 ≠ 0，交錯級數判別用不上；而且 aₙ 在 2 與 −2 附近來回跳、不趨近 0，由發散判別，級數發散。",
      
      verify: conv("(-1)^n\\frac{2n}{n+5}", 1) },
    { id: "cg-6d-003", topic: "series", rank: 2, answerKind: "text",
      prompt: "\\sum_{n=1}^{\\infty}(-1)^{n+1}\\frac{n^2}{n^3+2}\\text{ 收斂還是發散？}",
      answers: CONV, canonical: "收斂", distractors: ["發散", "無法判定"], timeLimit: 75,
      tags: ["ast-conditions", "alternating-series", "convergence-test"],
      hints: ["bₙ = n²/(n³+2)，n 很大時跟 1/n 差不多，趨近多少？", "遞減可以看 f(x) = x²/(x³+2) 的導數符號。"],
      solution: "bₙ = n²/(n³+2) > 0、→ 0。f′(x) = x(4 − x³)/(x³+2)²，x ≥ 2 時 < 0，所以從 n = 2 起遞減。交錯級數判別：收斂。",
      
      verify: conv("(-1)^{n+1}\\frac{n^2}{n^3+2}", 1) },
    { id: "cg-6d-004", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "\\text{對 }\\sum_{n=2}^{\\infty}(-1)^n\\frac{\\ln n}{\\sqrt n}\\text{ 用交錯級數判別，要先確認 }b_n\\text{ 遞減。令 }f(x)=\\frac{\\ln x}{\\sqrt x}\\text{，}f\\text{ 在 }x>c\\ \\text{ 時遞減，求最小的 }c",
      answer: "exp(2)", timeLimit: 100,
      tags: ["ast-decreasing-check", "alternating-series", "derivative-sign"],
      hints: ["bₙ 遞減不能只看前幾項，改看 f′(x) 的正負。", "用商法則，分子會出現 2 − ln x 這種形狀。"],
      solution: "f′(x) = (2 − ln x)/(2x^{3/2})。f′ < 0 ⟺ ln x > 2 ⟺ x > e²。所以 f 在 x > e² ≈ 7.39 時遞減，c = e²。",
      
      verify: { m: "criticalPoint", f: "\\frac{\\ln x}{\\sqrt x}", x0: 7 } },
    { id: "cg-6d-005", topic: "series", rank: 3, answerKind: "text",
      prompt: "\\sum_{n=1}^{\\infty}(-1)^n\\frac{\\sqrt n}{n+4}\\text{ 收斂還是發散？}",
      answers: CONV, canonical: "收斂", distractors: ["發散", "無法判定"], timeLimit: 100,
      tags: ["ast-decreasing-check", "alternating-series", "derivative-sign"],
      hints: ["bₙ = √n/(n+4) 前幾項其實在變大，遞減要從某一項之後才成立。", "看 f(x) = √x/(x+4) 的導數什麼時候變負。"],
      solution: "bₙ → 0。f′(x) = (4 − x)/(2√x(x+4)²)，x > 4 時 < 0，所以 bₙ 從 n = 4 起遞減。交錯級數判別只需要「從某項起」遞減：收斂。",
      
      verify: conv("(-1)^n\\frac{\\sqrt n}{n+4}", 1) },

    /* ── 6D 絕對收斂 ── */
    { id: "cg-6d-006", topic: "series", rank: 2, answerKind: "text",
      prompt: "\\sum_{n=1}^{\\infty}\\frac{\\cos(n\\pi/3)}{n^2}\\text{ 是絕對收斂、條件收斂還是發散？}",
      answers: ABS, canonical: "絕對收斂", distractors: ["條件收斂", "發散"], timeLimit: 75,
      tags: ["abs-conv-bound", "absolute-conditional", "comparison-test"],
      hints: ["正負號不是一正一負輪流，交錯級數判別用不上，直接看 Σ|aₙ|。", "|cos θ| ≤ 1，|aₙ| 可以被什麼壓住？"],
      solution: "|aₙ| = |cos(nπ/3)|/n² ≤ 1/n²，Σ1/n² 收斂（p = 2），比較判別 ⟹ Σ|aₙ| 收斂，所以絕對收斂。",
      
      verify: classify("\\frac{\\cos(n\\pi/3)}{n^2}", 1) },
    { id: "cg-6d-007", topic: "series", rank: 2, answerKind: "text",
      prompt: "\\sum_{n=1}^{\\infty}\\frac{(-1)^{\\lfloor n/3\\rfloor}}{n\\sqrt n}\\text{（}\\lfloor\\cdot\\rfloor\\text{ 是高斯符號）是絕對收斂、條件收斂還是發散？}",
      answers: ABS, canonical: "絕對收斂", distractors: ["條件收斂", "發散"], timeLimit: 75,
      tags: ["abs-conv-bound", "absolute-conditional", "p-series"],
      hints: ["正負號三個一組在換，不是交錯級數。", "取絕對值之後正負號就消失了，剩下什麼級數？"],
      solution: "|aₙ| = 1/n^{3/2}，Σ1/n^{3/2} 是 p = 3/2 > 1 的 p 級數，收斂。所以不管正負號怎麼排，級數都絕對收斂。",
      
      verify: classify("\\frac{(-1)^{\\lfloor n/3\\rfloor}}{n\\sqrt n}", 1) },
    { id: "cg-6d-008", topic: "series", rank: 2, answerKind: "text",
      prompt: "\\sum_{n=1}^{\\infty}\\frac{(-1)^{\\lfloor\\sqrt n\\rfloor}}{n^2+1}\\text{ 是絕對收斂、條件收斂還是發散？}",
      answers: ABS, canonical: "絕對收斂", distractors: ["條件收斂", "發散"], timeLimit: 75,
      tags: ["abs-conv-bound", "absolute-conditional", "comparison-test"],
      hints: ["正號、負號一段一段出現，段越來越長，交錯級數判別不能用。", "|aₙ| 跟哪個熟悉的級數比較？"],
      solution: "|aₙ| = 1/(n²+1) < 1/n²，Σ1/n² 收斂，比較判別 ⟹ Σ|aₙ| 收斂。絕對收斂蘊含收斂，正負號怎麼排都沒關係。",
      
      verify: classify("\\frac{(-1)^{\\lfloor\\sqrt n\\rfloor}}{n^2+1}", 1) },
    { id: "cg-6d-009", topic: "series", rank: 2, answerKind: "text",
      prompt: "\\sum_{n=1}^{\\infty}\\frac{(-5)^n}{n!}\\text{ 是絕對收斂、條件收斂還是發散？}",
      answers: ABS, canonical: "絕對收斂", distractors: ["條件收斂", "發散"], timeLimit: 75,
      tags: ["abs-conv-ratio", "absolute-conditional", "ratio-test"],
      hints: ["有階乘，試比值判別：算 |aₙ₊₁/aₙ|。", "比值判別的 L < 1 給的是哪一種收斂？"],
      solution: "|aₙ₊₁/aₙ| = 5/(n+1) → 0 < 1。比值判別看的是絕對值，所以 Σ|aₙ| 收斂，原級數絕對收斂。",
      
      verify: classify("\\frac{(-5)^n}{n!}", 1) },
    { id: "cg-6d-010", topic: "series", rank: 2, answerKind: "text",
      prompt: "\\sum_{n=1}^{\\infty}\\frac{(-3)^n}{n^2\\,2^n}\\text{ 是絕對收斂、條件收斂還是發散？}",
      answers: DIV, canonical: "發散", distractors: ["絕對收斂", "條件收斂"], timeLimit: 75,
      tags: ["abs-conv-ratio", "absolute-conditional", "ratio-test"],
      hints: ["用比值判別，算 |aₙ₊₁/aₙ| 的極限。", "L > 1 時，項 aₙ 本身會怎樣？"],
      solution: "|aₙ₊₁/aₙ| = (3/2)·n²/(n+1)² → 3/2 > 1，比值判別 ⟹ 發散（|aₙ| 甚至趨近無限大，項不趨近 0）。",
      
      verify: classify("\\frac{(-3)^n}{n^2 2^n}", 1) },

    /* ── 6D 條件收斂：絕對值級數要比較或積分才看得出發散 ── */
    { id: "cg-6d-011", topic: "series", rank: 3, answerKind: "text",
      prompt: "\\sum_{n=2}^{\\infty}\\frac{(-1)^n}{n\\ln n}\\text{ 是絕對收斂、條件收斂還是發散？}",
      answers: COND, canonical: "條件收斂", distractors: ["絕對收斂", "發散"], timeLimit: 120,
      tags: ["cond-conv-classify", "absolute-conditional", "integral-test"],
      hints: ["先看 Σ 1/(n ln n)：用積分判別，∫ dx/(x ln x) 可以令 u = ln x。", "再看原級數：bₙ = 1/(n ln n) 遞減到 0 嗎？"],
      solution: "∫₂^∞ dx/(x ln x) = [ln(ln x)]₂^∞ = ∞，積分判別 ⟹ Σ|aₙ| 發散。bₙ = 1/(n ln n) 遞減到 0，交錯級數判別 ⟹ 原級數收斂。條件收斂。",
      
      verify: classify("\\frac{(-1)^n}{n\\ln n}", 2) },
    { id: "cg-6d-012", topic: "series", rank: 2, answerKind: "text",
      prompt: "\\sum_{n=1}^{\\infty}(-1)^{n+1}\\frac{2n+3}{n^2+4}\\text{ 是絕對收斂、條件收斂還是發散？}",
      answers: COND, canonical: "條件收斂", distractors: ["絕對收斂", "發散"], timeLimit: 100,
      tags: ["cond-conv-classify", "absolute-conditional", "limit-comparison"],
      hints: ["|aₙ| = (2n+3)/(n²+4)，n 很大時像哪個級數？用極限比較。", "原級數交錯，bₙ 從某一項後遞減到 0 嗎？"],
      solution: "|aₙ|/(1/n) → 2，Σ1/n 發散，極限比較 ⟹ Σ|aₙ| 發散。f′(x) = (8 − 6x − 2x²)/(x²+4)² < 0（x ≥ 1），bₙ 遞減到 0，原級數收斂。條件收斂。",
      
      verify: classify("(-1)^{n+1}\\frac{2n+3}{n^2+4}", 1) },
    { id: "cg-6d-013", topic: "series", rank: 3, answerKind: "text",
      prompt: "\\sum_{n=1}^{\\infty}(-1)^n\\sin\\frac{1}{n}\\text{ 是絕對收斂、條件收斂還是發散？}",
      answers: COND, canonical: "條件收斂", distractors: ["絕對收斂", "發散"], timeLimit: 100,
      tags: ["cond-conv-classify", "absolute-conditional", "limit-comparison"],
      hints: ["n 很大時 sin(1/n) 跟 1/n 的比值趨近多少？", "原級數交錯；sin 在 (0, 1] 上遞增，所以 sin(1/n) 隨 n 怎麼變？"],
      solution: "sin(1/n)/(1/n) → 1，Σ1/n 發散，極限比較 ⟹ Σ|aₙ| 發散。1/n 遞減且 sin 在 (0,1] 遞增，所以 sin(1/n) 遞減到 0，交錯級數判別給出收斂。條件收斂。",
      
      verify: classify("(-1)^n\\sin\\frac{1}{n}", 1) },

    /* ── 6D 重排 ── */
    { id: "cg-6d-014", topic: "series", rank: 2, answerKind: "numeric",
      prompt: "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n^2}=\\frac{\\pi^2}{12}\\text{。改成兩個正項、一個負項的順序：}1+\\frac{1}{3^2}-\\frac{1}{2^2}+\\frac{1}{5^2}+\\frac{1}{7^2}-\\frac{1}{4^2}+\\cdots\\text{，求新的和}",
      answer: "pi^2/12", timeLimit: 75,
      tags: ["rearrange-riemann", "rearrangement", "absolute-conditional"],
      hints: ["重排會不會改變和，要看原級數是哪一種收斂。", "Σ1/n² 收斂嗎？"],
      solution: "Σ|aₙ| = Σ1/n² 收斂，原級數絕對收斂。絕對收斂的級數怎麼重排和都不變，所以新的和還是 π²/12。",
      
      verify: { m: "series", v: "k", f: "\\frac{1}{(4k-3)^2}+\\frac{1}{(4k-1)^2}-\\frac{1}{(2k)^2}", from: 1 } },
    { id: "cg-6d-015", topic: "series", rank: 2, answerKind: "text",
      prompt: "\\text{交錯調和級數 }\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n}=\\ln 2\\text{ 是條件收斂。把它的項重新排列（每項恰用一次），下列何者正確？}",
      answers: ["適當重排可以讓和等於任何指定的實數"], canonical: "適當重排可以讓和等於任何指定的實數",
      distractors: ["不管怎麼重排，和都是 ln 2", "重排之後的和一定不超過 ln 2"], timeLimit: 75,
      tags: ["rearrange-riemann", "rearrangement", "absolute-conditional"],
      hints: ["條件收斂代表正項部分與負項部分各自加起來都是無限大。", "試試「兩個正項、一個負項」的排法，和會比 ln 2 大還是小？"],
      solution: "條件收斂級數的正項和、負項和各自發散，可以先加正項超過目標、再加負項跌破目標，重排成任何和（Riemann 重排定理）。例如兩正一負的排法，和是 (3/2)ln 2 > ln 2。",
      
      verify: { m: "choice", options: [
        { say: "適當重排可以讓和等於任何指定的實數", unknown: "Riemann 重排定理（存在性），數值上不檢查" },
        { say: "不管怎麼重排，和都是 ln 2", all: [{ v: { m: "series", v: "k", f: "\\frac{1}{4k-3}+\\frac{1}{4k-1}-\\frac{1}{2k}", from: 1 }, eq: "\\ln 2" }] },
        { say: "重排之後的和一定不超過 ln 2", all: [{ v: { m: "series", v: "k", f: "\\frac{1}{4k-3}+\\frac{1}{4k-1}-\\frac{1}{2k}", from: 1 }, le: "\\ln 2" }] }
      ] } },
    { id: "cg-6d-016", topic: "series", rank: 4, answerKind: "numeric",
      prompt: "\\text{把交錯調和級數 }1-\\frac12+\\frac13-\\frac14+\\cdots\\text{ 重排成三個正項、一個負項：}1+\\frac13+\\frac15-\\frac12+\\frac17+\\frac19+\\frac{1}{11}-\\frac14+\\cdots\\text{，求新的和}",
      answer: "log(2)+log(3)/2", timeLimit: 240,
      tags: ["rearrange-compute", "rearrangement", "harmonic-number"],
      hints: ["把一組（三正一負）看成一項，前 m 組的部分和寫成奇數倒數和減偶數倒數和。", "用 1 + 1/2 + ⋯ + 1/N = ln N + γ + o(1) 估計各段。"],
      solution: "前 m 組 = Σ_{j≤3m} 1/(2j−1) − Σ_{k≤m} 1/(2k)。奇數倒數和 = H_{6m} − ½H_{3m} ≈ ln(6m) − ½ln(3m) + ½γ，偶數部分 = ½H_m ≈ ½ln m + ½γ。相減 → ln 2 + ½ ln 3。",
      
      verify: { m: "series", v: "k", f: "\\frac{1}{6k-5}+\\frac{1}{6k-3}+\\frac{1}{6k-1}-\\frac{1}{2k}", from: 1 } },
    { id: "cg-6d-017", topic: "series", rank: 4, answerKind: "numeric",
      prompt: "\\text{把交錯調和級數重排成一個正項、四個負項：}1-\\frac12-\\frac14-\\frac16-\\frac18+\\frac13-\\frac{1}{10}-\\frac{1}{12}-\\frac{1}{14}-\\frac{1}{16}+\\frac15-\\cdots\\text{，求新的和}",
      answer: "0", timeLimit: 240,
      tags: ["rearrange-compute", "rearrangement", "harmonic-number"],
      hints: ["一組 = 一個奇數倒數加四個偶數倒數（取負），前 m 組用調和數 H_N 表示。", "H_N = ln N + γ + o(1)，γ 會消掉，只剩對數。"],
      solution: "前 m 組 = Σ_{j≤m} 1/(2j−1) − Σ_{k≤4m} 1/(2k) = (H_{2m} − ½H_m) − ½H_{4m} → ln(2m) − ½ln m − ½ln(4m) = ln 2 − ln 2 = 0。",
      
      verify: { m: "series", v: "k", f: "\\frac{1}{2k-1}-\\frac{1}{8k-6}-\\frac{1}{8k-4}-\\frac{1}{8k-2}-\\frac{1}{8k}", from: 1 } },

    /* ── 6E 冪級數：從幾何級數代換、讀中心與係數 ── */
    { id: "cg-6e-001", topic: "series", rank: 2, answerKind: "numeric",
      prompt: "\\frac{x^2}{1+3x}=\\sum_{n=0}^{\\infty}c_nx^n\\text{（在 }|x|<\\tfrac13\\text{），求 }c_5",
      answer: "-27", timeLimit: 75,
      tags: ["power-series-from-geometric", "power-series", "geometric-series"],
      hints: ["先寫 1/(1+3x) = 1/(1 − u)，u 是什麼？", "乘上 x² 之後，x⁵ 是由原本的哪一次方來的？"],
      solution: "1/(1+3x) = Σ(−3x)ⁿ（|3x| < 1）。乘 x²：x²/(1+3x) = Σ(−3)ⁿx^{n+2}。x⁵ 來自 n = 3：c₅ = (−3)³ = −27。",
      
      verify: { m: "derivAt0", f: "\\frac{x^2}{1+3x}", n: 5, coef: true, r: 0.2 } },
    { id: "cg-6e-002", topic: "series", rank: 2, answerKind: "interval",
      prompt: "\\text{把 }\\frac{1}{2-x}\\text{ 寫成 }\\frac{1/2}{1-x/2}\\text{ 再用幾何級數展開成 }\\sum_{n=0}^{\\infty}c_nx^n\\text{，展開式成立的 }x\\text{ 範圍是？（寫成區間）}",
      answer: "(-2, 2)", timeLimit: 75,
      tags: ["power-series-from-geometric", "power-series", "geometric-series"],
      hints: ["幾何級數 Σuⁿ 只在 |u| < 1 時收斂。", "這裡 u = x/2，端點 u = ±1 時項會趨近 0 嗎？"],
      solution: "1/(2−x) = (1/2)Σ(x/2)ⁿ = Σxⁿ/2ⁿ⁺¹，需要 |x/2| < 1，即 −2 < x < 2。端點時各項絕對值都是 1/2，不趨近 0，發散。範圍 (−2, 2)。",
      
      verify: { m: "convergence", f: "\\frac{x^n}{2^{n+1}}", from: 0, center: 0, range: [-20, 20] } },
    { id: "cg-6e-003", topic: "series", rank: 2, answerKind: "numeric",
      prompt: "\\frac{1}{4+x^2}=\\sum_{n=0}^{\\infty}c_nx^n\\text{（在 }|x|<2\\text{），求 }c_6",
      answer: "-1/256", timeLimit: 90,
      tags: ["power-series-from-geometric", "power-series", "geometric-series"],
      hints: ["先提出 1/4：1/(4+x²) = (1/4)·1/(1 + x²/4)。", "u = −x²/4，x⁶ 對應 uⁿ 的哪個 n？"],
      solution: "1/(4+x²) = (1/4)Σ(−x²/4)ⁿ = Σ(−1)ⁿx^{2n}/4ⁿ⁺¹。x⁶ 來自 n = 3：c₆ = (−1)³/4⁴ = −1/256。",
      
      verify: { m: "derivAt0", f: "\\frac{1}{4+x^2}", n: 6, coef: true, r: 0.6 } },
    { id: "cg-6e-004", topic: "series", rank: 1, answerKind: "numeric",
      prompt: "f(x)=\\sum_{n=0}^{\\infty}\\frac{(x-5)^n}{4^n}\\text{，求 }f(5)",
      answer: "1", timeLimit: 45,
      tags: ["power-series-center-coeff", "power-series"],
      hints: ["這個冪級數的中心是多少？", "代中心進去，(x − a)ⁿ 在 n ≥ 1 時都變成什麼？"],
      solution: "中心 a = 5。代 x = 5：n ≥ 1 的項 (5−5)ⁿ = 0，只剩 n = 0 那項 (x−5)⁰/4⁰ = 1。f(5) = 1。",
      
      verify: { m: "series", f: "\\frac{(5-5)^n}{4^n}", from: 0 } },
    { id: "cg-6e-005", topic: "series", rank: 1, answerKind: "numeric",
      prompt: "\\sum_{n=0}^{\\infty}\\frac{n+1}{3^n}(x+2)^n\\text{ 寫成 }\\sum c_n(x-a)^n\\text{，求 }(x-a)^4\\text{ 的係數 }c_4",
      answer: "5/81", timeLimit: 45,
      tags: ["power-series-center-coeff", "power-series", "coefficient"],
      hints: ["x + 2 = x − (−2)，中心是 −2。", "係數就是 (x−a)ⁿ 前面的數，代 n = 4。"],
      solution: "中心 a = −2，cₙ = (n+1)/3ⁿ。c₄ = 5/3⁴ = 5/81。",
      
      verify: { m: "derivAt0", f: "\\frac{1}{(1-x/3)^2}", n: 4, coef: true, r: 0.8 } },
    { id: "cg-6e-006", topic: "series", rank: 2, answerKind: "numeric",
      prompt: "\\text{收斂半徑： }\\sum_{n=0}^{\\infty}\\frac{x^{2n}}{9^n}",
      answer: "3", timeLimit: 75,
      tags: ["radius-even-powers", "power-series", "radius"],
      hints: ["只有偶次方，係數公式 cₖ 的比值不好用；改對整個項 x^{2n}/9ⁿ 做比值判別。", "比值會是 x² 的倍數，要它小於 1。"],
      solution: "|aₙ₊₁/aₙ| = x²/9 < 1 ⟺ |x| < 3。收斂半徑 R = 3。"},
    { id: "cg-6e-007", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "\\text{收斂半徑： }\\sum_{n=0}^{\\infty}\\frac{(-1)^n x^{2n+1}}{(2n+1)\\,4^n}",
      answer: "2", timeLimit: 90,
      tags: ["radius-even-powers", "power-series", "radius"],
      hints: ["只有奇次方，對整個項做比值判別。", "(2n+1)/(2n+3) → 1，剩下 x² 跟 4 的關係。"],
      solution: "|aₙ₊₁/aₙ| = x²·(2n+1)/(4(2n+3)) → x²/4 < 1 ⟺ |x| < 2。R = 2。"},

    /* ── 6F Taylor 多項式：中心不在 0 ── */
    { id: "cg-6f-001", topic: "series", rank: 2, answerKind: "expression", variable: "x",
      prompt: "\\text{求 }f(x)=\\ln x\\ \\text{ 在 }a=2\\text{ 的二次 Taylor 多項式 }T_2(x)",
      answer: "log(2)+(x-2)/2-(x-2)^2/8", timeLimit: 90,
      tags: ["taylor-poly-center-a", "taylor"],
      hints: ["需要 f(2)、f′(2)、f″(2)。", "係數是 f^{(k)}(2)/k!，展開用 (x − 2) 的次方，不要展開成 x 的多項式。"],
      solution: "f(2) = ln 2，f′(x) = 1/x ⟹ f′(2) = 1/2，f″(x) = −1/x² ⟹ f″(2) = −1/4。T₂ = ln 2 + (x−2)/2 − (x−2)²/8。",
      
      verify: fnCases([["2.3", tv("\\ln x", 2, 2, 2.3)], ["1.6", tv("\\ln x", 2, 2, 1.6)], ["2.8", tv("\\ln x", 2, 2, 2.8)]]) },
    { id: "cg-6f-002", topic: "series", rank: 2, answerKind: "expression", variable: "x",
      prompt: "\\text{求 }f(x)=\\frac{1}{x}\\text{ 在 }a=3\\text{ 的三次 Taylor 多項式 }T_3(x)",
      answer: "1/3-(x-3)/9+(x-3)^2/27-(x-3)^3/81", timeLimit: 120,
      tags: ["taylor-poly-center-a", "taylor"],
      hints: ["f^{(k)}(x) = (−1)ᵏ k!/x^{k+1}，代 x = 3。", "除以 k! 之後，k! 剛好消掉。"],
      solution: "f^{(k)}(3)/k! = (−1)ᵏ/3^{k+1}。T₃ = 1/3 − (x−3)/9 + (x−3)²/27 − (x−3)³/81。",
      
      verify: fnCases([["3.4", tv("\\frac{1}{x}", 3, 3, 3.4)], ["2.5", tv("\\frac{1}{x}", 3, 3, 2.5)], ["3.9", tv("\\frac{1}{x}", 3, 3, 3.9)]]) },
    { id: "cg-6f-003", topic: "series", rank: 3, answerKind: "expression", variable: "x",
      prompt: "\\text{求 }f(x)=\\cos x\\ \\text{ 在 }a=\\frac{\\pi}{3}\\text{ 的二次 Taylor 多項式 }T_2(x)",
      answer: "1/2-sqrt(3)/2*(x-pi/3)-(x-pi/3)^2/4", timeLimit: 120,
      tags: ["taylor-poly-center-a", "taylor", "trig"],
      hints: ["f(π/3)、f′(π/3) = −sin(π/3)、f″(π/3) = −cos(π/3)。", "二次項係數要再除以 2!。"],
      solution: "f(π/3) = 1/2，f′(π/3) = −√3/2，f″(π/3) = −1/2。T₂ = 1/2 − (√3/2)(x − π/3) − (1/4)(x − π/3)²。",
      
      verify: fnCases([["1.2", tv("\\cos x", "\\frac{\\pi}{3}", 2, 1.2)], ["0.8", tv("\\cos x", "\\frac{\\pi}{3}", 2, 0.8)], ["1.5", tv("\\cos x", "\\frac{\\pi}{3}", 2, 1.5)]]) },

    /* ── 6F Taylor 級數：中心不在 0、由級數讀導數、收斂不等於 f ── */
    { id: "cg-6f-004", topic: "series", rank: 2, answerKind: "numeric",
      prompt: "f(x)=e^x\\ \\text{ 在 }a=2\\text{ 的 Taylor 級數 }\\sum c_n(x-2)^n\\ \\text{ 中，求 }c_4",
      answer: "exp(2)/24", timeLimit: 75,
      tags: ["taylor-series-coeff", "taylor", "coefficient"],
      hints: ["eˣ 的每一階導數都是 eˣ。", "cₙ = f^{(n)}(2)/n!。"],
      solution: "f^{(n)}(2) = e²，所以 cₙ = e²/n!，c₄ = e²/24。也可以寫 eˣ = e²·e^{x−2} 直接展開。",
      
      verify: { m: "derivAt0", f: "e^{2+x}", n: 4, coef: true } },
    { id: "cg-6f-005", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "f(x)=\\frac{1}{x}\\ \\text{ 在 }a=2\\text{ 的 Taylor 級數 }\\sum c_n(x-2)^n\\ \\text{ 中，求 }c_5",
      answer: "-1/64", timeLimit: 100,
      tags: ["taylor-series-coeff", "taylor", "geometric-series"],
      hints: ["把 1/x 寫成 1/(2 + (x − 2))，再提出 1/2。", "變成 (1/2)·1/(1 + u)，u = (x − 2)/2。"],
      solution: "1/x = (1/2)·1/(1 + (x−2)/2) = Σ(−1)ⁿ(x−2)ⁿ/2ⁿ⁺¹。c₅ = (−1)⁵/2⁶ = −1/64。",
      
      verify: { m: "derivAt0", f: "\\frac{1}{2+x}", n: 5, coef: true, r: 0.8 } },
    { id: "cg-6f-006", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "f(x)=\\ln x\\ \\text{ 在 }a=3\\text{ 的 Taylor 級數 }\\sum c_n(x-3)^n\\ \\text{ 中，求 }c_3",
      answer: "1/81", timeLimit: 100,
      tags: ["taylor-series-coeff", "taylor", "log"],
      hints: ["ln x = ln 3 + ln(1 + (x − 3)/3)。", "ln(1 + u) = u − u²/2 + u³/3 − ⋯，u = (x − 3)/3。"],
      solution: "ln x = ln 3 + Σ(−1)ⁿ⁺¹(x−3)ⁿ/(n·3ⁿ)。c₃ = 1/(3·27) = 1/81。直接算：f‴(x) = 2/x³，f‴(3)/3! = (2/27)/6 = 1/81。",
      
      verify: { m: "derivAt0", f: "\\ln(3+x)", n: 3, coef: true, r: 0.8 } },
    { id: "cg-6f-007", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "f(x)=x^2\\sin x\\text{，求 }f^{(7)}(0)",
      answer: "42", timeLimit: 100,
      tags: ["taylor-series-uniqueness", "taylor", "coefficient"],
      hints: ["不要微分七次：先寫出 x² sin x 的 Maclaurin 級數。", "x⁷ 的係數 c₇ 跟 f^{(7)}(0) 的關係是 c₇ = f^{(7)}(0)/7!。"],
      solution: "x² sin x = x³ − x⁵/6 + x⁷/120 − ⋯。c₇ = 1/120 = f^{(7)}(0)/7!，所以 f^{(7)}(0) = 5040/120 = 42。",
      
      verify: { m: "derivAt0", f: "x^2\\sin x", n: 7 } },
    { id: "cg-6f-008", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "f(x)=\\frac{1}{1+x^3}\\text{，求 }f^{(9)}(0)",
      answer: "-362880", timeLimit: 100,
      tags: ["taylor-series-uniqueness", "taylor", "geometric-series"],
      hints: ["1/(1+x³) 是幾何級數，u = −x³。", "x⁹ 的係數乘上 9! 就是 f^{(9)}(0)。"],
      solution: "1/(1+x³) = Σ(−1)ⁿx^{3n}。x⁹ 來自 n = 3，係數 −1。f^{(9)}(0) = 9!·(−1) = −362880。",
      
      verify: { m: "derivAt0", f: "\\frac{1}{1+x^3}", n: 9 } },
    { id: "cg-6f-009", topic: "series", rank: 2, answerKind: "text",
      prompt: "f(x)=e^{-1/x^2}\\ (x\\ne0)\\text{，}f(0)=0\\text{。已知 }f^{(n)}(0)=0\\text{ 對每個 }n\\text{ 都成立。關於 }f\\text{ 的 Maclaurin 級數，下列何者正確？}",
      answers: ["它對每個 x 都收斂，但只在 x = 0 等於 f(x)"], canonical: "它對每個 x 都收斂，但只在 x = 0 等於 f(x)",
      distractors: ["它對每個 x 都收斂到 f(x)", "它只在 |x| < 1 收斂"], timeLimit: 75,
      tags: ["taylor-series-caveat", "taylor"],
      hints: ["係數全是 0，這個級數每一項都是什麼？", "拿 x = 1 比一比：級數的值和 f(1) = e^{−1} 一樣嗎？"],
      solution: "係數 f^{(n)}(0)/n! 全是 0，Maclaurin 級數就是 0，對每個 x 都收斂（到 0）。但 x ≠ 0 時 f(x) = e^{−1/x²} > 0，所以級數只在 x = 0 等於 f。收斂不代表等於 f。",
      
      verify: { m: "choice", options: [
        { say: "它對每個 x 都收斂，但只在 x = 0 等於 f(x)", all: [
          { v: { m: "derivAt0", f: "e^{-1/x^2}", n: 2, coef: true, r: 0.1 }, eq: 0 },
          { v: { m: "derivAt0", f: "e^{-1/x^2}", n: 4, coef: true, r: 0.1 }, eq: 0 },
          { v: val("e^{-1/1^2}"), gt: 0.3 }] },
        { say: "它對每個 x 都收斂到 f(x)", all: [{ v: val("e^{-1/1^2}"), eq: 0 }] },
        { say: "它只在 |x| < 1 收斂", all: [{ v: { m: "derivAt0", f: "e^{-1/x^2}", n: 2, coef: true, r: 0.1 }, ne: 0 }] }
      ] } },

    /* ── 6F 二項級數：先提出 aᵏ ── */
    { id: "cg-6f-010", topic: "series", rank: 2, answerKind: "numeric",
      prompt: "\\sqrt{4+x}=\\sum_{n=0}^{\\infty}c_nx^n\\text{（在 }|x|<4\\text{），求 }c_2",
      answer: "-1/64", timeLimit: 90,
      tags: ["binomial-series-expand", "binomial-series", "coefficient"],
      hints: ["先提出 √4：√(4+x) = 2(1 + x/4)^{1/2}。", "二項係數 C(1/2, 2) = (1/2)(1/2 − 1)/2!，再乘 (x/4)² 的係數。"],
      solution: "√(4+x) = 2(1 + x/4)^{1/2}。C(1/2,2) = (1/2)(−1/2)/2 = −1/8。c₂ = 2·(−1/8)·(1/16) = −1/64。成立於 |x/4| < 1。",
      
      verify: { m: "derivAt0", f: "\\sqrt{4+x}", n: 2, coef: true } },
    { id: "cg-6f-011", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "\\frac{1}{(2-x)^2}=\\sum_{n=0}^{\\infty}c_nx^n\\text{（在 }|x|<2\\text{），求 }c_5",
      answer: "3/64", timeLimit: 100,
      tags: ["binomial-series-expand", "binomial-series", "coefficient"],
      hints: ["提出 2^{−2}：1/(2−x)² = (1/4)(1 − x/2)^{−2}。", "(1 − u)^{−2} = Σ(n+1)uⁿ，u = x/2。"],
      solution: "1/(2−x)² = (1/4)(1 − x/2)^{−2} = (1/4)Σ(n+1)(x/2)ⁿ = Σ(n+1)xⁿ/2ⁿ⁺²，成立於 |x| < 2。c₅ = 6/2⁷ = 3/64。",
      
      verify: { m: "derivAt0", f: "\\frac{1}{(2-x)^2}", n: 5, coef: true, r: 0.8 } },

    /* ── 7A 參數曲線：消參數、範圍與方向、自交點 ── */
    { id: "cg-7a-001", topic: "derivatives", rank: 1, answerKind: "expression", variable: "x",
      prompt: "x=2t-1,\\ y=3-4t\\text{。消去參數 }t\\text{，把 }y\\text{ 寫成 }x\\text{ 的式子}",
      answer: "1-2*x", timeLimit: 60,
      tags: ["parametric-eliminate", "parametric"],
      hints: ["從 x 的式子解出 t。", "把 t 代進 y 的式子再化簡。"],
      solution: "t = (x+1)/2，代入 y = 3 − 4t = 3 − 2(x+1) = 1 − 2x。這是一條直線。",
      
      verify: fnCases([["2\\cdot0.3-1", val("3-4\\cdot0.3")], ["2\\cdot1.7-1", val("3-4\\cdot1.7")], ["2\\cdot(-0.8)-1", val("3-4\\cdot(-0.8)")]]) },
    { id: "cg-7a-002", topic: "derivatives", rank: 2, answerKind: "expression", variable: "x",
      prompt: "x=1+2\\cos t,\\ y=-3+2\\sin t\\text{。消去參數，寫成 }(y+3)^2=g(x)\\text{，求 }g(x)",
      answer: "4-(x-1)^2", timeLimit: 75,
      tags: ["parametric-eliminate", "parametric", "trig-identity"],
      hints: ["先把 cos t、sin t 各自用 x、y 表示。", "用 cos²t + sin²t = 1。"],
      solution: "cos t = (x−1)/2，sin t = (y+3)/2。平方相加 = 1：(x−1)² + (y+3)² = 4，所以 (y+3)² = 4 − (x−1)²。是圓心 (1, −3)、半徑 2 的圓。",
      
      verify: fnCases([["1+2\\cos 0.4", val("(2\\sin 0.4)^2")], ["1+2\\cos 2.2", val("(2\\sin 2.2)^2")], ["1+2\\cos 4", val("(2\\sin 4)^2")]]) },
    { id: "cg-7a-003", topic: "derivatives", rank: 2, answerKind: "expression", variable: "x",
      prompt: "x=4\\cos t,\\ y=2\\sin t\\text{。消去參數，把 }y^2\\text{ 寫成 }x\\text{ 的式子}",
      answer: "4-x^2/4", timeLimit: 75,
      tags: ["parametric-eliminate", "parametric", "trig-identity"],
      hints: ["cos t = x/4，sin t = y/2。", "代進 cos²t + sin²t = 1，再解 y²。"],
      solution: "(x/4)² + (y/2)² = 1，即橢圓 x²/16 + y²/4 = 1。解出 y² = 4(1 − x²/16) = 4 − x²/4。",
      
      verify: fnCases([["4\\cos 0.5", val("(2\\sin 0.5)^2")], ["4\\cos 1.9", val("(2\\sin 1.9)^2")], ["4\\cos 3.6", val("(2\\sin 3.6)^2")]]) },
    { id: "cg-7a-004", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "x=e^{t},\\ y=e^{2t}-1\\ (t\\in\\mathbb{R})\\text{。消去參數得 }y=x^2-1\\text{。這條參數曲線畫出的是拋物線的哪一部分？}",
      answers: ["x > 0 的右半邊（不含頂點）"], canonical: "x > 0 的右半邊（不含頂點）",
      distractors: ["整條拋物線", "x ≥ 1 的部分"], timeLimit: 75,
      tags: ["parametric-direction-range", "parametric"],
      hints: ["消參數會丟掉範圍的資訊，回頭看 x = eᵗ 能取哪些值。", "t → −∞ 時 x 趨近多少？t = 0 時 x 是多少？"],
      solution: "x = eᵗ 的值域是 (0, ∞)：t → −∞ 時 x → 0⁺ 但取不到 0，t = 0 時 x = 1，t < 0 時 0 < x < 1。所以只畫出 x > 0 的那半邊，頂點 (0, −1) 不在上面。",
      
      verify: { m: "choice", options: [
        { say: "x > 0 的右半邊（不含頂點）", all: [
          { v: { m: "extremeOf", kind: "inf", f: "e^{x}", integer: false, range: [-40, 40] }, eq: 0 },
          { v: val("e^{-1}"), lt: 1 }] },
        { say: "整條拋物線", all: [{ v: { m: "extremeOf", kind: "inf", f: "e^{x}", integer: false, range: [-40, 40] }, lt: -0.5 }] },
        { say: "x ≥ 1 的部分", all: [{ v: val("e^{-1}"), ge: 1 }] }
      ] } },
    { id: "cg-7a-005", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "x=2\\cos t,\\ y=2\\sin t,\\ 0\\le t\\le\\pi\\text{。這段參數曲線是什麼、往哪個方向走？}",
      answers: ["上半圓，從 (2, 0) 逆時針走到 (−2, 0)"], canonical: "上半圓，從 (2, 0) 逆時針走到 (−2, 0)",
      distractors: ["整個圓，逆時針走一圈", "上半圓，從 (−2, 0) 順時針走到 (2, 0)"], timeLimit: 75,
      tags: ["parametric-direction-range", "parametric"],
      hints: ["代 t = 0、π/2、π 三個點，看起點、中間、終點。", "0 ≤ t ≤ π 時 y = 2 sin t 的正負號？"],
      solution: "t = 0 在 (2, 0)，t = π/2 在 (0, 2)，t = π 在 (−2, 0)。y = 2 sin t ≥ 0，所以是上半圓，從 (2, 0) 經過 (0, 2) 逆時針走到 (−2, 0)。",
      
      verify: { m: "choice", options: [
        { say: "上半圓，從 (2, 0) 逆時針走到 (−2, 0)", all: [
          { v: val("2\\cos 0"), eq: 2 }, { v: val("2\\cos\\pi"), eq: -2 },
          { v: val("2\\sin\\frac{\\pi}{2}"), gt: 0 },
          { v: { m: "extremeOf", kind: "inf", f: "2\\sin x", integer: false, range: [0, "\\pi"] }, ge: 0 }] },
        { say: "整個圓，逆時針走一圈", all: [{ v: { m: "extremeOf", kind: "inf", f: "2\\sin x", integer: false, range: [0, "\\pi"] }, lt: -1 }] },
        { say: "上半圓，從 (−2, 0) 順時針走到 (2, 0)", all: [{ v: val("2\\cos 0"), eq: -2 }] }
      ] } },
    { id: "cg-7a-006", topic: "derivatives", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }x=t^2,\\ y=t^3-4t\\text{ 會穿過自己一次（兩個不同的 }t\\text{ 走到同一點）。求這個自交點的 }x\\text{ 座標}",
      answer: "4", timeLimit: 120,
      tags: ["parametric-self-intersection", "parametric"],
      hints: ["設 t₁ ≠ t₂ 給出同一點：先從 x 相等推出 t₁ 與 t₂ 的關係。", "x 相等 ⟹ t₂ = −t₁，再要求 y 也相等。"],
      solution: "t₁² = t₂² 且 t₁ ≠ t₂ ⟹ t₂ = −t₁。y 相等：t³ − 4t = −t³ + 4t ⟹ 2t(t² − 4) = 0，t ≠ 0 ⟹ t = ±2。自交點 (4, 0)，x = 4。",
      
      verify: { m: "let", f: "s^2", with: { s: { m: "root", f: "(x^3-4x)-((-x)^3-4(-x))", x0: 1.6 } } } },

    /* ── 7A 參數式的導數：水平／鉛直切線、尖點 ── */
    { id: "cg-7a-007", topic: "derivatives", rank: 2, answerKind: "set",
      prompt: "\\text{曲線 }x=t^2-2t,\\ y=t^3-27t\\text{ 在哪些 }t\\text{ 有水平切線？（寫成集合）}",
      answer: "{-3, 3}", timeLimit: 90,
      tags: ["parametric-horizontal-vertical", "parametric-differentiation", "parametric"],
      hints: ["水平切線：dy/dt = 0，同時 dx/dt ≠ 0。", "解完 dy/dt = 0 之後，記得把每個 t 代進 dx/dt 檢查。"],
      solution: "dy/dt = 3t² − 27 = 0 ⟹ t = ±3。dx/dt = 2t − 2 在 t = ±3 是 4 與 −8，都不為 0。水平切線在 t = −3、3。",
      
      verify: { m: "critical", f: "x^3-27x", range: [-10, 10] } },
    { id: "cg-7a-008", topic: "derivatives", rank: 3, answerKind: "set",
      prompt: "\\text{曲線 }x=t^3-3t,\\ y=t^2+t\\text{ 在哪些 }t\\text{ 有鉛直切線？（寫成集合）}",
      answer: "{-1, 1}", timeLimit: 90,
      tags: ["parametric-horizontal-vertical", "parametric-differentiation", "parametric"],
      hints: ["鉛直切線：dx/dt = 0，同時 dy/dt ≠ 0。", "dx/dt = 0 的每個解都要代進 dy/dt 看是不是 0。"],
      solution: "dx/dt = 3t² − 3 = 0 ⟹ t = ±1。dy/dt = 2t + 1 在 t = 1 是 3、t = −1 是 −1，都不為 0。鉛直切線在 t = −1、1，點 (2, 0) 與 (−2, 2)。",
      
      verify: { m: "critical", f: "x^3-3x", range: [-10, 10] } },
    { id: "cg-7a-009", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "\\text{擺線 }x=2(t-\\sin t),\\ y=2(1-\\cos t)\\text{ 在 }t=2\\pi\\text{ 時 }\\frac{dx}{dt}=\\frac{dy}{dt}=0\\text{。這一點的曲線長什麼樣？}",
      answers: ["尖點：從兩側靠近時切線都趨向鉛直"], canonical: "尖點：從兩側靠近時切線都趨向鉛直",
      distractors: ["有水平切線（斜率 0）", "光滑通過，切線斜率是 1"], timeLimit: 100,
      tags: ["parametric-singular-point", "parametric-differentiation", "parametric"],
      hints: ["dx/dt = dy/dt = 0 時公式是 0/0，不給結論；改看 t 靠近 2π 時 dy/dx 的極限。", "dy/dx = sin t/(1 − cos t)，可以用半角公式化成 cot(t/2)。"],
      solution: "dy/dx = sin t/(1 − cos t) = cot(t/2)。t → 2π⁻ 時 → −∞，t → 2π⁺ 時 → +∞：兩側的切線都趨向鉛直，曲線在 (4π, 0) 形成尖點。",
      
      verify: { m: "choice", options: [
        { say: "尖點：從兩側靠近時切線都趨向鉛直", all: [
          { v: { m: "paramSlope", x: "2(t-\\sin t)", y: "2(1-\\cos t)", at: "2\\pi-0.01" }, lt: -50 },
          { v: { m: "paramSlope", x: "2(t-\\sin t)", y: "2(1-\\cos t)", at: "2\\pi+0.01" }, gt: 50 }] },
        { say: "有水平切線（斜率 0）", all: [{ v: { m: "paramSlope", x: "2(t-\\sin t)", y: "2(1-\\cos t)", at: "2\\pi-0.01" }, gt: -1 }] },
        { say: "光滑通過，切線斜率是 1", all: [{ v: { m: "paramSlope", x: "2(t-\\sin t)", y: "2(1-\\cos t)", at: "2\\pi+0.01" }, eq: 1 }] }
      ] } },

    /* ── 7A 參數式的二階導數：凹向 ── */
    { id: "cg-7a-010", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "\\text{曲線 }x=t^2,\\ y=t^3+3t\\ (t\\ne0)\\text{。在哪些 }t\\text{ 凹向上（}\\frac{d^2y}{dx^2}>0\\text{）？}",
      answers: ["−1 < t < 0 與 t > 1"], canonical: "−1 < t < 0 與 t > 1",
      distractors: ["只有 t > 1", "t > 0"], timeLimit: 150,
      tags: ["parametric-concavity", "parametric", "concavity"],
      hints: ["d²y/dx² = [d/dt (dy/dx)] ÷ (dx/dt)，不是 y″(t)/x″(t)。", "化簡後是一個分式，分子分母各自看正負號，注意 t < 0 時分母的符號。"],
      solution: "dy/dx = (3t²+3)/(2t)。d/dt = 3/2 − 3/(2t²) = 3(t²−1)/(2t²)，再除以 2t：d²y/dx² = 3(t²−1)/(4t³)。分子分母同號：t > 1 或 −1 < t < 0。",
      
      verify: { m: "choice", options: [
        { say: "−1 < t < 0 與 t > 1", all: [
          { v: ps(-0.5), gt: 0 }, { v: ps(2), gt: 0 }, { v: ps(0.5), lt: 0 }, { v: ps(-2), lt: 0 }] },
        { say: "只有 t > 1", all: [{ v: ps(-0.5), le: 0 }] },
        { say: "t > 0", all: [{ v: ps(0.5), gt: 0 }] }
      ] } },
    { id: "cg-7a-011", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "\\text{曲線 }x=e^{t},\\ y=t^2e^{t}\\text{。在哪些 }t\\text{ 凹向上（}\\frac{d^2y}{dx^2}>0\\text{）？}",
      answers: ["t > −1"], canonical: "t > −1",
      distractors: ["t > 0", "t < −1"], timeLimit: 120,
      tags: ["parametric-concavity", "parametric", "concavity"],
      hints: ["先算 dy/dx = (dy/dt)/(dx/dt)，eᵗ 會約掉。", "再對 t 微分、除以 dx/dt = eᵗ，eᵗ 永遠是正的。"],
      solution: "dy/dx = (2t + t²)eᵗ/eᵗ = t² + 2t。d²y/dx² = (2t + 2)/eᵗ，eᵗ > 0，所以正負號跟 2t + 2 一樣：t > −1 時凹向上。",
      
      verify: { m: "choice", options: [
        { say: "t > −1", all: [{ v: ps2(-0.5), gt: 0 }, { v: ps2(1.5), gt: 0 }, { v: ps2(-1.5), lt: 0 }] },
        { say: "t > 0", all: [{ v: ps2(-0.5), le: 0 }] },
        { say: "t < −1", all: [{ v: ps2(-1.5), gt: 0 }] }
      ] } },

    /* ── 7A 參數式弧長 ── */
    { id: "cg-7a-012", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{求曲線 }x=t^2,\\ y=\\tfrac{2}{3}t^3,\\ 0\\le t\\le 2\\text{ 的弧長}",
      answer: "2*(5*sqrt(5)-1)/3", timeLimit: 120,
      tags: ["parametric-arc-length-integral", "arc-length", "parametric"],
      hints: ["速率 √(x′² + y′²)，x′ = 2t、y′ = 2t²。", "根號裡提出 4t²，再用 u = 1 + t² 代換。"],
      solution: "√(4t² + 4t⁴) = 2t√(1+t²)（t ≥ 0）。L = ∫₀² 2t√(1+t²) dt = (2/3)(1+t²)^{3/2}|₀² = (2/3)(5√5 − 1) ≈ 6.787。",
      
      verify: { m: "lineIntegral", kind: "ds", f: "1", path: { x: "t^2", y: "\\frac{2}{3}t^3", from: 0, to: 2 } } },
    { id: "cg-7a-013", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求曲線 }x=e^{t}\\cos t,\\ y=e^{t}\\sin t,\\ 0\\le t\\le\\ln 3\\text{ 的弧長}",
      answer: "2*sqrt(2)", timeLimit: 150,
      tags: ["parametric-arc-length-integral", "arc-length", "parametric"],
      hints: ["x′ = eᵗ(cos t − sin t)，y′ = eᵗ(sin t + cos t)。", "平方相加時交叉項會消掉。"],
      solution: "x′² + y′² = e^{2t}[(cos t − sin t)² + (sin t + cos t)²] = 2e^{2t}，速率 √2 eᵗ。L = √2(e^{ln 3} − 1) = 2√2。",
      
      verify: { m: "lineIntegral", kind: "ds", f: "1", path: { x: "e^{t}\\cos t", y: "e^{t}\\sin t", from: 0, to: "\\ln 3" } } },
    { id: "cg-7a-014", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求曲線 }x=3t-t^3,\\ y=3t^2,\\ 0\\le t\\le 2\\text{ 的弧長}",
      answer: "14", timeLimit: 150,
      tags: ["parametric-arc-length-integral", "arc-length", "parametric"],
      hints: ["x′ = 3 − 3t²，y′ = 6t，把 x′² + y′² 展開。", "展開後會是一個完全平方。"],
      solution: "x′² + y′² = 9 − 18t² + 9t⁴ + 36t² = 9(1 + t²)²，速率 3(1 + t²)。L = ∫₀² 3(1+t²) dt = 3(2 + 8/3) = 14。",
      
      verify: { m: "lineIntegral", kind: "ds", f: "1", path: { x: "3t-t^3", y: "3t^2", from: 0, to: 2 } } },
    { id: "cg-7a-015", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "x=\\cos 2t,\\ y=\\sin 2t,\\ 0\\le t\\le 2\\pi\\text{。}\\int_0^{2\\pi}\\sqrt{x'(t)^2+y'(t)^2}\\,dt=4\\pi\\text{。這條曲線（畫出來的圖形）的長度是多少？}",
      answers: ["2π"], canonical: "2π", distractors: ["4π", "π"], timeLimit: 75,
      tags: ["parametric-arc-length-overlap", "arc-length", "parametric"],
      hints: ["t 從 0 走到 2π 的時候，點 (cos 2t, sin 2t) 繞單位圓幾圈？", "積分量的是走過的距離；圖形的長度只能算一次。"],
      solution: "2t 從 0 走到 4π，點繞單位圓兩圈，所以速率積分 4π 是走過的距離。圖形本身是單位圓，長度只算一圈：t 取 [0, π]，長度 2π。",
      
      verify: { m: "choice", options: [
        { say: "2π", all: [
          { v: { m: "lineIntegral", kind: "ds", f: "1", path: { x: "\\cos 2t", y: "\\sin 2t", from: 0, to: "\\pi" } }, eq: "2\\pi" },
          { v: val("\\cos 2\\pi"), eq: 1 }, { v: val("\\sin 2\\pi"), eq: 0 }] },
        { say: "4π", all: [{ v: { m: "lineIntegral", kind: "ds", f: "1", path: { x: "\\cos 2t", y: "\\sin 2t", from: 0, to: "\\pi" } }, eq: "4\\pi" }] },
        { say: "π", all: [{ v: { m: "lineIntegral", kind: "ds", f: "1", path: { x: "\\cos 2t", y: "\\sin 2t", from: 0, to: "\\pi" } }, eq: "\\pi" }] }
      ] } },

    /* ── 7A 參數式面積 ── */
    { id: "cg-7a-016", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{擺線 }x=2(t-\\sin t),\\ y=2(1-\\cos t)\\text{ 的一拱（}0\\le t\\le2\\pi\\text{）與 }x\\text{ 軸圍成的面積}",
      answer: "12*pi", timeLimit: 120,
      tags: ["parametric-area-integral", "area", "parametric"],
      hints: ["A = ∫ y dx = ∫ y(t)·x′(t) dt，t 從 0 到 2π（x 從 0 增加到 4π）。", "(1 − cos t)² 展開後用 cos²t = (1 + cos 2t)/2。"],
      solution: "A = ∫₀^{2π} 2(1−cos t)·2(1−cos t) dt = 4∫₀^{2π}(1 − 2cos t + cos²t) dt = 4(2π + π) = 12π。",
      
      verify: { m: "lineIntegral", kind: "work", F: ["y", "0"], path: { x: "2(t-\\sin t)", y: "2(1-\\cos t)", from: 0, to: "2\\pi" } } },
    { id: "cg-7a-017", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{曲線 }x=t^2+1,\\ y=t^3+t,\\ 0\\le t\\le1\\text{ 下方、}x\\text{ 軸上方（}1\\le x\\le2\\text{）的面積}",
      answer: "16/15", timeLimit: 100,
      tags: ["parametric-area-integral", "area", "parametric"],
      hints: ["dx = 2t dt，x = 1 對應 t = 0，x = 2 對應 t = 1。", "∫ (t³ + t)·2t dt，逐項積。"],
      solution: "A = ∫₀¹ (t³ + t)(2t) dt = ∫₀¹ (2t⁴ + 2t²) dt = 2/5 + 2/3 = 16/15。",
      
      verify: { m: "lineIntegral", kind: "work", F: ["y", "0"], path: { x: "t^2+1", y: "t^3+t", from: 0, to: 1 } } },
    { id: "cg-7a-018", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }x=t^3,\\ y=4-t^2,\\ 0\\le t\\le1\\text{ 下方、}x\\text{ 軸上方（}0\\le x\\le1\\text{）的面積}",
      answer: "17/5", timeLimit: 100,
      tags: ["parametric-area-integral", "area", "parametric"],
      hints: ["dx = 3t² dt，x 從 0 到 1 對應 t 從 0 到 1。", "被積函數 (4 − t²)·3t² 展開。"],
      solution: "A = ∫₀¹ (4 − t²)(3t²) dt = ∫₀¹ (12t² − 3t⁴) dt = 4 − 3/5 = 17/5。",
      
      verify: { m: "lineIntegral", kind: "work", F: ["y", "0"], path: { x: "t^3", y: "4-t^2", from: 0, to: 1 } } },
    { id: "cg-7a-019", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{曲線 }x=1-t,\\ y=t^2\\ (0\\le t\\le1)\\text{ 與兩軸圍出的面積記為 }A\\text{。}\\int_0^1 y(t)\\,x'(t)\\,dt\\text{ 等於？}",
      answers: ["−A"], canonical: "−A", distractors: ["A", "2A"], timeLimit: 75,
      tags: ["parametric-area-orientation", "area", "parametric"],
      hints: ["t 從 0 增加到 1 的時候，x 是變大還是變小？", "∫ y x′ dt 對應的是 x 從哪裡積到哪裡？"],
      solution: "x′ = −1：t 增加時 x 從 1 減到 0，所以 ∫₀¹ y x′ dt = ∫₁⁰ y dx = −∫₀¹ y dx = −A。實際算：∫₀¹ t²·(−1) dt = −1/3，而 A = 1/3。",
      
      verify: { m: "choice", options: [
        { say: "−A", all: [{ v: { m: "let", f: "P+A", with: {
          P: { m: "lineIntegral", kind: "work", F: ["y", "0"], path: { x: "1-t", y: "t^2", from: 0, to: 1 } },
          A: { m: "integral", f: "(1-x)^2", a: 0, b: 1 } } }, eq: 0 }] },
        { say: "A", all: [{ v: { m: "let", f: "P-A", with: {
          P: { m: "lineIntegral", kind: "work", F: ["y", "0"], path: { x: "1-t", y: "t^2", from: 0, to: 1 } },
          A: { m: "integral", f: "(1-x)^2", a: 0, b: 1 } } }, eq: 0 }] },
        { say: "2A", all: [{ v: { m: "let", f: "P-2A", with: {
          P: { m: "lineIntegral", kind: "work", F: ["y", "0"], path: { x: "1-t", y: "t^2", from: 0, to: 1 } },
          A: { m: "integral", f: "(1-x)^2", a: 0, b: 1 } } }, eq: 0 }] }
      ] } },
    { id: "cg-7a-020", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{曲線 }x=t^2,\\ y=t^3\\ (t\\ge0)\\text{。要算 }x\\text{ 從 1 到 4 這一段曲線下的面積 }\\int y\\,dx\\text{，改寫成 }\\int y(t)x'(t)\\,dt\\text{ 時 }t\\text{ 的上下限是？}",
      answers: ["t 從 1 到 2"], canonical: "t 從 1 到 2", distractors: ["t 從 1 到 4", "t 從 1 到 16"], timeLimit: 75,
      tags: ["parametric-area-orientation", "area", "parametric"],
      hints: ["上下限要換成 t 的值，不是 x 的值。", "x = 1 與 x = 4 各自對應哪個 t ≥ 0？"],
      solution: "x = t²，t ≥ 0：x = 1 ⟹ t = 1，x = 4 ⟹ t = 2。所以 ∫₁⁴ y dx = ∫₁² t³·2t dt = 62/5。",
      
      verify: { m: "choice", options: [
        { say: "t 從 1 到 2", all: [{ v: { m: "lineIntegral", kind: "work", F: ["y", "0"], path: { x: "t^2", y: "t^3", from: 1, to: 2 } }, eq: { m: "integral", f: "x^{3/2}", a: 1, b: 4 } }] },
        { say: "t 從 1 到 4", all: [{ v: { m: "lineIntegral", kind: "work", F: ["y", "0"], path: { x: "t^2", y: "t^3", from: 1, to: 4 } }, eq: { m: "integral", f: "x^{3/2}", a: 1, b: 4 } }] },
        { say: "t 從 1 到 16", all: [{ v: { m: "lineIntegral", kind: "work", F: ["y", "0"], path: { x: "t^2", y: "t^3", from: 1, to: 16 } }, eq: { m: "integral", f: "x^{3/2}", a: 1, b: 4 } }] }
      ] } },
    { id: "cg-7a-021", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求星形線 }x=2\\cos^3t,\\ y=2\\sin^3t\\ (0\\le t\\le2\\pi)\\text{ 圍成的面積}",
      answer: "3*pi/2", timeLimit: 180,
      tags: ["parametric-closed-curve-area", "area", "parametric"],
      hints: ["逆時針走一圈的封閉曲線：A = ½∮(x y′ − y x′) dt。", "x y′ − y x′ 化簡會出現 sin²t cos²t，再用 sin 2t 的平方。"],
      solution: "x y′ − y x′ = 2cos³t·6sin²t cos t + 2sin³t·6cos²t sin t = 12 sin²t cos²t = 3 sin²2t。A = ½∫₀^{2π} 3 sin²2t dt = ½·3π = 3π/2。",
      
      verify: { m: "lineIntegral", kind: "work", F: ["-\\frac{y}{2}", "\\frac{x}{2}"], path: { x: "2\\cos^3 t", y: "2\\sin^3 t", from: 0, to: "2\\pi" } } },
    { id: "cg-7a-022", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\text{曲線 }x=\\sin t,\\ y=\\sin 2t\\text{ 在 }0\\le t\\le\\pi\\text{ 走出一個封閉的圈（從原點出發回到原點）。求這個圈圍成的面積}",
      answer: "4/3", timeLimit: 200,
      tags: ["parametric-closed-curve-area", "area", "parametric"],
      hints: ["先畫幾個點判斷走向：t = π/4 時在第一象限、t = 3π/4 時在第四象限，是順時針還是逆時針？", "用 A = |∫ y x′ dt|，y x′ = sin 2t cos t = 2 sin t cos²t。"],
      solution: "∫₀^π y x′ dt = ∫₀^π 2 sin t cos²t dt = [−(2/3)cos³t]₀^π = 4/3。曲線順時針走（先上後下），所以 ∫ y dx 是正的面積：A = 4/3。",
      
      verify: { m: "lineIntegral", kind: "work", F: ["\\frac{y}{2}", "-\\frac{x}{2}"], path: { x: "\\sin t", y: "\\sin 2t", from: 0, to: "\\pi" } } }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE, difficulty: Math.min(4, problem.rank), ...problem })));
})();
