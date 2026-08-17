// rubric 三軸 → rank。
//
// 這支**不再自己實作公式**，改成轉發給 src/kernel/rubric.js。
// 原因：公式原本 tools 一份、瀏覽器一份（藏在 tag 規則裡），
// 結果畫面上的 R5 和難度說明頁算出來的 R3 對不起來。
// 使用者看到的那份才是真的，所以以那份為準。

"use strict";

const path = require("path");

module.exports = function rubricRank(axes, skillCount) {
  const kernel = require(path.join(__dirname, "..", "..", "src", "kernel", "rubric.js"));
  return kernel.API.rankFrom([axes.steps, axes.obscurity, axes.load], skillCount);
};
