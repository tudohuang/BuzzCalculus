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
  N("fd-lim-010", "limits", 1, "\\lim_{x\\to 0}\\frac{\\log(1+4x)}{x}", "4",
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
  E("fd-der-005", "derivatives", 1, "\\frac{d}{dx}\\left(x\\log x\\right)", "log(x)+1",
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
  N("fd-limx-608", "limits", 5, "\\lim_{x\\to 0}\\frac{\\log(\\cos 2x)}{\\log(\\cos 3x)}", "4/9",
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

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
