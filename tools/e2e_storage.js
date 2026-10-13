"use strict";

// Exercise quota failure in a disposable browser profile, never in a user's storage.
const assert = require("node:assert/strict");
const path = require("node:path");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

async function run() {
  const server = await staticServer.start(path.join(__dirname, ".."), 0);
  let chrome;
  let passed = 0;
  const check = (name, value) => {
    assert.ok(value, name);
    passed += 1;
    console.log(`PASS ${name}`);
  };
  try {
    chrome = await launch();
    await chrome.send("Network.setBlockedURLs", { urls: ["*google-analytics.com*", "*googletagmanager.com*"] });
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
    await chrome.navigate(server.url + "/index.html#p=lim-001");
    await chrome.evaluate(`
      window.__storageSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        if (key === 'buzzcalculus.records.v1') throw new DOMException('Test quota failure', 'QuotaExceededError');
        return window.__storageSetItem.call(this, key, value);
      };
      document.querySelector('[data-choice="1"]').click();
    `);
    await chrome.sleep(2400);
    check("quota failure still reaches results", await chrome.evaluate(`return !!document.querySelector('.results-screen');`));
    check("unsaved warning is visible", await chrome.evaluate(`
      const warning = document.querySelector('.storage-warning');
      return warning && warning.getBoundingClientRect().height > 0 && warning.innerText.includes('關閉或重新整理可能遺失');
    `));
    check("no horizontal overflow on mobile", await chrome.evaluate(`return document.documentElement.scrollWidth <= innerWidth + 1;`));
    check("backup and retry buttons fit mobile", await chrome.evaluate(`
      return [...document.querySelectorAll('.storage-warning button')].length === 2 &&
        [...document.querySelectorAll('.storage-warning button')].every(button => {
          const r = button.getBoundingClientRect();
          return r.height >= 44 && r.left >= 0 && r.right <= innerWidth + 1;
        });
    `));
    check("unsaved changes request a leave warning", await chrome.evaluate(`
      const event = new Event('beforeunload', { cancelable: true });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    `));
    await chrome.evaluate(`document.querySelector('[data-action="retry-records-save"]').click();`);
    await chrome.sleep(300);
    check("failed retry keeps unsaved warning", await chrome.evaluate(`return !!document.querySelector('.storage-warning');`));
    // Capture the actual export Blob without writing a download to the host.
    const exported = await chrome.evaluate(`
      const create = URL.createObjectURL;
      const click = HTMLAnchorElement.prototype.click;
      URL.createObjectURL = function(blob) { window.__backupBlob = blob; return create.call(this, blob); };
      HTMLAnchorElement.prototype.click = function() { if (!this.download) click.call(this); };
      try { document.querySelector('.storage-warning [data-action="export-records"]').click(); }
      finally { URL.createObjectURL = create; HTMLAnchorElement.prototype.click = click; }
      return JSON.parse(await window.__backupBlob.text());
    `);
    check("export is a valid backup envelope", exported.format === "buzz.records" && exported.version === 2);
    check("export contains unsaved quiz result", exported.records.history.length === 1 && exported.records.history[0].answers[0].correct);
    check("export contains unsaved attempt", exported.records.attemptLog.length === 1);
    const saved = await chrome.evaluate(`
      Storage.prototype.setItem = window.__storageSetItem;
      document.querySelector('[data-action="retry-records-save"]').click();
      return JSON.parse(localStorage.getItem('buzzcalculus.records.v1'));
    `);
    check("retry saves result without duplication", saved.history.length === 1 && saved.attemptLog.length === 1);
    await chrome.sleep(300);
    check("successful save clears warning", await chrome.evaluate(`return !document.querySelector('.storage-warning');`));
    check("saved changes no longer block leaving", await chrome.evaluate(`
      const event = new Event('beforeunload', { cancelable: true });
      window.dispatchEvent(event);
      return !event.defaultPrevented;
    `));
    await chrome.navigate(server.url + "/index.html");
    check("recovered record survives reload", await chrome.evaluate(`
      const records = JSON.parse(localStorage.getItem('buzzcalculus.records.v1'));
      return records.history.length === 1 && records.attemptLog.length === 1 && !document.querySelector('.storage-warning');
    `));
    await chrome.evaluate(`await navigator.serviceWorker.ready;`);
    await chrome.send("Network.emulateNetworkConditions", { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
    // 真的重載：從 index.html 換到 index.html#p=… 只是改 hash，頁面不會重新載入，
    // 測到的是 hashchange（而且跟它賽跑，CI 上十次有六次輸）而不是 service worker。
    // 先離開這一頁再回來，才是「離線重載」。
    await chrome.send("Page.navigate", { url: "about:blank" });
    await chrome.sleep(300);
    await chrome.navigate(server.url + "/index.html#p=der-044");
    let offlineReady = false;
    for (const deadline = Date.now() + 8000; !offlineReady && Date.now() < deadline; await chrome.sleep(150)) {
      offlineReady = await chrome.evaluate(`
        return !!window.BuzzAnswerSampling && window.BUZZ_PROBLEMS.some(problem => problem.id === 'der-044') && !!document.querySelector('[data-choice]');
      `);
    }
    check("offline reload includes the answer checker", offlineReady);
    check("offline reload preserves recovered records", await chrome.evaluate(`
      return JSON.parse(localStorage.getItem('buzzcalculus.records.v1')).history.length === 1;
    `));
    // ── 課程進度跟著本機存檔走：種一份完整的課程進度 → 匯出 → 換一台空的裝置（清空）→ 匯入 →
    //    每個課程欄位一模一樣、課程表上的層級點一樣；最後「清除資料」整個命名空間都掃掉。
    await chrome.send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    const KEY = "buzzcalculus.records.v1";
    const fresh = `{ onboardingSeen: true, onboardingLevel: "beginner", tours: { home: 1, quiz: 1 }, settings: { showAllFeatures: true } }`;
    const until = async (expr, ms = 8000) => {
      for (const deadline = Date.now() + ms; Date.now() < deadline; await chrome.sleep(150)) if (await chrome.evaluate(`return Boolean(${expr});`)) return true;
      return false;
    };
    const reload = async () => { await chrome.send("Page.navigate", { url: "about:blank" }); await chrome.sleep(200); await chrome.navigate(server.url + "/index.html"); };
    await chrome.evaluate(`localStorage.clear(); localStorage.setItem("${KEY}", JSON.stringify(${fresh})); return 1;`);
    await reload();
    await chrome.evaluate(`document.querySelector('[data-action="open-course"]').click(); return 1;`);
    check("course list loads", await until(`window.BUZZ_COURSE_V2 && document.querySelector(".cv2-index .cv2-row")`));
    // 三課有核心題也有挑戰題：第一課全對（全破）、第二課核心題對（熟練）、第三課只完成
    const seeded = await chrome.evaluate(`
      const bank = new Set((window.BUZZ_PROBLEMS || []).map((p) => p.id));
      const flat = []; window.BUZZ_COURSE_V2.stages.forEach((s) => s.chapters.forEach((c) => c.lessons.forEach((l) => flat.push(l))));
      const toks = (l) => String(l.practice || "").split(" ").filter(Boolean).filter((t) => bank.has(t.replace(/[*!]$/, "")));
      // 三課的題目不重疊（同一題可能掛在兩課下，第一課全對會順便讓別課變全破）
      const L = []; const used = new Set();
      flat.filter((l) => typeof l.read === "number" && toks(l).some((t) => t.endsWith("*")) && toks(l).some((t) => t.endsWith("!"))).forEach((l) => {
        const ids = toks(l).map((t) => t.replace(/[*!]$/, ""));
        if (L.length < 3 && ids.every((id) => !used.has(id))) { L.push(l); ids.forEach((id) => used.add(id)); }
      });
      const at = "2026-10-01T00:00:00.000Z";
      const problemStats = {};
      toks(L[0]).forEach((t) => { problemStats[t.replace(/[*!]$/, "")] = { correct: 1, wrong: 0, total: 1 }; });
      toks(L[1]).filter((t) => t.endsWith("*")).forEach((t) => { problemStats[t.slice(0, -1)] = { correct: 2, wrong: 1, total: 3 }; });
      const records = Object.assign(${fresh}, {
        xp: 275,
        courseV2: Object.fromEntries(L.map((l, i) => [l.id, { openedAt: at, doneAt: at, quizBest: 3, quizAt: at, picks: { 0: [0] }, secAt: 2, secDone: [0, 1, 2], xp: 35 + i, tierXp: 3 - i, solve: { 1: "first" }, rvAt: at, rvStep: 1, rvItems: ["x"] }])),
        courseV2Boss: { "1A": { solvedAt: at } },
        courseReadDays: { "2026-10-01": 3, "2026-10-02": 1 },
        courseMap: { goal: L[2].id, filter: "ready" },
        courseGraduation: { correct: 8, total: 10, passed: true },
        problemStats
      });
      records.settings = Object.assign(records.settings, { narrRate: 1.25, narrSubs: true });
      localStorage.setItem("${KEY}", JSON.stringify(records));
      return { ids: L.map((l) => l.id), records };`);
    const COURSE_KEYS = ["courseV2", "courseV2Boss", "courseReadDays", "courseMap", "courseGraduation", "xp"];
    const tiersOnScreen = async () => {
      await reload();
      await chrome.evaluate(`document.querySelector('[data-action="open-course"]').click(); return 1;`);
      await until(`document.querySelector(".cv2-index .cv2-row")`);
      return chrome.evaluate(`return ${JSON.stringify(seeded.ids)}.map((id) => { const dot = document.querySelector('.cv2-row[data-lesson-id="' + id + '"] .cv2-dot'); return dot ? dot.className.replace("cv2-dot", "").trim() : "?"; }).join(",");`);
    };
    const before = await tiersOnScreen();
    check(`seeded course tiers show on the list (全破, 熟練, 完成): ${before}`, before === "t3,t2,t1");
    await chrome.evaluate(`document.querySelector('[data-action="open-settings"]').click(); return 1;`);
    await until(`document.querySelector('.data-card [data-action="export-records"]')`);
    check("data card counts finished lessons", await chrome.evaluate(`return document.querySelector(".data-card .mini-stats").innerText.replace(/\\s+/g, " ").includes("課程完成 3");`));
    const backup = await chrome.evaluate(`
      const create = URL.createObjectURL;
      const click = HTMLAnchorElement.prototype.click;
      URL.createObjectURL = function(blob) { window.__courseBlob = blob; return create.call(this, blob); };
      HTMLAnchorElement.prototype.click = function() { if (!this.download) click.call(this); };
      try { document.querySelector('.data-card [data-action="export-records"]').click(); }
      finally { URL.createObjectURL = create; HTMLAnchorElement.prototype.click = click; }
      return await window.__courseBlob.text();`);
    const exportedCourse = JSON.parse(backup).records;
    check("export carries every course key", COURSE_KEYS.every((key) => JSON.stringify(exportedCourse[key]) === JSON.stringify(seeded.records[key])));
    // 換一台空的裝置
    await chrome.evaluate(`localStorage.clear(); localStorage.setItem("${KEY}", JSON.stringify(${fresh})); return 1;`);
    check("cleared device has no tiers", (await tiersOnScreen()) === ",,");
    await chrome.evaluate(`document.querySelector('[data-action="open-settings"]').click(); return 1;`);
    await until(`document.querySelector("#import-records")`);
    await chrome.evaluate(`
      const input = document.querySelector("#import-records");
      const dt = new DataTransfer();
      dt.items.add(new File([${JSON.stringify(backup)}], "buzz-calculus.json", { type: "application/json" }));
      input.files = dt.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      return 1;`);
    check("import notice names the course progress", await until(`document.body.innerText.includes("課程完成從 0 課增加到 3 課")`));
    const imported = await chrome.evaluate(`return JSON.parse(localStorage.getItem("${KEY}"));`);
    const diff = COURSE_KEYS.filter((key) => JSON.stringify(imported[key]) !== JSON.stringify(seeded.records[key]));
    check(`import restores every course key${diff.length ? " (differs: " + diff.join(",") + ")" : ""}`, !diff.length);
    check("import keeps solved practice problems and narration prefs", Object.keys(seeded.records.problemStats).every((id) => imported.problemStats[id] && imported.problemStats[id].correct === seeded.records.problemStats[id].correct) && imported.settings.narrRate === 1.25 && imported.settings.narrSubs === true);
    check("same lesson tiers on screen after import", (await tiersOnScreen()) === before);
    // 清除資料：課程進度跟其他東西一起走，命名空間一個 key 都不留
    await chrome.evaluate(`document.querySelector('[data-action="open-settings"]').click(); return 1;`);
    await until(`document.querySelector('[data-action="reset-records"]')`);
    await chrome.evaluate(`document.querySelector('[data-action="reset-records"]').click(); return 1;`);
    await until(`document.querySelector('[data-action="confirm-erase"]')`);
    await chrome.evaluate(`document.querySelector('[data-action="confirm-erase"]').click(); return 1;`);
    await chrome.sleep(400);
    check("erase sweeps course progress with the namespace", await chrome.evaluate(`const left = Object.keys(localStorage).filter((k) => k.startsWith("buzzcalculus.")).map((k) => JSON.parse(localStorage.getItem(k) || "{}")); return left.every((r) => !r || !r.courseV2 || !Object.keys(r.courseV2).length);`));

    check("no uncaught browser exceptions", chrome.pageErrors.length === 0);
    console.log(`Storage E2E: ${passed}/${passed} passed`);
  } finally {
    if (chrome) await chrome.close();
    await server.stop();
  }
}

run().catch((error) => { console.error(error); ciFail("E2E storage 掛掉", error.message); process.exitCode = 1; });
