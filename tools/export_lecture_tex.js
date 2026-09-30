// 反向匯出：從站上的題庫把 20 講隨堂測驗印回 LaTeX 考卷（內部工具，不是站上的功能）。
//
// 資料來源只有站上的東西：window.BUZZ_LECTURE_PAPERS（每一講的固定題序）＋ 題庫（BUZZ_PROBLEMS）
// ＋ 證明小題指向的白話證明 spec（參考證明印進答案）。站上沒有的小題（畫圖、「說明為什麼」、
// 引擎釘不住的證明）不會出現 —— 印出來的就是站上那一張卷。
//
// 每一講一個 caNN.tex：抬頭、一、選擇題（站上的正解＋三個固定誘答，選項順序由題號決定、每次一樣）、
// 二、計算題（照考卷的大題分組、配分）、卷末答案（選擇題字母、每一小題的答案與解說、證明題的參考證明）。
// 樣式是 tools/content/calcexam.sty（原考卷樣式的精簡版），會一起複製到輸出資料夾，所以輸出自己就能編。
//
// 用法：
//   node tools/export_lecture_tex.js                 20 講全部 → tmp/lecture_tex/
//   node tools/export_lecture_tex.js 01 07           只匯出第 1、7 講
//   node tools/export_lecture_tex.js --out tmp/foo   換輸出資料夾（要在 .gitignore 裡的地方）
//   node tools/export_lecture_tex.js --compile 01    匯出後用 WSL 的 xelatex 編兩次（Windows 的 MiKTeX 在這台機器上是壞的）
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const args = process.argv.slice(2);
const outArg = args.indexOf("--out");
const OUT = path.resolve(ROOT, outArg >= 0 ? args[outArg + 1] : path.join("tmp", "lecture_tex"));
const compile = args.includes("--compile");
const wanted = args.filter((arg, i) => /^\d{1,2}$/.test(arg) && args[i - 1] !== "--out").map((arg) => arg.padStart(2, "0"));

const loadAppApi = require("./lib/app_api.js");
const problems = loadAppApi.allProblems();
const byId = new Map(problems.map((problem) => [problem.id, problem]));
const papers = global.window.BUZZ_LECTURE_PAPERS || {};
const proofSpecs = new Map((global.window.BUZZ_PROOF_LANG_PROBLEMS || []).map((spec) => [spec.id, spec]));
const lectureAnswers = JSON.parse(fs.readFileSync(path.join(__dirname, "content", "lecture_exams_answers.json"), "utf8"));
// 大題的標題與配分：站上的題目身上有（examTitle／examPoints）；整組都引用題庫既有題時才回頭查骨架
const skeleton = JSON.parse(fs.readFileSync(path.join(__dirname, "content", "lecture_exams_skeleton.json"), "utf8"));

if (!Object.keys(papers).length) throw new Error("沒有 BUZZ_LECTURE_PAPERS —— 先跑 node tools/build_lecture_pack.js");

/* ── 答案 → TeX：直接拿 app.js 裡站上用的那一套（參考答案、選項都是它排的），不另抄一份 ── */
const answerToTex = (() => {
  const source = fs.readFileSync(path.join(ROOT, "src", "app.js"), "utf8");
  const start = source.indexOf("  function answerToTex(");
  const end = source.indexOf("  function typesetMath(");
  if (start < 0 || end < start) throw new Error("app.js 裡找不到 answerToTex … typesetMath 那一段");
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${source.slice(start, end)}\nthis.answerToTex = answerToTex;`, context);
  return (value, problem) => {
    const raw = String(value == null ? "" : value).trim();
    if (/^[-+]?(inf|infinity|∞)$/i.test(raw)) return `${raw.startsWith("-") ? "-" : ""}\\infty`;
    return context.answerToTex(raw, problem) || "";
  };
})();

/* ── 題幹：站上是一整條 KaTeX 字串（中文包在 \text{} 裡）。印在紙上要能換行，
   所以最外層的 \text{…} 拆回內文、其餘的數學各自包成 $…$。在 \frac{…}、\left…\right 裡面的 \text 不拆。 ── */
function promptToLatex(tex) {
  const src = String(tex || "");
  const parts = [];
  let math = "";
  let depth = 0;
  let leftDepth = 0;
  const flushMath = () => {
    const body = math.replace(/^(\s|\\[,;:!]|\\quad|\\qquad)+|(\s|\\[,;:!]|\\quad|\\qquad)+$/g, "");
    if (body) parts.push(`$${/\\(frac|dfrac|int|iint|oint|sum|lim|prod|begin)/.test(body) ? "\\displaystyle " : ""}${body}$`);
    else if (math) parts.push(" ");
    math = "";
  };
  for (let i = 0; i < src.length; i += 1) {
    if (depth === 0 && leftDepth === 0 && src.startsWith("\\text{", i)) {
      let j = i + 6;
      let d = 1;
      while (j < src.length && d > 0) { if (src[j] === "{") d += 1; else if (src[j] === "}") d -= 1; j += 1; }
      flushMath();
      parts.push(src.slice(i + 6, j - 1));
      i = j - 1;
      continue;
    }
    const ch = src[i];
    if (ch === "\\") {
      const word = (src.slice(i + 1).match(/^[A-Za-z]+/) || [""])[0];
      if (word === "left") leftDepth += 1;
      if (word === "right") leftDepth = Math.max(0, leftDepth - 1);
      const token = word ? `\\${word}` : src.slice(i, i + 2);
      math += token;
      i += token.length - 1;
      continue;
    }
    if (ch === "{") depth += 1;
    if (ch === "}") depth = Math.max(0, depth - 1);
    math += ch;
  }
  flushMath();
  return parts.join("").replace(/\s+/g, " ").trim();
}

// 純文字（解說、參考證明）：站上存的是 Unicode 純文字，LaTeX 的特殊字元要跳脫
function escapeText(text) {
  return String(text || "")
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([{}_%&#$])/g, "\\$1")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/~/g, "\\textasciitilde{}")
    // DejaVu Serif 也沒有的幾個字：改用數學符號
    .replace(/∮/g, "\\ensuremath{\\oint}").replace(/≪/g, "\\ensuremath{\\ll}").replace(/✓/g, "\\ensuremath{\\checkmark}")
    .replace(/\n+/g, "\\\\\n");
}

// 選項順序：由題號決定（每次匯出都一樣），正解不會永遠在同一格
function seededOrder(id, count) {
  let h = 2166136261;
  for (const ch of id) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i -= 1) {
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    const j = h % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

const choiceTex = (value, problem) => {
  const tex = answerToTex(value, problem);
  return /^\\text\{[^{}]*\}$/.test(tex) ? tex.slice(6, -1).replace(/∮/g, "\\ensuremath{\\oint}").replace(/≪/g, "\\ensuremath{\\ll}") : `$${tex}$`;
};

function answerLine(problem) {
  if (problem.answerKind === "proof") return "證明題（站上由白話證明的檢查器判分）";
  if (problem.answerKind === "text") return escapeText(problem.canonical || problem.answer);
  const tex = answerToTex(problem.answer, problem);
  return tex ? `$${tex}$` : escapeText(problem.answer);
}

function exportLecture(lecture) {
  const paper = papers[lecture];
  const shared = paper.shared || {};
  const exam = skeleton.find((item) => item.lecture === lecture) || { long: [] };
  // 卷上每一題：題目本身（可能是引用的既有題）＋ 它在考卷上的位置（lec- id）
  const slots = paper.ids.map((id) => {
    const problem = byId.get(id);
    if (!problem) throw new Error(`第 ${lecture} 講的 ${id} 不在題庫裡`);
    const slot = shared[id] || id;
    const m = slot.match(/^lec-\d+-(m\d+|q(\d+)([a-z]))$/);
    if (!m) throw new Error(`第 ${lecture} 講的 ${id} 認不出考卷位置（${slot}）`);
    return { problem, slot, mc: m[1].startsWith("m"), group: m[2] ? `q${m[2]}` : null };
  });

  const lines = [];
  lines.push("% 由 tools/export_lecture_tex.js 從站上的題庫產生（BUZZ_LECTURE_PAPERS）。不要手改：改題庫再重跑。");
  lines.push("\\documentclass[11pt]{article}");
  lines.push("\\usepackage{calcexam}");
  lines.push("");
  lines.push("\\begin{document}");
  lines.push(`\\twocolumn[\\examheader{${Number(lecture)}}{${escapeText(paper.topic || exam.topic || "")}}{60 分鐘}]`);
  lines.push("");

  const key = [];
  const mc = slots.filter((slot) => slot.mc);
  if (mc.length) {
    lines.push(`\\sect{一、選擇題}{（共 ${mc.length} 題；單選）}`);
    mc.forEach(({ problem, slot }) => {
      const fixed = problem.distractors && problem.distractors.length >= 3 ? problem.distractors
        : ((lectureAnswers[slot] || {}).d || []);
      lines.push("");
      lines.push(`\\prob ${promptToLatex(problem.prompt)}`);
      if (fixed.length >= 3) {
        const options = [problem.answerKind === "text" ? (problem.canonical || problem.answer) : problem.answer, ...fixed.slice(0, 3)];
        const order = seededOrder(slot, 4);
        const shown = order.map((i) => choiceTex(options[i], problem));
        const long = shown.some((item) => item.replace(/\\[A-Za-z]+|[{}$]/g, "").length > 18);
        lines.push(`\\${long ? "chC" : "chA"}${shown.map((item) => `{${item}}`).join("")}`);
        key.push({ label: `${key.length + 1}.`, answer: `(${"ABCD"[order.indexOf(0)]})　${answerLine(problem)}`, problem });
      } else {
        // 引用的既有題沒有固定誘答：印成填答
        lines.push("\\par\\smallskip 答：\\underline{\\hspace{4cm}}");
        key.push({ label: `${key.length + 1}.`, answer: answerLine(problem), problem });
      }
    });
    lines.push("");
  }

  const groups = [];
  slots.filter((slot) => !slot.mc).forEach((slot) => {
    let group = groups.find((item) => item.id === slot.group);
    if (!group) { group = { id: slot.group, items: [] }; groups.push(group); }
    group.items.push(slot);
  });
  if (groups.length) {
    const total = groups.reduce((sum, group) => sum + (Number(group.items.map((s) => s.problem.examPoints).find(Boolean) || 0)), 0);
    lines.push(`\\sect{二、計算題}{（${total ? `共 ${total} 分；` : ""}須寫出過程）}`);
    groups.forEach((group) => {
      const own = group.items.map((slot) => slot.problem).find((problem) => problem.examTitle || problem.examPoints) || {};
      const original = (exam.long || []).find((item) => item.id === group.id) || {};
      const title = own.examTitle || original.title || "";
      const points = own.examPoints || original.points || "";
      const number = mc.length + groups.indexOf(group) + 1;
      lines.push("");
      // 大題標題本來就是考卷的 LaTeX 內文（數學用 $…$），原樣印
      lines.push(`\\prob${points ? `[${points}]` : ""} ${title ? `\\textbf{${title}}` : ""}`);
      lines.push("\\begin{enumerate}");
      group.items.forEach((slot) => {
        const letter = slot.slot.slice(-1);
        lines.push(`  \\item[(${letter})] ${promptToLatex(slot.problem.prompt)}`);
        key.push({ label: `${number}(${letter})`, answer: answerLine(slot.problem), problem: slot.problem });
      });
      lines.push("\\end{enumerate}");
    });
    lines.push("");
  }

  // 卷末答案
  lines.push("\\clearpage");
  lines.push("\\sect{答案}{（選擇題的選項順序是匯出時由題號決定的）}");
  key.forEach(({ label, answer, problem }) => {
    lines.push(`\\anskey{${label}}{${answer}}`);
    const spec = problem.answerKind === "proof" ? proofSpecs.get(problem.proofSpec) : null;
    if (spec) {
      lines.push("\\begin{anssol}參考證明（一行一句，站上檢查器驗過全綠）：");
      lines.push("\\begin{enumerate}[label=\\arabic*.,leftmargin=2em,itemsep=0pt]");
      spec.reference.forEach((line) => lines.push(`  \\item ${escapeText(line)}`));
      lines.push("\\end{enumerate}\\end{anssol}");
    } else if (problem.solution) {
      lines.push(`\\begin{anssol}${escapeText(problem.solution)}\\end{anssol}`);
    }
  });
  lines.push("");
  lines.push("\\end{document}");
  lines.push("");

  const file = path.join(OUT, `ca${lecture}.tex`);
  fs.writeFileSync(file, lines.join("\n"));
  return { file, mc: mc.length, long: slots.length - mc.length, proofs: slots.filter((slot) => slot.problem.answerKind === "proof").length };
}

fs.mkdirSync(OUT, { recursive: true });
fs.copyFileSync(path.join(__dirname, "content", "calcexam.sty"), path.join(OUT, "calcexam.sty"));
const lectures = Object.keys(papers).sort().filter((lecture) => !wanted.length || wanted.includes(lecture));
if (!lectures.length) throw new Error(`沒有要匯出的講次（${wanted.join(", ")}）`);
const results = lectures.map((lecture) => ({ lecture, ...exportLecture(lecture) }));
results.forEach((r) => console.log(`  第 ${r.lecture} 講  選擇 ${r.mc}、計算小題 ${r.long}（證明 ${r.proofs}）→ ${path.relative(ROOT, r.file)}`));
console.log(`匯出 ${results.length} 講 → ${path.relative(ROOT, OUT)}（含 calcexam.sty）`);

if (compile) {
  // WSL 的路徑：C:\Users\… → /mnt/c/Users/…
  const wslDir = OUT.replace(/^([A-Za-z]):/, (m, d) => `/mnt/${d.toLowerCase()}`).replace(/\\/g, "/");
  let failed = 0;
  results.forEach(({ lecture }) => {
    const job = `ca${lecture}`;
    try {
      for (let pass = 0; pass < 2; pass += 1) {
        execFileSync("wsl", ["-e", "bash", "-lc", `cd '${wslDir}' && xelatex -interaction=nonstopmode -halt-on-error ${job}.tex > ${job}.console.log 2>&1`], { stdio: "ignore" });
      }
      console.log(`  編譯 ${job}.pdf ok`);
    } catch (error) {
      failed += 1;
      console.error(`  編譯 ${job} 失敗：看 ${path.relative(ROOT, path.join(OUT, `${job}.log`))}`);
    }
  });
  if (failed) process.exit(1);
}
