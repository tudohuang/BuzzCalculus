// 價格的唯一來源。
//
// 價格散在多個地方是一種特別討厭的 bug：銷售頁寫 380、結帳頁收 420、
// 條款頁還停在上一次促銷 —— 每一個都「看起來對」，而使用者會先發現。
// 所以金額只寫在這裡一次，頁面上的數字由 tools/validate_public_claims.js
// 比對（HTML 用 data-claim="workbookPrice"）。
//
// published 是一道閘：false 的時候銷售頁不會出現購買按鈕，
// 只會說「還沒開賣」。這樣可以先把整個商品頁做完、審過、上線，
// 而不會在價格還沒決定的時候意外開始收錢。
(function () {
  "use strict";

  const pricing = {
    // 價格與結帳連結都備妥之後才改成 true
    published: false,
    currency: "TWD",
    currencySymbol: "NT$",

    workbook: {
      // 新台幣整數。null = 還沒定價。
      price: null,
      // 頁數只有 XeLaTeX 跑完才知道，所以它不在自動產生的 workbook_facts.js 裡，
      // 是人維護的。改版重編之後要更新這個數字（銷售頁的頁數由它比對）。
      pages: 303,
      // 原價（劃掉的那個數字）。沒有就留 null —— 不要造一個假的原價。
      compareAt: null,
      // 外部結帳頁（Gumroad / 綠界 / 藍新皆可）。必須是 https。
      checkoutUrl: "",
      // 交付方式寫在這裡，是因為條款頁與商品頁都要講同一件事
      delivery: "付款後以一次性下載連結交付 PDF，無 DRM，可自行列印。"
    },

    // 數位商品的退款窗。下載後不退是業界慣例，但「還沒下載」必須能退，
    // 否則等於沒有退款政策。
    refundDays: 7
  };

  if (typeof module !== "undefined" && module.exports) module.exports = pricing;
  if (typeof window !== "undefined") window.BuzzPricing = pricing;
})();
