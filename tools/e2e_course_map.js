// 課程地圖（新版課程的「清單／地圖」切換）在真的 Chrome 裡走一次：手機 390×844（觸控）＋桌機 1280×800。
//
// 斷言都是看得到、摸得到的東西：切到地圖才抓地圖的兩支檔；拉遠是 13 個 Stage；捏合／滾輪放大到看得到一課一課；
// 點一課 → 亮起來的先修數跟課程資料的 DAG 算出來的一樣、小卡的「開始這課」打開的就是那一課；
// 一課頁面的「在地圖上看」回到地圖、停在那一課；拖曳與縮放真的改相機；方向鍵在相連的課之間走、Enter 打開；
// 390 寬不溢出、觸控目標 ≥ 40px；深色主題底色跟著換、小卡字看得清楚；prefers-reduced-motion 直接跳到位。
// 絲滑：用 pointer 事件拖 60 格（每格一個 pointermove），量 requestAnimationFrame 的間隔，中位數要 < 20ms（印出來）。
//
// 用法：node tools/e2e_course_map.js
//       node tools/e2e_course_map.js --screenshots   另存截圖到 docs/report/course-review/screens/map/（不進版控）

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const SHOTS = process.argv.includes("--screenshots") ? path.join(ROOT, "docs", "report", "course-review", "screens", "map") : "";
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, mobile: true };
const DESKTOP = { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false };

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

// ── 從課程資料自己算 DAG（不看地圖的程式）：祖先數、直接後續 ──
const box = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "src", "course_v2", "outline.js"), "utf8"), box);
const OUTLINE = box.window.BUZZ_COURSE_V2;
const IDS = OUTLINE.stages.flatMap((s) => s.chapters.flatMap((c) => c.lessons.map((l) => l.id)));
const PRE = {};
IDS.forEach((id) => {
  const file = path.join(ROOT, "tools", "content", "course_v2", "lessons", `${id}.json`);
  PRE[id] = fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")).prerequisites || []).filter(Boolean) : [];
});
const SUCC = {};
IDS.forEach((id) => PRE[id].forEach((p) => { (SUCC[p] = SUCC[p] || []).push(id); }));
function closure(id, edges) {
  const seen = new Set();
  const stack = [id];
  while (stack.length) (edges[stack.pop()] || []).forEach((p) => { if (!seen.has(p)) { seen.add(p); stack.push(p); } });
  return seen;
}
// 樣本：Stage 2 裡第一個祖先 ≥ 8 課、而且有先修行（「在地圖上看」在那一行）的課；另一課給「在地圖上看」用
const SAMPLE = OUTLINE.stages[2].chapters.flatMap((c) => c.lessons).map((l) => l.id).find((id) => closure(id, PRE).size >= 8 && PRE[id].length);
const FOCUS = OUTLINE.stages[4].chapters[1].lessons[0].id;
const titleOf = (id) => OUTLINE.stages.flatMap((s) => s.chapters.flatMap((c) => c.lessons)).find((l) => l.id === id).title;

const HELPERS = `
  window.__m = {
    visible(el) { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden"; },
    click(selector) { const el = [...document.querySelectorAll(selector)].find((n) => window.__m.visible(n)); if (el) { el.scrollIntoView({ block: "center" }); el.click(); } return Boolean(el); },
    text(selector) { const el = document.querySelector(selector); return el ? (el.innerText || "").replace(/\\s+/g, " ").trim() : ""; },
    overflow() { const d = document.documentElement; return d.scrollWidth - d.clientWidth; },
    smallTargets() {
      return [...document.querySelectorAll("#app button, #app [data-action], #app summary")]
        .filter((n) => window.__m.visible(n) && !n.closest("[hidden]") && !n.closest(".sr-only"))
        .map((n) => { const r = n.getBoundingClientRect(); return { side: Math.round(Math.min(r.width, r.height)), label: (n.textContent || "").trim().slice(0, 12) }; })
        .filter((x) => x.side < 40);
    },
    files() { return performance.getEntriesByType("resource").map((e) => e.name).filter((n) => /course_map|course_v2\\/map/.test(n)).map((n) => n.replace(/^.*\\/src\\//, "")); },
    dbg() { return window.BuzzCourseMap ? window.BuzzCourseMap.debug() : null; },
    canvasRect() { const c = document.querySelector(".cmap-canvas"); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; },
    lum(c) { const v = c.match(/[\\d.]+/g).slice(0, 3).map(Number).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; },
    contrast(a, b) { const x = window.__m.lum(a); const y = window.__m.lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  };
`;

async function run() {
  console.log("E2E 課程地圖");
  if (!SAMPLE) throw new Error("找不到樣本課（大綱變了？）");
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
  const settled = () => waitFor("window.__m.dbg() && !window.__m.dbg().animating", 4000);
  const dbg = () => evaluate("return window.__m.dbg();");
  const shot = async (name) => {
    if (!SHOTS) return;
    fs.mkdirSync(SHOTS, { recursive: true });
    await chrome.evaluate("window.scrollTo(0, 0); return 1;");
    await sleep(80);
    const { data } = await chrome.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(SHOTS, `${name}.png`), Buffer.from(data, "base64"));
  };
  const touch = (type, points) => chrome.send("Input.dispatchTouchEvent", { type, touchPoints: points.map(([x, y], id) => ({ x, y, id })) });
  const tapAt = async (x, y) => { await touch("touchStart", [[x, y]]); await touch("touchEnd", []); await sleep(120); };
  const openCourse = async () => {
    await evaluate(`let el = [...document.querySelectorAll('[data-action="open-course"]')].find((n) => n.getClientRects().length); if (!el) { el = document.createElement("button"); el.dataset.action = "open-course"; document.querySelector("#app").appendChild(el); } el.click(); return 1;`);
    return waitFor('document.querySelector(".cv2-index")');
  };

  try {
    /* ── 手機 ── */
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await chrome.navigate(`${server.url}/index.html`);
    await evaluate(`localStorage.clear(); return 1;`);
    await chrome.navigate(`${server.url}/index.html`);
    await sleep(400);
    await evaluate(`window.__m.click('[data-action="set-onboarding-context"][data-context="newbie"]'); return 1;`);
    check("課程表打得開（預設是清單）", await waitFor('document.querySelector(".cv2-index .cv2-stage")'));
    const before = await evaluate(`return { files: window.__m.files(), toggle: [...document.querySelectorAll('[data-action="course-view"]')].map((b) => b.textContent.trim() + ":" + b.getAttribute("aria-pressed")).join(" ") };`);
    check("清單／地圖切換在課程表上，清單是按下的", before.toggle === "清單:true 地圖:false", before.toggle);
    check("還沒切到地圖：地圖的檔一個都沒抓", !before.files.length, before.files.join(","));

    await evaluate(`window.__m.click('[data-action="course-view"][data-mode="map"]'); return 1;`);
    check("切到地圖：canvas 出現", await waitFor('window.BuzzCourseMap && document.querySelector(".cmap-canvas") && window.__m.dbg().draws > 0'));
    await settled();
    const opened = await evaluate(`const c = document.querySelector(".cmap-canvas"); return { files: window.__m.files(), touch: getComputedStyle(c).touchAction, d: window.__m.dbg(), overflow: window.__m.overflow(), small: window.__m.smallTargets(), rect: window.__m.canvasRect(), dpr: c.width / c.getBoundingClientRect().width, sr: document.querySelectorAll(".cv2-map .sr-only li li li").length };`);
    check("切到地圖才抓 map.js 與 course_map.js", opened.files.includes("course_v2/map.js") && opened.files.includes("course_map.js"), opened.files.join(","));
    check("一打開是 Stage 那一層", opened.d.level === "stage", `${opened.d.level} · ×${opened.d.scale.toFixed(3)}`);
    check("canvas 是 touch-action:none（只有地圖本身不捲頁）", opened.touch === "none", opened.touch);
    check("canvas 照 DPR 畫（手機 2×）", Math.abs(opened.dpr - 2) < 0.05, opened.dpr.toFixed(2));
    check("地圖頁 390 寬沒有橫向溢出", opened.overflow <= 1, `${opened.overflow}px`);
    check("地圖頁的觸控目標都 ≥ 40px", !opened.small.length, JSON.stringify(opened.small.slice(0, 4)));
    check(`螢幕閱讀器有一份看不見的清單（${IDS.length} 課）`, opened.sr === IDS.length, String(opened.sr));
    check("地圖整個在第一屏、沒被底部分頁列蓋住", await evaluate(`const r = window.__m.canvasRect(); const nav = document.querySelector(".topbar-nav"); const floor = nav ? nav.getBoundingClientRect().top : innerHeight; return r.y > 0 && r.y + r.h <= floor + 1 && r.h >= 360;`));
    await shot("phone-light-stages-start");

    // 拉遠到底：13 個 Stage 都在畫面裡
    for (let k = 0; k < 4; k += 1) { await evaluate(`window.__m.click('[data-cmap="out"]'); return 1;`); await settled(); }
    const out = await dbg();
    check("「−」拉到最遠：13 個 Stage 都在畫面裡、還是 Stage 那一層", out.visibleStages === OUTLINE.stages.length && out.level === "stage", `${out.visibleStages} 個 · ${out.level}`);
    await shot("phone-light-stages-fit");

    // 兩指捏合（以兩指中點為中心）放大
    const r = await evaluate(`return window.__m.canvasRect();`);
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h / 2;
    const t0 = await dbg();
    await touch("touchStart", [[cx - 30, cy], [cx + 30, cy]]);
    for (let k = 1; k <= 12; k += 1) { await touch("touchMove", [[cx - 30 - k * 9, cy], [cx + 30 + k * 9, cy]]); await sleep(16); }
    await touch("touchEnd", []);
    await sleep(150);
    const t1 = await dbg();
    const ratio = t1.scale / t0.scale;
    // 兩指中點底下那個世界座標點，捏完還在中點底下
    const drift = Math.abs(((cx - r.x) - t1.tx) / t1.scale - ((cx - r.x) - t0.tx) / t0.scale) * t1.scale;
    check("兩指捏合放大，倍率跟著兩指距離走", ratio > 4.2 && ratio < 5, `×${ratio.toFixed(2)}（兩指 60 → 276px，應該 ×4.6）`);
    check("捏合以兩指中點為中心（中點底下的點不跑掉）", drift < 3, `${drift.toFixed(1)}px`);

    // 一指拖曳：相機平移
    const p0 = await dbg();
    await touch("touchStart", [[cx, cy]]);
    for (let k = 1; k <= 10; k += 1) { await touch("touchMove", [[cx - k * 12, cy - k * 4]]); await sleep(16); }
    await touch("touchEnd", []);
    await sleep(100);
    const p1 = await dbg();
    check("一指拖曳：畫面跟著手指走", p1.tx < p0.tx - 60 && Math.abs(p1.scale - p0.scale) < 1e-6, `tx ${p0.tx.toFixed(0)} → ${p1.tx.toFixed(0)}`);
    await settled();

    // 中間那一層是章；再放大才是一課一課（滾輪也行：以游標為中心）
    await evaluate(`const st = window.BUZZ_COURSE_MAP.stages[2]; window.BuzzCourseMap.look(0.36, st[0] + st[2] / 2, st[1] + st[3] / 2); return 1;`);
    await settled();
    const mid = await dbg();
    check("中間那一層是章（章名標籤）", mid.level === "chapter" && mid.visibleChapters > 0 && mid.labelledLessons === 0, `${mid.level} · 章 ${mid.visibleChapters}`);
    await shot("phone-light-chapters");
    const scrollBefore = await evaluate(`return window.scrollY;`);
    for (let k = 0; k < 3; k += 1) {
      await chrome.send("Input.dispatchMouseEvent", { type: "mouseWheel", x: cx, y: cy, deltaX: 0, deltaY: -240 });
      await sleep(60);
    }
    await sleep(150);
    const zoomed = await evaluate(`return { d: window.__m.dbg(), scroll: window.scrollY };`);
    check("滾輪放大到看得到一課一課（課號 · 課名）", zoomed.d.level === "lesson" && zoomed.d.labelledLessons > 0, `${zoomed.d.level} · ${zoomed.d.labelledLessons} 課有字 · ×${zoomed.d.scale.toFixed(2)}`);
    check("在地圖上滾輪不會捲動整頁", zoomed.scroll === scrollBefore, `${scrollBefore} → ${zoomed.scroll}`);
    await shot("phone-light-lessons");

    // 點一課：祖先與子孫亮起來，數量跟 DAG 一樣
    await evaluate(`const m = window.BUZZ_COURSE_MAP; const ids = ${JSON.stringify(IDS)}; const i = ids.indexOf(${JSON.stringify(SAMPLE)}); window.BuzzCourseMap.look(0.9, m.lessons[2 * i], m.lessons[2 * i + 1]); return 1;`);
    await settled();
    const at = await evaluate(`return window.BuzzCourseMap.project(${JSON.stringify(SAMPLE)});`);
    await tapAt(at.x, at.y);
    await settled();
    const picked = await evaluate(`return { d: window.__m.dbg(), card: window.__m.text(".cmap-card"), start: Boolean(document.querySelector('.cmap-card [data-action="open-course-lesson"][data-lesson-id="${SAMPLE}"]')) };`);
    const anc = closure(SAMPLE, PRE).size;
    const desc = closure(SAMPLE, SUCC).size;
    check(`點 ${SAMPLE}：選中、先修全部亮起來（DAG 算出 ${anc} 課）`, picked.d.selected === SAMPLE && picked.d.ancestors === anc, `${picked.d.selected} · 先修 ${picked.d.ancestors}`);
    check(`後續（子孫）也亮起來（DAG 算出 ${desc} 課）`, picked.d.descendants === desc, String(picked.d.descendants));
    check("小卡：課名、分鐘、狀態、先修／後續數、「開始這課」「看先修」", picked.card.includes(titleOf(SAMPLE)) && /閱讀 \d+ 分/.test(picked.card) && picked.card.includes(`先修 ${anc} 課`) && picked.card.includes("看先修") && picked.start, picked.card.slice(0, 80));
    check("小卡的按鈕 ≥ 40px、頁面沒溢出", !(await evaluate(`return window.__m.smallTargets().length;`)) && (await evaluate(`return window.__m.overflow();`)) <= 1);
    await shot("phone-light-selected");
    await evaluate(`window.__m.click('[data-cmap="prereq"]'); return 1;`);
    await settled();
    const pre = await evaluate(`const d = window.__m.dbg(); const p = window.BuzzCourseMap.project(${JSON.stringify(SAMPLE)}); const r = window.__m.canvasRect(); return { d, inView: p.x > r.x && p.x < r.x + r.w && p.y > r.y && p.y < r.y + r.h };`);
    check("「看先修」把相機拉到整串先修、選中的課還在畫面裡、亮起來的還看得到", pre.d.selected === SAMPLE && pre.inView && pre.d.level !== "stage", `${pre.d.level} · ×${pre.d.scale.toFixed(2)}`);
    await shot("phone-light-prereqs");

    // 鍵盤：→ 走到一個直接後續、← 回到一個直接先修、Enter 打開
    await evaluate(`document.querySelector(".cmap-canvas").focus(); return 1;`);
    const key = async (k, code) => {
      await chrome.send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: k, code, windowsVirtualKeyCode: { ArrowRight: 39, ArrowLeft: 37, ArrowDown: 40, ArrowUp: 38, Enter: 13 }[k] });
      await chrome.send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code });
      await sleep(80);
    };
    await key("ArrowRight", "ArrowRight");
    const right = (await dbg()).selected;
    check("→：焦點走到一個直接後續", (SUCC[SAMPLE] || []).includes(right), right);
    await key("ArrowLeft", "ArrowLeft");
    const left = (await dbg()).selected;
    check("←：焦點走到一個直接先修", PRE[right].includes(left), left);
    check("焦點移動念得出來（aria-live）", (await evaluate(`return window.__m.text('.cv2-map [aria-live]');`)).includes(titleOf(left)));
    await settled();
    await key("Enter", "Enter");
    check("Enter：打開那一課", await waitFor(`document.querySelector(".cv2-lesson h2") && document.querySelector(".cv2-lesson h2").textContent.trim() === ${JSON.stringify(titleOf(left))}`), titleOf(left));

    // 小卡的「開始這課」：回地圖（相機與選取留著）→ 選樣本 → 開始這課
    await openCourse();
    check("回到課程表還是地圖", await waitFor('window.BuzzCourseMap && document.querySelector(".cmap-canvas") && window.__m.dbg().draws > 0'));
    await settled();
    const back = await dbg();
    check("回來時選取還在", back.selected === left, back.selected);
    const at2 = await evaluate(`return window.BuzzCourseMap.project(${JSON.stringify(SAMPLE)});`);
    const vis = await evaluate(`const r = window.__m.canvasRect(); return ${at2.x} > r.x && ${at2.x} < r.x + r.w && ${at2.y} > r.y && ${at2.y} < r.y + r.h - 10;`);
    if (!vis) {
      const ids = JSON.stringify(IDS);
      await evaluate(`const m = window.BUZZ_COURSE_MAP; const i = ${ids}.indexOf(${JSON.stringify(SAMPLE)}); window.BuzzCourseMap.look(0.9, m.lessons[2 * i], m.lessons[2 * i + 1] + 120); return 1;`);
      await settled();
    }
    const at3 = await evaluate(`return window.BuzzCourseMap.project(${JSON.stringify(SAMPLE)});`);
    if ((await dbg()).selected !== SAMPLE) await tapAt(at3.x, at3.y);
    await settled();
    check("樣本課選中、小卡在", (await dbg()).selected === SAMPLE && (await evaluate(`return !document.querySelector(".cmap-card").hidden;`)), (await dbg()).selected);
    await evaluate(`window.__m.click('.cmap-card [data-action="open-course-lesson"]'); return 1;`);
    check("「開始這課」打開的就是那一課", await waitFor(`document.querySelector(".cv2-lesson h2") && document.querySelector(".cv2-lesson h2").textContent.trim() === ${JSON.stringify(titleOf(SAMPLE))}`), titleOf(SAMPLE));

    // 一課頁面的「在地圖上看」
    const link = await evaluate(`const b = document.querySelector('.cv2-prereq [data-action="course-map-focus"]'); return b ? { text: b.textContent.trim(), id: b.dataset.lessonId, side: Math.round(Math.min(b.getBoundingClientRect().width, b.getBoundingClientRect().height)) } : null;`);
    check("先修那一行有「在地圖上看」", link && link.text === "在地圖上看" && link.id === SAMPLE && link.side >= 40, JSON.stringify(link));
    await evaluate(`window.__m.click('.cv2-prereq [data-action="course-map-focus"]'); return 1;`);
    check("「在地圖上看」打開地圖", await waitFor('window.BuzzCourseMap && document.querySelector(".cmap-canvas") && window.__m.dbg().draws > 0'));
    await settled();
    await sleep(200);
    const focused = await evaluate(`const d = window.__m.dbg(); const p = window.BuzzCourseMap.project(${JSON.stringify(SAMPLE)}); const r = window.__m.canvasRect(); return { d, inView: p.x > r.x && p.x < r.x + r.w && p.y > r.y && p.y < r.y + r.h, focus: document.activeElement && document.activeElement.classList.contains("cmap-canvas") };`);
    check("停在那一課：選中、在畫面裡、是一課一課那一層、鍵盤焦點在地圖上", focused.d.selected === SAMPLE && focused.inView && focused.d.level === "lesson" && focused.focus, `${focused.d.selected} · ${focused.d.level}`);

    // 絲滑：拖 60 格（每格一個 pointermove），量 rAF 間隔。
    // headless Chrome 是軟體合成：DPR 2 時光是把一張 390×(地圖高) 的 canvas 每格送上畫面就要 ~23ms（量過：空白 canvas 每格 fillRect 也一樣），
    // 那是測試環境的上限、不是地圖的成本。所以分兩件事量：DPR 1 下的 rAF 間隔（斷言 < 20ms），
    // DPR 2 下地圖自己每格的繪製時間（斷言 p95 < 8ms）；兩組數字都印出來。
    const dragProbe = `
      const cv = document.querySelector(".cmap-canvas");
      const r = cv.getBoundingClientRect();
      const x0 = r.left + r.width / 2;
      const y0 = r.top + r.height / 2;
      const ev = (type, x, y) => cv.dispatchEvent(new PointerEvent(type, { pointerId: 7, clientX: x, clientY: y, bubbles: true, isPrimary: true, pointerType: "touch" }));
      window.BuzzCourseMap.look(0.7);
      await new Promise((r2) => requestAnimationFrame(() => requestAnimationFrame(r2)));
      const before = window.BuzzCourseMap.debug().draws;
      const deltas = [];
      const draws = [];
      ev("pointerdown", x0, y0);
      let last = performance.now();
      for (let k = 1; k <= 60; k += 1) {
        await new Promise((r2) => requestAnimationFrame(r2));
        const now = performance.now();
        deltas.push(now - last);
        last = now;
        draws.push(window.BuzzCourseMap.debug().lastDrawMs);
        ev("pointermove", x0 - k * 6 + Math.sin(k / 4) * 20, y0 + Math.cos(k / 5) * 40);
      }
      ev("pointerup", x0 - 360, y0);
      const sorted = deltas.slice(1).sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      const p95 = sorted[Math.floor(sorted.length * 0.95)];
      const ds = draws.slice().sort((a, b) => a - b);
      return { median, p95, drawP95: ds[Math.floor(ds.length * 0.95)], maxDraw: ds[ds.length - 1], drawn: window.BuzzCourseMap.debug().draws - before };`;
    const hi = await evaluate(dragProbe);
    console.log(`  ·    幀時間（手機 390、DPR 2、課那一層、拖 60 格）：rAF 中位數 ${hi.median.toFixed(1)}ms、p95 ${hi.p95.toFixed(1)}ms；地圖每格繪製 p95 ${hi.drawP95.toFixed(1)}ms、最久 ${hi.maxDraw.toFixed(1)}ms；畫了 ${hi.drawn} 格`);
    check("DPR 2：拖曳時每格都重畫、地圖自己每格繪製 p95 < 8ms", hi.drawn >= 55 && hi.drawP95 < 8, `${hi.drawP95.toFixed(1)}ms`);
    await settled();
    await chrome.send("Emulation.setDeviceMetricsOverride", { ...PHONE, deviceScaleFactor: 1 });
    await sleep(300);
    const lo = await evaluate(dragProbe);
    console.log(`  ·    幀時間（手機 390、DPR 1、課那一層、拖 60 格）：rAF 中位數 ${lo.median.toFixed(1)}ms、p95 ${lo.p95.toFixed(1)}ms；地圖每格繪製 p95 ${lo.drawP95.toFixed(1)}ms；畫了 ${lo.drawn} 格`);
    check("DPR 1：拖曳時每格都重畫、rAF 間隔中位數 < 20ms", lo.drawn >= 55 && lo.median < 20, `${lo.median.toFixed(1)}ms`);
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);
    await sleep(300);
    await settled();
    const idle = await evaluate(`const a = window.BuzzCourseMap.debug().draws; await new Promise((r) => setTimeout(r, 500)); return window.BuzzCourseMap.debug().draws - a;`);
    check("閒著不重畫（0.5 秒內 0 格）", idle === 0, `${idle} 格`);
    // 放手有慣性：快速一甩之後相機還會滑一段
    const fling = await evaluate(`
      const cv = document.querySelector(".cmap-canvas");
      const r = cv.getBoundingClientRect();
      const x0 = r.left + r.width / 2;
      const y0 = r.top + r.height / 2;
      const ev = (type, x) => cv.dispatchEvent(new PointerEvent(type, { pointerId: 8, clientX: x, clientY: y0, bubbles: true, isPrimary: true, pointerType: "touch" }));
      ev("pointerdown", x0);
      for (let k = 1; k <= 6; k += 1) { await new Promise((r2) => requestAnimationFrame(r2)); ev("pointermove", x0 + k * 25); }
      ev("pointerup", x0 + 150);
      const tx = window.BuzzCourseMap.debug().tx;
      await new Promise((r2) => setTimeout(r2, 400));
      return { moved: window.BuzzCourseMap.debug().tx - tx };`);
    check("一甩放手有慣性（放手後還在滑）", fling.moved > 20, `${fling.moved.toFixed(0)}px`);
    await settled();

    // 深色
    await evaluate(`document.documentElement.dataset.theme = "dark"; return 1;`);
    await sleep(200);
    await evaluate(`window.BuzzCourseMap.look(0.9); return 1;`);
    await settled();
    const dark = await evaluate(`
      const cv = document.querySelector(".cmap-canvas");
      const px = cv.getContext("2d").getImageData(3, 3, 1, 1).data;
      const paper = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim();
      const card = document.querySelector(".cmap-card");
      const cs = card && !card.hidden ? getComputedStyle(card) : null;
      const h3 = card && card.querySelector("h3");
      return { px: "rgb(" + px[0] + "," + px[1] + "," + px[2] + ")", paper, cardContrast: cs && h3 ? window.__m.contrast(getComputedStyle(h3).color, cs.backgroundColor) : 0 };`);
    check("深色：地圖底色跟著換成深色", (await evaluate(`return window.__m.lum(${JSON.stringify(dark.px)});`)) < 0.03, `${dark.px} · --paper ${dark.paper}`);
    check("深色：小卡課名對比 ≥ 4.5", dark.cardContrast >= 4.5, dark.cardContrast.toFixed(1));
    await shot("phone-dark-selected");
    await evaluate(`window.__m.click('[data-cmap="close"]'); return 1;`);
    check("小卡的 × 收起選取", (await dbg()).selected === "" && (await evaluate(`return document.querySelector(".cmap-card").hidden;`)));
    if (SHOTS) {
      await evaluate(`const st = window.BUZZ_COURSE_MAP.stages[2]; window.BuzzCourseMap.look(0.36, st[0] + st[2] / 2, st[1] + st[3] / 2); return 1;`);
      await settled();
      await shot("phone-dark-chapters");
      await evaluate(`const m = window.BUZZ_COURSE_MAP; const i = ${JSON.stringify(IDS)}.indexOf(${JSON.stringify(SAMPLE)}); window.BuzzCourseMap.look(0.9, m.lessons[2 * i] + 60, m.lessons[2 * i + 1] + 100); return 1;`);
      await settled();
      await shot("phone-dark-lessons");
    }
    await evaluate(`window.BuzzCourseMap.look("fit"); return 1;`);
    await settled();
    await shot("phone-dark-stages-fit");
    await evaluate(`document.documentElement.dataset.theme = "light"; return 1;`);

    // prefers-reduced-motion：「＋」直接跳到位，不飛
    await chrome.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    const s0 = (await dbg()).scale;
    await evaluate(`document.querySelector('[data-cmap="in"]').click(); return 1;`);
    const still = await dbg();
    check("prefers-reduced-motion：縮放直接到位、沒有動畫", !still.animating && still.scale > s0 * 1.5, `×${s0.toFixed(2)} → ×${still.scale.toFixed(2)}`);
    await chrome.send("Emulation.setEmulatedMedia", { features: [] });

    // 回清單：清單還是原來的課程表
    await evaluate(`window.__m.click('[data-action="course-view"][data-mode="list"]'); return 1;`);
    check("切回清單：Stage 清單回來、地圖拆掉", await waitFor('document.querySelector(".cv2-stage") && !document.querySelector(".cmap-canvas")'));

    /* ── 桌機 ── */
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: false });
    await chrome.send("Emulation.setDeviceMetricsOverride", DESKTOP);
    await evaluate(`window.__m.click('[data-action="course-view"][data-mode="map"]'); return 1;`);
    await waitFor('document.querySelector(".cmap-canvas") && window.__m.dbg().draws > 0');
    await evaluate(`window.BuzzCourseMap.look("fit"); return 1;`);
    await settled();
    const desk = await evaluate(`return { d: window.__m.dbg(), overflow: window.__m.overflow() };`);
    check("桌機：整張圖一眼看得到 13 個 Stage", desk.d.visibleStages === OUTLINE.stages.length && desk.d.level === "stage", `${desk.d.visibleStages} · ×${desk.d.scale.toFixed(3)}`);
    check("桌機：沒有橫向溢出", desk.overflow <= 1, `${desk.overflow}px`);
    await shot("desktop-light-stages");
    // 滑鼠滾輪以游標為中心縮放
    const rr = await evaluate(`return window.__m.canvasRect();`);
    const mx = rr.x + rr.w * 0.3;
    const my = rr.y + rr.h * 0.6;
    const w0 = await dbg();
    await chrome.send("Input.dispatchMouseEvent", { type: "mouseWheel", x: mx, y: my, deltaX: 0, deltaY: -300 });
    await sleep(150);
    const w1 = await dbg();
    const wx0 = (mx - rr.x - w0.tx) / w0.scale;
    const wx1 = (mx - rr.x - w1.tx) / w1.scale;
    check("滾輪以游標為中心縮放（游標底下的點不跑掉）", w1.scale > w0.scale * 1.3 && Math.abs(wx1 - wx0) * w1.scale < 2, `×${w0.scale.toFixed(3)} → ×${w1.scale.toFixed(3)}`);
    // 點兩下放大
    const d0 = await dbg();
    for (let k = 0; k < 2; k += 1) {
      await chrome.send("Input.dispatchMouseEvent", { type: "mousePressed", x: mx, y: my, button: "left", clickCount: k + 1 });
      await chrome.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: mx, y: my, button: "left", clickCount: k + 1 });
      await sleep(60);
    }
    await settled();
    const d1 = await dbg();
    check("點兩下放大（有飛行動畫、停在兩倍左右）", d1.scale > d0.scale * 1.8, `×${d0.scale.toFixed(3)} → ×${d1.scale.toFixed(3)}`);
    const st = await evaluate(`const st = window.BUZZ_COURSE_MAP.stages[4]; window.BuzzCourseMap.look(0.4, st[0] + st[2] / 2, st[1] + st[3] / 2); return 1;`);
    await settled();
    await shot("desktop-light-chapters");
    await evaluate(`const m = window.BUZZ_COURSE_MAP; const i = ${JSON.stringify(IDS)}.indexOf(${JSON.stringify(SAMPLE)}); window.BuzzCourseMap.look(0.9, m.lessons[2 * i] + 120, m.lessons[2 * i + 1]); return 1;`);
    await settled();
    await shot("desktop-light-lessons");
    const at4 = await evaluate(`return window.BuzzCourseMap.project(${JSON.stringify(SAMPLE)});`);
    await chrome.send("Input.dispatchMouseEvent", { type: "mousePressed", x: at4.x, y: at4.y, button: "left", clickCount: 1 });
    await chrome.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: at4.x, y: at4.y, button: "left", clickCount: 1 });
    await settled();
    check("桌機：滑鼠點一課也選得到", (await dbg()).selected === SAMPLE);
    await shot("desktop-light-selected");
    await evaluate(`document.documentElement.dataset.theme = "dark"; return 1;`);
    await sleep(150);
    await shot("desktop-dark-selected");
    if (SHOTS) {
      await evaluate(`window.__m.click('[data-cmap="close"]'); const st = window.BUZZ_COURSE_MAP.stages[4]; window.BuzzCourseMap.look(0.4, st[0] + st[2] / 2, st[1] + st[3] / 2); return 1;`);
      await settled();
      await shot("desktop-dark-chapters");
      await evaluate(`const m = window.BUZZ_COURSE_MAP; const i = ${JSON.stringify(IDS)}.indexOf(${JSON.stringify(SAMPLE)}); window.BuzzCourseMap.look(0.9, m.lessons[2 * i] + 120, m.lessons[2 * i + 1]); return 1;`);
      await settled();
      await shot("desktop-dark-lessons");
    }
    await evaluate(`window.BuzzCourseMap.look("fit"); return 1;`);
    await settled();
    await shot("desktop-dark-stages");
    await evaluate(`document.documentElement.dataset.theme = "light"; return 1;`);

    const errors = chrome.pageErrors.concat(chrome.consoleMessages.filter((m) => m.type === "error").map((m) => m.text));
    check("console 沒有錯誤", !errors.length, errors.slice(0, 3).join(" | "));
    // 站外的請求（統計、字型）在沒網路的 CI 本來就會失敗；這裡只管站內的檔（Script／Fetch 以外的導覽中止也略過）
    const broken = chrome.failedRequests.filter((line) => !/ERR_NAME_NOT_RESOLVED|ERR_ABORTED|ERR_INTERNET_DISCONNECTED/.test(line));
    check("站內的檔沒有載入失敗", !broken.length, broken.slice(0, 3).join(" | "));
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
  ciFail("e2e_course_map crashed", error.message);
  process.exit(1);
});
