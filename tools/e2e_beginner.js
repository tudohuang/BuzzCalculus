// 初學者第一次進來會怎樣 —— 用「高中先修」的眼睛走一次。
//
// 2026-09-13 走查抓到的九件事，每一件都曾經讓一個什麼都不會的人在第一分鐘想關掉：
// 定位第一題是無窮級數、沒有「我不會」只能亂猜、0/8 還撒彩帶、
// 「前置已經穩了」、第一題 38 秒倒數、選項裡有別題漂來的外星人、
// 罐頭提示、判分器的話直接給人看、做兩題離開被記 0/13。
// 這支測試把修好的每一件釘住。全部只斷言看得見的東西，不走後門。
//
// 用法：node tools/e2e_beginner.js

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
    console.log(`  XX   ${name}${detail ? `  —— ${detail}` : ""}`);
  }
}

const HELPERS = `
  window.__b = {
    click(selector) {
      const el = [...document.querySelectorAll(selector)].find((n) => n.getClientRects().length);
      if (el) el.click();
      return Boolean(el);
    },
    clickText(needle) {
      const el = [...document.querySelectorAll("button, a, [data-action]")].find((n) => n.getClientRects().length && (n.innerText || "").includes(needle));
      if (el) el.click();
      return Boolean(el);
    },
    text(selector) {
      const el = document.querySelector(selector);
      return el ? (el.innerText || el.textContent || "").replace(/\\s+/g, " ").trim() : "";
    },
    // 題目卡上的難度與主題 chip：「暖身 R1/6」→ 1
    rank() {
      const chip = [...document.querySelectorAll(".problem-meta .chip")].map((n) => n.textContent).find((t) => /R\\d\\/6/.test(t)) || "";
      const m = chip.match(/R(\\d)\\/6/);
      return m ? Number(m[1]) : 0;
    },
    topic() {
      return [...document.querySelectorAll(".problem-meta .chip")].map((n) => n.textContent.trim()).find((t) => /^(極限|微分|積分|級數)$/.test(t)) || "";
    },
    choices() {
      return [...document.querySelectorAll('[data-action="choose-answer"]')].map((n) => n.dataset.choice || "");
    },
    prompt() {
      const el = document.querySelector(".prompt[data-tex]");
      return el ? el.dataset.tex : "";
    }
  };
`;

async function run() {
  console.log("E2E 初學者");
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const evaluate = (code) => chrome.evaluate(`${HELPERS}\n${code}`);
  const click = async (selector, wait = 400) => {
    const hit = await evaluate(`return window.__b.click(${JSON.stringify(selector)});`);
    await chrome.sleep(wait);
    return hit;
  };
  const clickText = async (needle, wait = 500) => {
    const hit = await evaluate(`return window.__b.clickText(${JSON.stringify(needle)});`);
    await chrome.sleep(wait);
    return hit;
  };

  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    await chrome.navigate(server.url + "/index.html");
    await chrome.evaluate("localStorage.clear(); return 1;");
    await chrome.navigate(server.url + "/index.html");

    /* ── 1. 開局：高中先修 → 定位測驗 ── */
    await clickText("開始");
    check("第二步能選「高中先修」", await evaluate(`return window.__b.clickText("高中先修");`));
    await chrome.sleep(500);
    check("第三步有「開始定位測驗」", await clickText("開始定位測驗", 900));

    const first = await evaluate(`return { rank: window.__b.rank(), topic: window.__b.topic(), hud: window.__b.text(".hud-context"), note: window.__b.text(".hud-note"), freeform: Boolean(document.querySelector(".timer-ring.is-freeform")), unlearned: Boolean(document.querySelector('[data-action="placement-unlearned"]')), skip: Boolean(document.querySelector('[data-action="skip"]')), hint: window.__b.text(".tool-hint") || window.__b.text(".tool-button.is-static") };`);
    check("定位第一題是 R1", first.rank === 1, `R${first.rank}`);
    check("高中先修的定位只出極限／微分", ["極限", "微分"].includes(first.topic), first.topic);
    check("定位不顯示分數與連勝", !/分數|連勝/.test(first.hud) && /不計分/.test(first.hud), first.hud);
    check("新手的定位不倒數", first.freeform);
    check("定位有「我還沒學過這個」而不是「跳過」", first.unlearned && !first.skip);
    check("定位不給提示（免得定位失真）", /無提示/.test(first.hint), first.hint);

    // 八題全部按「還沒學過」：每按一下要直接進下一題，不能停在一張要按「下一題」的回饋卡
    let stalled = 0;
    for (let i = 0; i < 8; i += 1) {
      const before = await evaluate(`return window.__b.text(".hud-sub");`);
      if (!(await click('[data-action="placement-unlearned"]', 1400))) break;
      const nextButton = await evaluate(`return Boolean(document.querySelector('[data-action="next-question"]'));`);
      if (nextButton) {
        stalled += 1;
        await click('[data-action="next-question"]', 600);
      }
      const after = await evaluate(`return window.__b.text(".hud-sub");`);
      if (i < 7 && before === after) stalled += 1;
    }
    check("定位答錯／沒學過直接下一題，不停下來說教", stalled === 0, stalled ? `${stalled} 次卡在回饋卡` : "");

    const placement = await evaluate(`return { verdict: window.__b.text(".verdict-title"), sub: window.__b.text(".verdict-sub"), next: window.__b.text(".verdict-next"), stats: window.__b.text(".verdict-stats"), burst: Boolean(document.querySelector(".verdict-burst")) };`);
    check("0 題答對的定位結算是「從基礎開始」，不撒彩帶", placement.verdict === "從基礎開始" && !placement.burst, placement.verdict);
    check("結算說清楚定位不算成績、不進錯題本", /不算成績/.test(placement.sub) && /不進錯題本/.test(placement.sub), placement.sub);
    check("結算不寫「前置已經穩了」、不報 Rank 當技巧", !/前置已經穩了|Rank \d/.test(placement.next + placement.sub), placement.next);
    check("結算把「還沒學過」當答案而不是失分", /還沒學過/.test(placement.stats) && !/正確率/.test(placement.stats), placement.stats);

    /* ── 2. 首頁：第一份訓練 ── */
    await clickText("先看看首頁", 700);
    await click('button[data-action="dismiss-notice"]');
    const home = await evaluate(`
      const stats = [...document.querySelectorAll(".overview-stat")].map((n) => n.innerText.replace(/\\s+/g, " "));
      const due = stats.find((t) => /待複習錯題/.test(t)) || "";
      return { due, card: window.__b.text(".today-card"), recipe: window.__b.text(".training-recipe") };
    `);
    check("定位的 8 題不會變成待複習錯題", /待複習錯題 0/.test(home.due), home.due);
    check("首頁給的是「第一份訓練」，不倒數不計分", /第一份訓練/.test(home.card) && /不倒數、不計分/.test(home.card), home.card.slice(0, 60));
    check("第一份訓練不宣稱到期複習／弱點／前置已穩", !/到期複習|弱點|前置已經穩了/.test(home.card), "");
    check("第一份訓練是 8 題", /8 題/.test(home.card), home.recipe);

    await click('[data-action="start-planned"]', 900);
    await click('button[data-action="dismiss-notice"]');
    const q1 = await evaluate(`return { rank: window.__b.rank(), topic: window.__b.topic(), hud: window.__b.text(".hud-context"), note: window.__b.text(".hud-note"), freeform: Boolean(document.querySelector(".timer-ring.is-freeform")), hint: window.__b.text(".tool-hint"), total: (window.__b.text(".hud-sub").match(/\\/ (\\d+)/) || [])[1], choices: window.__b.choices(), prompt: window.__b.prompt() };`);
    check("第一題不倒數", q1.freeform, q1.note);
    check("第一題從 R1 起", q1.rank === 1, `R${q1.rank}`);
    check("第一份訓練只在極限／微分裡", ["極限", "微分"].includes(q1.topic), q1.topic);
    check("HUD 寫明新手保護", /新手保護/.test(q1.hud), q1.hud);
    check("提示不扣分", /不扣分/.test(q1.hint), q1.hint);
    check("第一份訓練是 8 題", q1.total === "8", q1.total);
    const foreign = q1.choices.filter((value) => /[a-z]/i.test(value.replace(/pi|e|sqrt|log|sin|cos|tan|exp|DNE|inf|x/gi, "")));
    check("四個選項沒有別題漂來的外星人（多餘的變數）", q1.choices.length === 4 && foreign.length === 0, foreign.join(" | ") || q1.choices.join(" | "));
    const looksTemplate = q1.choices.filter((value) => /\d+\*\d+|\(\d+[-+]\d+\)/.test(value));
    check("選項與答案沒有 4·3·x^(3−1) 這種沒化簡的模板形", looksTemplate.length === 0, looksTemplate.join(" | "));

    // 看兩層提示：不能是罐頭英文，也不能對非合成函數說鏈鎖律
    await click('[data-action="show-hint"]');
    await click('[data-action="show-hint"]');
    const hints = await evaluate(`return [...document.querySelectorAll(".hint-list li")].map((n) => n.innerText.replace(/\\s+/g, " "));`);
    check("提示不是罐頭英文", hints.length > 0 && hints.every((h) => !/Identify the dominant tool|exam-style/i.test(h)), hints.join(" | "));
    check("選擇題不把「答案格式」當提示賣", hints.every((h) => !/可用分數、pi、e、sqrt 表示|請寫成 x 的函數/.test(h)), hints.join(" | "));

    // 故意答錯：選一個 data-choice 不等於正解的選項 —— 正解不可見，
    // 所以連按到答對就再試下一題（答對會自動前進）
    let wrong = null;
    for (let attempt = 0; attempt < 4 && !wrong; attempt += 1) {
      const choices = await evaluate(`return window.__b.choices();`);
      await evaluate(`const o = [...document.querySelectorAll('[data-action="choose-answer"]')]; o[o.length - 1].click(); return 1;`);
      await chrome.sleep(1300);
      wrong = await evaluate(`
        const panel = document.querySelector(".feedback.wrong, .feedback.timeout");
        if (!panel) return null;
        return { message: (panel.querySelector("p") || {}).innerText || "", chips: [...panel.querySelectorAll(".stage-tags .chip")].map((n) => n.textContent.trim()), reference: window.__b.text(".feedback-reference") };
      `);
      void choices;
    }
    check("答錯的訊息是人話（選了 X，像是…），不是「在 x=0.31 代入時不相同」", Boolean(wrong) && /^選了 [A-D]/.test(wrong.message) && !/代入時不相同/.test(wrong.message), wrong ? wrong.message : "沒答錯到");
    check("技巧 chip 不會是 Rank 1 這種 meta tag", !wrong || wrong.chips.every((c) => !/^Rank \d$/.test(c)), wrong ? wrong.chips.join(",") : "");
    check("參考答案是化簡過的", !wrong || !/\d+\*\d+|\(\d+[-+]\d+\)/.test(wrong.reference), wrong ? wrong.reference : "");

    /* ── 3. 做一題就離開 ── */
    await click('[data-action="next-question"]', 800);
    await click('[data-action="confirm-exit"]');
    await evaluate(`const b = [...document.querySelectorAll(".modal button")].find((x) => /結算離開|離開/.test(x.textContent)); if (b) b.click(); return 1;`);
    await chrome.sleep(900);
    const exited = await evaluate(`return { verdict: window.__b.text(".verdict-title"), stats: window.__b.text(".verdict-stats") };`);
    const settled = Number((exited.stats.match(/\/(\d+) 答對/) || [])[1]);
    check("提早離開只結算已答的題（分母不是 8）", settled > 0 && settled <= 4, exited.stats);
    check("做幾題就離開不會被判「先重建基礎」", exited.verdict === "提早離開", exited.verdict);

    /* ── 4. 主線第一關：由淺入深 ── */
    await click('[data-action="home"]', 600);
    await click('[data-action="open-train"]', 600);
    await click('[data-action="start-path-node"]', 600);
    await click('[data-action="start-path-lesson"]', 900);
    await click('button[data-action="dismiss-notice"]');
    const lesson = await evaluate(`return { rank: window.__b.rank(), freeform: Boolean(document.querySelector(".timer-ring.is-freeform")), hud: window.__b.text(".hud-context") };`);
    check("主線第一關第一題是 R1", lesson.rank === 1, `R${lesson.rank}`);
    check("主線第一關在新手保護期不倒數", lesson.freeform, lesson.hud);

    /* ── 5. 換一個人：期中考剩五天 ── */
    // 自陳「期中期末要考了」的人，之前跟一般使用者看到的首頁一模一樣：
    // 考試日期埋在設定頁、倒數卡沒有任何按鈕、一個技巧都沒量卻說「範圍內的技巧都到標了」。
    await chrome.navigate(server.url + "/index.html");
    await chrome.evaluate("localStorage.clear(); return 1;");
    await chrome.navigate(server.url + "/index.html");
    await clickText("開始");
    await evaluate(`return window.__b.clickText("期中期末要考了");`);
    await chrome.sleep(500);
    await clickText("直接開始練", 800);
    await click('button[data-action="dismiss-notice"]');
    const examHome = await evaluate(`return { setup: window.__b.text(".exam-setup-card"), hasDate: Boolean(document.querySelector(".exam-setup-card #exam-plan-date")), mock: Boolean(document.querySelector('.exam-setup-card [data-action="start-named-exam"]')), recipe: window.__b.text(".training-recipe"), gentle: /新手保護|第一份訓練/.test(window.__b.text(".today-card")) };`);
    check("要考了的人首頁第一張卡就問考試日期", /考試是哪一天/.test(examHome.setup) && examHome.hasDate, examHome.setup.slice(0, 40));
    check("同一張卡可以直接開一份模擬卷", examHome.mock);
    check("考前的人沒有新手保護期", !examHome.gentle);
    check("新帳號的配方不把補位題掛在「到期複習」名下", !/到期複習/.test(examHome.recipe), examHome.recipe);
    const inFive = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);
    await evaluate(`document.querySelector(".exam-setup-card #exam-plan-date").value = ${JSON.stringify(inFive)}; return 1;`);
    await click('.exam-setup-card [data-action="exam-countdown-set"]', 900);
    await click('button[data-action="dismiss-notice"]');
    const countdown = await evaluate(`return { card: window.__b.text(".exam-countdown-card"), buttons: [...document.querySelectorAll(".exam-countdown-card button")].map((b) => b.textContent.trim()), setupGone: !document.querySelector(".exam-setup-card") };`);
    check("設好日期後倒數卡出現、設定卡收起", /D-5/.test(countdown.card) && countdown.setupGone, countdown.card.slice(0, 30));
    check("一個技巧都沒量時倒數卡不說「都到標了」，改叫人先寫模擬卷", /先寫一份/.test(countdown.card) && !/都到標了|0\/0/.test(countdown.card), countdown.card.slice(0, 120));
    check("倒數卡有按鈕，不是講完「排不完」就把人留在原地", countdown.buttons.length >= 2, countdown.buttons.join(" | "));

    /* ── 6. 再換一個人：想挑戰難題 ── */
    // 挑戰分頁的模式只有三個字的註、Boss 題用選的（選項洩題）、
    // 題庫按 Boss 是「0 符合條件」、生存卡在難度上限 4 而且看不到命。
    await chrome.navigate(server.url + "/index.html");
    await chrome.evaluate("localStorage.clear(); return 1;");
    await chrome.navigate(server.url + "/index.html");
    await clickText("開始");
    await evaluate(`return window.__b.clickText("想維持手感");`);
    await chrome.sleep(500);
    await clickText("直接開始練", 800);
    await click('button[data-action="dismiss-notice"]');
    await click('[data-action="open-train"]', 700);
    await click('[data-action="set-bucket"][data-bucket="challenge"]', 700);
    const challenge = await evaluate(`return { firstPanel: window.__b.text(".train-screen .study-card"), cards: [...document.querySelectorAll(".challenge-mode")].map((n) => n.innerText.replace(/\\s+/g, " ")) };`);
    check("挑戰分頁第一張就是挑戰模式", /挑戰模式/.test(challenge.firstPanel), challenge.firstPanel.slice(0, 30));
    check("每個挑戰模式都寫了規則與題數", challenge.cards.length >= 7 && challenge.cards.every((c) => c.split(" ").length >= 6), challenge.cards[0]);
    await click('[data-action="start-mode"][data-mode-key="boss"]', 900);
    await click('button[data-action="dismiss-notice"]');
    const boss = await evaluate(`return { free: Boolean(document.querySelector(".answer-input")), choices: document.querySelectorAll('[data-action="choose-answer"]').length, rank: window.__b.rank() };`);
    check("階梯測驗預設自己寫答案（選項會洩題）", boss.free && boss.choices === 0);
    check("階梯第一題不是 R6（真的由易到難）", boss.rank > 0 && boss.rank <= 5, `R${boss.rank}`);
    await click('[data-action="confirm-exit"]');
    await evaluate(`const b = [...document.querySelectorAll(".modal button")].find((x) => /離開/.test(x.textContent)); if (b) b.click(); return 1;`);
    await chrome.sleep(700);
    await click('[data-action="open-train"]', 700);
    await click('[data-action="set-bucket"][data-bucket="challenge"]', 700);
    await click('[data-action="start-mode"][data-mode-key="survival"]', 900);
    await click('button[data-action="dismiss-notice"]');
    const survival = await evaluate(`return { lives: window.__b.text(".hud-lives") };`);
    check("生存的三條命畫在 HUD 上", /剩 3 條命/.test(survival.lives), survival.lives);
    await click('[data-action="confirm-exit"]');
    await evaluate(`const b = [...document.querySelectorAll(".modal button")].find((x) => /離開/.test(x.textContent)); if (b) b.click(); return 1;`);
    await chrome.sleep(700);
    await click('[data-action="open-library"]', 800);
    await click('[data-library-filter="boss"]', 700);
    const libraryBoss = await evaluate(`return Number((window.__b.text(".library-count") || "").match(/\\d+/)?.[0] || 0);`);
    check("題庫按 Boss 不會是 0 符合條件（明確要看難題就不擋）", libraryBoss > 100, String(libraryBoss));

    const errors = await chrome.evaluate(`return (window.__buzzErrors || []).length;`);
    check("沒有未捕捉的例外", !errors, errors ? `${errors} 個` : "");
  } finally {
    await chrome.close();
    await server.stop();
  }

  console.log(`\nE2E 初學者: ${passed}/${passed + failures.length} 通過`);
  if (failures.length) {
    console.error(`失敗 ${failures.length} 項：`);
    failures.forEach((f) => console.error("  " + f));
    process.exit(1);
  }
  console.log("beginner OK");
}

run().catch((error) => {
  console.error("初學者 E2E 掛掉：" + error.message);
  process.exit(1);
});
