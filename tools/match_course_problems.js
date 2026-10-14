// 課程缺口的重新對應（題庫精修提案 v1.0 第三階段）：先拿題庫裡「已經有、但沒被課程用到」的題補推薦題，再談寫新題。
//
// 每一課的候選題：
//   一、適配：題目的粗 tag 跟這一課的 skillTags.coarse 重疊（越少見的 tag 越有分），或題目有技巧是「這一課第一次教」的；
//       主要方法家族跟這一課現有推薦題／範例的家族相同再加分；gaps／細標籤的字眼出現在題目 tag 裡再加一點。
//   二、先修課不能晚於這一課：用跟側寫同一套的技巧 → 第一次被教的課（含 GATE_FIXES 與覆寫檔），一個技巧晚於這一課就不收；
//       技巧整套課都沒教的也不收。只靠很早以前的課就解得開的題扣分（它沒在練這一課）。
//   三、rank 合這一課的階段：預備～導數（Stage 0–2）核心 R1–R3；之後核心 R2–R4；支線（Stage 11–12）核心到 R5；挑戰再高一級。
//   四、答案要通過獨立驗算；沒通過的只能當挑戰並標出來（證明／文字／草圖／選圖題不在驗算範圍，照驗證器的例外）。
//   五、同一個模板母題（noveltyFamily）一課只收一題（含這一課已經有的）；已經被很多課用的題扣分。
//
// 用法：
//   node tools/match_course_problems.js                       全部課 → docs/report/stats/course-remap.csv（gitignored）
//   node tools/match_course_problems.js <lesson> …            只印這幾課的候選（終端機），不寫檔
//   node tools/match_course_problems.js --thin                只看 0–2 題推薦題的課
//   node tools/match_course_problems.js --top 8               每課列幾個候選（預設 8）
//   node tools/match_course_problems.js --gaps --unused --min 8 --print
//                                                             只看有 gaps 的課、只看還沒被任何課用的題、分數至少 8，印在終端機
//   node tools/match_course_problems.js --apply plan.json     依計畫改 lessons/*.json 的 practice：
//        { "<lesson>": { "add": [{ "id", "core"|"challenge", "trains", "note"? }], "remove": ["<id>"] } }
//        只動 practice 區塊、保留檔案其他格式；add 的題要存在、不能重複、trains 要是這一課的細標籤。
"use strict";

const fs = require("fs");
const path = require("path");
const load = require("./lib/app_api.js");
const { buildProfiles, featuresOf, gateSkills } = require("./lib/problem_profiles.js");

const ROOT = path.join(__dirname, "..");
const LESSON_DIR = path.join(ROOT, "tools", "content", "course_v2", "lessons");
const OUT = path.join(ROOT, "docs", "report", "stats", "course-remap.csv");
const EXEMPT_KINDS = new Set(["proof", "text", "sketch", "graph"]); // validate_course_v2 的「不需驗算」例外

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const flagged = new Set(args.filter((a) => a.startsWith("--")));
const optValues = new Set(["--top", "--apply", "--min"].map((n) => opt(n, null)).filter(Boolean));
const only = args.filter((a) => !a.startsWith("--") && !optValues.has(a));

/* ── 套用計畫 ─────────────────────────────────────────────────── */
function formatItem(p) {
  const keys = ["id", "core", "challenge", "trains", "note"].filter((k) => p[k] !== undefined && p[k] !== false);
  return `{ ${keys.map((k) => `${JSON.stringify(k)}: ${JSON.stringify(p[k])}`).join(", ")} }`;
}
function writePractice(file, practice) {
  const text = fs.readFileSync(file, "utf8");
  const start = text.indexOf("\"practice\": [");
  if (start < 0) throw new Error(`${file}：找不到 practice`);
  let depth = 0;
  let end = -1;
  let inStr = false;
  for (let i = text.indexOf("[", start); i < text.length; i += 1) {
    const c = text[i];
    if (inStr) { if (c === "\\") i += 1; else if (c === "\"") inStr = false; continue; }
    if (c === "\"") inStr = true;
    else if (c === "[") depth += 1;
    else if (c === "]") { depth -= 1; if (depth === 0) { end = i; break; } }
  }
  // 兩種排版都有：一題一行（大多數課）、或 JSON.stringify(…, 2) 的展開式 —— 照原檔的樣子寫回去
  const expanded = /^\[\s*\{\s*\n/.test(text.slice(text.indexOf("[", start)));
  const fmt = expanded
    ? (p) => JSON.stringify(Object.fromEntries(["id", "core", "challenge", "trains", "note"].filter((k) => p[k] !== undefined && p[k] !== false).map((k) => [k, p[k]])), null, 2).replace(/\n/g, "\n    ")
    : formatItem;
  const block = practice.length ? `"practice": [\n${practice.map((p) => `    ${fmt(p)}`).join(",\n")}\n  ]` : "\"practice\": []";
  const next = text.slice(0, start) + block + text.slice(end + 1);
  JSON.parse(next); // 寫壞就丟例外
  fs.writeFileSync(file, next, "utf8");
}
if (flagged.has("--apply")) {
  load();
  const byId = new Set(load.allProblems().map((p) => p.id));
  const plan = JSON.parse(fs.readFileSync(opt("--apply"), "utf8"));
  let added = 0;
  let removed = 0;
  Object.entries(plan).forEach(([lesson, change]) => {
    if (lesson.startsWith("_")) return;
    const file = path.join(LESSON_DIR, `${lesson}.json`);
    const L = JSON.parse(fs.readFileSync(file, "utf8"));
    const fine = new Set((L.skillTags && L.skillTags.fine) || []);
    let practice = (L.practice || []).slice();
    (change.remove || []).forEach((id) => {
      if (!practice.some((p) => p.id === id)) throw new Error(`${lesson}：要移除的 ${id} 不在推薦題`);
      practice = practice.filter((p) => p.id !== id);
      removed += 1;
    });
    (change.add || []).forEach((p) => {
      if (!byId.has(p.id)) throw new Error(`${lesson}：${p.id} 不在題庫`);
      if (practice.some((q) => q.id === p.id)) throw new Error(`${lesson}：${p.id} 已經在推薦題`);
      if (!fine.has(p.trains)) throw new Error(`${lesson}：${p.id} 的 trains「${p.trains}」不是這一課的細標籤（${[...fine].join("、")}）`);
      if (p.core && p.challenge) throw new Error(`${lesson}：${p.id} 同時標 core 與 challenge`);
      const item = { id: p.id, trains: p.trains };
      if (p.core) item.core = true;
      if (p.challenge) item.challenge = true;
      if (p.note) item.note = p.note;
      // 原本的順序不動；新題插在同一層（core → 一般 → 挑戰）的最後一題後面
      const tier = (q) => (q.core ? 0 : q.challenge ? 2 : 1);
      let at = 0;
      practice.forEach((q, k) => { if (tier(q) <= tier(item)) at = k + 1; });
      practice.splice(at, 0, item);
      added += 1;
    });
    writePractice(file, practice);
  });
  console.log(`已套用：新增 ${added} 題、移除 ${removed} 題（${Object.keys(plan).filter((k) => !k.startsWith("_")).length} 課）。接著跑 node tools/build_course_v2.js 與 validate_course_v2.js`);
  process.exit(0);
}

/* ── 載入 ─────────────────────────────────────────────────────── */
load();
const win = global.window;
const problems = load.allProblems();
const byId = new Map(problems.map((p) => [p.id, p]));
const verified = win.BuzzVerifiedAnswers;
const isVerified = (id) => Boolean(verified && verified.has && verified.has(id));
const graph = win.BuzzSkillGraph;
const built = buildProfiles(problems, win);
const { profiles, course, firstTaught } = built;
const order = course.order;
const lessonIdx = new Map(order.map((id, i) => [id, i]));
const stageOf = new Map();
win.BUZZ_COURSE_V2.stages.forEach((s, si) => s.chapters.forEach((c) => c.lessons.forEach((l) => stageOf.set(l.id, si))));

const lessons = new Map();
order.forEach((id) => {
  const file = path.join(LESSON_DIR, `${id}.json`);
  if (fs.existsSync(file)) lessons.set(id, JSON.parse(fs.readFileSync(file, "utf8")));
});

// 每題：拿來算先修課的技巧 → 最晚的那一課（不含「被課程用了就提早」那一條：這裡問的是題目本身要先學什麼）
const overrides = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, "tools", "content", "problem_profile_overrides.json"), "utf8")).problems || {}; } catch (e) { return {}; }
})();
const info = new Map();
problems.forEach((p) => {
  const f = featuresOf(p, graph);
  const { skills } = gateSkills(f);
  const untaught = skills.filter((s) => !(s in firstTaught));
  let gate = skills.filter((s) => s in firstTaught).map((s) => firstTaught[s]);
  const ov = overrides[p.id] && overrides[p.id].prerequisiteGate;
  if (ov) gate = ov.map((g) => lessonIdx.get(g));
  info.set(p.id, { f, skills, untaught: ov ? [] : untaught, gateMax: gate.length ? Math.max(...gate) : -1 });
});

// 用量：每題被幾課用（推薦題＋範例）
const usage = new Map();
Object.entries(course.usage).forEach(([id, uses]) => usage.set(id, new Set(uses.map((u) => u.lesson)).size));
lessons.forEach((L) => (L.workedExamples || []).forEach((w) => { if (w.problemId) usage.set(w.problemId, Math.max(1, usage.get(w.problemId) || 0)); }));

// 方法家族的「家」：現在的推薦題裡，這個家族出現在哪些課
const famHome = new Map();
Object.entries(course.usage).forEach(([id, uses]) => {
  const pr = profiles.get(id);
  if (!pr) return;
  uses.forEach((u) => { if (u.kind !== "worked") (famHome.get(pr.methodFamily[0]) || famHome.set(pr.methodFamily[0], []).get(pr.methodFamily[0])).push(u.index); });
});

// tag 的稀有度（idf）
const tagCount = new Map();
problems.forEach((p) => (p.tags || []).forEach((t) => tagCount.set(t, (tagCount.get(t) || 0) + 1)));
const idf = (t) => Math.log(problems.length / (1 + (tagCount.get(t) || 0)));
const GENERIC = /^(rank-\d|beginner-friendly|beginner-foundation|exam-style|transfer-exam|proficiency-exam|midterm-style|university-exam-style|world-universities|boss-rank|boss-plus|true-boss|burst|lecture|lecture-\d+|exam-depth|depth-r\d|hardcore|longform|long-form|competition)$/;

function rankBand(stage) {
  if (stage <= 2) return { core: [1, 3], plain: [1, 4], challenge: [2, 5] };
  if (stage <= 10) return { core: [2, 4], plain: [1, 5], challenge: [3, 6] };
  return { core: [2, 5], plain: [2, 5], challenge: [3, 6] };
}
const inBand = (r, [lo, hi]) => r >= lo && r <= hi;
const tokens = (s) => String(s || "").toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !/^(the|and|for|with|from)$/.test(w));

function candidatesFor(lessonId) {
  const L = lessons.get(lessonId);
  const i = lessonIdx.get(lessonId);
  const stage = stageOf.get(lessonId);
  const band = rankBand(stage);
  const coarse = new Set((L.skillTags && L.skillTags.coarse) || []);
  const fine = (L.skillTags && L.skillTags.fine) || [];
  const newSkills = new Set();
  coarse.forEach((t) => (graph.tagToSkills(t) || []).forEach((s) => { if (firstTaught[s] === i) newSkills.add(s); }));
  const inLesson = new Set((L.practice || []).map((p) => p.id));
  (L.workedExamples || []).forEach((w) => w.problemId && inLesson.add(w.problemId));
  const novTaken = new Set([...inLesson].filter((id) => profiles.has(id)).map((id) => profiles.get(id).noveltyFamily));
  const fams = new Map();
  inLesson.forEach((id) => { const pr = profiles.get(id); if (pr) fams.set(pr.methodFamily[0], (fams.get(pr.methodFamily[0]) || 0) + 1); });
  const words = new Set([...fine, ...((L.gaps || []).map((g) => g.tag))].flatMap(tokens));
  const fineTok = fine.map((t) => [t, new Set(tokens(t))]);

  const out = [];
  problems.forEach((p) => {
    if (inLesson.has(p.id)) return;
    const pr = profiles.get(p.id);
    const inf = info.get(p.id);
    const rank = Number(p.rank || 0);
    const why = [];
    let score = 0;
    // 適配
    const tagHits = (p.tags || []).filter((t) => coarse.has(t) && !GENERIC.test(t));
    const skillHits = inf.skills.filter((s) => newSkills.has(s));
    if (!tagHits.length && !skillHits.length) return;
    if (tagHits.length) { const w = tagHits.reduce((a, t) => a + idf(t), 0); score += Math.min(6, w); why.push(`tag ${tagHits.join("/")}`); }
    if (skillHits.length) { score += 3; why.push(`本課新技巧 ${skillHits.join("/")}`); }
    // 先修課
    if (inf.untaught.length) return;
    if (inf.gateMax > i) return;
    if (inf.gateMax === i) { score += 3; why.push("先修課正是這一課"); }
    else if (inf.gateMax >= 0 && i - inf.gateMax > 25) { score -= 2; why.push(`只用到〈${order[inf.gateMax]}〉以前的技巧`); }
    else if (inf.gateMax < 0) { score -= 1; why.push("沒有技巧對應（先修課未知）"); }
    // 家族：跟這一課現有的題同家族加分；這個家族在課程裡的「家」離這一課很遠（> 12 課）扣分
    if (fams.has(pr.methodFamily[0])) { score += 1.5; why.push(`家族 ${pr.methodFamily[0]}`); }
    else {
      const home = famHome.get(pr.methodFamily[0]);
      if (home && home.length) {
        const near = home.reduce((best, x) => (Math.abs(x - i) < Math.abs(best - i) ? x : best), home[0]);
        if (Math.abs(near - i) > 12) { score -= 2; why.push(`家族 ${pr.methodFamily[0]} 通常在〈${order[near]}〉`); }
      }
    }
    if (flagged.has("--unused") && (usage.get(p.id) || 0)) return;
    // 字眼
    const tagTok = new Set((p.tags || []).flatMap(tokens));
    const wordHits = [...words].filter((w) => tagTok.has(w));
    if (wordHits.length) { score += Math.min(2, wordHits.length * 0.5); why.push(`字眼 ${wordHits.slice(0, 3).join("/")}`); }
    // rank
    let role = inBand(rank, band.core) ? "core" : inBand(rank, band.plain) ? "plain" : inBand(rank, band.challenge) ? "challenge" : null;
    if (!role) return;
    if (role !== "core") score -= role === "plain" ? 0.5 : 1;
    // 驗算
    const exempt = EXEMPT_KINDS.has(p.answerKind);
    const ver = isVerified(p.id) ? "已驗算" : exempt ? "不需驗算" : "未驗算";
    if (ver === "未驗算") { role = "challenge"; score -= 2; why.push("未驗算→只能當挑戰"); }
    // 用量、模板
    const used = usage.get(p.id) || 0;
    if (used) { score -= Math.min(2, used * 0.7); why.push(`已被 ${used} 課用`); }
    const fineScore = fineTok.map(([t, set]) => [t, [...tagTok].filter((w) => set.has(w)).length]).sort((a, b) => b[1] - a[1]);
    out.push({ p, pr, rank, role, score: Math.round(score * 10) / 10, why, ver, used, gate: inf.gateMax >= 0 ? order[inf.gateMax] : "", trains: fineScore.length ? fineScore[0][0] : "" });
  });
  out.sort((a, b) => b.score - a.score || a.rank - b.rank);
  // 同一個模板母題一課一題
  const seen = new Set(novTaken);
  return out.filter((c) => { if (seen.has(c.pr.noveltyFamily)) return false; seen.add(c.pr.noveltyFamily); return true; });
}

/* ── 輸出 ─────────────────────────────────────────────────────── */
const top = Number(opt("--top", 8));
const minScore = Number(opt("--min", -Infinity));
const targets = only.length ? only : order.filter((id) => lessons.has(id)
  && (!flagged.has("--thin") || (lessons.get(id).practice || []).length <= 2)
  && (!flagged.has("--gaps") || (lessons.get(id).gaps || []).length));
const rows = [];
targets.forEach((id) => {
  if (!lessons.has(id)) { console.error(`沒有這一課：${id}`); return; }
  const L = lessons.get(id);
  const cands = candidatesFor(id).filter((c) => c.score >= minScore).slice(0, top);
  if (!cands.length && minScore > -Infinity && !only.length) return;
  rows.push({ id, L, cands });
});

if (only.length || flagged.has("--print")) {
  rows.forEach(({ id, L, cands }) => {
    console.log(`\n■ ${lessonIdx.get(id)} ${id}〈${L.title}〉 推薦題 ${(L.practice || []).length}  細標籤 ${(L.skillTags.fine || []).join(",")}`);
    (L.gaps || []).forEach((g) => console.log(`   缺：${g.tag}×${g.count} ${g.note || ""}`));
    if (!cands.length) console.log("   （沒有候選）");
    cands.forEach((c) => console.log(`   ${String(c.score).padStart(5)} ${c.p.id} R${c.rank} ${c.p.answerKind} ${c.ver} → ${c.role}/${c.trains}  [${c.why.join("；")}]\n         ${String(c.p.prompt).replace(/\s+/g, " ").slice(0, 120)}  答：${String(c.p.answer ?? c.p.canonical ?? "").slice(0, 40)}`));
  });
  if (only.length) process.exit(0);
}

const esc = (v) => `"${String(v === undefined || v === null ? "" : v).replace(/"/g, "\"\"")}"`;
const head = ["lesson", "order", "stage", "title", "practiceNow", "gaps", "candidate", "score", "suggestedRole", "suggestedTrains", "rank", "answerKind", "verified", "prerequisiteGate", "methodFamily", "noveltyFamily", "usedByLessons", "reasons", "prompt", "answer"];
const lines = [head.join(",")];
let empty = 0;
rows.forEach(({ id, L, cands }) => {
  if (!cands.length) {
    empty += 1;
    lines.push([id, lessonIdx.get(id), stageOf.get(id), L.title, (L.practice || []).length, (L.gaps || []).map((g) => `${g.tag}×${g.count}`).join(" "), "", "", "", "", "", "", "", "", "", "", "", "沒有符合條件的既有題", "", ""].map(esc).join(","));
    return;
  }
  cands.forEach((c) => lines.push([id, lessonIdx.get(id), stageOf.get(id), L.title, (L.practice || []).length, (L.gaps || []).map((g) => `${g.tag}×${g.count}`).join(" "),
    c.p.id, c.score, c.role, c.trains, c.rank, c.p.answerKind, c.ver, c.gate, c.pr.methodFamily.join(" "), c.pr.noveltyFamily, c.used, c.why.join("；"),
    String(c.p.prompt).replace(/\s+/g, " ").slice(0, 200), String(c.p.answer ?? c.p.canonical ?? "").slice(0, 60)].map(esc).join(",")));
});
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `﻿${lines.join("\n")}\n`, "utf8");
console.log(`課程重新對應：${rows.length} 課、每課前 ${top} 個候選 → ${path.relative(ROOT, OUT)}；${empty} 課沒有任何符合條件的既有題`);
