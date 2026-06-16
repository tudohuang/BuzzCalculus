const fakeApp = {
  innerHTML: "",
  querySelectorAll: () => [],
  querySelector: () => null,
  matches: () => false
};

global.window = {
  __BUZZ_TEST_HOOKS__: {},
  addEventListener: () => {},
  setTimeout: (fn) => {
    if (typeof fn === "function") fn();
  },
  setInterval: () => 0,
  clearInterval: () => {},
  requestAnimationFrame: (fn) => {
    if (typeof fn === "function") fn();
  },
  matchMedia: () => ({ matches: false }),
  devicePixelRatio: 1,
  innerWidth: 1280,
  innerHeight: 720
};
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.localStorage = {
  getItem: () => "{}",
  setItem: () => {},
  removeItem: () => {}
};
global.document = {
  getElementById: (id) => (id === "app" ? fakeApp : null),
  addEventListener: () => {},
  visibilityState: "visible",
  body: {
    appendChild: () => {}
  },
  createElement: () => ({ click: () => {}, remove: () => {} })
};
global.Blob = function Blob() {};
global.URL = {
  createObjectURL: () => "blob:path",
  revokeObjectURL: () => {}
};
global.FileReader = function FileReader() {};

require("../src/problems.js");
require("../src/problem_extensions.js");
require("../src/problem_extensions_2.js");
require("../src/problem_integrals_hard.js");
require("../src/problem_advanced_analysis.js");
require("../src/problem_gap_pack.js");
require("../src/problem_mobile_advanced_pack.js");
require("../src/problem_release_expansion.js");
require("../src/problem_hard_expansion.js");
require("../src/problem_hardcore_50.js");
require("../src/problem_exam_expansion.js");
require("../src/problem_university_exam_pack.js");
require("../src/problem_exam_depth_pack.js");
require("../src/problem_difficulty_calibration.js");
require("../src/app.js");

const api = window.__BUZZ_TEST_HOOKS__ && window.__BUZZ_TEST_HOOKS__.api;
if (!api || !api.pathNodes || !api.pathNodeProblems) {
  throw new Error("path test hooks are unavailable");
}

let failed = false;
api.pathNodes.forEach((node) => {
  const count = api.pathNodeProblems(node).length;
  console.log(`${node.id}: ${count} problems`);
  if (!count) failed = true;
});

if (failed) {
  throw new Error("one or more path nodes have zero problems");
}
