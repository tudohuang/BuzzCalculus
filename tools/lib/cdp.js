// 最小的 Chrome DevTools Protocol 客戶端。
//
// 為什麼不用 puppeteer-core：這個專案的工具鏈是零依賴的 —— 21 支驗證器
// 全部只用 node 內建模組。為了跑 E2E 而長出一個 node_modules，
// 等於在部署路徑上多開一道供應鏈，代價跟收益不成比例。
//
// Node 22 內建了 WebSocket 與 fetch，而 CDP 本身就是「連上 ws、送 JSON」。
// 這支大概兩百行，做的事只有：開 Chrome、連上、送指令、收事件。
//
// 用法：
//   const chrome = await launch();
//   await chrome.send("Page.navigate", { url });
//   const value = await chrome.evaluate("document.title");
//   await chrome.close();

"use strict";

const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

// Chrome 可能在的位置。找不到就明講，不要靜默跳過測試 ——
// 「因為找不到瀏覽器所以視為通過」是最糟的 CI 行為。
const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  path.join(os.homedir(), ".cache/puppeteer/chrome/win64-135.0.7049.84/chrome-win64/chrome.exe"),
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
].filter(Boolean);

function findChrome() {
  for (const candidate of CANDIDATES) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch (_error) { /* 下一個 */ }
  }
  // puppeteer 的快取目錄版本號會變，掃一次
  const cache = path.join(os.homedir(), ".cache", "puppeteer", "chrome");
  try {
    for (const dir of fs.readdirSync(cache)) {
      const exe = path.join(cache, dir, "chrome-win64", "chrome.exe");
      if (fs.existsSync(exe)) return exe;
      const linux = path.join(cache, dir, "chrome-linux64", "chrome");
      if (fs.existsSync(linux)) return linux;
    }
  } catch (_error) { /* 沒有快取目錄 */ }
  return null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForEndpoint(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === "page");
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (_error) { /* 還沒起來 */ }
    await sleep(120);
  }
  throw new Error(`Chrome 的除錯埠 ${port} 在 ${timeoutMs}ms 內沒有回應`);
}

async function launch(options = {}) {
  const chromePath = findChrome();
  if (!chromePath) {
    throw new Error(
      "找不到 Chrome。設定 CHROME_PATH 環境變數指向執行檔，或安裝 Chrome。\n" +
      "（不要把「找不到瀏覽器」當成測試通過。）"
    );
  }

  const port = options.port || 9222 + Math.floor(Math.random() * 200);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "buzz-e2e-"));
  const args = [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--disable-background-timer-throttling",
    // 背景分頁會讓 requestAnimationFrame 停擺，入場動畫就卡在 opacity:0。
    // 那是實際踩過的坑，headless 下也要明確關掉節流。
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
    "--window-size=1280,900"
  ];

  // CI 的容器環境需要這兩個旗標：沙箱在容器裡常常起不來，
  // 而 /dev/shm 預設只有 64MB，Chrome 會在載入途中直接崩掉。
  // 只在 CI 加：本機開發沒有理由把沙箱關掉。
  if (process.env.CI) {
    args.push("--no-sandbox", "--disable-dev-shm-usage");
  }
  args.push("about:blank");

  const child = spawn(chromePath, args, { stdio: "ignore" });
  const wsUrl = await waitForEndpoint(port, options.timeout || 20000);

  const socket = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", () => reject(new Error("CDP WebSocket 連不上")), { once: true });
  });

  let nextId = 1;
  const pending = new Map();
  const consoleMessages = [];
  const pageErrors = [];
  const failedRequests = [];

  socket.addEventListener("message", (event) => {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch (_error) {
      return;
    }
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(`${message.error.message} (${JSON.stringify(message.error.data || "")})`));
      else resolve(message.result);
      return;
    }
    // 事件：console、未捕捉的例外、載入失敗的資源
    if (message.method === "Runtime.consoleAPICalled") {
      consoleMessages.push({
        type: message.params.type,
        text: (message.params.args || []).map((arg) => arg.value ?? arg.description ?? "").join(" ")
      });
    }
    if (message.method === "Runtime.exceptionThrown") {
      const details = message.params.exceptionDetails || {};
      pageErrors.push(details.exception ? (details.exception.description || details.text) : details.text);
    }
    if (message.method === "Network.loadingFailed") {
      failedRequests.push(message.params.errorText + " " + (message.params.type || ""));
    }
  });

  function send(method, params) {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params: params || {} }));
      setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          reject(new Error(`CDP ${method} 逾時`));
        }
      }, options.commandTimeout || 30000);
    });
  }

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");

  // 在頁面裡跑一段 JS，回傳它的值（支援 await）
  async function evaluate(expression) {
    const result = await send("Runtime.evaluate", {
      expression: `(async () => { ${expression} })()`,
      awaitPromise: true,
      returnByValue: true
    });
    if (result.exceptionDetails) {
      const details = result.exceptionDetails;
      throw new Error(
        "頁面內的 JS 丟出例外：" +
        (details.exception ? details.exception.description || details.exception.value : details.text)
      );
    }
    return result.result.value;
  }

  async function navigate(url) {
    await send("Page.navigate", { url });
    await waitForLoad();
  }

  // 等到 app 真的把畫面畫出來，而不只是 DOMContentLoaded。
  // app.js 的 render 是 rAF 驅動的，document 就緒不代表畫面就緒。
  async function waitForLoad(timeoutMs = 15000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      try {
        const ready = await evaluate(`
          const app = document.getElementById("app");
          return document.readyState === "complete" && app && app.innerHTML.length > 500;
        `);
        if (ready) return true;
      } catch (_error) { /* 導覽中，再等 */ }
      await sleep(120);
    }
    throw new Error("等不到頁面渲染完成");
  }

  async function close() {
    try { socket.close(); } catch (_error) { /* 已關 */ }
    try { child.kill(); } catch (_error) { /* 已結束 */ }
    await sleep(200);
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_error) { /* 檔案還被鎖著 */ }
  }

  return {
    send,
    evaluate,
    navigate,
    waitForLoad,
    close,
    sleep,
    consoleMessages,
    pageErrors,
    failedRequests,
    chromePath
  };
}

module.exports = { launch, findChrome, sleep };
