(function () {
  "use strict";

  // 向量分析補強包：線積分 / Green / 散度定理 / Stokes / 保守場 / 進階 nabla。
  // 2026-07 題庫審計後新增：三大定理原本幾乎為零、nabla 題全是低階直算。
  const SOURCE = "Buzz vector calculus pack";
  const problems = [];

  function add(problem) {
    const rank = problem.rank;
    const tags = [...(problem.tags || []), "multivariable", "vector-calculus", `rank-${rank}`];
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

  function numeric(id, topic, rank, prompt, answer, tags, solution, timeLimit, hints) {
    add({ id, topic, rank, prompt, answerKind: "numeric", answer, tags, solution, timeLimit, hints });
  }

  function text(id, topic, rank, prompt, answers, canonical, tags, solution, timeLimit) {
    add({ id, topic, rank, prompt, answerKind: "text", answers, canonical, tags, solution, timeLimit });
  }

  // ---- 純量場線積分 ----
  numeric("vc-line-001", "integrals", 4,
    "\\int_C x\\,ds,\\quad C:(0,0)\\to(3,4)\\text{ 直線段}",
    "15/2", ["line-integral"],
    "參數化 x=3t, y=4t, ds=5\\,dt，積分 ∫ 3t·5 dt = 15/2。", 90);
  numeric("vc-line-002", "integrals", 4,
    "\\int_C (x^2+y^2)\\,ds,\\quad C: x^2+y^2=4",
    "16*pi", ["line-integral"],
    "在圓上 x²+y²=4 是常數，直接乘以周長 4π 得 16π。", 75);
  numeric("vc-line-003", "integrals", 5,
    "\\int_C x\\,ds,\\quad C: y=x^2,\\ 0\\le x\\le 1",
    "(5*sqrt(5)-1)/12", ["line-integral"],
    "ds=√(1+4x²)dx，令 u=1+4x² 換元得 (5√5−1)/12。", 120);
  numeric("vc-line-004", "integrals", 5,
    "\\int_C z\\,ds,\\quad C:(\\cos t,\\sin t,t),\\ 0\\le t\\le 2\\pi",
    "2*sqrt(2)*pi^2", ["line-integral"],
    "螺旋線 ds=√2 dt，∫₀^{2π} t√2 dt = 2√2 π²。", 110);

  // ---- 向量場線積分（功） ----
  numeric("vc-work-001", "integrals", 4,
    "\\int_C y\\,dx+x\\,dy,\\quad C:(0,0)\\to(2,3)\\text{ 直線段}",
    "6", ["line-integral", "conservative-field"],
    "F=(y,x) 是保守場，位能 f=xy，答案 f(2,3)−f(0,0)=6。", 90);
  numeric("vc-work-002", "integrals", 5,
    "\\oint_C y\\,dx-x\\,dy,\\quad C:\\text{單位圓逆時針}",
    "-2*pi", ["line-integral", "green-theorem"],
    "Green 定理：∂(−x)/∂x−∂y/∂y=−2，乘上面積 π 得 −2π。", 100);
  numeric("vc-work-003", "integrals", 4,
    "\\int_C x^2\\,dx+xy\\,dy,\\quad C: y=x,\\ (0,0)\\to(1,1)",
    "2/3", ["line-integral"],
    "代 x=t, y=t：∫₀¹ (t²+t²)dt = 2/3。", 90);
  numeric("vc-work-004", "integrals", 5,
    "\\int_C y^2\\,dx+x^2\\,dy,\\quad C: y=x^2,\\ (0,0)\\to(1,1)",
    "7/10", ["line-integral"],
    "代 y=x²：∫₀¹ x⁴dx + x²·2x dx = 1/5 + 1/2 = 7/10。", 110);

  // ---- 保守場與位能 ----
  numeric("vc-cons-001", "integrals", 4,
    "\\int_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle 2xy+1,\\ x^2\\rangle,\\ C:(0,0)\\to(1,2)",
    "3", ["conservative-field", "line-integral"],
    "F 保守，位能 f=x²y+x，f(1,2)−f(0,0)=3。", 100);
  numeric("vc-cons-002", "integrals", 5,
    "\\int_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle e^x\\sin y,\\ e^x\\cos y\\rangle,\\ C:(0,0)\\to(0,\\tfrac{\\pi}{2})",
    "1", ["conservative-field", "line-integral"],
    "位能 f=eˣ sin y，f(0,π/2)−f(0,0)=1−0=1。", 110);
  numeric("vc-cons-003", "derivatives", 4,
    "\\mathbf{F}=\\langle a\\,xy,\\ x^2+2y\\rangle\\text{ 為保守場，求 }a",
    "2", ["conservative-field", "nabla"],
    "保守要求 ∂P/∂y=∂Q/∂x：ax=2x，所以 a=2。", 80);
  numeric("vc-cons-004", "integrals", 5,
    "\\int_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle y^2,\\ 2xy+3y^2\\rangle,\\ C:(1,1)\\to(2,2)",
    "14", ["conservative-field", "line-integral"],
    "位能 f=xy²+y³，f(2,2)−f(1,1)=16−2=14。", 110);

  // ---- Green 定理 ----
  numeric("vc-green-001", "integrals", 4,
    "\\oint_C x\\,dy-y\\,dx,\\quad C:\\text{三角形 }(0,0),(2,0),(0,3)\\text{ 逆時針}",
    "6", ["green-theorem", "line-integral"],
    "∮x dy−y dx = 2×面積 = 2×3 = 6。", 90);
  numeric("vc-green-002", "integrals", 4,
    "\\oint_C (x-y)\\,dx+(x+y)\\,dy,\\quad C:\\text{單位圓逆時針}",
    "2*pi", ["green-theorem", "line-integral"],
    "Green：∂Q/∂x−∂P/∂y = 1−(−1) = 2，乘面積 π。", 90);
  numeric("vc-green-003", "integrals", 4,
    "\\oint_C y^2\\,dx+x^2\\,dy,\\quad C:\\text{正方形 }[0,1]^2\\text{ 逆時針}",
    "0", ["green-theorem", "line-integral"],
    "Green 給 ∬(2x−2y)dA，對稱區域上抵銷為 0。", 90);
  numeric("vc-green-004", "integrals", 5,
    "\\oint_C xy\\,dx+x^2\\,dy,\\quad C:\\text{正方形 }[0,1]^2\\text{ 逆時針}",
    "1/2", ["green-theorem", "line-integral"],
    "旋度 2x−x=x，∬₀¹∬₀¹ x dA = 1/2。", 100);
  numeric("vc-green-005", "integrals", 5,
    "\\oint_C -y^3\\,dx+x^3\\,dy,\\quad C:\\text{單位圓逆時針}",
    "3*pi/2", ["green-theorem", "line-integral", "polar-coordinates"],
    "旋度 3x²+3y²=3r²，極座標 ∬3r²·r dr dθ = 3π/2。", 110);
  numeric("vc-green-006", "integrals", 4,
    "\\text{用 }\\tfrac12\\oint_C x\\,dy-y\\,dx\\text{ 求橢圓 }x=3\\cos t,\\ y=2\\sin t\\text{ 的面積}",
    "6*pi", ["green-theorem", "area"],
    "面積公式給 ½∮(3cos t·2cos t+2sin t·3sin t)dt = ½·6·2π = 6π。", 100);
  numeric("vc-green-007", "integrals", 5,
    "\\oint_C \\left(e^{x^2}-y\\right)dx+\\left(x+\\ln(1+y^2)\\right)dy,\\quad C:\\text{單位圓逆時針}",
    "2*pi", ["green-theorem", "line-integral"],
    "難算的項都被 Green 消掉：旋度 = 1−(−1) = 2，答案 2π。", 110);
  numeric("vc-green-008", "integrals", 5,
    "\\oint_C xy^2\\,dx+(x^2y+x)\\,dy,\\quad C: x^2+y^2=9\\text{ 逆時針}",
    "9*pi", ["green-theorem", "line-integral"],
    "旋度 = 2xy+1−2xy = 1，等於區域面積 9π。", 110);

  // ---- Green 通量形式（2D 散度） ----
  numeric("vc-flux-001", "integrals", 4,
    "\\mathbf{F}=\\langle x,y\\rangle\\text{ 穿出單位圓的通量 }\\oint_C \\mathbf{F}\\cdot\\mathbf{n}\\,ds",
    "2*pi", ["flux", "green-theorem"],
    "通量形式：∬ div F dA = ∬2 dA = 2π。", 90);
  numeric("vc-flux-002", "integrals", 5,
    "\\mathbf{F}=\\langle x^3,y^3\\rangle\\text{ 穿出單位圓的通量}",
    "3*pi/2", ["flux", "green-theorem", "polar-coordinates"],
    "div F = 3x²+3y²，極座標積分得 3π/2。", 110);

  // ---- 面積分 ----
  numeric("vc-surf-001", "integrals", 5,
    "\\iint_S z\\,dS,\\quad S:\\text{上半球面 }x^2+y^2+z^2=1,\\ z\\ge 0",
    "pi", ["surface-integral"],
    "球座標 z=cos φ, dS=sin φ dφ dθ，∫₀^{2π}∫₀^{π/2} cosφ sinφ = π。", 120);
  numeric("vc-surf-002", "integrals", 5,
    "\\iint_S (x^2+y^2)\\,dS,\\quad S:\\text{圓柱側面 }x^2+y^2=4,\\ 0\\le z\\le 3",
    "48*pi", ["surface-integral"],
    "側面上 x²+y²=4 為常數，乘側面積 2π·2·3 = 12π 得 48π。", 110);
  numeric("vc-surf-003", "integrals", 6,
    "z=x^2+y^2\\ (z\\le 1)\\text{ 的曲面面積}",
    "pi*(5*sqrt(5)-1)/6", ["surface-integral", "surface-area", "polar-coordinates"],
    "dS=√(1+4r²) r dr dθ，換元得 π(5√5−1)/6。", 150);

  // ---- 散度定理 ----
  numeric("vc-div-001", "integrals", 4,
    "\\mathbf{F}=\\langle x,y,z\\rangle\\text{ 穿出單位球面的通量}",
    "4*pi", ["divergence-theorem", "flux"],
    "div F = 3，乘球體積 4π/3 得 4π。", 90);
  numeric("vc-div-002", "integrals", 5,
    "\\mathbf{F}=\\langle x^3,y^3,z^3\\rangle\\text{ 穿出單位球面的通量}",
    "12*pi/5", ["divergence-theorem", "flux"],
    "div F = 3r²，球座標 ∫₀¹ 3r²·4πr² dr = 12π/5。", 130);
  numeric("vc-div-003", "integrals", 4,
    "\\mathbf{F}=\\langle xy,yz,zx\\rangle\\text{ 穿出正方體 }[0,1]^3\\text{ 的通量}",
    "3/2", ["divergence-theorem", "flux"],
    "div F = y+z+x，∭ (x+y+z) dV = 3·(1/2) = 3/2。", 100);
  numeric("vc-div-004", "integrals", 4,
    "\\mathbf{F}=\\langle x^2,y^2,z^2\\rangle\\text{ 穿出正方體 }[0,1]^3\\text{ 的通量}",
    "3", ["divergence-theorem", "flux"],
    "div F = 2(x+y+z)，∭ = 2·3/2 = 3。", 100);
  numeric("vc-div-005", "integrals", 5,
    "\\mathbf{F}=\\langle x+\\sin z,\\ y+e^{z},\\ z+\\cos x\\rangle\\text{ 穿出球面 }x^2+y^2+z^2=4\\text{ 的通量}",
    "32*pi", ["divergence-theorem", "flux"],
    "sin z、e^z、cos x 對散度沒貢獻：div F = 3，乘體積 32π/3 得 32π。", 120);
  numeric("vc-div-006", "integrals", 6,
    "\\mathbf{F}=\\frac{\\langle x,y,z\\rangle}{(x^2+y^2+z^2)^{3/2}}\\text{ 穿出球面 }x^2+y^2+z^2=25\\text{ 的通量}",
    "4*pi", ["divergence-theorem", "flux"],
    "反平方場對任何包住原點的封閉面通量都是 4π（原點是奇點，不能直接用散度定理塞 0）。", 140);
  numeric("vc-div-007", "integrals", 5,
    "\\mathbf{F}=\\langle 0,0,z^2\\rangle\\text{ 穿出封閉圓柱 }x^2+y^2\\le 1,\\ 0\\le z\\le 2\\text{ 的通量}",
    "4*pi", ["divergence-theorem", "flux"],
    "div F = 2z，∭ 2z dV = π·[z²]₀² = 4π。", 120);

  // ---- Stokes 定理 ----
  numeric("vc-stokes-001", "integrals", 4,
    "\\oint_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle -y,x,z\\rangle,\\ C: x^2+y^2=1,\\ z=0\\text{ 逆時針}",
    "2*pi", ["stokes-theorem", "line-integral"],
    "curl F = (0,0,2)，穿過單位圓盤的通量 2π。", 100);
  numeric("vc-stokes-002", "integrals", 5,
    "\\oint_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle z,x,y\\rangle,\\ C: x^2+y^2=1,\\ z=1\\text{ 逆時針（由上往下看）}",
    "pi", ["stokes-theorem", "line-integral"],
    "curl F = (1,1,1)，取法向 ẑ 的圓盤：通量 = 1·π = π。", 120);
  numeric("vc-stokes-003", "integrals", 5,
    "\\oint_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle y,z,x\\rangle,\\ C: x^2+y^2=4,\\ z=0\\text{ 逆時針}",
    "-4*pi", ["stokes-theorem", "line-integral"],
    "curl F = (−1,−1,−1)，法向 ẑ 分量 −1，乘面積 4π 得 −4π。", 120);
  numeric("vc-stokes-004", "integrals", 6,
    "\\oint_C y^2dx+z^2dy+x^2dz,\\quad C:\\text{三角形 }(1,0,0)\\to(0,1,0)\\to(0,0,1)\\to(1,0,0)",
    "-1", ["stokes-theorem", "line-integral"],
    "curl F = −2(z,x,y)，在平面 x+y+z=1 上 curl·n = −2/√3，乘三角形面積 √3/2 得 −1。", 160);
  numeric("vc-stokes-005", "integrals", 5,
    "\\iint_S (\\nabla\\times\\mathbf{F})\\cdot d\\mathbf{S},\\ \\mathbf{F}=\\langle -y,x,0\\rangle,\\ S:\\text{上半球面 }x^2+y^2+z^2=1\\text{（法向朝上）}",
    "2*pi", ["stokes-theorem", "surface-integral"],
    "Stokes：換成沿赤道的線積分 ∮−y dx+x dy = 2π，不必真的在球面上積。", 130);
  numeric("vc-stokes-006", "integrals", 6,
    "\\oint_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle y,-x,z^2\\rangle,\\ C: x^2+y^2=4,\\ z=3\\text{ 逆時針（由上往下看）}",
    "-8*pi", ["stokes-theorem", "line-integral"],
    "curl F = (0,0,−2)，乘圓盤面積 4π 得 −8π；z² 項完全不影響。", 140);

  // ---- 進階 nabla ----
  numeric("vc-nab-001", "derivatives", 5,
    "\\nabla^2\\left(\\frac{1}{\\sqrt{x^2+y^2+z^2}}\\right)\\text{ at }(1,2,2)",
    "0", ["nabla", "laplacian"],
    "1/r 在原點以外是調和函數：∇²(1/r)=0。", 110);
  numeric("vc-nab-002", "derivatives", 4,
    "\\nabla^2(x^2+y^2+z^2)",
    "6", ["nabla", "laplacian"],
    "每個變數貢獻 2，共 6。", 60);
  numeric("vc-nab-003", "derivatives", 6,
    "\\nabla\\cdot\\left(\\frac{\\langle x,y,z\\rangle}{\\sqrt{x^2+y^2+z^2}}\\right)\\text{ at }(2,1,2)",
    "2/3", ["nabla", "vector-identity"],
    "∇·(r̂) = 2/r（用 ∇·(rf(r)) = 3f + rf'），r=3 得 2/3。", 140);
  numeric("vc-nab-004", "derivatives", 4,
    "\\left|\\nabla\\times(\\nabla f)\\right|,\\quad f=x^2y+z^3",
    "0", ["nabla", "vector-identity"],
    "梯度場的旋度恆為零：∇×∇f = 0。", 60);
  numeric("vc-nab-005", "derivatives", 4,
    "\\nabla\\cdot(\\nabla\\times\\mathbf{F}),\\quad \\mathbf{F}=\\langle xyz,\\ x+y+z,\\ x^2y^2\\rangle",
    "0", ["nabla", "vector-identity"],
    "旋度場的散度恆為零：∇·(∇×F) = 0。", 60);
  numeric("vc-nab-006", "derivatives", 4,
    "f=x^2y+z\\text{ 在 }(1,2,0)\\text{ 的最大方向導數}",
    "3*sqrt(2)", ["nabla", "directional-derivative"],
    "最大方向導數 = |∇f| = |(4,1,1)| = √18 = 3√2。", 90);
  numeric("vc-nab-007", "derivatives", 5,
    "f=\\ln(x^2+y^2)\\text{ 在 }(1,1)\\text{ 沿指向 }(2,3)\\text{ 方向的方向導數}",
    "3/sqrt(5)", ["nabla", "directional-derivative"],
    "∇f(1,1)=(1,1)，方向 (1,2)/√5，內積 3/√5。", 120);
  numeric("vc-nab-008", "derivatives", 4,
    "\\nabla^2(x^2y^3)\\text{ at }(1,1)",
    "8", ["nabla", "laplacian"],
    "f_xx = 2y³ = 2，f_yy = 6x²y = 6，相加 8。", 80);
  numeric("vc-nab-009", "derivatives", 5,
    "\\nabla^2(x^3y-xy^3)\\text{ at }(5,7)",
    "0", ["nabla", "laplacian"],
    "f_xx = 6xy，f_yy = −6xy，處處相消：這是調和函數。", 100);
  numeric("vc-nab-010", "derivatives", 5,
    "\\nabla\\cdot(f\\mathbf{F})\\text{ at }(1,2,3),\\quad f=x,\\ \\mathbf{F}=\\langle y,z,x\\rangle",
    "2", ["nabla", "vector-identity"],
    "∇·(fF) = f∇·F + ∇f·F = x·0 + (1,0,0)·(y,z,x) = y = 2。", 120);
  numeric("vc-nab-011", "derivatives", 5,
    "\\left|\\nabla\\times\\mathbf{F}\\right|,\\quad \\mathbf{F}=\\langle yz,\\ zx,\\ xy\\rangle",
    "0", ["nabla", "vector-identity", "conservative-field"],
    "F = ∇(xyz) 是梯度場，旋度為零。", 100);
  numeric("vc-nab-012", "derivatives", 4,
    "\\left|\\nabla\\times\\mathbf{F}\\right|\\text{ at }(1,2,0),\\quad \\mathbf{F}=\\langle -y^2,\\ x^2,\\ 0\\rangle",
    "6", ["nabla", "vector-identity"],
    "curl F = (0,0,2x+2y)，在 (1,2) 得 |6| = 6。", 90);

  // ---- 定理辨識 ----
  text("vc-rec-001", "integrals", 4,
    "\\text{封閉曲面上的通量 }\\oiint_S \\mathbf{F}\\cdot d\\mathbf{S}\\text{ 最適合用哪個定理化成體積分？}",
    ["divergence theorem", "divergence", "gauss", "散度定理", "高斯定理", "高斯"],
    "divergence theorem",
    ["technique-recognition", "divergence-theorem"],
    "封閉曲面 → 散度（高斯）定理，把通量換成 ∭ div F dV。", 45);
  text("vc-rec-002", "integrals", 4,
    "\\text{平面封閉曲線上的環流 }\\oint_C P\\,dx+Q\\,dy\\text{ 最適合用哪個定理化成二重積分？}",
    ["green", "green theorem", "green's theorem", "格林定理", "格林"],
    "green theorem",
    ["technique-recognition", "green-theorem"],
    "平面封閉曲線 → Green 定理，∮ = ∬(Q_x − P_y) dA。", 45);

  /* ═══════════ 提示 ═══════════
     只寫給 R5 以上、而且原本一條提示都沒有的題。
     這一區的提示特別容易寫成罐頭（「用 Green 定理」對整包都成立），
     所以第一層寫的是「這一題為什麼不該硬算」，第二層才是關鍵那一步。 */
  const HINTS = {
    "vc-green-001": [
      "先用 Green 算一下這個被積式的旋度 —— 你會發現它是個常數，而且這個組合有特別的身分。",
      "旋度是常數時，線積分就等於那個常數乘上圍住的面積。三角形的面積用底乘高除以 2。"
    ],
    "vc-green-003": [
      "用 Green 換成二重積分，先算旋度 ∂Q/∂x − ∂P/∂y。",
      "旋度會長成 2x − 2y。在正方形這種對 x 與 y 對稱的區域上，這兩項的積分一樣大。"
    ],
    "vc-green-004": [
      "Green 定理：旋度是 ∂(x²)/∂x 減掉 ∂(xy)/∂y。",
      "化簡之後旋度只剩下一個變數。在單位正方形上積分，等於那個變數在 [0,1] 上的平均。"
    ],
    "vc-green-005": [
      "算出來的旋度會是 3x² + 3y² —— 看到 x²+y² 就該換極座標。",
      "極座標下旋度變成 3r²，別忘了面積元素還要再乘一個 r。"
    ],
    "vc-green-006": [
      "½∮(x dy − y dx) 這個組合算出來剛好就是圍住的面積 —— 直接把參數式代進去。",
      "代入後被積式會靠 cos²+sin² 併成一個常數，再乘上參數走一圈的長度。"
    ],
    "vc-green-007": [
      "e^{x²} 與 ln(1+y²) 都沒有初等原函數。題目把它們放進來，就是在告訴你不要直接算線積分。",
      "用 Green 之後，那兩個難算的項一個對 x 微分、一個對 y 微分，全部消失，只剩常數旋度。"
    ],
    "vc-green-008": [
      "先算旋度：∂(x²y+x)/∂x 減掉 ∂(xy²)/∂y。",
      "兩個 2xy 會抵消，只剩下一個常數。常數旋度乘上圓的面積就是答案。"
    ],
    "vc-flux-001": [
      "通量形式的 Green 定理用的是**散度**，不是旋度 —— 先確認自己拿的是哪一個。",
      "div F 是常數，所以通量等於那個常數乘上圓的面積。"
    ],
    "vc-flux-002": [
      "先算散度，會得到 3x² + 3y²，又是 x²+y² 的形狀。",
      "換極座標之後散度變成 3r²，面積元素再乘一個 r。"
    ],
    "vc-surf-003": [
      "曲面面積是 ∬√(1 + z_x² + z_y²) dA，先把兩個偏導數算出來。",
      "根號裡會化成 1 + 4r²。換極座標之後，對 r 的那一段用 u = 1 + 4r² 換元。"
    ],
    "vc-stokes-001": [
      "先算 curl F —— 它會是一個常向量，這題就不必真的沿曲線積分。",
      "常向量穿過圓盤的通量，等於它的 z 分量乘上圓盤面積。"
    ],
    "vc-stokes-002": [
      "算出來的 curl F 三個分量都是 1。",
      "只有跟曲面法向同方向的那個分量有貢獻；取 ẑ 當法向時，只剩一個分量在算。"
    ],
    "vc-stokes-003": [
      "curl F 的三個分量都一樣，而且都是負的 —— 先把它算出來。",
      "取 ẑ 當法向時只有 z 分量有貢獻。注意這題的半徑不是 1，面積要重算。"
    ],
    "vc-stokes-004": [
      "curl F 會是 −2(z, x, y)。曲面就取平面 x+y+z=1 被那個三角形圍住的那一塊。",
      "那個平面的單位法向是 (1,1,1)/√3，內積之後 curl·n 是個常數；三角形的面積是 √3/2。"
    ],
    "vc-stokes-005": [
      "不要真的在球面上積分。Stokes 定理讓你把曲面積分換成沿邊界的線積分。",
      "邊界就是赤道那個圓。參數化之後，線積分短到幾行就結束。"
    ],
    "vc-stokes-006": [
      "先算 curl F，並且確認 z² 那一項對旋度完全沒有貢獻。",
      "剩下的旋度是常向量，乘上圓盤面積即可。注意半徑不是 1。"
    ]
  };

  problems.forEach((problem) => {
    if (HINTS[problem.id]) problem.hints = HINTS[problem.id];
  });

  // ---- 獨立驗算規格（tools/verify_answers.js 讀）----
  //
  // 每條都把題幹的曲線／曲面寫成參數式，驗算端只做數值微分＋數值積分 ——
  // 完全不用 Green / Stokes / 散度定理，跟解題的推導共用不到任何一步。
  // 參數化是題幹的重述（那條線／那塊面本來就是那個東西），不是解法。
  // 封閉曲面的法向要指向外側（r_u × r_v 的方向由參數順序決定）。
  const SPHERE = (r) => ({ x: `${r}\\sin u\\cos v`, y: `${r}\\sin u\\sin v`, z: `${r}\\cos u`, u: [0, "\\pi"], v: [0, "2\\pi"] });
  const CUBE_FACES = [
    { x: "1", y: "u", z: "v", u: [0, 1], v: [0, 1] },
    { x: "0", y: "v", z: "u", u: [0, 1], v: [0, 1] },
    { x: "v", y: "1", z: "u", u: [0, 1], v: [0, 1] },
    { x: "u", y: "0", z: "v", u: [0, 1], v: [0, 1] },
    { x: "u", y: "v", z: "1", u: [0, 1], v: [0, 1] },
    { x: "v", y: "u", z: "0", u: [0, 1], v: [0, 1] }
  ];
  const UNIT_CIRCLE = { x: "\\cos t", y: "\\sin t", from: 0, to: "2\\pi" };
  const VERIFY = {
    "vc-line-001": { m: "lineIntegral", kind: "ds", f: "x", path: { x: "3t", y: "4t", from: 0, to: 1 } },
    "vc-line-002": { m: "lineIntegral", kind: "ds", f: "x^2+y^2", path: { x: "2\\cos t", y: "2\\sin t", from: 0, to: "2\\pi" } },
    "vc-line-003": { m: "lineIntegral", kind: "ds", f: "x", path: { x: "t", y: "t^2", from: 0, to: 1 } },
    "vc-line-004": { m: "lineIntegral", kind: "ds", f: "z", path: { x: "\\cos t", y: "\\sin t", z: "t", from: 0, to: "2\\pi" } },
    "vc-work-001": { m: "lineIntegral", kind: "work", F: ["y", "x"], path: { x: "2t", y: "3t", from: 0, to: 1 } },
    "vc-work-002": { m: "lineIntegral", kind: "work", F: ["y", "-x"], path: UNIT_CIRCLE },
    "vc-work-003": { m: "lineIntegral", kind: "work", F: ["x^2", "xy"], path: { x: "t", y: "t", from: 0, to: 1 } },
    "vc-work-004": { m: "lineIntegral", kind: "work", F: ["y^2", "x^2"], path: { x: "t", y: "t^2", from: 0, to: 1 } },
    "vc-cons-001": { m: "lineIntegral", kind: "work", F: ["2xy+1", "x^2"], path: { x: "t", y: "2t", from: 0, to: 1 } },
    "vc-cons-002": { m: "lineIntegral", kind: "work", F: ["e^x\\sin y", "e^x\\cos y"], path: { x: "0", y: "\\pi t/2", from: 0, to: 1 } },
    "vc-cons-004": { m: "lineIntegral", kind: "work", F: ["y^2", "2xy+3y^2"], path: { x: "1+t", y: "1+t", from: 0, to: 1 } },
    "vc-green-001": { m: "lineIntegral", kind: "work", F: ["-y", "x"], paths: [
      { x: "2t", y: "0", from: 0, to: 1 },
      { x: "2-2t", y: "3t", from: 0, to: 1 },
      { x: "0", y: "3-3t", from: 0, to: 1 }
    ] },
    "vc-green-002": { m: "lineIntegral", kind: "work", F: ["x-y", "x+y"], path: UNIT_CIRCLE },
    "vc-green-003": { m: "lineIntegral", kind: "work", F: ["y^2", "x^2"], paths: [
      { x: "t", y: "0", from: 0, to: 1 },
      { x: "1", y: "t", from: 0, to: 1 },
      { x: "1-t", y: "1", from: 0, to: 1 },
      { x: "0", y: "1-t", from: 0, to: 1 }
    ] },
    "vc-green-004": { m: "lineIntegral", kind: "work", F: ["xy", "x^2"], paths: [
      { x: "t", y: "0", from: 0, to: 1 },
      { x: "1", y: "t", from: 0, to: 1 },
      { x: "1-t", y: "1", from: 0, to: 1 },
      { x: "0", y: "1-t", from: 0, to: 1 }
    ] },
    "vc-green-005": { m: "lineIntegral", kind: "work", F: ["-y^3", "x^3"], path: UNIT_CIRCLE },
    "vc-green-006": { m: "lineIntegral", kind: "work", F: ["-y/2", "x/2"], path: { x: "3\\cos t", y: "2\\sin t", from: 0, to: "2\\pi" } },
    "vc-green-007": { m: "lineIntegral", kind: "work", F: ["e^{x^2}-y", "x+\\ln(1+y^2)"], path: UNIT_CIRCLE },
    "vc-green-008": { m: "lineIntegral", kind: "work", F: ["xy^2", "x^2y+x"], path: { x: "3\\cos t", y: "3\\sin t", from: 0, to: "2\\pi" } },
    // 通量 ∮F·n ds = ∮P dy − Q dx，等於向量場 (−Q, P) 的環流 —— 這是恆等式不是解法
    "vc-flux-001": { m: "lineIntegral", kind: "work", F: ["-y", "x"], path: UNIT_CIRCLE },
    "vc-flux-002": { m: "lineIntegral", kind: "work", F: ["-y^3", "x^3"], path: UNIT_CIRCLE },
    "vc-surf-001": { m: "surfaceScalar", f: "z", surface: { x: "\\sin u\\cos v", y: "\\sin u\\sin v", z: "\\cos u", u: [0, "\\pi/2"], v: [0, "2\\pi"] } },
    "vc-surf-002": { m: "surfaceScalar", f: "x^2+y^2", surface: { x: "2\\cos u", y: "2\\sin u", z: "v", u: [0, "2\\pi"], v: [0, 3] } },
    "vc-surf-003": { m: "surfaceScalar", f: "1", surface: { x: "u\\cos v", y: "u\\sin v", z: "u^2", u: [0, 1], v: [0, "2\\pi"] } },
    "vc-div-001": { m: "surfaceFlux", F: ["x", "y", "z"], surface: SPHERE(1) },
    "vc-div-002": { m: "surfaceFlux", F: ["x^3", "y^3", "z^3"], surface: SPHERE(1) },
    "vc-div-003": { m: "surfaceFlux", F: ["xy", "yz", "zx"], surfaces: CUBE_FACES },
    "vc-div-004": { m: "surfaceFlux", F: ["x^2", "y^2", "z^2"], surfaces: CUBE_FACES },
    "vc-div-005": { m: "surfaceFlux", F: ["x+\\sin z", "y+e^{z}", "z+\\cos x"], surface: SPHERE(2) },
    "vc-div-006": { m: "surfaceFlux", F: ["\\frac{x}{(x^2+y^2+z^2)^{3/2}}", "\\frac{y}{(x^2+y^2+z^2)^{3/2}}", "\\frac{z}{(x^2+y^2+z^2)^{3/2}}"], surface: SPHERE(5) },
    "vc-div-007": { m: "surfaceFlux", F: ["0", "0", "z^2"], surfaces: [
      { x: "\\cos u", y: "\\sin u", z: "v", u: [0, "2\\pi"], v: [0, 2] },
      { x: "u\\cos v", y: "u\\sin v", z: "2", u: [0, 1], v: [0, "2\\pi"] },
      { x: "u\\sin v", y: "u\\cos v", z: "0", u: [0, 1], v: [0, "2\\pi"] }
    ] },
    "vc-stokes-001": { m: "lineIntegral", kind: "work", F: ["-y", "x", "z"], path: { x: "\\cos t", y: "\\sin t", z: "0", from: 0, to: "2\\pi" } },
    "vc-stokes-002": { m: "lineIntegral", kind: "work", F: ["z", "x", "y"], path: { x: "\\cos t", y: "\\sin t", z: "1", from: 0, to: "2\\pi" } },
    "vc-stokes-003": { m: "lineIntegral", kind: "work", F: ["y", "z", "x"], path: { x: "2\\cos t", y: "2\\sin t", z: "0", from: 0, to: "2\\pi" } },
    "vc-stokes-004": { m: "lineIntegral", kind: "work", F: ["y^2", "z^2", "x^2"], paths: [
      { x: "1-t", y: "t", z: "0", from: 0, to: 1 },
      { x: "0", y: "1-t", z: "t", from: 0, to: 1 },
      { x: "t", y: "0", z: "1-t", from: 0, to: 1 }
    ] },
    "vc-stokes-005": { m: "curlFlux", F: ["-y", "x", "0"], surface: { x: "\\sin u\\cos v", y: "\\sin u\\sin v", z: "\\cos u", u: [0, "\\pi/2"], v: [0, "2\\pi"] } },
    "vc-stokes-006": { m: "lineIntegral", kind: "work", F: ["y", "-x", "z^2"], path: { x: "2\\cos t", y: "2\\sin t", z: "3", from: 0, to: "2\\pi" } }
  };
  problems.forEach((problem) => {
    if (VERIFY[problem.id]) problem.verify = VERIFY[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
