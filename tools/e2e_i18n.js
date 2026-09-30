"use strict";

// 英文介面 E2E：開一顆真的 Chrome，設定 lang=en 之後每一頁的介面都不能露出中文，
// 題幹要換成英文側表的版本，設定頁切回中文要 reload 回中文。
//
// 這一支只斷言「畫面上看得見的字」：validate_i18n 已經在原始碼層擋過漏包的字串，
// 這裡抓的是另一類壞法 —— 字典有、但 render 走的是別條路（例如靜態骨架、
// 延後載入的題目側表沒等到、切語言沒 reload）。
//
// 第二批之後：解說三層、提示、入門課（課程表與單課頁）、四個靜態頁也要整塊沒有中文。
// 證明內容與白話證明還是中文，所以題庫頁仍只看「介面骨架」（按鈕、標題、標籤）。
const assert = require("node:assert/strict");
const path = require("node:path");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const STORAGE_KEY = "buzzcalculus.records.v1";
const SLOW = Number(process.env.BUZZ_E2E_SLOW || 1);
const wait = (ms) => ms * SLOW;

// 練滿的老使用者：閘門全開、不跑導覽（totalAnswered > 20）、不彈備份提示
function seed(lang) {
  return {
    onboardingSeen: true,
    backupNoticeSeen: true,
    totalAnswered: 200,
    history: [1, 2, 3, 4, 5].map(() => ({ at: Date.now(), answers: [] })),
    settings: { lang, showAllFeatures: true }
  };
}

// 頁面端：算某個範圍內看得見的中文字，並回傳前幾段樣本（報錯時看得出是哪一句）
const CJK_PROBE = `
  window.__cjk = (selector, only) => {
    const root = document.querySelector(selector || "#app");
    if (!root) return { count: -1, samples: ["(no root " + selector + ")"] };
    const nodes = only ? [...root.querySelectorAll(only)] : [root];
    const samples = new Set();
    let count = 0;
    // 語言切換裡的「中文」是語言自己的名字，故意不翻，不算漏
    const skip = [...root.querySelectorAll('[data-lang="zh"]')].map((n) => n.innerText || "");
    nodes.forEach((node) => {
      if (!node.getClientRects().length) return;
      let text = node.innerText || "";
      skip.forEach((s) => { if (s) text = text.replace(s, ""); });
      const hits = text.match(/[\\u4e00-\\u9fff]+/g) || [];
      hits.forEach((hit) => { count += hit.length; if (samples.size < 8) samples.add(hit.slice(0, 24)); });
    });
    return { count, samples: [...samples] };
  };
`;
const CHROME = "button, h1, h2, h3, label, .section-label, .tab-button, .nav-item, .sidebar a, [role=tab], summary";

async function run() {
  const server = await staticServer.start(path.join(__dirname, ".."), 0);
  let chrome;
  let passed = 0;
  const check = (name, value, detail) => {
    assert.ok(value, detail ? `${name} — ${detail}` : name);
    passed += 1;
    console.log(`PASS ${name}`);
  };
  const cjk = async (selector, only) => chrome.evaluate(`${CJK_PROBE} return window.__cjk(${JSON.stringify(selector || "#app")}, ${JSON.stringify(only || "")});`);
  const expectNoCjk = async (name, selector, only) => {
    const result = await cjk(selector, only);
    check(name, result.count === 0, `${result.count} 個中文字：${result.samples.join("／")}`);
  };
  const open = async (action) => {
    console.log(`… ${action}`);
    const hit = await chrome.evaluate(`const el = [...document.querySelectorAll('[data-action="${action}"]')].find((n) => n.getClientRects().length); if (el) el.click(); return Boolean(el);`);
    if (!hit) console.log(`   （畫面上沒有 ${action}）`);
    await chrome.sleep(wait(700));
  };

  try {
    chrome = await launch();
    await chrome.send("Network.setBlockedURLs", { urls: ["*google-analytics.com*", "*googletagmanager.com*"] });
    // 任何 evaluate 都不准卡超過 20 秒：卡住就報是哪一句，不要讓 CI 等到超時什麼都不說
    const rawEvaluate = chrome.evaluate;
    chrome.evaluate = (expression) => Promise.race([
      rawEvaluate(expression),
      new Promise((_, reject) => setTimeout(() => reject(new Error(`evaluate 卡住 20 秒：${String(expression).trim().slice(0, 160)}`)), wait(20000)))
    ]);
    chrome.on("Page.javascriptDialogOpening", (params) => {
      console.log(`（頁面跳出 ${params.type}：${params.message}）`);
      chrome.send("Page.handleJavaScriptDialog", { accept: true }).catch(() => {});
    });

    // ── 1. 設定 lang=en 之後開站 ──
    await chrome.navigate(server.url + "/index.html");
    await chrome.evaluate(`localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(JSON.stringify(seed("en")))}); return true;`);
    await chrome.navigate(server.url + "/index.html");
    await chrome.sleep(wait(2500));
    check("html lang 是 en", (await chrome.evaluate("return document.documentElement.lang;")) === "en");
    check("英文字典有載進來", await chrome.evaluate("return window.BuzzI18n && window.BuzzI18n.lang === 'en' && window.BuzzI18n.hasDictionary('en');"));
    check("題目側表（延後載入）在第一幀之前就到了", await chrome.evaluate("return Object.keys(window.BuzzI18n.problemTable('en')).length > 800;"));
    check("開站骨架已經被 app 換掉", await chrome.evaluate("return !document.querySelector('.sk-note');"));
    await expectNoCjk("首頁沒有中文", "#app");
    check("首頁的問候語不是把中文逗號切壞的英文", await chrome.evaluate(`
      const h = document.querySelector('.page-heading h1, .workspace-heading h1, h1');
      return h && !/—.*—/.test(h.innerText);
    `));

    // ── 2. 主要分頁 ──
    await open("open-train");
    await expectNoCjk("訓練頁沒有中文", "#app");
    await open("open-insights");
    await expectNoCjk("數據頁沒有中文", "#app");
    await open("open-mistakes");
    await expectNoCjk("錯題本沒有中文", "#app");
    await open("open-settings");
    await expectNoCjk("設定頁沒有中文（語言名稱「中文」除外）", "#app", CHROME);
    check("設定頁有語言切換，三個選項", await chrome.evaluate(`return document.querySelectorAll('[data-action="set-lang"]').length === 3;`));
    check("目前亮的是 English", await chrome.evaluate(`const on = document.querySelector('[data-action="set-lang"][aria-pressed="true"]'); return on && on.dataset.lang === 'en';`));
    await open("open-library");
    await expectNoCjk("題庫頁的介面骨架沒有中文", "#app", CHROME);

    // ── 3. 作答頁：題幹要是英文側表的版本 ──
    await chrome.navigate(server.url + "/index.html#p=dd-imp-001");
    await chrome.sleep(wait(2500));
    check("深連結開到作答頁", await chrome.evaluate("return Boolean(document.querySelector('.quiz-screen'));"));
    console.log("… 讀題幹");
    const prompt = await chrome.evaluate(`const k = document.querySelector('.quiz-screen .katex'); return k ? k.innerText.slice(0, 300) : '';`);
    // KaTeX 的 \text 用的是不換行空白（U+00A0），先把空白攤平再比對
    const flat = prompt.replace(/\s+/g, " ");
    console.log("… 題幹：" + flat.slice(0, 80));
    check("題幹是英文（at the point）", /at the point/.test(flat), flat.slice(0, 80));
    check("題幹沒有中文", !/[一-鿿]/.test(flat), flat.slice(0, 80));
    check("題幹的數學沒被動到（3,2）", /\(3,\s*2\)/.test(prompt.replace(/\s+/g, "")) || /3,2/.test(prompt.replace(/\s+/g, "")), prompt.slice(0, 80));
    await expectNoCjk("作答頁的按鈕與標籤沒有中文", ".quiz-screen", "button, label, .section-label, summary");
    check("問題的原文還留著（promptZh）", await chrome.evaluate(`
      const p = (window.BUZZ_PROBLEMS || []).find((x) => x.id === 'dd-imp-001');
      return Boolean(p && p.promptZh && /[\\u4e00-\\u9fff]/.test(p.promptZh));
    `));

    // ── 3b. 提示與解說（第二批）：先看提示，再故意答錯，三層解說全部打開，裡面不能有中文 ──
    check("句型表（延後載入）也到了", await chrome.evaluate("return Object.keys(window.BuzzI18n.textTable('en')).length > 4000;"));
    await chrome.evaluate(`const b = document.querySelector('[data-action="show-hint"]'); if (b && !b.disabled) b.click(); return true;`);
    await chrome.sleep(wait(500));
    check("看得到提示", await chrome.evaluate("return document.querySelectorAll('.hint-list li').length > 0;"));
    await expectNoCjk("提示是英文", ".hint-list");
    console.log("… 故意答錯");
    await chrome.evaluate(`
      // 選擇題：點一個不是正解的選項；填答：填一個一定錯的數
      const p = (window.BUZZ_PROBLEMS || []).find((x) => x.id === 'dd-imp-001');
      const wrongChoice = [...document.querySelectorAll('[data-action="choose-answer"]')].find((c) => !c.disabled && c.getAttribute("data-choice") !== String(p.answer));
      if (wrongChoice) { wrongChoice.click(); return true; }
      const input = document.querySelector(".answer-input");
      if (input) { input.value = "12345"; input.dispatchEvent(new Event("input", { bubbles: true })); }
      // submit-answer 是表單（submit 事件），不是按鈕
      const form = document.querySelector('form[data-action="submit-answer"]');
      if (form) form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      return true;
    `);
    await chrome.sleep(wait(1200));
    const stages = await chrome.evaluate(`return { n: document.querySelectorAll('.solution-stages details').length, input: Boolean(document.querySelector('.answer-input')), form: Boolean(document.querySelector('form[data-action="submit-answer"]')), feedback: (document.querySelector('.feedback, [class*="feedback"]') || {}).className || "" };`);
    check("答錯之後有三層解說", stages.n === 3, JSON.stringify(stages));
    await chrome.evaluate(`document.querySelectorAll('.solution-stages details').forEach((d) => { d.open = true; }); return true;`);
    await chrome.sleep(wait(400));
    await expectNoCjk("解說三層（技巧／關鍵步驟／完整推導）都沒有中文", ".solution-stages");
    check("完整推導是英文句子、數學原封不動", await chrome.evaluate(`
      const p = (window.BUZZ_PROBLEMS || []).find((x) => x.id === 'dd-imp-001');
      const body = document.querySelector('.solution-stage.is-full .stage-body');
      return Boolean(p && p.solutionZh && body && /[a-z]{3,}/.test(body.innerText) && body.innerText.includes(p.solution.slice(0, 20)));
    `));

    // ── 3c. 入門課：課程表與一堂理論課（概念、逐步推導、小測、選錯的理由）──
    await chrome.navigate(server.url + "/index.html");
    await chrome.sleep(wait(2000));
    // 老使用者的畫面上不一定有課程入口：在 #app 裡放一顆同樣 data-action 的按鈕去點（走的是 app 自己的事件委派）
    await chrome.evaluate(`
      let el = [...document.querySelectorAll('[data-action="open-course"]')].find((n) => n.getClientRects().length);
      if (!el) { el = document.createElement("button"); el.dataset.action = "open-course"; document.querySelector("#app").appendChild(el); }
      el.click();
      return true;
    `);
    await chrome.sleep(wait(700));
    check("課程表打得開", await chrome.evaluate("return Boolean(document.querySelector('.course-index'));"));
    await expectNoCjk("課程表沒有中文", "#app");
    await chrome.evaluate(`document.querySelector('[data-action="open-course-lesson"][data-lesson-id="fn-what-is-a-function"]').click(); return true;`);
    await chrome.sleep(wait(900));
    for (let i = 0; i < 4; i += 1) {
      await chrome.evaluate(`const b = document.querySelector('[data-action="course-step"]'); if (b) b.click(); return true;`);
      await chrome.sleep(wait(300));
    }
    // 每一題小測都先點一個錯的選項，讓「為什麼錯」印出來
    await chrome.evaluate(`
      const lesson = window.BUZZ_COURSE.find((l) => l.id === 'fn-what-is-a-function');
      lesson.checks.forEach((check, ci) => {
        const wrong = check.options.findIndex((o) => !o.correct);
        const b = document.querySelector('[data-action="course-pick"][data-check="' + ci + '"][data-option="' + wrong + '"]');
        if (b) b.click();
      });
      return true;
    `);
    await chrome.sleep(wait(700));
    check("課文、步驟、小測選錯的理由都在畫面上", await chrome.evaluate("return document.querySelectorAll('.course-step').length >= 3 && document.querySelectorAll('.course-check-why').length >= 1;"));
    await expectNoCjk("單課頁（概念、逐步推導、小測、選錯理由）沒有中文", "#app");
    check("課文的 KaTeX 渲染得出來（\\\\text 裡是英文）", await chrome.evaluate(`
      const blocks = [...document.querySelectorAll('.course-lesson .math-block')];
      return blocks.length > 0 && blocks.every((b) => b.querySelector('.katex')) && !blocks.some((b) => /[\\u4e00-\\u9fff]/.test(b.innerText));
    `));

    // ── 3d. 靜態頁（使用手冊、關於、條款、隱私）：英文介面看到英文版 ──
    for (const page of ["guide.html", "about.html", "terms.html", "privacy.html"]) {
      await chrome.navigate(`${server.url}/${page}`, { appReady: false });
      await chrome.sleep(wait(600));
      const info = await chrome.evaluate(`return { lang: document.documentElement.lang, title: document.title, visible: [...document.querySelectorAll('main')].filter((m) => m.getClientRects().length).length };`);
      check(`${page} 英文版：lang=en、只顯示一個 main、標題是英文`, info.lang === "en" && info.visible === 1 && !/[一-鿿]/.test(info.title), JSON.stringify(info));
      await expectNoCjk(`${page} 看得見的字沒有中文`, "body");
    }

    // ── 4. 設定頁切回中文：存設定、reload、整站變回中文 ──
    await chrome.navigate(server.url + "/index.html");
    await chrome.sleep(wait(2000));
    await open("open-settings");
    await chrome.evaluate(`document.querySelector('[data-action="set-lang"][data-lang="zh"]').click(); return true;`);
    await chrome.sleep(wait(3000));
    check("切回中文後 html lang 是 zh-Hant", (await chrome.evaluate("return document.documentElement.lang;")) === "zh-Hant");
    check("設定存的是 zh", await chrome.evaluate(`return JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})).settings.lang === 'zh';`));
    const zhHome = await cjk("#app");
    check("首頁回到中文", zhHome.count > 50, `只有 ${zhHome.count} 個中文字`);
    check("中文版沒有載題目側表（一個位元組都不用抓）", await chrome.evaluate("return Object.keys(window.BuzzI18n.problemTable('en')).length === 0;"));
    await chrome.navigate(`${server.url}/about.html`, { appReady: false });
    await chrome.sleep(wait(500));
    check("中文設定下 about.html 是中文版", await chrome.evaluate(`return document.documentElement.lang === 'zh-Hant' && /tudohuang/.test(document.body.innerText) && /[\\u4e00-\\u9fff]/.test(document.body.innerText) && !/Who made it/.test(document.body.innerText);`));
    await chrome.navigate(server.url + "/index.html");
    await chrome.sleep(wait(2000));
    check("中文版也沒有載內容句型表", await chrome.evaluate("return Object.keys(window.BuzzI18n.textTable('en')).length === 0 && !document.querySelector('script[src$=\"i18n_text_en.js\"]:not([type])');"));

    // ── 5. 跟著瀏覽器：清掉設定就回到偵測（這顆 Chrome 釘在 zh-TW） ──
    await open("open-settings");
    await chrome.evaluate(`document.querySelector('[data-action="set-lang"][data-lang="auto"]').click(); return true;`);
    await chrome.sleep(wait(3000));
    check("跟著瀏覽器：設定裡沒有 lang", await chrome.evaluate(`return !('lang' in (JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})).settings || {}));`));
    check("跟著瀏覽器：zh-TW 的 Chrome 得到中文", (await chrome.evaluate("return window.BuzzI18n.lang;")) === "zh");

    const errors = chrome.pageErrors || [];
    check("沒有頁面錯誤", errors.length === 0, errors.slice(0, 3).join(" | "));
    console.log(`E2E 英文介面：${passed}/${passed} 通過`);
  } finally {
    // 頁面卡死時 Browser.close 可能永遠不回話；等 5 秒就放手，讓真正的錯誤訊息印得出來
    if (chrome) await Promise.race([chrome.close().catch(() => {}), new Promise((resolve) => setTimeout(resolve, 5000))]);
    await server.stop();
  }
}

run().catch((error) => {
  console.error("E2E 英文介面失敗：" + (error && error.stack ? error.stack : String(error)));
  ciFail("E2E 英文介面失敗", error && error.message ? error.message : String(error));
  process.exit(1);
});
