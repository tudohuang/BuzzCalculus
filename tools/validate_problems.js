global.window = {};
require("./lib/load_problem_sources.js")();

const problems = window.BUZZ_PROBLEMS || [];
const topics = new Set(["limits", "derivatives", "integrals", "series"]);
const answerKinds = new Set(["numeric", "expression", "antiderivative", "text", "set", "interval"]);
const ids = new Set();
const errors = [];
const allowedRawWords = new Set([
  "dx",
  "dy",
  "dz",
  "dt",
  "da",
  "dv",
  "xy",
  "xyz",
  "sin",
  "cos",
  "tan",
  "sec",
  "csc",
  "cot",
  "log",
  "ln",
  "exp",
  "sinh",
  "cosh",
  "tanh",
  "arcsin",
  "arccos",
  "arctan",
  "ax",
  "bx",
  "iy",
  "xj"
]);

function fail(id, message) {
  errors.push(`${id || "unknown"}: ${message}`);
}

function stripCommandGroup(source, command) {
  let output = "";
  let cursor = 0;
  while (cursor < source.length) {
    const index = source.indexOf(command, cursor);
    if (index === -1) {
      output += source.slice(cursor);
      break;
    }
    output += source.slice(cursor, index);
    const group = readBraceGroup(source, index + command.length);
    cursor = group ? group.end : index + command.length;
  }
  return output;
}

function readBraceGroup(source, start) {
  let cursor = start;
  while (/\s/.test(source[cursor] || "")) cursor += 1;
  if (source[cursor] !== "{") return null;
  let depth = 0;
  for (let index = cursor; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return { end: index + 1 };
  }
  return null;
}

function rawEnglishWordsOutsideText(tex) {
  let text = String(tex || "");
  ["\\text", "\\operatorname"].forEach((command) => {
    text = stripCommandGroup(text, command);
  });
  text = text.replace(/\\[A-Za-z]+/g, " ");
  const words = text.match(/[A-Za-z]{2,}/g) || [];
  return words.filter((word) => {
    const normalized = word.toLowerCase();
    if (allowedRawWords.has(normalized)) return false;
    return !/^[defghknrstuvwxyz]+$/i.test(word);
  });
}

problems.forEach((problem, index) => {
  const id = problem.id || `#${index}`;
  if (!problem.id) fail(id, "missing id");
  if (ids.has(problem.id)) fail(id, "duplicate id");
  ids.add(problem.id);

  if (!topics.has(problem.topic)) fail(id, `invalid topic ${problem.topic}`);
  if (!Number.isInteger(problem.difficulty) || problem.difficulty < 1 || problem.difficulty > 4) {
    fail(id, "difficulty must be integer 1..4");
  }
  if (!Number.isInteger(problem.rank) || problem.rank < 1 || problem.rank > 6) {
    fail(id, "rank must be integer 1..6 after calibration");
  }
  if (!problem.prompt || typeof problem.prompt !== "string") fail(id, "missing prompt");
  const rawWords = rawEnglishWordsOutsideText(problem.prompt || "");
  if (rawWords.length) {
    fail(id, `raw English words outside \\text{} in prompt: ${Array.from(new Set(rawWords)).join(", ")}`);
  }
  // KaTeX renders prompts with throwOnError:false, so these silently turn into red
  // error text instead of failing loudly. Catch them here instead.
  // 未跳脫的 % 會被 KaTeX 當成註解，吃掉整行到結尾。
  if (/(^|[^\\])%/.test(problem.prompt || "")) fail(id, "unescaped % in prompt (KaTeX treats it as a comment)");
  // \text{} 內的 U+00B7 會被映射到未定義的 \cdotp。
  if ((problem.prompt || "").includes("·")) fail(id, "literal · in prompt (use \\cdot outside \\text{})");
  if (!answerKinds.has(problem.answerKind)) fail(id, `invalid answerKind ${problem.answerKind}`);
  if (problem.answerKind === "text") {
    if (!Array.isArray(problem.answers) || !problem.answers.length) fail(id, "text problem needs answers[]");
  } else if (typeof problem.answer !== "string" || !problem.answer.trim()) {
    fail(id, "non-text problem needs answer string");
  }
  // 集合與區間的參考答案必須自己解析得動。解析不動的參考答案 =
  // 這題永遠判錯，而且是在使用者答對的時候判錯。
  if (problem.answerKind === "set" && !/^\s*\{?[^{}]+\}?\s*$/.test(problem.answer || "")) {
    fail(id, "set answer must look like {a, b}");
  }
  if (problem.answerKind === "interval" && !/^\s*[[(].*[\])]\s*$/.test(problem.answer || "")) {
    fail(id, "interval answer must look like (a, b] or a union of them");
  }
  if (!Number.isInteger(problem.timeLimit) || problem.timeLimit <= 0) fail(id, "invalid timeLimit");
  if (!Number.isInteger(problem.tabLimit) || problem.tabLimit < 0) fail(id, "invalid tabLimit");
  if (!problem.solution || typeof problem.solution !== "string") fail(id, "missing solution");
  if (problem.hints && (!Array.isArray(problem.hints) || problem.hints.some((hint) => typeof hint !== "string" || !hint.trim()))) {
    fail(id, "hints must be non-empty strings");
  }
  // 解題步驟：有就要是「真的多步」。一句話包成一個 li 只是換個樣子顯示，
  // 對卡住的人沒有任何幫助，而且會讓覆蓋率數字看起來比實際好。
  if (problem.solutionSteps) {
    if (!Array.isArray(problem.solutionSteps) || problem.solutionSteps.length < 2) {
      fail(id, "solutionSteps must be an array of at least 2 steps");
    } else if (problem.solutionSteps.some((step) => typeof step !== "string" || step.trim().length < 4)) {
      fail(id, "solutionSteps entries must be non-trivial strings");
    }
  }
  if (problem.tags && (!Array.isArray(problem.tags) || problem.tags.some((tag) => typeof tag !== "string" || !tag.trim()))) {
    fail(id, "tags must be non-empty strings");
  }
  if (problem.distractors && (!Array.isArray(problem.distractors) || problem.distractors.some((value) => typeof value !== "string" || !value.trim()))) {
    fail(id, "distractors must be non-empty strings");
  }
  if (problem.variables && (!Array.isArray(problem.variables) || problem.variables.some((name) => typeof name !== "string" || !name.trim()))) {
    fail(id, "variables must be non-empty strings");
  }
});

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const counts = problems.reduce((acc, problem) => {
  acc[problem.topic] = (acc[problem.topic] || 0) + 1;
  return acc;
}, {});

console.log(`Validated ${problems.length} problems`);
console.log(JSON.stringify(counts, null, 2));
