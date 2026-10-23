// E2E 用：舊版課（tools/content/course_v2/lessons_v1/，2026-10-23 換成交付的筆記本課之前的版本）塞進頁面。
// 網站上的課已經換掉，但分節／黑板／自己算／滑桿圖／證明節的「為什麼」這些引擎還在 —— 測試拿舊版的課來測它們。
//
//   const fx = require("./lib/course_v1_fixture.js");
//   fx.lessonOf(id)          舊版有就讀舊版（沒有就讀現在的）
//   fx.script([id, …])       一段 JS：Page.addScriptToEvaluateOnNewDocument 帶進去，這幾課在頁面上就是舊版
//                            （章檔載進來時 Object.assign 會蓋掉同 id 的課 —— setter 再蓋回舊版）
"use strict";

const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "content", "course_v2");
const V1 = path.join(DIR, "lessons_v1");
const NOW = path.join(DIR, "lessons");

const read = (dir, id) => { const f = path.join(dir, `${id}.json`); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : null; };
const lessonOf = (id) => read(V1, id) || read(NOW, id);
// 舊版有的課＋現在只有一版的（沒換掉的那幾課），照檔名順序
const allIds = () => [...new Set([...fs.readdirSync(V1), ...fs.readdirSync(NOW)].filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")))].sort();

function script(ids) {
  const { shipLesson } = require("../build_course_v2.js");
  // 舊版課的旁白：換掉之前的索引（narration_v1.json）；那時的錄音都上傳過（media-v10），全部當已上傳
  const { relName } = require("../build_narration.js");
  const nar = JSON.parse(fs.readFileSync(path.join(DIR, "narration_v1.json"), "utf8"));
  const pub = new Set(Object.entries(nar.lessons).flatMap(([id, row]) => Object.entries(row).filter(([v]) => v.length === 1).map(([v, e]) => relName(v, id, e.f))));
  const fix = {};
  [...new Set(ids)].forEach((id) => { if (read(V1, id)) fix[id] = shipLesson(read(V1, id), nar, pub); });
  return `(() => {
  const FIX = ${JSON.stringify(fix)};
  let store = Object.assign(window.BUZZ_COURSE_V2_LESSONS || {}, FIX);
  Object.defineProperty(window, "BUZZ_COURSE_V2_LESSONS", { configurable: true, get: () => store, set: (v) => { store = Object.assign(v || {}, FIX); } });
})();`;
}

module.exports = { lessonOf, allIds, script };
