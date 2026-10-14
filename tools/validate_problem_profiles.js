// 題目側寫（src/kernel/problem_profiles.js）與兩段式抽題（src/kernel/sampler.js）的把關。
//
// 一、側寫本身（題庫精修提案 v1.0 第一階段）
//   1. 每一題都有 methodFamily、learningRole、noveltyFamily、defaultWeight（0–1），而且值都在分類表裡
//      （tools/content/method_taxonomy.js；家族要屬於題目自己的主題）
//   2. 課程用到的題（推薦題、範例）都有 prerequisiteGate；先修課都是大綱裡真的課；
//      推薦題的先修課不能排在它所在的那一課之後（不然課程練習會把自己的推薦題擋掉）
//   3. 人工覆寫：題號存在、欄位合法、每筆都寫了 why
//   4. 上線的側表 == 現在重新產生的（忘了 regen 在這裡也會紅，不只 regen_all --check）
// 二、抽題器（第二階段）
//   5. clampShares 單元測試（含不可行的格子、上限 0）
//   6. 先修閘門：課程練習擋「先修課在後面而且沒完成」的題、完成了就放行；新手保護期只出走到的課；魔王題不篩
//   7. 同一個 seed 抽出同一局；focus（選了題包）不套上限
//   8. 模擬：每種模式×主題×難度上限各 1,000 局，比較「取前 n 題」（改之前）與兩段式（改之後）：
//      Taylor 各 rank 曝光、微分 R6 的家族份額、一局限制（同家族 ≤ 30%、同模板 ≤ 1、同模板母題 ≤ 1、同題包 ≤ 40%）
//   9. 能力模型的訊號還在：把 u 代換練爛之後，u 代換的題在積分局裡的份額要明顯高於沒紀錄的人
//
// 用法：node tools/validate_problem_profiles.js [--sessions N]（預設 1000）

"use strict";

const fs = require("fs");
const path = require("path");
const load = require("./lib/app_api.js");
const api = load();
const problems = load.allProblems();
const win = global.window;
const taxonomy = require("./content/method_taxonomy.js");
const { buildProfiles, encodeRuntime, OVERRIDES_FILE } = require("./lib/problem_profiles.js");
const D = require("./lib/method_diversity.js");
const S = win.BuzzSampler;

const args = process.argv.slice(2);
const SESSIONS = args.includes("--sessions") ? Number(args[args.indexOf("--sessions") + 1]) : 1000;
const failures = [];
const fail = (msg) => failures.push(msg);
const byId = new Map(problems.map((p) => [p.id, p]));

if (!S || !win.BuzzProblemProfiles) {
  console.error("sampler.js／problem_profiles.js 沒有載入（index.html 的 data-lazy=\"sampler\"）");
  process.exit(1);
}

/* ── 一、側寫 ──────────────────────────────────────────────────── */
const built = buildProfiles(problems, win);
const famOf = {};
Object.entries(taxonomy.FAMILIES).forEach(([topic, list]) => { famOf[topic] = new Set(list.map(([id]) => id)); });
const vocab = {
  cognitiveAction: new Set(taxonomy.COGNITIVE_ACTIONS),
  difficultyMode: new Set(taxonomy.DIFFICULTY_MODES),
  learningRole: new Set(taxonomy.LEARNING_ROLES)
};
const reps = new Set(taxonomy.REPRESENTATIONS);
const lessonIdx = new Map(built.course.order.map((id, i) => [id, i]));

problems.forEach((p) => {
  const pr = built.profiles.get(p.id);
  if (!pr) { fail(`${p.id}：沒有側寫`); return; }
  if (!pr.methodFamily.length) fail(`${p.id}：沒有 methodFamily`);
  pr.methodFamily.forEach((f) => { if (!famOf[p.topic] || !famOf[p.topic].has(f)) fail(`${p.id}：家族 ${f} 不在 ${p.topic} 的分類表裡`); });
  ["cognitiveAction", "difficultyMode", "learningRole"].forEach((k) => {
    if (!pr[k].length) fail(`${p.id}：沒有 ${k}`);
    pr[k].forEach((v) => { if (!vocab[k].has(v)) fail(`${p.id}：${k} 的值 ${v} 不在詞彙表`); });
  });
  if (!reps.has(pr.representation)) fail(`${p.id}：representation ${pr.representation} 不在詞彙表`);
  if (!pr.noveltyFamily || !byId.has(pr.noveltyFamily)) fail(`${p.id}：noveltyFamily ${pr.noveltyFamily} 不是題號`);
  if (!(pr.defaultWeight >= 0 && pr.defaultWeight <= 1)) fail(`${p.id}：defaultWeight ${pr.defaultWeight} 不在 0–1`);
  pr.prerequisiteGate.forEach((g) => { if (!lessonIdx.has(g)) fail(`${p.id}：先修課 ${g} 不在大綱`); });
});

let courseUsed = 0;
Object.entries(built.course.usage).forEach(([pid, uses]) => {
  const pr = built.profiles.get(pid);
  if (!pr) return; // 推薦題不在題庫是 validate_course_v2 的事
  courseUsed += 1;
  if (!pr.prerequisiteGate.length) fail(`${pid}：課程用到的題沒有 prerequisiteGate`);
  uses.forEach((u) => {
    const late = pr.prerequisiteGate.filter((g) => lessonIdx.get(g) > u.index);
    if (late.length) fail(`${pid}：在〈${u.lesson}〉當${u.kind}，先修課 ${late.join("、")} 卻排在後面`);
  });
});

const overrides = JSON.parse(fs.readFileSync(OVERRIDES_FILE, "utf8")).problems || {};
Object.entries(overrides).forEach(([id, ov]) => {
  if (!byId.has(id)) fail(`覆寫：${id} 不在題庫`);
  if (!ov.why || !String(ov.why).trim()) fail(`覆寫：${id} 沒有寫 why`);
  Object.keys(ov).forEach((k) => { if (k !== "why" && !(k in built.profiles.get(id) || {})) fail(`覆寫：${id} 的欄位 ${k} 不存在`); });
});

const fresh = encodeRuntime(problems, built);
if (JSON.stringify(fresh) !== JSON.stringify(win.BuzzProblemProfiles)) {
  fail("src/kernel/problem_profiles.js 跟現在重新產生的不一樣：跑 node tools/build_problem_profiles.js");
}
console.log(`側寫：${problems.length} 題全部有四個必要欄位；課程用到的 ${courseUsed} 題都有先修課；覆寫 ${Object.keys(overrides).length} 筆`);

/* ── 二、抽題器單元測試 ─────────────────────────────────────────── */
{
  const groups = new Map([["limits|4", new Map([["taylor_asymptotic", 60], ["squeeze", 20], ["lhopital", 20]])]]);
  const k = S.clampShares(groups, [{ topic: "limits", ranks: [4], families: ["taylor_asymptotic"], max: 0.2 }]);
  const after = groups.get("limits|4");
  const share = after.get("taylor_asymptotic") / [...after.values()].reduce((a, b) => a + b, 0);
  if (Math.abs(share - 0.2) > 1e-9) fail(`clampShares：Taylor 60% 應壓到 20%，實際 ${share}`);
  if (Math.abs(k.get("limits|4|taylor_asymptotic") - 10 / 60) > 1e-9) fail("clampShares：縮放倍率錯");

  const any = new Map([["d|6", new Map([["a", 10], ["b", 10], ["c", 1], ["d", 1]])]]);
  S.clampShares(any, [{ topic: "d", ranks: [6], any: true, max: 0.3 }]);
  const m = any.get("d|6");
  const tot = [...m.values()].reduce((a, b) => a + b, 0);
  if ([...m.values()].some((v) => v / tot > 0.3 + 1e-9)) fail(`clampShares any：還有家族超過 30%（${[...m.values()].map((v) => (v / tot).toFixed(3))}）`);
  if (Math.abs(m.get("a") - 1.5) > 1e-6) fail(`clampShares any：注水解應為 1.5，實際 ${m.get("a")}`);

  const tooFew = new Map([["d|6", new Map([["a", 5], ["b", 5]])]]);
  S.clampShares(tooFew, [{ topic: "d", ranks: [6], any: true, max: 0.3 }]);
  if (tooFew.get("d|6").get("a") !== 5) fail("clampShares any：兩個家族不可能都 ≤ 30%，應該不動");

  const zero = new Map([["limits|1", new Map([["taylor_asymptotic", 3], ["squeeze", 7]])]]);
  S.clampShares(zero, [{ topic: "limits", ranks: [1], families: ["taylor_asymptotic"], max: 0 }]);
  if (zero.get("limits|1").get("taylor_asymptotic") !== 0) fail("clampShares：上限 0% 應該壓到 0");

  const untouched = new Map([["limits|4", new Map([["taylor_asymptotic", 1], ["squeeze", 9]])]]);
  const f2 = S.clampShares(untouched, [{ topic: "limits", ranks: [4], families: ["taylor_asymptotic"], max: 0.2 }]);
  if (f2.size) fail("clampShares：沒超過上限不該動");
}

// 先修閘門：用真的題目與真的課
{
  const T = S.table();
  const order = win.BuzzProblemProfiles.lessons;
  const withGate = problems.filter((p) => (S.profileOf(p.id) || { gates: [] }).gates.length);
  // 找一題先修課很後面的題，跟一題先修課很前面的題
  const late = withGate.slice().sort((a, b) => Math.max(...S.profileOf(b.id).gates) - Math.max(...S.profileOf(a.id).gates))[0];
  const lateGate = Math.max(...S.profileOf(late.id).gates);
  const early = withGate.find((p) => Math.max(...S.profileOf(p.id).gates) < 20);
  const lesson = order[30];
  const empty = { courseV2: {} };
  const r1 = S.gate([late, early], empty, { courseLessonId: lesson });
  if (r1.includes(late) || !r1.includes(early)) fail(`先修閘門：〈${lesson}〉的練習應該擋掉 ${late.id}（先修 ${order[lateGate]}）、留下 ${early.id}`);
  const done = { courseV2: Object.fromEntries(S.profileOf(late.id).gates.map((g) => [order[g], { doneAt: "2026-10-01T00:00:00Z" }])) };
  const r2 = S.gate([late, early], done, { courseLessonId: lesson });
  if (!r2.includes(late)) fail("先修閘門：先修課都完成了就該放行");
  if (S.gate([late], empty, { courseLessonId: `boss:${"2D"}` }).length !== 1) fail("先修閘門：魔王題（boss:）不篩");
  if (S.gate([late], empty, {}).length !== 1) fail("先修閘門：一般練習不篩");
  // 新手保護期：走到第 lesson 課 → 只出先修課在那之前的
  const bridgePool = problems.filter((p) => p.rank === 1 && S.profileOf(p.id).gates.length).slice(0, 80);
  const reached = { courseV2: { [order[40]]: { openedAt: "2026-10-01T00:00:00Z" } } };
  const kept = S.gate(bridgePool, reached, { bridged: true });
  const bad = kept.filter((p) => S.profileOf(p.id).gates.some((g) => g > 40));
  if (kept.length >= 4 && bad.length) fail(`新手保護期：走到第 40 課卻出了先修課在後面的題 ${bad.map((p) => p.id).join(", ")}`);
  const nothing = S.gate(bridgePool, { courseV2: {} }, { bridged: true });
  if (nothing.length !== bridgePool.length && nothing.length < 4) fail("新手保護期：篩完不到 4 題應該維持原本的橋池");
  // 每一課的推薦題在那一課的練習裡都不會被擋（課程練習的實際入口）
  let blocked = 0;
  Object.entries(built.course.usage).forEach(([pid, uses]) => {
    const p = byId.get(pid);
    if (!p) return;
    uses.forEach((u) => { if (u.kind !== "worked" && !S.gate([p], empty, { courseLessonId: u.lesson }).length) blocked += 1; });
  });
  if (blocked) fail(`先修閘門：${blocked} 筆推薦題在自己那一課的練習裡被擋掉`);
  console.log(`先修閘門：課程練習擋後面的課、完成就放行；新手保護期照走到的課；${Object.keys(built.course.usage).length} 題推薦題在自己那一課都放行（共 ${T.rows.size} 列）`);
}

// 決定性與 focus
{
  const pool = problems.filter((p) => p.topic === "limits");
  const a = S.draw(pool, 10, { seed: 42 }).slice(0, 10).map((p) => p.id).join(",");
  const b = S.draw(pool, 10, { seed: 42 }).slice(0, 10).map((p) => p.id).join(",");
  if (a !== b) fail("draw：同一個 seed 應該抽出同一局");
  const taylorOnly = pool.filter((p) => (S.profileOf(p.id).fam[0] === "taylor_asymptotic") && p.rank === 4);
  const mix = taylorOnly.concat(pool.filter((p) => p.rank === 4 && S.profileOf(p.id).fam[0] !== "taylor_asymptotic").slice(0, 5));
  const focused = S.draw(mix, 10, { seed: 7, focus: true }).slice(0, 10);
  if (focused.filter((p) => S.profileOf(p.id).fam[0] === "taylor_asymptotic").length < 3) fail("draw focus：選了題包（focus）不該套 Taylor 上限");
}

/* ── 三、模擬 ──────────────────────────────────────────────────── */
const realNow = Date.now;
let fakeNow = 1.7e12;
const setRecords = (rec) => global.localStorage.setItem("buzzcalculus.records.v1", JSON.stringify(rec));
// 取得 selectProblemPool 篩過的整個池（同一套篩選：主題、難度上限、超綱閘門、冷門支線、只抽難題…）
function filteredPool(modeKey, topic, cap) {
  setRecords({ settings: { difficultyCap: cap } });
  // count = 題庫大小：padPool 先填不重複的題，池子比 count 小才會重複補 —— 去重之後就是整個篩過的池
  const big = { ...api.modes[modeKey], count: problems.length };
  const saved = win.BuzzSampler;
  win.BuzzSampler = undefined;
  const pool = api.selectProblemPool(big, topic);
  win.BuzzSampler = saved;
  return [...new Map(pool.map((p) => [p.id, p])).values()];
}
// 空紀錄的 adaptiveShuffle 就是亂數排序（＋家族打散＋技巧交錯）—— 模擬用便宜的洗牌代替，量的是抽題器本身
function permute(pool, seed) {
  const r = S.rng(seed);
  const a = pool.slice();
  for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function sessionStats(sessions, n) {
  const st = { draws: 0, taylorByRank: {}, limitsByRank: {}, d6: { total: 0, fam: {} }, viol: { fam: 0, nov: 0, tpl: 0, pack: 0 }, families: 0, topicFam: {} };
  const perFam = Math.ceil(n * taxonomy.SESSION.perFamilyShare);
  const perPack = Math.ceil(n * taxonomy.SESSION.perPackShare);
  sessions.forEach((sess) => {
    const fam = new Map(); const nov = new Map(); const tpl = new Map(); const pack = new Map();
    const inc = (m, k) => m.set(k, (m.get(k) || 0) + 1);
    sess.forEach((p) => {
      const pr = S.profileOf(p.id);
      const f = pr.fam[0];
      st.draws += 1;
      inc(fam, `${p.topic}|${f}`); inc(nov, pr.nov); if (pr.tpl) inc(tpl, pr.tpl); if (pr.pack) inc(pack, pr.pack);
      (st.topicFam[p.topic] = st.topicFam[p.topic] || {})[f] = ((st.topicFam[p.topic] || {})[f] || 0) + 1;
      if (p.topic === "limits") {
        st.limitsByRank[p.rank] = (st.limitsByRank[p.rank] || 0) + 1;
        if (f === "taylor_asymptotic") st.taylorByRank[p.rank] = (st.taylorByRank[p.rank] || 0) + 1;
      }
      if (p.topic === "derivatives" && p.rank === 6) { st.d6.total += 1; st.d6.fam[f] = (st.d6.fam[f] || 0) + 1; }
    });
    if ([...fam.values()].some((c) => c > perFam)) st.viol.fam += 1;
    if ([...nov.values()].some((c) => c > 1)) st.viol.nov += 1;
    if ([...tpl.values()].some((c) => c > 1)) st.viol.tpl += 1;
    if ([...pack.values()].some((c) => c > perPack)) st.viol.pack += 1;
    st.families += fam.size;
  });
  st.families /= sessions.length || 1;
  return st;
}

const CONFIGS = [
  ["quick", "all", 6], ["quick", "all", 4], ["quick", "all", 2],
  ["topic", "limits", 6], ["topic", "limits", 4], ["topic", "limits", 3],
  ["topic", "derivatives", 6], ["topic", "integrals", 6], ["topic", "series", 6],
  ["brutal", "all", 6],
  ["brutal", "derivatives", 6]
];
const t0 = realNow();
const report = [];
CONFIGS.forEach(([modeKey, topic, cap]) => {
  let pool = filteredPool(modeKey, topic, cap);
  // brutal 不是鎖主題的模式：「brutal × 微分」是給微分 R6 上限的壓力測試（R4 以上的微分池）
  if (modeKey === "brutal" && topic !== "all") pool = pool.filter((p) => p.topic === topic);
  const n = api.modes[modeKey].count;
  const before = [];
  const after = [];
  for (let s = 0; s < SESSIONS; s += 1) {
    const ordered = permute(pool, 1000 + s);
    before.push(ordered.slice(0, n));
    after.push(S.draw(ordered, n, { seed: 5000 + s }).slice(0, n));
  }
  const b = sessionStats(before, n);
  const a = sessionStats(after, n);
  report.push({ modeKey, topic, cap, n, pool: pool.length, b, a });
  const label = `${modeKey}/${topic}/上限R${cap}`;
  // 一局限制：池子夠大（這裡每一組都是）就不該放寬
  ["fam", "nov", "tpl", "pack"].forEach((k) => { if (a.viol[k]) fail(`${label}：${a.viol[k]} 局違反一局限制（${k}）`); });
  // Taylor 各 rank：抽到 ≥ 300 題極限的 rank 才判（抽樣誤差容許 2 個百分點）
  Object.entries(a.limitsByRank).forEach(([rank, total]) => {
    const cap1 = taxonomy.TAYLOR_CAPS_BY_RANK[rank];
    const share = (a.taylorByRank[rank] || 0) / total;
    if (total >= 300 && share > cap1 + 0.02) fail(`${label}：極限 R${rank} 的 Taylor 曝光 ${D.pct(share)} > ${D.pct(cap1)}`);
  });
  if (a.d6.total >= 300) {
    const sh = (f) => (a.d6.fam[f] || 0) / a.d6.total;
    const top = Math.max(...Object.values(a.d6.fam)) / a.d6.total;
    if (sh("super_high_derivative") > 0.22) fail(`${label}：微分 R6 超高階導數 ${D.pct(sh("super_high_derivative"))} > 20%`);
    if (sh("taylor_coefficient") > 0.27) fail(`${label}：微分 R6 Taylor 係數 ${D.pct(sh("taylor_coefficient"))} > 25%`);
    if (top > 0.33) fail(`${label}：微分 R6 單一家族 ${D.pct(top)} > 30%`);
  }
});
const simSeconds = ((realNow() - t0) / 1000).toFixed(1);

// 印出改之前／改之後
console.log(`\n模擬：每組 ${SESSIONS} 局（${simSeconds}s）。改之前 = 取能力模型排序的前 n 題；改之後 = 兩段式抽題`);
const row = (st, rank) => (st.limitsByRank[rank] ? `${D.pct((st.taylorByRank[rank] || 0) / st.limitsByRank[rank])}` : "—");
report.forEach(({ modeKey, topic, cap, n, pool, b, a }) => {
  const viol = (st) => `家族 ${st.viol.fam}／模板 ${st.viol.nov}／母題 ${st.viol.tpl}／題包 ${st.viol.pack}`;
  console.log(`  ${modeKey}/${topic}/上限R${cap}（池 ${pool} 題，一局 ${n}）`);
  console.log(`    一局平均家族數 ${b.families.toFixed(1)} → ${a.families.toFixed(1)}；違反一局限制的局數 ${viol(b)} → ${viol(a)}`);
  const ranks = [1, 2, 3, 4, 5, 6].filter((r) => a.limitsByRank[r] || b.limitsByRank[r]);
  if (ranks.length) console.log(`    極限 Taylor 曝光：${ranks.map((r) => `R${r} ${row(b, r)} → ${row(a, r)}（上限 ${D.pct(taxonomy.TAYLOR_CAPS_BY_RANK[r])}）`).join("、")}`);
  if (a.d6.total || b.d6.total) {
    const top = (st) => { const e = Object.entries(st.d6.fam).sort((x, y) => y[1] - x[1])[0]; return e ? `${e[0]} ${D.pct(e[1] / st.d6.total)}` : "—"; };
    const sh = (st, f) => D.pct((st.d6.fam[f] || 0) / (st.d6.total || 1));
    console.log(`    微分 R6：最大家族 ${top(b)} → ${top(a)}；超高階導數 ${sh(b, "super_high_derivative")} → ${sh(a, "super_high_derivative")}；家族數 ${Object.keys(b.d6.fam).length} → ${Object.keys(a.d6.fam).length}`);
  }
});

/* ── 能力模型的訊號還在（真的 adaptiveShuffle，不是洗牌） ─────────── */
{
  const weak = {
    history: [{ finishedAt: new Date(realNow()).toISOString(), mode: "quick", answers: Array.from({ length: 14 }, () => ({ problemId: "exam-int-005", correct: false, elapsed: 40 })) }],
    problemStats: {}, topicStats: {}, mistakes: {}
  };
  const neutral = { history: [], problemStats: {}, topicStats: {}, mistakes: {} };
  const pool = filteredPool("topic", "integrals", 6);
  const usub = (p) => (win.BuzzSkillGraph.skillsForProblem(p) || []).includes("integral.usub");
  const share = (rec) => {
    let hit = 0; let total = 0;
    for (let s = 0; s < 150; s += 1) {
      const drawn = S.draw(api.adaptiveShuffle(pool, rec, 900 + s), 10, { seed: 300 + s }).slice(0, 10);
      total += drawn.length; hit += drawn.filter(usub).length;
    }
    return hit / total;
  };
  const w = share(weak);
  const z = share(neutral);
  console.log(`\n能力模型訊號：u 代換練爛之後，積分局裡 u 代換的份額 ${D.pct(z)} → ${D.pct(w)}`);
  if (!(w >= z * 1.3)) fail(`兩段式抽題把弱技巧優先洗掉了：u 代換份額 ${D.pct(z)} → ${D.pct(w)}（要 ≥ 1.3 倍）`);
}
Date.now = realNow;
void fakeNow; void path;

if (failures.length) {
  console.error(`\n側寫／抽題器：${failures.length} 個問題`);
  failures.slice(0, 60).forEach((f) => console.error(`  - ${f}`));
  if (failures.length > 60) console.error(`  …另外 ${failures.length - 60} 個`);
  process.exit(1);
}
console.log("\nproblem profiles + sampler OK");
