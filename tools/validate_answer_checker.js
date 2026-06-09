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
  createObjectURL: () => "blob:answer-checker",
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
require("../src/problem_difficulty_calibration.js");
require("../src/app.js");

const api = global.window.__BUZZ_TEST_HOOKS__.api;
if (!api || typeof api.checkAnswer !== "function") {
  throw new Error("answer checker test hooks are unavailable");
}

const antiderivativeProblem = {
  id: "p0-antiderivative-tan",
  topic: "integrals",
  answerKind: "antiderivative",
  answer: "tan(x)",
  variable: "x"
};

const derivativeProblem = {
  id: "p0-derivative-2x",
  topic: "derivatives",
  answerKind: "expression",
  answer: "2*x",
  variable: "x"
};

const textProblem = {
  id: "p0-text-convergent",
  topic: "series",
  answerKind: "text",
  answers: ["convergent"],
  canonical: "convergent"
};

const numericProblem = {
  id: "p0-numeric-pi-quarter",
  topic: "integrals",
  answerKind: "numeric",
  answer: "pi/4"
};

const tests = [
  ["antiderivative tan(x)", antiderivativeProblem, "tan(x)", true],
  ["antiderivative tan(x)+5", antiderivativeProblem, "tan(x)+5", true],
  ["antiderivative sin(x)/cos(x)", antiderivativeProblem, "sin(x)/cos(x)", true],
  ["antiderivative wrong expression", antiderivativeProblem, "sin(x)", false],
  ["derivative implicit 2x", derivativeProblem, "2x", true],
  ["derivative x+x", derivativeProblem, "x+x", true],
  ["derivative implicit parenthesis", { ...derivativeProblem, answer: "2*x+2" }, "2(x+1)", true],
  ["derivative wrong expression", derivativeProblem, "x*x", false],
  ["text lowercase", textProblem, "convergent", true],
  ["text title case", textProblem, "Convergent", true],
  ["text uppercase", textProblem, "CONVERGENT", true],
  ["text wrong value", textProblem, "divergent", false],
  ["numeric symbolic pi/4", numericProblem, "pi/4", true],
  ["numeric decimal pi/4", numericProblem, "0.7853981633974483", true],
  ["numeric wrong value", numericProblem, "1", false]
];

const failures = [];

tests.forEach(([name, problem, input, expected]) => {
  const result = api.checkAnswer(problem, input);
  const passed = Boolean(result.correct) === expected;
  const status = passed ? "PASS" : "FAIL";
  console.log(`${status} ${name}: input=${input} expected=${expected} actual=${Boolean(result.correct)} message=${result.message}`);
  if (!passed) failures.push({ name, input, expected, result });
});

const canonicalProblems = (global.window.BUZZ_PROBLEMS || []).filter((problem) => /^(gap|mob|rel)-/.test(problem.id));
canonicalProblems.forEach((problem) => {
  const input = problem.answerKind === "text" ? problem.canonical || problem.answers[0] : problem.answer;
  const result = api.checkAnswer(problem, input);
  const passed = Boolean(result.correct);
  const status = passed ? "PASS" : "FAIL";
  console.log(`${status} canonical ${problem.id}: input=${input} actual=${Boolean(result.correct)} message=${result.message}`);
  if (!passed) failures.push({ name: `canonical ${problem.id}`, input, expected: true, result });
});

if (failures.length) {
  console.error(`\n${failures.length} answer checker tests failed.`);
  process.exit(1);
}

console.log(`\nValidated ${tests.length + canonicalProblems.length} answer checker cases`);
