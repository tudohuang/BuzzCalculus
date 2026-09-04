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
    /* ── 3.6 iPad：不叫系統鍵盤也要打得完一個答案 ── */
    // iPad 上點輸入框會跳系統鍵盤，蓋掉半個畫面 —— 蓋住的正是剛剛寫滿算式的
    // 計算紙，而且你得先放下筆。畫面上那套數學鍵盤本來沒有數字，
    // 所以「2*x^3」「3/4」這種答案一定得回去用系統鍵盤。
    await chrome.send("Emulation.setDeviceMetricsOverride", {
      width: 834, height: 1194, deviceScaleFactor: 2, mobile: true
    });
    // setDeviceMetricsOverride 會把觸控模擬的狀態洗掉，pointer: coarse 跟著變 false。
    // 不重新開啟的話，測到的是一台「桌機尺寸剛好等於 iPad」的機器 ——
    // 而 app 的平板行為全部掛在 pointer: coarse 上，等於整段沒測到。
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await chrome.navigate(`${server.url}/index.html`);
    await chrome.evaluate("localStorage.clear(); return 1;");
    await chrome.navigate(`${server.url}/index.html`);
    await chrome.sleep(700);
    const input = await chrome.evaluate(`
      const c = (n) => { const h=[...document.querySelectorAll("button,a,[data-action]")].find(x=>(x.innerText||"").replace(/\s+/g,"").includes(n)); if(h) h.click(); return !!h; };
      c("開始"); await new Promise(r=>setTimeout(r,600));
      c("大一微積分"); await new Promise(r=>setTimeout(r,600));
      c("直接開始練"); await new Promise(r=>setTimeout(r,1000));
      const m=[...document.querySelectorAll("button")].find(b=>/知道了/.test(b.textContent)); if(m) m.click();
      await new Promise(r=>setTimeout(r,500));
      // 切成「自己寫」
      c("訓練"); await new Promise(r=>setTimeout(r,700));
      const free=document.querySelector('[data-answer-mode="free"]');
      if(!free) return { ok:false, why:"找不到作答形式切換" };
      free.click(); await new Promise(r=>setTimeout(r,500));
      const node=document.querySelector('[data-action="start-path-node"]');
      if(node) node.click(); await new Promise(r=>setTimeout(r,700));
      const lesson=document.querySelector('[data-action="start-path-lesson"]');
      if(lesson) lesson.click(); await new Promise(r=>setTimeout(r,1200));
      const m2=[...document.querySelectorAll("button")].find(b=>/知道了/.test(b.textContent)); if(m2) m2.click();
      await new Promise(r=>setTimeout(r,500));
      const field=document.querySelector("#answer");
      if(!field) return { ok:false, why:"沒有輸入框" };
      // 數學鍵盤上有沒有數字
      const keys=[...document.querySelectorAll("[data-insert]")].map(b=>b.dataset.insert);
      const digits="0123456789".split("").filter(d=>keys.includes(d));
      return {
        ok:true,
        inputmode: field.getAttribute("inputmode"),
        coarse: matchMedia("(pointer: coarse)").matches,
        freeMode: !document.querySelector(".choice-grid"),

        hasToggle: Boolean(document.querySelector('[data-action="toggle-system-keyboard"]')),
        digitsOnKeypad: digits.length,
        keyCount: keys.length
      };
    `);
    if (!input.ok) {
      check("iPad 不用系統鍵盤也打得完答案", false, input.why);
    } else {
      check("iPad 上輸入框不會叫出系統鍵盤", input.inputmode === "none",
        `inputmode="${input.inputmode}" · coarse=${input.coarse} · 自己寫模式=${input.freeMode}` + (input.inputmode === "none" ? "" : " —— 會蓋掉計算紙，而且要放下筆"));
      check("數學鍵盤上有全部十個數字", input.digitsOnKeypad === 10,
        `${input.digitsOnKeypad}/10 個數字，全鍵盤共 ${input.keyCount} 鍵` +
        (input.digitsOnKeypad === 10 ? "" : " —— 少了數字就一定得回去用系統鍵盤"));
      check("留了切回系統鍵盤的出口", input.hasToggle,
        input.hasToggle ? "" : "接實體鍵盤或想打字的人會被鎖死");
    }

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

    /* ── 3.4 手機：答錯之後不能把 300px 側欄硬塞進 390px 的螢幕 ── */
    // .problem-stage.has-feedback 是兩個 class 的選擇器，特異性贏過
    // 媒體查詢裡單 class 的 .problem-stage { 1fr }。修掉之前，手機上一出現
    // 回饋，題目卡被壓成細條、綠色回饋卡自己也擠到讀不了。
    await chrome.navigate(`${server.url}/index.html`);
    await chrome.sleep(800);
    const wrongFb = await chrome.evaluate(`
      const c = (n) => { const h=[...document.querySelectorAll("button,a,[data-action]")].find(x=>(x.innerText||"").includes(n)); if(h) h.click(); return !!h; };
      // 切成「自己寫」：送一個亂寫的答案就保證判錯，
      // 不用跟選擇題的隨機正解賭運氣。
      c("訓練"); await new Promise(r=>setTimeout(r,700));
      const free=document.querySelector('[data-answer-mode="free"]');
      if(free) free.click(); await new Promise(r=>setTimeout(r,500));
      const lib=document.querySelector('[data-action="open-library"]');
      if(!lib) return { ok:false, why:"找不到題庫" };
      lib.click(); await new Promise(r=>setTimeout(r,900));
      const s=document.querySelector("[data-library-search]");
      if(s){ s.value="dd-rr-001"; s.dispatchEvent(new Event("input",{bubbles:true})); await new Promise(r=>setTimeout(r,700)); }
      const go=document.querySelector('[data-action="start-problem"]');
      if(!go) return { ok:false, why:"題庫裡沒有可開始的題目" };
      go.click(); await new Promise(r=>setTimeout(r,1200));
      const ack=[...document.querySelectorAll("button")].find(b=>b.textContent.includes("知道了"));
      if(ack){ ack.click(); await new Promise(r=>setTimeout(r,400)); }
      const input=document.querySelector("#answer");
      const form=document.querySelector('[data-action="submit-answer"]');
      if(!input||!form) return { ok:false, why:"不是自己寫模式，做不出保證答錯" };
      input.value="424242.424242";
      input.dispatchEvent(new Event("input",{bubbles:true}));
      if(form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));
      await new Promise(r=>setTimeout(r,600));
      const stage=document.querySelector(".problem-stage.has-feedback");
      const panel=document.querySelector(".feedback.wrong, .feedback.timeout");
      if(!stage||!panel) return { ok:false, why:"送出後沒有出現答錯回饋" };
      const cols=getComputedStyle(stage).gridTemplateColumns.trim().split(" ").filter(Boolean).length;
      const rect=panel.getBoundingClientRect();
      const card=document.querySelector(".problem-card").getBoundingClientRect();
      const btn=document.querySelector('[data-action="next-question"]');
      let nextHit=false; let hitDebug="沒有下一題按鈕";
      if(btn){
        btn.scrollIntoView({block:"center"});
        await new Promise(r=>setTimeout(r,250));
        const b=btn.getBoundingClientRect();
        const at=document.elementFromPoint(b.left+b.width/2, b.top+b.height/2);
        nextHit=Boolean(at&&(at===btn||btn.contains(at)));
        hitDebug="btn@"+Math.round(b.top)+","+Math.round(b.left)+" "+Math.round(b.width)+"x"+Math.round(b.height)
          +" 命中="+(at?at.tagName.toLowerCase()+"."+String(at.className).slice(0,40):"null")
          +" 視窗高="+window.innerHeight;
      }
      return {
        ok:true, cols,
        panelShare: Math.round((rect.width/window.innerWidth)*100),
        cardShare: Math.round((card.width/window.innerWidth)*100),
        overflow: document.documentElement.scrollWidth-window.innerWidth,
        nextHit, hitDebug
      };
    `);
    /* ── 3.45 答對的「+分數」toast ── */
    // 答對 950ms 就自動前進，回饋卡在手機上根本來不及看 ——
    // 修法是把分數帶到下一題的畫面上當 toast。這條釘住它真的有出現。
    // 做法純 DOM：搜「正立方體」命中三題（dd-rr-013 體積變率 600、
    // dd-rr-014 表面積變率 1/96、dd-lin-005 誤差估計 1.5），
    // 從題幹的關鍵詞判斷抽到哪一題，送出正確答案。
    await chrome.navigate(`${server.url}/index.html`);
    await chrome.sleep(800);
    const toast = await chrome.evaluate(`
      const c = (n) => { const h=[...document.querySelectorAll("button,a,[data-action]")].find(x=>(x.innerText||"").includes(n)); if(h) h.click(); return !!h; };
      c("訓練"); await new Promise(r=>setTimeout(r,700));
      const free=document.querySelector('[data-answer-mode="free"]');
      if(free) free.click(); await new Promise(r=>setTimeout(r,500));
      const lib=document.querySelector('[data-action="open-library"]');
      if(!lib) return { ok:false, why:"找不到題庫" };
      lib.click(); await new Promise(r=>setTimeout(r,900));
      const s=document.querySelector("[data-library-search]");
      if(!s) return { ok:false, why:"沒有搜尋框" };
      s.value="正立方體"; s.dispatchEvent(new Event("input",{bubbles:true}));
      await new Promise(r=>setTimeout(r,700));
      const go=document.querySelector('[data-action="start-library-filter"]');
      if(!go || go.disabled) return { ok:false, why:"「練目前篩選」不能按" };
      go.click(); await new Promise(r=>setTimeout(r,1200));
      const ack=[...document.querySelectorAll("button")].find(b=>b.textContent.includes("知道了"));
      if(ack){ ack.click(); await new Promise(r=>setTimeout(r,400)); }
      const input=document.querySelector("#answer");
      const form=document.querySelector('[data-action="submit-answer"]');
      if(!input||!form) return { ok:false, why:"不是自己寫模式" };
      const promptText=document.body.innerText;
      input.value = promptText.includes("誤差") ? "1.5"
        : promptText.includes("表面積") ? "1/96" : "600";
      input.dispatchEvent(new Event("input",{bubbles:true}));
      if(form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));
      // 950ms 自動前進 + 重繪
      await new Promise(r=>setTimeout(r,1400));
      const node=document.querySelector(".correct-toast");
      if(!node) return { ok:true, shown:false };
      const rect=node.getBoundingClientRect();
      return {
        ok:true, shown:true,
        text:(node.textContent||"").trim(),
        inViewport: rect.top >= 0 && rect.bottom <= window.innerHeight && rect.width > 0,
        onNextQuestion: Boolean(document.querySelector("#answer"))
      };
    `);
    if (!toast.ok) {
      check("答對後下一題畫面出現 +分數 toast", false, toast.why);
    } else {
      check("答對後下一題畫面出現 +分數 toast", toast.shown && /答對/.test(toast.text || ""),
        toast.shown ? `「${toast.text}」· 在視窗內=${toast.inViewport} · 已前進=${toast.onNextQuestion}` : "toast 沒出現（答錯了？還是被結算頁吃掉？）");
    }

    if (!wrongFb.ok) {
      check("手機答錯後版面收成單欄", false, wrongFb.why);
    } else {
      check("手機答錯後版面收成單欄", wrongFb.cols === 1,
        `problem-stage ${wrongFb.cols} 欄 · 題目卡佔寬 ${wrongFb.cardShare}% · 回饋卡佔寬 ${wrongFb.panelShare}%`);
      check("手機答錯後不會橫向溢出", wrongFb.overflow <= 1, `溢出 ${wrongFb.overflow}px`);
      check("手機答錯後「下一題」按得到", wrongFb.nextHit,
        wrongFb.nextHit ? "" : `按鈕被蓋住或不在畫面內 —— ${wrongFb.hitDebug}`);
    }

    /* ── 3.5 iPad：書寫區要夠大，而且不用捲就寫得到 ── */
    // 使用者的主力裝置是 iPad + Apple Pencil，但這支測的一直是 390 寬的手機。
    // 量出來的問題很具體：書寫區的高度原本由**畫面寬度**決定並且封頂 340px，
    // 於是 iPad 直式只有螢幕高度的 22%，橫式則要捲動才寫得到（書寫區從 711px 開始）。
    const IPADS = [
      { label: "iPad 直式", width: 834, height: 1194 },
      { label: "iPad 橫式", width: 1194, height: 834 }
    ];
    for (const pad of IPADS) {
      await chrome.send("Emulation.setDeviceMetricsOverride", {
        width: pad.width, height: pad.height, deviceScaleFactor: 2, mobile: true
      });
      // setDeviceMetricsOverride 會把觸控模擬的狀態洗掉，pointer: coarse 跟著變 false。
      // 不重新開啟的話，測到的是一台「桌機尺寸剛好等於 iPad」的機器 ——
      // 而 app 的平板行為全部掛在 pointer: coarse 上，等於整段沒測到。
      await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
      await chrome.navigate(`${server.url}/index.html`);
      await chrome.evaluate("localStorage.clear(); return 1;");
      await chrome.navigate(`${server.url}/index.html`);
      await chrome.sleep(700);
      const pad_ = await chrome.evaluate(`
        const c = (n) => { const h=[...document.querySelectorAll("button,a,[data-action]")].find(x=>(x.innerText||"").replace(/\s+/g,"").includes(n)); if(h) h.click(); return !!h; };
        c("開始"); await new Promise(r=>setTimeout(r,600));
        c("大一微積分"); await new Promise(r=>setTimeout(r,600));
        c("直接開始練"); await new Promise(r=>setTimeout(r,1000));
        const m=[...document.querySelectorAll("button")].find(b=>/知道了/.test(b.textContent)); if(m) m.click();
        await new Promise(r=>setTimeout(r,500));
        document.querySelector('[data-action="open-library"]').click();
        await new Promise(r=>setTimeout(r,800));
        const s2=document.querySelector("[data-library-search]");
        if (!s2) return { ok: false };
        s2.value="dd-rr-001"; s2.dispatchEvent(new Event("input",{bubbles:true}));
        await new Promise(r=>setTimeout(r,700));
        const go=document.querySelector('[data-action="start-problem"]');
        if (!go) return { ok: false };
        go.click();
        await new Promise(r=>setTimeout(r,1200));
        const t=document.querySelector('[data-board-action="toggle"]');
        if(t) t.click();
        await new Promise(r=>setTimeout(r,800));
        const canvas=document.querySelector("[data-blackboard]");
        if(!canvas) return { ok: false };
        const r=canvas.getBoundingClientRect();
        return {
          ok: true,
          shareH: Math.round((r.height / window.innerHeight) * 100),
          needsScroll: r.top + r.height > window.innerHeight + 2,
          promptClipped: (() => {
            const p = document.querySelector(".handwrite-prompt");
            return p ? p.scrollWidth > p.clientWidth + 2 : false;
          })()
        };
      `);
      if (!pad_.ok) {
        check(`${pad.label} 的書寫區夠大`, false, "開不出計算紙");
        continue;
      }
      check(`${pad.label} 的書寫區佔得夠高`, pad_.shareH >= 50, `螢幕高度的 ${pad_.shareH}%（門檻 50%）`);
      check(`${pad.label} 不用捲動就寫得到`, !pad_.needsScroll,
        pad_.needsScroll ? "書寫區在畫面外，要捲下去才寫得到 —— 而捲下去題目就不見了" : "書寫區整塊在畫面內");
      check(`${pad.label} 的題目沒有被切掉`, !pad_.promptClipped,
        pad_.promptClipped ? "題目列橫向溢出，開頭與結尾看不到" : "題目完整可見");
    }
    /* ── 3.7 iPad：全螢幕書寫時答錯，不能把人關在覆蓋層底下 ── */
    // 全螢幕外殼是 position:fixed 的不透明整頁覆蓋層；答錯的回饋卡與
    // 「下一題」都渲染在它底下，而 feedback 一出現連退出全螢幕鈕都被
    // disabled —— 修掉之前這個狀態只能整局退出。釘住的行為：
    // 答錯（要停下來看回饋）時自動退出全螢幕，「下一題」點得到。
    await chrome.send("Emulation.setDeviceMetricsOverride", {
      width: 834, height: 1194, deviceScaleFactor: 2, mobile: true
    });
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await chrome.navigate(`${server.url}/index.html`);
    await chrome.sleep(700);
    const fsWrong = await chrome.evaluate(`
      const c = (n) => { const h=[...document.querySelectorAll("button,a,[data-action]")].find(x=>(x.innerText||"").includes(n)); if(h) h.click(); return !!h; };
      c("訓練"); await new Promise(r=>setTimeout(r,700));
      const free=document.querySelector('[data-answer-mode="free"]');
      if(free) free.click(); await new Promise(r=>setTimeout(r,500));
      const lib=document.querySelector('[data-action="open-library"]');
      if(!lib) return { ok:false, why:"找不到題庫" };
      lib.click(); await new Promise(r=>setTimeout(r,900));
      const s=document.querySelector("[data-library-search]");
      if(!s) return { ok:false, why:"題庫沒有搜尋框" };
      s.value="dd-rr-001"; s.dispatchEvent(new Event("input",{bubbles:true}));
      await new Promise(r=>setTimeout(r,700));
      const go=document.querySelector('[data-action="start-problem"]');
      if(!go) return { ok:false, why:"找不到 dd-rr-001" };
      go.click(); await new Promise(r=>setTimeout(r,1200));
      const ack=[...document.querySelectorAll("button")].find(b=>b.textContent.includes("知道了"));
      if(ack){ ack.click(); await new Promise(r=>setTimeout(r,400)); }
      const t=document.querySelector('[data-board-action="toggle"]');
      if(!t) return { ok:false, why:"沒有計算紙開關" };
      t.click(); await new Promise(r=>setTimeout(r,800));
      // 平板攤開計算紙會直接進全螢幕（isCoarsePointerTablet）
      const wasFullscreen=Boolean(document.querySelector(".handwrite-shell.is-fullscreen"));
      const input=document.querySelector("#answer");
      const form=document.querySelector('[data-action="submit-answer"]');
      if(!input||!form) return { ok:false, why:"全螢幕裡沒有作答表單" };
      input.value="424242.424242";
      input.dispatchEvent(new Event("input",{bubbles:true}));
      if(form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));
      await new Promise(r=>setTimeout(r,600));
      const stillFullscreen=Boolean(document.querySelector(".handwrite-shell.is-fullscreen"));
      const panel=document.querySelector(".feedback.wrong, .feedback.timeout");
      const btn=document.querySelector('[data-action="next-question"]');
      let nextHit=false;
      if(btn){
        btn.scrollIntoView({block:"center"});
        await new Promise(r=>setTimeout(r,250));
        const b=btn.getBoundingClientRect();
        const at=document.elementFromPoint(b.left+b.width/2, b.top+b.height/2);
        nextHit=Boolean(at&&(at===btn||btn.contains(at)));
      }
      let advanced=false;
      if(nextHit){
        btn.click();
        await new Promise(r=>setTimeout(r,800));
        advanced=!document.querySelector(".feedback.wrong, .feedback.timeout");
      }
      return { ok:true, wasFullscreen, stillFullscreen, hasPanel:Boolean(panel), nextHit, advanced };
    `);
    if (!fsWrong.ok) {
      check("全螢幕書寫答錯不會被關在覆蓋層底下", false, fsWrong.why);
    } else {
      check("平板攤開計算紙會進全螢幕", fsWrong.wasFullscreen,
        fsWrong.wasFullscreen ? "" : "前提不成立：計算紙沒有進全螢幕");
      check("答錯後自動退出全螢幕", !fsWrong.stillFullscreen && fsWrong.hasPanel,
        fsWrong.stillFullscreen ? "回饋在 fixed 覆蓋層底下，看不到也點不到" : "回饋卡看得到");
      check("答錯後「下一題」點得到、點了會前進", fsWrong.nextHit && fsWrong.advanced,
        `按得到=${fsWrong.nextHit} · 有前進=${fsWrong.advanced}`);
    }

    await chrome.send("Emulation.setDeviceMetricsOverride", VIEWPORT);

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
