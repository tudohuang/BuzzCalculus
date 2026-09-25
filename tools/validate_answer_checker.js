// 載入方式改用 tools/lib/app_api.js（2026-08-16）。
//
// 這支原本自己帶一份假 DOM，只載題庫 + app.js，沒有載 kernel，
// 所以難度校準走的是 fallback 路徑 —— 驗到的 rank 跟使用者看到的不一樣。
// 共用載入層會照 index.html 的**文件順序**把所有 src/*.js 載進來，
// 驗證的因此是實際上線的那份組態。

"use strict";

const loadAppApi = require("./lib/app_api.js");
const api = loadAppApi();
const window = global.window;
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

const negativePowerNumericProblem = {
  id: "p0-negative-power-numeric",
  topic: "integrals",
  answerKind: "numeric",
  answer: "-(pi^2)/6"
};

const negativePowerAntiderivativeProblem = {
  id: "p0-negative-power-antiderivative",
  topic: "integrals",
  answerKind: "antiderivative",
  answer: "-(x^3)*cos(2*x)/2+3*x^2*sin(2*x)/4+3*x*cos(2*x)/4-3*sin(2*x)/8",
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
  ["TeX log antiderivative with decimal coefficient", { ...antiderivativeProblem, answer: "x^2/2-log(1+x^2)/2" }, "0.5*x^2-0.5\\log(1+x^2)+C", true],
  ["numeric unary minus before power", negativePowerNumericProblem, "-pi^2/6", true],
  ["antiderivative unary minus before power", negativePowerAntiderivativeProblem, "-x^3*cos(2*x)/2+3*x^2*sin(2*x)/4+3*x*cos(2*x)/4-3*sin(2*x)/8", true]
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

const proofSpecs = global.window.BUZZ_PROOF_LANG_PROBLEMS || [];
const proofReference = (problem) => {
  const spec = proofSpecs.find((item) => item.id === problem.proofSpec);
  if (!spec) throw new Error(`${problem.id} 的 proofSpec ${problem.proofSpec} 不在證明題庫裡`);
  return (spec.reference || []).join("\n");
};

const canonicalProblems = global.window.BUZZ_PROBLEMS || [];
canonicalProblems.forEach((problem) => {
  // 作圖題的 answer 是 f 的 LaTeX（顯示用）；標準作答是照正解描一遍的筆畫。
  // 證明題的 answer 只是一句「機器判分」的說明；標準作答是那道 spec 的參考解 ——
  // 這裡等於順便釘住「參考解自己過得了檢查器」，出題時抄壞了會在這一支紅。
  const input = problem.answerKind === "text" ? problem.canonical || problem.answers[0]
    : problem.answerKind === "sketch" ? global.window.BuzzGraphSketch.trace(problem)
      : problem.answerKind === "epsilon" ? global.window.BuzzEpsilonGame.solve(problem)
      : problem.answerKind === "proof" ? proofReference(problem)
        : problem.answer;
  const result = api.checkAnswer(problem, input);
  const passed = Boolean(result.correct);
  const status = passed ? "PASS" : "FAIL";
  if (!passed) console.log(`${status} canonical ${problem.id}: input=${input} actual=${Boolean(result.correct)} message=${result.message}`);
  if (!passed) failures.push({ name: `canonical ${problem.id}`, input, expected: true, result });
});

const byId = (id) => canonicalProblems.find((problem) => problem.id === id);
const regressions = [
  ["differential dx/dy", byId("der-044"), "x*exp(x*y)*dy+y*exp(x*y)*dx", true],
  ["compact differential products", byId("der-045"), "(xdy-ydx)/(x^2+y^2)", true],
  ["missing differential term", byId("der-044"), "y*exp(x*y)*dx", false],
  ["independent multivariable samples", byId("der-021"), `(${byId("der-021").answer})+(y-x-0.27)`, false],
  ["narrower expression domain", { ...derivativeProblem, answer: "x" }, "sqrt(x)^2", false],
  ["narrower primitive domain", { ...antiderivativeProblem, answer: "x" }, "sqrt(x)^2", false],
  ["correct large integration constant", byId("int-001"), "2*x^3+100000000", true],
  ["large constant cannot hide wrong primitive", byId("int-001"), "2*x^3+x+100000000", false],
  ["unreliable constant asks for +C", byId("int-001"), "2*x^3+10000000000000000", false],
  ["symbolic integration constant", byId("int-001"), "2*x^3+C", true]
];
regressions.forEach(([name, problem, input, expected]) => {
  const result = api.checkAnswer(problem, input);
  if (Boolean(result.correct) !== expected) failures.push({ name, input, expected, result });
});
// Check actual displayed choices, including mathematically equal distractors (2/2 and 1/1).
api.setQuiz({ startedAt: "2026-09-14", index: 0, choiceOptions: {} });
const numericProblems = canonicalProblems.filter((problem) => problem.answerKind === "numeric");
numericProblems.forEach((problem) => {
  const options = api.getChoiceOptions(problem);
  if (options.length !== 4) failures.push({ name: `four choices ${problem.id}`, options });
  if (options.filter((option) => api.checkAnswer(problem, option.value).correct).length !== 1) {
    failures.push({ name: `unique correct choice ${problem.id}`, options });
  }
  options.forEach((option, i) => options.slice(i + 1).forEach((other) => {
    if (option.label === other.label || api.checkAnswer({ ...problem, answer: option.value }, other.value).correct) {
      failures.push({ name: `distinct choices ${problem.id}`, option, other });
    }
  }));
});
console.log(`Canonical answers: ${canonicalProblems.length}; regressions: ${regressions.length}; numeric choice sets: ${numericProblems.length}`);

if (failures.length) {
  failures.forEach((failure) => console.error(JSON.stringify(failure)));
  console.error(`\n${failures.length} answer checker tests failed.`);
  process.exit(1);
}

console.log(`\nValidated ${tests.length + 1 + canonicalProblems.length + regressions.length} answer checker cases and ${numericProblems.length} numeric choice sets`);
