(function () {
  "use strict";

  // 基礎補強包（2026-09 題庫審計後新增）。
  //
  // 審計抓到的兩個結構性失衡：
  //   1. R1 只佔 6.7%（117/1759），其中 series 16 題、integrals 23 題 ——
  //      定位測驗把人分到低段之後，池子兩輪就見底。
  //   2. series 全面偏薄（11%），R6 只有 5 題。
  //
  // 這包只做兩件事：R1 入口題（四主題）與級數 R2–R6 的縱深。
  // 所有題幹刻意寫成驗算器認得的形式（∑、∫、lim、d/dx、收斂半徑），
  // 進 CI 就會被獨立數值驗算 —— 不靠人工檢查。
  const SOURCE = "Buzz foundations pack";
  const problems = [];

  function add(problem) {
    const rank = problem.rank;
    const tags = [...(problem.tags || []), `rank-${rank}`];
    if (rank <= 2) tags.push("beginner-friendly");
    if (rank >= 5) tags.push("boss-rank");
    if (rank === 6) tags.push("boss-plus");
    problems.push({
      source: SOURCE,
      difficulty: Math.min(4, rank),
      tabLimit: 1,
      ...problem,
      tags
    });
  }

  function N(id, topic, rank, prompt, answer, tags, solution, timeLimit, hints) {
    add({ id, topic, rank, prompt, answerKind: "numeric", answer, tags, solution, timeLimit, hints });
  }

  function A(id, topic, rank, prompt, answer, tags, solution, timeLimit, hints) {
    add({ id, topic, rank, prompt, answerKind: "antiderivative", answer, tags, solution, timeLimit, hints });
  }

  function T(id, topic, rank, prompt, answers, canonical, tags, solution, timeLimit, hints) {
    add({ id, topic, rank, prompt, answerKind: "text", answers, canonical, tags, solution, timeLimit, hints });
  }

  function E(id, topic, rank, prompt, answer, tags, solution, timeLimit, hints) {
    add({ id, topic, rank, prompt, answerKind: "expression", answer, tags, solution, timeLimit, hints });
  }

  /* ── 極限 R1：入口 12 題 ─────────────────────────────────── */

  N("fd-lim-001", "limits", 1, "\\lim_{x\\to 2}\\left(x^2+3x\\right)", "10",
    ["direct-substitution"],
    "多項式在每一點連續，直接代入：4+6=10。", 25,
    ["多項式可以直接代入。", "把 x=2 代進去。", "4+6=10。"]);
  N("fd-lim-002", "limits", 1, "\\lim_{x\\to -1}\\left(2x^2-x+1\\right)", "4",
    ["direct-substitution"],
    "直接代入 x=−1：2+1+1=4。", 25,
    ["多項式直接代入。", "注意 −(−1)=+1。", "2+1+1=4。"]);
  N("fd-lim-003", "limits", 1, "\\lim_{x\\to 3}\\frac{x^2-x-6}{x-3}", "5",
    ["factoring"],
    "分子因式分解 (x−3)(x+2)，約分後代入得 5。", 35,
    ["0/0 先因式分解。", "x^2−x−6=(x−3)(x+2)。", "約分後代 x=3。"]);
  N("fd-lim-004", "limits", 1, "\\lim_{x\\to -2}\\frac{x^2-4}{x+2}", "-4",
    ["factoring"],
    "x²−4=(x−2)(x+2)，約分後代入 x=−2 得 −4。", 35,
    ["0/0 先因式分解。", "平方差公式。", "約分後代 x=−2。"]);
  N("fd-lim-005", "limits", 1, "\\lim_{x\\to 0}\\frac{\\sin(7x)}{2x}", "7/2",
    ["trig-limit"],
    "sin(7x)/(7x)→1，補係數得 7/2。", 30,
    ["湊出 sin(u)/u 的形。", "分子分母同乘 7/7。", "剩下引數的係數比。"]);
  N("fd-lim-006", "limits", 1, "\\lim_{x\\to 0}\\frac{\\tan(2x)}{x}", "2",
    ["trig-limit"],
    "tan(2x)≈2x（一階），極限是 2。", 30,
    ["tan u ≈ u 當 u→0。", "把 2x 當成 u。", "極限是 2。"]);
  N("fd-lim-007", "limits", 1, "\\lim_{x\\to\\infty}\\frac{4x+1}{2x+7}", "2",
    ["rational-limit"],
    "分子分母同除 x，剩 4/2=2。", 25,
    ["看最高次項。", "同除以 x。", "4/2=2。"]);
  N("fd-lim-008", "limits", 1, "\\lim_{x\\to\\infty}\\frac{x^2+5x}{3x^2+1}", "1/3",
    ["rational-limit"],
    "同次多項式相除，極限是首項係數比 1/3。", 25,
    ["看最高次項。", "同除以 x²。", "首項係數比。"]);
  N("fd-lim-009", "limits", 1, "\\lim_{x\\to 0}\\frac{e^{5x}-1}{x}", "5",
    ["standard-limit"],
    "(e^u−1)/u→1，補係數得 5。", 30,
    ["標準極限 (e^u−1)/u→1。", "u=5x。", "極限是 5。"]);
  N("fd-lim-010", "limits", 1, "\\lim_{x\\to 0}\\frac{\\ln(1+4x)}{x}", "4",
    ["standard-limit", "log"],
    "log(1+u)/u→1，補係數得 4。", 30,
    ["標準極限 log(1+u)/u→1。", "u=4x。", "極限是 4。"]);
  N("fd-lim-011", "limits", 1, "\\lim_{x\\to 9}\\frac{\\sqrt{x}-3}{x-9}", "1/6",
    ["rationalize"],
    "分母寫成 (√x−3)(√x+3)，約分後代入得 1/6。", 40,
    ["分母是平方差。", "x−9=(√x−3)(√x+3)。", "約分後代 x=9。"]);
  N("fd-lim-012", "limits", 1, "\\lim_{x\\to 0}\\frac{\\sin(4x)}{\\sin(2x)}", "2",
    ["trig-limit"],
    "分子分母各自除以引數：(4x/2x)·(sin4x/4x)/(sin2x/2x) → 2。", 35,
    ["上下都湊 sin(u)/u。", "留下引數的比。", "4/2=2。"]);

  /* ── 微分 R1：入口 12 題 ─────────────────────────────────── */

  E("fd-der-001", "derivatives", 1, "\\frac{d}{dx}\\left(x^4+2x\\right)", "4*x^3+2",
    ["power-rule"],
    "逐項用冪次法則：4x³+2。", 25,
    ["逐項微分。", "冪次法則：xⁿ→n·xⁿ⁻¹。", "常數係數保留。"]);
  E("fd-der-002", "derivatives", 1, "\\frac{d}{dx}\\left(3x^2-5x+1\\right)", "6*x-5",
    ["power-rule"],
    "逐項微分：6x−5，常數消失。", 25,
    ["逐項微分。", "常數的導數是 0。", "6x−5。"]);
  E("fd-der-003", "derivatives", 1, "\\frac{d}{dx}\\cos(3x)", "-3*sin(3*x)",
    ["chain-rule", "trig"],
    "外層 cos→−sin，內層導數 3：−3sin(3x)。", 30,
    ["鏈鎖律。", "cos 的導數是 −sin。", "別忘了內層的 3。"]);
  E("fd-der-004", "derivatives", 1, "\\frac{d}{dx}e^{-x}", "-exp(-x)",
    ["chain-rule", "exponential"],
    "e^u 微分還是 e^u，乘上內層導數 −1。", 25,
    ["e^u 的導數是 e^u·u'。", "內層是 −x。", "u'=−1。"]);
  E("fd-der-005", "derivatives", 1, "\\frac{d}{dx}\\left(x\\ln x\\right)", "log(x)+1",
    ["product-rule", "log"],
    "乘積法則：1·log x + x·(1/x) = log x + 1。", 35,
    ["乘積法則。", "log x 的導數是 1/x。", "x·(1/x)=1。"]);
  E("fd-der-006", "derivatives", 1, "\\frac{d}{dx}\\left(x^2+1\\right)^4", "8*x*(x^2+1)^3",
    ["chain-rule", "power-rule"],
    "外層冪次 4(x²+1)³，內層導數 2x，相乘得 8x(x²+1)³。", 35,
    ["鏈鎖律。", "外層先微。", "內層導數是 2x。"]);
  N("fd-der-007", "derivatives", 1, "\\left.\\frac{d}{dx}\\left(x^2+3x\\right)\\right|_{x=1}", "5",
    ["basic-derivative", "power-rule"],
    "導函數 2x+3，代 x=1 得 5。", 25,
    ["先微分再代值。", "導函數是 2x+3。", "2+3=5。"]);
  N("fd-der-008", "derivatives", 1, "\\left.\\frac{d}{dx}\\cos x\\right|_{x=\\pi/2}", "-1",
    ["basic-derivative", "trig"],
    "cos 的導數是 −sin，−sin(π/2)=−1。", 25,
    ["cos 的導數是 −sin。", "代 x=π/2。", "sin(π/2)=1。"]);
  E("fd-der-009", "derivatives", 1, "\\frac{d}{dx}\\left(xe^x\\right)", "exp(x)*(x+1)",
    ["product-rule", "exponential"],
    "乘積法則：e^x + x e^x = (x+1)e^x。", 30,
    ["乘積法則。", "e^x 微分不變。", "提出 e^x。"]);
  N("fd-der-010", "derivatives", 1, "\\left.\\frac{d}{dx}\\frac{1}{x}\\right|_{x=2}", "-1/4",
    ["basic-derivative", "power-rule"],
    "1/x = x⁻¹，導數 −x⁻²，代 x=2 得 −1/4。", 30,
    ["寫成 x 的負一次方。", "冪次法則。", "−1/4。"]);
  E("fd-der-011", "derivatives", 1, "\\frac{d}{dx}\\sin(x^2)", "2*x*cos(x^2)",
    ["chain-rule", "trig"],
    "外層 sin→cos，內層導數 2x。", 30,
    ["鏈鎖律。", "外層先微。", "內層是 x²。"]);
  N("fd-der-012", "derivatives", 1, "f(x)=x^2+4x,\\quad f'(3)", "10",
    ["power-rule", "basic-derivative"],
    "f'(x)=2x+4，f'(3)=10。", 25,
    ["先求導函數。", "f'(x)=2x+4。", "代 x=3。"]);

  /* ── 積分 R1：入口 18 題 ─────────────────────────────────── */

  A("fd-int-001", "integrals", 1, "\\int 4x^3\\,dx", "x^4",
    ["basic-integral"],
    "冪次法則反過來：4·x⁴/4 = x⁴。", 25,
    ["冪次升一次再除。", "4/4=1。", "x⁴。"]);
  A("fd-int-002", "integrals", 1, "\\int (2x+1)\\,dx", "x^2+x",
    ["basic-integral"],
    "逐項積分：x²+x。", 25,
    ["逐項積分。", "2x→x²。", "1→x。"]);
  A("fd-int-003", "integrals", 1, "\\int \\sin(3x)\\,dx", "-cos(3*x)/3",
    ["basic-integral", "trig"],
    "sin 積成 −cos，內層 3 要除回來：−cos(3x)/3。", 30,
    ["sin 積成 −cos。", "內層係數除回來。", "−cos(3x)/3。"]);
  A("fd-int-004", "integrals", 1, "\\int e^{2x}\\,dx", "exp(2*x)/2",
    ["basic-integral", "exponential"],
    "e^{2x} 積分後除以內層係數 2。", 25,
    ["e^u 積分還是 e^u。", "內層係數除回來。", "除以 2。"]);
  N("fd-int-005", "integrals", 1, "\\int_0^1 (3x^2+1)\\,dx", "2",
    ["basic-integral", "definite-integral"],
    "反導數 x³+x，代上下限得 1+1=2。", 30,
    ["先積分再代上下限。", "反導數是 x³+x。", "1+1=2。"]);
  N("fd-int-006", "integrals", 1, "\\int_0^2 x^3\\,dx", "4",
    ["basic-integral", "definite-integral"],
    "反導數 x⁴/4，代入得 16/4=4。", 25,
    ["冪次升一次除四。", "代上限 2。", "16/4=4。"]);
  N("fd-int-007", "integrals", 1, "\\int_0^{\\pi/6}\\cos x\\,dx", "1/2",
    ["basic-integral", "trig", "definite-integral"],
    "反導數 sin x，sin(π/6)−sin 0 = 1/2。", 25,
    ["cos 積成 sin。", "代上下限。", "想 30° 的正弦值。"]);
  N("fd-int-008", "integrals", 1, "\\int_2^4 \\frac{1}{x}\\,dx", "log(2)",
    ["basic-integral", "log", "definite-integral"],
    "反導數 log x，log 4 − log 2 = log 2。", 30,
    ["1/x 積成 log。", "log 4−log 2。", "= log 2。"]);
  A("fd-int-009", "integrals", 1, "\\int \\frac{1}{\\cos^2 x}\\,dx", "tan(x)",
    ["basic-integral", "trig"],
    "1/cos²x = sec²x，反導數是 tan x。", 30,
    ["認出 sec² 的形。", "tan 的導數是 sec²。", "答案 tan x。"]);
  A("fd-int-010", "integrals", 1, "\\int \\frac{3}{1+x^2}\\,dx", "3*atan(x)",
    ["basic-integral", "inverse-trig"],
    "1/(1+x²) 的反導數是 arctan x，係數 3 保留。", 30,
    ["標準形：arctan。", "係數提出去。", "3·arctan x。"]);
  N("fd-int-011", "integrals", 1, "\\int_0^1 (1-x)^2\\,dx", "1/3",
    ["basic-integral", "definite-integral"],
    "令 u=1−x 或直接展開，結果 1/3。", 35,
    ["可以直接展開。", "或令 u=1−x。", "換元後就是 ∫u² 的形。"]);
  N("fd-int-012", "integrals", 1, "\\int_1^2 (2x+3)\\,dx", "6",
    ["basic-integral", "definite-integral"],
    "反導數 x²+3x，(4+6)−(1+3)=6。", 30,
    ["逐項積分。", "反導數 x²+3x。", "10−4=6。"]);
  A("fd-int-013", "integrals", 1, "\\int x\\sqrt{x}\\,dx", "2*x^(5/2)/5",
    ["basic-integral"],
    "x·√x = x^{3/2}，升冪除以 5/2 得 (2/5)x^{5/2}。", 35,
    ["先合併成一個冪次。", "x^{3/2}。", "升冪到 5/2 再除。"]);
  N("fd-int-014", "integrals", 1, "\\int_0^1 5x^4\\,dx", "1",
    ["basic-integral", "definite-integral"],
    "反導數 x⁵，代入得 1。", 20,
    ["5x⁴ 積成 x⁵。", "代上限 1。", "1−0=1。"]);
  A("fd-int-015", "integrals", 1, "\\int \\cos(2x)\\,dx", "sin(2*x)/2",
    ["basic-integral", "trig"],
    "cos 積成 sin，內層 2 除回來。", 25,
    ["cos 積成 sin。", "內層係數除回來。", "sin(2x)/2。"]);
  N("fd-int-016", "integrals", 1, "\\int_0^{\\pi}\\cos x\\,dx", "0",
    ["basic-integral", "trig", "definite-integral"],
    "sin π − sin 0 = 0。", 25,
    ["cos 積成 sin。", "sin π=0。", "0−0=0。"]);
  A("fd-int-017", "integrals", 1, "\\int \\frac{1}{x^2}\\,dx", "-1/x",
    ["basic-integral"],
    "x⁻² 升冪成 x⁻¹ 除以 −1：−1/x。", 25,
    ["寫成 x 的負二次方。", "升冪除以新指數。", "−1/x。"]);
  N("fd-int-018", "integrals", 1, "\\int_0^1 (e^x-1)\\,dx", "exp(1)-2",
    ["basic-integral", "exponential", "definite-integral"],
    "反導數 e^x − x，代入得 (e−1)−(1−0)=e−2。", 35,
    ["逐項積分。", "反導數是 e^x−x。", "e−1−1=e−2。"]);

  /* ── 級數 R1：入口 18 題 ─────────────────────────────────── */

  N("fd-ser-001", "series", 1, "\\sum_{n=0}^{\\infty}\\left(\\frac{1}{4}\\right)^n", "4/3",
    ["geometric-series"],
    "幾何級數 1/(1−r)，r=1/4 得 4/3。", 25,
    ["幾何級數。", "公式 1/(1−r)。", "分母是 3/4。"]);
  N("fd-ser-002", "series", 1, "\\sum_{n=0}^{\\infty}\\left(\\frac{1}{5}\\right)^n", "5/4",
    ["geometric-series"],
    "r=1/5，和是 1/(1−1/5)=5/4。", 25,
    ["幾何級數。", "r=1/5。", "分母是 4/5。"]);
  N("fd-ser-003", "series", 1, "\\sum_{n=1}^{\\infty}\\left(\\frac{1}{2}\\right)^n", "1",
    ["geometric-series"],
    "從 n=1 起：首項 1/2 除以 (1−1/2) 得 1。", 25,
    ["注意從 n=1 開始。", "首項/(1−r)。", "(1/2)/(1/2)=1。"]);
  N("fd-ser-004", "series", 1, "\\sum_{n=0}^{\\infty}\\left(\\frac{2}{3}\\right)^n", "3",
    ["geometric-series"],
    "r=2/3，和是 1/(1/3)=3。", 25,
    ["幾何級數。", "r=2/3。", "1/(1/3)=3。"]);
  N("fd-ser-005", "series", 1, "\\sum_{n=0}^{\\infty}\\frac{7}{10^n}", "70/9",
    ["geometric-series"],
    "7·1/(1−1/10)=70/9。", 30,
    ["係數 7 提出去。", "r=1/10。", "7·10/9。"]);
  N("fd-ser-006", "series", 1, "\\sum_{n=1}^{\\infty}\\frac{5}{2^n}", "5",
    ["geometric-series"],
    "5·[(1/2)/(1/2)]=5。", 25,
    ["先算 Σ(1/2)ⁿ。", "從 n=1 起是 1。", "乘上 5。"]);
  N("fd-ser-007", "series", 1, "\\sum_{n=0}^{\\infty}\\left(-\\frac{1}{2}\\right)^n", "2/3",
    ["geometric-series", "alternating"],
    "r=−1/2，和是 1/(1+1/2)=2/3。", 30,
    ["r 可以是負的。", "1/(1−(−1/2))。", "分母是 3/2。"]);
  N("fd-ser-008", "series", 1, "\\sum_{n=1}^{\\infty}\\frac{3}{4^n}", "1",
    ["geometric-series"],
    "3·[(1/4)/(3/4)]=1。", 30,
    ["首項是 3/4。", "首項/(1−r)。", "(3/4)/(3/4)=1。"]);
  N("fd-ser-009", "series", 1, "\\sum_{n=0}^{4}2^n", "31",
    ["geometric-series"],
    "有限幾何和 2⁵−1=31。", 30,
    ["有限幾何和。", "公式 (r⁵−1)/(r−1)。", "32−1=31。"]);
  N("fd-ser-010", "series", 1, "\\sum_{n=1}^{10}n", "55",
    ["telescoping"],
    "等差和 10·11/2=55。", 25,
    ["等差級數。", "n(n+1)/2。", "55。"]);
  T("fd-ser-011", "series", 1, "\\sum_{n=1}^{\\infty}\\left(\\frac{9}{10}\\right)^n",
    ["收斂", "converges", "convergent"], "收斂",
    ["geometric-series", "convergence-test"],
    "幾何級數 |r|=9/10<1，收斂。", 25,
    ["幾何級數看 |r|。", "9/10<1。", "收斂。"]);
  T("fd-ser-012", "series", 1, "\\sum_{n=1}^{\\infty}\\left(\\frac{3}{2}\\right)^n",
    ["發散", "diverges", "divergent"], "發散",
    ["geometric-series", "convergence-test"],
    "|r|=3/2>1，項不趨近 0，發散。", 25,
    ["幾何級數看 |r|。", "3/2>1。", "發散。"]);
  T("fd-ser-013", "series", 1, "\\sum_{n=1}^{\\infty}\\frac{1}{n^3}",
    ["收斂", "converges", "convergent"], "收斂",
    ["p-series", "convergence-test"],
    "p 級數 p=3>1，收斂。", 25,
    ["p 級數。", "p=3。", "p>1 收斂。"]);
  T("fd-ser-014", "series", 1, "\\sum_{n=1}^{\\infty}\\frac{n}{n+1}",
    ["發散", "diverges", "divergent"], "發散",
    ["convergence-test"],
    "一般項趨近 1 不是 0，發散。", 25,
    ["先看一般項。", "n/(n+1)→1。", "項不歸零就發散。"]);
  T("fd-ser-015", "series", 1, "\\sum_{n=1}^{\\infty}\\frac{2^n}{3^n}",
    ["收斂", "converges", "convergent"], "收斂",
    ["geometric-series", "convergence-test"],
    "就是 (2/3)ⁿ 的幾何級數，收斂。", 25,
    ["改寫成 (2/3)ⁿ。", "|r|<1。", "收斂。"]);
  N("fd-ser-016", "series", 1, "\\sum_{n=0}^{\\infty}\\frac{4}{7^n}", "14/3",
    ["geometric-series"],
    "4·1/(1−1/7)=4·7/6=14/3。", 30,
    ["係數提出去。", "r=1/7。", "4·7/6。"]);
  N("fd-ser-017", "series", 1, "\\sum_{n=2}^{\\infty}\\left(\\frac{1}{3}\\right)^n", "1/6",
    ["geometric-series"],
    "首項 1/9 除以 2/3 得 1/6。", 35,
    ["注意從 n=2 開始。", "首項是 1/9。", "(1/9)/(2/3)。"]);
  N("fd-ser-018", "series", 1, "\\sum_{n=1}^{6}(2n-1)", "36",
    ["telescoping"],
    "前六個奇數的和是 6²=36。", 30,
    ["奇數和。", "前 k 個奇數和是 k²。", "36。"]);

  /* ── 級數縱深 R2–R6：24 題 ────────────────────────────────── */

  N("fd-serx-201", "series", 2, "\\sum_{n=1}^{\\infty}\\frac{1}{n(n+3)}", "11/18",
    ["telescoping"],
    "部分分式 (1/3)(1/n−1/(n+3))，錯位相消剩 (1/3)(1+1/2+1/3)=11/18。", 80,
    ["部分分式。", "1/n−1/(n+3) 乘 1/3。", "留下前三項。"]);
  N("fd-serx-202", "series", 2, "\\sum_{n=1}^{\\infty}\\frac{1}{(2n+1)(2n+3)}", "1/6",
    ["telescoping"],
    "(1/2)(1/(2n+1)−1/(2n+3))，錯位相消剩 (1/2)(1/3)=1/6。", 75,
    ["部分分式。", "差乘 1/2。", "只剩 1/3 的一半。"]);
  N("fd-serx-203", "series", 2, "\\text{Radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{x^n}{2^n}", "2",
    ["power-series", "ratio-test"],
    "比值判別 |x|/2<1，半徑 2。", 45,
    ["比值判別。", "|x/2|<1。", "R=2。"]);
  N("fd-serx-204", "series", 2, "\\sum_{n=1}^{\\infty}\\frac{n}{5^n}", "5/16",
    ["power-series"],
    "Σn xⁿ = x/(1−x)²，x=1/5 得 (1/5)/(16/25)=5/16。", 70,
    ["先背 Σn xⁿ 的閉式。", "x/(1−x)²。", "代 x=1/5。"]);
  T("fd-serx-205", "series", 2, "\\sum_{n=1}^{\\infty}\\frac{1}{n^{3/2}}",
    ["收斂", "converges", "convergent"], "收斂",
    ["p-series", "convergence-test"],
    "p=3/2>1，收斂。", 30,
    ["p 級數。", "p=3/2。", "p>1 收斂。"]);
  T("fd-serx-206", "series", 2, "\\sum_{n=1}^{\\infty}\\frac{n^2}{n^2+1}",
    ["發散", "diverges", "divergent"], "發散",
    ["convergence-test"],
    "一般項趨近 1≠0，發散。", 30,
    ["先看一般項。", "極限是 1。", "不歸零就發散。"]);
  N("fd-serx-207", "series", 2, "\\sum_{n=1}^{\\infty}\\frac{2^n+3^n}{6^n}", "3/2",
    ["geometric-series"],
    "拆成 (1/3)ⁿ+(1/2)ⁿ 兩條幾何：1/2+1=3/2。", 60,
    ["拆成兩條幾何。", "2/6=1/3、3/6=1/2。", "1/2+1。"]);
  T("fd-serx-208", "series", 2, "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{\\sqrt{n}}",
    ["條件收斂", "conditionally convergent", "conditional"], "條件收斂",
    ["alternating", "convergence-test"],
    "交錯級數收斂，但取絕對值後是發散的 p=1/2 級數 → 條件收斂。", 60,
    ["交錯級數判別。", "|項| 遞減趨零 → 收斂。", "絕對值級數 p=1/2 發散。"]);

  N("fd-serx-301", "series", 3, "\\sum_{n=1}^{\\infty}\\frac{n^2}{5^n}", "15/32",
    ["power-series"],
    "Σn²xⁿ = x(1+x)/(1−x)³，代 x=1/5 得 (6/25)(125/64)=15/32。", 100,
    ["Σn²xⁿ 的閉式。", "x(1+x)/(1−x)³。", "代 x=1/5。"]);
  N("fd-serx-302", "series", 3, "\\sum_{n=2}^{\\infty}\\frac{1}{n^2-1}", "3/4",
    ["telescoping"],
    "(1/2)(1/(n−1)−1/(n+1))，錯位相消剩 (1/2)(1+1/2)=3/4。", 90,
    ["因式分解 n²−1。", "部分分式乘 1/2。", "留下前兩項。"]);
  N("fd-serx-303", "series", 3, "\\text{Radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{x^n}{n\\,4^n}", "4",
    ["power-series", "ratio-test"],
    "幾何部分 4ⁿ 決定半徑，R=4。", 60,
    ["比值判別。", "1/n 不影響半徑。", "R=4。"]);
  N("fd-serx-304", "series", 3, "\\text{Radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{(-1)^n x^n}{n\\,5^n}", "5",
    ["power-series", "ratio-test"],
    "符號與 1/n 都不影響半徑，5ⁿ 給出 R=5。", 60,
    ["比值判別。", "看幾何部分。", "R=5。"]);
  T("fd-serx-305", "series", 3, "\\sum_{n=1}^{\\infty}\\frac{n!}{10^n}",
    ["發散", "diverges", "divergent"], "發散",
    ["ratio-test", "convergence-test"],
    "比值 (n+1)/10 → ∞ > 1，階乘吃掉任何幾何，發散。", 70,
    ["比值判別。", "比值是 (n+1)/10。", "趨近無窮大。"]);
  N("fd-serx-306", "series", 3, "\\sum_{n=1}^{\\infty}\\frac{\\sqrt{n+1}-\\sqrt{n}}{\\sqrt{n(n+1)}}", "1",
    ["telescoping", "rationalize"],
    "通項 = 1/√n − 1/√(n+1)，錯位相消剩 1。", 100,
    ["把分子分母拆開。", "1/√n−1/√(n+1)。", "只剩 1/√1。"]);

  N("fd-serx-401", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{2n+1}{n^2(n+1)^2}", "1",
    ["telescoping"],
    "通項就是 1/n² − 1/(n+1)²，錯位相消剩 1。", 130,
    ["分子是分母兩因子的差。", "1/n²−1/(n+1)²。", "望遠鏡和。"]);
  N("fd-serx-402", "series", 4, "\\sum_{n=0}^{\\infty}\\frac{n+1}{2^n}", "4",
    ["power-series"],
    "Σ(n+1)xⁿ = 1/(1−x)²，x=1/2 得 4。", 80,
    ["就是 1/(1−x)² 的級數。", "代 x=1/2。", "1/(1/4)=4。"]);
  N("fd-serx-403", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{2n+1}{3^n}", "2",
    ["power-series"],
    "拆成 2Σn/3ⁿ+Σ1/3ⁿ = 2·(3/4)+1/2 = 2。", 90,
    ["拆成兩條。", "Σn/3ⁿ=3/4。", "Σ1/3ⁿ=1/2。"]);
  N("fd-serx-404", "series", 4, "\\text{Radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{(2n)!}{(n!)^2\\,4^n}x^n", "1",
    ["power-series", "ratio-test"],
    "中央二項係數 ~ 4ⁿ/√(πn)，除以 4ⁿ 後係數 ~ 1/√(πn)，半徑 1。", 120,
    ["比值判別。", "(2n)!/(n!)² 的比值趨近 4。", "4/4=1 → R=1。"]);
  N("fd-serx-405", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}n^2}{2^n}", "2/27",
    ["power-series", "alternating"],
    "Σn²xⁿ = x(1+x)/(1−x)³，代 x=−1/2 再變號：得 2/27。", 130,
    ["x(1+x)/(1−x)³ 可以代負值。", "x=−1/2。", "注意 (−1)^{n+1} 的符號。"]);
  N("fd-serx-406", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{1}{n(n+1)2^n}", "1-log(2)",
    ["power-series", "telescoping"],
    "1/(n(n+1))=1/n−1/(n+1)：Σxⁿ/n = −log(1−x)，Σxⁿ/(n+1) 是它除以 x 再修正，代 x=1/2 得 1−log 2。", 170,
    ["先部分分式。", "兩條都是 log 級數。", "小心 1/(n+1) 那條的位移。"]);

  N("fd-serx-501", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{n+2}{n(n+1)2^n}", "1",
    ["power-series", "telescoping"],
    "(n+2)/(n(n+1)) = 2/n − 1/(n+1)：兩條 log 級數在 x=1/2 相減，恰好是 1。", 240,
    ["先部分分式。", "2/n−1/(n+1)。", "Σxⁿ/n=−log(1−x)，位移那條要小心。"]);
  N("fd-serx-502", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{n^3}{4^n}", "44/27",
    ["power-series"],
    "Σn³xⁿ = x(1+4x+x²)/(1−x)⁴，代 x=1/4 得 44/27。", 210,
    ["對幾何級數微分三次。", "x(1+4x+x²)/(1−x)⁴。", "代 x=1/4。"]);
  N("fd-serx-503", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{n}{(n+1)(n+2)(n+3)}", "1/4",
    ["telescoping"],
    "把 n 寫成 (n+3)−3：拆成 Σ1/((n+1)(n+2)) − 3Σ1/((n+1)(n+2)(n+3)) = 1/2 − 3/12 = 1/4。", 240,
    ["分子先湊分母的因子。", "n=(n+3)−3。", "兩條各自望遠鏡。"]);
  N("fd-serx-504", "series", 5, "\\sum_{n=0}^{\\infty}\\frac{(-1)^n}{(2n+1)3^n}", "sqrt(3)*pi/6",
    ["power-series", "inverse-trig", "alternating"],
    "arctan 級數在 x=1/√3：√3·arctan(1/√3)=√3π/6。", 240,
    ["對照 arctan 的級數。", "x=1/√3。", "arctan(1/√3)=π/6。"]);
  N("fd-serx-505", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{n^4}{n!}", "15*exp(1)",
    ["taylor"],
    "n⁴ 拆成下降階乘（Stirling 數 1,7,6,1）：(1+7+6+1)e = 15e，即 Bell 型和 B₄·e。", 260,
    ["把 n⁴ 拆成下降階乘。", "係數是第二類 Stirling 數 1,7,6,1。", "每條都是 e。"]);

  N("fd-serx-601", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{1}{n^8}", "pi^8/9450",
    ["p-series"],
    "ζ(8)=π⁸/9450（Euler 的偶數 zeta 值）。", 240,
    ["偶數 zeta 值有閉式。", "ζ(8)。", "π⁸/9450。"]);
  N("fd-serx-602", "series", 6, "\\sum_{n=0}^{\\infty}\\frac{1}{(3n+1)(3n+2)}", "pi/(3*sqrt(3))",
    ["telescoping", "power-series"],
    "部分分式後是 ∫₀¹(1−x)/(1−x³)dx 型，積出 π/(3√3)。", 300,
    ["部分分式後寫成積分。", "Σ(x^{3n+1}−x^{3n+2}) 逐項積分。", "得 π/(3√3)。"]);
  N("fd-serx-603", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{1}{n(n+1)3^n}", "1-2*log(3/2)",
    ["power-series", "telescoping"],
    "部分分式 + log 級數：log(3/2) 與 3log(3/2)−1 相減得 1−2log(3/2)。", 280,
    ["先部分分式。", "Σxⁿ/n=−log(1−x)。", "1/(n+1) 那條要位移。"]);
  N("fd-serx-604", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{n+1}{n!}", "2*exp(1)-1",
    ["taylor"],
    "拆成 Σn/n! + Σ1/n! = e + (e−1) = 2e−1。", 210,
    ["拆成兩條。", "Σn/n!=e。", "Σ1/n!（n≥1）=e−1。"]);
  N("fd-serx-605", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{n^2+n+1}{n!}", "4*exp(1)-1",
    ["taylor"],
    "拆成 Σn²/n!+Σn/n!+Σ1/n! = 2e+e+(e−1) = 4e−1。", 240,
    ["逐項拆開。", "Σn²/n!=2e、Σn/n!=e。", "Σ1/n!（n≥1）=e−1。"]);

  /* ── 高階縱深（2026-09-04 二波）：limits R5/R6 與 series R5/R6 ──
     第一波之後的殘留失衡：limits R6 只有 11 題、series R6 只有 10 題。
     高段使用者在這兩條線上最快見底 —— 而難題正是最不能「安靜算錯」的
     地方，所以每一題仍然只出驗算器吃得下的形式。 */

  N("fd-limx-601", "limits", 6, "\\lim_{x\\to 0}\\frac{\\sin(\\tan x)-\\tan(\\sin x)}{x^7}", "-1/30",
    ["taylor-limit"],
    "兩個複合函數的展開到 x⁷ 才分出勝負：sin(tan x)−tan(sin x) = −x⁷/30 + O(x⁹)。", 420,
    ["前六階完全相消。", "兩邊都展開到第七階。", "係數差是 −1/30。"]);
  N("fd-limx-602", "limits", 6, "\\lim_{x\\to 0}\\frac{\\sin x\\arctan x-x^2}{x^4}", "-1/2",
    ["taylor-limit", "inverse-trig"],
    "sin x·arctan x = (x−x³/6+…)(x−x³/3+…) = x²−x⁴/2+…，分子的 x⁴ 係數是 −1/2。", 390,
    ["兩個因子各展到三階。", "交叉相乘收集 x⁴。", "−1/6−1/3。"]);
  N("fd-limx-603", "limits", 6, "\\lim_{x\\to 0}\\left(\\frac{\\tan x}{x}\\right)^{1/x^2}", "exp(1/3)",
    ["taylor-limit", "exponential"],
    "取對數：ln(tan x/x)/x² → 1/3（tan x/x = 1+x²/3+…），極限是 e^{1/3}。", 300,
    ["1^∞ 型先取對數。", "tan x/x = 1+x²/3+O(x⁴)。", "ln(1+u)≈u。"]);
  N("fd-limx-604", "limits", 6, "\\lim_{n\\to\\infty}\\left(\\frac{(1+\\frac{1}{n})^n}{e}\\right)^n", "exp(-1/2)",
    ["exponential", "sequences"],
    "(1+1/n)^n = e·exp(−1/(2n)+O(1/n²))，括號內是 exp(−1/(2n)+…)，n 次方後趨向 e^{-1/2}。", 330,
    ["先看括號裡差 e 多少。", "(1+1/n)^n/e = exp(−1/2n+…)。", "再乘上 n 次方。"]);
  N("fd-limx-605", "limits", 5, "\\lim_{x\\to\\infty}x\\left(\\frac{\\pi}{4}-\\arctan\\frac{x}{x+1}\\right)", "1/2",
    ["inverse-trig", "taylor-limit"],
    "arctan 差角：π/4−arctan(x/(x+1)) = arctan(1/(2x+1))，乘 x 後趨向 1/2。", 240,
    ["用 arctan 的差角公式。", "arctan 1 − arctan(x/(x+1))。", "arctan u ≈ u。"]);
  N("fd-limx-606", "limits", 5, "\\lim_{x\\to 0}\\frac{e^{\\tan x}-e^{x}}{\\tan x-x}", "1",
    ["exponential", "taylor-limit"],
    "提出 e^x：(e^{tan x−x}−1)/(tan x−x) → 1（(e^u−1)/u→1）。", 210,
    ["提出 e^x。", "分子變成 e^{tan x−x}−1。", "標準極限 (e^u−1)/u。"]);
  N("fd-limx-607", "limits", 5, "\\lim_{x\\to 0}\\left(\\frac{1}{x^2}-\\frac{1}{\\sin^2 x}\\right)", "-1/3",
    ["taylor-limit", "trig"],
    "通分後 (sin²x−x²)/(x²sin²x)：分子 = −x⁴/3+…、分母 = x⁴+…，極限 −1/3。", 240,
    ["先通分。", "sin²x = x²−x⁴/3+…。", "分母當 x⁴ 用。"]);
  N("fd-limx-608", "limits", 5, "\\lim_{x\\to 0}\\frac{\\ln(\\cos 2x)}{\\ln(\\cos 3x)}", "4/9",
    ["log", "taylor-limit"],
    "log(cos kx) ≈ −k²x²/2，比值是 4/9。", 180,
    ["cos kx ≈ 1−k²x²/2。", "log(1+u)≈u。", "答案是兩個平方的比。"]);

  N("fd-serb-601", "series", 5, "\\sum_{n=0}^{\\infty}\\frac{(-1)^n}{3n+1}", "(log(2)+pi/sqrt(3))/3",
    ["alternating", "power-series"],
    "Σ(−1)ⁿx^{3n} 逐項積分 = ∫₀¹dx/(1+x³) = (ln 2 + π/√3)/3。", 300,
    ["寫成 ∫₀¹ x^{3n} 的和。", "幾何級數求和成 1/(1+x³)。", "部分分式積分。"]);
  N("fd-serb-602", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n(n+2)}", "1/4",
    ["alternating", "telescoping"],
    "部分分式 ½(1/n−1/(n+2))：兩條交錯級數只差前兩項，log 全部相消，剩 1/4。", 270,
    ["先部分分式。", "位移兩格的交錯級數幾乎相同。", "log 會完全相消。"]);
  N("fd-serb-603", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{n}{(2n+1)!}", "1/(2*exp(1))",
    ["taylor"],
    "n/(2n+1)! = ½(1/(2n)!−1/(2n+1)!)，兩條分別是 cosh 1−1 與 sinh 1−1：差的一半是 e⁻¹/2。", 300,
    ["把 n 寫成 ((2n+1)−1)/2。", "拆成 1/(2n)! 與 1/(2n+1)!。", "cosh 1 − sinh 1 = e⁻¹。"]);
  N("fd-serb-604", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}n^2}{n!}", "0",
    ["taylor", "alternating"],
    "Σn²xⁿ/n! = (x²+x)eˣ，在 x=−1 恰好是 0。", 270,
    ["n² 拆成 n(n−1)+n。", "Σn²xⁿ/n! = (x²+x)eˣ。", "代 x=−1。"]);
  N("fd-serb-605", "series", 5, "\\sum_{n=0}^{\\infty}\\frac{1}{(2n+1)4^n}", "log(3)",
    ["power-series", "log"],
    "Σx^{2n+1}/(2n+1) = artanh x，取 x=1/2 再乘 2：2·artanh(1/2) = ln 3。", 270,
    ["對照 artanh 的級數。", "x=1/2。", "artanh x = ½ln((1+x)/(1−x))。"]);
  N("fd-serb-606", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{n}{4n^4+1}", "1/4",
    ["telescoping"],
    "4n⁴+1 = (2n²−2n+1)(2n²+2n+1)（Sophie Germain），通項 = ¼(1/(2n²−2n+1)−1/(2n²+2n+1)) 望遠鏡到 1/4。", 330,
    ["Sophie Germain 恆等式。", "相鄰項的因子會接龍。", "望遠鏡只留最前面那一項。"]);
  N("fd-serb-607", "series", 5, "\\text{Radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{(2n)!}{n!\\,n^n}x^n", "exp(1)/4",
    ["power-series", "ratio-test"],
    "係數比 = (2n+2)(2n+1)/(n+1)² · (n/(n+1))ⁿ → 4/e，半徑是倒數 e/4。", 300,
    ["比值判別。", "(2n)! 的部分給 4、n^n 的部分給 1/e。", "半徑取倒數。"]);
  N("fd-serb-608", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n\\,3^n}", "log(4/3)",
    ["power-series", "alternating", "log"],
    "−log(1−x) 的級數在 x=−1/3 變號：Σ(−1)^{n+1}xⁿ/n = log(1+x)，代 x=1/3 得 log(4/3)。", 240,
    ["對照 log(1+x) 的級數。", "x=1/3。", "1+x 是 4/3。"]);

  /* ── 真 R6（2026-09-04 三波）：rank 複核把幾題「配額 R6」降回誠實等級
     之後，R6 的洞用真正 R6 難度的題補 —— Euler 和、母函數操作、
     複數幾何級數、Stirling 常數。每一題仍然可獨立驗算。 */

  N("fd-serc-601", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}H_n}{n}", "pi^2/12-log(2)^2/2",
    ["alternating", "power-series"],
    "交錯 Euler 和：Σ H_n xⁿ = −log(1−x)/(1−x) 積分後代 x=−1，得 π²/12 − (log 2)²/2。", 420,
    ["H_n 的母函數是 −log(1−x)/(1−x)。", "除以 n 等於積分。", "代 x=−1 要用 dilog 的特殊值。"]);
  N("fd-serc-602", "series", 6, "H_n=\\sum_{k=1}^n\\frac1k.\\ \\text{Find }\\sum_{n=1}^{\\infty}\\frac{H_n}{(n+1)2^n}", "log(2)^2",
    ["power-series"],
    "Σ H_n x^{n+1}/(n+1) = log²(1−x)/2（母函數積分），代 x=1/2 再乘 2 得 log²2。", 420,
    ["對 H_n 的母函數積分。", "得 log²(1−x)/2。", "x=1/2，注意位移一格。"]);
  N("fd-serc-603", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{\\sin n}{n}", "(pi-1)/2",
    ["convergence-test"],
    "鋸齒波的 Fourier 級數：Σ sin(nθ)/n = (π−θ)/2 在 0<θ<2π，代 θ=1 得 (π−1)/2。", 420,
    ["這是某個週期函數的 Fourier 級數。", "Σ sin(nθ)/n = (π−θ)/2。", "θ=1。"]);
  N("fd-serc-604", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{\\cos n}{2^n}", "(2*cos(1)-1)/(5-4*cos(1))",
    ["geometric-series"],
    "看成 Re Σ(e^i/2)ⁿ 的複數幾何級數：Re(z/(1−z))，z=e^i/2，化簡得 (2cos1−1)/(5−4cos1)。", 390,
    ["cos n 是 e^{in} 的實部。", "複數幾何級數 z/(1−z)。", "分母乘共軛化實。"]);
  N("fd-limx-609", "limits", 6, "\\lim_{n\\to\\infty}\\frac{n!\\,e^n}{n^{n+1/2}}", "sqrt(2*pi)",
    ["sequences", "taylor-limit"],
    "Stirling 公式的常數：n! ~ √(2πn)(n/e)ⁿ，比值收斂到 √(2π)。", 420,
    ["這就是 Stirling 公式的常數項。", "取對數比對 log n! 的展開。", "√(2π)。"]);
  N("fd-limx-610", "limits", 6, "\\lim_{x\\to 0}\\frac{\\tan(\\sin x)-\\sin(\\tan x)}{\\arctan(\\arcsin x)-\\arcsin(\\arctan x)}", "1",
    ["taylor-limit", "inverse-trig"],
    "兩個差都是 x⁷/30 級而且**同號**（反三角那對正是正三角那對的反函數，第七階係數同向），比值是 1。第一版憑感覺寫 −1，被獨立驗算抓下來 —— 這題的陷阱就是符號。", 480,
    ["上下都要展到第七階。", "tan∘sin − sin∘tan = x⁷/30 + …。", "反函數對的第七階係數同號 —— 別憑直覺給負號。"]);

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

(function () {
  "use strict";
  // 課程缺口補題（0A–0C 預備：函數、函數操作、基本函數家族）：代值、定義域值域、分段、奇偶與正負、
  // 加減乘除與合成、反函數、因式定理、洞與漸近線、指數對數、單位圓、恆等式、反三角 —— 全部 R1–R2 入口題。
  const SOURCE = "Buzz course gap fill";
  // [u ≥ 0] 的指示函數（u = 0 時取 1）：分段函數的驗算用它把定義原樣寫成一條式子，
  // 由引擎代值時自己挑段 —— 不重用作者「x 落在哪一段」的判斷。
  const STEP = (u) => `\\frac{2+\\sgn(${u})-|\\sgn(${u})|}{2}`;
  const at = (expr, value) => expr.replace(/x/g, `(${value})`);
  const PW1 = `(x^2+1)\\left(1-${STEP("x-2")}\\right)+(5-x)${STEP("x-2")}`;
  const PW2 = `(2x+5)${STEP("-1-x")}+x^2\\left(1-${STEP("-1-x")}-${STEP("x-2")}\\right)+6${STEP("x-2")}`;
  const PW3 = `x^2\\left(1-${STEP("x-1")}\\right)+(2x+1)${STEP("x-1")}`;
  const PW4 = `(1-x)\\left(1-${STEP("x")}\\right)+(x^2-2x)${STEP("x")}`;
  const val = (f) => ({ m: "value", f });

  const problems = [
    /* ── 0A 函數是什麼 ── */
    { id: "cg-0a-001", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "f(x)=x^2-3x+1\\text{，求 }f(-2)",
      answer: "11", timeLimit: 40,
      tags: ["function-evaluate", "polynomial"],
      hints: ["把式子裡每一個 x 都換成 (−2)，括號要留著。", "(−2)² 是正的，−3·(−2) 也是正的。"],
      solution: "f(−2) = (−2)² − 3·(−2) + 1 = 4 + 6 + 1 = 11。",
      solutionSteps: ["每個 x 換成 (−2)：f(−2) = (−2)² − 3·(−2) + 1。", "= 4 + 6 + 1 = 11。"],
      verify: val("(-2)^2-3\\cdot(-2)+1") },
    { id: "cg-0a-002", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "g(t)=\\frac{2t+1}{t-3}\\text{，求 }g(-1)",
      answer: "1/4", timeLimit: 45,
      tags: ["function-evaluate", "rational-function"],
      hints: ["函數用 t 當變數也一樣：把 t 換成 (−1)。", "分子、分母各自先算完，再相除。"],
      solution: "g(−1) = (2·(−1) + 1)/((−1) − 3) = (−1)/(−4) = 1/4。",
      solutionSteps: ["分子：2·(−1) + 1 = −1。", "分母：(−1) − 3 = −4。", "g(−1) = (−1)/(−4) = 1/4。"],
      verify: val("\\frac{2(-1)+1}{(-1)-3}") },
    { id: "cg-0a-003", topic: "limits", rank: 1, answerKind: "expression", variable: "a",
      prompt: "f(x)=x^2+2x\\text{，求 }f(a+1)\\text{（以 }a\\text{ 表示並展開）}",
      answer: "a^2+4*a+3", timeLimit: 60,
      tags: ["function-evaluate-expression", "polynomial"],
      hints: ["把 x 整個換成 (a + 1)，連括號一起代。", "(a + 1)² 要展開成三項，不是 a² + 1。"],
      solution: "f(a+1) = (a+1)² + 2(a+1) = a² + 2a + 1 + 2a + 2 = a² + 4a + 3。",
      solutionSteps: ["代入：f(a+1) = (a+1)² + 2(a+1)。", "展開：a² + 2a + 1 + 2a + 2。", "合併：a² + 4a + 3。"],
      verify: { m: "fn", vars: ["a"], cases: [
        { at: { a: 0 }, v: val("(0+1)^2+2(0+1)") },
        { at: { a: 2 }, v: val("(2+1)^2+2(2+1)") },
        { at: { a: -3 }, v: val("(-3+1)^2+2(-3+1)") },
        { at: { a: 0.7 }, v: val("(0.7+1)^2+2(0.7+1)") }] } },
    { id: "cg-0a-004", topic: "limits", rank: 2, answerKind: "expression", variables: ["x", "h"],
      prompt: "f(x)=x^2-5x\\text{，化簡 }\\frac{f(x+h)-f(x)}{h}\\ (h\\ne 0)",
      answer: "2*x+h-5", timeLimit: 90,
      tags: ["function-evaluate-expression", "difference-quotient"],
      hints: ["先寫出 f(x + h)：把 x 換成 (x + h)，展開。", "減掉 f(x) 之後，每一項都有 h，才能和分母約掉。"],
      solution: "f(x+h) = x² + 2xh + h² − 5x − 5h。減 f(x) 得 2xh + h² − 5h = h(2x + h − 5)，除以 h 得 2x + h − 5。",
      solutionSteps: ["f(x+h) = (x+h)² − 5(x+h) = x² + 2xh + h² − 5x − 5h。", "f(x+h) − f(x) = 2xh + h² − 5h = h(2x + h − 5)。", "除以 h（h ≠ 0）：2x + h − 5。"],
      verify: { m: "fn", vars: ["x", "h"], cases: [
        { at: { x: 1.5, h: 0.2 }, v: val("\\frac{(1.7^2-5\\cdot 1.7)-(1.5^2-5\\cdot 1.5)}{0.2}") },
        { at: { x: -1, h: 3 }, v: val("\\frac{(2^2-5\\cdot 2)-((-1)^2-5(-1))}{3}") },
        { at: { x: 4, h: -0.5 }, v: val("\\frac{(3.5^2-5\\cdot 3.5)-(4^2-5\\cdot 4)}{-0.5}") }] } },
    { id: "cg-0a-005", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{下列哪一個方程式「不能」把 }y\\text{ 看成 }x\\text{ 的函數？}",
      answer: "x² + y² = 9", answers: ["x² + y² = 9"], canonical: "x² + y² = 9",
      distractors: ["y = x² − 4", "y = |x + 1|", "y = 2x + 7"],
      timeLimit: 45,
      tags: ["function-vertical-line-test"],
      hints: ["函數的意思：每一個 x 恰好對到一個 y。", "找找看：有沒有哪一個式子，同一個 x 可以解出兩個不同的 y？"],
      solution: "x² + y² = 9 是圓。x = 0 時 y = 3 和 y = −3 都成立，一個輸入對到兩個輸出，所以不是函數；鉛直線 x = 0 碰到圖形兩次。其他三個都是「給 x 算出唯一的 y」。",
      solutionSteps: ["檢查 x² + y² = 9：x = 0 時 y² = 9，y = 3 或 −3。", "一個 x 對到兩個 y，鉛直線測試失敗。", "其餘三個都直接寫成 y = …，每個 x 只算出一個 y。答案：x² + y² = 9。"],
      verify: { m: "choice", options: [
        { say: "x² + y² = 9", all: [{ v: val("0^2+3^2"), eq: 9 }, { v: val("0^2+(-3)^2"), eq: 9 }] },
        { say: "y = x² − 4", unknown: "已寫成 y = …，每個 x 只代出一個 y" },
        { say: "y = |x + 1|", unknown: "已寫成 y = …，每個 x 只代出一個 y" },
        { say: "y = 2x + 7", unknown: "已寫成 y = …，每個 x 只代出一個 y" }] } },
    { id: "cg-0a-006", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{下列哪一個關係式中，}y\\text{ 是 }x\\text{ 的函數？}",
      answer: "y = x³ − 2x", answers: ["y = x³ − 2x"], canonical: "y = x³ − 2x",
      distractors: ["y² = x + 1", "x = |y|", "x² − y² = 4"],
      timeLimit: 50,
      tags: ["function-vertical-line-test"],
      hints: ["對每一個選項問：同一個 x，會不會有兩個不同的 y 都滿足？", "y 以平方或絕對值出現時，y 和 −y 常常同時成立。"],
      solution: "y² = x + 1：x = 3 時 y = ±2；x = |y|：x = 2 時 y = ±2；x² − y² = 4：x = √5 時 y = ±1。這三個都有一個 x 對兩個 y。只有 y = x³ − 2x 每個 x 只算出一個 y。",
      solutionSteps: ["y² = x + 1：y = 2 與 y = −2 都給 x = 3，不是函數。", "x = |y|：y = ±2 都給 x = 2；x² − y² = 4：y = ±1 都給 x = √5。", "y = x³ − 2x 給 x 就算出唯一的 y。答案：y = x³ − 2x。"],
      verify: { m: "choice", options: [
        { say: "y = x³ − 2x", unknown: "已寫成 y = …，每個 x 只代出一個 y" },
        { say: "y² = x + 1", all: [{ v: val("2^2-1"), ne: "(-2)^2-1" }] },
        { say: "x = |y|", all: [{ v: val("|2|"), ne: "|-2|" }] },
        { say: "x² − y² = 4", all: [{ v: val("\\sqrt{4+1^2}"), ne: "\\sqrt{4+(-1)^2}" }] }] } },

    /* ── 0A 定義域與值域 ── */
    { id: "cg-0a-007", topic: "limits", rank: 1, answerKind: "interval",
      prompt: "\\text{求 }f(x)=x^2+4\\text{ 的值域}",
      answer: "[4, inf)", timeLimit: 45,
      tags: ["range-basic", "domain"],
      hints: ["x² 最小是多少？什麼時候取到？", "x² 可以要多大有多大嗎？"],
      solution: "x² ≥ 0，在 x = 0 取到 0，而且可以任意大。所以 x² + 4 ≥ 4，4 取得到、往上沒有上限：值域 [4, ∞)。",
      solutionSteps: ["x² 的值域是 [0, ∞)：0 在 x = 0 取到，往上每個值都取得到。", "整個加 4：值域 [4, ∞)。"],
      verify: { m: "choice", options: [{ say: "[4, inf)", all: [
        { v: { m: "extremum1d", v: "x", f: "x^2+4", lo: -100, hi: 100, kind: "min" }, eq: 4 },
        { v: { m: "extremum1d", v: "x", f: "x^2+4", lo: -100, hi: 100, kind: "max" }, gt: 1000 }] }] } },
    { id: "cg-0a-008", topic: "limits", rank: 2, answerKind: "interval",
      prompt: "\\text{求 }f(x)=x^2-6x+11\\text{ 的值域}",
      answer: "[2, inf)", timeLimit: 70,
      tags: ["range-basic", "completing-square"],
      hints: ["配方：把 x² − 6x 湊成 (x − □)² 再補常數。", "平方項最小是 0，那時候 f 是多少？"],
      solution: "x² − 6x + 11 = (x − 3)² + 2。(x − 3)² ≥ 0，在 x = 3 取到 0，而且可以任意大，所以值域 [2, ∞)。",
      solutionSteps: ["配方：x² − 6x + 11 = (x − 3)² − 9 + 11 = (x − 3)² + 2。", "(x − 3)² 的值域是 [0, ∞)（x = 3 時為 0）。", "加 2：值域 [2, ∞)。"],
      verify: { m: "choice", options: [{ say: "[2, inf)", all: [
        { v: { m: "extremum1d", v: "x", f: "x^2-6x+11", lo: -100, hi: 100, kind: "min" }, eq: 2 },
        { v: { m: "extremum1d", v: "x", f: "x^2-6x+11", lo: -100, hi: 100, kind: "max" }, gt: 1000 }] }] } },
    { id: "cg-0a-009", topic: "limits", rank: 2, answerKind: "interval",
      prompt: "\\text{求 }f(x)=3-\\sqrt{x+1}\\text{ 的值域}",
      answer: "(-inf, 3]", timeLimit: 70,
      tags: ["range-basic", "radical"],
      hints: ["先想 √(x + 1) 的值域：最小是多少？有沒有上限？", "前面是減號：√ 越大，f 越小。"],
      solution: "√(x+1) 的值域是 [0, ∞)（x = −1 時為 0）。3 − √(x+1) 最大是 3（取得到），而且可以任意小，值域 (−∞, 3]。",
      solutionSteps: ["定義域 x ≥ −1；√(x+1) 取遍 [0, ∞)，x = −1 時為 0。", "3 − √(x+1)：√ 為 0 時最大，等於 3；√ 越大值越小、沒有下限。", "值域 (−∞, 3]。"],
      verify: { m: "choice", options: [{ say: "(-inf, 3]", all: [
        { v: { m: "extremum1d", v: "x", f: "3-\\sqrt{x+1}", lo: -1, hi: 10000, kind: "max" }, eq: 3 },
        { v: { m: "extremum1d", v: "x", f: "3-\\sqrt{x+1}", lo: -1, hi: 10000, kind: "min" }, lt: -50 }] }] } },
    { id: "cg-0a-010", topic: "limits", rank: 1, answerKind: "interval",
      prompt: "\\text{求 }f(x)=\\frac{\\sqrt{x+1}}{\\sqrt{3-x}}\\text{ 的定義域}",
      answer: "[-1, 3)", timeLimit: 60,
      tags: ["domain-combined", "domain", "radical"],
      hints: ["分子的根號、分母的根號各給一個條件，而且分母不能是 0。", "x = −1 和 x = 3 這兩個端點要分開判斷：代進去，哪一個算得出數、哪一個不行？"],
      solution: "分子要 x + 1 ≥ 0，即 x ≥ −1；分母的根號要 3 − x ≥ 0，又不能等於 0，所以 x < 3。x = −1 時 f = 0/2 = 0 有定義，包含；x = 3 時分母為 0，不包含。定義域 [−1, 3)。",
      solutionSteps: ["分子：x + 1 ≥ 0 ⟹ x ≥ −1（等號可以，f(−1) = 0）。", "分母：3 − x ≥ 0 而且 √(3 − x) ≠ 0 ⟹ x < 3。", "交集：[−1, 3)。"],
      verify: { m: "domain", f: "\\frac{\\sqrt{x+1}}{\\sqrt{3-x}}", range: [-20, 20] } },

    /* ── 0A 分段函數 ── */
    { id: "cg-0a-011", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "f(x)=x^2+1\\ (x<2)\\text{，}f(x)=5-x\\ (x\\ge 2)\\text{。求 }f(-3)+f(2)+f(4)",
      answer: "14", timeLimit: 60,
      tags: ["piecewise-evaluate", "piecewise"],
      hints: ["每個輸入先判斷落在哪一段，再用那一段的式子。", "x = 2 屬於哪一段？看條件裡哪一邊有等號。"],
      solution: "−3 < 2 用第一段：9 + 1 = 10。x = 2 屬於 x ≥ 2：5 − 2 = 3。4 ≥ 2：5 − 4 = 1。合計 14。",
      solutionSteps: ["f(−3)：−3 < 2，用 x² + 1，得 10。", "f(2)：2 ≥ 2，用 5 − x，得 3；f(4) = 5 − 4 = 1。", "f(−3) + f(2) + f(4) = 10 + 3 + 1 = 14。"],
      verify: val(`${at(PW1, "-3")}+${at(PW1, "2")}+${at(PW1, "4")}`) },
    { id: "cg-0a-012", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "g(x)=2x+5\\ (x\\le -1)\\text{，}g(x)=x^2\\ (-1<x<2)\\text{，}g(x)=6\\ (x\\ge 2)\\text{。求 }g(-1)+g(1)+g(2)",
      answer: "10", timeLimit: 70,
      tags: ["piecewise-evaluate", "piecewise"],
      hints: ["三段的分界點是 −1 和 2，各自屬於哪一段？", "等號寫在哪一段，分界點就用那一段的式子。"],
      solution: "x = −1 屬於 x ≤ −1：2(−1) + 5 = 3。x = 1 在中間段：1² = 1。x = 2 屬於 x ≥ 2：6。合計 10。",
      solutionSteps: ["g(−1)：−1 ≤ −1，用 2x + 5，得 3。", "g(1)：−1 < 1 < 2，用 x²，得 1。", "g(2)：2 ≥ 2，得 6。合計 3 + 1 + 6 = 10。"],
      verify: val(`${at(PW2, "-1")}+${at(PW2, "1")}+${at(PW2, "2")}`) },
    { id: "cg-0a-013", topic: "limits", rank: 1, answerKind: "expression",
      prompt: "f(x)=|x-3|+2x\\text{ 在 }x<3\\text{ 時，寫成不含絕對值的式子}",
      answer: "x+3", timeLimit: 60,
      tags: ["piecewise-abs-rewrite", "absolute-value", "piecewise"],
      hints: ["x < 3 時，x − 3 是正還是負？", "|u| 在 u < 0 時等於 −u。"],
      solution: "x < 3 時 x − 3 < 0，|x − 3| = −(x − 3) = 3 − x。所以 f(x) = 3 − x + 2x = x + 3。",
      solutionSteps: ["x < 3 ⟹ x − 3 < 0 ⟹ |x − 3| = 3 − x。", "f(x) = (3 − x) + 2x = x + 3。"],
      verify: { m: "fn", cases: [
        { at: { x: 0 }, v: val("|0-3|+2\\cdot 0") },
        { at: { x: -2 }, v: val("|-2-3|+2(-2)") },
        { at: { x: 2.5 }, v: val("|2.5-3|+2\\cdot 2.5") }] } },
    { id: "cg-0a-014", topic: "limits", rank: 2, answerKind: "expression",
      prompt: "f(x)=|x+1|+|x-2|\\text{ 在 }x>2\\text{ 時，寫成不含絕對值的式子}",
      answer: "2*x-1", timeLimit: 75,
      tags: ["piecewise-abs-rewrite", "absolute-value", "piecewise"],
      hints: ["兩個絕對值分開看：x > 2 時，x + 1 與 x − 2 各是正是負？", "正的直接拿掉絕對值，負的要加負號。"],
      solution: "x > 2 時 x + 1 > 0、x − 2 > 0，兩個絕對值都直接拿掉：f(x) = (x + 1) + (x − 2) = 2x − 1。",
      solutionSteps: ["x > 2 ⟹ x + 1 > 0，|x + 1| = x + 1。", "x > 2 ⟹ x − 2 > 0，|x − 2| = x − 2。", "f(x) = (x + 1) + (x − 2) = 2x − 1。"],
      verify: { m: "fn", cases: [
        { at: { x: 3 }, v: val("|3+1|+|3-2|") },
        { at: { x: 2.5 }, v: val("|2.5+1|+|2.5-2|") },
        { at: { x: 10 }, v: val("|10+1|+|10-2|") }] } },
    { id: "cg-0a-015", topic: "limits", rank: 2, answerKind: "set",
      prompt: "f(x)=x^2\\ (x<1)\\text{，}f(x)=2x+1\\ (x\\ge 1)\\text{。解 }f(x)=4\\text{（列出所有解）}",
      answer: "{-2, 3/2}", timeLimit: 90,
      tags: ["piecewise-solve", "piecewise"],
      hints: ["每一段各自解，解出來之後要檢查：這個解有沒有落在那一段的範圍裡？", "x² = 4 有兩個根，兩個都符合 x < 1 嗎？"],
      solution: "第一段 x² = 4 得 x = ±2，只有 −2 滿足 x < 1（x = 2 是假解）。第二段 2x + 1 = 4 得 x = 3/2，滿足 x ≥ 1。解為 −2 與 3/2。",
      solutionSteps: ["x < 1 段：x² = 4 ⟹ x = 2 或 −2；2 不在 x < 1，丟掉。", "x ≥ 1 段：2x + 1 = 4 ⟹ x = 3/2，在範圍內。", "解集 {−2, 3/2}。"],
      verify: { m: "zeros", f: `${PW3}-4`, range: [-10, 10] } },
    { id: "cg-0a-016", topic: "limits", rank: 2, answerKind: "set",
      prompt: "g(x)=1-x\\ (x<0)\\text{，}g(x)=x^2-2x\\ (x\\ge 0)\\text{。解 }g(x)=3\\text{（列出所有解）}",
      answer: "{-2, 3}", timeLimit: 90,
      tags: ["piecewise-solve", "piecewise", "factoring"],
      hints: ["兩段分開解，每個解都要回頭檢查範圍。", "第二段解出的二次方程式有兩根，哪一根不在 x ≥ 0？"],
      solution: "x < 0 段：1 − x = 3 ⟹ x = −2，符合。x ≥ 0 段：x² − 2x − 3 = 0 ⟹ (x − 3)(x + 1) = 0，x = 3 符合、x = −1 不在範圍（假解）。解為 −2 與 3。",
      solutionSteps: ["x < 0：1 − x = 3 ⟹ x = −2，在範圍內。", "x ≥ 0：x² − 2x − 3 = (x − 3)(x + 1) = 0 ⟹ x = 3 或 −1；−1 < 0，丟掉。", "解集 {−2, 3}。"],
      verify: { m: "zeros", f: `${PW4}-3`, range: [-10, 10] } },

    /* ── 0A 函數圖形的基本資訊 ── */
    { id: "cg-0a-017", topic: "limits", rank: 1, answerKind: "text",
      prompt: "f(x)=x^4-3x^2+1\\text{ 是奇函數、偶函數，還是都不是？}",
      answer: "偶函數", answers: ["偶函數"], canonical: "偶函數",
      distractors: ["奇函數", "都不是", "既是奇函數也是偶函數"],
      timeLimit: 45,
      tags: ["graph-symmetry", "even-function"],
      hints: ["算 f(−x)：把 x 換成 (−x)，化簡。", "f(−x) 等於 f(x) 是偶，等於 −f(x) 是奇。"],
      solution: "f(−x) = (−x)⁴ − 3(−x)² + 1 = x⁴ − 3x² + 1 = f(x)，偶函數（只有偶次方）。",
      solutionSteps: ["(−x)⁴ = x⁴，(−x)² = x²。", "f(−x) = x⁴ − 3x² + 1 = f(x)，是偶函數。"],
      verify: { m: "choice", options: [
        { say: "偶函數", all: [
          { v: val("(-1.3)^4-3(-1.3)^2+1"), eq: "(1.3)^4-3(1.3)^2+1" },
          { v: val("(-0.7)^4-3(-0.7)^2+1"), eq: "(0.7)^4-3(0.7)^2+1" },
          { v: val("(-2.1)^4-3(-2.1)^2+1"), eq: "(2.1)^4-3(2.1)^2+1" }] },
        { say: "奇函數", all: [{ v: val("(-2)^4-3(-2)^2+1"), eq: "-(2^4-3\\cdot 2^2+1)" }] },
        { say: "都不是", all: [{ v: val("(-1.3)^4-3(-1.3)^2+1"), ne: "(1.3)^4-3(1.3)^2+1" }] },
        { say: "既是奇函數也是偶函數", all: [{ v: val("2^4-3\\cdot 2^2+1"), eq: 0 }] }] } },
    { id: "cg-0a-018", topic: "limits", rank: 1, answerKind: "text",
      prompt: "f(x)=x^3+\\sin x\\text{ 是奇函數、偶函數，還是都不是？}",
      answer: "奇函數", answers: ["奇函數"], canonical: "奇函數",
      distractors: ["偶函數", "都不是", "既是奇函數也是偶函數"],
      timeLimit: 45,
      tags: ["graph-symmetry", "odd-function"],
      hints: ["算 f(−x)，記得 sin(−x) = −sin x。", "比較 f(−x) 和 f(x)、−f(x)。"],
      solution: "f(−x) = (−x)³ + sin(−x) = −x³ − sin x = −f(x)，奇函數。",
      solutionSteps: ["(−x)³ = −x³，sin(−x) = −sin x。", "f(−x) = −(x³ + sin x) = −f(x)，是奇函數。"],
      verify: { m: "choice", options: [
        { say: "奇函數", all: [
          { v: val("(-1.3)^3+\\sin(-1.3)"), eq: "-((1.3)^3+\\sin(1.3))" },
          { v: val("(-0.4)^3+\\sin(-0.4)"), eq: "-((0.4)^3+\\sin(0.4))" },
          { v: val("(-2.6)^3+\\sin(-2.6)"), eq: "-((2.6)^3+\\sin(2.6))" }] },
        { say: "偶函數", all: [{ v: val("(-1)^3+\\sin(-1)"), eq: "1^3+\\sin 1" }] },
        { say: "都不是", all: [{ v: val("(-1.3)^3+\\sin(-1.3)"), ne: "-((1.3)^3+\\sin(1.3))" }] },
        { say: "既是奇函數也是偶函數", all: [{ v: val("1^3+\\sin 1"), eq: 0 }] }] } },
    { id: "cg-0a-019", topic: "limits", rank: 1, answerKind: "text",
      prompt: "f(x)=x^3+x^2\\text{ 是奇函數、偶函數，還是都不是？}",
      answer: "都不是", answers: ["都不是"], canonical: "都不是",
      distractors: ["奇函數", "偶函數", "既是奇函數也是偶函數"],
      timeLimit: 50,
      tags: ["graph-symmetry", "odd-function", "even-function"],
      hints: ["要說「不是偶函數」，只要找到一個 a 讓 f(−a) ≠ f(a)。", "試 a = 1：算 f(1) 和 f(−1)。"],
      solution: "f(1) = 2，f(−1) = −1 + 1 = 0。f(−1) ≠ f(1)，不是偶；f(−1) ≠ −f(1) = −2，也不是奇。一個反例就夠了。",
      solutionSteps: ["f(1) = 1 + 1 = 2，f(−1) = −1 + 1 = 0。", "0 ≠ 2：不是偶函數；0 ≠ −2：不是奇函數。", "答案：都不是。"],
      verify: { m: "choice", options: [
        { say: "都不是", all: [
          { v: val("(-1)^3+(-1)^2"), ne: "1^3+1^2" },
          { v: val("(-1)^3+(-1)^2"), ne: "-(1^3+1^2)" }] },
        { say: "奇函數", all: [{ v: val("(-1)^3+(-1)^2"), eq: "-(1^3+1^2)" }] },
        { say: "偶函數", all: [{ v: val("(-1)^3+(-1)^2"), eq: "1^3+1^2" }] },
        { say: "既是奇函數也是偶函數", all: [{ v: val("1^3+1^2"), eq: 0 }] }] } },
    { id: "cg-0a-020", topic: "limits", rank: 1, answerKind: "interval",
      prompt: "\\text{求使 }(x+2)(x-1)(x-4)>0\\text{ 的 }x\\text{ 的範圍}",
      answer: "(-2, 1) U (4, inf)", timeLimit: 70,
      tags: ["graph-sign-chart", "polynomial"],
      hints: ["三個零點把數線切成四段，每段裡正負號不會變。", "每段挑一個好算的點代進去看正負。"],
      solution: "零點 −2、1、4。x = 5：正；x = 2：(+)(+)(−) 負；x = 0：(+)(−)(−) 正；x = −3：負。為正的區間 (−2, 1) ∪ (4, ∞)，零點本身等於 0 不算。",
      solutionSteps: ["零點：x = −2、1、4，切成四段。", "代點：x = −3 負、x = 0 正、x = 2 負、x = 5 正。", "> 0 的範圍：(−2, 1) ∪ (4, ∞)（端點是 0，不含）。"],
      verify: { m: "domain", f: "\\ln((x+2)(x-1)(x-4))", range: [-20, 20] } },
    { id: "cg-0a-021", topic: "limits", rank: 2, answerKind: "interval",
      prompt: "\\text{求使 }\\frac{x^2-4}{x-3}>0\\text{ 的 }x\\text{ 的範圍}",
      answer: "(-2, 2) U (3, inf)", timeLimit: 90,
      tags: ["graph-sign-chart", "rational-function"],
      hints: ["分子的零點和分母的零點都要放上數線。", "分母的零點不能取（沒有定義），分子的零點讓值為 0，也不算「> 0」。"],
      solution: "分界點 −2、2（分子為 0）與 3（分母為 0）。x = −3：5/(−6) 負；x = 0：(−4)/(−3) 正；x = 2.5：2.25/(−0.5) 負；x = 4：12/1 正。答案 (−2, 2) ∪ (3, ∞)。",
      solutionSteps: ["x² − 4 = (x − 2)(x + 2)：分界點 −2、2、3。", "四段代點：負、正、負、正。", "> 0：(−2, 2) ∪ (3, ∞)。"],
      verify: { m: "domain", f: "\\ln\\left(\\frac{x^2-4}{x-3}\\right)", range: [-20, 20] } },
    { id: "cg-0a-022", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{不用導數：若 }2<a<b\\,\\text{，比較 }f(a)\\text{ 與 }f(b)\\text{，判斷 }f(x)=\\frac{1}{x-2}\\text{ 在 }(2,\\infty)\\text{ 上的單調性}",
      answer: "遞減", answers: ["遞減"], canonical: "遞減",
      distractors: ["遞增", "常數函數"],
      timeLimit: 75,
      tags: ["graph-monotone-definition", "rational-function"],
      hints: ["2 < a < b 時，a − 2 和 b − 2 誰大？兩個都是正的嗎？", "兩個正數，分母越大，倒數越小還是越大？"],
      solution: "0 < a − 2 < b − 2，取倒數不等號反向：1/(a−2) > 1/(b−2)，即 f(a) > f(b)。輸入變大、輸出變小，所以遞減。",
      solutionSteps: ["2 < a < b ⟹ 0 < a − 2 < b − 2。", "正數取倒數不等號反向：f(a) = 1/(a−2) > 1/(b−2) = f(b)。", "a < b 時 f(a) > f(b)：遞減。"],
      verify: { m: "choice", options: [
        { say: "遞減", all: [
          { v: val("\\frac{1}{2.5-2}"), gt: "\\frac{1}{3-2}" },
          { v: val("\\frac{1}{3-2}"), gt: "\\frac{1}{7-2}" },
          { v: val("\\frac{1}{7-2}"), gt: "\\frac{1}{40-2}" }] },
        { say: "遞增", all: [{ v: val("\\frac{1}{3-2}"), lt: "\\frac{1}{7-2}" }] },
        { say: "常數函數", all: [{ v: val("\\frac{1}{3-2}"), eq: "\\frac{1}{7-2}" }] }] } },
    { id: "cg-0a-023", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{不用導數：若 }a<b\\le 1\\text{，比較 }f(a)\\text{ 與 }f(b)\\text{，判斷 }f(x)=(x-1)^2\\text{ 在 }(-\\infty,1]\\text{ 上的單調性}",
      answer: "遞減", answers: ["遞減"], canonical: "遞減",
      distractors: ["遞增", "先增後減"],
      timeLimit: 75,
      tags: ["graph-monotone-definition", "polynomial"],
      hints: ["a < b ≤ 1 時，a − 1 和 b − 1 都 ≤ 0；誰離 0 比較遠？", "兩個非正的數，離 0 越遠，平方越大還是越小？"],
      solution: "a − 1 < b − 1 ≤ 0，所以 |a − 1| > |b − 1|，平方後 (a−1)² > (b−1)²，即 f(a) > f(b)，遞減。",
      solutionSteps: ["a < b ≤ 1 ⟹ a − 1 < b − 1 ≤ 0 ⟹ |a − 1| > |b − 1|。", "平方保持大小：(a − 1)² > (b − 1)²，f(a) > f(b)。", "在 (−∞, 1] 上遞減。"],
      verify: { m: "choice", options: [
        { say: "遞減", all: [
          { v: val("(-3-1)^2"), gt: "(-1-1)^2" },
          { v: val("(-1-1)^2"), gt: "(0.5-1)^2" },
          { v: val("(0.5-1)^2"), gt: "(1-1)^2" }] },
        { say: "遞增", all: [{ v: val("(-1-1)^2"), lt: "(0.5-1)^2" }] },
        { say: "先增後減", all: [{ v: val("(-3-1)^2"), lt: "(-2-1)^2" }] }] } },
    { id: "cg-0a-024", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{下列哪一個函數在整條實數線上有界？}",
      answer: "f(x) = 3 sin x + 1", answers: ["f(x) = 3 sin x + 1"], canonical: "f(x) = 3 sin x + 1",
      distractors: ["f(x) = x²", "f(x) = 2ˣ", "f(x) = x³ − x"],
      timeLimit: 45,
      tags: ["graph-bounded", "trig"],
      hints: ["有界：存在一個 M，讓所有 x 都有 |f(x)| ≤ M。", "哪一個函數的值被夾在兩個固定的數之間？"],
      solution: "−1 ≤ sin x ≤ 1，所以 −2 ≤ 3 sin x + 1 ≤ 4，有界。x²、2ˣ、x³ − x 都可以任意大。",
      solutionSteps: ["−1 ≤ sin x ≤ 1 ⟹ −2 ≤ 3 sin x + 1 ≤ 4。", "x² 與 2ˣ 在 x 很大時無限增大；x³ − x 也是。", "答案：f(x) = 3 sin x + 1。"],
      verify: { m: "choice", options: [
        { say: "f(x) = 3 sin x + 1", all: [
          { v: { m: "extremum1d", v: "x", f: "3\\sin x+1", lo: -200, hi: 200, kind: "max" }, le: 4 },
          { v: { m: "extremum1d", v: "x", f: "3\\sin x+1", lo: -200, hi: 200, kind: "min" }, ge: -2 }] },
        { say: "f(x) = x²", all: [{ v: { m: "extremum1d", v: "x", f: "x^2", lo: -200, hi: 200, kind: "max" }, le: 1000 }] },
        { say: "f(x) = 2ˣ", all: [{ v: { m: "extremum1d", v: "x", f: "2^x", lo: -20, hi: 20, kind: "max" }, le: 1000 }] },
        { say: "f(x) = x³ − x", all: [{ v: { m: "extremum1d", v: "x", f: "x^3-x", lo: -200, hi: 200, kind: "max" }, le: 1000 }] }] } },

    /* ── 0B 函數加減乘除 ── */
    { id: "cg-0b-001", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "f(x)=x^2-1\\text{，}g(x)=3x+2\\text{。求 }(f+g)(2)+(fg)(-2)",
      answer: "-1", timeLimit: 60,
      tags: ["function-arithmetic-evaluate", "polynomial"],
      hints: ["(f + g)(2) = f(2) + g(2)；(fg)(−2) = f(−2)·g(−2)。", "先把四個函數值算出來，最後再組合。"],
      solution: "f(2) = 3、g(2) = 8，(f+g)(2) = 11。f(−2) = 3、g(−2) = −4，(fg)(−2) = −12。合計 −1。",
      solutionSteps: ["(f + g)(2) = f(2) + g(2) = 3 + 8 = 11。", "(fg)(−2) = f(−2)·g(−2) = 3·(−4) = −12。", "11 + (−12) = −1。"],
      verify: val("((2)^2-1+3(2)+2)+((-2)^2-1)(3(-2)+2)") },
    { id: "cg-0b-002", topic: "limits", rank: 1, answerKind: "expression",
      prompt: "f(x)=x^2+3x\\text{，}g(x)=x^2-x+4\\text{。求 }(f-g)(x)",
      answer: "4*x-4", timeLimit: 50,
      tags: ["function-arithmetic-evaluate", "polynomial"],
      hints: ["(f − g)(x) = f(x) − g(x)，g 的每一項都要變號。", "減掉 −x 等於加 x；減掉 4 等於 −4。"],
      solution: "(f − g)(x) = (x² + 3x) − (x² − x + 4) = x² + 3x − x² + x − 4 = 4x − 4。",
      solutionSteps: ["(x² + 3x) − (x² − x + 4)：括號拿掉，g 的每項變號。", "= x² + 3x − x² + x − 4 = 4x − 4。"],
      verify: { m: "fn", cases: [
        { at: { x: 0 }, v: val("(0^2+3\\cdot 0)-(0^2-0+4)") },
        { at: { x: 2.5 }, v: val("(2.5^2+3\\cdot 2.5)-(2.5^2-2.5+4)") },
        { at: { x: -3 }, v: val("((-3)^2+3(-3))-((-3)^2-(-3)+4)") }] } },
    { id: "cg-0b-003", topic: "limits", rank: 1, answerKind: "interval",
      prompt: "f(x)=\\sqrt{x-1}\\text{，}g(x)=x+3\\text{。求 }\\frac{f}{g}\\text{ 的定義域}",
      answer: "[1, inf)", timeLimit: 60,
      tags: ["function-arithmetic-domain", "domain", "radical"],
      hints: ["f/g 要有定義：f 和 g 都要有定義，而且 g(x) ≠ 0。", "g 的零點有沒有落在 f 的定義域裡？沒有的話就不用再扣。"],
      solution: "f 的定義域 [1, ∞)，g 處處有定義，交集 [1, ∞)。g(x) = 0 在 x = −3，不在 [1, ∞) 裡，不用再扣。定義域 [1, ∞)。",
      solutionSteps: ["f：x − 1 ≥ 0 ⟹ x ≥ 1；g 處處有定義。交集 [1, ∞)。", "分母 g(x) = 0 ⟹ x = −3，本來就不在交集裡。", "定義域 [1, ∞)。"],
      verify: { m: "domain", f: "\\frac{\\sqrt{x-1}}{x+3}", range: [-20, 20] } },
    { id: "cg-0b-004", topic: "limits", rank: 2, answerKind: "interval",
      prompt: "f(x)=\\sqrt{4-x^2}\\text{，}g(x)=x-2\\text{。求 }\\frac{f}{g}\\text{ 的定義域}",
      answer: "[-2, 2)", timeLimit: 80,
      tags: ["function-arithmetic-domain", "domain", "radical"],
      hints: ["先求 f 的定義域：根號裡 4 − x² ≥ 0。", "再看 g 的零點：它落在那個區間的哪裡？"],
      solution: "f 要 4 − x² ≥ 0，即 −2 ≤ x ≤ 2；g 處處有定義。g(x) = 0 在 x = 2，正好是右端點，要扣掉。x = −2 時 f/g = 0/(−4) = 0，可以取。定義域 [−2, 2)。",
      solutionSteps: ["f：4 − x² ≥ 0 ⟹ −2 ≤ x ≤ 2。", "分母：x − 2 = 0 ⟹ x = 2，扣掉這個端點。", "定義域 [−2, 2)。"],
      verify: { m: "domain", f: "\\frac{\\sqrt{4-x^2}}{x-2}", range: [-20, 20] } },

    /* ── 0B 函數合成 ── */
    { id: "cg-0b-005", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "f(x)=2x-1\\text{，}g(x)=x^2+1\\text{。求 }f(g(2))",
      answer: "9", timeLimit: 40,
      tags: ["composition-evaluate", "composition"],
      hints: ["先算裡面的 g(2)。", "再把算出來的數放進 f。"],
      solution: "g(2) = 4 + 1 = 5，f(5) = 10 − 1 = 9。",
      solutionSteps: ["裡面先算：g(2) = 2² + 1 = 5。", "外面：f(5) = 2·5 − 1 = 9。"],
      verify: val("2((2)^2+1)-1") },
    { id: "cg-0b-006", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "f(x)=x+4\\text{，}g(x)=x^2\\text{。求 }(f\\circ g)(-3)-(g\\circ f)(-3)",
      answer: "12", timeLimit: 60,
      tags: ["composition-evaluate", "composition"],
      hints: ["(f ∘ g)(−3) = f(g(−3))：先做 g；(g ∘ f)(−3) = g(f(−3))：先做 f。", "兩個順序算出來的數通常不一樣。"],
      solution: "f(g(−3)) = f(9) = 13；g(f(−3)) = g(1) = 1。相減 12。",
      solutionSteps: ["(f∘g)(−3)：g(−3) = 9，f(9) = 13。", "(g∘f)(−3)：f(−3) = 1，g(1) = 1。", "13 − 1 = 12。"],
      verify: val("((-3)^2+4)-((-3)+4)^2") },
    { id: "cg-0b-007", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{把 }h(x)=\\sqrt{x^2+5}\\text{ 寫成 }f(g(x))\\text{，下列哪一組正確？}",
      answer: "f(u) = √u，g(x) = x² + 5", answers: ["f(u) = √u，g(x) = x² + 5"], canonical: "f(u) = √u，g(x) = x² + 5",
      distractors: ["f(u) = u² + 5，g(x) = √x", "f(u) = √u + 5，g(x) = x²", "f(u) = u + 5，g(x) = √(x²)"],
      timeLimit: 45,
      tags: ["composition-decompose", "composition", "chain-rule"],
      hints: ["代一個 x 進去算 h(x)，第一步做的事是裡層、最後一步是外層。", "把每一組的 f(g(x)) 真的組合起來，看是不是 h。"],
      solution: "算 h(x) 時先算 x² + 5（裡層），最後開根號（外層），所以 g(x) = x² + 5、f(u) = √u。其他組合出來是 x + 5、|x| + 5，不是 h。",
      solutionSteps: ["計算順序：先 x² + 5，再取 √。", "裡層 g(x) = x² + 5，外層 f(u) = √u：f(g(x)) = √(x² + 5) = h(x)。"],
      verify: { m: "choice", options: [
        { say: "f(u) = √u，g(x) = x² + 5", all: [
          { v: val("\\sqrt{(1.7)^2+5}"), eq: "\\sqrt{1.7^2+5}" },
          { v: val("\\sqrt{(-2.3)^2+5}"), eq: "\\sqrt{(-2.3)^2+5}" }] },
        { say: "f(u) = u² + 5，g(x) = √x", all: [{ v: val("(\\sqrt{1.7})^2+5"), eq: "\\sqrt{1.7^2+5}" }] },
        { say: "f(u) = √u + 5，g(x) = x²", all: [{ v: val("\\sqrt{1.7^2}+5"), eq: "\\sqrt{1.7^2+5}" }] },
        { say: "f(u) = u + 5，g(x) = √(x²)", all: [{ v: val("\\sqrt{1.7^2}+5"), eq: "\\sqrt{1.7^2+5}" }] }] } },
    { id: "cg-0b-008", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{把 }h(x)=(3x-1)^5\\text{ 寫成 }f(g(x))\\text{，下列哪一組正確？}",
      answer: "f(u) = u⁵，g(x) = 3x − 1", answers: ["f(u) = u⁵，g(x) = 3x − 1"], canonical: "f(u) = u⁵，g(x) = 3x − 1",
      distractors: ["f(u) = 3u − 1，g(x) = x⁵", "f(u) = u⁵ − 1，g(x) = 3x", "f(u) = (3u)⁵，g(x) = x − 1"],
      timeLimit: 45,
      tags: ["composition-decompose", "composition", "chain-rule"],
      hints: ["算 h(2) 的時候，你先做什麼、最後做什麼？", "最後一步是外層 f，前面的整包是裡層 g。"],
      solution: "先算 3x − 1，最後取五次方：g(x) = 3x − 1、f(u) = u⁵。3u − 1 配 x⁵ 會變成 3x⁵ − 1，不是 h。",
      solutionSteps: ["計算順序：先 3x − 1，再取五次方。", "g(x) = 3x − 1，f(u) = u⁵：f(g(x)) = (3x − 1)⁵ = h(x)。"],
      verify: { m: "choice", options: [
        { say: "f(u) = u⁵，g(x) = 3x − 1", all: [
          { v: val("(3\\cdot 1.2-1)^5"), eq: "(3(1.2)-1)^5" },
          { v: val("(3(-0.5)-1)^5"), eq: "(3(-0.5)-1)^5" }] },
        { say: "f(u) = 3u − 1，g(x) = x⁵", all: [{ v: val("3(1.2^5)-1"), eq: "(3(1.2)-1)^5" }] },
        { say: "f(u) = u⁵ − 1，g(x) = 3x", all: [{ v: val("(3\\cdot 1.2)^5-1"), eq: "(3(1.2)-1)^5" }] },
        { say: "f(u) = (3u)⁵，g(x) = x − 1", all: [{ v: val("(3(1.2-1))^5"), eq: "(3(1.2)-1)^5" }] }] } },
    { id: "cg-0b-009", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{把 }h(x)=\\frac{1}{x^2+4}\\text{ 寫成 }f(g(x))\\text{，下列哪一組正確？}",
      answer: "f(u) = 1/u，g(x) = x² + 4", answers: ["f(u) = 1/u，g(x) = x² + 4"], canonical: "f(u) = 1/u，g(x) = x² + 4",
      distractors: ["f(u) = u² + 4，g(x) = 1/x", "f(u) = 1/(u² + 4)，g(x) = x²", "f(u) = 1/u + 4，g(x) = x²"],
      timeLimit: 45,
      tags: ["composition-decompose", "composition", "chain-rule"],
      hints: ["算 h(x) 的最後一步是什麼運算？", "把每組的 f(g(x)) 組合出來，跟 h 比。"],
      solution: "先算 x² + 4，最後取倒數：g(x) = x² + 4、f(u) = 1/u。1/(u² + 4) 配 x² 會變成 1/(x⁴ + 4)。",
      solutionSteps: ["計算順序：先 x² + 4，再取倒數。", "g(x) = x² + 4，f(u) = 1/u：f(g(x)) = 1/(x² + 4) = h(x)。"],
      verify: { m: "choice", options: [
        { say: "f(u) = 1/u，g(x) = x² + 4", all: [
          { v: val("\\frac{1}{(1.5)^2+4}"), eq: "\\frac{1}{1.5^2+4}" },
          { v: val("\\frac{1}{(-0.8)^2+4}"), eq: "\\frac{1}{(-0.8)^2+4}" }] },
        { say: "f(u) = u² + 4，g(x) = 1/x", all: [{ v: val("\\left(\\frac{1}{1.5}\\right)^2+4"), eq: "\\frac{1}{1.5^2+4}" }] },
        { say: "f(u) = 1/(u² + 4)，g(x) = x²", all: [{ v: val("\\frac{1}{(1.5^2)^2+4}"), eq: "\\frac{1}{1.5^2+4}" }] },
        { say: "f(u) = 1/u + 4，g(x) = x²", all: [{ v: val("\\frac{1}{1.5^2}+4"), eq: "\\frac{1}{1.5^2+4}" }] }] } },
    { id: "cg-0b-010", topic: "limits", rank: 2, answerKind: "interval",
      prompt: "f(x)=x^2\\text{，}g(x)=\\sqrt{x-1}\\text{。求 }(f\\circ g)(x)\\text{ 的定義域}",
      answer: "[1, inf)", timeLimit: 75,
      tags: ["composition-domain", "composition", "domain"],
      hints: ["f(g(x)) 要先算得出 g(x)：x 必須在 g 的定義域裡。", "化簡後的式子看起來處處有定義，但化簡不會讓 g 突然算得出來。"],
      solution: "f(g(x)) = (√(x−1))² = x − 1，但這只在 √(x−1) 有定義時成立，所以要 x ≥ 1。定義域 [1, ∞)，不是全體實數。",
      solutionSteps: ["先要 g(x) 有定義：x − 1 ≥ 0 ⟹ x ≥ 1。", "g(x) 再丟進 f：f 處處有定義，沒有新限制。", "定義域 [1, ∞)（化簡成 x − 1 不會擴大它）。"],
      verify: { m: "domain", f: "\\left(\\sqrt{x-1}\\right)^2", range: [-20, 20] } },
    { id: "cg-0b-011", topic: "limits", rank: 2, answerKind: "interval",
      prompt: "f(x)=\\sqrt{x}\\text{，}g(x)=x^2-9\\text{。求 }(f\\circ g)(x)\\text{ 的定義域}",
      answer: "(-inf, -3] U [3, inf)", timeLimit: 80,
      tags: ["composition-domain", "composition", "domain"],
      hints: ["g 處處有定義；問題在 g(x) 要落在 f 的定義域裡。", "√ 裡面要 ≥ 0：解 x² − 9 ≥ 0。"],
      solution: "f(g(x)) = √(x² − 9)，要 x² − 9 ≥ 0，即 |x| ≥ 3。定義域 (−∞, −3] ∪ [3, ∞)。",
      solutionSteps: ["g(x) 要在 f 的定義域 [0, ∞) 裡：x² − 9 ≥ 0。", "x² ≥ 9 ⟹ x ≤ −3 或 x ≥ 3。", "定義域 (−∞, −3] ∪ [3, ∞)。"],
      verify: { m: "domain", f: "\\sqrt{x^2-9}", range: [-21, 21] } },

    /* ── 0B 反函數 ── */
    { id: "cg-0b-012", topic: "limits", rank: 1, answerKind: "expression",
      prompt: "f(x)=3x-7\\text{，求 }f^{-1}(x)",
      answer: "(x+7)/3", timeLimit: 50,
      tags: ["inverse-solve-formula", "inverse-function"],
      hints: ["令 y = 3x − 7，把 x 解出來。", "最後把變數名字 y 換回 x。"],
      solution: "y = 3x − 7 ⟹ x = (y + 7)/3。換回變數：f⁻¹(x) = (x + 7)/3。",
      solutionSteps: ["y = 3x − 7 ⟹ 3x = y + 7 ⟹ x = (y + 7)/3。", "f⁻¹(x) = (x + 7)/3。"],
      verify: { m: "fn", cases: [
        { at: { x: 2 }, v: { m: "root", f: "3x-7-(2)", x0: 1 } },
        { at: { x: -4 }, v: { m: "root", f: "3x-7-(-4)", x0: 1 } },
        { at: { x: 11 }, v: { m: "root", f: "3x-7-(11)", x0: 1 } }] } },
    { id: "cg-0b-013", topic: "limits", rank: 1, answerKind: "expression",
      prompt: "f(x)=\\frac{2x+1}{x-3}\\ (x\\ne 3)\\text{，求 }f^{-1}(x)",
      answer: "(3*x+1)/(x-2)", timeLimit: 75,
      tags: ["inverse-solve-formula", "inverse-function", "rational-function"],
      hints: ["令 y = (2x + 1)/(x − 3)，兩邊乘以 (x − 3)。", "把含 x 的項移到同一邊，提出 x。"],
      solution: "y(x − 3) = 2x + 1 ⟹ yx − 2x = 3y + 1 ⟹ x = (3y + 1)/(y − 2)。f⁻¹(x) = (3x + 1)/(x − 2)。",
      solutionSteps: ["y(x − 3) = 2x + 1 ⟹ xy − 3y = 2x + 1。", "x(y − 2) = 3y + 1 ⟹ x = (3y + 1)/(y − 2)。", "f⁻¹(x) = (3x + 1)/(x − 2)。"],
      verify: { m: "fn", cases: [
        { at: { x: 0 }, v: { m: "root", f: "\\frac{2x+1}{x-3}-0", x0: 0 } },
        { at: { x: 5 }, v: { m: "root", f: "\\frac{2x+1}{x-3}-5", x0: 5 } },
        { at: { x: -1 }, v: { m: "root", f: "\\frac{2x+1}{x-3}+1", x0: 0.5 } }] } },
    { id: "cg-0b-014", topic: "limits", rank: 1, answerKind: "expression",
      prompt: "f(x)=\\sqrt{x-2}\\ (x\\ge 2)\\text{，求 }f^{-1}(x)\\text{（}x\\ge 0\\text{）}",
      answer: "x^2+2", timeLimit: 60,
      tags: ["inverse-solve-formula", "inverse-function", "radical"],
      hints: ["令 y = √(x − 2)，兩邊平方。", "f 的值域是 [0, ∞)，這就是 f⁻¹ 的定義域。"],
      solution: "y = √(x − 2) ⟹ y² = x − 2 ⟹ x = y² + 2。f⁻¹(x) = x² + 2，定義在 x ≥ 0（f 的值域）。",
      solutionSteps: ["y = √(x − 2)，y ≥ 0；平方：y² = x − 2。", "x = y² + 2，所以 f⁻¹(x) = x² + 2（x ≥ 0）。"],
      verify: { m: "fn", cases: [
        { at: { x: 0.5 }, v: { m: "root", f: "\\sqrt{x-2}-0.5", x0: 2.01 } },
        { at: { x: 1 }, v: { m: "root", f: "\\sqrt{x-2}-1", x0: 2.01 } },
        { at: { x: 3 }, v: { m: "root", f: "\\sqrt{x-2}-3", x0: 2.01 } }] } },
    { id: "cg-0b-015", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{下列哪一個函數（定義在整條實數線上）有反函數？}",
      answer: "f(x) = x³ + 1", answers: ["f(x) = x³ + 1"], canonical: "f(x) = x³ + 1",
      distractors: ["f(x) = x² − 4", "f(x) = |x|", "f(x) = x⁴ + x"],
      timeLimit: 50,
      tags: ["inverse-one-to-one", "inverse-function"],
      hints: ["有反函數要一對一：不同的輸入一定給不同的輸出（水平線測試）。", "要否定一對一，只要找兩個不同的 x 給出同一個值。"],
      solution: "x² − 4 與 |x| 在 x = ±2 給同一個值；x⁴ + x 在 x = 0 與 x = −1 都是 0。x³ + 1 嚴格遞增，每條水平線只碰一次，有反函數。",
      solutionSteps: ["x² − 4：f(2) = f(−2)；|x|：f(3) = f(−3)；x⁴ + x：f(0) = f(−1) = 0。都不是一對一。", "x³ + 1 嚴格遞增，通過水平線測試。答案：f(x) = x³ + 1。"],
      verify: { m: "choice", options: [
        { say: "f(x) = x³ + 1", unknown: "x³ + 1 嚴格遞增（a < b ⟹ a³ < b³）" },
        { say: "f(x) = x² − 4", all: [{ v: val("2^2-4"), ne: "(-2)^2-4" }] },
        { say: "f(x) = |x|", all: [{ v: val("|3|"), ne: "|-3|" }] },
        { say: "f(x) = x⁴ + x", all: [{ v: val("0^4+0"), ne: "(-1)^4+(-1)" }] }] } },
    { id: "cg-0b-016", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{下列哪一個函數（在它的定義域上）「沒有」反函數？}",
      answer: "f(x) = x² + 2x", answers: ["f(x) = x² + 2x"], canonical: "f(x) = x² + 2x",
      distractors: ["f(x) = 5 − 2x", "f(x) = x³", "f(x) = √(x + 1)"],
      timeLimit: 50,
      tags: ["inverse-one-to-one", "inverse-function"],
      hints: ["沒有反函數 = 有兩個不同的輸入給出同一個輸出。", "拋物線對稱軸兩側的點，高度會一樣。"],
      solution: "x² + 2x 在 x = 0 和 x = −2 都等於 0，一條水平線碰到兩次，不是一對一。5 − 2x、x³、√(x + 1) 都嚴格單調，有反函數。",
      solutionSteps: ["f(0) = 0，f(−2) = 4 − 4 = 0：兩個輸入同一個輸出。", "其餘三個嚴格單調、一對一。答案：f(x) = x² + 2x。"],
      verify: { m: "choice", options: [
        { say: "f(x) = x² + 2x", all: [{ v: val("0^2+2\\cdot 0"), eq: "(-2)^2+2(-2)" }] },
        { say: "f(x) = 5 − 2x", unknown: "一次函數斜率非零，嚴格遞減" },
        { say: "f(x) = x³", unknown: "嚴格遞增" },
        { say: "f(x) = √(x + 1)", unknown: "在定義域 [−1, ∞) 上嚴格遞增" }] } },
    { id: "cg-0b-017", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "f(x)=x^3+2x-1\\text{，求 }f^{-1}(2)",
      answer: "1", timeLimit: 60,
      tags: ["inverse-value", "inverse-function"],
      hints: ["f⁻¹(2) 是「哪一個 x 讓 f(x) = 2」。", "不用求 f⁻¹ 的式子，試幾個簡單的整數代進 f。"],
      solution: "要找 x 使 x³ + 2x − 1 = 2。試 x = 1：1 + 2 − 1 = 2。f 嚴格遞增，只有這一個解，所以 f⁻¹(2) = 1。",
      solutionSteps: ["f⁻¹(2) = a ⟺ f(a) = 2。", "試 a = 1：f(1) = 1 + 2 − 1 = 2。", "f 遞增、解唯一：f⁻¹(2) = 1。"],
      verify: { m: "root", f: "x^3+2x-1-2", x0: 0.5 } },
    { id: "cg-0b-018", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "f(x)=x^5+x+3\\text{，求 }f^{-1}(1)",
      answer: "-1", timeLimit: 75,
      tags: ["inverse-value", "inverse-function"],
      hints: ["要解 f(x) = 1，也就是 x⁵ + x + 2 = 0。", "正數代進去一定太大，試試負的整數。"],
      solution: "x⁵ + x + 3 = 1 ⟹ x⁵ + x + 2 = 0。x = −1：−1 − 1 + 2 = 0。f 嚴格遞增（x⁵ 與 x 都遞增），解唯一，f⁻¹(1) = −1。",
      solutionSteps: ["f⁻¹(1) = a ⟺ a⁵ + a + 3 = 1。", "試 a = −1：(−1)⁵ + (−1) + 3 = 1。", "f 嚴格遞增，所以 f⁻¹(1) = −1。"],
      verify: { m: "root", f: "x^5+x+3-1", x0: -0.5 } },

    /* ── 0C 多項式與有理函數 ── */
    { id: "cg-0c-001", topic: "limits", rank: 1, answerKind: "set",
      prompt: "\\text{解 }x^3-2x^2-5x+6=0\\text{（列出所有實根）}",
      answer: "{-2, 1, 3}", timeLimit: 90,
      tags: ["poly-factor-theorem", "factoring", "polynomial"],
      hints: ["整數根一定是常數項 6 的因數：試 ±1、±2、±3、±6。", "找到一個根 a 之後，用 (x − a) 去除，剩下的二次式再分解。"],
      solution: "x = 1：1 − 2 − 5 + 6 = 0，所以 (x − 1) 是因式。除完得 x² − x − 6 = (x − 3)(x + 2)。根為 1、3、−2。",
      solutionSteps: ["試 x = 1：p(1) = 0，因式定理 ⟹ (x − 1) | p(x)。", "p(x) = (x − 1)(x² − x − 6) = (x − 1)(x − 3)(x + 2)。", "實根 {−2, 1, 3}。"],
      verify: { m: "zeros", f: "x^3-2x^2-5x+6", range: [-10, 10] } },
    { id: "cg-0c-002", topic: "limits", rank: 2, answerKind: "set",
      prompt: "\\text{解 }2x^3-3x^2-11x+6=0\\text{（列出所有實根）}",
      answer: "{-2, 1/2, 3}", timeLimit: 120,
      tags: ["poly-factor-theorem", "factoring", "polynomial"],
      hints: ["先試常數項 6 的整數因數，找到一個根。", "除出來的二次式首項係數是 2，根可能是分數。"],
      solution: "x = 3：54 − 27 − 33 + 6 = 0。除以 (x − 3) 得 2x² + 3x − 2 = (2x − 1)(x + 2)。根為 3、1/2、−2。",
      solutionSteps: ["試 x = 3：p(3) = 54 − 27 − 33 + 6 = 0，(x − 3) 是因式。", "p(x) = (x − 3)(2x² + 3x − 2) = (x − 3)(2x − 1)(x + 2)。", "實根 {−2, 1/2, 3}。"],
      verify: { m: "zeros", f: "2x^3-3x^2-11x+6", range: [-10, 10] } },
    { id: "cg-0c-003", topic: "limits", rank: 1, answerKind: "text",
      prompt: "f(x)=\\frac{x^2-9}{x^2-x-6}\\text{ 在 }x=3\\text{ 處是洞，還是垂直漸近線？}",
      answer: "洞", answers: ["洞"], canonical: "洞",
      distractors: ["垂直漸近線", "跳躍不連續"],
      timeLimit: 60,
      tags: ["rational-hole-vs-asymptote", "rational-function", "factoring"],
      hints: ["分子、分母都分解，看 (x − 3) 能不能約掉。", "約掉之後，x = 3 代進剩下的式子是一個有限的數嗎？"],
      solution: "f(x) = (x − 3)(x + 3)/((x − 3)(x + 2))。(x − 3) 約掉後剩 (x + 3)/(x + 2)，x → 3 時趨近 6/5，有限。所以 x = 3 是洞（f(3) 沒定義）。",
      solutionSteps: ["分子 (x − 3)(x + 3)，分母 (x − 3)(x + 2)。", "x ≠ 3 時 f(x) = (x + 3)/(x + 2)，x → 3 趨近 6/5。", "極限有限、函數值沒定義：洞。"],
      verify: { m: "choice", options: [
        { say: "洞", all: [{ v: { m: "limit", f: "\\frac{x^2-9}{x^2-x-6}", at: 3 }, eq: "6/5" }] },
        { say: "垂直漸近線", all: [{ v: val("\\left|\\frac{3.0001^2-9}{3.0001^2-3.0001-6}\\right|"), gt: 1000 }] },
        { say: "跳躍不連續", all: [{ v: { m: "limit", f: "\\frac{x^2-9}{x^2-x-6}", at: 3, dir: "-" }, ne: { m: "limit", f: "\\frac{x^2-9}{x^2-x-6}", at: 3, dir: "+" } }] }] } },
    { id: "cg-0c-004", topic: "limits", rank: 1, answerKind: "text",
      prompt: "f(x)=\\frac{x^2-4}{x^2-5x+6}\\text{ 在 }x=3\\text{ 處是洞，還是垂直漸近線？}",
      answer: "垂直漸近線", answers: ["垂直漸近線"], canonical: "垂直漸近線",
      distractors: ["洞", "跳躍不連續"],
      timeLimit: 60,
      tags: ["rational-hole-vs-asymptote", "rational-function", "asymptote"],
      hints: ["分子、分母都分解，看 x = 3 讓誰變成 0。", "分母是 0、分子不是 0 的時候，函數值會怎樣？"],
      solution: "f(x) = (x − 2)(x + 2)/((x − 2)(x − 3))。約掉 (x − 2) 後剩 (x + 2)/(x − 3)；x → 3 時分子趨近 5、分母趨近 0，|f| 無限大：垂直漸近線 x = 3。",
      solutionSteps: ["分子 (x − 2)(x + 2)，分母 (x − 2)(x − 3)。", "約分後 (x + 2)/(x − 3)：x = 3 時分母為 0、分子為 5 ≠ 0。", "|f(x)| → ∞：垂直漸近線。"],
      verify: { m: "choice", options: [
        { say: "垂直漸近線", all: [
          { v: val("\\left|\\frac{3.0001^2-4}{3.0001^2-5\\cdot 3.0001+6}\\right|"), gt: 10000 },
          { v: val("\\left|\\frac{2.99999^2-4}{2.99999^2-5\\cdot 2.99999+6}\\right|"), gt: 100000 }] },
        { say: "洞", all: [{ v: val("\\left|\\frac{3.0001^2-4}{3.0001^2-5\\cdot 3.0001+6}\\right|"), lt: 1000 }] },
        { say: "跳躍不連續", all: [{ v: val("\\left|\\frac{3.0001^2-4}{3.0001^2-5\\cdot 3.0001+6}\\right|"), lt: 1000 }] }] } },

    /* ── 0C 指數與對數 ── */
    { id: "cg-0c-005", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\log_2 48-\\log_2 3",
      answer: "4", timeLimit: 40,
      tags: ["log-laws", "log"],
      hints: ["同底的對數相減，可以合成一個對數：真數相除。", "48 ÷ 3 是 2 的幾次方？"],
      solution: "log₂48 − log₂3 = log₂(48/3) = log₂16 = 4。",
      solutionSteps: ["相減 → 真數相除：log₂(48/3) = log₂16。", "16 = 2⁴，所以等於 4。"],
      verify: val("\\log_2 48-\\log_2 3") },
    { id: "cg-0c-006", topic: "derivatives", rank: 1, answerKind: "text",
      prompt: "\\ln 2+\\ln 5\\text{ 等於下列哪一個？}",
      answer: "ln 10", answers: ["ln 10"], canonical: "ln 10",
      distractors: ["ln 7", "(ln 2)(ln 5)", "ln 25"],
      timeLimit: 40,
      tags: ["log-laws", "log"],
      hints: ["對數律：ln a + ln b = ln(□)，括號裡是 a 和 b 做什麼運算？", "ln(a + b) 沒有拆開的公式，小心看起來很像的選項。"],
      solution: "ln a + ln b = ln(ab)，所以 ln 2 + ln 5 = ln 10。ln 7 = ln(2 + 5) 是常見的錯：對數把乘法變加法，不是把加法搬進去。",
      solutionSteps: ["對數律：ln a + ln b = ln(ab)。", "ln 2 + ln 5 = ln(2·5) = ln 10。"],
      verify: { m: "choice", options: [
        { say: "ln 10", all: [{ v: val("\\ln 2+\\ln 5"), eq: "\\ln 10" }] },
        { say: "ln 7", all: [{ v: val("\\ln 2+\\ln 5"), eq: "\\ln 7" }] },
        { say: "(ln 2)(ln 5)", all: [{ v: val("\\ln 2+\\ln 5"), eq: "\\ln 2\\cdot\\ln 5" }] },
        { say: "ln 25", all: [{ v: val("\\ln 2+\\ln 5"), eq: "\\ln 25" }] }] } },
    { id: "cg-0c-007", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\log_3 18+\\log_3 6-2\\log_3 2",
      answer: "3", timeLimit: 55,
      tags: ["log-laws", "log"],
      hints: ["係數先搬進去：2 log₃2 = log₃(2²)。", "加的真數相乘、減的真數相除，合成一個 log₃。"],
      solution: "2 log₃2 = log₃4。原式 = log₃(18·6/4) = log₃27 = 3。",
      solutionSteps: ["2 log₃2 = log₃4。", "log₃18 + log₃6 − log₃4 = log₃(18·6/4) = log₃27。", "27 = 3³，答案 3。"],
      verify: val("\\log_3 18+\\log_3 6-2\\log_3 2") },
    { id: "cg-0c-008", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\text{解 }3^x=20\\text{（答案可以用 }\\ln\\text{ 表示）}",
      answer: "log(20)/log(3)", timeLimit: 50,
      tags: ["exp-log-solve-equation", "log", "exponential"],
      hints: ["兩邊取 ln，把指數上的 x 拿下來。", "ln(3ˣ) = x ln 3。"],
      solution: "兩邊取 ln：x ln 3 = ln 20，x = ln 20 / ln 3 ≈ 2.727。",
      solutionSteps: ["ln(3ˣ) = ln 20 ⟹ x ln 3 = ln 20。", "x = ln 20 / ln 3 ≈ 2.727。"],
      verify: { m: "root", f: "3^x-20", x0: 2 } },
    { id: "cg-0c-009", topic: "derivatives", rank: 2, answerKind: "set",
      prompt: "\\text{解 }\\ln x+\\ln(x-3)=\\ln 10\\text{（列出所有解）}",
      answer: "{5}", timeLimit: 90,
      tags: ["exp-log-solve-equation", "log", "log-domain"],
      hints: ["左邊合成一個 ln，兩邊的真數就要相等。", "解出來的每一個數都要代回原式：ln 裡面必須是正的。"],
      solution: "ln(x(x − 3)) = ln 10 ⟹ x² − 3x − 10 = 0 ⟹ x = 5 或 −2。x = −2 時 ln(−2) 沒有定義，是假解。只有 x = 5。",
      solutionSteps: ["ln x + ln(x − 3) = ln(x(x − 3))（要 x > 3）。", "x(x − 3) = 10 ⟹ (x − 5)(x + 2) = 0。", "x = −2 不滿足 x > 3，丟掉；解集 {5}。"],
      verify: { m: "zeros", f: "\\ln x+\\ln(x-3)-\\ln 10", range: [-10, 20] } },
    { id: "cg-0c-010", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\ln\\left(e^{7}\\right)+e^{\\ln 3}",
      answer: "10", timeLimit: 35,
      tags: ["exp-log-inverse", "log", "exponential"],
      hints: ["ln 和 eˣ 互為反函數：一個做完、另一個就把它還原。", "ln(eᵃ) = a；e^{ln b} = b（b > 0）。"],
      solution: "ln(e⁷) = 7，e^{ln 3} = 3，合計 10。",
      solutionSteps: ["ln(e⁷) = 7。", "e^{ln 3} = 3。", "7 + 3 = 10。"],
      verify: val("\\ln\\left(e^{7}\\right)+e^{\\ln 3}") },
    { id: "cg-0c-011", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "e^{3\\ln 2}-\\ln\\sqrt{e}",
      answer: "15/2", timeLimit: 50,
      tags: ["exp-log-inverse", "log", "exponential"],
      hints: ["3 ln 2 先寫成 ln(2³)，再用 e^{ln b} = b。", "√e = e^{1/2}。"],
      solution: "e^{3 ln 2} = e^{ln 8} = 8；ln √e = ln e^{1/2} = 1/2。8 − 1/2 = 15/2。",
      solutionSteps: ["3 ln 2 = ln 8，e^{ln 8} = 8。", "ln √e = ln e^{1/2} = 1/2。", "8 − 1/2 = 15/2。"],
      verify: val("e^{3\\ln 2}-\\ln\\sqrt{e}") },

    /* ── 0C 三角函數 ── */
    { id: "cg-0c-012", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\cos\\frac{3\\pi}{4}",
      answer: "-sqrt(2)/2", timeLimit: 35,
      tags: ["trig-unit-circle-values", "trig"],
      hints: ["3π/4 在第幾象限？參考角是多少？", "第二象限的點，橫座標是正還是負？"],
      solution: "3π/4 在第二象限，參考角 π/4。cos 是橫座標，第二象限為負：cos(3π/4) = −√2/2。",
      solutionSteps: ["3π/4 = π − π/4，第二象限，參考角 π/4。", "cos(π/4) = √2/2，第二象限 cos < 0。", "cos(3π/4) = −√2/2。"],
      verify: val("\\cos\\frac{3\\pi}{4}") },
    { id: "cg-0c-013", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\tan\\frac{5\\pi}{3}",
      answer: "-sqrt(3)", timeLimit: 40,
      tags: ["trig-unit-circle-values", "trig"],
      hints: ["5π/3 在第幾象限？參考角是多少？", "tan = sin/cos，看這個象限裡 sin、cos 的正負。"],
      solution: "5π/3 = 2π − π/3，第四象限，參考角 π/3。sin 負、cos 正，tan 為負：tan(5π/3) = −√3。",
      solutionSteps: ["5π/3 = 2π − π/3，第四象限。", "tan(π/3) = √3；第四象限 tan < 0。", "tan(5π/3) = −√3。"],
      verify: val("\\tan\\frac{5\\pi}{3}") },
    { id: "cg-0c-014", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\sin\\frac{7\\pi}{6}\\cdot\\cos\\frac{4\\pi}{3}",
      answer: "1/4", timeLimit: 50,
      tags: ["trig-unit-circle-values", "trig"],
      hints: ["兩個角都在第三象限，參考角各是多少？", "第三象限的點，橫座標、縱座標都是負的。"],
      solution: "7π/6 參考角 π/6，sin 為負：−1/2。4π/3 參考角 π/3，cos 為負：−1/2。乘積 1/4。",
      solutionSteps: ["sin(7π/6) = −sin(π/6) = −1/2。", "cos(4π/3) = −cos(π/3) = −1/2。", "(−1/2)(−1/2) = 1/4。"],
      verify: val("\\sin\\frac{7\\pi}{6}\\cdot\\cos\\frac{4\\pi}{3}") },
    { id: "cg-0c-015", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "150^\\circ\\text{ 等於多少弧度？}",
      answer: "5*pi/6", timeLimit: 35,
      tags: ["trig-radian", "trig"],
      hints: ["180° 等於 π 弧度。", "度數乘以 π/180。"],
      solution: "150° × π/180 = 5π/6。",
      solutionSteps: ["換算：弧度 = 度數 × π/180。", "150 × π/180 = 5π/6。"],
      verify: val("150\\cdot\\frac{\\pi}{180}") },
    { id: "cg-0c-016", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\frac{7\\pi}{4}\\text{ 弧度等於多少度？}",
      answer: "315", timeLimit: 35,
      tags: ["trig-radian", "trig"],
      hints: ["π 弧度等於 180°。", "弧度乘以 180/π。"],
      solution: "(7π/4) × 180/π = 7 × 45 = 315°。",
      solutionSteps: ["換算：度數 = 弧度 × 180/π。", "(7π/4)(180/π) = 7·45 = 315。"],
      verify: val("\\frac{7\\pi}{4}\\cdot\\frac{180}{\\pi}") },

    /* ── 0C 三角恆等式 ── */
    { id: "cg-0c-017", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\sin\\theta=\\frac{3}{5}\\text{，}\\theta\\text{ 在第二象限。求 }\\cos\\theta",
      answer: "-4/5", timeLimit: 50,
      tags: ["trig-pythagorean", "trig"],
      hints: ["sin²θ + cos²θ = 1，先求 cos²θ。", "開根號後，正負號由象限決定：第二象限的橫座標是？"],
      solution: "cos²θ = 1 − 9/25 = 16/25，cos θ = ±4/5。第二象限 cos < 0，所以 cos θ = −4/5。",
      solutionSteps: ["cos²θ = 1 − (3/5)² = 16/25。", "cos θ = ±4/5；第二象限取負。", "cos θ = −4/5。"],
      verify: val("\\cos\\left(\\pi-\\arcsin\\frac{3}{5}\\right)") },
    { id: "cg-0c-018", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\cos\\theta=-\\frac{5}{13}\\text{，}\\pi<\\theta<\\frac{3\\pi}{2}\\text{。求 }\\tan\\theta",
      answer: "12/5", timeLimit: 60,
      tags: ["trig-pythagorean", "trig"],
      hints: ["先用 sin²θ + cos²θ = 1 求 sin θ，正負號看象限。", "θ 在第三象限：sin、cos 都是負的，相除呢？"],
      solution: "sin²θ = 1 − 25/169 = 144/169。第三象限 sin θ = −12/13。tan θ = (−12/13)/(−5/13) = 12/5。",
      solutionSteps: ["sin²θ = 1 − 25/169 = 144/169，第三象限 sin θ = −12/13。", "tan θ = sin θ / cos θ = (−12/13)/(−5/13)。", "tan θ = 12/5。"],
      verify: val("\\tan\\left(2\\pi-\\arccos\\left(-\\frac{5}{13}\\right)\\right)") },
    { id: "cg-0c-019", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\sin\\theta=\\frac{4}{5}\\text{，}0<\\theta<\\frac{\\pi}{2}\\text{。求 }\\sin 2\\theta",
      answer: "24/25", timeLimit: 55,
      tags: ["trig-double-angle", "trig"],
      hints: ["倍角公式：sin 2θ = 2 sin θ cos θ。", "先求 cos θ（第一象限取正）。"],
      solution: "cos θ = √(1 − 16/25) = 3/5。sin 2θ = 2·(4/5)·(3/5) = 24/25。",
      solutionSteps: ["cos θ = √(1 − 16/25) = 3/5（第一象限為正）。", "sin 2θ = 2 sin θ cos θ = 2·(4/5)(3/5) = 24/25。"],
      verify: val("\\sin\\left(2\\arcsin\\frac{4}{5}\\right)") },
    { id: "cg-0c-020", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\tan\\theta=2\\text{，求 }\\cos 2\\theta",
      answer: "-3/5", timeLimit: 70,
      tags: ["trig-double-angle", "trig"],
      hints: ["cos 2θ = cos²θ − sin²θ；分子分母同除以 cos²θ 試試。", "cos²θ + sin²θ = 1 可以當分母。"],
      solution: "cos 2θ = (cos²θ − sin²θ)/(cos²θ + sin²θ) = (1 − tan²θ)/(1 + tan²θ) = (1 − 4)/(1 + 4) = −3/5。不管 θ 在哪個象限都一樣。",
      solutionSteps: ["cos 2θ = (cos²θ − sin²θ)/(cos²θ + sin²θ)。", "同除 cos²θ：(1 − tan²θ)/(1 + tan²θ)。", "代 tan θ = 2：(1 − 4)/5 = −3/5。"],
      verify: val("\\cos(2\\arctan 2)") },
    { id: "cg-0c-021", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\text{用半角公式求 }\\cos^2\\frac{\\pi}{8}",
      answer: "(2+sqrt(2))/4", timeLimit: 70,
      tags: ["trig-half-angle", "trig"],
      hints: ["降次公式：cos²u = (1 + cos 2u)/2。", "u = π/8 時，2u 是哪個特殊角？"],
      solution: "cos²(π/8) = (1 + cos(π/4))/2 = (1 + √2/2)/2 = (2 + √2)/4。",
      solutionSteps: ["cos²u = (1 + cos 2u)/2，取 u = π/8。", "cos(π/4) = √2/2，所以 (1 + √2/2)/2 = (2 + √2)/4。"],
      verify: val("\\left(\\cos\\frac{\\pi}{8}\\right)^2") },
    { id: "cg-0c-022", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\cos\\theta=\\frac{1}{9}\\text{，}0<\\theta<\\frac{\\pi}{2}\\text{。求 }\\sin\\frac{\\theta}{2}",
      answer: "2/3", timeLimit: 70,
      tags: ["trig-half-angle", "trig"],
      hints: ["半角公式：sin²(θ/2) = (1 − cos θ)/2。", "θ/2 落在哪個範圍？決定開根號取正還是負。"],
      solution: "sin²(θ/2) = (1 − 1/9)/2 = 4/9。0 < θ/2 < π/4，sin 為正：sin(θ/2) = 2/3。",
      solutionSteps: ["sin²(θ/2) = (1 − cos θ)/2 = (8/9)/2 = 4/9。", "0 < θ/2 < π/4，取正根。", "sin(θ/2) = 2/3。"],
      verify: val("\\sin\\left(\\frac{1}{2}\\arccos\\frac{1}{9}\\right)") },
    { id: "cg-0c-023", topic: "derivatives", rank: 2, answerKind: "expression",
      prompt: "\\text{化簡 }\\frac{\\sin 2x}{1+\\cos 2x}",
      answer: "tan(x)", timeLimit: 75,
      tags: ["trig-identity-simplify", "trig"],
      hints: ["分子用 sin 2x = 2 sin x cos x。", "分母的 1 + cos 2x 選哪一種倍角形式最好消？"],
      solution: "sin 2x = 2 sin x cos x，1 + cos 2x = 2cos²x。相除得 sin x / cos x = tan x。",
      solutionSteps: ["分子：sin 2x = 2 sin x cos x。", "分母：1 + cos 2x = 1 + (2cos²x − 1) = 2cos²x。", "相除：2 sin x cos x / (2cos²x) = tan x。"],
      verify: { m: "fn", cases: [
        { at: { x: 0.3 }, v: val("\\frac{\\sin 0.6}{1+\\cos 0.6}") },
        { at: { x: 0.7 }, v: val("\\frac{\\sin 1.4}{1+\\cos 1.4}") },
        { at: { x: -1.1 }, v: val("\\frac{\\sin(-2.2)}{1+\\cos(-2.2)}") }] } },
    { id: "cg-0c-024", topic: "derivatives", rank: 2, answerKind: "expression",
      prompt: "\\text{化簡 }\\frac{\\cos 2x}{\\cos x-\\sin x}",
      answer: "cos(x)+sin(x)", timeLimit: 75,
      tags: ["trig-identity-simplify", "trig"],
      hints: ["cos 2x 有三種寫法，哪一種會出現 (cos x − sin x)？", "cos²x − sin²x 是平方差。"],
      solution: "cos 2x = cos²x − sin²x = (cos x − sin x)(cos x + sin x)。約掉分母得 cos x + sin x。",
      solutionSteps: ["cos 2x = cos²x − sin²x。", "平方差：(cos x − sin x)(cos x + sin x)。", "約掉 cos x − sin x：cos x + sin x。"],
      verify: { m: "fn", cases: [
        { at: { x: 0.2 }, v: val("\\frac{\\cos 0.4}{\\cos 0.2-\\sin 0.2}") },
        { at: { x: 1 }, v: val("\\frac{\\cos 2}{\\cos 1-\\sin 1}") },
        { at: { x: 2.5 }, v: val("\\frac{\\cos 5}{\\cos 2.5-\\sin 2.5}") }] } },

    /* ── 0C 反三角函數 ── */
    { id: "cg-0c-025", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\arcsin\\left(-\\frac{1}{2}\\right)",
      answer: "-pi/6", timeLimit: 40,
      tags: ["inverse-trig-values", "inverse-trig"],
      hints: ["arcsin 的值域是 [−π/2, π/2]，答案一定在這裡面。", "哪個角的 sin 是 −1/2，而且落在那個範圍？"],
      solution: "sin(−π/6) = −1/2，且 −π/6 ∈ [−π/2, π/2]，所以 arcsin(−1/2) = −π/6（不是 7π/6）。",
      solutionSteps: ["arcsin 的值域 [−π/2, π/2]。", "sin(−π/6) = −1/2，−π/6 在值域裡。", "arcsin(−1/2) = −π/6。"],
      verify: val("\\arcsin\\left(-\\frac{1}{2}\\right)") },
    { id: "cg-0c-026", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\arccos\\left(-\\frac{\\sqrt{3}}{2}\\right)",
      answer: "5*pi/6", timeLimit: 40,
      tags: ["inverse-trig-values", "inverse-trig"],
      hints: ["arccos 的值域是 [0, π]，答案不會是負的。", "cos 為負的角落在第二象限。"],
      solution: "arccos 的值域 [0, π]。cos(5π/6) = −√3/2，且 5π/6 在值域裡，所以答案 5π/6。",
      solutionSteps: ["arccos 的值域 [0, π]。", "cos(π/6) = √3/2；要負值，取第二象限 π − π/6 = 5π/6。", "arccos(−√3/2) = 5π/6。"],
      verify: val("\\arccos\\left(-\\frac{\\sqrt{3}}{2}\\right)") },
    { id: "cg-0c-027", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "\\arctan(-1)+\\arctan\\sqrt{3}",
      answer: "pi/12", timeLimit: 50,
      tags: ["inverse-trig-values", "inverse-trig"],
      hints: ["arctan 的值域是 (−π/2, π/2)。", "tan(π/4) = 1、tan(π/3) = √3，負號怎麼處理？"],
      solution: "arctan(−1) = −π/4，arctan √3 = π/3。和為 −π/4 + π/3 = π/12。",
      solutionSteps: ["arctan(−1) = −π/4（在 (−π/2, π/2) 裡）。", "arctan √3 = π/3。", "−π/4 + π/3 = π/12。"],
      verify: val("\\arctan(-1)+\\arctan\\sqrt{3}") },
    { id: "cg-0c-028", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\arcsin\\left(\\sin\\frac{5\\pi}{6}\\right)",
      answer: "pi/6", timeLimit: 55,
      tags: ["inverse-trig-cancel", "inverse-trig"],
      hints: ["5π/6 不在 arcsin 的值域 [−π/2, π/2] 裡，不能直接約掉。", "先算出 sin(5π/6) 是多少，再問哪個值域內的角有這個 sin。"],
      solution: "sin(5π/6) = 1/2。arcsin(1/2) = π/6。答案不是 5π/6，因為 arcsin 只給 [−π/2, π/2] 裡的角。",
      solutionSteps: ["sin(5π/6) = 1/2。", "arcsin(1/2)：[−π/2, π/2] 裡 sin 為 1/2 的角是 π/6。", "答案 π/6。"],
      verify: val("\\arcsin\\left(\\sin\\frac{5\\pi}{6}\\right)") },
    { id: "cg-0c-029", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\arccos\\left(\\cos\\frac{5\\pi}{3}\\right)",
      answer: "pi/3", timeLimit: 55,
      tags: ["inverse-trig-cancel", "inverse-trig"],
      hints: ["arccos 的值域是 [0, π]；5π/3 不在裡面。", "先算 cos(5π/3)，再找 [0, π] 裡 cos 等於它的角。"],
      solution: "cos(5π/3) = cos(π/3) = 1/2。arccos(1/2) = π/3。",
      solutionSteps: ["5π/3 = 2π − π/3，cos(5π/3) = 1/2。", "[0, π] 裡 cos 為 1/2 的角是 π/3。", "答案 π/3。"],
      verify: val("\\arccos\\left(\\cos\\frac{5\\pi}{3}\\right)") },
    { id: "cg-0c-030", topic: "derivatives", rank: 2, answerKind: "expression",
      prompt: "\\text{把 }\\cos(\\arcsin x)\\text{ 寫成 }x\\text{ 的代數式（}-1\\le x\\le 1\\text{）}",
      answer: "sqrt(1-x^2)", timeLimit: 75,
      tags: ["inverse-trig-compose", "inverse-trig"],
      hints: ["令 θ = arcsin x，則 sin θ = x，而且 θ ∈ [−π/2, π/2]。", "在這個範圍裡 cos θ 是正還是負？再用 sin² + cos² = 1。"],
      solution: "θ = arcsin x，sin θ = x，θ ∈ [−π/2, π/2] 所以 cos θ ≥ 0。cos θ = √(1 − sin²θ) = √(1 − x²)。",
      solutionSteps: ["令 θ = arcsin x：sin θ = x，θ ∈ [−π/2, π/2]。", "這個範圍內 cos θ ≥ 0，所以 cos θ = √(1 − x²)。"],
      verify: { m: "fn", cases: [
        { at: { x: 0.3 }, v: val("\\cos(\\arcsin 0.3)") },
        { at: { x: -0.6 }, v: val("\\cos(\\arcsin(-0.6))") },
        { at: { x: 0.9 }, v: val("\\cos(\\arcsin 0.9)") }] } },
    { id: "cg-0c-031", topic: "derivatives", rank: 2, answerKind: "expression",
      prompt: "\\text{把 }\\tan(\\arccos x)\\text{ 寫成 }x\\text{ 的代數式（}0<x\\le 1\\text{）}",
      answer: "sqrt(1-x^2)/x", timeLimit: 80,
      tags: ["inverse-trig-compose", "inverse-trig"],
      hints: ["令 θ = arccos x，則 cos θ = x，θ ∈ [0, π]。", "先求 sin θ（這個範圍內 sin θ ≥ 0），再算 sin θ / cos θ。"],
      solution: "θ = arccos x，cos θ = x，θ ∈ [0, π] 所以 sin θ = √(1 − x²)。tan θ = √(1 − x²)/x。",
      solutionSteps: ["令 θ = arccos x：cos θ = x，θ ∈ [0, π]，sin θ ≥ 0。", "sin θ = √(1 − x²)。", "tan θ = sin θ / cos θ = √(1 − x²)/x。"],
      verify: { m: "fn", cases: [
        { at: { x: 0.5 }, v: val("\\tan(\\arccos 0.5)") },
        { at: { x: 0.8 }, v: val("\\tan(\\arccos 0.8)") },
        { at: { x: 0.25 }, v: val("\\tan(\\arccos 0.25)") }] } }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE,
    difficulty: Math.min(4, problem.rank),
    ...problem
  })));
})();
