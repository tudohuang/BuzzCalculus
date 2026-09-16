// 計算紙的效能剖析（開發用，不進 CI）：開一局自己寫的題、攤開計算紙，
// 用 CDP 的 Profiler 錄下連畫幾十筆時主執行緒在做什麼，印出最吃時間的函式與長任務。
//
// 「有時候卡一下」這種回報靠猜修不好：卡的是繪製、是每秒的計時器 render、
// 還是 ResizeObserver 觸發整板重畫，剖析一次就知道。
//
// 用法：node tools/profile_board.js            預設 40 筆、每筆 120 個取樣
//       node tools/profile_board.js 80 200    筆數 取樣數

"use strict";

const path = require("path");
const { launch } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const STROKES = Number(process.argv[2] || 40);
const SAMPLES = Number(process.argv[3] || 120);

const PEN = `
  window.__pen = {
    canvas() { return document.querySelector("[data-blackboard]"); },
    at(fx, fy) {
      const rect = this.canvas().getBoundingClientRect();
      return { clientX: rect.left + rect.width * fx, clientY: rect.top + rect.height * fy };
    },
    send(type, fx, fy, options) {
      const opts = options || {};
      const point = this.at(fx, fy);
      const event = new PointerEvent(type, {
        bubbles: true, cancelable: true,
        pointerId: opts.pointerId == null ? 1 : opts.pointerId,
        pointerType: opts.pointerType || "pen",
        pressure: opts.pressure == null ? 0.5 : opts.pressure,
        isPrimary: true, clientX: point.clientX, clientY: point.clientY
      });
      this.canvas().dispatchEvent(event);
    },
    moveType() { return "onpointerrawupdate" in this.canvas() ? "pointerrawupdate" : "pointermove"; }
  };
`;

async function run() {
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  try {
    await chrome.navigate(server.url + "/index.html");
    await chrome.evaluate("localStorage.clear(); return 1;");
    await chrome.navigate(server.url + "/index.html");
    const click = async (needle, wait = 400) => {
      await chrome.evaluate(`const hit=[...document.querySelectorAll("button, a, [data-action]")].find((n)=>(n.innerText||"").replace(/\\s+/g,"").includes(${JSON.stringify(needle)})); if(hit) hit.click(); return 1;`);
      await chrome.sleep(wait);
    };
    await click("開始"); await click("大一微積分"); await click("直接開始練", 600); await click("訓練", 500);
    await chrome.evaluate(`const free=document.querySelector('[data-answer-mode="free"]'); if(free) free.click(); return 1;`);
    await chrome.sleep(400);
    await chrome.evaluate(`const n=document.querySelector('[data-action="start-path-node"]'); if(n) n.click(); return 1;`);
    await chrome.sleep(700);
    await chrome.evaluate(`const n=document.querySelector('[data-action="start-path-lesson"]'); if(n) n.click(); return 1;`);
    await chrome.sleep(900);
    await chrome.evaluate(`if(!document.querySelector("[data-blackboard]")){const t=document.querySelector('[data-board-action="toggle"]'); if(t) t.click();} return 1;`);
    await chrome.sleep(500);
    const ready = await chrome.evaluate(`return Boolean(document.querySelector("[data-blackboard]"));`);
    if (!ready) throw new Error("計算紙沒有攤開");

    // 長任務觀察器：主執行緒被佔超過 50ms 就記一筆
    await chrome.evaluate(`
      ${PEN}
      window.__long = [];
      try {
        new PerformanceObserver((list) => list.getEntries().forEach((e) => window.__long.push({ start: Math.round(e.startTime), ms: Math.round(e.duration) })))
          .observe({ entryTypes: ["longtask"] });
      } catch (e) {}
      return 1;
    `);

    await chrome.send("Profiler.enable");
    await chrome.send("Profiler.setSamplingInterval", { interval: 200 });
    await chrome.send("Profiler.start");
    const started = Date.now();
    const drew = await chrome.evaluate(`
      const move = window.__pen.moveType();
      const frame = () => new Promise((r) => requestAnimationFrame(r));
      let frames = 0;
      for (let s = 0; s < ${STROKES}; s += 1) {
        const y = 0.1 + 0.8 * ((s % 8) / 8);
        window.__pen.send("pointerdown", 0.05, y, { pointerId: 100 + s });
        for (let i = 1; i <= ${SAMPLES}; i += 1) {
          const t = i / ${SAMPLES};
          window.__pen.send(move, 0.05 + 0.9 * t, y + 0.04 * Math.sin(t * 20), { pointerId: 100 + s, pressure: 0.4 + 0.3 * Math.sin(t * 9) });
          if (i % 4 === 0) { await frame(); frames += 1; }
        }
        window.__pen.send("pointerup", 0.95, y, { pointerId: 100 + s });
        await frame(); frames += 1;
      }
      return { frames, long: window.__long };
    `);
    const wall = Date.now() - started;
    const { profile } = await chrome.send("Profiler.stop");

    // 每個節點的 self time = 它被抽到的樣本數 × 平均間隔
    const total = profile.endTime - profile.startTime;
    const byId = new Map(profile.nodes.map((node) => [node.id, node]));
    const selfMicros = new Map();
    profile.samples.forEach((id, index) => {
      selfMicros.set(id, (selfMicros.get(id) || 0) + (profile.timeDeltas[index] || 0));
    });
    const rows = [...selfMicros.entries()].map(([id, micros]) => {
      const node = byId.get(id);
      const frame = node.callFrame;
      const file = (frame.url || "").split("/").slice(-1)[0];
      return { name: frame.functionName || "(anonymous)", where: file ? `${file}:${frame.lineNumber + 1}` : "(native)", ms: micros / 1000 };
    });
    const byName = new Map();
    rows.forEach((row) => {
      const key = `${row.name} ${row.where}`;
      byName.set(key, (byName.get(key) || 0) + row.ms);
    });
    const top = [...byName.entries()].sort((a, b) => b[1] - a[1]).slice(0, 22);
    const idleKeys = ["(idle)", "(program)", "(garbage collector)", "(root)"];
    const busy = [...byName.entries()].filter(([key]) => !idleKeys.some((k) => key.startsWith(k))).reduce((sum, [, ms]) => sum + ms, 0);

    console.log(`畫了 ${STROKES} 筆 × ${SAMPLES} 取樣，${drew.frames} 個 frame，牆鐘 ${wall}ms，profile ${Math.round(total / 1000)}ms，主執行緒忙 ${Math.round(busy)}ms（${Math.round(busy / (total / 1000) * 100)}%）`);
    console.log(`長任務（>50ms）：${drew.long.length} 個${drew.long.length ? "，最長 " + Math.max(...drew.long.map((l) => l.ms)) + "ms" : ""}`);
    console.log("\n自身時間最多的函式：");
    top.forEach(([key, ms]) => console.log(`  ${ms.toFixed(1).padStart(7)}ms  ${key}`));
  } finally {
    await chrome.close();
    await server.stop();
  }
}

run().catch((error) => { console.error(error); process.exit(1); });
