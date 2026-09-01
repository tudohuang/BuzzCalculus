// E2E 主幹：開局 → 答題 → 結算 → 錯題進本
//
// 這支測的是**其他 21 支驗證器全部看不到的那一層**。
//
// 它們驗的是「render 出來的 HTML 字串裡有沒有那些字」。實際試跑時抓到的兩個 bug
// 都在那一層之外：
//
//   1. 結算頁全白。DOM 裡有兩萬字的 HTML，但入場動畫把元素設成 opacity:0 之後
//      requestAnimationFrame 沒有前進，內容一個字都看不到。
//      字串比對完全正常，使用者看到的是白畫面。
//   2. 第一畫面寫死「1407 題」，而題庫頁顯示 1459。
//
// 所以這支的斷言原則是：**只斷言使用者實際看得到、點得到的東西**。
//   - 文字要「可見」（有面積、opacity 不是 0），不是「存在於 DOM」
//   - 互動要真的觸發（呼叫 .click()，走完整的事件委派）
//   - console 不能有錯誤，資源不能有 404
//
// 用法：
//   node tools/e2e_main_flow.js            跑完整流程
//   node tools/e2e_main_flow.js --keep     失敗時保留瀏覽器（除錯用）

"use strict";

const path = require("path");
const { launch, findChrome } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const steps = [];
let failures = 0;

function pass(name, detail) {
  steps.push({ ok: true, name, detail });
  console.log(`  ok   ${name}${detail ? "  —— " + detail : ""}`);
}

function fail(name, detail) {
  failures += 1;
  steps.push({ ok: false, name, detail });
  console.log(`  XX   ${name}${detail ? "  —— " + detail : ""}`);
}

function check(name, condition, detail) {
  if (condition) pass(name, detail);
  else fail(name, detail);
  return Boolean(condition);
}

/* ── 頁面內用的小工具 ─────────────────────────────────────── */

// 這些字串會被送進瀏覽器執行。放在這裡是為了讓「可見」的定義只有一份：
// 有面積、沒有被 opacity/visibility/display 藏起來，而且祖先也沒藏。
const HELPERS = `
  window.__e2e = window.__e2e || {
    visibleText() {
      const walk = (node, out) => {
        for (const child of node.children) {
          const style = getComputedStyle(child);
          if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
          const rect = child.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) continue;
          const own = [...child.childNodes]
            .filter((n) => n.nodeType === 3)
            .map((n) => n.textContent.trim())
            .filter(Boolean)
            .join(" ");
          if (own) out.push(own);
          walk(child, out);
        }
        return out;
      };
      return walk(document.getElementById("app"), []).join("\\n");
    },
    clickText(needle, tag) {
      const nodes = [...document.querySelectorAll(tag || "button, a, [data-action]")];
      const hit = nodes.find((n) => (n.innerText || "").replace(/\\s+/g, "").includes(needle.replace(/\\s+/g, "")));
      if (!hit) return false;
      hit.click();
      return true;
    },
    clickSelector(selector) {
      const el = document.querySelector(selector);
      if (!el) return false;
      el.click();
      return true;
    }
  };
`;

/* ── 主流程 ───────────────────────────────────────────────── */

async function run() {
  console.log("E2E 主幹");
  const chromePath = findChrome();
  if (!chromePath) {
    console.error("\n找不到 Chrome。設定 CHROME_PATH 或安裝 Chrome。");
    console.error("刻意讓這種情況失敗：「跑不起來」不等於「測過了」。");
    process.exit(1);
  }
  console.log(`  chrome   ${chromePath}`);

  const server = await staticServer.start(ROOT, 0);
  console.log(`  server   ${server.url}`);
  const chrome = await launch();

  try {
    /* ── 1. 冷啟動 ── */
    await chrome.navigate(server.url + "/index.html");
    await chrome.evaluate(HELPERS + "return 1;");
    // 每一輪都從全新的使用者開始，否則測到的是上一輪殘留的狀態
    await chrome.evaluate("localStorage.clear(); return 1;");
    await chrome.navigate(server.url + "/index.html");
    await chrome.evaluate(HELPERS + "return 1;");

    const bootText = await chrome.evaluate("return window.__e2e.visibleText();");
    check("冷啟動看得到 onboarding", /健身房/.test(bootText), bootText.split("\n")[1] || "");

    // 這一條是為了那個實際發生過的 bug：題數寫死在第一畫面
    const bankSize = await chrome.evaluate("return window.BUZZ_PROBLEMS.length;");
    const shownCount = (bootText.match(/(\d{3,5})\s*題微積分/) || [])[1];
    check(
      "第一畫面的題數跟題庫一致",
      Number(shownCount) === bankSize,
      `畫面 ${shownCount} / 題庫 ${bankSize}`
    );

    /* ── 2. 走完 onboarding ── */
    await chrome.evaluate("return window.__e2e.clickText('開始');");
    await chrome.sleep(250);
    await chrome.evaluate(HELPERS + "return window.__e2e.clickText('大一微積分');");
    await chrome.sleep(250);
    await chrome.evaluate(HELPERS + "return window.__e2e.clickText('直接開始練');");
    await chrome.sleep(500);

    const homeText = await chrome.evaluate(HELPERS + "return window.__e2e.visibleText();");
    check("onboarding 走完會落在首頁", /今天的訓練|開始/.test(homeText), homeText.split("\n").slice(0, 2).join(" / "));

    /* ── 3. 開一局並作答 ── */
    const started = await chrome.evaluate(`
      ${HELPERS}
      // 用「5 分鐘快刷」而不是完整的 15 分鐘訓練：測的是流程能不能走完，
      // 不是耐心。題數少一半，E2E 快一倍。
      return window.__e2e.clickText('5 分鐘快刷')
        || window.__e2e.clickSelector('[data-action="start-planned"]')
        || window.__e2e.clickText('開始');
    `);
    check("能開始今天的訓練", started);
    await chrome.sleep(600);

    const quizState = await chrome.evaluate(`
      ${HELPERS}
      const hooks = window.__BUZZ_TEST_HOOKS__ && window.__BUZZ_TEST_HOOKS__.api;
      const text = window.__e2e.visibleText();
      return {
        hasPrompt: Boolean(document.querySelector(".math-block, .quiz-prompt, [data-tex]")),
        katexRendered: document.querySelectorAll(".katex").length,
        visibleChars: text.length,
        hasChoices: document.querySelectorAll('[data-action="choose-answer"]').length,
        hasInput: Boolean(document.querySelector(".answer-input"))
      };
    `);
    check("題目畫面有渲染出來", quizState.visibleChars > 40, `可見文字 ${quizState.visibleChars} 字`);
    check("KaTeX 有把數學畫出來", quizState.katexRendered > 0, `${quizState.katexRendered} 個 katex 節點`);
    check(
      "有可作答的介面",
      quizState.hasChoices > 0 || quizState.hasInput,
      quizState.hasChoices ? `${quizState.hasChoices} 個選項` : "自由輸入"
    );

    /* ── 4-5. 把整局打完，而且刻意答錯至少一題 ── */
    //
    // 這裡刻意**不用** __BUZZ_TEST_HOOKS__。那個鉤子在真實瀏覽器裡不存在
    // （app.js 只在 harness 預先建好那個物件時才掛上去），而且從後門結束一局
    // 等於繞過使用者真正會走的路徑 —— E2E 的價值就在於不繞。
    //
    // 判斷哪個選項是錯的，只用公開資料：選項的 data-choice 等於
    // displayAnswer(problem)，所以「data-choice 不等於 problem.answer」的
    // 一定是錯的（app 在產生誘答時已經用判分器濾掉等價的寫法）。
    const play = await chrome.evaluate(`
      ${HELPERS}
      const promptOf = () => {
        const node = document.querySelector(".quiz-body [data-tex], .math-block[data-tex], [data-tex]");
        return node ? node.getAttribute("data-tex") : null;
      };
      const currentProblem = () => {
        const tex = promptOf();
        if (!tex) return null;
        return window.BUZZ_PROBLEMS.find((p) => p.prompt === tex) || null;
      };

      let answered = 0;
      let wrongOnPurpose = 0;
      let advanced = 0;
      let stuck = 0;

      for (let guard = 0; guard < 120; guard += 1) {
        // 有 modal 擋著就先關掉 —— 背板會吃掉所有點擊，
        // 而「點了沒反應」在自動化裡看起來就像功能壞掉。
        const notice = document.querySelector('[data-action="dismiss-notice"]');
        if (notice) { notice.click(); await new Promise((r) => setTimeout(r, 150)); continue; }

        // 到結算頁就停
        if (document.querySelector('.results-screen, [data-action="restart"]')) break;

        // 順序很重要：先看「下一題」。
        // 答完之後選項還留在 DOM 上（只是 disabled），先檢查選項的話
        // 會一直點停用的按鈕，永遠走不到下一題 —— 第一版就是這樣空轉 60 圈。
        const next = document.querySelector('[data-action="next-question"]');
        if (next && !next.disabled) {
          next.click();
          advanced += 1;
          stuck = 0;
          await new Promise((r) => setTimeout(r, 220));
          continue;
        }

        const choices = [...document.querySelectorAll('[data-action="choose-answer"]')].filter((c) => !c.disabled);
        if (choices.length) {
          const problem = currentProblem();
          let target = choices[0];
          if (problem && problem.answer) {
            if (wrongOnPurpose < 2) {
              const wrong = choices.find((c) => c.getAttribute("data-choice") !== String(problem.answer));
              if (wrong) { target = wrong; wrongOnPurpose += 1; }
            } else {
              const right = choices.find((c) => c.getAttribute("data-choice") === String(problem.answer));
              if (right) target = right;
            }
          }
          target.click();
          answered += 1;
          stuck = 0;
          await new Promise((r) => setTimeout(r, 220));
          continue;
        }

        const input = document.querySelector(".answer-input");
        if (input && !input.disabled) {
          const problem = currentProblem();
          input.value = problem && problem.answer ? String(problem.answer) : "0";
          input.dispatchEvent(new Event("input", { bubbles: true }));
          const submit = document.querySelector('[data-action="submit-answer"]');
          if (submit) submit.click(); else window.__e2e.clickText("送出");
          answered += 1;
          await new Promise((r) => setTimeout(r, 220));
          continue;
        }

        if (window.__e2e.clickText("看結算") || window.__e2e.clickText("結算")) {
          advanced += 1;
          await new Promise((r) => setTimeout(r, 220));
          continue;
        }

        // 沒有東西可點不代表卡住：答對時走的是 950ms 的自動前進
        // （app 刻意只讓答錯的題等使用者按，好讓訂正看得完）。
        // 第一版只等 250ms×4 就放棄，把自動前進誤判成死路。
        stuck += 1;
        if (stuck > 10) break;
        await new Promise((r) => setTimeout(r, 400));
      }
      return { answered, wrongOnPurpose, advanced, stuck, atResults: Boolean(document.querySelector(".results-screen")) };
    `);
    await chrome.sleep(900);

    check("能一路作答到結算", play.atResults, `答了 ${play.answered} 題、前進 ${play.advanced} 次（其中 ${play.wrongOnPurpose} 題故意答錯）`);
    check("有故意答錯的題目", play.wrongOnPurpose > 0, "才測得到錯題本那條路徑");

    // 結算頁：這是實際壞掉過的地方 —— DOM 有內容但畫面全白
    const results = await chrome.evaluate(`
      ${HELPERS}
      const text = window.__e2e.visibleText();
      const app = document.getElementById("app");
      const hiddenNodes = [...app.querySelectorAll("*")].filter((n) => {
        const s = getComputedStyle(n);
        return Number(s.opacity) === 0 && n.getBoundingClientRect().height > 0;
      }).length;
      return { visibleChars: text.length, htmlChars: app.innerHTML.length, hiddenNodes, text: text.slice(0, 120) };
    `);
    check(
      "結算頁的內容看得見（不是只存在於 DOM）",
      results.visibleChars > 60,
      `可見 ${results.visibleChars} 字 / HTML ${results.htmlChars} 字`
    );
    check(
      "沒有元素卡在 opacity:0",
      results.hiddenNodes === 0,
      results.hiddenNodes ? `${results.hiddenNodes} 個元素被動畫藏住` : "入場動畫跑完或保險絲生效"
    );

    /* ── 6. 錯題有沒有進錯題本 ── */
    const mistakes = await chrome.evaluate(`
      const raw = localStorage.getItem("buzzcalculus.records.v1");
      const records = raw ? JSON.parse(raw) : {};
      return {
        mistakes: Object.keys(records.mistakes || {}).length,
        history: (records.history || []).length,
        attempts: (records.attemptLog || []).length,
        schema: records.schema
      };
    `);
    check("作答有寫進紀錄", mistakes.history > 0 || mistakes.attempts > 0,
      `history ${mistakes.history} / attemptLog ${mistakes.attempts} / schema ${mistakes.schema}`);
    check("答錯的題進了錯題本", mistakes.mistakes > 0, `${mistakes.mistakes} 題`);

    /* ── 7. 四個主要分頁都要能開 ── */
    for (const [label, action] of [["今天", "home"], ["訓練", "train"], ["數據", "insights"], ["題庫", "library"]]) {
      await chrome.evaluate(`${HELPERS} return window.__e2e.clickSelector('[data-action="${action}"]') || window.__e2e.clickText('${label}');`);
      await chrome.sleep(450);
      const text = await chrome.evaluate(HELPERS + "return window.__e2e.visibleText();");
      check(`「${label}」分頁看得見內容`, text.length > 80, `${text.length} 字`);
    }

    /* ── 7.4 選擇題也要有計算紙 ── */
    // 四個選項擺在那裡不代表答案用看的就看得出來 —— 算完才知道選哪個。
    // 原本只有「自己寫」有紙，選擇題的人只能心算或去拿一張真的紙，
    // 而後者代表他離開了這個畫面。
    const choicePaper = await chrome.evaluate(`
      ${HELPERS}
      // 回到剛才那一局的作答畫面（選擇題模式）
      window.__e2e.clickSelector('[data-action="home"]');
      await new Promise((r) => setTimeout(r, 300));
      window.__e2e.clickText("5 分鐘快刷") || window.__e2e.clickText("開始");
      await new Promise((r) => setTimeout(r, 900));
      const grid = document.querySelector(".choice-grid");
      const toggle = document.querySelector('[data-board-action="toggle"]');
      if (toggle) toggle.click();
      await new Promise((r) => setTimeout(r, 500));
      const canvas = document.querySelector("[data-blackboard]");
      return {
        isChoiceMode: Boolean(grid),
        hasToggle: Boolean(toggle),
        canvasVisible: Boolean(canvas && canvas.getBoundingClientRect().height > 40)
      };
    `);
    if (choicePaper.isChoiceMode) {
      check("選擇題也有計算紙", choicePaper.hasToggle, choicePaper.hasToggle ? "" : "選擇題的作答區沒有計算紙");
      check("選擇題的計算紙攤得開", choicePaper.canvasVisible, choicePaper.canvasVisible ? "" : "點了展開但畫布沒有出現");
    }

    // 這一段開了一局，要離開才不會卡住後面的測試 ——
    // 作答中的頂欄只有「離開」，沒有導覽。
    await chrome.evaluate(`
      ${HELPERS}
      window.__e2e.clickSelector('[data-action="confirm-exit"]');
      await new Promise((r) => setTimeout(r, 300));
      window.__e2e.clickSelector('[data-action="finish-now"]');
      await new Promise((r) => setTimeout(r, 700));
      window.__e2e.clickSelector('[data-action="home"]');
      await new Promise((r) => setTimeout(r, 500));
      return Boolean(document.querySelector('[data-action="open-train"]'));
    `);

    /* ── 7.4 情境題的長題幹要折行 ── */
    // 應用題的題幹是一整段中文敘述，不是一條算式。它必須折行，
    // 不能變成一條要橫向拖曳才看得完的長條。
    //
    // 這條斷言擋的是一個「量錯」的門檻：折行原本看 tex.length > 90，
    // 但中文一個字只佔一個字元卻佔兩欄寬，梯子那題量起來只有 78 —— 於是不折行，
    // 使用者只看得到「長 5 公尺的梯子靠牆，底端以每秒 1 公尺遠」。
    // 字串比對抓不到這種事：DOM 裡的字是全的，壞掉的是版面。
    // 所以這裡真的從題庫開一題出來量 scrollWidth。
    const proseWrap = await chrome.evaluate(`
      ${HELPERS}
      const story = (window.BUZZ_PROBLEMS || []).find((p) => /^dd-rr-/.test(p.id));
      if (!story) return { missing: true };
      window.__e2e.clickSelector('[data-action="open-library"]');
      await new Promise((r) => setTimeout(r, 500));
      const search = document.querySelector("[data-library-search]");
      if (!search) return { missing: true };
      search.value = story.id;
      search.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise((r) => setTimeout(r, 700));
      const started = window.__e2e.clickSelector('[data-action="start-problem"][data-problem-id="' + story.id + '"]');
      await new Promise((r) => setTimeout(r, 1200));
      const node = document.querySelector(".quiz-screen .prompt[data-tex]");
      if (!started || !node) return { missing: true };
      // 量兩件事：有沒有走折行渲染（跟視窗寬度無關），以及此刻有沒有橫向溢出。
      // 只量溢出的話，測試機的視窗夠寬就會漏掉 —— 手機和 iPad 才是真正會爆的地方。
      return {
        id: story.id,
        flowed: node.querySelectorAll(".long-tex-text").length,
        overflow: node.scrollWidth - node.clientWidth,
        shown: (node.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 30)
      };
    `);
    if (proseWrap.missing) {
      check("情境題的長題幹會折行，不是橫向捲動", false, "開不出情境題，這條沒測到");
    } else {
      const wrapped = proseWrap.flowed > 0 && proseWrap.overflow <= 2;
      check("情境題的長題幹會折行，不是橫向捲動", wrapped,
        wrapped
          ? `${proseWrap.id} 切成 ${proseWrap.flowed} 段文字流，溢出 ${proseWrap.overflow}px`
          : `${proseWrap.id} 沒有走折行渲染（文字流 ${proseWrap.flowed} 段、溢出 ${proseWrap.overflow}px），窄畫面上會變成要橫拖的長條`);
    }
    await chrome.evaluate(`
      ${HELPERS}
      window.__e2e.clickSelector('[data-action="confirm-exit"]');
      await new Promise((r) => setTimeout(r, 300));
      window.__e2e.clickSelector('[data-action="finish-now"]');
      await new Promise((r) => setTimeout(r, 700));
      window.__e2e.clickSelector('[data-action="home"]');
      await new Promise((r) => setTimeout(r, 500));
      return true;
    `);

    /* ── 7.5 出卷已於 2026-09 移除：紙本需求由 workbook.html 承擔 ──
       這裡改守「移除是乾淨的」：模擬分頁上不准再出現出卷入口。 */
    const paperGone = await chrome.evaluate(`
      ${HELPERS}
      window.__e2e.clickSelector('[data-action="open-train"]');
      await new Promise((r) => setTimeout(r, 400));
      window.__e2e.clickSelector('[data-action="set-bucket"][data-bucket="exam"]');
      await new Promise((r) => setTimeout(r, 400));
      return {
        entry: Boolean(document.querySelector('[data-action="open-paper"]')),
        exam: Boolean(document.querySelector('[data-action="start-mode"][data-mode-key="exam"]'))
      };
    `);
    check("出卷入口已移除", !paperGone.entry);
    check("大考模式仍在模擬分頁上", paperGone.exam);

    /* ── 7.6 答案驗算的標記真的出現在題庫上 ── */
    const verified = await chrome.evaluate(`
      ${HELPERS}
      window.__e2e.clickSelector('[data-action="open-library"]');
      await new Promise((r) => setTimeout(r, 700));
      return {
        sideTable: Boolean(window.BuzzVerifiedAnswers),
        count: window.BuzzVerifiedAnswers ? window.BuzzVerifiedAnswers.count : 0,
        chips: document.querySelectorAll(".chip.is-verified").length
      };
    `);
    check("驗算側表有載入", verified.sideTable, `${verified.count} 題通過獨立驗算`);
    check(
      "題庫上看得到「答案已驗算」",
      verified.chips > 0,
      `${verified.chips} 個標記 —— 這是競品沒有的一句話，藏在 CI 裡等於沒有`
    );

    /* ── 8. 鍵盤快捷鍵（P1 加的，只有真的按鍵才測得到）── */
    await chrome.evaluate(`${HELPERS} return window.__e2e.clickSelector('[data-action="home"]');`);
    await chrome.sleep(300);
    await chrome.send("Input.dispatchKeyEvent", { type: "keyDown", key: "?", text: "?" });
    await chrome.send("Input.dispatchKeyEvent", { type: "keyUp", key: "?" });
    await chrome.sleep(400);
    const shortcutText = await chrome.evaluate(HELPERS + "return window.__e2e.visibleText();");
    check("按 ? 會叫出快捷鍵說明", /快捷|Enter|空白/.test(shortcutText),
      shortcutText.split("\n").find((line) => /快捷/.test(line)) || "");

    /* ── 8.5 推導式提示有接上 ── */
    const hintWiring = await chrome.evaluate(`
      const api = window.BuzzDerivedHints;
      return {
        loaded: Boolean(api),
        count: Object.keys(window.BUZZ_DERIVED_HINTS || {}).length,
        sample: api ? api.textFor("lim-001") : ""
      };
    `);
    check(
      "推導式提示有載入並接上",
      hintWiring.loaded && hintWiring.count > 0 && hintWiring.sample.length > 10,
      `${hintWiring.count} 條，lim-001 → ${(hintWiring.sample || "(無)").slice(0, 26)}`
    );

    /* ── 8.6 刪除資料真的刪乾淨 ── */
    // 政策上寫「清除資料會刪掉手寫草稿與進行中的存檔」。
    // 靜態檢查看得到程式碼有寫，但只有真的在瀏覽器裡按下去，
    // 才知道 localStorage 與 IndexedDB 是不是真的空了。
    const erased = await chrome.evaluate(`
      ${HELPERS}
      const keysNow = () => Object.keys(localStorage).filter((k) => k.startsWith("buzzcalculus"));
      const before = keysNow();

      window.__e2e.clickSelector('[data-action="settings"]') || window.__e2e.clickText("設定");
      await new Promise((r) => setTimeout(r, 450));
      const openedSettings = Boolean(window.__e2e.clickText("清除資料"));
      await new Promise((r) => setTimeout(r, 350));

      // 確認步驟一定要出現：不可逆的動作不能一鍵完成
      // 要抓的是**刪除確認**那個 modal，不是畫面上剛好開著的其他 modal。
      // 第一版用 [data-modal] 抓到的是前一步「按 ? 」留下的快捷鍵說明。
      const confirmButton = document.querySelector('[data-action="confirm-erase"]');
      const confirmShown = Boolean(confirmButton);
      const confirmText = confirmButton
        ? (confirmButton.closest("[data-modal]") || {}).innerText || ""
        : "";

      window.__e2e.clickSelector('[data-action="confirm-erase"]');
      await new Promise((r) => setTimeout(r, 700));
      return { before, after: keysNow(), confirmShown, openedSettings, confirmText: confirmText.slice(0, 120) };
    `);
    check("設定頁有「清除資料」", erased.openedSettings);
    check("刪除前會先確認，而且說清楚會刪掉什麼", erased.confirmShown && /錯題本|存檔|草稿/.test(erased.confirmText),
      erased.confirmText.replace(/\s+/g, " ").slice(0, 60));
    check(
      "清除資料真的把 localStorage 清乾淨",
      erased.before.length > 0 && erased.after.length === 0,
      `刪除前 ${erased.before.length} 個 key（${erased.before.join(", ")}）→ 刪除後 ${erased.after.length} 個`
    );

    /* ── 9. 全程不能有 console 錯誤或 404 ── */
    const errors = chrome.consoleMessages.filter((m) => m.type === "error");
    check("console 沒有錯誤", errors.length === 0, errors.slice(0, 3).map((e) => e.text).join(" | "));
    check("沒有未捕捉的例外", chrome.pageErrors.length === 0, chrome.pageErrors.slice(0, 2).join(" | "));
    check("沒有 404 資源", server.missing.length === 0, server.missing.slice(0, 5).join(", "));
  } finally {
    if (!process.argv.includes("--keep")) await chrome.close();
    await server.stop();
  }
}

run().then(() => {
  console.log("");
  console.log(`E2E: ${steps.filter((s) => s.ok).length}/${steps.length} 通過`);
  if (failures) {
    console.error(`\n失敗 ${failures} 項：`);
    steps.filter((s) => !s.ok).forEach((s) => console.error(`  ${s.name}  ${s.detail || ""}`));
    process.exit(1);
  }
  console.log("e2e OK");
}).catch((error) => {
  console.error("\nE2E 執行失敗：" + error.message);
  console.error(error.stack);
  process.exit(1);
});
