// 把 lecture_exams_skeleton.json（考卷拆出來的題幹與解答）與 lecture_exams_answers.json（手寫的判分層）
// 合成 src/problem_lecture_pack.js。
//
// 每一題：
//   id            lec-NN-mK（選擇）／lec-NN-qJx（計算題第 J 題的第 x 小題）
//   prompt        答案檔的 p（整段覆寫）＞ pre + 小題 ＞ 計算題的 stem + 小題
//   answer 等     依 k：numeric/expression/antiderivative 走 answer；text 走 answers+canonical；set/interval 走 answer；
//                 proof 是指向白話證明 spec（src/proof_lang_content.js 的 pl-lec-*）的指標，判分交給檢查器（全綠才算對）
//   distractors   選擇題把考卷原本的三個錯誤選項固定進來（buildChoiceDistractors 只用作者給的）
//   solution      考卷解答（純文字）；小題只帶自己那一段
//   tags          答案檔的 g + lecture + lecture-NN + exam-style + midterm-style
//   lecture       NN（字串）——第 N 講隨堂測驗的組卷靠它
//
// 同時輸出 window.BUZZ_LECTURE_PAPERS：{ NN: { topic, ids: [照考卷順序] } }，app.js 用它組出 20 張固定卷。
// 用法：node tools/build_lecture_pack.js
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const skeleton = JSON.parse(fs.readFileSync(path.join(__dirname, "content", "lecture_exams_skeleton.json"), "utf8"));
const answers = JSON.parse(fs.readFileSync(path.join(__dirname, "content", "lecture_exams_answers.json"), "utf8"));
const loadAppApi = require("./lib/app_api.js");
const literalKey = require("./lib/literal_key.js");

// 考卷裡有些題跟題庫既有的題一字不差（\lim_{x\to2}\frac{x^2-4}{x-2} 這種經典題），也有同一題出現在好幾講。
// 另生一個 lec- id 會變成重複題：能力模型把同一題當兩份證據、冷卻失效、detect_duplicates --ci 擋下來，
// 而且 expand_templates 會因為撞題把模板題安靜地刪掉。所以撞題時卷上直接引用既有那一題的 id，不另生題。
// 比對對象是「題庫扣掉這包自己」——這包上一次產生的結果不能算數。
const existingByKey = new Map();
loadAppApi.allProblems()
  .filter((problem) => !/^lec-/.test(problem.id))
  .forEach((problem) => {
    const key = literalKey(problem.prompt);
    if (!existingByKey.has(key)) existingByKey.set(key, problem);
  });
const reused = [];

// 講次 → 主題（站上只有四個 topic；多變數歸微分／積分，用 tag 標 multivariable）
const TOPIC_BY_LECTURE = {
  "01": "limits", "02": "derivatives", "03": "derivatives", "04": "derivatives", "05": "derivatives",
  "06": "integrals", "07": "integrals", "08": "integrals", "09": "integrals", "10": "integrals",
  "11": "series", "12": "series", "13": "series", "14": "series", "15": "series",
  "16": "derivatives", "17": "derivatives", "18": "derivatives", "19": "integrals", "20": "integrals"
};
const EXTRA_TAGS_BY_LECTURE = { "16": ["multivariable"], "17": ["multivariable"], "18": ["multivariable"], "19": ["multivariable"], "20": ["multivariable", "vector-calculus"] };
const TIME_LIMIT = { numeric: 90, expression: 120, antiderivative: 150, set: 120, interval: 120, text: 60, proof: 300 };
const KINDS = new Set(Object.keys(TIME_LIMIT));
// 純指令的 stem（只有一段 \text{…}、裡面沒有數學，像「計算：」「求下列極限：」）接在以數學開頭的小題前面時省略：
// 驗算器要從題幹認形式，「計算：∫…」它認不出來，「∫…」就認得。
const instructionOnly = (stem) => /^\\text\{[^{}\\$]*\}$/.test(String(stem || "").trim());
const startsWithMath = (tex) => !/^\\text\{/.test(String(tex || "").trim());

// 證明小題的 spec：id 要存在，而且 spec 自己的 lecture 欄位要指回這一題（兩邊對得上，才不會接錯題）
global.window = global.window || {};
require(path.join(ROOT, "src", "proof_lang_content.js"));
const proofSpecs = new Map((global.window.BUZZ_PROOF_LANG_PROBLEMS || []).map((spec) => [spec.id, spec]));
const PROOF_HINTS = ["一行一句，每句用一種句型開頭：任取／取／假設／則／由…／因為…所以／故。", "先寫出要證的東西長什麼樣，再一步一步扣回去。", "每一行都會被檢查：站不住的那一行會標紅。"];

const problems = [];
const papers = {};
const missing = [];
const unused = new Set(Object.keys(answers).filter((k) => !k.startsWith("_")));
let skipped = 0;

function build(id, spec, prompt, solution, lecture, extra = {}) {
  unused.delete(id);
  if (!spec) { missing.push(id); return; }
  if (spec.k === "skip") { skipped += 1; return; }
  if (!KINDS.has(spec.k)) throw new Error(`${id}: 不認得的 answerKind ${spec.k}`);
  const tags = [...(spec.g || []), ...(EXTRA_TAGS_BY_LECTURE[lecture] || []), "lecture", `lecture-${lecture}`, "exam-style", "midterm-style", `rank-${spec.r}`];
  if (spec.r >= 5) tags.push("boss-rank");
  if (spec.r === 6) tags.push("boss-plus");
  // 站上的 raw-English lint 會把 \text{…} 整段刪掉再找英文字，兩側的字母會黏成一個字（f\text{ 在 }a → "fa"）；
  // 在 \text{} 後面接字母的地方補 \,（細空白，畫面上幾乎看不出來，lint 看得到）。
  // 另外三件是給驗算器（tools/verify_answers.js）看的：它從題幹認形式（\lim、\int、\frac{d}{dx}…），
  //   \displaystyle 是排版不是數學、考卷選擇題結尾的「=」是給選項接的、「計算：」這種純指令 stem 不是題目 —— 都剝掉。
  const lintSafe = (tex) => String(tex)
    .replace(/\\displaystyle\s*/g, "")
    .replace(/\s*=\s*$/, "")
    .replace(/(\\text\{[^{}]*\})(?=[A-Za-z])/g, "$1\\,")
    .replace(/\s+/g, " ")
    .trim();
  const problem = {
    id,
    topic: spec.topic || TOPIC_BY_LECTURE[lecture],
    difficulty: Math.min(4, spec.r),
    rank: spec.r,
    authoredRank: spec.r,
    prompt: lintSafe(spec.p || prompt),
    answerKind: spec.k,
    timeLimit: spec.tl || TIME_LIMIT[spec.k],
    tags,
    solution: spec.s || solution || "",
    source: `微積分 20 講 · 第 ${lecture} 講隨堂測驗`,
    lecture,
    ...extra
  };
  if (spec.k === "proof") {
    const target = proofSpecs.get(spec.spec);
    if (!target) throw new Error(`${id}: 證明題指向的 spec ${spec.spec} 不在 src/proof_lang_content.js`);
    if (target.lecture !== id) throw new Error(`${id}: spec ${spec.spec} 的 lecture 欄位是 ${target.lecture}，對不上`);
    problem.proofSpec = spec.spec;
    problem.answer = "（白話證明．機器判分）";
    problem.tags = ["proof", "written-proof", ...problem.tags];
    problem.hints = PROOF_HINTS.slice();
  } else if (spec.k === "text") {
    problem.answers = [spec.a, ...(spec.alts || [])];
    problem.canonical = spec.a;
    problem.answer = spec.a;
  } else {
    problem.answer = spec.a;
  }
  if (spec.var) problem.variable = spec.var;
  if (spec.vars) problem.variables = spec.vars;
  if (spec.dom) problem.domain = spec.dom;
  if (spec.d) problem.distractors = spec.d;
  if (spec.v) problem.verify = spec.v;
  const key = literalKey(problem.prompt);
  const existing = existingByKey.get(key);
  if (existing) {
    // 「下列敘述何者正確？」這種題幹本身不帶題目、全靠選項 —— 題幹撞了不代表是同一題，而是題幹沒寫清楚
    if (spec.k === "text" && String(existing.answer) !== String(problem.answer)) {
      throw new Error(`${id} 的題幹跟 ${existing.id} 一字不差、答案卻不同：題幹要自己說清楚在問什麼（答案檔用 p 覆寫）`);
    }
    reused.push({ id, existing, answer: problem.answer });
    papers[lecture].ids.push(existing.id);
    papers[lecture].shared[existing.id] = id;
    return;
  }
  existingByKey.set(key, problem);
  problems.push(problem);
  papers[lecture].ids.push(id);
}

skeleton.forEach((exam) => {
  const lecture = exam.lecture;
  // shared：卷上引用的別處題目 → 它在考卷上的位置（lec- id），smoke 靠它認得這不是混進別講的題
  papers[lecture] = { topic: exam.topic, ids: [], shared: {} };
  exam.mc.forEach((m) => build(m.id, answers[m.id], m.prompt, m.solution, lecture, { examPart: "mc" }));
  exam.long.forEach((q) => {
    q.items.forEach((item) => {
      const spec = answers[item.id];
      const pre = spec && spec.pre !== undefined ? spec.pre : (instructionOnly(q.stem) && startsWithMath(item.prompt) ? "" : q.stem);
      const prompt = pre ? `${pre} ${item.prompt}` : item.prompt;
      build(item.id, spec, prompt, item.solution, lecture, { examPart: "long", examPoints: q.points, examGroup: q.id, examTitle: q.title });
    });
  });
});

if (missing.length) {
  console.error(`答案檔缺 ${missing.length} 題：${missing.slice(0, 20).join(", ")}${missing.length > 20 ? " …" : ""}`);
}
if (reused.length) {
  console.log(`跟題庫一字不差、卷上改引用既有題 ${reused.length} 題：`);
  // 答案寫法不同不一定是錯（選擇題選項 vs 自由作答），但要看得到，人來判斷
  reused.forEach(({ id, existing, answer }) => {
    const same = String(existing.answer) === String(answer);
    console.log(`  ${id} → ${existing.id}${same ? "" : `   答案 ${JSON.stringify(answer)} vs ${JSON.stringify(existing.answer)}`}`);
  });
}
if (unused.size) console.error(`答案檔有 ${unused.size} 個 id 骨架裡沒有：${[...unused].slice(0, 10).join(", ")}`);

const header = `// 微積分 20 講隨堂測驗（${new Date().toISOString().slice(0, 10)}）：由 tools/build_lecture_pack.js 產生，不要手改。
// 來源：GPA 戰士的 caNN.tex（20 份 60 分鐘卷，每份 5 選擇 + 4 計算題），骨架由 tools/import_lecture_exams.js 拆出，
// 判分層（answerKind／答案語法／rank／tags／驗算描述子）在 tools/content/lecture_exams_answers.json 手寫。
// 證明小題：引擎釘得住的做成 answerKind "proof"（指向 src/proof_lang_content.js 的 pl-lec-* spec，照考卷題序排在卷上）；
// 釘不住的證明、畫圖題與「說明為什麼」這類小題不進題庫（skip）。其餘小題各自獨立成題、題幹帶著原題的設定。
// window.BUZZ_LECTURE_PAPERS 是 20 張固定卷的題序：第 N 講隨堂測驗照考卷順序出題，不抽籤。
(function () {
  "use strict";

  const problems = ${JSON.stringify(problems, null, 2).replace(/\n/g, "\n  ")};

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
  window.BUZZ_LECTURE_PAPERS = ${JSON.stringify(papers, null, 2).replace(/\n/g, "\n  ")};
})();
`;
const out = path.join(ROOT, "src", "problem_lecture_pack.js");
fs.writeFileSync(out, header);
console.log(`題庫 ${problems.length} 題（證明 ${problems.filter((p) => p.answerKind === "proof").length}、跳過 ${skipped}、缺答案 ${missing.length}）→ ${path.relative(ROOT, out)}，${Object.keys(papers).length} 張卷`);
if (missing.length) process.exit(1);
