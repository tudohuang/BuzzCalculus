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
    check("入口列出題目", (await chrome.evaluate(`return document.querySelectorAll('.pl-problem').length`)) >= 10);

    /* ── 教學第 1 課 ── */
    await click('[data-action="pl-open-lesson"]', 900);
    const lesson = await chrome.evaluate(`return { title: document.querySelector('.pl-tutorial h2')?.innerText || "", exampleLines: document.querySelectorAll('.pl-example .pl-lines li.is-ok').length, hasEditor: Boolean(document.querySelector('[data-proof-lang-text]')), starter: document.querySelector('[data-proof-lang-text]')?.value || "" };`);
    check("第 1 課打開，範例每一行都是綠的", lesson.exampleLines >= 4, `${lesson.exampleLines} 行綠`);
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

    const errors = await chrome.evaluate(`return (window.__buzzErrors || []).length;`);
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
