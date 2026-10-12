// ── 章首魔王題的畫面（bosses.json → outline.bosses）──
// 章的第一課開頭一張卡（題目、鉤子、「這章學完你就會 · 還差 n 課」、先試試看）；每一課讀完「離魔王題還差 n 課」；
// payoff 那一課讀完「現在解得開了」；解完的結算（解開之後那一行、XP）。
// 數字（還差幾課、解開了沒）由 course_v2_ui.js 算好放進 ctx，這裡只畫。index.html 的 data-lazy="boss"：
// 打開有魔王題那一章的課才抓（課程表那一行很短，留在 course_v2_ui.js，不為它多抓這一支）。
// 不鎖課、不倒數：先試試看答錯不進錯題本（app.js 把 boss-try: 的局當成診斷，跟定位測驗一樣）。
(function () {
  "use strict";

  const STYLE = `
.cvb-card { margin: 4px 0 20px; padding: 14px 16px 12px; border: 1px solid color-mix(in srgb, var(--violet) 32%, var(--line)); border-radius: 12px; background: color-mix(in srgb, var(--violet) 6%, var(--paper)); }
.cvb-kicker { display: flex; align-items: center; gap: 6px; margin: 0 0 6px; color: var(--violet); font-size: 0.8rem; font-weight: 800; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; }
.cvb-kicker svg { width: 16px; height: 16px; }
.cvb-problem { margin: 0 0 6px; overflow-x: auto; overflow-y: hidden; }
.cvb-problem .katex-display { margin: 0.3em 0; }
.cvb-hook { margin: 0; font-weight: 700; line-height: 1.6; overflow-wrap: anywhere; }
.cvb-note { margin: 4px 0 0; color: var(--ink); font-size: 0.92rem; line-height: 1.7; overflow-wrap: anywhere; }
.cvb-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; margin: 10px 0 0; color: var(--ink); font-size: 0.86rem; font-variant-numeric: tabular-nums; }
.cvb-meta b { color: var(--violet); }
.cvb-meta .button { min-height: 40px; margin-left: auto; }
.cvb-left { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; margin: 0 0 16px; color: var(--muted); font-size: 0.9rem; font-variant-numeric: tabular-nums; }
.cvb-left svg { width: 16px; height: 16px; color: var(--violet); }
.cvb-left strong { color: var(--violet); font-size: 1.15rem; }
.cvb-card.is-pay { margin: 0 0 18px; }
.cvb-card.is-pay .cvb-meta .button { margin-left: 0; }
`;

  // 樣式節點的 id 不能跟黑板（course_board.js 的 cvb-style）撞名：撞了的話先載的那一支會讓另一支以為樣式已經在、整個沒樣式
  function injectStyle() {
    if (typeof document === "undefined" || !document.head || document.getElementById("cvboss-style")) return;
    const node = document.createElement("style");
    node.id = "cvboss-style";
    node.textContent = STYLE;
    document.head.appendChild(node);
  }

  const math = (c) => `<div class="math-block cvb-problem" data-tex="${c.deps.escapeAttr(c.p.prompt)}"></div>`;
  // early：payoff 還沒讀到 —— 這一局是「先試試看」（boss-try:，答錯不進錯題本）
  const solveButton = (c, primary, text, early) => `<button type="button" class="button ${primary ? "home-primary" : "secondary"}" data-action="course-boss" data-code="${c.deps.escapeAttr(c.B.code)}"${early ? ` data-try="1"` : ""}>${text}</button>`;

  // 章的第一課：題目、鉤子、還差幾課（解開了：解開之後那一行）
  function card(c) {
    injectStyle();
    const { escapeHtml, icon } = c.deps;
    const meta = c.solved
      ? `<span>已解開</span>`
      : c.left
        ? `<span>這章學完你就會 · 還差 <b>${c.left}</b> 課</span>${solveButton(c, false, "先試試看", true)}`
        : `<span>現在解得開了</span>${solveButton(c, true, "解魔王題")}`;
    return `
      <aside class="cvb-card" data-cvb-card="${c.deps.escapeAttr(c.B.code)}" aria-label="這一章的魔王題">
        <p class="cvb-kicker">${icon("trophy")}魔王題</p>
        ${math(c)}
        <p class="cvb-hook">${escapeHtml(c.B.h)}</p>
        ${c.solved && c.B.n ? `<p class="cvb-note">${escapeHtml(c.B.n)}</p>` : ""}
        <p class="cvb-meta">${meta}</p>
      </aside>`;
  }

  // 讀完一課：還差幾課（目標漸近），或「現在解得開了」＋主按鈕（結算畫面的「下一課」降成次要，見 course_finish.js）
  function finish(c) {
    injectStyle();
    const { icon } = c.deps;
    if (c.solved) return "";
    if (c.pay) {
      return `
        <aside class="cvb-card is-pay" data-cvb-pay="${c.deps.escapeAttr(c.B.code)}">
          <p class="cvb-kicker">${icon("trophy")}魔王題 · 現在解得開了</p>
          ${math(c)}
          <p class="cvb-meta">${solveButton(c, true, "解魔王題")}</p>
        </aside>`;
    }
    return `<p class="cvb-left" data-cvb-left="${c.after}">${icon("trophy")}<span>離魔王題還差</span><strong>${c.after}</strong><span>課</span></p>`;
  }

  // 魔王題那一局的結算：解開了 → 解開之後那一行（這一章的哪個想法破了它）＋ XP（專注模式不秀）；沒解開 → 回去讀／再試一次
  function results(c) {
    injectStyle();
    const { escapeHtml, escapeAttr, icon } = c.deps;
    const open = (m, text, cls) => `<button class="button ${cls}" data-action="open-course-lesson" data-lesson-id="${escapeAttr(m.id)}">${text}</button>`;
    if (c.solved) {
      return `
        <aside class="cvb-card" data-cvb-solved="${escapeAttr(c.B.code)}">
          <p class="cvb-kicker">${icon("trophy")}魔王題解開了${c.bonus && !c.quiet ? ` · +${c.bonus} XP` : ""}</p>
          <p class="cvb-hook">${escapeHtml(c.B.h)}</p>
          ${c.B.n ? `<p class="cvb-note">${escapeHtml(c.B.n)}</p>` : ""}
        </aside>
        <div class="action-row">
          ${c.next ? open(c.next, `下一課：${escapeHtml(c.label(c.next))}${icon("chevron-right")}`, "home-primary") : `<button class="button home-primary" data-action="open-course">課程表</button>`}
          <button class="button secondary" data-action="course-map-focus" data-lesson-id="${escapeAttr(c.payoff.id)}" data-lit="1">在地圖上看</button>
        </div>`;
    }
    return `
      <p class="cvb-left" data-cvb-unsolved="${escapeAttr(c.B.code)}">${icon("trophy")}<span>還沒解開${c.early ? ` · 讀到〈${escapeHtml(c.payoff.title)}〉就解得開` : ""}</span></p>
      <div class="action-row">
        ${open(c.back, c.early ? `回到 ${escapeHtml(c.label(c.back))}` : `再看一次〈${escapeHtml(c.payoff.title)}〉`, "home-primary")}
        ${solveButton(c, false, "再試一次", c.early)}
      </div>`;
  }

  // 單課：k 是 course_v2_ui.js 給的工具（bossBy、還差幾課、課的索引…）。card() 只在章的第一課有東西，第一次畫出來記一次 course_boss_view；
  // finish 是讀完的那一段（pay = 現在解得開了：結算畫面的主按鈕讓給解題）
  function view(k, records, m, state) {
    const B = m.chapter.boss;
    const p = k.problem(B.p);
    if (!p) return null;
    const solved = k.bossSolved(records, B.code);
    const after = k.bossLeft(records, B, m);
    const c = { B, p, deps: k.deps, solved, left: k.bossLeft(records, B), after, pay: !solved && !after };
    return {
      card: () => {
        if (B.rows[0] !== m) return "";
        if (state.bossSeen !== m.id) { state.bossSeen = m.id; k.track("course_boss_view", { chapter: B.code }); }
        return card(c);
      },
      finish: { html: finish(c), pay: c.pay }
    };
  }

  // 魔王題那一局的結算頁（courseLessonId = boss:<章> 或 boss-try:<章>）
  function resultsFor(k, id) {
    const hit = /^boss(-try)?:(.+)$/.exec(id);
    const B = hit && k.bossBy[hit[2]];
    if (!B) return "";
    const records = k.loadRecords();
    const payoff = k.meta[B.at];
    const run = k.deps.bossRun ? k.deps.bossRun() : null;
    return results({
      B, deps: k.deps, label: k.label, payoff, early: Boolean(hit[1]), solved: k.bossSolved(records, B.code),
      bonus: run && run.code === B.code ? run.bonus : 0, quiet: k.deps.focusModeOn ? k.deps.focusModeOn() : false,
      next: k.neighbour(payoff, 1), back: B.rows.find((x) => !k.isDone(records, x)) || payoff
    });
  }

  window.BuzzCourseBoss = { view, results: resultsFor };
})();
