// 版面回歸測試：外殼的幾何不變量。
//
// 2026-09 大改版全靠肉眼驗收，過程中真的漏掉一個版面 bug：
// 手機的底部分頁列因為 backdrop-filter 的包含塊效應貼到了「頂列的底」
// 而不是「螢幕的底」—— 畫面上看是分頁列跑到最上面。肉眼在桌面截圖上
// 看不到它，是手機截圖拍出來才發現。
//
// 為什麼不做像素快照：CI 在 Linux、開發機在 Windows，字型度量不同，
// 像素比對必然 flaky，而 flaky 的測試最後都會被人無視。
// 幾何不變量（分頁列貼底、側欄靠左、內容不被蓋住、無橫向捲動）
// 跨平台是確定的，而且它抓的正是「版面壞掉」的定義本身。
//
// 用法：node tools/e2e_layout.js

"use strict";

const path = require("path");
const { launch } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");

let passed = 0;
const failures = [];
function check(name, ok, detail = "") {
  if (ok) {
    passed += 1;
    console.log(`  ok   ${name}${detail ? `  —— ${detail}` : ""}`);
  } else {
    failures.push(`${name}${detail ? `（${detail}）` : ""}`);
    console.log(`  FAIL ${name}${detail ? `  —— ${detail}` : ""}`);
  }
}

// 每個畫面都要回答的幾何問題。全部在頁內算好再回傳，少走 round-trip。
const GEOMETRY = `
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const rect = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      top: Math.round(b.top), left: Math.round(b.left),
      right: Math.round(b.right), bottom: Math.round(b.bottom),
      w: Math.round(b.width), h: Math.round(b.height),
      position: cs.position, display: cs.display
    };
  };
  // 橫向溢出：body 的 scrollWidth 超過視窗就是有東西戳出去
  const overflowX = document.documentElement.scrollWidth - vw;
  // 內容第一張卡的位置（確認沒被外殼蓋住）
  const firstCard = (() => {
    const el = document.querySelector(".screen .panel, .screen .study-card, .screen .today-card, .screen section");
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { top: Math.round(b.top), left: Math.round(b.left) };
  })();
  return {
    vw, vh, overflowX,
    topbar: rect(".topbar"),
    nav: rect(".topbar-nav"),
    brand: rect(".brand"),
    screen: rect(".screen"),
    firstCard,
    navButtons: [...document.querySelectorAll(".nav-button")].map((el) => {
      const b = el.getBoundingClientRect();
      return { w: Math.round(b.width), h: Math.round(b.height), top: Math.round(b.top) };
    })
  };
`;

async function onboard(chrome, serverUrl) {
  await chrome.navigate(`${serverUrl}/index.html`);
  await chrome.evaluate("localStorage.clear(); return 1;");
  await chrome.navigate(`${serverUrl}/index.html`);
  await chrome.sleep(900);
  for (const step of ["開始", "大一微積分", "直接開始練"]) {
    await chrome.evaluate(`
      const hit = [...document.querySelectorAll("button, a, [data-action]")]
        .find((n) => (n.innerText || "").replace(/\\s+/g, "").includes(${JSON.stringify(step)}));
      if (hit) hit.click();
      return 1;
    `);
    await chrome.sleep(650);
  }
  await chrome.evaluate(`
    for (let i = 0; i < 4; i += 1) {
      const b = [...document.querySelectorAll("button")].find((x) => /知道了|關閉/.test(x.textContent || ""));
      if (!b) break;
      b.click(); await new Promise((r) => setTimeout(r, 200));
    }
    return 1;
  `);
}

async function run() {
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  try {
    /* ── 桌面 1280×900：側欄外殼 ── */
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    await onboard(chrome, server.url);

    for (const [label, action] of [["今天", null], ["訓練", "open-train"], ["數據", "open-insights"], ["設定", "open-settings"]]) {
      if (action) {
        await chrome.evaluate(`const el = document.querySelector('[data-action="${action}"]'); if (el) el.click(); return 1;`);
        await chrome.sleep(500);
      }
      const g = await chrome.evaluate(GEOMETRY);
      check(`桌面 ${label}：側欄靠左貼滿`, g.topbar && g.topbar.left === 0 && g.topbar.top === 0 && g.topbar.h >= g.vh - 1,
        g.topbar ? `left=${g.topbar.left} top=${g.topbar.top} h=${g.topbar.h}/${g.vh}` : "找不到側欄");
      check(`桌面 ${label}：內容讓出側欄`, g.firstCard && g.topbar && g.firstCard.left >= g.topbar.w,
        g.firstCard ? `卡片 left=${g.firstCard.left}，側欄寬=${g.topbar ? g.topbar.w : "?"}` : "找不到內容卡");
      check(`桌面 ${label}：無橫向溢出`, g.overflowX <= 1, `${g.overflowX}px`);
      check(`桌面 ${label}：五個導覽鍵都在側欄內`, g.navButtons.length === 5 && g.navButtons.every((b) => b.h >= 36),
        `${g.navButtons.length} 顆，最矮 ${Math.min(...g.navButtons.map((b) => b.h), 999)}px`);
    }

    /* ── 桌面作答：頂列模式 ── */
    await chrome.evaluate(`const el = document.querySelector('[data-action="home"]'); if (el) el.click(); return 1;`);
    await chrome.sleep(400);
    await chrome.evaluate(`
      const go = [...document.querySelectorAll("button")].find((b) => /^\\s*開始/.test((b.textContent || "").trim()));
      if (go) go.click();
      await new Promise((r) => setTimeout(r, 1400));
      const m = [...document.querySelectorAll("button")].find((x) => /知道了/.test(x.textContent || ""));
      if (m) m.click();
      return 1;
    `);
    await chrome.sleep(400);
    const quizG = await chrome.evaluate(GEOMETRY);
    check("桌面作答：外殼縮成頂列", quizG.topbar && quizG.topbar.w >= quizG.vw - 2 && quizG.topbar.h < 120,
      quizG.topbar ? `w=${quizG.topbar.w}/${quizG.vw} h=${quizG.topbar.h}` : "找不到頂列");
    check("桌面作答：沒有導覽（專注模式）", !quizG.nav, quizG.nav ? "導覽還在" : "");
    check("桌面作答：無橫向溢出", quizG.overflowX <= 1, `${quizG.overflowX}px`);

    /* ── 手機 390×844：底部分頁列 ── */
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await onboard(chrome, server.url);

    for (const [label, action] of [["今天", null], ["訓練", "open-train"], ["題庫", "open-library"]]) {
      if (action) {
        await chrome.evaluate(`const el = document.querySelector('[data-action="${action}"]'); if (el) el.click(); return 1;`);
        await chrome.sleep(500);
      }
      const g = await chrome.evaluate(GEOMETRY);
      // 這一條就是 backdrop-filter 那個 bug 的解藥：分頁列的底必須貼著螢幕的底
      check(`手機 ${label}：分頁列貼螢幕底`, g.nav && Math.abs(g.nav.bottom - g.vh) <= 2 && g.nav.position === "fixed",
        g.nav ? `bottom=${g.nav.bottom}/${g.vh} position=${g.nav.position}` : "找不到分頁列");
      check(`手機 ${label}：頂列在最上面`, g.topbar && g.topbar.top === 0 && g.topbar.h < 120,
        g.topbar ? `top=${g.topbar.top} h=${g.topbar.h}` : "找不到頂列");
      check(`手機 ${label}：分頁列鍵夠大`, g.navButtons.length === 5 && g.navButtons.every((b) => b.h >= 44 && b.w >= 44),
        `最小 ${Math.min(...g.navButtons.flatMap((b) => [b.w, b.h]), 999)}px`);
      check(`手機 ${label}：無橫向溢出`, g.overflowX <= 1, `${g.overflowX}px`);
      // 內容底部要墊出分頁列的高度，不然最後一張卡被蓋住
      const covered = await chrome.evaluate(`
        const nav = document.querySelector('.topbar-nav');
        const screen = document.querySelector('.screen');
        if (!nav || !screen) return { ok: true };
        const cs = getComputedStyle(screen);
        return { ok: parseFloat(cs.paddingBottom) >= nav.getBoundingClientRect().height, pb: cs.paddingBottom };
      `);
      check(`手機 ${label}：內容墊出分頁列高度`, covered.ok, covered.pb || "");
    }

    const errors = await chrome.evaluate(`return (window.__buzzErrors || []).length;`);
    check("沒有未捕捉的例外", !errors, errors ? `${errors} 個` : "");
  } finally {
    await chrome.close();
    await server.stop();
  }

  console.log(`\n版面幾何: ${passed}/${passed + failures.length} 通過`);
  if (failures.length) {
    console.error(`失敗 ${failures.length} 項：`);
    failures.forEach((f) => console.error("  " + f));
    process.exit(1);
  }
  console.log("layout OK");
}

run().catch((error) => {
  console.error("layout E2E 掛掉：" + error.message);
  process.exit(1);
});
