// 分節的黑板（beat.board，src/course_board.js）在真的 Chrome 裡走一次：手機 390×844、DPR 3（觸控）。
//
// 斷言都是看得到、量得到的東西：
//   沒有黑板的課：畫面照舊（show 看得到）、不抓 course_board.js；有黑板的課才抓，而且只抓一次；
//   寫：畫到一半有的字還沒出來（跟畫完不一樣）、畫完全部出來；變形：對得上 id 的項是「同一個元素」搬過去（=== 比對）、
//   中途有 transform、畫完那一行的 KaTeX 字跟目標式子一模一樣；前幾行的項飛過來（中途有複製的那一份、畫完收掉）；
//   粉筆記號畫在指定的那一項上（框住那一項的矩形）；「下一句」＝上一句直接畫完；reduced-motion 直接到位；
//   證明節：why: true 的動作問著的時候不畫、答了才畫；旁白（測試自己回的無聲 mp3）念著時黑板跟著錄音走、
//   暫停就停（進度與畫面都不動）、繼續接著走；螢幕閱讀器：黑板 aria-hidden，show 還在（藏起來的字跟 show 一樣）；
//   390／360 寬三課每一句都不溢出（板上每一行在板裡、頁面沒有橫向捲動）；深色是黑板、淺色是淺色板，字與粉筆色對比 ≥ 4.5；
//   幀時間：DPR 3 與 DPR 1 的 rAF 間隔、黑板自己每格的工作時間、動畫中的版面重排次數（只在動作開始時量）。console 沒有錯誤。
//
// 用法：node tools/e2e_course_board.js
//       node tools/e2e_course_board.js --screenshots   另存三課的手機截圖（動畫中段與結尾）到 docs/report/course-review/screens/board/（不進版控）

"use strict";

const fs = require("fs");
const path = require("path");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const SHOTS = process.argv.includes("--screenshots") ? path.join(ROOT, "docs", "report", "course-review", "screens", "board") : "";
const PHONE = { width: 390, height: 844, deviceScaleFactor: 3, mobile: true };
const LESSON_DIR = path.join(ROOT, "tools", "content", "course_v2", "lessons");
const lessonOf = (id) => JSON.parse(fs.readFileSync(path.join(LESSON_DIR, `${id}.json`), "utf8"));
const PLAIN = lessonOf("function-intro");
const CHAIN = lessonOf("chain-rule");
const FTC = lessonOf("ftc-part1");
const DCT = lessonOf("dominated-convergence");
const PILOTS = [CHAIN, FTC, DCT];
// 連鎖律「外層是次方」：寫 → 變形（4 從指數搬到前面）→ 寫＋圈 → 飛過來再變形
const CH_SI = 3;
const CH_T = CHAIN.sections[CH_SI].beats[1].board[0];
// 控制收斂的證明節：第 5 句（消去 ∫2g）問著的時候只畫結果，答了才圈 ∫2g、劃掉 ∞−∞
const DCT_SI = DCT.sections.findIndex((s) => s.proof);
const DCT_BI = DCT.sections[DCT_SI].beats.findIndex((b) => b.why && (b.board || []).some((a) => a.why && a.do === "strike"));
const { mp3Ms } = require("./build_narration.js");
const silentMp3 = (ms) => {
  const frame = Buffer.alloc(144);
  frame.set([0xff, 0xf3, 0x64, 0xc0]);
  return Buffer.concat(Array.from({ length: Math.ceil(ms / 24) }, () => frame));
};

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
    open(id) { const b = document.createElement("button"); b.dataset.action = "open-course-lesson"; b.dataset.lessonId = id; document.querySelector("#app").appendChild(b); b.click(); return 1; },
    si() { const r = document.querySelector("[data-cv2s]"); return r ? Number(r.dataset.cv2s) : -1; },
    beats() { return document.querySelectorAll("[data-cv2s] .cv2s-beat").length; },
    st() { return window.BuzzBoard && window.BuzzBoard.state(); },
    board() { return document.querySelector("[data-cv2s] .cvb"); },
    files(re) { return performance.getEntriesByType("resource").map((e) => e.name).filter((n) => re.test(n)).length; },
    overflow() { const d = document.documentElement; return d.scrollWidth - d.clientWidth; },
    // 還沒寫出來（inline opacity < 1）的單位數；變形中的元素數；飛行中的複製
    pending() { const c = window.__b.board(); return c ? [...c.querySelectorAll(".katex-html span, .cvb-c")].filter((n) => n.style.opacity !== "" && Number(n.style.opacity) < 0.99).length : -1; },
    moving() { const c = window.__b.board(); return c ? [...c.querySelectorAll("[style*='transform']")].filter((n) => !n.classList.contains("cvb-tip") && /translate/.test(n.style.transform)).length : -1; },
    flying() { const c = window.__b.board(); return c ? c.querySelectorAll(".cvb-f").length : -1; },
    strokes() { const c = window.__b.board(); return c ? [...c.querySelectorAll(".cvb-a path")].map((p) => Number(p.style.strokeDashoffset || 0)) : []; },
    // 某一行 KaTeX 看得到的字（不含粉筆標籤）
    lineText(k) { const l = window.__b.board().querySelectorAll(".cvb-l")[k]; return l ? [...l.querySelectorAll(".cvb-e > .katex .katex-html, .cvb-e > .cvb-c")].map((n) => n.textContent).join("").replace(/\\s+/g, "") : ""; },
    texText(line) {
      const d = document.createElement("div");
      d.innerHTML = String(line).split(/(?<!\\\\)\\$/).map((p, i) => (i % 2 ? window.katex.renderToString("\\\\displaystyle " + window.BuzzBoard.tex(p), window.BuzzBoard.KOPT) : p)).join("");
      return [...d.childNodes].map((n) => (n.querySelector ? (n.querySelector(".katex-html") || n).textContent : n.textContent)).join("").replace(/\\s+/g, "");
    },
    // 螢幕閱讀器拿到的字：藏起來的 show，KaTeX 換回 $TeX$
    srText(li) {
      return [...li.querySelectorAll(".cv2s-show")].map((p) => {
        const c = p.cloneNode(true);
        c.querySelectorAll(".katex").forEach((k) => { const a = k.querySelector("annotation"); k.replaceWith("$" + (a ? a.textContent : "") + "$"); });
        return c.textContent;
      });
    },
    srHidden(p) { const r = p.getBoundingClientRect(); const cs = getComputedStyle(p); return r.width <= 1 && r.height <= 1 && cs.display !== "none" && cs.visibility !== "hidden" && !p.closest("[aria-hidden='true']"); },
    rect(el) { const r = el.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; },
    async settle(ms) { const t0 = performance.now(); while (window.__b.st() && window.__b.st().running && performance.now() - t0 < (ms || 8000)) await new Promise((r) => setTimeout(r, 50)); return !window.__b.st() || !window.__b.st().running; },
    lum(c) { const m = String(c).match(/[\\d.]+/g).map(Number); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); },
    contrast(a, b) { const x = window.__b.lum(a); const y = window.__b.lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); },
    // 自訂屬性（#rrggbb）→ rgb() 字串
    varRgb(el, name) { const p = document.createElement("i"); p.style.color = getComputedStyle(el).getPropertyValue(name).trim(); el.appendChild(p); const c = getComputedStyle(p).color; p.remove(); return c; }
  };
`;

async function run() {
  console.log("E2E 課程黑板");
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const evaluate = (code) => chrome.evaluate(`${HELPERS}\n${code}`);
  const sleep = (ms) => chrome.sleep(ms);
  const waitFor = async (expr, ms = 8000) => {
    for (const deadline = Date.now() + ms; Date.now() < deadline; await sleep(60)) {
      if (await evaluate(`return Boolean(${expr});`)) return true;
    }
    return false;
  };
  const errors = [];
  chrome.on("Runtime.exceptionThrown", (p) => errors.push((p.exceptionDetails.exception && p.exceptionDetails.exception.description) || p.exceptionDetails.text));
  chrome.on("Runtime.consoleAPICalled", (p) => { if (p.type === "error") errors.push(p.args.map((a) => a.value || a.description || "").join(" ")); });
  const shot = async (name) => {
    if (!SHOTS) return;
    fs.mkdirSync(SHOTS, { recursive: true });
    const { data } = await chrome.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(SHOTS, `${name}.png`), Buffer.from(data, "base64"));
  };
  // 真的點（觸控）：捲到看得到、點中間
  const tap = async (selector) => {
    const p = await evaluate(`const el = [...document.querySelectorAll(${JSON.stringify(selector)})].find((n) => { const r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0; }); if (!el) return null; const r0 = el.getBoundingClientRect(); if (r0.top < 70 || r0.bottom > innerHeight - 150) el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); return { x: r.left + Math.min(r.width / 2, 60), y: r.top + Math.min(r.height / 2, 40) };`);
    if (!p) return false;
    await chrome.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: p.x, y: p.y }] });
    await chrome.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    return true;
  };
  const next = () => evaluate(`const n = document.querySelector("[data-cv2s-next]"); if (n) n.click(); return Boolean(n);`);
  const see = () => evaluate(`const s = document.querySelector('[data-action="course-s-see"]'); if (s) s.click(); return Boolean(s);`);
  // 出到第 k 句：問著「為什麼」就先直接看，等「下一句」出來再按
  const retries = [];
  const advance = async (k) => {
    // app.js 的 render 排在下一格（rAF）：按了要等畫出來，不然會按到舊的那一顆、或連按兩下跳過一句
    for (let i = 0; i < 4 && (await evaluate(`return window.__b.beats();`)) < k; i += 1) {
      if (await see()) await waitFor(`!document.querySelector('[data-action="course-s-see"]') && document.querySelector("[data-cv2s-next]")`, 2000);
      const n = await next();
      if (await waitFor(`window.__b.beats() >= ${k}`, 2500)) break;
      retries.push(`${k}:${i}:${n}`);
    }
    return (await evaluate(`return window.__b.beats();`)) === k;
  };
  const go = async (si) => { await evaluate(`document.querySelector('[data-action="course-s-go"][data-to="${si}"]').click(); return 1;`); return waitFor(`window.__b.si() === ${si} && window.__b.board()`); };
  const openLesson = async (id) => {
    await evaluate(`window.__b.open(${JSON.stringify(id)}); return 1;`);
    return waitFor(`document.querySelector(".cv2-lesson h2") && document.querySelector(".cv2-lesson h2").textContent.trim() === ${JSON.stringify(lessonOf(id).title)} && document.querySelector("[data-cv2s] .cv2s-sec")`);
  };
  const motion = (on) => chrome.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: on ? "" : "reduce" }] });

  // 旁白：/media/narration/ 由測試自己回（無聲 mp3，長度由測試控制、照 Range 回 206），跟 e2e_course_sections 同一招
  const narr = { total: 600 };
  chrome.on("Fetch.requestPaused", (p) => {
    const range = Object.entries(p.request.headers || {}).find(([k]) => k.toLowerCase() === "range");
    const whole = silentMp3(narr.total);
    const m = range && /bytes=(\d+)-(\d*)/.exec(range[1]);
    const from = m ? Math.min(Number(m[1]), whole.length - 1) : 0;
    const to = m && m[2] ? Math.min(Number(m[2]), whole.length - 1) : whole.length - 1;
    const body = whole.subarray(from, to + 1);
    const headers = [{ name: "Content-Type", value: "audio/mpeg" }, { name: "Cache-Control", value: "no-store" }, { name: "Accept-Ranges", value: "bytes" }, { name: "Content-Length", value: String(body.length) }];
    if (m) headers.push({ name: "Content-Range", value: `bytes ${from}-${to}/${whole.length}` });
    chrome.send("Fetch.fulfillRequest", { requestId: p.requestId, responseCode: m ? 206 : 200, responseHeaders: headers, body: body.toString("base64") }).catch(() => {});
  });
  await chrome.send("Fetch.enable", { patterns: [{ urlPattern: "*/media/narration/*", requestStage: "Request" }, { urlPattern: "*/releases/download/*/narration.*", requestStage: "Request" }] });
  const retime = async (id, ms, name) => {
    narr.total = await evaluate(`const L = window.BUZZ_COURSE_V2_LESSONS[${JSON.stringify(id)}]; let at = 0; L.voice = ${JSON.stringify(name)};
      L.sections.forEach((s) => s.beats.forEach((b) => { if (b.why && b.why.say) { b.why.t = [at, at + ${ms}]; at += ${ms}; } if (b.say) { b.t = [at, at + ${ms}]; at += ${ms}; } else delete b.t; })); return at;`);
  };

  try {
    check("測試用的無聲 mp3 長度數得對", mp3Ms(silentMp3(600)) === 600);
    check(`三課每一句都帶 board（${PILOTS.map((L) => L.id).join("、")}）`, PILOTS.every((L) => L.sections.every((s) => s.beats.every((b) => Array.isArray(b.board) && b.board.length))));
    check("沒有黑板的對照課真的沒有 board", PLAIN.sections.every((s) => s.beats.every((b) => !b.board)));
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await chrome.send("Performance.enable");
    await chrome.navigate(`${server.url}/index.html`);
    await evaluate(`localStorage.clear(); localStorage.setItem("buzzcalculus.records.v1", JSON.stringify({ tours: { home: 1, quiz: 1 } })); return 1;`);
    await chrome.navigate(`${server.url}/index.html`);
    await evaluate(`const b = document.querySelector('[data-action="set-onboarding-context"][data-context="newbie"]'); if (b) b.click(); return 1;`);
    check("新手進課程表", await waitFor('document.querySelector(".cv2-index")'));

    /* ── 沒有黑板的課：畫面照舊、不抓黑板 ── */
    check(`打開 ${PLAIN.id}（沒有 board）`, await openLesson(PLAIN.id));
    await next();
    await sleep(300);
    const plain = await evaluate(`return { board: Boolean(document.querySelector(".cvb, [data-cvb-slot]")), files: window.__b.files(/course_board\\.js/), sr: document.querySelectorAll(".cvb-sr").length,
      shows: [...document.querySelectorAll("[data-cv2s] .cv2s-show")].map((p) => p.getBoundingClientRect().height > 10).every(Boolean) };`);
    check("沒有黑板的課：沒有黑板、show 照樣看得到、沒有 cvb-sr", !plain.board && plain.shows && plain.sr === 0, JSON.stringify(plain));
    check("沒有黑板的課不抓 course_board.js", plain.files === 0, String(plain.files));

    /* ── 連鎖律：抓黑板、寫、變形、圈、飛過來 ── */
    check(`打開 ${CHAIN.id}`, await openLesson(CHAIN.id));
    check("有黑板的課才抓 course_board.js，而且只抓一次", await waitFor(`window.__b.board() && window.__b.files(/course_board\\.js/) === 1`), String(await evaluate(`return window.__b.files(/course_board\\.js/);`)));
    const a11y = await evaluate(`const c = window.__b.board(); const li = document.querySelector("[data-cv2s] .cv2s-beat"); return { hidden: c.getAttribute("aria-hidden"), sr: li.querySelectorAll(".cv2s-show.cvb-sr").length, live: document.querySelector(".cv2s-beats").getAttribute("aria-live"), inSlot: Boolean(c.closest("[data-cvb-slot]")) };`);
    check("黑板 aria-hidden、句子的 show 還在（藏起來給螢幕閱讀器）、aria-live 照舊", a11y.hidden === "true" && a11y.sr === CHAIN.sections[0].beats[0].show.length && a11y.live === "polite" && a11y.inSlot, JSON.stringify(a11y));
    await evaluate(`return window.__b.settle();`);
    check(`到「${CHAIN.sections[CH_SI].title}」那一節`, await go(CH_SI));
    // 回到沒看過的節：第一句是新出來的 → 會動；畫到一半
    const w0 = await evaluate(`return { st: window.__b.st(), pending: window.__b.pending() };`);
    await sleep(350);
    const w1 = await evaluate(`return { st: window.__b.st(), pending: window.__b.pending(), text: window.__b.lineText(0) };`);
    await shot("chain-rule-write-mid");
    await evaluate(`return window.__b.settle();`);
    const w2 = await evaluate(`return { st: window.__b.st(), pending: window.__b.pending(), text: window.__b.lineText(0), strokes: window.__b.strokes() };`);
    const want0 = await evaluate(`return window.__b.texText(${JSON.stringify(CHAIN.sections[CH_SI].beats[0].board[0].line)});`);
    check("寫：畫到一半還有字沒出來（跟畫完不一樣）", (w0.st.running || w1.st.running) && Math.max(w0.pending, w1.pending) > 0, `${JSON.stringify(w0)} ${JSON.stringify(w1)}`);
    check("寫：畫完全部出來、字跟 board 寫的式子一樣、粉筆記號都畫完", !w2.st.running && w2.pending === 0 && w2.text === want0 && w2.strokes.length === 2 && w2.strokes.every((v) => v === 0), JSON.stringify({ w2, want0 }));
    await shot("chain-rule-write-end");

    // 變形：4 從指數搬到前面、(x²+1) 搬過去 —— 同一個元素
    await evaluate(`window.__n = window.__b.board().querySelector(".cvb-t-n"); window.__i = window.__b.board().querySelector(".cvb-t-i"); return 1;`);
    await tap(".cvb");
    await sleep(380);
    const t1 = await evaluate(`return { st: window.__b.st(), moving: window.__b.moving(), nIn: Boolean(window.__n.closest(".cvb-o")), tf: window.__n.style.transform };`);
    await shot("chain-rule-transform-mid");
    await evaluate(`return window.__b.settle();`);
    const t2 = await evaluate(`const c = window.__b.board(); return { same: c.querySelector(".cvb-t-n") === window.__n && c.querySelector(".cvb-t-i") === window.__i, lines: c.querySelectorAll(".cvb-l").length, text: window.__b.lineText(0), tf: window.__n.style.transform, ghosts: c.querySelectorAll(".cvb-o").length };`);
    const wantT = await evaluate(`return window.__b.texText(${JSON.stringify(CH_T.line)});`);
    check("點黑板＝下一句；變形中：配對的項在新的一行裡、正在移動（transform）", t1.st.at === 1 && t1.nIn && /translate/.test(t1.tf) && t1.moving >= 2, JSON.stringify(t1));
    check("變形完：4 與 (x²+1) 是同一個元素搬過去（===）、沒有殘影、transform 清掉", t2.same && t2.ghosts === 0 && t2.tf === "" && t2.lines === 1, JSON.stringify(t2));
    check("變形完：那一行的字跟目標式子一模一樣", t2.text === wantT, `${t2.text} vs ${wantT}`);
    // 粉筆記號畫在那一項上
    const mk = await evaluate(`const c = window.__b.board(); const svg = [...c.querySelectorAll(".cvb-a")].pop(); const t = c.querySelector(".cvb-t-i"); return { s: window.__b.rect(svg), t: window.__b.rect(t), kind: ${JSON.stringify(CHAIN.sections[CH_SI].beats[1].board[1].do)} };`);
    check("底線框住指定的那一項（橫向涵蓋、貼在它上下）", mk.s.l <= mk.t.l + 1 && mk.s.r >= mk.t.r - 1 && mk.s.t <= mk.t.b && mk.s.b >= mk.t.t, JSON.stringify(mk));

    // 下一句＝上一句直接畫完（寫＋圈畫到一半就按）
    await next();
    await waitFor(`window.__b.st().at === 2`, 1500);
    await sleep(120);
    const n1 = await evaluate(`return { st: window.__b.st(), pending: window.__b.pending() };`);
    await next();
    await waitFor(`window.__b.st().at === 3`, 1500);
    const n2 = await evaluate(`const c = window.__b.board(); const l2 = c.querySelectorAll(".cvb-l")[1]; return { st: window.__b.st(), done2: l2 ? [...l2.querySelectorAll(".katex-html span")].every((n) => n.style.opacity === "") : false, circle: l2 ? [...l2.querySelectorAll(".cvb-a path")].map((p) => p.style.strokeDashoffset) : [], flying: window.__b.flying() };`);
    check("畫到一半按「下一句」：上一句直接畫完（字全出來、圈畫完）、下一句接著畫", n1.st.running && n1.st.at === 2 && n2.st.at === 3 && n2.done2 && n2.circle.length === 1 && Number(n2.circle[0]) === 0, JSON.stringify({ n1, n2 }));
    await sleep(250);
    const f1 = await evaluate(`return { flying: window.__b.flying(), st: window.__b.st() };`);
    await shot("chain-rule-fly-mid");
    await evaluate(`return window.__b.settle();`);
    const f2 = await evaluate(`return { flying: window.__b.flying(), text: window.__b.lineText(2) };`);
    const wantF = await evaluate(`return window.__b.texText(${JSON.stringify(CHAIN.sections[CH_SI].beats[3].board[1].line)});`);
    check("前幾行的項飛過來：中途有複製的那一份、畫完收掉，最後一行變成目標式子", (n2.flying > 0 || f1.flying > 0) && f2.flying === 0 && f2.text === wantF, JSON.stringify({ n2: n2.flying, f1, f2, wantF }));
    await shot("chain-rule-section-end");

    /* ── reduced-motion：直接到位 ── */
    await motion(false);
    check("reduced-motion：到下一節", await go(CH_SI + 1));
    const rm0 = await evaluate(`return { st: window.__b.st(), pending: window.__b.pending() };`);
    await next();
    await waitFor(`window.__b.st().at === 1`, 1500);
    const rm1 = await evaluate(`return { st: window.__b.st(), pending: window.__b.pending(), strokes: window.__b.strokes(), raf: 0 };`);
    check("reduced-motion：第一句與「下一句」都直接畫好（沒有動畫、沒有沒出來的字）", !rm0.st.running && rm0.pending === 0 && !rm1.st.running && rm1.st.at === 1 && rm1.pending === 0 && rm1.strokes.every((v) => v === 0), JSON.stringify({ rm0, rm1 }));
    await motion(true);

    /* ── 證明節：why: true 的動作答了才畫 ── */
    check(`打開 ${DCT.id}`, await openLesson(DCT.id));
    check(`到證明節（第 ${DCT_SI + 1} 節）`, await go(DCT_SI));
    for (let k = 1; k <= DCT_BI; k += 1) {
      await evaluate(`return window.__b.settle();`);
      await advance(k + 1);
    }
    await evaluate(`return window.__b.settle();`);
    const before = DCT.sections[DCT_SI].beats[DCT_BI].board.findIndex((a) => a.why);
    const q0 = await evaluate(`return { st: window.__b.st(), asking: Boolean(document.querySelector('[data-cv2s-act="why"]')), strikes: window.__b.board().querySelectorAll(".cvb-a").length };`);
    check("問「為什麼」的時候：只畫到答案之前（why: true 的還沒畫）", q0.asking && q0.st.at === DCT_BI && q0.st.n === before && !q0.st.running, JSON.stringify(q0));
    await shot("dominated-convergence-why-asking");
    await see();
    await sleep(300);
    const q1 = await evaluate(`return { st: window.__b.st() };`);
    await evaluate(`return window.__b.settle();`);
    const q2 = await evaluate(`const c = window.__b.board(); return { st: window.__b.st(), marks: c.querySelectorAll(".cvb-a").length, strike: Boolean([...c.querySelectorAll(".cvb-a")].find((s) => /kr/.test(s.getAttribute("class")))), text: window.__b.lineText(c.querySelectorAll(".cvb-l").length - 1) };`);
    check("答了（直接看）：接著畫答案（圈 ∫2g、寫 ∞−∞、打叉）", q1.st.running && q2.st.n === DCT.sections[DCT_SI].beats[DCT_BI].board.length && q2.marks === 2 && q2.strike && /∞−∞/.test(q2.text), JSON.stringify({ q1, q2 }));
    await shot("dominated-convergence-why-answered");

    /* ── 旁白：黑板跟著錄音走，暫停就停 ── */
    check(`旁白：重開 ${CHAIN.id}`, await openLesson(CHAIN.id));
    check("到第一節", await go(0));
    await evaluate(`return window.__b.settle();`);
    await retime(CHAIN.id, 2600, "e2eboard");
    await tap("[data-cv2s-play]");
    check("按播放：念完第一句自己出第二句，黑板跟著那一句的錄音畫", await waitFor(`window.__b.st().at === 1 && window.__b.st().running && window.BuzzCourseSections.voice().beat === "0-1"`, 6000), JSON.stringify(await evaluate(`return { st: window.__b.st(), v: window.BuzzCourseSections.voice() };`)));
    await sleep(500);
    const v1 = await evaluate(`const v = window.BuzzCourseSections.voice(); return { p: window.__b.st().p, at: v.at, start: v.start, end: v.end };`);
    const expect = (v1.at - v1.start) / ((v1.end - v1.start) * 0.9);
    check("黑板的進度 ≈ 錄音念到的位置（這一句的 90% 畫完）", Math.abs(v1.p - expect) < 0.15 && v1.p > 0.05 && v1.p < 0.95, JSON.stringify({ ...v1, expect: Math.round(expect * 100) / 100 }));
    await tap("[data-cv2s-play]");
    await sleep(150);
    const p1 = await evaluate(`return { st: window.__b.st(), html: window.__b.board().innerHTML.length + ":" + window.__b.pending() + ":" + window.__b.strokes().join(","), v: window.BuzzCourseSections.voice().paused };`);
    await sleep(900);
    const p2 = await evaluate(`return { st: window.__b.st(), html: window.__b.board().innerHTML.length + ":" + window.__b.pending() + ":" + window.__b.strokes().join(",") };`);
    check("暫停：黑板停住（進度與畫面 0.9 秒都不動）", p1.v && p1.st.running && p1.st.p === p2.st.p && p1.html === p2.html, JSON.stringify({ p1, p2 }));
    await tap("[data-cv2s-play]");
    await sleep(700);
    const p3 = await evaluate(`return window.__b.st();`);
    check("繼續：接著畫", p3.p > p2.st.p || (!p3.running && p3.at >= 1), JSON.stringify(p3));
    await tap("[data-cv2s-play]");
    await sleep(200);

    /* ── 螢幕閱讀器的字、寬度：三課每一節每一句（reduced-motion 直接到位，量的是結尾） ── */
    await motion(false);
    for (const width of [390, 360]) {
      await chrome.send("Emulation.setDeviceMetricsOverride", { ...PHONE, width });
      for (const L of PILOTS) {
        check(`${width}：打開 ${L.id}`, await openLesson(L.id));
        const bad = [];
        const srBad = [];
        for (let si = 0; si < L.sections.length; si += 1) {
          await go(si);
          for (let bi = 0; bi < L.sections[si].beats.length; bi += 1) {
            if (bi) await advance(bi + 1);
            await see();
            const m = await evaluate(`const c = window.__b.board(); const r = c.getBoundingClientRect(); const out = [...c.querySelectorAll(".cvb-e, .cvb-p svg")].map((e) => e.getBoundingClientRect()).filter((e) => e.left < r.left - 1 || e.right > r.right + 1).length;
              return { out, page: window.__b.overflow(), board: r.right <= innerWidth + 0.5 && r.left >= -0.5, lines: c.querySelectorAll(".cvb-l").length };`);
            if (m.out || m.page > 1 || !m.board) bad.push(`${si}-${bi} ${JSON.stringify(m)}`);
          }
          const sr = await evaluate(`return [...document.querySelectorAll("[data-cv2s] .cv2s-beat")].map((li) => ({ text: window.__b.srText(li), hidden: [...li.querySelectorAll(".cv2s-show")].every((p) => p.classList.contains("cvb-sr") && window.__b.srHidden(p)) }));`);
          L.sections[si].beats.forEach((b, bi) => {
            const got = (sr[bi] || { text: [] }).text.map((s) => s.replace(/\s+/g, ""));
            const want = b.show.map((s) => s.replace(/\\\$/g, "$").replace(/\s+/g, ""));
            if (!sr[bi] || !sr[bi].hidden || got.join("|") !== want.join("|")) srBad.push(`${si}-${bi}: ${got.join("|")} ≠ ${want.join("|")}`);
          });
        }
        check(`${width}：${L.id} 每一句黑板的每一行都在板裡、頁面不橫向溢出`, !bad.length, bad.slice(0, 3).join("；"));
        check(`${width}：${L.id} 螢幕閱讀器拿到的字 = show（藏起來、不在 aria-hidden 裡）`, !srBad.length, srBad.slice(0, 2).join("；"));
      }
    }
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);

    /* ── 深色／淺色 ── */
    const theme = async (name) => evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(name)}; const c = window.__b.board(); const cs = getComputedStyle(c);
      const bg = window.__b.varRgb(c, "--kb"); const ink = cs.color;
      return { bg, img: cs.backgroundImage !== "none", ink, text: window.__b.contrast(ink, bg), chalk: ["--kg", "--kr", "--kc", "--kn"].map((k) => Math.round(window.__b.contrast(window.__b.varRgb(c, k), bg) * 100) / 100), dark: window.__b.lum(bg) < 0.1 };`);
    const light = await theme("light");
    await shot("theme-light");
    const dark = await theme("dark");
    await shot("theme-dark");
    check("淺色：淺色板、字與粉筆色對比 ≥ 4.5", !light.dark && light.text >= 4.5 && light.chalk.every((c) => c >= 4.5), JSON.stringify(light));
    check("深色：深綠的黑板、字與粉筆色對比 ≥ 4.5", dark.dark && dark.img && dark.text >= 4.5 && dark.chalk.every((c) => c >= 4.5) && dark.bg !== light.bg, JSON.stringify(dark));
    await evaluate(`document.documentElement.dataset.theme = "light"; return 1;`);
    await motion(true);

    /* ── 幀時間：rAF 間隔、黑板自己每格的工作、動畫中的版面重排 ── */
    // 包住 requestAnimationFrame：量每一個 callback 跑多久（黑板的 frame 在裡面）
    await evaluate(`if (!window.__rafWrapped) { const orig = window.requestAnimationFrame.bind(window); window.__work = []; window.requestAnimationFrame = (cb) => orig((ts) => { const t0 = performance.now(); cb(ts); window.__work.push(performance.now() - t0); }); window.__rafWrapped = true; } return 1;`);
    const measure = async (label, dpr) => {
      await chrome.send("Emulation.setDeviceMetricsOverride", { ...PHONE, deviceScaleFactor: dpr });
      check(`${label}：打開 ${DCT.id}`, await openLesson(DCT.id));
      await go(0);
      await evaluate(`return window.__b.settle();`);
      const m0 = await chrome.send("Performance.getMetrics");
      await evaluate(`window.__work = []; window.__gaps = []; let last = 0; const rec = (ts) => { if (last) window.__gaps.push(ts - last); last = ts; if (window.__recOn) requestAnimationFrame(rec); }; window.__recOn = true; requestAnimationFrame(rec); return 1;`);
      let mid = null;
      for (let k = 1; k < DCT.sections[0].beats.length; k += 1) {
        await next();
        await waitFor(`window.__b.st().at === ${k}`, 1500);
        // 只有一個「寫」的那一句：寫到一半的兩個時間點之間（約 25 格），版面重排的次數
        if (DCT.sections[0].beats[k].board.length === 1) {
          await sleep(250);
          const a = await chrome.send("Performance.getMetrics");
          const fa = await evaluate(`return window.__gaps.length;`);
          await sleep(450);
          const b = await chrome.send("Performance.getMetrics");
          const fb = await evaluate(`return { n: window.__gaps.length, running: window.__b.st().running };`);
          const lc = (m) => (m.metrics.find((x) => x.name === "LayoutCount") || {}).value || 0;
          mid = { layouts: lc(b) - lc(a), frames: fb.n - fa, running: fb.running };
        }
        await evaluate(`return window.__b.settle();`);
      }
      const out = await evaluate(`window.__recOn = false; const s = (a) => a.slice().sort((x, y) => x - y); const q = (a, p) => { const b = s(a); return b.length ? b[Math.min(b.length - 1, Math.floor(p * b.length))] : 0; };
        return { frames: window.__gaps.length, median: q(window.__gaps, 0.5), p95: q(window.__gaps, 0.95), work95: q(window.__work, 0.95), workMax: Math.max(0, ...window.__work) };`);
      const m1 = await chrome.send("Performance.getMetrics");
      const metric = (m, name) => (m.metrics.find((x) => x.name === name) || {}).value || 0;
      out.layouts = metric(m1, "LayoutCount") - metric(m0, "LayoutCount");
      out.mid = mid;
      out.styles = metric(m1, "RecalcStyleCount") - metric(m0, "RecalcStyleCount");
      return out;
    };
    const hi = await measure("DPR 3", 3);
    console.log(`  ·    幀時間（手機 390、DPR 3、控制收斂第一節 ${DCT.sections[0].beats.length - 1} 句：擦、畫圖、寫、底線）：rAF 中位數 ${hi.median.toFixed(1)}ms、p95 ${hi.p95.toFixed(1)}ms；rAF callback 每格 p95 ${hi.work95.toFixed(2)}ms、最久 ${hi.workMax.toFixed(1)}ms；${hi.frames} 格裡版面重排 ${hi.layouts} 次`);
    check("DPR 3：黑板每格的工作 p95 < 4ms", hi.frames > 30 && hi.work95 < 4, `${hi.work95.toFixed(2)}ms`);
    check("DPR 3：寫到一半的那一段（約 25 格）沒有版面重排（只在動作開始時量位置）", hi.mid && hi.mid.running && hi.mid.frames >= 15 && hi.mid.layouts <= 1, JSON.stringify(hi.mid));
    const lo = await measure("DPR 1", 1);
    console.log(`  ·    幀時間（手機 390、DPR 1）：rAF 中位數 ${lo.median.toFixed(1)}ms、p95 ${lo.p95.toFixed(1)}ms；rAF callback 每格 p95 ${lo.work95.toFixed(2)}ms；${lo.frames} 格裡版面重排 ${lo.layouts} 次`);
    check("DPR 1：rAF 間隔中位數 < 20ms（60fps 量級）", lo.frames > 30 && lo.median < 20, `${lo.median.toFixed(1)}ms`);
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);

    /* ── 截圖：三課每一節的動畫中段與結尾（--screenshots） ── */
    if (SHOTS) {
      for (const [L, dark2] of [[CHAIN, false], [FTC, false], [DCT, true]]) {
        await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(dark2 ? "dark" : "light")}; return 1;`);
        await openLesson(L.id);
        for (let si = 0; si < L.sections.length; si += 1) {
          await go(si);
          for (let bi = 0; bi < L.sections[si].beats.length; bi += 1) {
            if (bi) await advance(bi + 1);
            await sleep(420);
            if (bi === L.sections[si].beats.length - 1) await shot(`${L.id}-${si + 1}-mid`);
            await evaluate(`return window.__b.settle();`);
          }
          await see();
          await evaluate(`return window.__b.settle();`);
          await evaluate(`window.__b.board().scrollIntoView({ block: "start" }); scrollBy(0, -80); return 1;`);
          await sleep(150);
          await shot(`${L.id}-${si + 1}-end`);
        }
      }
    }

    if (retries.length) console.log(`  ·    出下一句要按第二次的地方：${retries.join(" ")}`);
    const errs = errors.filter((e) => !/favicon|net::ERR|Failed to load resource/.test(e));
    check("console 沒有錯誤", !errs.length, errs.slice(0, 3).join(" | "));
  } finally {
    await chrome.close();
    await server.stop();
  }
  console.log(`\n${passed} 項通過${failures.length ? `，${failures.length} 項失敗` : ""}`);
  if (failures.length) {
    failures.forEach((f) => console.log(`  - ${f}`));
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
