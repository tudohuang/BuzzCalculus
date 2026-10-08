// ── 新版課程的畫面（中文介面專用）──
//
// 內容：src/course_v2/outline.js（大綱）＋ stage-<n>.js（課文），由 tools/build_course_v2.js 從
// tools/content/course_v2/ 產生。這支跟 outline.js 是 index.html 上的 type="text/lazy" data-lazy="course"：
// 打開課程（或新手首頁要畫主卡）才抓；課文按 Stage 分檔，打開某一課才抓那一個 Stage。
// 英文介面不載這支：course.js 的 create() 在英文時用舊的 25 課（它們有英文，新版還沒翻）。
// 所以這裡的字直接寫中文，不包 t()（validate_i18n 也不掃這支）。
//
// 顯示規則（review 認可的 v0.8 樣稿）：
//   觀念預設顯示；collapsible 的段落（完整定理條件、嚴格證明、預告）預設收起；
//   範例一步一步揭；常見錯誤是短句清單；小測選錯才顯示那個選項的理由；挑戰題另外標；
//   通過三層 —— 完成（小測第一次就選對 ≥ 3 題）／熟練（核心推薦題全對）／全破（含挑戰全對）—— 不鎖課；
//   閱讀時間與完成時間分開；課號照大綱順序算，正文的〈課名〉連到那一課；visual（動態圖規格）不顯示。
//
// 狀態：哪一課、每題範例揭到第幾步、小測每題依序選過哪些。收合段落用 <details data-keep>，
// app.js 重繪時會把開合接回去（captureViewState），所以不用記在這裡。
// 進度存 records.courseV2[id] = { openedAt, quizBest, quizAt, doneAt, practicedAt }；
// 推薦題對不對不另外記，直接看 records.problemStats（任何模式答對過都算）。

(function () {
  "use strict";

  const TIER_NAMES = ["", "完成", "熟練", "全破"];
  const PASS = 3;

  const STYLE = `
.cv2-index .course-progress { margin: 2px 0 4px; }
.cv2-stages { display: grid; gap: 8px; }
.cv2-stage, .cv2-chapter { border: 1px solid var(--line); border-radius: 14px; background: var(--panel); }
.cv2-stage > summary, .cv2-chapter > summary { display: flex; align-items: center; gap: 10px; min-height: 52px; padding: 8px 14px; cursor: pointer; list-style: none; }
.cv2-stage > summary::-webkit-details-marker, .cv2-chapter > summary::-webkit-details-marker, .cv2-fold > summary::-webkit-details-marker { display: none; }
.cv2-stage > summary strong { flex: 1; min-width: 0; font-size: 1rem; }
.cv2-stage-no { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: var(--surface); color: var(--muted); font-weight: 800; font-size: 0.86rem; }
.cv2-stage.is-done .cv2-stage-no { background: var(--green); color: #fff; }
.cv2-branch { padding: 2px 8px; border-radius: 999px; background: color-mix(in srgb, var(--violet) 12%, var(--panel)); color: var(--violet); font-size: 0.74rem; font-style: normal; font-weight: 700; }
.cv2-count { flex: none; color: var(--muted); font-size: 0.8rem; font-variant-numeric: tabular-nums; }
.cv2-bar { position: relative; flex: none; width: 52px; height: 5px; border-radius: 999px; background: var(--line); overflow: hidden; }
.cv2-bar::after { content: ""; position: absolute; inset: 0 auto 0 0; width: var(--pct, 0%); background: var(--green); }
.cv2-stage-body { display: grid; gap: 6px; padding: 0 10px 10px; }
.cv2-chapter { border-radius: 12px; background: var(--surface); }
.cv2-chapter > summary { min-height: 46px; font-weight: 700; font-size: 0.92rem; }
.cv2-chapter > summary span { flex: 1; min-width: 0; }
.cv2-rows { display: grid; gap: 4px; margin: 0; padding: 0 6px 8px; list-style: none; }
.cv2-row { display: grid; grid-template-columns: 3em minmax(0, 1fr) auto; align-items: center; gap: 8px; width: 100%; min-height: 44px; padding: 6px 10px; border: 1px solid transparent; border-radius: 10px; background: var(--panel); color: var(--ink); font: inherit; text-align: left; cursor: pointer; }
.cv2-row:hover { border-color: var(--gold); }
.cv2-row.is-next { border-color: var(--gold); }
.cv2-row.is-soon { cursor: default; background: transparent; color: var(--muted); }
.cv2-row-no { color: var(--muted); font-size: 0.8rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.cv2-row strong { font-size: 0.94rem; font-weight: 600; overflow-wrap: anywhere; }
.cv2-row small { color: var(--muted); font-size: 0.76rem; white-space: nowrap; }
.cv2-tier { padding: 2px 8px; border-radius: 999px; font-size: 0.74rem; font-style: normal; font-weight: 700; white-space: nowrap; background: color-mix(in srgb, var(--green) 12%, var(--panel)); color: var(--green); }
.cv2-tier.t2 { background: color-mix(in srgb, var(--blue) 12%, var(--panel)); color: var(--blue); }
.cv2-tier.t3 { background: color-mix(in srgb, var(--gold) 18%, var(--panel)); color: var(--gold-dark); }
.cv2-lesson { gap: 14px; }
.cv2-lesson sub, .cv2-lesson sup { font-size: 0.72em; line-height: 0; }
.cv2-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; margin: 6px 0 0; color: var(--muted); font-size: 0.86rem; }
.cv2-prereq { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 6px; margin: 0; color: var(--muted); font-size: 0.88rem; }
.cv2-link { display: inline-block; margin: -9px 0; padding: 9px 1px; border: 0; background: none; color: var(--blue); font: inherit; line-height: inherit; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; cursor: pointer; }
.cv2-list { display: grid; gap: 6px; margin: 0; padding-left: 1.2em; line-height: 1.65; }
.cv2-part { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
.cv2-part > * { min-width: 0; }
.cv2-part h3 { margin: 4px 0 0; font-size: 1rem; }
.cv2-part p, .cv2-example p { margin: 0; line-height: 1.75; overflow-wrap: anywhere; }
.cv2-fold { border: 1px dashed var(--line-strong); border-radius: 12px; }
.cv2-fold > summary { display: flex; align-items: center; gap: 8px; min-height: 46px; padding: 6px 12px; color: var(--ink); font-weight: 700; cursor: pointer; list-style: none; }
.cv2-fold > summary svg { flex: none; transition: transform 0.15s ease; }
.cv2-fold[open] > summary svg { transform: rotate(90deg); }
.cv2-fold > summary em::after { content: "展開"; }
.cv2-fold[open] > summary em::after { content: "收起"; }
.cv2-fold > summary em { margin-left: auto; color: var(--muted); font-size: 0.76rem; font-style: normal; font-weight: 600; }
.cv2-fold > .cv2-part { padding: 0 12px 12px; }
.cv2-example { display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }
.cv2-example > * { min-width: 0; }
.cv2-example-title { margin: 0; font-weight: 700; }
.cv2-prompt { padding: 8px 12px; border-radius: 10px; background: var(--panel); font-weight: 600; }
.cv2-example .course-step-no { flex: none; }
.cv2-note { color: var(--muted); font-size: 0.88rem; }
.cv2-quiz-result { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 10px 14px; border-radius: 12px; background: var(--surface); }
.cv2-quiz-result.is-pass { background: color-mix(in srgb, var(--green) 9%, var(--panel)); color: var(--green); }
.cv2-quiz-result strong { font-size: 1.1rem; font-variant-numeric: tabular-nums; }
.course-option:disabled { cursor: default; }
.cv2-tiers { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; margin: 0; padding: 0; list-style: none; }
.cv2-tiers li { display: grid; gap: 2px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 10px; color: var(--muted); font-size: 0.78rem; }
.cv2-tiers li strong { color: var(--ink); font-size: 0.9rem; }
.cv2-tiers li.is-on { border-color: color-mix(in srgb, var(--green) 45%, var(--line)); background: color-mix(in srgb, var(--green) 8%, var(--panel)); }
.cv2-practice { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; }
.cv2-practice li { display: grid; grid-template-columns: 1.6em minmax(0, 1fr); align-items: start; gap: 8px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); }
.cv2-practice li > * { min-width: 0; }
.cv2-practice .math-inline { overflow-x: auto; max-height: 7.5em; overflow-y: hidden; }
.cv2-mark { color: var(--muted); font-weight: 800; text-align: center; }
.cv2-mark.is-core { color: var(--gold-dark); }
.cv2-practice li.is-solved .cv2-mark { color: var(--green); }
.cv2-subhead { display: flex; align-items: center; gap: 8px; margin: 4px 0 0; }
.cv2-nav { display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; }
.cv2-nav .button { max-width: 100%; }
`;

  function injectStyle() {
    if (typeof document === "undefined" || !document.head || document.getElementById("cv2-style")) return;
    const node = document.createElement("style");
    node.id = "cv2-style";
    node.textContent = STYLE;
    document.head.appendChild(node);
  }

  function create(deps) {
    const { escapeHtml, escapeAttr, icon, loadRecords, saveRecords, render, go, startQuiz, legacy } = deps;
    const outline = window.BUZZ_COURSE_V2;
    const lessonData = (id) => (window.BUZZ_COURSE_V2_LESSONS || {})[id] || null;
    injectStyle();

    /* ── 大綱索引：課號在這裡算（Stage 編號.在 Stage 裡的第幾課），資料裡不存 ── */
    const order = [];
    const meta = {};
    const titleIds = {};
    const problemLesson = {};
    outline.stages.forEach((stage) => {
      let k = 0;
      stage.chapters.forEach((chapter) => chapter.lessons.forEach((raw) => {
        k += 1;
        const practice = String(raw.practice || "").split(" ").filter(Boolean).map((token) => {
          const kind = token.endsWith("*") ? "core" : token.endsWith("!") ? "challenge" : "";
          return { id: kind ? token.slice(0, -1) : token, kind };
        });
        const m = {
          id: raw.id, title: raw.title, no: `${stage.n}.${k}`, stage, chapter,
          available: typeof raw.read === "number", read: raw.read, total: raw.total, practice,
          worked: String(raw.worked || "").split(" ").filter(Boolean)
        };
        order.push(m);
        meta[m.id] = m;
        (titleIds[m.title] = titleIds[m.title] || []).push(m.id);
        if (m.available) practice.concat(m.worked.map((id) => ({ id }))).forEach((p) => { if (!problemLesson[p.id]) problemLesson[p.id] = m.id; });
      }));
    });
    const live = order.filter((m) => m.available);
    const mainPath = live.filter((m) => !m.stage.branch);
    const usedProblems = new Set(Object.keys(problemLesson));
    const neighbour = (m, step) => {
      const at = live.indexOf(m);
      return at < 0 ? null : live[at + step] || null;
    };
    const label = (m) => `${m.no} ${m.title}`;

    let problemMap = null;
    const problem = (id) => {
      if (!problemMap) problemMap = new Map((window.BUZZ_PROBLEMS || []).map((p) => [p.id, p]));
      return problemMap.get(id) || null;
    };

    /* ── 紀錄 ── */
    const entryOf = (records, id) => ((records.courseV2 || {})[id]) || {};
    const solved = (records, problemId) => {
      const stat = (records.problemStats || {})[problemId];
      return Boolean(stat && stat.correct > 0);
    };
    // 三層是累進的：熟練要先完成、全破要先熟練。沒有核心題的課，熟練跟著「全部推薦題」走。
    function tierOf(records, m) {
      if (!entryOf(records, m.id).doneAt) return 0;
      const all = m.practice.filter((p) => problem(p.id));
      if (!all.length) return 1;
      const core = all.filter((p) => p.kind === "core");
      const coreOk = (core.length ? core : all.filter((p) => p.kind !== "challenge")).every((p) => solved(records, p.id));
      if (!coreOk) return 1;
      return all.every((p) => solved(records, p.id)) ? 3 : 2;
    }
    const isDone = (records, m) => Boolean(entryOf(records, m.id).doneAt);
    const nextLesson = (records) => mainPath.find((m) => !isDone(records, m)) || null;
    function update(id, change) {
      const records = loadRecords();
      records.courseV2 = records.courseV2 || {};
      records.courseV2[id] = change({ ...(records.courseV2[id] || {}) });
      saveRecords(records);
    }

    /* ── 課文載入（按 Stage）── */
    const stageState = {};
    function loadStage(n) {
      if (stageState[n] === "loading" || stageState[n] === "ready") return;
      stageState[n] = "loading";
      const script = document.createElement("script");
      script.src = `src/course_v2/stage-${n}.js`;
      script.onload = () => { stageState[n] = "ready"; render(); };
      script.onerror = () => { stageState[n] = "failed"; script.remove(); render(); };
      document.head.appendChild(script);
    }
    // 離線：課程表打開過一次，就在閒下來的時候把每個 Stage 的課文抓一遍（sw.js 的 fetch handler 會順手快取）。
    // 只有已經有 service worker 在管的頁面才做，不然抓了也存不起來。
    let prefetched = false;
    function prefetchAll() {
      if (prefetched || typeof navigator === "undefined" || !navigator.serviceWorker || !navigator.serviceWorker.controller || typeof fetch !== "function") return;
      prefetched = true;
      const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 1500));
      idle(() => outline.stages.reduce((chain, stage) => chain.then(() => fetch(`src/course_v2/stage-${stage.n}.js`).catch(() => null)), Promise.resolve()));
    }

    /* ── 文字：跳脫 ＋ 上下標 ＋〈課名〉變成連到那一課的連結 ──
       課文的數學是 Unicode 純文字，上下標照作者的寫法：lim_{x→0}、Σ_{n=1}^∞、e^{x²}、a_n、x_0。
       畫成 <sub>/<sup>，不然手機上滿版的 lim_{x→a} 很難讀。只認大括號一層、或底線／次方後面單一個字元。 */
    const SCRIPT_CHAR = "[A-Za-z0-9α-ωΑ-Ω∞πθφ+\\-−′]";
    const SUB_SUP = [
      [/_\{([^{}]*)\}/g, "<sub>$1</sub>"],
      [/\^\{([^{}]*)\}/g, "<sup>$1</sup>"],
      [new RegExp(`_(${SCRIPT_CHAR})`, "g"), "<sub>$1</sub>"],
      [new RegExp(`\\^(${SCRIPT_CHAR})`, "g"), "<sup>$1</sup>"]
    ];
    const fmt = (text) => SUB_SUP.reduce((out, [pattern, html]) => out.replace(pattern, html), escapeHtml(String(text || "")));
    function rich(text, context) {
      return String(text || "").split(/(〈[^〈〉]+〉)/).map((part) => {
        const hit = /^〈([^〈〉]+)〉$/.exec(part);
        if (!hit) return fmt(part);
        const ids = (titleIds[hit[1]] || []).filter((id) => meta[id].available);
        // 同名的課（例如一維與二維的「臨界點」）：先找這一課的先修／相關／下一課裡的那一個
        const near = context ? [...(context.related || []), ...(context.prerequisites || []), ...(context.next || [])] : [];
        const id = ids.find((x) => near.includes(x)) || ids[0];
        if (!id || (context && id === context.id)) return escapeHtml(part);
        return `<button type="button" class="cv2-link" data-action="open-course-lesson" data-lesson-id="${escapeAttr(id)}">${escapeHtml(part)}</button>`;
      }).join("");
    }
    const lessonLink = (id) => (meta[id] ? (meta[id].available
      ? `<button type="button" class="cv2-link" data-action="open-course-lesson" data-lesson-id="${escapeAttr(id)}">〈${escapeHtml(meta[id].title)}〉</button>`
      : `<span>〈${escapeHtml(meta[id].title)}〉</span>`) : "");
    const tierPill = (tier) => (tier ? `<em class="cv2-tier t${tier}">${TIER_NAMES[tier]}</em>` : "");

    /* ── 課程表 ── */
    function renderIndex(records) {
      prefetchAll();
      const next = nextLesson(records);
      const done = mainPath.filter((m) => isDone(records, m)).length;
      const pct = mainPath.length ? Math.round((done / mainPath.length) * 100) : 0;
      const openStage = next ? next.stage : null;
      const row = (m) => {
        if (!m.available) {
          return `<li><span class="cv2-row is-soon"><span class="cv2-row-no">${m.no}</span><strong>${escapeHtml(m.title)}</strong><small>尚未開放</small></span></li>`;
        }
        const tier = tierOf(records, m);
        return `<li><button type="button" class="cv2-row ${next === m ? "is-next" : ""} ${tier ? "is-done" : ""}" data-action="open-course-lesson" data-lesson-id="${escapeAttr(m.id)}"><span class="cv2-row-no">${m.no}</span><strong>${escapeHtml(m.title)}</strong>${tier ? tierPill(tier) : `<small>${m.read} 分</small>`}</button></li>`;
      };
      const stages = outline.stages.map((stage) => {
        const inStage = order.filter((m) => m.stage === stage);
        const ready = inStage.filter((m) => m.available);
        const stageDone = ready.filter((m) => isDone(records, m)).length;
        const stagePct = ready.length ? Math.round((stageDone / ready.length) * 100) : 0;
        const chapters = stage.chapters.map((chapter) => {
          const rows = order.filter((m) => m.chapter === chapter);
          const chapterDone = rows.filter((m) => m.available && isDone(records, m)).length;
          const open = next && next.chapter === chapter;
          return `
            <details class="cv2-chapter" data-keep="cv2-ch-${escapeAttr(chapter.code)}" ${open ? "open" : ""}>
              <summary><span>${escapeHtml(chapter.title)}</span><small class="cv2-count">${chapterDone} / ${rows.length}</small></summary>
              <ol class="cv2-rows">${rows.map(row).join("")}</ol>
            </details>`;
        }).join("");
        return `
          <details class="cv2-stage ${ready.length && stageDone === ready.length ? "is-done" : ""}" data-keep="cv2-stage-${stage.n}" ${openStage === stage ? "open" : ""}>
            <summary>
              <span class="cv2-stage-no">${stage.n}</span>
              <strong>${escapeHtml(stage.title)}</strong>
              ${stage.branch ? `<em class="cv2-branch">支線</em>` : ""}
              <small class="cv2-count">${stageDone} / ${inStage.length}</small>
              <i class="cv2-bar" style="--pct:${stagePct}%"></i>
            </summary>
            <div class="cv2-stage-body">${chapters}</div>
          </details>`;
      }).join("");
      return `
        <main class="screen">
          <section class="panel page-panel course-index cv2-index">
            <div class="page-head">
              <div>
                <p class="section-label">課程</p>
                <h2>微積分 · ${order.length} 課</h2>
              </div>
              <div class="action-row">
                ${next ? `<button class="button home-primary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(next.id)}">${icon("play")}${done || entryOf(records, next.id).openedAt ? "繼續" : "開始"}：${escapeHtml(label(next))}</button>` : ""}
              </div>
            </div>
            <div class="course-progress"><strong>${done}<small> / ${mainPath.length} 課 · 主線</small></strong><i style="--pct:${pct}%"></i></div>
            <div class="cv2-stages">${stages}</div>
            ${renderGraduationCard(records)}
          </section>
        </main>`;
    }

    // 畢業關（跟舊課共用題目與判定，見 course.js 的橋池）：新版不鎖，課程表最底下隨時可以考
    function renderGraduationCard(records) {
      const grad = legacy.graduation(records);
      if (grad && grad.passed) {
        return `<section class="course-graduation is-passed"><p class="section-label">畢業關</p><strong>${icon("check")}畢業了 · ${grad.correct} / ${grad.total}</strong><div class="action-row"><button class="button ghost" data-action="course-graduation">${icon("refresh")}再考一次</button></div></section>`;
      }
      return `<section class="course-graduation"><p class="section-label">畢業關</p><strong>${grad ? `上次 ${grad.correct} / ${grad.total}，再來一次` : "10 題，8 題過關"}</strong><small>極限、微分、積分的基礎題，不倒數。過了，主線就不再只出基礎題。</small><div class="action-row"><button class="button" data-action="course-graduation">${icon("play")}${grad ? "再考一次" : "開始畢業關"}</button></div></section>`;
    }

    /* ── 單課 ── */
    let state = { lessonId: "", steps: {}, picks: {}, recorded: false };

    function renderLesson(records) {
      const m = meta[state.lessonId];
      if (!m || !m.available) return renderIndex(records);
      const data = lessonData(m.id);
      const entry = entryOf(records, m.id);
      const tier = tierOf(records, m);
      const head = `
        <div class="page-head">
          <div>
            <p class="section-label">${m.no} · ${escapeHtml(m.stage.title)}${m.stage.branch ? "（支線）" : ""}</p>
            <h2>${escapeHtml(m.title)}</h2>
            <p class="cv2-meta"><span>閱讀 ${m.read} 分</span><span>完成 ${m.total} 分</span>${tierPill(tier)}</p>
          </div>
          <div class="action-row"><button class="button secondary" data-action="open-course">${icon("list-checks")}課程表</button></div>
        </div>`;
      if (!data) {
        if (stageState[m.stage.n] !== "failed") loadStage(m.stage.n);
        const failed = stageState[m.stage.n] === "failed";
        return `
          <main class="screen ${failed ? "" : "lazy-loading"}" aria-busy="${failed ? "false" : "true"}">
            <section class="panel page-panel course-lesson cv2-lesson">${head}
              <p class="panel-note">${failed ? "課文載不進來 —— 檢查一下網路再試一次。" : "載入課文…"}</p>
              ${failed ? `<div class="action-row"><button class="button" data-action="course-retry">${icon("refresh")}再試一次</button></div>` : ""}
            </section>
          </main>`;
      }
      const prev = neighbour(m, -1);
      const next = neighbour(m, 1);
      const para = (text) => `<p>${rich(text, data)}</p>`;
      const tex = (list) => (list || []).map((line) => `<div class="math-block course-concept-math" data-tex="${escapeAttr(line)}"></div>`).join("");

      const concept = data.concept.map((part, i) => {
        const body = `${part.body.map(para).join("")}${tex(part.tex)}`;
        if (!part.collapsible) return `<div class="cv2-part">${part.heading ? `<h3>${fmt(part.heading)}</h3>` : ""}${body}</div>`;
        return `
          <details class="cv2-fold" data-keep="cv2-${escapeAttr(m.id)}-${i}">
            <summary>${icon("chevron-right")}<span>${fmt(part.heading || "展開")}</span><em></em></summary>
            <div class="cv2-part">${body}</div>
          </details>`;
      }).join("");

      const examples = data.workedExamples.map((ex, i) => {
        const shown = Math.min(ex.steps.length, state.steps[i] || 0);
        const steps = ex.steps.slice(0, shown).map((step, k) => `
          <li class="course-step"><span class="course-step-no">${k + 1}</span><div><p>${rich(step, data)}</p></div></li>`).join("");
        return `
          <article class="cv2-example" data-course-example="${i}">
            <p class="cv2-example-title">範例 ${i + 1}${ex.title ? ` · ${fmt(ex.title)}` : ""}</p>
            <p class="cv2-prompt">${rich(ex.prompt, data)}</p>
            ${shown ? `<ol class="course-steps">${steps}</ol>` : ""}
            ${shown < ex.steps.length
              ? `<div class="action-row"><button class="button secondary" data-action="course-step" data-ex="${i}">${icon("chevron-down")}${shown ? "下一步" : "看第一步"}<small>${shown} / ${ex.steps.length}</small></button></div>`
              : `<p class="course-answer">${icon("check")}答案：${fmt(ex.answer)}</p>${ex.note ? `<p class="cv2-note">${rich(ex.note, data)}</p>` : ""}`}
          </article>`;
      }).join("");

      const checks = data.checks.map((check, ci) => {
        const picks = state.picks[ci] || [];
        const right = picks.some((oi) => check.options[oi] && check.options[oi].correct);
        const wrongs = picks.filter((oi) => check.options[oi] && !check.options[oi].correct);
        return `
          <div class="course-check ${right ? "is-right" : picks.length ? "is-wrong" : ""}">
            <p class="course-check-ask">${ci + 1}. ${rich(check.ask, data)}</p>
            <div class="course-check-options">
              ${check.options.map((option, oi) => `
                <button type="button" class="course-option ${right && option.correct ? "is-correct" : ""} ${picks.includes(oi) && !option.correct ? "is-picked" : ""}" data-action="course-pick" data-check="${ci}" data-option="${oi}" ${right ? "disabled" : ""}>${fmt(option.label)}</button>`).join("")}
            </div>
            ${wrongs.map((oi) => `<p class="course-check-why">${fmt(check.options[oi].label)}：${rich(check.options[oi].why, data)}</p>`).join("")}
            ${right ? `<p class="course-check-why is-right">${icon("check")}對了${picks.length > 1 ? "（第一次選錯，這題不算分）" : ""}</p>` : ""}
          </div>`;
      }).join("");
      const allAnswered = data.checks.every((_check, ci) => (state.picks[ci] || []).length);
      const score = quizScore(data);
      const quizResult = allAnswered ? `
        <div class="cv2-quiz-result ${score >= PASS ? "is-pass" : ""}" data-course-quiz-result>
          <strong>${score} / ${data.checks.length}</strong>
          <span>${score >= PASS ? "這一課完成了" : `第一次就選對 ${PASS} 題才算完成`}</span>
          <button type="button" class="button ghost" data-action="course-quiz-reset">${icon("refresh")}重做小測</button>
        </div>` : "";

      const items = data.practice.map((p) => ({ ...p, problem: problem(p.id) })).filter((p) => p.problem);
      const mainItems = items.filter((p) => !p.challenge);
      const challengeItems = items.filter((p) => p.challenge);
      const practiceRow = (p) => `
        <li class="${solved(records, p.id) ? "is-solved" : ""}">
          <span class="cv2-mark ${p.core ? "is-core" : ""}" title="${p.core ? "核心題" : ""}">${solved(records, p.id) ? "✔" : p.core ? "★" : "·"}</span>
          <div><div class="math-inline" data-tex="${escapeAttr(p.problem.prompt)}"></div>${p.challenge && p.note ? `<p class="cv2-note">${rich(p.note, data)}</p>` : ""}</div>
        </li>`;
      const tiers = [
        ["完成", `小測 ≥ ${PASS} 題`],
        ["熟練", items.some((p) => p.core) ? "★ 題全對" : "推薦題全對"],
        ["全破", challengeItems.length ? "含挑戰全對" : "全部全對"]
      ];

      return `
        <main class="screen">
          <section class="panel page-panel course-lesson cv2-lesson">
            ${head}
            ${data.prerequisites.length ? `<p class="cv2-prereq"><span>先修</span>${data.prerequisites.map(lessonLink).join("")}</p>` : ""}
            ${data.objectives.length ? `
            <section class="course-block">
              <p class="section-label">學完你會</p>
              <ul class="cv2-list">${data.objectives.map((line) => `<li>${rich(line, data)}</li>`).join("")}</ul>
            </section>` : ""}

            <section class="course-block" data-course-concept>
              <p class="section-label">觀念</p>
              ${concept}
            </section>

            ${examples ? `
            <section class="course-block" data-course-worked>
              <p class="section-label">範例 · 一步一步揭</p>
              ${examples}
            </section>` : ""}

            ${data.pitfalls.length ? `
            <section class="course-block" data-course-pitfalls>
              <p class="section-label">常見錯誤</p>
              <ul class="cv2-list">${data.pitfalls.map((line) => `<li>${rich(line, data)}</li>`).join("")}</ul>
            </section>` : ""}

            <section class="course-block" data-course-checks>
              <p class="section-label">小測${entry.quizBest !== undefined ? ` · 最好 ${entry.quizBest} / ${data.checks.length}` : ""}</p>
              ${checks}
              ${quizResult}
            </section>

            <section class="course-block" data-course-practice>
              <p class="section-label">推薦題</p>
              <ol class="cv2-tiers">${tiers.map(([name, rule], i) => `<li class="${tier > i ? "is-on" : ""}"><strong>${tier > i ? "✔ " : ""}${name}</strong><span>${rule}</span></li>`).join("")}</ol>
              ${mainItems.length ? `
                <ul class="cv2-practice">${mainItems.map(practiceRow).join("")}</ul>
                <div class="action-row"><button class="button home-primary" data-action="course-practice" data-set="main">${icon("play")}練推薦題 · ${mainItems.length} 題</button></div>` : ""}
              ${challengeItems.length ? `
                <p class="section-label cv2-subhead">挑戰</p>
                <ul class="cv2-practice">${challengeItems.map(practiceRow).join("")}</ul>
                <div class="action-row"><button class="button secondary" data-action="course-practice" data-set="challenge">${icon("zap")}挑戰 · ${challengeItems.length} 題</button></div>` : ""}
              ${items.length ? "" : `<p class="panel-note">這一課沒有推薦題；小測完成就是全破。</p>`}
            </section>

            <nav class="cv2-nav" aria-label="上一課與下一課">
              ${prev ? `<button class="button ghost" data-action="open-course-lesson" data-lesson-id="${escapeAttr(prev.id)}">上一課 ${escapeHtml(prev.no)}</button>` : "<span></span>"}
              ${next ? `<button class="button ${tier ? "home-primary" : "secondary"}" data-action="open-course-lesson" data-lesson-id="${escapeAttr(next.id)}">下一課：${escapeHtml(label(next))}${icon("chevron-right")}</button>` : ""}
            </nav>
          </section>
        </main>`;
    }

    // 只算每題「第一次選的」：可以一直選到對，但只有第一次就對的才算分
    function quizScore(data) {
      return data.checks.filter((check, ci) => {
        const first = (state.picks[ci] || [])[0];
        return first !== undefined && check.options[first] && check.options[first].correct;
      }).length;
    }

    /* ── 首頁與結算的出口（新手首頁主卡、三步、答錯回饋、課後結算）── */
    function renderHomeCard(records) {
      const next = nextLesson(records);
      const done = mainPath.filter((m) => isDone(records, m)).length;
      if (!next) {
        const grad = legacy.graduation(records);
        if (grad && grad.passed) return "";
        return `
          <section class="today-card course-home-card">
            <div class="today-card-head"><p class="section-label">${icon("book-open")}課程 · 主線 ${mainPath.length} 課都完成了</p><span>約 10 分鐘</span></div>
            <h2>${grad ? `畢業關再考一次（上次 ${grad.correct} / ${grad.total}）` : "畢業關：10 題，8 題過關"}</h2>
            <div class="action-row"><button class="button home-primary" data-action="course-graduation">${icon("play")}${grad ? "再考一次" : "開始畢業關"}</button><button class="button secondary" data-action="open-course">${icon("list-checks")}課程表</button></div>
          </section>`;
      }
      const started = Boolean(entryOf(records, next.id).openedAt);
      return `
        <section class="today-card course-home-card">
          <div class="today-card-head">
            <p class="section-label">${icon("book-open")}課程 · ${done} / ${mainPath.length} 課</p>
            <span>閱讀 ${next.read} 分</span>
          </div>
          <h2>${started ? "接著上" : "上"} ${escapeHtml(label(next))}</h2>
          <div class="action-row">
            <button class="button home-primary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(next.id)}">${icon("play")}${started ? "繼續這一課" : "開始"}</button>
            <button class="button secondary" data-action="open-course">${icon("list-checks")}課程表</button>
          </div>
        </section>`;
    }

    function renderFirstSteps(records) {
      const next = nextLesson(records);
      const done = mainPath.filter((m) => isDone(records, m)).length;
      const steps = [
        [next ? `上 ${label(next)}` : "主線的課都上完了", "觀念 → 範例 → 小測 → 推薦題", "open-course"],
        ["練完就有能力輪廓", "哪些概念穩、哪些還卡，數據頁看得到", "open-insights"],
        ["畢業關 10 題，過了再走主線", "只出基礎題；主線頭三局也是，不倒數", "open-course"]
      ];
      return `
        <section class="first-steps" aria-label="開始的三步">
          ${steps.map(([title, note, action], index) => `
            <button type="button" class="first-step ${index === (next ? 0 : 2) ? "is-current" : ""}" data-action="${action}">
              <span class="first-step-no">${index === 0 && done ? `${done}/${mainPath.length}` : index + 1}</span>
              <strong>${escapeHtml(title)}</strong>
              <small>${escapeHtml(note)}</small>
            </button>`).join("")}
        </section>`;
    }

    function renderFeedbackLink(problemId) {
      const m = meta[problemLesson[problemId]];
      return m ? `<p class="feedback-course"><button type="button" class="link-button" data-action="open-course-lesson" data-lesson-id="${escapeAttr(m.id)}">${icon("book-open")}這題是〈${escapeHtml(label(m))}〉教的 —— 回去看一眼</button></p>` : "";
    }

    function renderResultsActions(lessonId) {
      const m = meta[lessonId];
      const next = m ? neighbour(m, 1) : null;
      return `
        <div class="action-row">
          <button class="button" data-action="open-course-lesson" data-lesson-id="${escapeAttr(lessonId)}">${icon("book-open")}回到 ${m ? escapeHtml(label(m)) : "課程"}</button>
          ${next ? `<button class="button secondary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(next.id)}">${icon("chevron-right")}下一課</button>` : `<button class="button secondary" data-action="open-course">${icon("list-checks")}課程表</button>`}
          <button class="button ghost" data-action="open-mistakes">${icon("book")}錯題本</button>
        </div>`;
    }

    /* ── 動作 ── */
    const QUIZ = { modeKey: "practice", practice: true, noTimer: true, answerMode: "choice" };
    function act(action, data) {
      const id = data.lessonId || state.lessonId;
      if (action === "open-course") return go("course");
      if (action === "open-course-lesson") {
        const m = meta[id];
        if (!m || !m.available) return go("course");
        update(id, (entry) => ({ ...entry, openedAt: entry.openedAt || new Date().toISOString() }));
        state = { lessonId: id, steps: {}, picks: {}, recorded: false };
        if (!lessonData(id)) loadStage(m.stage.n);
        return go("course-lesson");
      }
      if (action === "course-retry") {
        const m = meta[state.lessonId];
        if (m) { delete stageState[m.stage.n]; loadStage(m.stage.n); }
        return render();
      }
      const lesson = lessonData(state.lessonId);
      if (action === "course-step" && lesson) {
        const ex = Number(data.ex);
        state.steps = { ...state.steps, [ex]: (state.steps[ex] || 0) + 1 };
        return render();
      }
      if (action === "course-pick" && lesson) {
        const ci = Number(data.check);
        const oi = Number(data.option);
        const check = lesson.checks[ci];
        if (!check || !check.options[oi]) return;
        const picks = state.picks[ci] || [];
        if (picks.some((x) => check.options[x].correct) || picks.includes(oi)) return;
        state.picks = { ...state.picks, [ci]: picks.concat(oi) };
        // 每一題都選過（第一次的選擇定了）就記分；同一輪只記一次，重做小測再記
        if (!state.recorded && lesson.checks.every((_c, k) => (state.picks[k] || []).length)) {
          state.recorded = true;
          const score = quizScore(lesson);
          update(state.lessonId, (entry) => ({
            ...entry,
            quizBest: Math.max(score, Number(entry.quizBest || 0)),
            quizAt: new Date().toISOString(),
            ...(score >= PASS && !entry.doneAt ? { doneAt: new Date().toISOString() } : {})
          }));
        }
        return render();
      }
      if (action === "course-quiz-reset") {
        state = { ...state, picks: {}, recorded: false };
        return render();
      }
      if (action === "course-practice" && lesson) {
        const challenge = data.set === "challenge";
        const pool = lesson.practice.filter((p) => Boolean(p.challenge) === challenge).map((p) => problem(p.id)).filter(Boolean);
        if (pool.length) startQuiz(pool, { ...QUIZ, courseLessonId: state.lessonId });
        return;
      }
      if (action === "course-graduation") {
        const pool = legacy.graduationSet(Date.now(), usedProblems);
        if (pool.length >= 4) startQuiz(pool, { ...QUIZ, courseGraduation: true });
      }
    }

    return {
      renderIndex,
      renderLesson,
      renderHomeCard,
      renderFirstSteps,
      renderFeedbackLink,
      renderResultsActions,
      act,
      // 給測試與工具看的（不是給畫面用的）
      lessonMeta: (id) => meta[id] || null,
      tierOf: (records, id) => (meta[id] ? tierOf(records, meta[id]) : 0)
    };
  }

  window.BuzzCourseV2UI = { create };
})();
