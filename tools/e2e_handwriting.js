// E2E：手寫計算紙（iPad + Apple Pencil 的那條路徑）
//
// 這一支存在的理由跟主幹 E2E 不同。手寫的品質沒辦法用「HTML 字串裡有沒有那些字」
// 驗證 —— 它的失敗方式全部是行為層的：
//
//   - 手掌碰到畫布，拖出一條橫貫全頁的線
//   - 長按跳出「拷貝／查詢」選單，書寫中斷
//   - 橡皮擦拿背景色蓋過去，把方格紙的格線一起蓋掉
//   - 復原一筆會整頁重繪，canvas 被換掉，看得出來卡一下
//
// 所以這支的斷言全部打在**畫布的像素**和**實際派發的 PointerEvent** 上。
// 用合成事件測得到處理邏輯（手掌判定、工具、座標換算），
// 測不到瀏覽器自己的 touch-action 與 callout —— 那兩項改用 computed style 驗。
//
// 用法：
//   node tools/e2e_handwriting.js
//   node tools/e2e_handwriting.js --keep    失敗時保留瀏覽器

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

/* ── 在頁面裡模擬一支筆 ───────────────────────────────────────
   合成的 PointerEvent 沒有 getCoalescedEvents 的內容，這剛好也測到
   「撈不到 coalesced 就退回用事件本身」那條分支。 */

const PEN = `
  window.__pen = {
    canvas() { return document.querySelector("[data-blackboard]"); },
    at(fx, fy) {
      const rect = this.canvas().getBoundingClientRect();
      return { clientX: rect.left + rect.width * fx, clientY: rect.top + rect.height * fy };
    },
    send(type, fx, fy, options) {
      const opts = options || {};
      const point = this.at(fx, fy);
      const event = new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId: opts.pointerId == null ? 1 : opts.pointerId,
        pointerType: opts.pointerType || "pen",
        pressure: opts.pressure == null ? 0.5 : opts.pressure,
        isPrimary: opts.isPrimary !== false,
        clientX: point.clientX,
        clientY: point.clientY
      });
      this.canvas().dispatchEvent(event);
      return event;
    },
    // 從 (x1,y1) 畫到 (x2,y2)，中間切 steps 個取樣點
    stroke(x1, y1, x2, y2, options) {
      const opts = options || {};
      const steps = opts.steps || 12;
      this.send("pointerdown", x1, y1, opts);
      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps;
        this.send("pointermove", x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, opts);
      }
      this.send("pointerup", x2, y2, opts);
    },
    // 畫布上有墨水的像素數。畫布是透明的，所以 alpha > 0 就是墨水。
    inkPixels() {
      const canvas = this.canvas();
      const ctx = canvas.getContext("2d");
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let count = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] > 8) count += 1;
      return count;
    },
    strokeCount() {
      const id = this.canvas().dataset.problemId;
      const board = window.__quizBoard && window.__quizBoard();
      return board ? (board[id] || []).length : -1;
    }
  };
`;

async function run() {
  console.log("E2E 手寫計算紙");
  const chromePath = findChrome();
  if (!chromePath) {
    console.error("\n找不到 Chrome。設定 CHROME_PATH 或安裝 Chrome。");
    process.exit(1);
  }

  const server = await staticServer.start(ROOT, 0);
  console.log(`  server   ${server.url}`);
  const chrome = await launch();

  try {
    await chrome.navigate(server.url + "/index.html");
    await chrome.evaluate("localStorage.clear(); return 1;");
    await chrome.navigate(server.url + "/index.html");

    /* ── 走過 onboarding，切成輸入作答，開一局 ── */
    await chrome.evaluate(`
      const click = (needle) => {
        const hit = [...document.querySelectorAll("button, a, [data-action]")]
          .find((n) => (n.innerText || "").replace(/\\s+/g, "").includes(needle));
        if (hit) hit.click();
        return Boolean(hit);
      };
      click("開始");
      return 1;
    `);
    await chrome.sleep(250);
    await chrome.evaluate(`
      const click = (needle) => {
        const hit = [...document.querySelectorAll("button, a, [data-action]")]
          .find((n) => (n.innerText || "").replace(/\\s+/g, "").includes(needle));
        if (hit) hit.click();
        return Boolean(hit);
      };
      click("大一微積分");
      return 1;
    `);
    await chrome.sleep(250);
    await chrome.evaluate(`
      const click = (needle) => {
        const hit = [...document.querySelectorAll("button, a, [data-action]")]
          .find((n) => (n.innerText || "").replace(/\\s+/g, "").includes(needle));
        if (hit) hit.click();
        return Boolean(hit);
      };
      click("直接開始練");
      return 1;
    `);
    await chrome.sleep(500);

    // 手寫只出現在「自己寫」的作答形式，選擇題沒有計算紙。
    // 這個切換在訓練分頁的「本局設定」裡 —— 它一度是寫好但沒有被 render 的死碼，
    // 也就是說計算紙做得再好都到不了。這一條同時擋住那個回歸。
    await chrome.evaluate(`
      const hit = [...document.querySelectorAll("button, a, [data-action]")]
        .find((n) => (n.innerText || "").replace(/\\s+/g, "").includes("訓練"));
      if (hit) hit.click();
      return 1;
    `);
    await chrome.sleep(500);

    const modeSwitched = await chrome.evaluate(`
      const free = document.querySelector('[data-answer-mode="free"]');
      if (!free) return false;
      free.click();
      return true;
    `);
    check("使用者找得到「自己寫」的作答形式", modeSwitched, modeSwitched ? "" : "找不到 [data-answer-mode] —— 計算紙沒有入口");
    await chrome.sleep(400);

    // 主線是「按開始 → 關卡說明 → 開始本關」兩段
    await chrome.evaluate(`
      const hit = document.querySelector('[data-action="start-path-node"]');
      if (hit) hit.click();
      return 1;
    `);
    await chrome.sleep(700);
    await chrome.evaluate(`
      const hit = document.querySelector('[data-action="start-path-lesson"]');
      if (hit) hit.click();
      return 1;
    `);
    await chrome.sleep(900);

    // 計算紙預設是收起來的，先攤開
    await chrome.evaluate(`
      if (!document.querySelector("[data-blackboard]")) {
        const toggle = document.querySelector('[data-board-action="toggle"]');
        if (toggle) toggle.click();
      }
      return 1;
    `);
    await chrome.sleep(400);

    const present = await chrome.evaluate(`
      const canvas = document.querySelector("[data-blackboard]");
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return { surface: canvas.dataset.surface, w: Math.round(rect.width), h: Math.round(rect.height) };
    `);
    if (!check("計算紙有出現", Boolean(present), present ? `${present.w}×${present.h}` : "找不到 canvas")) {
      throw new Error("沒有畫布就沒有後面的測試");
    }
    check("預設是方格紙不是黑板", present.surface === "paper", `data-surface="${present.surface}"`);

    /* ── 1. iPad 的選取問題 ── */
    const selection = await chrome.evaluate(`
      const screen = document.querySelector(".quiz-screen") || document.querySelector(".handwrite-shell");
      const canvas = document.querySelector("[data-blackboard]");
      const input = document.querySelector(".quiz-screen input[type=text], .quiz-screen input:not([type=range]), .quiz-screen textarea");
      const cs = (el) => el ? getComputedStyle(el) : null;
      const screenStyle = cs(screen);
      const canvasStyle = cs(canvas);
      const inputStyle = cs(input);
      return {
        screenSelect: screenStyle && (screenStyle.userSelect || screenStyle.webkitUserSelect),
        screenCallout: screenStyle && screenStyle.getPropertyValue("-webkit-touch-callout"),
        canvasTouchAction: canvasStyle && canvasStyle.touchAction,
        inputSelect: inputStyle && (inputStyle.userSelect || inputStyle.webkitUserSelect),
        hasInput: Boolean(input)
      };
    `);
    check(
      "作答畫面不會被長按選取",
      selection.screenSelect === "none",
      `user-select: ${selection.screenSelect}`
    );

    // 第一版只把規則套在 .quiz-screen 上，於是頂欄、對話框、結算頁、題庫、
    // 出卷頁全都還是選得到 —— 而使用者的手指跟筆碰得到的就是整個畫面。
    // 這一條逐一走過那些「當初漏掉」的地方。
    const everywhere = await chrome.evaluate(`
      const spots = [
        [".topbar", "頂欄"],
        [".brand", "站名"],
        [".nav-button", "分頁按鈕"],
        [".problem-card", "題目卡"],
        [".prompt", "題目本文"],
        [".katex", "數學式"],
        [".chip", "標籤"],
        [".scratchboard-summary", "計算紙標題列"],
        [".board-tools", "計算紙工具列"]
      ];
      const bad = [];
      const seen = [];
      spots.forEach(([selector, label]) => {
        const el = document.querySelector(selector);
        if (!el) return;
        const style = getComputedStyle(el);
        const value = style.userSelect || style.webkitUserSelect;
        seen.push(label);
        if (value !== "none") bad.push(label + "=" + value);
      });
      return { checked: seen.length, bad };
    `);
    check(
      "整個畫面都不會被長按選取，不只作答區",
      everywhere.bad.length === 0,
      everywhere.bad.length ? `這些地方還選得到：${everywhere.bad.join("、")}` : `${everywhere.checked} 個位置都是 none`
    );
    // -webkit-touch-callout 只有 Safari／iOS 認得，桌面 Chrome 的 computed style
    // 一律回空字串。所以這一條改成驗「規則有沒有出貨」，而不是驗「有沒有生效」——
    // 生效與否只能在真的 iPad 上看，但規則掉了這裡會紅。
    // 連 CSSOM 都不行：Chrome 在解析階段就把不認得的宣告丟掉，
    // cssRules 裡看不到。所以直接讀出貨的那份 styles.css 原始碼。
    const calloutShipped = await chrome.evaluate(`
      const href = [...document.querySelectorAll('link[rel="stylesheet"]')]
        .map((n) => n.href).find((h) => /styles\\.css/.test(h));
      if (!href) return -1;
      const source = await fetch(href).then((r) => r.text());
      return (source.match(/-webkit-touch-callout:\\s*none/g) || []).length;
    `);
    check(
      "長按不會跳出拷貝／查詢選單",
      calloutShipped > 0,
      `styles.css 裡有 ${calloutShipped} 條 -webkit-touch-callout: none（桌面 Chrome 不認這個屬性，只能驗規則有出貨）`
    );
    check(
      "畫布不會被手勢搶去捲動或縮放",
      selection.canvasTouchAction === "none",
      `touch-action: ${selection.canvasTouchAction}`
    );
    check(
      "但輸入框還是選得到、貼得上",
      !selection.hasInput || selection.inputSelect === "text",
      selection.hasInput ? `input user-select: ${selection.inputSelect}` : "這一題沒有輸入框"
    );

    /* ── 2. 筆真的畫得出東西 ── */
    const drew = await chrome.evaluate(`
      ${PEN}
      window.__quizBoard = () => {
        // 從畫布反查目前這一題的筆畫，不用任何測試專用的後門
        return null;
      };
      const before = window.__pen.inkPixels();
      window.__pen.stroke(0.15, 0.3, 0.85, 0.3, { pressure: 0.6 });
      const after = window.__pen.inkPixels();
      return { before, after };
    `);
    check("筆畫得出墨水", drew.before === 0 && drew.after > 200, `${drew.before} → ${drew.after} 個墨水像素`);

    /* ── 3. 手掌不會畫出線 ── */
    const palm = await chrome.evaluate(`
      ${PEN}
      const before = window.__pen.inkPixels();
      // 筆剛離開畫布，這時候手掌落下 —— iPad 上這是最常發生的一刻
      window.__pen.stroke(0.15, 0.6, 0.85, 0.6, { pointerType: "touch", pointerId: 9 });
      const afterPalm = window.__pen.inkPixels();
      return { before, afterPalm };
    `);
    check(
      "剛用完筆之後，手掌碰到畫布不會畫線",
      palm.afterPalm === palm.before,
      `${palm.before} → ${palm.afterPalm} 個墨水像素`
    );

    /* ── 4. 但放下筆一段時間之後，手指還是能畫 ── */
    await chrome.sleep(1600);
    const finger = await chrome.evaluate(`
      ${PEN}
      const before = window.__pen.inkPixels();
      window.__pen.stroke(0.15, 0.75, 0.6, 0.75, { pointerType: "touch", pointerId: 11 });
      const after = window.__pen.inkPixels();
      return { before, after };
    `);
    check(
      "放下筆超過一秒半，手指就能接手畫",
      finger.after > finger.before + 100,
      `${finger.before} → ${finger.after} 個墨水像素`
    );

    /* ── 5. 壓力影響粗細 ── */
    const pressure = await chrome.evaluate(`
      ${PEN}
      const light0 = window.__pen.inkPixels();
      window.__pen.stroke(0.15, 0.42, 0.85, 0.42, { pressure: 0.15 });
      const light = window.__pen.inkPixels() - light0;
      const heavy0 = window.__pen.inkPixels();
      window.__pen.stroke(0.15, 0.52, 0.85, 0.52, { pressure: 1 });
      const heavy = window.__pen.inkPixels() - heavy0;
      return { light, heavy };
    `);
    check(
      "壓得重線就粗",
      pressure.heavy > pressure.light * 1.4,
      `輕 ${pressure.light} vs 重 ${pressure.heavy} 個像素`
    );

    /* ── 6. 橡皮擦是真的擦掉，不是拿背景色蓋 ── */
    const erased = await chrome.evaluate(`
      ${PEN}
      // 每次都重新查 canvas —— 切換工具會走 render()，畫布是新的節點。
      // 抓著舊的參照取樣，量到的是已經 detach 的那一張。
      const sample = () => {
        const canvas = window.__pen.canvas();
        const ctx = canvas.getContext("2d");
        const x = Math.floor(canvas.width * 0.5);
        const y = Math.floor(canvas.height * 0.3);
        const px = ctx.getImageData(x, y, 1, 1).data;
        return { r: px[0], g: px[1], b: px[2], a: px[3] };
      };
      const beforePixel = sample();
      const beforeInk = window.__pen.inkPixels();
      const eraser = document.querySelector('[data-board-action="tool"][data-tool="eraser"]');
      eraser.click();
      await new Promise((r) => setTimeout(r, 350));
      window.__pen.stroke(0.15, 0.3, 0.85, 0.3, { pressure: 0.8 });
      const afterPixel = sample();
      const afterInk = window.__pen.inkPixels();
      return { beforePixel, afterPixel, beforeInk, afterInk };
    `);
    check(
      "橡皮擦擦得掉墨水",
      erased.afterInk < erased.beforeInk,
      `${erased.beforeInk} → ${erased.afterInk} 個墨水像素`
    );
    check(
      "擦過的地方是透明的，不是被背景色蓋住",
      erased.beforePixel.a > 0 && erased.afterPixel.a === 0,
      `alpha ${erased.beforePixel.a} → ${erased.afterPixel.a}（不是 0 的話，方格紙的格線會被一起蓋掉）`
    );

    /* ── 7. 復原不會把畫布整個換掉 ── */
    const undone = await chrome.evaluate(`
      ${PEN}
      const canvasBefore = window.__pen.canvas();
      const inkBefore = window.__pen.inkPixels();
      const label = document.querySelector("[data-board-count]");
      const labelBefore = label ? label.textContent.trim() : "";
      document.querySelector('[data-board-action="undo"]').click();
      await new Promise((r) => setTimeout(r, 300));
      const canvasAfter = window.__pen.canvas();
      return {
        sameNode: canvasBefore === canvasAfter,
        inkBefore,
        inkAfter: window.__pen.inkPixels(),
        labelBefore,
        labelAfter: document.querySelector("[data-board-count]")?.textContent.trim() || ""
      };
    `);
    check(
      "復原不會重繪整個畫面",
      undone.sameNode,
      undone.sameNode ? "canvas 還是同一個節點" : "canvas 被換掉了 —— 整頁重繪"
    );
    // 這裡被復原掉的是「橡皮擦那一筆」，所以墨水會變多 —— 擦掉的東西回來了。
    check("復原真的改變畫面", undone.inkAfter !== undone.inkBefore, `${undone.inkBefore} → ${undone.inkAfter} 個墨水像素`);
    check(
      "筆畫數的標籤跟著更新",
      undone.labelAfter !== undone.labelBefore,
      `「${undone.labelBefore}」→「${undone.labelAfter}」`
    );

    /* ── 8. 換成黑板，墨水顏色要跟著換 ── */
    const surfaced = await chrome.evaluate(`
      ${PEN}
      document.querySelector('[data-board-action="surface"]').click();
      await new Promise((r) => setTimeout(r, 400));
      const canvas = document.querySelector("[data-blackboard]");
      if (!canvas) return { surface: null };
      const ctx = canvas.getContext("2d");
      // 在黑板上畫一筆，取樣墨水顏色
      window.__pen.stroke(0.2, 0.85, 0.7, 0.85, { pressure: 0.9 });
      let ink = null;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 200) { ink = { r: data[i], g: data[i + 1], b: data[i + 2] }; break; }
      }
      return { surface: canvas.dataset.surface, ink };
    `);
    check("能換成黑板", surfaced.surface === "board", `data-surface="${surfaced.surface}"`);
    check(
      "黑板上的字是亮的",
      Boolean(surfaced.ink) && surfaced.ink.r > 200 && surfaced.ink.g > 200,
      surfaced.ink ? `ink rgb(${surfaced.ink.r}, ${surfaced.ink.g}, ${surfaced.ink.b})` : "沒取到墨水"
    );

    /* ── 9. 全螢幕書寫時題目要留在畫面上 ── */
    // 一開始沒做這件事，實測就發現攤開計算紙之後題目被推出視窗，
    // 使用者得先收起計算紙看一眼題目再攤開 —— 那等於沒有全螢幕。
    const fullscreen = await chrome.evaluate(`
      document.querySelector('[data-board-action="fullscreen"]').click();
      await new Promise((r) => setTimeout(r, 600));
      const shell = document.querySelector(".handwrite-shell.is-fullscreen");
      const prompt = document.querySelector(".handwrite-prompt");
      const canvas = document.querySelector("[data-blackboard]");
      const visible = (el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && Number(style.opacity) !== 0;
      };
      return {
        isFullscreen: Boolean(shell),
        promptVisible: visible(prompt),
        promptHasMath: Boolean(prompt && prompt.querySelector(".katex")),
        // 全螢幕的意義是書寫區真的變大
        canvasHeight: canvas ? Math.round(canvas.getBoundingClientRect().height) : 0,
        viewportHeight: window.innerHeight
      };
    `);
    check("計算紙進得了全螢幕", fullscreen.isFullscreen);
    check(
      "全螢幕時題目還看得到",
      fullscreen.promptVisible && fullscreen.promptHasMath,
      fullscreen.promptVisible ? "題目列有渲染出數學式" : "題目被推出畫面了"
    );
    check(
      "全螢幕真的把書寫區變大",
      fullscreen.canvasHeight > fullscreen.viewportHeight * 0.5,
      `書寫區 ${fullscreen.canvasHeight}px / 視窗 ${fullscreen.viewportHeight}px`
    );

    /* ── 9.5 但法務頁還是要能複製 ── */
    // 全站關掉選取之後最容易誤傷的就是這裡：一份不能複製、不能引用的隱私政策
    // 本身就是一個信任訊號 —— 錯的那種。
    await chrome.navigate(server.url + "/privacy.html", { appReady: false });
    await chrome.sleep(500);
    const legal = await chrome.evaluate(`
      const body = getComputedStyle(document.body);
      const para = document.querySelector(".legal-page p");
      const link = document.querySelector(".legal-page a");
      const val = (el) => { const s = getComputedStyle(el); return s.userSelect || s.webkitUserSelect; };
      return {
        bodySelect: body.userSelect || body.webkitUserSelect,
        paraSelect: para ? val(para) : "(找不到段落)",
        linkSelect: link ? val(link) : "(找不到連結)"
      };
    `);
    check(
      "隱私政策的內文還是選得起來",
      legal.paraSelect === "text",
      `body=${legal.bodySelect} / 內文=${legal.paraSelect} / 連結=${legal.linkSelect}`
    );

    /* ── 10. 全程不能有錯誤 ── */
    const errors = chrome.consoleMessages.filter((m) => m.type === "error");
    check("console 沒有錯誤", errors.length === 0, errors.slice(0, 3).map((e) => e.text).join(" | "));
    check("沒有未捕捉的例外", chrome.pageErrors.length === 0, chrome.pageErrors.slice(0, 2).join(" | "));
  } finally {
    if (!process.argv.includes("--keep")) await chrome.close();
    await server.stop();
  }
}

run().then(() => {
  console.log("");
  console.log(`E2E 手寫: ${steps.filter((s) => s.ok).length}/${steps.length} 通過`);
  if (failures) {
    console.error(`\n失敗 ${failures} 項：`);
    steps.filter((s) => !s.ok).forEach((s) => console.error(`  ${s.name}  ${s.detail || ""}`));
    process.exit(1);
  }
  console.log("handwriting OK");
}).catch((error) => {
  console.error("\nE2E 執行失敗：" + error.message);
  console.error(error.stack);
  process.exit(1);
});
