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
  createObjectURL: () => "blob:selection",
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
require("../src/problem_difficulty_calibration.js");
require("../src/app.js");

const api = global.window.__BUZZ_TEST_HOOKS__.api;
if (!api || typeof api.adaptiveShuffle !== "function" || typeof api.padPool !== "function") {
  throw new Error("selection test hooks are unavailable");
}

const records = {
  history: [
    {
      answers: [
        { problemId: "recent-a" },
        { problemId: "recent-b" }
      ]
    }
  ],
  problemStats: {},
  topicStats: {},
  mistakes: {}
};

const pool = [
  { id: "recent-a", topic: "derivatives", difficulty: 2 },
  { id: "fresh-a", topic: "derivatives", difficulty: 2 },
  { id: "fresh-b", topic: "derivatives", difficulty: 2 }
];

const failures = [];
const ordered = api.adaptiveShuffle(pool, records, 12345).map((problem) => problem.id);
if (ordered[0] === "recent-a") {
  failures.push(`adaptiveShuffle kept a recent problem first: ${ordered.join(", ")}`);
}

const padded = api.padPool([], pool, 2, { records }).map((problem) => problem.id);
if (padded.includes("recent-a") && (padded.includes("fresh-a") || padded.includes("fresh-b"))) {
  failures.push(`padPool used a recent problem before exhausting fresh options: ${padded.join(", ")}`);
}

const tiny = api.padPool([], [pool[0]], 2, { records }).map((problem) => problem.id);
if (tiny.length !== 2 || tiny[0] !== "recent-a" || tiny[1] !== "recent-a") {
  failures.push(`padPool should fall back to repeats only when the pool is tiny: ${tiny.join(", ")}`);
}

const recent = api.recentProblemIds(records, 2);
if (recent.join(",") !== "recent-a,recent-b") {
  failures.push(`recentProblemIds returned unexpected order: ${recent.join(", ")}`);
}

const examPool = api.selectProblemPool(api.modes.exam, "all");
if (examPool.length !== api.modes.exam.count) {
  failures.push(`exam mode selected ${examPool.length} problems instead of ${api.modes.exam.count}`);
}
const invalidExam = examPool.filter((problem) => !["numeric", "expression", "antiderivative"].includes(problem.answerKind));
if (invalidExam.length) {
  failures.push(`exam mode selected non-WebWork problems: ${invalidExam.map((problem) => problem.id).join(", ")}`);
}
const nonExamTagged = examPool.filter((problem) => !(problem.tags || []).includes("exam-style"));
if (nonExamTagged.length) {
  failures.push(`exam mode should prefer exam-style tagged problems: ${nonExamTagged.map((problem) => problem.id).join(", ")}`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}

console.log(`Selection avoids recent repeats: ${ordered.join(", ")}`);
console.log(`Selection pad result: ${padded.join(", ")}`);
console.log(`Tiny pool fallback: ${tiny.join(", ")}`);
console.log(`Exam mode pool: ${examPool.length} WebWork problems`);
