// 從零開始課程（src/course.js）的守門員。
//
// 課程的每一題都指向題庫：示範題與練習題必須存在、必須是 R1（初學者的課不能
// 混進 R2）；小測每題恰好一個正解、錯的選項都要寫「為什麼錯」（那是這個功能
// 存在的理由）；概念至少三段、示範至少兩步。內容錯在 CI 紅，不要在初學者面前紅。
//
// 理論課（practice 是空陣列）：沒有題庫練習，示範是一段推導（worked.tex，沒有
// problemId），小測至少三題——那是它唯一的關卡。課文寫「第 n 課」的地方 n 不能超過
// 總課數（插課重編號時最容易漏）。正解不能每一題都放第一個。
//
// 另外守「橋」：課程 → 主線之間，沒學過的人只會抽到「橋池」（R1、三單元、沒有課裡
// 沒教的標籤）的題。橋池要夠大（畢業關 10 題、每單元至少要抽得出來）、九課用的題都
// 要在橋池裡（不然課裡練的題主線反而抽不到）、排除的標籤要真的存在於題庫（改名了
// 就會安靜地漏進去）。
//
// 用法：node tools/validate_course.js

"use strict";

const path = require("path");
global.window = global;
require(path.join(__dirname, "lib", "load_problem_sources.js"))();
require(path.join(__dirname, "..", "src", "course.js"));

const katex = require(path.join(__dirname, "..", "assets", "vendor", "katex", "katex.min.js"));

const problems = new Map((global.window.BUZZ_PROBLEMS || []).map((p) => [p.id, p]));
const lessons = global.window.BUZZ_COURSE || [];
const failures = [];
const fail = (message) => failures.push(message);
const UNITS = new Set(["functions", "limits", "derivatives", "integrals", "advanced"]);
const ids = new Set();
let checks = 0;
let theoryCount = 0;
let firstOptionCorrect = 0;
let checkCount = 0;

// 課文裡「第 n 課」的 n 不能超過總課數（插課重編號時最容易漏）
const textOf = (lesson) => [lesson.goal, ...(lesson.concept || []).map((p) => p.text), ...((lesson.worked || {}).steps || []).map((s) => s.text), ...(lesson.checks || []).flatMap((c) => [c.ask, ...(c.options || []).map((o) => o.why || "")])].join("\n");

if (!lessons.length) fail("沒有課程");
lessons.forEach((lesson, index) => {
  const label = `第 ${index + 1} 課（${lesson.id}）`;
  const theory = Array.isArray(lesson.practice) && lesson.practice.length === 0;
  if (theory) theoryCount += 1;
  checks += 1;
  if (!lesson.id || ids.has(lesson.id)) fail(`${label}：id 缺或重複`);
  ids.add(lesson.id);
  if (!UNITS.has(lesson.unit)) fail(`${label}：unit「${lesson.unit}」不在 functions/limits/derivatives/integrals/advanced`);
  if (!lesson.title || !lesson.goal || !Number.isFinite(lesson.minutes)) fail(`${label}：title / goal / minutes 缺`);
  if (!new RegExp(`^第 ${index + 1} 課 · `).test(lesson.title)) fail(`${label}：標題的課號跟順序不合：${lesson.title}`);
  if (!Array.isArray(lesson.concept) || lesson.concept.length < 3) fail(`${label}：概念至少三段`);
  (lesson.concept || []).forEach((para, i) => { if (!para.text) fail(`${label}：概念第 ${i + 1} 段沒有文字`); });
  // 課文自己寫的 tex（概念、推導題目、步驟）不經過題庫的 validate_katex，這裡 render 一次
  [...(lesson.concept || []).map((p) => p.tex), (lesson.worked || {}).tex, ...((lesson.worked || {}).steps || []).map((s) => s.tex)].filter(Boolean).forEach((tex) => {
    try { katex.renderToString(tex, { throwOnError: true, strict: "error", displayMode: true }); } catch (error) { fail(`${label}：tex 壞了「${tex}」：${error.message}`); }
  });
  for (const match of textOf(lesson).matchAll(/第 (\d+) 課/g)) {
    const n = Number(match[1]);
    if (n < 1 || n > lessons.length) fail(`${label}：課文提到「第 ${n} 課」，但只有 ${lessons.length} 課`);
    if (n === index + 1) fail(`${label}：課文提到「第 ${n} 課」，那就是這一課自己`);
  }

  const worked = lesson.worked || {};
  if (theory) {
    if (worked.problemId) fail(`${label}：理論課的示範不該指向題庫（${worked.problemId}），用 worked.tex 寫推導題目`);
    if (!worked.tex) fail(`${label}：理論課的示範要有 worked.tex 當題目`);
    if ((lesson.checks || []).length < 3) fail(`${label}：理論課小測至少三題（那是它唯一的關卡）`);
  } else {
    const demo = problems.get(worked.problemId);
    if (!demo) fail(`${label}：示範題 ${worked.problemId} 不在題庫`);
    else if (demo.difficulty !== 1) fail(`${label}：示範題 ${worked.problemId} 是 R${demo.difficulty}，初學者的課只能用 R1`);
  }
  if (!Array.isArray(worked.steps) || worked.steps.length < 2) fail(`${label}：示範至少兩步`);
  (worked.steps || []).forEach((step, i) => { if (!step.text) fail(`${label}：示範第 ${i + 1} 步沒有文字`); });

  if (!Array.isArray(lesson.checks) || !lesson.checks.length) fail(`${label}：要有小測`);
  (lesson.checks || []).forEach((check, ci) => {
    const correct = (check.options || []).filter((option) => option.correct);
    if (correct.length !== 1) fail(`${label}：小測 ${ci + 1} 要恰好一個正解，現在 ${correct.length}`);
    (check.options || []).forEach((option) => {
      if (!option.correct && !option.why) fail(`${label}：小測 ${ci + 1} 的錯誤選項「${option.label}」沒寫為什麼錯`);
    });
    if ((check.options || []).length < 2) fail(`${label}：小測 ${ci + 1} 至少兩個選項`);
    checkCount += 1;
    if (check.options && check.options[0] && check.options[0].correct) firstOptionCorrect += 1;
  });

  if (!Array.isArray(lesson.practice) || (lesson.practice.length !== 3 && !theory)) fail(`${label}：導引練習要剛好 3 題（理論課才是 0 題）`);
  (lesson.practice || []).forEach((id) => {
    const p = problems.get(id);
    if (!p) fail(`${label}：練習題 ${id} 不在題庫`);
    else if (p.difficulty !== 1) fail(`${label}：練習題 ${id} 是 R${p.difficulty}，初學者的課只能用 R1`);
    else if (p.answerKind === "text") fail(`${label}：練習題 ${id} 是文字題（技巧辨識），初學者還沒學技巧名`);
    if (id === worked.problemId) fail(`${label}：練習題 ${id} 跟示範題同一題`);
  });
  if (new Set(lesson.practice || []).size !== (lesson.practice || []).length) fail(`${label}：練習題重複`);
});

const ui = global.window.BuzzCourseUI.create({ escapeHtml: (s) => s, escapeAttr: (s) => s, icon: () => "", referenceAnswerHTML: () => "" });
const bridge = ui.bridgePool();
const perTopic = Object.fromEntries(["limits", "derivatives", "integrals"].map((topic) => [topic, bridge.filter((p) => p.topic === topic).length]));
if (bridge.length < 60) fail(`橋池只有 ${bridge.length} 題，太小（至少 60）`);
Object.entries(perTopic).forEach(([topic, n]) => { if (n < 12) fail(`橋池 ${topic} 只有 ${n} 題（至少 12）`); });
lessons.forEach((lesson) => {
  [lesson.worked && lesson.worked.problemId].concat(lesson.practice || []).forEach((id) => {
    if (id && problems.has(id) && !ui.inBridge(problems.get(id))) fail(`${lesson.id}：${id} 不在橋池裡（有課裡沒教的標籤？）`);
  });
});
const allTags = new Set([...problems.values()].flatMap((p) => p.tags || []));
ui.uncoveredTags.forEach((tag) => { if (!allTags.has(tag)) fail(`橋池排除的標籤「${tag}」題庫裡不存在——是不是改名了？`); });
const grad = ui.graduationSet("validate");
if (grad.length !== 10) fail(`畢業關抽不出 10 題（${grad.length}）`);
if (new Set(grad.map((p) => p.id)).size !== grad.length) fail("畢業關有重複的題");
if (grad.some((p) => !ui.inBridge(p))) fail("畢業關抽到橋池外的題");
if (checkCount && firstOptionCorrect / checkCount > 0.6) fail(`小測有 ${firstOptionCorrect} / ${checkCount} 題正解放第一個——用猜的就會過，打散一下`);

const unitCount = (unit) => lessons.filter((l) => l.unit === unit).length;
console.log("從零開始課程");
console.log(`  橋池      ${bridge.length} 題（極限 ${perTopic.limits} / 微分 ${perTopic.derivatives} / 積分 ${perTopic.integrals}）· 畢業關 ${grad.length} 題 · 排除標籤 ${ui.uncoveredTags.join(", ")}`);
console.log(`  課程      ${lessons.length} 課（${unitCount("functions")} 函數 / ${unitCount("limits")} 極限 / ${unitCount("derivatives")} 微分 / ${unitCount("integrals")} 積分 / ${unitCount("advanced")} 進階）· 理論課 ${theoryCount}`);
console.log(`  題目      示範 ${lessons.length - theoryCount} 題 · 練習 ${lessons.reduce((n, l) => n + (l.practice || []).length, 0)} 題，全部 R1 · 小測 ${checkCount} 題（正解在第一個的 ${firstOptionCorrect}）`);
if (failures.length) {
  console.error(`\n課程驗證失敗（${failures.length}）：`);
  failures.forEach((message) => console.error("  " + message));
  process.exit(1);
}
console.log("course OK");
