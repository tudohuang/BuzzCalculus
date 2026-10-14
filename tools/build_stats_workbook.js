// 題庫統計工作簿：一題一列的明細＋總覽、難度分布、課程覆蓋、品質待辦、資料字典。
//
// 這是**內容分析**，不是學習成效分析：資料全部來自 repo 裡的題庫、側表與課程，
// 沒有任何使用者資料。答對率／平均用時／作答次數要等 GA4 匯出（見 docs/metrics.md），
// 明細表最後留了這幾欄的空位；有匯出檔時用 --ga 灌進去（格式見下）。
//
// 載入方式跟驗證器一樣（tools/lib/app_api.js：照 index.html 順序載入全部 src/*.js），
// 驗算走 tools/lib/verify_engine.js 的 verifyProblem —— 但**不**跑 verify_answers.js 本身，
// 因為那支會重寫 src/kernel/verified_answers.js。重複題讀 detect_duplicates.js 寫的 tmp/duplicates.json
// （沒有就先跑一次 detect_duplicates.js，它只寫 tmp/）。
//
// 依賴：exceljs，裝在 tools/ 的 devDependencies（cd tools && npm install），不進根目錄 package.json。
//
// 用法：
//   node tools/build_stats_workbook.js                     產出到 docs/report/stats/（gitignored）
//   node tools/build_stats_workbook.js --out DIR           換輸出資料夾
//   node tools/build_stats_workbook.js --ga ga.csv         把 GA 匯出灌進成效欄
//
// --ga 的 CSV：第一列是欄名，至少要有 problem_id；其餘認得的欄（都可省略）：
//   attempts（作答次數，= answer_submit 筆數）、correct（答對筆數）、avg_elapsed_sec（problem_submit.elapsed 平均）、
//   skips（reason=Skipped 的 problem_submit 筆數）、timeouts（reason=Timeout 筆數）、starts（problem_start 筆數）
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const args = process.argv.slice(2);
const argOf = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const OUT_DIR = path.resolve(argOf("--out") || path.join(ROOT, "docs", "report", "stats"));
const GA_CSV = argOf("--ga");

let ExcelJS;
try {
  ExcelJS = require("exceljs");
} catch (_e) {
  console.error("找不到 exceljs：cd tools && npm install");
  process.exit(1);
}

/* ── 載入題庫與側表 ─────────────────────────────────────────── */

const loadAppApi = require("./lib/app_api.js");
const api = loadAppApi();
const problems = loadAppApi.allProblems();
const win = global.window;
const { verifyProblem } = require("./lib/verify_engine.js");
const i18nText = require("./build_i18n_text.js");

const TOPIC_ZH = { limits: "極限", derivatives: "微分", integrals: "積分", series: "級數" };
const TOPICS = ["limits", "derivatives", "integrals", "series"];
const KIND_ZH = {
  numeric: "數值", expression: "函數式", antiderivative: "不定積分", text: "文字／判斷", set: "集合", interval: "區間",
  graph: "選圖", graphtap: "點圖", graphslope: "拖斜率", sketch: "手繪草圖", worksheet: "作業表", proof: "證明", epsilon: "ε-δ 互動"
};
const CJK = /[㐀-䶿一-鿿]/;

const uid = win.BuzzUid;
const rubric = win.BuzzRubric;
const origin = win.BuzzOrigin;
const skillGraph = win.BuzzSkillGraph;
const derived = win.BuzzDerivedHints;
const canned = win.BuzzCannedHints;
const dailyHistory = win.BUZZ_DAILY_ONE_HISTORY || {};
const enTable = win.BuzzI18n.problemTable("en");
const byId = new Map(problems.map((p) => [p.id, p]));

/* ── 驗算（不寫檔） ──────────────────────────────────────────── */

const verification = new Map();
problems.forEach((p) => {
  if (p.answerKind === "proof") {
    verification.set(p.id, { state: "另法驗證", path: "證明檢查器（參考解須判對）" });
    return;
  }
  if (p.answerKind === "worksheet") {
    verification.set(p.id, { state: "另法驗證", path: "作業表逐格驗算（validate_worksheets）" });
    return;
  }
  let r;
  try {
    r = verifyProblem(p, { normalizeAnswer: api.normalizeExpression });
  } catch (error) {
    r = { status: "error", reason: error.message };
  }
  if (r.status === "ok") verification.set(p.id, { state: "通過", path: r.method || "" });
  else if (r.status === "mismatch") verification.set(p.id, { state: "未通過", path: `${r.method || ""}：${r.detail || ""}` });
  else {
    const why = r.status === "unsupported" ? "題幹形式尚未支援" : r.status === "unverified" ? "數值方法不收斂" : "解析／求值失敗";
    verification.set(p.id, { state: "無法驗算", path: `${why}${r.reason ? "：" + String(r.reason).slice(0, 60) : ""}` });
  }
});
const isVerified = (id) => ["通過", "另法驗證"].includes((verification.get(id) || {}).state);

/* ── 重複題 ─────────────────────────────────────────────────── */

const dupPath = path.join(ROOT, "tmp", "duplicates.json");
if (!fs.existsSync(dupPath) || args.includes("--fresh-duplicates")) {
  execFileSync(process.execPath, [path.join(__dirname, "detect_duplicates.js")], { cwd: ROOT, stdio: "ignore" });
}
const dups = JSON.parse(fs.readFileSync(dupPath, "utf8"));
// 人工判定為「不是重複」的組（detect_duplicates.js 裡的 NOT_EQUIVALENT）
const dupSource = fs.readFileSync(path.join(__dirname, "detect_duplicates.js"), "utf8");
const notEqBlock = (dupSource.match(/const NOT_EQUIVALENT = \[([\s\S]*?)\n\];/) || ["", ""])[1];
const notEquivalent = new Set([...notEqBlock.matchAll(/ids:\s*\[([^\]]*)\]/g)].map((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]).sort().join("|")));
const dupInfo = new Map(); // id → { group, kind, partners, reviewed }
dups.literal.forEach((g, i) => g.forEach((id) => dupInfo.set(id, { group: `L${String(i + 1).padStart(2, "0")}`, kind: "字面相同", partners: g.filter((x) => x !== id) })));
dups.semantic.forEach((g, i) => {
  const falsePositive = notEquivalent.has(g.slice().sort().join("|"));
  g.forEach((id) => dupInfo.set(id, {
    group: `S${String(i + 1).padStart(2, "0")}`,
    kind: falsePositive ? "語意相同（人工判定不是重複）" : "語意相同（抽題去重）",
    partners: g.filter((x) => x !== id),
    falsePositive
  }));
});
const similarOf = new Map();
dups.similar.forEach(({ a, b, score }) => {
  [[a, b], [b, a]].forEach(([x, y]) => {
    if (!similarOf.has(x)) similarOf.set(x, []);
    similarOf.get(x).push(`${y}(${score})`);
  });
});

/* ── 課程 v2 ────────────────────────────────────────────────── */

const LESSON_DIR = path.join(ROOT, "tools", "content", "course_v2", "lessons");
const outline = win.BUZZ_COURSE_V2 || { stages: [] };
const lessonMeta = new Map(); // id → { stage, stageTitle, chapter, chapterTitle, code, order }
let order = 0;
outline.stages.forEach((stage) => (stage.chapters || []).forEach((ch) => (ch.lessons || []).forEach((l, i) => {
  order += 1;
  lessonMeta.set(l.id, { stage: stage.n, stageTitle: stage.title, chapter: ch.code, chapterTitle: ch.title, code: `${ch.code}-${i + 1}`, title: l.title, order });
})));
const lessons = fs.readdirSync(LESSON_DIR).filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(LESSON_DIR, f), "utf8")))
  .sort((a, b) => ((lessonMeta.get(a.id) || {}).order || 9999) - ((lessonMeta.get(b.id) || {}).order || 9999));
const lessonUse = new Map(); // problem id → { core:[], challenge:[], other:[], worked:[], solve:[] }
const useOf = (id) => {
  if (!lessonUse.has(id)) lessonUse.set(id, { core: [], challenge: [], other: [], worked: [], solve: [] });
  return lessonUse.get(id);
};
const lessonLabel = (l) => `${(lessonMeta.get(l.id) || {}).code || "?"} ${l.title}`;
lessons.forEach((l) => {
  (l.practice || []).forEach((p) => useOf(p.id)[p.core ? "core" : p.challenge ? "challenge" : "other"].push(lessonLabel(l)));
  (l.workedExamples || []).forEach((w) => { if (w.problemId) useOf(w.problemId).worked.push(lessonLabel(l)); });
  (l.sections || []).forEach((s) => { if (s.solve && s.solve.problemId) useOf(s.solve.problemId).solve.push(lessonLabel(l)); });
});
const bossesPath = path.join(ROOT, "tools", "content", "course_v2", "bosses.json");
const bosses = fs.existsSync(bossesPath) ? JSON.parse(fs.readFileSync(bossesPath, "utf8")) : {};
const bossOf = new Map(Object.entries(bosses).map(([chapter, b]) => [b.problemId, chapter]));

/* ── 考卷、題包、每日一題 ───────────────────────────────────── */

const namedExams = api.namedExams || {};
const fixedPaperOf = new Map();
const mockEligible = new Map();
Object.entries(namedExams).forEach(([key, cfg]) => {
  if (Array.isArray(cfg.fixed)) {
    cfg.fixed.forEach((id) => {
      if (!fixedPaperOf.has(id)) fixedPaperOf.set(id, []);
      fixedPaperOf.get(id).push(cfg.label);
    });
    return;
  }
  ["answer", "graph", "proof"].forEach((kind) => api.namedExamProblems(cfg, kind).forEach((p) => {
    if (!mockEligible.has(p.id)) mockEligible.set(p.id, new Set());
    mockEligible.get(p.id).add(cfg.label);
  }));
});
const packs = Object.entries(api.trainingPacks).filter(([key]) => key !== "all");
const dailyDates = new Map();
Object.entries(dailyHistory).forEach(([date, id]) => {
  if (!dailyDates.has(id)) dailyDates.set(id, []);
  dailyDates.get(id).push(date);
});

/* ── 英文版 ─────────────────────────────────────────────────── */

const textUnits = i18nText.collect();
const textSource = i18nText.loadSource();
const textNeed = new Map(); // id → { need, done }
textUnits.forEach((unit) => {
  if (!["solution", "step", "hint"].includes(unit.kind)) return;
  const id = unit.where.split("#")[0];
  const s = textNeed.get(id) || { need: 0, done: 0 };
  s.need += 1;
  if (i18nText.sourceKey(unit).key in textSource) s.done += 1;
  textNeed.set(id, s);
});
function englishStatus(p) {
  const needs = CJK.test(p.prompt || "") || CJK.test(p.tableCaption || "") || (p.answerKind === "text" && CJK.test(p.canonical || ""))
    || (p.distractors || []).some((d) => CJK.test(String(d))) || (Array.isArray(p.fields) && p.fields.some((f) => CJK.test(JSON.stringify(f))));
  const promptState = !needs ? "不需翻（純數學）" : enTable[p.id] ? "有" : "缺";
  const t = textNeed.get(p.id) || { need: 0, done: 0 };
  return { promptState, textNeed: t.need, textDone: t.done };
}

/* ── 時限合理性 ─────────────────────────────────────────────── */

const median = (arr) => { const a = arr.slice().sort((x, y) => x - y); return a.length ? a[Math.floor((a.length - 1) / 2)] : 0; };
const timeGroups = new Map();
problems.forEach((p) => {
  const key = `${p.answerKind}|${p.rank}`;
  if (!timeGroups.has(key)) timeGroups.set(key, []);
  timeGroups.get(key).push(Number(p.timeLimit) || 0);
});
const timeMedian = new Map([...timeGroups].map(([k, v]) => [k, { median: median(v), n: v.length }]));
function timeCheck(p) {
  if (p.answerKind === "proof") return ""; // 執行時一律至少 900 秒（questionTimeLimit），題目上的值不生效
  const t = Number(p.timeLimit) || 0;
  const g = timeMedian.get(`${p.answerKind}|${p.rank}`);
  const axes = rubric.axesFor(p.id) || {};
  const flags = [];
  if (g && g.n >= 8 && t <= g.median * 0.4) flags.push(`偏短：同形式同 R 中位數 ${g.median} 秒的 ${(t / g.median).toFixed(2)} 倍`);
  if (g && g.n >= 8 && t >= g.median * 2.5) flags.push(`偏長：同形式同 R 中位數 ${g.median} 秒的 ${(t / g.median).toFixed(2)} 倍`);
  if (p.answerKind === "worksheet" && Array.isArray(p.fields) && p.fields.length && t / p.fields.length < 35) flags.push(`作業表 ${p.fields.length} 格只有 ${t} 秒（每格 ${(t / p.fields.length).toFixed(0)} 秒）`);
  if (p.answerKind === "sketch" && p.rank >= 4 && t <= 150) flags.push(`R${p.rank} 手繪草圖只給 ${t} 秒`);
  if (["graph", "graphtap", "graphslope", "text"].includes(p.answerKind) && t > 180) flags.push(`${KIND_ZH[p.answerKind]}題給 ${t} 秒，偏長`);
  if (axes.steps === 3 && ["numeric", "expression", "antiderivative"].includes(p.answerKind) && t < 60) flags.push(`步數軸 3（長推導）只給 ${t} 秒`);
  if (String(p.prompt || "").length > 120 && t < 60) flags.push(`題幹 ${String(p.prompt).length} 字只給 ${t} 秒（讀題時間不夠）`);
  return flags.join("；");
}

/* ── GA 匯出（可選） ────────────────────────────────────────── */

const ga = new Map();
if (GA_CSV) {
  const lines = fs.readFileSync(GA_CSV, "utf8").replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
  const head = lines.shift().split(",").map((s) => s.trim());
  lines.forEach((line) => {
    const cells = line.split(",");
    const row = {};
    head.forEach((h, i) => { row[h] = cells[i] === undefined ? "" : cells[i].trim(); });
    if (row.problem_id) ga.set(row.problem_id, row);
  });
  console.log(`GA 匯出：${ga.size} 題`);
}
const num = (v) => (v === undefined || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));

/* ── 一題一列 ───────────────────────────────────────────────── */

const RANK_TAG = /^(rank-\d|beginner-friendly|boss-rank|boss-plus)$/;
const tagLabels = win.BuzzTagLabels || {};

// 罐頭提示的判準跟 validate_hints / validate_content_metadata 一致：同一句出現在 5 題以上就算罐頭
// （對每一題都成立的句子＝對每一題都沒用），再加上 app 直接封鎖的罐頭句。
const normHint = (h) => String(h || "").replace(/\s+/g, "");
const hintUses = new Map();
problems.forEach((p) => (p.hints || []).forEach((h) => { const k = normHint(h); if (k) hintUses.set(k, (hintUses.get(k) || 0) + 1); }));
const isCannedHint = (h) => (hintUses.get(normHint(h)) || 0) >= 5 || Boolean(canned && canned.isCanned(h));
const retiredUids = Object.keys(uid.map).filter((id) => !byId.has(id));

const rows = problems.map((p) => {
  const axes = rubric.axesFor(p.id);
  const v = verification.get(p.id);
  const authored = (Array.isArray(p.hints) ? p.hints : []).filter((h) => normHint(h) && !isCannedHint(h));
  const rawHints = Array.isArray(p.hints) ? p.hints.filter((h) => String(h || "").trim()) : [];
  const steps = Array.isArray(p.solutionSteps) ? p.solutionSteps.length : 0;
  const use = lessonUse.get(p.id) || { core: [], challenge: [], other: [], worked: [], solve: [] };
  const dup = dupInfo.get(p.id);
  const en = englishStatus(p);
  const skills = (skillGraph.skillsForProblem(p) || []).map((s) => (typeof s === "string" ? s : s.id));
  const fine = (p.tags || []).filter((t) => !RANK_TAG.test(t));
  const answer = p.answerKind === "text" ? (p.canonical || (p.answers || [])[0] || "")
    : p.answerKind === "worksheet" ? `（作業表 ${(p.fields || []).length} 格）`
      : p.answerKind === "proof" ? "（證明）" : p.answer === undefined ? "" : String(p.answer);
  const g = ga.get(p.id) || {};
  const attempts = num(g.attempts);
  const correct = num(g.correct);
  const starts = num(g.starts);
  const skips = num(g.skips);
  return {
    code: api.problemShortCode(p),
    id: p.id,
    uid: uid.uidFor(p.id) || "",
    source: p.source || "",
    topic: TOPIC_ZH[p.topic] || p.topic,
    skills: skills.map((s) => skillGraph.label(s) || s).join("、"),
    tags: fine.map((t) => tagLabels[t] || t).join("、"),
    rank: p.rank,
    axes: axes ? `${axes.steps}/${axes.obscurity}/${axes.load}` : "",
    steps_ax: axes ? axes.steps : null,
    obsc_ax: axes ? axes.obscurity : null,
    load_ax: axes ? axes.load : null,
    reviewed: rubric.isReviewed(p.id) ? "是" : "",
    kind: KIND_ZH[p.answerKind] || p.answerKind,
    kindKey: p.answerKind,
    time: Number(p.timeLimit) || null,
    prompt: String(p.prompt || "").replace(/\s+/g, " ").slice(0, 120) + (String(p.prompt || "").length > 120 ? "…" : ""),
    answer: answer.slice(0, 80),
    hasHint: authored.length ? "是" : "否",
    hintCount: authored.length,
    cannedOnly: rawHints.length && !authored.length ? "是" : "",
    derivedHint: derived && derived.has(p.id) ? "是" : "",
    stepCount: steps,
    verify: v.state,
    verifyPath: v.path,
    ownVerify: p.verify ? "是" : "",
    dupGroup: dup ? dup.group : "",
    dupKind: dup ? dup.kind : "",
    dupWith: [...(dup ? dup.partners : []), ...(similarOf.get(p.id) || []).map((s) => "≈" + s)].join("、"),
    coreN: use.core.length,
    challengeN: use.challenge.length,
    otherN: use.other.length,
    lessons: [
      ...use.core.map((x) => `${x}〔核心〕`),
      ...use.challenge.map((x) => `${x}〔挑戰〕`),
      ...use.other.map((x) => `${x}〔推薦〕`),
      ...use.worked.map((x) => `${x}〔範例〕`),
      ...use.solve.map((x) => `${x}〔分節自己算〕`)
    ].join("；"),
    workedN: use.worked.length + use.solve.length,
    boss: bossOf.has(p.id) ? `章首魔王 ${bossOf.get(p.id)}` : "",
    daily: (dailyDates.get(p.id) || []).length,
    dailyDates: (dailyDates.get(p.id) || []).join("、"),
    paper: (fixedPaperOf.get(p.id) || []).join("、"),
    mock: [...(mockEligible.get(p.id) || [])].join("、"),
    packs: packs.filter(([key]) => api.matchesPack(p, key)).map(([, pk]) => pk.label).join("、"),
    packN: packs.filter(([key]) => api.matchesPack(p, key)).length,
    en: en.promptState,
    enText: en.textNeed ? `${en.textDone}/${en.textNeed}` : "",
    len: String(p.prompt || "").length,
    status: "上架",
    originKind: origin.labelFor(p.id),
    originNote: origin.noteFor(p.id) || p.school || "",
    variantOf: p.variantOf || "",
    lecture: p.lecture ? `第 ${p.lecture} 講${p.examPart === "mc" ? "・選擇" : p.examPart === "long" ? "・計算" : ""}` : "",
    timeFlag: timeCheck(p),
    // 成效欄：GA 匯出才有
    gaAttempts: attempts,
    gaCorrectRate: attempts && correct !== null ? correct / attempts : null,
    gaAvgTime: num(g.avg_elapsed_sec),
    gaSkipRate: starts && skips !== null ? skips / starts : null
  };
});

/* ── 欄位定義（明細表與資料字典共用一份） ──────────────────── */

const COLUMNS = [
  ["code", "題號", 8, "使用者畫面上的短碼（#417），由 uid 轉出。", "src/kernel/uid_map.js → BuzzUid.shortCode"],
  ["id", "id", 20, "內部題目 id（帶分類語意，改版可能變動）。", "src/problem*.js"],
  ["uid", "uid", 13, "永久編號，配了就凍結；分享碼與回報用這個。", "src/kernel/uid_map.js"],
  ["source", "題包/來源", 26, "題目物件的 source 欄（哪一批題包／風格）。空白＝最早的核心題庫（src/problems.js）。", "題目物件 source"],
  ["topic", "主題", 7, "四大主題：極限／微分／積分／級數（多變數、向量、ODE、複變歸在這四類之下）。", "題目物件 topic"],
  ["skills", "子主題/技巧", 22, "技巧圖譜的技巧（粗分類），能力模型用這個算弱點。", "src/kernel/skill_graph.js skillsForProblem"],
  ["tags", "細標籤", 30, "題目的 tags（去掉難度校準自動加的 rank-N 等標籤），有中文名的換成中文。", "題目物件 tags、src/kernel/tag_labels.js"],
  ["rank", "難度 R", 7, "R1–R6，由三軸算出（rubric 是唯一來源）。", "src/problem_difficulty_calibration.js（套 rubric）"],
  ["axes", "三軸 S/O/L", 9, "Steps（步數）/ Obscurity（技巧冷門度）/ Load（計算負擔），各 1–3。", "src/kernel/rubric.js"],
  ["reviewed", "三軸人工複核", 8, "「是」＝有人逐題看過並寫了理由；其餘是從舊 rank 反推，未經人工複核。", "src/kernel/rubric_reviewed.js"],
  ["kind", "作答形式", 10, "answerKind 的中文名。", "題目物件 answerKind"],
  ["time", "時限(秒)", 8, "題目上的時限（已套用 R 的上下限夾擠）。證明題執行時一律至少 900 秒。", "題目物件 timeLimit、src/problem_time_calibration.js"],
  ["timeFlag", "時限疑慮", 28, "依規則標出可能不合理的時限：同作答形式同 R 中位數的 ≤0.4 倍或 ≥2.5 倍、作業表每格 <35 秒、長題幹 <60 秒等。", "本工具計算"],
  ["prompt", "題目", 50, "題幹原文（LaTeX 原樣），超過 120 字截斷。", "題目物件 prompt"],
  ["answer", "答案", 18, "參考答案（文字題取 canonical）。", "題目物件 answer / canonical"],
  ["hasHint", "有提示", 7, "有沒有「作者寫、題目專屬」的提示。罐頭句不算：同一句出現在 5 題以上、或 app 封鎖的罐頭句（判準同 validate_hints）。", "題目物件 hints、src/kernel/canned_hints.js"],
  ["hintCount", "提示數", 7, "題目專屬提示條數（去掉罐頭句；畫面最多顯示 3 條）。", "題目物件 hints"],
  ["cannedOnly", "只有罐頭提示", 8, "寫了提示但全是罐頭句（等於沒有題目專屬提示）。", "validate_hints 的判準"],
  ["derivedHint", "機器推提示", 8, "有沒有系統從題目算出來的提示（每條在 CI 重新驗算）。", "src/kernel/derived_hints.js"],
  ["stepCount", "逐步解答步數", 8, "結構化逐步解答的步數（0＝只有一段解說）。", "題目物件 solutionSteps、src/problem_solution_steps.js"],
  ["verify", "獨立驗算", 10, "通過／未通過／無法驗算／另法驗證（證明題走證明檢查器、作業表逐格驗算）。", "tools/lib/verify_engine.js verifyProblem"],
  ["verifyPath", "驗算路徑", 22, "通過時是驗算方法（limit、antiderivative…）；無法驗算時是原因。", "tools/lib/verify_engine.js"],
  ["ownVerify", "自帶 verify", 7, "題目自己帶了 verify 描述子（題幹是敘述型，驗算器靠它驗）。", "題目物件 verify"],
  ["dupGroup", "重複群組", 8, "S## 語意相同組（已寫進等價側表，同一局只抽一題）；L## 字面相同組。", "tools/detect_duplicates.js → tmp/duplicates.json"],
  ["dupKind", "重複類型", 16, "語意相同（抽題去重）／語意相同（人工判定不是重複）。", "tools/detect_duplicates.js NOT_EQUIVALENT"],
  ["dupWith", "重複/近似對象", 24, "同組的其他題；≈ 開頭是「高度相似」（答案相同且題幹 token 相似度 ≥0.9，可能是刻意變體）。", "tools/detect_duplicates.js"],
  ["coreN", "課程核心題(課數)", 8, "被幾課當成 core 推薦題。", "tools/content/course_v2/lessons/*.json practice[].core"],
  ["challengeN", "課程挑戰題(課數)", 8, "被幾課當成 challenge 推薦題。", "practice[].challenge"],
  ["otherN", "課程一般推薦(課數)", 8, "被幾課當成一般推薦題（非 core 非 challenge）。", "practice[]"],
  ["workedN", "課文範例引用", 8, "被課文範例（workedExamples.problemId）或分節「自己算」引用的次數。", "lessons/*.json"],
  ["lessons", "用在哪些課", 34, "課號（章代碼-序）＋課名，〔核心／挑戰／推薦／範例／分節自己算〕。", "lessons/*.json、src/course_v2/outline.js"],
  ["boss", "魔王題", 10, "課程章首魔王題（目前 3 章）。", "tools/content/course_v2/bosses.json"],
  ["daily", "每日一題(天數)", 8, "在每日一題歷史釘選裡出現過幾天。", "src/kernel/daily_one_history.js"],
  ["dailyDates", "每日一題日期", 18, "出現過的日期。", "src/kernel/daily_one_history.js"],
  ["paper", "固定考卷收錄", 16, "20 講隨堂測驗（固定卷、題序固定）裡收這題的卷。", "app.js NAMED_EXAMS（fixed）"],
  ["mock", "可抽入的模擬卷", 24, "七張抽籤模擬卷中，這題在範圍內、可能被抽到的卷。", "app.js namedExamProblems"],
  ["packN", "訓練題包數", 7, "符合幾個訓練題包（「不限題包」不計）。", "app.js TRAINING_PACKS / matchesPack"],
  ["packs", "訓練題包", 28, "符合的訓練題包名稱。", "app.js TRAINING_PACKS / matchesPack"],
  ["en", "英文題幹", 10, "有／缺／不需翻（題幹沒有中文）。", "src/kernel/i18n_problems_en.js、tools/validate_i18n.js 的判定"],
  ["enText", "英文解說句(翻/需)", 9, "解說、逐步解答、提示裡要翻的句子：已翻/需要翻。", "tools/build_i18n_text.js、tools/content/i18n_text_en.json"],
  ["len", "題目字數", 7, "題幹原文字元數（含 LaTeX 指令）。", "題目物件 prompt"],
  ["status", "上架狀態", 7, "目前題庫內一律上架；下架題只留 uid（見總覽），自訂題存在使用者瀏覽器，不在此表。", "uid_map 與題庫比對"],
  ["originKind", "來源聲明", 12, "Buzz 原創／改編／取材風格…", "src/kernel/origin.js"],
  ["originNote", "來源備註", 16, "來源聲明的補充或 school 欄。", "src/kernel/origin.js、題目物件 school"],
  ["lecture", "20 講出處", 10, "微積分 20 講隨堂測驗的講次與題型。", "題目物件 lecture / examPart"],
  ["variantOf", "模板母題", 14, "由模板展開的變體題，指向母題。", "題目物件 variantOf"],
  ["steps_ax", "S 步數", 5, "三軸之一（數字欄，方便篩選）。", "src/kernel/rubric.js"],
  ["obsc_ax", "O 冷門", 5, "三軸之一。", "src/kernel/rubric.js"],
  ["load_ax", "L 負擔", 5, "三軸之一。", "src/kernel/rubric.js"],
  ["gaAttempts", "作答次數", 8, "【待 GA】answer_submit 筆數（送出且判完對錯，不含逾時／跳過）。", "GA4 / BigQuery：events where event_name='answer_submit' group by problem_id"],
  ["gaCorrectRate", "答對率", 8, "【待 GA】answer_correct ÷ answer_submit。", "GA4 / BigQuery"],
  ["gaAvgTime", "平均用時(秒)", 8, "【待 GA】problem_submit 的 elapsed 平均（建議用中位數，排除 elapsed > 時限×3 的離群值）。", "GA4 / BigQuery：problem_submit.elapsed"],
  ["gaSkipRate", "跳過率", 8, "【待 GA】reason=Skipped 的 problem_submit ÷ problem_start。", "GA4 / BigQuery：problem_submit.reason、problem_start"]
];
const colIndex = Object.fromEntries(COLUMNS.map(([key], i) => [key, i + 1]));
const colLetter = (n) => { let s = ""; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };
const L = (key) => colLetter(colIndex[key]);
const DETAIL = "題目明細";
const ref = (key) => `'${DETAIL}'!$${L(key)}$2:$${L(key)}$${rows.length + 1}`;

/* ── 品質待辦 ───────────────────────────────────────────────── */

const issues = [];
const exposure = (r) => {
  const parts = [];
  if (r.coreN + r.challengeN + r.otherN) parts.push(`課程推薦 ${r.coreN + r.challengeN + r.otherN} 課`);
  if (r.workedN) parts.push(`課文引用 ${r.workedN}`);
  if (r.daily) parts.push(`每日一題 ${r.daily} 天`);
  if (r.boss) parts.push(r.boss);
  if (r.paper) parts.push("固定考卷");
  return parts.join("、");
};
const add = (priority, type, r, detail, action, effort) => issues.push({ priority, type, id: r.id, code: r.code, topic: r.topic, rank: r.rank, kind: r.kind, detail, exposure: exposure(r), action, effort });
const SELF_GRADED = new Set(["sketch"]); // 自評／圖形判分，本來就不走數值驗算
rows.forEach((r) => {
  const inCourse = r.coreN + r.challengeN + r.otherN + r.workedN > 0;
  const high = inCourse || r.daily > 0 || r.boss;
  if (r.verify === "未通過") add("P0", "答案與獨立驗算不符", r, r.verifyPath, "立刻核對答案；錯的話修正並重跑 verify_answers.js", "0.5 小時");
  if (r.verify === "無法驗算") {
    if (high) add("P1", "高曝光題沒有獨立驗算", r, r.verifyPath, SELF_GRADED.has(r.kindKey) ? "手繪題：人工複核參考圖與判分範圍" : "補 verify 描述子（題目自帶驗算路徑）或改寫成驗算器認得的題幹", "0.5–1 小時");
    else if (r.paper) add("P2", "固定考卷題沒有獨立驗算", r, r.verifyPath, "補 verify 描述子或人工複核答案", "0.5 小時");
    else add("P4", "沒有獨立驗算", r, r.verifyPath, "批次補 verify 描述子（按驗算路徑原因分組處理）", "0.25 小時");
  }
  if (r.hasHint === "否" && r.stepCount === 0) {
    add(inCourse ? "P2" : "P3", "沒有作者提示也沒有逐步解答", r,
      `${r.cannedOnly ? "只有罐頭提示" : "沒有提示"}${r.derivedHint ? "（有機器推提示 1 條）" : ""}；解說只有一段`,
      "寫 2–3 條題目專屬提示，或補逐步解答側表", "0.5 小時");
  } else if (r.cannedOnly && r.hasHint === "否") {
    add("P3", "只有罐頭提示", r, "提示全是對整包都成立的罐頭句", "換成題目專屬提示", "0.25 小時");
  }
  if (r.dupKind === "語意相同（抽題去重）" && inCourse) add("P3", "重複題出現在課程", r, `與 ${r.dupWith} 語意相同`, "確認課程推薦的是想要的那一題；另一題可保留在原題包", "0.1 小時");
  if (r.dupWith.includes("≈")) add("P4", "高度相似題（可能是刻意變體）", r, r.dupWith, "人工判斷：是刻意變體就略過，是重複就加進等價側表", "0.1 小時");
  if (r.timeFlag) add(r.timeFlag.includes("偏短") || r.timeFlag.includes("不夠") || r.timeFlag.includes("只") ? "P3" : "P4", "時限可能不合理", r, r.timeFlag, "依同類題調整 timeLimit（仍受 R 的上下限夾擠）", "0.1 小時");
  if (r.en === "缺") add("P3", "缺英文題幹", r, "英文介面會顯示中文題幹", "在 i18n_problems_en.js 補翻譯", "0.1 小時");
  if (r.enText && r.enText.split("/")[0] !== r.enText.split("/")[1]) add("P4", "解說／提示未全翻", r, `英文句子 ${r.enText}`, "build_i18n_text.js --extract 補翻", "0.1 小時");
  if (r.len > 140) add("P4", "題幹很長", r, `${r.len} 字元`, "手機上會換很多行：考慮拆句或把條件移進圖表", "0.25 小時");
  if (r.reviewed !== "是" && (r.rank >= 6 || r.rank <= 1) && inCourse) add("P4", "課程題的難度三軸未經人工複核", r, `R${r.rank}，三軸 ${r.axes}（機器反推）`, "人工複核三軸並寫理由", "0.1 小時");
});
const PRI = { P0: 0, P1: 1, P2: 2, P3: 3, P4: 4 };
issues.sort((a, b) => PRI[a.priority] - PRI[b.priority] || a.type.localeCompare(b.type) || a.id.localeCompare(b.id));

/* ── 課程覆蓋 ───────────────────────────────────────────────── */

const rowById = new Map(rows.map((r) => [r.id, r]));
const courseRows = lessons.map((l) => {
  const meta = lessonMeta.get(l.id) || {};
  const pr = (l.practice || []).map((p) => ({ ...p, row: rowById.get(p.id) }));
  const valid = pr.filter((p) => p.row);
  const ranks = valid.map((p) => p.row.rank);
  const verified = valid.filter((p) => isVerified(p.id));
  const unverified = valid.filter((p) => !isVerified(p.id));
  const kinds = {};
  valid.forEach((p) => { kinds[p.row.kind] = (kinds[p.row.kind] || 0) + 1; });
  return {
    order: meta.order || null,
    stage: meta.stage === undefined ? "" : `S${meta.stage} ${meta.stageTitle}`,
    chapter: meta.chapter ? `${meta.chapter} ${meta.chapterTitle}` : "",
    code: meta.code || "",
    id: l.id,
    title: l.title,
    practice: pr.length,
    core: pr.filter((p) => p.core).length,
    challenge: pr.filter((p) => p.challenge).length,
    missing: pr.filter((p) => !p.row).map((p) => p.id).join("、"),
    verifiedShare: valid.length ? verified.length / valid.length : null,
    unverified: unverified.map((p) => `${p.id}${p.core ? "〔核心〕" : p.challenge ? "〔挑戰〕" : ""}`).join("、"),
    unverifiedN: unverified.length,
    unverifiedCore: unverified.filter((p) => p.core).length,
    rankMin: ranks.length ? Math.min(...ranks) : null,
    rankMax: ranks.length ? Math.max(...ranks) : null,
    kinds: Object.entries(kinds).map(([k, n]) => `${k}${n}`).join("、"),
    worked: (l.workedExamples || []).length,
    workedLinked: (l.workedExamples || []).filter((w) => w.problemId).length,
    gaps: (l.gaps || []).map((g) => `${g.tag}×${g.count}${g.note ? "（" + g.note + "）" : ""}`).join("；"),
    gapCount: (l.gaps || []).reduce((s, g) => s + (Number(g.count) || 0), 0),
    noPractice: pr.length ? "" : "是"
  };
});

/* ── 摘要數字（報告用） ─────────────────────────────────────── */

const count = (fn) => rows.filter(fn).length;
const pct = (n, d) => (d ? Math.round((1000 * n) / d) / 10 : 0);
const N = rows.length;
const summary = {
  generatedAt: new Date().toISOString(),
  total: N,
  retiredUids: retiredUids.length,
  byTopic: Object.fromEntries(TOPICS.map((t) => [TOPIC_ZH[t], count((r) => r.topic === TOPIC_ZH[t])])),
  byRank: Object.fromEntries([1, 2, 3, 4, 5, 6].map((k) => [`R${k}`, count((r) => r.rank === k)])),
  topicRank: Object.fromEntries(TOPICS.map((t) => [TOPIC_ZH[t], [1, 2, 3, 4, 5, 6].map((k) => count((r) => r.topic === TOPIC_ZH[t] && r.rank === k))])),
  byKind: Object.fromEntries(Object.values(KIND_ZH).map((k) => [k, count((r) => r.kind === k)]).filter(([, n]) => n)),
  verify: Object.fromEntries(["通過", "未通過", "無法驗算", "另法驗證"].map((s) => [s, count((r) => r.verify === s)])),
  verifyPaths: rows.filter((r) => r.verify === "通過").reduce((m, r) => { m[r.verifyPath] = (m[r.verifyPath] || 0) + 1; return m; }, {}),
  unverifiedReasons: rows.filter((r) => r.verify === "無法驗算").reduce((m, r) => { const k = r.verifyPath.split("：")[0]; m[k] = (m[k] || 0) + 1; return m; }, {}),
  unverifiedByKind: rows.filter((r) => r.verify === "無法驗算").reduce((m, r) => { m[r.kind] = (m[r.kind] || 0) + 1; return m; }, {}),
  unverifiedByTopic: rows.filter((r) => r.verify === "無法驗算").reduce((m, r) => { m[r.topic] = (m[r.topic] || 0) + 1; return m; }, {}),
  hints: { authored: count((r) => r.hasHint === "是"), cannedOnly: count((r) => r.cannedOnly === "是" && r.hasHint === "否"), derived: count((r) => r.derivedHint === "是"), threePlus: count((r) => r.hintCount >= 3) },
  steps: count((r) => r.stepCount > 0),
  neither: count((r) => r.hasHint === "否" && r.stepCount === 0),
  neitherInCourse: count((r) => r.hasHint === "否" && r.stepCount === 0 && r.coreN + r.challengeN + r.otherN + r.workedN > 0),
  english: { need: count((r) => r.en !== "不需翻（純數學）"), done: count((r) => r.en === "有"), missing: count((r) => r.en === "缺") },
  englishText: rows.reduce((s, r) => { if (r.enText) { const [d, n] = r.enText.split("/").map(Number); s.done += d; s.need += n; } return s; }, { done: 0, need: 0 }),
  dup: { semanticGroups: dups.semantic.length, semanticProblems: count((r) => r.dupGroup.startsWith("S")), falsePositiveGroups: dups.semantic.filter((g) => notEquivalent.has(g.slice().sort().join("|"))).length, literalGroups: dups.literal.length, similarPairs: dups.similar.length },
  timeFlags: count((r) => r.timeFlag),
  timeFlagKinds: rows.filter((r) => r.timeFlag).reduce((m, r) => { m[r.kind] = (m[r.kind] || 0) + 1; return m; }, {}),
  longPrompts: count((r) => r.len > 140),
  reviewed: count((r) => r.reviewed === "是"),
  daily: { days: Object.keys(dailyHistory).length, distinct: dailyDates.size },
  usedInCourse: count((r) => r.coreN + r.challengeN + r.otherN > 0),
  usedInCourseAny: count((r) => r.coreN + r.challengeN + r.otherN + r.workedN > 0),
  inFixedPaper: count((r) => r.paper),
  inNoPack: count((r) => r.packN === 0),
  course: {
    lessons: courseRows.length,
    noPractice: courseRows.filter((c) => !c.practice).length,
    noPracticeWithGaps: courseRows.filter((c) => !c.practice && c.gaps).length,
    withGaps: courseRows.filter((c) => c.gaps).length,
    gapProblems: courseRows.reduce((s, c) => s + c.gapCount, 0),
    practiceRefs: courseRows.reduce((s, c) => s + c.practice, 0),
    lessonsWithUnverified: courseRows.filter((c) => c.unverifiedN).length,
    lessonsWithUnverifiedCore: courseRows.filter((c) => c.unverifiedCore).length,
    unverifiedRefs: courseRows.reduce((s, c) => s + c.unverifiedN, 0),
    allVerified: courseRows.filter((c) => c.practice && c.unverifiedN === 0).length,
    thin: courseRows.filter((c) => c.practice > 0 && c.practice < 3).length,
    byStage: Object.entries(courseRows.reduce((m, c) => { const k = c.stage; m[k] = m[k] || { lessons: 0, noPractice: 0, practice: 0, unverified: 0 }; m[k].lessons += 1; m[k].noPractice += c.practice ? 0 : 1; m[k].practice += c.practice; m[k].unverified += c.unverifiedN; return m; }, {}))
  },
  issues: Object.entries(issues.reduce((m, i) => { const k = `${i.priority} ${i.type}`; m[k] = (m[k] || 0) + 1; return m; }, {})),
  packs: packs.map(([key, pk]) => [pk.label, count((r) => r.packs.split("、").includes(pk.label))]),
  proofBanks: { proofs: (win.BUZZ_PROOFS || []).length, proofLang: (win.BUZZ_PROOF_LANG_PROBLEMS || []).length }
};
summary.pct = {
  verifiedOfNumeric: pct(summary.verify["通過"], N - summary.verify["另法驗證"]),
  verifiedAll: pct(summary.verify["通過"] + summary.verify["另法驗證"], N),
  authoredHints: pct(summary.hints.authored, N),
  steps: pct(summary.steps, N),
  english: pct(summary.english.done, summary.english.need)
};

/* ── 寫工作簿 ───────────────────────────────────────────────── */

const wb = new ExcelJS.Workbook();
wb.creator = "tools/build_stats_workbook.js";
wb.created = new Date();
const HEAD_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F3864" } };
const HEAD_FONT = { bold: true, color: { argb: "FFFFFFFF" } };
const GA_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF7F7F7F" } };
const fill = (argb) => ({ type: "pattern", pattern: "solid", bgColor: { argb }, fgColor: { argb } });
const RED = "FFFFC7CE", AMBER = "FFFFEB9C", GREEN = "FFC6EFCE", BLUE = "FFDDEBF7", GREY = "FFEDEDED";

function headerRow(ws, rowNo) {
  const row = ws.getRow(rowNo);
  row.font = HEAD_FONT;
  row.fill = HEAD_FILL;
  row.alignment = { vertical: "middle", wrapText: true };
  row.height = 32;
}
function title(ws, text, note) {
  ws.getCell("A1").value = text;
  ws.getCell("A1").font = { bold: true, size: 14 };
  if (note) { ws.getCell("A2").value = note; ws.getCell("A2").font = { italic: true, color: { argb: "FF595959" } }; }
}

// 工作表順序照建立順序：總覽在最前
const ov = wb.addWorksheet("總覽");

// ① 題目明細
const ws = wb.addWorksheet(DETAIL, { views: [{ state: "frozen", xSplit: 2, ySplit: 1 }] });
ws.columns = COLUMNS.map(([key, header, width]) => ({ key, header, width }));
rows.forEach((r) => ws.addRow(r));
headerRow(ws, 1);
COLUMNS.forEach(([key], i) => { if (key.startsWith("ga")) ws.getCell(1, i + 1).fill = GA_FILL; });
ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: rows.length + 1, column: COLUMNS.length } };
["prompt", "lessons", "tags", "packs", "mock", "dupWith", "timeFlag", "verifyPath"].forEach((key) => { ws.getColumn(key).alignment = { wrapText: true, vertical: "top" }; });
ws.getColumn("gaCorrectRate").numFmt = "0.0%";
ws.getColumn("gaSkipRate").numFmt = "0.0%";
ws.getColumn("gaAvgTime").numFmt = "0";
const last = rows.length + 1;
const span = (key) => `${L(key)}2:${L(key)}${last}`;
const cf = (key, formula, argb) => ws.addConditionalFormatting({ ref: span(key), rules: [{ type: "expression", priority: 1, formulae: [formula], style: { fill: fill(argb) } }] });
cf("verify", `$${L("verify")}2="無法驗算"`, RED);
cf("verify", `$${L("verify")}2="未通過"`, RED);
cf("verify", `$${L("verify")}2="通過"`, GREEN);
cf("verify", `$${L("verify")}2="另法驗證"`, BLUE);
cf("hasHint", `$${L("hasHint")}2="否"`, AMBER);
cf("stepCount", `$${L("stepCount")}2=0`, AMBER);
cf("cannedOnly", `$${L("cannedOnly")}2="是"`, AMBER);
cf("timeFlag", `LEN($${L("timeFlag")}2)>0`, AMBER);
cf("dupGroup", `LEN($${L("dupGroup")}2)>0`, BLUE);
cf("en", `$${L("en")}2="缺"`, RED);
cf("len", `$${L("len")}2>140`, AMBER);
// 課程題卻沒驗算：整列 id 標紅
ws.addConditionalFormatting({ ref: span("id"), rules: [{ type: "expression", priority: 2, formulae: [`AND($${L("verify")}2="無法驗算",($${L("coreN")}2+$${L("challengeN")}2+$${L("otherN")}2+$${L("workedN")}2+$${L("daily")}2)>0)`], style: { fill: fill(RED), font: { bold: true } } }] });
ws.addConditionalFormatting({ ref: span("rank"), rules: [{ type: "colorScale", priority: 3, cfvo: [{ type: "num", value: 1 }, { type: "num", value: 6 }], color: [{ argb: "FFF8F8F8" }, { argb: "FFF4B183" }] }] });

// ② 總覽
title(ov, "BuzzCalculus 題庫總覽", `產生時間 ${summary.generatedAt.slice(0, 16).replace("T", " ")}（UTC）。數字欄是對「題目明細」的 COUNTIFS 公式，篩改明細不影響；重跑產生器會更新。`);
ov.columns = [{ width: 26 }, { width: 11 }, { width: 11 }, { width: 11 }, { width: 11 }, { width: 11 }, { width: 11 }, { width: 11 }, { width: 11 }];
let rowNo = 4;
const put = (cells, opts = {}) => {
  const row = ov.getRow(rowNo);
  cells.forEach((c, i) => { row.getCell(i + 1).value = c; });
  if (opts.head) { row.font = HEAD_FONT; row.fill = HEAD_FILL; }
  if (opts.bold) row.font = { bold: true };
  rowNo += 1;
  return row;
};
const f = (formula, result) => ({ formula, result });
const countIf = (key, value, result) => f(`COUNTIF(${ref(key)},${typeof value === "number" ? value : `"${value}"`})`, result);
put(["關鍵數字", "數量", "比例"], { head: true });
const totalRow = rowNo;
put(["題目總數（上架）", f(`COUNTA(${ref("id")})`, N), ""]);
const pr = (n) => f(`B${rowNo}/$B$${totalRow}`, N ? n / N : 0);
put(["下架（只保留 uid）", retiredUids.length, "不在明細"]);
put(["通過獨立數值驗算", countIf("verify", "通過", summary.verify["通過"]), pr(summary.verify["通過"])]);
put(["另法驗證（證明／作業表）", countIf("verify", "另法驗證", summary.verify["另法驗證"]), pr(summary.verify["另法驗證"])]);
put(["無法驗算", countIf("verify", "無法驗算", summary.verify["無法驗算"]), pr(summary.verify["無法驗算"])]);
put(["答案與驗算不符", countIf("verify", "未通過", summary.verify["未通過"]), pr(summary.verify["未通過"])]);
put(["有作者提示（題目專屬）", countIf("hasHint", "是", summary.hints.authored), pr(summary.hints.authored)]);
put(["只有罐頭提示", f(`COUNTIFS(${ref("cannedOnly")},"是",${ref("hasHint")},"否")`, summary.hints.cannedOnly), pr(summary.hints.cannedOnly)]);
put(["有逐步解答", f(`COUNTIF(${ref("stepCount")},">0")`, summary.steps), pr(summary.steps)]);
put(["提示與逐步解答都沒有", f(`COUNTIFS(${ref("hasHint")},"否",${ref("stepCount")},0)`, summary.neither), pr(summary.neither)]);
put(["英文題幹：需要翻", f(`COUNTIF(${ref("en")},"<>不需翻（純數學）")`, summary.english.need), pr(summary.english.need)]);
put(["英文題幹：已翻", countIf("en", "有", summary.english.done), f(`B${rowNo}/B${rowNo - 1}`, summary.english.need ? summary.english.done / summary.english.need : 0)]);
put(["語意重複題（在等價組裡）", f(`COUNTIF(${ref("dupGroup")},"S*")`, summary.dup.semanticProblems), pr(summary.dup.semanticProblems)]);
put(["時限可能不合理", f(`COUNTIF(${ref("timeFlag")},"?*")`, summary.timeFlags), pr(summary.timeFlags)]);
put(["被課程當推薦題", f(`SUMPRODUCT(--((${ref("coreN")}+${ref("challengeN")}+${ref("otherN")})>0))`, summary.usedInCourse), pr(summary.usedInCourse)]);
put(["收進 20 講固定考卷", f(`COUNTIF(${ref("paper")},"?*")`, summary.inFixedPaper), pr(summary.inFixedPaper)]);
put(["當過每日一題", f(`COUNTIF(${ref("daily")},">0")`, summary.daily.distinct), pr(summary.daily.distinct)]);
put(["不屬於任何訓練題包", f(`COUNTIF(${ref("packN")},0)`, summary.inNoPack), pr(summary.inNoPack)]);
put(["三軸人工複核過", countIf("reviewed", "是", summary.reviewed), pr(summary.reviewed)]);
for (let r = totalRow + 1; r < rowNo; r += 1) ov.getCell(r, 3).numFmt = "0.0%";
rowNo += 1;
put(["另外兩個證明題庫（不在明細，各自有檢查器）", "", ""], { bold: true });
put(["證明實驗室 BUZZ_PROOFS", summary.proofBanks.proofs, ""]);
put(["白話證明 BUZZ_PROOF_LANG_PROBLEMS", summary.proofBanks.proofLang, ""]);
rowNo += 1;

put(["主題 × 難度（題數）", "R1", "R2", "R3", "R4", "R5", "R6", "合計", "R5+R6 占比"], { head: true });
const pivotStart = rowNo;
TOPICS.forEach((t) => {
  const zh = TOPIC_ZH[t];
  const cells = [zh];
  [1, 2, 3, 4, 5, 6].forEach((k, i) => cells.push(f(`COUNTIFS(${ref("topic")},"${zh}",${ref("rank")},${k})`, summary.topicRank[zh][i])));
  cells.push(f(`SUM(B${rowNo}:G${rowNo})`, summary.byTopic[zh]));
  const hard = summary.topicRank[zh][4] + summary.topicRank[zh][5];
  cells.push(f(`(F${rowNo}+G${rowNo})/H${rowNo}`, hard / summary.byTopic[zh]));
  put(cells);
});
{
  const cells = ["合計"];
  ["B", "C", "D", "E", "F", "G", "H"].forEach((c, i) => cells.push(f(`SUM(${c}${pivotStart}:${c}${rowNo - 1})`, i < 6 ? summary.byRank[`R${i + 1}`] : N)));
  cells.push(f(`(F${rowNo}+G${rowNo})/H${rowNo}`, (summary.byRank.R5 + summary.byRank.R6) / N));
  put(cells, { bold: true });
  const shareCells = ["占比"];
  ["B", "C", "D", "E", "F", "G"].forEach((c, i) => shareCells.push(f(`${c}${rowNo - 1}/$H$${rowNo - 1}`, summary.byRank[`R${i + 1}`] / N)));
  const shareRow = put(shareCells);
  for (let c = 2; c <= 7; c += 1) shareRow.getCell(c).numFmt = "0.0%";
  const target = put(["spec 目標占比", 0.08, 0.18, 0.28, 0.28, 0.13, 0.05]);
  for (let c = 2; c <= 7; c += 1) target.getCell(c).numFmt = "0%";
}
for (let r = pivotStart; r < rowNo; r += 1) ov.getCell(r, 9).numFmt = "0.0%";
ov.addConditionalFormatting({ ref: `B${pivotStart}:G${pivotStart + 3}`, rules: [{ type: "colorScale", priority: 1, cfvo: [{ type: "min" }, { type: "max" }], color: [{ argb: "FFFFFFFF" }, { argb: "FF5B9BD5" }] }] });
rowNo += 1;

put(["作答形式", "題數", "占比", "通過驗算", "無法驗算", "有作者提示", "有逐步解答"], { head: true });
const kindStart = rowNo;
Object.entries(KIND_ZH).forEach(([key, zh]) => {
  const n = count((r) => r.kind === zh);
  if (!n) return;
  put([zh, countIf("kind", zh, n), pr(n),
    f(`COUNTIFS(${ref("kind")},"${zh}",${ref("verify")},"通過")`, count((r) => r.kind === zh && r.verify === "通過")),
    f(`COUNTIFS(${ref("kind")},"${zh}",${ref("verify")},"無法驗算")`, count((r) => r.kind === zh && r.verify === "無法驗算")),
    f(`COUNTIFS(${ref("kind")},"${zh}",${ref("hasHint")},"是")`, count((r) => r.kind === zh && r.hasHint === "是")),
    f(`COUNTIFS(${ref("kind")},"${zh}",${ref("stepCount")},">0")`, count((r) => r.kind === zh && r.stepCount > 0))]);
});
for (let r = kindStart; r < rowNo; r += 1) ov.getCell(r, 3).numFmt = "0.0%";
ov.addConditionalFormatting({ ref: `B${kindStart}:B${rowNo - 1}`, rules: [{ type: "dataBar", priority: 1, cfvo: [{ type: "num", value: 0 }, { type: "max" }], color: { argb: "FF5B9BD5" }, gradient: false }] });
rowNo += 1;

put(["主題", "題數", "通過驗算率", "另法驗證", "無法驗算", "有作者提示率", "有逐步解答率", "英文題幹(需/有)"], { head: true });
const covStart = rowNo;
TOPICS.forEach((t) => {
  const zh = TOPIC_ZH[t];
  const inT = rows.filter((r) => r.topic === zh);
  const n = inT.length;
  put([zh, countIf("topic", zh, n),
    f(`COUNTIFS(${ref("topic")},"${zh}",${ref("verify")},"通過")/B${rowNo}`, inT.filter((r) => r.verify === "通過").length / n),
    f(`COUNTIFS(${ref("topic")},"${zh}",${ref("verify")},"另法驗證")`, inT.filter((r) => r.verify === "另法驗證").length),
    f(`COUNTIFS(${ref("topic")},"${zh}",${ref("verify")},"無法驗算")`, inT.filter((r) => r.verify === "無法驗算").length),
    f(`COUNTIFS(${ref("topic")},"${zh}",${ref("hasHint")},"是")/B${rowNo}`, inT.filter((r) => r.hasHint === "是").length / n),
    f(`COUNTIFS(${ref("topic")},"${zh}",${ref("stepCount")},">0")/B${rowNo}`, inT.filter((r) => r.stepCount > 0).length / n),
    `${inT.filter((r) => r.en !== "不需翻（純數學）").length}/${inT.filter((r) => r.en === "有").length}`]);
});
for (let r = covStart; r < rowNo; r += 1) [3, 6, 7].forEach((c) => { ov.getCell(r, c).numFmt = "0.0%"; });
rowNo += 1;

put(["通過驗算的路徑", "題數"], { head: true });
Object.entries(summary.verifyPaths).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => put([k, n]));
rowNo += 1;
put(["無法驗算的原因", "題數"], { head: true });
Object.entries(summary.unverifiedReasons).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => put([k, n]));
rowNo += 1;
put(["訓練題包", "題數"], { head: true });
const packStart = rowNo;
summary.packs.forEach(([label, n]) => put([label, f(`SUMPRODUCT(--ISNUMBER(SEARCH("、${label}、","、"&${ref("packs")}&"、")))`, n)]));
ov.addConditionalFormatting({ ref: `B${packStart}:B${rowNo - 1}`, rules: [{ type: "dataBar", priority: 1, cfvo: [{ type: "num", value: 0 }, { type: "max" }], color: { argb: "FF70AD47" }, gradient: false }] });

// ③ 難度分布
const dist = wb.addWorksheet("難度分布");
title(dist, "難度分布（每個主題的 R1–R6 直方圖）", "exceljs 不支援原生圖表，這裡用資料橫條（data bar）呈現；數字是對明細的 COUNTIFS。");
dist.columns = [{ width: 14 }, { width: 8 }, { width: 10 }, { width: 34 }, { width: 3 }, { width: 14 }, { width: 8 }, { width: 10 }, { width: 34 }];
let dr = 4;
TOPICS.concat(["__all"]).forEach((t) => {
  const zh = t === "__all" ? "全部" : TOPIC_ZH[t];
  const head = dist.getRow(dr);
  ["主題／難度", "題數", "占比", "分布"].forEach((v, i) => { head.getCell(i + 1).value = i === 0 ? zh : v; });
  head.font = HEAD_FONT; head.fill = HEAD_FILL;
  dr += 1;
  const start = dr;
  [1, 2, 3, 4, 5, 6].forEach((k) => {
    const n = t === "__all" ? summary.byRank[`R${k}`] : summary.topicRank[zh][k - 1];
    const total = t === "__all" ? N : summary.byTopic[zh];
    const row = dist.getRow(dr);
    row.getCell(1).value = `R${k}`;
    row.getCell(2).value = t === "__all" ? f(`COUNTIF(${ref("rank")},${k})`, n) : f(`COUNTIFS(${ref("topic")},"${zh}",${ref("rank")},${k})`, n);
    row.getCell(3).value = f(`B${dr}/SUM($B$${start}:$B$${start + 5})`, n / total);
    row.getCell(3).numFmt = "0.0%";
    row.getCell(4).value = f(`B${dr}`, n);
    dr += 1;
  });
  dist.addConditionalFormatting({ ref: `D${start}:D${start + 5}`, rules: [{ type: "dataBar", priority: 1, cfvo: [{ type: "num", value: 0 }, { type: "max" }], color: { argb: "FF5B9BD5" }, gradient: false, showValue: true }] });
  dr += 1;
});
// 右側：作答形式 × 難度
{
  let r = 4;
  const head = dist.getRow(r);
  ["作答形式 × R", "R1", "R2", "R3", "R4", "R5", "R6"].forEach((v, i) => { const c = head.getCell(6 + i); c.value = v; c.font = HEAD_FONT; c.fill = HEAD_FILL; });
  r += 1;
  const start = r;
  Object.values(KIND_ZH).forEach((zh) => {
    if (!count((x) => x.kind === zh)) return;
    const row = dist.getRow(r);
    row.getCell(6).value = zh;
    [1, 2, 3, 4, 5, 6].forEach((k, i) => { row.getCell(7 + i).value = f(`COUNTIFS(${ref("kind")},"${zh}",${ref("rank")},${k})`, count((x) => x.kind === zh && x.rank === k)); });
    r += 1;
  });
  dist.addConditionalFormatting({ ref: `G${start}:L${r - 1}`, rules: [{ type: "colorScale", priority: 2, cfvo: [{ type: "min" }, { type: "max" }], color: [{ argb: "FFFFFFFF" }, { argb: "FFF4B183" }] }] });
  [7, 8, 9, 10, 11, 12].forEach((c) => { dist.getColumn(c).width = 8; });
  r += 1;
  const h2 = dist.getRow(r);
  ["三軸 S/O/L 組合", "題數"].forEach((v, i) => { const c = h2.getCell(6 + i); c.value = v; c.font = HEAD_FONT; c.fill = HEAD_FILL; });
  r += 1;
  const combos = rows.reduce((m, x) => { m[x.axes] = (m[x.axes] || 0) + 1; return m; }, {});
  const cs = r;
  Object.entries(combos).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => {
    const row = dist.getRow(r);
    row.getCell(6).value = k;
    row.getCell(7).value = f(`SUMPRODUCT(--(${ref("axes")}="${k}"))`, n);
    r += 1;
  });
  dist.addConditionalFormatting({ ref: `G${cs}:G${r - 1}`, rules: [{ type: "dataBar", priority: 3, cfvo: [{ type: "num", value: 0 }, { type: "max" }], color: { argb: "FFA5A5A5" }, gradient: false }] });
}

// ④ 課程覆蓋
const cs = wb.addWorksheet("課程覆蓋", { views: [{ state: "frozen", xSplit: 4, ySplit: 1 }] });
const COURSE_COLS = [
  ["order", "序", 5], ["stage", "Stage", 14], ["chapter", "章", 18], ["code", "課號", 7], ["id", "課 id", 24], ["title", "課名", 22],
  ["practice", "推薦題數", 8], ["core", "核心", 6], ["challenge", "挑戰", 6], ["verifiedShare", "已驗算比例", 9],
  ["unverifiedN", "未驗算題數", 8], ["unverifiedCore", "未驗算核心題", 8], ["unverified", "未驗算的推薦題", 30],
  ["rankMin", "R 最低", 6], ["rankMax", "R 最高", 6], ["kinds", "作答形式", 20], ["worked", "課文範例數", 8], ["workedLinked", "範例連到題庫", 8],
  ["noPractice", "沒有推薦題", 8], ["gapCount", "宣告缺題數", 8], ["gaps", "宣告的缺口（gaps）", 44], ["missing", "推薦題不在題庫", 14]
];
cs.columns = COURSE_COLS.map(([key, header, width]) => ({ key, header, width }));
courseRows.forEach((c) => cs.addRow(c));
headerRow(cs, 1);
cs.autoFilter = { from: { row: 1, column: 1 }, to: { row: courseRows.length + 1, column: COURSE_COLS.length } };
cs.getColumn("verifiedShare").numFmt = "0%";
["unverified", "gaps", "kinds"].forEach((k) => { cs.getColumn(k).alignment = { wrapText: true, vertical: "top" }; });
const cL = (key) => colLetter(COURSE_COLS.findIndex(([k]) => k === key) + 1);
const cLast = courseRows.length + 1;
cs.addConditionalFormatting({ ref: `${cL("practice")}2:${cL("practice")}${cLast}`, rules: [{ type: "expression", priority: 1, formulae: [`$${cL("practice")}2=0`], style: { fill: fill(AMBER) } }] });
cs.addConditionalFormatting({ ref: `${cL("unverifiedCore")}2:${cL("unverifiedCore")}${cLast}`, rules: [{ type: "expression", priority: 1, formulae: [`$${cL("unverifiedCore")}2>0`], style: { fill: fill(RED) } }] });
cs.addConditionalFormatting({ ref: `${cL("verifiedShare")}2:${cL("verifiedShare")}${cLast}`, rules: [{ type: "dataBar", priority: 2, cfvo: [{ type: "num", value: 0 }, { type: "num", value: 1 }], color: { argb: "FF70AD47" }, gradient: false }] });
cs.addConditionalFormatting({ ref: `${cL("practice")}2:${cL("practice")}${cLast}`, rules: [{ type: "dataBar", priority: 3, cfvo: [{ type: "num", value: 0 }, { type: "max" }], color: { argb: "FF5B9BD5" }, gradient: false }] });

// ⑤ 品質待辦
const qs = wb.addWorksheet("品質待辦", { views: [{ state: "frozen", ySplit: 1 }] });
const ISSUE_COLS = [
  ["priority", "優先", 6], ["type", "問題類型", 24], ["code", "題號", 8], ["id", "id", 20], ["topic", "主題", 6], ["rank", "R", 4], ["kind", "作答形式", 10],
  ["detail", "說明", 46], ["exposure", "曝光（課程／每日／考卷）", 26], ["action", "建議動作", 40], ["effort", "估計工時／題", 10], ["done", "處理狀態", 10]
];
qs.columns = ISSUE_COLS.map(([key, header, width]) => ({ key, header, width }));
issues.forEach((i) => qs.addRow({ ...i, done: "" }));
headerRow(qs, 1);
qs.autoFilter = { from: { row: 1, column: 1 }, to: { row: issues.length + 1, column: ISSUE_COLS.length } };
["detail", "action", "exposure"].forEach((k) => { qs.getColumn(k).alignment = { wrapText: true, vertical: "top" }; });
const qLast = issues.length + 1;
[["P0", RED], ["P1", RED], ["P2", AMBER], ["P3", "FFFFF2CC"]].forEach(([p, argb]) => qs.addConditionalFormatting({ ref: `A2:A${qLast}`, rules: [{ type: "expression", priority: 1, formulae: [`$A2="${p}"`], style: { fill: fill(argb), font: { bold: p <= "P1" } } }] }));
qs.dataValidations.add(`L2:L${qLast}`, { type: "list", allowBlank: true, formulae: ['"待處理,處理中,完成,不處理"'] });

// 待辦摘要（放在總覽最後）
rowNo += 1;
put(["品質待辦（依優先與類型）", "筆數"], { head: true });
summary.issues.sort((a, b) => a[0].localeCompare(b[0])).forEach(([k, n]) => {
  const [p, ...rest] = k.split(" ");
  put([k, f(`COUNTIFS('品質待辦'!$A:$A,"${p}",'品質待辦'!$B:$B,"${rest.join(" ")}")`, n)]);
});

// ⑥ 資料字典
// ⑤ 方法集中度（題庫精修提案 v1.0）：量上線的側表 src/kernel/problem_profiles.js，算法跟 CI 的 report_method_diversity.js 同一支
{
  const D = require("./lib/method_diversity.js");
  const taxonomy = require("./content/method_taxonomy.js");
  const profiles = D.profilesFromRuntime(win.BuzzProblemProfiles, win.BuzzSampler);
  const bankT = D.tabulate(D.bankRows(problems, profiles, "bank"));
  const poolT = D.tabulate(D.bankRows(problems, profiles, "default"));
  const md = wb.addWorksheet("方法集中度", { views: [{ state: "frozen", ySplit: 3 }] });
  title(md, "方法集中度（主要家族）：全題庫 vs 預設池", "預設池 = 每題以 defaultWeight 計（兩段式抽題第一段的家族質量）。HHI = Σ份額²×10000（獨佔 = 10000）。上限見 tools/content/method_taxonomy.js。");
  md.columns = [{ width: 10 }, { width: 6 }, { width: 8 }, { width: 26 }, { width: 10 }, { width: 9 }, { width: 8 }, { width: 26 }, { width: 10 }, { width: 9 }];
  let r = 3;
  ["主題", "rank", "題數", "全題庫最大家族", "份額", "HHI", "家族數", "預設池最大家族", "份額", "HHI"].forEach((v, i) => { md.getRow(r).getCell(i + 1).value = v; });
  headerRow(md, r);
  r += 1;
  Object.keys(bankT).sort().forEach((k) => {
    const b = bankT[k];
    const d = poolT[k];
    const row = md.getRow(r);
    [TOPIC_ZH[b.topic], `R${b.rank}`, b.total, b.top.fam, b.top.share, b.hhi, b.families, d.top.fam, d.top.share, d.hhi].forEach((v, i) => { row.getCell(i + 1).value = v; });
    row.getCell(5).numFmt = "0.0%"; row.getCell(9).numFmt = "0.0%";
    if (b.top.share > taxonomy.SOFT_FAMILY_SHARE) row.getCell(5).fill = fill(AMBER);
    row.getCell(9).fill = fill(d.top.share > taxonomy.SOFT_FAMILY_SHARE ? AMBER : GREEN);
    r += 1;
  });
  md.addConditionalFormatting({ ref: `F4:F${r - 1}`, rules: [{ type: "colorScale", priority: 1, cfvo: [{ type: "min" }, { type: "max" }], color: [{ argb: "FFFFFFFF" }, { argb: "FFF4B183" }] }] });
  r += 1;
  // 曝光上限
  ["上限", "rank", "家族", "上限值", "全題庫", "預設池", "結果"].forEach((v, i) => { md.getRow(r).getCell(i + 1).value = v; });
  headerRow(md, r);
  r += 1;
  const bankCaps = D.capChecks(bankT);
  D.capChecks(poolT).forEach((c, i) => {
    const row = md.getRow(r);
    [c.cap.id, `R${c.rank}`, c.cap.any ? `任一（${c.what}）` : c.what, c.cap.max, bankCaps[i].share, c.share, c.infeasible ? "不可行" : c.ok ? "OK" : "超過"].forEach((v, j) => { row.getCell(j + 1).value = v; });
    [4, 5, 6].forEach((j) => { row.getCell(j).numFmt = "0.0%"; });
    row.getCell(7).fill = fill(c.ok ? GREEN : RED);
    r += 1;
  });
  r += 1;
  // 模板飽和
  const sat = D.templateSaturation(problems, profiles);
  ["模板母題（noveltyFamily）", "在哪裡", "題數"].forEach((v, i) => { md.getRow(r).getCell(i + 1).value = v; });
  headerRow(md, r);
  r += 1;
  [["課程核心", sat.core], ["預設池", sat.pool]].forEach(([where, list]) => list.forEach(([nov, n]) => {
    const row = md.getRow(r);
    row.getCell(1).value = nov; row.getCell(2).value = where; row.getCell(3).value = n;
    row.getCell(3).fill = fill(AMBER);
    r += 1;
  }));

  // 長表：主題 × rank × 家族
  const mf = wb.addWorksheet("方法家族分布", { views: [{ state: "frozen", ySplit: 1 }] });
  mf.columns = [
    { header: "主題", key: "topic", width: 8 }, { header: "rank", key: "rank", width: 6 }, { header: "家族", key: "fam", width: 28 },
    { header: "家族（中文）", key: "label", width: 22 }, { header: "題數", key: "n", width: 7 }, { header: "全題庫份額", key: "bank", width: 11 },
    { header: "預設池份額", key: "pool", width: 11 }, { header: "平均 defaultWeight", key: "w", width: 12 }
  ];
  const famIndex = taxonomy.familyIndex();
  Object.keys(bankT).sort().forEach((k) => {
    const b = bankT[k];
    const d = poolT[k];
    Object.entries(b.fams).sort((x, y) => y[1] - x[1]).forEach(([fam, n]) => {
      mf.addRow({ topic: TOPIC_ZH[b.topic], rank: `R${b.rank}`, fam, label: (famIndex[`${b.topic}:${fam}`] || {}).label || "", n, bank: b.shares[fam], pool: d.shares[fam] || 0, w: (d.fams[fam] || 0) / n });
    });
  });
  ["bank", "pool"].forEach((key) => { mf.getColumn(key).numFmt = "0.0%"; });
  mf.getColumn("w").numFmt = "0.00";
  headerRow(mf, 1);
  mf.autoFilter = { from: "A1", to: "H1" };
}

const dd = wb.addWorksheet("資料字典");
dd.columns = [{ header: "工作表", key: "sheet", width: 10 }, { header: "欄位", key: "col", width: 18 }, { header: "意思", key: "meaning", width: 70 }, { header: "資料來源", key: "src", width: 50 }];
COLUMNS.forEach(([, header, , meaning, src]) => dd.addRow({ sheet: DETAIL, col: header, meaning, src }));
[
  ["課程覆蓋", "推薦題數／核心／挑戰", "lessons/*.json 的 practice[]：core＝熟練條件要全對的題，challenge＝挑戰題，其餘是一般推薦。", "tools/content/course_v2/lessons/*.json"],
  ["課程覆蓋", "已驗算比例", "推薦題中「通過」或「另法驗證」的比例（手繪草圖、看圖題等算未驗算）。", "本工具＋verify_engine"],
  ["課程覆蓋", "宣告的缺口（gaps）", "寫課的人宣告「這課需要但題庫沒有」的題：tag×數量（說明）。", "lessons/*.json gaps[]"],
  ["課程覆蓋", "沒有推薦題", "這課沒有任何推薦題：小測完成就算全破（validate_course_v2 要求這種課要寫 gaps 或本來就不需要題）。", "lessons/*.json"],
  ["品質待辦", "優先", "P0 答案錯；P1 高曝光（課程、每日一題、章首魔王）題沒有獨立驗算；P2 固定考卷未驗算、課程題缺提示與步驟；P3 一般題缺提示步驟、時限偏短、課程內重複；P4 其他（批次處理即可）。", "本工具規則"],
  ["方法集中度", "預設池份額／HHI", "每題以 defaultWeight 計的家族份額（兩段式抽題第一段的質量）；HHI = Σ份額²×10000。上限與軟上限在分類表。", "src/kernel/problem_profiles.js、tools/content/method_taxonomy.js"],
  ["方法集中度", "模板母題", "noveltyFamily：題幹數字正規化後同結構的一群（含 variantOf／tmpl 家族），以群裡第一題命名；課程核心或預設池超過 5 題標黃。", "tools/lib/problem_profiles.js"],
  ["方法家族分布", "家族", "每題的主要家族 methodFamily[0]（規則：tag／skill／題幹結構；人工覆寫在 tools/content/problem_profile_overrides.json）。", "tools/lib/problem_profiles.js"],
  ["品質待辦", "估計工時／題","粗估單題工時，供排程參考。", "經驗估計"],
  ["品質待辦", "處理狀態", "下拉選單，給負責人追蹤用。重跑產生器會清空，請另存。", ""],
  ["（全部）", "成效欄（灰色表頭）", "作答次數、答對率、平均用時、跳過率需要 GA4 的逐題資料，目前留空。取得方式見報告第 6 節；有了 CSV 用 node tools/build_stats_workbook.js --ga 檔名 重產。", "docs/metrics.md、GA4 BigQuery 匯出"]
].forEach(([sheet, col, meaning, src]) => dd.addRow({ sheet, col, meaning, src }));
headerRow(dd, 1);
dd.getColumn("meaning").alignment = { wrapText: true, vertical: "top" };
dd.getColumn("src").alignment = { wrapText: true, vertical: "top" };

fs.mkdirSync(OUT_DIR, { recursive: true });
const xlsxPath = path.join(OUT_DIR, "題庫統計.xlsx");
const summaryPath = path.join(OUT_DIR, "summary.json");
wb.xlsx.writeFile(xlsxPath).then(() => {
  fs.writeFileSync(summaryPath, JSON.stringify({ ...summary, topIssuesP1: issues.filter((i) => i.priority === "P1").map((i) => `${i.id} ${i.exposure}`) }, null, 2) + "\n", "utf8");
  console.log(`題目 ${N} 題、課 ${courseRows.length} 課、待辦 ${issues.length} 筆`);
  console.log(`寫到 ${xlsxPath}`);
  console.log(`摘要 ${summaryPath}`);
});
