// 分節的黑板 v2（beat.board，src/course_board.js＋course_board_layout.js）在真的 Chrome 裡走一次：手機 390×844、DPR 3（觸控）。
//
// 斷言都是看得到、量得到的東西：
//   載入：沒有黑板的課畫面照舊、一個黑板的檔都不抓；有黑板的課才抓（各一次），有 plot 的節才抓 course_board_plot.js；
//   時間（虛擬時鐘，沒開旁白）：圈在「念到那個詞」的時候才開始（字數 × 每字毫秒），點一下＝這一句畫完；
//   時間（假的旁白時鐘，直接換 BuzzCourseSections.voice()）：錨點之前一格沒開始、之後一格開始了；1× 與 1.5× 開始的錄音時間一樣；
//     暫停時進度與畫面都不動；往回拖會倒回去（記號沒了）、往後拖直接畫完；卡住（currentTime 不動）最多往前估 100ms；
//     男聲（voice().v = m）用男聲自己的 tm 與錨點 mm：男聲的錨點前沒開始、之後開始，女聲錨點的時間點上還沒開始；換回女聲照女聲的；
//   真的 <audio>（測試回的無聲 mp3）1.5× 播：黑板的時間跟 currentTime 差不到 80ms；
//   變形：畫完那一行的 KaTeX 字跟目標式子一樣、飛的複製收掉；「為什麼」：問著不畫答案、答了才畫；reduced-motion 直接畫好；
//   版面：三課每一節每一步在 360（淺／深）量過不疊、不出板、字夠大、對比夠（tools/lib/board_lint.js，同 lint_board_layout.js）；
//     而且 lint 自己會抓到故意弄出來的重疊；螢幕閱讀器拿到的字 = show；幀時間；流量（黑板幾個位元組、只在有黑板的課付）。console 沒有錯誤。
//
// 用法：node tools/e2e_course_board.js
"use strict";

const fs = require("fs");
const path = require("path");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");
const { lintLessons, VIEWPORTS, pageHelpers } = require("./lib/board_lint.js");
const { charOf } = require("./lib/course_board_check.js");

const ROOT = path.join(__dirname, "..");
const PHONE = { width: 390, height: 844, deviceScaleFactor: 3, mobile: true };
const LESSON_DIR = path.join(ROOT, "tools", "content", "course_v2", "lessons");
const lessonOf = (id) => JSON.parse(fs.readFileSync(path.join(LESSON_DIR, `${id}.json`), "utf8"));
// 沒有黑板的課：黑板會一批批鋪開，寫死一課遲早會被鋪到 —— 照檔名順序挑第一課整課都沒有 board 的
const PLAIN = fs.readdirSync(LESSON_DIR).filter((f) => f.endsWith(".json")).sort()
  .map((f) => lessonOf(f.replace(/\.json$/, "")))
  .find((L) => (L.sections || []).length && !L.sections.some((s) => s.beats.some((b) => b.board)));
const CHAIN = lessonOf("chain-rule");
const FTC = lessonOf("ftc-part1");
const DCT = lessonOf("dominated-convergence");
const PILOTS = [CHAIN, FTC, DCT];
// 連鎖律「公式」那一節第一句：寫一行，再在念到「外層的導數」「整包」「裡層的導數」時框、底線、圈
const F_SI = CHAIN.sections.findIndex((s) => s.beats[0].board && s.beats[0].board.some((a) => a.on === "外層的導數"));
const F_B = CHAIN.sections[F_SI].beats[0];
const F_K = F_B.board.findIndex((a) => a.on === "外層的導數");
// 「外層是次方」那一節第二句：變形（4 從指數搬到前面）
const T_SI = CHAIN.sections.findIndex((s) => s.beats.some((b) => (b.board || []).some((a) => a.do === "transform" && /\{\{n:4\}\}\\,/.test(a.line))));
const T_BI = CHAIN.sections[T_SI].beats.findIndex((b) => (b.board || []).some((a) => a.do === "transform"));
// 控制收斂的證明節：有 why: true 的那一句
const P_SI = DCT.sections.findIndex((s) => s.proof);
const P_BI = DCT.sections[P_SI].beats.findIndex((b) => b.why && (b.board || []).some((a) => a.why));
const { mp3Ms } = require("./build_narration.js");
const silentMp3 = (ms) => {
  const frame = Buffer.alloc(144);
  frame.set([0xff, 0xf3, 0x64, 0xc0]);
  return Buffer.concat(Array.from({ length: Math.ceil(ms / 24) }, () => frame));
};

// 機器慢多少：CI 的 BUZZ_E2E_SLOW、本機複製 runner 用的 BUZZ_E2E_CPU_THROTTLE。只拿來放寬逾時與幀時間的上限
const THROTTLE = Math.max(1, Number(process.env.BUZZ_E2E_CPU_THROTTLE || 1) || 1);
const SLOWER = Math.max(1, Number(process.env.BUZZ_E2E_SLOW || 1) || 1, THROTTLE);

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
    open(id) { const b = document.createElement("button"); b.dataset.action = "open-course-lesson"; b.dataset.lessonId = id; document.querySelector("#app").appendChild(b); b.click(); b.remove(); return 1; },
    si() { const r = document.querySelector("[data-cv2s]"); return r ? Number(r.dataset.cv2s) : -1; },
    beats() { return document.querySelectorAll("[data-cv2s] .cv2s-beat").length; },
    st() { return window.BuzzBoard && window.BuzzBoard.state(); },
    model() { return window.BuzzBoard && window.BuzzBoard.debug.model(); },
    board() { return document.querySelector("[data-cv2s] .cvb"); },
    // 部署版（tools/bundle_site.js）把 board 群組的兩支串成 bundle/lazy-board.<雜湊>.js：當成兩支都抓了一次
    files(re) { return performance.getEntriesByType("resource").map((e) => e.name).flatMap((n) => (/bundle\\/lazy-board\\./.test(n) ? ["src/course_board_layout.js", "src/course_board.js"] : [n])).filter((n) => re.test(n)).length; },
    bytes(re) { return performance.getEntriesByType("resource").filter((e) => re.test(e.name)).reduce((s, e) => s + (e.encodedBodySize || e.transferSize || 0), 0); },
    overflow() { const d = document.documentElement; return d.scrollWidth - d.clientWidth; },
    // 某一項（data-n）的 KaTeX 看得到的字
    itemText(n) { const el = window.__b.board().querySelector('.cvb-i[data-n="' + n + '"]'); return el ? [...el.querySelectorAll(".katex-html, .cvb-x")].map((x) => x.textContent).join("").replace(/\\s+/g, "") : ""; },
    texText(line) {
      const d = document.createElement("div");
      d.innerHTML = String(line).split(/(?<!\\\\)\\$/).map((p, i) => (i % 2 ? window.katex.renderToString("\\\\displaystyle " + window.BuzzBoard.tex(p), window.BuzzBoard.KOPT) : p.trim())).join("");
      return [...d.childNodes].map((n) => (n.querySelector ? (n.querySelector(".katex-html") || n).textContent : n.textContent)).join("").replace(/\\s+/g, "");
    },
    // 記號 a 畫了多少（stroke-dashoffset：1 = 沒畫、0 = 畫完）與透明度
    mark(a) { const g = window.__b.board().querySelector('.cvb-ink g[data-a="' + a + '"]'); if (!g) return null; const p = g.querySelector("path"); return { off: p ? Number(p.style.strokeDashoffset) : -1, op: g.style.opacity === "" ? 1 : Number(g.style.opacity) }; },
    flying() { const c = window.__b.board(); return c ? [...c.querySelectorAll(".cvb-f")].filter((n) => n.style.opacity === "1").length : -1; },
    srText(li) {
      return [...li.querySelectorAll(".cv2s-show")].map((p) => {
        const c = p.cloneNode(true);
        c.querySelectorAll(".katex").forEach((k) => { const a = k.querySelector("annotation"); k.replaceWith("$" + (a ? a.textContent : "") + "$"); });
        return c.textContent;
      });
    },
    srHidden(p) { const r = p.getBoundingClientRect(); const cs = getComputedStyle(p); return r.width <= 1 && r.height <= 1 && cs.display !== "none" && cs.visibility !== "hidden" && !p.closest("[aria-hidden='true']"); },
    async settle(ms) { const t0 = performance.now(); while (window.__b.st() && window.__b.st().running && performance.now() - t0 < (ms || 15000)) await new Promise((r) => setTimeout(r, 50)); return !window.__b.st() || !window.__b.st().running; },
    // 假的旁白：BuzzCourseSections.voice() 換成 window.__fake（測完放回去）
    fake(v) { const S = window.BuzzCourseSections; if (!S.__voice) S.__voice = S.voice; window.__fake = v; S.voice = () => window.__fake || {}; window.BuzzBoard.debug.tick(); return window.__b.st(); },
    unfake() { const S = window.BuzzCourseSections; if (S.__voice) { S.voice = S.__voice; delete S.__voice; } window.__fake = null; return 1; }
  };
`;

async function run() {
  console.log("E2E 課程黑板 v2");
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const evaluate = (code) => chrome.evaluate(`${HELPERS}\n${code}`);
  const sleep = (ms) => chrome.sleep(ms);
  // 等的是「狀態到了」，逾時只是上限：慢的 runner／CPU 降速時放寬（不影響斷言本身）
  const waitFor = async (expr, ms = 8000) => {
    for (const deadline = Date.now() + ms * SLOWER; Date.now() < deadline; await sleep(60)) {
      if (await evaluate(`return Boolean(${expr});`)) return true;
    }
    return false;
  };
  const errors = [];
  chrome.on("Runtime.exceptionThrown", (p) => errors.push((p.exceptionDetails.exception && p.exceptionDetails.exception.description) || p.exceptionDetails.text));
  chrome.on("Runtime.consoleAPICalled", (p) => { if (p.type === "error") errors.push(p.args.map((a) => a.value || a.description || "").join(" ")); });
  const tap = async (selector) => {
    const p = await evaluate(`const el = [...document.querySelectorAll(${JSON.stringify(selector)})].find((n) => { const r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0; }); if (!el) return null; const r0 = el.getBoundingClientRect(); if (r0.top < 70 || r0.bottom > innerHeight - 150) el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); return { x: r.left + Math.min(r.width / 2, 60), y: r.top + Math.min(r.height / 2, 40) };`);
    if (!p) return false;
    await chrome.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: p.x, y: p.y }] });
    await chrome.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    return true;
  };
  const next = () => evaluate(`const n = document.querySelector("[data-cv2s-next]"); if (n) n.click(); return Boolean(n);`);
  const see = () => evaluate(`const s = document.querySelector('[data-action="course-s-see"]'); if (s) s.click(); return Boolean(s);`);
  const advance = async (k) => {
    for (let i = 0; i < 4 && (await evaluate(`return window.__b.beats();`)) < k; i += 1) {
      if (await see()) await waitFor(`!document.querySelector('[data-action="course-s-see"]') && document.querySelector("[data-cv2s-next]")`, 2000);
      await next();
      if (await waitFor(`window.__b.beats() >= ${k}`, 2500)) break;
    }
    return (await evaluate(`return window.__b.beats();`)) === k;
  };
  const go = async (si, id) => { await evaluate(`document.querySelector('[data-action="course-s-go"][data-to="${si}"]').click(); return 1;`); return waitFor(`window.__b.si() === ${si} && window.__b.st() && window.__b.st().key === ${JSON.stringify(`${id}:${si}`)}`); };
  // 重開同一課時標題本來就對：先把舊的畫面與舊的黑板做記號，等到新畫的那一份（新的分節、黑板也換成新的）才算開好 ——
  // 不然慢的機器上會讀到還沒重畫的舊狀態（以前「重開、回到第一句」讀到 at = 1 就是這個）
  const openLesson = async (id) => {
    await evaluate(`document.querySelectorAll("[data-cv2s]").forEach((n) => { n.__old = 1; }); window.__oldBoard = window.__b.board(); window.__b.open(${JSON.stringify(id)}); return 1;`);
    return waitFor(`document.querySelector(".cv2-lesson h2") && document.querySelector(".cv2-lesson h2").textContent.trim() === ${JSON.stringify(lessonOf(id).title)} && document.querySelector("[data-cv2s] .cv2s-sec") && !document.querySelector("[data-cv2s]").__old
      && (!document.querySelector("[data-cvb-slot]") || (window.__b.board() && window.__b.board() !== window.__oldBoard && window.__b.board().closest("[data-cvb-slot]") && window.__b.st() && window.__b.st().key.startsWith(${JSON.stringify(`${id}:`)})))`);
  };
  const motion = (on) => chrome.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: on ? "" : "reduce" }] });
  // 旁白：/media/narration/ 由測試自己回（無聲 mp3，照 Range 回 206），跟 e2e_course_sections 同一招
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

  try {
    check("測試用的無聲 mp3 長度數得對", mp3Ms(silentMp3(600)) === 600);
    check("三課每一句都帶 board", PILOTS.every((L) => L.sections.every((s) => s.beats.every((b) => Array.isArray(b.board) && b.board.length))));
    check("三課有旁白的動作都錨在念到的詞上（每一段第一個以外都有 on）", PILOTS.every((L) => L.sections.every((s) => s.beats.every((b) => {
      const n = { q: 0, s: 0 };
      return b.board.every((a) => { const c = b.why && !a.why ? "q" : "s"; n[c] += 1; return n[c] === 1 || typeof a.on === "string"; });
    }))));
    check(`找得到要測的句子（公式第 ${F_SI + 1} 節、變形第 ${T_SI + 1} 節、證明節第 ${P_SI + 1} 節）`, F_SI >= 0 && F_K > 0 && T_SI >= 0 && T_BI > 0 && P_SI >= 0 && P_BI > 0);
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await chrome.send("Performance.enable");
    await chrome.navigate(`${server.url}/index.html`);
    await evaluate(`localStorage.clear(); localStorage.setItem("buzzcalculus.records.v1", JSON.stringify({ tours: { home: 1, quiz: 1 } })); return 1;`);
    await chrome.navigate(`${server.url}/index.html`);
    await evaluate(`const b = document.querySelector('[data-action="set-onboarding-context"][data-context="newbie"]'); if (b) b.click(); return 1;`);
    check("新手進課程表", await waitFor('document.querySelector(".cv2-index")'));

    /* ── 載入：沒有黑板的課不抓；有黑板才抓；有圖才抓圖 ── */
    check(`打開 ${PLAIN.id}（沒有 board）`, await openLesson(PLAIN.id));
    await next();
    await sleep(300);
    const plain = await evaluate(`return { board: Boolean(document.querySelector(".cvb, [data-cvb-slot]")), files: window.__b.files(/course_board/), sr: document.querySelectorAll(".cvb-sr").length,
      shows: [...document.querySelectorAll("[data-cv2s] .cv2s-show")].map((p) => p.getBoundingClientRect().height > 10).every(Boolean) };`);
    check("沒有黑板的課：沒有黑板、show 照樣看得到、沒有 cvb-sr", !plain.board && plain.shows && plain.sr === 0, JSON.stringify(plain));
    check("沒有黑板的課：一個黑板的檔都不抓（course_board*.js）", plain.files === 0, String(plain.files));
    check(`打開 ${CHAIN.id}`, await openLesson(CHAIN.id));
    check("有黑板的課：course_board_layout.js、course_board.js 各抓一次，沒有 plot 的課不抓 course_board_plot.js", await waitFor(`window.__b.board() && window.__b.files(/course_board_layout\\.js/) === 1 && window.__b.files(/course_board\\.js/) === 1`) && (await evaluate(`return window.__b.files(/course_board_plot\\.js/);`)) === 0, String(await evaluate(`return [window.__b.files(/course_board_layout/), window.__b.files(/course_board\\.js/), window.__b.files(/course_board_plot/)].join(",");`)));
    const a11y = await evaluate(`const c = window.__b.board(); const li = document.querySelector("[data-cv2s] .cv2s-beat"); return { hidden: c.getAttribute("aria-hidden"), sr: li.querySelectorAll(".cv2s-show.cvb-sr").length, live: document.querySelector(".cv2s-beats").getAttribute("aria-live"), inSlot: Boolean(c.closest("[data-cvb-slot]")) };`);
    check("黑板 aria-hidden、句子的 show 還在（藏起來給螢幕閱讀器）、aria-live 照舊", a11y.hidden === "true" && a11y.sr === CHAIN.sections[0].beats[0].show.length && a11y.live === "polite" && a11y.inSlot, JSON.stringify(a11y));
    const h0 = await evaluate(`return window.__b.board().getBoundingClientRect().height;`);
    await evaluate(`return window.__b.settle();`);
    await advance(2);
    await evaluate(`return window.__b.settle();`);
    const h1 = await evaluate(`return window.__b.board().getBoundingClientRect().height;`);
    check("一節的板高一開始就定好：寫上第二句之後板不長高（下面的句子不被推動）", Math.abs(h1 - h0) < 0.5 && h0 > 60, `${h0} → ${h1}`);

    /* ── 虛擬時鐘（沒開旁白）：圈在念到那個詞的時候才開始 ── */
    check(`到「${CHAIN.sections[F_SI].title}」那一節（新出來的句子會動）`, await go(F_SI, CHAIN.id));
    const g0 = await evaluate(`const m = window.__b.model(); return m.acts.findIndex((x) => x.b === 0 && x.k === ${F_K});`);
    // 時間用黑板自己的虛擬時鐘量（state().tau），不用牆上時間：以前從「點了那一節」到「開始量」中間的延遲在慢機器上 300ms 起跳，
    // 量出來的 548ms 其實是虛擬時間的 850ms。先把時鐘撥到錨點前 70ms／後 120ms 各看一次，再撥回 0 讓它照牆上時間自己走、每格記 (tau, 開始了沒)
    const want = charOf(F_B.board[F_K].on, F_B.say) * 170;
    const vt = await evaluate(`const D = window.BuzzBoard.debug; const on = (s) => s.g > ${g0} || (s.g === ${g0} && s.q > 0);
      const pre = D.clock(${want - 70}); const post = D.clock(${want + 120}); D.clock(0);
      const out = []; const t0 = performance.now();
      while (performance.now() - t0 < 8000 * ${SLOWER}) { await new Promise((r) => requestAnimationFrame(r)); const s = window.__b.st(); out.push([s.tau, on(s) ? 1 : 0, s.mode]); if (s.tau > ${want + 300}) break; }
      const no = out.filter((x) => !x[1]).map((x) => x[0]); const yes = out.filter((x) => x[1]).map((x) => x[0]);
      return { pre: [pre.mode, pre.g, pre.q], post: [post.mode, post.g, post.q], preOn: on(pre), postOn: on(post) && post.g === ${g0} && post.q < 1, modes: [...new Set(out.map((x) => x[2]))], n: out.length,
        lastOff: no.length ? Math.max(...no) : -1, firstOn: yes.length ? Math.min(...yes) : -1, early: yes.filter((t) => t < ${want - 70}).length, late: no.filter((t) => t > ${want + 120}).length, before: out.filter((x) => x[0] < 300).every((x) => !x[1]) && out.some((x) => x[0] < 300) };`);
    check(`虛擬時鐘：框「${F_B.board[F_K].on}」在 say 的第 ${charOf(F_B.board[F_K].on, F_B.say)} 個字（≈ ${want}ms）才開始，不是平均分掉（錨點前 70ms 沒開始、後 120ms 開始了；自己走的時候也是錨點前沒有、錨點後有）`,
      vt.pre[0] === "virtual" && !vt.preOn && vt.postOn && vt.modes.join() === "virtual" && vt.before && vt.firstOn > 0 && !vt.early && !vt.late && vt.lastOff < vt.firstOn, JSON.stringify({ ...vt, want }));
    await tap(".cvb");
    // 點了之後等黑板真的換到下一句、而且畫過一格（state 的 g 是最近一格算的；只等 at === 1 可能還讀到上一句的游標）
    const first1 = await evaluate(`return window.__b.model().acts.findIndex((x) => x.b === 1);`);
    await waitFor(`window.__b.st().at === 1 && window.__b.st().g >= ${first1}`, 2000);
    const t1 = await evaluate(`const m = window.__b.model(); const last0 = m.anns.filter((a) => a.b === 0).map((a) => m.anns.indexOf(a)); return { st: window.__b.st(), first1: m.acts.findIndex((x) => x.b === 1), marks: last0.map((a) => window.__b.mark(a)) };`);
    check("點黑板＝下一句：上一句直接畫完（游標跳到下一句的第一個動作），上一句的記號畫完了（下一句開始時淡出）", t1.st.at === 1 && t1.st.g >= t1.first1 && t1.marks.every((m) => m && m.off === 0), JSON.stringify(t1));

    /* ── 假的旁白時鐘：時間 = currentTime ── */
    await evaluate(`return window.__b.settle();`);
    const reo = [await openLesson(CHAIN.id), await go(F_SI, CHAIN.id)];
    check("重開、回到「公式」那一節的第一句", reo[0] && reo[1] && (await evaluate(`return window.__b.st().at;`)) === 0, JSON.stringify({ reo, st: await evaluate(`return { st: window.__b.st(), si: window.__b.si(), dots: document.querySelectorAll("[data-action=\\"course-s-go\\"]").length };`) }));
    const ff = await evaluate(`const L = window.BUZZ_COURSE_V2_LESSONS[${JSON.stringify(CHAIN.id)}]; const b = L.sections[${F_SI}].beats[0]; return { t: b.t, ms: b.board[${F_K}].ms, voice: L.voice };`);
    check("出貨的課帶著錄音的時間：t 與錨點的 ms（narration.json 的逐字時間點）", Array.isArray(ff.t) && typeof ff.ms === "number" && ff.ms > 200 && ff.ms < ff.t[1] - ff.t[0], JSON.stringify(ff));
    const key = `${F_SI}-0`;
    const V = (at, extra = "") => `{ on: true, paused: false, beat: ${JSON.stringify(key)}, at: ${at}, start: ${ff.t[0]}, end: ${ff.t[1]}, rate: 1 ${extra} }`;
    const s1 = await evaluate(`return window.__b.fake(${V(ff.t[0] + ff.ms - 70)});`);
    const s2 = await evaluate(`window.__b.fake(${V(ff.t[0] + ff.ms + 120)}); return window.__b.st();`);
    check("錨點前 70ms：框還沒開始；錨點後 120ms：框開始了", s1.mode === "audio" && (s1.g < g0 || (s1.g === g0 && s1.q === 0)) && s2.g === g0 && s2.q > 0 && s2.q < 1, JSON.stringify({ s1, s2 }));
    // 1× 與 1.5×：同一段錄音時間、不同的牆上時間，框開始的錄音時間一樣
    // 假的錄音照牆上時間 × 速度往前走；每一格設好 currentTime 就叫黑板畫一格（debug.tick），記「錄音時間、開始了沒」。
    // 判斷只看錄音時間：錨點前 60ms 以前都沒開始、後 60ms 以後都開始了，而且兩種速度「最後沒開始」與「最早開始了」夾出同一個點 ——
    // 不管一格隔多久（慢機器一格可能 100ms），都不會因為取樣稀而誤判
    const startAt = async (rate) => evaluate(`const t0 = performance.now(); const from = ${ff.t[0] + ff.ms - 400}; const out = []; let at = from;
      while (at < from + 800) { const a = Math.round(at); window.__fake = { on: true, paused: false, beat: ${JSON.stringify(key)}, at: a, start: ${ff.t[0]}, end: ${ff.t[1]}, rate: ${rate} };
        window.BuzzBoard.debug.tick(); const s = window.__b.st(); out.push([a - ${ff.t[0]}, s.g > ${g0} || (s.g === ${g0} && s.q > 0) ? 1 : 0, s.mode]);
        await new Promise((r) => requestAnimationFrame(r)); at = from + (performance.now() - t0) * ${rate}; }
      const no = out.filter((x) => !x[1]).map((x) => x[0]); const yes = out.filter((x) => x[1]).map((x) => x[0]);
      return { n: out.length, modes: [...new Set(out.map((x) => x[2]))].join(), lastOff: no.length ? Math.max(...no) : -1, firstOn: yes.length ? Math.min(...yes) : -1, early: yes.filter((t) => t < ${ff.ms - 60}).length, late: no.filter((t) => t > ${ff.ms + 60}).length };`);
    const r1 = await startAt(1);
    const r15 = await startAt(1.5);
    const okRate = (r) => r.modes === "audio" && r.n > 3 && r.firstOn > 0 && r.lastOff >= 0 && r.lastOff < r.firstOn && !r.early && !r.late;
    check("1× 與 1.5×：框在錄音的同一個時間點開始（都在錨點 ±60ms 上，兩種速度夾出同一個起點）", okRate(r1) && okRate(r15) && Math.max(r1.lastOff, r15.lastOff) < Math.min(r1.firstOn, r15.firstOn), JSON.stringify({ r1, r15, ms: ff.ms }));
    // 暫停
    await evaluate(`window.__b.fake(${V(ff.t[0] + ff.ms + 150, ", paused: true")}); return 1;`);
    const pz1 = await evaluate(`return { st: window.__b.st(), m: window.__b.mark(${await evaluate(`const m = window.__b.model(); return m.anns.findIndex((a) => a.g === ${g0});`)}) };`);
    await sleep(700);
    const pz2 = await evaluate(`return { st: window.__b.st(), m: window.__b.mark(${await evaluate(`const m = window.__b.model(); return m.anns.findIndex((a) => a.g === ${g0});`)}) };`);
    check("暫停：0.7 秒裡進度、時間與畫面都不動", pz1.st.q === pz2.st.q && pz1.st.tau === pz2.st.tau && pz1.m.off === pz2.m.off && pz1.m.off < 1, JSON.stringify({ pz1, pz2 }));
    // 往回拖、往後拖
    const ai = await evaluate(`const m = window.__b.model(); return m.anns.findIndex((a) => a.g === ${g0});`);
    const back = await evaluate(`window.__b.fake(${V(ff.t[0] + 100)}); return { st: window.__b.st(), m: window.__b.mark(${ai}) };`);
    check("往回拖到這一句開頭：框倒回去（沒畫、看不到）", back.st.g < g0 && (back.m.off === 1 || back.m.op === 0), JSON.stringify(back));
    const fwd = await evaluate(`window.__b.fake(${V(ff.t[1] - 5)}); return { st: window.__b.st(), m: window.__b.mark(${ai}) };`);
    const nActs = F_B.board.length;
    check("往後拖到這一句結尾：全部畫完", fwd.st.g >= nActs && fwd.m.off === 0, JSON.stringify(fwd));
    // 卡住：currentTime 不動、沒暫停 → 最多往前估 100ms
    await evaluate(`window.__b.fake(${V(ff.t[0] + 1000)}); return 1;`);
    await sleep(900);
    const stall = await evaluate(`window.BuzzBoard.debug.tick(); return window.__b.st();`);
    check("網路卡住（currentTime 900ms 不動）：黑板最多往前估 100ms，不會自己跑掉", stall.tau >= 1000 && stall.tau <= 1101, JSON.stringify(stall));
    /* ── 男聲（voice().v === "m"）：時間用男聲自己的 tm、錨點用 mm（男聲的逐字時間點換出來的），不是女聲的 t／ms ──
       男聲上傳之前課裡沒有 tm／mm：測試自己放一組（男聲那一支的起點不同、句子長 3 秒、錨點比女聲晚 900ms）；上傳之後先驗出貨的那一組。 */
    const real = await evaluate(`const L = window.BUZZ_COURSE_V2_LESSONS[${JSON.stringify(CHAIN.id)}]; const b = L.sections[${F_SI}].beats[0]; const a = b.board[${F_K}]; return { vm: L.vm || "", tm: b.tm || null, mm: typeof a.mm === "number" ? a.mm : null };`);
    if (real.vm) check("出貨的課帶著男聲：vm、tm 與錨點的 mm（男聲自己的逐字時間點）", Array.isArray(real.tm) && real.mm > 200 && real.mm < real.tm[1] - real.tm[0], JSON.stringify(real));
    else console.log("  （男聲還沒上傳：課裡沒有 vm／tm／mm，用測試放的那一組驗）");
    const M = { start: ff.t[0] + 60000, len: ff.t[1] - ff.t[0] + 3000, mm: ff.ms + 900 };
    await evaluate(`const L = window.BUZZ_COURSE_V2_LESSONS[${JSON.stringify(CHAIN.id)}]; const b = L.sections[${F_SI}].beats[0]; b.tm = [${M.start}, ${M.start + M.len}]; b.board[${F_K}].mm = ${M.mm}; window.BuzzBoard.debug.rebuild(); return 1;`);
    const VM = (at) => `{ on: true, paused: false, beat: ${JSON.stringify(key)}, at: ${at}, start: ${M.start}, end: ${M.start + M.len}, rate: 1, v: "m" }`;
    const m1 = await evaluate(`return window.__b.fake(${VM(M.start + M.mm - 70)});`);
    const m2 = await evaluate(`window.__b.fake(${VM(M.start + M.mm + 120)}); return window.__b.st();`);
    // 同一個「從這一句開頭算」的時間，女聲的錨點已經過了、男聲的還沒到：用的是男聲的錨點
    const m0 = await evaluate(`return window.__b.fake(${VM(M.start + ff.ms + 120)});`);
    check("男聲：錨點（mm）前 70ms 框還沒開始、後 120ms 開始了；女聲錨點的時間點上還沒開始", m1.mode === "audio" && (m1.g < g0 || (m1.g === g0 && m1.q === 0)) && m2.g === g0 && m2.q > 0 && m2.q < 1 && (m0.g < g0 || (m0.g === g0 && m0.q === 0)), JSON.stringify({ m0, m1, m2 }));
    const mEnd = await evaluate(`window.__b.fake(${VM(M.start + M.len - 5)}); return window.__b.st();`);
    check("男聲：拖到男聲那一句的結尾（比女聲長 3 秒）才全部畫完", mEnd.g >= F_B.board.length, JSON.stringify(mEnd));
    // 換回女聲：同一課、同一組時間表，女聲的錨點照舊
    const f2 = await evaluate(`window.__b.fake(${V(ff.t[0] + ff.ms + 120)}); return window.__b.st();`);
    check("換回女聲（v 不是 m）：照女聲的 t／ms，錨點後 120ms 開始了", f2.mode === "audio" && f2.g === g0 && f2.q > 0 && f2.q < 1, JSON.stringify(f2));
    await evaluate(`return window.__b.unfake();`);

    /* ── 真的 <audio>：1.5× 播，黑板的時間跟 currentTime 走 ── */
    check(`旁白：重開 ${CHAIN.id}`, await openLesson(CHAIN.id));
    check("到「公式」那一節", await go(F_SI, CHAIN.id));
    narr.total = await evaluate(`const L = window.BUZZ_COURSE_V2_LESSONS[${JSON.stringify(CHAIN.id)}]; let at = 0; L.voice = "e2eboard";
      L.sections.forEach((s) => s.beats.forEach((b) => { if (b.why && b.why.say) { b.why.t = [at, at + 4000]; at += 4000; } if (b.say) { b.t = [at, at + 4000]; at += 4000; } else delete b.t; })); return at;`);
    await evaluate(`window.BuzzBoard.debug.rebuild(); const r = window.BUZZ_COURSE_V2_LESSONS; const rec = JSON.parse(localStorage.getItem("buzzcalculus.records.v1")); return 1;`);
    await tap("[data-cv2s-rate]");
    await tap("[data-cv2s-rate]");
    await tap("[data-cv2s-play]");
    const live = await waitFor(`window.BuzzCourseSections.voice().on && window.BuzzCourseSections.voice().beat === ${JSON.stringify(`${F_SI}-0`)} && window.BuzzCourseSections.voice().at > window.BuzzCourseSections.voice().start + 300 && window.__b.st().mode === "audio"`, 6000);
    const drift = await evaluate(`const out = []; for (let i = 0; i < 45; i += 1) { await new Promise((r) => requestAnimationFrame(r)); const v = window.BuzzCourseSections.voice(); const s = window.__b.st(); if (s.mode === "audio" && v.beat === ${JSON.stringify(`${F_SI}-0`)}) out.push([v.at - v.start, s.tau, v.rate]); }
      return { n: out.length, max: Math.max(...out.map((x) => Math.abs(x[0] - x[1]))), rate: out.length ? out[0][2] : 0 };`);
    check("真的 <audio> 1.5×：黑板的時間 = currentTime（45 格裡最多差 < 80ms）", live && drift.n > 30 && drift.rate === 1.5 && drift.max < 80, JSON.stringify(drift));
    await tap("[data-cv2s-play]");
    await sleep(200);
    await tap("[data-cv2s-rate]");
    await sleep(100);

    /* ── 變形：對得上的項滑過去，畫完那一行跟目標式子一樣 ── */
    check(`到「${CHAIN.sections[T_SI].title}」那一節`, await go(T_SI, CHAIN.id));
    await evaluate(`return window.__b.settle();`);
    for (let k = 1; k <= T_BI; k += 1) { await advance(k + 1); }
    const tf = CHAIN.sections[T_SI].beats[T_BI].board.find((a) => a.do === "transform");
    const tfG = await evaluate(`const m = window.__b.model(); return m.acts.findIndex((x) => x.b === ${T_BI} && x.do === "transform");`);
    const mid = await evaluate(`await window.__b.settle(4000); return 1;`) && await evaluate(`window.BuzzBoard.debug.show(${tfG}, 0.4); return { flying: window.__b.flying() };`);
    const endT = await evaluate(`window.BuzzBoard.debug.show(${tfG + 1}, 0); const n = [...window.__b.board().querySelectorAll(".cvb-i")].filter((e) => e.style.visibility === "visible").map((e) => e.dataset.n); return { flying: window.__b.flying(), texts: n.map((x) => window.__b.itemText(x)) };`);
    await evaluate(`window.BuzzBoard.debug.release(); return 1;`);
    const wantT = await evaluate(`return window.__b.texText(${JSON.stringify(tf.line)});`);
    check("變形中：對得上的項是複製在飛（4 從指數搬到前面）", mid.flying >= 1, JSON.stringify(mid));
    check("變形完：飛的複製收掉、板上那一行的字跟目標式子一模一樣", endT.flying === 0 && endT.texts.includes(wantT), JSON.stringify({ endT, wantT }));

    /* ── 證明節：why: true 答了才畫；有 plot 的節才抓 plot ── */
    check(`打開 ${DCT.id}`, await openLesson(DCT.id));
    const first = DCT.sections[0].beats.some((b) => b.board.some((a) => a.do === "plot")) ? 1 : 0;
    // 抓 plot 是排版時才開始的（非同步）：等一下
    await waitFor(`window.__b.model() && window.__b.files(/course_board_plot\\.js/) === ${first}`, 6000);
    check(`有 plot 的課：course_board_plot.js 只在有圖的節才抓（第一節${first ? "有圖：抓一次" : "沒有圖：還沒抓"}）`, (await evaluate(`return window.__b.files(/course_board_plot\\.js/);`)) === first);
    const plotSi = DCT.sections.findIndex((s) => s.beats.some((b) => b.board.some((a) => a.do === "plot")));
    check("到有圖的那一節", await go(plotSi, DCT.id));
    check("有圖的節：course_board_plot.js 抓了一次", await waitFor(`window.__b.files(/course_board_plot\\.js/) === 1 && window.__b.model()`, 6000));
    check(`到證明節（第 ${P_SI + 1} 節）`, await go(P_SI, DCT.id));
    for (let k = 1; k <= P_BI; k += 1) { await evaluate(`return window.__b.settle();`); await advance(k + 1); }
    await evaluate(`return window.__b.settle(6000);`);
    const whyG = await evaluate(`const m = window.__b.model(); return m.acts.findIndex((x) => x.b === ${P_BI} && x.why);`);
    const q0 = await evaluate(`return { st: window.__b.st(), asking: Boolean(document.querySelector('[data-cv2s-act="why"]')) };`);
    check("問「為什麼」的時候：游標停在第一個 why: true 的動作前（答案沒畫）", q0.asking && q0.st.at === P_BI && q0.st.g === whyG && q0.st.q === 0 && !q0.st.running, JSON.stringify(q0));
    // 問題出現在黑板底下：黑板最後一行跟問題都要看得到（放不下時先顧問題、最後一行至少露出下緣）
    // 捲動對位是動畫（而且有 350ms／720ms 之後的第二次對位）：至少等過那兩次，再等捲動停下來（連續 400ms 不動）才量
    await sleep(800);
    await evaluate(`let last = -1; let still = 0; const t0 = performance.now(); while (still < 4 && performance.now() - t0 < 6000 * ${SLOWER}) { await new Promise((r) => setTimeout(r, 100)); const y = Math.round(scrollY); still = y === last ? still + 1 : 0; last = y; } return 1;`);
    const vis = await evaluate(`const top = (document.querySelector(".topbar") || { getBoundingClientRect: () => ({ bottom: 0 }) }).getBoundingClientRect().bottom; const dock = document.querySelector(".cv2s-dock .cv2s-voice"); const bot = dock ? dock.getBoundingClientRect().top : innerHeight;
      const q = document.querySelector('[data-cv2s-act="why"]').getBoundingClientRect(); const l = window.__b.board().querySelector(".cvb-l:last-child").getBoundingClientRect();
      return { top: Math.round(top), bot: Math.round(bot), q: [Math.round(q.top), Math.round(q.bottom)], l: [Math.round(l.top), Math.round(l.bottom)] };`);
    const fits = vis.q[1] - vis.l[0] <= vis.bot - vis.top;
    check(`問「為什麼」時：${fits ? "黑板最後一行與問題都在畫面裡" : "問題整個在畫面裡、黑板最後一行露出下緣"}`, vis.q[0] >= vis.top - 1 && vis.q[1] <= vis.bot + 1 && (fits ? vis.l[0] >= vis.top - 1 : vis.l[1] > vis.top + 4), JSON.stringify(vis));
    await see();
    await waitFor(`window.__b.st().running && window.__b.st().g >= ${whyG}`, 3000);
    const q1 = await evaluate(`return window.__b.st();`);
    await evaluate(`return window.__b.settle();`);
    const q2 = await evaluate(`return window.__b.st();`);
    const nP = DCT.sections[P_SI].beats[P_BI].board.length;
    const pFirst = await evaluate(`return window.__b.model().acts.findIndex((x) => x.b === ${P_BI});`);
    check("答了（直接看）：接著畫答案、畫完", q1.running && q2.g >= pFirst + nP && !q2.running, JSON.stringify({ q1, q2 }));

    /* ── reduced-motion：直接畫好 ── */
    await motion(false);
    check("reduced-motion：到下一節", await go(P_SI - 1, DCT.id));
    await waitFor(`window.__b.st() && window.__b.st().mode === "done" && !window.__b.st().running`, 1500);
    const rm = await evaluate(`return window.__b.st();`);
    await next();
    await waitFor(`window.__b.st().at === 1 && window.__b.st().mode === "done" && !window.__b.st().running`, 1500);
    const rm1 = await evaluate(`return window.__b.st();`);
    check("reduced-motion：第一句與「下一句」都直接畫好（沒有動畫）", rm.mode === "done" && !rm.running && rm1.mode === "done" && !rm1.running && rm1.at === 1, JSON.stringify({ rm, rm1 }));

    /* ── 螢幕閱讀器的字：三課每一節每一句 ── */
    for (const L of PILOTS) {
      check(`打開 ${L.id}`, await openLesson(L.id));
      const srBad = [];
      for (let si = 0; si < L.sections.length; si += 1) {
        await go(si, L.id);
        for (let bi = 1; bi < L.sections[si].beats.length; bi += 1) await advance(bi + 1);
        await see();
        const sr = await evaluate(`return [...document.querySelectorAll("[data-cv2s] .cv2s-beat")].map((li) => ({ text: window.__b.srText(li), hidden: [...li.querySelectorAll(".cv2s-show")].every((p) => p.classList.contains("cvb-sr") && window.__b.srHidden(p)) }));`);
        L.sections[si].beats.forEach((b, bi) => {
          const got = (sr[bi] || { text: [] }).text.map((s) => s.replace(/\s+/g, ""));
          const want2 = b.show.map((s) => s.replace(/\\\$/g, "$").replace(/\s+/g, ""));
          if (!sr[bi] || !sr[bi].hidden || got.join("|") !== want2.join("|")) srBad.push(`${si}-${bi}: ${got.join("|")} ≠ ${want2.join("|")}`);
        });
      }
      check(`${L.id}：螢幕閱讀器拿到的字 = show（藏起來、不在 aria-hidden 裡）`, !srBad.length, srBad.slice(0, 2).join("；"));
    }
    await motion(true);

    /* ── 全形逗號：正體字型把「，」擺在字格正中，夾在兩段式子之間看起來像乘號「·」；板上要換成貼基線的逗號 ── */
    const CM = (() => { for (const L of fs.readdirSync(LESSON_DIR).filter((f) => f.endsWith(".json")).sort().map((f) => lessonOf(f.replace(/\.json$/, "")))) for (let si = 0; si < (L.sections || []).length; si += 1) if (L.sections[si].beats.some((b) => (b.board || []).some((a) => /\$，\$/.test(a.line || "")))) return { L, si }; return null; })();
    check(`找得到式子之間夾「，」的黑板（${CM ? `${CM.L.id} 第 ${CM.si + 1} 節` : "沒有"}）`, Boolean(CM) && await openLesson(CM.L.id) && await go(CM.si, CM.L.id) && await waitFor(`window.__b.board() && window.__b.board().querySelector(".cvb-cm")`, 6000));
    const cm = await evaluate(`const b = window.__b.board(); const cx = document.createElement("canvas").getContext("2d"); const g = (n, t) => { const cs = getComputedStyle(n); cx.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily; const m = cx.measureText(t); return { up: m.actualBoundingBoxAscent / parseFloat(cs.fontSize), down: m.actualBoundingBoxDescent / parseFloat(cs.fontSize) }; }; const n = b.querySelector(".cvb-cm"); return { raw: [...b.querySelectorAll(".cvb-x")].filter((x) => x.textContent.includes("，")).length, text: n.textContent, ink: g(n, n.textContent), full: g(n, "，") };`);
    check("黑板上的「，」畫成貼基線的逗號（墨水從基線往下掛、頂不超過 0.3 字高），不是字格正中的小點", cm.raw === 0 && cm.text === "," && cm.ink.down > 0 && cm.ink.up < 0.3, JSON.stringify(cm));

    /* ── 版面：三課每一節每一步，360 淺／深（四種寬度全跑在 lint_board_layout.js） ── */
    const lint = await lintLessons(chrome, server.url, PILOTS, { viewports: VIEWPORTS.filter((v) => v.name === "360") });
    check(`版面 lint（360 × 淺／深，${lint.states} 個狀態）：不疊、不出板、字 ≥ 16px、對比夠、板不太高`, !lint.problems.length && lint.states > 300, lint.problems.slice(0, 3).join("；"));
    // 有魔王題的章（6E）裡有黑板的課：魔王卡的樣式先注入時，黑板的樣式不能因此被跳過（以前兩邊用同一個 style id，黑板整個沒樣式）
    const BOSS_BOARD = lessonOf("power-series-calculus");
    const bossLint = await lintLessons(chrome, server.url, [BOSS_BOARD], { viewports: VIEWPORTS.filter((v) => v.name === "390") });
    check(`魔王章裡的黑板照樣有樣式（${BOSS_BOARD.id}，${bossLint.states} 個狀態）`, !bossLint.problems.length && bossLint.states > 0, bossLint.problems.slice(0, 3).join("；"));
    check("魔王卡與黑板的樣式節點不同 id", (await evaluate(`return Boolean(document.getElementById("cvb-style")) && Boolean(document.getElementById("cvboss-style"));`)), "兩個 style 節點應該同時存在");
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);
    // lint 自己要抓得到：把一個標籤搬到字上、把一行搬出板外
    await openLesson(CHAIN.id);
    await go(F_SI, CHAIN.id);
    await evaluate(`(${pageHelpers.toString()})(16, 13, 0.75); return 1;`);
    const neg = await evaluate(`await document.fonts.ready; const m = window.__b.model(); window.BuzzBoard.debug.show(m.acts.filter((x) => x.b === 0).length, 0, 0, 1);
      const c = window.__b.board(); const lab = c.querySelector(".cvb-lab[data-a]"); const leaf = c.querySelector(".cvb-i .katex-html .mord"); const lr = leaf.getBoundingClientRect(); const cr = c.getBoundingClientRect();
      lab.style.left = (lr.left - cr.left) + "px"; lab.style.top = (lr.top - cr.top) + "px"; lab.style.transform = "none";
      const a = window.__bl.measure("負向").problems;
      const it = c.querySelector(".cvb-i"); it.style.transform = "translate(" + (cr.width - 20) + "px,10px)";
      const b = window.__bl.measure("負向").problems; window.BuzzBoard.debug.release(); window.BuzzBoard.debug.rebuild(); return { a, b };`);
    check("lint 抓得到：標籤搬到字上 → 「壓到」；一行搬出板外 → 「跑出黑板」", neg.a.some((p) => /壓到/.test(p)) && neg.b.some((p) => /跑出黑板/.test(p)), JSON.stringify({ a: neg.a.slice(0, 2), b: neg.b.slice(0, 2) }));

    /* ── 錯的式子不能沒標記地留著：劃掉的記號跟著那一行活過下一句；lint 抓得到記號不見 ── */
    const W_SI = CHAIN.sections.findIndex((s) => s.beats.length > 1 && (s.beats[0].board || []).some((a) => a.do === "strike"));
    check(`到第一個有「劃掉」的節（第 ${W_SI + 1} 節）`, W_SI >= 0 && await go(W_SI, CHAIN.id));
    await evaluate(`return window.__b.settle();`);
    await advance(2);
    await evaluate(`return window.__b.settle();`);
    const ws = await evaluate(`const m = window.__b.model(); const a = m.anns.findIndex((x) => x.wrong && x.b === 0); return { a, st: window.__b.st(), mark: window.__b.mark(a) };`);
    check("劃掉（錯）的記號到下一句還在（別的記號下一句就收）：那一行沒有變成沒標記的錯式子", ws.a >= 0 && ws.st.at === 1 && ws.mark && ws.mark.off === 0 && ws.mark.op === 1, JSON.stringify(ws));
    await evaluate(`(${pageHelpers.toString()})(16, 13, 0.75); return 1;`);
    const wneg = await evaluate(`const m = window.__b.model(); const a = m.anns.findIndex((x) => x.wrong && x.b === 0); const n = m.acts.length; window.BuzzBoard.debug.show(n, 0, 1, 1);
      const ok = window.__bl.measure("錯", n).problems; window.__b.board().querySelector('.cvb-ink g[data-a="' + a + '"]').style.opacity = "0";
      const bad = window.__bl.measure("錯", n).problems; window.BuzzBoard.debug.release(); return { ok, bad };`);
    check("lint：錯的記號在 → 沒問題；把它藏起來 → 「記號卻不見了」", !wneg.ok.length && wneg.bad.some((p) => /記號卻不見了/.test(p)), JSON.stringify(wneg));

    /* ── 幀時間：動畫中每格的工作 ── */
    await evaluate(`if (!window.__rafWrapped) { const orig = window.requestAnimationFrame.bind(window); window.__work = []; window.requestAnimationFrame = (cb) => orig((ts) => { const t0 = performance.now(); cb(ts); window.__work.push(performance.now() - t0); }); window.__rafWrapped = true; } return 1;`);
    check(`到「${CHAIN.sections[T_SI].title}」那一節（量幀時間）`, await go(T_SI, CHAIN.id));
    await evaluate(`window.__work = []; return 1;`);
    for (let k = 1; k < CHAIN.sections[T_SI].beats.length; k += 1) { await sleep(700); await next(); await waitFor(`window.__b.st().at === ${k}`, 1500); }
    await evaluate(`return window.__b.settle();`);
    const work = await evaluate(`const a = window.__work.slice().sort((x, y) => x - y); return { n: a.length, p95: a[Math.floor(a.length * 0.95)] || 0, max: a[a.length - 1] || 0 };`);
    console.log(`  ·    幀時間（DPR 3，「外層是次方」整節：寫、變形、飛、圈、框）：rAF callback ${work.n} 格，p95 ${work.p95.toFixed(2)}ms、最久 ${work.max.toFixed(1)}ms`);
    // 沒降速時照舊 4ms；BUZZ_E2E_CPU_THROTTLE=k 時 Chrome 本來就慢 k 倍，上限跟著乘 k（量的是「每格做多少事」，不是機器多快）
    const P95 = 4 * THROTTLE;
    check(`黑板每格的工作 p95 < ${P95}ms${THROTTLE > 1 ? `（CPU 降速 ${THROTTLE}×：4ms × ${THROTTLE}）` : ""}（版面只在換節時排，動畫中只改 transform／opacity／mask／dashoffset）`, work.n > 40 && work.p95 < P95, `${work.p95.toFixed(2)}ms`);

    /* ── 流量：黑板的檔多大、只有有黑板的課付 ── */
    const bytes = await evaluate(`return { board: window.__b.bytes(/course_board(_layout)?\\.js/), plot: window.__b.bytes(/course_board_plot\\.js/) };`);
    const size = (f) => fs.statSync(path.join(ROOT, f)).size;
    console.log(`  ·    流量：黑板 ${size("src/course_board.js") + size("src/course_board_layout.js")} 位元組（原始）、圖 ${size("src/course_board_plot.js")} 位元組；這次抓到的（未壓縮的測試伺服器）${JSON.stringify(bytes)}`);
    check("流量：有黑板的課才付黑板的檔（上面「沒有黑板的課不抓」）；黑板＋圖 < 72KB 原始（2026-10-18 不擦的板＋粉筆尖＋板裡捲動）", size("src/course_board.js") + size("src/course_board_layout.js") + size("src/course_board_plot.js") < 72 * 1024);

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
