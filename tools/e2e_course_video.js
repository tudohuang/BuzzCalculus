// 課程影片（新版課程的 video 欄位）在真的 Chrome 裡走一次：手機 390×844（觸控）＋桌機 1280×800。
//
// 斷言：有影片的課在指定的觀念段落後面有預覽圖（真的載得出來）、播放鍵、片長；點之前沒有 <video>、沒有任何 mp4 請求，
// 播放器 course_video.js 也只在有影片的課才抓；點了才建 <video>（preload=none、playsinline、controls、不自動播放的屬性），
// 片源跟主題與寬度走（手機 720p、桌機 1080p、深色挑 -dark）；整頁重繪（揭範例一步）後同一支影片還在、還在播；
// Service Worker 在管這一頁時，mp4 的回應不是從 SW 來的、Cache Storage 裡沒有任何 /media/；
// 預覽圖載不到時只留一行說明、沒有破圖框；390 寬不溢出、播放鍵 ≥ 40px。
//
// 用法：node tools/e2e_course_video.js
//       node tools/e2e_course_video.js --screenshots   另存截圖到 docs/report/course-review/screens/video/（不進版控）

"use strict";

const fs = require("fs");
const path = require("path");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const SHOTS = process.argv.includes("--screenshots") ? path.join(ROOT, "docs", "report", "course-review", "screens", "video") : "";
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, mobile: true };
const DESKTOP = { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false };
const LESSON_DIR = path.join(ROOT, "tools", "content", "course_v2", "lessons");
const lessonOf = (id) => JSON.parse(fs.readFileSync(path.join(LESSON_DIR, `${id}.json`), "utf8"));
const SAMPLE = lessonOf("riemann-sum-intuition");
const BROKEN = lessonOf("taylor-polynomial");
// 同一章裡沒有影片的課（先開它，確定播放器不會被抓）
const outlineBox = { window: {} };
require("vm").runInNewContext(fs.readFileSync(path.join(ROOT, "src", "course_v2", "outline.js"), "utf8"), outlineBox);
const PLAIN = outlineBox.window.BUZZ_COURSE_V2.stages.flatMap((s) => s.chapters).find((c) => c.lessons.some((l) => l.id === SAMPLE.id))
  .lessons.map((l) => l.id).find((id) => id !== SAMPLE.id && fs.existsSync(path.join(LESSON_DIR, `${id}.json`)) && !lessonOf(id).video);
const HAVE_MEDIA = fs.existsSync(path.join(ROOT, "media", `${SAMPLE.video.id}-light-poster.jpg`));

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

const HELPERS = `
  window.__v = {
    visible(el) { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden" && getComputedStyle(el).display !== "none"; },
    open(id) { const b = document.createElement("button"); b.dataset.action = "open-course-lesson"; b.dataset.lessonId = id; document.querySelector("#app").appendChild(b); b.click(); return 1; },
    media() { return performance.getEntriesByType("resource").map((e) => e.name).filter((n) => /\\/media\\//.test(n)).map((n) => n.replace(/^.*\\/media\\//, "")); },
    player() { return performance.getEntriesByType("resource").some((e) => /course_video\\.js/.test(e.name)); },
    overflow() { const d = document.documentElement; return d.scrollWidth - d.clientWidth; },
    fig() { return document.querySelector("[data-cv2-video]"); }
  };
`;

async function run() {
  console.log("E2E 課程影片");
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const evaluate = (code) => chrome.evaluate(`${HELPERS}\n${code}`);
  const sleep = (ms) => chrome.sleep(ms);
  const waitFor = async (expr, ms = 8000) => {
    for (const deadline = Date.now() + ms; Date.now() < deadline; await sleep(100)) {
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
  // mp4 的回應：記下是不是從 Service Worker 來的
  const mediaResponses = [];
  chrome.on("Network.responseReceived", (params) => {
    if (/\/media\/.+\.(mp4|jpg)/.test(params.response.url)) mediaResponses.push({ url: params.response.url.replace(/^.*\/media\//, ""), sw: Boolean(params.response.fromServiceWorker), status: params.response.status });
  });
  const openLesson = async (id) => {
    await evaluate(`window.__v.open(${JSON.stringify(id)}); return 1;`);
    // 有分節的課預設一節一屏（e2e_course_sections 管）；這裡測的是整頁裡的影片：切到「全文」（會記住，之後的課都是全文）
    await waitFor(`document.querySelector("[data-cv2s]") || document.querySelector(".cv2-lesson [data-course-concept]")`);
    if (await evaluate(`return Boolean(document.querySelector("[data-cv2s]"));`)) {
      await evaluate(`document.querySelector('[data-action="course-s-mode"][data-mode="full"]').click(); return 1;`);
    }
    return waitFor(`document.querySelector(".cv2-lesson [data-course-concept]") && document.querySelector(".cv2-lesson h2").textContent.trim() === ${JSON.stringify(lessonOf(id).title)}`);
  };

  try {
    if (!HAVE_MEDIA) console.log("  ·    本機沒有 media/ 的影片檔（node tools/fetch_media.js 抓）：預覽圖與播放的斷言會失敗");
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await chrome.navigate(`${server.url}/index.html`);
    await evaluate(`localStorage.clear(); return 1;`);
    // 等 Service Worker 接管這一頁（重載一次），之後的 /media/ 請求才測得到「SW 有沒有攔」
    await chrome.navigate(`${server.url}/index.html`);
    await waitFor("navigator.serviceWorker && navigator.serviceWorker.controller", 3000);
    if (!(await evaluate(`return Boolean(navigator.serviceWorker && navigator.serviceWorker.controller);`))) {
      await evaluate(`await navigator.serviceWorker.ready; return 1;`);
      await chrome.navigate(`${server.url}/index.html`);
    }
    const sw = await evaluate(`return Boolean(navigator.serviceWorker && navigator.serviceWorker.controller);`);
    check("Service Worker 在管這一頁", sw);
    await evaluate(`const b = document.querySelector('[data-action="set-onboarding-context"][data-context="newbie"]'); if (b) b.click(); return 1;`);
    await waitFor('document.querySelector(".cv2-index")');

    /* ── 沒有影片的課：不抓播放器 ── */
    check(`打開沒有影片的課（${PLAIN}）`, await openLesson(PLAIN));
    await sleep(400);
    check("沒有影片的課：沒有影片框、沒抓播放器、沒有 /media/ 請求", !(await evaluate(`return Boolean(window.__v.fig()) || window.__v.player() || window.__v.media().length > 0;`)));

    /* ── 有影片的課（手機）── */
    check(`打開 ${SAMPLE.id}`, await openLesson(SAMPLE.id));
    await waitFor(`window.__v.fig() && window.__v.fig().querySelector(".cv2-video-poster img")`);
    const lazyFirst = await evaluate(`const img = window.__v.fig().querySelector("img"); return img.getBoundingClientRect().top > innerHeight ? !(img.complete && img.naturalWidth > 0) : null;`);
    if (lazyFirst !== null) check("預覽圖在畫面外時還沒載（loading=lazy 真的有用）", lazyFirst);
    await evaluate(`window.__v.fig().scrollIntoView({ block: "center" }); return 1;`);
    check("捲到那裡：預覽圖出現而且真的載得出來", await waitFor(`window.__v.fig() && window.__v.fig().querySelector(".cv2-video-poster img") && window.__v.fig().querySelector(".cv2-video-poster img").complete && window.__v.fig().querySelector(".cv2-video-poster img").naturalWidth > 0`, 8000));
    const before = await evaluate(`
      const fig = window.__v.fig();
      fig.scrollIntoView({ block: "center" });
      const img = fig.querySelector("img");
      const btn = fig.querySelector(".cv2-video-poster");
      const r = btn.getBoundingClientRect();
      const col = document.querySelector(".cv2-lesson").getBoundingClientRect();
      const part = fig.closest("[data-cv2-mark]");
      return {
        place: part ? part.dataset.cv2Mark : "",
        src: img.getAttribute("src"), lazy: img.getAttribute("loading"),
        videos: document.querySelectorAll("video").length,
        mp4: window.__v.media().filter((n) => /\\.mp4/.test(n)),
        player: window.__v.player(),
        time: (fig.querySelector(".cv2-video-time") || {}).textContent || "",
        caption: (fig.querySelector("figcaption") || {}).textContent || "",
        w: Math.round(r.width), h: Math.round(r.height), colW: Math.round(col.width),
        overflow: window.__v.overflow(),
        label: btn.getAttribute("aria-label") || ""
      };`);
    const want = SAMPLE.video;
    check(`影片放在觀念 ${want.after + 1} 後面（after = ${want.after}）`, before.place === `c${want.after}`, before.place);
    check("預覽圖是淺色主題的那一張、loading=lazy", before.src === `media/${want.id}-light-poster.jpg` && before.lazy === "lazy", before.src);
    check("點之前：沒有 <video>、沒有任何 mp4 請求", before.videos === 0 && !before.mp4.length, before.mp4.join(","));
    check("播放器（course_video.js）這時才抓", before.player);
    check(`片長 ${Math.floor(want.duration / 60)}:${String(want.duration % 60).padStart(2, "0")} 與說明一行`, before.time === `0:${String(want.duration).padStart(2, "0")}` && before.caption === want.caption, `${before.time} · ${before.caption}`);
    check("手機：預覽圖滿欄、16:9、播放鍵夠大", Math.abs(before.w - before.colW) <= 2 && Math.abs(before.w / before.h - 16 / 9) < 0.03 && before.h >= 40, `${before.w}×${before.h} / 欄 ${before.colW}`);
    check("播放鍵有讀得出來的名字", before.label.includes(want.caption) && before.label.includes(`${want.duration} 秒`), before.label);
    check("390 寬沒有橫向溢出", before.overflow <= 1, `${before.overflow}px`);
    await shot("phone-light-poster");

    // 深色：預覽圖換成 -dark
    await evaluate(`document.documentElement.dataset.theme = "dark"; return 1;`);
    check("切深色：預覽圖換成深色那一張", await waitFor(`window.__v.fig().querySelector("img").getAttribute("src") === "media/${want.id}-dark-poster.jpg" && window.__v.fig().querySelector("img").complete && window.__v.fig().querySelector("img").naturalWidth > 0`));
    await evaluate(`window.__v.fig().scrollIntoView({ block: "center" }); return 1;`);
    await sleep(200);
    await shot("phone-dark-poster");
    await evaluate(`document.documentElement.dataset.theme = "light"; return 1;`);
    await waitFor(`window.__v.fig().querySelector("img").getAttribute("src") === "media/${want.id}-light-poster.jpg"`);

    // 點了才建 <video>
    const p = await evaluate(`const r = window.__v.fig().querySelector(".cv2-video-poster").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };`);
    await chrome.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: p.x, y: p.y }] });
    await chrome.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    check("點了：建出 <video>", await waitFor(`document.querySelector("[data-cv2-video] video")`));
    const vid = await evaluate(`const v = document.querySelector("[data-cv2-video] video"); return { src: v.getAttribute("src"), preload: v.getAttribute("preload") || v.preload, controls: v.controls, inline: v.hasAttribute("playsinline"), autoplay: v.autoplay, poster: v.getAttribute("poster") };`);
    check("片源：淺色、手機 720p", vid.src === `media/${want.id}-light-720p.mp4`, vid.src);
    check("<video>：controls、playsinline、preload=none、沒有 autoplay 屬性", vid.controls && vid.inline && vid.preload === "none" && !vid.autoplay, JSON.stringify(vid));
    check("點了之後才開始抓 mp4", await waitFor(`window.__v.media().some((n) => /${want.id}-light-720p\\.mp4/.test(n))`, 6000));
    check("影片真的在播", await waitFor(`(() => { const v = document.querySelector("[data-cv2-video] video"); return v && !v.paused && v.currentTime > 0.2; })()`, 8000));
    await shot("phone-light-playing");

    // 整頁重繪（揭範例一步）：同一支影片還在、還在播
    await evaluate(`document.querySelector("[data-cv2-video] video").__mark = 1; const b = document.querySelector('[data-action="course-step"]'); b.click(); return 1;`);
    await sleep(300);
    check("揭範例一步（整頁重繪）之後還是同一支影片、還在播", await waitFor(`(() => { const v = document.querySelector("[data-cv2-video] video"); return v && v.__mark === 1 && !v.paused && document.querySelectorAll(".course-step").length >= 1; })()`, 4000));

    // Service Worker 沒有攔 /media/
    const caches = await evaluate(`const names = await caches.keys(); const all = []; for (const n of names) { const c = await caches.open(n); (await c.keys()).forEach((r) => all.push(r.url)); } return all.filter((u) => /\\/media\\//.test(u));`);
    const mp4 = mediaResponses.filter((r) => /\.mp4$/.test(r.url));
    check("mp4 的回應不是從 Service Worker 來的", mp4.length > 0 && mp4.every((r) => !r.sw), JSON.stringify(mp4.slice(0, 3)));
    check("Cache Storage 裡沒有任何 /media/ 的檔", !caches.length, caches.slice(0, 3).join(","));

    // 預覽圖載不到：只留一行說明、沒有破圖框
    await chrome.send("Network.setBlockedURLs", { urls: [`*${BROKEN.video.id}-*`] });
    check(`打開 ${BROKEN.id}（擋掉它的影片檔）`, await openLesson(BROKEN.id));
    check("載不到：框拿掉、只留說明與一行「影片暫時載不到」", await waitFor(`(() => { const f = window.__v.fig(); return f && f.classList.contains("is-off") && !window.__v.visible(f.querySelector(".cv2-video-box")) && /影片暫時載不到/.test(f.textContent); })()`, 6000));
    await chrome.send("Network.setBlockedURLs", { urls: [] });

    /* ── 桌機：1080p、最寬 560 置中 ── */
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: false });
    await chrome.send("Emulation.setDeviceMetricsOverride", DESKTOP);
    check(`桌機：打開 ${SAMPLE.id}`, await openLesson(SAMPLE.id));
    await waitFor(`window.__v.fig() && window.__v.fig().querySelector(".cv2-video-poster, video")`);
    await evaluate(`window.__v.fig().scrollIntoView({ block: "center" }); return 1;`);
    // 上一段已經點開過：重繪後接回同一支影片；先停掉、換一課再回來不算，所以這裡直接看「有沒有影片或預覽圖」再點
    const desk = await evaluate(`
      const fig = window.__v.fig();
      const r = fig.getBoundingClientRect();
      const col = document.querySelector(".cv2-lesson").getBoundingClientRect();
      return { w: Math.round(r.width), center: Math.abs((r.left + r.right) / 2 - (col.left + col.right) / 2), overflow: window.__v.overflow() };`);
    check("桌機：影片最寬 560px、在本文欄置中", desk.w <= 562 && desk.center < 2, `${desk.w}px · 偏 ${desk.center.toFixed(1)}px`);
    // 手機那一段點開的影片接回來了：先停掉，切主題時它要換成「深色 ＋ 現在寬度（1080p）」的片源
    await evaluate(`const v = document.querySelector("[data-cv2-video] video"); if (v) v.pause(); return 1;`);
    await evaluate(`document.documentElement.dataset.theme = "dark"; return 1;`);
    check("桌機：停著的影片切深色 → 片源換成深色 1080p", await waitFor(`(() => { const v = document.querySelector("[data-cv2-video] video"); return v && v.getAttribute("src") === "media/${want.id}-dark-1080p.mp4"; })()`, 4000));
    await evaluate(`document.documentElement.dataset.theme = "light"; return 1;`);
    await shot("desktop-light-video");

    const errors = chrome.pageErrors.concat(chrome.consoleMessages.filter((m) => m.type === "error" && !/ERR_BLOCKED_BY_CLIENT|Failed to load resource/.test(m.text)).map((m) => m.text));
    check("console 沒有錯誤", !errors.length, errors.slice(0, 3).join(" | "));
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
  ciFail("e2e_course_video crashed", error.message);
  process.exit(1);
});
