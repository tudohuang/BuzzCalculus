// ── 新版課程畫面的樣式（課程表、單課、地圖外框、層級點）──
// 從 src/course_v2_ui.js 搬出來（2026-10-13）：課程組（大綱＋畫面）撞到 140KB 預算，而樣式是整段可以分開的東西。
// index.html 上是 data-lazy="coursestyle"；course.js 打開課程時跟 "course" 一起抓，course_v2_ui.js 的 injectStyle 讀 window.BUZZ_COURSE_V2_STYLE。
window.BUZZ_COURSE_V2_STYLE = `
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
.cv2-boss { display: flex; align-items: center; gap: 6px; width: 100%; min-height: 40px; margin: 0 0 2px; padding: 4px 8px; border: 0; border-radius: 8px; background: color-mix(in srgb, var(--violet) 7%, transparent); color: var(--ink); font: inherit; font-size: 0.86rem; text-align: left; cursor: pointer; }
.cv2-boss svg { flex: none; width: 16px; height: 16px; color: var(--violet); }
.cv2-boss span { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.cv2-boss small { flex: none; color: var(--violet); font-weight: 700; font-variant-numeric: tabular-nums; }
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
/* 剛離開的那一課：回課程表時亮一下（捲回原處之後，眼睛知道剛才在哪） */
.cv2-row.is-left { background: color-mix(in srgb, var(--blue) 12%, transparent); box-shadow: inset 3px 0 0 var(--blue); }
/* 層級點的圖例（課程表一行）與單課標題下的「各差多少」 */
.cv2-legend { display: flex; flex-wrap: wrap; gap: 2px 14px; margin: -8px 0 0; color: var(--muted); font-size: 0.78rem; }
.cv2-legend span { display: inline-flex; align-items: center; gap: 6px; }
.cv2-legend .cv2-dot { display: inline-block; flex: none; }
.cv2-rule { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 0; margin: 6px 0 0; color: var(--muted); font-size: 0.8rem; font-variant-numeric: tabular-nums; }
.cv2-rule span + span::before { content: "·"; margin: 0 8px; color: var(--line-strong); }
.cv2-meta > .cv2-rule { display: inline-flex; margin: 0; font-size: inherit; }
.cv2-rule b { color: var(--ink); font-weight: 700; }
.cv2-tier { padding: 2px 8px; border-radius: 999px; font-size: 0.74rem; font-style: normal; font-weight: 700; white-space: nowrap; background: color-mix(in srgb, var(--green) 12%, var(--panel)); color: var(--green); }
.cv2-tier.t2 { background: color-mix(in srgb, var(--blue) 12%, var(--panel)); color: var(--blue); }
.cv2-tier.t3 { background: color-mix(in srgb, var(--gold) 18%, var(--panel)); color: var(--gold-dark); }
/* 清單／地圖切換：跟進度條同一列（地圖的樣式在 course_map.js，打開地圖才載） */
.cv2-viewbar { display: flex; align-items: center; gap: 14px; }
.cv2-viewbar .course-progress { flex: 1; min-width: 0; margin: 0; }
.cv2-seg { display: inline-flex; flex: none; padding: 3px; border-radius: 999px; background: color-mix(in srgb, var(--ink) 7%, transparent); }
.cv2-seg button { min-width: 52px; min-height: 40px; padding: 0 14px; border: 0; border-radius: 999px; background: none; color: var(--muted); font: inherit; font-size: 0.86rem; font-weight: 700; cursor: pointer; }
.cv2-seg button[aria-pressed="true"] { background: var(--panel); color: var(--ink); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12); }
.cv2-map { width: 100%; min-height: 360px; }
.cv2-viewbar .cmap-lit { display: block; color: var(--muted); font-size: 0.9rem; font-variant-numeric: tabular-nums; }
.cv2-viewbar .cmap-lit strong { color: var(--ink); font-size: 1.2rem; }
.cv2-goal { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 10px; margin: 8px 0 0; color: var(--muted); font-size: 0.86rem; font-variant-numeric: tabular-nums; }
.cv2-goal b { color: var(--violet); }
.cv2-goal .button { min-height: 40px; margin-left: auto; }
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
/* 分節模式的頁首：課名下面一列裝下時間、層級、先修（收起）、分節／全文 —— 手機上第一句在第一屏的上半 */
.cv2-lesson .cv2-head.is-compact { display: block; margin: 0; }
.cv2-titlerow { display: flex; align-items: center; gap: 6px; }
.cv2-titlerow .cv2-back { justify-content: center; width: 40px; height: 40px; margin: 0 0 0 -10px; padding: 0; font-size: 1.5rem; }
.cv2-lesson .cv2-head.is-compact h2 { flex: 1; min-width: 0; font-size: 1.15rem; line-height: 1.3; }
.cv2-head.is-compact .cv2-seg button { min-width: 48px; padding: 0 12px; }
.cv2-head.is-compact .cv2-meta { margin: 0; gap: 0 10px; font-size: 0.8rem; }
.cv2-head.is-compact .cv2-meta .section-label { margin: 0; font-size: inherit; }
.cv2-head.is-compact .cv2-meta > * + *::before { content: "·"; margin-right: 10px; color: var(--line-strong); }
.cv2-head.is-compact .cv2-meta > .cv2-tier::before, .cv2-head.is-compact .cv2-meta > .cv2-pre::before { content: none; }
.cv2-pre > summary { display: inline-flex; align-items: center; gap: 2px; margin: -9px 0; padding: 9px 2px; color: var(--blue); font-weight: 700; cursor: pointer; list-style: none; }
.cv2-pre > summary::-webkit-details-marker { display: none; }
.cv2-pre > summary svg { width: 14px; height: 14px; transition: transform 0.15s ease; }
.cv2-pre[open] > summary svg { transform: rotate(180deg); }
.cv2-pre[open] { order: 9; flex-basis: 100%; }
.cv2-pre .cv2-prereq { padding: 0 0 6px; }
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
.cv2-figure figcaption { color: var(--muted); font-size: 0.86rem; line-height: 1.6; text-align: center; }
.cv2-readout { margin: 0; color: var(--ink); font-size: 0.86rem; font-variant-numeric: tabular-nums; text-align: center; overflow-wrap: anywhere; }
.cv2-slider { display: flex; align-items: center; gap: 10px; width: 100%; }
.cv2-slider span { flex: none; color: var(--muted); font-size: 0.82rem; font-weight: 700; }
.cv2-slider input { flex: 1; min-width: 0; height: 40px; margin: 0; accent-color: var(--blue); touch-action: pan-y; }

@media (min-width: 768px) {
  .cv2-lesson { font-size: 1.0625rem; }
  .cv2-lesson .cv2-head h2 { font-size: 2rem; }
  .cv2-lesson .cv2-head.is-compact h2 { font-size: 1.6rem; }
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
