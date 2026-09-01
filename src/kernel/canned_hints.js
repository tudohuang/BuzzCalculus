(function () {
  "use strict";

  // 罐頭提示的封鎖清單。
  //
  // 提示是要**扣分**的（第二層 6 + rank×2 分）。對一句出現在 226 題上的話收費，
  // 等於白拿使用者的分數 —— 這跟先前把「WebWork 格式說明」當成提示來賣是同一件事。
  //
  // 判準不是「重複幾次」，是「這句話有沒有告訴你關於**這一題**的事」。
  // 這個差別很重要，第一版就是弄錯的：我照 validate_hints 的
  // 「同一句 ≥5 題」門檻全部擋掉，結果連
  //   「Convert to the beta function.」「分子分母同除以最高次的 x。」
  //   「sin 微分變 cos。」「這是等比級數。」
  // 這種**指名了具體技巧或事實**的句子也一起殺掉了。
  // 那些句子會重複，只是因為那個技巧本來就常用 —— 它們是真的提示。
  //
  // 留在這份清單裡的，是換到任何一題都同樣成立的句子；
  // 其中兩句甚至不是提示，是難度說明（「This is intended as a Boss item.」）。
  // 擋掉之後這些題會退回「關鍵想法 → 機器推導的關鍵步驟 → 完整解法」，
  // 三層每一層都是這一題特有的，比一句萬用樣板誠實。
  const CANNED = new Set([
    // 226 題 —— 把三種技巧一起端出來，等於沒有指出任何一種
    "Expect a recurrence, Wallis/Beta/Gamma identity, or repeated IBP before direct computation.",
    // 77 題
    "This is exam-style: identify the main tool before calculating.",
    // 71 題
    "Identify the dominant tool before computing.",
    // 64 題
    "先判型：這題刻意混合轉學考、免修考、段考常見技巧。",
    // 59 題
    "Identify the structure before calculating.",
    // 41 題 —— 這是難度說明，不是提示
    "This is intentionally above standard drill level.",
    // 41 題
    "Choose the technique before expanding algebra.",
    // 18 題
    "Keep the standard formula visible.",
    // 14 題 —— 同樣是難度說明
    "This is intended as a Boss/Boss+ item.",
    // 9 題
    "Identify the dominant technique before calculating."
  ]);

  const normalize = (text) => String(text == null ? "" : text).replace(/\s+/g, " ").trim();

  window.BuzzCannedHints = {
    isCanned: (text) => CANNED.has(normalize(text)),
    // 給驗證器用：確認清單裡沒有已經不存在於題庫的句子
    all: () => [...CANNED],
    normalize
  };
})();
