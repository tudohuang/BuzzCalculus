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
    "world-081": { axes: [2, 2, 2], why: "∫₀^∞ dx/cosh x = π/2。要用 u=e^x 化成 arctan，不是課本第一次教三角積分時會出的題。" }
  };

  if (typeof module !== "undefined" && module.exports) module.exports = REVIEWED;
  if (typeof window !== "undefined") window.BUZZ_RUBRIC_REVIEWED = REVIEWED;
})();
