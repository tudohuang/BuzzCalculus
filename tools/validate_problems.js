global.window = {};
require("./lib/load_problem_sources.js")();

const problems = window.BUZZ_PROBLEMS || [];
const topics = new Set(["limits", "derivatives", "integrals", "series"]);
// graph = 選圖題（答案是一條曲線的式子，選項本身是圖）。
// 它的內部一致性由 tools/validate_graph_choices.js 另外把關 ——
// 那些檢查（誘答要看得出差別、要寫錯在哪）在這裡驗不了。
// worksheet = 作圖表題（一張要填的表，每一格自己判分）。
// 每一格的獨立驗算由 tools/validate_worksheets.js 把關。
const answerKinds = new Set(["numeric", "expression", "antiderivative", "text", "set", "interval", "graph", "graphtap", "graphslope", "worksheet"]);
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
  // 互動圖形題：判分規格全在題目資料裡，缺一塊就是一題永遠不能玩的題。
  if (problem.answerKind === "graphtap" || problem.answerKind === "graphslope") {
    const curve = problem.graph && Array.isArray(problem.graph.curves) && problem.graph.curves[0];
    if (!curve || !curve.expr) fail(id, `${problem.answerKind} needs graph.curves[0].expr (判分與驗算都要重算曲線)`);
    if (!problem.graph || !Array.isArray(problem.graph.window) || problem.graph.window.length !== 4) {
      fail(id, `${problem.answerKind} needs graph.window [xmin,xmax,ymin,ymax]`);
    }
  }
  if (problem.answerKind === "graphtap") {
    const xs = String(problem.answer || "").split(",").map(Number);
    if (!xs.length || xs.some((x) => !Number.isFinite(x))) fail(id, "graphtap answer must be comma-separated numbers");
    if (!["extremum", "critical", "inflection"].includes(problem.tapKind)) {
      fail(id, "graphtap needs tapKind extremum|critical|inflection (驗算器靠它決定重算 f' 還是 f'')");
    }
    // 兩個目標點距離小於 2 倍容差，使用者不可能分得開 —— 那是不公平的題。
    const tol = Number(problem.tapTolerance) || 0.35;
    const sorted = xs.slice().sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i += 1) {
      if (sorted[i] - sorted[i - 1] < tol * 2) fail(id, `graphtap targets ${sorted[i - 1]} and ${sorted[i]} closer than 2×tolerance ${tol}`);
    }
  }
  if (problem.answerKind === "graphslope") {
    if (!problem.pivot || !Number.isFinite(Number(problem.pivot.x))) fail(id, "graphslope needs pivot.x");
    if (!Number.isFinite(Number(problem.answer))) fail(id, "graphslope answer must be a number (the slope)");
    if (problem.slopeStart != null && Math.abs(Number(problem.slopeStart) - Number(problem.answer)) < 0.3) {
      fail(id, "graphslope slopeStart is basically the answer — start the line somewhere wrong");
    }
  }
  if (!Number.isInteger(problem.timeLimit) || problem.timeLimit <= 0) fail(id, "invalid timeLimit");
  // tabLimit 已停用（2026-08 移除切頁判錯）。舊題目上還留著這個欄位，
  // 但**沒有任何程式碼會讀它** —— 所以這裡不再要求它存在，只在它存在時
  // 檢查格式，免得舊資料變成一團爛值。新題目不需要寫。
  if (problem.tabLimit !== undefined && (!Number.isInteger(problem.tabLimit) || problem.tabLimit < 0)) {
    fail(id, "tabLimit 已停用，但如果要留著就必須是 >= 0 的整數");
  }
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
