// 手機版面：頁面不准橫向溢出。
//
// README 第一句賣點是「手機優先的選擇題練習」，但所有的 E2E 都跑在 1280 寬。
// 窄畫面壞掉的方式跟寬畫面完全不同，而且它是**看得到但測不到**的那一種：
// DOM 完整、文字都在、console 乾淨 —— 只是有一半在畫面外，要橫著拖才看得到。
//
// 這支用 CDP 的 Emulation.setDeviceMetricsOverride 開一個真的 390×844 的
// iPhone 視窗（不是把桌機視窗縮小 —— 那不會觸發 CSS 的行動裝置分支），
// 然後對每一個對外頁面與每一個 app 內主要畫面量一件事：
//
//   document.documentElement.scrollWidth <= innerWidth
//
// 順便量每一個可點元素的觸控目標大小：手指不是滑鼠，
// 24px 的按鈕在手機上按不準，而這件事在桌機截圖上完全看不出來。

"use strict";

const path = require("path");
const { launch } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 3, mobile: true };
// 觸控目標的下限。Apple HIG 是 44pt、Material 是 48dp；取 40 當硬門檻，
// 低於這個數字在手機上就是會按錯，不是「小一點但還好」。
const MIN_TAP = 40;

let passed = 0;
const failures = [];

function check(label, ok, detail) {
  if (ok) {
    passed += 1;
    console.log(`  ok   ${label}${detail ? `  —— ${detail}` : ""}`);
  } else {
    failures.push({ label, detail });
    console.log(`  XX   ${label}${detail ? `  —— ${detail}` : ""}`);
  }
}

const OVERFLOW_PROBE = `
  const el = document.documentElement;
  const worst = [];
  document.querySelectorAll("body *").forEach((node) => {
    const rect = node.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const over = Math.round(rect.right - window.innerWidth);
    if (over > 1) {
      worst.push({
        over,
        tag: node.tagName.toLowerCase(),
        cls: (node.className && node.className.toString().slice(0, 40)) || "",
        text: (node.textContent || "").trim().slice(0, 24)
      });
    }
  });
  worst.sort((a, b) => b.over - a.over);
  return {
    scrollWidth: el.scrollWidth,
    innerWidth: window.innerWidth,
    overflow: el.scrollWidth - window.innerWidth,
    worst: worst.slice(0, 4)
  };
`;

// 手指不是滑鼠。小於 MIN_TAP 的可點元素在手機上就是會按錯，
// 而這件事在桌機截圖上完全看不出來 —— 只有量才看得到。
const TAP_PROBE = `
  const SELECTOR = "button, [data-action], a.button, [data-board-action]";
  const small = [];
  document.querySelectorAll(SELECTOR).forEach((node) => {
    const rect = node.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    if (node.closest("[hidden]")) return;
    // 被父層蓋住或收起來的（收合的計算紙工具列）不算
    if (getComputedStyle(node).visibility === "hidden") return;
    const side = Math.min(rect.width, rect.height);
    if (side < ${MIN_TAP}) {
      small.push({
        side: Math.round(side),
        label: (node.getAttribute("title") || node.textContent || node.getAttribute("aria-label") || "?").trim().slice(0, 14)
      });
    }
  });
  small.sort((a, b) => a.side - b.side);
  return { total: document.querySelectorAll(SELECTOR).length, small };
`;

async function run() {
  const server = await staticServer.start(path.join(__dirname, ".."), 0);
  const chrome = await launch();
  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", VIEWPORT);
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });

    console.log(`E2E 手機版面 ${VIEWPORT.width}×${VIEWPORT.height}\n`);

    /* ── 1. 對外靜態頁 ── */
    const staticPages = [
      ["首頁 / 訓練台", "index.html", true],
      ["商品頁", "workbook.html", false],
      ["關於", "about.html", false],
      ["服務條款", "terms.html", false],
      ["隱私政策", "privacy.html", false],
      ["更新紀錄", "changelog.html", false]
    ];

    for (const [label, file, appReady] of staticPages) {
      await chrome.navigate(`${server.url}/${file}`, { appReady });
      await chrome.sleep(600);
      const probe = await chrome.evaluate(OVERFLOW_PROBE);
      const detail = probe.overflow > 1
        ? `溢出 ${probe.overflow}px；最寬的是 ${probe.worst.map((w) => `${w.tag}.${w.cls}(+${w.over}px)`).join(", ")}`
        : `${probe.scrollWidth} / ${probe.innerWidth}`;
      check(`${label} 不會橫向溢出`, probe.overflow <= 1, detail);
    }

    /* ── 2. app 內的主要畫面 ── */
    await chrome.navigate(`${server.url}/index.html`);
    await chrome.sleep(800);
    // 跳過導覽用的入場畫面
    await chrome.evaluate(`
      const start = [...document.querySelectorAll("button")].find((b) => /開始/.test(b.textContent));
      if (start) start.click();
      await new Promise((r) => setTimeout(r, 900));
      const skip = [...document.querySelectorAll("button")].find((b) => /直接開始練/.test(b.textContent));
      if (skip) skip.click();
      await new Promise((r) => setTimeout(r, 900));
      return true;
    `);

    const views = [
      ["今天", '[data-action="home"]'],
      ["訓練", '[data-action="open-train"]'],
      ["數據", '[data-action="open-insights"]'],
      ["題庫", '[data-action="open-library"]'],
      ["設定", '[data-action="open-settings"]']
    ];

    for (const [label, selector] of views) {
      const opened = await chrome.evaluate(`
        const node = document.querySelector(${JSON.stringify(selector)});
        if (!node) return false;
        node.click();
        await new Promise((r) => setTimeout(r, 700));
        return true;
      `);
      if (!opened) {
        check(`「${label}」不會橫向溢出`, false, `找不到 ${selector}`);
        continue;
      }
      const probe = await chrome.evaluate(OVERFLOW_PROBE);
      const detail = probe.overflow > 1
        ? `溢出 ${probe.overflow}px；最寬的是 ${probe.worst.map((w) => `${w.tag}.${w.cls}(+${w.over}px)`).join(", ")}`
        : `${probe.scrollWidth} / ${probe.innerWidth}`;
      check(`「${label}」不會橫向溢出`, probe.overflow <= 1, detail);

      const taps = await chrome.evaluate(TAP_PROBE);
      check(
        `「${label}」的按鈕手指按得到`,
        taps.small.length === 0,
        taps.small.length
          ? `${taps.small.length} 個小於 ${MIN_TAP}px：` + taps.small.slice(0, 5).map((s) => `「${s.label}」${s.side}px`).join("、")
          : `${taps.total} 個可點元素都 ≥ ${MIN_TAP}px`
      );
    }

    /* ── 3. 作答畫面：最重要的那一頁 ── */
    const quiz = await chrome.evaluate(`
      // 從題庫挑一題開練：比從首頁按「開始」穩定，因為首頁的按鈕文字
      // 會隨當天的任務狀態變動（開始 / 繼續 / 5 分鐘快刷）。
      document.querySelector('[data-action="open-library"]').click();
      await new Promise((r) => setTimeout(r, 900));
      const start = document.querySelector('[data-action="start-problem"]');
      if (!start) return { started: false, why: "題庫裡沒有可開始的題目" };
      start.click();
      await new Promise((r) => setTimeout(r, 1400));
      const ack = [...document.querySelectorAll("button")].find((b) => /知道了/.test(b.textContent));
      if (ack) { ack.click(); await new Promise((r) => setTimeout(r, 500)); }
      const prompt = document.querySelector("[data-tex]");
      return { started: Boolean(prompt), why: prompt ? "" : "作答畫面沒有題目" };
    `);
    if (quiz.started) {
      const probe = await chrome.evaluate(OVERFLOW_PROBE);
      const detail = probe.overflow > 1
        ? `溢出 ${probe.overflow}px；最寬的是 ${probe.worst.map((w) => `${w.tag}.${w.cls}(+${w.over}px)`).join(", ")}`
        : `${probe.scrollWidth} / ${probe.innerWidth}`;
      check("作答畫面不會橫向溢出", probe.overflow <= 1, detail);

      // 手指按得到嗎
      const taps = await chrome.evaluate(TAP_PROBE);
      check(
        "作答畫面的按鈕手指按得到",
        taps.small.length === 0,
        taps.small.length
          ? `${taps.small.length} 個小於 ${MIN_TAP}px：` + taps.small.slice(0, 6).map((s) => `「${s.label}」${s.side}px`).join("、")
          : `${taps.total} 個可點元素都 ≥ ${MIN_TAP}px`
      );
    } else {
      check("作答畫面不會橫向溢出", false, quiz.why || "開不了一局");
    }

    /* ── 4. console 要乾淨 ── */
    const errors = chrome.consoleMessages.filter((m) => m.level === "error");
    check("console 沒有錯誤", errors.length === 0, errors.slice(0, 2).map((e) => e.text).join(" / "));
    check("沒有未捕捉的例外", chrome.pageErrors.length === 0, chrome.pageErrors.slice(0, 2).join(" / "));
  } finally {
    await chrome.close();
    await server.stop();
  }

  const total = passed + failures.length;
  console.log(`\nE2E 手機: ${passed}/${total} 通過`);
  if (failures.length) {
    console.log(`\n失敗 ${failures.length} 項：`);
    failures.forEach((f) => console.log(`  ${f.label}  ${f.detail || ""}`));
    process.exit(1);
  }
  console.log("mobile OK");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
