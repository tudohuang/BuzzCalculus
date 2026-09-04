// 人工複核過的難度。**這個檔案是手改的**，跟 rubric.js 相反。
//
// rubric.js 是 tools/recalibrate_rubric.js 的產物，每次重跑都會被覆寫。
// 這裡放的是「有人真的看過這一題，並且對這個難度負責」的判斷，
// 重推工具會原封不動沿用，不會覆寫。
//
// 每一筆都必須寫理由，而且理由要說得出**為什麼**——
// 「作者覺得很難」不是理由（spec 05.1）。
//
// 什麼時候該加一筆進來：機器推導明顯錯了，而且你知道錯在哪。
// 目前的來源是 reports/rank-review.json（降三級以上的題），
// 逐題看過之後把判斷寫回這裡。

(function () {
  "use strict";

  const REVIEWED = {
    "app-003": { axes: [2, 2, 2], why: "曲率半徑要先記得 κ=|y''|/(1+y'²)^{3/2} 這個公式，再代點。公式本身課本有但學生常忘。" },
    "app-010": { axes: [3, 1, 3], why: "圓錐體積要先用球的半徑把高與底半徑綁起來，化成單變數再微分求極值，最後還要驗證是最大值。翻譯題意本身就是一步。" },
    "app-012": { axes: [3, 2, 3], why: "y=log x 的最大曲率：先寫出曲率公式，再對它微分求極值。兩層微分加上一次極值判定。" },
    "burst-boss2-ser-003": { axes: [2, 3, 2], why: "Σ(−1)ⁿ⁺¹/n⁴ = 7π⁴/720。問的是**和**不是收斂性，要知道 η(s) 與 ζ(s) 的關係。標籤只寫 alternating 低估了它。" },
    "burst-boss2-ser-004": { axes: [2, 3, 2], why: "Σ(−1)ⁿ⁺¹/n⁶ 同上，要用 η(6)=(1−2^{−5})ζ(6)。" },
    "burst-boss3-int-005": { axes: [3, 3, 2], why: "∫₀^π x log(sin x)dx 要用 x→π−x 的對稱性把 x 換掉，再接上已知的 ∫₀^π log(sin x)dx。兩層技巧都要先認出來。" },
    "cx-arc-005": { axes: [2, 1, 2], why: "弧長公式代進去之後要看出 √(1+sinh²x)=cosh x 才積得動，不是純代公式。" },
    "depth-int-009": { axes: [2, 2, 2], why: "∫sin(log x)dx 要先換元再做循環分部，兩個技巧串接。" },
    "depth-int-021": { axes: [2, 2, 2], why: "∫₀^π sin⁴x dx 要用兩次降冪或 Wallis 公式，標籤只寫 trig-integral 低估了它。" },
    "der-077": { axes: [1, 1, 1], why: "|1+i| = √2。複數模長的定義，一眼題。以前因為帶 complex 標籤被地板抬到 R6。" },
    "der-078": { axes: [1, 1, 1], why: "(1+i)⁴ = −4。展開兩次就好，同樣是被 complex 標籤誤抬的。" },
    "exam-der-016": { axes: [2, 2, 1], why: "(f⁻¹)'(1)=1/f'(0) 要先認出這是反函數微分，而不是真的去解出反函數。" },
    "exam-der-018": { axes: [2, 1, 1], why: "d/dx log(sec x+tan x) = sec x。要記得 sec、tan 的導數再化簡，是經典題但不是一眼題。" },
    "exam-int-005": { axes: [1, 1, 1], why: "∫log x/x dx，u=log x 一眼可見。" },
    "exam-int-015": { axes: [1, 1, 2], why: "∫dx/(x log x) 的 u=log x 藏在分母，比 ∫log x/x dx 難看出來。" },
    "exam-int-016": { axes: [1, 1, 1], why: "∫cos(log x)/x dx，同樣是 u=log x，分母的 1/x 就是 du。" },
    "exam-int-018": { axes: [1, 1, 2], why: "∫x/(x⁴+1)dx 要看出 u=x² 才會變成 arctan。" },
    "exam-int-021": { axes: [1, 1, 1], why: "∫₀¹x/(1+x²)dx，u=1+x² 一眼可見，答案 log2/2。" },
    "exam-int-028": { axes: [2, 1, 2], why: "∫₀¹x log(1+x²)dx 先換元再分部，兩個技巧串在一起。" },
    "hc-rad-010": { axes: [1, 1, 2], why: "∫₀¹x/√(1−x⁴)dx 要看出 u=x² 之後才是 arcsin 的形式。" },
    "hc-usub-004": { axes: [1, 1, 2], why: "∫x²/(1+x⁶)dx 要看出 u=x³ 才會變成 arctan。看出代換是這題的全部內容，不是一眼題。" },
    "hd-011": { axes: [2, 1, 1], why: "d/dx log tan(x/2) = csc x。鏈鎖律加上化簡，比單純的鏈鎖律多一步。" },
    "putnam-009": { axes: [3, 3, 3], why: "∫₀^∞dx/((1+x²)(1+x³)) 是經典難題，直接部分分式會爆炸，要用 x→1/x 的對稱性。" },
    "rel-hard-der-004": { axes: [2, 2, 2], why: "y=log x 在 x=1 的曲率要代曲率公式，公式本身課本有但學生常忘。" },
    "rel-hard-ser-010": { axes: [2, 1, 2], why: "Σn^n/n! 用比值判別會遇到 (1+1/n)^n → e，要知道那個極限才判得出發散。" },
    "uni-int-007": { axes: [2, 2, 2], why: "∫sec⁴x dx 要用 sec²=1+tan² 拆開再換元，不是背公式就好。" },
    "uni-lim-010": { axes: [2, 2, 2], why: "(arctan x − arcsin x)/x³ 要把兩個反三角函數都展到 x³ 再相減，展錯一個係數就全錯。" },
    "world-031": { axes: [2, 3, 3], why: "∫₀^∞ x/sinh x dx = π²/4。要把 1/sinh 展成幾何級數再逐項積分，屬於要先認出結構的那一類。標籤只寫 trig 是不夠的。" },
    "world-059": { axes: [2, 2, 3], why: "∫₀¹dx/(1+x³) 的分母是 (1+x)(x²−x+1)，拆完還要配方湊 arctan，代數量不小。" },
    "world-080": { axes: [3, 3, 3], why: "∫₀^∞dx/(1+x²+x⁴) 要先看出 x⁴+x²+1=(x²+x+1)(x²−x+1) 才拆得開，再各自配方成 arctan。標籤只寫 partial-fraction 抓到的是手法，不是難處。" },
    "world-081": { axes: [2, 2, 2], why: "∫₀^∞ dx/cosh x = π/2。要用 u=e^x 化成 arctan，不是課本第一次教三角積分時會出的題。" },

    // ── 2026-09-04 R5 佔比複核（16.1% vs 目標 13%）────────────────
    // 這批全是從 R5 降下來的：共同的病是「標準課綱技巧被當成 boss」。
    // 判斷基準：這一題的『難』是不是只有一個標準技巧＋機械計算。

    "ser-014": { axes: [2, 2, 1], why: "Σn/2ⁿ 是 Σnxⁿ=x/(1−x)² 的直接代入。對幾何級數微分是課本必教的一步技巧，不是 boss。" },
    "ser-015": { axes: [2, 2, 2], why: "Σn²/2ⁿ 要對幾何級數微分兩次再組合，比 Σn/2ⁿ 多一步，但仍是標準流程。" },
    "exam-lim-008": { axes: [1, 1, 1], why: "lim (x²+1)/(3x²−2x) 是首項係數比，R1 等級的 rational limit。被掛在 R5 純屬標籤事故。" },
    "exam-int-030": { axes: [1, 1, 1], why: "∫₀¹(1−x)⁵dx 一次換元或直接展開，入門題。" },
    "uni-lim-012": { axes: [1, 1, 2], why: "(e^x−1−x)/(1−cos x)：分子分母各自的二階展開都是背誦級，比一下係數就結束。" },
    "depth-lim-005": { axes: [1, 1, 2], why: "(tan x−x)/(x(1−cos x))：兩個標準展開相除，唯一的坑是分母要展對階。" },
    "depth-lim-009": { axes: [1, 1, 2], why: "(sinh x−sin x)/x³：兩個三階展開相減，x³ 項直接出來。" },
    "depth-lim-004": { axes: [2, 1, 2], why: "(cos x−√(1−x²))/x⁴：√(1−x²) 要用二項式展到 x⁴，比純 cos 展開多一層，但仍是機械泰勒。" },
    "rel-adv-002": { axes: [2, 2, 2], why: "e^x 扣掉前四項除 x⁴：泰勒餘項的定義題。冷門度原標 3 高估了——Taylor 是課綱核心。" },
    "rel-hard-lim-003": { axes: [3, 1, 2], why: "log(1+x) 扣到 x⁴ 項：階數多所以步數 3，但每一步都是同一招。" },
    "rel-hard-lim-004": { axes: [3, 1, 2], why: "cosh 展開扣尾巴到 x⁶：同上，長但不難。" },
    "exam-lim-001": { axes: [3, 1, 2], why: "sin(3x) 展開扣尾巴到 x⁵：係數大要小心，但流程單一。" },
    "depth-lim-001": { axes: [3, 1, 2], why: "sin x 扣到 x⁵ 項除 x⁷：泰勒尾巴的極端版，計算長、思路一步。" },
    "uni-int-025": { axes: [1, 1, 2], why: "∫₀^∞dx/(x²+4) 是 arctan 標準式加上無窮上限代值，R2。" },
    "uni-int-014": { axes: [2, 1, 2], why: "∫₀^∞dx/(1+x²)²：一次三角代換或 reduction 公式，標準流程。" },
    "depth-int-019": { axes: [1, 1, 2], why: "∫₀^∞x/(1+x²)²dx：u=1+x² 一眼可見，剩下是冪次積分。" },
    "depth-int-026": { axes: [1, 1, 2], why: "∫₀^∞x³e^{−x²}dx：u=x² 之後是一次分部（或 Γ(2)），標準。" },
    "rel-hard-int-011": { axes: [2, 1, 2], why: "∫₀^∞x/(x⁴+1)dx：u=x² 變 arctan。看出代換就是全部。" },
    "rel-hard-int-004": { axes: [2, 2, 2], why: "∫₀¹x³(log x)²dx：代換 x=e^{−u} 化 Gamma 或分部兩次，流程標準但有長度。" },
    "rel-hard-int-015": { axes: [2, 2, 2], why: "∫₀¹x^{−1/2}log x dx：同上一族，代換＋分部。" },
    "rel-hard-int-018": { axes: [2, 2, 2], why: "∫₀^∞dx/(x²+4)²：reduction 或三角代換，跟 uni-int-014 同難度。" },
    "int-026": { axes: [1, 1, 2], why: "∫₀²∫₀³xy dydx 是可分離的矩形疊積分，多變數的入門第一題。multivariable 地板把它抬到 R5 是標籤事故。" },
    "gap-int-triple-006": { axes: [2, 1, 2], why: "半徑 2 的球體積：套公式或一次球座標積分。" },
    "gap-int-cov-002": { axes: [2, 1, 2], why: "線性變換區域的面積：Jacobian 是常數，算一個 2×2 行列式。" },
    "der-047": { axes: [2, 1, 2], why: "二次型求極小：偏導設零解線性方程組，或直接配方。" },
    "der-048": { axes: [2, 1, 2], why: "同 der-047，係數不同。" },
    "der-045": { axes: [2, 1, 2], why: "df of arctan(y/x)：算兩個偏導數再組合，鏈鎖律的直接應用。" },
    "burst-der-001": { axes: [2, 2, 2], why: "d²⁰/dx²⁰ e^{2x}|₀：認出「n 階導數＝n!·係數」之後就是 2²⁰。認出模式是重點，之後零計算。" },
    "burst-der-002": { axes: [2, 2, 2], why: "d¹⁵/dx¹⁵ sin(3x)|₀：同上，多一個符號週期要數對。" },
    "burst-der-003": { axes: [2, 2, 2], why: "d¹⁸/dx¹⁸ cosh(2x)|₀：同族。" },
    "burst-int-001": { axes: [2, 1, 2], why: "∫₀^∞x⁴e^{−3x}dx = Γ(5)/3⁵：Gamma 函數的定義式代換。" },
    "burst-int-005": { axes: [2, 2, 2], why: "∫₀¹x⁴(log x)²dx：x=e^{−u} 化 Gamma，同 rel-hard-int-004 一族。" },
    "burst-int-006": { axes: [2, 2, 2], why: "∫₀¹x²(log x)³dx：同族。" },
    "burst-int-031": { axes: [2, 1, 2], why: "∫₀^{π/2}sin⁴(2x)dx：降冪兩次或 Wallis，標準三角積分。" },
    "rel-boss-001": { axes: [1, 3, 2], why: "∫₀^∞sin(3x)/x dx：知道 Dirichlet 積分就一眼（縮放不變）。難處只有「認識這個積分」，所以冷門度 3、步數 1。" },
    "hc-spec-006": { axes: [2, 2, 2], why: "∫₀^∞x⁴e^{−2x²}dx：Gaussian 動差，代換＋Γ(5/2)。" },
    "td-int-006": { axes: [2, 2, 2], why: "∫x⁴e^{−3x²}dx 全實軸：同 Gaussian 動差族。" },
    "uni-ser-010": { axes: [1, 2, 2], why: "Σ(−1)ⁿ/(2n+1) = π/4 是 Leibniz 級數，認識它就結束。" },
    "burst-boss-ser-001": { axes: [3, 1, 2], why: "Σn³/2ⁿ：對幾何級數微分三次，長但機械。" },
    "burst-boss-ser-002": { axes: [3, 1, 2], why: "Σn²/3ⁿ：微分兩次，同族。" },
    "depth-ser-011": { axes: [2, 1, 2], why: "1/(1−2x)² 的 x⁵ 係數：二項級數或微分幾何級數，標準。" },
    "burst-rec-001": { axes: [2, 2, 2], why: "I_n=∫₀¹xⁿlog x dx：一次分部就得通式 −1/(n+1)²。" },
    "burst-rec-002": { axes: [2, 2, 2], why: "∫₀¹xⁿ(log x)²dx：分部兩次或對 n 微分，同族。" },
    "mob-tech-011": { axes: [1, 3, 1], why: "「用哪個技巧」的辨識題：答案是 Frullani 這個名字。冷門度高但零計算。" },
    "mob-tech-018": { axes: [1, 3, 1], why: "認出 Bessel 方程的形。概念辨識題。" },
    "mob-bessel-003": { axes: [2, 3, 1], why: "J₀ 的 x² 係數：從定義級數讀第二項。" },
    "mob-bessel-004": { axes: [2, 3, 1], why: "J₁ 的 x 係數：同上。" },
    "mob-bessel-007": { axes: [1, 3, 1], why: "Bessel 方程在 0 的奇點分類：名詞辨識。" },
    "mob-bessel-010": { axes: [1, 3, 1], why: "Bessel 函數的出身（二階 ODE）：常識問答。" },
    "burst-boss-int-005": { axes: [1, 1, 2], why: "∫₀^∞x²/(1+x⁶)dx：u=x³ 一眼變 arctan，π/6·(1/3)。掛 boss 名字的 R2 題。" },
    "burst-boss-int-007": { axes: [1, 1, 2], why: "∫₀^∞x/(1+x⁴)dx：u=x² 一眼變 arctan。" },

    // ── 2026-09-04 rank-review.json 複核（recalibrate --dry 的 183 筆）────
    // 大多數項目 live 已等於特徵推導值（歷史上已校準過），真正待裁決的
    // 只剩下面這批 —— 包括幾題 recalibrate 看走眼的短題幹背誦難題（守住），
    // 和幾題我們自己灌太高的新題（降回誠實的等級，寧缺 R6 不造假 R6）。

    "fd-serx-601": { axes: [2, 3, 2], why: "ζ(8)=π⁸/9450：偶數 zeta 值的背誦題，跟 η(4)/η(6) 同族（那兩題複核為 R5）。recalibrate 只看題幹長度想給 R1 —— 短不等於簡單。" },
    "lm-nr-004": { axes: [1, 3, 2], why: "n/(n!)^{1/n} → e：認識 Stirling（或 Cesàro 平均）就一步。冷門度高、步數低，R4 不是 R6。" },
    "fd-limx-604": { axes: [2, 3, 2], why: "((1+1/n)ⁿ/e)ⁿ → e^{-1/2}：要把 log(1+1/n) 展到二階並追蹤 e 的偏差 —— 二階漸近是課綱邊緣，R5。" },
    "si-int-014": { axes: [2, 1, 1], why: "ln(ln x) 的定義域：兩層「裡面要 >0/>1」的推理，R2。掛在 R4 是集合題地板的誤傷。" },
    "dd-inv-002": { axes: [2, 2, 2], why: "d/dx arctan(x/(1+√(1+x²)))：硬算是重鏈鎖，看出半角恆等式才會化成 1/(2(1+x²))。辨識那一步值 R4，不值 R5。" },
    "dd-inv-007": { axes: [2, 1, 1], why: "d/dx sinh(log x)：鏈鎖＋sinh 定義展開，R2。" },
    "dd-opt-006": { axes: [3, 1, 3], why: "半徑 3 球內接圓柱最大體積：翻譯幾何→單變數→求極值→驗證，跟 app-010（複核 R4）同族。" },
    "ch-nest-009": { axes: [3, 1, 3], why: "√(sin(√(cos x²)))：四層鏈鎖，長且要細心，但每一步都是同一招 —— 計算量大不等於 R6。" },
    "ch-nest-013": { axes: [3, 1, 3], why: "tan(sin(cos(log x)))：同上，機械的深鏈鎖。" },
    "ch-inv-012": { axes: [2, 1, 2], why: "arsinh(sin x²)：鏈鎖＋arsinh′=1/√(1+u²)，兩步。" },
    "lm-sq-006": { axes: [1, 2, 1], why: "lim sin(1/x)：認出震盪不收斂 → dne。概念一步，R2。" },
    "lm-sq-008": { axes: [1, 2, 1], why: "cos x/log x → 0：夾擠的直接應用，R2。" },
    "lm-rc-004": { axes: [2, 2, 2], why: "a_{n+1}=√(1+a_n) → 黃金比：單調有界＋解不動點方程，標準兩步，R4。" },
    "lm-rc-007": { axes: [2, 2, 2], why: "a_{n+1}=cos a_n → Dottie 數：同樣的不動點論證（答案是數值），R4。" },
    "lm-pr-005": { axes: [2, 3, 2], why: "Π cos(π/2^{n+1}) = 2/π（Viète）：要看出乘上 sin 之後的倍角望遠鏡 —— 冷門且巧，R5 守住（從 R6 降半格）。" },
    "lm-nr-003": { axes: [1, 2, 2], why: "n(7^{1/n}−1) → ln 7：標準 (e^u−1)/u 變形，R3。" },
    "lm-nr-005": { axes: [1, 2, 2], why: "n!/n^n → 0：比值判別或逐項壓縮，R3。" },
    "fd-serx-502": { axes: [3, 1, 2], why: "Σn³/4ⁿ：微分三次的機械流程，跟 burst-boss-ser-001（複核 R4）同族 —— 自己出的題也要一致。" },
    "fd-serx-604": { axes: [2, 2, 2], why: "Σ(n+1)/n! = 2e−1：拆成兩條已知級數。出題時掛 R6 是為了填 R6 的洞 —— 那是配額思維，不是難度，降回 R4。" },
    "fd-serx-605": { axes: [3, 2, 2], why: "Σ(n²+n+1)/n!：要會 n²/n!=2e 的拆法，比 604 多一層，R4。" },
    "fd-limx-603": { axes: [3, 2, 2], why: "(tan x/x)^{1/x²}：1^∞ 取對數＋tan 展開，課本進階節的標準流程，R4 不是 R6。" },
    "fd-serb-603": { axes: [2, 3, 2], why: "Σn/(2n+1)! = 1/(2e)：把 n 湊成 ((2n+1)−1)/2 再拆 cosh/sinh —— 這步不站在課綱大路上，R5。" },
    "fd-serb-605": { axes: [2, 2, 2], why: "Σ1/((2n+1)4ⁿ)：認出 artanh 級數代 x=1/2，標準冪級數辨識，R4。" },
    "fd-serb-606": { axes: [2, 3, 2], why: "Σn/(4n⁴+1)：Sophie Germain 分解＋接龍望遠鏡，冷門恆等式，R5。" },
    "fd-serb-608": { axes: [2, 2, 2], why: "Σ(−1)^{n+1}/(n3ⁿ) = log(4/3)：log(1+x) 級數的直接代入，R4。出題時的 R6 同樣是配額思維。" }
  };

  if (typeof module !== "undefined" && module.exports) module.exports = REVIEWED;
  if (typeof window !== "undefined") window.BUZZ_RUBRIC_REVIEWED = REVIEWED;
})();
