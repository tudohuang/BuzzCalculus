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
require("../src/problem_hardcore_50.js");
require("../src/problem_exam_expansion.js");
require("../src/problem_university_exam_pack.js");
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

const sinhSeriesProblem = {
  id: "p0-series-sinh",
  topic: "series",
  answerKind: "numeric",
  answer: "(exp(1)-exp(-1))/2"
};

const quotientProblem = {
  id: "p0-derivative-quotient",
  topic: "derivatives",
  answerKind: "expression",
  answer: "(x^2-2*x-1)/(x-1)^2",
  variable: "x"
};

const productLogProblem = {
  id: "p0-derivative-product-log",
  topic: "derivatives",
  answerKind: "expression",
  answer: "exp(x)*log(x)+exp(x)/x",
  variable: "x"
};

const multivariableProblem = {
  id: "p0-multivariable-mixed-partial",
  topic: "derivatives",
  answerKind: "expression",
  answer: "6*x*y^2+(1+x*y)*exp(x*y)",
  variables: ["x", "y"]
};

const divergenceProblem = {
  id: "p0-divergence-compact-products",
  topic: "derivatives",
  answerKind: "expression",
  answer: "2*x*y+2*y*z+2*z*x",
  variables: ["x", "y", "z"]
};

const logDefiniteProblem = {
  id: "p0-tex-frac-log",
  topic: "integrals",
  answerKind: "numeric",
  answer: "log(2)/3"
};

const logCompositionProblem = {
  id: "p0-log-composition",
  topic: "integrals",
  answerKind: "antiderivative",
  answer: "sin(log(x))",
  variable: "x"
};

const parametricTechniqueProblem = {
  id: "p0-text-parametric-technique",
  topic: "derivatives",
  answerKind: "text",
  answers: ["parametric", "parametric differentiation", "參數微分", "parametric chain rule", "chain rule"],
  canonical: "parametric differentiation"
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
  ["numeric wrong value", numericProblem, "1", false],
  ["numeric hyperbolic sinh alias", sinhSeriesProblem, "sinh(1)", true],
  ["reported quotient derivative with spaces", quotientProblem, "(x^2 -2x -1)/(x-1)^2", true],
  ["ln alias in product rule answer", productLogProblem, "exp(x)*ln(x)+exp(x)/x", true],
  ["TeX exponential and compact xy products", multivariableProblem, "6xy^2+e^{xy}+xye^{xy}", true],
  ["compact divergence products", divergenceProblem, "2xy+2yz+2zx", true],
  ["TeX fraction times log numeric", logDefiniteProblem, "\\frac{1}{3}\\log(2)", true],
  ["bare log argument inside composition", logCompositionProblem, "sin(logx)", true],
  ["wrong inverse derivative remains wrong", { ...numericProblem, answer: "1/2" }, "1", false],
  ["wrong arctan sign remains wrong", { ...numericProblem, answer: "-8/3" }, "8/3", false],
  ["wrong FTC lower-limit sign remains wrong", { ...derivativeProblem, answer: "2*x*log(1+x^4)-log(1+x^2)" }, "2*x*log(1+x^4)+log(1+x^2)", false],
  ["parametric technique broad chain-rule alias", parametricTechniqueProblem, "chain rule", true],
  ["TeX arctan antiderivative with +C", { ...antiderivativeProblem, answer: "atan(x^2)/2" }, "0.5*\\arctan(x^2)+C", true],
  ["TeX log antiderivative with decimal coefficient", { ...antiderivativeProblem, answer: "x^2/2-log(1+x^2)/2" }, "0.5*x^2-0.5\\log(1+x^2)+C", true]
];

const failures = [];

tests.forEach(([name, problem, input, expected]) => {
  const result = api.checkAnswer(problem, input);
  const passed = Boolean(result.correct) === expected;
  const status = passed ? "PASS" : "FAIL";
  console.log(`${status} ${name}: input=${input} expected=${expected} actual=${Boolean(result.correct)} message=${result.message}`);
  if (!passed) failures.push({ name, input, expected, result });
});

const timeoutResult = api.resolveAnswerSubmission(quotientProblem, "(x^2 -2x -1)/(x-1)^2", "Timeout");
const timeoutPassed = timeoutResult.status === "correct" && timeoutResult.reason === "Correct";
console.log(`${timeoutPassed ? "PASS" : "FAIL"} timeout keeps correct draft: status=${timeoutResult.status} reason=${timeoutResult.reason}`);
if (!timeoutPassed) failures.push({ name: "timeout keeps correct draft", input: timeoutResult.input, expected: true, result: timeoutResult });

const canonicalProblems = (global.window.BUZZ_PROBLEMS || []).filter((problem) => /^(gap|mob|rel|hc|exam|uni)-/.test(problem.id));
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

console.log(`\nValidated ${tests.length + 1 + canonicalProblems.length} answer checker cases`);
