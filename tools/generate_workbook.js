const fs = require("fs");
const path = require("path");

global.window = {};
require("./lib/load_problem_sources.js")();

const problems = window.BUZZ_PROBLEMS || [];

const TOPICS = [
  { key: "limits", label: "極限", subtitle: "Limits" },
  { key: "derivatives", label: "微分", subtitle: "Derivatives" },
  { key: "integrals", label: "積分", subtitle: "Integrals" },
  { key: "series", label: "級數", subtitle: "Series" }
];

// Ordered technique groups per topic; a problem joins the first group whose
// tags it matches, otherwise the topic's 綜合 fallback.
const TECHNIQUE_GROUPS = {
  limits: [
    { label: "基本極限", subtitle: "Standard & Trig", tags: ["standard-limit", "trig-limit"] },
    { label: "Taylor 展開", subtitle: "Taylor Limits", tags: ["taylor"] },
    { label: "指數與對數", subtitle: "Exponential & Log", tags: ["exponential-limit", "log"] },
    { label: "多變數極限", subtitle: "Multivariable", tags: ["multivariable"] },
    { label: "陷阱與判別", subtitle: "Traps", tags: ["limit-trap"] }
  ],
  derivatives: [
    { label: "基本規則", subtitle: "Core Rules", tags: ["chain-rule", "trig", "inverse-trig", "log", "exponential", "log-differentiation"] },
    { label: "高階導數", subtitle: "Higher Derivatives", tags: ["higher-derivative", "super-high-derivative", "second-derivative"] },
    { label: "Taylor 係數", subtitle: "Taylor Coefficients", tags: ["taylor", "coefficient"] },
    { label: "參數與隱函數", subtitle: "Parametric & Implicit", tags: ["parametric", "implicit"] },
    { label: "最佳化與應用", subtitle: "Optimization & Applications", tags: ["optimization", "applications", "related-rates", "curvature", "newton-method", "linear-approximation"] },
    { label: "多變數工具", subtitle: "Multivariable Tools", tags: ["multivariable", "nabla", "vector-calculus", "hessian", "jacobian", "jacobian-chain", "lagrange-multiplier", "wronskian", "partial-derivative", "directional-derivative"] },
    { label: "特殊函數與複變", subtitle: "Special Functions", tags: ["bessel", "special-functions", "complex"] }
  ],
  integrals: [
    { label: "換元積分", subtitle: "Substitution", tags: ["substitution", "u-sub", "radical", "trig-substitution"] },
    { label: "分部積分", subtitle: "Integration by Parts", tags: ["integration-by-parts", "ibp", "multi-ibp", "recurrence-formula"] },
    { label: "有理函數", subtitle: "Rational & Partial Fractions", tags: ["rational", "partial-fraction"] },
    { label: "三角積分", subtitle: "Trig Integrals", tags: ["trig-power", "trig-integral", "wallis", "kings-property", "trig"] },
    { label: "瑕積分與參數化", subtitle: "Improper & Parameter", tags: ["improper-integral", "parameter-integral", "frullani"] },
    { label: "特殊函數", subtitle: "Beta / Gamma", tags: ["beta-function", "gamma-function", "special-functions", "special-function"] },
    { label: "重積分", subtitle: "Multiple Integrals", tags: ["double-integral", "triple-integral", "multivariable", "jacobian"] },
    { label: "複變與留數", subtitle: "Complex & Residues", tags: ["complex", "residue"] }
  ],
  series: [
    { label: "審斂與求和", subtitle: "Convergence & Sums", tags: ["root-test", "ratio-test", "integral-test", "telescoping", "sum-series", "alternating"] },
    { label: "冪級數", subtitle: "Power Series", tags: ["power-series", "radius", "coefficient", "taylor"] }
  ]
};

const MIXED_GROUP = { label: "綜合", subtitle: "Mixed", tags: [] };

const RANK_LABELS = {
  1: "Warm-up",
  2: "Basic",
  3: "Standard",
  4: "Advanced",
  5: "Boss",
  6: "Boss+"
};

const topicByKey = new Map(TOPICS.map((topic) => [topic.key, topic]));

function problemRank(problem) {
  return problem.rank || problem.difficulty || 1;
}

// --- print order: topic -> technique group -> rank -> source order --------
function techniqueGroupsFor(topicKey) {
  return [...(TECHNIQUE_GROUPS[topicKey] || []), MIXED_GROUP];
}

function groupProblems(topicKey) {
  const list = problems.filter((problem) => problem.topic === topicKey);
  const groups = techniqueGroupsFor(topicKey).map((group) => ({ ...group, problems: [] }));
  const mixed = groups[groups.length - 1];
  list.forEach((problem) => {
    const tags = problem.tags || [];
    const group = groups.find((candidate) => candidate.tags.some((tag) => tags.includes(tag)));
    (group || mixed).problems.push(problem);
  });
  groups.forEach((group) => {
    group.problems.sort((a, b) => problemRank(a) - problemRank(b) || String(a.id).localeCompare(String(b.id)));
  });
  return groups.filter((group) => group.problems.length > 0);
}

const topicGroups = new Map(TOPICS.map((topic) => [topic.key, groupProblems(topic.key)]));
const orderedProblems = TOPICS.flatMap((topic) =>
  topicGroups.get(topic.key).flatMap((group) => group.problems)
);
const problemNumber = new Map(orderedProblems.map((problem, index) => [problem.id, index + 1]));

if (orderedProblems.length !== problems.length) {
  const known = new Set(orderedProblems.map((problem) => problem.id));
  const dropped = problems.filter((problem) => !known.has(problem.id)).map((problem) => `${problem.id} (${problem.topic})`);
  throw new Error(`Workbook dropped ${dropped.length} problems with unknown topics: ${dropped.slice(0, 10).join(", ")}`);
}

// --- LaTeX text escaping ---------------------------------------------------
const LATEX_ESCAPES = {
  "\\": "\\textbackslash{}",
  "{": "\\{",
  "}": "\\}",
  "%": "\\%",
  "$": "\\$",
  "&": "\\&",
  "#": "\\#",
  "_": "\\_",
  "^": "\\textasciicircum{}",
  "~": "\\textasciitilde{}"
};

function latexText(value) {
  return String(value ?? "").replace(/[\\{}%$&#_^~]/g, (char) => LATEX_ESCAPES[char]);
}

// Escape prose but typeset ^ / _ affixes as real super/subscripts so hints
// like "e^{2x}=1+2x+..." stop printing caret-and-brace ASCII.
function proseTex(value) {
  const SUP_OPEN = "\u0001";
  const SUB_OPEN = "\u0002";
  const CLOSE = "\u0003";
  const marked = String(value ?? "")
    .replace(/\^(\{[^{}]*\}|[A-Za-z0-9+\-]+)/g, (m, exp) => SUP_OPEN + exp.replace(/^\{|\}$/g, "") + CLOSE)
    .replace(/_(\{[^{}]*\}|[A-Za-z0-9]+)/g, (m, sub) => SUB_OPEN + sub.replace(/^\{|\}$/g, "") + CLOSE);
  return latexText(marked)
    .replace(/\u0001/g, "\\textsuperscript{")
    .replace(/\u0002/g, "\\textsubscript{")
    .replace(/\u0003/g, "}");
}

function latexVerb(value) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (/[぀-ヿ㐀-鿿豈-﫿]/u.test(text)) {
    return `\\texttt{${latexText(text)}}`;
  }
  const delimiter = ["|", "!", "/", "+", ":", ";", "@", "`"].find((item) => !text.includes(item));
  if (!delimiter) return `\\texttt{${latexText(text)}}`;
  return `\\path${delimiter}${text}${delimiter}`;
}

// --- WebWork answer string -> LaTeX math ------------------------------------
// Small recursive-descent parser over the answer grammar actually used by the
// bank (numbers, idents, sin/cos/.../sqrt/exp/log/abs, + - * / ^, parens).
// Falls back to the verbatim \path form when anything doesn't parse.
const FUNCTIONS = {
  sin: "\\sin", cos: "\\cos", tan: "\\tan", sec: "\\sec", csc: "\\csc", cot: "\\cot",
  sinh: "\\sinh", cosh: "\\cosh", tanh: "\\tanh",
  arcsin: "\\arcsin", arccos: "\\arccos", arctan: "\\arctan",
  asin: "\\arcsin", acos: "\\arccos", atan: "\\arctan",
  log: "\\ln", ln: "\\ln"
};
const CONSTANTS = { pi: "\\pi", e: "e", dne: "\\text{DNE}", inf: "\\infty", infinity: "\\infty" };

function tokenizeAnswer(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (/\s/.test(ch)) { i += 1; continue; }
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < text.length && /[0-9.]/.test(text[j])) j += 1;
      tokens.push({ type: "num", value: text.slice(i, j) });
      i = j;
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let j = i;
      while (j < text.length && /[a-zA-Z]/.test(text[j])) j += 1;
      tokens.push({ type: "ident", value: text.slice(i, j) });
      i = j;
      continue;
    }
    if ("+-*/^()".includes(ch)) {
      tokens.push({ type: ch, value: ch });
      i += 1;
      continue;
    }
    throw new Error(`Unexpected character "${ch}"`);
  }
  return tokens;
}

function parseAnswer(text) {
  const tokens = tokenizeAnswer(text);
  let pos = 0;
  const peek = () => tokens[pos];
  const take = (type) => {
    const token = tokens[pos];
    if (!token || (type && token.type !== type)) {
      throw new Error(`Expected ${type || "token"} at ${pos}`);
    }
    pos += 1;
    return token;
  };

  function parseExpr() {
    let node = parseTerm();
    while (peek() && (peek().type === "+" || peek().type === "-")) {
      const op = take().type;
      node = { kind: "bin", op, left: node, right: parseTerm() };
    }
    return node;
  }

  function parseTerm() {
    let node = parseUnary();
    while (peek()) {
      if (peek().type === "*" || peek().type === "/") {
        const op = take().type;
        node = { kind: "bin", op, left: node, right: parseUnary() };
        continue;
      }
      // implicit multiplication: `2x`, `2pi`, `x(x+1)`
      if (peek().type === "num" || peek().type === "ident" || peek().type === "(") {
        node = { kind: "bin", op: "*", left: node, right: parseUnary() };
        continue;
      }
      break;
    }
    return node;
  }

  function parseUnary() {
    if (peek() && peek().type === "-") {
      take();
      return { kind: "neg", value: parseUnary() };
    }
    return parsePower();
  }

  function parsePower() {
    const base = parseAtom();
    if (peek() && peek().type === "^") {
      take();
      return { kind: "pow", base, exp: parseUnary() };
    }
    return base;
  }

  function parseAtom() {
    const token = peek();
    if (!token) throw new Error("Unexpected end of input");
    if (token.type === "num") return { kind: "num", value: take().value };
    if (token.type === "(") {
      take();
      const inner = parseExpr();
      take(")");
      return { kind: "group", value: inner };
    }
    if (token.type === "ident") {
      const name = take().value;
      if (peek() && peek().type === "(" && (FUNCTIONS[name] || name === "sqrt" || name === "abs" || name === "exp")) {
        take();
        const arg = parseExpr();
        take(")");
        return { kind: "call", name, arg };
      }
      return { kind: "ident", value: name };
    }
    throw new Error(`Unexpected token ${token.type}`);
  }

  const node = parseExpr();
  if (pos !== tokens.length) throw new Error("Trailing tokens");
  return node;
}

// precedence: add 1 < mul 2 < neg 3 < pow-base 4; atoms 5
function texNode(node, parentPrec = 0) {
  switch (node.kind) {
    case "num":
      return { tex: node.value, prec: 5, startsWithDigit: true };
    case "ident": {
      if (CONSTANTS[node.value]) return { tex: CONSTANTS[node.value], prec: 5 };
      if (node.value.length === 1) return { tex: node.value, prec: 5 };
      return { tex: `\\mathit{${node.value}}`, prec: 5 };
    }
    case "group":
      return texNode(node.value, parentPrec);
    case "call": {
      const arg = texNode(node.arg, 0).tex;
      if (node.name === "sqrt") return { tex: `\\sqrt{${arg}}`, prec: 5 };
      if (node.name === "abs") return { tex: `\\left|${arg}\\right|`, prec: 5 };
      if (node.name === "exp") return { tex: `e^{${arg}}`, prec: 5 };
      const simpleArg = node.arg.kind === "num" || node.arg.kind === "ident";
      const wrapped = simpleArg ? `(${arg})` : `\\left(${arg}\\right)`;
      return { tex: `${FUNCTIONS[node.name]}${wrapped}`, prec: 4 };
    }
    case "neg": {
      const inner = texNode(node.value, 3);
      const wrapped = inner.prec < 3 ? `\\left(${inner.tex}\\right)` : inner.tex;
      return { tex: `-${wrapped}`, prec: 1 };
    }
    case "pow": {
      const base = texNode(node.base, 5);
      const exp = texNode(node.exp, 0);
      const baseTex = base.prec < 5 || node.base.kind === "call" ? `\\left(${base.tex}\\right)` : base.tex;
      return { tex: `${baseTex}^{${exp.tex}}`, prec: 4 };
    }
    case "bin": {
      if (node.op === "/") {
        if (node.left.kind === "neg") {
          return { tex: `-\\frac{${texNode(node.left.value, 0).tex}}{${texNode(node.right, 0).tex}}`, prec: 1 };
        }
        return { tex: `\\frac{${texNode(node.left, 0).tex}}{${texNode(node.right, 0).tex}}`, prec: 5 };
      }
      if (node.op === "*") {
        const left = texNode(node.left, 2);
        const right = texNode(node.right, 2);
        const leftTex = left.prec < 2 ? `\\left(${left.tex}\\right)` : left.tex;
        const rightTex = right.prec < 2 ? `\\left(${right.tex}\\right)` : right.tex;
        const sep = right.startsWithDigit ? "\\cdot " : "\\,";
        return { tex: `${leftTex}${sep}${rightTex}`, prec: 2 };
      }
      const left = texNode(node.left, 1);
      const right = texNode(node.right, node.op === "-" ? 2 : 1);
      const rightTex = node.op === "-" && right.prec <= 1 ? `\\left(${right.tex}\\right)` : right.tex;
      return { tex: `${left.tex}${node.op}${rightTex}`, prec: 1, startsWithDigit: left.startsWithDigit };
    }
    default:
      throw new Error(`Unknown node ${node.kind}`);
  }
}

function answerTex(problem) {
  const raw = displayAnswer(problem);
  if (problem.answerKind === "text" || /[぀-ヿ㐀-鿿豈-﫿]/u.test(raw)) {
    return latexVerb(raw);
  }
  try {
    const tex = texNode(parseAnswer(String(raw))).tex;
    const suffix = problem.answerKind === "antiderivative" ? " + C" : "";
    return `\\fitmath{${tex}${suffix}}`;
  } catch (error) {
    return latexVerb(raw);
  }
}

function rawTex(value) {
  const text = String(value ?? "")
    .replace(/\r?\n/g, " ")
    .replace(/\{([^{}]+)\\choose\s+([^{}]+)\}/g, "\\binom{$1}{$2}")
    .trim();
  // Reject characters that would silently corrupt the LaTeX build.
  const withoutText = text.replace(/\\text\{[^{}]*\}/g, "");
  if (/[%$&]|\\\\/.test(withoutText.replace(/\\[%$&]/g, ""))) {
    throw new Error(`Prompt contains raw LaTeX-unsafe characters: ${text.slice(0, 80)}`);
  }
  return text;
}

function displayAnswer(problem) {
  if (problem.answerKind === "text") return problem.canonical || (problem.answers && problem.answers[0]) || "";
  return problem.answer || "";
}

function topicInfo(topicKey) {
  return topicByKey.get(topicKey) || { key: topicKey, label: topicKey, subtitle: "" };
}

function shortTags(problem) {
  const tags = (problem.tags || []).filter(Boolean).slice(0, 2);
  return tags.length ? tags.map(latexText).join(" / ") : "—";
}

// Writing space scales with difficulty and the kind of answer expected.
function answerSlots(problem) {
  const rank = problemRank(problem);
  if (rank >= 6) return "\\answerbox{46mm}";
  if (rank >= 5) return "\\answerbox{32mm}";
  const lines = rank >= 3 || problem.answerKind !== "numeric" ? 2 : 1;
  return Array.from({ length: lines }, () => "\\answerslot").join("\n");
}

function formatProblem(problem) {
  const rank = problemRank(problem);
  const globalNo = problemNumber.get(problem.id);
  const rankLabel = problem.rankLabel || RANK_LABELS[rank] || "";
  const isBoss = rank >= 5;
  const meta = [
    `R${rank} ${rankLabel}`,
    `${problem.timeLimit || "-"}s`,
    shortTags(problem)
  ].join(" · ");
  return [
    "\\begin{prob}",
    `\\probhead{${globalNo}}{${latexText(problem.id)}}{${latexText(meta)}}{${isBoss ? "Boss" : "Accent"}}`,
    `\\probbody{${rawTex(problem.prompt)}}`,
    answerSlots(problem),
    "\\end{prob}"
  ].join("\n");
}

function topicSection(topic) {
  const groups = topicGroups.get(topic.key);
  if (!groups.length) return "";
  const total = groups.reduce((acc, group) => acc + group.problems.length, 0);
  const body = groups
    .map((group) => {
      const blocks = group.problems.map((problem) => formatProblem(problem)).join("\n");
      return [
        `\\techbanner{${latexText(group.label)}}{${latexText(group.subtitle)}}{${group.problems.length}}`,
        blocks
      ].join("\n");
    })
    .join("\n\n");
  return [
    `\\sectionbanner{${latexText(topic.label)}}{${latexText(topic.subtitle)}}{${total}}`,
    "\\begin{multicols}{2}",
    body,
    "\\end{multicols}"
  ].join("\n\n");
}

function countByTopicRows() {
  return TOPICS.map((topic) => {
    const count = orderedProblems.filter((problem) => problem.topic === topic.key).length;
    return `${latexText(topic.label)} & ${count} 題 \\\\`;
  }).join("\n");
}

function rankSummaryRow() {
  const buckets = { "R1–R2": 0, "R3–R4": 0, "R5–R6": 0 };
  orderedProblems.forEach((problem) => {
    const rank = problemRank(problem);
    if (rank <= 2) buckets["R1–R2"] += 1;
    else if (rank <= 4) buckets["R3–R4"] += 1;
    else buckets["R5–R6"] += 1;
  });
  return Object.entries(buckets)
    .map(([label, count]) => `${label} ${count}`)
    .join(" · ");
}

// --- exam-style timed sets ---------------------------------------------------
function mulberry32(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const EXAM_SET_COUNT = 6;
const EXAM_SET_RANK_CURVE = [2, 3, 3, 4, 4, 5, 5, 6];

function buildExamSets() {
  const random = mulberry32(20260703);
  const pool = orderedProblems.filter((problem) => (problem.tags || []).includes("exam-style"));
  const byRank = new Map();
  pool.forEach((problem) => {
    const rank = problemRank(problem);
    if (!byRank.has(rank)) byRank.set(rank, []);
    byRank.get(rank).push(problem);
  });
  const used = new Set();
  const pick = (rank) => {
    for (let candidateRank = rank; candidateRank >= 1; candidateRank -= 1) {
      const candidates = (byRank.get(candidateRank) || []).filter((problem) => !used.has(problem.id));
      if (candidates.length) {
        const problem = candidates[Math.floor(random() * candidates.length)];
        used.add(problem.id);
        return problem;
      }
    }
    return null;
  };
  return Array.from({ length: EXAM_SET_COUNT }, (unused, index) => {
    const picked = EXAM_SET_RANK_CURVE.map(pick).filter(Boolean);
    picked.sort((a, b) => problemRank(a) - problemRank(b));
    const budget = picked.reduce((acc, problem) => acc + (problem.timeLimit || 90), 0);
    return { index: index + 1, problems: picked, minutes: Math.max(5, Math.round(budget / 60)) };
  });
}

function examSetSection() {
  const sets = buildExamSets();
  const blocks = sets
    .map((set) => {
      const body = set.problems
        .map((problem) => formatProblem(problem))
        .join("\n");
      return [
        "\\clearpage",
        `\\sectionbanner{模擬考 ${set.index}}{Timed Set · ${set.minutes} min}{${set.problems.length}}`,
        "\\begin{multicols}{2}",
        body,
        "\\end{multicols}"
      ].join("\n");
    })
    .join("\n\n");
  return [
    "\\clearpage",
    "\\section*{附錄：模擬考}",
    "\\addcontentsline{toc}{section}{附錄：模擬考}",
    "{\\sffamily\\small\\textcolor{Muted}{每回依難度曲線抽 8 題，題號對應正文與答案速查。計時完成後再對答案。}}\\par",
    blocks
  ].join("\n");
}

// --- answers -----------------------------------------------------------------
function answerKeyRows() {
  return orderedProblems.map((problem, index) => {
    const no = String(index + 1).padStart(4, "0");
    return `\\item[${no}. ${latexText(problem.id)}] ${answerTex(problem)}`;
  }).join("\n");
}

function solutionRows() {
  return orderedProblems.map((problem, index) => {
    const no = String(index + 1).padStart(4, "0");
    const answer = answerTex(problem);
    const solution = proseTex(problem.solution || "");
    return [
      "\\begin{solutionitem}",
      `\\solutionmeta{${no}}{${latexText(problem.id)}}{${latexText(topicInfo(problem.topic).label)} · R${problemRank(problem)}}`,
      `\\textbf{Answer.} ${answer}\\par`,
      `\\textbf{Note.} ${solution}`,
      "\\end{solutionitem}"
    ].join("\n");
  }).join("\n\n");
}

function answerKeySection() {
  return [
    "\\clearpage",
    "\\section*{答案速查}",
    "\\addcontentsline{toc}{section}{答案速查}",
    "\\begin{multicols}{2}",
    "\\begin{description}[leftmargin=23mm,style=nextline,font=\\normalfont\\bfseries]",
    answerKeyRows(),
    "\\end{description}",
    "\\end{multicols}",
    "\\clearpage",
    "\\section*{答案與解法提示}",
    "\\addcontentsline{toc}{section}{答案與解法提示}",
    solutionRows()
  ].join("\n");
}

function makeDocument() {
  return String.raw`% !TEX program = xelatex
% Generated by tools/generate_workbook.js
\documentclass[10pt,a4paper]{article}

\usepackage{fontspec}
\usepackage{xeCJK}
\usepackage{amsmath,amssymb}
\usepackage[margin=13mm,top=15mm,bottom=15mm]{geometry}
\usepackage[dvipsnames]{xcolor}
\usepackage{enumitem}
\usepackage{multicol}
\usepackage{graphicx}
\usepackage{fancyhdr}
\usepackage[hidelinks]{hyperref}
\Urlmuskip=0mu plus 2mu

\IfFontExistsTF{TeX Gyre Pagella}{\setmainfont{TeX Gyre Pagella}}{\setmainfont{Latin Modern Roman}}
\IfFontExistsTF{TeX Gyre Heros}{\setsansfont{TeX Gyre Heros}}{\setsansfont{Latin Modern Sans}}
\IfFontExistsTF{JetBrains Mono}{\setmonofont{JetBrains Mono}}{\setmonofont{Latin Modern Mono}}

\IfFontExistsTF{Noto Serif CJK TC}
  {\setCJKmainfont{Noto Serif CJK TC}}
  {\IfFontExistsTF{Noto Serif CJK SC}
    {\setCJKmainfont{Noto Serif CJK SC}}
    {\IfFontExistsTF{Noto Sans CJK TC}
      {\setCJKmainfont{Noto Sans CJK TC}}
      {\IfFontExistsTF{Noto Sans CJK SC}
        {\setCJKmainfont{Noto Sans CJK SC}}
        {\IfFontExistsTF{Microsoft JhengHei}
          {\setCJKmainfont{Microsoft JhengHei}}
          {\IfFontExistsTF{WenQuanYi Micro Hei}
            {\setCJKmainfont{WenQuanYi Micro Hei}}
            {\IfFontExistsTF{AR PL UMing TW}
              {\setCJKmainfont{AR PL UMing TW}}
              {\IfFontExistsTF{FandolSong-Regular}
                {\setCJKmainfont{FandolSong-Regular}}
                {\setCJKmainfont{Latin Modern Roman}}}}}}}}}

\IfFontExistsTF{Noto Sans CJK TC}
  {\setCJKsansfont{Noto Sans CJK TC}}
  {\IfFontExistsTF{Noto Sans CJK SC}
    {\setCJKsansfont{Noto Sans CJK SC}}
    {\IfFontExistsTF{Microsoft JhengHei}
      {\setCJKsansfont{Microsoft JhengHei}}
      {\IfFontExistsTF{WenQuanYi Micro Hei}
        {\setCJKsansfont{WenQuanYi Micro Hei}}
        {\IfFontExistsTF{FandolHei-Regular}
          {\setCJKsansfont{FandolHei-Regular}}
          {\setCJKsansfont{Latin Modern Sans}}}}}}

\IfFontExistsTF{Noto Sans Mono CJK TC}
  {\setCJKmonofont{Noto Sans Mono CJK TC}}
  {\IfFontExistsTF{Noto Sans Mono CJK SC}
    {\setCJKmonofont{Noto Sans Mono CJK SC}}
    {\IfFontExistsTF{WenQuanYi Micro Hei}
      {\setCJKmonofont{WenQuanYi Micro Hei}}
      {\IfFontExistsTF{FandolHei-Regular}
        {\setCJKmonofont{FandolHei-Regular}}
        {\setCJKmonofont{Latin Modern Mono}}}}}

\xeCJKsetup{CJKmath=true}

\definecolor{Ink}{HTML}{1A1C1A}
\definecolor{Muted}{HTML}{7A8694}
\definecolor{Line}{HTML}{E2E6EA}
\definecolor{Panel}{HTML}{F4F7F6}
\definecolor{Accent}{HTML}{0E7C6B}
\definecolor{AccentDark}{HTML}{0A5247}
\definecolor{Boss}{HTML}{B4471F}

\color{Ink}
\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}
\setlength{\columnsep}{7mm}
\setlength{\columnseprule}{0.3pt}
\renewcommand{\columnseprulecolor}{\color{Line}}

\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}
\fancyfoot[C]{\sffamily\scriptsize\textcolor{Muted}{BuzzCalculus 題庫題本}}
\fancyfoot[R]{\sffamily\scriptsize\textcolor{Muted}{\thepage}}
\fancyfoot[L]{\sffamily\scriptsize\textcolor{Muted}{\leftmark}}
\renewcommand{\sectionmark}[1]{\markboth{#1}{}}

% --- problem block -------------------------------------------------
\newenvironment{prob}{%
  \par\addvspace{1.5mm}\noindent\begingroup\small
}{%
  \par\endgroup\addvspace{2.2mm}
}

\newcommand{\probhead}[4]{%
  {\sffamily\colorbox{#4}{\textcolor{white}{\footnotesize\bfseries\,#1\,}}%
   \hspace{1.6mm}{\footnotesize\bfseries #2}}\par
  {\sffamily\scriptsize\textcolor{Muted}{#3}}\par
}

% shrink-to-fit display math, left aligned, never overflows a column
\newcommand{\probbody}[1]{%
  \par\vspace{1.3mm}\noindent
  \resizebox{\ifdim\width>\linewidth \linewidth\else \width\fi}{!}{$\displaystyle #1$}%
  \par
}

% inline math that shrinks instead of overflowing the column
\newcommand{\fitmath}[1]{\resizebox{\ifdim\width>\linewidth \linewidth\else \width\fi}{!}{$#1$}}

\newcommand{\answerslot}{%
  \par\vspace{5.5mm}{\color{Line}\rule{\linewidth}{0.3pt}}%
}

% ruled writing box for Boss-tier problems
\newcommand{\answerbox}[1]{%
  \par\vspace{1.6mm}\noindent
  {\color{Line}\setlength{\fboxrule}{0.35pt}\setlength{\fboxsep}{0pt}%
   \fbox{\parbox[t][#1][t]{\dimexpr\linewidth-2\fboxrule\relax}{\strut}}}%
}

% --- section banner ------------------------------------------------
\newcommand{\sectionbanner}[3]{%
  \par\addvspace{2mm}%
  \noindent\colorbox{Accent}{%
    \parbox{\dimexpr\linewidth-2\fboxsep\relax}{%
      \sffamily\color{white}\vspace{1.2mm}\par
      {\LARGE\bfseries #1}\,{\normalsize\textcolor{Line}{#2}}\hfill{\small #3 題}%
      \vspace{1.2mm}\par}}%
  \addcontentsline{toc}{section}{#1 · #2}%
  \par\vspace{3mm}%
}

% --- technique sub-banner -------------------------------------------
\newcommand{\techbanner}[3]{%
  \par\addvspace{3mm}%
  \noindent{\sffamily\large\bfseries\textcolor{AccentDark}{#1}}\hspace{1.8mm}%
  {\sffamily\footnotesize\textcolor{Muted}{#2 · #3 題}}\par
  \nointerlineskip\vspace{0.8mm}%
  {\color{Accent}\rule{26mm}{1.4pt}}%
  \addcontentsline{toc}{subsection}{#1}%
  \par\vspace{1.6mm}%
}

% --- solutions -----------------------------------------------------
\newenvironment{solutionitem}{%
  \par\smallskip\noindent\begingroup\small
}{%
  \par\endgroup\vspace{0.5mm}{\color{Line}\rule{\linewidth}{0.25pt}}
}

\newcommand{\solutionmeta}[3]{%
  {\sffamily\scriptsize\colorbox{Boss}{\textcolor{white}{\bfseries\,#1\,}}\hspace{1.4mm}\textbf{#2}\hfill\textcolor{Muted}{#3}}\par
}

\begin{document}
\thispagestyle{empty}

\vspace*{12mm}
\noindent{\color{Accent}\rule{\linewidth}{2.2pt}}\par
\vspace{6mm}
\noindent{\sffamily\fontsize{34}{38}\selectfont\bfseries BuzzCalculus}\par
\vspace{1.5mm}
\noindent{\sffamily\Large\textcolor{Muted}{技巧題本 · Techniques Workbook}}\par
\vspace{4mm}
\noindent{\color{Accent}\rule{\linewidth}{2.2pt}}\par
\vspace{12mm}

\noindent\colorbox{Panel}{\parbox{\dimexpr\linewidth-2\fboxsep\relax}{%
  \vspace{2mm}
  \sffamily
  \renewcommand{\arraystretch}{1.45}
  \begin{tabular}{@{\hspace{3mm}}ll@{}}
  \textcolor{Muted}{總題數} & \textbf{${orderedProblems.length}} 題 \\
  ${countByTopicRows()}
  \textcolor{Muted}{難度分佈} & ${rankSummaryRow()} \\
  \textcolor{Muted}{編譯} & XeLaTeX + XeCJK \\
  \end{tabular}
  \vspace{2mm}
}}

\vspace{12mm}

\noindent{\sffamily\small\textcolor{Muted}{姓名}}\quad\rule{46mm}{0.4pt}\hfill
{\sffamily\small\textcolor{Muted}{日期}}\quad\rule{36mm}{0.4pt}\hfill
{\sffamily\small\textcolor{Muted}{分數}}\quad\rule{30mm}{0.4pt}

\vfill
\noindent{\sffamily\footnotesize\textcolor{Muted}{本題本由 BuzzCalculus 題庫自動產生：章節依技巧分組、章內由淺入深，含模擬考、答案速查與解法提示。答案同時支援 WebWork 輸入格式。}}

\clearpage
\pagestyle{fancy}
\renewcommand{\contentsname}{目錄}
\tableofcontents
\clearpage
${TOPICS.map(topicSection).join("\n\n")}

${examSetSection()}

${answerKeySection()}

\end{document}
`;
}

const outputDir = path.join(__dirname, "..", "workbook");
const outputFile = path.join(outputDir, "buzzcalculus_workbook.tex");

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, makeDocument(), "utf8");

const counts = TOPICS.reduce((acc, topic) => {
  acc[topic.key] = orderedProblems.filter((problem) => problem.topic === topic.key).length;
  return acc;
}, {});

const parsedAnswers = orderedProblems.filter((problem) => answerTex(problem).startsWith("\\fitmath")).length;

console.log(`Wrote ${path.relative(process.cwd(), outputFile)}`);
console.log(JSON.stringify({
  total: orderedProblems.length,
  counts,
  answersTypesetAsMath: parsedAnswers
}, null, 2));
