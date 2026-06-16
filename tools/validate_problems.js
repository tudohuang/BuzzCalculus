global.window = {};
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
require("../src/problem_todai_burst_pack.js");
require("../src/problem_difficulty_calibration.js");

const problems = window.BUZZ_PROBLEMS || [];
const topics = new Set(["limits", "derivatives", "integrals", "series"]);
const answerKinds = new Set(["numeric", "expression", "antiderivative", "text"]);
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
  if (!answerKinds.has(problem.answerKind)) fail(id, `invalid answerKind ${problem.answerKind}`);
  if (problem.answerKind === "text") {
    if (!Array.isArray(problem.answers) || !problem.answers.length) fail(id, "text problem needs answers[]");
  } else if (typeof problem.answer !== "string" || !problem.answer.trim()) {
    fail(id, "non-text problem needs answer string");
  }
  if (!Number.isInteger(problem.timeLimit) || problem.timeLimit <= 0) fail(id, "invalid timeLimit");
  if (!Number.isInteger(problem.tabLimit) || problem.tabLimit < 0) fail(id, "invalid tabLimit");
  if (!problem.solution || typeof problem.solution !== "string") fail(id, "missing solution");
  if (problem.hints && (!Array.isArray(problem.hints) || problem.hints.some((hint) => typeof hint !== "string" || !hint.trim()))) {
    fail(id, "hints must be non-empty strings");
  }
  if (problem.tags && (!Array.isArray(problem.tags) || problem.tags.some((tag) => typeof tag !== "string" || !tag.trim()))) {
    fail(id, "tags must be non-empty strings");
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
