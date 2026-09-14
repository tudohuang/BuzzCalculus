// 白話證明的 E2E：教學 → 練習編輯器 → 題目編輯器，只斷言看得見的東西。
//
// 檢查器本身由 validate_proof_lang.js 釘住；這裡守的是「接得上畫面」：
// 打字會即時出三色、範本插得進去、錯的 δ 紅在第 4 行、草稿重整後還在。
//
// 用法：node tools/e2e_proof_lang.js

"use strict";

const path = require("path");
const { launch } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
let passed = 0;
const failures = [];
function check(name, ok, detail = "") {
  if (ok) { passed += 1; console.log(`  ok   ${name}${detail ? `  —— ${detail}` : ""}`); }
  else { failures.push(`${name}${detail ? `（${detail}）` : ""}`); console.log(`  XX   ${name}${detail ? `  —— ${detail}` : ""}`); }
}

async function run() {
  console.log("E2E 白話證明");
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const click = async (selector, wait = 500) => {
    const hit = await chrome.evaluate(`const el=[...document.querySelectorAll(${JSON.stringify(selector)})].find(n=>n.getClientRects().length); if(el) el.click(); return !!el;`);
    await chrome.sleep(wait);
    return hit;
  };
  const clickText = async (needle, wait = 500) => {
    const hit = await chrome.evaluate(`const el=[...document.querySelectorAll("button, a, [data-action]")].find(n=>n.getClientRects().length && (n.innerText||"").includes(${JSON.stringify(needle)})); if(el) el.click(); return !!el;`);
    await chrome.sleep(wait);
    return hit;
  };
  const type = async (text) => {
    await chrome.evaluate(`const t=document.querySelector('[data-proof-lang-text]'); t.value=${JSON.stringify(text)}; t.dispatchEvent(new Event('input',{bubbles:true})); return 1;`);
    await chrome.sleep(700);
  };
  const statuses = () => chrome.evaluate(`return [...document.querySelectorAll('[data-pl-report] .pl-lines li')].map(li => li.className.replace('is-','').trim());`);
  const verdict = () => chrome.evaluate(`const v=document.querySelector('[data-pl-verdict]'); return v ? { cls: v.className, text: v.innerText.replace(/\\s+/g,' ') } : null;`);

  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 1000, deviceScaleFactor: 1, mobile: false });
    await chrome.navigate(server.url + "/index.html");
    await chrome.evaluate("localStorage.clear(); return 1;");
    await chrome.navigate(server.url + "/index.html");
    await clickText("開始"); await clickText("大一微積分"); await clickText("直接開始練");
    await click('button[data-action="dismiss-notice"]');

    await click('[data-action="open-proofs"]', 800);
    check("證明訓練頁有白話證明的入口", await chrome.evaluate(`return Boolean(document.querySelector('.pl-entry'))`));
    const entry = await chrome.evaluate(`return { problems: document.querySelectorAll('.pl-problem').length, families: [...document.querySelectorAll('.pl-family-label')].map((el) => el.innerText.trim()), button: document.querySelector('[data-action="pl-open-lesson"]')?.innerText || "", lessons: (window.BUZZ_PROOF_LANG_LESSONS || []).length };`);
    check("入口列出題目", entry.problems >= 40, `${entry.problems} 題`);
    check("題目照證法分成五組，每組有題數", entry.families.length === 5 && entry.families.every((label) => /\d+ 題/.test(label)), entry.families.join(" / "));
    check("課程按鈕的課數跟內容一致", new RegExp(`先上 ${entry.lessons} 課`).test(entry.button), entry.button);

    /* ── 教學第 1 課 ── */
    await click('[data-action="pl-open-lesson"]', 900);
    const lesson = await chrome.evaluate(`return { title: document.querySelector('.pl-tutorial h2')?.innerText || "", exampleLines: document.querySelectorAll('.pl-example .pl-lines li.is-ok').length, hasEditor: Boolean(document.querySelector('[data-proof-lang-text]')), starter: document.querySelector('[data-proof-lang-text]')?.value || "", nav: document.querySelectorAll('.pl-lesson-nav button').length };`);
    check("第 1 課打開，範例每一行都是綠的", lesson.exampleLines >= 4, `${lesson.exampleLines} 行綠`);
    check("課程導覽列出每一課", lesson.nav === entry.lessons, `${lesson.nav} / ${entry.lessons}`);
    check("練習區有編輯器，預填開頭幾行", lesson.hasEditor && /設 a, b/.test(lesson.starter), lesson.starter.split("\n")[0]);

    await type("設 a, b ≥ 0。\n則 (√a − √b)² ≥ 0。\n展開得 a − 2√(ab) + b ≥ 0。\n所以 (a + b)/2 ≥ √(ab)。");
    let v = await verdict();
    let st = await statuses();
    check("寫完正確的四行：全綠", v && /is-ok/.test(v.cls) && st.every((s) => s === "ok"), v ? v.text.slice(0, 40) : "沒有結論");
    check("課程標成完成", await chrome.evaluate(`return Boolean(document.querySelector('.pl-lesson-nav button.is-done')) || Boolean(JSON.parse(localStorage.getItem('buzzcalculus.records.v1')||'{}').proofLangLessons)`));

    await type("設 a, b ≥ 0。\n則 (√a − √b)² ≥ 0。\n所以 (a + b)/2 ≤ √(ab)。");
    v = await verdict(); st = await statuses();
    check("方向寫反：第 3 行紅、結論紅", v && /is-error/.test(v.cls) && st[2] === "error", st.join(","));
    const counter = await chrome.evaluate(`return document.querySelector('[data-pl-report] .pl-lines li.is-error .pl-line-note')?.innerText || ""`);
    check("紅的那一行給了反例（帶數字）", /a=|b=/.test(counter) && /不成立/.test(counter), counter.slice(0, 60));

    await type("設 a, b ≥ 0。\n我覺得這很明顯。\n所以 (a + b)/2 ≥ √(ab)。");
    st = await statuses();
    check("讀不懂的句子標紅，並且不放行", st[1] === "error", st.join(","));

    await type("所以 (a + b)/2 ≥ √(ab)。");
    v = await verdict();
    check("一行直接寫目標不會全綠", v && !/is-ok/.test(v.cls), v ? v.text.slice(0, 50) : "");

    /* ── 第 6 課：定理當工具（存在句、文字事實、自訂函數在畫面上也要全綠） ── */
    await click('[data-action="pl-open-lesson"][data-lesson-id="lesson-theorems"]', 900);
    const theorems = await chrome.evaluate(`return { title: document.querySelector('.pl-tutorial h2')?.innerText || "", total: document.querySelectorAll('.pl-example .pl-lines li').length, ok: document.querySelectorAll('.pl-example .pl-lines li.is-ok').length, starter: document.querySelector('[data-proof-lang-text]')?.value || "" };`);
    check("第 6 課打開，中間值定理的範例每一行都是綠的", /定理/.test(theorems.title) && theorems.total >= 5 && theorems.ok === theorems.total, `${theorems.ok}/${theorems.total}`);
    check("練習預填到平均值定理那一句", /平均值定理/.test(theorems.starter), theorems.starter.split("\n")[1] || "");
    await type("任取 x, y ∈ I 且 x < y。\n由平均值定理，存在 c ∈ (x, y) 使 f(y) − f(x) = f'(c)(y − x)。\n因為 f'(c) = 0，所以 f(y) − f(x) = 0。\n故 f(x) = f(y)。");
    v = await verdict(); st = await statuses();
    check("抽象 f 的證明寫完：全綠", v && /is-ok/.test(v.cls) && st.every((s) => s === "ok"), st.join(","));
    await type("任取 x, y ∈ I 且 x < y。\n由平均值定理，存在 c ∈ (x, y) 使 f(y) − f(x) = f'(c)(y − x)。\n故 f(x) = f(y)。");
    st = await statuses();
    check("跳過 f'(c) = 0 那一步：結論不放行", st[2] !== "ok", st.join(","));

    /* ── 題目編輯器 ── */
    await click('[data-action="open-proofs"]', 800);
    await click('[data-action="pl-open-problem"][data-proof-lang-id="pl-limit-linear"]', 900);
    check("題目頁有題幹與教練提示", await chrome.evaluate(`return Boolean(document.querySelector('.pl-goal .katex')) && /ε-δ/.test(document.querySelector('.pl-coach')?.innerText || "")`));
    const before = await chrome.evaluate(`return document.querySelector('[data-proof-lang-text]').value`);
    await click('[data-action="pl-insert"]', 400);
    const after = await chrome.evaluate(`return document.querySelector('[data-proof-lang-text]').value`);
    check("句型範本插得進編輯器", after.length > before.length && /任取/.test(after), after.split("\n")[0]);

    await type("任取 ε > 0。\n取 δ = ε。\n假設 0 < |x − 2| < δ。\n則 |3x − 6| = 3|x − 2| < 3δ = ε。\n所以 lim_{x→2} 3x = 6。");
    st = await statuses(); v = await verdict();
    check("錯的 δ 紅在第 4 行", st[3] === "error" && st[0] === "ok" && st[1] === "ok", st.join(","));
    check("結論因為沒有支撐而標黃", st[4] === "unsure", st[4]);

    await type("任取 ε > 0。\n取 δ = ε/3。\n假設 0 < |x − 2| < δ。\n則 |3x − 6| = 3|x − 2| < 3δ = ε。\n所以 lim_{x→2} 3x = 6。");
    v = await verdict();
    check("修好 δ 之後全綠", v && /is-ok/.test(v.cls), v ? v.text.slice(0, 40) : "");

    // 草稿存活：重整之後再打開同一題，字還在
    await chrome.navigate(server.url + "/index.html");
    await click('button[data-action="dismiss-notice"]');
    await click('[data-action="open-proofs"]', 800);
    const chip = await chrome.evaluate(`return document.querySelector('[data-proof-lang-id="pl-limit-linear"] .pl-chip')?.innerText || ""`);
    check("入口上看得到上次的結果", /全綠/.test(chip), chip);
    await click('[data-action="pl-open-problem"][data-proof-lang-id="pl-limit-linear"]', 900);
    const draft = await chrome.evaluate(`return document.querySelector('[data-proof-lang-text]').value`);
    check("草稿重整後還在", draft.includes("ε/3"), draft.split("\n")[1] || "");

    await chrome.evaluate(`
      window.__storageSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        if (key === 'buzzcalculus.records.v1') throw new DOMException('Test quota failure', 'QuotaExceededError');
        return window.__storageSetItem.call(this, key, value);
      };
      document.querySelector('[data-proof-lang-text]').focus();
    `);
    await type(draft + "\n");
    check("草稿存不下時立即提示，不搶走打字焦點", await chrome.evaluate(`
      return !!document.querySelector('.storage-warning') && document.activeElement === document.querySelector('[data-proof-lang-text]');
    `));
    await chrome.evaluate(`Storage.prototype.setItem = window.__storageSetItem;`);
    await click('[data-action="retry-records-save"]');
    check("重試可補存剛才的白話證明草稿", await chrome.evaluate(`
      const saved = JSON.parse(localStorage.getItem('buzzcalculus.records.v1'));
      return saved.proofLang['pl-limit-linear'].text === ${JSON.stringify(draft + "\n")} && !document.querySelector('.storage-warning');
    `));

    const errors = chrome.pageErrors.length;
    check("沒有未捕捉的例外", !errors, errors ? `${errors} 個` : "");
  } finally {
    await chrome.close();
    await server.stop();
  }

  console.log(`\nE2E 白話證明: ${passed}/${passed + failures.length} 通過`);
  if (failures.length) {
    console.error(`失敗 ${failures.length} 項：`);
    failures.forEach((f) => console.error("  " + f));
    process.exit(1);
  }
  console.log("proof language E2E OK");
}

run().catch((error) => {
  console.error("白話證明 E2E 掛掉：" + error.message);
  process.exit(1);
});
