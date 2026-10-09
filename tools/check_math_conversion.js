// 新版課程「Unicode 數學 → $…$ KaTeX」轉換的把關：拿 git HEAD 的版本逐欄比對工作區的版本。
//
// 轉換只准改數學的寫法，不准改內容。所以每一個文字欄位：
//   1. 中文（漢字與全形標點）的序列必須一字不差 —— 抓「順手改了句子」。          → 錯誤
//   2. 數字的序列必須一樣（舊版的上下標 ²、₁ 先換成一般數字；新版剝掉 TeX 指令後再取）
//      —— 抓「轉換時把 3 打成 2、漏了一個指數」。                                  → 錯誤
//   3. 每一段 $…$ 要 KaTeX 渲染得過、$ 要成對。                                     → 錯誤
// 數字序列在少數情況會合法地不同（例如把 x/2 改寫成 \tfrac{1}{2}x），那種請直接用原本的順序寫，
// 不要為了排版改寫式子。
//
// 用法：node tools/check_math_conversion.js [id …]     預設檢查所有跟 HEAD 不同的課
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const ROOT = path.join(__dirname, "..");
const LESSONS = "tools/content/course_v2/lessons";
const katex = require(path.join(ROOT, "assets", "vendor", "katex", "katex.min.js"));

const SUPER = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
const CJK = /[㐀-鿿　-〿！-｠「」『』〈〉]/g;

const cjkSeq = (text) => (String(text).match(CJK) || []).join("");
// ∛ 與 ∜ 在 KaTeX 只能寫成 \sqrt[3]{…}、\sqrt[4]{…}，會多出一個數字 —— 舊版也把它們算成 3、4
// ½ 這類分數字元轉成 \frac{1}{2} 之後是 1、2 兩個數字
const VULGAR = { "½": "12", "⅓": "13", "⅔": "23", "¼": "14", "¾": "34", "⅕": "15", "⅙": "16", "⅛": "18" };
const digitsOld = (text) => String(text).replace(/[½⅓⅔¼¾⅕⅙⅛]/g, (c) => VULGAR[c]).replace(/∛/g, "3").replace(/∜/g, "4").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/g, (c) => SUPER[c]).replace(/[^0-9]/g, "");
const digitsNew = (text) => String(text)
  .replace(/\\[a-zA-Z]+/g, " ")          // \frac、\sqrt、\to … 不含數字
  .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/g, (c) => SUPER[c])
  .replace(/[^0-9]/g, "");

function textFields(lesson) {
  const out = [];
  const add = (where, value) => { if (typeof value === "string") out.push([where, value]); };
  (lesson.objectives || []).forEach((t, i) => add(`objectives[${i}]`, t));
  (lesson.concept || []).forEach((c, i) => { add(`concept[${i}].heading`, c.heading); (c.body || []).forEach((t, k) => add(`concept[${i}].body[${k}]`, t)); });
  (lesson.workedExamples || []).forEach((w, i) => {
    add(`例${i + 1}.title`, w.title); add(`例${i + 1}.prompt`, w.prompt); add(`例${i + 1}.answer`, w.answer); add(`例${i + 1}.note`, w.note);
    (w.steps || []).forEach((t, k) => add(`例${i + 1}.steps[${k}]`, t));
  });
  (lesson.pitfalls || []).forEach((t, i) => add(`pitfalls[${i}]`, t));
  (lesson.checks || []).forEach((c, i) => {
    add(`Q${i + 1}.ask`, c.ask);
    (c.options || []).forEach((o, k) => { add(`Q${i + 1}.opt${k}`, o.label); add(`Q${i + 1}.why${k}`, o.why); });
  });
  (lesson.practice || []).forEach((p, i) => add(`practice[${i}].note`, p.note));
  return out;
}

function inlineMathErrors(text) {
  const errors = [];
  const count = (String(text).match(/(?<!\\)\$/g) || []).length;
  if (count % 2) errors.push("$ 不成對");
  for (const m of String(text).matchAll(/(?<!\\)\$([^$]+?)(?<!\\)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true }); } catch (e) { errors.push(`KaTeX 渲染失敗：$${m[1]}$（${e.message.slice(0, 60)}）`); }
  }
  return errors;
}

let ids = process.argv.slice(2);
if (!ids.length) {
  const changed = execFileSync("git", ["diff", "--name-only", "HEAD", "--", LESSONS], { cwd: ROOT, encoding: "utf8" }).split(/\r?\n/).filter(Boolean);
  ids = changed.map((f) => path.basename(f, ".json"));
}
let errors = 0;
let checked = 0;
for (const id of ids) {
  const rel = `${LESSONS}/${id}.json`;
  let before;
  try { before = JSON.parse(execFileSync("git", ["show", `HEAD:${rel}`], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 24 })); } catch (_e) { console.log(`${id}：HEAD 沒有這課，略過`); continue; }
  const after = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
  const oldMap = new Map(textFields(before));
  checked += 1;
  for (const [where, text] of textFields(after)) {
    const old = oldMap.get(where);
    const problems = inlineMathErrors(text);
    if (old !== undefined) {
      if (cjkSeq(old) !== cjkSeq(text)) problems.push(`中文被改了：\n      舊：${old}\n      新：${text}`);
      if (digitsOld(old) !== digitsNew(text)) problems.push(`數字序列不同（${digitsOld(old)} → ${digitsNew(text)}）：\n      舊：${old}\n      新：${text}`);
    } else {
      problems.push("這個欄位在 HEAD 沒有（轉換不該新增欄位）");
    }
    problems.forEach((p) => { errors += 1; console.error(`${id} ${where}：${p}`); });
  }
}
console.log(`\n數學轉換檢查：${checked} 課，${errors} 個問題`);
if (errors) process.exit(1);
