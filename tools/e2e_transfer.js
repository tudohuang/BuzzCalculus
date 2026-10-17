// 流量與離線（2026-10 瘦身）在真的 Chrome 裡走一次。數的是打到伺服器的請求（tools/lib/static_server.js 的 requests：
// 頁面與 Service Worker 送的都算），不是頁面自己的 resource timing —— Service Worker 安裝時的預快取在頁面上看不到。
//
// 斷言：
//   第一次造訪：Service Worker 裝好之後，伺服器沒收到任何課文（ch-*.js）、任何 lazy 群組（課程、證明、地圖、分節、英文側表…）、說明頁；
//     Cache Storage 有核心（index.html、app.js），沒有課文。
//   再開一次首頁：script／CSS／字型零請求（全部從 Cache Storage）。
//   打開課程表：抓了 course 群組，一章課文都沒抓（舊版 prefetchAll 會在閒置時把 74 章全抓）。
//   打開一課（分節）：只抓這一章；閒下來之後多抓「下一課」那一章（不同章）與分節的結算畫面，別的章都沒抓。
//   關掉伺服器（真的離線）：首頁照開、打開過的那一課與預抓的下一課照讀；沒打開過的課顯示「載不進來」而不是整頁壞掉。
//
// 用法：node tools/e2e_transfer.js
"use strict";

const fs = require("fs");
const path = require("path");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const lessonOf = (id) => JSON.parse(fs.readFileSync(path.join(ROOT, "tools", "content", "course_v2", "lessons", `${id}.json`), "utf8"));
// 0A 章的最後一課：下一課（函數加減乘除）在 0B 章 —— 看得到「閒置時抓下一課那一章」
const LESSON = lessonOf("graph-features");
const NEXT = lessonOf("function-arithmetic");
const NEVER = lessonOf("limit-intro");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const outlineBox = { window: {} };
require("vm").runInNewContext(fs.readFileSync(path.join(ROOT, "src", "course_v2", "outline.js"), "utf8"), outlineBox);
const OUTLINE = outlineBox.window.BUZZ_COURSE_V2;
const LAZY = [...html.matchAll(/<script type="text\/lazy" data-lazy="([^"]+)" src="([^"]+)"/g)].map((m) => ({ group: m[1], src: m[2] }));

let passed = 0;
const failures = [];
function check(name, ok, detail = "") {
  if (ok) { passed += 1; console.log(`  ok   ${name}${detail ? `  —— ${detail}` : ""}`); }
  else { failures.push(name); ciFail(name, detail); console.log(`  XX   ${name}${detail ? `  —— ${detail}` : ""}`); }
}

const HELPERS = `
  window.__t = {
    open(id) { const b = document.createElement("button"); b.dataset.action = "open-course-lesson"; b.dataset.lessonId = id; document.querySelector("#app").appendChild(b); b.click(); return 1; },
    course() { const b = document.createElement("button"); b.dataset.action = "open-course"; document.querySelector("#app").appendChild(b); b.click(); return 1; },
    async cached() { const out = []; for (const n of await caches.keys()) { const c = await caches.open(n); (await c.keys()).forEach((r) => out.push(new URL(r.url).pathname)); } return out; }
  };
`;

async function run() {
  console.log("E2E 流量與離線");
  const server = await staticServer.start(ROOT, 0);
  let serverUp = true;
  const chrome = await launch();
  const evaluate = (code) => chrome.evaluate(`${HELPERS}\n${code}`);
  const sleep = (ms) => chrome.sleep(ms);
  const waitFor = async (expr, ms = 10000) => {
    for (const deadline = Date.now() + ms; Date.now() < deadline; await sleep(150)) {
      if (await evaluate(`return Boolean(${expr});`).catch(() => false)) return true;
    }
    return false;
  };
  const paths = () => server.requests.map((u) => u.split("?")[0]);
  const since = (k) => paths().slice(k);
  const title = (L) => `document.querySelector(".cv2-lesson h2") && document.querySelector(".cv2-lesson h2").textContent.trim() === ${JSON.stringify(L.title)}`;
  const chapterOf = (id) => `/src/course_v2/ch-${String(OUTLINE.stages.flatMap((st) => st.chapters).find((c) => c.lessons.some((l) => l.id === id)).code).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.js`;

  try {
    await chrome.send("Network.setBlockedURLs", { urls: ["*google-analytics.com*", "*googletagmanager.com*"] });
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });

    /* ── 1. 第一次造訪 ── */
    await chrome.navigate(`${server.url}/index.html`);
    // 導覽會蓋住畫面：當作看過了
    await evaluate(`localStorage.clear(); localStorage.setItem("buzzcalculus.records.v1", JSON.stringify({ tours: { home: 1, quiz: 1 } })); return 1;`);
    check("Service Worker 裝好、接手這一頁", await waitFor("navigator.serviceWorker && navigator.serviceWorker.controller", 20000));
    await sleep(800);
    const first = paths();
    // steps（逐步解答）與 pwa（更新與版本）是開站閒下來就載的，不算
    const lazyHit = LAZY.filter((l) => !require("./build_sw_revisions.js").CORE_LAZY.includes(l.group) && first.includes(`/${l.src}`)).map((l) => `${l.group}:${l.src}`);
    check("第一次造訪：沒有抓任何課文", !first.some((p) => /\/src\/course_v2\//.test(p)), first.filter((p) => /course_v2/.test(p)).join(","));
    check("第一次造訪：沒有抓任何 lazy 群組（課程、證明、地圖、分節、英文側表…）", !lazyHit.length, lazyHit.join(","));
    check("第一次造訪：沒有抓說明頁", !first.some((p) => /\/(about|guide|privacy|terms)\.html$/.test(p)), first.filter((p) => /\.html$/.test(p)).join(","));
    const cached = await evaluate(`return await window.__t.cached();`);
    check("Cache Storage 有核心（index.html、app.js、styles.css）", ["/index.html", "/src/app.js", "/styles.css"].every((p) => cached.includes(p)), `${cached.length} 項`);
    check("Cache Storage 沒有課文與 lazy 群組", !cached.some((p) => /course_v2|course_sections|proof_lang/.test(p)), cached.filter((p) => /course/.test(p)).join(","));
    console.log(`       第一次造訪：伺服器收到 ${first.length} 個請求；Cache Storage ${cached.length} 項`);

    /* ── 2. 再開一次 ── */
    let mark = server.requests.length;
    await chrome.send("Page.navigate", { url: "about:blank" });
    await sleep(300);
    await chrome.navigate(`${server.url}/index.html`);
    await waitFor(`document.querySelector("#app") && !document.querySelector(".app-skeleton")`);
    await sleep(1500);
    const again = since(mark).filter((p) => !/\/sw\.js$/.test(p));
    check("再開一次：script／CSS／字型零請求（全部從 Cache Storage）", !again.length, again.slice(0, 6).join(","));

    /* ── 3. 課程表 ── */
    mark = server.requests.length;
    await evaluate(`window.__t.course(); return 1;`);
    check("課程表打開", await waitFor(`document.querySelector(".cv2-index")`));
    await sleep(2500); // 舊版的 prefetchAll 在這裡（閒置時）把每一章抓一遍
    const index = since(mark);
    // 部署版（tools/bundle_site.js）把整組串成一支 /bundle/lazy-course.<雜湊>.js
    check("課程表：抓了 course 群組", (index.includes("/src/course_v2/outline.js") && index.includes("/src/course_v2_ui.js")) || index.some((p) => /^\/bundle\/lazy-course\.[0-9a-f]{8}\.js$/.test(p)), index.join(","));
    check("課程表：一章課文都沒抓", !index.some((p) => /\/ch-/.test(p)), index.filter((p) => /\/ch-/.test(p)).length + " 章");

    /* ── 4. 打開一課（分節） ── */
    mark = server.requests.length;
    await evaluate(`window.__t.open(${JSON.stringify(LESSON.id)}); return 1;`);
    check(`打開 ${LESSON.id}（分節）`, await waitFor(`${title(LESSON)} && document.querySelector("[data-cv2s]")`));
    await sleep(2500);
    const lesson = since(mark);
    const chapters = [...new Set(lesson.filter((p) => /\/ch-/.test(p)))];
    const own = chapterOf(LESSON.id);
    const next = chapterOf(NEXT.id);
    check(`抓了這一章（${own.replace(/^.*\//, "")}）`, chapters.includes(own), chapters.join(","));
    check(`閒下來抓了下一課那一章（${next.replace(/^.*\//, "")}）、別的章都沒抓`, chapters.includes(next) && chapters.length === 2, chapters.join(","));
    check("分節的結算畫面先抓進快取（讀到最後一節離線也有）", lesson.includes("/src/course_finish.js"), lesson.join(","));

    /* ── 5. 真的離線：關掉伺服器 ── */
    await server.stop();
    serverUp = false;
    await chrome.send("Page.navigate", { url: "about:blank" });
    await sleep(300);
    await chrome.navigate(`${server.url}/index.html`);
    check("離線：首頁照開（題庫在）", await waitFor(`window.BUZZ_PROBLEMS && window.BUZZ_PROBLEMS.length > 100 && document.querySelector("#app") && !document.querySelector(".app-skeleton")`, 15000));
    await evaluate(`window.__t.open(${JSON.stringify(LESSON.id)}); return 1;`);
    check(`離線：打開過的 ${LESSON.id} 照讀（分節、有第一句）`, await waitFor(`${title(LESSON)} && document.querySelector("[data-cv2s] .cv2s-beat")`, 15000));
    await evaluate(`window.__t.open(${JSON.stringify(NEXT.id)}); return 1;`);
    check(`離線：預抓過的下一課 ${NEXT.id} 照讀`, await waitFor(`${title(NEXT)} && document.querySelector("[data-cv2s] .cv2s-beat")`, 15000));
    await evaluate(`window.__t.open(${JSON.stringify(NEVER.id)}); return 1;`);
    check(`離線：沒打開過的 ${NEVER.id} 說「載不進來」、有「再試一次」`, await waitFor(`${title(NEVER)} && document.querySelector('[data-action="course-retry"]')`, 15000));
    check("沒有未攔下的例外", !chrome.pageErrors.length, chrome.pageErrors.slice(0, 2).join(" | "));
  } catch (error) {
    check("E2E 跑完", false, error.message);
  } finally {
    await chrome.close();
    if (serverUp) await server.stop();
  }
  console.log(`\n流量與離線 E2E：${passed} 過、${failures.length} 失敗`);
  if (failures.length) process.exitCode = 1;
}

run().catch((error) => { console.error(error); ciFail("E2E transfer 掛掉", error.message); process.exitCode = 1; });
