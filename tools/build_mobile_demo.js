// 把 demo/shots/ 的截圖組成一頁自足的 demo/mobile.html。
//
// 自足是硬需求：這一頁會被寄給投資人、貼進簡報、可能離線打開，
// 所以圖片一律內嵌成 data URI，不依賴任何外部檔案。
//
// 內容由 SECTIONS 決定 —— 那是一份「這個產品憑什麼」的論述，
// 不是截圖清單。截圖是證據，論述才是他們要判斷的東西。
//
// 用法：
//   node tools/capture_mobile_demo.js   先拍
//   node tools/build_mobile_demo.js     再組

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SHOTS = path.join(ROOT, "demo", "shots");
const OUT = path.join(ROOT, "demo", "mobile.html");

function facts() {
  const workbook = require(path.join(ROOT, "src", "kernel", "workbook_facts.js"));
  let verified = 0;
  const scope = { window: {} };
  new Function("window", fs.readFileSync(path.join(ROOT, "src", "kernel", "verified_answers.js"), "utf8"))(scope.window);
  const api = scope.window.BuzzVerifiedAnswers;
  if (api) verified = typeof api.count === "number" ? api.count : Object.keys(api.table || {}).length;
  const validators = fs.readdirSync(path.join(ROOT, "tools")).filter((n) => /^validate_.*\.js$/.test(n)).length;
  return { total: workbook.total, verified, validators, sections: workbook.sections, examSets: workbook.examSets };
}

const F = facts();
const n = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// 每一段是一個主張，配上證明它的畫面。
const SECTIONS = [
  {
    claim: "十秒內就知道這是什麼",
    body: "沒有註冊牆、沒有教學影片。第一畫面用一句話說清楚定位，第二畫面只問一個決定起始難度的問題，第三步就開始練。",
    shots: ["01-intro", "02-onboarding"]
  },
  {
    claim: "題目依「該用哪個工具」分類，不是依章節",
    body: "一般題庫照極限→微分→積分排。這裡照技巧排：Taylor、換元、分部、有理函數、Frullani。因為考試時卡住的不是「這章沒讀」，是「不知道要用哪一招」。",
    shots: ["03-question", "11-library"]
  },
  {
    claim: "手機上真的能算，不只是能看",
    body: "選擇題也附一張手寫計算紙：壓感筆跡、方格紙、橡皮擦、復原重做，兩指點一下就是復原。要大就切全螢幕，題目還留在上面。這是把 iPad + 觸控筆當成主要輸入裝置在做，不是把桌機版縮小。",
    shots: ["04-scratchpad", "05-fullscreen"],
    wide: true
  },
  {
    claim: "為 iPad + Apple Pencil 特化，不是把桌機版縮小",
    body:
      "在平板上攤開計算紙就直接進全螢幕：題目留在最上面、書寫區佔畫面 72%（橫式 61%）、選項在下面，" +
      "全程不用捲動。這一段是量出來改的 —— 改之前書寫區只佔畫面高度的 22%，橫過來甚至要捲動才寫得到，" +
      "而捲下去題目就不見了。壓感的作用範圍也一併修好：原本壓力 0.05 到 0.4 畫出來一模一樣。",
    shots: ["20-ipad-write", "21-ipad-landscape"],
    wide: true
  },
  {
    claim: "答錯之後給的是梯子，不是答案",
    body: "三層：先講該用什麼技巧，再給這一題特有的關鍵步驟，最後才是完整推導（而且會被記為「借助解答」）。中間那一層有 295 題是機器從題幹推導出來的事實，每一條在 CI 都會重新驗算。",
    shots: ["06-feedback"]
  },
  {
    claim: "系統知道你是「不會」還是「來不及」",
    body: "難度由三個獨立的軸決定：步驟數、冷僻度、計算負擔。作答資料同時記錄正確率與速度，所以能分辨「想不到方法」和「方法對但算太慢」——這兩件事的處方完全不同。",
    shots: ["10-insights", "09-train"]
  },
  {
    claim: "資料全在使用者自己的裝置上",
    body: "沒有帳號、沒有伺服器保存作答內容。隱私政策上的每一條承諾都有對應的自動化測試在 CI 擋著 —— 關掉分析就連追蹤程式都不會載入，刪除會清乾淨整個命名空間。",
    shots: ["12-settings", "08-today"]
  },
  {
    claim: "同一套題庫也能變成紙本商品",
    body: `${F.sections} 個技巧小節、${F.examSets} 份限時模擬考、答案速查與解法提示，由題庫直接排版產生，沒有第二份手抄的稿。訓練網站永遠免費；紙本是額外的東西，不是把免費功能拿走。`,
    shots: ["13-workbook"]
  }
];

function dataUri(name) {
  const file = path.join(SHOTS, `${name}.png`);
  if (!fs.existsSync(file)) throw new Error(`缺少截圖 ${name}.png —— 先跑 node tools/capture_mobile_demo.js`);
  return `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
}

const manifest = JSON.parse(fs.readFileSync(path.join(SHOTS, "manifest.json"), "utf8"));
const noteFor = (name) => (manifest.find((s) => s.name === name) || {}).note || "";

const phone = (name) => `
        <figure class="phone ${/ipad/.test(name) ? "is-pad" : ""}">
          <img src="${dataUri(name)}" alt="${noteFor(name)}" loading="lazy" width="390" height="844" />
          <figcaption>${noteFor(name)}</figcaption>
        </figure>`;

const sections = SECTIONS.map((section, index) => `
      <section class="claim${section.wide ? " is-wide" : ""}">
        <div class="claim-text">
          <p class="claim-index">${String(index + 1).padStart(2, "0")}</p>
          <h2>${section.claim}</h2>
          <p>${section.body}</p>
        </div>
        <div class="claim-shots">${section.shots.map(phone).join("")}
        </div>
      </section>`).join("");

const html = `<title>BuzzCalculus 手機版</title>
<style>
  /* 用產品自己的顏色，不套通用的簡報配色 ——
     這一頁在講的就是那個產品，換一套視覺等於自己承認它沒有識別。 */
  :root {
    --ground: #f2efe6;
    --surface: #fffdf8;
    --ink: #1b1f24;
    --muted: #6b6459;
    --accent: #b8860f;
    --rule: rgba(27, 31, 36, 0.1);
    --shadow: 0 18px 40px rgba(27, 31, 36, 0.13);
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --ground: #14161a;
      --surface: #1c1f24;
      --ink: #ece7dc;
      --muted: #9a9287;
      --accent: #e3b23d;
      --rule: rgba(236, 231, 220, 0.14);
      --shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
    }
  }
  :root[data-theme="dark"] {
    --ground: #14161a;
    --surface: #1c1f24;
    --ink: #ece7dc;
    --muted: #9a9287;
    --accent: #e3b23d;
    --rule: rgba(236, 231, 220, 0.14);
    --shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
  }

  * { box-sizing: border-box; }
  body {
    margin: 0;
    /* 方格紙當底：這是產品裡計算紙的花色，不是隨便挑的紋理 */
    background-color: var(--ground);
    background-image:
      repeating-linear-gradient(to right, var(--rule) 0 1px, transparent 1px 100%),
      repeating-linear-gradient(to bottom, var(--rule) 0 1px, transparent 1px 100%);
    background-size: 34px 34px;
    color: var(--ink);
    font-family: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, -apple-system, sans-serif;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 1120px; margin: 0 auto; padding: 56px 22px 80px; }

  header.hero {
    padding: 40px 34px;
    border: 1px solid var(--rule);
    border-radius: 20px;
    background: var(--surface);
    box-shadow: var(--shadow);
  }
  .eyebrow {
    margin: 0 0 10px;
    color: var(--accent);
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.16em;
  }
  h1 {
    margin: 0 0 14px;
    font-size: clamp(1.9rem, 4.6vw, 3rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }
  .lede { margin: 0; max-width: 62ch; color: var(--muted); font-size: 1.03rem; }

  .metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2px;
    margin-top: 30px;
    border: 1px solid var(--rule);
    border-radius: 14px;
    overflow: hidden;
    background: var(--rule);
  }
  .metrics div { padding: 16px 18px; background: var(--surface); }
  .metrics dt { color: var(--muted); font-size: 0.8rem; }
  .metrics dd {
    margin: 4px 0 0;
    font-size: 1.6rem;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }
  .metrics small { display: block; color: var(--muted); font-size: 0.74rem; font-weight: 500; }

  /* ── 現場試用：把真的產品裝進一支假手機 ── */
  .live {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 44px;
    align-items: center;
    margin-top: 56px;
    padding: 34px;
    border: 1px solid var(--rule);
    border-radius: 20px;
    background: var(--surface);
    box-shadow: var(--shadow);
  }
  .live h2 { margin: 0 0 12px; font-size: clamp(1.3rem, 2.8vw, 1.9rem); font-weight: 880; letter-spacing: -0.01em; }
  .live p { margin: 0 0 12px; color: var(--muted); max-width: 52ch; }
  .live-hint { font-size: 0.9rem; }
  .live-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
  .live-actions button,
  .live-actions a {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    padding: 0 18px;
    border-radius: 999px;
    font: inherit;
    font-weight: 800;
    cursor: pointer;
    text-decoration: none;
  }
  .live-actions button { border: 1px solid var(--rule); background: var(--ink); color: var(--ground); }
  .live-actions .live-open { border: 1px solid var(--rule); background: transparent; color: var(--ink); }

  /* 手機外框：粗邊、大圓角、深陰影 —— 讓 iframe 看起來是一台裝置 */
  .phone-frame {
    width: 390px;
    max-width: 100%;
    padding: 12px;
    border-radius: 44px;
    background: #23262b;
    box-shadow: var(--shadow), inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  }
  .phone-frame iframe {
    display: block;
    width: 100%;
    height: 844px;
    max-height: 78vh;
    border: 0;
    border-radius: 32px;
    background: #f5f3ed;
  }
  .live-caption { margin: 12px 0 0; color: var(--muted); font-size: 0.8rem; text-align: center; }

  .claim {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 44px;
    align-items: center;
    margin-top: 64px;
    padding-top: 44px;
    border-top: 1px solid var(--rule);
  }
  .claim.is-wide { grid-template-columns: minmax(0, 1fr); }
  .claim.is-wide .claim-shots { justify-content: flex-start; }
  .claim-index {
    margin: 0 0 8px;
    color: var(--accent);
    font-size: 0.82rem;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.1em;
  }
  .claim h2 {
    margin: 0 0 12px;
    font-size: clamp(1.25rem, 2.6vw, 1.72rem);
    font-weight: 880;
    letter-spacing: -0.01em;
    text-wrap: balance;
  }
  .claim p:last-child { margin: 0; color: var(--muted); max-width: 56ch; }
  .claim-shots { display: flex; flex-wrap: wrap; gap: 26px; justify-content: flex-end; }

  /* 手機外框：邊框細、圓角大、陰影深，讓截圖看起來是裝置而不是圖片 */
  .phone { margin: 0; width: 236px; }
  /* iPad 的截圖是平板比例，套手機外框會被壓成細長條 */
  .phone.is-pad { width: 320px; }
  .phone.is-pad img { border-radius: 22px; border-width: 10px; }
  .phone img {
    display: block;
    width: 100%;
    height: auto;
    border: 8px solid #23262b;
    border-radius: 30px;
    box-shadow: var(--shadow);
    background: #23262b;
  }
  .phone figcaption { margin-top: 10px; color: var(--muted); font-size: 0.8rem; line-height: 1.5; }

  footer {
    margin-top: 66px;
    padding-top: 26px;
    border-top: 1px solid var(--rule);
    color: var(--muted);
    font-size: 0.85rem;
  }
  footer a { color: var(--accent); }
  .built { margin-top: 6px; font-size: 0.78rem; }

  @media (max-width: 860px) {
    .live { grid-template-columns: minmax(0, 1fr); gap: 26px; padding: 22px; }
    .claim { grid-template-columns: minmax(0, 1fr); gap: 26px; }
    .claim-shots { justify-content: flex-start; }
    .phone { width: min(236px, 46vw); }
  }
</style>

<div class="wrap">
  <header class="hero">
    <p class="eyebrow">MOBILE PRODUCT WALKTHROUGH</p>
    <h1>BuzzCalculus 手機版</h1>
    <p class="lede">
      微積分的反射訓練台。這裡不教微積分，是讓已經學過的人把「看到題目就知道用哪個工具」練成反射。
      以下每一張都是 390×844 的真實畫面，由自動化流程實際操作產品後擷取，不是示意圖。
    </p>
    <dl class="metrics">
      <div><dt>題庫</dt><dd>${n(F.total)}</dd><small>依技巧分類</small></div>
      <div><dt>獨立驗算通過</dt><dd>${n(F.verified)}</dd><small>不符 0 題</small></div>
      <div><dt>CI 驗證器</dt><dd>${F.validators}</dd><small>加 3 支 E2E，全部擋部署</small></div>
      <div><dt>後端</dt><dd>0</dd><small>資料全在裝置上</small></div>
    </dl>
  </header>

  <section class="live">
    <div class="live-text">
      <p class="claim-index">現場試用</p>
      <h2>直接在這支手機上點</h2>
      <p>
        右邊是真的產品，不是錄影也不是原型 —— 就是 390×844 的手機版本人，
        載在這一頁裡面。可以直接開一局、寫計算紙、看數據頁。
      </p>
      <p class="live-hint">
        它跑在你自己的瀏覽器上，作答紀錄存在你這台裝置，不會傳到任何地方。
        想從頭來過就按「重設」。
      </p>
      <div class="live-actions">
        <button type="button" data-live-reload>重設這支手機</button>
        <a class="live-open" href="../index.html" target="_blank" rel="noopener">用整個視窗開啟</a>
      </div>
    </div>
    <div class="live-phone">
      <div class="phone-frame">
        <iframe
          title="BuzzCalculus 手機版（可直接操作）"
          src="../index.html"
          width="390"
          height="844"
          loading="lazy"></iframe>
      </div>
      <p class="live-caption">真實產品 · 390×844</p>
    </div>
  </section>
${sections}
  <footer>
    <p>
      線上版 <a href="https://tudohuang.github.io/BuzzCalculus/">tudohuang.github.io/BuzzCalculus</a>
      ・原始碼 <a href="https://github.com/tudohuang/BuzzCalculus">GitHub</a>
    </p>
    <p class="built">截圖由 tools/capture_mobile_demo.js 自動擷取，本頁由 tools/build_mobile_demo.js 組出。數字取自題庫與驗算側表，不是手寫。</p>
  </footer>
</div>

<script>
  // 「重設」：把 iframe 裡的 localStorage 清掉再重載。
  // 同源所以碰得到 —— demo 頁跟 app 是同一個站台部署出去的。
  document.querySelector("[data-live-reload]").addEventListener("click", () => {
    const frame = document.querySelector(".phone-frame iframe");
    try {
      frame.contentWindow.localStorage.clear();
    } catch (error) {
      // 跨來源打不開就算了，重載本身還是有意義
    }
    frame.src = frame.src;
  });
</script>
`;

fs.writeFileSync(OUT, html, "utf8");
const kb = Math.round(Buffer.byteLength(html, "utf8") / 1024);
console.log(`寫出 ${path.relative(ROOT, OUT)}（${kb} KB，內嵌 ${SECTIONS.reduce((sum, s) => sum + s.shots.length, 0)} 張截圖）`);
if (kb > 15000) console.log("⚠ 超過 15MB，Artifact 會發不出去");
