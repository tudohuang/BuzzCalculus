// 從零開始課程（src/course.js）的守門員。
//
// 課程的每一題都指向題庫：示範題與練習題必須存在、必須是 R1（初學者的課不能
// 混進 R2）；小測每題恰好一個正解、錯的選項都要寫「為什麼錯」（那是這個功能
// 存在的理由）；概念至少三段、示範至少兩步。內容錯在 CI 紅，不要在初學者面前紅。
//
// 用法：node tools/validate_course.js

"use strict";

const path = require("path");
global.window = global;
require(path.join(__dirname, "lib", "load_problem_sources.js"))();
require(path.join(__dirname, "..", "src", "course.js"));

const problems = new Map((global.window.BUZZ_PROBLEMS || []).map((p) => [p.id, p]));
const lessons = global.window.BUZZ_COURSE || [];
const failures = [];
const fail = (message) => failures.push(message);
const UNITS = new Set(["limits", "derivatives", "integrals"]);
const ids = new Set();
let checks = 0;

if (!lessons.length) fail("沒有課程");
lessons.forEach((lesson, index) => {
  const label = `第 ${index + 1} 課（${lesson.id}）`;
  checks += 1;
  if (!lesson.id || ids.has(lesson.id)) fail(`${label}：id 缺或重複`);
  ids.add(lesson.id);
  if (!UNITS.has(lesson.unit)) fail(`${label}：unit「${lesson.unit}」不在 limits/derivatives/integrals`);
  if (!lesson.title || !lesson.goal || !Number.isFinite(lesson.minutes)) fail(`${label}：title / goal / minutes 缺`);
  if (!new RegExp(`^第 ${index + 1} 課 · `).test(lesson.title)) fail(`${label}：標題的課號跟順序不合：${lesson.title}`);
  if (!Array.isArray(lesson.concept) || lesson.concept.length < 3) fail(`${label}：概念至少三段`);
  (lesson.concept || []).forEach((para, i) => { if (!para.text) fail(`${label}：概念第 ${i + 1} 段沒有文字`); });

  const worked = lesson.worked || {};
  const demo = problems.get(worked.problemId);
  if (!demo) fail(`${label}：示範題 ${worked.problemId} 不在題庫`);
  else if (demo.difficulty !== 1) fail(`${label}：示範題 ${worked.problemId} 是 R${demo.difficulty}，初學者的課只能用 R1`);
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
  });

  if (!Array.isArray(lesson.practice) || lesson.practice.length !== 3) fail(`${label}：導引練習要剛好 3 題`);
  (lesson.practice || []).forEach((id) => {
    const p = problems.get(id);
    if (!p) fail(`${label}：練習題 ${id} 不在題庫`);
    else if (p.difficulty !== 1) fail(`${label}：練習題 ${id} 是 R${p.difficulty}，初學者的課只能用 R1`);
    else if (p.answerKind === "text") fail(`${label}：練習題 ${id} 是文字題（技巧辨識），初學者還沒學技巧名`);
    if (id === worked.problemId) fail(`${label}：練習題 ${id} 跟示範題同一題`);
  });
  if (new Set(lesson.practice || []).size !== (lesson.practice || []).length) fail(`${label}：練習題重複`);
});

console.log("從零開始課程");
console.log(`  課程      ${lessons.length} 課（${lessons.filter((l) => l.unit === "limits").length} 極限 / ${lessons.filter((l) => l.unit === "derivatives").length} 微分 / ${lessons.filter((l) => l.unit === "integrals").length} 積分）`);
console.log(`  題目      示範 ${lessons.length} 題 · 練習 ${lessons.reduce((n, l) => n + (l.practice || []).length, 0)} 題，全部 R1`);
if (failures.length) {
  console.error(`\n課程驗證失敗（${failures.length}）：`);
  failures.forEach((message) => console.error("  " + message));
  process.exit(1);
}
console.log("course OK");
