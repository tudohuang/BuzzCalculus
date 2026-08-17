// 在 node 裡載入 src/app.js，取得 window.__BUZZ_TEST_HOOKS__.api。
//
// app.js 是瀏覽器程式，一載入就會摸 document / localStorage / rAF。
// 這裡放一組夠用的假 DOM 讓它跑得起來，好處是驗證器測到的是**上線的那份程式碼**，
// 而不是為了測試另外抄一份邏輯 —— 抄一份的話兩邊遲早會不一樣，
// 而且不一樣的那天驗證器還是綠的。
//
// 這個 shim 原本在五支驗證器裡各有一份複本。共用之後，
// app.js 多用一個瀏覽器 API 只要補一個地方。

"use strict";

const fs = require("fs");
const path = require("path");

let cached = null;

module.exports = function loadAppApi() {
  if (cached) return cached;

  const fakeElement = {
    innerHTML: "",
    textContent: "",
    className: "",
    style: {},
    dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    querySelectorAll: () => [],
    querySelector: () => null,
    matches: () => false,
    closest: () => null,
    addEventListener() {},
    removeEventListener() {},
    appendChild() {},
    setAttribute() {},
    getAttribute: () => null,
    removeAttribute() {},
    focus() {},
    click() {},
    remove() {},
    scrollIntoView() {}
  };

  global.window = {
    __BUZZ_TEST_HOOKS__: {},
    addEventListener() {},
    removeEventListener() {},
    // 讓所有延遲執行同步跑完，否則初始化排的工作永遠不會發生
    setTimeout: (fn) => {
      if (typeof fn === "function") fn();
      return 0;
    },
    clearTimeout() {},
    setInterval: () => 0,
    clearInterval() {},
    requestAnimationFrame: (fn) => {
      if (typeof fn === "function") fn();
      return 0;
    },
    cancelAnimationFrame() {},
    matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }),
    devicePixelRatio: 1,
    innerWidth: 1280,
    innerHeight: 720,
    scrollTo() {},
    location: { hash: "", href: "https://example.invalid/", search: "" },
    navigator: { userAgent: "node", language: "zh-TW", onLine: true },
    performance: { now: () => 0 }
  };
  global.requestAnimationFrame = global.window.requestAnimationFrame;
  global.cancelAnimationFrame = global.window.cancelAnimationFrame;

  const store = new Map();
  global.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
  global.sessionStorage = global.localStorage;

  global.document = {
    getElementById: (id) => (id === "app" ? fakeElement : null),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {},
    removeEventListener() {},
    visibilityState: "visible",
    documentElement: fakeElement,
    head: fakeElement,
    body: fakeElement,
    createElement: () => ({ ...fakeElement })
  };
  global.Blob = function Blob() {};
  global.URL = { createObjectURL: () => "blob:test", revokeObjectURL() {} };
  global.FileReader = function FileReader() {};

  // 檢查「每個 problem*.js 都掛在 index.html 上」這條規則
  require("./load_problem_sources.js").verifyOnly();

  // 然後照 index.html 的**文件順序**把所有 src/*.js 載進來。
  //
  // 順序是有意義的，不能各自分組載：skill_graph 與 rubric 必須在
  // problem_difficulty_calibration 之前，因為校準會用 rubric 決定 rank。
  // 順序錯了，校準就走 fallback，驗證器測到的難度跟使用者看到的不一樣 ——
  // 而 fallback 存在的意義是「kernel 壞掉時還能用」，不該是驗證時的預設狀態。
  const indexHtml = fs.readFileSync(path.join(__dirname, "..", "..", "index.html"), "utf8");
  [...indexHtml.matchAll(/src="(src\/[^"]+\.js)"/g)].forEach((match) => {
    if (match[1] === "src/app.js") return;
    require(path.join(__dirname, "..", "..", match[1]));
  });

  require("../../src/app.js");

  const api = global.window.__BUZZ_TEST_HOOKS__.api;
  if (!api) throw new Error("app.js 沒有掛上 __BUZZ_TEST_HOOKS__.api");
  cached = api;
  return api;
};

// 依 index.html 的順序把題庫攤平成一個陣列（每題附上來源檔）。
module.exports.allProblems = function allProblems() {
  module.exports();
  // 只認 BUZZ_PROBLEMS。以前這裡是掃所有 BUZZ_* 陣列，
  // 但 index.html 的完整載入順序會把 proofs.js 也載進來，
  // 於是 41 個「證明」混進題目清單裡（它們沒有 rank，也不該有）。
  const scope = global.window;
  const seen = new Set();
  return (scope.BUZZ_PROBLEMS || []).filter((problem) => {
    if (!problem || !problem.id || seen.has(problem.id)) return false;
    seen.add(problem.id);
    return true;
  });
};
