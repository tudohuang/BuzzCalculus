// 新版課程：把 tools/content/course_v2/（OUTLINE.md ＋ lessons/*.json）打包成網站讀的檔。
//
// 產物（都是延後載入，不在首屏）：
//   src/course_v2/outline.js     大綱：13 個 Stage → 章 → 課（id、課名、閱讀／完成分鐘、推薦題號）。
//                                課程表、首頁主卡、「這題是哪一課教的」只需要這一支。
//   src/course_v2/ch-<章>.js     該章每一課的內文（觀念、範例、常見錯誤、小測、推薦題、圖、分節與旁白的起訖）。
//                                打開某一課時才抓那一章。按章不按 Stage：分節推到全部的課之後，最大的 Stage 會超過 600KB，
//                                最大的一章約 100KB（validate_performance_budget 管最大的那一章）。
//   src/course_v2/map.js         課程地圖的版面（每一課、章、Stage 的座標與三層的邊；tools/lib/course_map_layout.js 算的）。
//                                執行時不排版，打開地圖才抓（index.html 的 data-lazy="map"）。
//
// 課號不存：畫面照大綱順序算（Stage 編號 ＋ 在 Stage 裡的第幾課）。資料之間一律用穩定 id。
// 大綱有、但 lessons/ 還沒有檔的課照樣列進大綱（沒有分鐘數），畫面顯示「尚未開放」。
// 不給學生看的欄位不出貨：visual（給作者的動態圖文字規格；真正上畫面的是 figures）、claim／claimNote（驗算用）、gaps（題庫缺口）、
// skillTags 與推薦題的 trains（內部標籤，不露在畫面上）。
//
// 用法：node tools/build_course_v2.js           重產
//       node tools/build_course_v2.js --check   產物跟來源不同步就 exit 1（regen_all --check 也會抓）
"use strict";

const fs = require("fs");
const path = require("path");
const { layoutCourseMap } = require("./lib/course_map_layout.js");

const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "tools", "content", "course_v2");
const OUT = path.join(ROOT, "src", "course_v2");
const checkMode = process.argv.includes("--check");

// ── 大綱 ──
const stages = [];
let stage = null;
let chapter = null;
for (const line of fs.readFileSync(path.join(SOURCE, "OUTLINE.md"), "utf8").split(/\r?\n/)) {
  let m;
  if ((m = /^## Stage (\d+)\s+(.*)$/.exec(line))) {
    const full = m[2].trim();
    stage = {
      n: Number(m[1]),
      // 「極限與連續（Limits & Continuity）」→ 畫面只用中文那半；英文介面不載新版課程
      title: full.replace(/（.*$/, "").trim(),
      branch: /支線/.test(full),
      chapters: []
    };
    stages.push(stage);
    chapter = null;
    continue;
  }
  if ((m = /^### (\S+)\s+(.*)$/.exec(line))) {
    if (!stage) throw new Error(`OUTLINE.md：章「${line}」不在任何 Stage 底下`);
    chapter = { code: m[1], title: m[2].trim(), lessons: [] };
    stage.chapters.push(chapter);
    continue;
  }
  if ((m = /^- ([\d.]+) \| ([a-z0-9-]+) \| ([^|]+?) \|/.exec(line))) {
    if (!chapter) throw new Error(`OUTLINE.md：課「${m[2]}」不在任何章底下`);
    chapter.lessons.push({ id: m[2], title: m[3].trim() });
  }
}
const outlineIds = stages.flatMap((s) => s.chapters.flatMap((c) => c.lessons.map((l) => l.id)));
if (new Set(outlineIds).size !== outlineIds.length) throw new Error("OUTLINE.md 有重複的 id");

// ── 課文 ──
const lessonDir = path.join(SOURCE, "lessons");
const files = fs.readdirSync(lessonDir).filter((name) => name.endsWith(".json"));
const lessons = {};
files.forEach((name) => {
  const lesson = JSON.parse(fs.readFileSync(path.join(lessonDir, name), "utf8"));
  if (!outlineIds.includes(lesson.id)) throw new Error(`${name} 的 id「${lesson.id}」不在 OUTLINE.md`);
  lessons[lesson.id] = lesson;
});

// 旁白錄音的索引（tools/build_narration.js 產生；一課一支 mp3，檔案本身在 Release）
const { voiceOf, readIndex: readNarration } = require("./build_narration.js");
const narration = readNarration();
// 錄音從哪裡播：media/manifest.json 裡放旁白的那個 Release 標了 stream: true → 直接從 GitHub Release 的下載網址串流
// （部署不帶旁白）；沒標 → 部署時 fetch_media.js 抓進同網域的 /media/narration/。檔名都是 <課>-<f>.mp3。
const MANIFEST = path.join(ROOT, "media", "manifest.json");
const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
const narrationAsset = (manifest.assets || []).find((a) => /^narration\//.test(a.name));
const narrationTag = narrationAsset ? narrationAsset.tag || manifest.tag : "";
const narrationBase = narrationTag && ((manifest.releases || {})[narrationTag] || {}).stream
  ? `https://github.com/${manifest.repo}/releases/download/${narrationTag}/narration.`
  : "media/narration/";
// 章 → 檔名：章碼小寫、非英數換成 -（9A.1 → ch-9a-1.js）。src/course_v2_ui.js 的 chapterFile 是同一條規則
const chapterFile = (code) => `ch-${String(code).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.js`;

const nonEmpty = (list) => (Array.isArray(list) ? list.filter((item) => item !== null && item !== undefined && item !== "") : []);

// 出貨的單課：只留畫面要用的欄位
function shipLesson(lesson) {
  return {
    id: lesson.id,
    prerequisites: nonEmpty(lesson.prerequisites),
    next: nonEmpty(lesson.next),
    related: nonEmpty(lesson.related),
    objectives: nonEmpty(lesson.objectives),
    concept: (lesson.concept || []).map((part) => ({
      heading: part.heading || "",
      body: nonEmpty(part.body),
      ...(nonEmpty(part.tex).length ? { tex: nonEmpty(part.tex) } : {}),
      ...(part.collapsible ? { collapsible: true } : {})
    })),
    workedExamples: (lesson.workedExamples || []).map((ex) => ({
      title: ex.title || "",
      prompt: ex.prompt || "",
      ...(ex.problemId ? { problemId: ex.problemId } : {}),
      steps: nonEmpty(ex.steps),
      answer: ex.answer || "",
      ...(ex.note ? { note: ex.note } : {})
    })),
    pitfalls: nonEmpty(lesson.pitfalls),
    // 圖：原樣出貨（規格見 SCHEMA.md；畫法在 course_v2_ui.js 的 BuzzCourseFigures）
    ...(Array.isArray(lesson.figures) && lesson.figures.length ? { figures: lesson.figures } : {}),
    // 影片：只出貨短名與顯示要用的欄位；網址（主題、解析度）在畫面那邊組
    ...(lesson.video ? { video: { id: lesson.video.id, after: lesson.video.after === undefined ? 0 : lesson.video.after, duration: lesson.video.duration, caption: lesson.video.caption } } : {}),
    // 分節：原樣出貨（規格見 SCHEMA.md；畫面在 src/course_sections.js，有分節的課才抓）。
    // 有旁白錄音的課多帶 voice（這一課那一支 mp3 檔名裡的 f8），句子多帶 t（在那一支裡的 [起, 訖] 毫秒）；
    // 字改過、還沒重錄的句子不帶 t（播放時那一句只停一下）
    ...(Array.isArray(lesson.sections) && lesson.sections.length ? (() => {
      const voice = voiceOf(narration, lesson);
      return {
        ...(voice ? { voice: voice.f } : {}),
        sections: lesson.sections.map((sec, si) => ({
          ...sec,
          beats: sec.beats.map((b, bi) => (voice && voice.beats[`${si}-${bi}`] ? { ...b, t: voice.beats[`${si}-${bi}`] } : b))
        }))
      };
    })() : {}),
    checks: (lesson.checks || []).map((check) => ({
      ask: check.ask,
      options: check.options.map((option) => (option.correct ? { label: option.label, correct: true } : { label: option.label, why: option.why || "" }))
    })),
    practice: (lesson.practice || []).map((item) => ({
      id: item.id,
      ...(item.core ? { core: true } : {}),
      ...(item.challenge ? { challenge: true } : {}),
      ...(item.note ? { note: item.note } : {})
    }))
  };
}

// 大綱裡每一課：寫好的課帶分鐘數與推薦題（課程表算進度、回饋找「哪一課教的」都要）
const outline = {
  // 旁白錄音的網址前綴：播放器抓 <前綴><課>-<voice>.mp3
  narration: narrationBase,
  stages: stages.map((s) => ({
    n: s.n,
    title: s.title,
    ...(s.branch ? { branch: true } : {}),
    chapters: s.chapters.map((c) => ({
      code: c.code,
      title: c.title,
      lessons: c.lessons.map((l) => {
        const lesson = lessons[l.id];
        if (!lesson) return { id: l.id, title: l.title };
        return {
          id: l.id,
          title: l.title,
          read: lesson.readMinutes,
          total: lesson.totalMinutes,
          // 推薦題壓成一個字串（大綱每個課程頁都要抓，越小越好）：空白分隔，核心題尾巴 *、挑戰題尾巴 !
          practice: (lesson.practice || []).map((p) => p.id + (p.core ? "*" : p.challenge ? "!" : "")).join(" "),
          worked: (lesson.workedExamples || []).map((ex) => ex.problemId).filter(Boolean).join(" ")
        };
      })
    }))
  }))
};

const HEADER = "// 產生檔：node tools/build_course_v2.js（來源 tools/content/course_v2/）。不要手改。\n";
const outputs = {
  "outline.js": `${HEADER}window.BUZZ_COURSE_V2 = ${JSON.stringify(outline)};\n`
};
// 地圖：課的索引跟大綱順序一樣（畫面那邊照大綱攤平就對得上）
const mapLayout = layoutCourseMap(outline, lessons);
const { stats: mapStats, ...mapData } = mapLayout;
if (!checkMode) console.log(`課程地圖：${mapStats.stageLayers} 層 Stage、整張 ${mapData.size.join(" × ")}、先修邊加權長度 ${mapStats.cost}`);
outputs["map.js"] = `${HEADER}window.BUZZ_COURSE_MAP = ${JSON.stringify(mapData)};
`;
stages.forEach((s) => s.chapters.forEach((c) => {
  const inChapter = {};
  c.lessons.forEach((l) => { if (lessons[l.id]) inChapter[l.id] = shipLesson(lessons[l.id]); });
  if (!Object.keys(inChapter).length) return;
  const name = chapterFile(c.code);
  if (outputs[name]) throw new Error(`兩章的檔名撞在一起：${name}`);
  outputs[name] = `${HEADER}window.BUZZ_COURSE_V2_LESSONS = Object.assign(window.BUZZ_COURSE_V2_LESSONS || {}, ${JSON.stringify(inChapter)});\n`;
}));

const written = Object.keys(lessons).length;
if (checkMode) {
  const stale = [];
  Object.entries(outputs).forEach(([name, text]) => {
    const file = path.join(OUT, name);
    if (!fs.existsSync(file) || fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n") !== text) stale.push(name);
  });
  const extra = fs.existsSync(OUT) ? fs.readdirSync(OUT).filter((name) => !outputs[name]) : [];
  if (stale.length || extra.length) {
    console.error(`新版課程的產物跟來源不同步：${stale.concat(extra.map((n) => `${n}（多出來的）`)).join("、")}`);
    console.error("跑 node tools/build_course_v2.js 之後一起 commit。");
    process.exit(1);
  }
  console.log(`course v2 check OK：${written} / ${outlineIds.length} 課`);
} else {
  fs.mkdirSync(OUT, { recursive: true });
  fs.readdirSync(OUT).filter((name) => !outputs[name]).forEach((name) => fs.unlinkSync(path.join(OUT, name)));
  Object.entries(outputs).forEach(([name, text]) => fs.writeFileSync(path.join(OUT, name), text));
  const chapters = Object.entries(outputs).filter(([name]) => /^ch-/.test(name)).map(([name, text]) => [name, Buffer.byteLength(text)]).sort((a, b) => b[1] - a[1]);
  const sizes = Object.entries(outputs).filter(([name]) => !/^ch-/.test(name)).map(([name, text]) => `${name} ${Math.round(Buffer.byteLength(text) / 1024)}KB`)
    .concat(`${chapters.length} 章（最大 ${chapters[0][0]} ${Math.round(chapters[0][1] / 1024)}KB、合計 ${Math.round(chapters.reduce((n, c) => n + c[1], 0) / 1024)}KB）`);
  console.log(`course v2：${written} / ${outlineIds.length} 課 → src/course_v2/（${sizes.join("、")}）`);
}
