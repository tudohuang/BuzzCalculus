// 抓 app 的實際畫面給技術報告用（開發工具，不進 CI）。
// 走真的 Chrome（tools/lib/cdp.js），每張圖都是使用者真的會看到的狀態：
// 有筆跡的計算紙、白話證明的三色報告、課程的逐步示範、結算頁、手機首頁。
//
// 用法：node tools/capture_screens.js            寫到 docs/report/figures/
"use strict";

const fs = require("fs");
const path = require("path");
const { launch } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "docs", "report", "figures");
fs.mkdirSync(OUT, { recursive: true });

async function run() {
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const shot = async (name, clip) => {
    const params = { format: "png" };
    if (clip) params.clip = { x: 0, y: 0, width: clip.width, height: clip.height, scale: 1 };
    const { data } = await chrome.send("Page.captureScreenshot", params);
    fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(data, "base64"));
    console.log("wrote", name);
  };
  const click = async (selector, wait = 500) => {
    const hit = await chrome.evaluate(`const el=[...document.querySelectorAll(${JSON.stringify(selector)})].find(n=>n.getClientRects().length); if(el) el.click(); return !!el;`);
    await chrome.sleep(wait);
    return hit;
  };
  const clickText = async (needle, wait = 500) => {
    const hit = await chrome.evaluate(`const el=[...document.querySelectorAll("button, a, [data-action]")].find(n=>n.getClientRects().length && (n.innerText||"").includes(${JSON.stringify(needle)})); if(el) el.click(); return !!el;`);
    await chrome.sleep(wait);
    return hit;
  };
  const size = (width, height, mobile) => chrome.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile });

  try {
    await size(1280, 860, false);
    await chrome.navigate(server.url + "/index.html");
    await chrome.evaluate("localStorage.clear(); return 1;");
    await chrome.navigate(server.url + "/index.html");
    await shot("onboarding");
    await clickText("開始"); await clickText("大一微積分"); await clickText("直接開始練", 800);
    await click('button[data-action="dismiss-notice"]');

    // 1. 作答＋計算紙：自己寫、開主線第 1 關、攤開計算紙、用合成的筆畫幾筆
    await click('[data-action="open-train"]', 600);
    await chrome.evaluate(`const free=document.querySelector('[data-answer-mode="free"]'); if(free) free.click(); return 1;`);
    await chrome.sleep(400);
    await click('[data-action="start-path-node"]', 700);
    await click('[data-action="start-path-lesson"]', 900);
    await chrome.evaluate(`if(!document.querySelector("[data-blackboard]")){const t=document.querySelector('[data-board-action="toggle"]'); if(t) t.click();} return 1;`);
    await chrome.sleep(600);
    await chrome.evaluate(`
      const canvas = document.querySelector("[data-blackboard]");
      const rect = canvas.getBoundingClientRect();
      const send = (type, fx, fy, pressure, id) => canvas.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: id, pointerType: "pen", pressure, isPrimary: true, clientX: rect.left + rect.width * fx, clientY: rect.top + rect.height * fy }));
      const move = "onpointerrawupdate" in canvas ? "pointerrawupdate" : "pointermove";
      const frame = () => new Promise((r) => requestAnimationFrame(r));
      // 寫一條「lim」風格的曲線與一個分數線
      const strokes = [
        [[0.08,0.30],[0.12,0.22],[0.16,0.34],[0.20,0.24],[0.24,0.36]],
        [[0.30,0.20],[0.31,0.40]],
        [[0.36,0.30],[0.60,0.30]],
        [[0.40,0.14],[0.44,0.24],[0.48,0.14]],
        [[0.40,0.38],[0.48,0.50],[0.40,0.50],[0.48,0.38]]
      ];
      let id = 300;
      for (const s of strokes) {
        id += 1;
        send("pointerdown", s[0][0], s[0][1], 0.5, id);
        for (let i = 1; i < s.length; i += 1) {
          const [x0, y0] = s[i - 1]; const [x1, y1] = s[i];
          for (let t = 1; t <= 12; t += 1) { send(move, x0 + (x1 - x0) * t / 12, y0 + (y1 - y0) * t / 12, 0.35 + 0.4 * Math.sin(t / 3), id); }
          await frame();
        }
        send("pointerup", s[s.length - 1][0], s[s.length - 1][1], 0.5, id);
        await frame();
      }
      return 1;
    `);
    await chrome.sleep(500);
    await shot("quiz-board");

    // 離開這一局
    await click('[data-action="confirm-exit"]', 300); await click('[data-action="finish-now"]', 800); await click('[data-action="home"]', 500);

    // 2. 首頁（有一點資料之後）
    await shot("home");

    // 3. 白話證明：教學第一課，打一份 δ 取錯的證明
    await click('[data-action="open-proofs"]', 800);
    await shot("proof-index");
    await click('tr[data-proof-key="pl:pl-limit-linear"]', 900);
    await chrome.evaluate(`const t=document.querySelector('[data-proof-lang-text]'); t.value=${JSON.stringify("任取 ε > 0。\n取 δ = ε。\n假設 0 < |x − 2| < δ。\n則 |3x − 6| = 3|x − 2| < 3δ = ε。\n所以 lim_{x→2} 3x = 6。")}; t.dispatchEvent(new Event('input',{bubbles:true})); return 1;`);
    await chrome.sleep(1200);
    await shot("proof-editor");

    // 4. 入門課程：第 3 課，揭兩步
    await click('[data-action="open-course"]', 800);
    await shot("course-index");
    await click('[data-action="open-course-lesson"][data-lesson-id="c1-limit-meaning"]', 900);
    await click('[data-action="course-step"]', 300); await click('[data-action="course-step"]', 400);
    await shot("course-lesson");

    // 5. 結算頁：先切回選擇題（剛才為了計算紙切成自己寫），深連結一題、答對
    await click('[data-action="home"]', 500);
    await click('[data-action="open-train"]', 600);
    await chrome.evaluate(`const m=document.querySelector('[data-answer-mode="choice"]'); if(m) m.click(); return 1;`);
    await chrome.sleep(400);
    await chrome.navigate(server.url + "/index.html#p=lim-001");
    await chrome.sleep(800);
    const chose = await chrome.evaluate(`const c=document.querySelector('[data-choice="1"]'); if(c) c.click(); return !!c;`);
    if (!chose) console.log("warn: no choice button on deep link");
    await chrome.sleep(2600);
    await shot("results");

    // 6. 數據頁
    await chrome.navigate(server.url + "/index.html");
    await chrome.sleep(600);
    await click('[data-action="open-insights"]', 900);
    await shot("insights");

    // 7. 手機首頁與作答
    await size(390, 844, true);
    await chrome.navigate(server.url + "/index.html");
    await chrome.sleep(800);
    await shot("phone-home");
    await chrome.navigate(server.url + "/index.html#p=der-001");
    await chrome.sleep(800);
    await shot("phone-quiz");
  } finally {
    await chrome.close();
    await server.stop();
  }
}

run().catch((error) => { console.error(error); process.exit(1); });
