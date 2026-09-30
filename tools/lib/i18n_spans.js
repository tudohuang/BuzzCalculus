// 把 src/kernel/i18n.js 的句子樣板函式（textTemplate／textKey／fillTemplate…）載進 node。
//
// 樣板的切法只寫在 i18n.js 一個地方：產生器（tools/build_i18n_text.js）與驗證器
// （tools/validate_i18n.js）用的是瀏覽器會跑的同一份程式碼，兩邊永遠切得一樣。
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const source = fs.readFileSync(path.join(__dirname, "..", "..", "src", "kernel", "i18n.js"), "utf8");

/** 載一份 i18n.js；lang 給 "en" 就模擬英文介面（translateText 才會查表）。 */
function loadI18n(lang) {
  const records = lang ? JSON.stringify({ settings: { lang } }) : null;
  const sandbox = {
    localStorage: { getItem: (key) => (key === "buzzcalculus.records.v1" ? records : null) },
    console
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(source, sandbox, { filename: "i18n.js" });
  return sandbox.BuzzI18n;
}

const zh = loadI18n("zh");

module.exports = {
  loadI18n,
  textTemplate: zh.textTemplate,
  textSpans: zh.textSpans,
  textKey: zh.textKey,
  fillTemplate: zh.fillTemplate,
  /** 英文版少了哪些中文版的數學片段（空陣列＝式子都在） */
  missingSpans: (zhText, enText) => zh.textSpans(zhText).filter((span) => !String(enText || "").includes(span))
};
