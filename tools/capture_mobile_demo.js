// 擷取手機版的真實畫面，供 demo/mobile.html 使用。
//
// 給投資人與 PM 看的東西不能用示意圖：他們要判斷的是「這個產品做到什麼程度」，
// 而示意圖只證明有人會畫圖。所以這裡開一個真的 390×844 視窗，
// 走完真實流程，把每一個畫面拍下來。
//
// 拍之前會先「養資料」：答對幾題、答錯幾題、在計算紙上寫字。
// 空狀態的截圖（「尚無錯題」「還沒有資料」）看起來像半成品，
// 而那不是這個產品現在的樣子。
//
// 用法：node tools/capture_mobile_demo.js
// 產出：demo/shots/*.png + demo/shots/manifest.json

"use strict";

const fs = require("fs");
const path = require("path");
const { launch } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "demo", "shots");
const VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 2, mobile: true };

const shots = [];
const problems = [];

// 彈窗會蓋住整個畫面。第一版沒有處理，結果十二張裡有好幾張拍到的是
// 同一個「提醒／知道了」對話框 —— 而那種截圖拿去給人看，比不給還糟。
const DISMISS = `
  let closed = 0;
  for (let i = 0; i < 4; i += 1) {
    const btn = [...document.querySelectorAll("button")]
      .find((b) => /知道了|關閉|我知道/.test(b.textContent || ""));
    if (!btn) break;
    btn.click();
    closed += 1;
    await new Promise((r) => setTimeout(r, 250));
  }
  return closed;
`;

async function shoot(chrome, name, note, options = {}) {
  await chrome.evaluate(DISMISS);
  if (options.scrollTo) {
    await chrome.evaluate(`
      const node = document.querySelector(${JSON.stringify(options.scrollTo)});
      if (node) node.scrollIntoView({ block: ${JSON.stringify(options.block || "center")} });
      await new Promise((r) => setTimeout(r, 400));
      return 1;
    `);
  }
  // 拍之前確認畫面上沒有蓋住一切的東西，也確認要拍的主體真的在
  const state = await chrome.evaluate(`
    const modal = document.querySelector(".modal-backdrop, [data-modal]");
    const want = ${JSON.stringify(options.expect || null)};
    return {
      modal: Boolean(modal && modal.getBoundingClientRect().height > 0),
      expectFound: want ? Boolean(document.querySelector(want)) : true,
      text: (document.body.innerText || "").replace(/\\s+/g, " ").slice(0, 120)
    };
  `);
  if (state.modal) problems.push(`${name}：畫面上還有彈窗蓋著`);
  if (!state.expectFound) problems.push(`${name}：找不到要拍的主體 ${options.expect}`);
  if (options.rejectText && new RegExp(options.rejectText).test(state.text)) {
    problems.push(`${name}：拍到空狀態（畫面上出現「${options.rejectText}」）`);
  }

  const result = await chrome.send("Page.captureScreenshot", { format: "png" });
  const file = path.join(OUT, `${name}.png`);
  fs.writeFileSync(file, Buffer.from(result.data, "base64"));
  const bytes = fs.statSync(file).size;
  shots.push({ name, note, bytes });
  const flag = state.modal || !state.expectFound ? " ⚠" : "  ";
  console.log(` ${flag}${name.padEnd(18)} ${String(Math.round(bytes / 1024)).padStart(4)} KB  ${note}`);
}

const click = (needle) => `
  const hit = [...document.querySelectorAll("button, a, [data-action]")]
    .find((n) => (n.innerText || "").replace(/\\s+/g, "").includes(${JSON.stringify(needle)}));
  if (hit) hit.click();
  return Boolean(hit);
`;

const sel = (selector) => `
  const node = document.querySelector(${JSON.stringify(selector)});
  if (node) node.click();
  return Boolean(node);
`;

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  console.log(`擷取手機畫面 ${VIEWPORT.width}×${VIEWPORT.height}@${VIEWPORT.deviceScaleFactor}x\n`);

  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", VIEWPORT);
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await chrome.navigate(`${server.url}/index.html`);
    await chrome.evaluate("localStorage.clear(); return 1;");
    await chrome.navigate(`${server.url}/index.html`);
    await chrome.sleep(700);

    /* ── 開場：進入產品的第一個畫面 ── */
    await shoot(chrome, "01-intro", "第一畫面：一句話說清楚這是什麼");

    await chrome.evaluate(click("開始"));
    await chrome.sleep(500);
    await chrome.evaluate(click("大一微積分"));
    await chrome.sleep(500);
    await shoot(chrome, "02-onboarding", "三步定位：只問決定起始難度的問題");

    await chrome.evaluate(click("直接開始練"));
    await chrome.sleep(1000);
    await chrome.evaluate(DISMISS);
    await chrome.sleep(300);

    /* ── 養資料：答幾題，對錯都要有 ── */
    // 「直接開始練」只是走完引導，落點是「今天」——這時候還沒有題目。
    // 第一版少了這一步，於是答題迴圈找不到任何選項，數據頁拍到的是空狀態。
    console.log("\n  養資料中（答題讓數據頁與錯題本有內容）…");
    const opened = await chrome.evaluate(`
      const go = [...document.querySelectorAll("button")]
        .find((b) => /^\\s*(開始|繼續|5 分鐘快刷)/.test((b.textContent || "").trim()));
      if (!go) return false;
      go.click();
      await new Promise((r) => setTimeout(r, 1400));
      return Boolean(document.querySelector(".choice-option, [data-tex]"));
    `);
    if (!opened) problems.push("養資料失敗：從「今天」開不了一局");
    await chrome.evaluate(DISMISS);
    await chrome.sleep(400);

    // 一定要把整局**打完**：紀錄是在結算時才提交的。
    // 而且要打好幾局 —— 技巧雷達需要「同一個技巧累積 8 題以上的限時作答」
    // 才會顯示，一局混合題型湊不到，畫面上就會是一圈「未測」。
    // 投資人看到的那張圖如果全是灰的，等於這個功能沒做。
    const PLAY_SESSION = `
      let answered = 0;
      let finished = false;
      for (let i = 0; i < 40 && !finished; i += 1) {
        const modalBtn = [...document.querySelectorAll("button")]
          .find((b) => /知道了|關閉/.test(b.textContent || ""));
        if (modalBtn) { modalBtn.click(); await new Promise((r) => setTimeout(r, 150)); }

        const opts = [...document.querySelectorAll(".choice-option")];
        if (opts.length) {
          // 故意錯三分之一 —— 弱點分析與錯題本要有東西才看得出這個產品在做什麼，
          // 但也不能錯太多，不然結算頁會是一片慘綠
          opts[i % 3 === 0 ? Math.min(1, opts.length - 1) : 0].click();
          answered += 1;
          await new Promise((r) => setTimeout(r, 320));
        }
        const next = [...document.querySelectorAll("button")].find((b) => /下一題/.test(b.textContent));
        if (next) { next.click(); await new Promise((r) => setTimeout(r, 280)); }
        finished = /結算|再打一局/.test(document.body.innerText || "");
      }
      return { answered, finished };
    `;

    let totalAnswered = (await chrome.evaluate(PLAY_SESSION)).answered;

    // 雷達的每一軸要 conf ≥ 0.4（約 5 題加權作答）才會顯示分數，否則是「未測」。
    // 每日訓練是混合題型，攤到九個技巧上每個都不到門檻 ——
    // 所以改成走主線關卡：每一關本來就集中在同一個技巧上，正好對應雷達的軸。
    const NODES = 9;
    for (let n = 0; n < NODES; n += 1) {
      const started = await chrome.evaluate(`
        const home = document.querySelector('[data-action="home"]');
        if (home) home.click();
        await new Promise((r) => setTimeout(r, 450));
        const train = document.querySelector('[data-action="open-train"]');
        if (train) train.click();
        await new Promise((r) => setTimeout(r, 800));
        const nodes = [...document.querySelectorAll('[data-action="start-path-node"]')];
        if (nodes.length <= ${n}) return { ok: false, why: "關卡數不足（只有 " + nodes.length + " 關）" };
        nodes[${n}].click();
        await new Promise((r) => setTimeout(r, 800));
        const lesson = document.querySelector('[data-action="start-path-lesson"]');
        if (lesson) lesson.click();
        await new Promise((r) => setTimeout(r, 1400));
        const modal = [...document.querySelectorAll("button")].find((b) => /知道了/.test(b.textContent || ""));
        if (modal) { modal.click(); await new Promise((r) => setTimeout(r, 300)); }
        return { ok: Boolean(document.querySelector(".choice-option")), why: "開了但沒有選項" };
      `);
      if (!started.ok) { problems.push(`第 ${n + 1} 關開不起來：${started.why}`); continue; }
      totalAnswered += (await chrome.evaluate(PLAY_SESSION)).answered;
    }

    // 這個檢查第一版是錯的：切到數據頁之後沒等它畫完就數「未測」，
    // 數到 0 就報「雷達滿了」—— 而畫面上其實一片未測。
    // 不會檢查的檢查比沒有檢查更糟，因為它會讓你停止懷疑。
    const radar = await chrome.evaluate(`
      const el = document.querySelector('[data-action="open-insights"]');
      if (el) el.click();
      await new Promise((r) => setTimeout(r, 1500));
      const text = document.body.innerText || "";
      if (!/技巧精熟雷達/.test(text)) return { rendered: false, untested: -1 };
      return { rendered: true, untested: (text.match(/未測/g) || []).length };
    `);
    console.log(`  共答 ${totalAnswered} 題，雷達${radar.rendered ? `上有 ${radar.untested} 個未測` : "沒有渲染出來"}`);
    if (!radar.rendered) problems.push("數據頁沒有渲染出雷達 —— 這個檢查本身失效了，不要相信它的結果");
    else if (radar.untested >= 5) problems.push(`雷達上有 ${radar.untested} 個未測 —— 這張圖拍出來會像功能沒做`);
    await chrome.evaluate(sel('[data-action="home"]'));
    await chrome.sleep(600);


    /* ── 作答畫面 ── */
    await chrome.evaluate(sel('[data-action="home"]'));
    await chrome.sleep(600);
    await chrome.evaluate(sel('[data-action="open-library"]'));
    await chrome.sleep(700);
    await chrome.evaluate(`
      const s = document.querySelector("[data-library-search]");
      if (s) { s.value = "dd-rr-001"; s.dispatchEvent(new Event("input", { bubbles: true })); }
      await new Promise((r) => setTimeout(r, 700));
      const go = document.querySelector('[data-action="start-problem"]');
      if (go) go.click();
      await new Promise((r) => setTimeout(r, 1100));
      return 1;
    `);
    await shoot(chrome, "03-question", "應用題：題幹會折行，選項與計算紙同一畫面", { expect: ".choice-option" });

    /* ── 計算紙 ── */
    await chrome.evaluate(sel('[data-board-action="toggle"]'));
    await chrome.sleep(600);
    await chrome.evaluate(`
      const c = document.querySelector("[data-blackboard]");
      if (!c) return 0;
      const r = c.getBoundingClientRect();
      const mv = "onpointerrawupdate" in c ? "pointerrawupdate" : "pointermove";
      const send = (t, fx, fy, p) => c.dispatchEvent(new PointerEvent(t, {
        bubbles: true, cancelable: true, pointerId: 1, pointerType: "pen",
        pressure: p, isPrimary: true,
        clientX: r.left + r.width * fx, clientY: r.top + r.height * fy
      }));
      // 寫一段看起來像在算的東西
      const strokes = [
        [[0.08, 0.20], [0.16, 0.20]],
        [[0.12, 0.14], [0.12, 0.30]],
        [[0.22, 0.16], [0.30, 0.28]],
        [[0.30, 0.16], [0.22, 0.28]],
        [[0.38, 0.14], [0.38, 0.30]],
        [[0.36, 0.14], [0.46, 0.14]],
        [[0.10, 0.46], [0.52, 0.46]],
        [[0.10, 0.60], [0.20, 0.72]],
        [[0.20, 0.60], [0.10, 0.72]],
        [[0.28, 0.60], [0.28, 0.76]],
        [[0.26, 0.60], [0.36, 0.60]],
        [[0.44, 0.62], [0.56, 0.62]],
        [[0.44, 0.70], [0.56, 0.70]],
        [[0.64, 0.58], [0.72, 0.76]],
        [[0.72, 0.58], [0.64, 0.76]]
      ];
      strokes.forEach((seg) => {
        const [a, b] = seg;
        send("pointerdown", a[0], a[1], 0.35);
        for (let i = 1; i <= 10; i += 1) {
          const t = i / 10;
          send(mv, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0.4 + 0.4 * Math.sin(t * Math.PI));
        }
        send("pointerup", b[0], b[1], 0.5);
      });
      await new Promise((r2) => setTimeout(r2, 300));
      return 1;
    `);
    await chrome.sleep(400);
    await shoot(chrome, "04-scratchpad", "手寫計算紙：壓感、方格紙、橡皮擦、復原重做", { scrollTo: "[data-blackboard]" });

    await chrome.evaluate(sel('[data-board-action="fullscreen"]'));
    await chrome.sleep(700);
    await shoot(chrome, "05-fullscreen", "全螢幕書寫：題目還在，書寫區佔滿畫面", { expect: "[data-blackboard]" });
    await chrome.evaluate(sel('[data-board-action="fullscreen"]'));
    await chrome.sleep(600);

    /* ── 答錯之後的解法階梯 ── */
    await chrome.evaluate(`
      const opts = [...document.querySelectorAll(".choice-option")];
      if (opts.length) opts[opts.length - 1].click();
      await new Promise((r) => setTimeout(r, 900));
      return 1;
    `);
    await shoot(chrome, "06-feedback", "答錯之後：三層解法階梯，不是直接把答案攤開");

    /* ── 其餘分頁 ── */
    const views = [
      ["08-today", '[data-action="home"]', "今天：每日任務與到期複習"],
      ["09-train", '[data-action="open-train"]', "訓練：模式、題包、難度上限"],
      ["10-insights", '[data-action="open-insights"]', "數據：技巧精熟雷達與弱點"],
      ["11-library", '[data-action="open-library"]', "題庫：1,605 題可搜尋、可篩選"],
      ["12-settings", '[data-action="open-settings"]', "設定：資料全在本機，可匯出可刪除"]
    ];
    for (const [name, selector, note] of views) {
      await chrome.evaluate(sel(selector));
      await chrome.sleep(900);
      await shoot(chrome, name, note, name === "10-insights" ? { rejectText: "還沒有資料|資料不足|還測不出來" } : {});
    }

    /* ── 商品頁 ── */
    await chrome.navigate(`${server.url}/workbook.html`, { appReady: false });
    await chrome.sleep(900);
    await shoot(chrome, "13-workbook", "作業本：290 頁 PDF，同一套題庫的紙本形式");

    fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(shots, null, 2) + "\n", "utf8");
    const total = shots.reduce((sum, s) => sum + s.bytes, 0);
    console.log(`\n共 ${shots.length} 張，合計 ${Math.round(total / 1024)} KB`);
    console.log(`寫到 ${path.relative(ROOT, OUT)}`);
    if (problems.length) {
      console.log(`
有 ${problems.length} 張不能用：`);
      problems.forEach((p) => console.log("  " + p));
    }
  } finally {
    await chrome.close();
    await server.stop();
  }
}

run().then(() => {
  if (problems.length) process.exit(1);
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
