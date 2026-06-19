const fs = require("fs");
const path = require("path");

const PROBLEM_MODULES = [
  "../src/problems.js",
  "../src/problem_extensions.js",
  "../src/problem_extensions_2.js",
  "../src/problem_integrals_hard.js",
  "../src/problem_advanced_analysis.js",
  "../src/problem_gap_pack.js",
  "../src/problem_mobile_advanced_pack.js",
  "../src/problem_release_expansion.js",
  "../src/problem_hard_expansion.js",
  "../src/problem_hardcore_50.js",
  "../src/problem_exam_expansion.js",
  "../src/problem_university_exam_pack.js",
  "../src/problem_exam_depth_pack.js",
  "../src/problem_todai_burst_pack.js",
  "../src/problem_difficulty_calibration.js"
];

global.window = {};
PROBLEM_MODULES.forEach((modulePath) => require(modulePath));

const problems = window.BUZZ_PROBLEMS || [];

const TOPICS = [
  { key: "limits", label: "極限", subtitle: "Limits" },
  { key: "derivatives", label: "微分", subtitle: "Derivatives" },
  { key: "integrals", label: "積分", subtitle: "Integrals" },
  { key: "series", label: "級數", subtitle: "Series" }
];

const ANSWER_KIND_LABELS = {
  numeric: "數值",
  expression: "表示式",
  antiderivative: "不定積分",
  text: "文字"
};

const RANK_LABELS = {
  1: "Warm-up",
  2: "Basic",
  3: "Standard",
  4: "Advanced",
  5: "Boss",
  6: "Boss+"
};

const topicByKey = new Map(TOPICS.map((topic) => [topic.key, topic]));
const orderedProblems = TOPICS.flatMap((topic) => problems.filter((problem) => problem.topic === topic.key));
const problemNumber = new Map(orderedProblems.map((problem, index) => [problem.id, index + 1]));

function latexText(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/&/g, "\\&")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/~/g, "\\textasciitilde{}");
}

function latexVerb(value) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/u.test(text)) {
    return `\\texttt{${latexText(text)}}`;
  }
  const delimiter = ["|", "!", "/", "+", ":", ";", "@", "`"].find((item) => !text.includes(item));
  if (!delimiter) return `\\texttt{${latexText(text)}}`;
  return `\\path${delimiter}${text}${delimiter}`;
}

function rawTex(value) {
  return String(value ?? "")
    .replace(/\r?\n/g, " ")
    .replace(/\{([^{}]+)\\choose\s+([^{}]+)\}/g, "\\binom{$1}{$2}")
    .trim();
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

function answerSlots(problem) {
  const rank = problem.rank || problem.difficulty || 1;
  const slots = rank >= 5 ? 2 : 1;
  return Array.from({ length: slots }, () => "\\answerslot").join("\n");
}

function problemKind(problem) {
  return ANSWER_KIND_LABELS[problem.answerKind] || problem.answerKind || "unknown";
}

function problemRank(problem) {
  return problem.rank || problem.difficulty || 1;
}

function formatProblem(problem, topicIndex) {
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
  const list = orderedProblems.filter((problem) => problem.topic === topic.key);
  if (!list.length) return "";
  const blocks = list.map((problem, index) => formatProblem(problem, index)).join("\n");
  return [
    `\\sectionbanner{${latexText(topic.label)}}{${latexText(topic.subtitle)}}{${list.length}}`,
    "\\begin{multicols}{2}",
    blocks,
    "\\end{multicols}"
  ].join("\n\n");
}

function countByTopicRows() {
  return TOPICS.map((topic) => {
    const count = orderedProblems.filter((problem) => problem.topic === topic.key).length;
    return `${latexText(topic.label)} & ${count} 題 \\\\`;
  }).join("\n");
}

function answerKeyRows() {
  return orderedProblems.map((problem, index) => {
    const no = String(index + 1).padStart(4, "0");
    return `\\item[${no}. ${latexText(problem.id)}] ${latexVerb(displayAnswer(problem))}`;
  }).join("\n");
}

function solutionRows() {
  return orderedProblems.map((problem, index) => {
    const no = String(index + 1).padStart(4, "0");
    const answer = latexVerb(displayAnswer(problem));
    const solution = latexText(problem.solution || "");
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
\usepackage{amsmath,amssymb,mathtools}
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

\newcommand{\answerslot}{%
  \par\vspace{5.5mm}{\color{Line}\rule{\linewidth}{0.3pt}}%
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
\noindent{\sffamily\Large\textcolor{Muted}{完整題庫題本 · Complete Problem Set}}\par
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
  \textcolor{Muted}{編譯} & XeLaTeX + XeCJK \\
  \end{tabular}
  \vspace{2mm}
}}

\vspace{12mm}

\noindent{\sffamily\small\textcolor{Muted}{姓名}}\quad\rule{46mm}{0.4pt}\hfill
{\sffamily\small\textcolor{Muted}{日期}}\quad\rule{36mm}{0.4pt}\hfill
{\sffamily\small\textcolor{Muted}{分數}}\quad\rule{30mm}{0.4pt}

\vfill
\noindent{\sffamily\footnotesize\textcolor{Muted}{本題本由 BuzzCalculus 題庫自動產生，含全部題目、答案速查與解法提示。題目保留原始 LaTeX prompt，答案採 WebWork 輸入格式。}}

\clearpage
\pagestyle{fancy}
\renewcommand{\contentsname}{目錄}
\tableofcontents
\clearpage
${TOPICS.map(topicSection).join("\n\n")}

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

console.log(`Wrote ${path.relative(process.cwd(), outputFile)}`);
console.log(JSON.stringify({ total: orderedProblems.length, counts }, null, 2));
