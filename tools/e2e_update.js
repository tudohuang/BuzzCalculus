// 「主畫面的 app 不會更新」在真的 Chrome 裡走一次（Service Worker 的更新流程只有瀏覽器跑得出來）。
//
// 部署新版 ＝ 靜態伺服器改回一份改過的 src/app.js（APP_VERSION 換成測試用的版本）＋ 用 build_sw_revisions 重產的 sw.js
// （tools/lib/static_server.js 的 overrides，工作區的檔不動）。
//
// 斷言：
//   設定頁的「版本 v… · id · 日期」＝ sw.js 的 BUILD（版本、REVISIONS 的雜湊、BUILD_DATE）。
//   「檢查更新」沒有新版時說「已經是最新版」。
//   作答中部署新版 → 模擬回到前景（visibilitychange）→ registration.update() 找到新版、裝好在等；
//     不自動重新載入、作答中不出橫幅；離開作答之後橫幅出現（在畫面裡）、設定頁寫「目前 v… · 有新版本 v…」。
//   按「重新載入更新」→ 頁面換成新版（設定頁的版本跟著換）。
//   再部署一版、在首頁「從背景回來」、沒有動 → 自動換成新版（不用按）。
//   「檢查更新」找得到新版（按了之後出現「重新載入更新」）。
//   關掉伺服器：照樣開得起來，版本照樣看得到。
//
// 用法：node tools/e2e_update.js
"use strict";

const fs = require("fs");
const path = require("path");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");
const swBuild = require("./build_sw_revisions.js");

const ROOT = path.join(__dirname, "..");
const V1 = swBuild.tables().build;
const label = (b) => `${b.version} · ${b.id} · ${b.date}`;

let passed = 0;
const failures = [];
function check(name, ok, detail = "") {
  if (ok) { passed += 1; console.log(`  ok   ${name}${detail ? `  —— ${detail}` : ""}`); }
  else { failures.push(name); ciFail(name, detail); console.log(`  XX   ${name}${detail ? `  —— ${detail}` : ""}`); }
}

const HELPERS = `
  window.__u = window.__u || {
    act(action, data) {
      const b = document.createElement("button");
      b.dataset.action = action;
      Object.assign(b.dataset, data || {});
      document.querySelector("#app").appendChild(b);
      b.click();
      b.remove();
      return 1;
    },
    // 主畫面的 app 從背景回來：沒有導覽，只有 visibilitychange
    visibility(state) {
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => state });
      document.dispatchEvent(new Event("visibilitychange"));
      return 1;
    },
    // 測試不等 15 分鐘
    fast() { const u = window.BuzzAppUpdate; if (u) { u.tune.checkGap = 0; u.tune.resumeGap = 0; } return Boolean(u); },
    state() { return window.BuzzAppUpdate ? window.BuzzAppUpdate.state() : null; },
    text(sel) { const n = document.querySelector(sel); return n ? n.innerText.replace(/\\s+/g, " ").trim() : ""; },
    inView(sel) {
      const n = document.querySelector(sel);
      if (!n) return false;
      const r = n.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth;
    }
  };
`;

// 部署一版：app.js 換版本號（加一行註解讓內容一定不同），sw.js 照新內容重產
function deploy(server, version) {
  const app = `${fs.readFileSync(path.join(ROOT, "src", "app.js"), "utf8").replace(/const APP_VERSION = "[^"]+"/, `const APP_VERSION = "${version}"`)}\n// e2e_update ${version}\n`;
  const read = (rel) => (rel === "src/app.js" ? Buffer.from(app) : fs.readFileSync(path.join(ROOT, rel)));
  server.overrides.set("/src/app.js", app);
  server.overrides.set("/sw.js", swBuild.swSource(read));
  return swBuild.tables(read).build;
}

async function run() {
  console.log("E2E 更新與版本");
  const server = await staticServer.start(ROOT, 0);
  let serverUp = true;
  const chrome = await launch();
  const evaluate = (code) => chrome.evaluate(`${HELPERS}\n${code}`);
  const sleep = (ms) => chrome.sleep(ms);
  const waitFor = async (expr, ms = 15000) => {
    for (const deadline = Date.now() + ms; Date.now() < deadline; await sleep(200)) {
      if (await evaluate(`return Boolean(${expr});`).catch(() => false)) return true;
    }
    return false;
  };
  const ready = () => waitFor(`window.BuzzAppUpdate && window.__u.state().registered && window.__u.state().running && window.__u.fast()`, 30000);
  const settingsVersion = async () => {
    await evaluate(`window.__u.act("open-settings"); return 1;`);
    await waitFor(`document.querySelector("[data-version-running]")`);
    return evaluate(`return window.__u.text("[data-version-running]");`);
  };

  try {
    await chrome.send("Network.setBlockedURLs", { urls: ["*google-analytics.com*", "*googletagmanager.com*"] });
    // 手機寬度：主畫面的 app 就是這個樣子
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });

    /* ── 1. 第一版 ── */
    await chrome.navigate(`${server.url}/index.html`);
    await evaluate(`localStorage.clear(); localStorage.setItem("buzzcalculus.records.v1", JSON.stringify({ tours: { home: 1, quiz: 1 } })); return 1;`);
    await chrome.navigate(`${server.url}/index.html`);
    check("Service Worker 接手、更新模組載好、問得到這一版", await ready());
    const shown = await settingsVersion();
    check("設定頁的版本 ＝ sw.js 的 BUILD（版本 · REVISIONS 雜湊 · 建置日期）", shown === label(V1), `${shown}  vs  ${label(V1)}`);
    check("設定頁寫「版本」", /版本/.test(await evaluate(`return window.__u.text("[data-app-version]");`)));

    await evaluate(`document.querySelector('[data-action="check-update"]').click(); return 1;`);
    check("「檢查更新」沒有新版：說已經是最新版", await waitFor(`/已經是最新版/.test(window.__u.text("[data-app-version]"))`), await evaluate(`return window.__u.text("[data-app-version]");`));

    /* ── 2. 作答中部署新版 ── */
    const id = await evaluate(`return window.BUZZ_PROBLEMS[0].id;`);
    await evaluate(`window.__u.act("start-problem", { problemId: ${JSON.stringify(id)} }); window.__stillV1 = 1; return 1;`);
    check("開了一題、在作答", await waitFor(`document.querySelector('[data-action="choose-answer"], .answer-input')`));
    const V2 = deploy(server, "v9.9.1");
    await evaluate(`window.__u.visibility("hidden"); return 1;`);
    await sleep(300);
    await evaluate(`window.__u.visibility("visible"); return 1;`);
    check("回到前景 → registration.update() 找到新版、裝好在等", await waitFor(`window.__u.state().pending && window.__u.state().next`, 30000), JSON.stringify(await evaluate(`return window.__u.state();`)));
    check("等著的新版是剛部署的那一版", (await evaluate(`return window.__u.state().next;`) || {}).id === V2.id);
    await sleep(3500);
    check("作答中不自動重新載入", await evaluate(`return window.__stillV1 === 1 && Boolean(document.querySelector('[data-action="choose-answer"], .answer-input'));`));
    check("作答中不出橫幅", !(await evaluate(`return Boolean(document.querySelector("[data-update-banner]"));`)));

    /* ── 3. 離開作答：橫幅、設定頁 ── */
    await evaluate(`window.__u.act("home"); return 1;`);
    check("離開作答：「有新版本」橫幅出現、在畫面裡", await waitFor(`window.__u.inView("[data-update-banner]")`), await evaluate(`return window.__u.text("[data-update-banner]");`));
    check("橫幅寫新版的版本號", /v9\.9\.1/.test(await evaluate(`return window.__u.text("[data-update-banner]");`)));
    await evaluate(`window.__u.act("open-settings"); return 1;`);
    await waitFor(`document.querySelector("[data-update-next]")`);
    const both = await evaluate(`return window.__u.text("[data-app-version]");`);
    check("設定頁：目前 v… · 有新版本 v…", both.includes(`目前 ${label(V1)}`) && both.includes(`有新版本 ${label(V2)}`), both);
    check("換到設定頁橫幅還在", await evaluate(`return Boolean(document.querySelector("[data-update-banner]"));`));
    // 截圖給人看（docs/report/ 不進版控）
    try {
      await evaluate(`document.querySelector("[data-app-version]").scrollIntoView({ block: "center" }); return 1;`);
      await sleep(300);
      const shot = await chrome.send("Page.captureScreenshot", { format: "png" });
      fs.mkdirSync(path.join(ROOT, "docs", "report"), { recursive: true });
      fs.writeFileSync(path.join(ROOT, "docs", "report", "update-version-settings.png"), Buffer.from(shot.data, "base64"));
    } catch (_error) { /* 截圖不是斷言 */ }

    /* ── 4. 按「重新載入更新」 ── */
    await evaluate(`document.querySelector('[data-update-banner] [data-action="apply-update"]').click(); return 1;`);
    check("按了更新：頁面重新載入成新版", await waitFor(`window.__stillV1 === undefined && window.BuzzAppUpdate && window.__u.state().running && window.__u.state().running.id === ${JSON.stringify(V2.id)}`, 30000));
    await ready();
    const after = await settingsVersion();
    check("設定頁的版本換成新版", after === label(V2), after);
    // 真正的內容也換了（2026-10 的病：快取名沒換 → 新的 sw 一支都沒重抓，「更新」之後跑的還是舊的 app.js）
    check("換完拿到的 app.js 是新版的內容（不是舊快取）", await evaluate(`return (await (await fetch("./src/app.js")).text()).includes("// e2e_update v9.9.1");`));
    check("換完沒有殘留的「有新版本」", !(await evaluate(`return Boolean(document.querySelector("[data-update-banner], [data-update-next]"));`)));

    /* ── 5. 從背景回來、沒在忙、沒動 → 自動換 ── */
    await evaluate(`window.__u.act("home"); window.__stillV2 = 1; return 1;`);
    const V3 = deploy(server, "v9.9.2");
    await evaluate(`window.__u.visibility("hidden"); return 1;`);
    await sleep(300);
    await evaluate(`window.__u.visibility("visible"); return 1;`);
    check("首頁從背景回來、沒動：自動換成新版（不用按）", await waitFor(`window.__stillV2 === undefined && window.BuzzAppUpdate && window.__u.state().running && window.__u.state().running.id === ${JSON.stringify(V3.id)}`, 40000));

    /* ── 6. 「檢查更新」找得到新版 ── */
    await ready();
    const V4 = deploy(server, "v9.9.3");
    await settingsVersion();
    await evaluate(`window.__stillV3 = 1; document.dispatchEvent(new PointerEvent("pointerdown")); document.querySelector('[data-action="check-update"]').click(); return 1;`);
    check("「檢查更新」找到新版 → 出現「重新載入更新」", await waitFor(`document.querySelector('[data-app-version] [data-action="apply-update"]')`, 30000), await evaluate(`return window.__u.text("[data-app-version]");`));
    check("按了「檢查更新」（有動過）不自動重新載入", await evaluate(`return window.__stillV3 === 1;`));
    await evaluate(`document.querySelector('[data-app-version] [data-action="apply-update"]').click(); return 1;`);
    check("設定頁的「重新載入更新」換成新版", await waitFor(`window.__stillV3 === undefined && window.BuzzAppUpdate && window.__u.state().running && window.__u.state().running.id === ${JSON.stringify(V4.id)}`, 30000));

    /* ── 7. 離線 ── */
    await ready();
    await server.stop();
    serverUp = false;
    await chrome.send("Page.navigate", { url: "about:blank" });
    await sleep(300);
    await chrome.navigate(`${server.url}/index.html`);
    check("離線：照樣開得起來", await waitFor(`window.BUZZ_PROBLEMS && window.BUZZ_PROBLEMS.length > 100 && !document.querySelector(".app-skeleton")`));
    check("離線：版本照樣看得到", await waitFor(`window.BuzzAppUpdate && window.__u.state().running`, 20000) && (await settingsVersion()) === label(V4));
    check("沒有未攔下的例外", !chrome.pageErrors.length, chrome.pageErrors.slice(0, 2).join(" | "));
  } catch (error) {
    check("E2E 跑完", false, error.message);
  } finally {
    await chrome.close();
    if (serverUp) await server.stop();
  }
  console.log(`\n更新與版本 E2E：${passed} 過、${failures.length} 失敗`);
  if (failures.length) process.exitCode = 1;
}

run();
