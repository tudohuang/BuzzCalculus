// 「字面相同」的判準：只拿掉排版差異，不動數學內容。
//
// 三支工具共用這一個定義 —— detect_duplicates.js（CI 擋字面重複）、
// expand_templates.js（模板展開撞到既有題就不生）、build_lecture_pack.js（考卷題撞到既有題就引用既有 id）。
// 各自抄一份的話，哪天有一份多剝了一種排版，產生器以為不重複、CI 卻說重複。
"use strict";

module.exports = function literalKey(prompt) {
  return String(prompt)
    .replace(/\\left|\\right|\\displaystyle|\\,|\\;|\\!|\\quad|\\qquad|\s/g, "")
    .replace(/\\dfrac|\\tfrac/g, "\\frac")
    .replace(/\{([a-zA-Z0-9])\}/g, "$1");
};
