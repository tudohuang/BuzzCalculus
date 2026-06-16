const fakeApp = {
  innerHTML: "",
  querySelectorAll: () => [],
  querySelector: () => null,
  matches: () => false
};

global.window = {
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
  innerHeight: 720,
  __BUZZ_TEST_HOOKS__: {}
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
  createObjectURL: () => "blob:smoke",
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

if (!fakeApp.innerHTML.includes("BuzzCalculus")) {
  throw new Error("home screen did not render");
}

const api = global.window.__BUZZ_TEST_HOOKS__?.api;
if (!api || typeof api.buildExamAnalysis !== "function") {
  throw new Error("exam analysis hooks did not initialize");
}

const sampleProblems = [
  global.window.BUZZ_PROBLEMS.find((problem) => problem.id === "depth-int-005"),
  global.window.BUZZ_PROBLEMS.find((problem) => problem.id === "depth-der-005"),
  global.window.BUZZ_PROBLEMS.find((problem) => problem.id === "depth-ser-009")
];
if (sampleProblems.some((problem) => !problem)) {
  throw new Error("exam depth sample problems are missing");
}

const sampleAnswers = [
  { problem: sampleProblems[0], correct: true, elapsed: 80, reason: "Correct" },
  { problem: sampleProblems[1], correct: false, elapsed: 110, reason: "Wrong" },
  { problem: sampleProblems[2], correct: false, elapsed: 0, reason: "Unanswered", unanswered: true }
];
const analysis = api.buildExamAnalysis(sampleAnswers);
if (api.averageAnswerTime(sampleAnswers) !== 95 || !analysis.topicRows.length || !analysis.tagRows.length) {
  throw new Error("exam analysis sample did not produce expected stats");
}
const analysisHtml = api.renderExamAnalysisSection(analysis);
if (!analysisHtml.includes("大考戰況分析") || !analysisHtml.includes("技巧錯誤熱區")) {
  throw new Error("exam analysis section did not render expected copy");
}

console.log(`Rendered home HTML: ${fakeApp.innerHTML.length} chars`);
