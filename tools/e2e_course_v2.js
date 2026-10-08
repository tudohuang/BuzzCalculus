// 新版課程（中文介面）在手機上走一次：課程表 → 一課 → 範例逐步揭 → 展開收合的證明 →
// 小測選錯（理由出現、沒被浮層蓋住）再選對 → 開推薦題 → 結算回到這一課；英文介面還是舊的 25 課、畫面沒有中文。
//
// review 的顯示規則每一條都在這裡變成看得見的斷言：觀念預設顯示、collapsible 預設收起、範例一步一步揭、
// 錯誤選項的理由選了才出現、挑戰題另外標、閱讀／完成時間分開、三層通過不鎖課、visual 規格不給學生看。
// 圖（figures）：靜態圖畫得出曲線、widget 的滑桿真的改圖而且整頁重繪後停在原處、390 寬不溢出、亮暗兩色對比夠。
// 另外釘住交付方式：首屏不抓任何課程檔、打開課程才抓大綱、打開一課只抓那一個 Stage。
//
// 用法：node tools/e2e_course_v2.js
//       node tools/e2e_course_v2.js --screenshots   另存手機截圖到 docs/report/course-review/screens/（不進版控）

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const SHOTS = process.argv.includes("--screenshots") ? path.join(ROOT, "docs", "report", "course-review", "screens") : "";
const VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 2, mobile: true };
const RECORDS_KEY = "buzzcalculus.records.v1";

let passed = 0;
const failures = [];
function check(name, ok, detail = "") {
  if (ok) {
    passed += 1;
    console.log(`  ok   ${name}${detail ? `  —— ${detail}` : ""}`);
  } else {
    failures.push(`${name}${detail ? `（${detail}）` : ""}`);
    ciFail(name, detail);
    console.log(`  XX   ${name}${detail ? `  —— ${detail}` : ""}`);
  }
}

// 挑一課當樣本：前兩個 Stage 裡第一個「有可折疊段落、至少兩題範例、核心題與挑戰題都有、正文有〈課名〉」的課
const outlineBox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "src", "course_v2", "outline.js"), "utf8"), outlineBox);
const OUTLINE = outlineBox.window.BUZZ_COURSE_V2;
const sourceOf = (id) => {
  const file = path.join(ROOT, "tools", "content", "course_v2", "lessons", `${id}.json`);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
};
let SAMPLE = null;
OUTLINE.stages.filter((s) => s.n >= 1 && s.n <= 2).forEach((stage) => stage.chapters.forEach((chapter) => chapter.lessons.forEach((entry, k) => {
  if (SAMPLE) return;
  const lesson = sourceOf(entry.id);
  if (!lesson) return;
  const ok = lesson.concept.some((p) => p.collapsible) && lesson.workedExamples.length >= 2 && lesson.workedExamples[0].steps.length >= 3
    && lesson.practice.some((p) => p.core) && lesson.practice.some((p) => p.challenge) && /〈/.test(JSON.stringify(lesson.concept));
  if (ok) SAMPLE = { lesson, stage, chapter };
})));
// 圖：大綱順序裡第一個有靜態圖的課、第一個有 widget 的課
const figureLesson = (pred) => {
  for (const stage of OUTLINE.stages) for (const chapter of stage.chapters) for (const entry of chapter.lessons) {
    const lesson = sourceOf(entry.id);
    // 收在可折疊段落裡的圖預設看不到，不拿來當樣本
    const k = lesson ? (lesson.figures || []).findIndex((f) => pred(f) && !(lesson.concept[f.after === undefined ? 0 : f.after] || {}).collapsible) : -1;
    if (k >= 0) return { lesson, k, fig: lesson.figures[k] };
  }
  return null;
};
const STATIC_FIG = figureLesson((f) => Boolean(f.graph));
const WIDGET_FIG = figureLesson((f) => Boolean(f.widget));
const TOTAL = OUTLINE.stages.reduce((n, s) => n + s.chapters.reduce((m, c) => m + c.lessons.length, 0), 0);
const MISSING = OUTLINE.stages.reduce((n, s) => n + s.chapters.reduce((m, c) => m + c.lessons.filter((l) => typeof l.read !== "number").length, 0), 0);

const HELPERS = `
  window.__c = {
    // 收起來的 <details> 內容在 Chrome 是 content-visibility:hidden —— getBoundingClientRect 照樣量得出大小，要用 checkVisibility
    visible(el) {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0)) return false;
      return typeof el.checkVisibility === "function" ? el.checkVisibility({ visibilityProperty: true, contentVisibilityAuto: true }) : getComputedStyle(el).visibility !== "hidden";
    },
    click(selector) {
      const el = [...document.querySelectorAll(selector)].find((n) => window.__c.visible(n));
      if (el) { el.scrollIntoView({ block: "center" }); el.click(); }
      return Boolean(el);
    },
    text(selector) {
      const el = document.querySelector(selector);
      return el ? (el.innerText || el.textContent || "").replace(/\\s+/g, " ").trim() : "";
    },
    // 看得到、而且沒有被別的東西蓋住（手機底部分頁列、浮條）
    unobstructed(el) {
      if (!window.__c.visible(el)) return false;
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) return false;
      const hit = document.elementFromPoint(r.left + Math.min(20, r.width / 2), r.top + Math.min(10, r.height / 2));
      return Boolean(hit && (hit === el || el.contains(hit)));
    },
    overflow() { const d = document.documentElement; return d.scrollWidth - d.clientWidth; },
    smallTargets() {
      return [...document.querySelectorAll("#app button, #app [data-action], #app summary")]
        .filter((n) => window.__c.visible(n) && !n.closest("[hidden]"))
        .map((n) => { const r = n.getBoundingClientRect(); return { side: Math.round(Math.min(r.width, r.height)), label: (n.textContent || "").trim().slice(0, 14) }; })
        .filter((x) => x.side < 40);
    },
    courseFiles() { return performance.getEntriesByType("resource").map((e) => e.name).filter((n) => /course_v2/.test(n)).map((n) => n.replace(/^.*\\/src\\//, "")); }
  };
`;

async function run() {
  console.log("E2E 新版課程（手機 390×844）");
  if (!SAMPLE) throw new Error("找不到符合條件的樣本課（大綱或課文變了？）");
  const { lesson } = SAMPLE;
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const evaluate = (code) => chrome.evaluate(`${HELPERS}\n${code}`);
  const sleep = (ms) => chrome.sleep(ms);
  const click = async (selector, wait = 400) => {
    const hit = await evaluate(`return window.__c.click(${JSON.stringify(selector)});`);
    await sleep(wait);
    return hit;
  };
  const waitFor = async (expr, ms = 8000) => {
    for (const deadline = Date.now() + ms; Date.now() < deadline; await sleep(120)) {
      if (await evaluate(`return Boolean(${expr});`)) return true;
    }
    return false;
  };
  const shot = async (name) => {
    if (!SHOTS) return;
    fs.mkdirSync(SHOTS, { recursive: true });
    const { data } = await chrome.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(SHOTS, `${name}.png`), Buffer.from(data, "base64"));
  };
  const records = () => evaluate(`return JSON.parse(localStorage.getItem("${RECORDS_KEY}") || "{}");`);

  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", VIEWPORT);
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });

    /* ── 1. 首屏不抓課程；「我還沒學過」直接進課程表 ── */
    await chrome.navigate(`${server.url}/index.html`);
    // 舊版課程的進度（舊 id）先種進去：新版不能因此壞掉，也不能把它刪掉
    await evaluate(`localStorage.clear(); localStorage.setItem("${RECORDS_KEY}", JSON.stringify({ course: { "fn-what-is-a-function": { openedAt: "2026-09-20T00:00:00.000Z", checksPassed: true, doneAt: "2026-09-20T00:00:00.000Z" } } })); return 1;`);
    await chrome.navigate(`${server.url}/index.html`);
    await sleep(500);
    const boot = await evaluate(`return { files: window.__c.courseFiles(), outline: Boolean(window.BUZZ_COURSE_V2) };`);
    check("首屏沒有抓任何新版課程的檔", !boot.files.length && !boot.outline, boot.files.join(","));
    check("onboarding 有「我還沒學過微積分」", await click('[data-action="set-onboarding-context"][data-context="newbie"]', 300));
    check("進到新版課程表", await waitFor('document.querySelector(".cv2-index .cv2-stage")'));
    await sleep(300);
    const index = await evaluate(`return {
      h2: window.__c.text(".cv2-index h2"),
      stages: document.querySelectorAll(".cv2-stage").length,
      open: [...document.querySelectorAll(".cv2-stage")].filter((d) => d.open).map((d) => d.dataset.keep),
      branch: document.querySelectorAll(".cv2-stage .cv2-branch").length,
      rows: [...document.querySelectorAll(".cv2-row")].filter((n) => window.__c.visible(n)).length,
      soon: document.querySelectorAll(".cv2-row.is-soon").length,
      primary: window.__c.text('.cv2-index .page-head [data-action="open-course-lesson"]'),
      grad: Boolean(document.querySelector('.course-graduation [data-action="course-graduation"]')),
      files: window.__c.courseFiles(),
      overflow: window.__c.overflow(),
      small: window.__c.smallTargets()
    };`);
    check(`課程表：13 個 Stage、${TOTAL} 課都列著`, index.stages === OUTLINE.stages.length && index.h2.includes(`${TOTAL} 課`), `${index.stages} 個 Stage · ${index.h2}`);
    check("手機上掃得完：只有目前的 Stage 展開、其他收著", index.open.length === 1 && index.open[0] === "cv2-stage-0" && index.rows > 0 && index.rows < 40, `${index.open.join(",")} · 看得到 ${index.rows} 列`);
    check("Stage 11、12 標成支線", index.branch === 2, String(index.branch));
    check("還沒寫的課顯示「尚未開放」，數量對得上大綱", index.soon === MISSING, `${index.soon} / ${MISSING}`);
    check("主按鈕指向第一課 0.1", /^開始：0\.1 /.test(index.primary), index.primary);
    check("畢業關不鎖", index.grad);
    check("打開課程表只抓大綱與畫面，還沒抓任何 Stage 的課文", index.files.includes("course_v2/outline.js") && !index.files.some((f) => /stage-/.test(f)), index.files.join(","));
    check("課程表沒有橫向溢出", index.overflow <= 1, `${index.overflow}px`);
    check("課程表的觸控目標都 ≥ 40px", !index.small.length, JSON.stringify(index.small.slice(0, 4)));
    await shot("01-index");

    /* ── 2. 從課程表點進樣本課（展開它的 Stage 與章）── */
    const stageKey = `cv2-stage-${SAMPLE.stage.n}`;
    await click(`details[data-keep="${stageKey}"] > summary`, 300);
    await click(`details[data-keep="cv2-ch-${SAMPLE.chapter.code}"] > summary`, 300);
    check(`點得到 ${lesson.id}（${lesson.title}）`, await click(`.cv2-row[data-lesson-id="${lesson.id}"]`, 300));
    check("課文載進來", await waitFor('document.querySelector(".cv2-lesson [data-course-concept]")'));
    await sleep(300);
    const page = await evaluate(`
      const meta = window.__c.text(".cv2-lesson .cv2-meta");
      const folds = [...document.querySelectorAll(".cv2-fold")];
      return {
        title: window.__c.text(".cv2-lesson h2"),
        label: window.__c.text(".cv2-lesson .page-head .section-label"),
        meta,
        conceptParas: [...document.querySelectorAll("[data-course-concept] > .cv2-part p")].filter((n) => window.__c.visible(n)).length,
        folds: folds.length,
        foldsClosed: folds.every((d) => !d.open && ![...d.querySelectorAll(".cv2-part p")].some((p) => window.__c.visible(p))),
        steps: document.querySelectorAll("[data-course-worked] .course-step").length,
        examples: document.querySelectorAll(".cv2-example").length,
        why: document.querySelectorAll(".course-check-why").length,
        options: document.querySelectorAll(".course-option").length,
        pitfalls: document.querySelectorAll("[data-course-pitfalls] li").length,
        challengeHead: [...document.querySelectorAll("[data-course-practice] .section-label")].some((n) => /挑戰/.test(n.textContent)),
        core: document.querySelectorAll("[data-course-practice] .cv2-mark.is-core").length,
        links: document.querySelectorAll('.cv2-lesson .cv2-link[data-action="open-course-lesson"]').length,
        bodyText: document.querySelector(".cv2-lesson").innerText,
        files: window.__c.courseFiles()
      };`);
    const n = `${SAMPLE.stage.n}.${SAMPLE.stage.chapters.flatMap((c) => c.lessons).findIndex((l) => l.id === lesson.id) + 1}`;
    check("標題與課號（照大綱順序算）", page.title === lesson.title && page.label.startsWith(`${n} ·`), `${page.label} · ${page.title}`);
    check("閱讀時間與完成時間分開寫", page.meta.includes(`閱讀 ${lesson.readMinutes} 分`) && page.meta.includes(`完成 ${lesson.totalMinutes} 分`), page.meta);
    check("觀念預設顯示", page.conceptParas >= 2, `${page.conceptParas} 段`);
    check("可折疊段落（定理條件／證明／預告）預設收起", page.folds === lesson.concept.filter((p) => p.collapsible).length && page.foldsClosed, `${page.folds} 段`);
    check("範例的步驟先藏著", page.examples === lesson.workedExamples.length && page.steps === 0, `${page.examples} 題範例、${page.steps} 步`);
    check("常見錯誤是清單", page.pitfalls === lesson.pitfalls.length, String(page.pitfalls));
    check("小測：選之前沒有任何理由", page.options >= 9 && page.why === 0, `${page.options} 個選項、${page.why} 個理由`);
    check("推薦題：核心題有 ★、挑戰題另外一區", page.core === lesson.practice.filter((p) => p.core).length && page.challengeHead, `★ ${page.core}`);
    check("正文的〈課名〉是連到那一課的連結", page.links >= 1, String(page.links));
    check("visual（動態圖規格）不給學生看", !lesson.visual || !page.bodyText.includes(String(lesson.visual).slice(0, 18)));
    check(`只抓了這一課的 Stage（stage-${SAMPLE.stage.n}.js）`, page.files.filter((f) => /stage-/.test(f)).join(",") === `course_v2/stage-${SAMPLE.stage.n}.js`, page.files.join(","));
    await shot("02-lesson-top");

    /* ── 3. 範例一步一步揭 ── */
    await click('[data-action="course-step"][data-ex="0"]', 350);
    await click('[data-action="course-step"][data-ex="0"]', 350);
    const reveal = await evaluate(`
      const ex = document.querySelector('.cv2-example[data-course-example="0"]');
      const steps = ex.querySelectorAll(".course-step");
      return { shown: steps.length, other: document.querySelectorAll('.cv2-example[data-course-example="1"] .course-step').length,
        counter: window.__c.text('[data-action="course-step"][data-ex="0"] small'), last: steps.length ? window.__c.unobstructed(steps[steps.length - 1]) : false };`);
    check("範例 1 揭了兩步、範例 2 不受影響", reveal.shown === 2 && reveal.other === 0, `${reveal.shown} 步 · ${reveal.counter}`);
    check("新揭的那一步在畫面上、沒被蓋住", reveal.last);
    await evaluate(`document.querySelector('.cv2-example[data-course-example="0"]').scrollIntoView({ block: "start" }); window.scrollBy(0, -60); return 1;`);
    await sleep(150);
    await shot("03-example-mid-reveal");
    for (let i = 2; i < lesson.workedExamples[0].steps.length; i += 1) await click('[data-action="course-step"][data-ex="0"]', 250);
    const answer = await evaluate(`return window.__c.text('.cv2-example[data-course-example="0"] .course-answer');`);
    check("揭完出現答案", answer.includes(lesson.workedExamples[0].answer.slice(0, 6)), answer);

    /* ── 4. 展開收合的證明 ── */
    const foldIndex = lesson.concept.findIndex((p) => p.collapsible);
    const foldKey = `cv2-${lesson.id}-${foldIndex}`;
    await click(`details[data-keep="${foldKey}"] > summary`, 300);
    const fold = await evaluate(`
      const d = document.querySelector('details[data-keep="${foldKey}"]');
      return { open: d.open, visible: [...d.querySelectorAll(".cv2-part p")].some((p) => window.__c.visible(p)), overflow: window.__c.overflow() };`);
    check("點標題展開可折疊段落", fold.open && fold.visible);
    check("展開後沒有橫向溢出", fold.overflow <= 1, `${fold.overflow}px`);
    await evaluate(`document.querySelector('details[data-keep="${foldKey}"]').scrollIntoView({ block: "start" }); window.scrollBy(0, -60); return 1;`);
    await sleep(150);
    await shot("04-proof-expanded");

    /* ── 5. 小測：選錯 → 理由出現（看得到、沒被蓋）；選對 → 綠；全部作答 → 完成 ── */
    const c0 = lesson.checks[0];
    const wrong = c0.options.findIndex((o) => !o.correct);
    const right = c0.options.findIndex((o) => o.correct);
    const otherWrong = c0.options.findIndex((o, i) => !o.correct && i !== wrong);
    await click(`[data-action="course-pick"][data-check="0"][data-option="${wrong}"]`, 400);
    const wrongPick = await evaluate(`
      const box = document.querySelectorAll("[data-course-checks] .course-check")[0];
      const why = box.querySelector(".course-check-why");
      return { wrong: box.classList.contains("is-wrong"), why: why ? why.innerText : "", seen: window.__c.unobstructed(why),
        other: ${otherWrong >= 0 ? `box.innerText.includes(${JSON.stringify(String((c0.options[otherWrong] || {}).why || "").slice(0, 12))})` : "false"},
        foldStillOpen: document.querySelector('details[data-keep="${foldKey}"]').open };`);
    check("選錯：標紅、出現這個選項的理由", wrongPick.wrong && wrongPick.why.includes(String(c0.options[wrong].why).slice(0, 10)), wrongPick.why.slice(0, 40));
    check("理由在畫面上、沒被底部分頁列或浮條蓋住", wrongPick.seen);
    check("沒選的錯誤選項，理由不出現", !wrongPick.other);
    check("重繪之後展開過的段落還開著", wrongPick.foldStillOpen);
    await evaluate(`document.querySelectorAll("[data-course-checks] .course-check")[0].scrollIntoView({ block: "start" }); window.scrollBy(0, -70); return 1;`);
    await sleep(150);
    await shot("05-quiz-wrong-why");
    await click(`[data-action="course-pick"][data-check="0"][data-option="${right}"]`, 400);
    check("再選對：綠、選項鎖住", await evaluate(`const box = document.querySelectorAll("[data-course-checks] .course-check")[0]; return box.classList.contains("is-right") && [...box.querySelectorAll(".course-option")].every((b) => b.disabled);`));
    for (let ci = 1; ci < lesson.checks.length; ci += 1) {
      await click(`[data-action="course-pick"][data-check="${ci}"][data-option="${lesson.checks[ci].options.findIndex((o) => o.correct)}"]`, 300);
    }
    const quiz = await evaluate(`return { result: window.__c.text("[data-course-quiz-result]"), tier: window.__c.text(".cv2-lesson .cv2-meta .cv2-tier"), seen: window.__c.unobstructed(document.querySelector("[data-course-quiz-result]")) };`);
    const expect = lesson.checks.length - 1;
    check(`第一次選錯的那題不算分：${expect} / ${lesson.checks.length}、算完成`, quiz.result.startsWith(`${expect} / ${lesson.checks.length}`) && /完成/.test(quiz.result), quiz.result);
    check("小測結果在畫面上", quiz.seen);
    check("標題旁出現「完成」", quiz.tier === "完成", quiz.tier);
    const saved = (await records()).courseV2 || {};
    check("進度存在 records.courseV2（穩定 id）", Boolean(saved[lesson.id] && saved[lesson.id].doneAt && saved[lesson.id].quizBest === expect), JSON.stringify(saved[lesson.id] || {}));
    await evaluate(`document.querySelector("[data-course-quiz-result]").scrollIntoView({ block: "start" }); window.scrollBy(0, -90); return 1;`);
    await sleep(150);
    await shot("06-quiz-result-and-practice");
    const lessonSmall = await evaluate(`return { small: window.__c.smallTargets(), overflow: window.__c.overflow() };`);
    check("單課頁的觸控目標都 ≥ 40px", !lessonSmall.small.length, JSON.stringify(lessonSmall.small.slice(0, 4)));
    check("單課頁沒有橫向溢出", lessonSmall.overflow <= 1, `${lessonSmall.overflow}px`);

    /* ── 6. 推薦題：從這一課的題號開一局，結算回得來 ── */
    const mainIds = lesson.practice.filter((p) => !p.challenge).map((p) => p.id);
    check("按「練推薦題」開一局", await click('[data-action="course-practice"][data-set="main"]', 900));
    check("進到作答畫面", await waitFor('document.querySelector("[data-action=choose-answer], .prompt[data-tex]")'));
    const first = await evaluate(`
      const tex = (document.querySelector(".prompt[data-tex]") || {}).dataset?.tex || "";
      const p = (window.BUZZ_PROBLEMS || []).find((x) => x.prompt === tex);
      return { id: p ? p.id : "", timer: Boolean(document.querySelector(".hud-timer:not([hidden])")) };`);
    check("第一題就是這一課的推薦題", mainIds.includes(first.id), first.id);
    let sawLink = false;
    let finished = false;
    for (let i = 0; i < mainIds.length + 2 && !finished; i += 1) {
      if (await evaluate(`return Boolean(document.querySelector(".verdict, .results"));`)) { finished = true; break; }
      // 選一個選項（不賭對錯）；答錯才有「下一題」，答對 950ms 自動前進
      if (!(await click('[data-action="choose-answer"]', 1100))) {
        await evaluate(`const b = document.querySelector('[data-action="skip-question"], [data-action="give-up"]'); if (b) b.click(); return 1;`);
        await sleep(800);
      }
      if (await evaluate(`return Boolean(document.querySelector('.feedback-course [data-action="open-course-lesson"]'));`)) sawLink = true;
      await click('[data-action="next-question"]', 600);
    }
    finished = await waitFor('document.querySelector(".verdict")', 6000);
    check("一局做完到結算", finished);
    const results = await evaluate(`return { back: window.__c.text('[data-action="open-course-lesson"][data-lesson-id="${lesson.id}"]') };`);
    check(`結算有「回到 ${n} ${lesson.title}」`, results.back.includes(`回到 ${n}`), results.back);
    if (sawLink) check("答錯的回饋說這題是哪一課教的", true);
    const practiced = ((await records()).courseV2 || {})[lesson.id] || {};
    check("練過的時間記回這一課", Boolean(practiced.practicedAt));
    await click(`[data-action="open-course-lesson"][data-lesson-id="${lesson.id}"]`, 500);
    check("回到這一課", await waitFor(`document.querySelector(".cv2-lesson h2") && document.querySelector(".cv2-lesson h2").textContent === ${JSON.stringify(lesson.title)}`));

    /* ── 7. 首頁主卡是「上下一課」；舊課的進度沒被動 ── */
    await click('[data-action="home"]', 600);
    const home = await evaluate(`return window.__c.text(".course-home-card h2");`);
    check("新手首頁主卡是上課（下一課是 0.1）", /^上 0\.1 /.test(home), home);
    const old = (await records()).course || {};
    check("舊版課程的紀錄還在（不刪、不轉）", Boolean(old["fn-what-is-a-function"] && old["fn-what-is-a-function"].doneAt));

    /* ── 7½. 圖：靜態圖畫得出曲線；widget 的滑桿真的改圖；390 寬不溢出；深色模式看得清楚 ── */
    check("有可以測的靜態圖與 widget", Boolean(STATIC_FIG && WIDGET_FIG), `${STATIC_FIG ? STATIC_FIG.lesson.id : "—"} · ${WIDGET_FIG ? WIDGET_FIG.lesson.id : "—"}`);
    const openLesson = async (lesson) => {
      await evaluate(`const b = document.createElement("button"); b.dataset.action = "open-course-lesson"; b.dataset.lessonId = ${JSON.stringify(lesson.id)}; document.querySelector("#app").appendChild(b); b.click(); return 1;`);
      return waitFor(`document.querySelector(".cv2-lesson h2") && document.querySelector(".cv2-lesson h2").textContent === ${JSON.stringify(lesson.title)} && document.querySelector(".cv2-figure")`);
    };
    const FIG_PROBE = `
      const lum = (c) => {
        const nums = (c.match(/[\\d.]+/g) || []).map(Number);
        const rgb = /^color\\(/.test(c) ? nums.slice(0, 3).map((v) => v * 255) : nums.slice(0, 3);
        const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return Math.round(((x + 0.05) / (y + 0.05)) * 10) / 10; };
      const bgOf = (el) => { for (let n = el; n; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; if (c && !/rgba\\(0, 0, 0, 0\\)|transparent/.test(c)) return c; } return "rgb(255, 255, 255)"; };
      const probe = (fig) => {
        const svg = fig.querySelector("svg");
        const r = svg.getBoundingClientRect();
        const curves = [...svg.querySelectorAll('path[fill="none"]')].filter((p) => { const b = p.getBoundingClientRect(); return b.width > 40 || b.height > 40; });
        const main = curves.find((p) => Number(p.getAttribute("stroke-width")) >= 2) || curves[0];
        const readout = fig.querySelector("[data-cv2-readout]");
        const slider = fig.querySelector("input[type=range]");
        const sr = slider ? slider.getBoundingClientRect() : null;
        return {
          visible: window.__c.visible(svg), left: r.left, right: r.right, vw: document.documentElement.clientWidth, overflow: window.__c.overflow(),
          curves: curves.length, d: [...svg.querySelectorAll("path")].map((p) => p.getAttribute("d")).join("|"),
          caption: fig.querySelector("figcaption").innerText,
          readout: readout ? readout.innerText : "", slider: sr ? { h: sr.height, value: slider.value, min: slider.min, max: slider.max } : null,
          curveContrast: main ? contrast(getComputedStyle(main).stroke, bgOf(svg)) : 0,
          textContrast: readout ? contrast(getComputedStyle(readout).color, bgOf(readout)) : contrast(getComputedStyle(fig.querySelector("figcaption")).color, bgOf(fig))
        };
      };`;
    if (STATIC_FIG && WIDGET_FIG) {
      check(`打開有靜態圖的課（${STATIC_FIG.lesson.id}）`, await openLesson(STATIC_FIG.lesson));
      const stat = await evaluate(`${FIG_PROBE} const fig = document.querySelector('[data-cv2-fig="${STATIC_FIG.k}"]'); fig.scrollIntoView({ block: "center" }); return probe(fig);`);
      check("靜態圖：SVG 看得到、裡面有一條看得見的曲線", stat.visible && stat.curves >= 1, `${stat.curves} 條`);
      check("靜態圖下面有說明", stat.caption === STATIC_FIG.fig.caption, stat.caption);
      check("靜態圖在 390 寬裡、沒有橫向溢出", stat.left >= 0 && stat.right <= stat.vw + 0.5 && stat.overflow <= 1, `${Math.round(stat.left)}–${Math.round(stat.right)} / ${stat.vw} · 溢出 ${stat.overflow}px`);
      await shot("07-figure-static");

      check(`打開有 widget 的課（${WIDGET_FIG.lesson.id}，${WIDGET_FIG.fig.widget.type}）`, await openLesson(WIDGET_FIG.lesson));
      const sel = `[data-cv2-fig="${WIDGET_FIG.k}"]`;
      const before = await evaluate(`${FIG_PROBE} const fig = document.querySelector('${sel}'); fig.scrollIntoView({ block: "center" }); return probe(fig);`);
      check("widget 不動滑桿也是一張圖：有曲線、有讀數", before.visible && before.curves >= 1 && before.readout.length > 0, before.readout);
      check("滑桿的觸控高度 ≥ 40px", before.slider && before.slider.h >= 40, before.slider ? `${before.slider.h}px` : "沒有滑桿");
      const target = Number(before.slider.min) + 0.8 * (Number(before.slider.max) - Number(before.slider.min));
      await evaluate(`const s = document.querySelector('${sel} input[type=range]'); s.value = ${JSON.stringify(String(target))}; s.dispatchEvent(new Event("input", { bubbles: true })); return 1;`);
      await sleep(200);
      const after = await evaluate(`${FIG_PROBE} return probe(document.querySelector('${sel}'));`);
      check("拖滑桿：圖跟著變（path 不一樣）、讀數跟著變", after.d !== before.d && after.readout !== before.readout, `${before.readout} → ${after.readout}`);
      check("拖過之後沒有橫向溢出", after.overflow <= 1 && after.right <= after.vw + 0.5, `${after.overflow}px`);
      await shot("08-figure-widget");
      // 別的動作會整頁重繪（揭範例的一步）：圖要停在拖過的位置
      await click('[data-action="course-step"][data-ex="0"]', 400);
      const kept = await evaluate(`${FIG_PROBE} return probe(document.querySelector('${sel}'));`);
      check("整頁重繪之後，圖停在拖過的位置", kept.slider && kept.slider.value === after.slider.value && kept.readout === after.readout, kept.readout);
      check("亮色：曲線對底色對比 ≥ 3、讀數文字 ≥ 4.5", after.curveContrast >= 3 && after.textContrast >= 4.5, `曲線 ${after.curveContrast} · 文字 ${after.textContrast}`);
      const theme = await evaluate(`const t = document.documentElement.dataset.theme || ""; document.documentElement.dataset.theme = "dark"; return t;`);
      await sleep(200);
      const dark = await evaluate(`${FIG_PROBE} return probe(document.querySelector('${sel}'));`);
      check("深色：曲線對底色對比 ≥ 3、讀數文字 ≥ 4.5", dark.curveContrast >= 3 && dark.textContrast >= 4.5, `曲線 ${dark.curveContrast} · 文字 ${dark.textContrast}`);
      await shot("09-figure-widget-dark");
      await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(theme)}; return 1;`);
    }

    const errors = chrome.pageErrors.slice();
    check("沒有頁面錯誤", !errors.length, errors.slice(0, 2).join(" | "));
    check("沒有 404", !server.missing.length, server.missing.join(","));

    /* ── 8. 英文介面：還是舊的 25 課，畫面沒有中文，不抓新版課程 ── */
    await evaluate(`const r = JSON.parse(localStorage.getItem("${RECORDS_KEY}") || "{}"); r.settings = { ...(r.settings || {}), lang: "en" }; localStorage.setItem("${RECORDS_KEY}", JSON.stringify(r)); return 1;`);
    await chrome.navigate(`${server.url}/index.html`);
    await sleep(800);
    await evaluate(`let el = [...document.querySelectorAll('[data-action="open-course"]')].find((n) => n.getClientRects().length); if (!el) { el = document.createElement("button"); el.dataset.action = "open-course"; document.querySelector("#app").appendChild(el); } el.click(); return 1;`);
    check("英文：課程表是舊的 25 課", await waitFor('document.querySelectorAll(".course-card").length >= 16'));
    const en = await evaluate(`return { v2: Boolean(document.querySelector(".cv2-index")) || Boolean(window.BUZZ_COURSE_V2), files: window.__c.courseFiles(), cjk: (document.querySelector("#app").innerText.match(/[\\u4e00-\\u9fff]+/g) || []).slice(0, 5) };`);
    check("英文：沒有載新版課程", !en.v2 && !en.files.length, en.files.join(","));
    check("英文：課程表沒有中文", !en.cjk.length, en.cjk.join(" "));
  } finally {
    await chrome.close();
    await server.stop();
  }

  console.log(`\n${passed} passed, ${failures.length} failed`);
  if (SHOTS) console.log(`截圖：${SHOTS}`);
  if (failures.length) {
    failures.forEach((line) => console.log(`  XX ${line}`));
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(error);
  ciFail("e2e_course_v2 crashed", error.message);
  process.exit(1);
});
