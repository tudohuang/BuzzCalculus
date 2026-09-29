// 把「微積分 20 講隨堂測驗」的 LaTeX 考卷（caNN.tex）拆成題目骨架。
//
// 產出 tools/content/lecture_exams_skeleton.json：每份卷 5 題選擇 + 4 題計算題（各拆成小題），
// 題幹已經轉成站上能用的 KaTeX 單一字串（散文包 \text{}、自訂巨集展開），解答轉成純文字。
// 骨架**不含答案的判分格式**——那一層在 tools/content/lecture_exams_answers.json 手工寫
// （answerKind、答案語法、驗算描述子、rank、tags），tools/build_lecture_pack.js 再把兩邊合成
// src/problem_lecture_pack.js。骨架可以重跑，答案檔不會被沖掉。
//
// 用法：node tools/import_lecture_exams.js <考卷資料夾（放 ca01.tex … ca20.tex 的那一層）>
"use strict";

const fs = require("fs");
const path = require("path");

const DIR = process.argv[2];
if (!DIR) {
  console.error("用法：node tools/import_lecture_exams.js <考卷資料夾>");
  process.exit(1);
}
const OUT = path.join(__dirname, "content", "lecture_exams_skeleton.json");

// ── 括號工具 ───────────────────────────────────────────────────
// 從 source[from] 是 "{" 的位置讀到配對的 "}"，回傳 { body, end }
function braceGroup(source, from) {
  if (source[from] !== "{") throw new Error("expected { at " + from + ": " + source.slice(from, from + 30));
  let depth = 0;
  for (let i = from; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === "\\") { i += 1; continue; }
    if (ch === "{") depth += 1;
    else if (ch === "}") { depth -= 1; if (depth === 0) return { body: source.slice(from + 1, i), end: i + 1 }; }
  }
  throw new Error("unbalanced braces from " + from);
}

// \cmd{a}{b}… 取 n 個參數
// 參數可以是 {…}、一個控制序列（\pi）或單一字元（\tfrac12、\abs x 這種 TeX 寫法）
function readArgs(source, from, n) {
  const args = [];
  let at = from;
  for (let k = 0; k < n; k += 1) {
    while (at < source.length && /\s/.test(source[at])) at += 1;
    if (source[at] === "{") {
      const group = braceGroup(source, at);
      args.push(group.body);
      at = group.end;
    } else if (source[at] === "\\") {
      const m = source.slice(at).match(/^\\([A-Za-z]+|.)/);
      args.push(m[0]);
      at += m[0].length;
    } else {
      args.push(source[at] || "");
      at += 1;
    }
  }
  return { args, end: at };
}

// 把 \cmd{…} 換成 replacer(body)（處理巢狀括號）
function replaceCommand(source, command, replacer, argc = 1) {
  let out = "";
  let i = 0;
  while (i < source.length) {
    const at = source.indexOf(command, i);
    if (at < 0) { out += source.slice(i); break; }
    // 要是完整的命令名（\dd 不能吃到 \ddt）
    const next = source[at + command.length];
    if (next && /[A-Za-z]/.test(next)) { out += source.slice(i, at + command.length); i = at + command.length; continue; }
    let k = at + command.length;
    while (k < source.length && /\s/.test(source[k])) k += 1;
    // 沒有參數（行尾、遇到 \right 之類）就交給 replacer(null)
    if (k >= source.length || argc === 0) { out += source.slice(i, at); out += replacer(null); i = at + command.length; continue; }
    const { args, end } = readArgs(source, k, argc);
    out += source.slice(i, at) + replacer(...args);
    i = end;
  }
  return out;
}

// ── 自訂巨集 → KaTeX ────────────────────────────────────────────
function expandMath(tex) {
  let s = tex;
  s = replaceCommand(s, "\\abs", (b) => (b === null ? "\\left|" : `\\left|${expandMath(b)}\\right|`));
  s = replaceCommand(s, "\\pd", (a, b) => `\\frac{\\partial ${a}}{\\partial ${b}}`, 2);
  s = replaceCommand(s, "\\unit", (b) => `\\,\\text{${b}}`);
  s = replaceCommand(s, "\\vv", (b) => `\\mathbf{${b}}`);
  s = replaceCommand(s, "\\textbf", (b) => b);
  s = replaceCommand(s, "\\text", (b) => `\\text{${b}}`);
  s = s.replace(/\\ddt\b/g, "\\frac{d}{dt}");
  s = s.replace(/\\dd\b\s*/g, "d");
  s = s.replace(/\\dx\b/g, "\\,dx").replace(/\\dy\b/g, "\\,dy").replace(/\\dA\b/g, "\\,dA").replace(/\\dV\b/g, "\\,dV").replace(/\\ds\b/g, "\\,ds");
  s = s.replace(/\\ee\b/g, "e");
  s = s.replace(/\\R\b/g, "\\mathbb{R}");
  s = s.replace(/\\grad\b/g, "\\nabla");
  s = s.replace(/\\sech\b/g, "\\operatorname{sech}");
  s = s.replace(/\\arcsec\b/g, "\\operatorname{arcsec}");
  s = s.replace(/\\mathrm\{([A-Za-z]+)\}/g, "\\text{$1}");
  s = s.replace(/\\displaystyle\s*/g, "\\displaystyle ");
  // TeX 的 \frac in、\tfrac13 這種省略大括號的寫法：補上括號（lint 會把 "in" 當英文字）
  s = s.replace(/\\([dt]?frac)\s*([0-9a-zA-Z])\s*([0-9a-zA-Z])(?![a-zA-Z0-9{])/g, "\\$1{$2}{$3}");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

// 散文 → \text{…}（KaTeX 的 text 模式：% 要跳脫、· 不能用）
function proseToText(prose) {
  let s = prose.replace(/\s+/g, " ");
  s = replaceCommand(s, "\\textbf", (b) => b);
  s = replaceCommand(s, "\\text", (b) => b);
  s = s.replace(/\\\\/g, " ").replace(/\\,|\\;|\\quad|\\qquad|~/g, " ");
  s = s.replace(/\\%/g, "%").replace(/%/g, "\\%").replace(/·/g, "·");
  s = s.replace(/\\ldots|\\dots/g, "…").replace(/---/g, "—").replace(/--/g, "–");
  s = s.replace(/\\([&#_{}])/g, "$1");
  s = s.replace(/\s+/g, " ");
  return s;
}

// 混合的 LaTeX（散文 + $…$ + \[…\]）→ 單一 KaTeX 字串
function toPrompt(mixed) {
  const parts = [];
  const re = /\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]|\$([^$]*)\$/g;
  let last = 0;
  let m;
  while ((m = re.exec(mixed))) {
    if (m.index > last) parts.push({ prose: mixed.slice(last, m.index) });
    const inner = m[1] !== undefined ? m[1] : m[2] !== undefined ? m[2] : m[3];
    parts.push({ math: inner, display: m[3] === undefined });
    last = m.index + m[0].length;
  }
  if (last < mixed.length) parts.push({ prose: mixed.slice(last) });
  const out = [];
  parts.forEach((part, index) => {
    if (part.math !== undefined) {
      const math = expandMath(part.math);
      out.push(part.display && !/\\displaystyle/.test(math) ? `\\displaystyle ${math}` : math);
      return;
    }
    let text = proseToText(part.prose);
    // 邊界留一個空白，讓字跟式子不黏在一起
    const lead = index > 0 && !/^[，。：；、）)]/.test(text.trim()) ? " " : "";
    const trail = index < parts.length - 1 && !/[（(]$/.test(text.trim()) ? " " : "";
    text = text.trim();
    if (!text) return;
    out.push(`\\text{${lead}${text}${trail}}`);
  });
  return out.join("").replace(/\s+/g, " ").trim();
}

// LaTeX → 可讀的純文字（解答用；站上的 solution 不渲染 KaTeX）
function toPlain(mixed) {
  let s = mixed;
  s = s.replace(/\\begin\{center\}[\s\S]*?\\end\{center\}/g, "（圖略）");
  s = s.replace(/\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g, "（圖略）");
  s = s.replace(/\\begin\{minipage\}(\[[^\]]*\])?\{[^}]*\}|\\end\{minipage\}|\\hfill/g, " ");
  s = s.replace(/\\sqrt\[([^\]]*)\]\{([^{}]*)\}/g, "($2)^(1/$1)").replace(/\\ /g, " ");
  s = s.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (m, b) => b.replace(/&/g, "").replace(/\\\\/g, "；"));
  s = s.replace(/\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g, (m, a, b) => " " + (a || b) + " ");
  s = s.replace(/\$([^$]*)\$/g, (m, inner) => inner);
  s = replaceCommand(s, "\\textbf", (b) => b);
  s = replaceCommand(s, "\\text", (b) => b);
  // 符號表先換（\cdot\sin 拆開之後才不會黏成 \cdotsin）
  const symbols = { "\\cdot": "·", "\\cdots": "…", "\\times": "×", "\\pm": "±", "\\to": "→", "\\infty": "∞", "\\le": "≤", "\\ge": "≥", "\\neq": "≠", "\\ne": "≠" };
  s = s.replace(/\\(cdots|cdot|times|pm|to|infty|le|ge|neq|ne)\b/g, (cmd) => symbols[cmd] + " ").replace(/ (?=[\w(])/g, " ");
  s = replaceCommand(s, "\\abs", (b) => (b === null ? "|" : `|${b}|`));
  s = replaceCommand(s, "\\pd", (a, b) => `∂${a}/∂${b}`, 2);
  s = replaceCommand(s, "\\unit", (b) => ` ${b}`);
  s = replaceCommand(s, "\\vv", (b) => b);
  s = replaceCommand(s, "\\mathrm", (b) => b);
  s = replaceCommand(s, "\\mathbf", (b) => b);
  s = replaceCommand(s, "\\operatorname", (b) => b);
  s = replaceCommand(s, "\\left", (b) => (b === null ? "" : b));
  s = replaceCommand(s, "\\right", (b) => (b === null ? "" : b));
  s = replaceCommand(s, "\\sqrt", (b) => (b === null ? "√" : `√(${b})`));
  s = replaceCommand(s, "\\overline", (b) => b);
  s = replaceCommand(s, "\\bar", (b) => b);
  s = replaceCommand(s, "\\dot", (b) => b + "′");
  s = replaceCommand(s, "\\mathbb", (b) => b);
  s = replaceCommand(s, "\\binom", (a, b) => `C(${a},${b})`, 2);
  // \frac{a}{b}：短的寫 a/b，長的加括號
  const frac = (a, b) => {
    const A = toPlain(a).trim(); const B = toPlain(b).trim();
    const wrap = (x) => (/^[\w.]+$/.test(x) ? x : `(${x})`);
    return `${wrap(A)}/${wrap(B)}`;
  };
  ["\\dfrac", "\\tfrac", "\\frac"].forEach((c) => { s = replaceCommand(s, c, frac, 2); });
  const map = {
    "\\to": "→", "\\infty": "∞", "\\le": "≤", "\\ge": "≥", "\\neq": "≠", "\\ne": "≠", "\\pm": "±", "\\cdot": "·", "\\cdots": "…", "\\ldots": "…", "\\dots": "…",
    "\\times": "×", "\\pi": "π", "\\theta": "θ", "\\lambda": "λ", "\\varepsilon": "ε", "\\epsilon": "ε", "\\delta": "δ", "\\Delta": "Δ", "\\rho": "ρ", "\\phi": "φ", "\\mu": "μ", "\\alpha": "α", "\\beta": "β",
    "\\Rightarrow": "⇒", "\\Leftrightarrow": "⇔", "\\iff": "⇔", "\\in": "∈", "\\partial": "∂", "\\nabla": "∇", "\\grad": "∇", "\\int": "∫", "\\iint": "∬", "\\iiint": "∭", "\\oint": "∮", "\\sum": "Σ",
    "\\lim": "lim", "\\sin": "sin", "\\cos": "cos", "\\tan": "tan", "\\sec": "sec", "\\csc": "csc", "\\cot": "cot", "\\ln": "ln", "\\log": "log", "\\arctan": "arctan", "\\arcsin": "arcsin", "\\arccos": "arccos", "\\arcsec": "arcsec", "\\sech": "sech",
    "\\ee": "e", "\\R": "ℝ", "\\approx": "≈", "\\lfloor": "⌊", "\\rfloor": "⌋", "\\circ": "°", "\\parallel": "∥", "\\max": "max", "\\min": "min", "\\ddt": "d/dt", "\\dd": "d", "\\dx": " dx", "\\dy": " dy", "\\dA": " dA", "\\dV": " dV", "\\ds": " ds",
    "\\quad": " ", "\\qquad": " ", "\\,": "", "\\;": " ", "\\!": "", "\\displaystyle": "", "\\bigl": "", "\\bigr": "", "\\Bigl": "", "\\Bigr": "", "\\big": "", "\\Big": "", "\\not": "¬", "\\empty": "∅", "\\ll": "≪", "\\hfill": " ", "\\noindent": "", "\\par": "\n", "\\smallskip": "\n", "\\medskip": "\n", "\\small": "", "\\scriptsize": "", "\\rm": ""
  };
  s = s.replace(/\\[A-Za-z]+|\\[,;!]/g, (cmd) => (cmd in map ? map[cmd] : cmd));
  s = s.replace(/\\\\/g, "\n").replace(/~/g, " ");
  s = s.replace(/\^\{([^{}]*)\}/g, "^($1)").replace(/_\{([^{}]*)\}/g, "_($1)");
  s = s.replace(/\^\(([\w.+-])\)/g, "^$1").replace(/_\(([\w.+-])\)/g, "_$1");
  s = s.replace(/[{}]/g, "");
  s = s.replace(/\\%/g, "%").replace(/\\([&#])/g, "$1");
  s = s.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  return s;
}

// ── 解析一份卷 ───────────────────────────────────────────────
function stripComments(source) {
  return source.replace(/(^|[^\\])%[^\n]*/g, "$1");
}

function parseExam(source, lecture) {
  const s = stripComments(source);
  const header = s.match(/\\examheader\{(\d+)\}\{([^}]*)\}\{([^}]*)\}/);
  const topic = header ? header[2] : "";
  const formulasAt = s.indexOf("\\formulas{");
  const formulas = formulasAt >= 0 ? toPlain(braceGroup(s, formulasAt + "\\formulas".length).body) : "";
  const body = s.slice(s.indexOf("\\begin{document}"), s.indexOf("\\end{document}"));
  const sections = body.split(/\\sect\{/);
  if (sections.length < 3) throw new Error(`ca${lecture}: 找不到兩個 \\sect`);
  const mcSection = sections[1];
  const longSection = sections[2];

  const splitProbs = (section) => section.split(/(?=\\prob\b)/).filter((chunk) => /^\\prob\b/.test(chunk));

  const mc = splitProbs(mcSection).map((chunk, index) => {
    const ansMatch = chunk.match(/\\ans\{([A-D])\}/);
    const promptTex = chunk.replace(/^\\prob\s*/, "").slice(0, ansMatch ? ansMatch.index - 0 : undefined).replace(/\\ans\{[A-D]\}/, "").replace(/^\\prob\s*/, "").trim();
    const promptEnd = ansMatch ? chunk.indexOf(ansMatch[0]) : chunk.length;
    const stem = chunk.slice(0, promptEnd).replace(/^\\prob\s*/, "").trim();
    const ch = chunk.match(/\\ch[ABC]/);
    let options = [];
    if (ch) {
      const { args } = readArgs(chunk, ch.index + 4, 4);
      options = args.map((a) => a.trim());
    }
    const sol = chunk.match(/\\begin\{sol\}([\s\S]*?)\\end\{sol\}/);
    return {
      id: `lec-${lecture}-m${index + 1}`,
      kind: "mc",
      stemTex: stem,
      prompt: toPrompt(stem),
      optionsTex: options,
      options: options.map((o) => toPrompt(o)),
      optionsPlain: options.map((o) => toPlain(o)),
      answerLetter: ansMatch ? ansMatch[1] : "",
      solution: sol ? toPlain(sol[1]) : ""
    };
  });

  const long = splitProbs(longSection).map((chunk, index) => {
    const pts = chunk.match(/^\\prob\[(\d+)\]/);
    const titleMatch = chunk.match(/\\textbf\{([^}]*)\}/);
    const enumAt = chunk.indexOf("\\begin{enumerate}");
    const enumEnd = chunk.indexOf("\\end{enumerate}");
    const solMatch = chunk.match(/\\begin\{sol\}([\s\S]*?)\\end\{sol\}/);
    let stemTex = chunk.slice(0, enumAt >= 0 ? enumAt : (solMatch ? solMatch.index : chunk.length))
      .replace(/^\\prob(\[\d+\])?\s*/, "").replace(/\\textbf\{[^}]*\}/, "").trim();
    const hasFigure = /tikzpicture/.test(stemTex);
    const dropFigures = (tex) => tex
      .replace(/\\begin\{center\}[\s\S]*?\\end\{center\}/g, " ")
      .replace(/\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g, " ")
      .replace(/\\begin\{minipage\}(\[[^\]]*\])?\{[^}]*\}|\\end\{minipage\}|\\hfill|\\vspace\{[^}]*\}|\\centering/g, " ")
      .trim();
    stemTex = dropFigures(stemTex);
    const itemsTex = enumAt >= 0
      ? chunk.slice(enumAt + "\\begin{enumerate}".length, enumEnd).split(/\\item\b/).map((x) => x.trim()).filter(Boolean)
      : [];
    const solText = solMatch ? solMatch[1] : "";
    // 解答依 (a)(b)(c) 切段
    const solParts = {};
    const pieces = solText.split(/(?:^|\n|\\\\)\s*\(([a-h])\)\s*/);
    for (let k = 1; k < pieces.length; k += 2) solParts[pieces[k]] = toPlain(pieces[k + 1] || "");
    return {
      id: `lec-${lecture}-q${index + 1}`,
      kind: "long",
      points: pts ? Number(pts[1]) : 0,
      title: titleMatch ? titleMatch[1] : "",
      hasFigure,
      stemTex,
      stem: toPrompt(stemTex),
      items: itemsTex.map((it, k) => {
        const letter = String.fromCharCode(97 + k);
        const figure = /tikzpicture/.test(it);
        const itemTex = dropFigures(it);
        return {
          id: `lec-${lecture}-q${index + 1}${letter}`,
          letter,
          itemTex,
          prompt: toPrompt(itemTex),
          hasFigure: figure,
          solution: solParts[letter] || "",
          isProof: /證明|說明為什麼|證出|驗證/.test(itemTex),
          isDrawing: /畫出|描繪|大致畫/.test(itemTex)
        };
      }),
      solutionAll: toPlain(solText)
    };
  });

  return { lecture, topic, formulas, mc, long };
}

const exams = [];
for (let n = 1; n <= 20; n += 1) {
  const lecture = String(n).padStart(2, "0");
  const file = path.join(DIR, `ca${lecture}.tex`);
  if (!fs.existsSync(file)) continue;
  exams.push(parseExam(fs.readFileSync(file, "utf8"), lecture));
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(exams, null, 1) + "\n");
const mcCount = exams.reduce((a, e) => a + e.mc.length, 0);
const itemCount = exams.reduce((a, e) => a + e.long.reduce((b, q) => b + q.items.length, 0), 0);
const proofs = exams.reduce((a, e) => a + e.long.reduce((b, q) => b + q.items.filter((i) => i.isProof).length, 0), 0);
const drawings = exams.reduce((a, e) => a + e.long.reduce((b, q) => b + q.items.filter((i) => i.isDrawing).length, 0), 0);
console.log(`讀了 ${exams.length} 份卷：選擇 ${mcCount} 題、計算題小題 ${itemCount} 個（其中證明 ${proofs}、畫圖 ${drawings}）→ ${path.relative(process.cwd(), OUT)}`);
