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
    check("no uncaught browser exceptions", chrome.pageErrors.length === 0);
    console.log(`Storage E2E: ${passed}/${passed} passed`);
  } finally {
    if (chrome) await chrome.close();
    await server.stop();
  }
}

run().catch((error) => { console.error(error); ciFail("E2E storage 掛掉", error.message); process.exitCode = 1; });
