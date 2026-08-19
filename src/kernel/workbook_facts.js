// 由 tools/generate_workbook.js 產生，不要手改。
// 作業本的商品說明數字唯一來源；銷售頁抄的是這裡，CI 會比對。
(function () {
  "use strict";
  const facts = {
    "total": 1605,
    "counts": {
      "limits": 234,
      "derivatives": 557,
      "integrals": 617,
      "series": 197
    },
    "answersTypesetAsMath": 1462,
    "examSets": 6,
    "sections": 26,
    "rankBands": {
      "r1r2": 439,
      "r3r4": 827,
      "r5r6": 339
    }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = facts;
  if (typeof window !== "undefined") window.BuzzWorkbookFacts = facts;
})();
