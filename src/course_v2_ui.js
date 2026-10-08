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
//   閱讀時間與完成時間分開；課號照大綱順序算，正文的〈課名〉連到那一課；visual（給作者的文字規格）不顯示，
//   畫面上的圖是 figures（畫法在這支最後的 BuzzCourseFigures），放在 after 指定的觀念段落之後。
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
.cv2-figure { display: grid; justify-items: center; gap: 6px; margin: 4px 0; }
.cv2-figure > * { min-width: 0; max-width: 100%; }
.cv2-figure [data-cv2-plot] { display: grid; gap: 8px; width: 100%; }
.cv2-figure .problem-graph svg { width: min(400px, 100%); }
.cv2-figure figcaption { color: var(--muted); font-size: 0.86rem; line-height: 1.5; text-align: center; }
.cv2-readout { margin: 0; color: var(--ink); font-size: 0.86rem; font-variant-numeric: tabular-nums; text-align: center; overflow-wrap: anywhere; }
.cv2-slider { display: flex; align-items: center; gap: 10px; width: min(400px, 100%); }
.cv2-slider span { flex: none; color: var(--muted); font-size: 0.82rem; font-weight: 700; }
.cv2-slider input { flex: 1; min-width: 0; height: 40px; margin: 0; accent-color: var(--blue); touch-action: pan-y; }
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
    let state = { lessonId: "", steps: {}, picks: {}, figs: {}, recorded: false };

    // 圖的滑桿：只換那一張圖（不整頁重繪 —— 拖動時每一格都重繪整課太貴）；值記在 state.figs，
    // 之後別的動作重繪時圖停在原地。委派在 document 上，app.js 重繪換掉 DOM 也不用重綁。
    if (typeof document !== "undefined" && document.addEventListener) {
      document.addEventListener("input", (event) => {
        const input = event.target;
        if (!input || !input.matches || !input.matches("[data-cv2-slider]")) return;
        const data = lessonData(state.lessonId);
        const k = Number(input.dataset.cv2Slider);
        const fig = data && (data.figures || [])[k];
        const node = input.closest("[data-cv2-fig]");
        if (!fig || !node) return;
        const value = Number(input.value);
        state.figs = { ...state.figs, [k]: value };
        const shown = window.BuzzCourseFigures.view(fig, value, escapeAttr);
        node.querySelector("[data-cv2-plot]").innerHTML = shown.plot;
        node.querySelector("[data-cv2-readout]").textContent = shown.readout;
      });
    }

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

      // 圖：after = 觀念段落的索引（預設 0，第一段之後）或 "examples"（範例區的最後）
      const Figures = window.BuzzCourseFigures;
      const figures = (data.figures || []).map((fig, k) => ({ fig, k, after: fig.after === undefined ? 0 : fig.after }));
      const figuresAt = (slot) => figures.filter((f) => f.after === slot)
        .map(({ fig, k }) => Figures.renderFigure(fig, k, state.figs[k], escapeAttr, escapeHtml)).join("");
      const concept = data.concept.map((part, i) => {
        const body = `${part.body.map(para).join("")}${tex(part.tex)}${figuresAt(i)}`;
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
              ${figuresAt("examples")}
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
        state = { lessonId: id, steps: {}, picks: {}, figs: {}, recorded: false };
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

/* ── 課程的圖（lesson.figures）──
   一張圖是靜態的 graph（照題目附圖的格式，交給 BuzzGraphRender.renderProblemGraph 畫），
   或一個 widget：一根滑桿、決定性的、不動滑桿時也是一張有意義的靜態圖。
   widget 只是「滑桿值 → graph 規格＋一行讀數」的純函式，畫圖一律走同一支 renderProblemGraph
   （ε-δ 那種借 BuzzEpsilonGame.draw）；validate_course_v2 也用這裡的 build 驗每一張圖。

   種類（參數見 tools/content/course_v2/SCHEMA.md）：
     secant-tangent  割線轉成切線（滑 h）          riemann        矩形和（滑 n）
     taylor          Taylor 多項式（滑階數）       epsilon-delta  ε 帶與 δ 帶（滑 ε 或 δ）
     family          帶參數的曲線族（滑參數）       accumulation   面積函數 A(x) 與它的切線（滑 x）
     zoom            放大／拉遠鏡頭（滑倍率）       approach       兩點從左右滑向 a（滑「多靠近」） */
(function () {
  "use strict";

  const render = () => window.BuzzGraphRender;
  const compile = (expr) => render().graphCurveFn(expr);
  const SUBS = "₀₁₂₃₄₅₆₇₈₉";
  const sub = (n) => String(n).split("").map((d) => SUBS[Number(d)] || d).join("");
  const num = (v, digits) => {
    if (!Number.isFinite(v)) return "—";
    const text = Math.abs(v) >= 1e5 ? v.toExponential(2) : v.toFixed(digits === undefined ? (Math.abs(v) >= 1000 ? 1 : 3) : digits);
    return text.replace(/^-/, "−");
  };
  // f：字串，或分段 [{ expr, domain:[a,b] }]（跳躍、分段定義）
  function fnOf(f) {
    if (typeof f === "string") return compile(f);
    if (!Array.isArray(f) || !f.length) return null;
    const pieces = f.map((p) => ({ fn: compile(p.expr), a: Number(p.domain[0]), b: Number(p.domain[1]) }));
    if (pieces.some((p) => !p.fn)) return null;
    return (x) => { const p = pieces.find((q) => x >= q.a && x <= q.b); return p ? p.fn(x) : NaN; };
  }
  const curvesOf = (f, extra) => (typeof f === "string" ? [{ expr: f, ...extra }] : (f || []).map((p) => ({ expr: p.expr, domain: p.domain, ...extra })));
  // 數值積分（Simpson）：讀數與 A(x) 用；a > b 時帶負號
  function integrate(f, a, b, n) {
    if (a === b) return 0;
    const m = 2 * Math.ceil((n || 400) / 2);
    const h = (b - a) / m;
    let s = f(a) + f(b);
    for (let i = 1; i < m; i += 1) s += (i % 2 ? 4 : 2) * f(a + i * h);
    return (s * h) / 3;
  }
  const line = (m, x0, y0) => `(${y0})+(${m})*(x-(${x0}))`;
  const merge = (graph, extra) => {
    if (!extra) return graph;
    ["curves", "points", "labels", "dashed", "fills", "arrows", "polylines"].forEach((key) => {
      if (Array.isArray(extra[key])) graph[key] = (graph[key] || []).concat(extra[key]);
    });
    return graph;
  };
  const base = (w) => ({ window: w.window.slice(), ...(w.equal ? { equal: true } : {}) });

  const WIDGETS = {
    "secant-tangent": {
      slider: (w) => ({ name: "h", min: w.h[0], max: w.h[1], step: (w.h[1] - w.h[0]) / 200, value: w.h[1] }),
      build(w, h) {
        const f = fnOf(w.f);
        const a = Number(w.a);
        const fa = f(a);
        const slope = (f(a + 1e-5) - f(a - 1e-5)) / 2e-5;
        const tiny = Math.abs(h) < 1e-9;
        const m = tiny ? slope : (f(a + h) - fa) / h;
        const graph = base(w);
        graph.curves = curvesOf(w.f, { color: "blue" }).concat(
          w.tangent === false ? [] : [{ expr: line(slope, a, fa), color: "muted", dashed: true, width: 1.6 }],
          [{ expr: line(m, a, fa), color: "red", width: 1.8 }]);
        graph.points = [{ x: a, y: fa, color: "ink" }].concat(tiny ? [] : [{ x: a + h, y: f(a + h), color: "red" }]);
        graph.labels = [{ x: a, y: fa, text: "P", anchor: "end", dx: -6, dy: -6 }].concat(tiny ? [] : [{ x: a + h, y: f(a + h), text: "Q", dx: 8, dy: 4 }]);
        return { graphs: [merge(graph, w.extra)], readout: `h = ${num(h, 2)} · 割線斜率 ${tiny ? "—" : num(m, 3)}${w.tangent === false ? "" : ` · 切線斜率 ${num(slope, 3)}`}` };
      }
    },
    riemann: {
      slider: (w) => ({ name: "n", min: w.n[0], max: w.n[1], step: 1, value: Math.min(w.n[1], Math.max(w.n[0], 4)) }),
      build(w, value) {
        const f = fnOf(w.f);
        const a = Number(w.a);
        const b = Number(w.b);
        const n = Math.max(1, Math.round(value));
        const dx = (b - a) / n;
        const shift = w.rule === "right" ? 1 : w.rule === "mid" ? 0.5 : 0;
        const graph = base(w);
        let sum = 0;
        graph.fills = [];
        for (let i = 0; i < n; i += 1) {
          const x0 = a + i * dx;
          const y = f(x0 + shift * dx);
          sum += y * dx;
          graph.fills.push({ pts: [[x0, 0], [x0, y], [x0 + dx, y], [x0 + dx, 0]], color: y >= 0 ? "blue" : "red", opacity: 0.2, stroke: y >= 0 ? "blue" : "red" });
        }
        graph.curves = curvesOf(w.f, { color: "ink", width: 2 });
        const exact = integrate(f, a, b, 2000);
        return { graphs: [merge(graph, w.extra)], readout: `n = ${n} · 矩形和 ${num(sum)} · 積分 ${num(exact)}` };
      }
    },
    taylor: {
      slider: (w) => ({ name: "n", min: w.order[0], max: w.order[1], step: 1, value: Math.min(w.order[1], w.order[0] + 1) }),
      // 多項式：Σ c_k (x − center)^k，係數由作者給（驗證器拿數值導數對過）
      poly(w, n) {
        const c = Number(w.center);
        return w.coeffs.slice(0, n + 1).map((k, i) => `(${compile(String(k))(0)})*(x-(${c}))^${i}`).join("+") || "0";
      },
      build(w, value) {
        const n = Math.round(value);
        const graph = base(w);
        graph.curves = curvesOf(w.f, { color: "blue", width: 2.6 }).concat([{ expr: WIDGETS.taylor.poly(w, n), color: "red", width: 2 }]);
        graph.points = [{ x: Number(w.center), y: fnOf(w.f)(Number(w.center)), color: "ink" }];
        let readout = `紅線 T${sub(n)}（n = ${n}）`;
        if (w.probe !== undefined) {
          const x = Number(w.probe);
          readout += ` · x = ${num(x, 1)}：T${sub(n)} ${num(compile(WIDGETS.taylor.poly(w, n))(x), 4)}，f ${num(fnOf(w.f)(x), 4)}`;
        }
        return { graphs: [merge(graph, w.extra)], readout };
      }
    },
    "epsilon-delta": {
      slider: (w) => ({ name: w.drive === "delta" ? "δ" : "ε", min: w.range[0], max: w.range[1], step: (w.range[1] - w.range[0]) / 200, value: w.range[1] }),
      spec: (w) => ({ f: w.f, at: w.at, limit: w.limit, hole: Boolean(w.hole), maxDelta: (w.window[1] - w.window[0]) / 2 }),
      build(w, value) {
        const game = window.BuzzEpsilonGame;
        const spec = WIDGETS["epsilon-delta"].spec(w);
        const eps = w.drive === "delta" ? Number(w.eps) : value;
        const delta = w.drive === "delta" ? value : game.maxDelta(spec, eps) * 0.9;
        const drawn = game.draw(spec, delta, eps, w.window);
        const readout = w.drive === "delta"
          ? `ε = ${num(eps, 2)} · δ = ${num(delta, 3)} · ${drawn.probe.ok ? "整段在綠帶裡" : "有一段跑出綠帶"}`
          : `ε = ${num(eps, 3)} → δ = ${num(delta, 4)} 就夠`;
        return { svg: drawn, readout };
      }
    },
    family: {
      slider: (w) => ({ name: w.param || "a", min: w.range[0], max: w.range[1], step: w.step || (w.range[1] - w.range[0]) / 100, value: w.value !== undefined ? w.value : w.range[0] }),
      expr: (w, v) => String(w.f).replace(new RegExp(`\\b${w.param || "a"}\\b`, "g"), `(${v})`),
      build(w, value) {
        const fam = WIDGETS.family;
        const graph = base(w);
        graph.curves = (w.trail || []).map((v) => ({ expr: fam.expr(w, v), color: "muted", width: 1.2 }))
          .concat([{ expr: fam.expr(w, value), color: "blue", width: 2.6 }]);
        let readout = `${w.param || "a"} = ${num(value, 2)}`;
        if (Array.isArray(w.area)) {
          const f = compile(fam.expr(w, value));
          const [a, b] = w.area.map(Number);
          graph.fills = [{ expr: fam.expr(w, value), from: Math.max(a, w.window[0]), to: Math.min(b, w.window[1]), color: "blue", opacity: 0.2 }];
          readout += ` · 面積 ${num(integrate(f, a, b, 4000))}`;
        }
        return { graphs: [merge(graph, w.extra)], readout };
      }
    },
    accumulation: {
      slider: (w) => ({ name: "x", min: w.range[0], max: w.range[1], step: (w.range[1] - w.range[0]) / 200, value: w.value !== undefined ? w.value : w.range[1] }),
      build(w, x) {
        const f = fnOf(w.f);
        const a = Number(w.a);
        const A = (t) => integrate(f, a, t, 200);
        const top = base(w);
        const pos = `((${w.f})+abs(${w.f}))/2`;
        const neg = `((${w.f})-abs(${w.f}))/2`;
        top.fills = [{ expr: pos, from: a, to: x, color: "blue", opacity: 0.25 }, { expr: neg, from: a, to: x, color: "red", opacity: 0.25 }];
        top.curves = curvesOf(w.f, { color: "ink", width: 2 });
        top.points = [{ x, y: f(x), color: "blue" }];
        top.labels = [{ x: w.window[0], y: w.window[3], text: " f", color: "muted" }];
        const [lo, hi] = [w.window[0], w.window[1]];
        const pts = [];
        for (let i = 0; i <= 120; i += 1) { const t = lo + ((hi - lo) * i) / 120; pts.push([t, A(t)]); }
        const Ax = A(x);
        const bottom = { window: (w.windowA || w.window).slice() };
        bottom.curves = [{ pts, color: "green", width: 2.2 }, { expr: line(f(x), x, Ax), color: "muted", dashed: true, width: 1.4 }];
        bottom.points = [{ x, y: Ax, color: "green" }];
        bottom.labels = [{ x: bottom.window[0], y: bottom.window[3], text: " A", color: "muted" }];
        return { graphs: [merge(top, w.extra), bottom], readout: `x = ${num(x, 2)} · A(x) ${num(Ax)} · 切線斜率 = f(x) = ${num(f(x))}` };
      }
    },
    zoom: {
      slider: (w) => ({ name: w.out ? "拉遠" : "放大", min: 0, max: w.levels, step: w.levels / 120, value: 0 }),
      build(w, v) {
        const k = Math.pow(10, w.out ? v : -v);
        const [cx, cy] = w.center.map(Number);
        const [x0, x1, y0, y1] = w.window.map(Number);
        // axes "x"：只縮放 x；yPower 2：y 用倍率的平方縮（x² 這類曲線放大後形狀不變，看得出「一路被夾著」）
        const ky = w.axes === "x" ? 1 : Math.pow(k, w.yPower || 1);
        const graph = { window: [cx + (x0 - cx) * k, cx + (x1 - cx) * k, cy + (y0 - cy) * ky, cy + (y1 - cy) * ky] };
        graph.curves = w.curves.map((c) => ({ ...c, steps: c.steps || 600 }));
        if (w.point !== false) graph.points = [{ x: cx, y: cy, color: "ink" }];
        const merged = merge(graph, w.extra);
        const factor = Math.pow(10, v);
        const digits = Math.min(6, Math.max(0, Math.ceil(-Math.log10(graph.window[1] - graph.window[0])) + 1));
        return { graphs: [merged], readout: `${w.out ? "拉遠" : "放大"} ×${factor >= 10 ? Math.round(factor).toLocaleString("en-US") : num(factor, 1)} · x 從 ${num(graph.window[0], digits)} 到 ${num(graph.window[1], digits)}` };
      }
    },
    approach: {
      slider: () => ({ name: "靠近", min: 0, max: 1, step: 0.01, value: 0 }),
      build(w, s) {
        const f = fnOf(w.f);
        const a = Number(w.a);
        const [dmin, dmax] = w.range.map(Number);
        const d = dmax * Math.pow(dmin / dmax, s);
        const digits = Math.min(6, Math.max(2, Math.ceil(-Math.log10(d)) + 1));
        const graph = base(w);
        graph.curves = curvesOf(w.f, { color: "blue" });
        graph.dashed = [[[a, w.window[2]], [a, w.window[3]]]];
        graph.points = [];
        const sides = w.side === "left" ? [-1] : w.side === "right" ? [1] : [-1, 1];
        const read = sides.map((side) => {
          const x = a + side * d;
          const y = f(x);
          if (Number.isFinite(y) && y >= w.window[2] && y <= w.window[3]) {
            graph.points.push({ x, y, color: side < 0 ? "violet" : "green" });
            graph.arrows = (graph.arrows || []).concat([{ from: [x + side * (w.window[1] - w.window[0]) * 0.08, y], to: [x, y], color: side < 0 ? "violet" : "green" }]);
          }
          return `f(${num(x, digits)}) = ${num(y, 3)}`;
        });
        return { graphs: [merge(graph, w.extra)], readout: read.join(" · ") };
      }
    }
  };

  const sliderOf = (fig) => {
    const w = fig.widget;
    const s = WIDGETS[w.type].slider(w);
    // 作者可以指定不動滑桿時的那一格（要是一張有意義的靜態圖）
    if (w.value !== undefined) s.value = Number(w.value);
    return s;
  };

  // 滑桿值 → { plot: HTML, readout }
  function view(fig, value, escapeAttr) {
    if (fig.graph) return { plot: render().renderProblemGraph({ graph: fig.graph }, { label: fig.caption }, escapeAttr), readout: "" };
    const built = WIDGETS[fig.widget.type].build(fig.widget, value);
    if (built.svg) {
      return {
        plot: `<div class="problem-graph"><svg class="cv2-eps" viewBox="0 0 ${built.svg.width} ${built.svg.height}" role="img" aria-label="${escapeAttr(fig.caption)}">${built.svg.svg}</svg></div>`,
        readout: built.readout
      };
    }
    return { plot: built.graphs.map((graph) => render().renderProblemGraph({ graph }, { label: fig.caption }, escapeAttr)).join(""), readout: built.readout };
  }

  function renderFigure(fig, index, value, escapeAttr, escapeHtml) {
    if (!fig.widget) {
      return `<figure class="cv2-figure" data-cv2-fig="${index}"><div data-cv2-plot>${view(fig, 0, escapeAttr).plot}</div><figcaption>${escapeHtml(fig.caption)}</figcaption></figure>`;
    }
    const s = sliderOf(fig);
    const v = value === undefined ? s.value : value;
    const shown = view(fig, v, escapeAttr);
    return `
      <figure class="cv2-figure is-widget" data-cv2-fig="${index}">
        <div data-cv2-plot>${shown.plot}</div>
        <p class="cv2-readout" data-cv2-readout aria-live="polite">${escapeHtml(shown.readout)}</p>
        <label class="cv2-slider"><span>${escapeHtml(s.name)}</span><input type="range" data-cv2-slider="${index}" min="${s.min}" max="${s.max}" step="${s.step}" value="${v}" aria-label="${escapeAttr(`${s.name}：${fig.caption}`)}"></label>
        <figcaption>${escapeHtml(fig.caption)}</figcaption>
      </figure>`;
  }

  window.BuzzCourseFigures = { WIDGETS, fnOf, integrate, sliderOf, view, renderFigure };
})();
