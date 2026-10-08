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
const { launch, ciFail } = require("./lib/cdp.js");
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
    ciFail(name, detail);
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
      if (!(await click('[data-action="placement-unlearned"]', 200))) break;
      // 「不停下來說教」的定義：不用按任何東西，題號自己會換（定位模式 950ms 自動前進）。
      // 所以等的是題號變了，最多 5 秒——固定 sleep 在 CI 的慢 runner 上會把「還在 render」
      // 誤判成「卡住」，而回饋卡上有沒有「下一題」按鈕不是重點。
      let after = before;
      for (const deadline = Date.now() + 5000; Date.now() < deadline; await chrome.sleep(120)) {
        after = await evaluate(`return window.__b.text(".hud-sub");`);
        if (after !== before || (i === 7 && !(await evaluate(`return Boolean(document.querySelector('[data-action="placement-unlearned"]'));`)))) break;
      }
      if (i < 7 && before === after) {
        stalled += 1;
        await click('[data-action="next-question"]', 600);
      }
    }
    check("定位答錯／沒學過直接下一題，不停下來說教", stalled === 0, stalled ? `${stalled} 次卡在回饋卡` : "");
    // 第 8 題答完到結算頁之間也是 950ms 自動前進：等結算真的畫出來
    for (const deadline = Date.now() + 6000; Date.now() < deadline; await chrome.sleep(120)) {
      if (await evaluate(`return Boolean(document.querySelector(".verdict-title"));`)) break;
    }

    const placement = await evaluate(`return { verdict: window.__b.text(".verdict-title"), sub: window.__b.text(".verdict-sub"), next: window.__b.text(".verdict-next"), stats: window.__b.text(".verdict-stats"), burst: Boolean(document.querySelector(".verdict-burst")) };`);
    check("0 題答對的定位結算是「從基礎開始」，不撒彩帶", placement.verdict === "從基礎開始" && !placement.burst, placement.verdict);
    check("結算說清楚定位不算成績、不進錯題本", /不算成績/.test(placement.sub) && /不進錯題本/.test(placement.sub), placement.sub);
    check("結算不寫「前置已經穩了」、不報 Rank 當技巧", !/前置已經穩了|Rank \d/.test(placement.next + placement.sub), placement.next);
    check("結算把「還沒學過」當答案而不是失分", /還沒學過/.test(placement.stats) && !/正確率/.test(placement.stats), placement.stats);

    /* ── 2. 首頁：第一份訓練 ── */
    await clickText("先看看首頁", 700);
    await click('button[data-action="dismiss-notice"]');

    /* ── 2a. 新手導覽：指著真的那顆按鈕，走得完、關得掉、只出現一次 ── */
    await chrome.sleep(700);
    const tourFirst = await chrome.evaluate(`
      const card = document.querySelector("[data-tour-card]");
      if (!card) return { shown: false };
      const hole = document.querySelector("[data-tour-hole]");
      const hr = hole && hole.style.display !== "none" ? hole.getBoundingClientRect() : null;
      const cr = card.getBoundingClientRect();
      return {
        shown: true,
        count: card.querySelector("[data-tour-count]").textContent,
        title: card.querySelector("h2").textContent,
        inView: cr.top >= 0 && cr.bottom <= innerHeight + 1 && cr.left >= 0 && cr.right <= innerWidth + 1,
        anchored: Boolean(hr && hr.width > 8 && hr.height > 8),
        blocked: hr ? String((document.elementFromPoint(hr.left + hr.width / 2, hr.top + hr.height / 2) || {}).className).includes("tour") : false,
        focused: card.contains(document.activeElement) || document.activeElement === card
      };
    `);
    check("新手走完開場之後會自動出現導覽", tourFirst.shown, tourFirst.count || "");
    if (tourFirst.shown) {
      check("導覽第一步框住的是首頁上真的存在的元件", tourFirst.anchored, tourFirst.title);
      check("導覽卡整張在視窗內（手機也不會被切掉）", tourFirst.inView, "");
      check("導覽期間點不到背後的按鈕", tourFirst.blocked, "");
      check("焦點在導覽卡上（鍵盤族不會迷路）", tourFirst.focused, "");
      const walk = await chrome.evaluate(`
        const seen = [];
        for (let i = 0; i < 8; i += 1) {
          const card = document.querySelector("[data-tour-card]");
          if (!card) break;
          const hole = document.querySelector("[data-tour-hole]");
          const hr = hole && hole.style.display !== "none" ? hole.getBoundingClientRect() : null;
          seen.push({ title: card.querySelector("h2").textContent, anchored: Boolean(hr && hr.width > 8) });
          const next = card.querySelector("[data-tour-next]");
          const last = next.textContent.includes("開始使用");
          next.click();
          await new Promise((r) => setTimeout(r, 420 * (window.__slow || 1)));
          if (last) break;
        }
        return { seen, stillOpen: Boolean(document.querySelector("[data-tour-card]")),
          saved: (JSON.parse(localStorage.getItem("buzzcalculus.records.v1") || "{}").tours || {}).home };
      `);
      check("導覽每一步都指著看得見的元件", walk.seen.length >= 3 && walk.seen.every((item) => item.anchored), walk.seen.map((item) => item.title).join(" · "));
      check("走完最後一步導覽會收掉", !walk.stillOpen, "");
      check("走過的導覽記起來了，不會每次進首頁都跳", Number(walk.saved) >= 1, String(walk.saved));
      const again = await chrome.evaluate(`
        document.querySelector('[data-action="open-train"]').click();
        await new Promise((r) => setTimeout(r, 400 * (window.__slow || 1)));
        document.querySelector('[data-action="home"]').click();
        await new Promise((r) => setTimeout(r, 600 * (window.__slow || 1)));
        return Boolean(document.querySelector("[data-tour-card]"));
      `);
      check("回到首頁不會再跳一次導覽", !again, "");
    }
    const home = await evaluate(`
      // 待複習錯題原本讀首頁那排儀表板，但它 2026-09-27 起要練滿三局才出現
      // （只練一局的人看到的是四格 0）。改讀紀錄本身 —— 這條要釘的本來就是
      // 「定位測驗不會把題目塞進錯題本」，跟畫面上印不印那個數字無關。
      const records = JSON.parse(localStorage.getItem("buzzcalculus.records.v1") || "{}");
      const due = Object.keys(records.mistakes || {}).length;
      return { due, card: window.__b.text(".today-card"), recipe: window.__b.text(".training-recipe") };
    `);
    check("定位的 8 題不會變成待複習錯題", home.due === 0, `錯題本有 ${home.due} 題`);
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
    // 日期用 toISOString 是 UTC 的「今天」，app 算天數用本地午夜：CI（UTC）與台灣（UTC+8）
    // 在某些時段會差一天，D-5 或 D-6 都對；要抓的是「倒數卡出現、設定卡收起」，不是那個數字
    check("設好日期後倒數卡出現、設定卡收起", /D-[56]\b/.test(countdown.card) && countdown.setupGone, countdown.card.slice(0, 30));
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
    // 功能是跟著練習逐步出現的：全新帳號的訓練頁只有「練習」。
    const gated = await evaluate(`return [...document.querySelectorAll('[data-bucket]')].map((n) => n.dataset.bucket);`);
    check("全新帳號的訓練頁只有「練習」，沒有弱點／模擬／挑戰", gated.every((key) => key === "practice"), gated.join(","));
    // 挑戰分頁本身的斷言照跑 —— 用設定頁那個「顯示全部功能」開關打開（使用者也是這樣做）
    await chrome.evaluate(`
      const records = JSON.parse(localStorage.getItem("buzzcalculus.records.v1") || "{}");
      records.settings = records.settings || {};
      records.settings.showAllFeatures = true;
      localStorage.setItem("buzzcalculus.records.v1", JSON.stringify(records));
      location.reload();
      return 1;`);
    await chrome.sleep(900);
    await click('[data-action="open-train"]', 500);
    await click('[data-action="set-bucket"][data-bucket="challenge"]', 700);
    const challenge = await evaluate(`return { firstPanel: window.__b.text(".train-screen .study-card"), cards: [...document.querySelectorAll(".challenge-mode")].map((n) => n.innerText.replace(/\\s+/g, " ")) };`);
    check("挑戰分頁第一張就是挑戰模式", /挑戰模式/.test(challenge.firstPanel), challenge.firstPanel.slice(0, 30));
    // 2026-09-16 挑戰分頁收斂：四種模式（進階／階梯／Boss 連戰／生存）＋一張競賽魔王，多了會分散注意
    check("挑戰模式四種加競賽魔王，每一張都寫了規則與題數", challenge.cards.length === 5 && challenge.cards.every((c) => c.split(" ").length >= 6), `${challenge.cards.length} 張 · ${challenge.cards[0]}`);
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

    /* ── 2. 完全沒學過的人：onboarding 有「我還沒學過」，進的是課程不是題目 ── */
    // 2026-09-15 使用者：「沒有很適合完全初學者」。以前 onboarding 第一句是「把學過的微積分
    // 練成直覺」、三個情境沒有一個是沒學過、站上沒有一段教「極限是什麼」。這一段釘住：
    // 一鍵進課程、課程表列出全部的課、單課有觀念／逐步範例／小測／推薦題、練完回得來、首頁主卡變成上課。
    // 2026-10 換成新版課程（317 課、Stage 0–12；手機寬度的細節由 e2e_course_v2 釘）：這裡走初學者的那一條路。
    await chrome.navigate(server.url + "/index.html");
    await chrome.evaluate("localStorage.clear(); return 1;");
    await chrome.navigate(server.url + "/index.html");
    check("第一頁就有「我還沒學過微積分」", await click('[data-action="set-onboarding-context"][data-context="newbie"]', 300));
    for (const deadline = Date.now() + 8000; Date.now() < deadline; await chrome.sleep(120)) {
      if (await evaluate(`return Boolean(document.querySelector(".cv2-index .cv2-stage"));`)) break;
    }
    const course = await evaluate(`
      const total = (window.BUZZ_COURSE_V2 ? window.BUZZ_COURSE_V2.stages : []).reduce((n, s) => n + s.chapters.reduce((m, c) => m + c.lessons.length, 0), 0);
      return { h2: window.__b.text(".course-index h2"), total, stages: document.querySelectorAll(".cv2-stage").length, rows: document.querySelectorAll(".cv2-row").length, placement: Boolean(document.querySelector('[data-action="start-placement"]')), primary: window.__b.text('.cv2-index .page-head [data-action="open-course-lesson"]') };`);
    check("選了直接進課程表（不做定位測驗），所有課都在", course.total >= 300 && course.rows === course.total && course.stages === 13 && !course.placement, `${course.rows} / ${course.total} 課 · ${course.h2}`);
    check("課程表的主按鈕是第一課", /^開始：0\.1 /.test(course.primary), course.primary);

    // ── 第一課（0.1）：觀念 → 範例 → 小測；小測第一次就選對 ≥ 3 題＝完成，下一課按鈕變主按鈕 ──
    await click('.cv2-index .page-head [data-action="open-course-lesson"]', 300);
    for (const deadline = Date.now() + 8000; Date.now() < deadline; await chrome.sleep(120)) {
      if (await evaluate(`return Boolean(document.querySelector(".cv2-lesson [data-course-checks]"));`)) break;
    }
    const firstLesson = await evaluate(`return { title: window.__b.text(".cv2-lesson h2"), concept: document.querySelectorAll("[data-course-concept] .cv2-part p").length, checks: document.querySelectorAll(".course-check").length };`);
    check("第一課：有觀念、有小測", firstLesson.concept >= 3 && firstLesson.checks >= 3, JSON.stringify(firstLesson));
    // 正解不一定在第一個：從課文讀每題正解的位置，一題一題點
    const firstPicks = await evaluate(`return window.BUZZ_COURSE_V2_LESSONS["function-intro"].checks.map((c) => c.options.findIndex((o) => o.correct));`);
    for (let ci = 0; ci < firstPicks.length; ci += 1) await click(`[data-action="course-pick"][data-check="${ci}"][data-option="${firstPicks[ci]}"]`, 300);
    const firstDone = await evaluate(`return { result: window.__b.text("[data-course-quiz-result]"), tier: window.__b.text(".cv2-lesson .cv2-meta .cv2-tier"), next: window.__b.text('.cv2-nav .home-primary[data-action="open-course-lesson"]') };`);
    check("小測全對：標成完成、「下一課」變主按鈕", /完成/.test(firstDone.result) && firstDone.tier === "完成" && /下一課：0\.2/.test(firstDone.next), `${firstDone.result} · ${firstDone.next}`);
    await click('[data-action="open-course"]', 600);
    check("課程表上第一課標完成", await evaluate(`const row = document.querySelector('.cv2-row[data-lesson-id="function-intro"]'); return Boolean(row && /完成/.test(row.innerText));`));

    // ── 極限的第一課（1.1）：範例一步一步揭、選錯說為什麼、推薦題開一局 ──
    await evaluate(`const d = document.querySelector('details[data-keep="cv2-stage-1"]'); d.open = true; [...d.querySelectorAll("details")].forEach((c) => { c.open = true; }); return 1;`);
    await click('.cv2-row[data-lesson-id="limit-intro"]', 300);
    for (const deadline = Date.now() + 8000; Date.now() < deadline; await chrome.sleep(120)) {
      if (await evaluate(`return Boolean(document.querySelector(".cv2-lesson [data-course-checks]"));`)) break;
    }
    const lessonPage = await evaluate(`return { title: window.__b.text(".cv2-lesson h2"), label: window.__b.text(".cv2-lesson .page-head .section-label"), steps: document.querySelectorAll(".course-step").length, stepButton: Boolean(document.querySelector('[data-action="course-step"]')), options: document.querySelectorAll(".course-option").length, practice: document.querySelectorAll("[data-course-practice] .cv2-practice li").length };`);
    check("單課：課號照大綱算、步驟先藏著、小測有選項、推薦題列出來", /^1\.1 ·/.test(lessonPage.label) && lessonPage.steps === 0 && lessonPage.stepButton && lessonPage.options >= 9 && lessonPage.practice >= 2, JSON.stringify(lessonPage));
    await click('[data-action="course-step"][data-ex="0"]', 300);
    await click('[data-action="course-step"][data-ex="0"]', 300);
    const revealed = await evaluate(`return document.querySelectorAll(".course-step").length;`);
    check("逐步範例一步一步揭", revealed === 2, `${revealed} 步`);
    const limitChecks = await evaluate(`return window.BUZZ_COURSE_V2_LESSONS["limit-intro"].checks.map((c) => ({ right: c.options.findIndex((o) => o.correct), wrong: c.options.findIndex((o) => !o.correct) }));`);
    await click(`[data-action="course-pick"][data-check="0"][data-option="${limitChecks[0].wrong}"]`, 400);
    const wrongPick = await evaluate(`return { why: window.__b.text(".course-check-why"), wrong: Boolean(document.querySelector(".course-check.is-wrong")) };`);
    check("小測選錯：標紅並說為什麼錯", wrongPick.wrong && wrongPick.why.length > 8, wrongPick.why.slice(0, 40));
    await click(`[data-action="course-pick"][data-check="0"][data-option="${limitChecks[0].right}"]`, 400);
    check("小測選對：綠", await evaluate(`return Boolean(document.querySelector(".course-check.is-right"));`));
    const practiceIds = await evaluate(`return window.BUZZ_COURSE_V2_LESSONS["limit-intro"].practice.filter((p) => !p.challenge).map((p) => p.id);`);
    check("推薦題按鈕在", await click('[data-action="course-practice"][data-set="main"]', 1000));
    const practice = await evaluate(`
      const tex = window.__b.prompt();
      const p = window.BUZZ_PROBLEMS.find((x) => x.prompt === tex);
      return { id: p ? p.id : "", topic: window.__b.topic(), hud: window.__b.text(".hud-context"), choices: window.__b.choices().length };`);
    check("推薦題是這一課的題、極限、選擇題", practiceIds.includes(practice.id) && practice.topic === "極限" && practice.choices >= 2, `${practice.id} ${practice.topic} · ${practice.hud}`);
    // 隨便答完，看回饋裡有沒有「回去看一眼」、結算有沒有「回到 1.1」
    let sawLessonLink = false;
    for (let i = 0; i < practiceIds.length + 1; i += 1) {
      if (await evaluate(`return Boolean(document.querySelector(".verdict"));`)) break;
      await click('[data-action="choose-answer"]', 800);
      if (await evaluate(`return Boolean(document.querySelector('.feedback-course [data-action="open-course-lesson"]'));`)) sawLessonLink = true;
      await click('[data-action="next-question"]', 700);
    }
    for (const deadline = Date.now() + 5000; Date.now() < deadline; await chrome.sleep(120)) {
      if (await evaluate(`return Boolean(document.querySelector(".verdict"));`)) break;
    }
    const results = await evaluate(`const links = [...document.querySelectorAll('[data-action="open-course-lesson"]')]; return { back: links[0] ? links[0].innerText : "", next: Boolean(links[1]) };`);
    check("結算頁有「回到 1.1」與「下一課」", /回到 1\.1/.test(results.back) && results.next, results.back);
    check("答錯的回饋會說這題是哪一課教的", sawLessonLink);
    await click('[data-action="open-course-lesson"]', 900);
    const after = await evaluate(`return { title: window.__b.text(".cv2-lesson h2"), practicedAt: Boolean((JSON.parse(localStorage.getItem("buzzcalculus.records.v1")).courseV2 || {})["limit-intro"].practicedAt) };`);
    check("回到這一課；練過的時間記在 records.courseV2", Boolean(after.title) && after.practicedAt, after.title);
    await click('[data-action="home"]', 800);
    for (const deadline = Date.now() + 5000; Date.now() < deadline; await chrome.sleep(120)) {
      if (await evaluate(`return Boolean(document.querySelector(".course-home-card h2"));`)) break;
    }
    const newbieHome = await evaluate(`return { card: window.__b.text(".course-home-card h2"), steps: window.__b.text(".first-steps .first-step.is-current strong") };`);
    // 0.1 完成了、1.1 小測沒做完（第一題選錯、其他沒選）：下一個沒完成的是 0.2
    check("首頁主卡變成「上 0.2」，三步的第一步是上課", /0\.2/.test(newbieHome.card) && /0\.2/.test(newbieHome.steps), `${newbieHome.card} · ${newbieHome.steps}`);

    // ── 橋：所有課都完成之後不能直接掉進主線 ──
    // 把全部課標成完成（不重走），看首頁主卡變畢業關；考完看判詞；再進主線第 1 關看抽到的題是不是都在橋池
    const OUTSIDE_BRIDGE = `
      const records = JSON.parse(localStorage.getItem("buzzcalculus.records.v1"));
      const bad = ["rationalize", "inverse-trig", "world-universities"];
      const byId = new Map(window.BUZZ_PROBLEMS.map((p) => [p.id, p]));
      const ids = ((records.history[0] || {}).answers || []).map((a) => a.problemId);
      // 跟 app 一樣看校準後的 rank（畫面上的 chip 也是它），不看 difficulty
      return { n: ids.length, outside: ids.filter((id) => { const p = byId.get(id); return !p || Number(p.rank || p.difficulty) !== 1 || (p.tags || []).some((t) => bad.includes(t)); }) };`;
    await evaluate(`
      const key = "buzzcalculus.records.v1";
      const records = JSON.parse(localStorage.getItem(key) || "{}");
      const now = new Date().toISOString();
      // 新版課程：大綱裡每一課都標完成（這一頁剛打開過課程，大綱已經載進來）
      const ids = window.BUZZ_COURSE_V2.stages.flatMap((s) => s.chapters.flatMap((c) => c.lessons.map((l) => l.id)));
      records.courseV2 = Object.fromEntries(ids.map((id) => [id, { openedAt: now, quizBest: 4, doneAt: now }]));
      localStorage.setItem(key, JSON.stringify(records));
      return 1;`);
    await chrome.navigate(server.url + "/index.html");
    // 首頁主卡要等課程大綱延後載入完才畫得出來
    for (const deadline = Date.now() + 8000; Date.now() < deadline; await chrome.sleep(120)) {
      if (await evaluate(`return Boolean(document.querySelector(".course-home-card h2"));`)) break;
    }
    const gradHome = await evaluate(`return { card: window.__b.text(".course-home-card h2"), step: window.__b.text(".first-steps .first-step.is-current strong"), button: Boolean(document.querySelector('.course-home-card [data-action="course-graduation"]')) };`);
    check("所有課都完成：首頁主卡是畢業關，不是每日訓練", /畢業關/.test(gradHome.card) && /畢業關/.test(gradHome.step) && gradHome.button, `${gradHome.card} · ${gradHome.step}`);
    await click('[data-action="open-course"]', 800);
    for (const deadline = Date.now() + 5000; Date.now() < deadline; await chrome.sleep(120)) {
      if (await evaluate(`return Boolean(document.querySelector(".course-graduation"));`)) break;
    }
    const gradCard = await evaluate(`return { text: window.__b.text(".course-graduation strong"), locked: Boolean(document.querySelector(".course-graduation.is-locked")) };`);
    check("課程表底下的畢業關已解鎖", !gradCard.locked && /10 題/.test(gradCard.text), gradCard.text);
    check("按下開始畢業關", await click('[data-action="course-graduation"]', 300));
    for (const deadline = Date.now() + 5000; Date.now() < deadline; await chrome.sleep(120)) {
      if (await evaluate(`return window.__b.choices().length > 0 && window.__b.rank() > 0;`)) break;
    }
    const gradQuiz = await evaluate(`
      const tex = window.__b.prompt();
      const p = window.BUZZ_PROBLEMS.find((x) => x.prompt === tex);
      return { hud: window.__b.text(".hud-context"), choices: window.__b.choices().length, rank: window.__b.rank(), id: p ? p.id : "?", chips: [...document.querySelectorAll(".problem-meta .chip")].map((n) => n.textContent.trim()) };`);
    check("畢業關是 R1 選擇題", gradQuiz.choices >= 2 && gradQuiz.rank === 1, JSON.stringify(gradQuiz));
    // 答對會在 950ms 後自動前進、答錯要按「下一題」：等過 950ms 再看有沒有按鈕
    for (let i = 0; i < 10; i += 1) {
      await click('[data-action="choose-answer"]', 1150);
      await click('[data-action="next-question"]', 400);
    }
    const gradResults = await evaluate(`return { verdict: window.__b.text(".verdict"), retry: Boolean(document.querySelector('[data-action="course-graduation"]')), train: Boolean(document.querySelector('[data-action="open-train"]')), course: Boolean(document.querySelector('[data-action="open-course"]')), record: JSON.parse(localStorage.getItem("buzzcalculus.records.v1")).courseGraduation };`);
    check("畢業關結算：判詞是「畢業了」或「再回去看一眼」，出口指向主線或課程", /畢業了|再回去看一眼/.test(gradResults.verdict) && (gradResults.train || gradResults.course), gradResults.verdict);
    check("畢業關結果有存（total 10 / attempts 1）", gradResults.record && gradResults.record.total === 10 && gradResults.record.attempts === 1, JSON.stringify(gradResults.record));
    const gradAnswers = await evaluate(OUTSIDE_BRIDGE);
    check("畢業關 10 題全在橋池（R1、沒有課裡沒教的技巧）", gradAnswers.n === 10 && !gradAnswers.outside.length, gradAnswers.outside.join(","));
    // 主線第 1 關：不管畢業與否，頭幾局都只抽橋池
    await click('[data-action="open-train"]', 700);
    await click('[data-action="start-path-node"]', 600);
    check("主線第 1 關開得了", await click('[data-action="start-path-lesson"]', 900));
    const mainHud = await evaluate(`return window.__b.text(".hud-context");`);
    for (let i = 0; i < 12; i += 1) {
      if (!(await click('[data-action="choose-answer"]', 1150))) break;
      await click('[data-action="next-question"]', 400);
    }
    const mainAnswers = await evaluate(OUTSIDE_BRIDGE);
    check("主線第 1 關（保護期）抽到的題全在橋池", mainAnswers.n > 0 && !mainAnswers.outside.length, `${mainAnswers.n} 題 · 外面的：${mainAnswers.outside.join(",")} · ${mainHud}`);

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
  ciFail("初學者 E2E 掛掉", error.message);
  process.exit(1);
});
