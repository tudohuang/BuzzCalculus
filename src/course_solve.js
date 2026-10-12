// ── 課程的「自己算」：分節結尾的 solve 動作（不給選項，自己打答案）＋隔天的課程回溫 ──
// data-lazy="secsolve"：有自己算的課、或打開回溫才抓；中文介面專用。規格見 tools/content/course_v2/SCHEMA.md「自己算」。
//
// 判分不另寫一套：用 app.js 的 checkAnswer（跟作答頁同一支判分器：數值等價、式子多點代入、反導函數差常數，
// 答錯時它自己會說「像是漏負號」「像是漏掉鏈鎖律係數」），經 deps 交過來。鍵盤的鍵也是作答頁那一份（webworkKeys），
// 預覽用 answerToTex。題目是題庫題（problemId）時用那一題本身判分，第一次作答照一般作答記進 problemStats／錯題本
// （updateAnswerRecords，同一支）。
//
// 紀錄：records.courseV2[課].solve[節] = "first"（第一次就對）／"later"（錯過才對）／"shown"（看了解法）／"tried"（錯了、還沒對）。
// 回溫排程在 course.js（window.BuzzCourseReview）；這裡畫一輪回溫、算完重排。
(function () {
  "use strict";

  const XP = 5;
  const STYLE = `
.cs-solve .course-check-ask { margin-bottom: 8px; }
.cs-prompt { margin: 0 0 10px; overflow-x: auto; }
.cs-row { display: flex; gap: 8px; align-items: stretch; }
.cs-row .answer-input { flex: 1 1 auto; min-width: 0; min-height: 48px; font-size: 1.05rem; }
.cs-row .button { flex: none; min-height: 48px; }
.cs-row .icon-button { flex: none; width: 48px; min-height: 48px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--paper); color: var(--ink); }
.cs-row .icon-button[aria-pressed="true"] { border-color: var(--gold); }
.cs-preview { min-height: 30px; margin: 6px 2px 0; color: var(--muted); font-size: 0.95rem; overflow-x: auto; overflow-y: hidden; }
.cs-preview .katex { color: var(--ink); font-size: 1.08em; }
.cs-solve .keypad { margin: 8px 0 0; }
.cs-solve .keypad[hidden] { display: none; }
.cs-solve .keypad button { min-height: 44px; font: inherit; font-weight: 650; }
.cs-preview:empty { min-height: 0; margin: 0; }
.cs-hint { margin: 8px 0 0; color: var(--ink); line-height: 1.7; }
.cs-msg { margin: 10px 0 0; }
.cs-steps { display: grid; gap: 6px; margin: 12px 0 0; padding: 10px 14px 10px 32px; border-radius: 10px; background: color-mix(in srgb, var(--blue) 7%, var(--paper)); line-height: 1.7; }
.cs-steps li { overflow-wrap: anywhere; }
.cs-answer { margin: 8px 0 0; font-weight: 700; }
.cs-links { display: flex; flex-wrap: wrap; gap: 4px 14px; margin: 8px 0 0; }
.cs-links .cv2-link { min-height: 40px; }
.cs-review .cv2-head { margin-bottom: 10px; }
.cs-reason { margin: 2px 0 14px; color: var(--muted); line-height: 1.7; }
.cs-pos { display: flex; flex-wrap: wrap; gap: 4px 12px; margin: 0 0 6px; color: var(--muted); font-size: 0.86rem; font-weight: 700; font-variant-numeric: tabular-nums; }
[data-cs-done] .cv2s-stats { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 16px; margin: 0 0 14px; color: var(--muted); font-size: 0.9rem; font-variant-numeric: tabular-nums; }
[data-cs-done] .cv2s-stats strong { color: var(--ink); font-size: 1.5rem; }
[data-cs-done] .action-row { display: flex; flex-wrap: wrap; gap: 8px; }
.cs-next { display: grid; gap: 6px; margin: 0 0 18px; padding: 0; list-style: none; line-height: 1.7; }
.cs-next li { overflow-wrap: anywhere; }
`;
  function injectStyle() {
    if (typeof document === "undefined" || !document.head || document.getElementById("cs-style")) return;
    const node = document.createElement("style");
    node.id = "cs-style";
    node.textContent = STYLE;
    document.head.appendChild(node);
  }

  const touch = () => Boolean(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  let sysKbd = false; // 觸控裝置：預設用畫面上的數學鍵盤（不叫系統鍵盤）；點鍵盤鈕切換，這一頁記著
  let padOpen = false; // 桌機：符號鍵預設收起（有實體鍵盤）
  let bank = null;
  const problemOf = (id) => { if (!bank) bank = new Map((window.BUZZ_PROBLEMS || []).map((p) => [p.id, p])); return (id && bank.get(id)) || null; };
  const TOPIC = { antiderivative: "integrals" };

  /* ── 一題：分節的 solve（可能代一題小測）或回溫裡的核心推薦題 ── */
  function fromSolve(data, v) {
    const p = problemOf(v.problemId);
    const ck = Number.isInteger(v.check) ? data.checks[v.check] : null;
    return { ask: v.ask || (ck ? ck.ask : ""), prompt: "", kind: p ? p.answerKind : v.kind, answer: v.answer || (p ? p.answer : ""), variable: v.variable, p, hint: v.hint || "", steps: v.steps || [], wrong: v.wrong || [], check: ck ? v.check : -1 };
  }
  function itemOf(data, key) {
    if (/^s\d+$/.test(key)) {
      const s = data && data.sections && data.sections[Number(key.slice(1))];
      return s && s.solve ? fromSolve(data, s.solve) : null;
    }
    const p = problemOf(key);
    return p ? { ask: "", prompt: p.prompt, kind: p.answerKind, answer: p.answer, p, hint: "", steps: [], wrong: [], check: -1 } : null;
  }
  // 交給判分器的題目：題庫題用那一題本身（定義域、變數都在題目裡）
  const probOf = (item) => item.p || { id: "", answerKind: item.kind, answer: item.answer, variable: item.variable || "x", prompt: "", topic: TOPIC[item.kind] || "" };

  // 判分：先問判分器；錯了先看是不是作者預料到的錯（wrong[]：那個錯的寫法 → 為什麼），再用判分器自己的診斷
  // 判分器讀不動、但意思沒有歧義的寫法（「8pi/3」「2e」「x e^x」「π」）：同一個式子換幾種寫法再問一次，
  // 只補乘號、拿掉空白、π → pi，不改值；任何一種被判對就算對（2026-10 實測判分器讀不動這幾種，已回報）
  const forms = (raw) => {
    const a = String(raw).replace(/π/g, "pi");
    const b = a.replace(/\s+/g, "");
    return [...new Set([raw, a, b, b.replace(/(\d)(pi|e)(?![a-z(])/g, "$1*$2")])];
  };
  const unread = (m) => /讀不懂|無法解析|格式/.test(String(m || ""));
  function grade(deps, item, input) {
    const P = probOf(item);
    const ask = (p, v) => { try { return deps.checkAnswer(p, v) || {}; } catch (_e) { return { correct: false, message: "讀不懂這個寫法。" }; } };
    const tries = forms(input).map((v) => ({ v, r: ask(P, v) }));
    if (tries.some((x) => x.r.correct)) return { ok: true };
    const r = (tries.find((x) => !unread(x.r.message)) || tries[0]).r;
    const hit = item.wrong.find((w) => tries.some((x) => ask({ ...P, answer: w.answer }, x.v).correct));
    return { ok: false, msg: hit ? hit.why : String(r.message || "不對。") };
  }

  /* ── 畫面：題目、輸入框＋送出、預覽、回饋、提示、解法、數學鍵盤 ── */
  // 預覽：作答頁同一支 answerToTex；它排不出來（「2(x^3+1)」這種省略乘號、「8pi」）就換一種寫法再排，還是不行就照打的字印
  const texHtml = (deps, value, P) => {
    if (!deps.answerToTex || !String(value).trim()) return "";
    const tex = [String(value).replace(/\s+/g, "").replace(/([0-9)])\(/g, "$1*("), value, ...forms(value)].map((v) => deps.answerToTex(v, P)).find((x) => x && !/\\text/.test(x));
    if (!tex || !window.katex) return deps.escapeHtml(value);
    try { return window.katex.renderToString(tex, { throwOnError: false, strict: "ignore" }); } catch (_e) { return deps.escapeHtml(value); }
  };
  function widget(o) {
    const { deps, item, st, key, verb, rich, ctx } = o;
    const { escapeAttr, escapeHtml, icon } = deps;
    const P = probOf(item);
    const done = st.ok;
    const coarse = touch();
    const keys = deps.webworkKeys ? deps.webworkKeys(P) : { digits: [], rest: [] };
    const btn = (k) => `<button type="button" data-cs-key="${escapeAttr(k.insert)}" aria-label="${escapeAttr(k.label)}">${escapeHtml(k.label)}</button>`;
    // 觸控：畫面上的數學鍵盤就是輸入法，一直攤著；桌機有實體鍵盤，符號鍵收起來
    const pad = done ? "" : `
        <div class="keypad webwork-keypad" data-cs-pad ${coarse || padOpen ? "" : "hidden"} aria-label="數學鍵盤">
          ${keys.digits.length ? `<div class="keypad-digits">${keys.digits.map(btn).join("")}</div>` : ""}
          <div class="keypad-rest">${keys.rest.map(btn).join("")}<button type="button" class="keypad-backspace" data-cs-key="⌫" aria-label="退格">⌫</button></div>
        </div>`;
    const wrongNow = !done && st.flash;
    const reveal = st.shown || st.tries >= 2;
    const links = [!reveal && !done ? `<button type="button" class="cv2-link" data-action="${verb}-reveal">看解法</button>` : "", !done && !coarse ? `<button type="button" class="cv2-link" data-cs-toggle aria-expanded="${padOpen}">符號鍵</button>` : ""].join("");
    return `
      <div class="cv2s-act course-check cs-solve ${done ? "is-right" : st.tries ? "is-wrong" : ""}" data-cv2s-act="solve" data-cs="${escapeAttr(key)}">
        <p class="course-check-ask">${icon("pen")}<span>${item.ask ? rich(item.ask, ctx) : "自己算："}</span></p>
        ${item.prompt ? `<div class="math-block cs-prompt" data-tex="${escapeAttr(item.prompt)}"></div>` : ""}
        <div class="cs-row">
          <label class="sr-only" for="cs-in-${escapeAttr(key)}">答案</label>
          <input id="cs-in-${escapeAttr(key)}" class="answer-input cs-input ${done ? "is-correct" : wrongNow ? "is-wrong" : ""}" data-cs-input autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" inputmode="${coarse && !sysKbd ? "none" : "text"}" value="${escapeAttr(st.draft || "")}" placeholder="${escapeAttr(placeholder(item.kind))}" ${done ? "disabled" : ""} />
          ${coarse && !done ? `<button type="button" class="icon-button" data-cs-kbd aria-pressed="${sysKbd}" aria-label="${sysKbd ? "改用數學鍵盤" : "叫出系統鍵盤"}" title="${sysKbd ? "改用數學鍵盤" : "叫出系統鍵盤"}">${icon("keyboard")}</button>` : ""}
          ${done ? "" : `<button type="button" class="button" data-action="${verb}-solve" data-cs-send>${icon("send")}送出</button>`}
        </div>
        <div class="cs-preview" data-cs-preview aria-live="polite">${st.draft && !done ? texHtml(deps, st.draft, P) : ""}</div>
        ${done ? `<p class="course-check-why is-right">${icon("check")}${st.tries || st.shown ? "對了" : "對了，一次就對"}</p>` : ""}
        ${!done && st.msg ? `<p class="course-check-why cs-msg" data-cs-msg>${rich(st.msg, ctx)}</p>` : ""}
        ${!done && st.tries && item.hint ? `<p class="cs-hint" data-cs-hint>提示：${rich(item.hint, ctx)}</p>` : ""}
        ${reveal ? `${item.steps.length ? `<ol class="cs-steps" data-cs-steps>${item.steps.map((s) => `<li>${rich(s, ctx)}</li>`).join("")}</ol>` : ""}<p class="cs-answer" data-cs-answer>答案：${texHtml(deps, item.answer, P)}</p>` : ""}
        ${links ? `<p class="cs-links">${links}</p>` : ""}
        ${pad}
      </div>`;
  }
  function placeholder(kind) {
    return kind === "antiderivative" ? "例：x^3/3（不用 +C）" : kind === "expression" ? "例：3x^2-2" : "例：1/6、sqrt(2)";
  }

  // 按「送出」（或輸入框裡按 Enter）：判分、記狀態；回傳 { ok, first, fresh }
  function submit(deps, item, st) {
    const input = document.querySelector(`[data-cs="${cssKey(st.key)}"] [data-cs-input]`);
    const value = String(input ? input.value : st.draft || "").trim();
    st.draft = value;
    st.flash = false;
    if (!value) { st.msg = "先打答案再送出。"; return null; }
    const g = grade(deps, item, value);
    const first = !st.tries && !st.shown && !st.ok;
    if (g.ok) { st.ok = true; st.msg = ""; } else { st.tries += 1; st.msg = g.msg; st.flash = true; if (st.tries >= 2) st.shown = true; }
    return { ok: g.ok, first, value };
  }
  const cssKey = (key) => String(key).replace(/["\\]/g, "");
  const freshState = (key) => ({ key, draft: "", tries: 0, ok: false, shown: false, msg: "", flash: false, first: undefined });
  // 題庫題的第一次作答：照一般作答記（problemStats、topicStats、錯題本），同一支 updateAnswerRecords
  function recordBank(deps, item, ok, value) {
    if (!item.p || !deps.updateAnswerRecords) return;
    const records = deps.loadRecords();
    try { deps.updateAnswerRecords(records, { problem: item.p, correct: ok, input: value, reason: ok ? "" : "Wrong" }, new Date().toISOString(), {}); } catch (_e) { return; }
    deps.saveRecords(records);
  }

  /* ── 分節：course_sections.js 把畫面與 course-s-solve／course-s-reveal 轉過來 ── */
  const visitOf = (api) => (api.state.cs = api.state.cs || {});
  function secState(api, si) {
    const v = visitOf(api);
    return (v[si] = v[si] || freshState(`${api.m.id}:${si}`));
  }
  const statusOf = (api, si) => (((api.records.courseV2 || {})[api.m.id] || {}).solve || {})[si];
  function view(api, si) {
    injectStyle();
    const item = fromSolve(api.data, api.data.sections[si].solve);
    return widget({ deps: api.deps, item, st: secState(api, si), key: `${api.m.id}:${si}`, verb: "course-s", rich: api.rich, ctx: api.data });
  }
  function resolved(api, si) {
    const st = secState(api, si);
    return st.ok || st.shown || ["first", "later", "shown"].includes(statusOf(api, si));
  }
  // 記這一節的狀態（第一次記的那一刻送分析）；first／later／shown 定了就不改，tried 可以升級
  function mark(api, si, status) {
    const records = api.deps.loadRecords();
    const e = ((records.courseV2 || {})[api.m.id]) || {};
    const cur = (e.solve || {})[si];
    if (!cur || cur === "tried") api.update(api.m.id, (x) => ({ ...x, solve: { ...(x.solve || {}), [si]: status } }));
    if (!cur && api.deps.track) api.deps.track("course_solve", { lesson: api.m.id, first_try: status === "first", review: false });
    api.records = api.deps.loadRecords();
    return !cur;
  }
  // 代一題小測的自己算（solve.check）：小測照全文的 course-pick 記分 —— 第一次就打對＝第一次就選對；
  // 第一次打錯記成 -1（不對應任何選項，只在這一次打開的記憶體裡，打對或看解法時才連同正解一起存）
  function quizPick(api, item, right) {
    const ci = item.check;
    if (ci < 0) return;
    const ck = api.data.checks[ci];
    const picks = api.state.picks[ci] || [];
    if (picks.some((x) => (ck.options[x] || {}).correct)) return;
    if (!right) { if (!picks.length) api.state.picks = { ...api.state.picks, [ci]: [-1] }; return; }
    const oi = ck.options.findIndex((o) => o.correct);
    api.update(api.m.id, (e) => ({ ...e, picks: { ...(e.picks || {}), [ci]: (api.state.picks[ci] || []).concat(oi) } }));
    api.act("course-pick", { check: ci, option: oi });
  }
  // 回傳：0 = 沒事、1 = 重繪、2 = 這一節做完（course_sections 發 XP）
  function act(api, action) {
    const si = api.state.sec.si;
    const s = api.data.sections[si];
    if (!s || !s.solve) return 0;
    const item = fromSolve(api.data, s.solve);
    const st = secState(api, si);
    if (action === "course-s-reveal") {
      if (st.ok) return 0;
      st.shown = true;
      mark(api, si, "shown");
      quizPick(api, item, false);
      quizPick(api, item, true);
      return 1;
    }
    if (action !== "course-s-solve" || st.ok) return 0;
    const before = statusOf(api, si);
    const r = submit(api.deps, item, st);
    if (!r) return 1;
    if (!before && r.first) recordBank(api.deps, item, r.ok, r.value);
    if (r.ok) {
      mark(api, si, st.shown ? "shown" : st.tries ? "later" : "first");
      quizPick(api, item, true);
      return 2;
    }
    mark(api, si, st.shown ? "shown" : "tried");
    quizPick(api, item, false);
    if (st.shown) quizPick(api, item, true);
    return 1;
  }
  // 結算畫面那一行：「自己算：首次答對 n / m」（這一課的自己算第一次就對的有幾題）
  function stat(data, e) {
    const keys = (data.sections || []).map((s, si) => (s.solve ? si : -1)).filter((si) => si >= 0);
    if (!keys.length) return null;
    return { first: keys.filter((si) => ((e && e.solve) || {})[si] === "first").length, total: keys.length };
  }

  /* ── 課程回溫：一輪最多 5 題（course.js 的 due() 決定是哪幾課哪幾題），一題一屏 ── */
  let R = null;
  function session(k) {
    if (R && R.state === k.state) return R;
    const kit = window.BuzzCourseReview;
    const d = kit && kit.due(k.records);
    R = { state: k.state, none: !d };
    if (!d) return R;
    // 從地圖點某一課進來：那一課排第一
    const lessons = d.lessons.slice().sort((a, b) => (b.id === k.state.rv) - (a.id === k.state.rv));
    R.reason = d.reason;
    R.lessons = lessons;
    R.items = lessons.flatMap((L) => L.items.map((key) => ({ lesson: L.id, key, st: freshState(`rv:${L.id}:${key}`) })));
    R.i = 0;
    return R;
  }
  function page(k) {
    injectStyle();
    const { deps } = k;
    const { escapeHtml, icon } = deps;
    const S = session(k);
    const head = `
      <header class="page-head cv2-head is-compact">
        <div class="cv2-titlerow">
          <button type="button" class="cv2-back" data-action="open-course" aria-label="回課程表" title="課程表"><span aria-hidden="true">‹</span></button>
          <h2>課程回溫</h2>
        </div>
      </header>`;
    const wrap = (body) => `<main class="screen"><section class="course-lesson cv2-lesson cs-review" data-cs-review>${head}${body}</section></main>`;
    if (S.none) {
      return wrap(`<p class="cs-reason">今天沒有要回溫的課。</p><div class="action-row"><button type="button" class="button home-primary" data-action="open-course">課程表</button></div>`);
    }
    if (S.i >= S.items.length) return wrap(endView(k, S));
    const it = S.items[S.i];
    const m = k.meta[it.lesson];
    const data = k.lessonData(it.lesson);
    if (/^s/.test(it.key) && !data && m) {
      k.loadChapter(m.chapter);
      return wrap(`<p class="cs-reason">${escapeHtml(S.reason)}</p><p class="panel-note" aria-busy="true">載入〈${escapeHtml(m.title)}〉…</p><div class="cv2s-bar"><button type="button" class="button ghost" data-action="course-rv-next">跳過這一題</button></div>`);
    }
    const item = itemOf(data, it.key);
    if (!item) { it.st.first = false; S.i += 1; if (S.i >= S.items.length) settle(k, S); return page(k); }
    const st = it.st;
    const last = S.i === S.items.length - 1;
    const over = st.ok || st.shown;
    return wrap(`
      <p class="cs-reason">${escapeHtml(S.reason)}</p>
      <article class="cv2s-sec">
        <p class="cs-pos" data-cs-pos><span>${S.i + 1} / ${S.items.length}</span><span>〈${escapeHtml(m ? m.title : it.lesson)}〉</span></p>
        ${widget({ deps, item, st, key: `rv:${it.lesson}:${it.key}`, verb: "course-rv", rich: k.rich, ctx: data })}
        <div class="cv2s-bar"><button type="button" class="button ${over ? "home-primary" : "ghost"}" data-action="course-rv-next" data-cv2s-next>${over ? (last ? "看結果" : "下一題") : "跳過"}${icon("chevron-right")}</button></div>
      </article>`);
  }
  function endView(k, S) {
    const { escapeHtml } = k.deps;
    const quiet = k.deps.focusModeOn ? k.deps.focusModeOn() : false;
    const firstN = S.items.filter((it) => it.st.first === true).length;
    const gaps = (window.BuzzCourseReview && window.BuzzCourseReview.gaps) || [];
    return `
      <article class="cv2s-sec cv2s-finish" data-cs-done>
        <h3>回溫完成</h3>
        <p class="cv2s-stats" data-cs-stat><span>首次答對 <strong>${firstN}</strong> / ${S.items.length}</span>${!quiet && S.xp ? `<span><strong>+${S.xp}</strong> XP</span>` : ""}</p>
        <ul class="cs-next">${S.lessons.map((L) => `<li>〈${escapeHtml(L.t)}〉${L.next >= 0 && gaps[L.next] ? `下次 ${gaps[L.next]} 天後` : L.next >= 0 ? "這一課回溫完了" : "明天再算一次"}</li>`).join("")}</ul>
        <div class="action-row"><button type="button" class="button home-primary" data-action="home">回首頁</button><button type="button" class="button secondary" data-action="open-course">課程表</button></div>
      </article>`;
  }
  // 一輪做完：每一課全部第一次就對 → 往後推一格；有一題不是 → 明天再一次。答對的題 +5 XP
  function settle(k, S) {
    if (S.saved) return;
    S.saved = true;
    const { deps } = k;
    const records = deps.loadRecords();
    records.courseV2 = records.courseV2 || {};
    const kit = window.BuzzCourseReview;
    let xp = 0;
    S.lessons.forEach((L) => {
      const mine = S.items.filter((it) => it.lesson === L.id);
      const all = mine.every((it) => it.st.first === true);
      records.courseV2[L.id] = kit.next(records.courseV2[L.id] || {}, all, mine.length);
      L.next = all ? records.courseV2[L.id].rvStep : -1;
      xp += XP * mine.filter((it) => it.st.ok).length;
    });
    records.xp = (Number(records.xp) || 0) + xp;
    S.xp = xp;
    deps.saveRecords(records);
  }
  function rv(k, action) {
    const S = session(k);
    if (S.none) return k.render();
    const it = S.items[S.i];
    if (!it) return k.render();
    const { deps } = k;
    const item = itemOf(k.lessonData(it.lesson), it.key);
    const st = it.st;
    const once = (first) => { if (st.first === undefined) { st.first = first; if (deps.track) deps.track("course_solve", { lesson: it.lesson, first_try: first, review: true }); } };
    if (action === "course-rv-next") {
      once(Boolean(st.ok && !st.tries && !st.shown));
      S.i += 1;
      if (S.i >= S.items.length) settle(k, S);
      k.render();
      return window.scrollTo(0, 0);
    }
    if (!item || st.ok) return k.render();
    if (action === "course-rv-reveal") { st.shown = true; once(false); return k.render(); }
    if (action === "course-rv-solve") {
      const r = submit(deps, item, st);
      if (r && r.first) { recordBank(deps, item, r.ok, r.value); once(r.ok); }
      return k.render();
    }
    return 0;
  }

  /* ── 輸入：數學鍵盤插字（游標停在括號裡）、即時預覽、Enter 送出；不整頁重繪，焦點留在輸入框 ── */
  let lastDeps = null;
  function itemForBox(box) {
    // 預覽要知道題型（反導函數／式子／數值）：從畫面上的 key 找回那一題
    const key = box.dataset.cs;
    const sec = /^([^:]+):(\d+)$/.exec(key);
    if (sec && !/^rv$/.test(sec[1])) { const data = (window.BUZZ_COURSE_V2_LESSONS || {})[sec[1]]; return data ? itemOf(data, `s${sec[2]}`) : null; }
    const rvKey = /^rv:([^:]+):(.+)$/.exec(key);
    return rvKey ? itemOf((window.BUZZ_COURSE_V2_LESSONS || {})[rvKey[1]], rvKey[2]) : null;
  }
  function preview(box, value) {
    const out = box.querySelector("[data-cs-preview]");
    const item = itemForBox(box);
    if (!out || !lastDeps) return;
    out.innerHTML = value.trim() && item ? texHtml(lastDeps, value, probOf(item)) : "";
    const st = R && R.items ? (R.items.find((x) => x.st.key === box.dataset.cs) || {}).st : null;
    if (st) st.draft = value;
  }
  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("click", (event) => {
      const t = event.target;
      const box = t && t.closest && t.closest("[data-cs]");
      if (!box) return;
      const input = box.querySelector("[data-cs-input]");
      const key = t.closest("[data-cs-key]");
      if (key && input && !input.disabled) {
        const token = key.dataset.csKey;
        const start = input.selectionStart == null ? input.value.length : input.selectionStart;
        const end = input.selectionEnd == null ? start : input.selectionEnd;
        if (token === "⌫") {
          const from = start === end ? Math.max(0, start - 1) : start;
          input.value = input.value.slice(0, from) + input.value.slice(end);
          input.setSelectionRange(from, from);
        } else {
          const marker = token.indexOf("|");
          const clean = token.replace("|", "");
          input.value = input.value.slice(0, start) + clean + input.value.slice(end);
          const at = start + (marker >= 0 ? marker : clean.length);
          input.setSelectionRange(at, at);
        }
        input.focus({ preventScroll: true });
        preview(box, input.value);
        return;
      }
      if (t.closest("[data-cs-kbd]") && input) {
        sysKbd = !sysKbd;
        input.setAttribute("inputmode", sysKbd ? "text" : "none");
        const b = t.closest("[data-cs-kbd]");
        b.setAttribute("aria-pressed", String(sysKbd));
        b.setAttribute("aria-label", sysKbd ? "改用數學鍵盤" : "叫出系統鍵盤");
        input.blur();
        input.focus();
        return;
      }
      if (t.closest("[data-cs-toggle]")) {
        padOpen = !padOpen;
        const pad = box.querySelector("[data-cs-pad]");
        if (pad) pad.hidden = !padOpen;
        t.closest("[data-cs-toggle]").setAttribute("aria-expanded", String(padOpen));
      }
    });
    document.addEventListener("input", (event) => {
      const input = event.target;
      if (!input || !input.matches || !input.matches("[data-cs-input]")) return;
      preview(input.closest("[data-cs]"), input.value);
    });
    document.addEventListener("keydown", (event) => {
      const input = event.target;
      if (event.key !== "Enter" || !input || !input.matches || !input.matches("[data-cs-input]")) return;
      event.preventDefault();
      const send = input.closest("[data-cs]").querySelector("[data-cs-send]");
      if (send) send.click();
    });
  }
  // 分節的草稿：重繪前把輸入框的字收回 state（打到一半去看提示，字還在）
  function keep(api) {
    const v = api.state.cs || {};
    Object.keys(v).forEach((si) => {
      const input = document.querySelector(`[data-cs="${cssKey(v[si].key)}"] [data-cs-input]`);
      if (input && !input.disabled) v[si].draft = input.value;
    });
  }
  function remember(deps) { lastDeps = deps; }

  window.BuzzCourseSolve = {
    view: (api, si) => { remember(api.deps); return view(api, si); },
    act: (api, action) => { keep(api); return act(api, action); },
    resolved,
    stat,
    page: (k) => { remember(k.deps); return page(k); },
    rv,
    // 給驗證器與測試：判分與題目的組法跟畫面同一份
    grade, itemOf, fromSolve
  };
})();
