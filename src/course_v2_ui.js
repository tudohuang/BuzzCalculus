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
// 版面（書本式單欄，細節見 STYLE 與 renderLesson）：觀念①要在手機第一屏；手機黏位置條、≥ 960px 換左側目錄。
// 有 sections 的課預設一節一屏（course_sections.js），全文就是這一頁。
// 狀態：哪一課、範例揭到第幾步、小測選過哪些；收合段落用 <details data-keep>（app.js 重繪時接回）。
// 進度存 records.courseV2[id]；推薦題對錯直接看 records.problemStats。

(function () {
  "use strict";

  const TIER_NAMES = ["", "完成", "熟練", "全破"];
  const PASS = 3;

  const STYLE = `
/* ── 課程表：Stage 是有標題的段落、章是小標、課是一列清單；不套框 ── */
.cv2-index { display: grid; gap: 18px; width: 100%; max-width: 760px; margin: 0 auto; }
.cv2-index .course-progress { margin: 2px 0 4px; }
.cv2-stages { display: grid; border-top: 1px solid var(--line); }
.cv2-stage { border-bottom: 1px solid var(--line); }
.cv2-stage > summary { display: grid; grid-template-columns: auto minmax(0, 1fr) auto auto; align-items: center; column-gap: 12px; row-gap: 6px; min-height: 56px; padding: 10px 2px; cursor: pointer; list-style: none; }
.cv2-stage > summary::-webkit-details-marker, .cv2-fold > summary::-webkit-details-marker, .cv2-goals > summary::-webkit-details-marker { display: none; }
.cv2-stage > summary > svg { color: var(--muted); transition: transform 0.15s ease; }
.cv2-stage[open] > summary > svg { transform: rotate(90deg); }
.cv2-stage-name { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; min-width: 0; }
.cv2-stage-name strong { font-size: 1.04rem; }
.cv2-stage-no { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: var(--surface); color: var(--muted); font-weight: 800; font-size: 0.86rem; font-variant-numeric: tabular-nums; }
.cv2-stage.is-done .cv2-stage-no { background: var(--green); color: #fff; }
.cv2-branch { padding: 1px 8px; border-radius: 999px; background: color-mix(in srgb, var(--violet) 12%, var(--panel)); color: var(--violet); font-size: 0.72rem; font-style: normal; font-weight: 700; }
.cv2-count { flex: none; color: var(--muted); font-size: 0.8rem; font-variant-numeric: tabular-nums; }
.cv2-bar { grid-column: 2 / -1; position: relative; height: 3px; border-radius: 999px; background: var(--line); overflow: hidden; }
.cv2-bar::after { content: ""; position: absolute; inset: 0 auto 0 0; width: var(--pct, 0%); background: var(--green); }
.cv2-stage-body { display: grid; gap: 14px; padding: 2px 0 18px 42px; }
.cv2-chapter-label { display: flex; align-items: baseline; gap: 8px; margin: 0 0 2px; color: var(--muted); font-size: 0.76rem; font-weight: 800; letter-spacing: 0.06em; }
.cv2-chapter-label small { font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: 0; }
.cv2-rows { display: grid; margin: 0; padding: 0; list-style: none; }
.cv2-row { display: grid; grid-template-columns: 2.4em minmax(0, 1fr) auto 10px; align-items: center; gap: 10px; width: 100%; min-height: 44px; padding: 6px 8px; border: 0; border-radius: 8px; background: transparent; color: var(--ink); font: inherit; text-align: left; cursor: pointer; }
.cv2-row:hover { background: color-mix(in srgb, var(--ink) 5%, transparent); }
.cv2-row.is-next { background: color-mix(in srgb, var(--gold) 12%, transparent); box-shadow: inset 3px 0 0 var(--gold); }
.cv2-row.is-soon { cursor: default; color: var(--muted); }
.cv2-row.is-soon:hover { background: transparent; }
.cv2-row-no { color: var(--muted); font-size: 0.8rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.cv2-row strong { font-size: 0.95rem; font-weight: 600; overflow-wrap: anywhere; }
.cv2-row.is-soon strong { font-weight: 500; }
.cv2-row small { color: var(--muted); font-size: 0.76rem; white-space: nowrap; font-variant-numeric: tabular-nums; }
.cv2-dot { width: 8px; height: 8px; border-radius: 50%; background: transparent; box-shadow: inset 0 0 0 1.5px var(--line-strong); }
.cv2-dot.t1 { background: var(--green); box-shadow: none; }
.cv2-dot.t2 { background: var(--blue); box-shadow: none; }
.cv2-dot.t3 { background: var(--gold); box-shadow: none; }
.cv2-tier { padding: 2px 8px; border-radius: 999px; font-size: 0.74rem; font-style: normal; font-weight: 700; white-space: nowrap; background: color-mix(in srgb, var(--green) 12%, var(--panel)); color: var(--green); }
.cv2-tier.t2 { background: color-mix(in srgb, var(--blue) 12%, var(--panel)); color: var(--blue); }
.cv2-tier.t3 { background: color-mix(in srgb, var(--gold) 18%, var(--panel)); color: var(--gold-dark); }
/* 清單／地圖切換：跟進度條同一列（地圖的樣式在 course_map.js，打開地圖才載） */
.cv2-viewbar { display: flex; align-items: center; gap: 14px; }
.cv2-viewbar .course-progress { flex: 1; min-width: 0; margin: 0; }
.cv2-seg { display: inline-flex; flex: none; padding: 3px; border-radius: 999px; background: color-mix(in srgb, var(--ink) 7%, transparent); }
.cv2-seg button { min-width: 52px; min-height: 40px; padding: 0 14px; border: 0; border-radius: 999px; background: none; color: var(--muted); font: inherit; font-size: 0.86rem; font-weight: 700; cursor: pointer; }
.cv2-seg button[aria-pressed="true"] { background: var(--panel); color: var(--ink); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12); }
.cv2-map { position: relative; width: 100%; height: 70vh; min-height: 360px; }
.cv2-index.is-map { max-width: none; }
.cv2-index.is-map .page-head .action-row { display: none; }

/* ── 單課：書本式單欄。只有範例與可折疊段落有淡底＋左邊線，其他靠標題與留白分段 ── */
.cv2-layout { display: grid; grid-template-columns: minmax(0, 1fr); }
.cv2-layout > * { min-width: 0; }
.cv2-toc { display: none; }
.cv2-lesson { --cv2-top: 0px; --cv2-strip: 0px; display: block; width: 100%; max-width: 40em; margin: 0 auto; padding: 0; border: 0; background: none; color: var(--ink); font-size: 1rem; }
.cv2-lesson sub, .cv2-lesson sup { font-size: 0.72em; line-height: 0; }
.cv2-lesson p, .cv2-lesson li { line-height: 1.85; overflow-wrap: anywhere; }
.cv2-lesson .cv2-head { display: block; margin: 0 0 6px; }
.cv2-kicker { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; margin: 0 0 4px; }
.cv2-kicker .section-label { margin: 0; letter-spacing: 0.06em; }
.cv2-back { display: inline-flex; align-items: center; gap: 2px; min-height: 40px; margin: -8px 0 -8px -6px; padding: 0 6px; border: 0; border-radius: 8px; background: none; color: var(--blue); font: inherit; font-size: 0.82rem; font-weight: 700; cursor: pointer; }
.cv2-back:hover { background: color-mix(in srgb, var(--blue) 8%, transparent); }
.cv2-back span { font-size: 1.2em; line-height: 1; }
.cv2-kicker .cv2-sep { color: var(--line-strong); }
.cv2-lesson .cv2-head h2 { margin: 0; font-size: 1.6rem; line-height: 1.35; letter-spacing: -0.02em; text-wrap: balance; }
.cv2-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; margin: 6px 0 0; color: var(--muted); font-size: 0.86rem; font-variant-numeric: tabular-nums; }
.cv2-meta > span + span::before { content: "·"; margin-right: 12px; color: var(--line-strong); }
.cv2-intro { display: grid; gap: 0; margin: 8px 0 0; color: var(--muted); font-size: 0.9rem; }
.cv2-prereq { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 6px; margin: 0; }
.cv2-link { display: inline-block; margin: -9px 0; padding: 9px 1px; border: 0; background: none; color: var(--blue); font: inherit; line-height: inherit; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; cursor: pointer; }
.cv2-maplink { margin: -9px 0 -9px auto; color: var(--muted); font-size: 0.84rem; }
.cv2-goals > summary { display: inline-flex; align-items: center; gap: 6px; min-height: 40px; color: var(--muted); font-weight: 700; cursor: pointer; list-style: none; }
.cv2-goals > summary svg, .cv2-fold > summary svg { flex: none; width: 16px; height: 16px; transition: transform 0.15s ease; }
.cv2-goals[open] > summary svg, .cv2-fold[open] > summary svg { transform: rotate(90deg); }
.cv2-goals > summary small { font-weight: 600; }
.cv2-goals .cv2-list { margin: 0 0 6px; color: var(--ink); }
.cv2-list { display: grid; gap: 4px; margin: 0; padding-left: 1.3em; }

/* 位置條：觀念 ─ 範例 ─ 小測 ─ 練習。貼在頂列下面；z-index 比頂列（20）與底部分頁列（30）低 */
.cv2-strip { position: sticky; top: var(--cv2-top); z-index: 4; display: grid; grid-auto-columns: minmax(0, 1fr); grid-auto-flow: column; margin: 10px 0 22px; padding: 0; border-bottom: 1px solid var(--line); background: var(--paper); }
.cv2-strip button { position: relative; min-height: 42px; padding: 0 4px; border: 0; background: none; color: var(--muted); font: inherit; font-size: 0.84rem; font-weight: 700; cursor: pointer; }
.cv2-strip button + button::before { content: ""; position: absolute; left: -6px; top: 50%; width: 12px; height: 1px; background: var(--line-strong); }
.cv2-strip button.is-on { color: var(--ink); }
.cv2-strip button.is-on::after { content: ""; position: absolute; left: 22%; right: 22%; bottom: -1px; height: 2px; border-radius: 2px; background: var(--gold); }
.cv2-strip .cv2-read { position: absolute; left: 0; bottom: -1px; height: 1px; width: var(--cv2-read, 0%); background: color-mix(in srgb, var(--gold) 70%, var(--line)); pointer-events: none; }
.cv2-lesson [data-cv2-mark] { scroll-margin-top: calc(var(--cv2-top) + var(--cv2-strip) + 14px); }

.cv2-sec { display: block; margin: 0; padding: 0; border: 0; border-radius: 0; background: none; }
.cv2-sec + .cv2-sec { margin-top: 40px; padding-top: 4px; }
.cv2-sec-title { display: flex; align-items: baseline; gap: 10px; margin: 0 0 14px; font-size: 1.24rem; line-height: 1.4; letter-spacing: -0.01em; }
.cv2-sec-title small { color: var(--muted); font-size: 0.8rem; font-weight: 600; letter-spacing: 0; }
.cv2-part { display: block; }
.cv2-part + .cv2-part, .cv2-part + .cv2-fold, .cv2-fold + .cv2-part, .cv2-fold + .cv2-fold { margin-top: 28px; }
.cv2-part h3 { margin: 0 0 8px; font-size: 1.1rem; line-height: 1.5; }
.cv2-part p { margin: 0; }
.cv2-part p + p, .cv2-part p + .course-concept-math, .cv2-part .course-concept-math + p { margin-top: 12px; }
.cv2-lesson .course-concept-math { margin: 12px 0; padding: 4px 0; border-radius: 0; background: none; overflow-x: auto; }
.cv2-math .katex { font-size: 1.08em; }
.cv2-glue { white-space: nowrap; }
.cv2-math .katex-display { margin: 0; }

.cv2-fold { margin: 0; border-left: 3px solid color-mix(in srgb, var(--blue) 45%, var(--line)); border-radius: 0 10px 10px 0; background: color-mix(in srgb, var(--blue) 5%, var(--paper)); }
.cv2-fold > summary { display: flex; align-items: center; gap: 8px; min-height: 46px; padding: 6px 14px; color: var(--ink); font-weight: 700; cursor: pointer; list-style: none; }
.cv2-fold > summary > span { flex: 1; min-width: 0; line-height: 1.5; }
.cv2-fold > summary em::after { content: "展開"; }
.cv2-fold[open] > summary em::after { content: "收起"; }
.cv2-fold > summary em { flex: none; color: var(--muted); font-size: 0.76rem; font-style: normal; font-weight: 600; }
.cv2-fold > .cv2-part { padding: 0 16px 14px; }

.cv2-example { display: block; margin: 0; padding: 14px 16px 16px; border-left: 3px solid var(--gold); border-radius: 0 10px 10px 0; background: color-mix(in srgb, var(--gold) 7%, var(--paper)); }
.cv2-example + .cv2-example { margin-top: 18px; }
.cv2-example-title { margin: 0 0 4px; font-size: 0.84rem; font-weight: 700; color: var(--gold-dark); }
.cv2-example-title span { color: var(--ink); }
.cv2-prompt { margin: 0; padding: 0; border: 0; background: none; font-weight: 600; }
.cv2-lesson .course-steps { display: grid; gap: 8px; margin: 12px 0 0; padding: 0; list-style: none; }
.cv2-lesson .course-step { grid-template-columns: 22px minmax(0, 1fr); gap: 10px; }
.cv2-lesson .course-step > div { min-width: 0; }
.cv2-lesson .course-step-no { width: 22px; height: 22px; margin-top: 5px; background: none; box-shadow: inset 0 0 0 1.5px var(--gold); color: var(--gold-dark); font-size: 0.74rem; }
.cv2-lesson .course-step p { line-height: 1.85; }
.cv2-reveal { display: inline-flex; align-items: center; gap: 6px; min-height: 40px; margin-top: 10px; padding: 0 14px 0 10px; border: 1px solid color-mix(in srgb, var(--gold) 45%, var(--line)); border-radius: 999px; background: var(--paper); color: var(--ink); font: inherit; font-size: 0.88rem; font-weight: 700; cursor: pointer; }
.cv2-reveal:hover { border-color: var(--gold); }
.cv2-reveal svg { width: 16px; height: 16px; }
.cv2-reveal small { color: var(--muted); font-size: 0.76rem; font-variant-numeric: tabular-nums; }
.cv2-lesson .course-answer { display: flex; align-items: baseline; gap: 6px; margin: 12px 0 0; padding: 0; border-radius: 0; background: none; color: var(--green); font-weight: 700; line-height: 1.7; }
.cv2-lesson .course-answer svg { flex: none; align-self: center; }
.cv2-note { margin: 6px 0 0; color: var(--muted); font-size: 0.9rem; }

.cv2-lesson .course-check { display: block; padding: 2px 0 2px 14px; border: 0; border-left: 3px solid transparent; border-radius: 0; background: none; }
.cv2-lesson .course-check + .course-check { margin-top: 26px; }
.cv2-lesson .course-check.is-wrong { border-left-color: color-mix(in srgb, var(--red) 55%, transparent); }
.cv2-lesson .course-check.is-right { border-left-color: color-mix(in srgb, var(--green) 60%, transparent); }
.cv2-lesson .course-check-ask { margin: 0 0 10px; font-weight: 600; }
.cv2-lesson .course-check-options { display: grid; gap: 8px; }
.cv2-lesson .course-option { min-height: 44px; padding: 8px 14px; border: 1px solid var(--line-strong); border-radius: 10px; background: transparent; line-height: 1.6; overflow-wrap: anywhere; }
.cv2-lesson .course-option:hover:not(:disabled) { border-color: var(--gold); }
.cv2-lesson .course-option.is-correct { border-color: var(--green); background: color-mix(in srgb, var(--green) 9%, transparent); }
.cv2-lesson .course-option.is-picked { border-color: var(--red); background: color-mix(in srgb, var(--red) 7%, transparent); }
.course-option:disabled { cursor: default; }
.cv2-lesson .course-check-why { margin: 10px 0 0; font-size: 0.92rem; line-height: 1.75; }
.cv2-quiz-result { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; margin: 22px 0 0; padding: 10px 14px; border-radius: 10px; background: color-mix(in srgb, var(--ink) 5%, transparent); }
.cv2-quiz-result.is-pass { background: color-mix(in srgb, var(--green) 10%, transparent); color: var(--green); }
.cv2-quiz-result strong { font-size: 1.1rem; font-variant-numeric: tabular-nums; }

.cv2-tiers { display: flex; flex-wrap: wrap; gap: 4px 0; margin: 0 0 12px; padding: 0; list-style: none; color: var(--muted); font-size: 0.84rem; }
.cv2-tiers li { display: inline-flex; align-items: baseline; gap: 6px; line-height: 1.6; }
.cv2-tiers li + li::before { content: "›"; margin: 0 10px; color: var(--line-strong); }
.cv2-tiers li strong { color: var(--ink); font-size: 0.88rem; }
.cv2-tiers li.is-on strong { color: var(--green); }
.cv2-practice { display: grid; margin: 0 0 12px; padding: 0; list-style: none; border-top: 1px solid var(--line); }
.cv2-practice li { display: grid; grid-template-columns: 1.6em minmax(0, 1fr); align-items: start; gap: 8px; padding: 10px 2px; border-bottom: 1px solid var(--line); }
.cv2-practice li > * { min-width: 0; }
.cv2-practice .math-inline { display: block; overflow-x: auto; max-height: 7.5em; overflow-y: hidden; }
.cv2-mark { color: var(--muted); font-weight: 800; text-align: center; line-height: 1.85; }
.cv2-mark.is-core { color: var(--gold-dark); }
.cv2-practice li.is-solved .cv2-mark { color: var(--green); }
.cv2-subhead { margin: 18px 0 8px; font-size: 1rem; }
.cv2-lesson .action-row { margin: 0; }
.cv2-nav { display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; margin: 44px 0 0; padding-top: 18px; border-top: 1px solid var(--line); }
.cv2-nav .button { max-width: 100%; }

/* 圖：手機滿欄寬、桌機最寬 560px 置中 */
.cv2-figure { display: grid; justify-items: center; gap: 6px; width: 100%; max-width: 560px; margin: 20px auto; }
.cv2-figure > * { min-width: 0; max-width: 100%; }
.cv2-figure [data-cv2-plot] { display: grid; gap: 8px; width: 100%; }
.cv2-figure .problem-graph svg { width: 100%; }
.cv2-video.is-off .cv2-video-box { display: none; }
.cv2-video-box { width: 100%; aspect-ratio: 16 / 9; border-radius: 10px; background: color-mix(in srgb, var(--ink) 6%, var(--paper)); }
.cv2-figure figcaption { color: var(--muted); font-size: 0.86rem; line-height: 1.6; text-align: center; }
.cv2-readout { margin: 0; color: var(--ink); font-size: 0.86rem; font-variant-numeric: tabular-nums; text-align: center; overflow-wrap: anywhere; }
.cv2-slider { display: flex; align-items: center; gap: 10px; width: 100%; }
.cv2-slider span { flex: none; color: var(--muted); font-size: 0.82rem; font-weight: 700; }
.cv2-slider input { flex: 1; min-width: 0; height: 40px; margin: 0; accent-color: var(--blue); touch-action: pan-y; }

@media (min-width: 768px) {
  .cv2-lesson { font-size: 1.0625rem; }
  .cv2-lesson .cv2-head h2 { font-size: 2rem; }
}
/* 桌機／平板橫放：左邊是這一課的目錄（黏著、點了跳過去、目前段落亮起），位置條收起來 */
@media (min-width: 960px) {
  .cv2-layout { grid-template-columns: 188px minmax(0, 40em); justify-content: center; column-gap: clamp(28px, 4vw, 56px); }
  .cv2-lesson { margin: 0; }
  .cv2-strip { display: none; }
  .cv2-intro { margin-bottom: 30px; }
  .cv2-toc { display: block; position: sticky; top: 28px; align-self: start; max-height: calc(100vh - 56px); overflow-y: auto; padding-top: 6px; }
  .cv2-toc p { margin: 0 0 8px; padding-left: 12px; color: var(--muted); font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; }
  .cv2-toc ol { display: grid; margin: 0; padding: 0; list-style: none; border-left: 1px solid var(--line); }
  .cv2-toc button { display: block; width: 100%; min-height: 40px; margin-left: -1px; padding: 6px 8px 6px 12px; border: 0; border-left: 2px solid transparent; background: none; color: var(--muted); font: inherit; font-size: 0.84rem; line-height: 1.45; text-align: left; cursor: pointer; }
  .cv2-toc button:hover { color: var(--ink); }
  .cv2-toc button.is-fold { font-style: italic; }
  .cv2-toc button.is-group { margin-top: 10px; font-weight: 700; }
  .cv2-toc button.is-on { border-left-color: var(--gold); color: var(--ink); font-weight: 700; }
}
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

    /* ── 文字：行內數學 $…$ ＋ 跳脫 ＋ 上下標 ＋〈課名〉變成連到那一課的連結 ──
       行內數學寫成 $…$（KaTeX，跟題目同一份 assets/vendor/katex）：先切出來交給 KaTeX，
       throwOnError:false —— 一段寫壞的式子只會變成紅字，不會讓整頁畫不出來。\$ 是字面上的錢號。
       $…$ 以外還是 Unicode 純文字（轉換期間兩種寫法並存），上下標照作者的寫法：lim_{x→0}、Σ_{n=1}^∞、a_n。
       畫成 <sub>/<sup>，只認大括號一層、或底線／次方後面單一個字元；這一層碰不到 $…$ 裡面。 */
    const SCRIPT_CHAR = "[A-Za-z0-9α-ωΑ-Ω∞πθφ+\\-−′]";
    const SUB_SUP = [
      [/_\{([^{}]*)\}/g, "<sub>$1</sub>"],
      [/\^\{([^{}]*)\}/g, "<sup>$1</sup>"],
      [new RegExp(`_(${SCRIPT_CHAR})`, "g"), "<sub>$1</sub>"],
      [new RegExp(`\\^(${SCRIPT_CHAR})`, "g"), "<sup>$1</sup>"]
    ];
    // 切段：偶數格是文字、奇數格是數學。不用 lookbehind 正規式 —— iOS 16.4 以前的 Safari 一看到就整支檔解析失敗。
    // 落單的 $（沒有成對）當成文字。
    function splitMath(text) {
      const parts = [];
      let buf = "";
      let open = -1;
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        if (ch === "$" && text[i - 1] !== "\\") {
          if (open < 0) { parts.push(buf); buf = ""; open = i; } else { parts.push(buf); buf = ""; open = -1; }
          continue;
        }
        buf += ch;
      }
      if (open >= 0) parts[parts.length - 1] += `$${buf}`;
      else parts.push(buf);
      return parts;
    }
    const mathCache = new Map();
    function inlineMath(tex) {
      if (mathCache.has(tex)) return mathCache.get(tex);
      let html = "";
      if (window.katex) {
        try {
          html = window.katex.renderToString(tex, { displayMode: false, throwOnError: false, strict: "ignore", output: "htmlAndMathml" });
        } catch (_error) {
          html = "";
        }
      }
      const out = `<span class="cv2-math">${html || (window.BuzzTexLite ? window.BuzzTexLite.renderLiteTex(tex, false) : escapeHtml(tex))}</span>`;
      if (html) mathCache.set(tex, out);
      return out;
    }
    const plain = (text) => SUB_SUP.reduce((out, [pattern, html]) => out.replace(pattern, html), escapeHtml(String(text).replace(/\\\$/g, "$")));
    // 把文字切成「數學」與「文字」兩種段，文字段再交給 each 處理
    // 式子後面緊跟的全形標點黏在式子上（不然「，」會被擠到下一行開頭）；只黏短式子，長式子要留著能斷行
    const GLUE = /^[，。、；：！？）」』]/;
    const withMath = (text, each) => {
      const parts = splitMath(String(text || ""));
      return parts.map((part, i) => {
        if (!(i % 2)) return each(i > 0 && parts[i - 1].length <= 40 && GLUE.test(part) && parts[i - 1].trim() ? part.slice(1) : part);
        if (!part.trim()) return "";
        const next = parts[i + 1] || "";
        return part.length <= 40 && GLUE.test(next) ? `<span class="cv2-glue">${inlineMath(part)}${escapeHtml(next[0])}</span>` : inlineMath(part);
      }).join("");
    };
    const fmt = (text) => withMath(text, plain);
    function rich(text, context) {
      return withMath(text, (chunk) => chunk.split(/(〈[^〈〉]+〉)/).map((part) => {
        const hit = /^〈([^〈〉]+)〉$/.exec(part);
        if (!hit) return plain(part);
        const ids = (titleIds[hit[1]] || []).filter((id) => meta[id].available);
        // 同名的課（例如一維與二維的「臨界點」）：先找這一課的先修／相關／下一課裡的那一個
        const near = context ? [...(context.related || []), ...(context.prerequisites || []), ...(context.next || [])] : [];
        const id = ids.find((x) => near.includes(x)) || ids[0];
        if (!id || (context && id === context.id)) return escapeHtml(part);
        return `<button type="button" class="cv2-link" data-action="open-course-lesson" data-lesson-id="${escapeAttr(id)}">${escapeHtml(part)}</button>`;
      }).join(""));
    }
    const lessonLink = (id) => (meta[id] ? (meta[id].available
      ? `<button type="button" class="cv2-link" data-action="open-course-lesson" data-lesson-id="${escapeAttr(id)}">〈${escapeHtml(meta[id].title)}〉</button>`
      : `<span>〈${escapeHtml(meta[id].title)}〉</span>`) : "");
    const tierPill = (tier) => (tier ? `<em class="cv2-tier t${tier}">${TIER_NAMES[tier]}</em>` : "");

    /* ── 課程表 ── */
    function renderIndex(records) {
      prefetchAll();
      if (indexView === "map") {
        if (typeof queueMicrotask === "function") queueMicrotask(setupMap); else window.setTimeout(setupMap, 0);
      }
      const next = nextLesson(records);
      const done = mainPath.filter((m) => isDone(records, m)).length;
      const pct = mainPath.length ? Math.round((done / mainPath.length) * 100) : 0;
      const openStage = next ? next.stage : null;
      // 一課一列：課號 · 課名 · 分鐘 · 狀態點（完成綠／熟練藍／全破金；字給螢幕閱讀器與測試）
      const row = (m) => {
        if (!m.available) {
          return `<li><span class="cv2-row is-soon"><span class="cv2-row-no">${m.no}</span><strong>${escapeHtml(m.title)}</strong><small>尚未開放</small><i></i></span></li>`;
        }
        const tier = tierOf(records, m);
        return `<li><button type="button" class="cv2-row ${next === m ? "is-next" : ""} ${tier ? "is-done" : ""}" data-action="open-course-lesson" data-lesson-id="${escapeAttr(m.id)}"><span class="cv2-row-no">${m.no}</span><strong>${escapeHtml(m.title)}</strong><small>${m.read} 分</small><i class="cv2-dot ${tier ? `t${tier}` : ""}" title="${tier ? TIER_NAMES[tier] : "還沒完成"}">${tier ? `<span class="sr-only">${TIER_NAMES[tier]}</span>` : ""}</i></button></li>`;
      };
      // Stage 是有標題的段落（細進度條），章是小標，課是平的清單；只有目前的 Stage 展開
      const stages = outline.stages.map((stage) => {
        const inStage = order.filter((m) => m.stage === stage);
        const ready = inStage.filter((m) => m.available);
        const stageDone = ready.filter((m) => isDone(records, m)).length;
        const stagePct = ready.length ? Math.round((stageDone / ready.length) * 100) : 0;
        const chapters = stage.chapters.map((chapter) => {
          const rows = order.filter((m) => m.chapter === chapter);
          const chapterDone = rows.filter((m) => m.available && isDone(records, m)).length;
          return `
            <section class="cv2-chapter">
              <p class="cv2-chapter-label">${escapeHtml(chapter.title)}<small>${chapterDone} / ${rows.length}</small></p>
              <ol class="cv2-rows">${rows.map(row).join("")}</ol>
            </section>`;
        }).join("");
        return `
          <details class="cv2-stage ${ready.length && stageDone === ready.length ? "is-done" : ""}" data-keep="cv2-stage-${stage.n}" ${openStage === stage ? "open" : ""}>
            <summary>
              <span class="cv2-stage-no">${stage.n}</span>
              <span class="cv2-stage-name"><strong>${escapeHtml(stage.title)}</strong>${stage.branch ? `<em class="cv2-branch">支線</em>` : ""}</span>
              <small class="cv2-count">${stageDone} / ${inStage.length}</small>
              ${icon("chevron-right")}
              <i class="cv2-bar" style="--pct:${stagePct}%"></i>
            </summary>
            <div class="cv2-stage-body">${chapters}</div>
          </details>`;
      }).join("");
      return `
        <main class="screen">
          <section class="course-index cv2-index ${indexView === "map" ? "is-map" : ""}">
            <div class="page-head">
              <div>
                <p class="section-label">課程</p>
                <h2>微積分 · ${order.length} 課</h2>
              </div>
              <div class="action-row">
                ${next ? `<button class="button home-primary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(next.id)}">${icon("play")}${done || entryOf(records, next.id).openedAt ? "繼續" : "開始"}：${escapeHtml(label(next))}</button>` : ""}
              </div>
            </div>
            <div class="cv2-viewbar">
              <div class="course-progress"><strong>${done}<small> / ${mainPath.length} 課 · 主線</small></strong><i style="--pct:${pct}%"></i></div>
              <div class="cv2-seg" role="group" aria-label="檢視">${[["list", "清單"], ["map", "地圖"]].map(([key, name]) => `<button type="button" data-action="course-view" data-mode="${key}" aria-pressed="${indexView === key}">${name}</button>`).join("")}</div>
            </div>
            ${indexView === "map" ? `<div class="cv2-map" data-cv2-map><p class="panel-note">載入地圖…</p></div>` : `
            <div class="cv2-stages">${stages}</div>
            ${renderGraduationCard(records)}`}
          </section>
        </main>`;
    }

    /* ── 課程地圖（清單／地圖切換的「地圖」）──
       畫法與版面在 course_map.js ＋ course_v2/map.js（data-lazy="map"，第一次切到地圖才抓）。
       app 整頁重繪會換掉容器，所以每次畫完課程表就重新掛上去；相機與選取由地圖自己留著。 */
    let indexView = "list";
    let mapFocus = "";
    let mapLit = "";
    function mapOptions(records) {
      const next = nextLesson(records);
      return {
        lessons: order.map((m) => ({
          id: m.id, no: m.no, title: m.title, stageTitle: m.stage.title, branch: Boolean(m.stage.branch),
          read: m.read, total: m.total, available: m.available, tier: tierOf(records, m), opened: Boolean(entryOf(records, m.id).openedAt)
        })),
        stages: outline.stages,
        next: next ? order.indexOf(next) : -1,
        focusId: mapFocus,
        litId: mapLit,
        escapeHtml,
        escapeAttr,
        open: (id) => act("open-course-lesson", { lessonId: id })
      };
    }
    function setupMap() {
      const el = typeof document !== "undefined" && document.querySelector("[data-cv2-map]");
      if (!el) return;
      const mount = () => {
        if (!el.isConnected) return;
        if (window.BuzzCourseMap.attach(el, mapOptions(loadRecords()))) mapFocus = mapLit = "";
      };
      if (window.BuzzCourseMap && window.BUZZ_COURSE_MAP) return mount();
      Promise.resolve(deps.ensureLazy("map")).then(mount, () => {
        if (el.isConnected) el.innerHTML = `<p class="panel-note">地圖載不進來 —— 檢查一下網路再試一次。</p>`;
      });
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
    let secFail = false;
    const sec = (fn) => Promise.resolve(deps.ensureLazy("sections")).then(fn, () => { secFail = true; render(); });
    const secApi = (records, head) => { const m = meta[state.lessonId]; return { m, data: lessonData(m.id), records, head, state, fmt, rich, update, tierOf: (r) => tierOf(r, m), next: neighbour(m, 1), label, lessonLink, deps, act }; };

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

    /* ── 讀到哪裡：位置條（手機）與目錄（桌機）──
       每一個段落（觀念的每一小節、範例、小測、練習）掛 data-cv2-mark 與 data-cv2-group。
       IntersectionObserver 看段落跨過「頂列＋位置條下面一點」那條線；捲動另外更新位置條下面的閱讀進度。
       整頁重繪（innerHTML 換掉）之後 render 完的那個 microtask 重新接上；離開這一課就自己拆掉。 */
    const reading = { io: null, onScroll: null, frame: 0, group: "concept", mark: "c0" };
    function teardownReading() {
      if (reading.io) reading.io.disconnect();
      if (reading.frame) window.cancelAnimationFrame(reading.frame);
      reading.frame = 0;
      if (reading.onScroll) window.removeEventListener("scroll", reading.onScroll);
      reading.io = null;
      reading.onScroll = null;
    }
    function setupReading() {
      teardownReading();
      const root = typeof document !== "undefined" && document.querySelector(".cv2-lesson[data-cv2-reading]");
      reading.root = root || null;
      if (!root) return;
      // 手機的頂列是 sticky、橫跨整個寬度：位置條要貼在它下面。桌機的頂列是左側欄，不佔上方。
      const bar = document.querySelector(".topbar");
      let top = 0;
      if (bar) {
        const r = bar.getBoundingClientRect();
        if (r.width >= document.documentElement.clientWidth - 1 && r.top <= 0.5) top = Math.round(r.bottom);
      }
      root.style.setProperty("--cv2-top", `${top}px`);
      const strip = root.querySelector(".cv2-strip");
      const stripH = strip && strip.offsetParent ? strip.offsetHeight : 0;
      root.style.setProperty("--cv2-strip", `${stripH}px`);
      const targets = [...root.querySelectorAll("[data-cv2-mark]")];
      if (!targets.length) return;
      const update = () => {
        reading.frame = 0;
        // 舊頁面排進來的那一格：整頁已經換掉，新的那一份會自己接手，這裡什麼都不拆
        if (!root.isConnected) { if (reading.root === root) teardownReading(); return; }
        const line = top + stripH + Math.min(140, window.innerHeight * 0.22);
        let current = targets[0];
        for (const t of targets) {
          if (t.getBoundingClientRect().top <= line) current = t;
          else break;
        }
        const doc = document.documentElement;
        if (window.scrollY > 0 && window.innerHeight + window.scrollY >= doc.scrollHeight - 4) current = targets[targets.length - 1];
        reading.mark = current.dataset.cv2Mark;
        reading.group = current.dataset.cv2Group;
        (root.closest(".cv2-layout") || root).querySelectorAll("[data-cv2-jump]").forEach((b) => {
          const on = b.dataset.cv2Jump === (b.closest(".cv2-strip") ? reading.group : reading.mark);
          b.classList.toggle("is-on", on);
          if (on) b.setAttribute("aria-current", "location"); else b.removeAttribute("aria-current");
        });
        const box = root.getBoundingClientRect();
        const span = Math.max(1, box.height - window.innerHeight + line);
        root.style.setProperty("--cv2-read", `${Math.round(Math.min(1, Math.max(0, (line - box.top) / span)) * 1000) / 10}%`);
      };
      const schedule = () => { if (!reading.frame) reading.frame = window.requestAnimationFrame(update); };
      if (typeof IntersectionObserver === "function") {
        reading.io = new IntersectionObserver(schedule, { rootMargin: `-${top + stripH}px 0px -60% 0px`, threshold: [0, 1] });
        targets.forEach((t) => reading.io.observe(t));
      }
      reading.onScroll = schedule;
      window.addEventListener("scroll", schedule, { passive: true });
      update();
    }
    // 點位置條或目錄：捲到那一段（scroll-margin-top 讓標題停在位置條下面，不被蓋住）
    if (typeof document !== "undefined" && document.addEventListener) {
      document.addEventListener("click", (event) => {
        const button = event.target && event.target.closest ? event.target.closest("[data-cv2-jump]") : null;
        if (!button) return;
        const root = button.closest(".cv2-layout");
        const key = button.dataset.cv2Jump;
        const target = root && (root.querySelector(`[data-cv2-mark="${key}"]`) || root.querySelector(`[data-cv2-group="${key}"]`));
        if (!target) return;
        event.preventDefault();
        const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
      });
    }

    function renderLesson(records) {
      const m = meta[state.lessonId];
      if (!m || !m.available) return renderIndex(records);
      const data = lessonData(m.id);
      const entry = entryOf(records, m.id);
      const tier = tierOf(records, m);
      // 分節（lesson.sections）：畫面在 course_sections.js（data-lazy="sections"）；選了全文就照舊
      const secMode = data && data.sections && !secFail && (records.settings || {}).courseView !== "full";
      // 標題區要小：課號 · Stage、課名、閱讀／完成時間一行；先修一行、「學完你會」收成一行 —— 觀念①要在手機第一屏
      const head = `
        <header class="page-head cv2-head">
          <div>
            <p class="cv2-kicker"><button type="button" class="cv2-back" data-action="open-course"><span aria-hidden="true">‹</span>課程表</button><span class="cv2-sep" aria-hidden="true">/</span><span class="section-label">${m.no} · ${escapeHtml(m.stage.title)}${m.stage.branch ? "（支線）" : ""}</span></p>
            <h2>${escapeHtml(m.title)}</h2>
            <p class="cv2-meta"><span>閱讀 ${m.read} 分</span><span>完成 ${m.total} 分</span>${tierPill(tier)}</p>
          </div>
          ${data && data.sections ? `<div class="cv2-seg" role="group" aria-label="閱讀方式">${[["sec", "分節"], ["full", "全文"]].map(([k, n]) => `<button type="button" data-action="course-s-mode" data-mode="${k}" aria-pressed="${(k === "sec") === Boolean(secMode)}">${n}</button>`).join("")}</div>` : ""}
        </header>`;
      if (secMode) {
        if (window.BuzzCourseSections) return window.BuzzCourseSections.render(secApi(records, head));
        sec(render);
        return `<main class="screen lazy-loading" aria-busy="true"><div class="cv2-layout"><section class="course-lesson cv2-lesson">${head}</section></div></main>`;
      }
      if (!data) {
        if (stageState[m.stage.n] !== "failed") loadStage(m.stage.n);
        const failed = stageState[m.stage.n] === "failed";
        return `
          <main class="screen ${failed ? "" : "lazy-loading"}" aria-busy="${failed ? "false" : "true"}">
            <div class="cv2-layout"><section class="course-lesson cv2-lesson">${head}
              <p class="panel-note">${failed ? "課文載不進來 —— 檢查一下網路再試一次。" : "載入課文…"}</p>
              ${failed ? `<div class="action-row"><button class="button" data-action="course-retry">${icon("refresh")}再試一次</button></div>` : ""}
            </section></div>
          </main>`;
      }
      const prev = neighbour(m, -1);
      const next = neighbour(m, 1);
      const para = (text) => `<p>${rich(text, data)}</p>`;
      const tex = (list) => (list || []).map((line) => `<div class="math-block course-concept-math" data-tex="${escapeAttr(line)}"></div>`).join("");
      const mark = (key, group) => `data-cv2-mark="${key}" data-cv2-group="${group}"`;

      // 圖：after = 觀念段落的索引（預設 0，第一段之後）或 "examples"（範例區的最後）
      const Figures = window.BuzzCourseFigures;
      const figures = (data.figures || []).map((fig, k) => ({ fig, k, after: fig.after === undefined ? 0 : fig.after }));
      // 影片（每課最多一支）排在同一段的圖後面；這裡只放 16:9 佔位，預覽圖與播放由 course_video.js（data-lazy="video"）接手
      const v = data.video;
      const figuresAt = (slot) => figures.filter((f) => f.after === slot)
        .map(({ fig, k }) => Figures.renderFigure(fig, k, state.figs[k], escapeAttr, escapeHtml)).join("")
        + (v && v.after === slot ? `<figure class="cv2-figure cv2-video" data-cv2-video="${escapeAttr(v.id)}" data-duration="${v.duration}"><div class="cv2-video-box"></div><figcaption>${escapeHtml(v.caption)}</figcaption></figure>` : "");
      if (v) Promise.resolve().then(() => deps.ensureLazy("video")).then(() => window.BuzzCourseVideo.mount(document), () => document.querySelectorAll(".cv2-video").forEach((n) => n.classList.add("is-off")));
      const concept = data.concept.map((part, i) => {
        const body = `${part.body.map(para).join("")}${tex(part.tex)}${figuresAt(i)}`;
        if (!part.collapsible) return `<div class="cv2-part" ${mark(`c${i}`, "concept")}>${part.heading ? `<h3>${fmt(part.heading)}</h3>` : ""}${body}</div>`;
        return `
          <details class="cv2-fold" data-keep="cv2-${escapeAttr(m.id)}-${i}" ${mark(`c${i}`, "concept")}>
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
            <p class="cv2-example-title">範例 ${i + 1}${ex.title ? ` · <span>${fmt(ex.title)}</span>` : ""}</p>
            <p class="cv2-prompt">${rich(ex.prompt, data)}</p>
            ${shown ? `<ol class="course-steps">${steps}</ol>` : ""}
            ${shown < ex.steps.length
              ? `<button type="button" class="cv2-reveal" data-action="course-step" data-ex="${i}">${icon("chevron-down")}${shown ? "下一步" : "看第一步"}<small>${shown} / ${ex.steps.length}</small></button>`
              : `<p class="course-answer">${icon("check")}<span>答案：${fmt(ex.answer)}</span></p>${ex.note ? `<p class="cv2-note">${rich(ex.note, data)}</p>` : ""}`}
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

      // 位置條（手機）四格、目錄（桌機）逐節；兩者都只是捲到那裡，不改狀態
      const groups = [["concept", "觀念"], ...(examples ? [["worked", "範例"]] : []), ["checks", "小測"], ["practice", "練習"]];
      const strip = `
        <nav class="cv2-strip" aria-label="這一課的段落">
          ${groups.map(([key, name]) => `<button type="button" data-cv2-jump="${key}" class="${reading.group === key ? "is-on" : ""}">${name}</button>`).join("")}
          <i class="cv2-read" aria-hidden="true"></i>
        </nav>`;
      const tocItems = [
        ...data.concept.map((part, i) => [`c${i}`, part.heading ? fmt(part.heading) : `觀念 ${i + 1}`, part.collapsible ? "is-fold" : ""]),
        ...(examples ? [["worked", "範例", "is-group"]] : []),
        ["checks", "小測", "is-group"],
        ["practice", "練習", "is-group"]
      ];
      const toc = `
        <nav class="cv2-toc" aria-label="這一課的目錄">
          <p>${m.no} · 目錄</p>
          <ol>${tocItems.map(([key, text, cls]) => `<li><button type="button" data-cv2-jump="${key}" class="${cls} ${reading.mark === key ? "is-on" : ""}">${text}</button></li>`).join("")}</ol>
        </nav>`;
      if (typeof queueMicrotask === "function") queueMicrotask(setupReading);
      else window.setTimeout(setupReading, 0);

      return `
        <main class="screen">
          <div class="cv2-layout">
            ${toc}
            <section class="course-lesson cv2-lesson" data-cv2-reading>
              ${head}
              <div class="cv2-intro">
                ${data.prerequisites.length ? `<p class="cv2-prereq"><span>先修</span>${data.prerequisites.map(lessonLink).join("")}<button type="button" class="cv2-link cv2-maplink" data-action="course-map-focus" data-lesson-id="${escapeAttr(m.id)}">在地圖上看</button></p>` : ""}
                ${data.objectives.length ? `
                <details class="cv2-goals" data-keep="cv2-goals-${escapeAttr(m.id)}">
                  <summary>${icon("chevron-right")}學完你會<small>${data.objectives.length} 項</small></summary>
                  <ul class="cv2-list">${data.objectives.map((line) => `<li>${rich(line, data)}</li>`).join("")}</ul>
                </details>` : ""}
              </div>
              ${strip}

              <section class="course-block cv2-sec" data-course-concept aria-label="觀念">
                ${concept}
              </section>

              ${examples ? `
              <section class="course-block cv2-sec" data-course-worked ${mark("worked", "worked")}>
                <h3 class="cv2-sec-title">範例<small>一步一步揭</small></h3>
                ${examples}
                ${figuresAt("examples")}
              </section>` : ""}

              ${data.pitfalls.length ? `
              <section class="course-block cv2-sec" data-course-pitfalls>
                <h3 class="cv2-sec-title">常見錯誤</h3>
                <ul class="cv2-list">${data.pitfalls.map((line) => `<li>${rich(line, data)}</li>`).join("")}</ul>
              </section>` : ""}

              <section class="course-block cv2-sec" data-course-checks ${mark("checks", "checks")}>
                <h3 class="cv2-sec-title">小測${entry.quizBest !== undefined ? `<small>最好 ${entry.quizBest} / ${data.checks.length}</small>` : ""}</h3>
                ${checks}
                ${quizResult}
              </section>

              <section class="course-block cv2-sec" data-course-practice ${mark("practice", "practice")}>
                <h3 class="cv2-sec-title">推薦題</h3>
                <ol class="cv2-tiers">${tiers.map(([name, rule], i) => `<li class="${tier > i ? "is-on" : ""}"><strong>${tier > i ? "✔ " : ""}${name}</strong><span>${rule}</span></li>`).join("")}</ol>
                ${mainItems.length ? `
                  <ul class="cv2-practice">${mainItems.map(practiceRow).join("")}</ul>
                  <div class="action-row"><button class="button home-primary" data-action="course-practice" data-set="main">${icon("play")}練推薦題 · ${mainItems.length} 題</button></div>` : ""}
                ${challengeItems.length ? `
                  <h4 class="cv2-subhead section-label">挑戰</h4>
                  <ul class="cv2-practice">${challengeItems.map(practiceRow).join("")}</ul>
                  <div class="action-row"><button class="button secondary" data-action="course-practice" data-set="challenge">${icon("zap")}挑戰 · ${challengeItems.length} 題</button></div>` : ""}
                ${items.length ? "" : `<p class="panel-note">這一課沒有推薦題；小測完成就是全破。</p>`}
              </section>

              <nav class="cv2-nav" aria-label="上一課與下一課">
                ${prev ? `<button class="button ghost" data-action="open-course-lesson" data-lesson-id="${escapeAttr(prev.id)}">上一課 ${escapeHtml(prev.no)}</button>` : "<span></span>"}
                ${next ? `<button class="button ${tier ? "home-primary" : "secondary"}" data-action="open-course-lesson" data-lesson-id="${escapeAttr(next.id)}">下一課：${escapeHtml(label(next))}${icon("chevron-right")}</button>` : ""}
              </nav>
            </section>
          </div>
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
      if (action === "course-view") {
        indexView = data.mode === "map" ? "map" : "list";
        return render();
      }
      if (action === "course-map-focus") {
        indexView = "map";
        mapFocus = meta[id] ? id : "";
        mapLit = data.lit ? mapFocus : "";
        return go("course");
      }
      if (action === "open-course-lesson") {
        const m = meta[id];
        if (!m || !m.available) return go("course");
        update(id, (entry) => ({ ...entry, openedAt: entry.openedAt || new Date().toISOString() }));
        state = { lessonId: id, steps: {}, picks: {}, figs: {}, recorded: false };
        reading.group = "concept";
        reading.mark = "c0";
        if (!lessonData(id)) loadStage(m.stage.n);
        return go("course-lesson");
      }
      if (action === "course-retry") {
        const m = meta[state.lessonId];
        if (m) { delete stageState[m.stage.n]; loadStage(m.stage.n); }
        return render();
      }
      if (/^course-s-/.test(action)) return sec(() => window.BuzzCourseSections.act(secApi(loadRecords()), action, data));
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
        update(state.lessonId, (e) => ({ ...e, picks: {} }));
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
